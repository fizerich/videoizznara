import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {data} from '../data';
import {R, useLayout} from './theme';
import {Logo, Safe, rise} from './ui';

const Pin: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill={R.maroon} />
  </svg>
);
const Clock: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <circle cx="12" cy="12" r="10" fill={R.maroon} />
    <path d="M12 6.5V12l4 2.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);
const Chat: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={R.maroon} />
    <circle cx="8" cy="10.5" r="1.4" fill="#fff" />
    <circle cx="12" cy="10.5" r="1.4" fill="#fff" />
    <circle cx="16" cy="10.5" r="1.4" fill="#fff" />
  </svg>
);

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const s = L.s;
  const btn = spring({frame: f - 30, fps, config: {damping: 10, mass: 0.7}});
  const pulse = f > 50 ? 1 + 0.025 * Math.sin((f - 50) / 5) : 1;

  const row: React.CSSProperties = {display: 'flex', alignItems: 'center', gap: 22 * s, textAlign: 'left'};

  return (
    <Safe>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <div style={rise(f, 0, 18, 40)}>
          <Logo width={760 * s} />
        </div>

        <div
          style={{
            ...rise(f, 12),
            marginTop: 40 * s,
            width: '100%',
            background: R.white,
            borderRadius: 36 * s,
            padding: `${36 * s}px ${44 * s}px`,
            boxShadow: '0 20px 50px rgba(31,55,90,0.14)',
            display: 'flex',
            flexDirection: 'column',
            gap: 28 * s,
          }}
        >
          <div style={row}>
            <Pin size={58 * s} />
            <div style={{fontSize: 42 * s, fontWeight: 600, color: R.ink, lineHeight: 1.25}}>{data.lokasi}</div>
          </div>
          <div style={{height: 2, background: R.line}} />
          <div style={row}>
            <Clock size={58 * s} />
            <div style={{fontSize: 42 * s, fontWeight: 600, color: R.ink, lineHeight: 1.25}}>{data.waktuOperasi}</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 44 * s,
            transform: `scale(${btn * pulse})`,
            opacity: Math.min(1, btn * 2),
            background: R.maroon,
            color: '#fff',
            fontSize: 58 * s,
            fontWeight: 800,
            padding: `${34 * s}px ${64 * s}px`,
            borderRadius: 100 * s,
            boxShadow: '0 18px 40px rgba(102,9,32,0.35)',
            textAlign: 'center',
          }}
        >
          {data.cta}
        </div>

        <div style={{...rise(f, 42), marginTop: 36 * s, ...row, gap: 18 * s}}>
          <Chat size={58 * s} />
          <div style={{fontSize: 52 * s, fontWeight: 800, color: R.maroon, letterSpacing: 1}}>
            WhatsApp {data.whatsapp}
          </div>
        </div>

        <div style={{...rise(f, 54, 18, 20), marginTop: 44 * s, fontSize: 28 * s, fontWeight: 400, color: R.muted}}>
          {data.disclaimer}
        </div>
      </div>
    </Safe>
  );
};
