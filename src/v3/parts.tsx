import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {B, cl, D, H, sp} from '../v2/kit';
import {at, CAPTIONS} from './data';

// Muncul pada frame a, hilang pada frame b (fade 8 frame)
export const win = (f: number, a: number, b = Infinity, fade = 8) =>
  Math.min(interpolate(f, [a, a + fade], [0, 1], cl), b === Infinity ? 1 : interpolate(f, [b - fade, b], [1, 0], cl));

const TOOTH =
  'M -90 -80 C -100 -140, -40 -150, 0 -125 C 40 -150, 100 -140, 90 -80 C 85 -20, 70 20, 60 90 C 55 130, 25 135, 18 95 C 12 55, -12 55, -18 95 C -25 135, -55 130, -60 90 C -70 20, -85 -20, -90 -80 Z';

export const Tooth: React.FC<{x?: number; y?: number; s?: number; shine?: number}> = ({x = 0, y = 0, s = 1, shine = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={TOOTH} fill="#fffaf2" stroke={D.gold} strokeWidth={6} />
    <path d="M -58 -95 C -62 -60, -55 -30, -48 0" stroke="#e9dfd0" strokeWidth={12} strokeLinecap="round" fill="none" />
    {shine > 0 ? (
      <g opacity={shine}>
        <Sparkle x={70} y={-120} s={1} />
        <Sparkle x={-80} y={-40} s={0.6} />
      </g>
    ) : null}
  </g>
);

export const Sparkle: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -26 C 4 -6, 6 -4, 26 0 C 6 4, 4 6, 0 26 C -4 6, -6 4, -26 0 C -6 -4, -4 -6, 0 -26 Z"
    fill={D.goldHi}
  />
);

// ---------- Ilustrasi setiap tip (koordinat pusat 0,0 dalam kotak 400x400) ----------

export const BrushArt: React.FC<{f: number; foam: number}> = ({f, foam}) => {
  const dx = Math.sin(f / 2.4) * 38;
  const bubbles = Array.from({length: 12}, (_, i) => {
    const a = random(`b${i}`) * Math.PI;
    const r = 70 + random(`r${i}`) * 50;
    const g = Math.min(1, Math.max(0, foam * 12 - i));
    return {x: Math.cos(a) * r, y: -140 - Math.sin(a) * r * 0.45, r: (8 + random(`s${i}`) * 14) * g};
  });
  return (
    <g transform="translate(0 50)">
      <Tooth s={1.05} shine={foam > 0.9 ? 0.6 + 0.4 * Math.sin(f / 5) : 0} />
      {bubbles.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#ffffff" stroke="#cfe8f1" strokeWidth={3} opacity={0.95} />
      ))}
      <g transform={`translate(${dx} -175) rotate(-12)`}>
        <rect x={-60} y={-8} width={330} height={34} rx={17} fill={D.gold} />
        <rect x={120} y={-2} width={120} height={22} rx={11} fill={D.goldHi} opacity={0.6} />
        <rect x={-80} y={-14} width={130} height={40} rx={14} fill="#fffaf2" />
        {Array.from({length: 7}, (_, i) => (
          <rect key={i} x={-72 + i * 17} y={14} width={11} height={40} rx={4} fill={i % 2 ? '#8fd3e8' : '#ffffff'} stroke="#cfe8f1" strokeWidth={2} />
        ))}
      </g>
    </g>
  );
};

