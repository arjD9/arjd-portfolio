'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── DATA ──────────────────────────────────────────────────── */

// Skill → section mapping for click-to-navigate
const SKILL_SECTIONS: Record<string, string> = {
  'SolidWorks':'projects','Siemens NX':'projects','Fusion 360':'projects',
  'FEA':'projects','GD&T':'projects','DFMA':'projects',
  'C++':'projects','Python':'projects','MATLAB':'projects',
  'ROS':'projects','RTOS':'projects','STM32':'projects','Arduino':'projects',
  'Java':'projects','FastAPI':'projects','Git':'projects',
  'CNC':'projects','FDM/SLA':'projects','Composites':'projects',
}

// Experience logos — add /images/ paths after uploading
const EXP_LOGOS: Record<string, string> = {
  rocketry: '/images/logo-rocketry.png',
  linamar:  '/images/logo-linamar.png',
  pratyin:  '/images/logo-pratyin.png',
}

const EXPERIENCES = [
  { id:'rocketry', initials:'WR', title:'Mechanical Engineer',         company:'Waterloo Rocketry',           location:'Waterloo, ON', date:'Aug 2025 – Present',  tags:['Test fixtures','3D printing','Propulsion','Telemetry'], bullets:['Built test fixtures and camera systems for 10+ static engine tests with real-time telemetry.','Designed 3D-printed enclosures and support structures for harsh testing environments.','Assembled and calibrated propulsion systems within 5% of predicted thrust.'] },
  { id:'linamar',  initials:'LN', title:'Mechanical Design Engineer',  company:'Linamar Corporation',         location:'Guelph, ON',   date:'Jan 2026 – May 2026', tags:['SolidWorks','GD&T','DFMA','FEA','FDM/SLA'],            bullets:['Designed & validated 10+ production fixtures using SolidWorks with GD&T and DFMA principles.','Cut cycle times 20–40 s/op through fixture & ergonomics redesigns with machinists.','Reverse engineered failed robotic components; produced CAD models and fabricated replacements.','Reduced defective parts by 10%+ through fixture redesigns and optimised part handling.','Full concept → CAD → fabrication → validation ownership deployed on shop floor.'] },
  { id:'pratyin',  initials:'PI', title:'Software Development Intern', company:'Pratyin Infotech Consulting', location:'Toronto, ON',  date:'May 2025 – Aug 2025', tags:['Java','FastAPI','Python','Agile'],                      bullets:['Java + FastAPI integration syncing 5,000+ invoices with 99.7% accuracy.','Automated Python data pipelines processing 200,000 records/month, cutting manual work by 20%.','Shipped 2 production-ready features in 2 months, zero critical bugs deployed.'] },
]

const PROJECTS = [
  {
    id:'vex', name:'Autonomous VEX Retrieval Bot',
    desc:'PID navigation + sensor fusion — 98% turn accuracy, 92% object retrieval. 8+ custom components, 15% weight reduction.',
    detail:'Built for a competitive robotics challenge. Implemented C++ PID loops with encoder feedback and ultrasonic sensor fusion. Designed and machined 8 custom aluminium and polycarbonate components to reduce system weight by 15% while maintaining structural integrity. Achieved 98% turn accuracy and 92% successful object retrievals over 50+ test runs, completing autonomous cycles in 40–45 seconds with ±1 second deviation.',
    img:'/images/vex-bot.jpg', tags:['C++','PID','Sensor fusion','CAD'], stat:'98% accuracy', gallery:false,
  },
  {
    id:'cart', name:'Reverse Engineered Regress Cart',
    desc:'Redesigned 100+ kg production cart. Reduced part count via DFMA, coordinated waterjet fabrication with full GD&T drawings.',
    detail:'Reverse engineered an existing setup technician cart at Linamar. Applied DFMA principles to eliminate unnecessary fasteners and reduce part count. Generated a complete GD&T drawing package and coordinated waterjet fabrication directly with machinists. Assembled and load-validated the final 100+ kg cart, improving setup efficiency and reducing cycle time on the production floor.',
    img:'/images/regress-cart.jpg', tags:['Siemens NX','SolidWorks','DFMA','GD&T'], stat:'100+ kg validated', gallery:false,
  },
  {
    id:'gauge', name:'Runout Gauge',
    desc:'Precision measurement tooling designed and fabricated for production. Validated against tight tolerance requirements.',
    detail:'Designed a custom runout gauge for in-process quality inspection on the shop floor at Linamar. Modelled in SolidWorks, rapid-prototyped in FDM for fit-check, then machined in aluminium. Validated measurement repeatability against coordinate measuring machine (CMM) data. Deployed into production use, reducing inspection time per part.',
    img:'/images/runout-gauge.jpg', tags:['SolidWorks','FDM','Tolerance analysis'], stat:'Production-deployed', gallery:false,
  },
  {
    id:'stairs', name:'Welded Stairs',
    desc:'Full steel staircase from raw stock — cut, fitted, and welded to spec. Structural design with load-bearing validation.',
    detail:'Designed, cut, fitted and welded a full steel staircase from raw stock. Laid out stringer geometry and tread brackets from first principles, cut members on a band saw, and MIG-welded the assembly. Performed load-bearing validation by test-loading above design spec. Finished with primer and paint. A hands-on project that sharpened both fabrication skills and structural intuition.',
    img:'/images/welded-stairs.jpg', tags:['Welding','Fabrication','Structural','Steel'], stat:'Load-bearing built', gallery:false,
  },
  {
    id:'prints', name:'3D Printed & Manufactured Parts',
    desc:'A growing gallery of FDM/SLA and machined components. Tap to browse each part with its description.',
    detail:'An ongoing collection of parts designed and made across different projects — enclosures, jigs, brackets, and custom hardware. Materials range from PLA and ABS to engineering-grade PETG and SLA resin. Each part represents a specific design challenge: snap-fit tolerances, vibration resistance, or tight dimensional accuracy. Click the gallery button to browse individual pieces.',
    img:'/images/3dprints.jpg', tags:['FDM','SLA','CNC','Fabrication'], stat:'Growing library', gallery:true,
  },
]

const PRINTS = [
  { id:'p1', name:'Custom Enclosure',  desc:'FDM-printed ABS enclosure for an electronics board. Snap-fit assembly with ventilation slots and cable routing.', img:'/images/prints/enclosure.jpg',  material:'ABS · FDM'   },
  { id:'p2', name:'Bracket Assembly',  desc:'Structural PETG bracket holding a camera rig on the rocketry test stand under vibration loads.',                  img:'/images/prints/bracket.jpg',    material:'PETG · FDM'  },
  { id:'p3', name:'Test Fixture Jig',  desc:'SLA-printed jig for precise alignment during assembly. Toleranced to ±0.1 mm.',                                    img:'/images/prints/jig.jpg',        material:'Resin · SLA' },
  { id:'p4', name:'Prototype Part',    desc:'Rapid prototype for a production redesign — 3 iterations before the final design was CNC machined.',               img:'/images/prints/prototype.jpg',  material:'PLA · FDM'   },
]

