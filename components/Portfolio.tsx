'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

/* ─── DATA ─────────────────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 'linamar',
    initials: 'LN',
    title: 'Mechanical Design Engineer',
    company: 'Linamar Corporation',
    location: 'Guelph, ON',
    date: 'Jan 2026 – May 2026',
    tags: ['SolidWorks', 'GD&T', 'DFMA', 'FEA', 'FDM/SLA'],
    bullets: [
      'Designed & validated 10+ production fixtures using SolidWorks with GD&T and DFMA principles.',
      'Cut cycle times 20–40 s/operation through fixture & ergonomics redesigns with machinists.',
      'Reverse engineered failed robotic components; produced CAD models and fabricated replacements.',
      'Reduced defective parts by 10%+ through fixture redesigns and optimised part handling.',
      'Full concept → CAD → fabrication → validation ownership deployed directly on shop floor.',
    ],
  },
  {
    id: 'rocketry',
    initials: 'WR',
    title: 'Mechanical Engineer',
    company: 'Waterloo Rocketry',
    location: 'Waterloo, ON',
    date: 'Aug 2025 – Present',
    tags: ['Test fixtures', '3D printing', 'Propulsion', 'Telemetry'],
    bullets: [
      'Built test fixtures and camera systems for 10+ static engine tests with real-time telemetry.',
      'Designed 3D-printed enclosures and support structures for harsh testing environments.',
      'Assembled and calibrated propulsion systems within 5% of predicted thrust.',
    ],
  },
  {
    id: 'pratyin',
    initials: 'PI',
    title: 'Software Development Intern',
    company: 'Pratyin Infotech Consulting',
    location: 'Toronto, ON',
    date: 'May 2025 – Aug 2025',
    tags: ['Java', 'FastAPI', 'Python', 'Agile'],
    bullets: [
      'Java + FastAPI integration syncing 5,000+ invoices with 99.7% accuracy.',
      'Automated Python data pipelines processing 200,000 records/month, cutting manual work by 20%.',
      'Shipped 2 production-ready features in 2 months, zero critical bugs deployed.',
    ],
  },
]

const PROJECTS = [
  {
    id: 'vex',
    name: 'Autonomous VEX Retrieval Bot',
    desc: 'PID navigation + sensor fusion achieving 98% turn accuracy and 92% object retrieval. 8+ custom manufactured components with a 15% weight reduction.',
    img: '/images/vex-bot.jpg',           // add your photo here
    tags: ['C++', 'PID control', 'Sensor fusion', 'CAD'],
    stat: '98% accuracy',
  },
  {
    id: 'cart',
    name: 'Reverse Engineered Regress Cart',
    desc: 'Redesigned 100+ kg production cart. Reduced part count via DFMA, coordinated waterjet fabrication with full GD&T drawing package.',
    img: '/images/regress-cart.jpg',      // add your photo here
    tags: ['Siemens NX', 'SolidWorks', 'DFMA', 'GD&T'],
    stat: '100+ kg validated',
  },
  {
    id: 'gauge',
    name: 'Runout Gauge',
    desc: 'Precision measurement tooling designed and fabricated for production. Rapid-prototyped and validated against tight tolerance requirements.',
    img: '/images/runout-gauge.jpg',      // add your photo here
    tags: ['SolidWorks', 'FDM', 'Tolerance analysis'],
    stat: 'Production-deployed',
  },
  {
    id: 'prints',
    name: '3D Printed & Manufactured Parts',
    desc: 'Ongoing library of FDM/SLA and machined components — enclosures, brackets, fixtures, and custom hardware across multiple projects.',
    img: '/images/3dprints.jpg',          // add your photo here
    tags: ['FDM', 'SLA', 'CNC', 'Fabrication'],
    stat: 'Growing library',
  },
]

const SKILLS = [
  'SolidWorks', 'Siemens NX', 'Fusion 360', 'FEA', 'GD&T', 'DFMA',
  'C++', 'Python', 'MATLAB', 'ROS', 'RTOS', 'STM32', 'Arduino',
  'Java', 'FastAPI', 'Git', 'CNC', 'FDM/SLA', 'Composites',
]

const POSTS = [
  {
    date: 'Coming soon', cat: 'Engineering',
    title: 'What I learned building test rigs at a rocketry team',
    excerpt: "There's a gap between what a static fire looks like in CAD and what it looks like at 3 AM on a cold field.",
  },
  {
    date: 'Coming soon', cat: 'Design',
    title: 'Why DFMA should be taught in first year',
    excerpt: "Every time a machinist asks 'what did they mean by this?' is a failure of the drawing.",
  },
  {
    date: 'Coming soon', cat: 'Process',
    title: 'PID from scratch: what the textbook skips',
    excerpt: 'Implementing PID for the VEX bot taught me more in 3 weeks than a semester of controls.',
  },
]

type Section = 'home' | 'about' | 'writing' | 'projects'

/* ─── WAVE CANVAS ───────────────────────────────────────────── */
function WaveCanvas({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })
  const raf   = useRef<number>(0)
  const t     = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse.current.tx = e.clientX / canvas.width
      mouse.current.ty = e.clientY / canvas.height
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      const m  = mouse.current
      m.x += (m.tx - m.x) * 0.035
      m.y += (m.ty - m.y) * 0.035

      const W  = canvas.width
      const H  = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Wave layers: 3 groups — background (faint, slow), mid (medium),
      //              foreground (strong, fast, mouse-reactive)
      const groups = [
        // [count, baseAmp, ampScale, freqBase, freqScale, spdBase, spdScale, alphaBase, alphaScale, lineW, mouseInfluence]
        { count: 7,  amp: [28, 18],  freq: [0.0028, 0.0015], spd: [0.004, 0.002], alpha: [0.06,  0.05],  lw: 0.8, mi: 20 },
        { count: 8,  amp: [48, 28],  freq: [0.0042, 0.0022], spd: [0.007, 0.003], alpha: [0.10,  0.07],  lw: 1.0, mi: 45 },
        { count: 6,  amp: [70, 35],  freq: [0.0058, 0.003],  spd: [0.011, 0.005], alpha: [0.14,  0.09],  lw: 1.3, mi: 80 },
      ]

      // Light mode: dark warm lines. Dark mode: bright cool lines.
      const baseR = dark ? 210 : 80
      const baseG = dark ? 206 : 76
      const baseB = dark ? 195 : 68

      let globalWi = 0
      for (const g of groups) {
        for (let wi = 0; wi < g.count; wi++) {
          const prog  = wi / Math.max(g.count - 1, 1)
          const yBase = H * (0.03 + prog * 0.94)

          // Amplitude: base + mouse-y influence
          const amp   = g.amp[0] + prog * g.amp[1] + m.y * 35

          // Two overlapping frequencies for complexity
          const freq1 = g.freq[0] + prog * g.freq[1]
          const freq2 = freq1 * 1.618                           // golden ratio harmonic
          const freq3 = freq1 * 0.47                            // slow sub-harmonic

          const spd1  = g.spd[0]  + prog * g.spd[1]
          const spd2  = spd1 * 0.7
          const spd3  = spd1 * 1.4

          // Alpha: stronger in foreground group, with subtle prog gradient
          const alpha = g.alpha[0] + prog * g.alpha[1]

          // Mouse-x ripple: a Gaussian bump that travels with cursor
          const mxInfluence = g.mi * m.y                        // scales with cursor height

          ctx.beginPath()
          for (let x = 0; x <= W; x += 2) {
            const nx   = x / W
            const dist = Math.abs(nx - m.x)

            // Gaussian ripple centred on mouse x
            const bump = Math.exp(-dist * dist * 14) * mxInfluence

            // Secondary ripple — wider, softer
            const bump2 = Math.exp(-dist * dist * 3) * mxInfluence * 0.3

            const phase = globalWi * 0.72

            const y = yBase
              + Math.sin(x * freq1 + t.current * spd1 + phase) * amp
              + Math.sin(x * freq2 + t.current * spd2 + phase * 1.3) * amp * 0.42
              + Math.sin(x * freq3 + t.current * spd3 + phase * 0.6) * amp * 0.25
              + bump + bump2

            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }

          ctx.strokeStyle = `rgba(${baseR},${baseG},${baseB},${alpha})`
          ctx.lineWidth   = g.lw
          ctx.stroke()

          globalWi++
        }
      }

      t.current++
      raf.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [dark])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  )
}

