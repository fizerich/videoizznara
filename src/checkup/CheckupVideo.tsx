import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/800.css';
import {Callouts} from './Callouts';
import {Captions} from './Captions';
import {EndCard} from './EndCard';
import {CLIPS, CLIP_SECONDS, END_START, FPS, TOTAL_CHECKUP} from './theme';

const CLIP_FRAMES = CLIP_SECONDS * FPS;

// Video "Nombor Doktor Gigi": 6 klip motion graphic (10s setiap satu) + VO + tipografi mengikut VO
export const CheckupVideo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#e9e9ec'}}>
      {Array.from({length: CLIPS}, (_, i) => (
        <Sequence key={i} from={i * CLIP_FRAMES} durationInFrames={CLIP_FRAMES}>
          <OffthreadVideo
            src={staticFile(`izzcheckup/clip${i + 1}.mp4`)}
            volume={0.4}
            style={{width: 1080, height: 1920, objectFit: 'cover'}}
          />
        </Sequence>
      ))}
      <Audio src={staticFile('izzcheckup/vo.wav')} volume={1} />
      <Callouts f={f} />
      <Captions f={f} />
      <Sequence from={END_START} durationInFrames={TOTAL_CHECKUP - END_START}>
        <EndCard />
        <Sequence from={34}>
          <Audio src={staticFile('audio/sfx-chime.wav')} volume={0.5} />
        </Sequence>
      </Sequence>
    </AbsoluteFill>
  );
};
