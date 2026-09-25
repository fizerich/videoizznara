import React from 'react';
import {Easing, interpolate} from 'remotion';
import {B, BEAT, cl, D, ez, H, sp, Stage, SvgDefs, Tag, Wire} from '../kit';

const P = (lon: number, lat: number) => [(lon - 99.6) * 625, (6.85 - lat) * 625] as const;
const poly = (pts: [number, number][]) => pts.map(([lo, la]) => P(lo, la).join(',')).join(' ');

const PERLIS: [number, number][] = [
  [100.13, 6.7], [100.2, 6.72], [100.3, 6.7], [100.38, 6.6], [100.35, 6.5], [100.4, 6.42],
  [100.35, 6.35], [100.28, 6.3], [100.18, 6.35], [100.13, 6.45], [100.12, 6.55],
];
const KEDAH: [number, number][] = [
  [100.38, 6.6], [100.45, 6.62], [100.55, 6.52], [100.65, 6.45], [100.8, 6.43], [101.0, 6.25],
  [101.05, 6.05], [100.95, 5.85], [100.9, 5.6], [100.8, 5.45], [100.65, 5.3], [100.5, 5.15],
  [100.38, 5.25], [100.35, 5.45], [100.35, 5.7], [100.38, 5.95], [100.33, 6.1], [100.28, 6.3],
  [100.35, 6.35], [100.4, 6.42], [100.35, 6.5],
];
const THAI: [number, number][] = [
  [99.95, 6.9], [101.3, 6.9], [101.3, 6.2], [101.0, 6.25], [100.8, 6.43], [100.65, 6.45],
  [100.55, 6.52], [100.45, 6.62], [100.38, 6.6], [100.3, 6.7], [100.2, 6.72], [100.13, 6.7], [100.05, 6.8],
];
const SOUTH: [number, number][] = [
  [101.0, 6.25], [101.3, 6.2], [101.3, 5.0], [100.45, 5.0], [100.5, 5.15], [100.65, 5.3],
  [100.8, 5.45], [100.9, 5.6], [100.95, 5.85], [101.05, 6.05],
];

const JEJ = P(100.25, 6.42);
const MER = P(100.38, 6.15);
export const PIN_AT = [45, 75];

// Kotak peta (koordinat skrin)
const MX = 40;
const MY = 500;
const MW = 1000;
const MH = 780;

const Pin: React.FC<{x: number; y: number; f: number; at: number; label: string; left?: boolean; k: number}> = ({
  x,
  y,
  f,
  at,
  label,
  left,
  k,
}) => {
  const s = sp(f, at, 9, 0.6);
  if (f < at - 2) return null;
  const rings = [0, 1, 2].map((r) => ((f - at + r * 10) % (BEAT * 2)) / (BEAT * 2));
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {f > at + 4
        ? rings.map((r, i) => (
            <circle key={i} r={20 + r * 90} fill="none" stroke={D.gold} strokeWidth={3} opacity={(1 - r) * 0.7} />
          ))
        : null}
      <g transform={`translate(0 ${(1 - s) * -160}) scale(${Math.min(s, 1.15)})`}>
        <path
          d="M0 0 C -9 -24, -32 -36, -32 -62 A32 32 0 1 1 32 -62 C 32 -36, 9 -24, 0 0 Z"
          fill={D.crimson}
          stroke={D.goldHi}
          strokeWidth={4}
        />
        <circle cx={0} cy={-62} r={12} fill={D.goldHi} />
      </g>
      <text
        x={left ? -50 : 50}
        y={-70}
        textAnchor={left ? 'end' : 'start'}
        fontFamily="Oswald"
        fontWeight={700}
        fontSize={52}
        letterSpacing={3}
        fill={D.cream}
        stroke={D.bg}
        strokeWidth={10}
        paintOrder="stroke"
        opacity={Math.min(1, s)}
      >
        {label}
      </text>
    </g>
  );
};

