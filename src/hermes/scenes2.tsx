import React from 'react';
import {random} from 'remotion';
import {BODY, Bubble, Card, Chip, Dot, ease, Head, HEAD, Icon, MONO, P, prog, R, typed, useP, useScene} from './kit';

// ───────────────────────────────────────────────────────── 5. Telefon (Telegram)
const Qr: React.FC<{size: number; scan: number}> = ({size, scan}) => {
  const n = 21;
  const c = size / n;
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const finder = (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);
      if (finder) continue;
      const on = random(`qr${x}-${y}`) > 0.52;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x * c} y={y * c} width={c} height={c} fill="#0b1020" />);
    }
  }
  const eye = (ox: number, oy: number) => (
    <g key={`${ox}${oy}`} transform={`translate(${ox * c},${oy * c})`}>
      <rect width={7 * c} height={7 * c} fill="#0b1020" />
      <rect x={c} y={c} width={5 * c} height={5 * c} fill="#fff" />
      <rect x={2 * c} y={2 * c} width={3 * c} height={3 * c} fill="#0b1020" />
    </g>
  );
  return (
    <svg width={size} height={size} style={{background: '#fff', borderRadius: 12}}>
      {cells}
      {eye(0, 0)}
      {eye(n - 7, 0)}
      {eye(0, n - 7)}
      <rect x={0} y={size * scan - 3} width={size} height={6} fill={P.cyan} opacity={0.85} />
    </svg>
  );
};

