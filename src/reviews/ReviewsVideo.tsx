import React, {useEffect, useState} from 'react';
import {Audio, continueRender, delayRender, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import {data} from '../data';
import {CARD, FPS, INTRO, OUTRO, totalFrames} from './theme';
import {Background} from './ui';
import {Intro} from './Intro';
import {ReviewCard} from './ReviewCard';
import {Outro} from './Outro';

const FONTS = ['400 40px Inter', '600 40px Inter', '800 40px Inter'];

export const ReviewsVideo: React.FC = () => {
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  const {durationInFrames} = useVideoConfig();
  const n = data.reviews.length;

  return (
    <>
      <Background />
      {data.muzik ? (
        <Audio
          src={staticFile(`music/${data.muzik}`)}
          volume={(f) =>
            interpolate(f, [0, FPS, durationInFrames - FPS * 1.5, durationInFrames], [0, 0.5, 0.5, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      ) : null}
      <Sequence from={0} durationInFrames={INTRO} name="Intro">
        <Intro />
      </Sequence>
      {data.reviews.map((r, i) => (
        <Sequence key={i} from={INTRO + i * CARD} durationInFrames={CARD} name={`Review ${i + 1}`}>
          <ReviewCard review={r} index={i} total={n} />
        </Sequence>
      ))}
      <Sequence from={INTRO + n * CARD} durationInFrames={OUTRO} name="Outro">
        <Outro />
      </Sequence>
    </>
  );
};

export const REVIEW_FRAMES = totalFrames(data.reviews.length);
