import React from 'react';
import {C} from '../theme';

type ToothDef = {w: number; h: number; pointy?: boolean; dx: number; dy: number; rot: number};

// Lapan gigi atas; dx/dy/rot = kedudukan "berlapis" (crooked)
const TEETH: ToothDef[] = [
  {w: 100, h: 118, dx: 6, dy: 4, rot: 6},
  {w: 104, h: 140, pointy: true, dx: 10, dy: 22, rot: -12},
  {w: 100, h: 132, dx: -18, dy: -6, rot: 14},
  {w: 124, h: 160, dx: 12, dy: 18, rot: -7},
  {w: 124, h: 160, dx: -6, dy: -10, rot: 9},
  {w: 100, h: 132, dx: -22, dy: 26, rot: -16},
  {w: 104, h: 140, pointy: true, dx: 4, dy: -4, rot: 10},
  {w: 100, h: 118, dx: -8, dy: 10, rot: -5},
];

const GAP = 8;
export const TEETH_W = TEETH.reduce((a, t) => a + t.w, 0) + GAP * (TEETH.length - 1);
const TOP = 70;

const toothPath = (w: number, h: number, pointy?: boolean) => {
  const r = 16;
  const bottom = pointy
    ? `V${h * 0.58} Q${w} ${h * 0.82} ${w / 2} ${h} Q0 ${h * 0.82} 0 ${h * 0.58}`
    : `V${h * 0.62} Q${w} ${h} ${w / 2} ${h} Q0 ${h} 0 ${h * 0.62}`;
  return `M0 ${r} Q0 0 ${r} 0 H${w - r} Q${w} 0 ${w} ${r} ${bottom} Z`;
};

const layout = (crooked: number) => {
  let x = 0;
  return TEETH.map((t) => {
    const cx = x + t.w / 2 + t.dx * crooked;
    const y = TOP + t.dy * crooked;
    const rot = t.rot * crooked;
    x += t.w + GAP;
    return {...t, cx, y, rot, by: y + t.h * 0.45};
  });
};

export const Teeth: React.FC<{
  crooked: number; // 1 = berlapis, 0 = tersusun
  brackets?: number[]; // skala setiap bracket 0..1
  wire?: number; // progress wire 0..1
  highlight?: number[]; // indeks gigi yang disorot
  highlightP?: number;
}> = ({crooked, brackets, wire = 0, highlight = [], highlightP = 0}) => {
  const L = layout(crooked);
  const pts = L.map((t) => [t.cx, t.by] as const);
  const wirePath = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x - 40} ${y}`;
    const [px, py] = pts[i - 1];
    const mx = (px + x) / 2;
    return `${acc} C${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }, '') + ` L${pts[pts.length - 1][0] + 40} ${pts[pts.length - 1][1]}`;

  return (
    <svg viewBox={`-30 0 ${TEETH_W + 60} 300`} width="100%" style={{overflow: 'visible'}}>
      {/* gusi */}
      <path
        d={`M-30 0 H${TEETH_W + 30} V${TOP + 24} ${TEETH.map((_, i) => {
          const t = L[TEETH.length - 1 - i];
          return `Q${t.cx} ${TOP + 60} ${t.cx - t.w / 2 - GAP / 2} ${TOP + 22}`;
        }).join(' ')} L-30 ${TOP + 24} Z`}
        fill="#d99aa4"
        stroke={C.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {L.map((t, i) => (
        <g key={i} transform={`translate(${t.cx} ${t.y}) rotate(${t.rot} 0 ${t.h / 2})`}>
          {highlight.includes(i) ? (
            <path
              d={toothPath(t.w, t.h, t.pointy)}
              transform={`translate(${-t.w / 2} 0)`}
              fill="none"
              stroke={C.hilite}
              strokeWidth={26 * highlightP}
              strokeLinejoin="round"
              opacity={0.9}
            />
          ) : null}
          <path
            d={toothPath(t.w, t.h, t.pointy)}
            transform={`translate(${-t.w / 2} 0)`}
            fill={C.white}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <path
            d={`M${-t.w / 2 + 20} 34 Q${-t.w / 2 + 16} ${t.h * 0.45} ${-t.w / 2 + 26} ${t.h * 0.62}`}
            fill="none"
            stroke="#e7dccd"
            strokeWidth={10}
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* wire */}
      {wire > 0 ? (
        <path
          d={wirePath}
          fill="none"
          stroke="#8b8488"
          strokeWidth={9}
          strokeLinecap="round"
          pathLength={1000}
          strokeDasharray="1000 1000"
          strokeDashoffset={1000 * (1 - wire)}
        />
      ) : null}
      {/* bracket */}
      {brackets
        ? L.map((t, i) => {
            const s = brackets[i] ?? 0;
            if (s <= 0) return null;
            return (
              <g key={`b${i}`} transform={`translate(${t.cx} ${t.by}) rotate(${t.rot}) scale(${s})`}>
                <rect x={-24} y={-22} width={48} height={44} rx={7} fill="#c9c2c5" stroke={C.ink} strokeWidth={4} />
                <line x1={-24} y1={0} x2={24} y2={0} stroke={C.ink} strokeWidth={4} />
                <rect x={-14} y={-16} width={10} height={8} rx={2} fill={C.white} opacity={0.8} />
              </g>
            );
          })
        : null}
    </svg>
  );
};

export const teethLayout = layout;