export const PhoneScene: React.FC = () => {
  const {f, L} = useScene();
  const showQr = prog(f, (L[1] ?? 0), 14) * (1 - prog(f, (L[2] ?? 0) - 6, 10));
  const scan = (f % 50) / 50;
  const countdown = Math.max(0, 180 - Math.floor(Math.max(0, f - (L[1] ?? 0)) / 30));
  const mm = Math.floor(countdown / 60);
  const ss = String(countdown % 60).padStart(2, '0');
  const chat1 = prog(f, (L[2] ?? 0) + 40, 14);
  const chat2 = prog(f, (L[2] ?? 0) + 85, 14);
  const sysB = prog(f, (L[3] ?? 0), 14);
  const homeB = prog(f, (L[3] ?? 0) + 40, 14);
  const hub = useP(4, 20);
  const steps = [
    {at: 1, t: 'Channels → Create with QR', s: `kod tamat dalam 3 minit`, c: P.cyan},
    {at: 2, t: 'Save and Restart', s: 'gateway dimulakan semula → "connected"', c: P.violet},
    {at: 3, t: '/set home', s: 'hasil kerja berjadual dihantar ke sini', c: P.gold},
    {at: 4, t: 'Senarai dibenarkan', s: 'orang lain yang mesej bot tidak dibalas', c: P.green},
  ];
  return (
    <>
      <Head step="Langkah 3" title="Nombor telefon" sub="Beri ejen bot Telegram sendiri" />
      <div style={{position: 'absolute', left: 110, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 18}}>
        {steps.map((s, i) => (
          <R key={s.t} at={s.at} x={-30} y={0}>
            <Card pad={18} glow={s.c} style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{width: 52, height: 52, borderRadius: '50%', background: s.c, color: '#0b1020', fontFamily: HEAD, fontWeight: 700, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                {i + 1}
              </div>
              <div>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26}}>{s.t}</div>
                <div style={{fontSize: 22, color: P.dim}}>{s.s}</div>
              </div>
              {i === 0 ? (
                <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 26, color: countdown < 60 ? P.red : P.gold}}>
                  {mm}:{ss}
                </div>
              ) : null}
              {i === 3 ? <div style={{marginLeft: 'auto'}}><Icon.Lock size={36} /></div> : null}
            </Card>
          </R>
        ))}
      </div>

      {/* telefon */}
      <R at={0} y={40} style={{position: 'absolute', left: 880, top: 205}}>
        <div
          style={{
            width: 380,
            height: 640,
            borderRadius: 52,
            border: '8px solid #2a3158',
            background: '#0a1230',
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${P.cyan}22`,
            overflow: 'hidden',
            position: 'relative',
            fontFamily: BODY,
            color: P.text,
          }}
        >
          <div style={{padding: '34px 20px 14px', background: '#16204a', display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg, ${P.gold}, ${P.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 28, color: '#0b1020'}}>
              H
            </div>
            <div>
              <div style={{fontWeight: 700, fontSize: 22}}>Hermes Agent</div>
              <div style={{fontSize: 16, color: P.green}}>bot · dalam talian</div>
            </div>
          </div>
          <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
            <div style={{opacity: chat1, transform: `translateY(${(1 - chat1) * 14}px)`}}>
              <Bubble who="user" size={20} maxW={260}>Can you hear me?</Bubble>
            </div>
            <div style={{opacity: chat2, transform: `translateY(${(1 - chat2) * 14}px)`}}>
              <Bubble who="bot" size={20} maxW={290}>Yes, I can hear you loud and clear. What's on your mind?</Bubble>
            </div>
            <div style={{opacity: sysB, transform: `translateY(${(1 - sysB) * 14}px)`}}>
              <Bubble who="sys" size={18} maxW={320}>No home channel set for Telegram. Tap /set home</Bubble>
            </div>
            <div style={{opacity: homeB, transform: `translateY(${(1 - homeB) * 14}px)`}}>
              <Bubble who="user" size={20} maxW={200}>/set home</Bubble>
            </div>
          </div>
          {showQr > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(6,10,31,0.88)',
                opacity: showQr,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
              }}
            >
              <Qr size={250} scan={scan} />
              <div style={{fontSize: 22, color: P.dim}}>Imbas untuk cipta bot</div>
            </div>
          ) : null}
        </div>
      </R>

      {/* satu ingatan, banyak pintu */}
      <div style={{position: 'absolute', left: 1330, top: 300, width: 480, opacity: hub, transform: `translateX(${(1 - hub) * 30}px)`}}>
        <Card glow={P.violet} pad={24}>
          <div style={{textAlign: 'center'}}>
            <Icon.Brain size={64} />
            <div style={{fontFamily: HEAD, fontSize: 36, fontWeight: 600, marginTop: 6}}>Satu ejen, satu ingatan</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20}}>
            {['Pelayar (dashboard)', 'Telegram (telefon)', 'Aplikasi desktop'].map((d) => (
              <div key={d} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 25, background: 'rgba(255,255,255,0.06)', padding: '10px 16px', borderRadius: 12}}>
                <Dot color={P.green} size={12} /> {d}
              </div>
            ))}
          </div>
          <div style={{marginTop: 18, fontSize: 22, color: P.dim, textAlign: 'center'}}>
            + Discord, Slack, WhatsApp, e-mel… (20+ platform)
          </div>
        </Card>
      </div>
    </>
  );
};

// ───────────────────────────────────────────────────────── 6. Aplikasi desktop
export const DesktopScene: React.FC = () => {
  const {f, L} = useScene();
  const settings = prog(f, (L[1] ?? 0) + 6, 16);
  const signed = prog(f, (L[1] ?? 0) + 120, 14);
  const hud = useP(2);
  const key = (k: string, i: number) => {
    const press = prog(f, (L[2] ?? 0) + 30 + i * 8, 6);
    return (
      <div
        key={k}
        style={{
          fontFamily: MONO,
          fontSize: 46,
          fontWeight: 700,
          minWidth: 96,
          textAlign: 'center',
          padding: '18px 24px',
          borderRadius: 18,
          background: press > 0.5 ? P.gold : 'rgba(255,255,255,0.1)',
          color: press > 0.5 ? '#10131f' : P.text,
          border: `2px solid ${P.gold}88`,
          transform: `translateY(${press > 0.5 ? 6 : 0}px)`,
          boxShadow: press > 0.5 ? 'none' : '0 8px 0 rgba(0,0,0,0.4)',
        }}
      >
        {k}
      </div>
    );
  };
  const wave = (i: number) => 12 + 22 * Math.abs(Math.sin(f / 5 + i * 1.3));
  return (
    <>
      <Head step="Bonus" title="Aplikasi desktop" sub="Satu pintu lagi ke ejen yang sama" />
      <R at={0} y={30} style={{position: 'absolute', left: 110, top: 280}}>
        <Card pad={0} style={{width: 960, height: 560, overflow: 'hidden', position: 'relative'}}>
          <div style={{padding: '14px 20px', background: 'rgba(255,255,255,0.08)', display: 'flex', gap: 10, alignItems: 'center'}}>
            <Dot color="#ff6b6b" size={14} />
            <Dot color="#ffd166" size={14} />
            <Dot color="#55e0a0" size={14} />
            <span style={{marginLeft: 12, fontFamily: MONO, fontSize: 20, color: P.dim}}>Hermes</span>
          </div>
          <div style={{display: 'flex', height: 'calc(100% - 52px)'}}>
            <div style={{width: 230, padding: 18, borderRight: `1px solid ${P.line}`, fontSize: 22, display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{color: P.gold, fontWeight: 700}}>Sesi pelayan</div>
              <div style={{color: P.dim}}>Telegram · Can you hear me?</div>
              <div style={{color: P.dim}}>Standing desks…</div>
              <div style={{color: P.dim}}>Trend AI (cron)</div>
            </div>
            <div style={{flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14}}>
              <Bubble who="user" size={22} maxW={460}>What was my first ever message to you?</Bubble>
              <div style={{opacity: signed}}>
                <Bubble who="bot" size={22} maxW={460}>Can you hear me?</Bubble>
              </div>
              <div style={{marginTop: 'auto', fontSize: 20, color: P.dim, opacity: signed}}>
                <Dot color={P.green} size={12} /> model: DeepSeek · disambung ke pelayan
              </div>
            </div>
          </div>
          {settings > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 150,
                top: 90,
                width: 660,
                opacity: settings * (1 - prog(f, (L[2] ?? 0) - 10, 10)),
                transform: `translateY(${(1 - settings) * 20}px)`,
                background: '#10183a',
                border: `2px solid ${P.gold}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                fontSize: 24,
              }}
            >
              <div style={{fontFamily: HEAD, fontSize: 34, color: P.gold}}>Settings → Gateway</div>
              <div style={{display: 'flex', gap: 14, margin: '16px 0'}}>
                <Chip color={P.dim}>Local</Chip>
                <Chip color={P.gold} solid>Remote</Chip>
              </div>
              <div style={{fontFamily: MONO, fontSize: 21, background: 'rgba(0,0,0,0.4)', padding: '12px 14px', borderRadius: 10, color: P.cyan}}>
                {typed('https://hermes-agent-xxxx.hostinger.cloud', f, (L[1] ?? 0) + 36, 30)}
              </div>
              <div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 14}}>
                <Chip color={P.cyan} solid>Sign in</Chip>
                <span style={{opacity: signed, color: P.green, display: 'flex', alignItems: 'center', gap: 8}}>
                  <Icon.Check size={26} /> Signed in
                </span>
              </div>
            </div>
          ) : null}
        </Card>
      </R>

      <div style={{position: 'absolute', left: 1140, top: 290, width: 670, opacity: hud, transform: `translateY(${(1 - hud) * 24}px)`}}>
        <Card glow={P.cyan}>
          <div style={{fontFamily: HEAD, fontSize: 36, color: P.cyan}}>Bar terapung (HUD)</div>
          <div style={{display: 'flex', gap: 14, margin: '22px 0', justifyContent: 'center'}}>
            {['⌘', 'Shift', 'H'].map(key)}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderRadius: 999,
              background: 'rgba(0,0,0,0.45)',
              border: `2px solid ${P.cyan}88`,
              padding: '14px 24px',
              fontSize: 26,
              color: P.dim,
            }}
          >
            <Icon.Mic size={36} />
            <span style={{flex: 1}}>Tanya Hermes…</span>
            <span style={{display: 'flex', gap: 4, alignItems: 'center', height: 40}}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{width: 6, height: wave(i), background: P.cyan, borderRadius: 3}} />
              ))}
            </span>
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap'}}>
            <Chip color={P.gold}>Suara & dikte</Chip>
            <Chip color={P.violet}>Wake word: “Hey, Hermes”</Chip>
          </div>
          <div style={{fontSize: 21, color: P.dim, marginTop: 16}}>Windows: guna Ctrl menggantikan ⌘.</div>
        </Card>
      </div>
    </>
  );
};

