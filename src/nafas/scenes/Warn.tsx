import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {at, N, NF} from '../theme';
import {Bg, Big, clamp, Cross, Onion, Petai, ramp, Tooth, usePop} from '../components';

const t = (s: number) => at('warn', s);

export const Warn: React.FC = () => {
  const frame = useCurrentFrame();
  const tri = usePop(t(4.16), {damping: 8, mass: 0.6});
  const wiggle = Math.sin(frame / 2.2) * 6 * Math.max(0, 1 - Math.abs(frame - 18) / 18);
  const foods = usePop(t(5.9));
  const x = ramp(frame, t(6.1), t(6.5));
  const lens = ramp(frame, t(6.9), t(7.4));
  const sweep = Math.sin(frame / 7) * 120;
  const q = usePop(t(7.3));

  return (
    <Bg top="#1c5b63">
      {/* segi tiga amaran */}
      <div style={{position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <svg width={300} height={270} viewBox="-150 -140 300 270" style={{transform: `scale(${tri}) rotate(${wiggle}deg)`, overflow: 'visible'}}>
          <path d="M0 -120 L135 110 L-135 110 Z" fill={N.sun} stroke={N.ink} strokeWidth={12} strokeLinejoin="round" />
          <rect x={-14} y={-50} width={28} height={100} rx={14} fill={N.ink} />
          <circle cx={0} cy={80} r={16} fill={N.ink} />
        </svg>
      </div>

      <div style={{position: 'absolute', top: 570, left: 60, right: 60}}>
        <Big delay={t(4.2)} size={120} color={N.sun}>
          Hati-hati!
        </Big>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 720,
          left: 80,
          right: 80,
          textAlign: 'center',
          fontFamily: NF.head,
          fontWeight: 600,
          fontSize: 66,
          lineHeight: 1.15,
          color: N.cream,
          opacity: interpolate(frame, [t(4.96), t(5.2)], [0, 1], clamp),
        }}
      >
        Puncanya mungkin <span style={{color: N.coral}}>BUKAN</span> daripada makanan
      </div>

      {/* makanan dipangkah, kemudian kanta pembesar ke gigi */}
      <svg viewBox="0 0 1080 460" width={1080} height={460} style={{position: 'absolute', top: 930, left: 0, overflow: 'visible'}}>
        <g opacity={1 - lens} transform={`translate(540 220) scale(${foods * (1 - lens * 0.3)})`}>
          <Petai x={-200} y={0} s={0.6} />
          <Onion x={200} y={10} s={0.7} />
          <Cross x={0} y={0} size={170} p={x} />
        </g>
        <g opacity={lens} transform={`translate(540 120) scale(${0.6 + lens * 0.4})`}>
          <Tooth x={-230} y={0} w={200} h={240} />
          <Tooth x={0} y={0} w={200} h={240} />
          <Tooth x={230} y={0} w={200} h={240} />
          <g transform={`translate(${sweep} 110)`}>
            <circle r={120} fill="rgba(201,245,232,0.35)" stroke={N.ink} strokeWidth={16} />
            <circle r={120} fill="none" stroke={N.mint} strokeWidth={6} />
            <path d="M85 85 L180 180" stroke={N.ink} strokeWidth={36} strokeLinecap="round" />
            <path d="M85 85 L180 180" stroke={N.coral} strokeWidth={20} strokeLinecap="round" />
          </g>
          <text x={330} y={-10} fontFamily={NF.head} fontWeight={700} fontSize={130} fill={N.sun} transform={`scale(${q})`} style={{transformBox: 'fill-box', transformOrigin: 'center'}}>
            ?
          </text>
        </g>
      </svg>
    </Bg>
  );
};
