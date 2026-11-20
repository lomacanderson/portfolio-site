import { useEffect, useRef } from 'react';

/*
 * Night traffic below the hero, seen from above.
 *
 * Cars drive in the right-hand lane of an invisible street grid. Each driver
 * follows the car ahead with the Intelligent Driver Model (smooth accelerating,
 * braking and queueing), obeys timed signals coordinated as a green wave, and
 * sometimes signals and takes a right turn along an arc. The cursor acts like a
 * pedestrian: cars brake and wait for it.
 *
 * The canvas is fixed to the viewport; cars live in document coordinates, and
 * only the ones on screen are drawn each frame.
 */

type Axis = 0 | 1; // 0: east–west street (moves along x), 1: north–south street (moves along y)
type Dir = 1 | -1;

// ─── Street grid (document px) ───────────────────────────────────────────────
const LANE_W      = 12;
const LANE_OFF    = LANE_W / 2;   // lane centre from the street centre line
const ROAD_HALF   = LANE_W;       // half the street width (two lanes)
const STOP_GAP    = 3;            // stop line distance before the cross street
const COL_GAP     = 340;          // spacing of north–south streets
const ROW_GAP     = 280;          // spacing of east–west streets
const FADE_ZONE   = 120;          // px below the hero where cars fade in
const BOTTOM_FADE = 60;
const CULL_MARGIN = 60;
const FALLBACK_HERO_HEIGHT = 840;
const CAR_DENSITY = 1 / 70_000;   // vehicles per px² below the hero
const MIN_CARS    = 14;
const MAX_CARS    = 220;
const SPAWN_EVERY = 0.35;         // s between new vehicles while below target

// ─── Drivers (Intelligent Driver Model, px and seconds) ──────────────────────
const ACCEL         = 30;   // comfortable acceleration
const COMFORT_DECEL = 55;   // comfortable braking
const MAX_DECEL     = 170;  // emergency braking cap
const MIN_GAP       = 5;    // bumper gap when stopped
const HEADWAY       = 0.9;  // time gap kept to the car ahead
const TURN_SPEED    = 22;
const TURN_RADIUS   = 9;
const TURN_ARC      = TURN_RADIUS * Math.PI / 2;
const RIGHT_TURN_CHANCE = 0.22;
const LOOK_AHEAD    = 180;  // how far drivers watch for signals and the cursor
const CURSOR_REACH  = LANE_W * 0.9;
const CURSOR_STANDOFF = 9;

// ─── Signals (seconds) ───────────────────────────────────────────────────────
const GREEN = 8, YELLOW = 2.5, ALL_RED = 1.2;
const HALF_CYCLE = GREEN + YELLOW + ALL_RED;
const CYCLE = HALF_CYCLE * 2;
const PROGRESSION_SPEED = 55; // px/s the green wave travels at
const SIG_GREEN = 0, SIG_YELLOW = 1, SIG_RED = 2;

// ─── Look ────────────────────────────────────────────────────────────────────
// Weighted toward the colours real cars come in: white, black, grey, silver.
const CAR_COLORS = [
  '#eceef1', '#eceef1', '#f6f5f1', '#1b1e23', '#1b1e23', '#2b3038',
  '#5a616b', '#5a616b', '#9aa1ab', '#b8bdc5', '#27467a', '#8e1c1c', '#3e5a3e', '#6d5b46',
];
const TRUCK_COLORS = ['#b42318', '#1d4ed8', '#e5e7eb', '#334155'];
const TRUCK_SHARE = 0.08;
const SPRITE_RES = 6;   // sprite px per CSS px, so rotated cars stay crisp
const SPRITE_PAD = 2;
const BEAM_LEN = 30;
const BEAM_W   = 15;
const BLINK_PERIOD = 0.8;

interface Sprite { img: HTMLCanvasElement; L: number; W: number }

interface Turn {
  sx: number; sy: number;   // arc start
  dx: number; dy: number;   // heading entering the turn
  rx: number; ry: number;   // heading leaving it (to the right of d)
  s: number;                // distance travelled along the arc
  fromDir: Dir; fromKey: number; startAlong: number;
  toAxis: Axis; toDir: Dir; toRoad: number; toLane: number; toKey: number; exitAlong: number;
}

