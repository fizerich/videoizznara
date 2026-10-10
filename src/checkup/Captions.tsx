import React from 'react';
import {interpolate} from 'remotion';
import {cl, sp} from '../v2/kit';
import {BODY, C, CAPTION_TOP} from './theme';
import {PAGES} from './words';

// Kapsyen perkataan-demi-perkataan ikut VO: perkataan yang sedang disebut menyala dalam plat maroon.
export const Captions: React.FC<{f: number}> = ({f}) => {
  const idx = PAGES.findIndex((p, i) => {
    const start = p[0].s - 2;
    const end = i + 1 < PAGES.length ? PAGES[i + 1][0].s - 2 : p[p.length - 1].e + 14;
    return f >= start && f < end;
  });
  if (idx < 0) return null;
  const page = PAGES[idx];
  const t0 = page[0].s - 2;
  const nextStart = idx + 1 < PAGES.length ? PAGES[idx + 1][0].s - 2 : page[page.length - 1].e + 14;
  const hold = page[page.length - 1].e + 10; // kapsyen hilang sebentar selepas ayat tamat, sebelum halaman baharu
  const enter = sp(f, t0, 15, 0.55);
  const exit = interpolate(f, [Math.min(nextStart, hold) - 5, Math.min(nextStart, hold)], [1, 0], cl);
  if (exit <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: CAPTION_TOP,
        left: 90,
        width: 900,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 14,
        rowGap: 6,
        opacity: Math.min(1, enter * 1.5) * exit,
        transform: `translateY(${(1 - Math.min(1, enter)) * 30}px)`,
      }}
    >
      {page.map((w, i) => {
        const active = f >= w.s && f < (page[i + 1]?.s ?? w.e + 12);
        const spoken = f >= w.s;
        const pop = active ? 1 + 0.1 * Math.exp(-(f - w.s) / 4) : 1;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 78,
              lineHeight: 1.1,
              padding: '2px 20px 8px',
              borderRadius: 24,
              color: active ? C.white : C.ink,
              background: active ? C.maroon : 'transparent',
              WebkitTextStroke: active ? '0' : '10px #fff',
              paintOrder: 'stroke fill',
              opacity: spoken ? 1 : 0.5,
              boxShadow: active ? '0 12px 28px rgba(102,9,32,0.38)' : 'none',
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
