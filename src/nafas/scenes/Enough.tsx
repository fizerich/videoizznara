import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {at, N, NF} from '../theme';
import {Bg, Brush, Check, clamp, ramp, Stamp, usePop} from '../components';

const t = (s: number) => at('enough', s);

const SIGNS = [
  {n: '1', label: 'Gusi berdarah & karang gigi', at: 36.3},
  {n: '2', label: 'Lidah berlapis putih', at: 36.7},
  {n: '3', label: 'Mulut kerap kering', at: 37.1},
];

export const Enough: React.FC = () => {
  const frame = useCurrentFrame();
  const shrink = ramp(frame, t(38.2), t(38.6));
  const brush = usePop(t(38.42), {damping: 10});
  const scrub = Math.sin(frame / 2.2) * 30 * (frame < t(39.3) ? 1 : 0);

  return (
    <Bg>
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: NF.head,
          fontWeight: 600,
          fontSize: 64,
          color: N.cream,
          opacity: interpolate(frame, [t(36.2), t(36.5)], [0, 1], clamp),
        }}
      >
        Alami tanda-tanda ini?
      </div>

      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 90,
          right: 90,
          transform: `scale(${1 - shrink * 0.2}) translateY(${shrink * -60}px)`,
          transformOrigin: 'center top',
        }}
      >
        {SIGNS.map((s) => {
          const p = ramp(frame, t(s.at), t(s.at) + 8);
          const ck = ramp(frame, t(s.at) + 6, t(s.at) + 14);
          return (
            <div
              key={s.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                background: N.cream,
                borderRadius: 28,
                padding: '20px 30px',
                marginBottom: 24,
                boxShadow: `0 10px 0 ${N.bgDeep}`,
                opacity: p,
                transform: `translateX(${(1 - p) * 200}px)`,
              }}
            >
              <div
                style={{
                  flex: 'none',
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: N.bg,
                  color: N.mint,
                  fontFamily: NF.head,
                  fontWeight: 700,
                  fontSize: 46,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {s.n}
              </div>
              <div style={{flex: 1, fontFamily: NF.head, fontWeight: 600, fontSize: 46, color: N.ink}}>{s.label}</div>
              <svg width={70} height={70} viewBox="-40 -40 80 80">
                <Check x={0} y={0} size={56} p={ck} color="#1aa37a" />
              </svg>
            </div>
          );
        })}
      </div>

      <svg viewBox="0 0 1080 360" width={1080} height={360} style={{position: 'absolute', top: 900, left: 0, overflow: 'visible'}}>
        <g transform={`translate(${520 + scrub} 150) scale(${brush * 1.15}) rotate(-8)`}>
          <Brush x={0} y={0} />
        </g>
        <g opacity={brush} transform="translate(540 300)">
          <text textAnchor="middle" fontFamily={NF.head} fontWeight={600} fontSize={64} fill={N.cream}>
            Gosok gigi sahaja...
          </text>
        </g>
      </svg>

      <div style={{position: 'absolute', top: 1270, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        {frame >= t(39.3) ? (
          <Stamp delay={t(39.36)} bg={N.red} rotate={-4} size={72}>
            Tidak mencukupi!
          </Stamp>
        ) : null}
      </div>
    </Bg>
  );
};
