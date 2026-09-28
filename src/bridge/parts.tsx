import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {B, Backdrop, cl, D, ez, Grain, H, sp} from '../v2/kit';

// Garis masa video asal (frame @30fps)
export const SRC_LEN = 1002;
export const END_LEN = 105;
export const TOTAL_BRIDGE = SRC_LEN + END_LEN;
export const CUTS = [90, 212, 337, 365, 500, 681, 831];
export const HOOK_END = 90; // kotak kuning asal hilang pada frame ini
export const BEN_IN = 365; // babak kelabu asal: 365–500
export const BEN_OUT = 500;
export const BULLET_AT = [372, 402, 438]; // ikut suara
export const WA_AT = 848;
export const END_AT = SRC_LEN - 6;

const WA = '011-7027 2360';

// ---------- Hook: ganti kotak kuning dengan kad premium ----------
export const HookCard: React.FC<{f: number}> = ({f}) => {
  const out = ez(f, HOOK_END, HOOK_END + 10);
  if (out >= 1) return null;
  const pop = sp(f, 0, 11, 0.6);
  const s = interpolate(pop, [0, 1], [1.06, 1]);
  const hi = ez(f, 4, 16);
  const sub = ez(f, 10, 22);
  const arrow = Math.sin(f / 4) * 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        top: 348,
        width: 984,
        height: 300,
        transform: `translateY(${-out * 140}px) scale(${s * (1 - out * 0.05)})`,
        opacity: 1 - out,
        borderRadius: 34,
        background: `linear-gradient(160deg, rgba(102,9,32,0.97), rgba(40,5,14,0.97))`,
        border: `3px solid ${D.gold}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 0 60px rgba(232,199,133,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <div style={{fontFamily: H, fontWeight: 700, fontSize: 74, lineHeight: 1, color: D.cream, letterSpacing: 2}}>
        TAK SUKA PAKAI
      </div>
      <div style={{position: 'relative', padding: '4px 26px', marginTop: 6}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, ${D.gold}, ${D.goldHi})`,
            borderRadius: 10,
            transform: `scaleX(${hi})`,
            transformOrigin: 'left',
          }}
        />
        <div
          style={{
            position: 'relative',
            fontFamily: H,
            fontWeight: 700,
            fontSize: 104,
            lineHeight: 1.02,
            letterSpacing: 3,
            color: hi > 0.5 ? D.maroon : D.gold,
          }}
        >
          GIGI PALSU?
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: B,
          fontWeight: 600,
          fontSize: 34,
          color: D.goldHi,
          opacity: 0.35 + sub * 0.65,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        Tengok video ni sampai habis
        <svg width={34} height={34} viewBox="0 0 24 24" style={{transform: `translateY(${arrow}px)`}}>
          <path d="M12 4v14M5 12l7 7 7-7" stroke={D.gold} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

// ---------- Jenama kecil di atas + bar kemajuan ----------
export const BrandBar: React.FC<{f: number}> = ({f}) => {
  const o = ez(f, 4, 16);
  const p = f / SRC_LEN;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 8, background: 'rgba(0,0,0,0.25)'}}>
        <div
          style={{
            width: `${Math.min(p, 1) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${D.maroon}, ${D.gold})`,
            boxShadow: `0 0 14px ${D.gold}`,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 84,
          left: '50%',
          transform: `translateX(-50%) translateY(${(1 - o) * -20}px)`,
          opacity: o,
          padding: '14px 30px',
          borderRadius: 60,
          background: 'rgba(30,6,12,0.55)',
          border: '1.5px solid rgba(232,199,133,0.55)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <Img src={staticFile('izznara-logo-white.png')} style={{height: 46}} />
        <div style={{width: 2, height: 34, background: 'rgba(232,199,133,0.6)'}} />
        <div style={{fontFamily: H, fontWeight: 500, fontSize: 30, letterSpacing: 5, color: D.gold}}>DENTAL BRIDGE</div>
      </div>
    </>
  );
};