const SKILLS = ['SolidWorks','Siemens NX','Fusion 360','FEA','GD&T','DFMA','C++','Python','MATLAB','ROS','RTOS','STM32','Arduino','Java','FastAPI','Git','CNC','FDM/SLA','Composites']

// ONE real post — 1A term. Add your writing between the backtick markers.
const WRITING_POST = {
  id: '1a',
  title: 'My 1A Term',
  date: 'April 2026',
  cat: 'Reflection',
  // ADD YOUR WRITING HERE — plain paragraphs, separated by \n\n
  content: `Add your writing here. Each paragraph separated by a blank line will render as its own paragraph.

You can write as much or as little as you want. This is your space to reflect on your first term at Waterloo — what surprised you, what you learned, what you're looking forward to.

Reflecting on my 1A Term`,
}

const GYM_TRACKER_URL = 'https://docs.google.com/spreadsheets/d/1n55fCkjTbq4fRDdX-duE-72flZUlar5hGinjMlM436Y/view?usp=sharing'
const STRAVA_URL      = 'https://www.strava.com/athletes/arjundindigal'
const GARMIN_URL      = 'https://connect.garmin.com'
const SPOTIFY_URL     = 'https://open.spotify.com/user/arjundindigal?si=d149e66474c34a82'
const RACES: { name:string; date:string; status:'upcoming'|'completed'; time?:string }[] = [
  { name:'Ironman 70.3 — goal race', date:'TBD', status:'upcoming' },
]

type Section = 'home'|'about'|'writing'|'projects'|'training'|'connect'

/* ─── WAVE CANVAS ───────────────────────────────────────────── */
function WaveCanvas({ dark }: { dark:boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x:0.5, y:0.5, tx:0.5, ty:0.5 })
  const raf       = useRef<number>(0)
  const t         = useRef(0)
  const darkRef   = useRef(dark)
  useEffect(()=>{ darkRef.current = dark },[dark])

  useEffect(()=>{
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const resize = ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const onMove  = (e:MouseEvent)=>{ mouse.current.tx=e.clientX/canvas.width; mouse.current.ty=e.clientY/canvas.height }
    const onTouch = (e:TouchEvent)=>{ if(e.touches[0]){ mouse.current.tx=e.touches[0].clientX/canvas.width; mouse.current.ty=e.touches[0].clientY/canvas.height } }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, {passive:true})

    // 3 clean slow swells — understated, just enough
    const SWELLS = [
      { yFrac:0.42, amp:55, freq:0.00090, spd:0.0018, phase:0.0 },
      { yFrac:0.62, amp:45, freq:0.00115, spd:0.0024, phase:1.8 },
      { yFrac:0.80, amp:35, freq:0.00140, spd:0.0030, phase:3.4 },
    ]

    const draw = ()=>{
      const m = mouse.current
      m.x += (m.tx - m.x)*0.035
      m.y += (m.ty - m.y)*0.035
      const W=canvas.width, H=canvas.height
      ctx.clearRect(0,0,W,H)
      const isDark = darkRef.current

      SWELLS.forEach((sw)=>{
        const lift  = (m.y - 0.5) * 110
        const yBase = H * sw.yFrac + lift

        const pts:[number,number][] = []
        for(let x=0; x<=W; x+=5){
          const nx   = x/W
          const pull = Math.exp(-Math.pow(nx - m.x, 2)*8) * m.y * 70
          const y    = yBase
            + Math.sin(x*sw.freq + t.current*sw.spd + sw.phase)*sw.amp
            + Math.sin(x*sw.freq*2.1 + t.current*sw.spd*0.6 + sw.phase)*sw.amp*0.28
            - pull
          pts.push([x,y])
        }

        // Filled swell — very faint
        ctx.beginPath()
        ctx.moveTo(0,H)
        pts.forEach(([x,y])=>ctx.lineTo(x,y))
        ctx.lineTo(W,H); ctx.closePath()
        ctx.fillStyle = isDark ? 'rgba(90,115,175,0.028)' : 'rgba(130,100,55,0.022)'
        ctx.fill()

        // Single clean crest — one line, no noise
        ctx.beginPath()
        pts.forEach(([x,y],i)=> i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y))
        ctx.strokeStyle = isDark ? 'rgba(150,175,225,0.18)' : 'rgba(120,90,45,0.15)'
        ctx.lineWidth   = 1
        ctx.lineJoin    = 'round'
        ctx.stroke()
      })

      t.current++
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return ()=>{
      window.removeEventListener('resize',resize)
      window.removeEventListener('mousemove',onMove)
      window.removeEventListener('touchmove',onTouch)
      cancelAnimationFrame(raf.current)
    }
  },[])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0"/>
}

/* ─── CURSOR ────────────────────────────────────────────────── */
function Cursor({ dark }:{ dark:boolean }) {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({x:-100,y:-100,rx:-100,ry:-100})
  const raf     = useRef<number>(0)
  const hov     = useRef(false)
  useEffect(()=>{
    const onMove=(e:MouseEvent)=>{ pos.current.x=e.clientX; pos.current.y=e.clientY; hov.current=!!document.elementFromPoint(e.clientX,e.clientY)?.closest('button,a,[data-hover]') }
    window.addEventListener('mousemove',onMove)
    const tick=()=>{
      const p=pos.current; p.rx+=(p.x-p.rx)*0.14; p.ry+=(p.y-p.ry)*0.14
      if(dotRef.current)  dotRef.current.style.transform =`translate(${p.x-4}px,${p.y-4}px)`
      if(ringRef.current){ ringRef.current.style.transform=`translate(${p.rx-18}px,${p.ry-18}px)`; ringRef.current.classList.toggle('hovered',hov.current) }
      raf.current=requestAnimationFrame(tick)
    }; tick()
    return ()=>{ window.removeEventListener('mousemove',onMove); cancelAnimationFrame(raf.current) }
  },[])
  const c = dark?'#c8c4bc':'#2a2520'
  return (<><div ref={dotRef} className="cursor-dot hidden md:block" style={{background:c}}/><div ref={ringRef} className="cursor-ring hidden md:block" style={{borderColor:c}}/></>)
}

