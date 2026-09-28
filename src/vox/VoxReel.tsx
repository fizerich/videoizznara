// Enjin reel gaya Vox minimalis — dikongsi oleh V4, V5, dsb.
// Kertas krim, dakwat hitam, satu highlighter kuning + pen merah untuk anotasi.
// Setiap video hanya perlukan satu VoxConfig (masa dalam SAAT video asal).
import React, {useEffect, useMemo, useState} from 'react';
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

export const FPS = 30;
export const END_CARD = 165;

// ---------- Konfigurasi ----------

export type Icon =
  | 'brush' | 'floss' | 'bottle' | 'calendar' | 'scan' | 'check' | 'tooth' | 'cross' | 'clock' | 'candy' | 'gum' | 'kid'
  | 'plane' | 'seat' | 'scream' | 'beach';
export type Line = {at: number; text: string; strike?: boolean; plain?: boolean}; // plain: tanpa tanda ✓ (babak pembuka)
// ev: masa peristiwa khas ikon (cth. floss: [turun, sisa tercabut]; calendar: [bulat]; scan: [titik]; cross: [pangkah])
export type Phase = {from: number; icon?: Icon; ev?: number[]; lines: Line[]};
export type Scene = {from: number; to: number; n?: number; kicker: string; title: string[]; hlAt: number; phases: Phase[]};

export type VoxConfig = {
  video: string;
  clips: [number, number][];
  captions: [string, number, number][];
  zoomAt: number[];
  crop?: number; // bahagian atas video yang dipotong (0–1)
  captionBg?: boolean; // latar gelap di belakang kapsyen (bila baju/latar video cerah)
  focusY?: number; // pusat zoom (%)
  total?: number; // bilangan tip untuk penunjuk 1..N
  scenes: Scene[];
  recap: {from: number; kicker: string; items: string[]}; // item: "Tajuk — nota"
  end: {kicker: string; line1: string; line2: string; hl: string; info?: string; contact?: string};
  pops: number[];
  whooshes: number[];
};

export const timeline = (clips: [number, number][]) => {
  const len = clips.map(([a, b]) => Math.round((b - a) * FPS));
  const clipAt = len.map((_, i) => len.slice(0, i).reduce((x, y) => x + y, 0));
  const videoEnd = len.reduce((x, y) => x + y, 0);
  const at = (src: number): number => {
    for (let i = 0; i < clips.length; i++) {
      const [a, b] = clips[i];
      if (src < a) return clipAt[i];
      if (src <= b) return clipAt[i] + (src - a) * FPS;
    }
    return videoEnd;
  };
  return {len, clipAt, videoEnd, at, total: videoEnd + END_CARD};
};

// ---------- Gaya ----------

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
const FONTS = ['500 40px Inter', '600 40px Inter', '800 40px Inter', '700 40px Caveat'];

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);

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