export const MapV2: React.FC<{f: number}> = ({f}) => {
  const mapIn = ez(f, -4, 16);
  const z = interpolate(f, [14, 44], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const scale = 1 + z * 0.8;
  const cx = (JEJ[0] + MER[0]) / 2 - 40;
  const cy = (JEJ[1] + MER[1]) / 2 - 40;
  const tx = z * (MW / 2 - cx);
  const ty = z * (MH / 2 + 40 - cy);
  const toScreen = (x: number, y: number) =>
    [MW / 2 + tx + (x - 40 - MW / 2) * scale, MH / 2 + ty + (y - 40 - MH / 2) * scale] as const;
  const j = toScreen(JEJ[0], JEJ[1]);
  const m = toScreen(MER[0], MER[1]);
  const route = `M${MW / 2} -10 C ${MW / 2} 120, ${j[0] + 40} ${j[1] - 160}, ${j[0]} ${j[1]} C ${j[0] + 160} ${j[1] + 40}, ${m[0] - 40} ${m[1] - 160}, ${m[0]} ${m[1]}`;
  const routeP = interpolate(f, [30, PIN_AT[0], PIN_AT[1]], [0, 0.5, 1], cl);

  return (
    <>
      <div style={{position: 'absolute', top: 230, left: 80, right: 60}}>
        <Tag text="2 CAWANGAN" o={ez(f, 0, 10)} />
        <div
          style={{
            marginTop: 20,
            fontFamily: H,
            fontWeight: 700,
            fontSize: 104,
            lineHeight: 1,
            color: D.cream,
            textTransform: 'uppercase',
            opacity: sp(f, 4),
          }}
        >
          Perlis <span style={{color: D.gold}}>&</span> Kedah
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: MX,
          top: MY,
          width: MW,
          height: MH,
          opacity: mapIn,
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, #000 60%, transparent 100%)',
        }}
      >
        <svg viewBox={`0 0 ${MW} ${MH}`} width={MW} height={MH} style={{overflow: 'visible'}}>
          <SvgDefs />
          <defs>
            <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="11" cy="11" r="2" fill="rgba(232,199,133,0.18)" />
            </pattern>
          </defs>
          <rect width={MW} height={MH} fill="url(#dots)" />
          <g transform={`translate(${MW / 2 + tx} ${MH / 2 + ty}) scale(${scale}) translate(${-MW / 2} ${-MH / 2})`}>
            <g transform="translate(-40 -40)" strokeLinejoin="round">
              <polygon points={poly(THAI)} fill="rgba(255,255,255,0.03)" stroke="rgba(247,242,234,0.25)" strokeWidth={2 / scale} strokeDasharray="8 8" />
              <polygon points={poly(SOUTH)} fill="rgba(255,255,255,0.03)" stroke="rgba(247,242,234,0.25)" strokeWidth={2 / scale} />
              <polygon points={poly(KEDAH)} fill="rgba(192,26,66,0.28)" stroke={D.gold} strokeWidth={3 / scale} />
              <polygon points={poly(PERLIS)} fill="rgba(232,199,133,0.22)" stroke={D.gold} strokeWidth={3 / scale} />
              <ellipse cx={P(99.8, 6.35)[0]} cy={P(99.8, 6.35)[1]} rx={70} ry={58} fill="rgba(192,26,66,0.28)" stroke={D.gold} strokeWidth={3 / scale} />
              <text x={P(100.5, 6.8)[0]} y={P(100.5, 6.8)[1]} fontFamily="Oswald" fontWeight={500} fontSize={34 / scale + 6} letterSpacing={10} fill="rgba(247,242,234,0.4)">
                THAILAND
              </text>
              <text x={P(100.62, 5.8)[0]} y={P(100.62, 5.8)[1]} fontFamily="Oswald" fontWeight={700} fontSize={50} letterSpacing={12} fill="rgba(247,242,234,0.55)">
                KEDAH
              </text>
              <text x={P(100.14, 6.66)[0]} y={P(100.14, 6.66)[1]} fontFamily="Oswald" fontWeight={700} fontSize={30} letterSpacing={6} fill="rgba(247,242,234,0.55)" opacity={1 - z}>
                PERLIS
              </text>
            </g>
          </g>
          <Wire d={route} p={routeP} width={7} spark={routeP < 1} />
          <Pin x={j[0]} y={j[1]} f={f} at={PIN_AT[0]} label="JEJAWI" left k={1} />
          <Pin x={m[0]} y={m[1]} f={f} at={PIN_AT[1]} label="MERGONG" k={1} />
        </svg>
      </div>

      <div style={{position: 'absolute', top: 1300, left: 50, right: 50, display: 'flex', gap: 24}}>
        {[
          {n: 'Jejawi', s: 'Arau, Perlis', a: 'Taman Jejawi, 02600 Arau', at: 110},
          {n: 'Mergong', s: 'Alor Setar, Kedah', a: '109B, Pusat Perdagangan Tuanku Haminah', at: 125},
        ].map((c) => {
          const s = sp(f, c.at, 13);
          return (
            <div
              key={c.n}
              style={{
                flex: 1,
                background: D.card,
                border: `2px solid rgba(232,199,133,0.55)`,
                borderTop: `8px solid ${D.gold}`,
                borderRadius: 16,
                padding: '20px 24px',
                opacity: s,
                transform: `translateY(${(1 - s) * 180}px)`,
              }}
            >
              <div style={{fontFamily: H, fontWeight: 700, fontSize: 56, color: D.gold, textTransform: 'uppercase', lineHeight: 1}}>{c.n}</div>
              <div style={{fontFamily: H, fontWeight: 500, fontSize: 28, letterSpacing: 4, color: D.dim, textTransform: 'uppercase', marginTop: 8}}>
                {c.s}
              </div>
              <div style={{fontFamily: B, fontWeight: 600, fontSize: 26, color: D.cream, marginTop: 10, lineHeight: 1.3}}>{c.a}</div>
            </div>
          );
        })}
      </div>

      <Stage>
        <Wire d={`M540 -40 C 540 100, 1040 110, 1040 300 C 1040 470, 540 420, 540 ${MY - 10}`} p={ez(f, -12, 10)} />
        <Wire d="M540 1540 L540 1960" p={ez(f, 212, 242)} />
      </Stage>
    </>
  );
};
