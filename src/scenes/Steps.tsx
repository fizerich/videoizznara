import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Chrome, clamp, Kicker, Paper, Title, useSpring} from '../components/ui';

const STEPS = [
  {t: 'WhatsApp Izznara', d: 'Tanya slot & pilihan braces'},
  {t: 'Pilih tarikh pemeriksaan', d: 'Di Jejawi atau Mergong'},
  {t: 'Doktor periksa gigi', d: 'Termasuk rekod berkaitan'},
  {t: 'Pilihan & anggaran kos', d: 'Diterangkan sebelum mula'},
  {t: 'Pasang & rawatan susulan', d: 'Pemantauan berkala'},
];

const ROW_H = 168;
const START = 30;
const GAP = 22;

const Step: React.FC<{i: number}> = ({i}) => {
  const at = START + i * GAP;
  const s = useSpring(at, {damping: 11, mass: 0.6});
  const txt = useSpring(at + 4);
  return (
    <div style={{position: 'absolute', top: i * ROW_H, left: 0, right: 0, display: 'flex', alignItems: 'center', height: 130}}>
      <div
        style={{
          width: 124,
          height: 124,
          borderRadius: '50%',
          background: i === 4 ? C.maroon : C.white,
          border: `5px solid ${C.maroon}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.head,
          fontWeight: 700,
          fontSize: 64,
          color: i === 4 ? C.paper : C.maroon,
          transform: `scale(${s})`,
          flexShrink: 0,
        }}
      >
        {i + 1}
      </div>
      <div style={{marginLeft: 40, opacity: txt, transform: `translateX(${(1 - txt) * 60}px)`}}>
        <div style={{fontFamily: F.body, fontWeight: 800, fontSize: 50, color: C.ink, lineHeight: 1.1}}>{STEPS[i].t}</div>
        <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 46, color: C.maroon, marginTop: 4}}>{STEPS[i].d}</div>
      </div>
    </div>
  );
};

export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [START, START + GAP * 4], [0, ROW_H * 4], clamp);
  return (
    <Paper>
      <Chrome note="Pertanyaan melalui WhatsApp tidak mewajibkan anda memulakan rawatan." />
      <div style={{position: 'absolute', top: 250, left: 80, right: 80}}>
        <Kicker num="04" label="Macam mana nak mula" />
        <div style={{height: 36}} />
        <Title delay={4} size={104}>
          <span style={{color: C.maroon}}>5 langkah</span> ringkas
        </Title>
      </div>
      <div style={{position: 'absolute', top: 590, left: 80, right: 60, height: ROW_H * 5}}>
        <div
          style={{
            position: 'absolute',
            left: 59,
            top: 65,
            width: 6,
            height: line,
            background: `repeating-linear-gradient(${C.maroon} 0 22px, transparent 22px 36px)`,
          }}
        />
        {STEPS.map((_, i) => (
          <Step key={i} i={i} />
        ))}
      </div>
    </Paper>
  );
};
