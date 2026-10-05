import React from 'react';
import {interpolate} from 'remotion';
import {B, cl, D, H, sp} from '../v2/kit';
import {PAGES, Word} from './words';

// Subtitle ala TikTok: 3-4 perkataan satu halaman, perkataan aktif menyala emas & "pop".
// Diletakkan di dalam zon selamat TikTok / Reels (jauh dari butang kanan & kapsyen bawah).
export const CAPTION_TOP = 1262;

export type CaptionLook = {active: string; spoken: string; idle: string; stroke: string; shadow: string};
const DARK_CAPTION: CaptionLook = {
  active: D.gold,
  spoken: D.cream,
  idle: 'rgba(247,242,234,0.62)',
  stroke: '#0c0507',
  shadow: '0 8px 24px rgba(0,0,0,0.7)',
};

export const Captions: React.FC<{f: number; top?: number; pages?: Word[][]; look?: CaptionLook}> = ({
  f,
  top = CAPTION_TOP,
  pages = PAGES,
  look = DARK_CAPTION,
}) => {
  const idx = pages.findIndex((p, i) => {
    const start = p[0].s - 2;
    const end = i + 1 < pages.length ? pages[i + 1][0].s - 2 : p[p.length - 1].e + 12;
    return f >= start && f < end;
  });
  if (idx < 0) return null;
  const page = pages[idx];
  const t0 = page[0].s - 2;
  const enter = sp(f, t0, 15, 0.55);
  const nextStart = idx + 1 < pages.length ? pages[idx + 1][0].s - 2 : page[page.length - 1].e + 12;
  const exit = interpolate(f, [nextStart - 4, nextStart], [1, 0], cl);

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 120,
        width: 820,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 30,
        rowGap: 2,
        opacity: Math.min(1, enter * 1.4) * exit,
        transform: `translateY(${(1 - Math.min(1, enter)) * 26}px) scale(${0.94 + 0.06 * Math.min(1, enter)})`,
      }}
    >
      {page.map((w, i) => {
        const active = f >= w.s && f < (page[i + 1]?.s ?? w.e + 14);
        const spoken = f >= w.s;
        const pop = active ? 1 + 0.08 * Math.exp(-(f - w.s) / 5) : 1;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: H,
              fontWeight: 700,
              fontSize: 88,
              lineHeight: 1.12,
              textTransform: 'uppercase',
              color: active ? look.active : spoken ? look.spoken : look.idle,
              WebkitTextStroke: `11px ${look.stroke}`,
              paintOrder: 'stroke fill',
              textShadow: look.shadow,
              transform: `scale(${pop})`,
              transformOrigin: '50% 70%',
            }}
          >
            {w.w.replace(/[.,]$/, '')}
          </span>
        );
      })}
    </div>
  );
};

export const Kicker: React.FC<{text: string; o: number; color?: string; bg?: string}> = ({
  text,
  o,
  color = D.gold,
  bg = 'rgba(12,5,7,0.55)',
}) => (
  <div
    style={{
      display: 'inline-block',
      fontFamily: H,
      fontWeight: 500,
      fontSize: 38,
      letterSpacing: 9,
      color,
      border: `2px solid ${color}`,
      padding: '8px 24px 8px 30px',
      opacity: o,
      transform: `translateY(${(1 - o) * 20}px)`,
      background: bg,
    }}
  >
    {text}
  </div>
);

export const small = {fontFamily: B, fontWeight: 600, color: D.dim} as const;
