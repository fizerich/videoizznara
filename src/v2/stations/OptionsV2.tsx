import React from 'react';
import {getLength} from '@remotion/paths';
import {interpolate, Easing} from 'remotion';
import {B, cl, D, ez, H, sp, Stage, Tag, Wire} from '../kit';

// Nombor bergolek ala mesin slot
const Roll: React.FC<{text: string; p: number; size: number}> = ({text, p, size}) => {
  const h = size * 1.08;
  let di = 0;
  return (
    <div style={{display: 'flex', fontFamily: H, fontWeight: 700, fontSize: size, lineHeight: `${h}px`, color: D.gold}}>
      {text.split('').map((ch, i) => {
        if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
        const target = Number(ch);
        const k = di++;
        const local = interpolate(p, [k * 0.08, 0.7 + k * 0.08], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
        const pos = (20 + target) * local; // dua pusingan penuh kemudian berhenti
        return (
          <span key={i} style={{display: 'inline-block', height: h, overflow: 'hidden', verticalAlign: 'top'}}>
            <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-pos * h}px)`}}>
              {Array.from({length: 31}, (_, n) => (
                <span key={n} style={{height: h}}>
                  {n % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};

type Opt = {name: string; label: string; pre?: string; price?: string; text?: string; sub: string};
const OPTS: Opt[] = [
  {name: 'Conventional', label: 'Pilihan lebih ekonomi', pre: 'BERMULA', price: 'RM3,500', sub: 'Deposit RM500 · RM150/bulan'},
  {name: 'Self-Ligating', label: 'Sistem bracket moden', price: 'RM5,500', sub: 'Deposit RM700'},
  {name: 'Clear Aligner', label: 'Pilihan lebih minimal', text: 'Harga selepas pemeriksaan', sub: 'Boleh ditanggalkan ikut arahan'},
];
export const CARD_AT = [15, 45, 75];
export const CARD_Y = [540, 830, 1120];
const CARD_H = 250;

const ENTRY = 'M540 -40 C 540 90, 110 60, 110 220 L110 540';
const RAIL = `${ENTRY} L110 1420`;

export const OptionsV2: React.FC<{f: number}> = ({f}) => {
  const total = getLength(RAIL);
  const entry = getLength(ENTRY);
  const railP = interpolate(
    f,
    [-12, 12, ...CARD_AT.map((a) => a + 2), 110],
    [0, entry / total, ...CARD_Y.map((y) => (entry + (y + CARD_H / 2 - 540)) / total), 1],
    cl,
  );

  return (
    <>
      <div style={{position: 'absolute', top: 230, left: 170, right: 60}}>
        <Tag text="3 PILIHAN" o={ez(f, 0, 10)} />
        <div
          style={{
            marginTop: 20,
            fontFamily: H,
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 1,
            color: D.cream,
            textTransform: 'uppercase',
            opacity: sp(f, 4),
            transform: `translateY(${(1 - sp(f, 4)) * 40}px)`,
          }}
        >
          Ikut <span style={{color: D.gold}}>bajet</span> anda
        </div>
      </div>

      {OPTS.map((o, i) => {
        const s = sp(f, CARD_AT[i], 14);
        const roll = ez(f, CARD_AT[i] + 4, CARD_AT[i] + 26);
        const node = sp(f, CARD_AT[i] + 2, 8);
        return (
          <React.Fragment key={o.name}>
            <div
              style={{
                position: 'absolute',
                left: 110 - 22,
                top: CARD_Y[i] + CARD_H / 2 - 22,
                width: 44,
                height: 44,
                borderRadius: 22,
                background: D.gold,
                boxShadow: `0 0 30px ${D.gold}`,
                transform: `scale(${node})`,
                zIndex: 2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 170,
                right: 50,
                top: CARD_Y[i],
                height: CARD_H,
                background: D.card,
                border: `2px solid rgba(232,199,133,0.55)`,
                borderLeft: `8px solid ${D.gold}`,
                borderRadius: 18,
                padding: '26px 34px',
                boxSizing: 'border-box',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                transform: `translateX(${(1 - s) * 900}px) skewX(${(1 - s) * -12}deg)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <div style={{fontFamily: H, fontWeight: 700, fontSize: 58, color: D.cream, textTransform: 'uppercase', lineHeight: 1}}>
                    {o.name}
                  </div>
                  <div style={{fontFamily: B, fontWeight: 600, fontSize: 30, color: D.crimson, marginTop: 10, filter: 'brightness(1.4)'}}>
                    {o.label}
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  {o.pre ? (
                    <div style={{fontFamily: H, fontWeight: 500, fontSize: 26, letterSpacing: 6, color: D.dim}}>{o.pre}</div>
                  ) : null}
                  {o.price ? (
                    <Roll text={o.price} p={roll} size={84} />
                  ) : (
                    <div
                      style={{
                        fontFamily: H,
                        fontWeight: 700,
                        fontSize: 42,
                        lineHeight: 1.05,
                        color: D.gold,
                        maxWidth: 300,
                        opacity: roll,
                      }}
                    >
                      {o.text}
                    </div>
                  )}
                </div>
              </div>
              <div style={{fontFamily: B, fontWeight: 600, fontSize: 32, color: D.cream, opacity: 0.85}}>{o.sub}</div>
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 170,
          right: 60,
          top: 1400,
          fontFamily: B,
          fontSize: 26,
          lineHeight: 1.4,
          color: D.dim,
          opacity: ez(f, 90, 105),
        }}
      >
        Harga akhir & kesesuaian bergantung pada pemeriksaan doktor. Konsultasi, X-ray, scaling, tampalan, cabutan & retainer
        tidak termasuk.
      </div>

      <Stage>
        <Wire d={RAIL} p={railP} spark={railP < 0.999} />
        <Wire d="M110 1420 C 110 1700, 540 1640, 540 1960" p={ez(f, 152, 182)} />
      </Stage>
    </>
  );
};
