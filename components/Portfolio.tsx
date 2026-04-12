'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── DATA ──────────────────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 'linamar', initials: 'LN',
    title: 'Mechanical Design Engineer',
    company: 'Linamar Corporation', location: 'Guelph, ON', date: 'Jan 2026 – May 2026',
    tags: ['SolidWorks', 'GD&T', 'DFMA', 'FEA', 'FDM/SLA'],
    bullets: [
      'Designed & validated 10+ production fixtures using SolidWorks with GD&T and DFMA principles.',
      'Cut cycle times 20–40 s/op through fixture & ergonomics redesigns with machinists.',
      'Reverse engineered failed robotic components; produced CAD models and fabricated replacements.',
      'Reduced defective parts by 10%+ through fixture redesigns and optimised part handling.',
      'Full concept → CAD → fabrication → validation ownership deployed on shop floor.',
    ],
  },
  {
    id: 'rocketry', initials: 'WR',
    title: 'Mechanical Engineer',
    company: 'Waterloo Rocketry', location: 'Waterloo, ON', date: 'Aug 2025 – Present',
    tags: ['Test fixtures', '3D printing', 'Propulsion', 'Telemetry'],
    bullets: [
      'Built test fixtures and camera systems for 10+ static engine tests with real-time telemetry.',
      'Designed 3D-printed enclosures and support structures for harsh testing environments.',
      'Assembled and calibrated propulsion systems within 5% of predicted thrust.',
    ],
  },
  {
    id: 'pratyin', initials: 'PI',
    title: 'Software Development Intern',
    company: 'Pratyin Infotech Consulting', location: 'Toronto, ON', date: 'May 2025 – Aug 2025',
    tags: ['Java', 'FastAPI', 'Python', 'Agile'],
    bullets: [
      'Java + FastAPI integration syncing 5,000+ invoices with 99.7% accuracy.',
      'Automated Python data pipelines processing 200,000 records/month, cutting manual work by 20%.',
      'Shipped 2 production-ready features in 2 months, zero critical bugs deployed.',
    ],
  },
]

const PROJECTS = [
  { id: 'vex',    name: 'Autonomous VEX Retrieval Bot',       desc: 'PID navigation + sensor fusion — 98% turn accuracy, 92% object retrieval. 8+ custom components, 15% weight reduction.',               img: '/images/vex-bot.jpg',       tags: ['C++', 'PID', 'Sensor fusion', 'CAD'],          stat: '98% accuracy',        gallery: false },
  { id: 'cart',   name: 'Reverse Engineered Regress Cart',    desc: 'Redesigned 100+ kg production cart. Reduced part count via DFMA, coordinated waterjet fabrication with full GD&T drawings.',         img: '/images/regress-cart.jpg',  tags: ['Siemens NX', 'SolidWorks', 'DFMA', 'GD&T'],   stat: '100+ kg validated',   gallery: false },
  { id: 'gauge',  name: 'Runout Gauge',                       desc: 'Precision measurement tooling designed and fabricated for production. Validated against tight tolerance requirements on the shop floor.', img: '/images/runout-gauge.jpg',  tags: ['SolidWorks', 'FDM', 'Tolerance analysis'],     stat: 'Production-deployed', gallery: false },
  { id: 'stairs', name: 'Welded Stairs',                      desc: 'Full steel staircase from raw stock — cut, fitted, and welded to spec. Structural design with load-bearing validation.',                img: '/images/welded-stairs.jpg', tags: ['Welding', 'Fabrication', 'Structural', 'Steel'],stat: 'Load-bearing built',   gallery: false },
  { id: 'prints', name: '3D Printed & Manufactured Parts',    desc: 'A growing gallery of FDM/SLA and machined components. Tap to browse each part with its description.',                                   img: '/images/3dprints.jpg',      tags: ['FDM', 'SLA', 'CNC', 'Fabrication'],            stat: 'Growing library',     gallery: true  },
]

