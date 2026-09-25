import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {at, N, NF} from '../theme';
import {Bg, clamp, Germ, ramp, SignHeader, Stamp, Tooth, usePop} from '../components';

const t = (s: number) => at('sign3', s);

// Titisan air liur (watak)
const Droplet: React.FC<{s: number; mood: 'happy' | 'tired'}> = ({s, mood}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 7) * 8;
  return (
    <g transform={`translate(0 ${bob}) scale(${s})`}>
      <path d="M0 -170 C 60 -80, 120 -10, 120 50 A 120 120 0 0 1 -120 50 C -120 -10, -60 -80, 0 -170 Z" fill={N.water} stroke={N.ink} strokeWidth={9} strokeLinejoin="round" />
      <ellipse cx={-55} cy={10} rx={18} ry={34} fill="#fff" opacity={0.55} />
      {mood === 'happy' ? (
        <g>
          <circle cx={-35} cy={50} r={11} fill={N.ink} />
          <circle cx={35} cy={50} r={11} fill={N.ink} />
          <path d="M-30 85 Q 0 110 30 85" fill="none" stroke={N.ink} strokeWidth={8} strokeLinecap="round" />
        </g>
      ) : (
        <g stroke={N.ink} strokeWidth={8} strokeLinecap="round" fill="none">
          <path d="M-48 50 L-22 50" />
          <path d="M22 50 L48 50" />
          <path d="M-26 100 Q 0 84 26 100" />
        </g>
      )}
    </g>
  );
};

// Bibir kering merekah
const DryLips: React.FC<{p: number}> = ({p}) => (
  <g transform={`scale(${p})`}>
    <path d="M-260 0 C -170 -110, -60 -70, 0 -45 C 60 -70, 170 -110, 260 0 C 150 20, -150 20, -260 0 Z" fill="#d88a8a" stroke={N.ink} strokeWidth={9} strokeLinejoin="round" />
    <path d="M-260 0 C -150 30, 150 30, 260 0 C 170 120, -170 120, -260 0 Z" fill="#e39a98" stroke={N.ink} strokeWidth={9} strokeLinejoin="round" />
    <g stroke="#8c3b44" strokeWidth={6} strokeLinecap="round" fill="none">
      <path d="M-150 -45 l10 30 l-8 18" />
      <path d="M-40 -48 l6 24" />
      <path d="M90 -52 l-8 22 l10 16" />
      <path d="M-110 40 l8 26" />
      <path d="M20 44 l-6 30 l8 12" />
      <path d="M140 38 l-10 28" />
    </g>
  </g>
);

const GRID = new Array(16).fill(0).map((_, i) => [120 + random(`gx${i}`) * 840, 120 + random(`gy${i}`) * 380]);
const DOUBLES = [33.82, 34.3, 34.56, 34.96, 35.26];

