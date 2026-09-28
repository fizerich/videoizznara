// V4 — "4 Cara Jaga Gigi", gaya Vox minimalis.
// Kertas krim, dakwat hitam, satu highlighter kuning + pen merah untuk anotasi.
// Masa & potongan dikongsi dengan V3 (src/v3/data.ts).
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/caveat/700.css';
import {cl, sp} from '../v2/kit';
import {Paper} from '../components/ui';
import {at, CLIP_AT, CLIP_LEN, CLIPS, FPS, TOTAL3, VIDEO_END} from '../v3/data';
import {CHUNKS} from '../v3/parts';
import {zoomAt} from '../v3/TipsV3';

const FONTS = ['500 40px Inter', '600 40px Inter', '800 40px Inter', '700 40px Caveat'];

const V = {
  paper: '#f1ece2',
  ink: '#171412',
  soft: '#7a7167',
  hl: '#ffd84a',
  pen: '#d4402a',
  white: '#fffdf8',
};
const SANS = 'Inter, sans-serif';
const HAND = 'Caveat, cursive';

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);

// Garisan "dilukis" (stroke-dashoffset)
const Ink: React.FC<{d: string; p: number; w?: number; c?: string}> = ({d, p, w = 7, c = V.ink}) =>
  p <= 0 ? null : (
    <path
      d={d}
      fill="none"
      stroke={c}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.min(1, p)}
    />
  );

// Sapuan highlighter di belakang teks
const Hl: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    <span
      style={{
        position: 'absolute',
        left: '-0.06em',
        right: '-0.06em',
        top: '0.52em',
        bottom: '0.02em',
        background: V.hl,
        transform: `scaleX(${p}) rotate(-1.2deg)`,
        transformOrigin: 'left center',
        borderRadius: '0.08em 0.3em 0.12em 0.25em',
      }}
    />
    <span style={{position: 'relative'}}>{children}</span>
  </span>
);

const TOOTH =
  'M -90 -80 C -100 -140, -40 -150, 0 -125 C 40 -150, 100 -140, 90 -80 C 85 -20, 70 20, 60 90 C 55 130, 25 135, 18 95 C 12 55, -12 55, -18 95 C -25 135, -55 130, -60 90 C -70 20, -85 -20, -90 -80 Z';
const CHECK = 'M -30 0 L -8 22 L 34 -26';

// ---------- Ikon garisan (viewBox -160..160) ----------

type Icon = 'brush' | 'floss' | 'bottle' | 'calendar' | 'scan' | 'check';

