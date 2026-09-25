import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {at, N, NF} from '../theme';
import {clamp, ramp, Tooth, toothPath, usePop} from '../components';

const t = (s: number) => at('cta', s);

// Kilauan bintang 4 bucu
const Spark: React.FC<{x: number; y: number; s: number; r?: number}> = ({x, y, s, r = 40}) =>
  s > 0 ? (
    <path
      transform={`translate(${x} ${y}) scale(${s}) rotate(${s * 45})`}
      d={`M0 ${-r} Q ${r * 0.15} ${-r * 0.15} ${r} 0 Q ${r * 0.15} ${r * 0.15} 0 ${r} Q ${-r * 0.15} ${r * 0.15} ${-r} 0 Q ${-r * 0.15} ${-r * 0.15} 0 ${-r} Z`}
      fill={N.mint}
      stroke={N.bg}
      strokeWidth={4}
    />
  ) : null;

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(t(40.7), {damping: 12});
  const head = usePop(t(41.2));
  const tooth = usePop(t(41.9), {damping: 12});
  const scrape = ramp(frame, t(42.44), t(43.7));
  const clean = usePop(t(43.75), {damping: 8, mass: 0.5});
  const fresh = ramp(frame, t(44.3), t(45.2));
  const btn = usePop(t(46.0), {damping: 9, mass: 0.6});
  const info = usePop(t(46.4));
  const pulse = frame > t(46.6) ? 1 + Math.max(0, Math.sin((frame - t(46.6)) / 6)) * 0.04 : 1;
  const toolX = interpolate(scrape, [0, 1], [-150, 150]);

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #ffffff 0%, ${N.cream} 55%, #f1e3cc 100%)`}}>
      {new Array(8).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: [80, 900, 140, 960, 60, 820, 470, 300][i],
            top: [360, 520, 1100, 1250, 1650, 1700, 1780, 200][i] - ((frame * (0.6 + i * 0.1)) % 80),
            width: 40 + (i % 3) * 30,
            height: 40 + (i % 3) * 30,
            borderRadius: '50%',
            background: 'rgba(110,231,197,0.22)',
          }}
        />
      ))}

      <div style={{position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Img src={staticFile('izznara-logo.png')} style={{height: 150, transform: `scale(${logo})`}} />
        <div style={{marginTop: 8, fontFamily: NF.head, fontWeight: 500, fontSize: 40, letterSpacing: 4, color: N.maroon, opacity: logo}}>
          YOUR FAMILY DENTIST
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 440,
          left: 60,
          right: 60,
          textAlign: 'center',
          fontFamily: NF.head,
          fontWeight: 700,
          fontSize: 84,
          lineHeight: 1.05,
          color: N.bg,
          opacity: head,
          transform: `translateY(${(1 - head) * 40}px)`,
        }}
      >
        Pemeriksaan <span style={{color: N.maroon}}>+</span> Scaling
      </div>

      <svg viewBox="-540 -60 1080 520" width={1080} height={520} style={{position: 'absolute', top: 640, left: 0, overflow: 'visible'}}>
        <defs>
          <clipPath id="ctaTooth">
            <path d={toothPath(260, 320)} />
          </clipPath>
        </defs>
        <g transform={`scale(${tooth * 1.15})`}>
          {/* nafas segar berpusar */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${-40 + i * 40} 0 C ${-110 + i * 40} -60, ${100 + i * 30} -80, ${50 + i * 30} -150`}
              transform={`translate(${i === 1 ? 0 : i === 0 ? -250 : 250} 40)`}
              fill="none"
              stroke={N.mint}
              strokeWidth={16}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - fresh}
              opacity={fresh}
            />
          ))}
          <Tooth x={0} y={0} w={260} h={320} face={clean > 0.3 ? 'happy' : 'sad'} />
          {/* karang gigi dikikis dari kiri ke kanan */}
          <g clipPath="url(#ctaTooth)">
            <rect x={-130 + scrape * 260} y={150} width={260 * (1 - scrape)} height={90} fill={N.tartar} opacity={0.95} />
          </g>
          {/* alat scaler */}
          {scrape > 0 && scrape < 1 ? (
            <g transform={`translate(${toolX} ${180 + Math.sin(frame * 1.3) * 6}) rotate(-35)`}>
              <rect x={0} y={-10} width={300} height={20} rx={10} fill="#b8c4c8" stroke={N.ink} strokeWidth={5} />
              <path d="M0 0 Q -30 0 -40 30" fill="none" stroke={N.ink} strokeWidth={9} strokeLinecap="round" />
            </g>
          ) : null}
          <Spark x={-190} y={30} s={clean} r={46} />
          <Spark x={180} y={-10} s={clean * 0.8} r={36} />
          <Spark x={170} y={280} s={clean * 0.9} r={30} />
          <Spark x={-170} y={260} s={clean * 0.7} r={26} />
        </g>
      </svg>

      <div
        style={{
          position: 'absolute',
          top: 1110,
          left: 60,
          right: 60,
          textAlign: 'center',
          fontFamily: NF.head,
          fontWeight: 700,
          fontSize: 70,
          color: '#16a37c',
          opacity: fresh,
          transform: `scale(${0.8 + fresh * 0.2})`,
        }}
      >
        Nafas benar-benar segar!
      </div>

      <div style={{position: 'absolute', top: 1215, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            background: N.maroon,
            color: N.cream,
            borderRadius: 60,
            padding: '26px 56px',
            fontFamily: NF.head,
            fontWeight: 700,
            fontSize: 62,
            boxShadow: `0 10px 0 #3f0513`,
            transform: `scale(${btn * pulse})`,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <svg width={64} height={64} viewBox="0 0 32 32">
            <path
              fill={N.cream}
              d="M16 3C9 3 3.5 8.4 3.5 15.2c0 2.4.7 4.7 2 6.6L4 29l7.4-1.9c1.4.8 3 1.2 4.6 1.2 7 0 12.5-5.4 12.5-12.2S23 3 16 3zm0 22.3c-1.5 0-3-.4-4.3-1.1l-.3-.2-4.4 1.1 1.2-4.2-.2-.3c-1-1.5-1.5-3.3-1.5-5.1C6.5 10 10.8 5.7 16 5.7s9.5 4.2 9.5 9.5-4.3 10.1-9.5 10.1zm5.2-7.1c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"
            />
          </svg>
          011-7027 2360
        </div>
        <div style={{marginTop: 34, display: 'flex', gap: 20, opacity: info, transform: `translateY(${(1 - info) * 30}px)`}}>
          {['Jejawi, Perlis', 'Mergong, Alor Setar'].map((b) => (
            <div
              key={b}
              style={{
                border: `4px solid ${N.bg}`,
                color: N.bg,
                borderRadius: 40,
                padding: '10px 26px',
                fontFamily: NF.head,
                fontWeight: 600,
                fontSize: 38,
              }}
            >
              📍 {b}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: NF.body,
            fontWeight: 600,
            fontSize: 32,
            color: N.bg,
            opacity: interpolate(frame, [t(46.7), t(47.1)], [0, 1], clamp),
          }}
        >
          Tel: 016-723 9772 · Tempah slot scaling anda
        </div>
      </div>
    </AbsoluteFill>
  );
};
