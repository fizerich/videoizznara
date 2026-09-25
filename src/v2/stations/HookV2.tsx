import React from 'react';
import {interpolate} from 'remotion';
import {cl, D, ez, H, sp, Stage, Wire} from '../kit';
import {Logo} from '../../components/ui';

// Perkataan "menghentak" masuk dengan gema garis luar
export const Slam: React.FC<{f: number; at: number; size: number; color?: string; children: React.ReactNode}> = ({
  f,
  at,
  size,
  color = D.cream,
  children,
}) => {
  const s = sp(f, at, 12, 0.6);
  if (f < at) return null;
  const echo = ez(f, at, at + 14);
  const base: React.CSSProperties = {
    fontFamily: H,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 1,
    textTransform: 'uppercase',
    letterSpacing: 2,
    whiteSpace: 'nowrap',
  };
  return (
    <div style={{position: 'relative', display: 'inline-block'}}>
      <div
        style={{
          ...base,
          position: 'absolute',
          inset: 0,
          color: 'transparent',
          WebkitTextStroke: `3px ${D.gold}`,
          transform: `scale(${1 + echo * 0.35})`,
          opacity: (1 - echo) * 0.7,
        }}
      >
        {children}
      </div>
      <div
        style={{
          ...base,
          color,
          transform: `scale(${1.7 - s * 0.7})`,
          filter: `blur(${(1 - Math.min(s, 1)) * 14}px)`,
          opacity: Math.min(1, s * 1.5),
          textShadow: '0 10px 40px rgba(0,0,0,0.6)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Q = [
  {t: 'Gigi berlapis?', at: 15},
  {t: 'Jarang?', at: 30},
  {t: 'Jongang?', at: 45},
];

export const HookV2: React.FC<{f: number}> = ({f}) => {
  const phaseA = f < 72;
  const qOut = ez(f, 62, 72);
  const logo = ez(f, 0, 20);
  return (
    <>
      <div style={{position: 'absolute', top: 190, left: 0, right: 0, textAlign: 'center', opacity: logo * 0.9}}>
        <Logo white height={70} />
      </div>

      {phaseA ? (
        <div
          style={{
            position: 'absolute',
            top: 560,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 26,
            opacity: 1 - qOut,
            transform: `scale(${1 - qOut * 0.2})`,
          }}
        >
          {Q.map((q, i) => (
            <Slam key={q.t} f={f} at={q.at} size={i === 0 ? 150 : 190} color={i === 0 ? D.cream : D.crimson}>
              {q.t}
            </Slam>
          ))}
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 560,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Slam f={f} at={75} size={170}>
            Jom
          </Slam>
          <Slam f={f} at={88} size={210} color={D.gold}>
            Susun
          </Slam>
          <Slam f={f} at={100} size={170}>
            Semula.
          </Slam>
        </div>
      )}

      <Stage>
        {/* garis bawah "SEMULA" yang terus menjadi wayar ke babak seterusnya */}
        <Wire d="M160 1170 L920 1170 C 1000 1170, 1000 1400, 820 1500 C 640 1600, 540 1700, 540 1960" p={ez(f, 104, 122)} />
      </Stage>

      <div
        style={{
          position: 'absolute',
          bottom: 360,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: H,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: 12,
          color: D.gold,
          opacity: interpolate(f, [40, 55, 64, 72], [0, 1, 1, 0], cl),
        }}
      >
        BRACES · JEJAWI & MERGONG
      </div>
    </>
  );
};
