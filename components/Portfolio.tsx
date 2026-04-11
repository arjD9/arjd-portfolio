'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── DATA ─────────────────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 'linamar', initials: 'LN',
    title: 'Mechanical Design Engineer',
    company: 'Linamar Corporation', location: 'Guelph, ON', date: 'Jan 2026 – May 2026',
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
  {
    id: 'vex', name: 'Autonomous VEX Retrieval Bot',
    desc: 'PID navigation + sensor fusion achieving 98% turn accuracy and 92% object retrieval. 8+ custom manufactured components with a 15% weight reduction.',
    img: '/images/vex-bot.jpg', tags: ['C++', 'PID control', 'Sensor fusion', 'CAD'], stat: '98% accuracy', gallery: false,
  },
  {
    id: 'cart', name: 'Reverse Engineered Regress Cart',
    desc: 'Redesigned 100+ kg production cart. Reduced part count via DFMA, coordinated waterjet fabrication with full GD&T drawing package.',
    img: '/images/regress-cart.jpg', tags: ['Siemens NX', 'SolidWorks', 'DFMA', 'GD&T'], stat: '100+ kg validated', gallery: false,
  },
  {
    id: 'gauge', name: 'Runout Gauge',
    desc: 'Precision measurement tooling designed and fabricated for production. Rapid-prototyped and validated against tight tolerance requirements.',
    img: '/images/runout-gauge.jpg', tags: ['SolidWorks', 'FDM', 'Tolerance analysis'], stat: 'Production-deployed', gallery: false,
  },
  {
    id: 'stairs', name: 'Welded Stairs',
    desc: 'Designed and fabricated a full steel staircase from raw stock — cut, fitted, and welded to spec. Structural design with load-bearing validation.',
    img: '/images/welded-stairs.jpg', tags: ['Welding', 'Fabrication', 'Structural', 'Steel'], stat: 'Load-bearing built', gallery: false,
  },
  {
    id: 'prints', name: '3D Printed & Manufactured Parts',
    desc: 'A growing gallery of FDM/SLA and machined components. Click to browse each part with its description.',
    img: '/images/3dprints.jpg', tags: ['FDM', 'SLA', 'CNC', 'Fabrication'], stat: 'Growing library', gallery: true,
  },
]

// ── 3D PRINTS GALLERY ──────────────────────────────────────────
// TO ADD A PART: copy one object and fill in name, desc, img, material.
// Drop the image in public/images/prints/
const PRINTS = [
  { id: 'p1', name: 'Custom Enclosure',   desc: 'FDM-printed ABS enclosure for an electronics board. Designed for snap-fit assembly with ventilation slots and cable routing.', img: '/images/prints/enclosure.jpg',  material: 'ABS · FDM'  },
  { id: 'p2', name: 'Bracket Assembly',   desc: 'Structural bracket printed in PETG. Holds a camera rig on the rocketry test stand under vibration loads.',                    img: '/images/prints/bracket.jpg',    material: 'PETG · FDM' },
  { id: 'p3', name: 'Test Fixture Jig',   desc: 'SLA-printed jig for precise alignment of small components during assembly. Toleranced to ±0.1 mm.',                           img: '/images/prints/jig.jpg',        material: 'Resin · SLA'},
  { id: 'p4', name: 'Prototype Part',     desc: 'Rapid prototype for a production redesign — iterated through 3 versions before the final design was CNC machined.',            img: '/images/prints/prototype.jpg',  material: 'PLA · FDM'  },
  // ADD MORE PARTS HERE
]

const SKILLS = ['SolidWorks','Siemens NX','Fusion 360','FEA','GD&T','DFMA','C++','Python','MATLAB','ROS','RTOS','STM32','Arduino','Java','FastAPI','Git','CNC','FDM/SLA','Composites']

const POSTS = [
  { date: 'Coming soon', cat: 'Engineering', title: 'What I learned building test rigs at a rocketry team',  excerpt: "There's a gap between what a static fire looks like in CAD and what it looks like at 3 AM on a cold field." },
  { date: 'Coming soon', cat: 'Design',      title: 'Why DFMA should be taught in first year',               excerpt: "Every time a machinist asks 'what did they mean by this?' is a failure of the drawing." },
  { date: 'Coming soon', cat: 'Process',     title: 'PID from scratch: what the textbook skips',             excerpt: 'Implementing PID for the VEX bot taught me more in 3 weeks than a semester of controls.' },
]