/* ─── NAV ───────────────────────────────────────────────────── */
const NAVITEMS:{label:string;id:Section}[] = [
  {label:'Home',id:'home'},{label:'About',id:'about'},{label:'Writing',id:'writing'},
  {label:'Projects',id:'projects'},{label:'Training',id:'training'},{label:'Connect',id:'connect'},
]

function Nav({active,onNav,dark,onToggleDark}:{active:Section;onNav:(s:Section)=>void;dark:boolean;onToggleDark:()=>void}) {
  const [scrolled,setScrolled] = useState(false)
  const [menuOpen,setMenuOpen] = useState(false)
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>20); window.addEventListener('scroll',h); return ()=>window.removeEventListener('scroll',h) },[])
  const go=(id:Section)=>{ onNav(id); setMenuOpen(false) }
  const bg = scrolled||menuOpen ? (dark?'bg-[#0d0f15]/92 backdrop-blur-md':'bg-[#f5f0e8]/92 backdrop-blur-md') : 'bg-transparent'
  return (
    <motion.nav initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6,ease:[0.23,1,0.32,1]}}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bg}`}>
      <div className="max-w-[920px] mx-auto px-5 md:px-8 flex items-center justify-between py-5 md:py-6">
        <button onClick={()=>go('home')} data-hover className={`font-display text-lg tracking-wide transition-opacity hover:opacity-50 ${dark?'text-slate-100':'text-stone-900'}`}>AD</button>
        <div className="hidden md:flex items-center gap-5">
          {NAVITEMS.map(n=>(
            <button key={n.id} data-hover onClick={()=>go(n.id)}
              className={`nav-underline text-[11px] tracking-[0.12em] uppercase font-body transition-colors duration-200 ${active===n.id?(dark?'text-slate-100 active':'text-stone-900 active'):(dark?'text-slate-500 hover:text-slate-200':'text-stone-400 hover:text-stone-700')}`}>
              {n.label}
            </button>
          ))}
          <button data-hover onClick={onToggleDark}
            className={`text-[11px] tracking-[0.1em] uppercase border rounded-full px-4 py-1.5 transition-all duration-300 ${dark?'border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-400':'border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-600'}`}>
            {dark?'Light':'Dark'}
          </button>
        </div>
        <div className="flex md:hidden items-center gap-3">
          <button onClick={onToggleDark} className={`text-[10px] tracking-[0.1em] uppercase border rounded-full px-3 py-1.5 ${dark?'border-slate-600 text-slate-300 bg-slate-900/60':'border-stone-400 text-stone-600 bg-white/60'}`}>
            {dark?'Light':'Dark'}
          </button>
          <button onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu"
            className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${menuOpen?(dark?'border-slate-400 bg-slate-800':'border-stone-500 bg-stone-100'):(dark?'border-slate-600 bg-slate-900/60':'border-stone-300 bg-white/60')}`}>
            {[{o:{x:-1,y:-1,r:45},c:{x:-3.5,y:-3.5}},{o:{x:1,y:-1,r:-45},c:{x:3.5,y:-3.5}},{o:{x:-1,y:1,r:-45},c:{x:-3.5,y:3.5}},{o:{x:1,y:1,r:45},c:{x:3.5,y:3.5}}].map((dot,i)=>(
              <motion.span key={i} animate={menuOpen?{x:dot.o.x*5.5,y:dot.o.y*5.5,rotate:dot.o.r,scale:1.15}:{x:dot.c.x,y:dot.c.y,rotate:0,scale:1}} transition={{duration:0.35,ease:[0.23,1,0.32,1],delay:i*0.03}}
                className={`absolute w-1.5 h-1.5 rounded-full ${menuOpen?(dark?'bg-slate-200':'bg-stone-700'):(dark?'bg-slate-400':'bg-stone-500')}`}/>
            ))}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen&&(
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.28,ease:[0.23,1,0.32,1]}}
            className={`md:hidden border-t ${dark?'border-slate-700 bg-[#0d0f15]':'border-stone-200 bg-[#f5f0e8]'}`}
            style={{boxShadow:dark?'0 8px 32px rgba(0,0,0,0.6)':'0 8px 32px rgba(0,0,0,0.08)'}}>
            <div className="px-4 py-3 flex flex-col">
              {NAVITEMS.map((n,i)=>(
                <motion.button key={n.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.04,duration:0.22}} onClick={()=>go(n.id)}
                  className={`flex items-center justify-between py-3.5 px-3 rounded-xl transition-all duration-150 group ${active===n.id?(dark?'bg-slate-800 text-slate-50':'bg-stone-200 text-stone-900'):(dark?'text-slate-300 hover:bg-slate-800/70 hover:text-slate-100':'text-stone-600 hover:bg-stone-100 hover:text-stone-900')}`}>
                  <span className="text-sm tracking-[0.1em] uppercase font-body">{n.label}</span>
                  <span className={`text-xs transition-transform duration-200 group-hover:translate-x-1 ${dark?'text-slate-600':'text-stone-400'}`}>→</span>
                </motion.button>
              ))}
              <div className={`mt-2 pt-3 border-t flex items-center justify-between px-3 ${dark?'border-slate-800':'border-stone-200'}`}>
                <span className={`text-[10px] tracking-[0.12em] uppercase font-body ${dark?'text-slate-600':'text-stone-400'}`}>Theme</span>
                <button onClick={onToggleDark} className={`text-[10px] tracking-[0.1em] uppercase border rounded-full px-4 py-1.5 font-body ${dark?'border-slate-600 text-slate-300':'border-stone-300 text-stone-500'}`}>{dark?'☀ Light':'◑ Dark'}</button>
              </div>
              <div className="h-3"/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ─── HELPERS ───────────────────────────────────────────────── */
function Sec({children}:{children:React.ReactNode}) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.45,ease:[0.23,1,0.32,1]}}
      className="max-w-[760px] mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-24 min-h-screen">
      {children}
    </motion.div>
  )
}
function Eyebrow({children,dark}:{children:React.ReactNode;dark:boolean}) {
  return <p className={`text-[11px] tracking-[0.18em] uppercase font-body mb-6 ${dark?'text-slate-500':'text-stone-400'}`}>{children}</p>
}
function Tag({children,dark}:{children:React.ReactNode;dark:boolean}) {
  return <span className={`text-[9px] tracking-[0.07em] uppercase px-2 py-0.5 rounded-full border font-body whitespace-nowrap ${dark?'border-slate-700 text-slate-500':'border-stone-200 text-stone-400'}`}>{children}</span>
}
function Card({children,dark,className=''}:{children:React.ReactNode;dark:boolean;className?:string}) {
  return <div className={`rounded-xl border p-4 md:p-5 ${dark?'bg-slate-900 border-slate-800':'bg-white/80 border-stone-200'} ${className}`}>{children}</div>
}