const IconArt: React.FC<{kind: Icon; f: number; p: number; t: (s: number) => number}> = ({kind, f, p, t}) => {
  const q = (a: number, b: number) => interpolate(p, [a, b], [0, 1], cl);
  if (kind === 'brush') {
    const dx = p >= 1 ? Math.sin(f / 2.6) * 22 : 0;
    return (
      <g>
        <g transform="translate(0 70) scale(0.75)">
          <Ink d={TOOTH} p={q(0, 0.5)} w={8} />
        </g>
        <g transform={`translate(${dx} -60) rotate(-14)`}>
          <Ink d="M -140 10 L 30 10 Q 44 10 44 0 Q 44 -10 30 -10 L -140 -10 Q -152 -10 -152 0 Q -152 10 -140 10 Z" p={q(0.2, 0.7)} w={7} />
          <Ink d="M 44 -12 L 132 -12 L 132 12 L 44 12" p={q(0.5, 0.8)} w={7} />
          <Ink d="M 56 12 L 56 42 M 74 12 L 74 42 M 92 12 L 92 42 M 110 12 L 110 42 M 126 12 L 126 42" p={q(0.7, 1)} w={6} />
        </g>
      </g>
    );
  }
  if (kind === 'floss') {
    const dive = interpolate(f, [t(50.6), t(51.3)], [0, 1], cl);
    const yF = -140 + 150 * Math.max(q(0.6, 1) * 0.35, dive) + Math.sin(f / 3) * 14 * dive;
    const pop = interpolate(f, [t(51.6), t(52.4)], [0, 1], cl);
    return (
      <g>
        <g transform="translate(-72 30) scale(0.62)">
          <Ink d={TOOTH} p={q(0, 0.5)} w={11} />
        </g>
        <g transform="translate(72 30) scale(0.62)">
          <Ink d={TOOTH} p={q(0.15, 0.6)} w={11} />
        </g>
        {pop < 1 ? (
          <circle cx={pop * 90} cy={-20 - pop * 120} r={14} fill={V.pen} opacity={q(0.6, 0.8) * (1 - pop)} />
        ) : null}
        <Ink d={`M -150 -120 L 0 ${yF} L 150 -120`} p={q(0.55, 1)} w={5} c={V.pen} />
      </g>
    );
  }
  if (kind === 'bottle') {
    const wob = p >= 1 ? Math.sin(f / 6) * 8 : 0;
    return (
      <g transform="translate(0 10)">
        <Ink d="M -32 -150 L 32 -150 L 32 -112 L -32 -112 Z" p={q(0, 0.3)} w={7} />
        <Ink
          d="M -24 -112 L -24 -88 Q -86 -76 -86 -20 L -86 118 Q -86 140 -64 140 L 64 140 Q 86 140 86 118 L 86 -20 Q 86 -76 24 -88 L 24 -112"
          p={q(0.15, 0.8)}
          w={7}
        />
        <Ink d={`M -86 10 Q -43 ${-12 + wob} 0 10 T 86 10`} p={q(0.7, 1)} w={6} c={V.pen} />
      </g>
    );
  }
  if (kind === 'calendar') {
    const mark = interpolate(f, [t(82.72), t(83.3)], [0, 1], cl);
    return (
      <g>
        <Ink d="M -120 -100 L 120 -100 L 120 130 L -120 130 Z" p={q(0, 0.45)} w={7} />
        <Ink d="M -120 -50 L 120 -50" p={q(0.4, 0.6)} w={7} />
        <Ink d="M -60 -125 L -60 -80 M 60 -125 L 60 -80" p={q(0.5, 0.7)} w={7} />
        {Array.from({length: 12}, (_, i) => (
          <circle key={i} cx={-80 + (i % 4) * 53} cy={-12 + Math.floor(i / 4) * 50} r={7} fill={V.ink} opacity={q(0.6 + i * 0.03, 0.7 + i * 0.03)} />
        ))}
        <Ink d="M -104 -12 C -104 -44, -56 -44, -56 -12 C -56 18, -104 18, -102 -16" p={mark} w={6} c={V.pen} />
        <text x={-40} y={-40} fontFamily={HAND} fontWeight={700} fontSize={56} fill={V.pen} opacity={mark}>
          1×
        </text>
      </g>
    );
  }
  if (kind === 'scan') {
    const spot = interpolate(f, [t(95.7), t(96.2)], [0, 1], cl);
    const a = f / 16;
    const mx = interpolate(spot, [0, 1], [Math.cos(a) * 60, 30]);
    const my = interpolate(spot, [0, 1], [-30 + Math.sin(a) * 40, -60]);
    return (
      <g>
        <g transform="translate(0 30) scale(0.9)">
          <Ink d={TOOTH} p={q(0, 0.6)} w={8} />
        </g>
        <circle cx={30} cy={-60} r={16 * spot} fill={V.pen} />
        <g transform={`translate(${mx} ${my})`} opacity={q(0.5, 0.8)}>
          <circle r={48} fill="rgba(255,255,255,0.35)" stroke={V.ink} strokeWidth={7} />
          <path d="M 34 34 L 84 84" stroke={V.ink} strokeWidth={12} strokeLinecap="round" />
        </g>
      </g>
    );
  }
  return (
    <g>
      <g transform="translate(0 30) scale(0.9)">
        <Ink d={TOOTH} p={q(0, 0.5)} w={8} />
      </g>
      <g transform="translate(10 -10) scale(2)">
        <Ink d={CHECK} p={q(0.5, 1)} w={7} c={V.pen} />
      </g>
    </g>
  );
};

