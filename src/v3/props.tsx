import React from 'react';
import {random} from 'remotion';
import {D} from '../v2/kit';

// Kilat bergerigi antara dua titik (berkelip: tukar seed setiap beberapa frame)
export const boltPath = (x1: number, y1: number, x2: number, y2: number, seed: number, segs = 7, jag = 26) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let d = `M ${x1} ${y1}`;
  for (let i = 1; i < segs; i++) {
    const t = i / segs;
    const o = (random(`b${seed}-${i}`) - 0.5) * 2 * jag;
    d += ` L ${x1 + dx * t + nx * o} ${y1 + dy * t + ny * o}`;
  }
  return d + ` L ${x2} ${y2}`;
};

export const Bolt: React.FC<{d: string; color?: string; o?: number; w?: number}> = ({d, color = '#dff6ff', o = 1, w = 7}) => (
  <g opacity={o}>
    <path d={d} fill="none" stroke={color} strokeWidth={w * 3} strokeLinecap="round" strokeLinejoin="round" opacity={0.28} filter="url(#glow)" />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke="#fff" strokeWidth={w * 0.35} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const HotMug: React.FC<{f: number; s?: number}> = ({f, s = 1}) => (
  <g transform={`scale(${s})`}>
    <circle r={120} fill="#ff6a3a" opacity={0.18} filter="url(#glow)" />
    {[-28, 4, 36].map((x, i) => (
      <path
        key={i}
        d={`M ${x} -58 C ${x - 18} -84 ${x + 18} -104 ${x} -136`}
        fill="none"
        stroke="#fff3e6"
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="34 22"
        strokeDashoffset={-((f * 2 + i * 20) % 56)}
        opacity={0.75}
      />
    ))}
    <path d="M 52 -20 C 100 -22 100 38 50 34" fill="none" stroke={D.cream} strokeWidth={15} strokeLinecap="round" />
    <path d="M -62 -52 H 56 V 20 C 56 66 36 84 -3 84 C -42 84 -62 66 -62 20 Z" fill={D.cream} stroke="#d9cdbb" strokeWidth={4} />
    <ellipse cx={-3} cy={-52} rx={59} ry={13} fill="#5a2a14" />
    <ellipse cx={-3} cy={-52} rx={59} ry={13} fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} />
    <path d="M -40 -4 C -40 24 -34 46 -22 60" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
    <path d="M -14 -2 L 12 -2 L 12 -12 L -14 -12 Z" fill="none" />
    <path d="M -10 14 C -24 34 -6 40 -8 54 M 8 14 C -6 34 12 40 10 54" fill="none" stroke="#ff6a3a" strokeWidth={6} strokeLinecap="round" opacity={0.0} />
  </g>
);

export const IceGlass: React.FC<{f: number; s?: number}> = ({f, s = 1}) => (
  <g transform={`scale(${s})`}>
    <circle r={120} fill="#6fd3ff" opacity={0.2} filter="url(#glow)" />
    <path d="M 20 -120 L 46 -30" stroke="#ff4d6d" strokeWidth={12} strokeLinecap="round" />
    <path d="M -58 -70 L 58 -70 L 42 80 Q 40 92 28 92 L -28 92 Q -40 92 -42 80 Z" fill="#bfe8ff" opacity={0.28} stroke="#dff6ff" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -50 -20 L 50 -20 L 42 80 Q 40 92 28 92 L -28 92 Q -40 92 -42 80 Z" fill="#6fd3ff" opacity={0.45} />
    {[
      [-22, -42, 14],
      [16, -34, -10],
      [-4, 14, 22],
      [24, 36, -18],
      [-26, 48, 8],
    ].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y + Math.sin(f / 9 + i) * 2}) rotate(${r})`}>
        <rect x={-15} y={-15} width={30} height={30} rx={7} fill="#eaf8ff" opacity={0.85} stroke="#fff" strokeWidth={2.5} />
        <path d="M -8 -8 L -2 -8" stroke="#9fd8f5" strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
    <path d="M -46 -60 C -48 0 -44 40 -38 70" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    {[
      [-96, -60],
      [100, -10],
      [-100, 50],
    ].map(([x, y], i) => (
      <path
        key={i}
        d={`M ${x - 12} ${y} H ${x + 12} M ${x} ${y - 12} V ${y + 12}`}
        stroke="#dff6ff"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 8 + i * 2))}
      />
    ))}
  </g>
);

export const Burger: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <circle r={120} fill={D.gold} opacity={0.14} filter="url(#glow)" />
    <path d="M -80 -10 C -80 -90 80 -90 80 -10 Z" fill="#e0a050" stroke="#a96d2c" strokeWidth={4} />
    {[
      [-40, -50],
      [-8, -64],
      [30, -52],
      [52, -30],
      [-58, -26],
    ].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx={7} ry={4} fill="#fff4d6" transform={`rotate(${i * 24 - 30} ${x} ${y})`} />
    ))}
    <path d="M -84 -6 q 14 20 28 0 q 14 20 28 0 q 14 20 28 0 q 14 20 28 0 q 14 20 28 0 L 84 -6 Z" fill="#7bc043" stroke="#4e8a22" strokeWidth={3} />
    <rect x={-82} y={12} width={164} height={26} rx={13} fill="#5a2a14" />
    <path d="M -84 44 H 84 V 50 C 84 74 60 82 0 82 C -60 82 -84 74 -84 50 Z" fill="#e0a050" stroke="#a96d2c" strokeWidth={4} />
  </g>
);

export const Forceps: React.FC<{s?: number; rot?: number}> = ({s = 1, rot = 0}) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <g transform="rotate(-14)">
      <rect x={-9} y={-10} width={18} height={150} rx={9} fill="#8d8186" stroke="#2f2629" strokeWidth={3} />
      <path d="M -9 -10 C -9 -60 -26 -90 -34 -118 L -10 -120 C -2 -92 6 -60 9 -10 Z" fill="#a79ba0" stroke="#2f2629" strokeWidth={3} />
    </g>
    <g transform="rotate(14)">
      <rect x={-9} y={-10} width={18} height={150} rx={9} fill="#8d8186" stroke="#2f2629" strokeWidth={3} />
      <path d="M 9 -10 C 9 -60 26 -90 34 -118 L 10 -120 C 2 -92 -6 -60 -9 -10 Z" fill="#a79ba0" stroke="#2f2629" strokeWidth={3} />
    </g>
    <circle cx={0} cy={-4} r={10} fill="#2f2629" />
    <path d="M -22 -150 C -22 -176 22 -176 22 -150 L 16 -124 L -16 -124 Z" fill="#fffaf0" stroke="#2f2629" strokeWidth={3} />
  </g>
);

export const Sparkle: React.FC<{x: number; y: number; s: number; o?: number; color?: string}> = ({x, y, s, o = 1, color = D.goldHi}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M 0 -34 C 3 -10 10 -3 34 0 C 10 3 3 10 0 34 C -3 10 -10 3 -34 0 C -10 -3 -3 -10 0 -34 Z" fill={color} />
    <circle r={5} fill="#fff" />
  </g>
);

export const Check: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <circle r={64} fill="url(#goldFill)" />
    <circle r={64} fill="none" stroke="#fff0c9" strokeWidth={5} />
    <path d="M -28 2 L -8 24 L 30 -20" fill="none" stroke="#0c0507" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