// ── 3D PRINTS — add parts here, images go in public/images/prints/
const PRINTS = [
  { id: 'p1', name: 'Custom Enclosure',  desc: 'FDM-printed ABS enclosure for an electronics board. Snap-fit assembly with ventilation slots and cable routing.', img: '/images/prints/enclosure.jpg',  material: 'ABS · FDM'   },
  { id: 'p2', name: 'Bracket Assembly',  desc: 'Structural PETG bracket holding a camera rig on the rocketry test stand under vibration loads.',                  img: '/images/prints/bracket.jpg',    material: 'PETG · FDM'  },
  { id: 'p3', name: 'Test Fixture Jig',  desc: 'SLA-printed jig for precise alignment during assembly. Toleranced to ±0.1 mm.',                                    img: '/images/prints/jig.jpg',        material: 'Resin · SLA' },
  { id: 'p4', name: 'Prototype Part',    desc: 'Rapid prototype for a production redesign — 3 iterations before the final design was CNC machined.',               img: '/images/prints/prototype.jpg',  material: 'PLA · FDM'   },
]

const SKILLS = ['SolidWorks','Siemens NX','Fusion 360','FEA','GD&T','DFMA','C++','Python','MATLAB','ROS','RTOS','STM32','Arduino','Java','FastAPI','Git','CNC','FDM/SLA','Composites']

const POSTS = [
  { date: 'Coming soon', cat: 'Engineering', title: 'What I learned building test rigs at a rocketry team',  excerpt: "There's a gap between what a static fire looks like in CAD and what it looks like at 3 AM in a field." },
  { date: 'Coming soon', cat: 'Design',      title: 'Why DFMA should be taught in first year',               excerpt: "Every time a machinist asks 'what did they mean?' is a failure of the drawing." },
  { date: 'Coming soon', cat: 'Process',     title: 'PID from scratch: what the textbook skips',             excerpt: 'Implementing PID for the VEX bot taught me more in 3 weeks than a semester of controls.' },
]

// ── TRAINING — paste your Google Sheets / OneDrive share link below
const GYM_TRACKER_URL = '#'

const RACES: { name: string; date: string; status: 'upcoming' | 'completed'; time?: string }[] = [
  { name: 'Ironman 70.3 — goal race', date: 'TBD', status: 'upcoming' },
]

type Section = 'home' | 'about' | 'writing' | 'projects' | 'training'

/* ─── WAVE CANVAS ───────────────────────────────────────────── */
// Clean bold contour lines — fewer waves, crisp strokes, strong mouse pull
function WaveCanvas({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })
  const raf       = useRef<number>(0)
  const t         = useRef(0)
  const darkRef   = useRef(dark)
  useEffect(() => { darkRef.current = dark }, [dark])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Mouse — also handle touch for mobile
    const onMove  = (e: MouseEvent) => { mouse.current.tx = e.clientX / canvas.width; mouse.current.ty = e.clientY / canvas.height }
    const onTouch = (e: TouchEvent) => { if (e.touches[0]) { mouse.current.tx = e.touches[0].clientX / canvas.width; mouse.current.ty = e.touches[0].clientY / canvas.height } }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })

    const WAVE_COUNT = 10   // fewer, cleaner lines
    const draw = () => {
      const m = mouse.current
      // Fast lerp for snappy mouse response
      m.x += (m.tx - m.x) * 0.06
      m.y += (m.ty - m.y) * 0.06

      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const isDark = darkRef.current
      // Solid, warm-neutral colour — no noise, no fuzz
      const R = isDark ? 200 : 70
      const G = isDark ? 196 : 66
      const B = isDark ? 182 : 58

      for (let i = 0; i < WAVE_COUNT; i++) {
        const prog = i / (WAVE_COUNT - 1)          // 0 → 1

        // Evenly space waves across the full height
        const yBase = H * (0.05 + prog * 0.90)

        // Amplitude: gentle at top/bottom, tallest in the middle band
        // Mouse Y lifts/lowers all amplitudes — very noticeable
        const midBias = 1 - Math.abs(prog - 0.5) * 1.2
        const baseAmp = 22 + midBias * 55
        const amp     = baseAmp + m.y * 90          // strong mouse-y response

        // One primary frequency + one sub-harmonic — clean, not chaotic
        const freq  = 0.0030 + prog * 0.0018
        const freq2 = freq * 0.52
        const spd   = 0.0055 + prog * 0.003
        const spd2  = spd * 0.65

        // Phase offset per wave so they don't all peak together
        const phase = i * (Math.PI * 2 / WAVE_COUNT)

        // Mouse-X: sharp Gaussian pull — each wave physically bends toward cursor
        const mxPull = 120 * m.y                    // very visible
        const dist   = Math.abs(prog - m.y) * 2.5   // waves near cursor Y respond most

        // Opacity: bold centre waves, softer edges
        const alpha = isDark
          ? 0.10 + midBias * 0.25
          : 0.08 + midBias * 0.22

        // Line weight: thicker centre waves
        const lw = 0.8 + midBias * 1.4

        ctx.beginPath()
        for (let x = 0; x <= W; x += 3) {
          const nx     = x / W
          const xDist  = Math.abs(nx - m.x)
          // Gaussian bend toward mouse X — wider spread so it's very visible
          const pull   = Math.exp(-xDist * xDist * 6) * mxPull * Math.exp(-dist * dist)

          const y = yBase
            + Math.sin(x * freq  + t.current * spd  + phase) * amp
            + Math.sin(x * freq2 + t.current * spd2 + phase * 0.7) * amp * 0.38
            - pull                                   // pull UP toward cursor

          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        ctx.strokeStyle = `rgba(${R},${G},${B},${alpha})`
        ctx.lineWidth   = lw
        ctx.lineJoin    = 'round'
        ctx.stroke()
      }

      t.current++
      raf.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  )
}