// ---------- Kandungan atas (babak) ----------

type Line = {at: number; text: string; strike?: boolean};
type Phase = {from: number; icon?: Icon; lines: Line[]};
type Scene = {from: number; to: number; n?: number; kicker: string; title: React.ReactNode[]; hlAt: number; phases: Phase[]};

const SCENES: Scene[] = [
  {
    from: 0.45,
    to: 16.6,
    kicker: 'Assalamualaikum —',
    title: ['4 cara', 'jaga gigi'],
    hlAt: 9.06,
    phases: [{from: 0, lines: [{at: 12.68, text: 'tak berlubang'}, {at: 14.12, text: 'gusi sihat'}]}],
  },
  {
    from: 18.3,
    to: 31.4,
    n: 1,
    kicker: 'yang pertama',
    title: ['Berus gigi'],
    hlAt: 19.8,
    phases: [{from: 18.3, icon: 'brush', lines: [{at: 24.84, text: '2× sehari'}, {at: 28.28, text: 'pagi & malam'}]}],
  },
  {
    from: 31.56,
    to: 61.0,
    n: 2,
    kicker: 'yang kedua',
    title: ['Floss'],
    hlAt: 33.9,
    phases: [
      {from: 31.56, icon: 'floss', lines: [{at: 37.38, text: 'idealnya 2 hari sekali'}, {at: 43.96, text: 'paling kurang seminggu sekali'}]},
      {from: 48.2, icon: 'floss', lines: [{at: 51.52, text: 'buang sisa makanan'}, {at: 55.26, text: 'lepas makan daging!'}]},
    ],
  },
  {
    from: 62.9,
    to: 72.6,
    n: 3,
    kicker: 'yang ketiga',
    title: ['Ubat kumur'],
    hlAt: 66.6,
    phases: [
      {
        from: 62.9,
        icon: 'bottle',
        lines: [
          {at: 67.84, text: 'setiap hari', strike: true},
          {at: 70.88, text: '± seminggu sekali'},
        ],
      },
    ],
  },
  {
    from: 74.1,
    to: 106.7,
    n: 4,
    kicker: 'yang keempat',
    title: ['Check-up gigi'],
    hlAt: 77.3,
    phases: [
      {
        from: 74.1,
        icon: 'calendar',
        lines: [
          {at: 79.5, text: 'klinik kerajaan / swasta'},
          {at: 82.72, text: 'sekurang-kurangnya setahun sekali'},
        ],
      },
      {from: 85.3, icon: 'scan', lines: [{at: 89.02, text: 'doktor boleh kesan awal'}, {at: 95.7, text: 'karies, gigi berlubang'}]},
      {from: 104.2, icon: 'check', lines: [{at: 104.9, text: '→ rawatan awal'}]},
    ],
  },
];

const RECAP = ['Berus gigi — 2× sehari', 'Floss — 2 hari sekali', 'Ubat kumur — ± seminggu sekali', 'Check-up — setahun sekali'];

