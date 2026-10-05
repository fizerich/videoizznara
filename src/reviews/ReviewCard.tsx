import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Review} from '../data';
import {data} from '../data';
import {CARD, R, useLayout} from './theme';
import {Safe, Stars, clamp, easeOut, rise} from './ui';

// Warna avatar ala Google (ditetapkan ikut nama, jadi sentiasa sama)
const AVATAR = ['#e8710a', '#1a73e8', '#188038', '#a142f4', '#d93025', '#129eaf', '#b06000'];
const avatarColor = (name: string) => AVATAR[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR.length];
const initial = (name: string) => (name.trim()[0] ?? '?').toLocaleUpperCase('ms-MY');

const Words: React.FC<{text: string; start: number; size: number}> = ({text, start, size}) => {
  const f = useCurrentFrame();
  const words = text.split(/\s+/);
  return (
    <div style={{fontSize: size, lineHeight: 1.45, color: R.ink, fontWeight: 400}}>
      {words.map((w, i) => {
        const p = interpolate(f, [start + i * 1.2, start + i * 1.2 + 12], [0, 1], {...clamp, easing: easeOut});
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 26}px)`, marginRight: '0.28em'}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const ReviewCard: React.FC<{review: Review; index: number; total: number}> = ({review, index, total}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const s = L.s;

  // masuk (fade + slide up) → kekal → keluar sepenuhnya sebelum kad seterusnya
  const enter = interpolate(f, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const exit = interpolate(f, [CARD - 18, CARD - 2], [0, 1], {...clamp, easing: easeOut});
  const cardStyle = {
    opacity: enter * (1 - exit),
    transform: `translateY(${(1 - enter) * 70 - exit * 50}px) scale(${0.97 + 0.03 * enter})`,
  };

  const long = review.teks.length > 120;
  const textSize = (long ? 48 : 54) * s;

  return (
    <Safe>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            ...cardStyle,
            fontSize: 34 * s,
            fontWeight: 800,
            letterSpacing: 4 * s,
            color: R.maroon,
            textTransform: 'uppercase',
            marginBottom: 34 * s,
          }}
        >
          Ulasan Google
        </div>

        <div
          style={{
            ...cardStyle,
            width: '100%',
            background: R.white,
            borderRadius: 44 * s,
            padding: `${52 * s}px ${56 * s}px ${60 * s}px`,
            boxShadow: '0 30px 70px rgba(31,55,90,0.18), 0 4px 14px rgba(31,55,90,0.08)',
            position: 'relative' as const,
            overflow: 'hidden',
          }}
        >
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 12 * s, background: R.maroon}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 28 * s}}>
            <div
              style={{
                width: 112 * s,
                height: 112 * s,
                borderRadius: '50%',
                background: avatarColor(review.nama),
                color: '#fff',
                fontSize: 60 * s,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initial(review.nama)}
            </div>
            <div style={{minWidth: 0}}>
              <div style={{fontSize: 48 * s, fontWeight: 800, color: R.ink, lineHeight: 1.15}}>{review.nama}</div>
              <div style={{fontSize: 32 * s, color: R.muted, marginTop: 6 * s}}>Pengulas Google</div>
            </div>
          </div>

          <div style={{marginTop: 34 * s, marginBottom: 34 * s}}>
            <Stars count={review.bintang} size={76 * s} start={12} gap={6 * s} every={4} />
          </div>

          <Words text={review.teks} start={26} size={textSize} />
        </div>

        <div style={{...rise(f, 20, 16, 20), opacity: rise(f, 20, 16, 20).opacity * (1 - exit), marginTop: 44 * s, display: 'flex', alignItems: 'center', gap: 14 * s}}>
          {Array.from({length: total}).map((_, i) => (
            <div
              key={i}
              style={{
                width: (i === index ? 46 : 14) * s,
                height: 14 * s,
                borderRadius: 14 * s,
                background: i === index ? R.maroon : '#b9c6d4',
              }}
            />
          ))}
        </div>
        <div style={{marginTop: 18 * s, fontSize: 30 * s, fontWeight: 600, color: R.muted, opacity: (1 - exit) * enter}}>
          {data.nama} · {data.cawangan}
        </div>
      </div>
    </Safe>
  );
};
