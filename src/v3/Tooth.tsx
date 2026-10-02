import React from 'react';
import {getLength, getPointAtLength} from '@remotion/paths';
import {D} from '../v2/kit';

// Gigi geraham keratan rentas. Koordinat gigi: asal di tengah, kira-kira y -235 .. +240.
export const OUTLINE =
  'M -175 -90 C -185 -200 -110 -235 -60 -205 C -30 -190 30 -190 60 -205 C 110 -235 185 -200 175 -90 ' +
  'C 170 -20 140 20 130 90 C 122 170 105 230 70 235 C 40 238 28 170 0 120 ' +
  'C -28 170 -40 238 -70 235 C -105 230 -122 170 -130 90 C -140 20 -170 -20 -175 -90 Z';

export const CHAMBER =
  'M -88 -95 C -88 -138 -42 -150 0 -132 C 42 -150 88 -138 88 -95 C 88 -55 62 -20 40 -8 L -40 -8 C -62 -20 -88 -55 -88 -95 Z';

export const CANAL_L = 'M -38 -40 C -42 40 -74 110 -68 208';
export const CANAL_R = 'M 38 -40 C 42 40 74 110 68 208';
export const CANAL_W = 26;

export const LANE_L = 'M -62 -190 C -60 -150 -30 -120 -34 -70 C -42 20 -74 100 -68 200';
export const LANE_R = 'M -62 -190 C -50 -150 25 -120 34 -70 C 42 20 74 100 68 200';

const GUM = 'M -1000 -12 C -700 -12 -300 -22 -168 -22 L 168 -22 C 300 -22 700 -12 1000 -12 L 1000 360 L -1000 360 Z';

export const lerpColor = (a: string, b: string, t: number) => {
  const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, t))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

export type ToothProps = {
  x: number;
  y: number;
  scale: number;
  rot?: number;
  // 0 sihat (merah jambu) → 1 teruk (merah gelap)
  inflame: number;
  decay?: number; // lubang pada mahkota 0..1
  // pembersihan saluran: kemajuan 0..1 bagi chamber, saluran kiri, kanan
  clean?: {chamber: number; left: number; right: number};
  // tampalan emas
  fill?: {left: number; right: number; chamber: number};
  glow?: number; // sinaran emas 0..1
  gum?: number; // kelegapan gusi 0..1
  shake?: number; // px
  children?: React.ReactNode; // lukisan dalam ruang gigi (bakteria, alat…)
  overlay?: React.ReactNode; // lukisan dalam ruang gigi, di atas segala-galanya
};

const Canal: React.FC<{
  d: string;
  color: string;
  clean: number;
  fill: number;
}> = ({d, color, clean, fill}) => {
  const len = getLength(d);
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={CANAL_W} strokeLinecap="round" />
      {clean > 0 ? (
        <path
          d={d}
          fill="none"
          stroke="#2b1a1f"
          strokeWidth={CANAL_W}
          strokeLinecap="round"
          strokeDasharray={`${len} ${len}`}
          strokeDashoffset={len * (1 - clean)}
        />
      ) : null}
      {fill > 0 ? (
        <>
          <path
            d={d}
            fill="none"
            stroke={D.gold}
            strokeWidth={CANAL_W + 22}
            strokeLinecap="round"
            opacity={0.35}
            strokeDasharray={`${len} ${len}`}
            strokeDashoffset={-len * (1 - fill)}
            filter="url(#toothGlow)"
          />
          <path
            d={d}
            fill="none"
            stroke="url(#goldFill)"
            strokeWidth={CANAL_W}
            strokeLinecap="round"
            strokeDasharray={`${len} ${len}`}
            strokeDashoffset={-len * (1 - fill)}
          />
        </>
      ) : null}
    </g>
  );
};