/* ─── HOME ──────────────────────────────────────────────────── */
function HomeSection({dark,onNav}:{dark:boolean;onNav:(s:Section)=>void}) {
  const [openId,setOpenId] = useState<string|null>(null)
  const s=(i:number)=>({initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:0.55,delay:i*0.09,ease:[0.23,1,0.32,1] as any}})

  const handleSkillClick = (skill:string)=>{
    const target = SKILL_SECTIONS[skill]
    if(target) onNav(target as Section)
  }

  return (
    <Sec>
      <motion.div {...s(0)}>
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow flex-shrink-0"/>
          <span className={`text-xs tracking-[0.07em] font-body ${dark?'text-slate-500':'text-stone-400'}`}>Mechatronics Engineering · University of Waterloo</span>
        </div>
        <Eyebrow dark={dark}>Engineer &amp; Athlete</Eyebrow>
      </motion.div>

      <motion.h1 {...s(1)} className={`font-display text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-5 ${dark?'text-slate-50':'text-stone-900'}`}>
        Arjun Dindigal.<br/>
        <span className={`italic ${dark?'text-slate-400':'text-stone-400'}`}>Always Building.</span><br/>
        Exploring Fall 2026<br/>opportunities.
      </motion.h1>

      <motion.p {...s(2)} className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark?'text-slate-400':'text-stone-500'}`}>
        Focused on robotics, mechanical systems, perception, and how intelligent systems interact
        with the physical world. Outside of work, I'm training for an Ironman 70.3, building
        consistency in the gym, and golfing regardless of the season.
      </motion.p>

      {/* Skills — clickable, navigate to relevant section */}
      <motion.div {...s(3)} className="mb-3">
        <p className={`text-[10px] tracking-[0.12em] uppercase mb-3 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Skills — tap to explore</p>
        <div className="flex flex-wrap gap-2 mb-14">
          {SKILLS.map((sk,i)=>(
            <motion.button key={sk} initial={{opacity:0,scale:0.88}} animate={{opacity:1,scale:1}} transition={{delay:0.28+i*0.025,duration:0.28}}
              onClick={()=>handleSkillClick(sk)}
              title={`View ${sk} in Projects`}
              className={`shimmer-tag text-[10px] tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border font-body transition-all duration-200 cursor-pointer ${dark?'border-slate-700 text-slate-500 hover:text-slate-100 hover:border-slate-400 hover:bg-slate-800':'border-stone-200 text-stone-400 hover:text-stone-800 hover:border-stone-500 hover:bg-stone-100'}`}>
              {sk}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Experience — with real logos */}
      <motion.div {...s(4)}>
        <div className="flex items-center gap-3 mb-6">
          <p className={`text-[11px] tracking-[0.18em] uppercase font-body ${dark?'text-slate-500':'text-stone-400'}`}>Experience</p>
          <div className={`flex-1 h-px ${dark?'bg-slate-800':'bg-stone-200'}`}/>
        </div>
        <div className="space-y-3">
          {EXPERIENCES.map((exp,i)=>(
            <motion.div key={exp.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.45+i*0.1,duration:0.38}}>
              <button data-hover onClick={()=>setOpenId(openId===exp.id?null:exp.id)}
                className={`w-full rounded-xl border px-4 py-4 text-left transition-all duration-200 ${openId===exp.id?(dark?'bg-slate-800 border-slate-600':'bg-white border-stone-300'):(dark?'bg-slate-900/80 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60':'bg-white/60 border-stone-200 hover:border-stone-300 hover:bg-white/90')}`}>
                <div className="flex items-center gap-3">
                  {/* Company logo */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border overflow-hidden ${dark?'bg-white border-slate-700':'bg-white border-stone-200'}`}>
                    <img src={EXP_LOGOS[exp.id]} alt={exp.company} className="w-8 h-8 object-contain"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`text-sm font-body font-medium ${dark?'text-slate-200':'text-stone-800'}`}>{exp.title}</div>
                      <span className={`text-xs flex-shrink-0 transition-transform duration-300 ${openId===exp.id?'rotate-180':''} ${dark?'text-slate-600':'text-stone-400'}`}>&#8964;</span>
                    </div>
                    <div className={`text-xs mt-0.5 font-body ${dark?'text-slate-500':'text-stone-400'}`}>{exp.company} · {exp.location}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">{exp.tags.map(tg=><Tag key={tg} dark={dark}>{tg}</Tag>)}</div>
                  </div>
                </div>
              </button>
              <div className={`drawer ${openId===exp.id?'open':''}`}>
                <div className="drawer-inner">
                  <div className={`mx-1 mt-1 rounded-xl border px-5 py-4 ${dark?'bg-slate-900 border-slate-800':'bg-stone-50 border-stone-200'}`}>
                    <ul className="space-y-2">
                      {exp.bullets.map((b,bi)=>(
                        <li key={bi} className={`text-[12.5px] leading-relaxed flex gap-2.5 font-body ${dark?'text-slate-400':'text-stone-500'}`}>
                          <span className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${dark?'bg-slate-600':'bg-stone-300'}`}/>{b}
                        </li>
                      ))}
                      <li className={`text-[11px] tracking-wide mt-1 font-body ${dark?'text-slate-600':'text-stone-400'}`}>{exp.date}</li>
                    </ul>
                  </div>
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
function AboutSection({dark}:{dark:boolean}) {
  const cards = [
    {label:'Education',value:'B.A.Sc. Mechatronics Engineering',sub:'University of Waterloo · 2025–2030'},
    {label:'Location', value:'Waterloo / Toronto, ON',          sub:'Open to co-op & internships'},
    {label:'Contact',  value:'adindiga@uwaterloo.ca',           sub:'905-519-3823'},
    {label:'Standing', value:'Excellent Academic Standing',     sub:'DSA · Mechatronics · Materials · Circuits'},
  ]
  const interests = ['Robotics','Rocketry','Manufacturing','3D printing','Control systems','Triathlon','Ironman','Photography','Design','Running','Lifting','Golf']
  return (
    <Sec>
      <Eyebrow dark={dark}>About</Eyebrow>
      <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-3 ${dark?'text-slate-50':'text-stone-900'}`}>
        "What I cannot create,<br/><span className="italic">I do not understand."</span>
      </h1>
      <p className={`text-[11px] tracking-wide mb-8 font-body ${dark?'text-slate-600':'text-stone-400'}`}>— Richard Feynman</p>
      <p className={`text-sm leading-relaxed max-w-lg mb-10 font-body ${dark?'text-slate-400':'text-stone-500'}`}>
        I'm a Mechatronics Engineering student focused on R&D in robotics systems, with interests spanning
        mechanical design, electromechanics, perception, and software. I've built my foundation through
        self-directed learning and hands-on co-ops, driven by curiosity for how complex systems are engineered end-to-end.
        <br/><br/>
        My approach is rooted in experimentation and iteration — breaking problems down from first principles,
        building working prototypes, and refining through testing and failure. I'm interested in R&D environments
        where ideas are rapidly translated into tangible systems.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {cards.map((c,i)=>(
          <motion.div key={c.label} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
            <Card dark={dark}>
              <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark?'text-slate-600':'text-stone-400'}`}>{c.label}</p>
              <p className={`text-sm font-body ${dark?'text-slate-200':'text-stone-800'}`}>{c.value}</p>
              <p className={`text-xs mt-0.5 font-body ${dark?'text-slate-600':'text-stone-400'}`}>{c.sub}</p>
            </Card>
          </motion.div>
        ))}
        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.28}} className="sm:col-span-2">
          <Card dark={dark}>
            <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Full Toolkit</p>
            <p className={`text-xs leading-relaxed font-body ${dark?'text-slate-400':'text-stone-500'}`}>
              SolidWorks · Siemens NX · Fusion 360 · FEA · GD&T · DFMA · C++ · Python · MATLAB · ROS · RTOS · STM32 · Arduino · Java · FastAPI · Git · CNC (mill/lathe) · FDM/SLA · Composites
            </p>
          </Card>
        </motion.div>
      </div>
      <div className="mb-10">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Photos</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[1,2,3,4,5,6].map(n=>(
            <div key={n} className={`aspect-square rounded-xl overflow-hidden border ${dark?'bg-slate-800 border-slate-700':'bg-stone-100 border-stone-200'}`}>
              {/* Replace with: <img src={`/images/photo${n}.jpg`} alt="" className="w-full h-full object-cover" /> */}
              <div className={`w-full h-full flex items-center justify-center text-[10px] tracking-widest uppercase font-body ${dark?'text-slate-700':'text-stone-300'}`}>Photo {n}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-3 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Interests</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((item,i)=>(
            <motion.span key={item} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.04}}
              className={`text-xs px-3 py-1.5 rounded-full border font-body ${dark?'bg-slate-800 border-slate-700 text-slate-400':'bg-stone-100 border-stone-200 text-stone-500'}`}>
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </Sec>
  )
}

