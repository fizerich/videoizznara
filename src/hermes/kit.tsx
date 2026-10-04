import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, random} from 'remotion';

// Palet: biru malam + emas (selari dengan tema video asal)
export const P = {
  bg: '#060a1f',
  bg2: '#0d1433',
  panel: 'rgba(255,255,255,0.055)',
  panelHi: 'rgba(255,255,255,0.09)',
  line: 'rgba(255,255,255,0.14)',
  text: '#f4f6ff',
  dim: 'rgba(244,246,255,0.64)',
  gold: '#f2c46d',
  goldHi: '#ffe3a3',
  cyan: '#5ad1ff',
  green: '#55e0a0',
  red: '#ff6b7a',
  violet: '#9b8cff',
};
export const HEAD = 'Oswald, sans-serif';
export const BODY = 'Inter, sans-serif';
export const MONO = "'DejaVu Sans Mono', ui-monospace, monospace";

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const prog = (f: number, at: number, over = 16) =>
  interpolate(f, [at, at + over], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});

// Konteks babak: frame relatif & frame mula setiap ayat (untuk menyegerakkan visual dengan suara)
type Ctx = {f: number; L: number[]; dur: number};
const SceneCtx = createContext<Ctx>({f: 0, L: [], dur: 0});
export const SceneProvider = SceneCtx.Provider;
export const useScene = () => useContext(SceneCtx);

// Muncul apabila ayat ke-`at` mula dituturkan (+ lengah d frame)
export const R: React.FC<{
  at: number;
  d?: number;
  x?: number;
  y?: number;
  scale?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({at, d = 0, x = 0, y = 26, scale = 0.96, style, children}) => {
  const {f, L} = useScene();
  const t = prog(f, (L[at] ?? 0) + d - 4, 18);
  return (
    <div
      style={{
        opacity: t,
        transform: `translate(${x * (1 - t)}px, ${y * (1 - t)}px) scale(${scale + (1 - scale) * t})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Kemajuan 0..1 yang bermula pada ayat `at`
export const useP = (at: number, d = 0, over = 18) => {
  const {f, L} = useScene();
  return prog(f, (L[at] ?? 0) + d - 4, over);
};

export const Backdrop: React.FC<{f: number}> = ({f}) => {
  const dots = Array.from({length: 46}, (_, i) => {
    const x = random(`x${i}`) * 1920;
    const depth = 0.25 + random(`z${i}`) * 0.75;
    const y = (((random(`y${i}`) * 1080 - f * (0.18 + depth * 0.5)) % 1080) + 1080) % 1080;
    const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 40 + i));
    return {x, y, r: 1 + depth * 2.6, o: tw * depth * 0.5};
  });
  const gx = 30 + Math.sin(f / 240) * 12;
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${gx}% 15%, rgba(90,209,255,0.13), transparent 45%),
            radial-gradient(circle at ${100 - gx}% 100%, rgba(242,196,109,0.12), transparent 50%),
            radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)`,
        }}
      />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.5}}>
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0H0V80" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#grid)" />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={P.gold} opacity={d.o} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const Head: React.FC<{step?: string; title: string; sub?: string}> = ({step, title, sub}) => {
  const {f} = useScene();
  const t = prog(f, 4, 20);
  return (
    <div style={{position: 'absolute', left: 110, top: 70, opacity: t, transform: `translateY(${(1 - t) * -20}px)`}}>
      {step ? (
        <div
          style={{
            display: 'inline-block',
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 4,
            color: '#1a1405',
            background: P.gold,
            padding: '6px 16px',
            borderRadius: 8,
            marginBottom: 14,
          }}
        >
          {step.toUpperCase()}
        </div>
      ) : null}
      <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 74, lineHeight: 1.05, color: P.text}}>{title}</div>
      {sub ? <div style={{fontFamily: BODY, fontSize: 30, color: P.dim, marginTop: 8}}>{sub}</div> : null}
    </div>
  );
};

