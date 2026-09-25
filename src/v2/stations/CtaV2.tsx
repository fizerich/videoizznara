import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {B, BEAT, cl, D, ez, H, sp, Stage, Spark, Tag, Wire} from '../kit';
import {Logo} from '../../components/ui';

export const END_HIT = 180; // frame 1080 global — hentakan penutup muzik

const SMILE = 'M540 -40 C 540 60, 60 100, 60 400 C 60 640, 150 700, 150 820 C 260 1080, 820 1080, 930 820';

export const CtaV2: React.FC<{f: number}> = ({f}) => {
  const smileP = ez(f, -12, 42);
  const logo = sp(f, 18, 14);
  const head = sp(f, 30, 14);
  const btn = sp(f, 55, 10);
  const pulse = f > 70 ? 1 + 0.04 * Math.exp(-((f - 70) % BEAT) / 4) : 1;
  const info = sp(f, 75, 14);
  const flash = interpolate(f, [END_HIT - 1, END_HIT, END_HIT + 14], [0, 0.7, 0], cl);
  const fam = sp(f, END_HIT, 12);

  return (
    <>
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{opacity: logo, transform: `scale(${0.8 + logo * 0.2})`}}>
          <Logo white height={150} />
        </div>
        <div style={{height: 64, marginTop: 14}}>
          {f >= END_HIT ? <Tag text="YOUR FAMILY DENTIST" o={Math.min(1, fam)} /> : null}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 190,
          right: 140,
          textAlign: 'center',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 100,
          lineHeight: 1.02,
          color: D.cream,
          textTransform: 'uppercase',
          opacity: head,
          transform: `translateY(${(1 - head) * 40}px)`,
        }}
      >
        Mulakan perjalanan <span style={{color: D.gold}}>senyuman</span> anda
      </div>

      <Stage>
        <Wire d={SMILE} p={smileP} width={11} />
        {smileP >= 1 ? (
          <>
            <Spark x={150} y={820} s={0.55 + 0.1 * Math.sin(f / 5)} />
            <Spark x={930} y={820} s={0.55 + 0.1 * Math.cos(f / 5)} />
          </>
        ) : null}
      </Stage>

      <div style={{position: 'absolute', top: 1070, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            background: `linear-gradient(180deg, ${D.goldHi}, ${D.gold})`,
            color: D.bg,
            borderRadius: 999,
            padding: '26px 52px',
            fontFamily: H,
            fontWeight: 700,
            fontSize: 66,
            letterSpacing: 1,
            boxShadow: `0 0 ${50 * (pulse - 1) * 25}px rgba(232,199,133,0.8), 0 20px 50px rgba(0,0,0,0.5)`,
            transform: `scale(${btn * pulse})`,
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64">
            <path
              d="M32 6 C17 6 6 17 6 31 c0 5 1.4 9.6 3.9 13.5 L6 58 l14-3.7 C23.6 56.6 27.7 57.8 32 57.8 C47 57.8 58 46.4 58 32 S47 6 32 6 Z"
              fill={D.bg}
            />
            <path
              d="M24 20c-1-2-2-2-3-2s-2 0-3 1-3 3-3 7 3 8 3.5 8.5S24 44 32 47c6.5 2.5 8 2 9.5 1.8s4.5-2 5-3.8.5-3.4.4-3.8-.6-.6-1.4-1l-5-2.4c-.7-.3-1.2-.4-1.7.4s-2 2.4-2.4 2.9-.9.6-1.7.2-3.3-1.2-6.2-3.8c-2.3-2-3.9-4.6-4.3-5.4s0-1.2.3-1.6l1.2-1.4c.4-.5.5-.8.8-1.4s.1-1-.1-1.4Z"
              fill={D.gold}
            />
          </svg>
          011-7027 2360
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1240,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: info,
          transform: `translateY(${(1 - info) * 30}px)`,
        }}
      >
        <div style={{fontFamily: B, fontWeight: 700, fontSize: 40, color: D.cream}}>WhatsApp untuk semak slot pemeriksaan</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 18, marginTop: 28}}>
          {['Jejawi · Perlis', 'Mergong · Alor Setar'].map((b) => (
            <div
              key={b}
              style={{
                fontFamily: H,
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: 3,
                color: D.gold,
                border: `2px solid ${D.gold}`,
                borderRadius: 999,
                padding: '8px 26px',
                textTransform: 'uppercase',
              }}
            >
              {b}
            </div>
          ))}
        </div>
        <div style={{fontFamily: B, fontSize: 25, color: D.dim, marginTop: 26}}>
          Pertanyaan melalui WhatsApp tidak mewajibkan anda memulakan rawatan.
        </div>
      </div>

      <AbsoluteFill style={{background: D.goldHi, opacity: flash, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      {/* fade ke hitam di hujung */}
      <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [250, 270], [0, 1], cl)}} />
    </>
  );
};
