import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import { ProjectCard } from './ProjectCard';
import projects from '../data/projects';

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_VEL     = 0.00018;  // project-index units / ms at cruising speed

// Road geometry, in px. Right-hand traffic: eastbound in the bottom lane.
const ROAD_H       = 88;
const LANE_BOTTOM  = 0.72 * ROAD_H;
const LANE_TOP     = 0.24 * ROAD_H;
const LANE_MID     = (LANE_BOTTOM + LANE_TOP) / 2;
const TURN_R       = (LANE_BOTTOM - LANE_TOP) / 2;  // U-turn radius, lane to lane
const CAR_W        = 72;       // car element size (SVG is drawn at half scale)
const CAR_H        = 30;
const END_MARGIN   = TURN_R + CAR_H / 2 + 8;        // room for the U-turn at each end

// Driving, in px and seconds.
const MIN_CRUISE   = 30;
const MAX_CRUISE   = 150;
const TURN_SPEED   = 40;       // top speed through a U-turn
const ACCEL        = 90;
const BRAKE        = 140;
const SPEED_GAIN   = 2.5;      // how quickly the driver closes on the speed they want
const SIGNAL_BEFORE = 80;      // indicator comes on this far before a U-turn
// Dragging or clicking the road moves the car much faster than it drives, so
// the carousel keeps up with the pointer, but still with smooth starts and stops.
const FOLLOW_MAX_V = 1600;
const FOLLOW_ACCEL = 5000;

/**
 * The car drives a stadium-shaped loop: the bottom lane left→right, a U-turn
 * around the right end, the top lane right→left, and a U-turn around the left
 * end. `s` is the distance driven around it; segments 0 and 2 are the straights,
 * 1 and 3 the half-circle turns.
 */
interface Track { w: number; x0: number; x1: number; ls: number; la: number; total: number }

function makeTrack(roadW: number): Track {
  const x0 = END_MARGIN;
  const x1 = Math.max(x0 + 1, roadW - END_MARGIN);
  const ls = x1 - x0;
  const la = Math.PI * TURN_R;
  return { w: roadW, x0, x1, ls, la, total: 2 * ls + 2 * la };
}

const segStart = (t: Track, seg: number) => [0, t.ls, t.ls + t.la, 2 * t.ls + t.la][seg];

function pose(t: Track, s: number) {
  const u = ((s % t.total) + t.total) % t.total;
  if (u < t.ls) {
    return { seg: 0, into: u, x: t.x0 + u, y: LANE_BOTTOM, heading: 0 };
  }
  if (u < t.ls + t.la) {
    const into = u - t.ls, a = into / TURN_R;
    return { seg: 1, into, x: t.x1 + TURN_R * Math.sin(a), y: LANE_MID + TURN_R * Math.cos(a), heading: (-a * 180) / Math.PI };
  }
  if (u < 2 * t.ls + t.la) {
    const into = u - t.ls - t.la;
    return { seg: 2, into, x: t.x1 - into, y: LANE_TOP, heading: -180 };
  }
  const into = u - 2 * t.ls - t.la, a = into / TURN_R;
  return { seg: 3, into, x: t.x0 - TURN_R * Math.sin(a), y: LANE_MID - TURN_R * Math.cos(a), heading: -180 - (a * 180) / Math.PI };
}

/**
 * Acceleration while the car drives itself: cruise, brake steadily so it
 * reaches each U-turn at turning speed, and pull up promptly when paused.
 */
function autoAccel(t: Track, s: number, v: number, cruise: number, turnSpeed: number, paused: boolean) {
  if (paused) {
    const decel = Math.min(BRAKE * 0.7, Math.max(Math.abs(v) * 6, 20));
    return -Math.sign(v) * decel;
  }
  const p = pose(t, s);
  const inTurn = p.seg % 2 === 1;
  let a = Math.max(-BRAKE, Math.min(ACCEL, ((inTurn ? turnSpeed : cruise) - v) * SPEED_GAIN));
  if (!inTurn && v > turnSpeed) {
    const need = (v * v - turnSpeed * turnSpeed) / (2 * Math.max(t.ls - p.into, 0.5));
    if (need > BRAKE * 0.35) a = Math.min(a, -need);
  }
  return a;
}