// ---------- Ikon ----------
const Icon: React.FC<{kind: number}> = ({kind}) => {
  const st = {stroke: D.gold, strokeWidth: 3.2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  return (
    <svg width={62} height={62} viewBox="0 0 48 48">
      {kind === 0 ? (
        <g {...st}>
          <path d="M14 6v12a4 4 0 0 0 8 0V6M18 6v36" />
          <path d="M34 42V6c-5 3-7 9-7 15 0 3 2 5 7 5" />
        </g>
      ) : kind === 1 ? (
        <g {...st}>
          <path d="M8 10h32v20H22l-9 8v-8H8z" />
          <path d="M15 18h18M15 23h11" />
        </g>
      ) : (
        <g {...st}>
          <circle cx="24" cy="24" r="17" />
          <path d="M16 27c2 4 5 6 8 6s6-2 8-6" />
          <path d="M18 18v1M30 18v1" />
        </g>
      )}
    </svg>
  );
};

// Tiga mahkota disambung — jambatan gigi
const BridgeArt: React.FC<{f: number}> = ({f}) => {
  const a = sp(f, BEN_IN + 2, 12, 0.7);
  const glow = 0.55 + 0.45 * Math.sin(f / 8);
  const crown = 'M-70 -60 C-70 -110 -30 -118 0 -100 C30 -118 70 -110 70 -60 C70 -10 55 40 35 90 C25 110 12 100 8 70 C4 45 -4 45 -8 70 C-12 100 -25 110 -35 90 C-55 40 -70 -10 -70 -60 Z';
  return (
    <svg width={1080} height={330} viewBox="-540 -165 1080 330" style={{position: 'absolute', top: 640, left: 0}}>
      <defs>
        <linearGradient id="enamel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9e0d4" />
        </linearGradient>
        <filter id="bglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      {/* rel penghubung */}
      <rect x={-230} y={-80} width={460 * a} height={26} rx={13} fill={D.gold} opacity={0.9} />
      {[-160, 0, 160].map((x, i) => {
        const s = sp(f, BEN_IN + 4 + i * 5, 10, 0.6);
        const mid = i === 1;
        return (
          <g key={i} transform={`translate(${x} ${(1 - s) * 60}) scale(${0.2 + 0.8 * s})`} opacity={s}>
            {mid ? <path d={crown} fill={D.gold} filter="url(#bglow)" opacity={glow * 0.8} /> : null}
            <path d={crown} fill="url(#enamel)" stroke={mid ? D.gold : 'rgba(0,0,0,0.12)'} strokeWidth={mid ? 6 : 2} />
          </g>
        );
      })}
      <text x={0} y={150} textAnchor="middle" fill={D.dim} style={{fontFamily: B, fontWeight: 600, fontSize: 28, letterSpacing: 2}} opacity={ez(f, BEN_IN + 20, BEN_IN + 32)}>
        isi ruang gigi yang kosong
      </text>
    </svg>
  );
};

const BENEFITS = ['Makan pun senang', 'Cakap pun lebih jelas', 'Senyum pun nampak natural'];

// ---------- Babak kelebihan: ganti latar kertas kelabu ----------
export const Benefits: React.FC<{f: number}> = ({f}) => {
  if (f < BEN_IN - 1 || f >= BEN_OUT + 10) return null;
  const inP = ez(f, BEN_IN - 1, BEN_IN + 9);
  const outP = ez(f, BEN_OUT, BEN_OUT + 10);
  const title = sp(f, BEN_IN + 1, 12, 0.6);
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${inP * 125}% at 50% 50%)`,
        opacity: 1 - outP,
        transform: `scale(${1 + outP * 0.08})`,
      }}
    >
      <Backdrop f={f} camY={0} />
      <div style={{position: 'absolute', top: 330, width: 1080, textAlign: 'center'}}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: H,
            fontWeight: 500,
            fontSize: 36,
            letterSpacing: 12,
            color: D.gold,
            border: `2px solid ${D.gold}`,
            padding: '6px 22px 6px 34px',
            opacity: title,
          }}
        >
          KELEBIHAN
        </div>
        <div
          style={{
            fontFamily: H,
            fontWeight: 700,
            fontSize: 136,
            lineHeight: 1.05,
            color: D.cream,
            marginTop: 18,
            letterSpacing: 3,
            opacity: title,
            transform: `translateY(${(1 - title) * 40}px)`,
            textShadow: '0 8px 40px rgba(192,26,66,0.6)',
          }}
        >
          DENTAL BRIDGE
        </div>
      </div>
      <BridgeArt f={f} />
      <div style={{position: 'absolute', top: 1040, left: 90, width: 900, display: 'flex', flexDirection: 'column', gap: 34}}>
        {BENEFITS.map((t, i) => {
          const s = sp(f, BULLET_AT[i], 12, 0.6);
          const tick = ez(f, BULLET_AT[i] + 6, BULLET_AT[i] + 16);
          return (
            <div
              key={t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '26px 34px',
                borderRadius: 28,
                background: D.card,
                border: '1.5px solid rgba(232,199,133,0.4)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                opacity: s,
                transform: `translateX(${(1 - s) * 160}px)`,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  border: `3px solid ${D.gold}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(232,199,133,0.08)',
                  flexShrink: 0,
                }}
              >
                <Icon kind={i} />
              </div>
              <div style={{fontFamily: B, fontWeight: 700, fontSize: 46, color: D.cream, flex: 1, whiteSpace: 'nowrap'}}>{t}</div>
              <svg width={56} height={56} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={11} fill={D.gold} opacity={tick} />
                <path
                  d="M6.5 12.5l3.5 3.5 7.5-8"
                  stroke={D.maroon}
                  strokeWidth={2.8}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={20}
                  strokeDashoffset={20 * (1 - tick)}
                />
              </svg>
            </div>
          );
        })}
      </div>
      <Grain f={f} />
    </AbsoluteFill>
  );
};

