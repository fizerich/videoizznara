import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import {Backdrop, B, cl, D, H, sp, Tag} from '../v2/kit';
import {Logo} from '../components/ui';
import {at, CLIP_AT, CLIP_LEN, CLIPS, FPS, TIP_WIN, TOTAL3, VIDEO_END, ZOOM_AT} from './data';
import {BottleArt, BrushArt, CalendarArt, Captions, Chip, Flash, FlossArt, Panel, ScanArt, Stat, SunMoon, win} from './parts';

const FONTS = ['500 40px Oswald', '700 40px Oswald', '600 40px Inter', '700 40px Inter', '800 40px Inter'];

// ---------- Lapisan video: jump-cut + zoom bertukar ----------

const ZOOM_F = ZOOM_AT.map(at);
const zoomAt = (f: number) => {
  let k = 0;
  while (k + 1 < ZOOM_F.length && ZOOM_F[k + 1] <= f) k++;
  const seg0 = ZOOM_F[k];
  const seg1 = ZOOM_F[k + 1] ?? VIDEO_END;
  const drift = interpolate(f, [seg0, seg1], [0, 0.025], cl);
  const base = k % 2 ? 1.14 : 1.02;
  const kick = 0.05 * Math.exp(-(f - seg0) / 3);
  return base + drift + kick;
};

