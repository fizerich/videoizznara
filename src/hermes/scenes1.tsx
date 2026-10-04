import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {
  BODY,
  Card,
  Chip,
  cl,
  Dot,
  ease,
  Head,
  HEAD,
  Icon,
  MONO,
  P,
  prog,
  R,
  typed,
  useP,
  useScene,
} from './kit';

// ───────────────────────────────────────────────────────── 0. Kulit
export const CoverScene: React.FC = () => {
  const {f, dur} = useScene();
  const zoom = interpolate(f, [0, dur], [1, 1.06], cl);
  const t = prog(f, 4, 26);
  return (
    <>
      <div style={{position: 'absolute', left: 110, top: 190, width: 860}}>
        <div style={{opacity: t, transform: `translateY(${(1 - t) * 24}px)`}}>
          <Chip color={P.cyan} size={26}>
            RINGKASAN VIDEO · TUTORIAL SETUP
          </Chip>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 170,
              lineHeight: 1,
              marginTop: 26,
              background: `linear-gradient(90deg, ${P.goldHi}, ${P.gold} 60%, #e49a3b)`,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            HERMES AGENT
          </div>
          <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 42, color: P.text, marginTop: 14, lineHeight: 1.2, whiteSpace: 'nowrap'}}>
            Pekerja AI anda yang bekerja <span style={{color: P.gold}}>24 jam</span>
          </div>
        </div>
        <R at={1} style={{display: 'flex', gap: 14, marginTop: 38, flexWrap: 'wrap'}}>
          <Chip color={P.green}>Sumber terbuka · Percuma</Chip>
          <Chip color={P.gold}>≈ 30 minit</Chip>
          <Chip color={P.violet}>Tanpa coding</Chip>
        </R>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 230,
          width: 810,
          opacity: t,
          transform: `translateY(${(1 - t) * 30}px) rotate(-1.6deg) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        <div
          style={{
            borderRadius: 26,
            overflow: 'hidden',
            border: `3px solid ${P.gold}88`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 80px ${P.cyan}33`,
          }}
        >
          <Img src={staticFile('hermes/thumb.jpg')} style={{width: 810, height: 456, display: 'block'}} />
        </div>
        <div style={{fontFamily: BODY, fontSize: 20, color: P.dim, marginTop: 14, textAlign: 'right'}}>
          Tangkapan skrin: thumbnail video asal · Metics Media
        </div>
      </div>
    </>
  );
};

// ───────────────────────────────────────────────────────── 1. Apa itu Hermes
const Feature: React.FC<{at: number; icon: React.ReactNode; title: string; text: string; color: string; children?: React.ReactNode}> = ({
  at,
  icon,
  title,
  text,
  color,
  children,
}) => (
  <R at={at} style={{flex: 1}}>
    <Card h={340} glow={color} style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        {icon}
        <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 40, lineHeight: 1.1}}>{title}</div>
      </div>
      <div style={{fontSize: 26, color: P.dim, marginTop: 16, lineHeight: 1.4}}>{text}</div>
      <div style={{marginTop: 'auto'}}>{children}</div>
    </Card>
  </R>
);

