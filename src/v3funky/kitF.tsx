import React from 'react';
import {AbsoluteFill, interpolate, random, spring} from 'remotion';
import '@fontsource/luckiest-guy/400.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

// Palet "colourful & funky"
export const P = {
  ink: '#1b1033',
  white: '#ffffff',
  pink: '#ff3d9a',
  purple: '#7c3aed',
  cyan: '#22d3ee',
  yellow: '#ffe14d',
  lime: '#b6f23a',
  orange: '#ff8a1f',
  blue: '#3b82f6',
  wa: '#25d366',
};

export const FUN = 'Luckiest Guy, cursive';
export const POP = 'Poppins, sans-serif';
export const FONTS_F = ['400 40px "Luckiest Guy"', '700 40px Poppins', '800 40px Poppins', '900 40px Poppins'];

export const clF = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const bounce = (f: number, delay: number, damping = 9, mass = 0.6) =>
  spring({frame: f - delay, fps: 30, config: {damping, mass, stiffness: 180}});

// Gaya pelekat: sempadan dakwat tebal + bayang offset keras
export const stickerBox = (bg: string, r = 28, sh = 10): React.CSSProperties => ({
  background: bg,
  border: `6px solid ${P.ink}`,
  borderRadius: r,
  boxShadow: `${sh}px ${sh}px 0 ${P.ink}`,
});

// Teks bergaris luar tebal (gaya kartun)
export const outline = (w = 12, sh = 8): React.CSSProperties => ({
  WebkitTextStroke: `${w}px ${P.ink}`,
  paintOrder: 'stroke fill',
  textShadow: `${sh * 0.6}px ${sh}px 0 ${P.ink}`,
});

// Skema warna latar — bertukar pada setiap potongan kamera
export const SCHEMES: [string, string, string][] = [
  [P.pink, P.orange, P.yellow],
  [P.purple, P.cyan, P.lime],
  [P.cyan, P.blue, P.yellow],
  [P.orange, P.pink, P.cyan],
  [P.lime, P.cyan, P.pink],
  [P.yellow, P.orange, P.purple],
];

const Scheme: React.FC<{s: [string, string, string]; f: number}> = ({s, f}) => (
  <AbsoluteFill style={{background: `linear-gradient(${160 + Math.sin(f / 60) * 12}deg, ${s[0]} 0%, ${s[1]} 100%)`}}>
    {/* sunburst berputar di belakang doktor */}
    <AbsoluteFill
      style={{
        background: `repeating-conic-gradient(from ${f * 0.35}deg at 50% 46%, rgba(255,255,255,0.16) 0deg 9deg, transparent 9deg 18deg)`,
      }}
    />
    {/* titik halftone di sudut */}
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${P.ink} 22%, transparent 24%)`,
        backgroundSize: '34px 34px',
        opacity: 0.13,
        maskImage: 'radial-gradient(ellipse 70% 60% at 100% 0%, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 100% 0%, black 30%, transparent 70%)',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${P.white} 22%, transparent 24%)`,
        backgroundSize: '30px 30px',
        opacity: 0.25,
        maskImage: 'radial-gradient(ellipse 60% 45% at 0% 100%, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 45% at 0% 100%, black 30%, transparent 70%)',
      }}
    />
  </AbsoluteFill>
);

// ---------- Bentuk Memphis ----------
type ShapeKind = 'squiggle' | 'ring' | 'tri' | 'plus' | 'dots' | 'zig' | 'star' | 'pill';
const SHAPES: {k: ShapeKind; x: number; y: number; s: number; c: keyof typeof P}[] = [
  {k: 'squiggle', x: 70, y: 260, s: 1, c: 'yellow'},
  {k: 'ring', x: 930, y: 230, s: 1, c: 'cyan'},
  {k: 'star', x: 820, y: 470, s: 1.1, c: 'yellow'},
  {k: 'tri', x: 150, y: 560, s: 1, c: 'lime'},
  {k: 'plus', x: 980, y: 700, s: 0.9, c: 'pink'},
  {k: 'dots', x: 60, y: 820, s: 1, c: 'ink'},
  {k: 'zig', x: 880, y: 1000, s: 1, c: 'white'},
  {k: 'pill', x: 90, y: 1120, s: 1, c: 'purple'},
  {k: 'ring', x: 120, y: 1480, s: 0.7, c: 'orange'},
  {k: 'star', x: 960, y: 1380, s: 0.8, c: 'white'},
  {k: 'squiggle', x: 820, y: 1700, s: 0.9, c: 'lime'},
  {k: 'plus', x: 200, y: 1760, s: 0.8, c: 'yellow'},
  {k: 'tri', x: 540, y: 150, s: 0.7, c: 'pink'},
];

