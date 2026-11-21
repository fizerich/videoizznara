import React from 'react';
import {interpolate} from 'remotion';
import {C, cl, F, sp} from './kit';
import {PAGES} from './words';

// Sari kata ala Reels/TikTok: 2-5 perkataan sehalaman, perkataan aktif disorot pil burgundy.
export const CAPTION_TOP = 1330;

export const Captions: React.FC<{f: number; top?: number}> = ({f, top = CAPTION_TOP}) => {
  const startOf = (i: number) => PAGES[i][0].s - 2;
  const endOf = (i: number) => (i + 1 < PAGES.length ? Math.min(startOf(i + 1), PAGES[i][PAGES[i].length - 1].e + 20) : PAGES[i][PAGES[i].length - 1].e + 20);
  const idx = PAGES.findIndex((_, i) => f >= startOf(i) && f < endOf(i));
  if (idx < 0) return null;
  const page = PAGES[idx];
  const t0 = startOf(idx);
  const t1 = endOf(idx);
  const enter = sp(f, t0, 15, 0.5);
  const exit = interpolate(f, [t1 - 4, t1], [1, 0], cl);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 90,
        width: 900,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 14,
        rowGap: 6,
        opacity: Math.min(1, enter * 1.4) * exit,
        transform: `translateY(${(1 - Math.min(1, enter)) * 24}px)`,
      }}
    >
      {page.map((w, i) => {
        const active = f >= w.s && f < (page[i + 1]?.s ?? w.e + 14);
        const spoken = f >= w.s;
        const pop = active ? 1 + 0.07 * Math.exp(-(f - w.s) / 5) : 1;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: F.head,
              fontWeight: 900,
              fontSize: 74,
              lineHeight: 1.18,
              padding: '0 16px 4px',
              borderRadius: 18,
              background: active ? C.burg : 'transparent',
              boxShadow: active ? '0 10px 26px rgba(102,9,32,0.45)' : 'none',
              color: spoken ? '#fff' : 'rgba(255,255,255,0.78)',
              WebkitTextStroke: active ? '0px' : '10px rgba(30,4,10,0.92)',
              paintOrder: 'stroke fill',
              textShadow: '0 6px 20px rgba(0,0,0,0.45)',
              transform: `scale(${pop})`,
              transformOrigin: '50% 70%',
              letterSpacing: -0.5,
            }}
          >
            {w.w.replace(/[.,]$/, '')}
          </span>
        );
      })}
    </div>
  );
};