const Progress: React.FC<{f: number; n: number; from: number}> = ({f, n, from}) => {
  const p = ramp(f, from + 8, from + 22);
  return (
    <div style={{position: 'absolute', top: 64, right: 84, display: 'flex', gap: 30}}>
      {[1, 2, 3, 4].map((k) => (
        <div key={k} style={{position: 'relative', fontFamily: SANS, fontWeight: 800, fontSize: 36, color: k <= n ? V.ink : '#c4bcb0'}}>
          {k}
          {k === n ? (
            <svg width={80} height={80} viewBox="-40 -40 80 80" style={{position: 'absolute', left: -28, top: -18, overflow: 'visible'}}>
              <Ink d="M -26 -6 C -24 -34, 28 -32, 28 0 C 28 30, -26 30, -28 -2 C -28 -18, -10 -30, 6 -30" p={p} w={4} c={V.pen} />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  );
};

const SceneView: React.FC<{f: number; s: Scene}> = ({f, s}) => {
  const a = at(s.from);
  const b = at(s.to);
  if (f < a - 2 || f > b + 12) return null;
  const inn = sp(f, a, 16, 0.8);
  const out = ramp(f, b, b + 10);
  const hl = ramp(f, at(s.hlAt), at(s.hlAt) + 9);
  const phaseIdx = s.phases.reduce((k, ph, i) => (f >= at(ph.from) ? i : k), 0);
  const big = s.n === undefined;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateX(${(1 - inn) * 90 - out * 60}px)`}}>
      {s.n ? <Progress f={f} n={s.n} from={a} /> : null}
      <div style={{position: 'absolute', top: big ? 150 : 150, left: 84, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: V.pen, opacity: inn}}>
        {s.kicker}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 80,
          right: 60,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: big ? 150 : 124,
          lineHeight: 0.98,
          letterSpacing: -4,
          color: V.ink,
        }}
      >
        {s.title.map((t, i) => (
          <div key={i}>{i === s.title.length - 1 ? <Hl p={hl}>{t}</Hl> : t}</div>
        ))}
      </div>
      {s.phases.map((ph, i) => {
        const pa = at(ph.from);
        const pb = i + 1 < s.phases.length ? at(s.phases[i + 1].from) : Infinity;
        if (i > phaseIdx || (i < phaseIdx && f > pb + 8)) return null;
        const vis = i === phaseIdx ? ramp(f, pa, pa + 8) : 1 - ramp(f, pb, pb + 8);
        const top = big ? 560 : 400;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, opacity: vis}}>
            {ph.icon ? (
              <svg width={320} height={320} viewBox="-160 -160 320 320" style={{position: 'absolute', top: 370, right: 60, overflow: 'visible'}}>
                <IconArt kind={ph.icon} f={f} p={ramp(f, pa + 6, pa + 40)} t={at} />
              </svg>
            ) : null}
            <div style={{position: 'absolute', top, left: 84, right: ph.icon ? 400 : 84, display: 'flex', flexDirection: big ? 'row' : 'column', gap: big ? 50 : 22}}>
              {ph.lines.map((l) => {
                const ls = sp(f, at(l.at), 14, 0.6);
                const u = ramp(f, at(l.at) + 4, at(l.at) + 16);
                return (
                  <div
                    key={l.text}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      fontFamily: HAND,
                      fontWeight: 700,
                      fontSize: 62,
                      lineHeight: 1.05,
                      color: l.strike ? V.soft : V.ink,
                      opacity: Math.min(1, ls),
                      transform: `translateY(${(1 - ls) * 18}px)`,
                    }}
                  >
                    {big ? (
                      <svg width={50} height={50} viewBox="-40 -40 80 80">
                        <Ink d={CHECK} p={u} w={9} c={V.pen} />
                      </svg>
                    ) : null}
                    <span style={{position: 'relative'}}>
                      {l.text}
                      <svg
                        width="100%"
                        height={30}
                        viewBox="0 0 100 30"
                        preserveAspectRatio="none"
                        style={{position: 'absolute', left: 0, top: l.strike ? '38%' : '88%', overflow: 'visible'}}
                      >
                        {l.strike ? (
                          <Ink d="M -2 16 C 30 8, 60 22, 102 10" p={u} w={5} c={V.pen} />
                        ) : !big ? (
                          <Ink d="M 0 10 C 30 16, 70 4, 100 12" p={u * 0.999} w={3} c={V.pen} />
                        ) : null}
                      </svg>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Recap: React.FC<{f: number}> = ({f}) => {
  const a = at(106.72);
  if (f < a - 2 || f > VIDEO_END + 12) return null;
  const inn = sp(f, a, 16, 0.8);
  const out = ramp(f, VIDEO_END - 4, VIDEO_END + 8);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateX(${(1 - inn) * 90}px)`}}>
      <div style={{position: 'absolute', top: 150, left: 84, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: V.pen}}>jadi, ringkasnya</div>
      <div style={{position: 'absolute', top: 230, left: 84, right: 60, display: 'flex', flexDirection: 'column', gap: 24}}>
        {RECAP.map((t, i) => {
          const s = sp(f, a + 6 + i * 6, 14, 0.6);
          const [head, rest] = t.split(' — ');
          return (
            <div key={t} style={{display: 'flex', alignItems: 'baseline', gap: 26, opacity: Math.min(1, s), transform: `translateX(${(1 - s) * 40}px)`}}>
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: V.pen, width: 40}}>{i + 1}</span>
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: -2, color: V.ink}}>
                <Hl p={ramp(f, a + 10 + i * 6, a + 20 + i * 6)}>{head}</Hl>
              </span>
              <span style={{fontFamily: HAND, fontWeight: 700, fontSize: 52, color: V.soft}}>{rest}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Video dalam bingkai foto ----------

const FW = 960;
const FH = 1100;
const IW = FW - 28;
const IH = Math.round((IW * 1920) / 1080);

const Photo: React.FC<{f: number}> = ({f}) => {
  const drop = sp(f, 0, 15, 0.9);
  const leave = ramp(f, VIDEO_END - 10, VIDEO_END + 6);
  const z = zoomAt(f);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 770,
        width: FW,
        height: FH,
        padding: 14,
        background: V.white,
        boxShadow: '0 22px 50px rgba(40,30,20,0.22), 0 2px 6px rgba(40,30,20,0.15)',
        transform: `translateY(${(1 - drop) * 1200 + leave * 1300}px) rotate(${-0.8 + (1 - drop) * 4}deg)`,
      }}
    >
      <div style={{position: 'relative', width: IW, height: FH - 28, overflow: 'hidden', background: '#222'}}>
        <div style={{position: 'absolute', left: 0, top: -Math.round(IH * 0.29), width: IW, height: IH, transform: `scale(${z})`, transformOrigin: '50% 60%'}}>
          {CLIPS.map(([a], i) => (
            <Sequence key={i} from={CLIP_AT[i]} durationInFrames={CLIP_LEN[i]} layout="none">
              <OffthreadVideo
                src={staticFile('video/tips-jaga-gigi.mov')}
                trimBefore={Math.round(a * FPS)}
                volume={(v) => interpolate(v, [0, 3, CLIP_LEN[i] - 3, CLIP_LEN[i]], [0, 1, 1, 0], cl)}
                style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.82) contrast(1.05) sepia(0.08)'}}
              />
            </Sequence>
          ))}
        </div>
        <Captions f={f} />
      </div>
      {[
        {l: -34, r: -38},
        {l: FW - 120, r: 34},
      ].map((t, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: -26,
            left: t.l,
            width: 160,
            height: 52,
            background: 'rgba(236,226,196,0.78)',
            transform: `rotate(${t.r}deg)`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        />
      ))}
    </div>
  );
};

