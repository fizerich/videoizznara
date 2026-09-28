import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';

// V3 — edit "pro" untuk video talking-head Self-Ligating Braces.
// Video asal (public/v3/source.mp4) dikekalkan; lapisan di atasnya:
//  1. color grade + vignette
//  2. label bersih menutup typo "Self-Lageting" (20.1–21.2s)
//  3. kad "Sesuai untuk siapa?" menggantikan slide kertas kelabu (40.0–47.0s)
//  4. end card WhatsApp + cawangan selepas "book appointment"
// Audio: suara dibersihkan (voice.wav) + muzik latar lembut + SFX.

export const FPS3 = 30;
export const SRC_END = 1812; // "book appointment" habis ~60.4s
export const END_LEN = 126;
export const TOTAL3 = SRC_END + END_LEN;

// Masa dalam frame video asal
const TYPO = {from: 601, to: 637};
const LIST = {from: 1201, to: 1411, title: 1203, items: [1224, 1237, 1282], sub: 1335};

const P = {
  maroon: '#660920',
  maroonDark: '#2a030c',
  crimson: '#a3122f',
  gold: '#e8c785',
  goldHi: '#fff0c9',
  cream: '#fbf6ee',
  ink: '#210d13',
};
const FONT = 'Poppins, sans-serif';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, at: number, damping = 14, mass = 0.7) =>
  spring({frame: f - at, fps: FPS3, config: {damping, mass}});

// ---------- 1. Grade ----------
const Graded: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile('v3/source.mp4')}
      muted
      style={{width: '100%', height: '100%', filter: 'contrast(1.07) saturate(1.1) brightness(0.99)'}}
    />
    {/* kehangatan lembut */}
    <AbsoluteFill style={{background: 'rgba(255,170,110,0.05)', mixBlendMode: 'soft-light'}} />
    {/* vignette */}
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,5,8,0.28) 100%)'}}
    />
  </AbsoluteFill>
);

