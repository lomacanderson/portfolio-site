import { useEffect, useRef } from 'react';

const HERO_HEIGHT   = 840;
const FADE_ZONE     = 120;    // px below hero where cars fade to invisible
const NUM_CARS      = 32;
const CRUISE_SPEED  = 0.85;
const MAX_SPEED     = 3.0;
const STEER_RATE    = 0.022;
const HEADING_INTERVAL = 130; // frames between voluntary heading changes
const FLEE_RADIUS   = 220;
const FLEE_FORCE    = 0.55;   // strong enough to feel responsive
const FLEE_FRICTION = 0.94;

interface Car {
  x: number; y: number;
  vx: number; vy: number;
  heading: number;
  targetHeading: number;
  headingTimer: number;
  length: number;
  width: number;
  fleeVx: number; fleeVy: number;
}

function makeCar(W: number, H: number): Car {
  const heading = Math.random() * Math.PI * 2;
  // Spawn well below the fade zone
  const y = HERO_HEIGHT + FADE_ZONE + 40 + Math.random() * (H - HERO_HEIGHT - FADE_ZONE - 40);
  return {
    x: Math.random() * W, y,
    vx: Math.cos(heading) * CRUISE_SPEED,
    vy: Math.sin(heading) * CRUISE_SPEED,
    heading,
    targetHeading: heading,
    headingTimer: Math.floor(Math.random() * HEADING_INTERVAL),
    length: 12 + Math.random() * 6,
    width:  9  + Math.random() * 4,
    fleeVx: 0, fleeVy: 0,
  };
}

