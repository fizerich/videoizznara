import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {at, N, NF} from '../theme';
import {Bg, Germ, ramp, SignHeader, Stamp, StinkLines, Tooth, toothPath, usePop} from '../components';

const t = (s: number) => at('sign1', s);

const CX = [300, 540, 780];
const TW = 240;
const TH = 330;
const TY = 120;
const GUM_Y = 290;

const gumCurve = (dy = 0) =>
  CX.map((cx) => `Q${cx} ${410 - dy} ${cx + TW / 2} ${GUM_Y - dy}`).join(' ');

const GERMS = [
  [230, 250, 30],
  [345, 262, 26],
  [480, 245, 32],
  [600, 262, 26],
  [720, 250, 30],
  [840, 262, 26],
];

// Titisan darah
const Drop: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  if (p <= 0) return null;
  const fall = Math.max(0, p - 0.5) * 2;
  return (
    <g transform={`translate(${x} ${y + fall * 90}) scale(${Math.min(1, p * 2)})`} opacity={1 - Math.max(0, fall - 0.7) * 3}>
      <path d="M0 -30 C 14 -8, 22 6, 22 16 A 22 22 0 0 1 -22 16 C -22 6, -14 -8, 0 -30 Z" fill={N.red} stroke={N.ink} strokeWidth={5} />
      <ellipse cx={-7} cy={10} rx={5} ry={8} fill="#fff" opacity={0.6} />
    </g>
  );
};

export const Sign1: React.FC = () => {
  const frame = useCurrentFrame();
  const teeth = usePop(t(8.3), {damping: 13});
  const blood = [ramp(frame, t(9.58), t(10.6)), ramp(frame, t(9.8), t(10.8))];
  const gumRed = ramp(frame, t(9.4), t(9.9));
  const tartar = ramp(frame, t(10.66), t(11.6));
  const zoom = ramp(frame, t(12.0), t(12.7));
  const germs = GERMS.map((_, i) => usePop(t(12.3) + i * 4, {damping: 9, mass: 0.5}));
  const stink = ramp(frame, t(14.64), t(15.3));
  const lbl1 = usePop(t(9.6));
  const lbl2 = usePop(t(10.7));

  return (
    <Bg>
      <SignHeader num="1" delay={t(8.28)} title={<>Gusi berdarah &amp;<br />karang gigi tebal</>} />

      <svg
        viewBox="0 0 1080 820"
        width={1080}
        height={820}
        style={{
          position: 'absolute',
          top: 520,
          left: 0,
          overflow: 'visible',
          transform: `scale(${teeth * (1 + zoom * 0.22)}) translateY(${zoom * 40}px)`,
          transformOrigin: '540px 300px',
        }}
      >
        <defs>
          <clipPath id="teethClip">
            {CX.map((cx) => (
              <path key={cx} d={toothPath(TW, TH)} transform={`translate(${cx} ${TY})`} />
            ))}
          </clipPath>
        </defs>

        {CX.map((cx) => (
          <Tooth key={cx} x={cx} y={TY} w={TW} h={TH} />
        ))}

        {/* karang gigi */}
        <g clipPath="url(#teethClip)">
          <path
            d={`M${CX[0] - TW / 2} ${GUM_Y} ${gumCurve(0)} L${CX[2] + TW / 2} ${GUM_Y - 110 * tartar} ${[...CX]
              .reverse()
              .map((cx) => `Q${cx} ${410 - 110 * tartar - 20} ${cx - TW / 2} ${GUM_Y - 110 * tartar}`)
              .join(' ')} Z`}
            fill={N.tartar}
            stroke={N.tartarDark}
            strokeWidth={6}
          />
          {tartar > 0
            ? new Array(14).fill(0).map((_, i) => (
                <circle
                  key={i}
                  cx={CX[0] - 100 + i * 50}
                  cy={GUM_Y + 20 - 90 * tartar + (i % 3) * 14}
                  r={14 * tartar}
                  fill={N.tartarDark}
                  opacity={0.45}
                />
              ))
            : null}
        </g>

        {/* gusi */}
        <path
          d={`M-300 ${GUM_Y} L${CX[0] - TW / 2} ${GUM_Y} ${gumCurve()} L1380 ${GUM_Y} L1380 690 Q540 780 -300 690 Z`}
          fill={interpolateColors(gumRed, [0, 1], [N.gum, '#ee7f8f'])}
          stroke={N.ink}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* kemerahan radang di tepi gusi */}
        <path d={`M${CX[0] - TW / 2} ${GUM_Y + 4} ${gumCurve(-4)}`} fill="none" stroke={N.red} strokeWidth={14 * gumRed} strokeLinecap="round" opacity={0.7} />
        <Drop x={CX[0] + TW / 2} y={GUM_Y + 26} p={blood[0]} />
        <Drop x={CX[1] + TW / 2} y={GUM_Y + 26} p={blood[1]} />

        {GERMS.map(([x, y, r], i) => (
          <Germ key={i} x={x} y={y} r={r} s={germs[i]} seed={i * 1.3} />
        ))}
        <StinkLines x={540} y={200} p={stink} scale={1.1} count={4} />

        {/* label */}
        <g opacity={lbl1 * (1 - zoom)} transform={`translate(0 ${(1 - lbl1) * 20})`}>
          <path d="M250 620 Q 320 560 400 420" fill="none" stroke={N.cream} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
          <rect x={90} y={612} width={340} height={80} rx={40} fill={N.red} />
          <text x={260} y={666} textAnchor="middle" fontFamily={NF.head} fontWeight={600} fontSize={44} fill={N.cream}>
            Gusi berdarah
          </text>
        </g>
        <g opacity={lbl2 * (1 - zoom)} transform={`translate(0 ${(1 - lbl2) * 20})`}>
          <path d="M880 620 Q 880 480 800 300" fill="none" stroke={N.cream} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
          <rect x={660} y={612} width={340} height={80} rx={40} fill={N.tartar} />
          <text x={830} y={666} textAnchor="middle" fontFamily={NF.head} fontWeight={600} fontSize={44} fill={N.ink}>
            Karang gigi
          </text>
        </g>
      </svg>

      <div style={{position: 'absolute', top: 1235, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        {frame >= t(14.8) ? (
          <Stamp delay={t(14.86)} bg={N.stink} color={N.ink} rotate={-4} size={58}>
            Punca utama bau!
          </Stamp>
        ) : frame >= t(12.2) ? (
          <Stamp delay={t(12.3)} bg={N.cream} color={N.ink} rotate={3} size={50}>
            Bakteria terperangkap!
          </Stamp>
        ) : null}
      </div>
    </Bg>
  );
};