export const WhatScene: React.FC = () => {
  const {f, L} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(f / 8);
  const mem = prog(f, (L[3] ?? 0) + 30, 20);
  const skill = prog(f, (L[4] ?? 0) + 30, 20);
  return (
    <>
      <Head title="Apa itu Hermes Agent?" sub="Ejen AI sumber terbuka daripada Nous Research" />
      <div style={{position: 'absolute', left: 110, top: 290, width: 1700, display: 'flex', gap: 24, alignItems: 'stretch'}}>
        <R at={0} style={{flex: 1}}>
          <Card h={130} glow={P.green} pad={22} style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Icon.Check size={46} />
            <div>
              <div style={{fontWeight: 700, fontSize: 30}}>Perisian: percuma</div>
              <div style={{fontSize: 22, color: P.dim}}>Kod awam · lesen MIT</div>
            </div>
          </Card>
        </R>
        <R at={1} style={{flex: 1}}>
          <Card h={130} glow={P.violet} pad={22} style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Icon.Chip size={52} />
            <div>
              <div style={{fontWeight: 700, fontSize: 30}}>+ Model AI</div>
              <div style={{fontSize: 22, color: P.dim}}>Bayar ikut penggunaan</div>
            </div>
          </Card>
        </R>
        <R at={1} d={14} style={{flex: 1}}>
          <Card h={130} glow={P.cyan} pad={22} style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Icon.Server size={52} />
            <div>
              <div style={{fontWeight: 700, fontSize: 30}}>+ Pelayan kecil</div>
              <div style={{fontSize: 22, color: P.dim}}>≈ US$6 sebulan</div>
            </div>
          </Card>
        </R>
      </div>

      <R at={2} style={{position: 'absolute', left: 110, top: 450}}>
        <div style={{fontFamily: HEAD, fontSize: 36, color: P.gold, letterSpacing: 2}}>BEZANYA DARIPADA CHATBOT BIASA</div>
      </R>
      <div style={{position: 'absolute', left: 110, top: 515, width: 1700, display: 'flex', gap: 24}}>
        <Feature
          at={2}
          color={P.cyan}
          icon={<Icon.Moon size={54} />}
          title="Berjalan berterusan"
          text="Ia boleh memulakan perbualan sendiri, mengikut jadual."
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 26, color: P.cyan}}>
            <span>04:00</span>
            <Icon.Bell size={34} />
            <span style={{color: P.text}}>Ada berita untuk anda</span>
          </div>
        </Feature>
        <Feature
          at={3}
          color={P.violet}
          icon={<Icon.Brain size={54} />}
          title="Mengingat"
          text="Fakta & cara kerja kegemaran anda kekal di semua perbualan dan peranti."
        >
          <div style={{opacity: mem, display: 'flex', gap: 10}}>
            <Chip color={P.violet} size={22}>memori</Chip>
            <Chip color={P.violet} size={22}>telefon</Chip>
            <Chip color={P.violet} size={22}>desktop</Chip>
          </div>
        </Feature>
        <Feature
          at={4}
          color={P.gold}
          icon={<Icon.Star size={54} />}
          title="Belajar sendiri"
          text="Tugasan rumit ditulis sebagai skill: prosedur selamat yang boleh dipanggil semula."
        >
          <div
            style={{
              opacity: skill,
              fontFamily: MONO,
              fontSize: 22,
              color: P.gold,
              background: 'rgba(0,0,0,0.35)',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            skill/ <Dot color={P.green} size={12} pulse={pulse} /> learned
          </div>
        </Feature>
      </div>
    </>
  );
};

// ───────────────────────────────────────────────────────── 2. Peta jalan
const STEPS = [
  {k: 'Tempat kerja', s: 'Pelayan awan', c: P.cyan, i: Icon.Server},
  {k: 'Otak', s: 'Model AI (OpenRouter)', c: P.violet, i: Icon.Chip},
  {k: 'Nombor telefon', s: 'Bot Telegram', c: P.green, i: Icon.Phone},
  {k: 'Latihan', s: 'Memori & skill', c: P.gold, i: Icon.Star},
  {k: 'Jadual', s: 'Kerja automatik (cron)', c: P.red, i: Icon.Clock},
];