/** Acceleration toward a dragged/clicked spot: speed up, then brake to stop on it. */
function followAccel(target: number, s: number, v: number) {
  const d = target - s;
  const dist = Math.abs(d);
  const dir = Math.sign(d);
  if (dist < 1e-3) return -v * 30;
  // Once stopping takes real braking, brake exactly hard enough to stop on the spot.
  const closing = v * dir;
  if (closing > 0) {
    const stopDecel = (closing * closing) / (2 * dist);
    if (stopDecel >= FOLLOW_ACCEL * 0.6) return -dir * Math.min(stopDecel, FOLLOW_ACCEL * 1.5);
  }
  const vDes = dir * Math.min(FOLLOW_MAX_V, Math.sqrt(2 * FOLLOW_ACCEL * 0.6 * dist));
  return Math.max(-FOLLOW_ACCEL, Math.min(FOLLOW_ACCEL, (vDes - v) * 20));
}

/** Advance the car one small step; a braking car stops rather than reversing. */
function integrate(s: number, v: number, a: number, h: number, stopAtZero: boolean) {
  let v1 = v + a * h;
  if (stopAtZero && v !== 0 && Math.sign(v1) !== Math.sign(v)) v1 = 0;
  return { s: s + ((v + v1) / 2) * h, v: v1 };
}

/**
 * Loop distance for road position x on the straight the car is on (or the one
 * it's turning onto), so dragging moves it along its lane, reversing if needed.
 */
function targetFor(t: Track, s: number, x: number) {
  const { seg } = pose(t, s);
  const lap = s - (((s % t.total) + t.total) % t.total);
  const cx = Math.max(t.x0, Math.min(t.x1, x));
  if (seg === 0) return lap + (cx - t.x0);
  if (seg === 3) return lap + t.total + (cx - t.x0);
  return lap + t.ls + t.la + (t.x1 - cx);
}