export const FlossArt: React.FC<{f: number; dive: number; pop: number}> = ({f, dive, pop}) => {
  const saw = Math.sin(f / 3) * 22;
  const yF = interpolate(dive, [0, 1], [-200, 20]) + saw * dive;
  const food = pop > 0 ? {x: 12 + pop * 140, y: -40 - pop * 170, o: 1 - pop} : {x: 0, y: -40, o: 1};
  return (
    <g transform="translate(0 50) scale(0.95)">
      <Tooth x={-102} s={0.9} />
      <Tooth x={102} s={0.9} shine={pop > 0.6 ? 0.8 : 0} />
      <g transform={`translate(${food.x} ${food.y}) rotate(${pop * 220})`} opacity={food.o}>
        <path d="M -16 -20 C 8 -30, 24 -8, 16 12 C 8 30, -20 26, -22 6 C -24 -6, -22 -16, -16 -20 Z" fill="#9b5a3c" stroke="#6b3620" strokeWidth={4} />
      </g>
      <path
        d={`M -200 ${-150 + saw * 0.4} L 0 ${yF} L 200 ${-150 - saw * 0.4}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path d={`M -200 ${-150 + saw * 0.4} L 0 ${yF} L 200 ${-150 - saw * 0.4}`} fill="none" stroke="#8fd3e8" strokeWidth={2.5} />
    </g>
  );
};

export const BottleArt: React.FC<{f: number; shake: number}> = ({f, shake}) => {
  const rot = Math.sin(f / 1.6) * 7 * shake;
  const wave = (k: number) => `M -86 ${-10 + Math.sin(f / 6 + k) * 6} Q -43 ${-24 + Math.sin(f / 5) * 8}, 0 ${-10} T 86 ${-10 + Math.cos(f / 6) * 6} L 86 140 L -86 140 Z`;
  const bubbles = Array.from({length: 9}, (_, i) => {
    const t = ((f * (0.6 + random(`v${i}`) * 0.8) + random(`o${i}`) * 150) % 150) / 150;
    return {x: -60 + random(`x${i}`) * 120, y: 130 - t * 140, r: 4 + random(`r${i}`) * 8, o: Math.sin(t * Math.PI)};
  });
  return (
    <g transform={`translate(0 20) rotate(${rot})`}>
      <rect x={-40} y={-190} width={80} height={46} rx={10} fill={D.crimson} />
      <rect x={-30} y={-148} width={60} height={50} fill="#dff4f2" />
      <rect x={-100} y={-110} width={200} height={270} rx={46} fill="#dff4f2" stroke="#ffffff" strokeWidth={6} />
      <clipPath id="liq">
        <rect x={-94} y={-104} width={188} height={258} rx={40} />
      </clipPath>
      <g clipPath="url(#liq)">
        <path d={wave(0)} fill="#35b7ad" transform="translate(0 -20)" />
        {bubbles.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#ffffff" opacity={0.7 * b.o} />
        ))}
      </g>
      <rect x={-78} y={10} width={156} height={80} rx={12} fill="#fffaf2" />
      <text x={0} y={46} textAnchor="middle" fontFamily={H} fontWeight={700} fontSize={30} fill={D.maroon}>
        UBAT
      </text>
      <text x={0} y={78} textAnchor="middle" fontFamily={H} fontWeight={700} fontSize={30} fill={D.maroon}>
        KUMUR
      </text>
    </g>
  );
};

const MONTHS = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGO', 'SEP', 'OKT', 'NOV', 'DIS'];
export const CalendarArt: React.FC<{f: number; show: number; mark: number}> = ({f, show, mark}) => (
  <g transform="translate(0 10)">
    <rect x={-170} y={-170} width={340} height={350} rx={30} fill="#fffaf2" />
    <rect x={-170} y={-170} width={340} height={70} rx={30} fill={D.crimson} />
    <rect x={-170} y={-130} width={340} height={30} fill={D.crimson} />
    <text x={0} y={-122} textAnchor="middle" fontFamily={H} fontWeight={700} fontSize={36} fill="#fff" letterSpacing={4}>
      SETAHUN
    </text>
    {MONTHS.map((m, i) => {
      const cx = -112 + (i % 3) * 112;
      const cy = -52 + Math.floor(i / 3) * 62;
      const o = Math.min(1, Math.max(0, show * 16 - i));
      const hit = i === 0 ? mark : 0;
      return (
        <g key={m} opacity={o}>
          <rect x={cx - 48} y={cy - 24} width={96} height={48} rx={12} fill={hit ? D.gold : '#efe4d4'} />
          <text x={cx} y={cy + 11} textAnchor="middle" fontFamily={H} fontWeight={500} fontSize={28} fill={hit ? D.maroon : '#8c7a70'}>
            {m}
          </text>
        </g>
      );
    })}
    {mark > 0 ? (
      <g transform={`translate(-112 -52) scale(${mark})`}>
        <circle r={52} fill="none" stroke={D.crimson} strokeWidth={7} opacity={0.9} />
        <g transform={`translate(52 -44) rotate(${-10 + Math.sin(f / 8) * 4})`}>
          <circle r={30} fill={D.crimson} />
          <text y={11} textAnchor="middle" fontFamily={H} fontWeight={700} fontSize={32} fill="#fff">
            1×
          </text>
        </g>
      </g>
    ) : null}
  </g>
);

export const ScanArt: React.FC<{f: number; spot: number; fix: number}> = ({f, spot, fix}) => {
  const a = f / 14;
  const mx = spot > 0 ? interpolate(spot, [0, 1], [Math.cos(a) * 70, 34], cl) : Math.cos(a) * 70;
  const my = spot > 0 ? interpolate(spot, [0, 1], [-60 + Math.sin(a) * 50, -80], cl) : -60 + Math.sin(a) * 50;
  const ring = (f % 24) / 24;
  return (
    <g transform="translate(0 40)">
      <Tooth s={1.2} shine={fix > 0.5 ? 1 : 0} />
      {spot > 0 && fix < 1 ? (
        <g transform="translate(34 -80)" opacity={1 - fix}>
          <circle r={20 * spot} fill="#4a2a1f" />
          <circle r={20 + ring * 40} fill="none" stroke={D.crimson} strokeWidth={5} opacity={(1 - ring) * spot} />
        </g>
      ) : null}
      {fix > 0 ? (
        <g transform={`translate(0 -10) scale(${fix})`}>
          <circle r={70} fill={D.gold} />
          <path d="M -32 2 L -8 26 L 36 -22" stroke={D.maroon} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      ) : (
        <g transform={`translate(${mx} ${my})`}>
          <circle r={62} fill="rgba(255,255,255,0.18)" stroke={D.cream} strokeWidth={10} />
          <path d="M 44 44 L 110 110" stroke={D.gold} strokeWidth={22} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

export const SunMoon: React.FC<{sun: number; moon: number; f: number}> = ({sun, moon, f}) => (
  <div style={{display: 'flex', gap: 22}}>
    {[
      {s: sun, label: 'Pagi', icon: 'sun'},
      {s: moon, label: 'Malam', icon: 'moon'},
    ].map((it) => (
      <div
        key={it.label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(255,250,242,0.1)',
          border: `2px solid ${D.gold}`,
          borderRadius: 999,
          padding: '8px 26px 8px 12px',
          opacity: Math.min(1, it.s),
          transform: `scale(${0.6 + 0.4 * it.s})`,
        }}
      >
        <svg width={56} height={56} viewBox="-30 -30 60 60">
          {it.icon === 'sun' ? (
            <g transform={`rotate(${f * 2})`}>
              {Array.from({length: 8}, (_, i) => (
                <rect key={i} x={-3} y={-28} width={6} height={10} rx={3} fill={D.gold} transform={`rotate(${i * 45})`} />
              ))}
              <circle r={14} fill={D.gold} />
            </g>
          ) : (
            <path d="M 6 -22 A 22 22 0 1 0 22 10 A 17 17 0 1 1 6 -22 Z" fill={D.cream} />
          )}
        </svg>
        <span style={{fontFamily: B, fontWeight: 700, fontSize: 36, color: D.cream}}>{it.label}</span>
      </div>
    ))}
  </div>
);

// ---------- Blok teks dalam panel ----------

export const Stat: React.FC<{s: number; big: string; small: string; warn?: boolean}> = ({s, big, small, warn}) => (
  <div
    style={{
      opacity: Math.min(1, s),
      transform: `translateX(${(1 - s) * 60}px) scale(${0.85 + 0.15 * s})`,
      transformOrigin: 'left center',
    }}
  >
    <div
      style={{
        fontFamily: H,
        fontWeight: 700,
        fontSize: 84,
        lineHeight: 1,
        color: warn ? '#ff8a8a' : D.gold,
        textShadow: '0 4px 18px rgba(0,0,0,0.35)',
      }}
    >
      {big}
    </div>
    <div style={{fontFamily: B, fontWeight: 600, fontSize: 34, lineHeight: 1.2, color: D.cream, marginTop: 6}}>{small}</div>
  </div>
);

export const Chip: React.FC<{s: number; text: string; icon?: 'check' | 'x' | 'warn'}> = ({s, text, icon = 'check'}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      background: icon === 'warn' ? 'rgba(192,26,66,0.9)' : 'rgba(255,250,242,0.12)',
      border: `2px solid ${icon === 'warn' ? '#ff9aa9' : D.gold}`,
      borderRadius: 999,
      padding: '10px 28px 10px 12px',
      opacity: Math.min(1, s),
      transform: `scale(${0.5 + 0.5 * s})`,
      transformOrigin: 'left center',
    }}
  >
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 999,
        background: icon === 'warn' ? '#fff' : D.gold,
        color: icon === 'warn' ? D.crimson : D.maroon,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: H,
        fontWeight: 700,
        fontSize: 32,
      }}
    >
      {icon === 'check' ? '✓' : icon === 'x' ? '✕' : '!'}
    </div>
    <span style={{fontFamily: B, fontWeight: 700, fontSize: 38, color: D.cream, whiteSpace: 'nowrap'}}>{text}</span>
  </div>
);

// ---------- Panel tip (di ruang siling kereta, atas kepala) ----------

export const Panel: React.FC<{
  f: number;
  from: number;
  to: number;
  n?: number;
  title: React.ReactNode;
  kicker: string;
  art?: React.ReactNode;
  children?: React.ReactNode;
}> = ({f, from, to, n, title, kicker, art, children}) => {
  if (f < from - 2 || f > to + 14) return null;
  const inn = sp(f, from, 15, 0.8);
  const out = interpolate(f, [to, to + 12], [0, 1], cl);
  const y = (1 - inn) * -760 - out * 760;
  const sheen = interpolate(f - from, [6, 30], [-400, 1400], cl);
  return (
    <div
      style={{
        position: 'absolute',
        top: 84,
        left: 40,
        right: 40,
        height: 640,
        transform: `translateY(${y}px) rotate(${(1 - inn) * -3}deg)`,
        borderRadius: 48,
        overflow: 'hidden',
        background: `linear-gradient(155deg, #86102e 0%, ${D.maroon} 45%, #2c040e 100%)`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(232,199,133,0.55)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: sheen,
          width: 160,
          transform: 'skewX(-20deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,240,201,0.28), transparent)',
        }}
      />
      <div style={{position: 'absolute', top: 34, left: 44, right: 44, display: 'flex', alignItems: 'center', gap: 28}}>
        {n ? (
          <div
            style={{
              fontFamily: H,
              fontWeight: 700,
              fontSize: 150,
              lineHeight: 0.9,
              color: D.gold,
              transform: `scale(${sp(f, from + 6, 9)})`,
            }}
          >
            {String(n).padStart(2, '0')}
          </div>
        ) : null}
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <span style={{fontFamily: H, fontWeight: 500, fontSize: 30, letterSpacing: 8, color: D.gold}}>{kicker}</span>
            {n ? (
              <div style={{display: 'flex', gap: 8}}>
                {[1, 2, 3, 4].map((k) => (
                  <div
                    key={k}
                    style={{
                      width: k === n ? 46 : 16,
                      height: 16,
                      borderRadius: 8,
                      background: k <= n ? D.gold : 'rgba(255,250,242,0.25)',
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
          <div
            style={{
              fontFamily: H,
              fontWeight: 700,
              fontSize: 88,
              lineHeight: 1.02,
              color: D.cream,
              textTransform: 'uppercase',
              marginTop: 4,
              clipPath: `inset(0 ${(1 - sp(f, from + 10, 18)) * 100}% 0 0)`,
            }}
          >
            {title}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 214, left: 20, width: 420, height: 410}}>
        <svg viewBox="-210 -205 420 410" width={420} height={410} style={{overflow: 'visible'}}>
          {art}
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 460,
          right: 40,
          bottom: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 26,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------- Kapsyen karaoke ----------

type Word = {t: string; key: boolean; s: number};
const CHUNKS = CAPTIONS.map(([text, s, e], i) => {
  const a = at(s);
  const b = at(e);
  const next = i + 1 < CAPTIONS.length ? at(CAPTIONS[i + 1][1]) : Infinity;
  const raw = text.split(' ');
  const weights = raw.map((w) => w.replace(/\*/g, '').length + 2);
  const total = weights.reduce((x, y) => x + y, 0);
  let acc = 0;
  const words: Word[] = raw.map((w, k) => {
    const s0 = a + (acc / total) * (b - a);
    acc += weights[k];
    return {t: w.replace(/\*/g, ''), key: w.startsWith('*'), s: s0};
  });
  return {from: a - 3, to: Math.min(b + 16, next - 3), words};
});

export const Captions: React.FC<{f: number}> = ({f}) => {
  const c = CHUNKS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const pop = sp(f, c.from, 12, 0.5);
  const cur = c.words.reduce((k, w, i) => (f >= w.s ? i : k), -1);
  return (
    <div
      style={{
        position: 'absolute',
        top: 1440,
        left: 60,
        right: 60,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'flex-start',
        columnGap: 8,
        rowGap: 6,
        transform: `scale(${0.88 + 0.12 * pop})`,
        opacity: interpolate(f, [c.to - 4, c.to], [1, 0], cl),
      }}
    >
      {c.words.map((w, i) => {
        const ws = sp(f, w.s - 1, 11, 0.45);
        const active = i === cur;
        const said = f >= w.s - 1;
        return (
          <span
            key={i}
            style={{
              fontFamily: B,
              fontWeight: 800,
              fontSize: 76,
              lineHeight: 1.18,
              padding: '0 12px',
              borderRadius: 14,
              color: active ? D.maroon : w.key ? D.gold : '#ffffff',
              background: active ? (w.key ? D.gold : D.cream) : 'transparent',
              opacity: said ? 1 : 0.55,
              transform: `translateY(${active ? (1 - ws) * -10 : 0}px) scale(${active ? 1 + 0.08 * ws : 1})`,
              textShadow: active ? 'none' : '0 5px 0 rgba(0,0,0,0.55), 0 0 22px rgba(0,0,0,0.6)',
              WebkitTextStroke: active ? undefined : '2px rgba(20,4,8,0.55)',
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// Kilat putih ringkas untuk peralihan
export const Flash: React.FC<{f: number; at: number; peak?: number}> = ({f, at: a, peak = 0.55}) => {
  const o = interpolate(f, [a - 2, a, a + 10], [0, peak, 0], cl);
  return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: o}} /> : null;
};
