import { useState, useEffect, useRef, useCallback } from 'react';
import { ProjectCard } from './ProjectCard';
import projects from '../data/projects';

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_VEL    = 0.00018;   // project-index units / ms (slow glide)
const ROT_SPEED   = 0.16;      // heading degrees / ms  → 180° U-turn ≈ 1.1 s

// Road geometry (all % values are % of road height, px values use ROAD_H)
const ROAD_H      = 88;        // road div height in px — must match inline style
const LANE_MID    = 48;        // road Y-centre as % of road height
const LANE_AMP    = 24;        // distance from centre to lane, as % of road height
const LANE_AMP_PX = LANE_AMP / 100 * ROAD_H;  // ≈ 21 px

/**
 * Heading → car's top% using a cosine that pivots around the road Y-centre.
 *   heading=   0° → 72% (bottom/right-hand lane, going right)
 *   heading= -90° → 48% (road centre, mid right-wall U-turn arc, nose went up)
 *   heading=-180° → 24% (top/right-hand lane, going left)
 *   heading=-270° → 48% (road centre, mid left-wall U-turn arc, nose went down)
 *   heading=-360° → 72% (bottom lane again)
 */
function topFromHeading(h: number) {
  return LANE_MID + LANE_AMP * Math.cos((h * Math.PI) / 180);
}

/**
 * Heading → lateral X-offset in px.
 * Rotating the car's offset vector (0, +LANE_AMP_PX) around (0,0) by heading CCW:
 *   x_offset = +LANE_AMP_PX * sin(heading)   (positive heading → positive x shift)
 * This gives the car an arc trajectory instead of just rotating in place.
 *   heading=   0° → 0 px    (on-centre, no lateral shift)
 *   heading= -90° → -21 px  (shifted left at mid right-wall U-turn)
 *   heading=-180° → 0 px    (back on-centre at top lane)
 *   heading=-270° → +21 px  (shifted right at mid left-wall U-turn)
 */
function xOffFromHeading(h: number) {
  return LANE_AMP_PX * Math.sin((h * Math.PI) / 180);
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
    </svg>
  );
}

// ─── Road Slider ──────────────────────────────────────────────────────────────
interface RoadSliderProps {
  progress:    number;   // 0–1
  heading:     number;   // degrees (passed directly to CSS rotate)
  xOffsetPx:   number;   // lateral arc offset in px
  carTopPct:   number;   // 0–100 %
  onSeek:      (progress: number) => void;
  onDragStart: () => void;
  onDragEnd:   () => void;
}

function RoadSlider({
  progress, heading, xOffsetPx, carTopPct,
  onSeek, onDragStart, onDragEnd,
}: RoadSliderProps) {
  const roadRef     = useRef<HTMLDivElement>(null);
  const isDragging  = useRef(false);
  const onSeekRef   = useRef(onSeek);
  const onDragEndRef = useRef(onDragEnd);
  useEffect(() => { onSeekRef.current   = onSeek;    }, [onSeek]);
  useEffect(() => { onDragEndRef.current = onDragEnd; }, [onDragEnd]);

  const ratioFromX = useCallback((clientX: number) => {
    const r = roadRef.current;
    if (!r) return 0;
    const rect = r.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      onSeekRef.current(ratioFromX(x));
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
  }, [ratioFromX]);

  const startDrag = (clientX: number) => {
    isDragging.current = true;
    onDragStart();
    onSeekRef.current(ratioFromX(clientX));
  };

  const carLeftPct = 5 + progress * 90;

  return (
    <div
      ref={roadRef}
      role="slider" tabIndex={0}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}
      aria-label="Project navigation"
      className="relative w-full rounded-xl cursor-pointer select-none overflow-hidden mt-6 outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      style={{ height: ROAD_H, backgroundColor: '#5c6370' }}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onSeekRef.current(Math.min(1, progress + 0.04));
        if (e.key === 'ArrowLeft')  onSeekRef.current(Math.max(0, progress - 0.04));
      }}
    >
      {/* Surface depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none" />
      {/* Edge markings */}
      <div className="absolute left-0 right-0 pointer-events-none"
           style={{ top:    8, height: 2, background: 'rgba(255,255,255,0.45)' }} />
      <div className="absolute left-0 right-0 pointer-events-none"
           style={{ bottom: 8, height: 2, background: 'rgba(255,255,255,0.45)' }} />
      {/* Centre dashed divider */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '50%', height: 3, transform: 'translateY(-50%)',
          background: 'repeating-linear-gradient(90deg,'
            + 'rgba(255,255,255,0.85) 0,rgba(255,255,255,0.85) 28px,'
            + 'transparent 28px,transparent 54px)',
        }}
      />
      {/* Car — no CSS transitions; all motion driven by RAF in parent */}
      <div
        className="absolute pointer-events-none"
        style={{
          left:      `${carLeftPct}%`,
          top:       `${carTopPct}%`,
          // xOffsetPx shifts the car along the arc (pivot-around-Y-centre physics)
          transform: `translate(calc(-50% + ${xOffsetPx}px), -50%) rotate(${heading}deg)`,
          filter:    'drop-shadow(0 2px 6px rgba(0,0,0,0.55))',
          willChange:'transform',
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
      else                               setCount(3);
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);
  return count;
}