export const Card: React.FC<{
  w?: number | string;
  h?: number | string;
  pad?: number;
  glow?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({w, h, pad = 28, glow, style, children}) => (
  <div
    style={{
      width: w,
      height: h,
      boxSizing: 'border-box',
      padding: pad,
      background: P.panel,
      border: `2px solid ${glow ?? P.line}`,
      borderRadius: 24,
      boxShadow: glow ? `0 0 40px ${glow}33` : '0 14px 40px rgba(0,0,0,0.35)',
      backdropFilter: 'blur(6px)',
      color: P.text,
      fontFamily: BODY,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{color?: string; solid?: boolean; children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  color = P.gold,
  solid,
  children,
  size = 24,
  style,
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: BODY,
      fontWeight: 600,
      fontSize: size,
      color: solid ? '#10131f' : color,
      background: solid ? color : `${color}1f`,
      border: `2px solid ${color}${solid ? '' : '66'}`,
      padding: '6px 16px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </span>
);

export const Bubble: React.FC<{
  who: 'user' | 'bot' | 'sys';
  children: React.ReactNode;
  size?: number;
  maxW?: number;
  style?: React.CSSProperties;
}> = ({who, children, size = 24, maxW = 560, style}) => {
  const isUser = who === 'user';
  const sys = who === 'sys';
  return (
    <div style={{display: 'flex', justifyContent: isUser ? 'flex-end' : sys ? 'center' : 'flex-start', ...style}}>
      <div
        style={{
          maxWidth: maxW,
          fontFamily: BODY,
          fontSize: size,
          lineHeight: 1.35,
          padding: '12px 18px',
          borderRadius: 20,
          borderBottomRightRadius: isUser ? 6 : 20,
          borderBottomLeftRadius: !isUser && !sys ? 6 : 20,
          color: isUser ? '#0b1020' : sys ? P.gold : P.text,
          background: isUser ? P.cyan : sys ? 'rgba(242,196,109,0.12)' : 'rgba(255,255,255,0.1)',
          border: sys ? `1px dashed ${P.gold}88` : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const typed = (text: string, f: number, start: number, cps = 38) =>
  text.slice(0, Math.max(0, Math.floor(((f - start) / 30) * cps)));

// ---------------------------------------------------------------- ikon SVG ringkas
type IP = {size?: number; color?: string};
const svg = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const Icon = {
  Server: ({size = 56, color = P.cyan}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3}>
        <rect x={6} y={8} width={36} height={14} rx={4} />
        <rect x={6} y={26} width={36} height={14} rx={4} />
        <circle cx={14} cy={15} r={1.6} fill={color} />
        <circle cx={14} cy={33} r={1.6} fill={color} />
        <path d="M24 15h12M24 33h12" />
      </g>,
    ),
  Chip: ({size = 56, color = P.violet}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3}>
        <rect x={12} y={12} width={24} height={24} rx={5} />
        <rect x={19} y={19} width={10} height={10} rx={2} fill={color} fillOpacity={0.4} />
        <path d="M18 5v7M30 5v7M18 36v7M30 36v7M5 18h7M5 30h7M36 18h7M36 30h7" />
      </g>,
    ),
  Phone: ({size = 56, color = P.green}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3}>
        <rect x={13} y={4} width={22} height={40} rx={5} />
        <path d="M21 38h6" />
      </g>,
    ),
  Star: ({size = 56, color = P.gold}: IP) =>
    svg(
      size,
      <path
        d="M24 5l5.4 11.6 12.6 1.5-9.3 8.6 2.5 12.5L24 33l-11.2 6.2 2.5-12.5L6 18.1l12.6-1.5z"
        stroke={color}
        strokeWidth={3}
        fill={color}
        fillOpacity={0.25}
      />,
    ),
  Clock: ({size = 56, color = P.red}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3}>
        <circle cx={24} cy={24} r={18} />
        <path d="M24 13v11l8 5" />
      </g>,
    ),
  Shield: ({size = 56, color = P.green}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3}>
        <path d="M24 5l15 5v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V10z" fill={color} fillOpacity={0.15} />
        <path d="M17 24l5 5 9-10" />
      </g>,
    ),
  Check: ({size = 40, color = P.green}: IP) => svg(size, <path d="M10 25l9 9 19-21" stroke={color} strokeWidth={5} />),
  Cross: ({size = 40, color = P.red}: IP) => svg(size, <path d="M12 12l24 24M36 12L12 36" stroke={color} strokeWidth={5} />),
  Lock: ({size = 40, color = P.gold}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3.5}>
        <rect x={10} y={21} width={28} height={20} rx={5} />
        <path d="M16 21v-6a8 8 0 0116 0v6" />
      </g>,
    ),
  Mic: ({size = 40, color = P.cyan}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3.5}>
        <rect x={17} y={5} width={14} height={24} rx={7} />
        <path d="M10 22a14 14 0 0028 0M24 36v7" />
      </g>,
    ),
  Laptop: ({size = 56, color = P.dim}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3}>
        <rect x={9} y={10} width={30} height={21} rx={3} />
        <path d="M4 38h40" />
      </g>,
    ),
  Key: ({size = 40, color = P.gold}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3.5}>
        <circle cx={15} cy={24} r={8} />
        <path d="M23 24h19M36 24v7M42 24v5" />
      </g>,
    ),
  Bell: ({size = 40, color = P.gold}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3.5}>
        <path d="M12 34V22a12 12 0 0124 0v12l3 4H9z" />
        <path d="M20 42h8" />
      </g>,
    ),
  Brain: ({size = 56, color = P.violet}: IP) =>
    svg(
      size,
      <g stroke={color} strokeWidth={3}>
        <path d="M24 9c-3-4-10-3-11 2-5 1-6 8-2 11-2 5 2 10 7 9 1 4 7 5 9 0 5 1 9-4 7-9 4-3 3-10-2-11-1-5-8-6-8-2z" />
        <path d="M24 9v30" />
      </g>,
    ),
  Bolt: ({size = 40, color = P.gold}: IP) =>
    svg(size, <path d="M27 4L11 27h11l-3 17 18-25H26z" stroke={color} strokeWidth={3} fill={color} fillOpacity={0.25} />),
  Moon: ({size = 40, color = P.cyan}: IP) =>
    svg(size, <path d="M36 28A16 16 0 1119 8a13 13 0 0017 20z" stroke={color} strokeWidth={3.5} fill={color} fillOpacity={0.2} />),
};

export const Dot: React.FC<{color: string; size?: number; pulse?: number}> = ({color, size = 16, pulse = 0}) => (
  <span
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 ${10 + pulse * 14}px ${color}`,
    }}
  />
);
