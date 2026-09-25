import React from 'react';
import {Easing, interpolate} from 'remotion';
import {BEAT, B, cl, D, ez, H, sp, Stage, Wire} from '../kit';
import {Teeth} from '../../components/Teeth';
import {Slam} from './HookV2';

export const BRACKET_AT = Array.from({length: 8}, (_, i) => Math.round(15 + (i * BEAT) / 2));

export const BracesV2: React.FC<{f: number}> = ({f}) => {
  const brackets = BRACKET_AT.map((at) =>
    interpolate(f, [at, at + 6], [0, 1], {...cl, easing: Easing.out(Easing.back(3))}),
  );
  const wire = ez(f, 66, 84);
  const crooked = interpolate(f, [92, 140], [1, 0], {...cl, easing: Easing.inOut(Easing.cubic)});
  const teethIn = sp(f, 4, 14);
  const shine = interpolate(f, [138, 162], [-0.3, 1.3], cl);
  const done = sp(f, 142, 10);
  const sub = ez(f, 18, 30);

  return (
    <>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center'}}>
        <Slam f={f} at={0} size={250} color={D.cream}>
          Braces
        </Slam>
        <div
          style={{
            marginTop: 24,
            fontFamily: B,
            fontWeight: 600,
            fontSize: 46,
            color: D.dim,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          Susun gigi, <span style={{color: D.gold}}>sikit demi sikit.</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 820,
          left: 60,
          right: 60,
          opacity: teethIn,
          transform: `translateY(${(1 - teethIn) * 160}px)`,
          filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))',
        }}
      >
        <Teeth crooked={crooked} brackets={brackets} wire={wire} />
        {/* kilauan selepas tersusun */}
        <div
          style={{
            position: 'absolute',
            inset: '60px 0 0 0',
            background: `linear-gradient(100deg, transparent ${shine * 100 - 12}%, rgba(255,246,220,0.75) ${shine * 100}%, transparent ${shine * 100 + 12}%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1170,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: Math.min(1, done),
          transform: `scale(${0.6 + done * 0.4})`,
        }}
      >
        <span
          style={{
            fontFamily: H,
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: 8,
            color: D.bg,
            background: D.gold,
            padding: '8px 30px',
          }}
        >
          ✓ LEBIH TERSUSUN
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 350,
          left: 90,
          right: 90,
          textAlign: 'center',
          fontFamily: B,
          fontSize: 27,
          color: D.dim,
          opacity: ez(f, 20, 34),
        }}
      >
        *Ilustrasi sahaja. Tempoh & hasil rawatan berbeza mengikut keadaan individu.
      </div>

      <Stage>
        <Wire d="M540 -40 C 540 120, 30 110, 30 420 L30 760 C 30 880, 50 910, 50 950" p={ez(f, -12, 14)} />
        <Wire d="M1030 950 C 1060 1250, 700 1330, 600 1480 C 550 1560, 540 1700, 540 1960" p={ez(f, 150, 182)} />
      </Stage>
    </>
  );
};