export const RoadmapScene: React.FC = () => {
  const {f, L} = useScene();
  const start = (L[1] ?? 0) - 4;
  const line = ease(f, start, start + 100);
  const X0 = 250;
  const STEP = 355;
  return (
    <>
      <Head title="Anda sedang mengambil pekerja AI pertama" sub="Lima langkah, kira-kira 30 minit" />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={X0} y1={520} x2={X0 + STEP * 4} y2={520} stroke="rgba(255,255,255,0.12)" strokeWidth={6} strokeLinecap="round" />
        <line
          x1={X0}
          y1={520}
          x2={X0 + STEP * 4 * line}
          y2={520}
          stroke={P.gold}
          strokeWidth={6}
          strokeLinecap="round"
        />
      </svg>
      {STEPS.map((s, i) => {
        const t = prog(f, start + 6 + i * 20, 18);
        const Ico = s.i;
        return (
          <div
            key={s.k}
            style={{
              position: 'absolute',
              left: X0 + STEP * i - 150,
              top: 400,
              width: 300,
              textAlign: 'center',
              opacity: t,
              transform: `translateY(${(1 - t) * 30}px) scale(${0.85 + 0.15 * t})`,
            }}
          >
            <div
              style={{
                margin: '0 auto',
                width: 240,
                height: 240,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${s.c}33, rgba(6,10,31,0.9) 70%)`,
                border: `4px solid ${s.c}`,
                boxShadow: `0 0 50px ${s.c}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Ico size={110} color={s.c} />
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: -4,
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: s.c,
                  color: '#0b1020',
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </div>
            </div>
            <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 42, marginTop: 24, color: P.text}}>{s.k}</div>
            <div style={{fontFamily: BODY, fontSize: 24, color: P.dim, marginTop: 4}}>{s.s}</div>
          </div>
        );
      })}
    </>
  );
};

// ───────────────────────────────────────────────────────── 3. Pelayan
const Row: React.FC<{label: string; children: React.ReactNode; hi?: boolean}> = ({label, children, hi}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px',
      borderRadius: 14,
      background: hi ? 'rgba(242,196,109,0.1)' : 'rgba(255,255,255,0.045)',
      border: `1px solid ${hi ? P.gold + '88' : P.line}`,
      fontSize: 25,
    }}
  >
    <span style={{color: P.dim}}>{label}</span>
    <span style={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10}}>{children}</span>
  </div>
);