export const Sign3: React.FC = () => {
  const frame = useCurrentFrame();
  const lips = usePop(t(26.3), {damping: 12}) * (1 - ramp(frame, t(28.1), t(28.4)));
  const sun = usePop(t(27.5), {damping: 10});
  const drop = usePop(t(28.36), {damping: 10, mass: 0.6});
  const evap = ramp(frame, t(32.5), t(33.6));
  const teeth = usePop(t(29.2), {damping: 13});
  const wash = ramp(frame, t(30.4), t(31.9));
  const hot = ramp(frame, t(32.5), t(33.3));

  let count = 0;
  DOUBLES.forEach((d, i) => {
    if (frame >= t(d)) count = 2 ** (i + 1);
  });
  count = Math.min(16, count);
  const lastD = DOUBLES.filter((d) => frame >= t(d)).pop() ?? 0;
  const bump = frame >= t(33.82) ? interpolate(frame - t(lastD), [0, 4, 10], [1.4, 0.9, 1], clamp) : 0;

  return (
    <Bg top={interpolateColors(hot, [0, 1], [N.bgLite, '#5c5a3c'])}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, rgba(255,160,70,0.35), rgba(120,50,20,0.25))', opacity: hot + lips * 0.6}} />
      <SignHeader num="3" delay={t(26.0)} title={<>Mulut kerap<br />terasa kering</>} />

      <svg viewBox="0 0 1080 900" width={1080} height={900} style={{position: 'absolute', top: 480, left: 0, overflow: 'visible'}}>
        {/* fasa A: bibir kering + matahari */}
        <g transform="translate(540 450)" opacity={lips > 0.01 ? 1 : 0}>
          <DryLips p={lips} />
          {[-120, 0, 120].map((x, i) => (
            <path
              key={x}
              d={`M${x} -170 q 20 -25 0 -50 q -20 -25 0 -50`}
              fill="none"
              stroke={N.sun}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={lips * (0.5 + 0.5 * Math.sin(frame / 5 + i))}
              transform={`translate(0 ${-((frame + i * 12) % 30)})`}
            />
          ))}
        </g>
        <g transform={`translate(880 90) scale(${sun * (1 - ramp(frame, t(28.1), t(28.4)))}) rotate(${frame * 1.5})`}>
          {new Array(10).fill(0).map((_, i) => (
            <rect key={i} x={-10} y={-130} width={20} height={40} rx={10} fill={N.sun} transform={`rotate(${i * 36})`} />
          ))}
          <circle r={75} fill={N.sun} stroke={N.ink} strokeWidth={8} />
        </g>

        {/* fasa B/C: gigi */}
        <g transform={`translate(0 ${(1 - teeth) * 300})`} opacity={teeth}>
          {[230, 420, 610, 800].map((x) => (
            <Tooth key={x} x={x + 25} y={560} w={170} h={230} />
          ))}
          {/* bakteria yang dibasuh air liur */}
          {[
            [290, 600],
            [520, 640],
            [700, 590],
            [860, 630],
          ].map(([x, y], i) => (
            <Germ key={i} x={x + wash * 700} y={y - wash * 60} r={30} s={teeth * (1 - wash)} seed={i} />
          ))}
          {/* ombak air liur */}
          {wash > 0 && wash < 1 ? (
            <g transform={`translate(${-300 + wash * 1500} 0)`}>
              <path
                d="M-520 820 L-520 560 C -400 500, -250 520, -120 470 C -20 430, 60 420, 110 480 C 70 450, 20 470, 30 520 C 40 560, 80 600, 80 820 Z"
                fill={N.water}
                opacity={0.8}
                stroke={N.waterDark}
                strokeWidth={8}
                strokeLinejoin="round"
              />
              {[-420, -300, -180, -60].map((x, i) => (
                <circle key={x} cx={x} cy={540 - i * 18 + Math.sin(frame / 3 + i) * 8} r={16} fill="#fff" opacity={0.8} />
              ))}
            </g>
          ) : null}
        </g>

        {/* titisan air liur */}
        <g transform={`translate(540 ${250 - evap * 40})`}>
          <Droplet s={drop * (1 - evap)} mood={frame > t(32.3) ? 'tired' : 'happy'} />
          {evap > 0 && evap < 1
            ? [-60, 0, 60].map((x, i) => (
                <path
                  key={x}
                  d={`M${x} -60 q 18 -25 0 -50 q -18 -25 0 -50`}
                  fill="none"
                  stroke="#dfe9ec"
                  strokeWidth={10}
                  strokeLinecap="round"
                  opacity={Math.sin(evap * Math.PI)}
                  transform={`translate(0 ${-evap * 80 - i * 10})`}
                />
              ))
            : null}
        </g>

        {/* fasa C: bakteria membiak */}
        {GRID.slice(0, count).map(([x, y], i) => (
          <Germ key={`g${i}`} x={x} y={y} r={34} s={1} seed={i * 0.7} />
        ))}
      </svg>

      {/* label air liur */}
      <div
        style={{
          position: 'absolute',
          top: 905,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: 1 - evap,
        }}
      >
        {frame >= t(29.3) ? (
          <Stamp delay={t(29.4)} bg={N.water} color={N.ink} rotate={-3} size={48}>
            Air liur = pembersih semula jadi
          </Stamp>
        ) : null}
      </div>

      {count > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: 520,
            right: 70,
            fontFamily: NF.head,
            fontWeight: 700,
            fontSize: 150,
            color: N.stink,
            textShadow: `0 10px 0 ${N.bgDeep}`,
            transform: `scale(${bump}) rotate(-6deg)`,
          }}
        >
          ×{count}
        </div>
      ) : null}
      {frame >= t(35.2) ? (
        <div style={{position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Stamp delay={t(35.26)} bg={N.red} rotate={3} size={56}>
            Membiak lebih cepat!
          </Stamp>
        </div>
      ) : null}
    </Bg>
  );
};
