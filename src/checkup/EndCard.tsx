import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {data} from '../data';
import {Logo} from '../reviews/ui';
import {cl, sp} from '../v2/kit';
import {BODY, C, HEAD} from './theme';

const Pin: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill={C.maroon} />
  </svg>
);
const Chat: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={C.maroon} />
    <circle cx="8" cy="10.5" r="1.4" fill="#fff" />
    <circle cx="12" cy="10.5" r="1.4" fill="#fff" />
    <circle cx="16" cy="10.5" r="1.4" fill="#fff" />
  </svg>
);

const rise = (f: number, delay: number, damping = 15) => {
  const p = sp(f, delay, damping, 0.6);
  return {opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`} as const;
};

// Kad penutup: logo + CTA. Mula selepas senyuman klip 6 (59.4s) (frame tempatan 0 = mula kad).
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const bg = interpolate(f, [0, 14], [0, 1], cl);
  const btn = sp(f, 34, 10, 0.7);
  const pulse = f > 56 ? 1 + 0.025 * Math.sin((f - 56) / 5) : 1;
  // kad cawangan: hanya nama + negeri/bandar (bahagian terakhir alamat)
  const branches = data.cawangan.map((c) => ({nama: c.nama, kawasan: c.alamat.split(',').pop()!.trim()}));

  return (
    <AbsoluteFill style={{opacity: bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 0% 0%, rgba(102,9,32,0.22), transparent 42%),
            radial-gradient(circle at 100% 100%, rgba(58,45,156,0.2), transparent 45%),
            linear-gradient(180deg, #f8f8fb, #e7e7ee)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 72,
          width: 936,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: BODY,
        }}
      >
        <div style={rise(f, 6, 18)}>
          <Logo width={740} shineAt={14} />
        </div>

        <div
          style={{
            ...rise(f, 20),
            marginTop: 70,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 74,
            lineHeight: 1.1,
            color: C.ink,
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          JANGAN PANIK,
          <br />
          <span style={{color: C.maroon}}>TANYA DOKTOR KAMI</span>
        </div>

        <div
          style={{
            marginTop: 56,
            transform: `scale(${btn * pulse})`,
            opacity: Math.min(1, btn * 2),
            background: C.maroon,
            color: '#fff',
            fontWeight: 800,
            fontSize: 60,
            padding: '34px 64px',
            borderRadius: 100,
            boxShadow: '0 18px 40px rgba(102,9,32,0.35)',
            textAlign: 'center',
          }}
        >
          {data.cta}
        </div>

        <div style={{...rise(f, 46), marginTop: 44, display: 'flex', alignItems: 'center', gap: 18}}>
          <Chat size={64} />
          <div style={{fontSize: 56, fontWeight: 800, color: C.maroon, letterSpacing: 1}}>WhatsApp {data.whatsapp}</div>
        </div>

        <div style={{...rise(f, 56), marginTop: 44, display: 'flex', gap: 22, justifyContent: 'center'}}>
          {branches.map((b) => (
            <div
              key={b.nama}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fff',
                borderRadius: 999,
                padding: '16px 30px 16px 22px',
                boxShadow: '0 10px 26px rgba(42,7,20,0.12)',
                fontSize: 34,
                fontWeight: 700,
                color: C.ink,
              }}
            >
              <Pin size={40} />
              {b.nama}, {b.kawasan}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