// ── IRONMAN / GYM ──────────────────────────────────────────────
// Replace # with your actual Google Sheets or OneDrive share link
const GYM_TRACKER_URL = 'https://docs.google.com/spreadsheets/d/1n55fCkjTbq4fRDdX-duE-72flZUlar5hGinjMlM436Y/edit?usp=sharing'

// ADD completed races like: { name: 'Ironman 70.3 Muskoka', date: 'Aug 2026', status: 'completed', time: '5:34:12' }
const RACES: { name: string; date: string; status: 'upcoming' | 'completed'; time?: string }[] = [
  { name: 'Ironman 70.3 — goal race', date: 'TBD', status: 'upcoming' },
]

type Section = 'home' | 'about' | 'writing' | 'projects' | 'training'

/* ─── WAVE CANVAS ───────────────────────────────────────────── */
function WaveCanvas({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })
  const raf       = useRef<number>(0)
  const t         = useRef(0)
  const darkRef   = useRef(dark)
  useEffect(() => { darkRef.current = dark }, [dark])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const onMove = (e: MouseEvent) => { mouse.current.tx = e.clientX / canvas.width; mouse.current.ty = e.clientY / canvas.height }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      const m = mouse.current
      m.x += (m.tx - m.x) * 0.035; m.y += (m.ty - m.y) * 0.035
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      const isDark = darkRef.current
      const baseR = isDark ? 210 : 80, baseG = isDark ? 206 : 76, baseB = isDark ? 195 : 68
      const groups = [
        { count: 7, amp: [28, 18] as [number,number], freq: [0.0028, 0.0015] as [number,number], spd: [0.004, 0.002] as [number,number], alpha: [0.06, 0.05] as [number,number], lw: 0.8, mi: 20 },
        { count: 8, amp: [48, 28] as [number,number], freq: [0.0042, 0.0022] as [number,number], spd: [0.007, 0.003] as [number,number], alpha: [0.10, 0.07] as [number,number], lw: 1.0, mi: 45 },
        { count: 6, amp: [70, 35] as [number,number], freq: [0.0058, 0.003 ] as [number,number], spd: [0.011, 0.005] as [number,number], alpha: [0.14, 0.09] as [number,number], lw: 1.3, mi: 80 },
      ]
      let globalWi = 0
      for (const g of groups) {
        for (let wi = 0; wi < g.count; wi++) {
          const prog  = wi / Math.max(g.count - 1, 1)
          const yBase = H * (0.03 + prog * 0.94)
          const amp   = g.amp[0] + prog * g.amp[1] + m.y * 35
          const freq1 = g.freq[0] + prog * g.freq[1]
          const freq2 = freq1 * 1.618, freq3 = freq1 * 0.47
          const spd1  = g.spd[0] + prog * g.spd[1], spd2 = spd1 * 0.7, spd3 = spd1 * 1.4
          const alpha = g.alpha[0] + prog * g.alpha[1]
          const mxInf = g.mi * m.y
          ctx.beginPath()
          for (let x = 0; x <= W; x += 2) {
            const nx = x / W, dist = Math.abs(nx - m.x)
            const bump  = Math.exp(-dist * dist * 14) * mxInf
            const bump2 = Math.exp(-dist * dist * 3)  * mxInf * 0.3
            const phase = globalWi * 0.72
            const y = yBase
              + Math.sin(x * freq1 + t.current * spd1 + phase) * amp
              + Math.sin(x * freq2 + t.current * spd2 + phase * 1.3) * amp * 0.42
              + Math.sin(x * freq3 + t.current * spd3 + phase * 0.6) * amp * 0.25
              + bump + bump2
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.strokeStyle = `rgba(${baseR},${baseG},${baseB},${alpha})`
          ctx.lineWidth = g.lw
          ctx.stroke()
          globalWi++
        }
      }
      t.current++
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.85 }} />
}