export const ServerScene: React.FC = () => {
  const {f, L} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  const uncheck = prog(f, (L[3] ?? 0) + 70, 10); // kotak "Ready to Use AI" dinyahtanda
  const pwd = useP(4);
  const deploy = prog(f, (L[4] ?? 0) + 95, 14);
  const running = prog(f, (L[4] ?? 0) + 140, 14);
  return (
    <>
      <Head step="Langkah 1" title="Tempat kerja" sub="Beri ejen komputernya sendiri" />
      <div style={{position: 'absolute', left: 110, top: 300, width: 740}}>
        <R at={0}>
          <Card pad={22} style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Icon.Laptop size={70} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 32}}>Laptop anda</div>
              <div style={{fontSize: 24, color: P.red}}>Berhenti apabila laptop tidur</div>
            </div>
            <div style={{fontFamily: HEAD, fontSize: 40, color: P.dim, opacity: 0.5 + 0.5 * pulse}}>Zzz</div>
          </Card>
        </R>
        <R at={1} style={{marginTop: 20}}>
          <Card pad={22} glow={P.cyan} style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Icon.Server size={70} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 32}}>Pelayan awan (VPS)</div>
              <div style={{fontSize: 24, color: P.green}}>Aktif 24/7 · ≈ US$6 sebulan</div>
            </div>
            <Dot color={P.green} size={22} pulse={pulse} />
          </Card>
        </R>
        <R at={2} style={{marginTop: 20}}>
          <Card pad={22} glow={P.green} style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Icon.Shield size={70} />
            <div style={{fontSize: 25, lineHeight: 1.35}}>
              <b>Lebih selamat:</b> jika terkena <i>prompt injection</i>, hanya satu pelayan kosong yang terdedah, bukan fail peribadi anda.
            </div>
          </Card>
        </R>
      </div>

      <div style={{position: 'absolute', left: 930, top: 270, width: 880}}>
        <R at={3} y={36}>
          <Card pad={0} style={{overflow: 'hidden'}}>
            <div style={{padding: '16px 24px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10}}>
              <Dot color="#ff6b6b" size={14} />
              <Dot color="#ffd166" size={14} />
              <Dot color="#55e0a0" size={14} />
              <span style={{marginLeft: 14, fontFamily: MONO, fontSize: 20, color: P.dim}}>Hostinger · Hermes Agent (1-klik)</span>
            </div>
            <div style={{padding: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
              <Row label="Pelan" hi>
                KVM 1 <Icon.Check size={26} />
              </Row>
              <Row label="Tempoh bil">12 bulan (untuk kupon)</Row>
              <Row label="Ready to Use AI (≈ $12 kredit)">
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    border: `3px solid ${uncheck > 0.5 ? P.dim : P.gold}`,
                    background: uncheck > 0.5 ? 'transparent' : P.gold,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {uncheck > 0.5 ? null : <Icon.Check size={22} color="#10131f" />}
                </span>
                <span style={{color: uncheck > 0.5 ? P.green : P.red, fontSize: 22}}>{uncheck > 0.5 ? 'dinyahtanda' : 'pra-tanda'}</span>
              </Row>
              <div style={{opacity: pwd, display: 'flex', flexDirection: 'column', gap: 12}}>
                <Row label="Nama pengguna">hermes</Row>
                <Row label="Kata laluan admin" hi>
                  <span style={{fontFamily: MONO, letterSpacing: 2}}>••••••••••</span>
                  <Icon.Lock size={26} />
                </Row>
                <div style={{fontSize: 21, color: P.gold, marginLeft: 6}}>↳ simpan dalam pengurus kata laluan</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 6}}>
                <div
                  style={{
                    fontFamily: HEAD,
                    fontSize: 34,
                    letterSpacing: 2,
                    background: P.gold,
                    color: '#10131f',
                    padding: '12px 44px',
                    borderRadius: 14,
                    transform: `scale(${1 + deploy * 0.06 * Math.sin(f / 4)})`,
                    boxShadow: deploy > 0 ? `0 0 30px ${P.gold}88` : 'none',
                  }}
                >
                  DEPLOY
                </div>
                <div style={{opacity: running, fontSize: 26, color: P.green, display: 'flex', alignItems: 'center', gap: 10}}>
                  <Icon.Check size={30} /> Running
                </div>
              </div>
            </div>
          </Card>
        </R>
      </div>
    </>
  );
};