interface Car {
  active: boolean;
  axis: Axis; dir: Dir;
  road: number;    // index of the street the car is on
  lane: number;    // cross-axis coordinate of its lane centre
  pos: number;     // along-axis coordinate of the car's centre
  v: number; acc: number; v0: number;
  len: number; wid: number; spr: Sprite; truck: boolean;
  next: number;    // index of the next cross street, -1 if none
  turnRight: boolean;
  turn: Turn | null;
  leader: LaneEntry | null;
  brake: number;   // smoothed brake-light level, 0..1
  blink: number;
  x: number; y: number; hx: number; hy: number; // pose for drawing
}

interface LaneEntry { pos: number; v: number; len: number; car: Car }

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const mod = (a: number, n: number) => ((a % n) + n) % n;
const laneKey = (axis: Axis, dir: Dir, lane: number) => (axis * 2 + (dir > 0 ? 1 : 0)) * 1e6 + Math.round(lane);
const keyDir = (key: number): Dir => (Math.floor(key / 1e6) % 2 === 1 ? 1 : -1);
// Right-hand traffic: the lane sits to the right of the direction of travel.
const laneOf = (axis: Axis, dir: Dir, roadCentre: number) => roadCentre + LANE_OFF * (axis === 0 ? dir : -dir);

function idm(v: number, v0: number, gap: number, dv: number) {
  const desired = MIN_GAP + Math.max(0, v * HEADWAY + (v * dv) / (2 * Math.sqrt(ACCEL * COMFORT_DECEL)));
  return ACCEL * (1 - (v / v0) ** 4 - (desired / Math.max(gap, 0.01)) ** 2);
}
const freeAccel = (v: number, v0: number) => ACCEL * (1 - (v / v0) ** 4);

// ─── Sprites ─────────────────────────────────────────────────────────────────
function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const target = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const mix = (c: number) => Math.round(c + (target - c) * p);
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

function polygon(g: CanvasRenderingContext2D, pts: [number, number][]) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath();
  g.fill();
}

function paintGradient(g: CanvasRenderingContext2D, color: string, hw: number) {
  const grad = g.createLinearGradient(0, -hw, 0, hw);
  grad.addColorStop(0, shade(color, -0.22));
  grad.addColorStop(0.5, shade(color, 0.1));
  grad.addColorStop(1, shade(color, -0.22));
  return grad;
}