/* ─── WRITING ───────────────────────────────────────────────── */
function WritingSection({dark}:{dark:boolean}) {
  const [open, setOpen] = useState(false)
  const paragraphs = WRITING_POST.content.split('\n\n').filter(Boolean)

  return (
    <Sec>
      <Eyebrow dark={dark}>Writing</Eyebrow>
      <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-10 ${dark?'text-slate-50':'text-stone-900'}`}>
        Thinking <span className="italic">in public.</span>
      </h1>

      {/* Single real post */}
      <div className={`border-t ${dark?'border-slate-800':'border-stone-200'}`}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          {/* Post header — clickable to expand */}
          <button data-hover onClick={()=>setOpen(o=>!o)}
            className={`w-full border-b text-left py-8 group transition-all duration-200 rounded-sm ${open?(dark?'border-slate-700':'border-stone-300'):(dark?'border-slate-800 hover:bg-slate-900/40':'border-stone-200 hover:bg-stone-50/60')}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`text-[10px] tracking-[0.1em] uppercase font-body ${dark?'text-slate-600':'text-stone-400'}`}>{WRITING_POST.date}</span>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full border font-body ${dark?'border-slate-700 text-slate-600':'border-stone-200 text-stone-400'}`}>{WRITING_POST.cat}</span>
                </div>
                <h2 className={`font-display text-2xl md:text-3xl transition-all duration-200 ${open?'':(dark?'group-hover:text-slate-100':'group-hover:text-stone-800')} ${dark?'text-slate-100':'text-stone-900'}`}>
                  {WRITING_POST.title}
                </h2>
                {!open && (
                  <p className={`text-sm mt-2 font-body ${dark?'text-slate-500':'text-stone-400'}`}>
                    {paragraphs[0]?.slice(0, 120)}…
                  </p>
                )}
              </div>
              <motion.span animate={{rotate: open?180:0}} transition={{duration:0.3}}
                className={`text-lg flex-shrink-0 mt-1 ${dark?'text-slate-600':'text-stone-400'}`}>
                &#8964;
              </motion.span>
            </div>
          </button>

          {/* Post body — expands inline */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                transition={{duration:0.4,ease:[0.23,1,0.32,1]}}
                className="overflow-hidden"
              >
                <div className={`py-8 px-1 space-y-5 border-b ${dark?'border-slate-800':'border-stone-200'}`}>
                  {paragraphs.map((para,i)=>(
                    <p key={i} className={`text-sm leading-relaxed font-body ${dark?'text-slate-300':'text-stone-600'}`}>{para}</p>
                  ))}
                  <button onClick={()=>setOpen(false)}
                    className={`text-[11px] tracking-[0.1em] uppercase font-body mt-4 ${dark?'text-slate-600 hover:text-slate-300':'text-stone-400 hover:text-stone-600'}`}>
                    ↑ Collapse
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* More posts placeholder */}
      <p className={`text-xs mt-8 font-body ${dark?'text-slate-700':'text-stone-300'}`}>More posts coming — check back soon.</p>
    </Sec>
  )
}

/* ─── 3D PRINTS GALLERY ─────────────────────────────────────── */
function PrintsGallery({dark,onClose}:{dark:boolean;onClose:()=>void}) {
  const [selected,setSelected] = useState<typeof PRINTS[0]|null>(null)
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{background:dark?'rgba(13,15,21,0.97)':'rgba(245,240,232,0.97)',backdropFilter:'blur(16px)'}}>
      <div className="max-w-[860px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <p className={`text-[11px] tracking-[0.16em] uppercase font-body mb-2 ${dark?'text-slate-500':'text-stone-400'}`}>Gallery</p>
            <h2 className={`font-display text-3xl md:text-4xl ${dark?'text-slate-50':'text-stone-900'}`}>3D Printed <span className="italic">&amp; Made</span></h2>
          </div>
          <button data-hover onClick={onClose} className={`flex-shrink-0 text-[11px] tracking-[0.12em] uppercase font-body border rounded-full px-4 py-2 transition-all duration-200 ${dark?'border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-400':'border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-600'}`}>← Back</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PRINTS.map((pr,i)=>(
            <motion.div key={pr.id} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              data-hover onClick={()=>setSelected(pr)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 group ${dark?'bg-slate-900 border-slate-800 hover:border-slate-500':'bg-white border-stone-200 hover:border-stone-400'}`}>
              <div className={`h-36 md:h-40 overflow-hidden ${dark?'bg-slate-800':'bg-stone-100'}`}>
                {/* <img src={pr.img} alt={pr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> */}
                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${dark?'text-slate-700':'text-stone-300'}`}><span className="text-xl">◆</span><span className="text-[9px] tracking-widest uppercase font-body">Add photo</span></div>
              </div>
              <div className="p-4">
                <p className={`text-sm font-body mb-1 ${dark?'text-slate-200':'text-stone-800'}`}>{pr.name}</p>
                <p className={`text-[10px] tracking-[0.06em] uppercase font-body ${dark?'text-slate-600':'text-stone-400'}`}>{pr.material}</p>
              </div>
            </motion.div>
          ))}
          <div className={`rounded-xl border border-dashed flex flex-col items-center justify-center h-[176px] ${dark?'border-slate-700 text-slate-700':'border-stone-300 text-stone-300'}`}>
            <span className="text-xl mb-2">+</span><span className="text-[10px] tracking-widest uppercase font-body">Add part</span>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[300] flex items-center justify-center p-5 md:p-8"
            style={{background:'rgba(0,0,0,0.8)',backdropFilter:'blur(8px)'}} onClick={()=>setSelected(null)}>
            <motion.div initial={{scale:0.94,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.94,opacity:0}}
              onClick={e=>e.stopPropagation()}
              className={`max-w-lg w-full rounded-2xl overflow-hidden ${dark?'bg-slate-900 border border-slate-700':'bg-white border border-stone-200'}`}>
              <div className={`h-48 md:h-56 ${dark?'bg-slate-800':'bg-stone-100'}`}>
                <div className={`w-full h-full flex items-center justify-center ${dark?'text-slate-700':'text-stone-300'}`}><span className="text-3xl">◆</span></div>
              </div>
              <div className="p-6 md:p-7">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-display text-xl md:text-2xl ${dark?'text-slate-50':'text-stone-900'}`}>{selected.name}</h3>
                  <button data-hover onClick={()=>setSelected(null)} className={`text-lg ml-4 mt-0.5 flex-shrink-0 ${dark?'text-slate-600 hover:text-slate-300':'text-stone-300 hover:text-stone-600'}`}>✕</button>
                </div>
                <p className={`text-[10px] tracking-[0.1em] uppercase font-body mb-4 ${dark?'text-slate-500':'text-stone-400'}`}>{selected.material}</p>
                <p className={`text-sm leading-relaxed font-body ${dark?'text-slate-400':'text-stone-500'}`}>{selected.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── PROJECT DETAIL MODAL ───────────────────────────────────── */
function ProjectModal({project,dark,onClose}:{project:typeof PROJECTS[0];dark:boolean;onClose:()=>void}) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[200] flex items-center justify-center p-5 md:p-10"
      style={{background:'rgba(0,0,0,0.75)',backdropFilter:'blur(10px)'}}
      onClick={onClose}>
      <motion.div initial={{scale:0.92,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.92,opacity:0,y:10}}
        transition={{duration:0.35,ease:[0.23,1,0.32,1]}}
        onClick={e=>e.stopPropagation()}
        className={`w-full max-w-xl rounded-2xl overflow-hidden ${dark?'bg-[#0d0f15] border border-slate-700':'bg-[#f5f0e8] border border-stone-200'}`}>
        {/* Image */}
        <div className={`h-52 md:h-64 overflow-hidden relative ${dark?'bg-slate-800':'bg-stone-100'}`}>
          {/* <img src={project.img} alt={project.name} className="w-full h-full object-cover" /> */}
          <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${dark?'text-slate-700':'text-stone-300'}`}>
            <span className="text-3xl">◆</span>
            <span className="text-[10px] tracking-widest uppercase font-body">Add photo</span>
          </div>
          <button onClick={onClose}
            className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${dark?'bg-slate-700/80 text-slate-300 hover:bg-slate-600':'bg-white/80 text-stone-500 hover:bg-white'}`}>
            ✕
          </button>
        </div>
        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 className={`font-display text-xl md:text-2xl leading-tight ${dark?'text-slate-50':'text-stone-900'}`}>{project.name}</h2>
            <span className={`text-[10px] tracking-[0.08em] uppercase px-2.5 py-1 rounded-full border flex-shrink-0 font-body mt-1 ${dark?'border-slate-600 text-slate-400':'border-stone-300 text-stone-500'}`}>{project.stat}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map(tg=><span key={tg} className={`text-[9px] tracking-[0.06em] uppercase px-2 py-0.5 rounded font-body ${dark?'bg-slate-800 text-slate-400':'bg-stone-200 text-stone-500'}`}>{tg}</span>)}
          </div>
          <p className={`text-sm leading-relaxed font-body ${dark?'text-slate-300':'text-stone-600'}`}>{project.detail}</p>
          {project.gallery && (
            <p className={`text-xs mt-4 font-body ${dark?'text-slate-500':'text-stone-400'}`}>↑ Close and tap the card again to open the parts gallery.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── PROJECTS ──────────────────────────────────────────────── */
function ProjectsSection({dark}:{dark:boolean}) {
  const [showGallery,setShowGallery] = useState(false)
  const [selected,setSelected]       = useState<typeof PROJECTS[0]|null>(null)

  const handleClick=(p:typeof PROJECTS[0])=>{
    if(p.gallery){ setShowGallery(true) } else { setSelected(p) }
  }

  return (
    <>
      <AnimatePresence>{showGallery&&<PrintsGallery dark={dark} onClose={()=>setShowGallery(false)}/>}</AnimatePresence>
      <AnimatePresence>{selected&&<ProjectModal project={selected} dark={dark} onClose={()=>setSelected(null)}/>}</AnimatePresence>
      <Sec>
        <Eyebrow dark={dark}>Projects</Eyebrow>
        <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-4 ${dark?'text-slate-50':'text-stone-900'}`}>Things I've <span className="italic">made.</span></h1>
        <p className={`text-sm mb-10 font-body ${dark?'text-slate-500':'text-stone-400'}`}>Tap any project to expand and read more.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROJECTS.map((p,i)=>(
            <motion.div key={p.id} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:i*0.09,duration:0.42,ease:[0.23,1,0.32,1] as any}}
              whileHover={{y:-3,scale:1.01}} data-hover onClick={()=>handleClick(p)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-colors duration-200 ${dark?'bg-slate-900 border-slate-800 hover:border-slate-500':'bg-white/80 border-stone-200 hover:border-stone-400'}`}>
              <div className={`h-40 md:h-44 ${dark?'bg-slate-800':'bg-stone-100'}`}>
                {/* <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> */}
                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 font-body ${dark?'text-slate-700':'text-stone-300'}`}>
                  <span className="text-xl">◆</span>
                  <span className="text-[10px] tracking-widest uppercase">{p.gallery?'Tap to browse gallery':'Tap to read more'}</span>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className={`text-sm font-body leading-snug font-medium ${dark?'text-slate-100':'text-stone-900'}`}>{p.name}</h3>
                  <span className={`text-[9px] tracking-wide uppercase font-body flex-shrink-0 mt-0.5 ${dark?'text-slate-600':'text-stone-400'}`}>{p.gallery?'⊞':'↗'}</span>
                </div>
                <p className={`text-xs leading-relaxed mb-3 font-body ${dark?'text-slate-500':'text-stone-400'}`}>{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.tags.map(tg=><span key={tg} className={`text-[9px] tracking-[0.06em] uppercase px-2 py-0.5 rounded font-body ${dark?'bg-slate-800 text-slate-500':'bg-stone-100 text-stone-400'}`}>{tg}</span>)}
                </div>
                <p className={`text-[10px] tracking-[0.08em] uppercase font-mono ${dark?'text-slate-600':'text-stone-400'}`}>{p.stat}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Sec>
    </>
  )
}

/* ─── TRAINING ──────────────────────────────────────────────── */
function TrainingSection({dark}:{dark:boolean}) {
  const disciplines = [
    {label:'Swim',     icon:'◌',desc:'Open water & pool sessions'},
    {label:'Bike',     icon:'◎',desc:'Long road rides & mountain biking'},
    {label:'Run',      icon:'◉',desc:'Base building & brick runs'},
    {label:'Strength', icon:'◆',desc:'Full Body twice a week'},
  ]
  const externalLinks = [
    {label:'Training Tracker',  sub:'Full workout log',      href:GYM_TRACKER_URL, icon:'⊞'},
    {label:'Strava',            sub:'Run & ride activity',   href:STRAVA_URL,      icon:'◉'},
    {label:'Garmin Connect',    sub:'GPS & health data',     href:GARMIN_URL,      icon:'◎'},
    {label:'Spotify',           sub:"What I'm listening to", href:SPOTIFY_URL,     icon:'♪'},
  ]
  return (
    <Sec>
      <Eyebrow dark={dark}>Training</Eyebrow>
      <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-4 ${dark?'text-slate-50':'text-stone-900'}`}>Gym, Golf &amp; <span className="italic">Ironman.</span></h1>
      <p className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark?'text-slate-400':'text-stone-500'}`}>
        Outside of engineering I'm either at the gym, on a golf course, or convincing myself that
        training for races is a reasonable use of time. I'm obsessed with constantly improving —
        it keeps my headspace level in the middle of school, job applications, and building a career.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
        {externalLinks.map((l,i)=>(
          <motion.a key={l.label} href={l.href} target="_blank" rel="noreferrer" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.07}} data-hover
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200 group ${dark?'bg-slate-900 border-slate-700 hover:border-slate-500':'bg-white/80 border-stone-200 hover:border-stone-400'}`}>
            <span className={`text-base flex-shrink-0 ${dark?'text-slate-400':'text-stone-400'}`}>{l.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-body ${dark?'text-slate-200':'text-stone-800'}`}>{l.label}</p>
              <p className={`text-[11px] font-body ${dark?'text-slate-500':'text-stone-400'}`}>{l.sub}</p>
            </div>
            <span className={`text-sm flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${dark?'text-slate-600':'text-stone-400'}`}>→</span>
          </motion.a>
        ))}
      </div>
      <div className="mb-14">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-5 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Golf</p>
        <div className="flex items-start gap-4 mb-6 flex-wrap">
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <Card dark={dark} className="flex-shrink-0">
              <p className={`text-[10px] tracking-[0.12em] uppercase mb-1 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Handicap</p>
              <p className={`font-display text-4xl ${dark?'text-slate-50':'text-stone-900'}`}>8.6</p>
            </Card>
          </motion.div>
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.16}} className="flex-1 min-w-[180px]">
            <Card dark={dark}>
              <p className={`text-[10px] tracking-[0.12em] uppercase mb-2 font-body ${dark?'text-slate-600':'text-stone-400'}`}>About my game</p>
              <p className={`text-xs leading-relaxed font-body ${dark?'text-slate-400':'text-stone-500'}`}>Been playing consistently for 2 years and fell in love quickly. Great way to take the load off and compete with buddies. Easily one of my favourite hobbies.</p>
            </Card>
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.22}} className={`rounded-xl border overflow-hidden ${dark?'bg-slate-900 border-slate-800':'bg-white/80 border-stone-200'}`}>
          <div className="aspect-video w-full">
            <iframe src="https://www.youtube.com/embed/iriOazO32T0" className="w-full h-full" style={{border:0}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
          </div>
        </motion.div>
      </div>
      <div className="mb-14">
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-5 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Ironman Training</p>
        <div className="grid grid-cols-2 gap-3">
          {disciplines.map((d,i)=>(
            <motion.div key={d.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.18+i*0.07}}>
              <Card dark={dark}>
                <span className={`text-lg mb-3 block ${dark?'text-slate-500':'text-stone-300'}`}>{d.icon}</span>
                <p className={`text-sm font-body mb-1 ${dark?'text-slate-200':'text-stone-800'}`}>{d.label}</p>
                <p className={`text-xs font-body ${dark?'text-slate-500':'text-stone-400'}`}>{d.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div>
        <p className={`text-[11px] tracking-[0.16em] uppercase mb-4 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Races</p>
        <div className={`border-t ${dark?'border-slate-800':'border-stone-200'}`}>
          {RACES.map((r,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:0.28+i*0.08}}
              className={`flex items-center justify-between py-4 border-b gap-3 ${dark?'border-slate-800':'border-stone-200'}`}>
              <div className="min-w-0">
                <p className={`text-sm font-body truncate ${dark?'text-slate-200':'text-stone-800'}`}>{r.name}</p>
                <p className={`text-xs mt-0.5 font-body ${dark?'text-slate-600':'text-stone-400'}`}>{r.date}</p>
              </div>
              <span className={`text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border flex-shrink-0 ${r.status==='completed'?(dark?'border-emerald-800 text-emerald-500':'border-emerald-300 text-emerald-600'):(dark?'border-slate-700 text-slate-500':'border-stone-200 text-stone-400')}`}>
                {r.status==='completed'?(r.time??'Finished'):'Upcoming'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Sec>
  )
}

/* ─── CONNECT ───────────────────────────────────────────────── */
function ConnectSection({dark}:{dark:boolean}) {
  const [form,setForm]     = useState({name:'',email:'',message:''})
  const [status,setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault(); setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(form)})
      if(res.ok){ setStatus('sent'); setForm({name:'',email:'',message:''}) } else setStatus('error')
    } catch { window.location.href=`mailto:adindiga@uwaterloo.ca?subject=Message from ${form.name}&body=${form.message}`; setStatus('idle') }
  }
  const inp=`w-full rounded-xl border px-4 py-3 text-sm font-body outline-none transition-all duration-200 ${dark?'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600 focus:border-slate-500':'bg-white/80 border-stone-200 text-stone-800 placeholder-stone-300 focus:border-stone-400'}`
  return (
    <Sec>
      <Eyebrow dark={dark}>Connect</Eyebrow>
      <h1 className={`font-display text-4xl md:text-5xl leading-[1.15] mb-4 ${dark?'text-slate-50':'text-stone-900'}`}>Let's <span className="italic">talk.</span></h1>
      <p className={`text-sm leading-relaxed max-w-md mb-10 font-body ${dark?'text-slate-400':'text-stone-500'}`}>Whether it's a co-op opportunity, a collab, or just want to chat about robotics or golf — drop me a message or reach out directly.</p>
      <div className="flex flex-wrap gap-3 mb-12">
        {[{label:'Email',href:'mailto:adindiga@uwaterloo.ca',icon:'✉'},{label:'LinkedIn',href:'https://www.linkedin.com/in/arjundindigal',icon:'↗'}].map(l=>(
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" data-hover
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-body transition-all duration-200 group ${dark?'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100':'border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'}`}>
            <span>{l.icon}</span>{l.label}<span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        ))}
      </div>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
        <Card dark={dark} className="!p-6 md:!p-8">
          <p className={`text-[10px] tracking-[0.14em] uppercase mb-6 font-body ${dark?'text-slate-600':'text-stone-400'}`}>Send a message</p>
          {status==='sent'?(
            <div className="py-8 text-center">
              <p className={`font-display text-2xl mb-2 ${dark?'text-slate-50':'text-stone-900'}`}>Sent.</p>
              <p className={`text-sm font-body ${dark?'text-slate-400':'text-stone-500'}`}>I'll get back to you soon.</p>
              <button onClick={()=>setStatus('idle')} className={`mt-6 text-[11px] tracking-[0.1em] uppercase font-body ${dark?'text-slate-500 hover:text-slate-300':'text-stone-400 hover:text-stone-600'}`}>Send another →</button>
            </div>
          ):(
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inp}/>
                <input required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inp}/>
              </div>
              <textarea required rows={5} placeholder="What's on your mind?" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} className={`${inp} resize-none`}/>
              <div className="flex items-center justify-between gap-4">
                {status==='error'&&<p className="text-xs text-red-400 font-body">Something went wrong — try emailing directly.</p>}
                <div className="flex-1"/>
                <button type="submit" disabled={status==='sending'} data-hover className={`px-6 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-body border transition-all duration-200 ${dark?'border-slate-600 text-slate-200 hover:bg-slate-800 disabled:opacity-40':'border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40'}`}>
                  {status==='sending'?'Sending…':'Send →'}
                </button>
              </div>
            </form>
          )}
        </Card>
      </motion.div>
      <p className={`text-xs mt-4 font-body ${dark?'text-slate-700':'text-stone-300'}`}>To activate the form: sign up free at formspree.io, create a form, and replace YOUR_FORM_ID in Portfolio.tsx.</p>
    </Sec>
  )
}