/* ─── CUSTOM CURSOR ─────────────────────────────────────────── */
function Cursor({ dark }: { dark: boolean }) {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 })
  const raf = useRef<number>(0)
  const hovered = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const isHoverable = el?.closest('button,a,[data-hover]')
      hovered.current = !!isHoverable
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      const p = pos.current
      p.rx += (p.x - p.rx) * 0.12
      p.ry += (p.y - p.ry) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${p.x - 4}px, ${p.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${p.rx - 18}px, ${p.ry - 18}px)`
        ringRef.current.classList.toggle('hovered', hovered.current)
      }
      raf.current = requestAnimationFrame(tick)
    }
    tick()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current) }
  }, [])

  const color = dark ? '#e6e4de' : '#1a1916'
  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  style={{ color, background: color }} />
      <div ref={ringRef} className="cursor-ring" style={{ color, borderColor: color }} />
    </>
  )
}

/* ─── NAV ───────────────────────────────────────────────────── */
const NAVITEMS: { label: string; id: Section }[] = [
  { label: 'Home',     id: 'home'     },
  { label: 'About',    id: 'about'    },
  { label: 'Writing',  id: 'writing'  },
  { label: 'Projects', id: 'projects' },
]

function Nav({ active, onNav, dark, onToggleDark }: {
  active: Section; onNav: (s: Section) => void; dark: boolean; onToggleDark: () => void
}) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? dark ? 'bg-sand-950/80 backdrop-blur-md' : 'bg-sand-50/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[760px] mx-auto px-8 flex items-center justify-between py-6">
        <button
          onClick={() => onNav('home')}
          data-hover
          className={`font-display text-lg tracking-wide transition-opacity hover:opacity-60 ${dark ? 'text-sand-100' : 'text-sand-900'}`}
        >
          AD
        </button>
        <div className="flex items-center gap-7">
          {NAVITEMS.map(n => (
            <button
              key={n.id}
              data-hover
              onClick={() => onNav(n.id)}
              className={`nav-underline text-[11px] tracking-[0.14em] uppercase font-body transition-colors duration-200 ${
                active === n.id
                  ? dark ? 'text-sand-100 active' : 'text-sand-900 active'
                  : dark ? 'text-sand-500 hover:text-sand-200' : 'text-sand-500 hover:text-sand-700'
              }`}
            >
              {n.label}
            </button>
          ))}
          <button
            data-hover
            onClick={onToggleDark}
            className={`text-[11px] tracking-[0.1em] uppercase border rounded-full px-4 py-1.5 transition-all duration-300 ${
              dark
                ? 'border-sand-700 text-sand-400 hover:text-sand-100 hover:border-sand-400'
                : 'border-sand-300 text-sand-500 hover:text-sand-800 hover:border-sand-600'
            }`}
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

/* ─── SECTION WRAPPER ───────────────────────────────────────── */
function Sec({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      key={Math.random()}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1,  y: 0  }}
      exit={{    opacity: 0,  y: -16 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`max-w-[760px] mx-auto px-8 pt-36 pb-24 min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ─── EYEBROW ───────────────────────────────────────────────── */