/* ─── CURSOR (desktop only) ─────────────────────────────────── */
function Cursor({ dark }: { dark: boolean }) {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -100, y: -100, rx: -100, ry: -100 })
  const raf     = useRef<number>(0)
  const hov     = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX; pos.current.y = e.clientY
      hov.current = !!document.elementFromPoint(e.clientX, e.clientY)?.closest('button,a,[data-hover]')
    }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      const p = pos.current
      p.rx += (p.x - p.rx) * 0.14; p.ry += (p.y - p.ry) * 0.14
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${p.x-4}px,${p.y-4}px)`
      if (ringRef.current) { ringRef.current.style.transform = `translate(${p.rx-18}px,${p.ry-18}px)`; ringRef.current.classList.toggle('hovered', hov.current) }
      raf.current = requestAnimationFrame(tick)
    }
    tick()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current) }
  }, [])

  const color = dark ? '#e6e4de' : '#1a1916'
  return (
    <>
      <div ref={dotRef}  className="cursor-dot hidden md:block"  style={{ background: color }} />
      <div ref={ringRef} className="cursor-ring hidden md:block" style={{ borderColor: color }} />
    </>
  )
}

/* ─── NAV ───────────────────────────────────────────────────── */
const NAVITEMS: { label: string; id: Section }[] = [
  { label: 'Home',     id: 'home'     },
  { label: 'About',    id: 'about'    },
  { label: 'Writing',  id: 'writing'  },
  { label: 'Projects', id: 'projects' },
  { label: 'Training', id: 'training' },
]

function Nav({ active, onNav, dark, onToggleDark }: {
  active: Section; onNav: (s: Section) => void; dark: boolean; onToggleDark: () => void
}) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const go = (id: Section) => { onNav(id); setMenuOpen(false) }

  const navBg = scrolled || menuOpen
    ? (dark ? 'bg-sand-950/90 backdrop-blur-md' : 'bg-sand-50/90 backdrop-blur-md')
    : 'bg-transparent'

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23,1,0.32,1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}
      >
        <div className="max-w-[860px] mx-auto px-5 md:px-8 flex items-center justify-between py-5 md:py-6">
          {/* Logo */}
          <button onClick={() => go('home')} data-hover
            className={`font-display text-lg tracking-wide transition-opacity hover:opacity-60 ${dark ? 'text-sand-100' : 'text-sand-900'}`}>
            AD
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            {NAVITEMS.map(n => (
              <button key={n.id} data-hover onClick={() => go(n.id)}
                className={`nav-underline text-[11px] tracking-[0.12em] uppercase font-body transition-colors duration-200 ${active === n.id ? (dark ? 'text-sand-100 active' : 'text-sand-900 active') : (dark ? 'text-sand-500 hover:text-sand-200' : 'text-sand-500 hover:text-sand-700')}`}>
                {n.label}
              </button>
            ))}
            <button data-hover onClick={onToggleDark}
              className={`text-[11px] tracking-[0.1em] uppercase border rounded-full px-4 py-1.5 transition-all duration-300 ${dark ? 'border-sand-700 text-sand-400 hover:text-sand-100 hover:border-sand-400' : 'border-sand-300 text-sand-500 hover:text-sand-800 hover:border-sand-600'}`}>
              {dark ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Mobile right — theme toggle + orbital menu icon */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={onToggleDark}
              className={`text-[10px] tracking-[0.1em] uppercase border rounded-full px-3 py-1.5 transition-all duration-300 ${dark ? 'border-sand-600 text-sand-300 bg-sand-900/60' : 'border-sand-400 text-sand-600 bg-white/60'}`}>
              {dark ? 'Light' : 'Dark'}
            </button>

            {/* Orbital dots button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                menuOpen
                  ? (dark ? 'border-sand-400 bg-sand-800' : 'border-sand-500 bg-sand-100')
                  : (dark ? 'border-sand-600 bg-sand-900/60' : 'border-sand-300 bg-white/60')
              }`}
            >
              {/* 4 orbital dots — rotate into X on open */}
              {[
                { open: { x: -1, y: -1, r: 45  }, closed: { x: -3.5, y: -3.5 } },
                { open: { x:  1, y: -1, r: -45 }, closed: { x:  3.5, y: -3.5 } },
                { open: { x: -1, y:  1, r: -45 }, closed: { x: -3.5, y:  3.5 } },
                { open: { x:  1, y:  1, r: 45  }, closed: { x:  3.5, y:  3.5 } },
              ].map((dot, i) => (
                <motion.span
                  key={i}
                  animate={menuOpen
                    ? { x: dot.open.x * 5.5, y: dot.open.y * 5.5, rotate: dot.open.r, scale: 1.15 }
                    : { x: dot.closed.x,     y: dot.closed.y,      rotate: 0,           scale: 1    }
                  }
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: i * 0.03 }}
                  className={`absolute w-1.5 h-1.5 rounded-full ${
                    menuOpen
                      ? (dark ? 'bg-sand-200' : 'bg-sand-700')
                      : (dark ? 'bg-sand-400' : 'bg-sand-500')
                  }`}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — full-contrast panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.23,1,0.32,1] }}
              className={`md:hidden border-t ${dark ? 'border-sand-700 bg-sand-950' : 'border-sand-200 bg-sand-50'}`}
              style={{ boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.08)' }}
            >
              <div className="px-4 py-3 flex flex-col">
                {NAVITEMS.map((n, i) => (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    onClick={() => go(n.id)}
                    className={`flex items-center justify-between py-3.5 px-3 rounded-xl transition-all duration-150 group ${
                      active === n.id
                        ? (dark ? 'bg-sand-800 text-sand-50' : 'bg-sand-200 text-sand-900')
                        : (dark ? 'text-sand-300 hover:bg-sand-800/70 hover:text-sand-100' : 'text-sand-600 hover:bg-sand-100 hover:text-sand-900')
                    }`}
                  >
                    <span className="text-sm tracking-[0.1em] uppercase font-body">{n.label}</span>
                    <span className={`text-xs transition-transform duration-200 group-hover:translate-x-1 ${active === n.id ? (dark ? 'text-sand-400' : 'text-sand-500') : (dark ? 'text-sand-600' : 'text-sand-400')}`}>
                      →
                    </span>
                  </motion.button>
                ))}
                {/* Divider + theme toggle inside menu too */}
                <div className={`mt-2 pt-3 border-t flex items-center justify-between px-3 ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
                  <span className={`text-[10px] tracking-[0.12em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Theme</span>
                  <button onClick={onToggleDark}
                    className={`text-[10px] tracking-[0.1em] uppercase border rounded-full px-4 py-1.5 font-body transition-all duration-200 ${dark ? 'border-sand-600 text-sand-300 hover:border-sand-400 hover:text-sand-100' : 'border-sand-300 text-sand-500 hover:border-sand-500 hover:text-sand-800'}`}>
                    {dark ? '☀ Light' : '◑ Dark'}
                  </button>
                </div>
                <div className="h-3" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

/* ─── HELPERS ───────────────────────────────────────────────── */
function Sec({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.23,1,0.32,1] }}
      className="max-w-[760px] mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-20 min-h-screen"
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return <p className={`text-[11px] tracking-[0.18em] uppercase font-body mb-6 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{children}</p>
}

function Tag({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <span className={`text-[9px] tracking-[0.07em] uppercase px-2 py-0.5 rounded-full border font-body whitespace-nowrap ${dark ? 'border-sand-700 text-sand-600' : 'border-sand-200 text-sand-400'}`}>
      {children}
    </span>
  )
}

/* ─── HOME ──────────────────────────────────────────────────── */
function HomeSection({ dark }: { dark: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const s = (i: number) => ({
    initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.23,1,0.32,1] as any }
  })

  return (
    <Sec>
      <motion.div {...s(0)}>
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow flex-shrink-0" />
          <span className={`text-xs tracking-[0.07em] font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>Mechatronics Engineering · University of Waterloo</span>
        </div>
        <Eyebrow dark={dark}>Engineer &amp; Builder</Eyebrow>
      </motion.div>

      <motion.h1 {...s(1)} className={`font-display text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-5 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Arjun Dindigal.<br />
        <span className="italic text-sand-400">Building things</span><br />
        that move, compute,<br />and last.
      </motion.h1>

      <motion.p {...s(2)} className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* BIO: Replace this sentence with your own words. */}
        Mechatronics student at Waterloo with hands-on experience in mechanical design, software, and systems that bridge both worlds. I care about making things that actually work.
      </motion.p>

      <motion.div {...s(3)} className="flex flex-wrap gap-2 mb-16">
        {SKILLS.map((sk, i) => (
          <motion.span key={sk}
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.28 + i * 0.025, duration: 0.28 }}
            className={`shimmer-tag text-[10px] tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border font-body transition-all duration-200 cursor-default ${dark ? 'border-sand-700 text-sand-500 hover:text-sand-200 hover:border-sand-500' : 'border-sand-200 text-sand-400 hover:text-sand-700 hover:border-sand-400'}`}>
            {sk}
          </motion.span>
        ))}
      </motion.div>

      <motion.div {...s(4)}>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Experience</p>
        <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
          {EXPERIENCES.map((exp, i) => (
            <motion.div key={exp.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.1, duration: 0.38 }}
              className={`border-b ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
              <button data-hover onClick={() => setOpenId(openId === exp.id ? null : exp.id)}
                className={`w-full flex items-start gap-3 md:gap-4 py-4 md:py-5 text-left transition-all duration-200 rounded-sm ${dark ? 'hover:bg-sand-900/60' : 'hover:bg-sand-50'}`}>
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-[10px] md:text-[11px] font-body tracking-wider flex-shrink-0 border font-medium ${dark ? 'bg-sand-800 border-sand-700 text-sand-400' : 'bg-sand-100 border-sand-200 text-sand-500'}`}>
                  {exp.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{exp.title}</div>
                  <div className={`text-xs mt-0.5 font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{exp.company} · {exp.location}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.tags.map(tg => <Tag key={tg} dark={dark}>{tg}</Tag>)}
                  </div>
                </div>
                <span className={`text-xs flex-shrink-0 mt-1 transition-transform duration-300 ${openId === exp.id ? 'rotate-180' : ''} ${dark ? 'text-sand-600' : 'text-sand-400'}`}>&#8964;</span>
              </button>
              <div className={`drawer ${openId === exp.id ? 'open' : ''}`}>
                <div className="drawer-inner">
                  <ul className={`pb-4 pl-12 md:pl-14 pr-3 space-y-2 ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="text-[12.5px] leading-relaxed flex gap-2 font-body">
                        <span className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${dark ? 'bg-sand-600' : 'bg-sand-300'}`} />{b}
                      </li>
                    ))}
                    <li className={`text-[11px] tracking-wide mt-2 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{exp.date}</li>
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

/* ─── ABOUT ─────────────────────────────────────────────────── */
function AboutSection({ dark }: { dark: boolean }) {
  const cards = [
    { label: 'Education', value: 'B.A.Sc. Mechatronics Engineering', sub: 'University of Waterloo · 2025–2030' },
    { label: 'Location',  value: 'Waterloo / Toronto, ON',           sub: 'Open to co-op & internships'       },
    { label: 'Contact',   value: 'adindiga@uwaterloo.ca',            sub: '905-519-3823'                       },
    { label: 'Standing',  value: 'Excellent Academic Standing',      sub: 'DSA · Mechatronics · Materials · Circuits' },
  ]
  const interests = ['Robotics','Rocketry','Manufacturing','3D printing','Control systems','Triathlon','Ironman','Photography','Design','Running','Lifting']

  return (
    <Sec>
      <Eyebrow dark={dark}>About</Eyebrow>
      <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-5 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Engineer at heart,<br /><span className="italic">builder by habit.</span>
      </h1>
      <p className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* ABOUT BIO: Replace this. */}
        I'm Arjun — a Mechatronics student at Waterloo who loves the full loop from concept to physical thing. Most at home when design, fabrication, and code all talk to each other.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`rounded-xl p-4 md:p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}>
            <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{c.label}</p>
            <p className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{c.value}</p>
            <p className={`text-xs mt-0.5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{c.sub}</p>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className={`sm:col-span-2 rounded-xl p-4 md:p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}>
          <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Full Toolkit</p>
          <p className={`text-xs leading-relaxed font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
            SolidWorks · Siemens NX · Fusion 360 · FEA · GD&T · DFMA · C++ · Python · MATLAB · ROS · RTOS · STM32 · Arduino · Java · FastAPI · Git · CNC (mill/lathe) · FDM/SLA · Composites
          </p>
        </motion.div>
      </div>

      <div className="mb-10">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Photos</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className={`aspect-square rounded-xl overflow-hidden border ${dark ? 'bg-sand-800 border-sand-700' : 'bg-sand-100 border-sand-200'}`}>
              {/* Replace with: <img src={`/images/photo${n}.jpg`} alt="" className="w-full h-full object-cover" /> */}
              <div className={`w-full h-full flex items-center justify-center text-[10px] tracking-widest uppercase font-body ${dark ? 'text-sand-700' : 'text-sand-300'}`}>Photo {n}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-3 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Interests</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((item, i) => (
            <motion.span key={item} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              className={`text-xs px-3 py-1.5 rounded-full border font-body ${dark ? 'bg-sand-800 border-sand-700 text-sand-400' : 'bg-sand-100 border-sand-200 text-sand-500'}`}>
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </Sec>
  )
}

/* ─── WRITING ───────────────────────────────────────────────── */
function WritingSection({ dark }: { dark: boolean }) {
  return (
    <Sec>
      <Eyebrow dark={dark}>Writing</Eyebrow>
      <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-10 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Thinking <span className="italic">in public.</span>
      </h1>
      <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
        {POSTS.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} data-hover
            className={`border-b py-7 group cursor-pointer transition-all duration-200 rounded-sm ${dark ? 'border-sand-800 hover:bg-sand-900/60' : 'border-sand-200 hover:bg-sand-50'}`}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`text-[10px] tracking-[0.1em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{p.date}</span>
              <span className={`text-[9px] tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full border font-body ${dark ? 'border-sand-700 text-sand-600' : 'border-sand-200 text-sand-400'}`}>{p.cat}</span>
            </div>
            <h2 className={`font-display text-xl md:text-2xl mb-2 group-hover:translate-x-1 transition-transform duration-200 ${dark ? 'text-sand-100' : 'text-sand-900'}`}>{p.title}</h2>
            <p className={`text-sm leading-relaxed font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{p.excerpt}</p>
            <p className={`text-[11px] tracking-[0.1em] uppercase mt-3 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>Read →</p>
          </motion.div>
        ))}
      </div>
    </Sec>
  )
}

