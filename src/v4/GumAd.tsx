import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {cl, ez, Grain} from '../v2/kit';
import {Logo} from '../components/ui';
import {CAPTION_TOP, Captions} from '../v3/Captions';
import {Teeth} from './Teeth';
import {inflame, recession, T, teethTf, win} from './timeline';
import {PAGES} from './words';
import {CAPTION, LightBackdrop} from './theme';
import {
  CauseFx,
  CauseScene,
  CausesScene,
  CtaScene,
  DoctorScene,
  DownArrows,
  FillScene,
  LensFx,
  MirrorBack,
  MirrorScene,
  NgiluFx,
  PatchFx,
  RecedeScene,
  Ruler,
  SensScene,
} from './scenes';

const COVER_HOLD = 12;
const COVER_END = 26;
const FONTS = ['500 40px Oswald', '700 40px Oswald', '400 40px Inter', '600 40px Inter', '700 40px Inter'];

const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'sfx-pop.wav', at: 43, vol: 0.45},
  {src: 'sfx-impact.wav', at: T.notGrow, vol: 0.5},
  {src: 'sfx-whoosh.wav', at: T.recede - 6, vol: 0.5},
  {src: 'sfx-whoosh.wav', at: T.shrink - 4, vol: 0.4},
  {src: 'sfx-impact.wav', at: T.shrink, vol: 0.5},
  {src: 'sfx-ting.wav', at: 292, vol: 0.4},
  {src: 'sfx-whoosh.wav', at: T.causes - 6, vol: 0.5},
  {src: 'sfx-pop.wav', at: T.brush - 4, vol: 0.55},
  {src: 'sfx-pop.wav', at: T.disease - 4, vol: 0.55},
  {src: 'sfx-pop.wav', at: T.clench - 4, vol: 0.55},
  {src: 'sfx-whoosh.wav', at: T.sens - 6, vol: 0.5},
  {src: 'sfx-zap.wav', at: T.ngilu, vol: 0.6},
  {src: 'sfx-zap.wav', at: T.ngilu + 22, vol: 0.4},
  {src: 'sfx-whoosh.wav', at: T.cold - 8, vol: 0.45},
  {src: 'sfx-zap.wav', at: T.cold + 6, vol: 0.55},
  {src: 'sfx-whoosh.wav', at: T.fill - 6, vol: 0.45},
  {src: 'sfx-pop.wav', at: T.tampal, vol: 0.5},
  {src: 'sfx-impact.wav', at: T.tampal + 12, vol: 0.55},
  {src: 'sfx-whoosh.wav', at: T.cause - 6, vol: 0.5},
  {src: 'sfx-impact.wav', at: T.punca, vol: 0.55},
  {src: 'sfx-whoosh.wav', at: T.doctor - 6, vol: 0.5},
  {src: 'sfx-impact.wav', at: T.check, vol: 0.5},
  {src: 'sfx-ting.wav', at: 1060, vol: 0.4},
  {src: 'sfx-ting.wav', at: 1074, vol: 0.4},
  {src: 'sfx-ting.wav', at: 1088, vol: 0.4},
  {src: 'sfx-chime.wav', at: T.cta + 4, vol: 0.5},
  {src: 'sfx-pop.wav', at: T.cta + 76, vol: 0.5},
  {src: 'sfx-impact.wav', at: T.hit, vol: 0.5},
];

export const GumAd: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((x) => document.fonts.load(x))).then(() => continueRender(handle));
  }, [handle]);

  const tf = teethTf(f);
  const clench = win(f, T.clench, T.sens, 4, 10);
  const inCta = f >= T.cta;

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      <LightBackdrop f={f} />
      <MirrorBack f={f} />
      <Teeth
        x={tf.x}
        y={tf.y}
        scale={tf.s}
        recede={recession(f)}
        inflame={inflame(f)}
        shake={clench * 5}
        cej={win(f, T.notGrow + 4, T.recede + 10, 10, 10)}
      >
        <Ruler f={f} />
        <DownArrows f={f} />
        <CauseFx f={f} />
        <NgiluFx f={f} />
        <PatchFx f={f} />
        <LensFx f={f} />
      </Teeth>
      <MirrorScene f={f} />
      <RecedeScene f={f} />
      <CausesScene f={f} />
      <SensScene f={f} />
      <FillScene f={f} />
      <CauseScene f={f} />
      <DoctorScene f={f} />
      <CtaScene f={f} />

      {/* logo kecil */}
      <div style={{position: 'absolute', top: 128, left: 0, right: 0, textAlign: 'center', opacity: ez(f, 10, 28) * (1 - ez(f, T.cta - 6, T.cta + 2)) * 0.9}}>
        <Logo height={54} />
      </div>

      <Captions f={f} pages={PAGES} look={CAPTION} top={inCta ? 1212 : CAPTION_TOP} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.45}}>
        <Grain f={f} />
      </div>

      {/* Thumbnail sebagai bingkai pertama (cover TikTok/Facebook), kemudian zoom-out ke animasi */}
      {f < COVER_END ? (
        <AbsoluteFill
          style={{
            opacity: interpolate(f, [COVER_HOLD, COVER_END], [1, 0], cl),
            transform: `scale(${1 + ez(f, COVER_HOLD, COVER_END) * 0.12})`,
          }}
        >
          <Img src={staticFile('thumbnail-gusi.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : null}

      <Audio src={staticFile('audio/vo-gusi.wav')} volume={1} />
      <Audio src={staticFile('audio/v4-music.wav')} volume={0.9} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={90} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