// ─── Car SVG (front = right side of SVG) ─────────────────────────────────────
// viewBox 144×60, element 72×30 → scale 0.5 — matches road lane geometry.
// Tyre centres sit exactly on the body top/bottom edges (y=14 and y=46).
// The body path is drawn AFTER the tyres, so it hides the inboard tyre halves,
// leaving only a natural tyre-arc visible at each corner.
function CarSVG() {
  const tyres: [number, number][] = [
    [92, 10], [92, 50],   // front pair
    [52,  10], [52,  50],   // rear pair
  ];

  return (
    <svg
      width="72" height="30" viewBox="0 0 144 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Car body paint — modern metallic white/silver gradient */}
        <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e5e9f0" />
          <stop offset="30%"  stopColor="#ffffff" />
          <stop offset="70%"  stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d8dee9" />
        </linearGradient>

        {/* Glossy dark glass for the cockpit canopy */}
        <linearGradient id="car-canopy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#2b303c" />
          <stop offset="50%"  stopColor="#1a1c23" />
          <stop offset="100%" stopColor="#0d0e12" />
        </linearGradient>

        {/* Tire rubber gradient */}
        <radialGradient id="car-tyre" cx="40%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#4c566a" />
          <stop offset="60%"  stopColor="#2e3440" />
          <stop offset="100%" stopColor="#1a1c23" />
        </radialGradient>

        {/* Silver alloy rim gradient */}
        <linearGradient id="rim-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#e5e9f0" />
          <stop offset="50%"  stopColor="#8892b0" />
          <stop offset="100%" stopColor="#4c566a" />
        </linearGradient>

        {/* Headlight cyan xenon glow */}
        <radialGradient id="cyan-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#e0f7ff" stopOpacity="1" />
          <stop offset="40%"  stopColor="#80e0ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00bfff" stopOpacity="0" />
        </radialGradient>

        {/* Light glows switched on by the animation loop (see CSS variables below) */}
        <radialGradient id="brake-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ff6b6b" stopOpacity="1" />
          <stop offset="45%"  stopColor="#ff2a2a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="reverse-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="amber-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff1c2" stopOpacity="1" />
          <stop offset="40%"  stopColor="#ffb020" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff9500" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Tyres & Wheels (drawn first so body overlaps the inside halves) ── */}
      {tyres.map(([cx, cy], i) => {
        return (
          <g key={i}>
            {/* Brake disc (dark metal sliver behind spokes) */}
            <ellipse cx={cx} cy={cy} rx={9} ry={5} fill="#4c566a" opacity="0.6" />
            
            {/* Tyre tread */}
            <ellipse cx={cx} cy={cy} rx={15} ry={8.5} fill="url(#car-tyre)" />
            
            {/* Rim outer lip */}
            <ellipse cx={cx} cy={cy} rx={8.5} ry={4.8} fill="url(#rim-gradient)" stroke="#1a1c23" strokeWidth="0.5" />
            
            {/* Multi-spoke alloy pattern */}
            <g opacity="0.85">
              {/* Spoke 1 (vertical) */}
              <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} stroke="#ffffff" strokeWidth="0.8" />
              {/* Spoke 2 & 3 (angled) */}
              <line x1={cx - 7} y1={cy - 2} x2={cx + 7} y2={cy + 2} stroke="#ffffff" strokeWidth="0.8" />
              <line x1={cx - 7} y1={cy + 2} x2={cx + 7} y2={cy - 2} stroke="#ffffff" strokeWidth="0.8" />
            </g>

            {/* Hub cap (center lock) */}
            <ellipse cx={cx} cy={cy} rx={2} ry={1} fill="#d8dee9" />
            <circle cx={cx} cy={cy} r={0.5} fill="#2e3440" />
          </g>
        );
      })}

      {/* ── Bumper bottom lip/shadow ── */}
      <path
        d="M 24,51 L 80,51 Q 96,51 108,44 L 115,31 Q 116,30 115,29 L 108,16 Q 96,9 80,9 L 24,9 Z"
        fill="#1a1c23"
        opacity="0.3"
      />

      {/* ── Main Body Shell (sleek, aerodynamic sports car) ── */}
      <path
        d="M 38,10
           L 80,10
           C 96,10 108,12 114,22
           Q 118,28 118,30
           Q 118,32 114,38
           C 108,48 96,50 80,50
           L 38,50
           Q 28,50 26,42
           L 26,18
           Q 28,10 38,10 Z"
        fill="url(#car-body)"
        stroke="#8892b0"
        strokeWidth="1"
      />

      {/* ── Panel Lines (doors, hood, trunk) ── */}
      {/* Front Hood outline */}
      <path d="M 86,10 Q 90,22 90,30 Q 90,38 86,50" fill="none" stroke="#d8dee9" strokeWidth="0.8" />
      {/* Hood crease lines (sporty aerodynamic ridges) */}
      <path d="M 88,15 C 98,16 104,18 108,19" fill="none" stroke="#d8dee9" strokeWidth="0.6" />
      <path d="M 88,45 C 98,44 104,42 108,41" fill="none" stroke="#d8dee9" strokeWidth="0.6" />
      {/* Door lines (cockpit edges) */}
      <line x1="64" y1="10" x2="64" y2="15" stroke="#d8dee9" strokeWidth="0.8" />
      <line x1="64" y1="45" x2="64" y2="50" stroke="#d8dee9" strokeWidth="0.8" />
      {/* Rear Trunk line */}
      <path d="M 36,10 L 36,50" fill="none" stroke="#d8dee9" strokeWidth="0.8" strokeDasharray="1 1" />
      {/* Sport spoiler outline at the back */}
      <path d="M 27,16 C 32,18 32,42 27,44" fill="none" stroke="#b8c2d0" strokeWidth="1" />

      {/* ── Glass Canopy (blacked-out cockpit) ── */}
      <path
        d="M 46,15
           L 78,15
           C 86,15 92,18 96,30
           C 92,42 86,45 78,45
           L 46,45
           C 38,45 34,42 32,30
           C 34,18 38,15 46,15 Z"
        fill="url(#car-canopy)"
      />

      {/* ── Painted Roof (matches body paint, layered over glass to frame windows) ── */}
      <path
        d="M 52,17
           L 74,17
           Q 80,17 82,23
           L 83,30
           L 82,37
           Q 80,43 74,43
           L 52,43
           Q 46,43 44,37
           L 43,30
           L 44,23
           Q 46,17 52,17 Z"
        fill="url(#car-body)"
        stroke="#8892b0"
        strokeWidth="0.5"
      />

      {/* Windshield glare highlight (glass sheen) */}
      <path
        d="M 76,18 L 86,22 L 84,38 L 75,32 Z"
        fill="#ffffff"
        fillOpacity="0.15"
      />
      {/* Rear glass glare highlight */}
      <path
        d="M 35,22 L 41,24 L 39,36 L 34,34 Z"
        fill="#ffffff"
        fillOpacity="0.1"
      />

      {/* ── Side Mirrors ── */}
      {/* Top mirror */}
      <path d="M 90,10 C 90,4 96,3 98,4 L 96,10 Z" fill="#2e3440" />
      <path d="M 95,5 L 97,5" stroke="#ffffff" strokeWidth="0.5" opacity="0.7" />
      {/* Bottom mirror */}
      <path d="M 90,50 C 90,56 96,57 98,56 L 96,50 Z" fill="#2e3440" />
      <path d="M 95,55 L 97,55" stroke="#ffffff" strokeWidth="0.5" opacity="0.7" />

      {/* ── Xenon LED Headlights (Modern electric look) ── */}
      <g>
        {/* Top headlight strip */}
        <path d="M 112,14 C 114,15 116,17 117,19 C 114,18 111,17 112,14 Z" fill="#e0f7ff" />
        <ellipse cx="114" cy="16" rx="3" ry="1.5" fill="url(#cyan-glow)" />
        {/* Bottom headlight strip */}
        <path d="M 112,46 C 114,45 116,43 117,41 C 114,42 111,43 112,46 Z" fill="#e0f7ff" />
        <ellipse cx="114" cy="44" rx="3" ry="1.5" fill="url(#cyan-glow)" />
      </g>

      {/* ── Rear Light Bar (Porsche style tail-light strip) ── */}
      <g>
        {/* Main connecting bar */}
        <line x1="26.5" y1="20" x2="26.5" y2="40" stroke="#ff2a2a" strokeWidth="1" opacity="0.85" />
        {/* Outer tail lights */}
        <path d="M 26,14 L 29,14 L 29,19 L 26,18 Z" fill="#ff1a1a" />
        <path d="M 26,46 L 29,46 L 29,41 L 26,42 Z" fill="#ff1a1a" />
      </g>

      {/* ── Front Grill & Intake details ── */}
      <path d="M 117,26 Q 118,30 117,34" fill="none" stroke="#2e3440" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Lights driven by the animation loop through CSS variables ── */}
      {/* Brake lights */}
      <g style={{ opacity: 'var(--brake, 0)' }}>
        <ellipse cx="27" cy="16.5" rx="7" ry="5" fill="url(#brake-glow)" />
        <ellipse cx="27" cy="43.5" rx="7" ry="5" fill="url(#brake-glow)" />
        <line x1="26.5" y1="20" x2="26.5" y2="40" stroke="#ff6b6b" strokeWidth="1.4" />
      </g>
      {/* Reversing lights */}
      <g style={{ opacity: 'var(--reverse, 0)' }}>
        <ellipse cx="20" cy="30" rx="9" ry="12" fill="url(#reverse-glow)" />
        <rect x="25.6" y="21" width="2.6" height="3.2" rx="0.6" fill="#ffffff" />
        <rect x="25.6" y="35.8" width="2.6" height="3.2" rx="0.6" fill="#ffffff" />
      </g>
      {/* Left indicators (both U-turns are to the left) */}
      <g style={{ opacity: 'var(--blink, 0)' }}>
        <ellipse cx="110" cy="12" rx="4.5" ry="2.8" fill="url(#amber-glow)" />
        <ellipse cx="31" cy="11.5" rx="4.5" ry="2.8" fill="url(#amber-glow)" />
      </g>
    </svg>
  );
}

