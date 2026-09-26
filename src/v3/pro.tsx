import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, random, Sequence, staticFile} from 'remotion';
import {B, cl, D, H, sp} from '../v2/kit';
import {CHUNKS} from './captions';
import {DOCTOR, INSERTS, KESAN, RAWATAN} from './timeline';

const SRC = 'ref/hilang-gigi-asal.mp4';

// ---------- Latar studio: maroon gelap, lampu sorot di belakang doktor ----------
export const StudioBackdrop: React.FC<{f: number}> = ({f}) => {
  const sx = 50 + Math.sin(f / 90) * 6;
  const dust = Array.from({length: 34}, (_, i) => {
    const x = random(`sx${i}`) * 1080;
    const depth = 0.2 + random(`sz${i}`) * 0.6;
    const y = (((random(`sy${i}`) * 1920 - f * (0.3 + depth * 0.8)) % 1920) + 1920) % 1920;
    return {x, y, r: 1.5 + depth * 3.5, o: (0.2 + depth * 0.5) * (0.5 + 0.5 * Math.abs(Math.sin(f / 22 + i)))};
  });
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #2a0b14 0%, ${D.bg2} 45%, ${D.bg} 100%)`}}>
      {/* lampu sorot + cahaya lantai */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 62% 38% at ${sx}% 44%, rgba(232,199,133,0.30), rgba(192,26,66,0.16) 45%, transparent 75%),
            radial-gradient(ellipse 80% 16% at 50% 100%, rgba(192,26,66,0.35), transparent 70%)`,
        }}
      />
      {/* garisan cahaya menyerong (gaya studio) */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.5}}>
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={D.gold} stopOpacity={0.22} />
            <stop offset="1" stopColor={D.gold} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`M${120 + Math.sin(f / 70) * 30} 0 L ${260 + Math.sin(f / 70) * 30} 0 L 640 1300 L 420 1300 Z`} fill="url(#beam)" />
        <path d={`M${840 + Math.cos(f / 80) * 30} 0 L ${960 + Math.cos(f / 80) * 30} 0 L 700 1300 L 540 1300 Z`} fill="url(#beam)" />
        {dust.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={D.gold} opacity={d.o} />
        ))}
      </svg>
      {/* tanda air logo gigi besar, sangat lembut */}
      <div
        style={{
          position: 'absolute',
          top: 330,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 300,
          letterSpacing: 20,
          color: 'rgba(232,199,133,0.06)',
        }}
      >
        IZZNARA
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- Kad sisipan foto close-up (dipotong dari bahagian atas video asal) ----------
const CROP_Y = 60;
const CROP_H = 360;
const CARD_S = 0.86;
export const InsertCards: React.FC<{frame: number}> = ({frame}) => (
  <>
    {INSERTS.map(([a, b]) => {
      if (frame < a || frame >= b) return null;
      const f = frame - a;
      const p = Math.min(1, sp(f, 0, 13));
      const out = interpolate(frame, [b - 6, b], [0, 1], cl);
      return (
        <div
          key={a}
          style={{
            position: 'absolute',
            top: 150,
            left: (1080 - 1080 * CARD_S) / 2,
            width: 1080 * CARD_S,
            height: CROP_H * CARD_S,
            borderRadius: 34,
            overflow: 'hidden',
            border: `4px solid ${D.gold}`,
            boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
            opacity: p * (1 - out),
            transform: `translateY(${(1 - p) * -60 - out * 40}px) scale(${0.9 + 0.1 * p}) rotate(${(1 - p) * -3}deg)`,
          }}
        >
          <div style={{position: 'absolute', left: 0, top: -CROP_Y * CARD_S, width: 1080, height: 1920, transform: `scale(${CARD_S})`, transformOrigin: '0 0'}}>
            <Sequence from={a} durationInFrames={b - a} layout="none">
              <OffthreadVideo src={staticFile(SRC)} trimBefore={a} muted style={{width: 1080, height: 1920}} />
            </Sequence>
          </div>
        </div>
      );
    })}
  </>
);

// ---------- Klip doktor stok: dipaparkan sebagai kad terapung ----------
export const DoctorCard: React.FC<{frame: number}> = ({frame}) => {
  const [a, b] = DOCTOR;
  if (frame < a || frame >= b) return null;
  const f = frame - a;
  const p = Math.min(1, sp(f, 0, 14));
  const s = 0.8;
  return (
    <div
      style={{
        position: 'absolute',
        top: 170,
        left: (1080 - 1080 * s) / 2,
        width: 1080 * s,
        height: 1920 * s,
        borderRadius: 44,
        overflow: 'hidden',
        border: `4px solid ${D.gold}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        opacity: p,
        transform: `scale(${0.92 + 0.08 * p + f * 0.0004})`,
      }}
    >
      <div style={{width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Sequence from={a} durationInFrames={b - a} layout="none">
          <OffthreadVideo src={staticFile(SRC)} trimBefore={a} muted style={{width: 1080, height: 1920}} />
        </Sequence>
      </div>
    </div>
  );
};

// ---------- Kapsyen baharu: perkataan aktif menyala, kata kunci dalam kotak ----------
const hidden = (f: number) =>
  (f >= KESAN.from && f < KESAN.to) || (f >= RAWATAN.from && f < RAWATAN.to) || (f >= DOCTOR[0] && f < DOCTOR[1]);

export const Captions: React.FC<{frame: number}> = ({frame}) => {
  if (hidden(frame)) return null;
  const idx = CHUNKS.findIndex((c, i) => {
    const next = CHUNKS[i + 1];
    const end = next ? Math.min(next[0].s, c[c.length - 1].e + 12) : c[c.length - 1].e + 12;
    return frame >= c[0].s && frame < end;
  });
  if (idx < 0) return null;
  const chunk = CHUNKS[idx];
  const pop = Math.min(1, sp(frame, chunk[0].s, 12, 0.5));
  return (
    <div
      style={{
        position: 'absolute',
        top: 1250,
        left: 40,
        right: 40,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px 22px',
        transform: `scale(${0.85 + 0.15 * pop}) translateY(${(1 - pop) * 20}px)`,
        opacity: pop,
      }}
    >
      {chunk.map((w, i) => {
        const on = frame >= w.s;
        const active = on && frame < w.e + 2;
        const wp = Math.min(1, sp(frame, w.s, 10, 0.5));
        return (
          <span
            key={i}
            style={{
              fontFamily: B,
              fontWeight: 800,
              fontSize: 80,
              lineHeight: 1.15,
              textTransform: 'uppercase',
              letterSpacing: -1,
              color: w.k ? D.cream : active ? D.goldHi : D.cream,
              background: w.k && on ? D.crimson : 'transparent',
              borderRadius: 14,
              padding: w.k ? '0 16px' : 0,
              opacity: on ? 1 : 0.45,
              transform: `scale(${active ? 1 + 0.08 * wp : 1}) rotate(${w.k && on ? -2 : 0}deg)`,
              textShadow: '0 4px 0 rgba(0,0,0,0.55), 0 0 24px rgba(0,0,0,0.6)',
              WebkitTextStroke: '2px rgba(0,0,0,0.35)',
              display: 'inline-block',
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