// ─── Projects Section ─────────────────────────────────────────────────────────
export function Projects() {
  const cardsPerView = useCardsPerView();
  const n            = projects.length;
  const maxIndex     = Math.max(0, n - cardsPerView);

  // ── Animation refs (never trigger re-renders directly) ──
  const posRef     = useRef(0);        // carousel position 0–maxIndex
  const velRef     = useRef(BASE_VEL); // units/ms; positive = forward/right
  const headingRef = useRef(0);        // current car heading (degrees)
  const targetRef  = useRef(0);        // desired heading (decremented by 180° per U-turn)
  // autoScrollPaused = don't advance position automatically.
  // The RAF loop itself ALWAYS runs so manual seek updates are rendered instantly.
  const autoScrollPausedRef = useRef(false);
  const hoverRef   = useRef(false);    // true when hovering carousel cards
  const dragRef    = useRef(false);    // true when dragging slider
  const lastTRef   = useRef<number | null>(null);
  const rafRef     = useRef<number>(0);

  // ── React display state (synced from RAF at 60fps) ──
  const [displayPos, setDisplayPos] = useState(0);
  const [heading,    setHeading]    = useState(0);
  const [xOffPx,     setXOffPx]     = useState(0);
  const [carTop,     setCarTop]     = useState(topFromHeading(0));

  // ── Central pause controller ──────────────────────────────────────────────
  // Controls only the auto-scroll advance — RAF always keeps rendering.
  const syncPause = useCallback(() => {
    autoScrollPausedRef.current = hoverRef.current || dragRef.current;
  }, []);

  // ── U-turn trigger — always decrements target by 180° (always CCW arc) ──
  // Turn 1 (right wall / drag-back): 0°→-180°, arc through top of road  ✓
  // Turn 2 (left wall / drag-fwd):  -180°→-360°, arc through bottom of road ✓
  // …alternates naturally on every bounce.
  const triggerUTurn = useCallback(() => {
    velRef.current  = -velRef.current;
    targetRef.current -= 180;
  }, []);

  // ── RAF loop — always running, never paused ──────────────────────────────
  useEffect(() => {
    const tick = (time: number) => {
      if (lastTRef.current !== null) {
        const dt = Math.min(time - lastTRef.current, 50);

        // Auto-advance position only when not paused by hover/drag
        if (!autoScrollPausedRef.current) {
          posRef.current += velRef.current * dt;

          // Wall bounce — skip if mid-turn to avoid re-triggering
          const midTurn = Math.abs(targetRef.current - headingRef.current) > 1;
          if (!midTurn) {
            if (posRef.current >= maxIndex && velRef.current > 0) {
              posRef.current = maxIndex;
              triggerUTurn();
            } else if (posRef.current <= 0 && velRef.current < 0) {
              posRef.current = 0;
              triggerUTurn();
            }
          }
        }

        // Always animate heading (U-turn rotation continues during drag/hover)
        const diff = targetRef.current - headingRef.current;
        if (Math.abs(diff) > 0.2) {
          headingRef.current += Math.sign(diff) * Math.min(ROT_SPEED * dt, Math.abs(diff));
        } else {
          headingRef.current = targetRef.current;
        }

        // Always push display state so manual seeks render immediately
        setDisplayPos(posRef.current);
        setHeading(headingRef.current);
        setXOffPx(xOffFromHeading(headingRef.current));
        setCarTop(topFromHeading(headingRef.current));
      }
      lastTRef.current = time;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [maxIndex, triggerUTurn]);

  // ── Manual seek from road slider ─────────────────────────────────────────
  const handleSeek = useCallback((ratio: number) => {
    const newPos   = ratio * maxIndex;
    const fwdDrag  = newPos > posRef.current + 0.01;
    const bwdDrag  = newPos < posRef.current - 0.01;

    // U-turn immediately when user drags opposite to current velocity
    if ((fwdDrag && velRef.current < 0) || (bwdDrag && velRef.current > 0)) {
      triggerUTurn();
    }
    posRef.current = newPos;
  }, [maxIndex, triggerUTurn]);

  // ── Pause control (cards hover only — NOT the road/section) ──────────────
  const onCardsEnter  = () => { hoverRef.current = true;  syncPause(); };
  const onCardsLeave  = () => { hoverRef.current = false; syncPause(); };
  const onDragStart   = useCallback(() => { dragRef.current = true;  syncPause(); }, [syncPause]);
  const onDragEnd     = useCallback(() => { dragRef.current = false; syncPause(); }, [syncPause]);

  // Clamp on breakpoint change
  useEffect(() => {
    posRef.current = Math.min(posRef.current, maxIndex);
  }, [maxIndex]);

  // ── Carousel maths ────────────────────────────────────────────────────────
  const innerWidthPct = (n / cardsPerView) * 100;
  const translatePct  = -(displayPos / n) * 100;
  const cardWidthPct  = 100 / n;
  const roadProgress  = maxIndex > 0 ? displayPos / maxIndex : 0;

  return (
    <section id="projects" className="py-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">Projects</h2>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          A selection of things I've built, from interactive tools to full-stack applications.
        </p>
      </div>

      {/* Carousel — hover here pauses auto-scroll so user can read cards */}
      <div
        className="overflow-hidden"
        onMouseEnter={onCardsEnter}
        onMouseLeave={onCardsLeave}
      >
        <div
          style={{
            display: 'flex',
            width: `${innerWidthPct}%`,
            transform: `translateX(${translatePct}%)`,
          }}
        >
          {projects.map((project) => (
            <div key={project.title} style={{ width: `${cardWidthPct}%`, padding: '4px 8px' }}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>

      {/* Road slider — hovering here does NOT pause; dragging does */}
      <RoadSlider
        progress={roadProgress}
        heading={heading}
        xOffsetPx={xOffPx}
        carTopPct={carTop}
        onSeek={handleSeek}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </section>
  );
}