// Kapsyen minimal: putih, perkataan semasa dapat highlighter kuning
const Captions: React.FC<{f: number}> = ({f}) => {
  const c = CHUNKS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const cur = c.words.reduce((k, w, i) => (f >= w.s ? i : k), -1);
  const fadeIn = ramp(f, c.from, c.from + 4);
  const fadeOut = 1 - ramp(f, c.to - 4, c.to);
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: 790,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 6,
        rowGap: 4,
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      {c.words.map((w, i) => {
        const active = i === cur;
        const said = f >= w.s - 1;
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              fontFamily: SANS,
              fontWeight: w.key ? 800 : 600,
              fontSize: 64,
              lineHeight: 1.2,
              padding: '0 8px',
              color: active ? V.ink : '#ffffff',
              opacity: said ? 1 : 0.5,
              textShadow: active ? 'none' : '0 2px 14px rgba(0,0,0,0.7)',
            }}
          >
            {active ? (
              <span
                style={{
                  position: 'absolute',
                  inset: '8% 0 4% 0',
                  background: V.hl,
                  transform: `scaleX(${ramp(f, w.s - 1, w.s + 3)}) rotate(-1.5deg)`,
                  transformOrigin: 'left center',
                  borderRadius: 6,
                }}
              />
            ) : null}
            <span style={{position: 'relative'}}>{w.t}</span>
          </span>
        );
      })}
    </div>
  );
};