const Footage: React.FC<{f: number}> = ({f}) => {
  const z = zoomAt(f) + interpolate(f, [0, 14], [0.25, 0], cl);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 52%'}}>
      {CLIPS.map(([a], i) => (
        <Sequence key={i} from={CLIP_AT[i]} durationInFrames={CLIP_LEN[i]}>
          <OffthreadVideo
            src={staticFile('video/tips-jaga-gigi.mov')}
            trimBefore={Math.round(a * FPS)}
            volume={(v) => interpolate(v, [0, 3, CLIP_LEN[i] - 3, CLIP_LEN[i]], [0, 1, 1, 0], cl)}
            style={{width: 1080, height: 1920, objectFit: 'cover', filter: 'contrast(1.08) saturate(1.15) brightness(1.03)'}}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---------- Hook ----------

const Hook: React.FC<{f: number}> = ({f}) => {
  const to = at(16.6);
  if (f > to + 14) return null;
  const words = [
    {t: '4', c: D.gold, d: 4, s: 230},
    {t: 'CARA', c: D.gold, d: 9, s: 190},
  ];
  const t2 = sp(f, 16, 10);
  const out = interpolate(f, [to, to + 12], [0, 1], cl);
  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        left: 40,
        right: 40,
        height: 560,
        borderRadius: 48,
        overflow: 'hidden',
        transform: `translateY(${out * -780}px) scale(${0.9 + 0.1 * sp(f, 0, 14)})`,
        opacity: sp(f, 0, 14),
        background: `linear-gradient(155deg, #86102e 0%, ${D.maroon} 45%, #2c040e 100%)`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(232,199,133,0.55)',
        textAlign: 'center',
      }}
    >
      <div style={{marginTop: 40}}>
        <Tag text="IZZNARA · TIPS GIGI" o={sp(f, 2, 14)} />
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 28, marginTop: 6}}>
        {words.map((w) => {
          const s = sp(f, w.d, 8, 0.6);
          return (
            <span
              key={w.t}
              style={{
                fontFamily: H,
                fontWeight: 700,
                fontSize: w.s,
                lineHeight: 1,
                color: w.c,
                opacity: Math.min(1, s * 2),
                transform: `scale(${2.4 - 1.4 * s})`,
                display: 'inline-block',
                textShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: H,
          fontWeight: 700,
          fontSize: 124,
          lineHeight: 1,
          color: D.cream,
          marginTop: -6,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 60}px)`,
          letterSpacing: 2,
        }}
      >
        JAGA{' '}
        <span style={{color: f >= at(9.06) ? D.gold : D.cream}}>GIGI</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 18, marginTop: 34}}>
        <Chip s={sp(f, at(12.68), 10)} text="Tak berlubang" />
        <Chip s={sp(f, at(14.12), 10)} text="Gusi sihat" />
      </div>
    </div>
  );
};

// ---------- 4 tip ----------

const Tips: React.FC<{f: number}> = ({f}) => {
  const T = TIP_WIN.map(([a, b]) => [at(a), at(b)] as const);
  return (
    <>
      {/* 01 — Berus gigi */}
      <Panel
        f={f}
        from={T[0][0]}
        to={T[0][1]}
        n={1}
        kicker="TIP"
        title="Berus gigi"
        art={<BrushArt f={f} foam={interpolate(f, [at(19.8), at(23.5)], [0, 1], cl)} />}
      >
        <Stat s={sp(f, at(24.84), 11)} big="2× SEHARI" small="Setiap hari, tanpa gagal" />
        <SunMoon f={f} sun={sp(f, at(28.28), 10)} moon={sp(f, at(29.06), 10)} />
      </Panel>

      {/* 02 — Floss */}
      <Panel
        f={f}
        from={T[1][0]}
        to={T[1][1]}
        n={2}
        kicker="TIP"
        title="Floss gigi"
        art={
          <FlossArt
            f={f}
            dive={interpolate(f, [at(33.6), at(34.6), at(46.9), at(48.2), at(50.6), at(51.3)], [0, 1, 1, 0, 0, 1], cl)}
            pop={interpolate(f, [at(51.6), at(52.6)], [0, 1], cl)}
          />
        }
      >
        <div style={{opacity: win(f, at(35.3), at(48.1)), display: 'flex', flexDirection: 'column', gap: 26}}>
          <Stat s={sp(f, at(37.38), 11)} big="2 HARI SEKALI" small="Sebaik-baiknya" />
          <Stat s={sp(f, at(43.96), 11)} big="1× SEMINGGU" small="Paling kurang — at least ada!" />
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, opacity: win(f, at(48.2))}}>
          <Stat s={sp(f, at(51.52), 11)} big="SISA MAKANAN" small="Keluar dari celah-celah gigi" />
          <Chip s={sp(f, at(55.26), 10)} text="Lepas makan daging!" icon="warn" />
        </div>
      </Panel>

      {/* 03 — Ubat kumur */}
      <Panel
        f={f}
        from={T[2][0]}
        to={T[2][1]}
        n={3}
        kicker="TIP"
        title="Ubat kumur"
        art={<BottleArt f={f} shake={interpolate(f, [at(66.5), at(67.2), at(68.8), at(69.5)], [0, 1, 1, 0], cl)} />}
      >
        <Chip s={sp(f, at(67.84), 10)} text="Jangan terlalu kerap" icon="warn" />
        <Stat s={sp(f, at(70.88), 11)} big="1× SEMINGGU" small="…atau kurang. Cukuplah." />
      </Panel>

      {/* 04 — Check-up di klinik */}
      <Panel
        f={f}
        from={T[3][0]}
        to={T[3][1]}
        n={4}
        kicker="TIP"
        title="Check-up gigi"
        art={
          <>
            <g opacity={win(f, at(76.2), at(85.3))}>
              <CalendarArt f={f} show={interpolate(f, [at(76.4), at(78.6)], [0, 1], cl)} mark={sp(f, at(82.72), 10)} />
            </g>
            <g opacity={win(f, at(85.3))}>
              <ScanArt f={f} spot={sp(f, at(95.7), 12)} fix={sp(f, at(104.9), 10)} />
            </g>
          </>
        }
      >
        <div style={{opacity: win(f, at(76.2), at(85.3)), display: 'flex', flexDirection: 'column', gap: 20}}>
          <Chip s={sp(f, at(79.5), 10)} text="Klinik kerajaan" />
          <Chip s={sp(f, at(80.42), 10)} text="Klinik swasta" />
          <Stat s={sp(f, at(82.72), 11)} big="1× SETAHUN" small="Paling kurang" />
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, opacity: win(f, at(85.3), at(104.4))}}>
          <Stat s={sp(f, at(89.02), 11)} big="KESAN AWAL" small="Doktor boleh nampak tanda-tanda awal" />
          <Chip s={sp(f, at(95.7), 10)} text="Karies" icon="x" />
          <Chip s={sp(f, at(97.86), 10)} text="Gigi berlubang" icon="x" />
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: win(f, at(104.4))}}>
          <Stat s={sp(f, at(104.9), 10)} big="RAWATAN AWAL" small="Intervensi awal — lebih mudah, lebih jimat" />
        </div>
      </Panel>
    </>
  );
};

// ---------- Ringkasan (semasa "tu saja dari saya") ----------

const RECAP = ['Berus gigi 2× sehari', 'Floss 2 hari sekali', 'Ubat kumur ± seminggu sekali', 'Check-up setahun sekali'];

const Recap: React.FC<{f: number}> = ({f}) => {
  const from = at(106.72);
  return (
    <Panel f={f} from={from} to={VIDEO_END + 6} kicker="RINGKASAN" title="4 cara jaga gigi">
      <div style={{position: 'absolute', left: -420, right: 0, top: -10, display: 'flex', flexDirection: 'column', gap: 18, paddingLeft: 30}}>
        {RECAP.map((t, i) => (
          <Chip key={t} s={sp(f, from + 8 + i * 6, 10)} text={`${i + 1}. ${t}`} />
        ))}
      </div>
    </Panel>
  );
};

// ---------- End card ----------

const EndCard: React.FC<{f: number}> = ({f}) => {
  const e = f - VIDEO_END;
  if (e < -10) return null;
  const r = interpolate(e, [-10, 8], [0, 1500], cl);
  const logo = sp(e, 6, 14);
  const head = sp(e, 14, 14);
  const btn = sp(e, 26, 10);
  const info = sp(e, 38, 14);
  const pulse = e > 45 ? 1 + 0.035 * Math.sin((e - 45) / 5) : 1;
  return (
    <AbsoluteFill style={{clipPath: `circle(${r}px at 50% 50%)`}}>
      <Backdrop f={f} camY={0} />
      <div style={{position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{opacity: logo, transform: `scale(${0.8 + 0.2 * logo})`}}>
          <Logo white height={160} />
        </div>
        <div
          style={{
            fontFamily: H,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1.02,
            color: D.cream,
            marginTop: 70,
            opacity: head,
            transform: `translateY(${(1 - head) * 40}px)`,
          }}
        >
          JAGA GIGI,
          <br />
          JAGA <span style={{color: D.gold}}>SENYUMAN</span>
        </div>
        <div style={{fontFamily: B, fontWeight: 600, fontSize: 42, color: D.dim, marginTop: 40, opacity: head}}>
          Dah lama tak check-up? Jom datang.
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 22,
            marginTop: 70,
            padding: '28px 56px',
            borderRadius: 999,
            background: D.gold,
            color: D.maroon,
            fontFamily: H,
            fontWeight: 700,
            fontSize: 70,
            letterSpacing: 2,
            opacity: Math.min(1, btn),
            transform: `scale(${btn * pulse})`,
            boxShadow: '0 20px 60px rgba(232,199,133,0.35)',
          }}
        >
          <svg width={70} height={70} viewBox="0 0 32 32">
            <path
              fill={D.maroon}
              d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.4.7 4.7 1.9 6.6L3 29l7.1-2.2c1.8 1 3.8 1.5 5.9 1.5 7 0 12.6-5.6 12.6-12.6S23 3 16 3zm0 22.9c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.2 1.3 1.4-4.1-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.5 9.8 10.2 5.1 16 5.1s10.5 4.7 10.5 10.5S21.8 25.9 16 25.9zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"
            />
          </svg>
          011-7027 2360
        </div>
        <div style={{fontFamily: B, fontWeight: 700, fontSize: 40, color: D.cream, marginTop: 50, opacity: info}}>
          Klinik Pergigian Izznara
        </div>
        <div style={{fontFamily: B, fontWeight: 600, fontSize: 36, color: D.gold, marginTop: 12, opacity: info}}>
          Jejawi, Perlis · Mergong, Alor Setar
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Bunyi ----------

const TIP_HEAD = [19.36, 33.6, 63.96, 76.36];
const POPS = [24.84, 28.28, 29.06, 37.38, 43.96, 51.52, 67.84, 70.88, 79.5, 80.42, 89.02, 95.7, 97.86];
const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'sfx-impact.wav', at: 3, vol: 0.35},
  {src: 'sfx-pop.wav', at: 16, vol: 0.4},
  {src: 'sfx-ting.wav', at: Math.round(at(12.68)), vol: 0.3},
  {src: 'sfx-ting.wav', at: Math.round(at(14.12)), vol: 0.3},
  ...TIP_WIN.map(([a]) => ({src: 'sfx-whoosh.wav', at: Math.round(at(a)) - 4, vol: 0.45})),
  ...TIP_HEAD.map((s) => ({src: 'sfx-pop.wav', at: Math.round(at(s)), vol: 0.35})),
  ...POPS.map((s) => ({src: 'sfx-pop.wav', at: Math.round(at(s)), vol: 0.28})),
  {src: 'sfx-ting.wav', at: Math.round(at(82.72)), vol: 0.35},
  {src: 'sfx-ting.wav', at: Math.round(at(104.9)), vol: 0.4},
  {src: 'sfx-whoosh.wav', at: Math.round(at(106.72)) - 4, vol: 0.4},
  ...[0, 1, 2, 3].map((i) => ({src: 'sfx-ting.wav', at: Math.round(at(106.72)) + 8 + i * 6, vol: 0.22})),
  {src: 'sfx-whoosh.wav', at: VIDEO_END - 10, vol: 0.5},
  {src: 'sfx-impact.wav', at: VIDEO_END + 26, vol: 0.4},
];

export const TipsV3: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((x) => document.fonts.load(x))).then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Footage f={f} />
      {/* vignette + gelap sedikit di bawah untuk kapsyen */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, transparent 55%, rgba(0,0,0,0.45) 100%), linear-gradient(180deg, transparent 62%, rgba(10,2,5,0.55) 100%)',
        }}
      />
      <Hook f={f} />
      <Tips f={f} />
      <Recap f={f} />
      <Captions f={f} />
      {TIP_WIN.map(([a]) => (
        <Flash key={a} f={f} at={at(a)} peak={0.35} />
      ))}
      <EndCard f={f} />

      <Audio
        src={staticFile('audio/music-v3.wav')}
        volume={(v) => interpolate(v, [0, 20, VIDEO_END - 20, VIDEO_END + 10, TOTAL3 - 25, TOTAL3], [0, 0.13, 0.13, 0.5, 0.5, 0], cl)}
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
