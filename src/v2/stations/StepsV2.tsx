import React from 'react';
import {getLength} from '@remotion/paths';
import {interpolate} from 'remotion';
import {B, cl, D, ez, H, sp, Stage, Tag, Wire} from '../kit';

const STEPS = [
  {t: 'WhatsApp Izznara', d: 'Tanya slot & pilihan braces'},
  {t: 'Pilih tarikh', d: 'Jejawi atau Mergong'},
  {t: 'Pemeriksaan doktor', d: 'Gigi & rekod berkaitan'},
  {t: 'Pelan & anggaran kos', d: 'Diterangkan sebelum mula'},
  {t: 'Pasang & susulan', d: 'Pemantauan berkala'},
];
export const STEP_AT = [15, 45, 75, 105, 135];
const X = 170;
const Y0 = 600;
const DY = 175;

const ENTRY = `M540 -40 C 540 90, 36 80, 36 250 L36 400 C 36 500, ${X} 470, ${X} ${Y0 - 60}`;
const PATH = `${ENTRY} L${X} ${Y0 + DY * 4}`;

export const StepsV2: React.FC<{f: number}> = ({f}) => {
  const total = getLength(PATH);
  const entry = getLength(ENTRY);
  const p = interpolate(
    f,
    [-12, ...STEP_AT],
    [0, ...STEP_AT.map((_, i) => (entry + i * DY) / total)],
    cl,
  );
  const big = ez(f, 0, 30);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          right: -30,
          top: 140,
          fontFamily: H,
          fontWeight: 700,
          fontSize: 900,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: `4px rgba(232,199,133,${0.22 * big})`,
          transform: `translateY(${(1 - big) * 120}px)`,
        }}
      >
        5
      </div>
      <div style={{position: 'absolute', top: 230, left: 80, right: 60}}>
        <Tag text="MACAM MANA NAK MULA" o={ez(f, 0, 10)} />
        <div
          style={{
            marginTop: 20,
            fontFamily: H,
            fontWeight: 700,
            fontSize: 118,
            lineHeight: 1,
            color: D.cream,
            textTransform: 'uppercase',
            opacity: sp(f, 4),
          }}
        >
          <span style={{color: D.gold}}>5</span> langkah
        </div>
      </div>

      <Stage>
        <Wire d={PATH} p={p} spark={f < STEP_AT[4]} />
        <Wire d={`M${X} ${Y0 + DY * 4} C ${X} 1650, 540 1640, 540 1960`} p={ez(f, 152, 182)} />
      </Stage>

      {STEPS.map((s, i) => {
        const on = sp(f, STEP_AT[i], 9);
        const txt = sp(f, STEP_AT[i] + 3, 14);
        const lit = f >= STEP_AT[i];
        return (
          <div key={s.t} style={{position: 'absolute', left: X - 60, top: Y0 + i * DY - 60, display: 'flex', alignItems: 'center'}}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                border: `5px solid ${D.gold}`,
                background: lit ? D.crimson : D.bg,
                boxShadow: lit ? `0 0 ${40 * on}px rgba(232,199,133,0.7)` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: H,
                fontWeight: 700,
                fontSize: 62,
                color: D.cream,
                transform: `scale(${0.6 + 0.4 * Math.min(on, 1.2)})`,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{marginLeft: 40, opacity: txt, transform: `translateX(${(1 - txt) * 80}px)`}}>
              <div style={{fontFamily: B, fontWeight: 800, fontSize: 50, color: D.cream, lineHeight: 1.1}}>{s.t}</div>
              <div style={{fontFamily: B, fontWeight: 600, fontSize: 32, color: D.gold, marginTop: 6}}>{s.d}</div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 360,
          fontFamily: B,
          fontSize: 27,
          color: D.dim,
          opacity: ez(f, 140, 155),
        }}
      >
        Pertanyaan melalui WhatsApp tidak mewajibkan anda memulakan rawatan.
      </div>
    </>
  );
};
