import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Chrome, clamp, Hl, Kicker, Paper, ramp, Title, useSpring} from '../components/ui';

type Opt = {
  name: string;
  tag: string;
  pre?: string;
  price?: number;
  priceText?: string;
  sub: string;
  rot: number;
};

const OPTS: Opt[] = [
  {name: 'Conventional Braces', tag: 'Pilihan lebih ekonomi', pre: 'Bermula', price: 3500, sub: 'Deposit RM500 · RM150/bulan', rot: -1.4},
  {name: 'Self-Ligating Braces', tag: 'Sistem bracket moden', price: 5500, sub: 'Deposit RM700', rot: 1.1},
  {name: 'Clear Aligner', tag: 'Pilihan lebih minimal', priceText: 'Harga selepas pemeriksaan', sub: 'Boleh ditanggalkan ikut arahan', rot: -0.8},
];

const Card: React.FC<{o: Opt; at: number}> = ({o, at}) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, {damping: 13, mass: 0.8});
  const count = interpolate(frame, [at + 6, at + 30], [0, o.price ?? 0], clamp);
  const hl = ramp(frame, at + 26, at + 38);
  return (
    <div
      style={{
        position: 'relative',
        background: C.white,
        border: `4px solid ${C.ink}`,
        boxShadow: `10px 10px 0 ${C.maroon}`,
        padding: '22px 34px 20px',
        marginBottom: 34,
        transform: `translateY(${(1 - s) * 260}px) rotate(${o.rot + (1 - s) * 6}deg)`,
        opacity: s,
      }}
    >
      {/* pita pelekat */}
      <div
        style={{
          position: 'absolute',
          top: -22,
          left: 40,
          width: 150,
          height: 40,
          background: 'rgba(232,199,133,0.85)',
          transform: 'rotate(-4deg)',
        }}
      />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20}}>
        <div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 54, textTransform: 'uppercase', color: C.ink, lineHeight: 1.05}}>
            {o.name}
          </div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 48, color: C.maroon, marginTop: 4}}>{o.tag}</div>
        </div>
        <div style={{textAlign: 'right', flexShrink: 0}}>
          {o.pre ? (
            <div style={{fontFamily: F.head, fontWeight: 500, fontSize: 30, letterSpacing: 4, color: C.muted, textTransform: 'uppercase'}}>
              {o.pre}
            </div>
          ) : null}
          {o.price ? (
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 92, color: C.maroon, lineHeight: 1}}>
              <Hl p={hl} thick={0.38}>RM{Math.round(count).toLocaleString('en-US')}</Hl>
            </div>
          ) : (
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 44, color: C.maroon, lineHeight: 1.05, maxWidth: 330}}>
              <Hl p={hl} thick={0.4}>{o.priceText}</Hl>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: `3px dashed ${C.paper2}`,
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 36,
          color: C.ink,
        }}
      >
        {o.sub}
      </div>
    </div>
  );
};

export const Options: React.FC = () => (
  <Paper>
    <Chrome note="Harga akhir & kesesuaian rawatan bergantung pada pemeriksaan doktor. Konsultasi, X-ray, scaling, tampalan, cabutan & retainer tidak termasuk." />
    <div style={{position: 'absolute', top: 230, left: 80, right: 80}}>
      <Kicker num="03" label="Pilihan rawatan" />
      <div style={{height: 36}} />
      <Title delay={4} size={92}>
        Ikut <span style={{color: C.maroon}}>keadaan & bajet</span> anda
      </Title>
      <div style={{height: 44}} />
      {OPTS.map((o, i) => (
        <Card key={o.name} o={o} at={22 + i * 38} />
      ))}
    </div>
  </Paper>
);
