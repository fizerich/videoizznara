import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CTA_FROM, CUTS, DOCTOR, FG, KESAN, RAWATAN, SRC_END, TOTAL3} from '../v3/timeline';
import {clF, FONTS_F, FunkyBackdrop, P} from './kitF';
import {CaptionsF, CtaF, DoctorF, END_HIT_F, EndF, HookF, InsertsF, KesanF, LogoF, ProgressF, RawatanF} from './scenesF';

const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'sfx-boing.wav', at: 0, vol: 0.35},
  {src: 'sfx-pop.wav', at: 14, vol: 0.5},
  ...CUTS.slice(1, -1).map((c) => ({src: 'sfx-pop.wav', at: c, vol: 0.28})),
  {src: 'sfx-whoosh.wav', at: KESAN.from - 3, vol: 0.5},
  ...KESAN.items.map((a) => ({src: 'sfx-boing.wav', at: KESAN.from + a, vol: 0.25})),
  {src: 'sfx-whoosh.wav', at: RAWATAN.from - 3, vol: 0.5},
  ...RAWATAN.items.map((a) => ({src: 'sfx-boing.wav', at: RAWATAN.from + a, vol: 0.25})),
  {src: 'sfx-boing.wav', at: DOCTOR[0], vol: 0.3},
  {src: 'sfx-pop.wav', at: CTA_FROM + 10, vol: 0.4},
  {src: 'sfx-whoosh.wav', at: SRC_END - 8, vol: 0.55},
  {src: 'sfx-boing.wav', at: SRC_END + 28, vol: 0.3},
  {src: 'sfx-ting.wav', at: SRC_END + END_HIT_F, vol: 0.35},
  {src: 'sfx-impact.wav', at: SRC_END + END_HIT_F, vol: 0.3},
];

// Zoom perlahan + punch-in pada setiap potongan (sama seperti V3)
const zoomAt = (f: number) => {
  let i = 0;
  while (i < CUTS.length - 2 && f >= CUTS[i + 1]) i++;
  const p = (f - CUTS[i]) / (CUTS[i + 1] - CUTS[i]);
  return 1 + 0.035 * p + 0.06 * Math.exp(-(f - CUTS[i]) / 5);
};

// Garis luar pelekat putih + bayang dakwat di sekeliling doktor
const STICKER = [
  'saturate(1.12) contrast(1.04) brightness(1.03)',
  'drop-shadow(7px 0 0 #fff)',
  'drop-shadow(-7px 0 0 #fff)',
  'drop-shadow(0 7px 0 #fff)',
  'drop-shadow(0 -7px 0 #fff)',
  `drop-shadow(14px 16px 0 ${P.ink})`,
].join(' ');

export const HilangGigiFunky: React.FC = () => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS_F.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  const inPanel = (frame >= KESAN.from && frame < KESAN.to) || (frame >= RAWATAN.from && frame < RAWATAN.to);
  const outro = interpolate(frame, [SRC_END - 8, SRC_END], [0, 1], clF);
  const bedVol = (f: number) => interpolate(f, [0, 10, SRC_END - 20, SRC_END, TOTAL3 - 15, TOTAL3], [0, 0.12, 0.12, 0.7, 0.7, 0], clF);
  // sedikit "goyang" pada doktor ikut rentak (105 BPM ≈ 17 frame)
  const groove = Math.sin((frame / 17.14) * Math.PI * 2) * 0.004;

  return (
    <AbsoluteFill style={{background: P.pink, overflow: 'hidden'}}>
      <Sequence durationInFrames={SRC_END} layout="none">
        <FunkyBackdrop frame={frame} cuts={CUTS} />
        <AbsoluteFill
          style={{
            transform: `scale(${zoomAt(frame) + groove - outro * 0.3}) rotate(${outro * -8}deg)`,
            transformOrigin: '50% 60%',
            filter: STICKER,
            opacity: 1 - outro,
          }}
        >
          <OffthreadVideo src={staticFile(FG)} transparent muted />
        </AbsoluteFill>
        <InsertsF frame={frame} />
        <DoctorF frame={frame} />
        <CaptionsF frame={frame} />
        <Sequence durationInFrames={150} layout="none">
          <HookF f={frame} />
        </Sequence>
        <AbsoluteFill style={{background: P.white, opacity: interpolate(frame, [KESAN.to - 1, KESAN.to, KESAN.to + 7], [0, 0.8, 0], clF)}} />
      </Sequence>

      <Sequence from={KESAN.from} durationInFrames={KESAN.to - KESAN.from} layout="none">
        <KesanF f={frame - KESAN.from} />
      </Sequence>
      <Sequence from={RAWATAN.from} durationInFrames={RAWATAN.to - RAWATAN.from} layout="none">
        <RawatanF f={frame - RAWATAN.from} />
      </Sequence>
      <Sequence from={CTA_FROM} durationInFrames={SRC_END - CTA_FROM} layout="none">
        <CtaF f={frame - CTA_FROM} />
      </Sequence>

      {frame < SRC_END && !inPanel ? <LogoF o={interpolate(frame, [140, 155], [0, 1], clF) * (1 - outro)} /> : null}
      {frame < SRC_END ? <ProgressF frame={frame} total={SRC_END} /> : null}

      <Sequence from={SRC_END} layout="none">
        <EndF f={frame - SRC_END} />
      </Sequence>

      <Audio src={staticFile('ref/hilang-gigi-asal.mp4')} volume={0.9} />
      <Audio src={staticFile('audio/bed-funky.wav')} volume={bedVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
