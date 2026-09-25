import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, F} from '../theme';
import {Chrome, clamp, Kicker, Paper, ramp, Title, useSpring} from '../components/ui';

// Unjuran ringkas lon/lat -> px (peta gaya ilustrasi, bukan skala tepat)
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

const JEJAWI = P(100.25, 6.42);
const MERGONG = P(100.38, 6.15);

const Pin: React.FC<{x: number; y: number; at: number; label: string; left?: boolean}> = ({x, y, at, label, left}) => {
  const s = useSpring(at, {damping: 9, mass: 0.6});
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={4} rx={16 * s} ry={6 * s} fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(0 ${(1 - s) * -80}) scale(${s})`}>
        <path d="M0 0 C -8 -22, -30 -34, -30 -58 A30 30 0 1 1 30 -58 C 30 -34, 8 -22, 0 0 Z" fill={C.maroon} stroke={C.ink} strokeWidth={4} />
        <circle cx={0} cy={-58} r={11} fill={C.gold} />
      </g>
      <g opacity={s} transform={`translate(${left ? -44 : 44} -70)`}>
        <text
          x={0}
          y={0}
          textAnchor={left ? 'end' : 'start'}
          fontFamily="Oswald"
          fontWeight={700}
          fontSize={46}
          fill={C.ink}
          stroke={C.paper}
          strokeWidth={10}
          paintOrder="stroke"
          letterSpacing={2}
        >
          {label}
        </text>
      </g>
    </g>
  );
};

const Info: React.FC<{at: number; name: string; addr: string; state: string}> = ({at, name, addr, state}) => {
  const s = useSpring(at, {damping: 14});
  return (
    <div
      style={{
        flex: 1,
        background: C.white,
        border: `4px solid ${C.ink}`,
        boxShadow: `8px 8px 0 ${C.maroon}`,
        padding: '22px 24px',
        transform: `translateY(${(1 - s) * 200}px)`,
        opacity: s,
      }}
    >
      <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 54, color: C.maroon, textTransform: 'uppercase', lineHeight: 1}}>
        {name}
      </div>
      <div style={{fontFamily: F.head, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginTop: 6}}>
        {state}
      </div>
      <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: C.ink, marginTop: 10}}>{addr}</div>
    </div>
  );
};

export const Branches: React.FC = () => {
  const frame = useCurrentFrame();
  const mapIn = useSpring(6, {damping: 18});
  // Kamera zoom masuk ke kawasan dua cawangan
  const z = interpolate(frame, [30, 80], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const scale = 1 + z * 0.75;
  const cx = (JEJAWI[0] + MERGONG[0]) / 2;
  const cy = (JEJAWI[1] + MERGONG[1]) / 2;
  const tx = z * (500 - cx);
  const ty = z * (420 - cy);
  const route = ramp(frame, 100, 125);

  return (
    <Paper>
      <Chrome />
      <div style={{position: 'absolute', top: 250, left: 80, right: 80}}>
        <Kicker num="05" label="Dua cawangan" />
        <div style={{height: 36}} />
        <Title delay={4} size={96}>
          Kini di <span style={{color: C.maroon}}>Perlis & Kedah</span>
        </Title>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 60,
          width: 960,
          height: 700,
          overflow: 'hidden',
          border: `4px solid ${C.ink}`,
          background: '#dfe3dc',
          opacity: mapIn,
          transform: `scale(${0.9 + mapIn * 0.1})`,
        }}
      >
        <svg viewBox="0 0 1000 730" width="100%" height="100%">
          <defs>
            <pattern id="sea" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M0 13 Q6.5 7 13 13 T26 13" fill="none" stroke="#b9c3bc" strokeWidth={2.5} />
            </pattern>
          </defs>
          <rect width="1000" height="730" fill="url(#sea)" />
          <g transform={`translate(${500 + tx} ${365 + ty}) scale(${scale}) translate(${-500} ${-365})`}>
            <g transform="translate(-40 -40)">
              <polygon points={poly(THAI)} fill={C.paper2} stroke={C.muted} strokeWidth={3} strokeDasharray="10 8" />
              <polygon points={poly(SOUTH)} fill={C.paper2} stroke={C.muted} strokeWidth={3} />
              <polygon points={poly(KEDAH)} fill={C.maroonSoft} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
              <polygon points={poly(PERLIS)} fill={C.goldSoft} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
              <ellipse cx={P(99.8, 6.35)[0]} cy={P(99.8, 6.35)[1]} rx={70} ry={58} fill={C.maroonSoft} stroke={C.ink} strokeWidth={4} />
              <text x={P(100.55, 6.78)[0]} y={P(100.55, 6.78)[1]} fontFamily="Oswald" fontWeight={500} fontSize={40} letterSpacing={12} fill={C.muted}>
                THAILAND
              </text>
              <text
                x={P(100.15, 6.62)[0]}
                y={P(100.15, 6.62)[1]}
                fontFamily="Oswald"
                fontWeight={700}
                fontSize={34}
                letterSpacing={6}
                fill={C.ink}
                opacity={1 - z}
              >
                PERLIS
              </text>
              <text x={P(100.6, 5.75)[0]} y={P(100.6, 5.75)[1]} fontFamily="Oswald" fontWeight={700} fontSize={48} letterSpacing={10} fill={C.ink}>
                KEDAH
              </text>
              <text x={P(99.72, 6.12)[0]} y={P(99.72, 6.12)[1]} fontFamily="Caveat" fontWeight={700} fontSize={40} fill={C.muted} opacity={1 - z}>
                Langkawi
              </text>
              <g>
                <path
                  d={`M${JEJAWI[0]} ${JEJAWI[1]} C ${JEJAWI[0] + 90} ${JEJAWI[1] + 20}, ${MERGONG[0] - 10} ${MERGONG[1] - 90}, ${MERGONG[0]} ${MERGONG[1]}`}
                  fill="none"
                  stroke={C.maroon}
                  strokeWidth={4 / scale}
                  strokeDasharray={`${12 / scale} ${10 / scale}`}
                  opacity={route}
                />
              </g>
              <g transform={`translate(${JEJAWI[0]} ${JEJAWI[1]}) scale(${1 / scale}) translate(${-JEJAWI[0]} ${-JEJAWI[1]})`}>
                <Pin x={JEJAWI[0]} y={JEJAWI[1]} at={78} label="JEJAWI" left />
              </g>
              <g transform={`translate(${MERGONG[0]} ${MERGONG[1]}) scale(${1 / scale}) translate(${-MERGONG[0]} ${-MERGONG[1]})`}>
                <Pin x={MERGONG[0]} y={MERGONG[1]} at={90} label="MERGONG" />
              </g>
            </g>
          </g>
          <text x={24} y={712} fontFamily="Caveat" fontWeight={700} fontSize={34} fill={C.muted}>
            peta ilustrasi
          </text>
        </svg>
      </div>

      <div style={{position: 'absolute', top: 1300, left: 60, right: 60, display: 'flex', gap: 26}}>
        <Info at={112} name="Jejawi" state="Arau, Perlis" addr="Taman Jejawi, 02600 Arau" />
        <Info at={124} name="Mergong" state="Alor Setar, Kedah" addr="109B, Pusat Perdagangan Tuanku Haminah" />
      </div>
    </Paper>
  );
};
