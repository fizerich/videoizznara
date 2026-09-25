import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {N, NF} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const usePop = (delay: number, config: {damping?: number; mass?: number; stiffness?: number} = {damping: 11, mass: 0.6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config});
};

export const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});

// Latar teal dengan gelembung terapung perlahan
export const Bg: React.FC<{top?: string; bottom?: string; children?: React.ReactNode; bubbles?: boolean}> = ({
  top = N.bgLite,
  bottom = N.bgDeep,
  children,
  bubbles = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${top} 0%, ${N.bg} 45%, ${bottom} 100%)`}}>
      {bubbles
        ? new Array(16).fill(0).map((_, i) => {
            const x = random(`bx${i}`) * 1080;
            const r = 10 + random(`br${i}`) * 34;
            const speed = 0.6 + random(`bs${i}`) * 1.4;
            const y = 1980 - ((frame * speed + random(`by${i}`) * 2000) % 2100);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x + Math.sin((frame + i * 30) / 30) * 16,
                  top: y,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: '50%',
                  border: `3px solid rgba(110,231,197,0.18)`,
                  background: 'rgba(110,231,197,0.05)',
                }}
              />
            );
          })
        : null}
      {children}
    </AbsoluteFill>
  );
};

// Kepala scene: bulatan nombor + tajuk
export const SignHeader: React.FC<{num: string; title: React.ReactNode; delay?: number}> = ({num, title, delay = 0}) => {
  const s = usePop(delay);
  const t = usePop(delay + 6, {damping: 14});
  return (
    <div style={{position: 'absolute', top: 290, left: 70, right: 70, display: 'flex', alignItems: 'center', gap: 34}}>
      <div
        style={{
          flex: 'none',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: N.mint,
          color: N.ink,
          fontFamily: NF.head,
          fontWeight: 700,
          fontSize: 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 10px 0 ${N.bgDeep}`,
          transform: `scale(${s}) rotate(${(1 - s) * -90}deg)`,
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: NF.head,
          fontWeight: 600,
          fontSize: 70,
          lineHeight: 1.05,
          color: N.cream,
          opacity: t,
          transform: `translateX(${(1 - t) * 60}px)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};

// Teks besar bergaya "sticker"
export const Big: React.FC<{
  children: React.ReactNode;
  delay: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  rotate?: number;
}> = ({children, delay, size = 110, color = N.cream, style, rotate = 0}) => {
  const s = usePop(delay, {damping: 10, mass: 0.6});
  return (
    <div
      style={{
        fontFamily: NF.head,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color,
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadow: `0 8px 0 ${N.bgDeep}`,
        transform: `scale(${s}) rotate(${rotate}deg)`,
        opacity: Math.min(1, s * 2),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Setem/label bersudut
export const Stamp: React.FC<{children: React.ReactNode; delay: number; bg?: string; color?: string; rotate?: number; size?: number}> = ({
  children,
  delay,
  bg = N.red,
  color = N.cream,
  rotate = -6,
  size = 54,
}) => {
  const s = usePop(delay, {damping: 9, mass: 0.5});
  return (
    <div
      style={{
        display: 'inline-block',
        background: bg,
        color,
        fontFamily: NF.head,
        fontWeight: 700,
        fontSize: size,
        padding: '12px 30px',
        borderRadius: 18,
        border: `5px solid ${N.cream}`,
        boxShadow: `0 8px 0 ${N.bgDeep}`,
        textTransform: 'uppercase',
        transform: `scale(${interpolate(s, [0, 1], [2.2, 1])}) rotate(${rotate}deg)`,
        opacity: Math.min(1, s * 3),
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

// Garisan bau beralun yang naik (SVG, koordinat tempatan)
export const StinkLines: React.FC<{x: number; y: number; p: number; scale?: number; color?: string; count?: number}> = ({
  x,
  y,
  p,
  scale = 1,
  color = N.stink,
  count = 3,
}) => {
  const frame = useCurrentFrame();
  if (p <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={Math.min(1, p * 1.5)}>
      {new Array(count).fill(0).map((_, i) => {
        const ox = (i - (count - 1) / 2) * 70;
        const lift = ((frame * 1.6 + i * 25) % 60) - 30;
        const ph = frame / 6 + i;
        const w = 22;
        const d = `M${ox} 0 C ${ox + w * Math.sin(ph)} -40, ${ox - w} -60, ${ox} -100 S ${ox + w} -160, ${ox + w * Math.cos(ph)} -200`;
        return (
          <path
            key={i}
            d={d}
            transform={`translate(0 ${-lift * p})`}
            fill="none"
            stroke={color}
            strokeWidth={16}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100 100"
            strokeDashoffset={100 * (1 - p)}
          />
        );
      })}
    </g>
  );
};

// Bakteria comel-jahat: gumpalan bergoyang dengan mata
export const Germ: React.FC<{x: number; y: number; r?: number; s: number; color?: string; seed?: number}> = ({
  x,
  y,
  r = 40,
  s,
  color = N.stink,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  if (s <= 0.001) return null;
  const pts = 9;
  const wob = (i: number) => 1 + 0.13 * Math.sin(frame / 5 + i * 1.7 + seed);
  const path =
    new Array(pts)
      .fill(0)
      .map((_, i) => {
        const a = (i / pts) * Math.PI * 2;
        const rr = r * wob(i);
        return `${i === 0 ? 'M' : 'L'}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
      })
      .join(' ') + ' Z';
  const bob = Math.sin(frame / 8 + seed) * 5;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s}) rotate(${Math.sin(frame / 10 + seed) * 10})`}>
      {new Array(6).fill(0).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + seed;
        return (
          <line
            key={i}
            x1={Math.cos(a) * r * 0.9}
            y1={Math.sin(a) * r * 0.9}
            x2={Math.cos(a) * r * 1.35}
            y2={Math.sin(a) * r * 1.35}
            stroke={N.stinkDark}
            strokeWidth={r * 0.14}
            strokeLinecap="round"
          />
        );
      })}
      <path d={path} fill={color} stroke={N.stinkDark} strokeWidth={r * 0.12} strokeLinejoin="round" style={{filter: 'none'}} />
      <circle cx={-r * 0.32} cy={-r * 0.12} r={r * 0.24} fill="#fff" />
      <circle cx={r * 0.32} cy={-r * 0.12} r={r * 0.24} fill="#fff" />
      <circle cx={-r * 0.28} cy={-r * 0.08} r={r * 0.11} fill={N.ink} />
      <circle cx={r * 0.36} cy={-r * 0.08} r={r * 0.11} fill={N.ink} />
      <path d={`M${-r * 0.55} ${-r * 0.42} L${-r * 0.12} ${-r * 0.3}`} stroke={N.ink} strokeWidth={r * 0.1} strokeLinecap="round" />
      <path d={`M${r * 0.55} ${-r * 0.42} L${r * 0.12} ${-r * 0.3}`} stroke={N.ink} strokeWidth={r * 0.1} strokeLinecap="round" />
      <path d={`M${-r * 0.3} ${r * 0.32} Q0 ${r * 0.52} ${r * 0.3} ${r * 0.32}`} fill="none" stroke={N.ink} strokeWidth={r * 0.1} strokeLinecap="round" />
    </g>
  );
};

// Gigi flat (koordinat tempatan: pusat atas mahkota di 0,0)
export const toothPath = (w: number, h: number) =>
  `M${-w / 2} ${h * 0.12} Q${-w / 2} 0 ${-w / 2 + w * 0.2} 0 Q0 ${h * 0.08} ${w / 2 - w * 0.2} 0 Q${w / 2} 0 ${w / 2} ${h * 0.12}
   L${w / 2 - w * 0.06} ${h * 0.62} Q${w / 2 - w * 0.12} ${h} ${w * 0.18} ${h} Q${w * 0.06} ${h} 0 ${h * 0.74}
   Q${-w * 0.06} ${h} ${-w * 0.18} ${h} Q${-w / 2 + w * 0.12} ${h} ${-w / 2 + w * 0.06} ${h * 0.62} Z`;

export const Tooth: React.FC<{x: number; y: number; w?: number; h?: number; face?: 'happy' | 'sad' | 'none'; rot?: number}> = ({
  x,
  y,
  w = 200,
  h = 240,
  face = 'none',
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={toothPath(w, h)} fill={N.tooth} stroke={N.ink} strokeWidth={8} strokeLinejoin="round" />
    <path d={`M${-w * 0.3} ${h * 0.14} Q${-w * 0.34} ${h * 0.35} ${-w * 0.26} ${h * 0.5}`} fill="none" stroke={N.toothShade} strokeWidth={w * 0.07} strokeLinecap="round" />
    {face !== 'none' ? (
      <g>
        <circle cx={-w * 0.16} cy={h * 0.32} r={w * 0.05} fill={N.ink} />
        <circle cx={w * 0.16} cy={h * 0.32} r={w * 0.05} fill={N.ink} />
        <path
          d={
            face === 'happy'
              ? `M${-w * 0.14} ${h * 0.44} Q0 ${h * 0.56} ${w * 0.14} ${h * 0.44}`
              : `M${-w * 0.14} ${h * 0.52} Q0 ${h * 0.42} ${w * 0.14} ${h * 0.52}`
          }
          fill="none"
          stroke={N.ink}
          strokeWidth={w * 0.035}
          strokeLinecap="round"
        />
        <circle cx={-w * 0.26} cy={h * 0.44} r={w * 0.05} fill={N.gum} opacity={0.8} />
        <circle cx={w * 0.26} cy={h * 0.44} r={w * 0.05} fill={N.gum} opacity={0.8} />
      </g>
    ) : null}
  </g>
);

// Ikon silang merah dilukis
export const Cross: React.FC<{x: number; y: number; size?: number; p: number}> = ({x, y, size = 120, p}) => {
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  const h = size / 2;
  return (
    <g transform={`translate(${x} ${y})`} strokeLinecap="round" stroke={N.red} strokeWidth={size * 0.16} fill="none">
      <path d={`M${-h} ${-h} L${h} ${h}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - a} />
      {b > 0 ? <path d={`M${h} ${-h} L${-h} ${h}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - b} /> : null}
    </g>
  );
};

// Tanda semak hijau dilukis
export const Check: React.FC<{x: number; y: number; size?: number; p: number; color?: string}> = ({x, y, size = 80, p, color = N.mint}) => (
  <path
    d={`M${x - size * 0.5} ${y} L${x - size * 0.12} ${y + size * 0.38} L${x + size * 0.55} ${y - size * 0.42}`}
    fill="none"
    stroke={color}
    strokeWidth={size * 0.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={1}
    strokeDasharray="1 1"
    strokeDashoffset={1 - p}
  />
);

// Ikon petai (lenggai hijau berbiji)
export const Petai: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = -18}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-170 10 C -120 -40, 120 -40, 175 0 C 120 30, -120 50, -170 10 Z" fill="#5d9c3a" stroke={N.ink} strokeWidth={7} strokeLinejoin="round" />
    {[-110, -55, 0, 55, 110].map((cx) => (
      <ellipse key={cx} cx={cx} cy={2} rx={24} ry={20} fill="#8fcf5a" stroke={N.ink} strokeWidth={5} />
    ))}
    <path d="M175 0 Q 200 -10 215 -30" fill="none" stroke={N.ink} strokeWidth={7} strokeLinecap="round" />
  </g>
);

// Ikon bawang merah
export const Onion: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -120 C 20 -80, 110 -50, 110 20 C 110 80, 60 110, 0 110 C -60 110, -110 80, -110 20 C -110 -50, -20 -80, 0 -120 Z" fill="#b14a78" stroke={N.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M0 -110 C -40 -50, -50 50, -10 105" fill="none" stroke="#d985ad" strokeWidth={8} strokeLinecap="round" />
    <path d="M0 -110 C 40 -50, 50 50, 10 105" fill="none" stroke="#7d2a51" strokeWidth={6} strokeLinecap="round" />
    <path d="M-12 -118 L-20 -160 M0 -120 L4 -166 M12 -118 L24 -156" stroke="#5d9c3a" strokeWidth={9} strokeLinecap="round" />
    <path d="M-30 110 L-36 128 M0 110 L0 132 M30 110 L36 128" stroke={N.ink} strokeWidth={5} strokeLinecap="round" />
  </g>
);

// Ikon berus gigi
export const Brush: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-230} y={-22} width={330} height={44} rx={22} fill={N.mint} stroke={N.ink} strokeWidth={7} />
    <rect x={60} y={-30} width={150} height={60} rx={16} fill={N.cream} stroke={N.ink} strokeWidth={7} />
    {[80, 105, 130, 155, 180].map((bx) => (
      <rect key={bx} x={bx} y={-80} width={16} height={52} rx={6} fill="#fff" stroke={N.ink} strokeWidth={5} />
    ))}
  </g>
);
