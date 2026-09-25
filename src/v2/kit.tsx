import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';

// Palet gelap premium — hitam & crimson Izznara dengan aksen emas
export const D = {
  bg: '#0c0507',
  bg2: '#1c0910',
  card: 'rgba(32,11,17,0.92)',
  crimson: '#c01a42',
  maroon: '#660920',
  gold: '#e8c785',
  goldHi: '#fff0c9',
  cream: '#f7f2ea',
  dim: 'rgba(247,242,234,0.6)',
};

export const H = 'Oswald, sans-serif';
export const B = 'Inter, sans-serif';

export const FPS = 30;
export const BEAT = 15; // 120 BPM
export const BAR = 60;

// Babak (frame mula) — setiap sempadan jatuh tepat pada bar muzik
export const ST = [0, 120, 300, 480, 660, 900];
export const TOTAL2 = 1170;
export const PAN = 12;

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const sp = (f: number, delay: number, damping = 13, mass = 0.7) =>
  spring({frame: f - delay, fps: FPS, config: {damping, mass}});

export const ez = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...cl, easing: Easing.bezier(0.65, 0, 0.35, 1)});

// Wayar emas bercahaya + percikan di hujung
export const Wire: React.FC<{d: string; p: number; width?: number; spark?: boolean}> = ({
  d,
  p,
  width = 9,
  spark = true,
}) => {
  if (p <= 0) return null;
  const len = getLength(d);
  const tip = getPointAtLength(d, len * Math.min(p, 0.9999));
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={D.gold}
        strokeWidth={width * 3.2}
        strokeLinecap="round"
        opacity={0.22}
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - p)}
        filter="url(#glow)"
      />
      <path
        d={d}
        fill="none"
        stroke={D.gold}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - p)}
      />
      <path
        d={d}
        fill="none"
        stroke={D.goldHi}
        strokeWidth={width * 0.3}
        strokeLinecap="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - p)}
        opacity={0.9}
      />
      {spark && tip && p < 1 ? <Spark x={tip.x} y={tip.y} /> : null}
    </g>
  );
};

export const Spark: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={46} fill="url(#sparkGrad)" />
    <path d="M-70 0 L70 0 M0 -70 L0 70" stroke={D.goldHi} strokeWidth={3} opacity={0.8} />
    <circle r={9} fill="#fff" />
  </g>
);

export const SvgDefs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <radialGradient id="sparkGrad">
      <stop offset="0%" stopColor="#fff6dc" stopOpacity={1} />
      <stop offset="35%" stopColor={D.gold} stopOpacity={0.55} />
      <stop offset="100%" stopColor={D.gold} stopOpacity={0} />
    </radialGradient>
  </defs>
);

// SVG penuh-skrin untuk satu babak
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg
    viewBox="0 0 1080 1920"
    width={1080}
    height={1920}
    style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}
  >
    <SvgDefs />
    {children}
  </svg>
);

// Latar gelap: cahaya crimson bergerak + debu emas (parallax ikut kamera)
export const Backdrop: React.FC<{f: number; camY: number}> = ({f, camY}) => {
  const dust = Array.from({length: 46}, (_, i) => {
    const x = random(`x${i}`) * 1080;
    const baseY = random(`y${i}`) * 1920;
    const depth = 0.15 + random(`z${i}`) * 0.5;
    const y = (((baseY - camY * depth - f * (0.4 + depth)) % 1920) + 1920) % 1920;
    const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 18 + i));
    return {x, y, r: 1.5 + depth * 4, o: tw * (0.25 + depth)};
  });
  const g1 = 50 + Math.sin(f / 70) * 20;
  const g2 = 50 + Math.cos(f / 90) * 25;
  return (
    <AbsoluteFill style={{background: D.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${g1}% 28%, rgba(192,26,66,0.32), transparent 45%),
            radial-gradient(circle at ${g2}% 78%, rgba(102,9,32,0.55), transparent 50%),
            radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {dust.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={D.gold} opacity={d.o} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{f: number}> = ({f}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.18}}>
    <filter id="g2">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} />
    </filter>
    <rect width="100%" height="100%" filter="url(#g2)" />
  </svg>
);

// Label kecil bergaya
export const Tag: React.FC<{text: string; o: number}> = ({text, o}) => (
  <div
    style={{
      display: 'inline-block',
      fontFamily: H,
      fontWeight: 500,
      fontSize: 34,
      letterSpacing: 10,
      color: D.gold,
      border: `2px solid ${D.gold}`,
      padding: '6px 20px 6px 26px',
      opacity: o,
      transform: `translateY(${(1 - o) * 20}px)`,
    }}
  >
    {text}
  </div>
);