// ───────────────────────────────────────────────────────── 7. Latihan
export const TrainScene: React.FC = () => {
  const {f, L} = useScene();
  const msg = typed('Terlalu panjang. Ringkas, 3 perenggan max, tiada heading atau bullet. Simpan sebagai keutamaan.', f, (L[0] ?? 0) + 14, 34);
  const memory = prog(f, (L[1] ?? 0) + 4, 16);
  const arrow = useP(2, 0, 16);
  const bot = prog(f, (L[2] ?? 0) + 70, 18);
  const skills = useP(3, 0, 18);
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <>
      <Head step="Langkah 4" title="Latihan" sub="Betulkan sekali, ia ingat selamanya" />
      <div style={{position: 'absolute', left: 110, top: 280, width: 720}}>
        <R at={0}>
          <Card pad={22} style={{height: 380}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
              <Chip color={P.cyan} size={20}>Sesi A</Chip>
              <span style={{fontSize: 21, color: P.dim}}>pembetulan dalam bahasa biasa</span>
            </div>
            <Bubble who="user" size={23} maxW={640}>
              {msg}
              <span style={{opacity: 0.5}}>▍</span>
            </Bubble>
            <div style={{opacity: memory, transform: `translateY(${(1 - memory) * 12}px)`, marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 22, color: P.violet, background: 'rgba(155,140,255,0.12)', border: `1px solid ${P.violet}77`, borderRadius: 12, padding: '10px 14px'}}>
              <Icon.Brain size={34} /> memory.save → “gaya: ringkas, tanpa heading/bullet”
            </div>
          </Card>
        </R>
      </div>

      <div style={{position: 'absolute', left: 840, top: 400, width: 150, textAlign: 'center', opacity: arrow, transform: `scale(${0.8 + 0.2 * arrow})`}}>
        <svg width={150} height={70}>
          <path d="M10 35h110M95 12l25 23-25 23" stroke={P.gold} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: BODY, fontSize: 20, color: P.gold, fontWeight: 700}}>SESI BARU</div>
      </div>

      <div style={{position: 'absolute', left: 1010, top: 280, width: 800}}>
        <R at={2}>
          <Card pad={22} glow={P.green} style={{height: 380}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
              <Chip color={P.green} size={20}>Sesi B · tiada sejarah</Chip>
            </div>
            <Bubble who="user" size={23} maxW={640}>Tulis post pendek: destinasi Eropah terbaik untuk pantai.</Bubble>
            <div style={{opacity: bot, transform: `translateY(${(1 - bot) * 14}px)`, marginTop: 16}}>
              <Bubble who="bot" size={22} maxW={700}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: 520}}>
                  {[92, 78, 100].map((w, i) => (
                    <div key={i} style={{height: 12, width: `${w}%`, borderRadius: 6, background: 'rgba(255,255,255,0.28)'}} />
                  ))}
                  <div style={{height: 4}} />
                  {[85, 55].map((w, i) => (
                    <div key={i} style={{height: 12, width: `${w}%`, borderRadius: 6, background: 'rgba(255,255,255,0.28)'}} />
                  ))}
                </div>
              </Bubble>
              <div style={{marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip color={P.green} size={20}>✓ 3 perenggan</Chip>
                <Chip color={P.green} size={20}>✓ tiada heading</Chip>
                <Chip color={P.green} size={20}>✓ tiada bullet</Chip>
              </div>
            </div>
          </Card>
        </R>
      </div>

      <div style={{position: 'absolute', left: 110, top: 690, width: 1700, opacity: skills, transform: `translateY(${(1 - skills) * 24}px)`}}>
        <div style={{display: 'flex', gap: 20}}>
          <Card pad={20} style={{flex: 1}}>
            <div style={{fontFamily: MONO, fontSize: 24, color: P.cyan}}>google-workspace</div>
            <div style={{fontSize: 21, color: P.dim, marginTop: 6}}>Skill terbina dalam</div>
          </Card>
          <Card pad={20} glow={P.gold} style={{flex: 1}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{fontFamily: MONO, fontSize: 24, color: P.goldHi}}>youtube-trend-watch</span>
              <Chip color={P.gold} solid size={18}>LEARNED</Chip>
            </div>
            <div style={{fontSize: 21, color: P.dim, marginTop: 6}}>Ditulis sendiri oleh ejen <Dot color={P.green} size={10} pulse={pulse} /></div>
          </Card>
          <Card pad={20} style={{flex: 1}}>
            <div style={{fontFamily: MONO, fontSize: 24, color: P.violet}}>SOUL.md</div>
            <div style={{fontSize: 21, color: P.dim, marginTop: 6}}>Siapa ia & cara ia bertindak</div>
          </Card>
          <Card pad={20} style={{flex: 1}}>
            <div style={{fontFamily: MONO, fontSize: 24, color: P.green}}>Skills Hub</div>
            <div style={{fontSize: 21, color: P.dim, marginTop: 6}}>Cari & muat turun lebih banyak</div>
          </Card>
        </div>
        <div style={{fontSize: 23, color: P.dim, marginTop: 18, fontFamily: BODY}}>
          Memori, skill dan SOUL.md semuanya tersimpan di <b style={{color: P.text}}>pelayan anda</b>, bukan di akaun orang lain.
        </div>
      </div>
    </>
  );
};

