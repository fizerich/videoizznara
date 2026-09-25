import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {N} from '../theme';
import {Bg, Big, clamp, Cross, Onion, Petai, ramp, StinkLines, usePop} from '../components';

// Muka watak dengan awan nafas berbau
const Face: React.FC<{p: number; stink: number}> = ({p, stink}) => {
  const frame = useCurrentFrame();
  const squint = stink > 0.5;
  const puff = 1 + Math.sin(frame / 5) * 0.04;
  return (
    <svg viewBox="0 0 1080 760" width={1080} height={760} style={{overflow: 'visible'}}>
      <g transform={`translate(360 380) scale(${p})`}>
        {/* kepala */}
        <circle r={230} fill="#f6c89f" stroke={N.ink} strokeWidth={9} />
        <path d="M-230 -30 C -250 -230, 200 -300, 232 -40 C 180 -170, -120 -200, -230 -30 Z" fill="#3a2a26" stroke={N.ink} strokeWidth={9} strokeLinejoin="round" />
        {/* mata */}
        {squint ? (
          <g stroke={N.ink} strokeWidth={12} strokeLinecap="round" fill="none">
            <path d="M-110 -10 L-60 10 L-110 30" />
            <path d="M110 -10 L60 10 L110 30" />
          </g>
        ) : (
          <g>
            <circle cx={-85} cy={10} r={22} fill={N.ink} />
            <circle cx={85} cy={10} r={22} fill={N.ink} />
          </g>
        )}
        <circle cx={-140} cy={90} r={30} fill={N.gum} opacity={0.6} />
        <circle cx={140} cy={90} r={30} fill={N.gum} opacity={0.6} />
        {squint ? (
          <g>
            <path d="M-80 130 Q -40 105 0 130 Q 40 155 80 130 L 80 160 Q 40 185 0 160 Q -40 135 -80 160 Z" fill="#fff" stroke={N.ink} strokeWidth={9} strokeLinejoin="round" />
            <path d="M-40 118 L-40 172 M0 130 L0 160 M40 142 L40 180" stroke={N.ink} strokeWidth={5} />
          </g>
        ) : (
          <g>
            <path d="M-70 110 Q 0 90 70 110 Q 60 190 0 190 Q -60 190 -70 110 Z" fill="#7a1f33" stroke={N.ink} strokeWidth={9} strokeLinejoin="round" />
            <path d="M-40 175 Q 0 150 40 175 Q 20 190 0 190 Q -20 190 -40 175 Z" fill={N.tongue} />
            <rect x={-52} y={104} width={104} height={22} rx={8} fill="#fff" />
          </g>
        )}
      </g>
      {/* awan nafas */}
      <g transform={`translate(720 470) scale(${stink * puff})`} opacity={Math.min(1, stink * 2)}>
        {[
          [0, 0, 110],
          [-110, 30, 80],
          [100, 40, 90],
          [30, -80, 90],
          [-60, -60, 70],
          [150, -40, 70],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={N.stink} stroke={N.stinkDark} strokeWidth={8} />
        ))}
        <circle cx={-40} cy={-10} r={16} fill={N.stinkDark} />
        <circle cx={50} cy={20} r={12} fill={N.stinkDark} />
        <circle cx={120} cy={-50} r={10} fill={N.stinkDark} />
      </g>
      <StinkLines x={740} y={300} p={stink} scale={0.9} />
    </svg>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const petai = usePop(26);
  const onion = usePop(46);
  const x1 = ramp(frame, 34, 44);
  const x2 = ramp(frame, 54, 64);
  const foodUp = ramp(frame, 66, 80);
  const face = usePop(68, {damping: 12, mass: 0.7});
  const stink = ramp(frame, 76, 92);
  const shake = frame > 96 && frame < 112 ? Math.sin(frame * 2.2) * 8 : 0;

  return (
    <Bg>
      <div style={{position: 'absolute', top: 280, left: 0, right: 0, opacity: 1 - foodUp}}>
        <Big delay={2} size={96}>
          Dah elak makan...
        </Big>
      </div>

      <svg
        viewBox="0 0 1080 500"
        width={1080}
        height={500}
        style={{
          position: 'absolute',
          top: 440,
          left: 0,
          overflow: 'visible',
          transform: `translateY(${foodUp * -250}px) scale(${1 - foodUp * 0.42})`,
        }}
      >
        <g transform={`translate(300 240) scale(${petai})`}>
          <Petai x={0} y={0} s={0.95} />
          <Cross x={0} y={0} size={210} p={x1} />
        </g>
        <g transform={`translate(790 240) scale(${onion})`}>
          <Onion x={0} y={10} s={1} />
          <Cross x={0} y={0} size={210} p={x2} />
        </g>
      </svg>

      <div
        style={{
          position: 'absolute',
          top: 760,
          left: 0,
          transform: `translateX(${shake}px)`,
        }}
      >
        {frame >= 66 ? <Face p={face} stink={stink} /> : null}
      </div>

      <div style={{position: 'absolute', top: 590, left: 60, right: 60, opacity: interpolate(frame, [70, 74], [0, 1], clamp)}}>
        <Big delay={72} size={104} color={N.stink} rotate={-3}>
          Tapi nafas tetap berbau?!
        </Big>
      </div>
    </Bg>
  );
};