const IconArt: React.FC<{kind: Icon; f: number; p: number; ev: number[]}> = ({kind, f, p, ev}) => {
  const q = (a: number, b: number) => interpolate(p, [a, b], [0, 1], cl);
  const e = (i: number, d = 14) => (ev[i] === undefined ? 0 : ramp(f, ev[i], ev[i] + d));
  const tooth = (tp: number, s = 0.9, y = 30) => (
    <g transform={`translate(0 ${y}) scale(${s})`}>
      <Ink d={TOOTH} p={tp} w={8 / s} />
    </g>
  );
  switch (kind) {
    case 'brush': {
      const dx = p >= 1 ? Math.sin(f / 2.6) * 22 : 0;
      return (
        <g>
          {tooth(q(0, 0.5), 0.75, 70)}
          <g transform={`translate(${dx} -60) rotate(-14)`}>
            <Ink d="M -140 10 L 30 10 Q 44 10 44 0 Q 44 -10 30 -10 L -140 -10 Q -152 -10 -152 0 Q -152 10 -140 10 Z" p={q(0.2, 0.7)} w={7} />
            <Ink d="M 44 -12 L 132 -12 L 132 12 L 44 12" p={q(0.5, 0.8)} w={7} />
            <Ink d="M 56 12 L 56 42 M 74 12 L 74 42 M 92 12 L 92 42 M 110 12 L 110 42 M 126 12 L 126 42" p={q(0.7, 1)} w={6} />
          </g>
        </g>
      );
    }
    case 'floss': {
      const dive = e(0, 20);
      const yF = -140 + 150 * Math.max(q(0.6, 1) * 0.35, dive) + Math.sin(f / 3) * 14 * dive;
      const pop = e(1, 24);
      return (
        <g>
          <g transform="translate(-72 30) scale(0.62)">
            <Ink d={TOOTH} p={q(0, 0.5)} w={11} />
          </g>
          <g transform="translate(72 30) scale(0.62)">
            <Ink d={TOOTH} p={q(0.15, 0.6)} w={11} />
          </g>
          {pop < 1 ? <circle cx={pop * 90} cy={-20 - pop * 120} r={14} fill={V.pen} opacity={q(0.6, 0.8) * (1 - pop)} /> : null}
          <Ink d={`M -150 -120 L 0 ${yF} L 150 -120`} p={q(0.55, 1)} w={5} c={V.pen} />
        </g>
      );
    }
    case 'bottle': {
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
    case 'calendar': {
      const mark = e(0, 18);
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
    case 'scan': {
      const spot = e(0, 15);
      const a = f / 16;
      const mx = interpolate(spot, [0, 1], [Math.cos(a) * 60, 30]);
      const my = interpolate(spot, [0, 1], [-30 + Math.sin(a) * 40, -60]);
      return (
        <g>
          {tooth(q(0, 0.6))}
          <circle cx={30} cy={-60} r={16 * spot} fill={V.pen} />
          <g transform={`translate(${mx} ${my})`} opacity={q(0.5, 0.8)}>
            <circle r={48} fill="rgba(255,255,255,0.35)" stroke={V.ink} strokeWidth={7} />
            <path d="M 34 34 L 84 84" stroke={V.ink} strokeWidth={12} strokeLinecap="round" />
          </g>
        </g>
      );
    }
    case 'cross':
      return (
        <g>
          {tooth(q(0, 0.6))}
          <Ink d="M -90 -110 L 90 90" p={ev[0] === undefined ? q(0.6, 0.8) : e(0)} w={10} c={V.pen} />
          <Ink d="M 90 -110 L -90 90" p={ev[0] === undefined ? q(0.8, 1) : ramp(f, ev[0] + 6, ev[0] + 20)} w={10} c={V.pen} />
        </g>
      );
    case 'tooth': {
      const bob = p >= 1 ? Math.sin(f / 10) * 5 : 0;
      return (
        <g transform={`translate(0 ${bob})`}>
          {tooth(q(0, 0.8), 1, 20)}
          <Ink d="M 70 -130 L 70 -100 M 55 -115 L 85 -115" p={q(0.8, 1)} w={5} c={V.pen} />
          <Ink d="M -95 -60 L -95 -40 M -105 -50 L -85 -50" p={q(0.85, 1)} w={4} c={V.pen} />
        </g>
      );
    }
    case 'clock': {
      const hand = p >= 1 ? f * 6 : 0;
      return (
        <g>
          <Ink d="M 0 -120 A 120 120 0 1 1 -0.1 -120" p={q(0, 0.6)} w={7} />
          <g transform={`rotate(${hand})`}>
            <Ink d="M 0 0 L 0 -85" p={q(0.6, 0.8)} w={7} c={V.pen} />
          </g>
          <Ink d="M 0 0 L 55 0" p={q(0.7, 0.9)} w={9} />
          <circle r={8} fill={V.ink} opacity={q(0.8, 1)} />
        </g>
      );
    }
    case 'candy':
      return (
        <g transform={`rotate(${p >= 1 ? Math.sin(f / 8) * 6 : 0})`}>
          <Ink d="M -60 0 C -60 -50, 60 -50, 60 0 C 60 50, -60 50, -60 0 Z" p={q(0, 0.5)} w={7} />
          <Ink d="M -60 0 L -120 -45 L -115 45 Z M 60 0 L 120 -45 L 115 45 Z" p={q(0.4, 0.8)} w={7} />
          <Ink d="M -25 -30 C -5 -10, -5 10, -25 30 M 10 -34 C 30 -10, 30 10, 10 34" p={q(0.7, 1)} w={6} c={V.pen} />
        </g>
      );
    case 'gum':
      return (
        <g>
          <Ink d="M -140 -30 C -100 -80, 100 -80, 140 -30" p={q(0, 0.5)} w={8} c={V.pen} />
          {[-100, -50, 0, 50, 100].map((x, i) => (
            <Ink key={x} d={`M ${x - 22} -40 L ${x - 18} 60 Q ${x} 80 ${x + 18} 60 L ${x + 22} -40`} p={q(0.3 + i * 0.1, 0.6 + i * 0.1)} w={6} />
          ))}
        </g>
      );
    case 'kid':
      return (
        <g>
          <Ink d="M 0 -140 A 60 60 0 1 1 -0.1 -140" p={q(0, 0.4)} w={7} />
          <Ink d="M -24 -50 Q 0 -30 24 -50" p={q(0.4, 0.55)} w={6} c={V.pen} />
          <Ink d="M -70 140 L -70 40 Q -70 10 -40 10 L 40 10 Q 70 10 70 40 L 70 140" p={q(0.5, 1)} w={7} />
        </g>
      );
    case 'plane': {
      const fly = p >= 1 ? Math.sin(f / 12) * 10 : 0;
      return (
        <g transform={`translate(0 ${fly}) rotate(-12)`}>
          <Ink d="M -140 0 C -140 -22, 110 -22, 140 0 C 110 22, -140 22, -140 0 Z" p={q(0, 0.45)} w={7} />
          <Ink d="M -10 -12 L -60 -110 L -20 -110 L 50 -12 M -10 12 L -60 110 L -20 110 L 50 12" p={q(0.35, 0.75)} w={7} />
          <Ink d="M -120 -8 L -140 -60 L -110 -60 L -90 -14" p={q(0.6, 0.85)} w={6} />
          <Ink d="M 70 -6 L 80 -6 M 40 -6 L 50 -6 M 10 -6 L 20 -6" p={q(0.8, 1)} w={6} c={V.pen} />
          <Ink d="M -150 50 L -230 60 M -150 80 L -210 96" p={q(0.85, 1)} w={4} c={V.pen} />
        </g>
      );
    }
    case 'seat':
      return (
        <g>
          {[-80, 80].map((x, i) => (
            <g key={x}>
              <Ink d={`M ${x - 55} -120 L ${x - 55} 60 L ${x + 55} 60 L ${x + 55} -120 Q ${x} -140 ${x - 55} -120`} p={q(0.1 * i, 0.5 + 0.1 * i)} w={7} />
              <Ink d={`M ${x - 70} 60 L ${x - 70} 130 M ${x + 70} 60 L ${x + 70} 130 M ${x - 75} 60 L ${x + 75} 60`} p={q(0.4 + 0.1 * i, 0.8)} w={7} />
            </g>
          ))}
          <circle cx={80} cy={-50} r={22 * q(0.85, 1)} fill={V.pen} />
        </g>
      );
    case 'scream': {
      const sh = p >= 1 ? Math.sin(f * 1.3) * 4 : 0;
      return (
        <g transform={`translate(${sh} 0)`}>
          <Ink d="M 0 -130 C 90 -130, 110 -40, 100 30 C 90 110, 40 140, 0 140 C -40 140, -90 110, -100 30 C -110 -40, -90 -130, 0 -130 Z" p={q(0, 0.5)} w={7} />
          <Ink d="M -50 -40 L -30 -30 M 50 -40 L 30 -30" p={q(0.45, 0.6)} w={8} />
          <Ink d="M -22 30 C -30 100, 30 100, 22 30 C 16 10, -16 10, -22 30 Z" p={q(0.55, 0.85)} w={7} c={V.pen} />
          <Ink d="M -150 -80 L -125 -60 M -160 -20 L -128 -18 M 150 -80 L 125 -60 M 160 -20 L 128 -18" p={q(0.8, 1)} w={6} c={V.pen} />
        </g>
      );
    }
    case 'beach': {
      const w = p >= 1 ? Math.sin(f / 7) * 8 : 0;
      return (
        <g>
          <Ink d="M 60 -80 A 50 50 0 1 1 59.9 -80" p={q(0, 0.35)} w={7} c={V.pen} />
          <Ink d={`M -150 40 Q -110 ${20 + w} -75 40 T 0 40 T 75 40 T 150 40`} p={q(0.3, 0.65)} w={7} />
          <Ink d={`M -150 90 Q -110 ${70 - w} -75 90 T 0 90 T 75 90 T 150 90`} p={q(0.5, 0.85)} w={7} />
          <Ink d="M -110 -110 L -70 -70 M -70 -110 L -110 -70" p={q(0.85, 1)} w={7} c={V.pen} />
        </g>
      );
    }
    default:
      return (
        <g>
          {tooth(q(0, 0.5))}
          <g transform="translate(10 -10) scale(2)">
            <Ink d={CHECK} p={q(0.5, 1)} w={7} c={V.pen} />
          </g>
        </g>
      );
  }
};

// ---------- Komponen ----------

type TL = ReturnType<typeof timeline>;

const Progress: React.FC<{f: number; n: number; total: number; from: number}> = ({f, n, total, from}) => {
  const p = ramp(f, from + 8, from + 22);
  return (
    <div style={{position: 'absolute', top: 64, right: 84, display: 'flex', gap: 30}}>
      {Array.from({length: total}, (_, i) => i + 1).map((k) => (
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

const SceneView: React.FC<{f: number; s: Scene; tl: TL; total: number}> = ({f, s, tl, total}) => {
  const {at} = tl;
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
      {s.n ? <Progress f={f} n={s.n} total={total} from={a} /> : null}
      <div style={{position: 'absolute', top: 150, left: 84, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: V.pen, opacity: inn}}>{s.kicker}</div>
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
                <IconArt kind={ph.icon} f={f} p={ramp(f, pa + 6, pa + 40)} ev={(ph.ev ?? []).map(at)} />
              </svg>
            ) : null}
            <div
              style={{
                position: 'absolute',
                top,
                left: 84,
                right: ph.icon ? 400 : 84,
                display: 'flex',
                flexDirection: big ? 'row' : 'column',
                flexWrap: 'wrap',
                gap: big ? 50 : 22,
              }}
            >
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
                    {big && !l.plain ? (
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

const Recap: React.FC<{f: number; cfg: VoxConfig; tl: TL}> = ({f, cfg, tl}) => {
  const a = tl.at(cfg.recap.from);
  if (f < a - 2 || f > tl.videoEnd + 12) return null;
  const inn = sp(f, a, 16, 0.8);
  const out = ramp(f, tl.videoEnd - 4, tl.videoEnd + 8);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateX(${(1 - inn) * 90}px)`}}>
      <div style={{position: 'absolute', top: 150, left: 84, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: V.pen}}>{cfg.recap.kicker}</div>
      <div style={{position: 'absolute', top: 230, left: 84, right: 60, display: 'flex', flexDirection: 'column', gap: 24}}>
        {cfg.recap.items.map((t, i) => {
          const s = sp(f, a + 6 + i * 6, 14, 0.6);
          const [head, rest] = t.split(' — ');
          return (
            <div key={t} style={{display: 'flex', alignItems: 'baseline', gap: 26, opacity: Math.min(1, s), transform: `translateX(${(1 - s) * 40}px)`}}>
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: V.pen, width: 40}}>{i + 1}</span>
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: -2, color: V.ink, whiteSpace: 'nowrap'}}>
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

// Kapsyen: [teks, mula, tamat] -> kumpulan perkataan bermasa (frame output)
const buildChunks = (captions: VoxConfig['captions'], at: (s: number) => number) =>
  captions.map(([text, s, e], i) => {
    const a = at(s);
    const b = at(e);
    const next = i + 1 < captions.length ? at(captions[i + 1][1]) : Infinity;
    const raw = text.split(' ');
    const weights = raw.map((w) => w.replace(/\*/g, '').length + 2);
    const total = weights.reduce((x, y) => x + y, 0);
    let acc = 0;
    const words = raw.map((w, k) => {
      const s0 = a + (acc / total) * (b - a);
      acc += weights[k];
      return {t: w.replace(/\*/g, ''), key: w.startsWith('*'), s: s0};
    });
    return {from: a - 3, to: Math.min(b + 16, next - 3), words};
  });

type Chunk = ReturnType<typeof buildChunks>[number];

const Captions: React.FC<{f: number; chunks: Chunk[]; bg?: boolean}> = ({f, chunks, bg}) => {
  const c = chunks.find((x) => f >= x.from && f < x.to);
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
        ...(bg ? {left: 60, right: 60, padding: '14px 18px', borderRadius: 18, background: 'rgba(23,20,18,0.78)'} : {}),
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

const FW = 960;
const FH = 1100;
const IW = FW - 28;
const IH = Math.round((IW * 1920) / 1080);

const Photo: React.FC<{f: number; cfg: VoxConfig; tl: TL; chunks: Chunk[]; zoomF: number[]}> = ({f, cfg, tl, chunks, zoomF}) => {
  const drop = sp(f, 0, 15, 0.9);
  const leave = ramp(f, tl.videoEnd - 10, tl.videoEnd + 6);
  // zoom bertukar pada setiap potongan / ayat penting
  let k = 0;
  while (k + 1 < zoomF.length && zoomF[k + 1] <= f) k++;
  const seg0 = zoomF[k] ?? 0;
  const seg1 = zoomF[k + 1] ?? tl.videoEnd;
  const z = (k % 2 ? 1.14 : 1.02) + interpolate(f, [seg0, seg1], [0, 0.025], cl) + 0.05 * Math.exp(-(f - seg0) / 3);
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
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -Math.round(IH * (cfg.crop ?? 0.29)),
            width: IW,
            height: IH,
            transform: `scale(${z})`,
            transformOrigin: `50% ${cfg.focusY ?? 60}%`,
          }}
        >
          {cfg.clips.map(([a], i) => (
            <Sequence key={i} from={tl.clipAt[i]} durationInFrames={tl.len[i]} layout="none">
              <OffthreadVideo
                src={staticFile(cfg.video)}
                trimBefore={Math.round(a * FPS)}
                volume={(v) => interpolate(v, [0, 3, tl.len[i] - 3, tl.len[i]], [0, 1, 1, 0], cl)}
                style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.82) contrast(1.05) sepia(0.08)'}}
              />
            </Sequence>
          ))}
        </div>
        <Captions f={f} chunks={chunks} bg={cfg.captionBg} />
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

const EndCard: React.FC<{f: number; cfg: VoxConfig; tl: TL}> = ({f, cfg, tl}) => {
  const e = f - tl.videoEnd;
  if (e < 0) return null;
  const k = sp(e, 4, 16, 0.8);
  const t1 = sp(e, 10, 16, 0.8);
  const hl = ramp(e, 26, 36);
  const info = sp(e, 40, 16, 0.8);
  const u = ramp(e, 48, 62);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', top: 640, left: 84, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: V.pen, opacity: k}}>{cfg.end.kicker}</div>
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
        {cfg.end.line1}
        <br />
        {cfg.end.line2} <Hl p={hl}>{cfg.end.hl}</Hl>
      </div>
      <div style={{position: 'absolute', top: 1010, left: 84, right: 84, opacity: info, transform: `translateY(${(1 - info) * 20}px)`}}>
        {cfg.end.info ? <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 38, color: V.soft}}>{cfg.end.info}</div> : null}
        {cfg.end.contact ? (
        <div style={{position: 'relative', display: 'inline-block', marginTop: 18, fontFamily: SANS, fontWeight: 800, fontSize: 58, color: V.ink}}>
          {cfg.end.contact}
          <svg width="100%" height={30} viewBox="0 0 100 30" preserveAspectRatio="none" style={{position: 'absolute', left: 0, top: '92%', overflow: 'visible'}}>
            <Ink d="M 0 10 C 30 18, 70 2, 100 12" p={u} w={4} c={V.pen} />
          </svg>
        </div>
        ) : null}
      </div>
    </div>
  );
};

export const VoxReel: React.FC<{cfg: VoxConfig}> = ({cfg}) => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((x) => document.fonts.load(x))).then(() => continueRender(handle));
  }, [handle]);

  const tl = useMemo(() => timeline(cfg.clips), [cfg]);
  const chunks = useMemo(() => buildChunks(cfg.captions, tl.at), [cfg, tl]);
  const zoomF = useMemo(() => [...cfg.clips.map(([a]) => a), ...cfg.zoomAt].sort((x, y) => x - y).map(tl.at), [cfg, tl]);
  const sfx = useMemo(
    () => [
      {src: 'sfx-whoosh.wav', at: 0, vol: 0.3},
      ...cfg.whooshes.map((s) => ({src: 'sfx-whoosh.wav', at: Math.round(tl.at(s)) - 3, vol: 0.28})),
      ...cfg.pops.map((s) => ({src: 'sfx-pop.wav', at: Math.round(tl.at(s)), vol: 0.18})),
      {src: 'sfx-whoosh.wav', at: tl.videoEnd - 10, vol: 0.35},
      {src: 'sfx-ting.wav', at: tl.videoEnd + 36, vol: 0.25},
    ],
    [cfg, tl],
  );
  const total = cfg.total ?? cfg.scenes.filter((s) => s.n).length;

  // "boil" kertas — anjakan kecil setiap 3 frame, ala stop-motion
  const tick = Math.floor(f / 3);
  const jx = (random(`jx${tick}`) - 0.5) * 3;
  const jy = (random(`jy${tick}`) - 0.5) * 3;

  return (
    <AbsoluteFill style={{background: V.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${jx}px, ${jy}px) scale(1.01)`}}>
        <Paper color={V.paper} />
      </AbsoluteFill>
      {cfg.scenes.map((s, i) => (
        <SceneView key={i} f={f} s={s} tl={tl} total={total} />
      ))}
      <Recap f={f} cfg={cfg} tl={tl} />
      <Photo f={f} cfg={cfg} tl={tl} chunks={chunks} zoomF={zoomF} />
      <EndCard f={f} cfg={cfg} tl={tl} />

      <Audio
        src={staticFile('audio/music-v3.wav')}
        volume={(v) => interpolate(v, [0, 20, tl.videoEnd - 20, tl.videoEnd + 10, tl.total - 25, tl.total], [0, 0.1, 0.1, 0.4, 0.4, 0], cl)}
      />
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
