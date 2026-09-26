import React from 'react';
import {D} from '../v2/kit';

// Ilustrasi gigi ringkas (mahkota + akar), pusat pada garis gusi (0,0).
// up = gigi atas (akar ke atas), jika tidak gigi bawah.
export const Tooth: React.FC<{
  x: number;
  y: number;
  up?: boolean;
  rot?: number;
  s?: number;
  fill?: string;
  stroke?: string;
}> = ({x, y, up = true, rot = 0, s = 1, fill = D.cream, stroke = D.gold}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${up ? s : -s})`}>
    <path
      d="M-44 -2 C -46 -40, -30 -70, -20 -86 C -14 -94, -8 -86, -6 -60 L -2 -30 L 2 -30 L 6 -60 C 8 -86, 14 -94, 20 -86 C 30 -70, 46 -40, 44 -2 C 42 60, 40 96, 22 108 C 10 114, -10 114, -22 108 C -40 96, -42 60, -44 -2 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path d="M-26 60 C -10 74, 10 74, 26 60" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={5} strokeLinecap="round" />
  </g>
);

// Ikon rawatan — dilukis dalam kotak 200×200
export const BridgeIcon: React.FC = () => (
  <g>
    <rect x={10} y={40} width={180} height={34} rx={17} fill="#c9546e" />
    {[40, 100, 160].map((cx, i) => (
      <g key={cx} transform={`translate(${cx} 74)`}>
        <path
          d="M-28 0 L 28 0 C 30 40, 26 70, 14 80 C 6 86, -6 86, -14 80 C -26 70, -30 40, -28 0 Z"
          fill={i === 1 ? D.goldHi : D.cream}
          stroke={D.gold}
          strokeWidth={4}
        />
      </g>
    ))}
    <rect x={30} y={110} width={140} height={12} rx={6} fill={D.gold} />
  </g>
);

export const ImplantIcon: React.FC = () => (
  <g transform="translate(100 0)">
    <path
      d="M-40 20 C -44 50, -36 80, -24 88 L 24 88 C 36 80, 44 50, 40 20 C 30 8, -30 8, -40 20 Z"
      fill={D.cream}
      stroke={D.gold}
      strokeWidth={4}
    />
    <rect x={-14} y={88} width={28} height={16} fill="#b8bcc6" />
    <path d="M-20 104 L 20 104 L 10 190 L -10 190 Z" fill="#9aa0ad" />
    {[116, 134, 152, 170].map((y) => (
      <path key={y} d={`M${-22 + (y - 104) / 9} ${y} L ${22 - (y - 104) / 9} ${y + 8}`} stroke="#e6e8ee" strokeWidth={5} strokeLinecap="round" />
    ))}
  </g>
);

export const DentureIcon: React.FC = () => (
  <g transform="translate(100 104)">
    <path d="M-92 -10 C -92 -70, 92 -70, 92 -10 L 70 -6 C 60 -44, -60 -44, -70 -6 Z" fill="#d86b85" stroke="#a63d58" strokeWidth={4} />
    {[-66, -40, -13, 13, 40, 66].map((x, i) => (
      <rect
        key={x}
        x={x - 12}
        y={-8 - Math.abs(x) * 0.28}
        width={24}
        height={38}
        rx={9}
        fill={D.cream}
        stroke={D.gold}
        strokeWidth={3}
        transform={`rotate(${x * 0.3} ${x} ${-8})`}
        opacity={i === 5 ? 0.95 : 1}
      />
    ))}
  </g>
);

// Ikon kecil untuk senarai kesan
export const TiltIcon: React.FC = () => (
  <g>
    <Tooth x={50} y={30} rot={-18} s={0.36} fill={D.cream} />
    <path d="M78 22 C 92 30, 96 44, 92 58" fill="none" stroke={D.goldHi} strokeWidth={6} strokeLinecap="round" />
    <path d="M84 56 L 92 60 L 98 50" fill="none" stroke={D.goldHi} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const ShiftIcon: React.FC = () => (
  <g>
    <Tooth x={24} y={30} s={0.3} />
    <Tooth x={76} y={30} s={0.3} />
    <path d="M40 78 L 60 78 M 30 78 L 40 70 L 40 86 Z M 70 78 L 60 70 L 60 86 Z" stroke={D.goldHi} strokeWidth={5} fill={D.goldHi} strokeLinejoin="round" />
  </g>
);

export const ChewIcon: React.FC = () => (
  <g>
    <circle cx={50} cy={50} r={34} fill="none" stroke={D.goldHi} strokeWidth={6} />
    <path d="M36 58 C 44 48, 56 48, 64 58" fill="none" stroke={D.goldHi} strokeWidth={6} strokeLinecap="round" />
    <circle cx={39} cy={40} r={4.5} fill={D.goldHi} />
    <circle cx={61} cy={40} r={4.5} fill={D.goldHi} />
  </g>
);

export const WaIcon: React.FC<{size?: number; bg?: string; fg?: string}> = ({size = 64, bg = D.bg, fg = D.gold}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 6 C17 6 6 17 6 31 c0 5 1.4 9.6 3.9 13.5 L6 58 l14-3.7 C23.6 56.6 27.7 57.8 32 57.8 C47 57.8 58 46.4 58 32 S47 6 32 6 Z" fill={bg} />
    <path
      d="M24 20c-1-2-2-2-3-2s-2 0-3 1-3 3-3 7 3 8 3.5 8.5S24 44 32 47c6.5 2.5 8 2 9.5 1.8s4.5-2 5-3.8.5-3.4.4-3.8-.6-.6-1.4-1l-5-2.4c-.7-.3-1.2-.4-1.7.4s-2 2.4-2.4 2.9-.9.6-1.7.2-3.3-1.2-6.2-3.8c-2.3-2-3.9-4.6-4.3-5.4s0-1.2.3-1.6l1.2-1.4c.4-.5.5-.8.8-1.4s.1-1-.1-1.4Z"
      fill={fg}
    />
  </svg>
);