function Eyebrow({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <p className={`text-[11px] tracking-[0.18em] uppercase font-body mb-7 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>
      {children}
    </p>
  )
}

/* ─── HOME SECTION ──────────────────────────────────────────── */
function HomeSection({ dark }: { dark: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0  },
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] },
  })

  return (
    <Sec>
      {/* Hero */}
      <motion.div {...stagger(0)}>
        <div className="flex items-center gap-2.5 mb-6">
          <span className={`w-2 h-2 rounded-full bg-green-400 animate-pulse-slow`} />
          <span className={`text-xs tracking-[0.08em] font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>
            Mechatronics Engineering · University of Waterloo
          </span>
        </div>
        <Eyebrow dark={dark}>Engineer &amp; Builder</Eyebrow>
      </motion.div>

      <motion.h1
        {...stagger(1)}
        className={`font-display text-5xl md:text-6xl leading-[1.1] mb-6 ${dark ? 'text-sand-50' : 'text-sand-900'}`}
      >
        Arjun Dindigal.<br />
        <span className={`italic ${dark ? 'text-sand-400' : 'text-sand-400'}`}>Building things</span><br />
        that move, compute,<br />and last.
      </motion.h1>

      <motion.p {...stagger(2)} className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* BIO: Replace this paragraph with 2–3 sentences about yourself. */}
        Mechatronics student at Waterloo with hands-on experience in mechanical design, software, and systems that bridge both worlds. I care about making things that actually work.
      </motion.p>

      {/* Skills */}
      <motion.div {...stagger(3)} className="flex flex-wrap gap-2 mb-20">
        {SKILLS.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.03, duration: 0.3 }}
            className={`shimmer-tag text-[10px] tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border font-body transition-all duration-200 cursor-default ${
              dark
                ? 'border-sand-700 text-sand-500 hover:text-sand-200 hover:border-sand-500'
                : 'border-sand-200 text-sand-400 hover:text-sand-700 hover:border-sand-400'
            }`}
          >
            {s}
          </motion.span>
        ))}
      </motion.div>

      {/* Experience */}
      <motion.div {...stagger(4)}>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Experience</p>
        <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1,  x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              className={`border-b ${dark ? 'border-sand-800' : 'border-sand-200'}`}
            >
              <button
                data-hover
                onClick={() => setOpenId(openId === exp.id ? null : exp.id)}
                className={`w-full flex items-start gap-4 py-5 text-left transition-all duration-200 rounded-sm group ${
                  dark ? 'hover:bg-sand-900' : 'hover:bg-sand-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-body tracking-wider flex-shrink-0 border font-medium ${
                  dark ? 'bg-sand-800 border-sand-700 text-sand-400' : 'bg-sand-100 border-sand-200 text-sand-500'
                }`}>
                  {exp.initials}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{exp.title}</div>
                  <div className={`text-xs mt-0.5 font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{exp.company} · {exp.location}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {exp.tags.map(t => (
                      <span key={t} className={`text-[9px] tracking-[0.07em] uppercase px-2 py-0.5 rounded-full border font-body ${
                        dark ? 'border-sand-700 text-sand-600' : 'border-sand-200 text-sand-400'
                      }`}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className={`text-xs mt-0.5 mr-1 flex-shrink-0 font-body transition-transform duration-300 ${
                  openId === exp.id ? 'rotate-180' : ''
                } ${dark ? 'text-sand-600' : 'text-sand-400'}`}>
                  &#8964;
                </div>
              </button>

              <div className={`drawer ${openId === exp.id ? 'open' : ''}`}>
                <div className="drawer-inner">
                  <ul className={`pb-5 pl-14 pr-4 space-y-2 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="text-[12.5px] leading-relaxed flex gap-2">
                        <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${dark ? 'bg-sand-600' : 'bg-sand-300'}`} />
                        {b}
                      </li>
                    ))}
                    <li className={`text-[11px] tracking-wide mt-3 ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{exp.date}</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Sec>
  )
}