export const Tooth: React.FC<ToothProps> = ({
  x,
  y,
  scale,
  rot = 0,
  inflame,
  decay = 0,
  clean = {chamber: 0, left: 0, right: 0},
  fill = {left: 0, right: 0, chamber: 0},
  glow = 0,
  gum = 1,
  shake = 0,
  children,
  overlay,
}) => {
  const pulpColor = lerpColor('f08ba0', '8f1030', inflame);
  const pulpHi = lerpColor('ffc2cc', 'e0405e', inflame);
  const sx = shake ? Math.sin(x + y + shake * 7) * shake : 0;
  return (
    <svg
      viewBox="0 0 1080 1920"
      width={1080}
      height={1920}
      style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible'}}
    >
      <defs>
        <linearGradient id="enamel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="55%" stopColor="#f3e8d6" />
          <stop offset="100%" stopColor="#dccdb4" />
        </linearGradient>
        <linearGradient id="gumGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4657c" />
          <stop offset="55%" stopColor="#a8405a" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#7d2438" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="goldFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff0c9" />
          <stop offset="50%" stopColor="#e8c785" />
          <stop offset="100%" stopColor="#b98d3f" />
        </linearGradient>
        <radialGradient id="toothAura">
          <stop offset="0%" stopColor="#fff0c9" stopOpacity={0.85} />
          <stop offset="55%" stopColor="#e8c785" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#e8c785" stopOpacity={0} />
        </radialGradient>
        <filter id="toothGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id="toothClip">
          <path d={OUTLINE} />
        </clipPath>
      </defs>
      <g transform={`translate(${x + sx} ${y}) rotate(${rot}) scale(${scale})`}>
        {glow > 0 ? <circle r={470} cy={10} fill="url(#toothAura)" opacity={glow} /> : null}
        <g opacity={gum}>
          <path d={GUM} fill="url(#gumGrad)" />
        <path d="M -1000 -12 C -700 -12 -300 -22 -168 -22 L 168 -22 C 300 -22 700 -12 1000 -12" fill="none" stroke="#f08ba0" strokeWidth={8} opacity={0.6} />
        </g>
        <path d={OUTLINE} fill="url(#enamel)" stroke="#fff6e4" strokeWidth={5} strokeLinejoin="round" />
        <g clipPath="url(#toothClip)">
          {/* garis dentin */}
          <path d="M -120 -160 C -150 -80 -120 20 -100 70" fill="none" stroke="#fff" strokeWidth={14} opacity={0.55} strokeLinecap="round" />
          <path d={CHAMBER} fill="none" stroke="#e5d3b6" strokeWidth={30} opacity={0.5} strokeLinejoin="round" />
        </g>
        {/* lubang reput */}
        {decay > 0 ? (
          <path
            d="M -100 -198 C -85 -230 -40 -226 -28 -200 C -20 -176 -50 -158 -72 -164 C -96 -168 -104 -184 -100 -198 Z"
            fill="#2a1410"
            stroke="#150806"
            strokeWidth={4}
            transform={`translate(-64 -192) scale(${decay}) translate(64 192)`}
          />
        ) : null}
        {/* pulpa */}
        <path
          d={CHAMBER}
          fill={clean.chamber >= 1 ? '#2b1a1f' : pulpColor}
          stroke={pulpHi}
          strokeWidth={0}
          opacity={1}
        />
        {clean.chamber > 0 && clean.chamber < 1 ? (
          <path d={CHAMBER} fill="#2b1a1f" opacity={clean.chamber} />
        ) : null}
        <Canal d={CANAL_L} color={pulpColor} clean={clean.left} fill={fill.left} />
        <Canal d={CANAL_R} color={pulpColor} clean={clean.right} fill={fill.right} />
        {fill.chamber > 0 ? (
          <>
            <path d={CHAMBER} fill={D.gold} opacity={0.4 * fill.chamber} filter="url(#toothGlow)" />
            <path d={CHAMBER} fill="url(#goldFill)" opacity={fill.chamber} />
          </>
        ) : null}
        {/* kilat pada pulpa yang radang */}
        {inflame > 0.2 && clean.chamber < 0.5 ? (
          <ellipse cx={-14} cy={-100} rx={26} ry={14} fill="#fff" opacity={0.18 * inflame} />
        ) : null}
        {children}
        <path d={OUTLINE} fill="none" stroke="#fff6e4" strokeWidth={4} strokeLinejoin="round" opacity={0.7} />
        {overlay}
      </g>
    </svg>
  );
};

// Bakteria rod bermata kecil — bergerak sepanjang laluan
export const Bacterium: React.FC<{
  path: string;
  p: number;
  f: number;
  seed: number;
  size?: number;
  dead?: number; // 0..1 mengecut
}> = ({path, p, f, seed, size = 1, dead = 0}) => {
  if (p <= 0 || dead >= 1) return null;
  const len = getLength(path);
  const q = Math.min(p, 1);
  const pt = getPointAtLength(path, len * q)!;
  const pt2 = getPointAtLength(path, Math.min(len, len * q + 3))!;
  const ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
  const wob = Math.sin(f / 4 + seed * 3) * 8;
  const s = size * (1 - dead) * Math.min(1, p * 8);
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${ang}) translate(0 ${wob}) scale(${s})`}>
      <rect x={-20} y={-11} width={40} height={22} rx={11} fill="#8fd14f" stroke="#3d6b1e" strokeWidth={3.5} />
      <circle cx={-6} cy={-3} r={3.2} fill="#14210a" />
      <circle cx={7} cy={-3} r={3.2} fill="#14210a" />
      <path d="M -5 5 Q 0 9 6 5" stroke="#14210a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d={`M -20 0 q -10 ${Math.sin(f / 3 + seed) * 8} -18 ${Math.cos(f / 3 + seed) * 6}`} stroke="#3d6b1e" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
};