// ---------- 2. Label pembetulan typo ----------
const TypoFix: React.FC<{f: number}> = ({f}) => {
  if (f < TYPO.from - 2 || f > TYPO.to + 6) return null;
  const inn = interpolate(f, [TYPO.from - 2, TYPO.from + 2], [0, 1], cl);
  const out = interpolate(f, [TYPO.to, TYPO.to + 6], [1, 0], cl);
  const s = sp(f, TYPO.from - 2, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 150,
        right: 150,
        top: 1185,
        height: 250,
        borderRadius: 40,
        background: `linear-gradient(135deg, ${P.maroon}, ${P.maroonDark})`,
        boxShadow: '0 24px 60px rgba(40,4,12,0.45)',
        border: `3px solid ${P.gold}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: Math.min(inn, out),
        transform: `scale(${0.9 + 0.1 * s})`,
        fontFamily: FONT,
      }}
    >
      <div style={{color: P.gold, fontWeight: 600, fontSize: 30, letterSpacing: 8}}>TEKNOLOGI BRACES</div>
      <div style={{color: '#fff', fontWeight: 800, fontSize: 72, lineHeight: 1.15}}>Self-Ligating</div>
    </div>
  );
};

// ---------- ikon ringkas ----------
const Icon: React.FC<{kind: 'work' | 'study' | 'heart'}> = ({kind}) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke={P.maroon} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'work' ? (
      <>
        <rect x="8" y="20" width="48" height="34" rx="6" />
        <path d="M24 20v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6M8 34h48" />
      </>
    ) : kind === 'study' ? (
      <>
        <path d="M4 24 32 12l28 12-28 12z" />
        <path d="M16 30v12c0 4 8 8 16 8s16-4 16-8V30M60 24v14" />
      </>
    ) : (
      <path d="M32 54S8 40 8 23a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 17-24 31-24 31z" />
    )}
  </svg>
);

// ---------- 3. Kad "Sesuai untuk siapa?" ----------
const ITEMS: {kind: 'work' | 'study' | 'heart'; text: string}[] = [
  {kind: 'work', text: 'Orang yang sibuk bekerja'},
  {kind: 'study', text: 'Pelajar yang tak ada masa'},
  {kind: 'heart', text: 'Pernah pakai braces dulu'},
];

const Backdrop: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: `linear-gradient(170deg, ${P.maroon} 0%, ${P.maroonDark} 75%)`}}>
    <div
      style={{
        position: 'absolute',
        width: 900,
        height: 900,
        borderRadius: '50%',
        left: -250 + 60 * Math.sin(f / 50),
        top: -200 + 40 * Math.cos(f / 60),
        background: 'radial-gradient(circle, rgba(232,199,133,0.22), rgba(232,199,133,0) 65%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 1000,
        height: 1000,
        borderRadius: '50%',
        right: -380 + 50 * Math.cos(f / 45),
        bottom: -300 + 50 * Math.sin(f / 55),
        background: 'radial-gradient(circle, rgba(255,90,120,0.18), rgba(255,90,120,0) 65%)',
      }}
    />
  </AbsoluteFill>
);

const SuitableCard: React.FC<{f: number}> = ({f}) => {
  if (f < LIST.from - 8 || f > LIST.to + 8) return null;
  // masuk: wipe bulat dari tengah; keluar: slide ke atas selepas syot gigi bermula
  const r = interpolate(f, [LIST.from - 8, LIST.from + 6], [0, 1400], cl);
  const exitY = interpolate(f, [LIST.to - 1, LIST.to + 8], [0, -1920], {
    ...cl,
    easing: (t) => t * t * (3 - 2 * t),
  });
  const title = sp(f, LIST.title);
  const sub = sp(f, LIST.sub, 16);
  return (
    <AbsoluteFill style={{clipPath: `circle(${r}px at 50% 50%)`, transform: `translateY(${exitY}px)`}}>
      <Backdrop f={f} />
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', fontFamily: FONT}}>
        <div
          style={{
            display: 'inline-block',
            padding: '14px 34px',
            borderRadius: 999,
            border: `2px solid ${P.gold}`,
            color: P.gold,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 6,
            opacity: title,
          }}
        >
          SELF-LIGATING BRACES
        </div>
        <div
          style={{
            marginTop: 34,
            color: '#fff',
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 1.08,
            opacity: title,
            transform: `translateY(${(1 - title) * 40}px)`,
          }}
        >
          Sesuai untuk
          <br />
          <span style={{color: P.gold}}>siapa?</span>
        </div>
      </div>

      <div style={{position: 'absolute', top: 820, left: 80, right: 80, fontFamily: FONT}}>
        {ITEMS.map((it, i) => {
          const s = sp(f, LIST.items[i], 13);
          return (
            <div
              key={it.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 34,
                background: P.cream,
                borderRadius: 34,
                padding: '30px 36px',
                marginBottom: 34,
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                opacity: Math.min(1, s * 1.3),
                transform: `translateX(${(1 - s) * 160}px)`,
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: '#f3e3cb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon kind={it.kind} />
              </div>
              <div>
                <div style={{color: P.ink, fontWeight: 700, fontSize: 46, lineHeight: 1.2}}>{it.text}</div>
                {i === 2 ? (
                  <div
                    style={{
                      color: P.crimson,
                      fontWeight: 600,
                      fontSize: 38,
                      marginTop: 6,
                      opacity: sub,
                      transform: `translateY(${(1 - sub) * 16}px)`,
                    }}
                  >
                    …dan trauma sebab sakit
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. End card ----------
const WaIcon: React.FC = () => (
  <svg width="62" height="62" viewBox="0 0 32 32">
    <path
      fill="#fff"
      d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.3.6 4.5 1.8 6.4L3 29l7.2-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.2c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.1-4.1-.3-.4c-1-1.6-1.6-3.5-1.6-5.5C5.2 9.8 10 5.1 16 5.1s10.8 4.7 10.8 10.5S22 26.2 16 26.2zm5.9-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2s0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.3-.3-.4-.6-.5z"
    />
  </svg>
);

const Pin: React.FC = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill={P.gold}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const EndCard: React.FC<{f: number}> = ({f}) => {
  // f = frame relatif dari SRC_END - 10
  const wipe = interpolate(f, [0, 14], [1920, 0], {...cl, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const logo = sp(f, 12);
  const head = sp(f, 20);
  const btn = sp(f, 32, 10);
  const pulse = f > 50 ? 1 + 0.03 * Math.sin((f - 50) / 5) : 1;
  const info = sp(f, 44);
  return (
    <AbsoluteFill style={{transform: `translateY(${wipe}px)`}}>
      <Backdrop f={f + 400} />
      <div style={{position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', fontFamily: FONT}}>
        <div style={{opacity: logo, transform: `scale(${0.85 + 0.15 * logo})`}}>
          <Img src={staticFile('izznara-logo-white.png')} style={{height: 170}} />
        </div>
        <div
          style={{
            marginTop: 80,
            color: '#fff',
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 1.12,
            opacity: head,
            transform: `translateY(${(1 - head) * 40}px)`,
          }}
        >
          Tempah konsultasi
          <br />
          <span style={{color: P.gold}}>Self-Ligating Braces</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1110,
          left: 110,
          right: 110,
          height: 150,
          borderRadius: 999,
          background: 'linear-gradient(135deg, #25d366, #128c4a)',
          boxShadow: '0 22px 60px rgba(18,140,74,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          fontFamily: FONT,
          color: '#fff',
          opacity: btn,
          transform: `scale(${(0.8 + 0.2 * btn) * pulse})`,
        }}
      >
        <WaIcon />
        <div style={{fontWeight: 800, fontSize: 64, letterSpacing: 1}}>011-7027 2360</div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1340,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          opacity: info,
          transform: `translateY(${(1 - info) * 30}px)`,
        }}
      >
        <div style={{color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: 32, letterSpacing: 5}}>DUA CAWANGAN</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 50, marginTop: 26}}>
          {[
            ['Jejawi', 'Perlis'],
            ['Mergong', 'Alor Setar'],
          ].map(([a, b]) => (
            <div key={a} style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <Pin />
              <div style={{textAlign: 'left'}}>
                <div style={{color: '#fff', fontWeight: 700, fontSize: 44, lineHeight: 1.1}}>{a}</div>
                <div style={{color: P.gold, fontWeight: 500, fontSize: 30}}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 250,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          color: 'rgba(255,255,255,0.55)',
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: 4,
          opacity: info,
        }}
      >
        YOUR FAMILY DENTIST
      </div>
    </AbsoluteFill>
  );
};

// ---------- Audio ----------
const END_IN = SRC_END - 10;
const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'v3/sfx-swoosh.wav', at: LIST.from - 10, vol: 0.35},
  ...LIST.items.map((at) => ({src: 'v3/sfx-tick.wav', at, vol: 0.3})),
  {src: 'v3/sfx-swoosh.wav', at: LIST.to - 6, vol: 0.3},
  {src: 'v3/sfx-swoosh.wav', at: END_IN - 4, vol: 0.4},
  {src: 'v3/sfx-chime.wav', at: END_IN + 30, vol: 0.35},
];

const musicVol = (f: number) =>
  interpolate(f, [0, END_IN, END_IN + 12, TOTAL3 - 45, TOTAL3], [0.11, 0.11, 0.3, 0.3, 0], cl);

export const SelfLigatingPro: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(['500 40px Poppins', '600 40px Poppins', '700 40px Poppins', '800 40px Poppins'].map((x) => document.fonts.load(x)))
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Graded />
      <TypoFix f={f} />
      <SuitableCard f={f} />
      {f >= END_IN ? <EndCard f={f - END_IN} /> : null}

      <Audio src={staticFile('v3/voice.wav')} />
      <Audio src={staticFile('v3/music.wav')} volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
