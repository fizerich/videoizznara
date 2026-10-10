import React from 'react';
import {interpolate} from 'remotion';
import {cl, sp} from '../v2/kit';
import {CALLOUTS, Callout, Tone} from './callouts';
import {BODY, C, CALLOUT_TOP, FPS, HEAD} from './theme';

const f2 = (s: number) => Math.round(s * FPS);
const color = (t: Tone = 'ink') => (t === 'maroon' ? C.maroon : t === 'indigo' ? C.indigo : C.ink);

type Timed = Callout & {s: number; e: number};

const firstAt = (c: Callout) =>
  Math.min(c.kicker?.at ?? 1e9, ...(c.chips ?? []).map((x) => x.at), ...(c.lines ?? []).map((x) => x.at));
const lastAt = (c: Callout) =>
  Math.max(c.kicker?.at ?? 0, ...(c.chips ?? []).map((x) => x.at), ...(c.lines ?? []).map((x) => x.at));

// Hitung sempadan masuk/keluar setiap callout daripada masa perkataan
const TIMED: Timed[] = CALLOUTS.map((c, i) => {
  const s = f2(firstAt(c) - 0.12);
  const nextS = i + 1 < CALLOUTS.length ? f2(firstAt(CALLOUTS[i + 1]) - 0.12) - 1 : Infinity;
  const e = c.end ? f2(c.end) : Math.min(nextS, f2(lastAt(c) + 2.4));
  return {...c, s, e};
});

const EXIT = 7;

const Kicker: React.FC<{f: number; k: NonNullable<Callout['kicker']>}> = ({f, k}) => {
  const p = sp(f, f2(k.at), 14, 0.6);
  const big = !!k.big;
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: BODY,
        fontWeight: 800,
        fontSize: big ? 58 : 34,
        letterSpacing: big ? 10 : 8,
        color: C.white,
        background: color(k.tone ?? 'indigo'),
        padding: big ? '12px 36px 12px 46px' : '8px 24px 8px 32px',
        borderRadius: 999,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - Math.min(1, p)) * 24}px) scale(${0.9 + 0.1 * Math.min(1, p)})`,
        boxShadow: '0 10px 24px rgba(42,7,20,0.18)',
      }}
    >
      {k.t}
    </div>
  );
};

const Chip: React.FC<{f: number; c: NonNullable<Callout['chips']>[number]; size: number}> = ({f, c, size}) => {
  const p = sp(f, f2(c.at), 9, 0.55);
  const burst = interpolate(f - f2(c.at), [0, 14], [1, 0], cl);
  return (
    <div
      style={{
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color: C.white,
        background: color(c.tone),
        padding: '12px 32px 16px',
        borderRadius: 34,
        border: '7px solid #fff',
        boxShadow: `0 18px 0 rgba(42,7,20,0.14), 0 0 ${burst * 60}px ${burst * 14}px ${c.tone === 'maroon' ? 'rgba(140,18,51,0.55)' : 'rgba(58,45,156,0.5)'}`,
        opacity: Math.min(1, p * 2),
        transform: `scale(${0.3 + 0.7 * p}) rotate(${(1 - Math.min(1, p)) * -7}deg)`,
        letterSpacing: 2,
      }}
    >
      {c.t}
    </div>
  );
};

const Line: React.FC<{f: number; l: NonNullable<Callout['lines']>[number]}> = ({f, l}) => {
  const p = sp(f, f2(l.at), 15, 0.6);
  const size = Math.min(124, 900 / (l.t.length * 0.5));
  const strikeP = l.strike ? interpolate(f, [f2(l.strike), f2(l.strike) + 9], [0, 1], cl) : 0;
  return (
    <div style={{overflow: 'hidden', padding: '4px 30px 8px', margin: '-4px -30px -8px'}}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.08,
          color: color(l.tone),
          WebkitTextStroke: '10px #fff',
          paintOrder: 'stroke fill',
          textShadow: '0 8px 22px rgba(42,7,20,0.16)',
          transform: `translateY(${(1 - Math.min(1, p)) * 120}%)`,
          opacity: p > 0.02 ? 1 : 0,
          letterSpacing: 1,
        }}
      >
        {l.t}
        {l.strike ? (
          <span
            style={{
              position: 'absolute',
              left: -16,
              top: '52%',
              height: Math.round(size * 0.11),
              width: `calc(${strikeP * 100}% + 32px)`,
              background: C.maroonHi,
              borderRadius: 99,
              transform: 'rotate(-3deg)',
              boxShadow: '0 0 0 4px #fff',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export const Callouts: React.FC<{f: number}> = ({f}) => {
  const c = TIMED.find((x) => f >= x.s && f <= x.e);
  if (!c) return null;
  const exit = interpolate(f, [c.e - EXIT, c.e], [1, 0], cl);
  return (
    <div
      style={{
        position: 'absolute',
        top: CALLOUT_TOP,
        left: 72,
        width: 936,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        textAlign: 'center',
        opacity: exit,
        transform: `translateY(${(1 - exit) * -26}px)`,
      }}
    >
      {c.kicker ? <Kicker f={f} k={c.kicker} /> : null}
      {c.chips ? (
        <div style={{display: 'flex', gap: 22, justifyContent: 'center', minHeight: 160}}>
          {c.chips.map((ch, i) => (
            <Chip key={i} f={f} c={ch} size={c.chips!.length > 1 ? 112 : 138} />
          ))}
        </div>
      ) : null}
      {c.lines?.map((l, i) => (
        <Line key={i} f={f} l={l} />
      ))}
    </div>
  );
};