// Butang WhatsApp (dipakai di lower-third & kad akhir)
const WaButton: React.FC<{scale?: number; pulse?: number}> = ({scale = 1, pulse = 0}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 22 * scale,
      padding: `${20 * scale}px ${40 * scale}px ${20 * scale}px ${24 * scale}px`,
      borderRadius: 100,
      background: 'linear-gradient(180deg, #2fd46b, #1aa851)',
      boxShadow: `0 16px 40px rgba(26,168,81,0.45), 0 0 0 ${pulse * 18}px rgba(47,212,107,${0.35 * (1 - pulse)})`,
    }}
  >
    <svg width={64 * scale} height={64 * scale} viewBox="0 0 32 32">
      <circle cx={16} cy={16} r={16} fill="#fff" />
      <path
        d="M16 7a9 9 0 0 0-7.8 13.5L7 25l4.6-1.2A9 9 0 1 0 16 7z"
        fill="none"
        stroke="#1aa851"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path d="M12.6 12.2c.3-.7.8-.7 1.1-.5l.9 2c.1.3 0 .6-.3.9l-.4.4c.6 1.2 1.6 2.2 2.8 2.8l.5-.5c.3-.3.6-.3.9-.2l2 .9c.3.2.3.8-.4 1.2-1.5.9-4 .1-5.9-1.9s-2.1-3.9-1.2-5.1z" fill="#1aa851" />
    </svg>
    <div style={{textAlign: 'left'}}>
      <div style={{fontFamily: B, fontWeight: 600, fontSize: 24 * scale, color: 'rgba(255,255,255,0.85)', lineHeight: 1.1}}>
        WhatsApp kami
      </div>
      <div style={{fontFamily: B, fontWeight: 800, fontSize: 46 * scale, color: '#fff', lineHeight: 1.05, letterSpacing: 1}}>{WA}</div>
    </div>
  </div>
);

