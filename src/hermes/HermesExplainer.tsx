import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import timeline from './timeline.json';
import {Backdrop, BODY, cl, P, SceneProvider} from './kit';
import {CoverScene, WhatScene, RoadmapScene, ServerScene, BrainScene} from './scenes1';
import {PhoneScene, DesktopScene, TrainScene, CronScene} from './scenes2';
import {CostScene, FixScene, OutroScene} from './scenes3';

export const FPS = timeline.fps;
export const TOTAL_HERMES = timeline.total;

const SCENES: Record<string, React.FC> = {
  cover: CoverScene,
  what: WhatScene,
  roadmap: RoadmapScene,
  server: ServerScene,
  brain: BrainScene,
  phone: PhoneScene,
  desktop: DesktopScene,
  train: TrainScene,
  cron: CronScene,
  cost: CostScene,
  fix: FixScene,
  outro: OutroScene,
};

const FADE = 9;

// Sari kata: ayat dipaparkan tepat apabila ia dituturkan
const Caption: React.FC<{f: number}> = ({f}) => {
  const scene = [...timeline.scenes].reverse().find((s) => f >= s.start) ?? timeline.scenes[0];
  const rel = f - scene.start;
  const idx = [...scene.lines].map((l, i) => ({l, i})).reverse().find(({l}) => rel >= l.start - 3);
  if (!idx) return null;
  const {l, i} = idx;
  const next = scene.lines[i + 1];
  const end = next ? next.start - 3 : l.start + l.dur + 24;
  const a = interpolate(rel, [l.start - 3, l.start + 5, end - 6, end], [0, 1, 1, next ? 1 : 0], cl);
  return (
    <div
      style={{
        position: 'absolute',
        left: 160,
        right: 160,
        bottom: 56,
        display: 'flex',
        justifyContent: 'center',
        opacity: a,
        transform: `translateY(${(1 - Math.min(1, a * 1.5)) * 12}px)`,
      }}
    >
      <div
        key={`${scene.id}-${i}`}
        style={{
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.3,
          textAlign: 'center',
          color: P.text,
          background: 'rgba(4,7,22,0.78)',
          border: `1px solid ${P.line}`,
          padding: '14px 32px',
          borderRadius: 20,
          maxWidth: 1500,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        {l.cap}
      </div>
    </div>
  );
};

const Progress: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: 'rgba(255,255,255,0.08)'}}>
    <div style={{width: `${(f / TOTAL_HERMES) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${P.cyan}, ${P.gold})`}} />
  </div>
);

export const HermesExplainer: React.FC = () => {
  const f = useCurrentFrame();
  const volume = (fr: number) =>
    interpolate(fr, [0, 30, TOTAL_HERMES - 60, TOTAL_HERMES], [0, 0.17, 0.17, 0], cl);
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Backdrop f={f} />
      {timeline.scenes.map((s, i) => {
        const Scene = SCENES[s.id];
        const pad = i === timeline.scenes.length - 1 ? 0 : FADE;
        return (
          <Sequence key={s.id} from={s.start} durationInFrames={s.dur + pad}>
            <SceneFrame dur={s.dur} lines={s.lines.map((l) => l.start)} last={i === timeline.scenes.length - 1}>
              <Scene />
            </SceneFrame>
          </Sequence>
        );
      })}
      <Caption f={f} />
      <Progress f={f} />
      <Audio src={staticFile('hermes/vo.mp3')} volume={1} />
      <Audio src={staticFile('hermes/music.mp3')} volume={volume} />
      {timeline.scenes.slice(1).map((s) => (
        <Sequence key={`sfx-${s.id}`} from={Math.max(0, s.start - 4)}>
          <Audio src={staticFile('audio/sfx-whoosh.wav')} volume={0.12} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{dur: number; lines: number[]; last: boolean; children: React.ReactNode}> = ({dur, lines, last, children}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, FADE, dur - 2, dur + FADE], [0, 1, 1, last ? 1 : 0], cl);
  return (
    <SceneProvider value={{f, L: lines, dur}}>
      <AbsoluteFill style={{opacity: a}}>{children}</AbsoluteFill>
    </SceneProvider>
  );
};
