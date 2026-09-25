import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Logo, Paper, useSpring} from '../components/ui';

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSpring(4, {damping: 14});
  const head = useSpring(14);
  const btn = useSpring(30, {damping: 10, mass: 0.7});
  const info = useSpring(44);
  const pulse = 1 + Math.max(0, Math.sin((frame - 50) / 7)) * 0.035 * (frame > 50 ? 1 : 0);

  return (
    <Paper color={C.maroon}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 22px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 70px',
        }}
      >
        <div style={{opacity: logo, transform: `scale(${0.8 + logo * 0.2})`}}>
          <Logo white height={170} />
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: F.hand,
            fontWeight: 700,
            fontSize: 60,
            color: C.gold,
            opacity: logo,
          }}
        >
          Your Family Dentist
        </div>

        <div
          style={{
            marginTop: 90,
            fontFamily: F.head,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1.04,
            textTransform: 'uppercase',
            color: C.paper,
            opacity: head,
            transform: `translateY(${(1 - head) * 40}px)`,
          }}
        >
          Mulakan perjalanan <span style={{color: C.gold}}>senyuman</span> anda
        </div>

        <div
          style={{
            marginTop: 80,
            background: C.gold,
            color: C.ink,
            border: `5px solid ${C.ink}`,
            boxShadow: `10px 10px 0 ${C.maroonDark}`,
            padding: '26px 50px',
            fontFamily: F.head,
            fontWeight: 700,
            fontSize: 62,
            letterSpacing: 1,
            transform: `scale(${btn * pulse})`,
          }}
        >
          WHATSAPP 011-7027 2360
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: F.body,
            fontWeight: 600,
            fontSize: 38,
            color: C.paper,
            opacity: info,
          }}
        >
          untuk semak slot pemeriksaan braces
        </div>

        <div
          style={{
            marginTop: 70,
            display: 'flex',
            gap: 22,
            opacity: info,
            transform: `translateY(${(1 - info) * 30}px)`,
          }}
        >
          {['Jejawi, Perlis', 'Mergong, Alor Setar'].map((b) => (
            <div
              key={b}
              style={{
                border: `3px solid ${C.gold}`,
                color: C.gold,
                padding: '10px 22px',
                fontFamily: F.head,
                fontWeight: 500,
                fontSize: 38,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              📍 {b}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: F.body,
            fontSize: 30,
            color: 'rgba(244,236,223,0.8)',
            opacity: interpolate(frame, [60, 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}
        >
          Tel: 016-723 9772
        </div>
      </div>
    </Paper>
  );
};
