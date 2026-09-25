import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp, DrawPath, Hl, Kicker, Paper, ramp, useSpring} from '../components/ui';
import {Teeth} from '../components/Teeth';

const WORDS = [
  {t: 'Gigi berlapis?', at: 8},
  {t: 'Jarang?', at: 26},
  {t: 'Jongang?', at: 44},
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const teethIn = useSpring(4, {damping: 13, mass: 0.9});
  const circle = ramp(frame, 50, 72);
  const tag = useSpring(70);
  const zoom = interpolate(frame, [0, 105], [1, 1.06], clamp);

  return (
    <Paper>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`}}>
        <div style={{position: 'absolute', top: 240, left: 80}}>
          <Kicker num="BRACES" label="Klinik Pergigian Izznara" delay={0} />
        </div>
        <div style={{position: 'absolute', top: 360, left: 80, right: 60}}>
          {WORDS.map((w, i) => {
            const s = useSpring(w.at, {damping: 12, mass: 0.6});
            return (
              <div
                key={w.t}
                style={{
                  fontFamily: F.head,
                  fontWeight: 700,
                  fontSize: 138,
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                  color: i === 0 ? C.ink : C.maroon,
                  opacity: s,
                  transform: `translateX(${(1 - s) * -80}px) rotate(${(1 - s) * -4}deg)`,
                }}
              >
                <Hl p={ramp(frame, w.at + 6, w.at + 18)}>{w.t}</Hl>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            top: 920,
            left: 70,
            right: 70,
            transform: `translateY(${(1 - teethIn) * 200}px)`,
            opacity: teethIn,
          }}
        >
          <Teeth crooked={1} highlight={[1, 2, 5]} highlightP={circle} />
          <svg
            viewBox="0 0 940 420"
            style={{position: 'absolute', top: -60, left: 0, width: '100%', overflow: 'visible'}}
          >
            <DrawPath
              d="M130 70 C 40 90, 60 330, 250 330 C 420 330, 430 110, 330 70 C 260 40, 180 50, 140 80"
              p={circle}
              width={8}
              head={false}
            />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 1290,
            left: 80,
            right: 80,
            fontFamily: F.hand,
            fontWeight: 700,
            fontSize: 62,
            color: C.maroon,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 30}px) rotate(-2deg)`,
          }}
        >
          Tahu tak, ini boleh dibetulkan?
        </div>
      </div>
    </Paper>
  );
};
