import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {at, N, NF} from '../theme';
import {Bg, Check, Cross, Germ, ramp, SignHeader, Stamp, StinkLines, usePop} from '../components';

const t = (s: number) => at('sign2', s);

const TONGUE = 'M-250 -60 C -290 120, -250 330, -140 420 C -60 480, 60 480, 140 420 C 250 330, 290 120, 250 -60 Z';

const GERMS = [
  [-120, 60, 34],
  [110, 40, 30],
  [-40, 180, 36],
  [150, 200, 30],
  [-170, 250, 28],
  [40, 330, 32],
  [0, 40, 26],
  [-80, 380, 26],
];

const COAT = new Array(26).fill(0).map((_, i) => [
  -230 + random(`cx${i}`) * 460,
  -20 + random(`cy${i}`) * 440,
  30 + random(`cr${i}`) * 50,
]);

export const Sign2: React.FC = () => {
  const frame = useCurrentFrame();
  const tongue = usePop(t(17.8), {damping: 12});
  const coat = ramp(frame, t(19.66), t(20.5));
  const listOn = ramp(frame, t(20.9), t(21.3)) * (1 - ramp(frame, t(23.5), t(23.9)));
  const row1 = ramp(frame, t(21.3), t(21.7));
  const row2 = ramp(frame, t(22.04), t(22.5));
  const germs = GERMS.map((_, i) => usePop(t(24.1) + i * 3, {damping: 9, mass: 0.5}));
  const stink = ramp(frame, t(24.9), t(25.5));
  const wag = Math.sin(frame / 12) * 2;

  return (
    <Bg>
      <SignHeader num="2" delay={t(17.66)} title={<>Lidah ada<br />lapisan putih</>} />

      <svg
        viewBox="-540 -420 1080 960"
        width={1080}
        height={960}
        style={{
          position: 'absolute',
          top: 470,
          left: 0,
          overflow: 'visible',
          transform: `translateY(${listOn * -150}px) scale(${tongue * (1 - listOn * 0.32)})`,
          transformOrigin: '540px 380px',
        }}
      >
        <defs>
          <clipPath id="tongueClip">
            <path d={TONGUE} />
          </clipPath>
        </defs>
        {/* mulut */}
        <rect x={-380} y={-360} width={760} height={380} rx={180} fill="#5a1426" stroke={N.ink} strokeWidth={10} />
        {[-240, -120, 0, 120, 240].map((x) => (
          <rect key={x} x={x - 52} y={-360} width={104} height={90} rx={26} fill={N.tooth} stroke={N.ink} strokeWidth={6} />
        ))}
        <g transform={`rotate(${wag} 0 -60)`}>
          <path d={TONGUE} fill={N.tongue} stroke={N.ink} strokeWidth={10} strokeLinejoin="round" />
          <path d="M0 -40 C -10 120, 10 260, 0 380" fill="none" stroke={N.tongueDark} strokeWidth={12} strokeLinecap="round" />
          <g clipPath="url(#tongueClip)">
            {new Array(40).fill(0).map((_, i) => (
              <circle key={i} cx={-220 + random(`px${i}`) * 440} cy={-40 + random(`py${i}`) * 460} r={6} fill={N.tongueDark} opacity={0.35} />
            ))}
            <g opacity={coat * 0.92}>
              {COAT.map(([cx, cy, r], i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={r * (0.6 + coat * 0.4)} ry={r * 0.7 * (0.6 + coat * 0.4)} fill="#f5f2e9" />
              ))}
            </g>
          </g>
          {GERMS.map(([x, y, r], i) => (
            <Germ key={i} x={x} y={y} r={r} s={germs[i]} seed={i * 0.9} />
          ))}
          <StinkLines x={0} y={-80} p={stink} scale={1.1} count={3} />
        </g>
        {/* label lapisan putih */}
        <g opacity={coat * (1 - listOn)}>
          <path d="M300 250 Q 360 180 220 120" fill="none" stroke={N.cream} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
          <rect x={180} y={250} width={330} height={80} rx={40} fill={N.cream} />
          <text x={345} y={304} textAnchor="middle" fontFamily={NF.head} fontWeight={600} fontSize={44} fill={N.ink}>
            Lapisan putih
          </text>
        </g>
      </svg>

      {/* senarai: gigi dah berus, lidah terlupa */}
      <div
        style={{
          position: 'absolute',
          top: 1010,
          left: 110,
          right: 110,
          opacity: listOn,
          transform: `translateY(${(1 - listOn) * 60}px)`,
        }}
      >
        {[
          {label: 'Berus gigi', ok: true, p: row1},
          {label: 'Bersihkan lidah', ok: false, p: row2},
        ].map((r) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              background: 'rgba(255,247,234,0.1)',
              border: `4px solid ${r.ok ? N.mint : N.coral}`,
              borderRadius: 30,
              padding: '18px 34px',
              marginBottom: 22,
              opacity: 0.35 + r.p * 0.65,
            }}
          >
            <svg width={90} height={90} viewBox="-50 -50 100 100">
              <circle r={44} fill={N.bgDeep} />
              {r.ok ? <Check x={0} y={0} size={60} p={r.p} /> : <Cross x={0} y={0} size={46} p={r.p} />}
            </svg>
            <div style={{fontFamily: NF.head, fontWeight: 600, fontSize: 62, color: N.cream}}>{r.label}</div>
            {r.ok ? null : (
              <div style={{marginLeft: 'auto', fontFamily: NF.head, fontWeight: 700, fontSize: 44, color: N.coral}}>RAMAI LUPA!</div>
            )}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', top: 1130, left: 40}}>
        {frame >= t(24.0) ? (
          <Stamp delay={t(24.12)} bg={N.stink} color={N.ink} rotate={-7} size={46}>
            Sarang bakteria!
          </Stamp>
        ) : null}
      </div>
    </Bg>
  );
};