const Shape: React.FC<{k: ShapeKind; c: string}> = ({k, c}) => {
  const ink = P.ink;
  switch (k) {
    case 'squiggle':
      return (
        <>
          <path d="M-80 0 q 20 -34 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke={ink} strokeWidth={24} strokeLinecap="round" />
          <path d="M-80 0 q 20 -34 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" />
        </>
      );
    case 'ring':
      return (
        <>
          <circle r={44} fill="none" stroke={ink} strokeWidth={26} />
          <circle r={44} fill="none" stroke={c} strokeWidth={14} />
        </>
      );
    case 'tri':
      return <polygon points="0,-50 46,34 -46,34" fill={c} stroke={ink} strokeWidth={7} strokeLinejoin="round" />;
    case 'plus':
      return <path d="M-14 -46 h28 v32 h32 v28 h-32 v32 h-28 v-32 h-32 v-28 h32 z" fill={c} stroke={ink} strokeWidth={6} strokeLinejoin="round" />;
    case 'dots':
      return (
        <>
          {[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => <circle key={`${i}${j}`} cx={-34 + i * 34} cy={-34 + j * 34} r={8} fill={c} />))}
        </>
      );
    case 'zig':
      return (
        <>
          <polyline points="-70,10 -42,-18 -14,10 14,-18 42,10 70,-18" fill="none" stroke={ink} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="-70,10 -42,-18 -14,10 14,-18 42,10 70,-18" fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'star':
      return <path d="M0 -56 C 8 -14, 14 -8, 56 0 C 14 8, 8 14, 0 56 C -8 14, -14 8, -56 0 C -14 -8, -8 -14, 0 -56 Z" fill={c} stroke={ink} strokeWidth={6} />;
    case 'pill':
      return <rect x={-56} y={-22} width={112} height={44} rx={22} fill={c} stroke={ink} strokeWidth={6} />;
  }
};

export const Memphis: React.FC<{f: number; pulse?: number; only?: number}> = ({f, pulse = 0, only}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {SHAPES.slice(0, only).map((s, i) => {
      const bob = Math.sin(f / (18 + i * 2) + i) * 14;
      const rot = Math.sin(f / (40 + i * 5) + i * 2) * 25 + (s.k === 'star' ? f * 1.2 : 0);
      const sc = s.s * (1 + pulse * 0.25 * (i % 2 ? 1 : -0.4));
      return (
        <g key={i} transform={`translate(${s.x} ${s.y + bob}) rotate(${rot}) scale(${sc})`}>
          <Shape k={s.k} c={P[s.c]} />
        </g>
      );
    })}
  </svg>
);

// Teks besar bergerak (marquee) di belakang doktor
export const Marquee: React.FC<{f: number; text: string; y: number; color?: string; dir?: 1 | -1}> = ({f, text, y, color = 'rgba(255,255,255,0.28)', dir = 1}) => {
  const unit = `${text} ✦ `;
  const x = ((f * 4 * dir) % 1400) - 1400;
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        whiteSpace: 'nowrap',
        fontFamily: FUN,
        fontSize: 190,
        lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: `4px ${color}`,
        transform: `translateX(${x}px) rotate(-6deg)`,
      }}
    >
      {unit.repeat(6)}
    </div>
  );
};