function angleDelta(from: number, to: number) {
  let d = to - from;
  while (d >  Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// Opacity multiplier based on distance below hero boundary
function boundaryAlpha(y: number) {
  const d = y - HERO_HEIGHT;
  if (d <= 0) return 0;
  if (d >= FADE_ZONE) return 1;
  return d / FADE_ZONE;
}

export function TrafficParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, animId = 0;
    let cars: Car[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!cars.length) {
        cars = Array.from({ length: NUM_CARS }, () => makeCar(W, H));
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY };
    };
    const onMouseLeave = () => { mouseRef.current = null; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    resize();

    const drawCar = (car: Car, alpha: number) => {
      if (alpha < 0.02) return;

      const dx = Math.cos(car.heading);
      const dy = Math.sin(car.heading);
      const px = -dy, py = dx;


      const hw = car.width / 2;
      const front = { x: car.x + dx * car.length * 0.5, y: car.y + dy * car.length * 0.5 };
      const back  = { x: car.x - dx * car.length * 0.5, y: car.y - dy * car.length * 0.5 };

      /* ── Car body ── */
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(front.x + px * hw * 0.6, front.y + py * hw * 0.6);
      ctx.lineTo(back.x  + px * hw,       back.y  + py * hw);
      ctx.lineTo(back.x  - px * hw,       back.y  - py * hw);
      ctx.lineTo(front.x - px * hw * 0.6, front.y - py * hw * 0.6);
      ctx.closePath();
      ctx.fillStyle = '#3d3d3d';
      ctx.fill();

      /* ── Cabin ── */
      const cf  = { x: car.x + dx * car.length * 0.1,  y: car.y + dy * car.length * 0.1 };
      const cb  = { x: car.x - dx * car.length * 0.22, y: car.y - dy * car.length * 0.22 };
      const chw = hw * 0.74;
      ctx.beginPath();
      ctx.moveTo(cf.x + px * chw * 0.55, cf.y + py * chw * 0.55);
      ctx.lineTo(cb.x + px * chw,        cb.y + py * chw);
      ctx.lineTo(cb.x - px * chw,        cb.y - py * chw);
      ctx.lineTo(cf.x - px * chw * 0.55, cf.y - py * chw * 0.55);
      ctx.closePath();
      ctx.fillStyle = '#252525';
      ctx.fill();
      ctx.restore();

      /* ── Headlights ── */
      ctx.save();
      ctx.globalAlpha  = alpha;
      ctx.shadowColor  = 'rgba(220,232,245,0.9)';
      ctx.shadowBlur   = 9;
      ctx.fillStyle    = 'rgba(220,232,245,0.95)';
      ctx.beginPath(); ctx.arc(front.x + px * hw * 0.4, front.y + py * hw * 0.4, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(front.x - px * hw * 0.4, front.y - py * hw * 0.4, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      /* ── Taillights ── */
      ctx.save();
      ctx.globalAlpha  = alpha;
      ctx.shadowColor  = 'rgba(200,55,55,0.85)';
      ctx.shadowBlur   = 8;
      ctx.fillStyle    = 'rgba(200,55,55,0.9)';
      ctx.beginPath(); ctx.arc(back.x + px * hw * 0.4, back.y + py * hw * 0.4, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(back.x - px * hw * 0.4, back.y - py * hw * 0.4, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const update = (car: Car) => {

      /* voluntary heading wander */
      car.headingTimer--;
      if (car.headingTimer <= 0) {
        car.headingTimer  = HEADING_INTERVAL + Math.floor(Math.random() * 60);
        car.targetHeading = car.heading + (Math.random() - 0.5) * (Math.PI * 0.4);
      }

      /* steer toward target heading — gentle hero boundary avoidance */
      const distFromHero = car.y - HERO_HEIGHT;
      if (distFromHero < FADE_ZONE + 20) {
        // Turn downward so cars drift away from boundary instead of piling up
        const awayAngle = Math.PI * 0.5; // point straight down
        car.targetHeading = awayAngle + (Math.random() - 0.5) * 0.5;
      }
      car.heading += angleDelta(car.heading, car.targetHeading) * STEER_RATE;

      /* cruise velocity from heading */
      car.vx = Math.cos(car.heading) * CRUISE_SPEED;
      car.vy = Math.sin(car.heading) * CRUISE_SPEED;

      /* mouse flee — affects flee velocity layer AND steers heading away */
      const mouse = mouseRef.current;
      if (mouse) {
        const mdx  = car.x - mouse.x;
        const mdy  = car.y - mouse.y;
        const dist = Math.hypot(mdx, mdy);
        if (dist < FLEE_RADIUS && dist > 0.1) {
          const t = 1 - dist / FLEE_RADIUS;
          const strength = t * t * FLEE_FORCE; // quadratic — strong up close
          car.fleeVx += (mdx / dist) * strength;
          car.fleeVy += (mdy / dist) * strength;

          // Also steer heading away from mouse so the car physically turns
          const fleeAngle = Math.atan2(mdy, mdx);
          car.targetHeading = fleeAngle;
          car.heading += angleDelta(car.heading, fleeAngle) * 0.06;
        }
      }

      // Bleed flee velocity back toward zero
      car.fleeVx *= FLEE_FRICTION;
      car.fleeVy *= FLEE_FRICTION;

      // Combine cruise + flee
      let totalVx = car.vx + car.fleeVx;
      let totalVy = car.vy + car.fleeVy;

      // Cap total speed
      const spd = Math.hypot(totalVx, totalVy);
      if (spd > MAX_SPEED) {
        totalVx = (totalVx / spd) * MAX_SPEED;
        totalVy = (totalVy / spd) * MAX_SPEED;
      }

      car.x += totalVx;
      car.y += totalVy;

      /* don't hard-bounce — let the boundary steering handle it,
         but clamp so they can't go above hero at all */
      if (car.y < HERO_HEIGHT) {
        car.y = HERO_HEIGHT;
        car.fleeVy = Math.abs(car.fleeVy);
      }

      /* wrap edges */
      if (car.x < -car.length)    car.x = W + car.length;
      if (car.x > W + car.length) car.x = -car.length;
      if (car.y > H + car.length) {
        car.y = HERO_HEIGHT + FADE_ZONE + 40;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      for (const car of cars) {
        update(car);
        const alpha = boundaryAlpha(car.y);
        drawCar(car, alpha);
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none -z-10 opacity-60 dark:opacity-50"
      aria-hidden="true"
    />
  );
}