/** Top-down vehicle drawn once at high resolution, front facing +x. */
function makeSprite(truck: boolean, color: string): Sprite {
  const L = truck ? 26 : 16;
  const W = truck ? 8.4 : 7.4;
  const hl = L / 2, hw = W / 2;
  const img = document.createElement('canvas');
  img.width = Math.ceil((L + SPRITE_PAD * 2) * SPRITE_RES);
  img.height = Math.ceil((W + SPRITE_PAD * 2) * SPRITE_RES);
  const g = img.getContext('2d')!;
  g.scale(SPRITE_RES, SPRITE_RES);
  g.translate(hl + SPRITE_PAD, hw + SPRITE_PAD);

  // Soft ground shadow.
  g.save();
  g.shadowColor = 'rgba(0,0,0,0.45)';
  g.shadowBlur = 1.4 * SPRITE_RES;
  g.shadowOffsetY = 0.4 * SPRITE_RES;
  g.fillStyle = '#000';
  g.beginPath(); g.roundRect(-hl, -hw, L, W, 2); g.fill();
  g.restore();

  const glass = '#0e1319';
  if (!truck) {
    g.fillStyle = paintGradient(g, color, hw);
    g.beginPath(); g.roundRect(-hl, -hw, L, W, [1.8, 2.8, 2.8, 1.8]); g.fill();
    g.fillStyle = glass;
    polygon(g, [[1.2, -hw + 0.8], [4.4, -hw + 1.25], [4.4, hw - 1.25], [1.2, hw - 0.8]]);   // windscreen
    polygon(g, [[-3.6, -hw + 0.85], [-5.4, -hw + 1.3], [-5.4, hw - 1.3], [-3.6, hw - 0.85]]); // rear window
    g.fillRect(-3.6, -hw + 0.5, 4.8, 0.5);   // side windows
    g.fillRect(-3.6, hw - 1.0, 4.8, 0.5);
    g.fillStyle = shade(color, 0.05);
    g.beginPath(); g.roundRect(-3.6, -hw + 1.0, 4.8, W - 2.0, 0.8); g.fill();   // roof
    g.fillStyle = 'rgba(255,255,255,0.16)';
    polygon(g, [[1.6, -hw + 1.1], [3.0, -hw + 1.3], [2.2, hw - 1.6], [1.6, hw - 1.4]]);   // glint
    g.fillStyle = shade(color, -0.3);
    g.fillRect(1.6, -hw - 0.55, 0.9, 0.6);   // mirrors
    g.fillRect(1.6, hw - 0.05, 0.9, 0.6);
  } else {
    const cab = 6.2;
    const box = g.createLinearGradient(0, -hw, 0, hw);
    box.addColorStop(0, '#c9cdd4'); box.addColorStop(0.5, '#eef0f3'); box.addColorStop(1, '#c9cdd4');
    g.fillStyle = box;
    g.beginPath(); g.roundRect(-hl, -hw, L - cab - 0.6, W, 0.7); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.09)';
    g.lineWidth = 0.18;
    for (let x = -hl + 2.2; x < hl - cab - 1; x += 2.2) {
      g.beginPath(); g.moveTo(x, -hw + 0.4); g.lineTo(x, hw - 0.4); g.stroke();
    }
    g.fillStyle = paintGradient(g, color, hw);
    g.beginPath(); g.roundRect(hl - cab, -hw + 0.3, cab, W - 0.6, [0.6, 2, 2, 0.6]); g.fill();
    g.fillStyle = glass;
    polygon(g, [[hl - 2.6, -hw + 1.0], [hl - 1.0, -hw + 1.35], [hl - 1.0, hw - 1.35], [hl - 2.6, hw - 1.0]]);
    g.fillStyle = shade(color, -0.3);
    g.fillRect(hl - 2.8, -hw - 0.45, 0.9, 0.6);
    g.fillRect(hl - 2.8, hw - 0.15, 0.9, 0.6);
  }
  return { img, L, W };
}

/** Soft headlight cone, drawn ahead of the car in dark mode. */
function makeBeam() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 64;
  const g = c.getContext('2d')!;
  g.filter = 'blur(4px)';
  const grad = g.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, 'rgba(255,244,220,0.6)');
  grad.addColorStop(1, 'rgba(255,244,220,0)');
  g.fillStyle = grad;
  polygon(g, [[0, 23], [124, 6], [124, 58], [0, 41]]);
  return c;
}