/* ─── FOOTER ────────────────────────────────────────────────── */
function Footer({dark}:{dark:boolean}) {
  return (
    <div className={`border-t ${dark?'border-slate-800':'border-stone-200'}`}>
      <div className="max-w-[760px] mx-auto px-5 md:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className={`text-[11px] tracking-[0.1em] uppercase font-body ${dark?'text-slate-600':'text-stone-400'}`}>Arjun Dindigal · 2026</span>
        <div className="flex gap-5 flex-wrap">
          {[{label:'LinkedIn',href:'https://www.linkedin.com/in/arjundindigal'},{label:'Resume',href:'/resume.pdf'},{label:'Email',href:'mailto:adindiga@uwaterloo.ca'}].map(l=>(
            <a key={l.label} href={l.href} target={l.href.startsWith('http')?'_blank':undefined} rel="noreferrer" data-hover
              className={`text-[11px] tracking-[0.1em] uppercase font-body nav-underline transition-colors duration-200 ${dark?'text-slate-600 hover:text-slate-300':'text-stone-400 hover:text-stone-700'}`}>{l.label}</a>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── ROOT ──────────────────────────────────────────────────── */
export default function Portfolio() {
  const [section,setSection] = useState<Section>('home')
  const [dark,setDark]       = useState(false)
  useEffect(()=>{
    const stored=localStorage.getItem('theme')
    const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches
    const next=stored==='dark'?true:stored==='light'?false:prefersDark
    setDark(next); document.documentElement.classList.toggle('dark',next)
  },[])
  const toggleDark=useCallback(()=>{
    setDark(d=>{ const next=!d; localStorage.setItem('theme',next?'dark':'light'); document.documentElement.classList.toggle('dark',next); return next })
  },[])
  return (
    <div className={`min-h-screen transition-colors duration-500 ${dark?'bg-[#0d0f15] text-slate-100':'bg-[#f5f0e8] text-stone-900'}`}>
      <Cursor dark={dark}/>
      <WaveCanvas dark={dark}/>
      <Nav active={section} onNav={setSection} dark={dark} onToggleDark={toggleDark}/>
      <AnimatePresence mode="wait">
        {section==='home'     && <HomeSection     key="home"     dark={dark} onNav={setSection}/>}
        {section==='about'    && <AboutSection    key="about"    dark={dark}/>}
        {section==='writing'  && <WritingSection  key="writing"  dark={dark}/>}
        {section==='projects' && <ProjectsSection key="projects" dark={dark}/>}
        {section==='training' && <TrainingSection key="training" dark={dark}/>}
        {section==='connect'  && <ConnectSection  key="connect"  dark={dark}/>}
      </AnimatePresence>
      <Footer dark={dark}/>
    </div>
  )
}