/* ─── 3D PRINTS GALLERY ─────────────────────────────────────── */
function PrintsGallery({ dark, onClose }: { dark: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<typeof PRINTS[0] | null>(null)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ background: dark ? 'rgba(17,17,16,0.97)' : 'rgba(244,243,239,0.97)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-[860px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <p className={`text-[11px] tracking-[0.16em] uppercase font-body mb-2 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>Gallery</p>
            <h2 className={`font-display text-3xl md:text-4xl ${dark ? 'text-sand-50' : 'text-sand-900'}`}>3D Printed <span className="italic">&amp; Made</span></h2>
          </div>
          <button data-hover onClick={onClose}
            className={`flex-shrink-0 text-[11px] tracking-[0.12em] uppercase font-body border rounded-full px-4 py-2 transition-all duration-200 ${dark ? 'border-sand-700 text-sand-400 hover:text-sand-100 hover:border-sand-400' : 'border-sand-300 text-sand-500 hover:text-sand-800 hover:border-sand-600'}`}>
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PRINTS.map((pr, i) => (
            <motion.div key={pr.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              data-hover onClick={() => setSelected(pr)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 group ${dark ? 'bg-sand-900 border-sand-800 hover:border-sand-500' : 'bg-white border-sand-200 hover:border-sand-400'}`}>
              <div className={`h-36 md:h-40 overflow-hidden ${dark ? 'bg-sand-800' : 'bg-sand-100'}`}>
                {/* Replace with: <img src={pr.img} alt={pr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> */}
                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${dark ? 'text-sand-700' : 'text-sand-300'}`}>
                  <span className="text-xl">◆</span>
                  <span className="text-[9px] tracking-widest uppercase font-body">Add photo</span>
                </div>
              </div>
              <div className="p-4">
                <p className={`text-sm font-body mb-1 ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{pr.name}</p>
                <p className={`text-[10px] tracking-[0.06em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{pr.material}</p>
              </div>
            </motion.div>
          ))}
          <div className={`rounded-xl border border-dashed flex flex-col items-center justify-center h-[176px] ${dark ? 'border-sand-700 text-sand-700' : 'border-sand-300 text-sand-300'}`}>
            <span className="text-xl mb-2">+</span>
            <span className="text-[10px] tracking-widest uppercase font-body">Add part</span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-5 md:p-8"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`max-w-lg w-full rounded-2xl overflow-hidden ${dark ? 'bg-sand-900 border border-sand-700' : 'bg-white border border-sand-200'}`}>
              <div className={`h-48 md:h-56 ${dark ? 'bg-sand-800' : 'bg-sand-100'}`}>
                {/* <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" /> */}
                <div className={`w-full h-full flex items-center justify-center ${dark ? 'text-sand-700' : 'text-sand-300'}`}><span className="text-3xl">◆</span></div>
              </div>
              <div className="p-6 md:p-7">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-display text-xl md:text-2xl ${dark ? 'text-sand-50' : 'text-sand-900'}`}>{selected.name}</h3>
                  <button data-hover onClick={() => setSelected(null)} className={`text-lg ml-4 mt-0.5 flex-shrink-0 ${dark ? 'text-sand-600 hover:text-sand-300' : 'text-sand-300 hover:text-sand-600'}`}>✕</button>
                </div>
                <p className={`text-[10px] tracking-[0.1em] uppercase font-body mb-4 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{selected.material}</p>
                <p className={`text-sm leading-relaxed font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>{selected.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── PROJECTS ──────────────────────────────────────────────── */
function ProjectsSection({ dark }: { dark: boolean }) {
  const [showGallery, setShowGallery] = useState(false)
  return (
    <>
      <AnimatePresence>{showGallery && <PrintsGallery dark={dark} onClose={() => setShowGallery(false)} />}</AnimatePresence>
      <Sec>
        <Eyebrow dark={dark}>Projects</Eyebrow>
        <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-10 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>Things I've <span className="italic">made.</span></h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, duration: 0.42, ease: [0.23,1,0.32,1] as any }}
              whileHover={{ y: -3 }} data-hover
              onClick={() => p.gallery && setShowGallery(true)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-colors duration-200 ${dark ? 'bg-sand-900 border-sand-800 hover:border-sand-600' : 'bg-white border-sand-200 hover:border-sand-400'}`}>
              <div className={`h-40 md:h-44 ${dark ? 'bg-sand-800' : 'bg-sand-100'}`}>
                {/* Replace with: <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> */}
                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 font-body ${dark ? 'text-sand-700' : 'text-sand-300'}`}>
                  <span className="text-xl">◆</span>
                  <span className="text-[10px] tracking-widest uppercase">{p.gallery ? 'Tap to browse gallery' : 'Add photo'}</span>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className={`text-sm font-body leading-snug ${dark ? 'text-sand-100' : 'text-sand-900'}`}>{p.name}</h3>
                  <span className={`text-[9px] tracking-wide uppercase font-body flex-shrink-0 mt-0.5 ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{p.gallery ? '⊞' : '↗'}</span>
                </div>
                <p className={`text-xs leading-relaxed mb-3 font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map(tg => (
                    <span key={tg} className={`text-[9px] tracking-[0.06em] uppercase px-2 py-0.5 rounded font-body ${dark ? 'bg-sand-800 text-sand-500' : 'bg-sand-100 text-sand-400'}`}>{tg}</span>
                  ))}
                </div>
                <p className={`text-[10px] tracking-[0.08em] uppercase font-mono ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{p.stat}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Sec>
    </>
  )
}

/* ─── TRAINING ──────────────────────────────────────────────── */
function TrainingSection({ dark }: { dark: boolean }) {
  const disciplines = [
    { label: 'Swim',     icon: '◌', desc: 'Open water & pool sessions'  },
    { label: 'Bike',     icon: '◎', desc: 'Long road rides & intervals' },
    { label: 'Run',      icon: '◉', desc: 'Base building & brick runs'  },
    { label: 'Strength', icon: '◆', desc: 'Gym lifts & power work'      },
  ]
  return (
    <Sec>
      <Eyebrow dark={dark}>Training</Eyebrow>
      <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-4 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Gym &amp; <span className="italic">Ironman</span><br />Training.
      </h1>
      <p className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* TRAINING BIO: Replace this — your goal race, motivation, how long you've been at it. */}
        Chasing an Ironman finish line. I track every swim, bike, run, and lift — logging volume, intensity, and progress. Engineering meets endurance.
      </p>

      {/* Tracker link */}
      <motion.a href={GYM_TRACKER_URL} target="_blank" rel="noreferrer"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        data-hover
        className={`flex items-center gap-3 mb-12 px-5 py-4 rounded-xl border transition-all duration-200 group max-w-sm ${dark ? 'bg-sand-900 border-sand-700 hover:border-sand-500' : 'bg-white border-sand-200 hover:border-sand-500'}`}>
        <span className={`text-base flex-shrink-0 ${dark ? 'text-sand-400' : 'text-sand-400'}`}>⊞</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>Training Tracker</p>
          <p className={`text-[11px] font-body truncate ${dark ? 'text-sand-500' : 'text-sand-400'}`}>
            {GYM_TRACKER_URL === '#' ? 'Paste your sheet URL in Portfolio.tsx' : 'View full log →'}
          </p>
        </div>
        <span className={`text-sm flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${dark ? 'text-sand-600' : 'text-sand-400'}`}>→</span>
      </motion.a>

      {/* Disciplines */}
      <div className="mb-12">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Disciplines</p>
        <div className="grid grid-cols-2 gap-3">
          {disciplines.map((d, i) => (
            <motion.div key={d.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.07 }}
              className={`rounded-xl p-4 md:p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}>
              <span className={`text-lg mb-3 block ${dark ? 'text-sand-500' : 'text-sand-300'}`}>{d.icon}</span>
              <p className={`text-sm font-body mb-1 ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{d.label}</p>
              <p className={`text-xs font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Races */}
      <div>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Races</p>
        <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
          {RACES.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 + i * 0.08 }}
              className={`flex items-center justify-between py-4 border-b gap-3 ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
              <div className="min-w-0">
                <p className={`text-sm font-body truncate ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{r.name}</p>
                <p className={`text-xs mt-0.5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{r.date}</p>
              </div>
              <span className={`text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border flex-shrink-0 ${r.status === 'completed' ? (dark ? 'border-green-800 text-green-500' : 'border-green-300 text-green-600') : (dark ? 'border-sand-700 text-sand-500' : 'border-sand-200 text-sand-400')}`}>
                {r.status === 'completed' ? (r.time ?? 'Finished') : 'Upcoming'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Sec>
  )
}

/* ─── FOOTER ────────────────────────────────────────────────── */
function Footer({ dark }: { dark: boolean }) {
  return (
    <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
      <div className="max-w-[760px] mx-auto px-5 md:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className={`text-[11px] tracking-[0.1em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Arjun Dindigal · 2025</span>
        <div className="flex gap-5 flex-wrap">
          {[
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arjundindigal' },
            { label: 'Resume',   href: '/resume.pdf' },
            { label: 'Email',    href: 'mailto:adindiga@uwaterloo.ca' },
          ].map(l => (
            <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-hover
              className={`text-[11px] tracking-[0.1em] uppercase font-body nav-underline transition-colors duration-200 ${dark ? 'text-sand-600 hover:text-sand-300' : 'text-sand-400 hover:text-sand-700'}`}>
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
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const next = stored === 'dark' ? true : stored === 'light' ? false : prefersDark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }, [])

  const toggleDark = useCallback(() => {
    setDark(d => {
      const next = !d
      localStorage.setItem('theme', next ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }, [])

  return (
    <div className={`grain min-h-screen transition-colors duration-500 ${dark ? 'bg-sand-950 text-sand-100' : 'bg-sand-50 text-sand-900'}`}>
      <Cursor dark={dark} />
      <WaveCanvas dark={dark} />
      <Nav active={section} onNav={setSection} dark={dark} onToggleDark={toggleDark} />

      <AnimatePresence mode="wait">
        {section === 'home'     && <HomeSection     key="home"     dark={dark} />}
        {section === 'about'    && <AboutSection    key="about"    dark={dark} />}
        {section === 'writing'  && <WritingSection  key="writing"  dark={dark} />}
        {section === 'projects' && <ProjectsSection key="projects" dark={dark} />}
        {section === 'training' && <TrainingSection key="training" dark={dark} />}
      </AnimatePresence>

      <Footer dark={dark} />
    </div>
  )
}
