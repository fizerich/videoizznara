import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Chrome, Hl, Kicker, Paper, ramp, Title, useSpring} from '../components/ui';

const ITEMS = [
  'Gigi berlapis / tak tersusun',
  'Gigi jarang',
  'Gigi terlalu ke hadapan',
  'Gigitan tidak seimbang',
  'Sukar bersihkan kawasan tertentu',
];

const Row: React.FC<{i: number; text: string; at: number}> = ({i, text, at}) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, {damping: 15, mass: 0.7});
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 34,
        padding: '22px 0',
        borderBottom: `3px solid ${C.ink}`,
        opacity: s,
        transform: `translateX(${(1 - s) * -120}px)`,
      }}
    >
      <div
        style={{
          fontFamily: F.head,
          fontWeight: 700,
          fontSize: 104,
          color: C.maroon,
          width: 140,
          lineHeight: 1,
        }}
      >
        {String(i + 1).padStart(2, '0')}
      </div>
      <div style={{fontFamily: F.body, fontWeight: 800, fontSize: 50, color: C.ink, lineHeight: 1.15}}>
        <Hl p={ramp(frame, at + 8, at + 20)} thick={0.42}>
          {text}
        </Hl>
      </div>
    </div>
  );
};

export const Problems: React.FC = () => (
  <Paper>
    <Chrome note="*Pemeriksaan doktor diperlukan untuk menentukan rawatan yang sesuai." />
    <div style={{position: 'absolute', top: 250, left: 80, right: 80}}>
      <Kicker num="01" label="Masalah biasa" />
      <div style={{height: 36}} />
      <Title delay={4} size={92}>
        Keadaan gigi yang <span style={{color: C.maroon}}>sering dibantu</span> dengan braces
      </Title>
      <div style={{height: 50, borderBottom: `3px solid ${C.ink}`}} />
      {ITEMS.map((t, i) => (
        <Row key={t} i={i} text={t} at={24 + i * 20} />
      ))}
    </div>
  </Paper>
);
