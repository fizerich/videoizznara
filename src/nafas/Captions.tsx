import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KEYWORDS, LINES} from './captions';
import {N, NF} from './theme';

// Subtitle karaoke: baris semasa, perkataan menyala ikut suara
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = frame / fps;

  const idx = LINES.findIndex((line, i) => {
    const start = line[0][1];
    const next = LINES[i + 1];
    const end = line[line.length - 1][2] ?? (next ? next[0][1] : start + 2);
    return now >= start - 0.05 && now < Math.min(end, next ? next[0][1] - 0.05 : end);
  });
  if (idx < 0) return null;
  const line = LINES[idx];
  const s = spring({frame: frame - Math.round((line[0][1] - 0.05) * fps), fps, config: {damping: 13, mass: 0.5}});

  return (
    <div
      style={{
        position: 'absolute',
        top: 1470,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 20px',
          background: 'rgba(8,36,41,0.9)',
          borderRadius: 28,
          padding: '14px 34px 20px',
          transform: `scale(${0.85 + s * 0.15}) translateY(${(1 - s) * 20}px)`,
          opacity: s,
        }}
      >
        {line.map(([w, st], i) => {
          const nextSt = line[i + 1]?.[1] ?? line[i][2] ?? st + 0.5;
          const active = now >= st && now < nextSt;
          const said = now >= st;
          const key = KEYWORDS.has(w);
          const pop = interpolate(now - st, [0, 0.08, 0.2], [1, 1.14, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <span
              key={i}
              style={{
                fontFamily: NF.head,
                fontWeight: 700,
                fontSize: 66,
                lineHeight: 1.2,
                color: active ? N.mint : said ? (key ? N.sun : N.cream) : 'rgba(255,247,234,0.45)',
                display: 'inline-block',
                transform: `scale(${said ? pop : 1})`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