// ───────────────────────────────────────────────────────── 8. Jadual (cron)
export const CronScene: React.FC = () => {
  const {f, L} = useScene();
  const prompt =
    "Watch YouTube for AI productivity trends. Build yourself a reasonable skill for the check, keep track of what you've already shown me, schedule it every few hours, and message me here only when there's something new.";
  const txt = typed(prompt, f, (L[1] ?? 0) + 8, 36);
  const steps = [
    'Pasang kebergantungan yang perlu',
    'Cari video & tulis skill sendiri',
    'Jadualkan: setiap 4 jam',
    'Mesej hanya bila ada yang baru',
  ];
  const card = useP(2, 80);
  const notif = useP(3, 0, 18);
  const shake = Math.sin(f / 2) * 8 * Math.max(0, 1 - (f - (L[3] ?? 0)) / 40);
  return (
    <>
      <Head step="Langkah 5" title="Jadual" sub="Ejen bekerja ketika anda tidur" />
      <R at={1} style={{position: 'absolute', left: 110, top: 270, width: 640}}>
        <Card pad={22} glow={P.cyan} style={{minHeight: 520}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
            <Chip color={P.cyan} size={20}>Satu mesej sahaja</Chip>
          </div>
          <Bubble who="user" size={23} maxW={580}>
            {txt}
            <span style={{opacity: 0.5}}>▍</span>
          </Bubble>
        </Card>
      </R>

      <div style={{position: 'absolute', left: 790, top: 270, width: 520, display: 'flex', flexDirection: 'column', gap: 16}}>
        {steps.map((s, i) => (
          <R key={s} at={2} d={i * 26} x={-20} y={0}>
            <Card pad={18} glow={i === 2 ? P.gold : undefined} style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <Icon.Check size={38} />
              <span style={{fontSize: 25, lineHeight: 1.25}}>{s}</span>
            </Card>
          </R>
        ))}
        <R at={3} y={10} style={{fontFamily: HEAD, fontSize: 30, color: P.gold, letterSpacing: 1}}>
          ANDA TERANGKAN HASIL, EJEN BINA JENTERA.
        </R>
      </div>

      <div style={{position: 'absolute', left: 1350, top: 270, width: 460}}>
        <div style={{opacity: card, transform: `translateY(${(1 - card) * 20}px)`}}>
          <Card pad={22} glow={P.gold}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <Icon.Clock size={46} color={P.gold} />
              <div style={{fontFamily: HEAD, fontSize: 34}}>Scheduled Job</div>
            </div>
            <div style={{fontFamily: MONO, fontSize: 22, color: P.cyan, marginTop: 14}}>setiap 4 jam</div>
            <div style={{fontSize: 21, color: P.dim, marginTop: 6}}>larian seterusnya · prompt tepat dipaparkan</div>
            <div style={{display: 'flex', gap: 10, marginTop: 14}}>
              <Chip color={P.dim} size={18}>Jeda</Chip>
              <Chip color={P.gold} size={18}>Jalankan</Chip>
            </div>
          </Card>
        </div>
        <div style={{marginTop: 22, opacity: notif, transform: `translate(${shake}px, ${(1 - notif) * 24}px)`}}>
          <Card pad={20} glow={P.green}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <Icon.Bell size={40} />
              <div style={{fontWeight: 700, fontSize: 24}}>Hermes · baru sahaja</div>
            </div>
            <div style={{fontSize: 22, marginTop: 10, lineHeight: 1.4}}>
              Trend produktiviti AI: <b>8 video baharu</b> melepasi ambang.
              <div style={{color: P.dim, marginTop: 6}}>“Tahun AI berhenti jadi chatbot dan menjadi rakan sekerja.”</div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