// ---------- End card ----------

const EndCard: React.FC<{f: number}> = ({f}) => {
  const e = f - VIDEO_END;
  if (e < 0) return null;
  const k = sp(e, 4, 16, 0.8);
  const t1 = sp(e, 10, 16, 0.8);
  const hl = ramp(e, 26, 36);
  const info = sp(e, 40, 16, 0.8);
  const u = ramp(e, 48, 62);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', top: 640, left: 84, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: V.pen, opacity: k}}>
        ingat,
      </div>
      <div
        style={{
          position: 'absolute',
          top: 720,
          left: 80,
          right: 60,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 114,
          lineHeight: 1,
          letterSpacing: -4,
          color: V.ink,
          opacity: t1,
          transform: `translateY(${(1 - t1) * 40}px)`,
        }}
      >
        Jaga gigi,
        <br />
        jaga <Hl p={hl}>senyuman.</Hl>
      </div>
      <div style={{position: 'absolute', top: 1010, left: 84, right: 84, opacity: info, transform: `translateY(${(1 - info) * 20}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 38, color: V.soft}}>Klinik Pergigian Izznara · Jejawi & Mergong</div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 18, fontFamily: SANS, fontWeight: 800, fontSize: 58, color: V.ink}}>
          WhatsApp 011-7027 2360
          <svg width="100%" height={30} viewBox="0 0 100 30" preserveAspectRatio="none" style={{position: 'absolute', left: 0, top: '92%', overflow: 'visible'}}>
            <Ink d="M 0 10 C 30 18, 70 2, 100 12" p={u} w={4} c={V.pen} />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ---------- Bunyi (minimal) ----------

const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'sfx-whoosh.wav', at: 0, vol: 0.3},
  ...[18.3, 31.56, 62.9, 74.1, 106.72].map((s) => ({src: 'sfx-whoosh.wav', at: Math.round(at(s)) - 3, vol: 0.28})),
  ...[12.68, 14.12, 24.84, 28.28, 37.38, 43.96, 51.52, 55.26, 67.84, 70.88, 79.5, 82.72, 89.02, 95.7, 104.9].map((s) => ({
    src: 'sfx-pop.wav',
    at: Math.round(at(s)),
    vol: 0.18,
  })),
  {src: 'sfx-whoosh.wav', at: VIDEO_END - 10, vol: 0.35},
  {src: 'sfx-ting.wav', at: VIDEO_END + 36, vol: 0.25},
];

export const VoxV4: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((x) => document.fonts.load(x))).then(() => continueRender(handle));
  }, [handle]);

  // "boil" kertas — anjakan kecil setiap 3 frame, ala stop-motion
  const tick = Math.floor(f / 3);
  const jx = (random(`jx${tick}`) - 0.5) * 3;
  const jy = (random(`jy${tick}`) - 0.5) * 3;

  return (
    <AbsoluteFill style={{background: V.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${jx}px, ${jy}px) scale(1.01)`}}>
        <Paper color={V.paper} />
      </AbsoluteFill>
      {SCENES.map((s, i) => (
        <SceneView key={i} f={f} s={s} />
      ))}
      <Recap f={f} />
      <Photo f={f} />
      <EndCard f={f} />

      <Audio
        src={staticFile('audio/music-v3.wav')}
        volume={(v) => interpolate(v, [0, 20, VIDEO_END - 20, VIDEO_END + 10, TOTAL3 - 25, TOTAL3], [0, 0.1, 0.1, 0.4, 0.4, 0], cl)}
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