// Latar penuh: skema warna + wipe bulat pada setiap potongan
export const FunkyBackdrop: React.FC<{frame: number; cuts: number[]; marquee?: boolean; shapes?: boolean}> = ({frame, cuts, marquee = true, shapes = true}) => {
  let i = 0;
  while (i < cuts.length - 1 && frame >= cuts[i + 1]) i++;
  const cur = SCHEMES[i % SCHEMES.length];
  const prev = SCHEMES[(i + SCHEMES.length - 1) % SCHEMES.length];
  const since = frame - cuts[i];
  const r = interpolate(since, [0, 10], [0, 1500], clF);
  const pulse = Math.exp(-since / 6) * (i > 0 ? 1 : 0);
  return (
    <AbsoluteFill>
      {i > 0 && since < 10 ? <Scheme s={prev} f={frame} /> : null}
      <AbsoluteFill style={{clipPath: i > 0 && since < 10 ? `circle(${r}px at 50% 46%)` : undefined}}>
        <Scheme s={cur} f={frame} />
      </AbsoluteFill>
      {marquee ? <Marquee f={frame} text="IZZNARA" y={420} /> : null}
      {shapes ? <Memphis f={frame} pulse={pulse} /> : null}
    </AbsoluteFill>
  );
};

// Latar ringkas untuk panel/kad penutup (satu skema tetap)
export const PanelBackdrop: React.FC<{f: number; s: number}> = ({f, s}) => (
  <AbsoluteFill>
    <Scheme s={SCHEMES[s % SCHEMES.length]} f={f} />
    <Memphis f={f} only={8} />
  </AbsoluteFill>
);

// ---------- Maskot gigi ----------
export const ToothBuddy: React.FC<{size?: number; mood?: 'happy' | 'shock' | 'sad'; f?: number; gap?: boolean}> = ({size = 200, mood = 'happy', f = 0, gap = false}) => {
  const blink = Math.floor(f / 50) % 4 === 0 && f % 50 < 4;
  return (
    <svg width={size} height={size * 1.1} viewBox="-110 -120 220 242" style={{overflow: 'visible'}}>
      <path
        d="M-88 -30 C -92 -96, -40 -110, 0 -86 C 40 -110, 92 -96, 88 -30 C 84 20, 70 50, 60 100 C 54 118, 30 118, 24 96 L 12 50 C 8 38, -8 38, -12 50 L -24 96 C -30 118, -54 118, -60 100 C -70 50, -84 20, -88 -30 Z"
        fill={P.white}
        stroke={P.ink}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      <path d="M-58 -62 C -48 -78, -30 -80, -20 -74" fill="none" stroke={P.cyan} strokeWidth={9} strokeLinecap="round" />
      {/* mata */}
      {blink ? (
        <>
          <path d="M-46 -24 h24" stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
          <path d="M22 -24 h24" stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={-34} cy={-24} rx={mood === 'shock' ? 15 : 12} ry={mood === 'shock' ? 19 : 16} fill={P.ink} />
          <ellipse cx={34} cy={-24} rx={mood === 'shock' ? 15 : 12} ry={mood === 'shock' ? 19 : 16} fill={P.ink} />
          <circle cx={-30} cy={-30} r={5} fill={P.white} />
          <circle cx={38} cy={-30} r={5} fill={P.white} />
        </>
      )}
      {/* pipi */}
      <ellipse cx={-56} cy={4} rx={14} ry={9} fill={P.pink} opacity={0.7} />
      <ellipse cx={56} cy={4} rx={14} ry={9} fill={P.pink} opacity={0.7} />
      {/* mulut */}
      {mood === 'happy' ? (
        <path d="M-24 8 C -14 34, 14 34, 24 8 Z" fill={P.ink} />
      ) : mood === 'shock' ? (
        <ellipse cx={0} cy={22} rx={14} ry={18} fill={P.ink} />
      ) : (
        <path d="M-22 30 C -10 14, 10 14, 22 30" fill="none" stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
      )}
      {gap ? <rect x={-6} y={8} width={12} height={14} fill={P.white} /> : null}
    </svg>
  );
};
