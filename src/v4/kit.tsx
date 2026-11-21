import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';

export const FPS = 30;
export const TOTAL4 = 1620;

// Palet "jernih": mutiara & blush dengan burgundy Izznara + biru ais aligner
export const C = {
  pearl: '#fbf7f4',
  blush: '#f4e4e3',
  burg: '#660920',
  rose: '#c01a42',
  ink: '#2a0710',
  ice: '#bfe3ff',
  iceHi: '#eaf6ff',
  white: '#ffffff',
  muted: 'rgba(42,7,16,0.55)',
};
export const F = {
  head: 'Inter, sans-serif',
  hand: 'Caveat, cursive',
};

// Babak (frame) — disegerakkan dengan suara (audio/whisper_v4.json)
export const S = {
  hook: 0,
  pros: 262,
  segan: 437,
  reveal: 606,
  ketara: 808,
  buka: 912,
  balik: 1015,
  roles: 1110,
  cta: 1372,
};

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const sp = (f: number, delay: number, damping = 14, mass = 0.7) =>
  spring({frame: f - delay, fps: FPS, config: {damping, mass}});

export const ez = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...cl, easing: Easing.bezier(0.65, 0, 0.35, 1)});

export const out = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...cl, easing: Easing.out(Easing.cubic)});

// Footage "cover" dengan Ken Burns + gred warna
export const Footage: React.FC<{
  src: string;
  f: number; // frame tempatan
  dur: number;
  start?: number; // saat
  zoom?: [number, number];
  pan?: [number, number];
  sat?: number;
  bright?: number;
  blur?: number;
  origin?: string;
}> = ({src, f, dur, start = 0, zoom = [1.04, 1.14], pan = [0, 0], sat = 1.05, bright = 1, blur = 0, origin = '50% 50%'}) => {
  const g = useCurrentFrame();
  const k = f / dur;
  const z = zoom[0] + (zoom[1] - zoom[0]) * k;
  const px = pan[0] + (pan[1] - pan[0]) * k;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Sequence from={g - f} layout="none">
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(start * FPS)}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${z}) translateX(${px}px)`,
          transformOrigin: origin,
          filter: `saturate(${sat}) brightness(${bright}) contrast(1.04) ${blur ? `blur(${blur}px)` : ''}`,
        }}
      />
      </Sequence>
    </AbsoluteFill>
  );
};

// Gred filem: vinyet + kehangatan + bawah gelap untuk sari kata
export const Grade: React.FC<{bottom?: number; top?: number}> = ({bottom = 0.75, top = 0.35}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(20,4,8,${top}) 0%, transparent 22%, transparent 55%, rgba(20,4,8,${bottom}) 100%),
        radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(20,4,8,0.45) 100%)`,
    }}
  />
);

// Latar cerah mutiara dengan bokeh kaca bergerak
export const PearlBg: React.FC<{f: number; tint?: number}> = ({f, tint = 0}) => {
  const dots = Array.from({length: 26}, (_, i) => {
    const r = 30 + random(`r${i}`) * 110;
    const x = random(`x${i}`) * 1080 + Math.sin(f / 90 + i) * 30;
    const y = (((random(`y${i}`) * 2200 - f * (0.3 + random(`s${i}`) * 0.8)) % 2200) + 2200) % 2200 - 140;
    return {r, x, y, o: 0.25 + random(`o${i}`) * 0.4, ice: random(`c${i}`) > 0.55};
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, #ffffff 0%, ${C.pearl} 38%, ${C.blush} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + Math.sin(f / 80) * 10}% 20%, rgba(191,227,255,${0.35 + tint * 0.3}), transparent 45%),
            radial-gradient(circle at ${75 + Math.cos(f / 70) * 8}% 78%, rgba(192,26,66,0.10), transparent 50%)`,
        }}
      />
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: d.x - d.r,
            top: d.y - d.r,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: '50%',
            background: d.ice
              ? 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(191,227,255,0.25) 60%, transparent 72%)'
              : 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), rgba(244,200,205,0.25) 60%, transparent 72%)',
            opacity: d.o,
            filter: 'blur(1.5px)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Pil kaca dengan teks
export const Chip: React.FC<{text: string; p: number; dark?: boolean; dot?: string; size?: number; style?: React.CSSProperties}> = ({
  text,
  p,
  dark,
  dot = C.rose,
  size = 40,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 18,
      padding: `${size * 0.42}px ${size * 0.8}px ${size * 0.42}px ${size * 0.6}px`,
      borderRadius: 999,
      background: dark ? 'rgba(20,4,8,0.55)' : 'rgba(255,255,255,0.82)',
      border: dark ? '1.5px solid rgba(255,255,255,0.35)' : '1.5px solid rgba(255,255,255,0.95)',
      boxShadow: '0 18px 40px rgba(42,7,16,0.25)',
      backdropFilter: 'blur(14px)',
      fontFamily: F.head,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 1,
      color: dark ? '#fff' : C.ink,
      opacity: Math.min(1, p * 1.5),
      transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <span style={{width: size * 0.42, height: size * 0.42, borderRadius: '50%', background: dot, boxShadow: `0 0 14px ${dot}`}} />
    {text}
  </div>
);

export const Check: React.FC<{p: number; size?: number; color?: string}> = ({p, size = 46, color = C.rose}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={22} fill={color} opacity={Math.min(1, p * 2)} />
    <path
      d="M13 25 L21 33 L36 16"
      fill="none"
      stroke="#fff"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={40}
      strokeDashoffset={40 * (1 - p)}
    />
  </svg>
);

// Kilauan bintang kecil
export const Sparkle: React.FC<{x: number; y: number; s: number; rot?: number; color?: string}> = ({x, y, s, rot = 0, color = '#fff'}) =>
  s <= 0 ? null : (
    <svg
      width={120}
      height={120}
      viewBox="-60 -60 120 120"
      style={{position: 'absolute', left: x - 60, top: y - 60, transform: `scale(${s}) rotate(${rot}deg)`, overflow: 'visible'}}
    >
      <path d="M0 -50 C6 -10 10 -6 50 0 C10 6 6 10 0 50 C-6 10 -10 6 -50 0 C-10 -6 -6 -10 0 -50Z" fill={color} />
      <circle r={10} fill="#fff" />
    </svg>
  );