/* ─── CURSOR ────────────────────────────────────────────────── */
function Cursor({ dark }: { dark: boolean }) {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: 0, y: 0, rx: 0, ry: 0 })
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
      p.rx += (p.x - p.rx) * 0.12; p.ry += (p.y - p.ry) * 0.12
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
      <div ref={dotRef}  className="cursor-dot"  style={{ background: color }} />
      <div ref={ringRef} className="cursor-ring" style={{ borderColor: color }} />
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

function Nav({ active, onNav, dark, onToggleDark }: { active: Section; onNav: (s: Section) => void; dark: boolean; onToggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h) }, [])
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.23,1,0.32,1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? (dark ? 'bg-sand-950/80 backdrop-blur-md' : 'bg-sand-50/80 backdrop-blur-md') : 'bg-transparent'}`}>
      <div className="max-w-[860px] mx-auto px-8 flex items-center justify-between py-6">
        <button onClick={() => onNav('home')} data-hover className={`font-display text-lg tracking-wide transition-opacity hover:opacity-60 ${dark ? 'text-sand-100' : 'text-sand-900'}`}>AD</button>
        <div className="flex items-center gap-5">
          {NAVITEMS.map(n => (
            <button key={n.id} data-hover onClick={() => onNav(n.id)}
              className={`nav-underline text-[11px] tracking-[0.12em] uppercase font-body transition-colors duration-200 ${active === n.id ? (dark ? 'text-sand-100 active' : 'text-sand-900 active') : (dark ? 'text-sand-500 hover:text-sand-200' : 'text-sand-500 hover:text-sand-700')}`}>
              {n.label}
            </button>
          ))}
          <button data-hover onClick={onToggleDark}
            className={`text-[11px] tracking-[0.1em] uppercase border rounded-full px-4 py-1.5 transition-all duration-300 ${dark ? 'border-sand-700 text-sand-400 hover:text-sand-100 hover:border-sand-400' : 'border-sand-300 text-sand-500 hover:text-sand-800 hover:border-sand-600'}`}>
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

/* ─── HELPERS ───────────────────────────────────────────────── */
function Sec({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.23,1,0.32,1] }}
      className="max-w-[760px] mx-auto px-8 pt-36 pb-24 min-h-screen">
      {children}
    </motion.div>
  )
}
function Eyebrow({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return <p className={`text-[11px] tracking-[0.18em] uppercase font-body mb-7 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{children}</p>
}