export function TrafficParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const carSprites = CAR_COLORS.map((c) => makeSprite(false, c));
    const truckSprites = TRUCK_COLORS.map((c) => makeSprite(true, c));
    const beam = makeBeam();

    let W = 0, H = 0, dpr = 1, docH = 0, heroH = FALLBACK_HERO_HEIGHT;
    let vRoads: number[] = [];   // x of each north–south street
    let hRoads: number[] = [];   // y of each east–west street
    let cars: Car[] = [];
    let target = 0;
    let simT = Math.random() * CYCLE;
    let spawnClock = 0;
    let animId = 0;
    let lastTime = 0;
    let mouse: { x: number; y: number } | null = null; // viewport coords
    const lanes = new Map<number, LaneEntry[]>();

    const crossRoads = (axis: Axis) => (axis === 0 ? vRoads : hRoads);

    const signalAt = (axis: Axis, iV: number, jH: number) => {
      // Offsets make each light turn green as a platoon from upstream arrives.
      const offset = (vRoads[iV] + hRoads[jH] - heroH) / PROGRESSION_SPEED;
      const local = mod(simT - offset, CYCLE);
      const eastWestPhase = local < HALF_CYCLE;
      if ((axis === 0) !== eastWestPhase) return SIG_RED;
      const p = eastWestPhase ? local : local - HALF_CYCLE;
      return p < GREEN ? SIG_GREEN : p < GREEN + YELLOW ? SIG_YELLOW : SIG_RED;
    };

    const findNext = (car: Car) => {
      const cross = crossRoads(car.axis);
      if (car.dir > 0) {
        for (let k = 0; k < cross.length; k++) if (cross[k] > car.pos) return k;
      } else {
        for (let k = cross.length - 1; k >= 0; k--) if (cross[k] < car.pos) return k;
      }
      return -1;
    };

    // Where a right turn at the next cross street leaves the current lane.
    const turnStartAlong = (car: Car) => {
      const toAxis: Axis = car.axis === 0 ? 1 : 0;
      const toDir: Dir = (car.axis === 0 ? car.dir : -car.dir) as Dir;
      return laneOf(toAxis, toDir, crossRoads(car.axis)[car.next]) - car.dir * TURN_RADIUS;
    };

    const planTurn = (car: Car) => {
      car.turnRight = car.next >= 0 && Math.random() < RIGHT_TURN_CHANCE;
      if (car.turnRight && car.dir * (car.pos - turnStartAlong(car)) > -2) car.turnRight = false;
    };

    const randomizeVehicle = (car: Car) => {
      car.truck = Math.random() < TRUCK_SHARE;
      car.spr = car.truck ? pick(truckSprites) : pick(carSprites);
      car.len = car.spr.L * (car.truck ? rand(0.95, 1.08) : rand(0.88, 1.08));
      car.wid = car.spr.W * (car.truck ? 1 : rand(0.94, 1.04));
      car.v0 = car.truck ? rand(36, 46) : rand(44, 64);
      car.blink = Math.random() * BLINK_PERIOD;
    };

    const newCar = (): Car => {
      const car = {
        active: true, axis: 0, dir: 1, road: 0, lane: 0, pos: 0, v: 0, acc: 0, v0: 50,
        len: 16, wid: 7.4, spr: carSprites[0], truck: false, next: -1, turnRight: false,
        turn: null, leader: null, brake: 0, blink: 0, x: 0, y: 0, hx: 1, hy: 0,
      } as Car;
      randomizeVehicle(car);
      return car;
    };

    const place = (car: Car, axis: Axis, dir: Dir, road: number, pos: number) => {
      const centre = axis === 0 ? hRoads[road] : vRoads[road];
      car.active = true;
      car.axis = axis; car.dir = dir; car.road = road;
      car.lane = laneOf(axis, dir, centre);
      car.pos = pos;
      car.turn = null;
      car.leader = null;
      car.next = findNext(car);
      planTurn(car);
      updatePose(car);
    };

    const updatePose = (car: Car) => {
      const t = car.turn;
      if (t) {
        const phi = t.s / TURN_RADIUS;
        const c = Math.cos(phi), s = Math.sin(phi);
        car.x = t.sx + TURN_RADIUS * (t.rx * (1 - c) + t.dx * s);
        car.y = t.sy + TURN_RADIUS * (t.ry * (1 - c) + t.dy * s);
        car.hx = t.dx * c + t.rx * s;
        car.hy = t.dy * c + t.ry * s;
      } else if (car.axis === 0) {
        car.x = car.pos; car.y = car.lane; car.hx = car.dir; car.hy = 0;
      } else {
        car.x = car.lane; car.y = car.pos; car.hx = 0; car.hy = car.dir;
      }
    };

    const laneClear = (key: number, pos: number, room: number) =>
      !(lanes.get(key) ?? []).some((e) => Math.abs(e.pos - pos) < room);

    // Bring a vehicle in from the edge of the grid.
    const spawnAtEdge = (car: Car) => {
      randomizeVehicle(car);
      const entries = hRoads.length * 2 + vRoads.length * 2;
      for (let attempt = 0; attempt < 6 && entries > 0; attempt++) {
        let e = Math.floor(Math.random() * entries);
        let axis: Axis, dir: Dir, road: number, pos: number;
        if (e < hRoads.length * 2) {
          axis = 0; road = e >> 1; dir = e & 1 ? 1 : -1;
          pos = dir > 0 ? -40 : W + 40;
        } else {
          e -= hRoads.length * 2;
          axis = 1; road = e >> 1; dir = e & 1 ? 1 : -1;
          pos = dir > 0 ? heroH - 30 : docH + 40;
        }
        const centre = axis === 0 ? hRoads[road] : vRoads[road];
        if (!laneClear(laneKey(axis, dir, laneOf(axis, dir, centre)), pos, 40)) continue;
        place(car, axis, dir, road, pos);
        car.v = car.v0 * 0.9;
        return true;
      }
      car.active = false;
      return false;
    };

    // Scatter vehicles over the grid, clear of intersections and each other.
    const populate = () => {
      cars = [];
      lanes.clear();
      const hLen = hRoads.length * W;
      const vLen = vRoads.length * Math.max(0, docH - heroH);
      if (hLen + vLen <= 0) return;
      for (let attempt = 0; cars.length < target && attempt < target * 10; attempt++) {
        const axis: Axis = Math.random() * (hLen + vLen) < hLen ? 0 : 1;
        const roads = axis === 0 ? hRoads : vRoads;
        if (!roads.length) continue;
        const road = Math.floor(Math.random() * roads.length);
        const dir: Dir = Math.random() < 0.5 ? 1 : -1;
        const pos = axis === 0 ? rand(0, W) : rand(heroH + 10, docH);
        if (crossRoads(axis).some((c) => Math.abs(pos - c) < ROAD_HALF + 16)) continue;
        const lane = laneOf(axis, dir, roads[road]);
        if (cars.some((o) => o.axis === axis && o.dir === dir && Math.abs(o.lane - lane) < 1 && Math.abs(o.pos - pos) < 36)) continue;
        const car = newCar();
        place(car, axis, dir, road, pos);
        car.v = car.v0 * rand(0.5, 1);
        cars.push(car);
      }
    };

    const buildLanes = () => {
      lanes.clear();
      const push = (key: number, entry: LaneEntry) => {
        const list = lanes.get(key);
        if (list) list.push(entry); else lanes.set(key, [entry]);
      };
      for (const car of cars) {
        if (!car.active) continue;
        const t = car.turn;
        if (!t) {
          push(laneKey(car.axis, car.dir, car.lane), { pos: car.pos, v: car.v, len: car.len, car });
        } else {
          // A turning car occupies both its old lane and the one it's joining.
          push(t.toKey, { pos: t.exitAlong - t.toDir * (TURN_ARC - t.s), v: car.v, len: car.len, car });
          push(t.fromKey, { pos: t.startAlong + t.fromDir * t.s, v: car.v, len: car.len, car });
        }
        car.leader = null;
      }
      for (const [key, list] of lanes) {
        const dir = keyDir(key);
        list.sort((a, b) => dir * (a.pos - b.pos));
        for (let i = 0; i < list.length; i++) {
          const me = list[i].car;
          // A car's leader comes from the lane it's driving in (or turning into).
          const ownKey = me.turn ? me.turn.toKey : laneKey(me.axis, me.dir, me.lane);
          if (ownKey !== key) continue;
          for (let j = i + 1; j < list.length; j++) {
            if (list[j].car !== me) { me.leader = list[j]; break; }
          }
        }
      }
    };

    const rightTurnBlocked = (car: Car) => {
      const toAxis: Axis = car.axis === 0 ? 1 : 0;
      const toDir: Dir = (car.axis === 0 ? car.dir : -car.dir) as Dir;
      const toLane = laneOf(toAxis, toDir, crossRoads(car.axis)[car.next]);
      const exitAlong = car.lane + TURN_RADIUS * toDir;
      for (const e of lanes.get(laneKey(toAxis, toDir, toLane)) ?? []) {
        const rel = toDir * (e.pos - exitAlong);
        if (rel > -14 && rel < car.len + e.len / 2 + 6) return true;
      }
      return false;
    };

    const computeAccel = (car: Car, mx: number, my: number, hasMouse: boolean) => {
      const v = car.v;
      const L = car.leader;

      if (car.turn) {
        let a = freeAccel(v, TURN_SPEED * 1.15);
        if (L) {
          const t = car.turn;
          const myPos = t.exitAlong - t.toDir * (TURN_ARC - t.s);
          a = Math.min(a, idm(v, TURN_SPEED * 1.15, t.toDir * (L.pos - myPos) - (car.len + L.len) / 2, v - L.v));
        }
        return Math.max(-MAX_DECEL, Math.min(ACCEL, a));
      }

      let a = freeAccel(v, car.v0);
      if (L) a = Math.min(a, idm(v, car.v0, car.dir * (L.pos - car.pos) - (car.len + L.len) / 2, v - L.v));

      if (car.next >= 0) {
        const c = crossRoads(car.axis)[car.next];
        const stopAlong = c - car.dir * (ROAD_HALF + STOP_GAP);
        const toStop = car.dir * (stopAlong - car.pos) - car.len / 2;
        if (toStop > -0.5 && toStop < LOOK_AHEAD) {
          const sig = car.axis === 0 ? signalAt(0, car.next, car.road) : signalAt(1, car.road, car.next);
          const stoppingDist = (v * v) / (2 * COMFORT_DECEL);
          // On yellow (or a fresh red) a driver too close to stop comfortably goes through.
          let stop = sig === SIG_RED ? toStop > stoppingDist * 0.6 : sig === SIG_YELLOW && toStop > stoppingDist;
          if (!stop && car.turnRight) stop = rightTurnBlocked(car);
          if (!stop && !car.turnRight && L && car.dir * (L.pos - (c - car.dir * ROAD_HALF)) > 0) {
            // Don't block the box: if the car ahead is in or just past the
            // intersection and barely moving, wait for room on the far side.
            const room = car.dir * (L.pos - (c + car.dir * ROAD_HALF)) - L.len / 2;
            stop = room < car.len + MIN_GAP && L.v < 6;
          }
          if (stop) a = Math.min(a, idm(v, car.v0, toStop, v));
        }
        if (car.turnRight && v > TURN_SPEED) {
          const dist = car.dir * (turnStartAlong(car) - car.pos);
          if (dist > 0) {
            const need = (v * v - TURN_SPEED * TURN_SPEED) / (2 * dist);
            if (need > COMFORT_DECEL * 0.45) a = Math.min(a, -need);
          }
        }
      }

      if (hasMouse) {
        const off = car.axis === 0 ? my - car.lane : mx - car.lane;
        if (Math.abs(off) < CURSOR_REACH) {
          const ahead = car.dir * ((car.axis === 0 ? mx : my) - car.pos) - car.len / 2;
          if (ahead > -2 && ahead < LOOK_AHEAD) a = Math.min(a, idm(v, car.v0, ahead - CURSOR_STANDOFF, v));
        }
      }
      return Math.max(-MAX_DECEL, Math.min(ACCEL, a));
    };

    const beginTurn = (car: Car, startAlong: number) => {
      const dx = car.axis === 0 ? car.dir : 0;
      const dy = car.axis === 0 ? 0 : car.dir;
      const rx = -dy, ry = dx;
      const toAxis: Axis = car.axis === 0 ? 1 : 0;
      const toDir: Dir = ((toAxis === 0 ? rx : ry) > 0 ? 1 : -1);
      const toLane = laneOf(toAxis, toDir, crossRoads(car.axis)[car.next]);
      car.turn = {
        sx: car.axis === 0 ? startAlong : car.lane,
        sy: car.axis === 0 ? car.lane : startAlong,
        dx, dy, rx, ry,
        s: car.dir * (car.pos - startAlong),
        fromDir: car.dir, fromKey: laneKey(car.axis, car.dir, car.lane), startAlong,
        toAxis, toDir, toRoad: car.next, toLane, toKey: laneKey(toAxis, toDir, toLane),
        exitAlong: car.lane + TURN_RADIUS * toDir,
      };
    };

    const finishTurn = (car: Car) => {
      const t = car.turn!;
      car.axis = t.toAxis; car.dir = t.toDir; car.road = t.toRoad; car.lane = t.toLane;
      car.pos = t.exitAlong + t.toDir * (t.s - TURN_ARC);
      car.turn = null;
      car.next = findNext(car);
      planTurn(car);
    };

    const outOfBounds = (car: Car) =>
      car.axis === 0
        ? car.pos < -60 || car.pos > W + 60
        : car.pos < heroH - 40 || car.pos > docH + 60;

    const activeCount = () => cars.reduce((n, c) => n + (c.active ? 1 : 0), 0);

    const step = (h: number) => {
      simT += h;
      buildLanes();
      const hasMouse = mouse !== null;
      const mx = mouse ? mouse.x : 0;
      const my = mouse ? mouse.y + window.scrollY : 0;

      for (const car of cars) if (car.active) car.acc = computeAccel(car, mx, my, hasMouse);

      for (const car of cars) {
        if (!car.active) continue;
        const v1 = Math.max(0, car.v + car.acc * h);
        const ds = car.v + car.acc * h < 0 ? (car.v * car.v) / (-2 * car.acc) : ((car.v + v1) / 2) * h;
        car.v = v1;

        if (car.turn) {
          car.turn.s += ds;
          if (car.turn.s >= TURN_ARC) finishTurn(car);
        } else {
          car.pos += car.dir * ds;
          if (car.turnRight && car.next >= 0) {
            const start = turnStartAlong(car);
            if (car.dir * (car.pos - start) >= 0) beginTurn(car, start);
          }
          if (!car.turn && car.next >= 0 && car.dir * (car.pos - crossRoads(car.axis)[car.next]) > 0) {
            const k = car.next + car.dir;
            car.next = k >= 0 && k < crossRoads(car.axis).length ? k : -1;
            planTurn(car);
          }
          if (!car.turn && outOfBounds(car)) {
            if (activeCount() > target) car.active = false;
            else spawnAtEdge(car);
          }
        }

        const braking = car.acc < -6 || car.v < 0.8 ? 1 : 0;
        car.brake += (braking - car.brake) * Math.min(1, h * 12);
        updatePose(car);
      }

      spawnClock += h;
      if (spawnClock >= SPAWN_EVERY) {
        spawnClock = 0;
        if (activeCount() < target) {
          const spare = cars.find((c) => !c.active);
          if (spare) spawnAtEdge(spare);
          else {
            const car = newCar();
            if (spawnAtEdge(car)) cars.push(car);
          }
        }
      }
    };

    const draw = () => {
      const scrollY = window.scrollY;
      const dark = document.documentElement.classList.contains('dark');
      const blinkOn = (car: Car) => mod(simT + car.blink, BLINK_PERIOD) < BLINK_PERIOD / 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingQuality = 'high';

      for (const car of cars) {
        if (!car.active) continue;
        const sy = car.y - scrollY;
        if (sy < -CULL_MARGIN || sy > H + CULL_MARGIN || car.x < -CULL_MARGIN || car.x > W + CULL_MARGIN) continue;
        const alpha = clamp01((car.y - heroH) / FADE_ZONE) * clamp01((docH - car.y) / BOTTOM_FADE);
        if (alpha < 0.02) continue;

        // Car-local space: front is +x, right side is +y.
        ctx.setTransform(dpr * car.hx, dpr * car.hy, -dpr * car.hy, dpr * car.hx, dpr * car.x, dpr * sy);
        const hl = car.len / 2, hw = car.wid / 2;

        if (dark) {
          ctx.globalAlpha = alpha * 0.55;
          ctx.drawImage(beam, hl - 0.5, -BEAM_W / 2, BEAM_LEN, BEAM_W);
        }

        const s = car.spr;
        const kx = car.len / s.L, ky = car.wid / s.W;
        ctx.globalAlpha = alpha;
        ctx.drawImage(s.img, -(s.L / 2 + SPRITE_PAD) * kx, -(s.W / 2 + SPRITE_PAD) * ky,
          (s.L + SPRITE_PAD * 2) * kx, (s.W + SPRITE_PAD * 2) * ky);

        // Headlights
        ctx.fillStyle = 'rgb(255,246,226)';
        ctx.globalAlpha = alpha * 0.95;
        ctx.beginPath();
        ctx.arc(hl - 0.6, -hw * 0.62, 0.75, 0, Math.PI * 2);
        ctx.arc(hl - 0.6, hw * 0.62, 0.75, 0, Math.PI * 2);
        ctx.fill();

        // Tail lights, brighter with a glow while braking
        const b = car.brake;
        ctx.fillStyle = 'rgb(255,42,42)';
        if (b > 0.05) {
          ctx.globalAlpha = alpha * 0.3 * b;
          ctx.beginPath();
          ctx.arc(-hl + 0.5, -hw * 0.62, 2.6, 0, Math.PI * 2);
          ctx.arc(-hl + 0.5, hw * 0.62, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = alpha * (0.5 + 0.5 * b);
        ctx.beginPath();
        ctx.arc(-hl + 0.5, -hw * 0.62, 0.75, 0, Math.PI * 2);
        ctx.arc(-hl + 0.5, hw * 0.62, 0.75, 0, Math.PI * 2);
        ctx.fill();

        // Right turn signal, from about 100px before the turn until it's done
        const signalling = car.turn !== null || (car.turnRight && car.next >= 0 &&
          car.dir * (turnStartAlong(car) - car.pos) < 100);
        if (signalling && blinkOn(car)) {
          ctx.fillStyle = 'rgb(255,172,40)';
          ctx.globalAlpha = alpha * 0.35;
          ctx.beginPath();
          ctx.arc(hl - 1, hw - 0.4, 2.2, 0, Math.PI * 2);
          ctx.arc(-hl + 1, hw - 0.4, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(hl - 1, hw - 0.4, 0.7, 0, Math.PI * 2);
          ctx.arc(-hl + 1, hw - 0.4, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (time: number) => {
      animId = requestAnimationFrame(frame);
      // Fixed-size substeps keep the simulation stable at any frame rate.
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime = time;
      const steps = Math.max(1, Math.ceil(dt / (1 / 60)));
      for (let i = 0; i < steps; i++) step(dt / steps);
      draw();
    };

    const start = () => {
      if (animId || reducedMotion.matches) return;
      lastTime = 0;
      animId = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(animId);
      animId = 0;
    };

    // Rebuild the grid when the layout changes. A page that just grows or
    // shrinks keeps its traffic; only a new width or hero height starts over.
    const measure = () => {
      const hero = document.getElementById('hero-bg');
      const newHeroH = hero ? hero.offsetHeight : FALLBACK_HERO_HEIGHT;
      docH = Math.max(document.documentElement.scrollHeight, H);

      const first = (W % COL_GAP) / 2 + COL_GAP / 2;
      const newV: number[] = [];
      for (let x = first; x < W; x += COL_GAP) newV.push(x);
      const newH: number[] = [];
      for (let y = newHeroH + ROW_GAP * 0.5; y < docH - 40; y += ROW_GAP) newH.push(y);

      const reset = newHeroH !== heroH || newV.length !== vRoads.length || newV.some((x, i) => x !== vRoads[i]) || !cars.length;
      heroH = newHeroH;
      vRoads = newV;
      hRoads = newH;
      target = Math.round(Math.min(MAX_CARS, Math.max(MIN_CARS, W * Math.max(0, docH - heroH) * CAR_DENSITY)));

      if (reset) {
        populate();
      } else {
        for (const car of cars) {
          if (!car.active) continue;
          const lost = (car.axis === 0 && car.road >= hRoads.length) ||
            (car.turn !== null && car.turn.toAxis === 0 && car.turn.toRoad >= hRoads.length);
          if (lost) { spawnAtEdge(car); continue; }
          if (!car.turn && car.next >= crossRoads(car.axis).length) car.next = findNext(car);
        }
      }
      if (reducedMotion.matches) draw();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      measure();
    };

    const onMouseMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    const onMouseLeave = () => { mouse = null; };
    // With reduced motion the cars stay parked; just redraw them on scroll.
    const onScroll = () => { if (reducedMotion.matches) draw(); };
    const onMotionChange = () => {
      if (reducedMotion.matches) { stop(); draw(); } else start();
    };

    const bodyObserver = new ResizeObserver(measure);
    bodyObserver.observe(document.body);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    reducedMotion.addEventListener('change', onMotionChange);
    resize();
    if (reducedMotion.matches) draw(); else start();

    return () => {
      stop();
      bodyObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-60 dark:opacity-50"
      aria-hidden="true"
    />
  );
}
