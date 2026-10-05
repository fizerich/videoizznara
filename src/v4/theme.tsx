import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {H} from '../v2/kit';
import {Kicker as KickerBase} from '../v3/Captions';
import type {CaptionLook} from '../v3/Captions';
import type {SlamLook} from '../v3/scenes';

// Palet cerah ikut thumbnail "Gigi Makin Panjang?": krim, merah jambu lembut, crimson pekat
export const L = {
  bg: '#fbf3ec',
  paper: '#ffffff',
  blush: '#f4d4d4',
  crimson: '#8f0b22',
  crimsonHi: '#c41e3a',
  ink: '#4a0a14',
  dim: 'rgba(74,10,20,0.55)',
  line: 'rgba(143,11,34,0.25)',
  blue: '#2f8fd0',
};

export const SLAM: SlamLook = {echo: L.crimsonHi, shadow: '0 12px 30px rgba(143,11,34,0.28)', outline: '14px #ffffff'};

export const CAPTION: CaptionLook = {
  active: L.crimsonHi,
  spoken: L.ink,
  idle: 'rgba(74,10,20,0.45)',
  stroke: '#ffffff',
  shadow: '0 8px 22px rgba(143,11,34,0.22)',
};

// Tajuk gaya thumbnail: huruf crimson, garis luar putih tebal
export const HEAD: React.CSSProperties = {
  fontFamily: H,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: L.crimson,
  WebkitTextStroke: '14px #ffffff',
  paintOrder: 'stroke fill',
  textShadow: '0 12px 30px rgba(143,11,34,0.28)',
};

// Pil crimson, teks putih — seperti label "GUSI NORMAL" pada thumbnail
export const Kicker: React.FC<{text: string; o: number}> = ({text, o}) => <KickerBase text={text} o={o} color="#ffffff" bg={L.crimson} />;

export const CardStyle: React.CSSProperties = {
  background: L.paper,
  border: `3px solid ${L.line}`,
  boxShadow: '0 18px 44px rgba(143,11,34,0.16)',
};

// Latar krim + gumpalan merah jambu + lengkung "reben" crimson lembut (seperti thumbnail)
export const LightBackdrop: React.FC<{f: number}> = ({f}) => {
  const dots = Array.from({length: 34}, (_, i) => {
    const x = random(`lx${i}`) * 1080;
    const depth = 0.2 + random(`lz${i}`) * 0.6;
    const y = (((random(`ly${i}`) * 1920 - f * (0.4 + depth)) % 1920) + 1920) % 1920;
    return {x, y, r: 2 + depth * 5, o: 0.12 + depth * 0.25};
  });
  const g1 = 50 + Math.sin(f / 80) * 14;
  const sw = Math.sin(f / 60) * 30;
  return (
    <AbsoluteFill style={{background: L.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${g1}% 30%, rgba(244,212,212,0.75), transparent 50%),
            radial-gradient(circle at 15% 80%, rgba(244,212,212,0.6), transparent 45%),
            radial-gradient(circle at 90% 65%, rgba(196,30,58,0.10), transparent 40%),
            radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(143,11,34,0.10) 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path
          d={`M -100 ${1500 + sw} C 250 ${1300 - sw} 700 ${1750 + sw} 1180 ${1450 - sw}`}
          fill="none"
          stroke={L.crimsonHi}
          strokeWidth={90}
          opacity={0.07}
          strokeLinecap="round"
        />
        <path
          d={`M -100 ${560 - sw} C 300 ${380 + sw} 760 ${700 - sw} 1180 ${480 + sw}`}
          fill="none"
          stroke={L.blush}
          strokeWidth={120}
          opacity={0.55}
          strokeLinecap="round"
        />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={L.crimsonHi} opacity={d.o} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const CheckMark: React.FC = () => (
  <g>
    <circle r={64} fill={L.crimson} />
    <path d="M -28 2 L -8 24 L 30 -20" fill="none" stroke="#fff" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
