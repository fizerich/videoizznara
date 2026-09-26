import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import {cl, D, Grain} from '../v2/kit';
import {Logo} from '../components/ui';
import {CTA_FROM, CUTS, FG, KESAN, RAWATAN, SRC_END, TOTAL3} from './timeline';
import {Captions, DoctorCard, InsertCards, StudioBackdrop} from './pro';
import {CtaLowerThird, END_HIT3, EndCard, HookCard, KesanPanel, RawatanPanel} from './scenes';

const FONTS = ['500 40px Oswald', '700 40px Oswald', '400 40px Inter', '600 40px Inter', '700 40px Inter', '800 40px Inter'];

const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'sfx-impact.wav', at: 0, vol: 0.2},
  {src: 'sfx-pop.wav', at: 16, vol: 0.5},
  {src: 'sfx-whoosh.wav', at: KESAN.from - 4, vol: 0.5},
  ...KESAN.items.map((a) => ({src: 'sfx-pop.wav', at: KESAN.from + a, vol: 0.3})),
  {src: 'sfx-whoosh.wav', at: KESAN.to - 4, vol: 0.45},
  {src: 'sfx-whoosh.wav', at: RAWATAN.from - 4, vol: 0.5},
  ...RAWATAN.items.map((a) => ({src: 'sfx-ting.wav', at: RAWATAN.from + a, vol: 0.3})),
  {src: 'sfx-whoosh.wav', at: RAWATAN.to - 4, vol: 0.45},
  {src: 'sfx-pop.wav', at: CTA_FROM + 10, vol: 0.4},
  {src: 'sfx-whoosh.wav', at: SRC_END - 8, vol: 0.55},
  {src: 'sfx-ting.wav', at: SRC_END + 32, vol: 0.3},
  {src: 'sfx-impact.wav', at: SRC_END + END_HIT3, vol: 0.4},
];

// Zoom perlahan dalam setiap syot + "punch-in" pada setiap potongan
const zoomAt = (f: number) => {
  let i = 0;
  while (i < CUTS.length - 2 && f >= CUTS[i + 1]) i++;
  const a = CUTS[i];
  const b = CUTS[i + 1];
  const p = (f - a) / (b - a);
  return 1 + 0.035 * p + 0.045 * Math.exp(-(f - a) / 6);
};

export const HilangGigiV3: React.FC<{pro?: boolean}> = ({pro = false}) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  const inPanel = (frame >= KESAN.from && frame < KESAN.to) || (frame >= RAWATAN.from && frame < RAWATAN.to);
  const outro = interpolate(frame, [SRC_END - 8, SRC_END], [0, 1], cl);
  const bedVol = (f: number) => interpolate(f, [0, 10, SRC_END - 20, SRC_END, TOTAL3 - 15, TOTAL3], [0, 0.13, 0.13, 0.75, 0.75, 0], cl);

  return (
    <AbsoluteFill style={{background: D.bg, overflow: 'hidden'}}>
      {pro ? (
        <Sequence durationInFrames={SRC_END} layout="none">
          <StudioBackdrop f={frame} />
          <AbsoluteFill
            style={{
              transform: `scale(${zoomAt(frame) + outro * 0.25})`,
              transformOrigin: '50% 45%',
              filter: `contrast(1.05) saturate(1.1) brightness(1.04) drop-shadow(0 0 40px rgba(232,199,133,0.35)) blur(${outro * 14}px)`,
              opacity: 1 - outro * 0.6,
            }}
          >
            <OffthreadVideo src={staticFile(FG)} transparent muted />
          </AbsoluteFill>
          <InsertCards frame={frame} />
          <DoctorCard frame={frame} />
          <Captions frame={frame} />
          {/* kilat peralihan menutup frame kuning asal selepas panel pertama */}
          <AbsoluteFill style={{background: D.goldHi, mixBlendMode: 'screen', opacity: interpolate(frame, [KESAN.to - 1, KESAN.to, KESAN.to + 8], [0, 0.7, 0], cl)}} />
        </Sequence>
      ) : (
        <Sequence durationInFrames={SRC_END} layout="none">
          <AbsoluteFill
            style={{
              transform: `scale(${zoomAt(frame) + outro * 0.25})`,
              transformOrigin: '50% 45%',
              filter: `contrast(1.06) saturate(1.12) brightness(1.02) blur(${outro * 14}px)`,
              opacity: 1 - outro * 0.6,
            }}
          >
            <OffthreadVideo src={staticFile('ref/hilang-gigi-asal.mp4')} volume={0.9} />
          </AbsoluteFill>
          {/* vinyet lembut */}
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(0,0,0,0.35) 100%)'}} />
        </Sequence>
      )}
      {/* versi pro: suara asal dimainkan berasingan kerana video orang tiada audio */}
      {pro ? <Audio src={staticFile('ref/hilang-gigi-asal.mp4')} volume={0.9} /> : null}

      <Sequence durationInFrames={140} layout="none">
        <HookCard f={frame} />
      </Sequence>
      <Sequence from={KESAN.from} durationInFrames={KESAN.to - KESAN.from} layout="none">
        <KesanPanel f={frame - KESAN.from} />
      </Sequence>
      <Sequence from={RAWATAN.from} durationInFrames={RAWATAN.to - RAWATAN.from} layout="none">
        <RawatanPanel f={frame - RAWATAN.from} />
      </Sequence>
      <Sequence from={CTA_FROM} durationInFrames={SRC_END - CTA_FROM} layout="none">
        <CtaLowerThird f={frame - CTA_FROM} />
      </Sequence>

      {/* logo kecil (bawah kanan) + bar kemajuan (tidak dipaparkan di atas panel & kad penutup) */}
      {frame < SRC_END && !inPanel ? (
        <div
          style={{
            position: 'absolute',
            bottom: 90,
            right: 40,
            opacity: interpolate(frame, [140, 155], [0, 1], cl) * (1 - outro),
          }}
        >
          <div style={{background: 'rgba(255,255,255,0.9)', borderRadius: 999, padding: '10px 26px', boxShadow: '0 6px 20px rgba(0,0,0,0.2)'}}>
            <Logo height={48} />
          </div>
        </div>
      ) : null}
      {frame < SRC_END ? (
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 12, background: 'rgba(0,0,0,0.35)'}}>
          <div style={{width: `${(frame / SRC_END) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${D.crimson}, ${D.gold})`}} />
        </div>
      ) : null}

      <Sequence from={SRC_END} layout="none">
        <EndCard f={frame - SRC_END} />
      </Sequence>
      {inPanel || frame >= SRC_END ? <Grain f={frame} /> : null}

      <Audio src={staticFile('audio/bed-v3.wav')} volume={bedVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