// ---------- Lower-third WhatsApp di hujung video asal ----------
export const WaLower: React.FC<{f: number}> = ({f}) => {
  if (f < WA_AT || f > END_AT + 8) return null;
  const s = sp(f, WA_AT, 12, 0.6);
  const out = ez(f, END_AT - 4, END_AT + 6);
  const pulse = ((f - WA_AT) % 40) / 40;
  return (
    <div
      style={{
        position: 'absolute',
        top: 1560,
        width: 1080,
        display: 'flex',
        justifyContent: 'center',
        opacity: s * (1 - out),
        transform: `translateY(${(1 - s) * 120}px)`,
      }}
    >
      <WaButton scale={0.9} pulse={pulse} />
    </div>
  );
};

// ---------- Kad akhir ----------
export const EndCard: React.FC<{f: number}> = ({f}) => {
  const l = f - END_AT;
  if (l < 0) return null;
  const reveal = ez(l, 0, 12);
  const logo = sp(l, 6, 12, 0.7);
  const line = ez(l, 12, 26);
  const head = sp(l, 14, 12, 0.6);
  const chip = sp(l, 24, 11, 0.6);
  const btn = sp(l, 32, 10, 0.7);
  const br = ez(l, 42, 54);
  const pulse = l > 40 ? ((l - 40) % 36) / 36 : 0;
  return (
    <AbsoluteFill style={{clipPath: `circle(${reveal * 125}% at 50% 55%)`}}>
      <Backdrop f={f} camY={0} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 440}}>
        <Img
          src={staticFile('izznara-logo-white.png')}
          style={{width: 640, opacity: logo, transform: `scale(${0.85 + 0.15 * logo})`}}
        />
        <div style={{width: 520 * line, height: 3, background: D.gold, marginTop: 40, boxShadow: `0 0 20px ${D.gold}`}} />
        <div
          style={{
            marginTop: 90,
            fontFamily: H,
            fontWeight: 700,
            fontSize: 104,
            lineHeight: 1.08,
            textAlign: 'center',
            color: D.cream,
            opacity: head,
            transform: `translateY(${(1 - head) * 40}px)`,
          }}
        >
          GANTI GIGI HILANG
          <br />
          <span style={{color: D.gold}}>TANPA BUKA & PAKAI</span>
        </div>
        <div
          style={{
            marginTop: 44,
            padding: '12px 34px',
            borderRadius: 60,
            border: `2px solid ${D.gold}`,
            fontFamily: B,
            fontWeight: 700,
            fontSize: 40,
            color: D.goldHi,
            opacity: chip,
            transform: `scale(${0.8 + 0.2 * chip})`,
          }}
        >
          Boleh bayar 2x ansuran
        </div>
        <div style={{marginTop: 110, opacity: btn, transform: `scale(${0.7 + 0.3 * btn})`}}>
          <WaButton scale={1.1} pulse={pulse} />
        </div>
        <div
          style={{
            marginTop: 80,
            fontFamily: B,
            fontWeight: 600,
            fontSize: 36,
            color: D.dim,
            letterSpacing: 1,
            opacity: br,
            display: 'flex',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <span>Jejawi, Perlis</span>
          <span style={{color: D.gold}}>●</span>
          <span>Mergong, Alor Setar</span>
        </div>
      </AbsoluteFill>
      <Grain f={f} />
    </AbsoluteFill>
  );
};

// Kilatan cahaya ringkas pada setiap potongan
export const Flash: React.FC<{f: number}> = ({f}) => {
  let o = 0;
  for (const c of CUTS) {
    if (c === BEN_IN) continue;
    o = Math.max(o, interpolate(f, [c, c + 1, c + 7], [0, 0.22, 0], cl));
  }
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: '#fff4e0', opacity: o, mixBlendMode: 'screen'}} />;
};