/* ─── ABOUT SECTION ─────────────────────────────────────────── */
function AboutSection({ dark }: { dark: boolean }) {
  const cards = [
    { label: 'Education', value: 'B.A.Sc. Mechatronics Engineering', sub: 'University of Waterloo · 2025–2030' },
    { label: 'Location',  value: 'Waterloo / Toronto, ON', sub: 'Open to co-op & internships' },
    { label: 'Contact',   value: 'adindiga@uwaterloo.ca', sub: '905-519-3823' },
    { label: 'Standing',  value: 'Excellent Academic Standing', sub: 'Relevant: DSA, Mechatronics, Materials, Circuits' },
  ]
  const interests = ['Robotics', 'Rocketry', 'Manufacturing', '3D printing', 'Control systems', 'Photography', 'Design', 'Running']

  return (
    <Sec>
      <Eyebrow dark={dark}>About</Eyebrow>
      <h1 className={`font-display text-5xl leading-[1.15] mb-6 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Engineer at heart,<br /><span className="italic">builder by habit.</span>
      </h1>
      <p className={`text-sm leading-relaxed max-w-md mb-12 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* ABOUT BIO: Replace this with your own words — what drives you, what kind of problems excite you. */}
        I'm Arjun — a Mechatronics Engineering student at Waterloo who loves the full loop from concept to physical thing. I'm most at home when design, fabrication, and code all have to talk to each other.
      </p>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-12">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`rounded-xl p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}
          >
            <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{c.label}</p>
            <p className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{c.value}</p>
            <p className={`text-xs mt-0.5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{c.sub}</p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1,  y: 0  }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className={`col-span-2 rounded-xl p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}
        >
          <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Full Toolkit</p>
          <p className={`text-xs leading-relaxed font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
            SolidWorks · Siemens NX · Fusion 360 · FEA · GD&T · DFMA · C++ · Python · MATLAB · ROS · RTOS · STM32 · Arduino · Java · FastAPI · Git · CNC (mill/lathe) · FDM/SLA · Composites
          </p>
        </motion.div>
      </div>

      {/* Photo grid */}
      <div className="mb-12">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Photos</p>
        <div className="grid grid-cols-3 gap-2.5">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className={`aspect-square rounded-xl overflow-hidden border ${dark ? 'bg-sand-800 border-sand-700' : 'bg-sand-100 border-sand-200'}`}>
              {/* TO ADD PHOTO: replace this div contents with:
                  <img src={`/images/photo${n}.jpg`} alt="caption" className="w-full h-full object-cover" /> */}
              <div className={`w-full h-full flex items-center justify-center text-[10px] tracking-widest uppercase font-body ${dark ? 'text-sand-700' : 'text-sand-300'}`}>
                Photo {n}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Interests</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`text-xs px-4 py-2 rounded-full border font-body ${
                dark ? 'bg-sand-800 border-sand-700 text-sand-400' : 'bg-sand-100 border-sand-200 text-sand-500'
              }`}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </Sec>
  )
}

/* ─── WRITING SECTION ───────────────────────────────────────── */
function WritingSection({ dark }: { dark: boolean }) {
  return (
    <Sec>
      <Eyebrow dark={dark}>Writing</Eyebrow>
      <h1 className={`font-display text-5xl leading-[1.15] mb-12 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Thinking <span className="italic">in public.</span>
      </h1>

      <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
        {POSTS.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ delay: i * 0.12 }}
            data-hover
            className={`border-b py-8 group cursor-pointer transition-all duration-200 rounded-sm ${
              dark ? 'border-sand-800 hover:bg-sand-900' : 'border-sand-200 hover:bg-sand-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[10px] tracking-[0.1em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{p.date}</span>
              <span className={`text-[9px] tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full border font-body ${
                dark ? 'border-sand-700 text-sand-600' : 'border-sand-200 text-sand-400'
              }`}>{p.cat}</span>
            </div>
            <h2 className={`font-display text-2xl mb-2.5 group-hover:translate-x-1 transition-transform duration-200 ${dark ? 'text-sand-100' : 'text-sand-900'}`}>
              {p.title}
            </h2>
            <p className={`text-sm leading-relaxed font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{p.excerpt}</p>
            <p className={`text-[11px] tracking-[0.1em] uppercase mt-4 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>
              Read →
            </p>
          </motion.div>
        ))}
      </div>
    </Sec>
  )
}

/* ─── PROJECTS SECTION ──────────────────────────────────────── */
function ProjectsSection({ dark }: { dark: boolean }) {
  return (
    <Sec>
      <Eyebrow dark={dark}>Projects</Eyebrow>
      <h1 className={`font-display text-5xl leading-[1.15] mb-12 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Things I've <span className="italic">made.</span>
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ delay: i * 0.1, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ y: -4 }}
            data-hover
            className={`rounded-xl border overflow-hidden cursor-pointer transition-colors duration-200 ${
              dark ? 'bg-sand-900 border-sand-800 hover:border-sand-600' : 'bg-white border-sand-200 hover:border-sand-400'
            }`}
          >
            {/* Image slot */}
            <div className={`proj-img h-44 ${dark ? 'bg-sand-800' : 'bg-sand-100'}`}>
              {/* TO ADD PHOTO: replace the div below with:
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> */}
              <div className={`w-full h-full flex flex-col items-center justify-center gap-2 font-body ${dark ? 'text-sand-700' : 'text-sand-300'}`}>
                <span className="text-2xl">◆</span>
                <span className="text-[10px] tracking-widest uppercase">Add photo</span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-sm font-body ${dark ? 'text-sand-100' : 'text-sand-900'}`}>{p.name}</h3>
                <span className={`text-[9px] tracking-wide uppercase font-body ml-2 flex-shrink-0 ${dark ? 'text-sand-600' : 'text-sand-400'}`}>↗</span>
              </div>
              <p className={`text-xs leading-relaxed mb-4 font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.tags.map(t => (
                  <span key={t} className={`text-[9px] tracking-[0.06em] uppercase px-2 py-0.5 rounded font-body ${
                    dark ? 'bg-sand-800 text-sand-500' : 'bg-sand-100 text-sand-400'
                  }`}>{t}</span>
                ))}
              </div>
              <p className={`text-[10px] tracking-[0.08em] uppercase font-mono ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{p.stat}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Sec>
  )
}

/* ─── FOOTER ────────────────────────────────────────────────── */
function Footer({ dark }: { dark: boolean }) {
  return (
    <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
      <div className="max-w-[760px] mx-auto px-8 py-10 flex items-center justify-between">
        <span className={`text-[11px] tracking-[0.1em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>
          Arjun Dindigal · 2025
        </span>
        <div className="flex gap-6">
          {[
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arjundindigal' },
            { label: 'Resume',   href: '/resume.pdf' },  // add your PDF to /public/resume.pdf
            { label: 'Email',    href: 'mailto:adindiga@uwaterloo.ca' },
          ].map(l => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              data-hover
              className={`text-[11px] tracking-[0.1em] uppercase font-body nav-underline transition-colors duration-200 ${
                dark ? 'text-sand-600 hover:text-sand-300' : 'text-sand-400 hover:text-sand-700'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── ROOT ──────────────────────────────────────────────────── */
export default function Portfolio() {
  const [section, setSection] = useState<Section>('home')

  // Init dark mode: honour explicit user choice stored in localStorage,
  // otherwise fall back to system preference. Never auto-dark on page load.
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    if (stored === 'dark')  return true
    if (stored === 'light') return false
    // No stored choice — use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Sync <html> class on mount so Tailwind dark: variants work
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else      document.documentElement.classList.remove('dark')
  }, [dark])

  const toggleDark = useCallback(() => {
    setDark(d => {
      const next = !d
      localStorage.setItem('theme', next ? 'dark' : 'light')
      if (next) document.documentElement.classList.add('dark')
      else      document.documentElement.classList.remove('dark')
      return next
    })
  }, [])

  const bg = dark
    ? 'bg-sand-950 text-sand-100'
    : 'bg-sand-50  text-sand-900'

  return (
    <div className={`grain min-h-screen transition-colors duration-500 ${bg}`}>
      <Cursor dark={dark} />
      <WaveCanvas dark={dark} />
      <Nav active={section} onNav={setSection} dark={dark} onToggleDark={toggleDark} />

      <AnimatePresence mode="wait">
        {section === 'home'     && <HomeSection     key="home"     dark={dark} />}
        {section === 'about'    && <AboutSection    key="about"    dark={dark} />}
        {section === 'writing'  && <WritingSection  key="writing"  dark={dark} />}
        {section === 'projects' && <ProjectsSection key="projects" dark={dark} />}
      </AnimatePresence>

      <Footer dark={dark} />
    </div>
  )
}