// ───────────────────────────────────────────────────────── 4. Otak
export const BrainScene: React.FC = () => {
  const {f, L} = useScene();
  const key = useP(2, 6);
  const limit = prog(f, (L[2] ?? 0) + 70, 40);
  const paste = prog(f, (L[3] ?? 0), 20);
  const model = prog(f, (L[3] ?? 0) + 60, 18);
  const travel = ease(f, (L[3] ?? 0) - 10, (L[3] ?? 0) + 50);
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <>
      <Head step="Langkah 2" title="Otak" sub="Model AI yang membuat ejen berfikir" />
      <div style={{position: 'absolute', left: 110, top: 290, width: 700}}>
        <R at={0}>
          <Card glow={P.violet} style={{minHeight: 470}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Icon.Chip size={50} />
              <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 44}}>OpenRouter</div>
            </div>
            <R at={1} y={14} style={{marginTop: 22, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
              <Chip color={P.violet}>Satu akaun</Chip>
              <Chip color={P.cyan}>Beratus model</Chip>
              <Chip color={P.gold}>Kredit mula US$5</Chip>
            </R>
            <div style={{opacity: key, marginTop: 26}}>
              <div style={{fontSize: 22, color: P.dim, marginBottom: 8}}>Kunci API</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: MONO,
                  fontSize: 26,
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: 14,
                  padding: '14px 18px',
                }}
              >
                <Icon.Key size={34} /> sk-or-v1-••••••••••••
              </div>
              <div style={{fontSize: 21, color: P.red, marginTop: 8}}>Jangan kongsi: sesiapa yang ada kunci ini boleh guna akaun anda.</div>
              <div style={{marginTop: 18, fontSize: 22, color: P.dim}}>Had belanja / minggu</div>
              <div style={{height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.1)', marginTop: 8, overflow: 'hidden'}}>
                <div style={{width: `${limit * 100}%`, height: '100%', background: `linear-gradient(90deg, ${P.gold}, ${P.goldHi})`}} />
              </div>
              <div style={{fontFamily: MONO, fontSize: 24, color: P.gold, marginTop: 8}}>US$10 / minggu</div>
            </div>
          </Card>
        </R>
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <path d="M830 520 H 940" stroke={P.gold} strokeWidth={4} strokeDasharray="10 12" opacity={paste} />
        <circle cx={830 + 110 * travel} cy={520} r={13} fill={P.gold} opacity={paste * (1 - Math.max(0, travel - 0.9) * 10)} />
      </svg>

      <div style={{position: 'absolute', left: 960, top: 290, width: 850}}>
        <R at={3} y={30}>
          <Card pad={0} style={{overflow: 'hidden', minHeight: 470}}>
            <div style={{padding: '14px 22px', background: 'rgba(255,255,255,0.08)', fontFamily: MONO, fontSize: 21, color: P.dim, display: 'flex', justifyContent: 'space-between'}}>
              <span>Hermes · dashboard</span>
              <span style={{color: model > 0.5 ? P.green : P.red}}>
                <Dot color={model > 0.5 ? P.green : P.red} size={12} pulse={pulse} /> {model > 0.5 ? 'model aktif' : 'tiada model'}
              </span>
            </div>
            <div style={{display: 'flex'}}>
              <div style={{width: 210, padding: 20, borderRight: `1px solid ${P.line}`, fontSize: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
                {['Chat', 'Sessions', 'Models', 'Cron', 'Skills', 'Keys', 'Channels', 'Logs'].map((m) => (
                  <div key={m} style={{color: m === 'Keys' || m === 'Models' ? P.gold : P.dim, fontWeight: m === 'Keys' || m === 'Models' ? 700 : 400}}>
                    {m}
                  </div>
                ))}
              </div>
              <div style={{flex: 1, padding: 26, display: 'flex', flexDirection: 'column', gap: 18}}>
                <div style={{fontSize: 22, color: P.dim}}>Keys → OpenRouter</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 22, background: 'rgba(0,0,0,0.35)', borderRadius: 12, padding: '12px 16px'}}>
                  <span style={{color: P.dim}}>{typed('sk-or-v1-••••••••••••', f, (L[3] ?? 0) + 4, 24)}</span>
                  {paste > 0.9 ? <Chip color={P.green} size={18}>Save</Chip> : null}
                </div>
                <div style={{fontSize: 22, color: P.dim, marginTop: 8}}>Models → Main model</div>
                <div style={{opacity: model, transform: `translateY(${(1 - model) * 16}px)`}}>
                  <div style={{background: `${P.gold}1f`, border: `2px solid ${P.gold}`, borderRadius: 16, padding: '16px 20px'}}>
                    <div style={{fontFamily: HEAD, fontSize: 38, color: P.goldHi}}>DeepSeek-V4-Flash</div>
                    <div style={{fontSize: 22, color: P.dim, marginTop: 4}}>Murah · laju · pandai guna alat</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </R>
      </div>

      <R at={4} y={20} style={{position: 'absolute', left: 110, top: 800}}>
        <Card pad={18} style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Chip color={P.violet} solid>Alternatif</Chip>
          <span style={{fontSize: 26}}>
            <b>Nous Portal</b>: langganan tetap ≈ US$20 sebulan, tanpa urus kunci
          </span>
        </Card>
      </R>
    </>
  );
};
