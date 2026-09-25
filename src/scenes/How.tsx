import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, F} from '../theme';
import {Chrome, clamp, DrawPath, Kicker, Paper, ramp, Title, useSpring} from '../components/ui';
import {Teeth} from '../components/Teeth';

const Callout: React.FC<{label: string; at: number; style: React.CSSProperties}> = ({label, at, style}) => {
  const s = useSpring(at);
  return (
    <div
      style={{
        position: 'absolute',
        fontFamily: F.head,
        fontWeight: 500,
        fontSize: 40,
        letterSpacing: 4,
        color: C.paper,
        background: C.ink,
        padding: '6px 18px',
        transform: `scale(${s})`,
        ...style,
      }}
    >
      {label}
    </div>
  );
};

export const How: React.FC = () => {
  const frame = useCurrentFrame();
  const brackets = Array.from({length: 8}, (_, i) =>
    interpolate(frame, [18 + i * 4, 28 + i * 4], [0, 1], {...clamp, easing: Easing.out(Easing.back(2.5))}),
  );
  const wire = ramp(frame, 54, 76);
  const crooked = interpolate(frame, [96, 160], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const arrows = ramp(frame, 80, 96) * (1 - ramp(frame, 150, 162));
  const done = useSpring(158);
  const zoom = interpolate(frame, [0, 190], [1.02, 1.12], clamp);

  return (
    <Paper>
      <Chrome />
      <div style={{position: 'absolute', top: 250, left: 80, right: 80}}>
        <Kicker num="02" label="Cara braces berfungsi" />
        <div style={{height: 36}} />
        <Title delay={4} size={96}>
          Gerak <span style={{color: C.maroon}}>sikit demi sikit</span> ke posisi yang betul
        </Title>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 860,
          left: 50,
          right: 50,
          transform: `scale(${zoom})`,
          transformOrigin: '50% 30%',
        }}
      >
        <Teeth crooked={crooked} brackets={brackets} wire={wire} />
        <svg viewBox="0 0 980 320" style={{position: 'absolute', inset: 0, width: '100%', overflow: 'visible'}}>
          <DrawPath d="M190 300 C 200 250, 190 220, 180 190" p={arrows} color={C.maroon} />
          <DrawPath d="M300 40 C 310 80, 305 110, 300 130" p={arrows} color={C.maroon} />
          <DrawPath d="M670 300 C 680 250, 670 220, 660 200" p={arrows} color={C.maroon} />
        </svg>
        <Callout label="BRACKET" at={34} style={{top: 330, left: 70}} />
        <Callout label="WIRE" at={70} style={{top: 330, right: 60}} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1300,
          left: 80,
          right: 80,
          fontFamily: F.body,
          fontSize: 44,
          fontWeight: 600,
          lineHeight: 1.3,
          color: C.ink,
        }}
      >
        <div style={{opacity: ramp(frame, 84, 96)}}>
          Tekanan ringan yang konsisten <span style={{color: C.maroon}}>→</span>
        </div>
        <div
          style={{
            opacity: done,
            transform: `translateY(${(1 - done) * 20}px)`,
            fontFamily: F.hand,
            fontWeight: 700,
            fontSize: 76,
            color: C.maroon,
            marginTop: 6,
          }}
        >
          gigi beralih perlahan-lahan ✓
        </div>
      </div>
    </Paper>
  );
};