// ─── Road Slider ──────────────────────────────────────────────────────────────
// The car is positioned by the parent's animation loop writing straight to
// carRef's style, so the slider never re-renders while it animates.
interface RoadSliderProps {
  roadRef:     RefObject<HTMLDivElement | null>;
  carRef:      RefObject<HTMLDivElement | null>;
  getProgress: () => number;
  onPointer:   (roadX: number) => void;     // pointer x inside the road, px
  onSeek:      (progress: number) => void;  // keyboard seek, 0–1
  onDragStart: () => void;
  onDragEnd:   () => void;
}

function RoadSlider({
  roadRef, carRef, getProgress,
  onPointer, onSeek, onDragStart, onDragEnd,
}: RoadSliderProps) {
  const isDragging   = useRef(false);
  const onPointerRef = useRef(onPointer);
  const onDragEndRef = useRef(onDragEnd);
  useEffect(() => { onPointerRef.current = onPointer; }, [onPointer]);
  useEffect(() => { onDragEndRef.current = onDragEnd; }, [onDragEnd]);

  const roadX = useCallback((clientX: number) => {
    const r = roadRef.current;
    return r ? clientX - r.getBoundingClientRect().left : 0;
  }, [roadRef]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      onPointerRef.current(roadX(x));
    };
    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      onDragEndRef.current();
    };
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchmove',  onMove as EventListener, { passive: true });
    window.addEventListener('touchend',   onUp);
    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchmove',  onMove as EventListener);
      window.removeEventListener('touchend',   onUp);
    };
  }, [roadX]);

  const startDrag = (clientX: number) => {
    isDragging.current = true;
    onDragStart();
    onPointerRef.current(roadX(clientX));
  };

  return (
    <div
      ref={roadRef}
      role="slider" tabIndex={0}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}
      aria-label="Scroll through projects"
      className="relative w-full rounded-lg cursor-pointer select-none overflow-hidden mt-6 bg-zinc-600 dark:bg-zinc-700"
      style={{ height: ROAD_H }}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onKeyDown={(e) => {
        const p = getProgress();
        const to =
          e.key === 'ArrowRight' ? Math.min(1, p + 0.04) :
          e.key === 'ArrowLeft'  ? Math.max(0, p - 0.04) :
          e.key === 'Home'       ? 0 :
          e.key === 'End'        ? 1 : null;
        if (to === null) return;
        e.preventDefault();
        onSeek(to);
      }}
    >
      {/* Surface depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none" />
      {/* Edge markings */}
      <div className="absolute left-0 right-0 pointer-events-none"
           style={{ top:    8, height: 2, background: 'rgba(255,255,255,0.45)' }} />
      <div className="absolute left-0 right-0 pointer-events-none"
           style={{ bottom: 8, height: 2, background: 'rgba(255,255,255,0.45)' }} />
      {/* Centre divider in lane-marking amber */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: LANE_MID, height: 3, transform: 'translateY(-50%)',
          background: 'repeating-linear-gradient(90deg,'
            + 'var(--color-accent-300) 0,var(--color-accent-300) 28px,'
            + 'transparent 28px,transparent 54px)',
          opacity: 0.9,
        }}
      />
      {/* Car: no CSS transitions; the parent's loop sets its transform and lights */}
      <div
        ref={carRef}
        className="absolute left-0 top-0 pointer-events-none"
        style={{
          width: CAR_W,
          height: CAR_H,
          transform: `translate3d(${END_MARGIN - CAR_W / 2}px, ${LANE_BOTTOM - CAR_H / 2}px, 0)`,
          filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
          willChange: 'transform',
        }}
      >
        <CarSVG />
      </div>
    </div>
  );
}

