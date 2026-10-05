import React from 'react';
import {lerpColor} from '../v3/Tooth';

// Barisan gigi bawah, pandangan depan. Koordinat tempatan: CEJ (sempadan enamel–akar) pada y = 0,
// hujung gigi y ≈ -255, hujung akar y ≈ +270. Gusi menutup akar; bila menyusut, garis gusi turun.
export const TOOTH =
  'M -78 -236 C -78 -262 78 -262 78 -236 C 82 -150 76 -60 58 0 C 52 90 34 200 0 270 C -34 200 -52 90 -58 0 C -76 -60 -82 -150 -78 -236 Z';

export const TEETH = [
  {x: -570, s: 0.8, k: 0.4},
  {x: -380, s: 0.88, k: 0.55},
  {x: -190, s: 0.96, k: 0.85},
  {x: 0, s: 1, k: 1},
  {x: 190, s: 0.96, k: 0.85},
  {x: 380, s: 0.88, k: 0.55},
  {x: 570, s: 0.8, k: 0.4},
];

// Garis gusi pada pusat gigi (y tempatan) — gigi tengah menyusut paling banyak
export const marginY = (r: number, k = 1) => -22 + r * 150 * k;
const papillaY = (r: number) => -105 + r * 80;

const gumPath = (r: number) => {
  const p = papillaY(r);
  let d = `M -1600 560 L -1600 ${p} L ${TEETH[0].x - 95} ${p}`;
  for (const t of TEETH) {
    const m = marginY(r, t.k);
    const cy = (m - 0.25 * p) / 0.75;
    d += ` C ${t.x - 72} ${cy} ${t.x + 72} ${cy} ${t.x + 95} ${p}`;
  }
  return {fill: d + ` L 1600 ${p} L 1600 560 Z`, line: d.replace(/^M -1600 560 L/, 'M')};
};

export type TeethProps = {
  x: number;
  y: number;
  scale: number;
  recede: number; // 0..1
  inflame: number; // 0 sihat → 1 merah bengkak
  shake?: number;
  cej?: number; // garis putus-putus sempadan enamel (0..1)
  children?: React.ReactNode; // dilukis di atas gusi, dalam koordinat tempatan
};

export const Teeth: React.FC<TeethProps> = ({x, y, scale, recede, inflame, shake = 0, cej = 0, children}) => {
  const gum = gumPath(recede);
  const gumTop = lerpColor('ec98a8', 'd8344f', inflame);
  const gumLow = lerpColor('b5506a', '8a1530', inflame);
  const sx = shake ? Math.sin(x * 3 + y + shake * 11) * shake : 0;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible'}}>
      <defs>
        <linearGradient id="v4tooth" gradientUnits="userSpaceOnUse" x1="0" y1="-262" x2="0" y2="270">
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="40%" stopColor="#f4ead8" />
          <stop offset="49.2%" stopColor="#e9dcc4" />
          <stop offset="49.3%" stopColor="#ecd29a" />
          <stop offset="100%" stopColor="#c99c55" />
        </linearGradient>
        <linearGradient id="v4gum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gumTop} />
          <stop offset="45%" stopColor={gumLow} />
          <stop offset="100%" stopColor={gumLow} stopOpacity={0} />
        </linearGradient>
        {/* pudar di tepi kiri/kanan supaya barisan gigi tiada bucu keras bila dikecilkan */}
        <linearGradient id="v4hfade" gradientUnits="userSpaceOnUse" x1="-720" y1="0" x2="720" y2="0">
          <stop offset="0%" stopColor="#000" />
          <stop offset="22%" stopColor="#fff" />
          <stop offset="78%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <mask id="v4fade" maskUnits="userSpaceOnUse" x="-1600" y="-600" width="3200" height="1400">
          <rect x={-1600} y={-600} width={3200} height={1400} fill="url(#v4hfade)" />
        </mask>
        <filter id="v4glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <g transform={`translate(${x + sx} ${y}) scale(${scale})`}>
        <g mask="url(#v4fade)">
        {TEETH.map((t, i) => (
          <g key={i} transform={`translate(${t.x} 0) scale(${t.s})`}>
            <path d={TOOTH} fill="url(#v4tooth)" stroke="#dcc9bd" strokeWidth={5} strokeLinejoin="round" />
            <path d="M -50 -225 C -62 -160 -56 -90 -44 -30" fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" opacity={0.6} />
          </g>
        ))}
        {cej > 0 ? (
          <path d="M -660 0 H 660" stroke="#8f0b22" strokeWidth={5} strokeDasharray="18 14" opacity={cej} />
        ) : null}
        {inflame > 0.3 ? <path d={gum.line} fill="none" stroke="#ff4d6d" strokeWidth={30} opacity={(inflame - 0.3) * 0.6} filter="url(#v4glow)" /> : null}
        <path d={gum.fill} fill="url(#v4gum)" />
        <path d={gum.line} fill="none" stroke={lerpColor('ffc2cc', 'ff7a93', inflame)} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
        </g>
        {children}
      </g>
    </svg>
  );
};

// Kuman kecil (sama gaya seperti V3)
export const Germ: React.FC<{x: number; y: number; f: number; seed: number; s?: number; rot?: number}> = ({x, y, f, seed, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 5 + seed) * 6}) rotate(${rot + Math.sin(f / 9 + seed) * 12}) scale(${s})`}>
    <rect x={-20} y={-11} width={40} height={22} rx={11} fill="#8fd14f" stroke="#3d6b1e" strokeWidth={3.5} />
    <circle cx={-6} cy={-3} r={3.2} fill="#14210a" />
    <circle cx={7} cy={-3} r={3.2} fill="#14210a" />
    <path d="M -5 6 Q 0 2 6 6" stroke="#14210a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <path d={`M -20 0 q -10 ${Math.sin(f / 3 + seed) * 8} -18 ${Math.cos(f / 3 + seed) * 6}`} stroke="#3d6b1e" strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);

export const Toothbrush: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={40} y={-16} width={300} height={32} rx={16} fill="#4fb3d9" stroke="#1d5f7a" strokeWidth={4} />
    <rect x={-80} y={-20} width={130} height={40} rx={14} fill="#4fb3d9" stroke="#1d5f7a" strokeWidth={4} />
    {Array.from({length: 7}, (_, i) => (
      <rect key={i} x={-72 + i * 17} y={-78} width={11} height={60} rx={4} fill="#f7f2ea" stroke="#c9c0b4" strokeWidth={2} />
    ))}
  </g>
);