/* ─── HOME ──────────────────────────────────────────────────── */
function HomeSection({ dark }: { dark: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const s = (i: number) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:i*0.1,ease:[0.23,1,0.32,1] as any} })
  return (
    <Sec>
      <motion.div {...s(0)}>
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          <span className={`text-xs tracking-[0.08em] font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>Mechatronics Engineering · University of Waterloo</span>
        </div>
        <Eyebrow dark={dark}>Engineer &amp; Builder</Eyebrow>
      </motion.div>
      <motion.h1 {...s(1)} className={`font-display text-5xl md:text-6xl leading-[1.1] mb-6 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Arjun Dindigal.<br /><span className={`italic ${dark ? 'text-sand-400' : 'text-sand-400'}`}>Building things</span><br />that move, compute,<br />and last.
      </motion.h1>
      <motion.p {...s(2)} className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* BIO: Replace this with your own words. */}
        Mechatronics student at Waterloo with hands-on experience in mechanical design, software, and systems that bridge both worlds. I care about making things that actually work.
      </motion.p>
      <motion.div {...s(3)} className="flex flex-wrap gap-2 mb-20">
        {SKILLS.map((sk, i) => (
          <motion.span key={sk} initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} transition={{delay:0.3+i*0.03,duration:0.3}}
            className={`shimmer-tag text-[10px] tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border font-body transition-all duration-200 cursor-default ${dark ? 'border-sand-700 text-sand-500 hover:text-sand-200 hover:border-sand-500' : 'border-sand-200 text-sand-400 hover:text-sand-700 hover:border-sand-400'}`}>
            {sk}
          </motion.span>
        ))}
      </motion.div>
      <motion.div {...s(4)}>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Experience</p>
        <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
          {EXPERIENCES.map((exp, i) => (
            <motion.div key={exp.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.5+i*0.1,duration:0.4}} className={`border-b ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
              <button data-hover onClick={() => setOpenId(openId === exp.id ? null : exp.id)}
                className={`w-full flex items-start gap-4 py-5 text-left transition-all duration-200 rounded-sm ${dark ? 'hover:bg-sand-900' : 'hover:bg-sand-50'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-body tracking-wider flex-shrink-0 border font-medium ${dark ? 'bg-sand-800 border-sand-700 text-sand-400' : 'bg-sand-100 border-sand-200 text-sand-500'}`}>{exp.initials}</div>
                <div className="flex-1">
                  <div className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{exp.title}</div>
                  <div className={`text-xs mt-0.5 font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{exp.company} · {exp.location}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">{exp.tags.map(tg => <span key={tg} className={`text-[9px] tracking-[0.07em] uppercase px-2 py-0.5 rounded-full border font-body ${dark ? 'border-sand-700 text-sand-600' : 'border-sand-200 text-sand-400'}`}>{tg}</span>)}</div>
                </div>
                <div className={`text-xs mt-0.5 mr-1 flex-shrink-0 font-body transition-transform duration-300 ${openId === exp.id ? 'rotate-180' : ''} ${dark ? 'text-sand-600' : 'text-sand-400'}`}>&#8964;</div>
              </button>
              <div className={`drawer ${openId === exp.id ? 'open' : ''}`}>
                <div className="drawer-inner">
                  <ul className={`pb-5 pl-14 pr-4 space-y-2 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="text-[12.5px] leading-relaxed flex gap-2">
                        <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${dark ? 'bg-sand-600' : 'bg-sand-300'}`} />{b}
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
      <h1 className={`font-display text-5xl leading-[1.15] mb-6 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>Engineer at heart,<br /><span className="italic">builder by habit.</span></h1>
      <p className={`text-sm leading-relaxed max-w-md mb-12 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* ABOUT BIO: Replace this. */}
        I'm Arjun — a Mechatronics Engineering student at Waterloo who loves the full loop from concept to physical thing. I'm most at home when design, fabrication, and code all have to talk to each other.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-12">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08,duration:0.4}}
            className={`rounded-xl p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}>
            <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{c.label}</p>
            <p className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{c.value}</p>
            <p className={`text-xs mt-0.5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{c.sub}</p>
          </motion.div>
        ))}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.32}}
          className={`col-span-2 rounded-xl p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}>
          <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Full Toolkit</p>
          <p className={`text-xs leading-relaxed font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>SolidWorks · Siemens NX · Fusion 360 · FEA · GD&T · DFMA · C++ · Python · MATLAB · ROS · RTOS · STM32 · Arduino · Java · FastAPI · Git · CNC (mill/lathe) · FDM/SLA · Composites</p>
        </motion.div>
      </div>
      <div className="mb-12">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Photos</p>
        <div className="grid grid-cols-3 gap-2.5">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className={`aspect-square rounded-xl overflow-hidden border ${dark ? 'bg-sand-800 border-sand-700' : 'bg-sand-100 border-sand-200'}`}>
              {/* Replace with: <img src={`/images/photo${n}.jpg`} alt="" className="w-full h-full object-cover" /> */}
              <div className={`w-full h-full flex items-center justify-center text-[10px] tracking-widest uppercase font-body ${dark ? 'text-sand-700' : 'text-sand-300'}`}>Photo {n}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Interests</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((item, i) => (
            <motion.span key={item} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.05}}
              className={`text-xs px-4 py-2 rounded-full border font-body ${dark ? 'bg-sand-800 border-sand-700 text-sand-400' : 'bg-sand-100 border-sand-200 text-sand-500'}`}>
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
      <h1 className={`font-display text-5xl leading-[1.15] mb-12 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>Thinking <span className="italic">in public.</span></h1>
      <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
        {POSTS.map((p, i) => (
          <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.12}} data-hover
            className={`border-b py-8 group cursor-pointer transition-all duration-200 rounded-sm ${dark ? 'border-sand-800 hover:bg-sand-900' : 'border-sand-200 hover:bg-sand-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[10px] tracking-[0.1em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{p.date}</span>
              <span className={`text-[9px] tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full border font-body ${dark ? 'border-sand-700 text-sand-600' : 'border-sand-200 text-sand-400'}`}>{p.cat}</span>
            </div>
            <h2 className={`font-display text-2xl mb-2.5 group-hover:translate-x-1 transition-transform duration-200 ${dark ? 'text-sand-100' : 'text-sand-900'}`}>{p.title}</h2>
            <p className={`text-sm leading-relaxed font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{p.excerpt}</p>
            <p className={`text-[11px] tracking-[0.1em] uppercase mt-4 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>Read →</p>
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
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ background: dark ? 'rgba(17,17,16,0.97)' : 'rgba(244,243,239,0.97)', backdropFilter:'blur(12px)' }}>
      <div className="max-w-[900px] mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className={`text-[11px] tracking-[0.16em] uppercase font-body mb-2 ${dark ? 'text-sand-500' : 'text-sand-400'}`}>Gallery</p>
            <h2 className={`font-display text-4xl ${dark ? 'text-sand-50' : 'text-sand-900'}`}>3D Printed <span className="italic">&amp; Made</span></h2>
          </div>
          <button data-hover onClick={onClose}
            className={`text-[11px] tracking-[0.12em] uppercase font-body border rounded-full px-5 py-2 transition-all duration-200 ${dark ? 'border-sand-700 text-sand-400 hover:text-sand-100 hover:border-sand-400' : 'border-sand-300 text-sand-500 hover:text-sand-800 hover:border-sand-600'}`}>
            ← Back
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PRINTS.map((pr, i) => (
            <motion.div key={pr.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              data-hover onClick={() => setSelected(pr)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 group ${dark ? 'bg-sand-900 border-sand-800 hover:border-sand-500' : 'bg-white border-sand-200 hover:border-sand-400'}`}>
              <div className={`h-40 overflow-hidden ${dark ? 'bg-sand-800' : 'bg-sand-100'}`}>
                {/* Replace with: <img src={pr.img} alt={pr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> */}
                <div className={`w-full h-full flex items-center justify-center flex-col gap-2 ${dark ? 'text-sand-700' : 'text-sand-300'}`}>
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
          <div className={`rounded-xl border border-dashed flex flex-col items-center justify-center h-[200px] ${dark ? 'border-sand-700 text-sand-700' : 'border-sand-300 text-sand-300'}`}>
            <span className="text-2xl mb-2">+</span>
            <span className="text-[10px] tracking-widest uppercase font-body">Add part</span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[300] flex items-center justify-center p-8"
            style={{background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)'}}
            onClick={() => setSelected(null)}>
            <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}
              onClick={e => e.stopPropagation()}
              className={`max-w-lg w-full rounded-2xl overflow-hidden ${dark ? 'bg-sand-900 border border-sand-700' : 'bg-white border border-sand-200'}`}>
              <div className={`h-56 ${dark ? 'bg-sand-800' : 'bg-sand-100'}`}>
                {/* <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" /> */}
                <div className={`w-full h-full flex items-center justify-center ${dark ? 'text-sand-700' : 'text-sand-300'}`}><span className="text-3xl">◆</span></div>
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-display text-2xl ${dark ? 'text-sand-50' : 'text-sand-900'}`}>{selected.name}</h3>
                  <button data-hover onClick={() => setSelected(null)} className={`text-lg ml-4 ${dark ? 'text-sand-600 hover:text-sand-300' : 'text-sand-300 hover:text-sand-600'}`}>✕</button>
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
        <h1 className={`font-display text-5xl leading-[1.15] mb-12 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>Things I've <span className="italic">made.</span></h1>
        <div className="grid grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => (
            <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1,duration:0.45,ease:[0.23,1,0.32,1] as any}}
              whileHover={{y:-4}} data-hover onClick={() => p.gallery && setShowGallery(true)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-colors duration-200 ${dark ? 'bg-sand-900 border-sand-800 hover:border-sand-600' : 'bg-white border-sand-200 hover:border-sand-400'}`}>
              <div className={`proj-img h-44 ${dark ? 'bg-sand-800' : 'bg-sand-100'}`}>
                {/* Replace with: <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> */}
                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 font-body ${dark ? 'text-sand-700' : 'text-sand-300'}`}>
                  <span className="text-2xl">◆</span>
                  <span className="text-[10px] tracking-widest uppercase">{p.gallery ? 'Click to browse' : 'Add photo'}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-sm font-body ${dark ? 'text-sand-100' : 'text-sand-900'}`}>{p.name}</h3>
                  <span className={`text-[9px] tracking-wide uppercase font-body ml-2 flex-shrink-0 ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{p.gallery ? '⊞ Gallery' : '↗'}</span>
                </div>
                <p className={`text-xs leading-relaxed mb-4 font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">{p.tags.map(tg => <span key={tg} className={`text-[9px] tracking-[0.06em] uppercase px-2 py-0.5 rounded font-body ${dark ? 'bg-sand-800 text-sand-500' : 'bg-sand-100 text-sand-400'}`}>{tg}</span>)}</div>
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
      <h1 className={`font-display text-5xl leading-[1.15] mb-4 ${dark ? 'text-sand-50' : 'text-sand-900'}`}>
        Gym &amp; <span className="italic">Ironman</span><br />Training.
      </h1>
      <p className={`text-sm leading-relaxed max-w-md mb-12 font-body ${dark ? 'text-sand-400' : 'text-sand-500'}`}>
        {/* TRAINING BIO: Replace this — your goal race, how long you've been at it, what drives you. */}
        Chasing an Ironman finish line. I track every swim, bike, run, and lift — logging volume, intensity, and progress over time. Engineering meets endurance.
      </p>

      {/* Tracker link */}
      <motion.a href={GYM_TRACKER_URL} target="_blank" rel="noreferrer"
        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
        data-hover
        className={`inline-flex items-center gap-3 mb-16 px-6 py-4 rounded-xl border transition-all duration-200 group w-full max-w-sm ${dark ? 'bg-sand-900 border-sand-700 hover:border-sand-500' : 'bg-white border-sand-200 hover:border-sand-500'}`}>
        <span className={`text-lg ${dark ? 'text-sand-400' : 'text-sand-400'}`}>⊞</span>
        <div className="flex-1">
          <p className={`text-sm font-body ${dark ? 'text-sand-200' : 'text-sand-800'}`}>Training Tracker</p>
          <p className={`text-[11px] tracking-[0.06em] font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>
          </p>
        </div>
        <span className={`text-sm transition-transform duration-200 group-hover:translate-x-1 ${dark ? 'text-sand-600' : 'text-sand-400'}`}>→</span>
      </motion.a>

      {/* Disciplines */}
      <div className="mb-14">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Disciplines</p>
        <div className="grid grid-cols-2 gap-3">
          {disciplines.map((d, i) => (
            <motion.div key={d.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.07}}
              className={`rounded-xl p-5 border ${dark ? 'bg-sand-900 border-sand-800' : 'bg-white border-sand-200'}`}>
              <span className={`text-xl mb-3 block ${dark ? 'text-sand-500' : 'text-sand-300'}`}>{d.icon}</span>
              <p className={`text-sm font-body mb-1 ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{d.label}</p>
              <p className={`text-xs font-body ${dark ? 'text-sand-500' : 'text-sand-400'}`}>{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Races */}
      <div>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-5 font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Races</p>
        <div className={`border-t ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
          {RACES.map((r, i) => (
            <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.08}}
              className={`flex items-center justify-between py-5 border-b font-body ${dark ? 'border-sand-800' : 'border-sand-200'}`}>
              <div>
                <p className={`text-sm ${dark ? 'text-sand-200' : 'text-sand-800'}`}>{r.name}</p>
                <p className={`text-xs mt-0.5 ${dark ? 'text-sand-600' : 'text-sand-400'}`}>{r.date}</p>
              </div>
              <span className={`text-[10px] tracking-[0.1em] uppercase px-3 py-1 rounded-full border ${r.status === 'completed' ? (dark ? 'border-green-800 text-green-500' : 'border-green-300 text-green-600') : (dark ? 'border-sand-700 text-sand-500' : 'border-sand-200 text-sand-400')}`}>
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
      <div className="max-w-[760px] mx-auto px-8 py-10 flex items-center justify-between">
        <span className={`text-[11px] tracking-[0.1em] uppercase font-body ${dark ? 'text-sand-600' : 'text-sand-400'}`}>Arjun Dindigal · 2025</span>
        <div className="flex gap-6">
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

  // Read stored/system preference on mount only — avoids SSR mismatch
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = stored === 'dark' ? true : stored === 'light' ? false : prefersDark
    setDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
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