// ─── Responsive cards per view ────────────────────────────────────────────────
function useCardsPerView() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const upd = () => {
      if      (window.innerWidth < 768)  setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else if (window.innerWidth < 1700) setCount(3);
      else                               setCount(4);
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);
  return count;
}

// ─── Projects Section ─────────────────────────────────────────────────────────
type DriveMode = 'auto' | 'drag' | 'seek';

export function Projects() {
  const cardsPerView = useCardsPerView();
  const n            = projects.length;
  const maxIndex     = Math.max(0, n - cardsPerView);

  // ── Animation state lives in refs; the loop writes to the DOM directly so
  //    the section doesn't re-render every frame. The car drives a loop around
  //    the road and the carousel follows how far along the road it is. ──
  const carS       = useRef(0);               // distance driven along the loop (px, unbounded)
  const carV       = useRef(0);               // px/s along the loop; negative = reversing
  const modeRef    = useRef<DriveMode>('auto');
  const targetRef  = useRef(0);               // loop distance to steer to while dragging/seeking
  const trackGeom  = useRef<Track>(makeTrack(800));
  const lightsRef  = useRef({ brake: 0, reverse: 0 });
  const maxIndexRef = useRef(maxIndex);
  const hoverRef   = useRef(false);           // pointer or focus on the cards
  const reducedMotionRef = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const roadRef    = useRef<HTMLDivElement>(null);
  const carRef     = useRef<HTMLDivElement>(null);

  const progressOf = (t: Track, x: number) => Math.max(0, Math.min(1, (x - t.x0) / t.ls));

  const getProgress = useCallback(
    () => progressOf(trackGeom.current, pose(trackGeom.current, carS.current).x),
    [],
  );

  // ── Paint current state to the DOM ───────────────────────────────────────
  const lastPctRef = useRef(-1);
  const paint = useCallback(() => {
    const track = trackRef.current, car = carRef.current, road = roadRef.current;
    if (!track || !car || !road) return;
    const t = trackGeom.current;
    const p = pose(t, carS.current);
    const progress = progressOf(t, p.x);
    track.style.transform = `translateX(${-((progress * maxIndexRef.current) / n) * 100}%)`;
    car.style.transform =
      `translate3d(${(p.x - CAR_W / 2).toFixed(2)}px, ${(p.y - CAR_H / 2).toFixed(2)}px, 0) rotate(${p.heading.toFixed(2)}deg)`;
    const pct = Math.round(progress * 100);
    if (pct !== lastPctRef.current) {
      lastPctRef.current = pct;
      road.setAttribute('aria-valuenow', String(pct));
    }
  }, [n]);

  // ── Animation loop — runs only while the section is on screen ────────────
  useEffect(() => {
    let raf = 0;
    let lastT: number | null = null;
    let clock = 0;

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (lastT === null) { lastT = time; return; }
      const dt = Math.min((time - lastT) / 1000, 0.05);
      lastT = time;
      clock += dt;

      const t = trackGeom.current;
      const maxI = maxIndexRef.current;
      // Keep the carousel's old pace: about 5.6 s per card at cruising speed.
      const travel = maxI > 0 ? maxI / (BASE_VEL * 1000) : 10;
      const cruise = Math.max(MIN_CRUISE, Math.min(MAX_CRUISE, t.ls / travel));
      const turnSpeed = Math.min(TURN_SPEED, cruise * 0.7);
      const paused = hoverRef.current || reducedMotionRef.current;
      const mode = modeRef.current;

      // Small fixed substeps keep the motion stable at low frame rates.
      let a = 0;
      const steps = Math.max(1, Math.ceil(dt * 240));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        const auto = mode === 'auto';
        a = auto
          ? autoAccel(t, carS.current, carV.current, cruise, turnSpeed, paused)
          : followAccel(targetRef.current, carS.current, carV.current);
        const next = integrate(carS.current, carV.current, a, h, auto && paused);
        carS.current = next.s;
        carV.current = next.v;
        // Settle onto the dragged/clicked spot instead of jittering around it.
        if (!auto && Math.abs(targetRef.current - carS.current) < 0.6 && Math.abs(carV.current) < 30) {
          carS.current = targetRef.current;
          carV.current = 0;
          if (mode === 'seek') { modeRef.current = 'auto'; break; }
        }
      }

      // Lights: brake when slowing or holding still, white when reversing,
      // left indicator before and during each U-turn.
      const v = carV.current;
      const holding = Math.abs(v) < 3 && (paused || modeRef.current !== 'auto');
      const braking = a * Math.sign(v) < -25 || holding;
      const L = lightsRef.current;
      const k = Math.min(1, dt * 14);
      L.brake += ((braking ? 1 : 0) - L.brake) * k;
      L.reverse += ((v < -3 ? 1 : 0) - L.reverse) * k;
      const p = pose(t, carS.current);
      const turning = p.seg % 2 === 1 || t.ls - p.into < SIGNAL_BEFORE;
      const blink = modeRef.current === 'auto' && !paused && v > 1 && turning && clock % 0.8 < 0.4;
      const car = carRef.current;
      if (car) {
        car.style.setProperty('--brake', L.brake.toFixed(2));
        car.style.setProperty('--reverse', L.reverse.toFixed(2));
        car.style.setProperty('--blink', blink ? '1' : '0');
      }

      paint();
    };

    const start = () => { if (!raf) { lastT = null; raf = requestAnimationFrame(tick); } };
    const stop  = () => { cancelAnimationFrame(raf); raf = 0; };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { reducedMotionRef.current = reduced.matches; };
    onMotion();
    reduced.addEventListener('change', onMotion);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start(); else stop();
    });
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      stop();
      io.disconnect();
      reduced.removeEventListener('change', onMotion);
    };
  }, [paint]);

  // ── Keep the car's place on the road when the road changes width ────────
  useEffect(() => {
    const road = roadRef.current;
    if (!road) return;
    trackGeom.current = makeTrack(road.clientWidth);
    paint();
    const ro = new ResizeObserver(() => {
      const old = trackGeom.current;
      if (road.clientWidth === old.w) return;
      const next = makeTrack(road.clientWidth);
      const p = pose(old, carS.current);
      carS.current = segStart(next, p.seg) + p.into * (p.seg % 2 === 0 ? next.ls / old.ls : 1);
      targetRef.current = carS.current;
      modeRef.current = 'auto';
      trackGeom.current = next;
      paint();
    });
    ro.observe(road);
    return () => ro.disconnect();
  }, [paint]);

  // ── Dragging, clicking and keys steer the car to a spot on the road ──────
  const onPointer   = useCallback((x: number) => {
    targetRef.current = targetFor(trackGeom.current, carS.current, x);
  }, []);
  const onSeek      = useCallback((progress: number) => {
    const t = trackGeom.current;
    targetRef.current = targetFor(t, carS.current, t.x0 + progress * t.ls);
    modeRef.current = 'seek';
  }, []);
  const onDragStart = useCallback(() => { modeRef.current = 'drag'; }, []);
  const onDragEnd   = useCallback(() => { modeRef.current = 'seek'; }, []);

  // ── Pause control (cards hover/focus only — NOT the road/section) ────────
  const onCardsEnter = () => { hoverRef.current = true; };
  const onCardsLeave = () => { hoverRef.current = false; };

  useEffect(() => {
    maxIndexRef.current = maxIndex;
    paint();
  }, [maxIndex, paint]);

  const innerWidthPct = (n / cardsPerView) * 100;
  const cardWidthPct  = 100 / n;

  return (
    <section id="projects" ref={sectionRef} className="py-16 md:py-24">
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Projects</h2>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Drag the car along the road below to scroll through them.
        </p>
      </div>

      {/* Carousel — hover or focus here brings the car to a stop so people can read cards */}
      <div
        className="overflow-hidden -mx-2 [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]"
        onMouseEnter={onCardsEnter}
        onMouseLeave={onCardsLeave}
        onFocus={onCardsEnter}
        onBlur={onCardsLeave}
      >
        <div
          ref={trackRef}
          style={{ display: 'flex', width: `${innerWidthPct}%` }}
        >
          {projects.map((project) => (
            <div key={project.title} style={{ width: `${cardWidthPct}%`, padding: '4px 8px' }}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>

      {/* Road slider — drag or click to drive the car (and carousel) there */}
      <RoadSlider
        roadRef={roadRef}
        carRef={carRef}
        getProgress={getProgress}
        onPointer={onPointer}
        onSeek={onSeek}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </section>
  );
}
