'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── DATA ──────────────────────────────────────────────────── */

const SKILL_SECTIONS: Record<string, string> = {
  'SolidWorks':'projects','Siemens NX':'projects','Fusion 360':'projects',
  'FEA':'projects','GD&T':'projects','DFMA':'projects',
  'C++':'projects','Python':'projects','MATLAB':'projects',
  'ROS':'projects','RTOS':'projects','STM32':'projects','Arduino':'projects',
  'Java':'projects','FastAPI':'projects','Git':'projects',
  'CNC':'projects','FDM/SLA':'projects','Composites':'projects',
}

const EXP_LOGOS: Record<string, string> = {
  rocketry: '/images/logo-rocketry.png',
  linamar:  '/images/logo-linamar.png',
  pratyin:  '/images/logo-pratyin.png',
}

const EXPERIENCES = [
  { id:'linamar', initials:'LN', title:'Mechanical Design Engineer', company:'Linamar Corporation', location:'Guelph, ON', date:'Jan 2026 – May 2026', tags:['SolidWorks','GD&T','DFMA','FEA','FDM/SLA'], bullets:['Designed & validated 10+ production fixtures using SolidWorks with GD&T and DFMA principles.','Cut cycle times 20–40 s/op through fixture & ergonomics redesigns with machinists.','Reverse engineered failed robotic components; produced CAD models and fabricated replacements.','Reduced defective parts by 10%+ through fixture redesigns and optimised part handling.','Full concept → CAD → fabrication → validation ownership deployed on shop floor.'] },
  { id:'rocketry', initials:'WR', title:'Mechanical Engineer', company:'Waterloo Rocketry', location:'Waterloo, ON', date:'Aug 2025 – Jan 2026', tags:['Test fixtures','3D printing','Propulsion','Telemetry'], bullets:['Built test fixtures and camera systems for 10+ static engine tests with real-time telemetry.','Designed 3D-printed enclosures and support structures for harsh testing environments.','Assembled and calibrated propulsion systems within 5% of predicted thrust.'] },
  { id:'pratyin', initials:'PI', title:'Software Development Intern', company:'Pratyin Infotech Consulting', location:'Toronto, ON', date:'May 2025 – Aug 2025', tags:['Java','FastAPI','Python','Agile'], bullets:['Java + FastAPI integration syncing 5,000+ invoices with 99.7% accuracy.','Automated Python data pipelines processing 200,000 records/month, cutting manual work by 20%.','Shipped 2 production-ready features in 2 months, zero critical bugs deployed.'] },
]

const PROJECTS = [
  {
    id:'vex', name:'Autonomous VEX Retrieval Bot',
    desc:'Developed an autonomous robot using PID control and sensor fusion, achieving 98% turn accuracy, 92% object retrieval success, and 15% weight reduction through optimized mechanical design and system integration.',
    detail: 'Designed and built an autonomous robotic system for a school engineering project focused on solving a structured object retrieval scenario under constrained time and performance conditions. Led the mechanical design of the robot including a custom chassis, drivetrain architecture, and a mechanically actuated elevator system used for lifting and placing objects. Engineered gear ratios, torque transmission paths, and structural supports to ensure stable and repeatable motion during autonomous operation. Manufactured and assembled 8+ custom CAD-designed components, iterating on weight distribution, rigidity, and system layout to improve efficiency and reliability. Achieved 15% overall weight reduction through structural optimization while maintaining mechanical strength. Autonomous performance was supported through PID control and sensor fusion algorithms, resulting in 98% turn accuracy and 92% object retrieval success, with consistent performance across repeated test runs.',
    imgs: ['/images/vex-01.jpg','/images/vex-02.jpeg','/images/vex-03.jpeg'],
    video: 'https://www.youtube.com/embed/U5MgGNN_4Jk?si=gar5LqpS8Pg7ZvK1',
    tags:['C++','PID','Sensor fusion','CAD'], stat:'98% accuracy', gallery:false,
  },
  {
    id:'cart', name:'Reverse Engineered Regress Cart',
    desc:'Redesigned 100+ kg production cart. Reduced part count via DFMA, coordinated waterjet fabrication with full GD&T drawings.',
    detail:'Reverse-engineered an industrial production cart used in a real operational environment and redesigned it using DFMA principles to reduce mechanical complexity, improve manufacturability, and enhance technician usability. Developed full CAD models in SolidWorks and Siemens NX, iterating through multiple design revisions focused on structural efficiency and ease of assembly. Produced detailed GD&T manufacturing drawings and worked directly with machinists to coordinate fabrication using waterjet cutting processes. The final system was a 100+ kg load-bearing cart that improved workflow efficiency by reducing assembly time, minimizing part count, and optimizing ergonomic interaction points for end users while maintaining structural integrity under industrial use conditions.',
    imgs: ['/images/cart-01.jpg','/images/cart-02.jpg','/images/cart-03.png','/images/cart-04.jpg'],
    video: 'https://www.youtube.com/embed/2CA7vmuQ3vw',
    tags:['Siemens NX','SolidWorks','DFMA','GD&T'], stat:'100+ kg validated', gallery:false,
  },
  {
    id:'gauge', name:'Runout Gauge',
    desc:'Designed a custom runout gauge from scratch with 8+ machined components, improving measurement accuracy to near 100% using a bearing-supported puck system and full GD&T manufacturing drawings.',
    detail:'Designed a custom runout gauge for in-process quality inspection on the shop floor at Linamar, taking the project from initial SolidWorks CAD design through FDM rapid prototyping for fit and functional validation, followed by final machining in aluminum for production deployment; iterated the design from an initial concept where rotation occurred directly on a gear surface to a refined bearing-supported puck and housing system, eliminating surface-induced vibration and improving rotational smoothness and measurement consistency; developed approximately 8 custom components including structural housing, alignment features, and bearing interfaces, ensuring manufacturability through collaboration with tool room and shop floor machinists; validated measurement repeatability by benchmarking against coordinate measuring machine (CMM) data, confirming high accuracy performance; successfully deployed into production use, significantly improving inspection reliability and reducing per-part inspection time in a live manufacturing environment.',
    imgs: ['/images/runout-01.jpeg','/images/runout-02.jpeg','/images/runout-03.jpg','/images/runout-04.jpg','/images/runout-05.jpg','/images/runout-06.jpeg','/images/runout-07.jpeg'],
    video: 'https://www.youtube.com/embed/CsTB8vzFzGU',
    tags:['SolidWorks','FDM','Tolerance analysis'], stat:'Production-deployed', gallery:false,
  },
  {
    id:'stairs', name:'Welded Stairs',
    desc:'Redesigned and engineered a welded steel stair system using SolidWorks weldments and sheet metal, producing fabrication drawings and coordinating shop-floor welding for a load-tested industrial access structure.',
    detail:'Designed and iterated a welded steel stair and platform system to improve industrial line access, using SolidWorks weldments and sheet metal tools to develop multiple design configurations including straight, L-shaped, and platform-based layouts; performed full structural layout from first principles, defining stringer geometry, tread bracket positioning, and load paths to ensure safe and ergonomic access between production areas; produced detailed fabrication drawings and coordinated directly with the weldment team and shop floor personnel to support manufacturing and assembly of the final structure; while fabrication was executed by the welding team, led all CAD modeling, design iteration, and engineering documentation to ensure accuracy and manufacturability; final structure was physically load-tested above expected design conditions, validated for structural integrity, and finished with protective primer and paint for long-term industrial use.',
    imgs: ['/images/stairs-01.jpg','/images/stairs-02.jpg','/images/stairs-03.jpg','/images/stairs-04.jpg','/images/stairs-05.jpg','/images/stairs-06.jpg','/images/stairs-07.jpg','/images/stairs-08.jpg','/images/stairs-09.jpg','/images/stairs-10.jpg','/images/stairs-11.jpg'],
    video: null as string | null,
    tags:['Welding','Fabrication','Structural','Steel'], stat:'Load-bearing built', gallery:false,
  },
  {
    id:'prints', name:'3D Printed & Manufactured Parts',
    desc:'A growing gallery of FDM/SLA and machined components. Tap to browse each part with its description.',
    detail:'An ongoing collection of parts designed and made across different projects — enclosures, jigs, brackets, and custom hardware. Materials range from PLA and ABS to engineering-grade PETG and SLA resin.',
    imgs: ['/images/3dprints-1.jpg'],
    video: null as string | null,
    tags:['FDM','SLA','CNC','Fabrication'], stat:'Growing library', gallery:true,
  },
]

const PRINTS = [
  { id:'p1', name:'Custom Enclosure',  desc:'FDM-printed ABS enclosure for an electronics board. Snap-fit assembly with ventilation slots and cable routing.', img:'/images/prints/enclosure.jpg',  material:'ABS · FDM'   },
  { id:'p2', name:'Bracket Assembly',  desc:'Structural PETG bracket holding a camera rig on the rocketry test stand under vibration loads.',                  img:'/images/prints/bracket.jpg',    material:'PETG · FDM'  },
  { id:'p3', name:'Test Fixture Jig',  desc:'SLA-printed jig for precise alignment during assembly. Toleranced to ±0.1 mm.',                                    img:'/images/prints/jig.jpg',        material:'Resin · SLA' },
  { id:'p4', name:'Prototype Part',    desc:'Rapid prototype for a production redesign — 3 iterations before the final design was CNC machined.',               img:'/images/prints/prototype.jpg',  material:'PLA · FDM'   },
]

const SKILLS = ['SolidWorks','Siemens NX','Fusion 360','FEA','GD&T','DFMA','C++','Python','MATLAB','ROS','RTOS','STM32','Arduino','Java','FastAPI','Git','CNC','FDM/SLA','Composites']

const WRITING_POST = {
  id: '1a',
  title: 'My 1A Term',
  date: 'April 2026',
  cat: 'Reflection',
  content: `Reflecting on my 1A Term`,
}

const GYM_TRACKER_URL = 'https://docs.google.com/spreadsheets/d/1n55fCkjTbq4fRDdX-duE-72flZUlar5hGinjMlM436Y/view?usp=sharing'
const STRAVA_URL      = 'https://www.strava.com/athletes/arjundindigal'
const GARMIN_URL      = 'https://connect.garmin.com'
const SPOTIFY_URL     = 'https://open.spotify.com/user/arjundindigal?si=d149e66474c34a82'
const RACES: { name:string; date:string; status:'upcoming'|'completed'; time?:string }[] = [
 { name:'Honda Waterfront Half Marathon', date:'June 7th 2026', status:'upcoming' },
  { name:'Ironman 70.3 — Unoffical', date:'August 26th 2026', status:'upcoming' },
   { name:'Niagara Falls International Marathon', date:'October 25th 2026', status:'upcoming' },
   { name:'Ironman 140.6 Ottawa - End Goal', date:'2027', status:'upcoming' }
]

type Section = 'home'|'about'|'writing'|'projects'|'training'|'connect'

/* ─── WAVE CANVAS — barely there ────────────────────────────── */
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

    // Two extremely subtle swells
    const SWELLS = [
      { yFrac:0.55, amp:18, freq:0.00070, spd:0.0012, phase:0.0 },
      { yFrac:0.75, amp:12, freq:0.00095, spd:0.0018, phase:2.2 },
    ]

    const draw = ()=>{
      const m = mouse.current
      m.x += (m.tx - m.x)*0.025
      m.y += (m.ty - m.y)*0.025
      const W=canvas.width, H=canvas.height
      ctx.clearRect(0,0,W,H)
      const isDark = darkRef.current

      SWELLS.forEach((sw)=>{
        const lift  = (m.y - 0.5) * 30
        const yBase = H * sw.yFrac + lift
        const pts:[number,number][] = []
        for(let x=0; x<=W; x+=8){
          const nx   = x/W
          const pull = Math.exp(-Math.pow(nx - m.x, 2)*12) * m.y * 20
          const y    = yBase
            + Math.sin(x*sw.freq + t.current*sw.spd + sw.phase)*sw.amp
            + Math.sin(x*sw.freq*1.8 + t.current*sw.spd*0.5 + sw.phase)*sw.amp*0.2
            - pull
          pts.push([x,y])
        }
        ctx.beginPath()
        pts.forEach(([x,y],i)=> i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y))
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
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
      if(dotRef.current)  dotRef.current.style.transform =`translate(${p.x-3}px,${p.y-3}px)`
      if(ringRef.current){ ringRef.current.style.transform=`translate(${p.rx-16}px,${p.ry-16}px)`; ringRef.current.classList.toggle('hovered',hov.current) }
      raf.current=requestAnimationFrame(tick)
    }; tick()
    return ()=>{ window.removeEventListener('mousemove',onMove); cancelAnimationFrame(raf.current) }
  },[])
  const c = dark?'#ffffff':'#0a0a0a'
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
  const bg = scrolled||menuOpen
    ? (dark?'bg-[#080808]/95 backdrop-blur-sm border-b border-white/5':'bg-[#f8f7f4]/95 backdrop-blur-sm border-b border-black/5')
    : 'bg-transparent'
  return (
    <motion.nav initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5,ease:[0.23,1,0.32,1]}}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${bg}`}>
      <div className="max-w-[960px] mx-auto px-6 md:px-10 flex items-center justify-between py-5 md:py-6">
        <button onClick={()=>go('home')} data-hover
          className={`font-mono text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-40 ${dark?'text-white':'text-black'}`}>
          AD
        </button>
        <div className="hidden md:flex items-center gap-8">
          {NAVITEMS.map(n=>(
            <button key={n.id} data-hover onClick={()=>go(n.id)}
              className={`text-[11px] tracking-[0.14em] uppercase font-mono transition-all duration-150 ${active===n.id?(dark?'text-white':'text-black'):(dark?'text-white/30 hover:text-white/70':'text-black/30 hover:text-black/70')}`}>
              {n.label}
            </button>
          ))}
          <button data-hover onClick={onToggleDark}
            className={`text-[10px] tracking-[0.12em] uppercase font-mono transition-all duration-150 ${dark?'text-white/25 hover:text-white/60':'text-black/25 hover:text-black/60'}`}>
            {dark?'Light':'Dark'}
          </button>
        </div>
        <div className="flex md:hidden items-center gap-4">
          <button onClick={onToggleDark} className={`text-[10px] tracking-[0.12em] uppercase font-mono ${dark?'text-white/30':'text-black/30'}`}>
            {dark?'L':'D'}
          </button>
          <button onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu"
            className={`text-[11px] tracking-[0.12em] uppercase font-mono ${dark?'text-white/50':'text-black/50'}`}>
            {menuOpen?'Close':'Menu'}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen&&(
          <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.2}}
            className={`md:hidden border-t ${dark?'border-white/5 bg-[#080808]':'border-black/5 bg-[#f8f7f4]'}`}>
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAVITEMS.map((n,i)=>(
                <motion.button key={n.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} onClick={()=>go(n.id)}
                  className={`text-left py-3 text-sm tracking-[0.1em] uppercase font-mono border-b transition-all duration-150 ${active===n.id?(dark?'text-white border-white/10':'text-black border-black/10'):(dark?'text-white/30 border-white/5 hover:text-white/70':'text-black/30 border-black/5 hover:text-black/70')}`}>
                  {n.label}
                </motion.button>
              ))}
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
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.4,ease:[0.23,1,0.32,1]}}
      className="max-w-[800px] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-24 min-h-screen">
      {children}
    </motion.div>
  )
}
function Label({children,dark}:{children:React.ReactNode;dark:boolean}) {
  return <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-8 ${dark?'text-white/25':'text-black/25'}`}>{children}</p>
}
function Divider({dark}:{dark:boolean}) {
  return <div className={`w-full h-px mb-10 ${dark?'bg-white/8':'bg-black/8'}`}/>
}

/* ─── HOME ──────────────────────────────────────────────────── */
function HomeSection({dark,onNav}:{dark:boolean;onNav:(s:Section)=>void}) {
  const [openId,setOpenId] = useState<string|null>(null)
  const s=(i:number)=>({initial:{opacity:0,y:14},animate:{opacity:1,y:0},transition:{duration:0.5,delay:i*0.08,ease:[0.23,1,0.32,1] as any}})

  return (
    <Sec>
      {/* Status */}
      <motion.div {...s(0)} className="flex items-center gap-2.5 mb-12">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"/>
        <span className={`text-[11px] tracking-[0.12em] uppercase font-mono ${dark?'text-white/30':'text-black/30'}`}>
          Mechatronics Engineering · University of Waterloo · Seeking Fall 2026 Oppurtunities
        </span>
      </motion.div>

      {/* Hero */}
      <motion.h1 {...s(1)} className={`font-mono text-3xl sm:text-4xl md:text-[42px] leading-[1.15] mb-6 tracking-tight ${dark?'text-white':'text-black'}`}>
        Arjun Dindigal
      </motion.h1>

      <motion.p {...s(2)} className={`text-sm leading-relaxed max-w-sm mb-16 font-mono ${dark?'text-white/40':'text-black/40'}`}>
        Mechatronics engineer focused on robotics, mechanical systems, and perception.
        Building the intersection of intelligent software and physical hardware.
      </motion.p>

      {/* Skills */}
      <motion.div {...s(3)} className="mb-20">
        <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-4 ${dark?'text-white/20':'text-black/20'}`}>Skills</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {SKILLS.map((sk)=>(
            <button key={sk} onClick={()=>onNav('projects')}
              className={`text-[11px] tracking-[0.06em] font-mono transition-all duration-150 ${dark?'text-white/30 hover:text-white/80':'text-black/30 hover:text-black/80'}`}>
              {sk}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Experience — prominent table layout */}
      <motion.div {...s(4)}>
        <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-6 ${dark?'text-white/25':'text-black/25'}`}>Experience</p>
        <div className={`border-t ${dark?'border-white/8':'border-black/8'}`}>
          {EXPERIENCES.map((exp,i)=>(
            <motion.div key={exp.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3+i*0.08}}>
              <button onClick={()=>setOpenId(openId===exp.id?null:exp.id)} data-hover
                className={`w-full border-b text-left transition-all duration-150 ${dark?'border-white/8 hover:bg-white/2':'border-black/8 hover:bg-black/2'}`}>
                <div className="py-5 flex items-start justify-between gap-6">
                  {/* Left: logo + role */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center overflow-hidden ${dark?'bg-white/5':'bg-black/5'}`}>
                      <img
                        src={EXP_LOGOS[exp.id]}
                        alt={exp.company}
                        className="w-6 h-6 object-contain"
                        onError={e=>{
                          const el=e.currentTarget; el.style.display='none'
                          const p=el.parentElement!
                          p.innerHTML=`<span style="font-size:9px;font-family:monospace;letter-spacing:0.05em;color:${dark?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)'}">${exp.initials}</span>`
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-mono ${dark?'text-white':'text-black'}`}>{exp.title}</p>
                      <p className={`text-[11px] font-mono mt-0.5 ${dark?'text-white/35':'text-black/35'}`}>{exp.company}</p>
                    </div>
                  </div>
                  {/* Right: date + location */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className={`text-[11px] font-mono ${dark?'text-white/25':'text-black/25'}`}>{exp.date}</p>
                    <p className={`text-[11px] font-mono mt-0.5 ${dark?'text-white/20':'text-black/20'}`}>{exp.location}</p>
                  </div>
                  <span className={`text-xs flex-shrink-0 mt-1 transition-transform duration-200 ${openId===exp.id?'rotate-180':''} ${dark?'text-white/20':'text-black/20'}`}>↓</span>
                </div>
              </button>

              {/* Expanded bullets */}
              <div className={`drawer ${openId===exp.id?'open':''}`}>
                <div className="drawer-inner">
                  <div className={`py-5 px-12 border-b ${dark?'border-white/5':'border-black/5'}`}>
                    <ul className="space-y-2.5">
                      {exp.bullets.map((b,bi)=>(
                        <li key={bi} className={`text-[12px] leading-relaxed font-mono flex gap-3 ${dark?'text-white/40':'text-black/40'}`}>
                          <span className="flex-shrink-0 mt-[6px] w-1 h-1 bg-current rounded-full opacity-40"/>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {exp.tags.map(tg=>(
                        <span key={tg} className={`text-[9px] tracking-[0.1em] uppercase font-mono ${dark?'text-white/20':'text-black/20'}`}>{tg}</span>
                      ))}
                    </div>
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
    {label:'Education', value:'B.A.Sc. Mechatronics Engineering', sub:'University of Waterloo · 2025–2030'},
    {label:'Location',  value:'Waterloo / Toronto, ON',           sub:'Open to co-op & internships'},
    {label:'Contact',   value:'adindiga@uwaterloo.ca',            sub:'905-519-3823'},
    {label:'Standing',  value:'Excellent Academic Standing',      sub:'DSA · Mechatronics · Materials · Circuits'},
  ]
  const interests = ['Robotics','Rocketry','Manufacturing','3D printing','Control systems','Triathlon','Ironman','Photography','Design','Running','Lifting','Golf']
  return (
    <Sec>
      <Label dark={dark}>About</Label>
      <h1 className={`font-mono text-3xl md:text-4xl leading-[1.2] mb-3 ${dark?'text-white':'text-black'}`}>
        "What I cannot create,<br/>I do not understand."
      </h1>
      <p className={`text-[11px] tracking-wide mb-10 font-mono ${dark?'text-white/20':'text-black/20'}`}>— Richard Feynman</p>
      <Divider dark={dark}/>
      <p className={`text-sm leading-relaxed max-w-lg mb-14 font-mono ${dark?'text-white/45':'text-black/45'}`}>
        Mechatronics Engineering student focused on R&D in robotics systems, with interests spanning
        mechanical design, electromechanics, perception, and software. Built my foundation through
        self-directed learning and hands-on co-ops, driven by curiosity for how complex systems are
        engineered end-to-end.
        <br/><br/>
        My approach is rooted in experimentation and iteration — breaking problems down from first
        principles, building working prototypes, and refining through testing and failure.
      </p>

      {/* Info rows */}
      <div className={`border-t ${dark?'border-white/8':'border-black/8'} mb-14`}>
        {cards.map((c,i)=>(
          <motion.div key={c.label} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.06}}
            className={`flex items-start justify-between py-4 border-b ${dark?'border-white/8':'border-black/8'}`}>
            <span className={`text-[10px] tracking-[0.15em] uppercase font-mono w-28 flex-shrink-0 ${dark?'text-white/25':'text-black/25'}`}>{c.label}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-mono ${dark?'text-white':'text-black'}`}>{c.value}</p>
              <p className={`text-[11px] font-mono mt-0.5 ${dark?'text-white/30':'text-black/30'}`}>{c.sub}</p>
            </div>
          </motion.div>
        ))}
        <div className={`flex items-start py-4 border-b ${dark?'border-white/8':'border-black/8'}`}>
          <span className={`text-[10px] tracking-[0.15em] uppercase font-mono w-28 flex-shrink-0 ${dark?'text-white/25':'text-black/25'}`}>Toolkit</span>
          <p className={`text-[11px] leading-relaxed font-mono flex-1 ${dark?'text-white/40':'text-black/40'}`}>
            SolidWorks · Siemens NX · Fusion 360 · FEA · GD&T · DFMA · C++ · Python · MATLAB · ROS · RTOS · STM32 · Arduino · Java · FastAPI · Git · CNC · FDM/SLA · Composites
          </p>
        </div>
      </div>

     {/* Photos */}
<div className="mb-14">
  <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-5 ${dark?'text-white/20':'text-black/20'}`}>
    Photos
  </p>

  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {[1,2,3,4,5,6].map(n => (
      <div
        key={n}
        className={`aspect-square overflow-hidden ${dark?'bg-white/4':'bg-black/4'}`}
      >
        <img
          src={`/images/photo${n}.jpg`}
          alt={`Photo ${n}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</div>

      {/* Interests */}
      <div>
        <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-4 ${dark?'text-white/20':'text-black/20'}`}>Interests</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {interests.map((item)=>(
            <span key={item} className={`text-[11px] font-mono ${dark?'text-white/35':'text-black/35'}`}>{item}</span>
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
      <Label dark={dark}>Writing</Label>
      <h1 className={`font-mono text-3xl md:text-4xl leading-[1.2] mb-14 ${dark?'text-white':'text-black'}`}>Reflecting</h1>
      <div className={`border-t ${dark?'border-white/8':'border-black/8'}`}>
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
          <button data-hover onClick={()=>setOpen(o=>!o)}
            className={`w-full border-b text-left py-7 transition-all duration-150 ${dark?'border-white/8 hover:bg-white/2':'border-black/8 hover:bg-black/2'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className={`text-[10px] tracking-[0.15em] uppercase font-mono ${dark?'text-white/25':'text-black/25'}`}>{WRITING_POST.date}</span>
                  <span className={`text-[10px] tracking-[0.1em] uppercase font-mono ${dark?'text-white/20':'text-black/20'}`}>{WRITING_POST.cat}</span>
                </div>
                <h2 className={`font-mono text-xl md:text-2xl ${dark?'text-white':'text-black'}`}>{WRITING_POST.title}</h2>
                {!open && (
                  <p className={`text-sm mt-2 font-mono ${dark?'text-white/30':'text-black/30'}`}>
                    {paragraphs[0]?.slice(0, 100)}…
                  </p>
                )}
              </div>
              <motion.span animate={{rotate:open?180:0}} transition={{duration:0.25}}
                className={`text-sm flex-shrink-0 mt-1 font-mono ${dark?'text-white/20':'text-black/20'}`}>↓</motion.span>
            </div>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.35,ease:[0.23,1,0.32,1]}} className="overflow-hidden">
                <div className={`py-7 space-y-5 border-b ${dark?'border-white/8':'border-black/8'}`}>
                  {paragraphs.map((para,i)=>(
                    <p key={i} className={`text-sm leading-relaxed font-mono ${dark?'text-white/50':'text-black/50'}`}>{para}</p>
                  ))}
                  <button onClick={()=>setOpen(false)} className={`text-[10px] tracking-[0.12em] uppercase font-mono mt-2 ${dark?'text-white/20 hover:text-white/50':'text-black/20 hover:text-black/50'}`}>↑ Collapse</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Sec>
  )
}

/* ─── 3D PRINTS GALLERY ─────────────────────────────────────── */
function PrintsGallery({dark,onClose}:{dark:boolean;onClose:()=>void}) {
  const [selected,setSelected] = useState<typeof PRINTS[0]|null>(null)
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{background:dark?'rgba(8,8,8,0.98)':'rgba(248,247,244,0.98)',backdropFilter:'blur(20px)'}}>
      <div className="max-w-[860px] mx-auto px-6 md:px-10 py-14">
        <div className="flex items-start justify-between mb-12 gap-4">
          <div>
            <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-3 ${dark?'text-white/25':'text-black/25'}`}>Gallery</p>
            <h2 className={`font-mono text-3xl ${dark?'text-white':'text-black'}`}>3D Printed & Made</h2>
          </div>
          <button data-hover onClick={onClose} className={`text-[10px] tracking-[0.15em] uppercase font-mono transition-all duration-150 ${dark?'text-white/30 hover:text-white/70':'text-black/30 hover:text-black/70'}`}>← Back</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PRINTS.map((pr,i)=>(
            <motion.div key={pr.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              data-hover onClick={()=>setSelected(pr)}
              className={`cursor-pointer group transition-all duration-150 ${dark?'hover:bg-white/3':'hover:bg-black/3'}`}>
              <div className={`aspect-[4/3] overflow-hidden mb-3 ${dark?'bg-white/4':'bg-black/4'}`}>
                <div className={`w-full h-full flex items-center justify-center ${dark?'text-white/15':'text-black/15'}`}>
                  <span className="text-[10px] tracking-widest uppercase font-mono">Add photo</span>
                </div>
              </div>
              <p className={`text-sm font-mono mb-1 ${dark?'text-white':'text-black'}`}>{pr.name}</p>
              <p className={`text-[10px] tracking-[0.08em] uppercase font-mono ${dark?'text-white/25':'text-black/25'}`}>{pr.material}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6"
            style={{background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)'}} onClick={()=>setSelected(null)}>
            <motion.div initial={{scale:0.96,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.96,opacity:0}}
              onClick={e=>e.stopPropagation()}
              className={`max-w-md w-full overflow-hidden ${dark?'bg-[#0a0a0a] border border-white/8':'bg-[#f8f7f4] border border-black/8'}`}>
              <div className={`aspect-[4/3] ${dark?'bg-white/4':'bg-black/4'}`}>
                <div className={`w-full h-full flex items-center justify-center ${dark?'text-white/15':'text-black/15'}`}>◆</div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-mono text-lg ${dark?'text-white':'text-black'}`}>{selected.name}</h3>
                  <button data-hover onClick={()=>setSelected(null)} className={`text-sm ml-4 font-mono ${dark?'text-white/25 hover:text-white/60':'text-black/25 hover:text-black/60'}`}>✕</button>
                </div>
                <p className={`text-[10px] tracking-[0.1em] uppercase font-mono mb-4 ${dark?'text-white/25':'text-black/25'}`}>{selected.material}</p>
                <p className={`text-sm leading-relaxed font-mono ${dark?'text-white/45':'text-black/45'}`}>{selected.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── PROJECT MODAL ─────────────────────────────────────────── */
function ProjectModal({project,dark,onClose}:{project:typeof PROJECTS[0];dark:boolean;onClose:()=>void}) {
  const [idx,setIdx]           = useState(0)
  const [failedImgs,setFailed] = useState<Set<number>>(new Set())
  const imgs    = project.imgs ?? []
  const hasImgs = imgs.length > 0
  const hasVideo= !!project.video

  useEffect(()=>{ setIdx(0); setFailed(new Set()) },[project.id])

  const prev = (e:React.MouseEvent)=>{ e.stopPropagation(); setIdx(i=>(i-1+imgs.length)%imgs.length) }
  const next = (e:React.MouseEvent)=>{ e.stopPropagation(); setIdx(i=>(i+1)%imgs.length) }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[200] flex items-center justify-center p-5 md:p-10"
      style={{background:'rgba(0,0,0,0.8)',backdropFilter:'blur(12px)'}}
      onClick={onClose}>
      <motion.div initial={{scale:0.94,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.94,opacity:0,y:8}}
        transition={{duration:0.3,ease:[0.23,1,0.32,1]}}
        onClick={e=>e.stopPropagation()}
        className={`w-full max-w-xl overflow-hidden max-h-[90vh] overflow-y-auto ${dark?'bg-[#0a0a0a] border border-white/8':'bg-[#f8f7f4] border border-black/8'}`}>

        {hasImgs && (
          <div className="relative bg-black" style={{aspectRatio:'16/9'}}>
            <AnimatePresence mode="wait">
              {failedImgs.has(idx) ? (
                <motion.div key={`fallback-${idx}`}
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="w-full h-full flex flex-col items-center justify-center gap-2"
                  style={{color:'rgba(255,255,255,0.15)'}}>
                  <span className="text-lg font-mono">◆</span>
                  <span className="text-[9px] tracking-[0.15em] uppercase font-mono">Photo not found</span>
                </motion.div>
              ) : (
                <motion.img key={idx} src={imgs[idx]} alt={`${project.name} ${idx+1}`}
                  initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                  transition={{duration:0.2,ease:[0.23,1,0.32,1]}}
                  className="w-full h-full object-cover"
                  onError={()=>setFailed(prev=>new Set(prev).add(idx))}
                />
              )}
            </AnimatePresence>
            {imgs.length>1&&(<>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-colors font-mono">‹</button>
              <button onClick={next} className="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-colors font-mono">›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imgs.map((_,i)=>(
                  <button key={i} onClick={e=>{e.stopPropagation();setIdx(i)}}
                    className={`rounded-full transition-all duration-200 ${i===idx?'w-4 h-1 bg-white':'w-1 h-1 bg-white/40 hover:bg-white/70'}`}/>
                ))}
              </div>
              <div className="absolute top-3 right-10 text-[9px] font-mono text-white/50 bg-black/50 px-2 py-0.5">{idx+1}/{imgs.length}</div>
            </>)}
            <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-xs font-mono text-white/50 hover:text-white bg-black/50 transition-colors">✕</button>
          </div>
        )}

        {!hasImgs && (
          <div className={`relative h-48 flex flex-col items-center justify-center gap-2 ${dark?'bg-white/3':'bg-black/3'}`}>
            <span className={`text-lg font-mono ${dark?'text-white/15':'text-black/15'}`}>◆</span>
            <span className={`text-[9px] tracking-widest uppercase font-mono ${dark?'text-white/15':'text-black/15'}`}>Add photo</span>
            <button onClick={onClose} className="absolute top-3 right-3 text-xs font-mono text-white/40 hover:text-white/70">✕</button>
          </div>
        )}

        {hasVideo && (
          <div style={{aspectRatio:'16/9'}}>
            <iframe src={project.video!} className="w-full h-full" style={{border:0}}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className={`font-mono text-xl leading-tight ${dark?'text-white':'text-black'}`}>{project.name}</h2>
            <span className={`text-[9px] tracking-[0.1em] uppercase font-mono flex-shrink-0 mt-1 ${dark?'text-white/25':'text-black/25'}`}>{project.stat}</span>
          </div>
          <div className="flex flex-wrap gap-3 mb-5">
            {project.tags.map(tg=><span key={tg} className={`text-[9px] tracking-[0.1em] uppercase font-mono ${dark?'text-white/25':'text-black/25'}`}>{tg}</span>)}
          </div>
          <p className={`text-sm leading-relaxed font-mono ${dark?'text-white/50':'text-black/50'}`}>{project.detail}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── PROJECTS ──────────────────────────────────────────────── */
function ProjectsSection({dark}:{dark:boolean}) {
  const [showGallery,setShowGallery] = useState(false)
  const [selected,setSelected]       = useState<typeof PROJECTS[0]|null>(null)
  const handleClick=(p:typeof PROJECTS[0])=>{ if(p.gallery){ setShowGallery(true) } else { setSelected(p) } }

  return (
    <>
      <AnimatePresence>{showGallery&&<PrintsGallery dark={dark} onClose={()=>setShowGallery(false)}/>}</AnimatePresence>
      <AnimatePresence>{selected&&<ProjectModal project={selected} dark={dark} onClose={()=>setSelected(null)}/>}</AnimatePresence>
      <Sec>
        <Label dark={dark}>Projects</Label>
        <h1 className={`font-mono text-3xl md:text-4xl leading-[1.2] mb-14 ${dark?'text-white':'text-black'}`}>Things I've made.</h1>

        {/* Table-style project list */}
        <div className={`border-t ${dark?'border-white/8':'border-black/8'}`}>
          {PROJECTS.map((p,i)=>(
            <motion.div key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.07}}
              data-hover onClick={()=>handleClick(p)}
              className={`border-b cursor-pointer transition-all duration-150 group ${dark?'border-white/8 hover:bg-white/2':'border-black/8 hover:bg-black/2'}`}>
              <div className="py-5 flex items-center gap-5">
                {/* Thumbnail */}
                <div className={`w-16 h-12 flex-shrink-0 overflow-hidden ${dark?'bg-white/5':'bg-black/5'}`}>
                  {p.imgs?.[0]
                    ? <img src={p.imgs[0]} alt={p.name} className="w-full h-full object-cover"
                        onError={e=>{const el=e.currentTarget;el.style.display='none'}}/>
                    : <div className={`w-full h-full flex items-center justify-center ${dark?'text-white/15':'text-black/15'}`}><span className="text-xs font-mono">◆</span></div>
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-mono mb-1 ${dark?'text-white':'text-black'}`}>{p.name}</p>
                  <p className={`text-[11px] font-mono leading-snug ${dark?'text-white/30':'text-black/30'}`}>{p.desc}</p>
                </div>
                {/* Meta */}
                <div className="hidden sm:flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] tracking-[0.08em] uppercase font-mono ${dark?'text-white/20':'text-black/20'}`}>{p.stat}</span>
                  {p.video && <span className={`text-[9px] font-mono ${dark?'text-white/20':'text-black/20'}`}>▷ video</span>}
                  {p.imgs && p.imgs.length>1 && <span className={`text-[9px] font-mono ${dark?'text-white/20':'text-black/20'}`}>{p.imgs.length} photos</span>}
                </div>
                <span className={`text-xs font-mono flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1 ${dark?'text-white/20':'text-black/20'}`}>→</span>
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
    {label:'Swim',     desc:'Form swims, Aerobic swims, All out Hard swims'},
    {label:'Bike',     desc:'Indoor Zone 2 bikes, Outdoor race pace bikes, and VO2 Max Threshold Bikes'},
    {label:'Run',      desc:'Interval, Tempo, and easy Runs'},
    {label:'Strength', desc:'Anterior, Posterior, Upper'},
  ]
  const externalLinks = [
    {label:'Training Tracker', sub:'Full workout log',      href:GYM_TRACKER_URL},
    {label:'Strava',           sub:'Run & ride activity',   href:STRAVA_URL},
    {label:'Garmin Connect',   sub:'GPS & health data',     href:GARMIN_URL},
    {label:'Spotify',          sub:"What I'm listening to", href:SPOTIFY_URL},
  ]
  return (
    <Sec>
      <Label dark={dark}>Training</Label>
      <h1 className={`font-mono text-3xl md:text-4xl leading-[1.2] mb-4 ${dark?'text-white':'text-black'}`}>Gym, Golf & Ironman.</h1>
      <p className={`text-sm leading-relaxed max-w-md mb-14 font-mono ${dark?'text-white/40':'text-black/40'}`}>
        Outside of engineering I'm either at the gym, on a golf course, or training for races.
        Obsessed with constant improvement — it keeps my headspace level.
      </p>

      {/* Links as rows */}
      <div className={`border-t mb-14 ${dark?'border-white/8':'border-black/8'}`}>
        {externalLinks.map((l,i)=>(
          <motion.a key={l.label} href={l.href} target="_blank" rel="noreferrer" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1+i*0.06}} data-hover
            className={`flex items-center justify-between py-4 border-b group transition-all duration-150 ${dark?'border-white/8 hover:bg-white/2':'border-black/8 hover:bg-black/2'}`}>
            <div>
              <p className={`text-sm font-mono ${dark?'text-white':'text-black'}`}>{l.label}</p>
              <p className={`text-[11px] font-mono ${dark?'text-white/30':'text-black/30'}`}>{l.sub}</p>
            </div>
            <span className={`text-xs font-mono transition-transform duration-150 group-hover:translate-x-1 ${dark?'text-white/20':'text-black/20'}`}>→</span>
          </motion.a>
        ))}
      </div>

      {/* Golf */}
      <div className="mb-14">
        <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-6 ${dark?'text-white/20':'text-black/20'}`}>Golf</p>
        <div className="flex items-start gap-8 mb-8 flex-wrap">
          <div>
            <p className={`text-[10px] tracking-[0.15em] uppercase font-mono mb-1 ${dark?'text-white/25':'text-black/25'}`}>Handicap</p>
            <p className={`font-mono text-5xl ${dark?'text-white':'text-black'}`}>8.6</p>
          </div>
          <p className={`text-sm leading-relaxed font-mono flex-1 min-w-[200px] ${dark?'text-white/40':'text-black/40'}`}>
            Been playing consistently for 2 years. Great way to take the load off and compete with buddies. Easily one of my favourite hobbies.
          </p>
        </div>
        <div className={`overflow-hidden ${dark?'bg-black':'bg-black'}`} style={{aspectRatio:'16/9'}}>
          <iframe src="https://www.youtube.com/embed/iriOazO32T0" className="w-full h-full" style={{border:0}}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
      </div>

      {/* Ironman */}
      <div className="mb-14">
        <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-6 ${dark?'text-white/20':'text-black/20'}`}>Ironman Training</p>
        <div className={`border-t ${dark?'border-white/8':'border-black/8'}`}>
          {disciplines.map((d,i)=>(
            <motion.div key={d.label} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15+i*0.06}}
              className={`flex items-center justify-between py-4 border-b ${dark?'border-white/8':'border-black/8'}`}>
              <p className={`text-sm font-mono ${dark?'text-white':'text-black'}`}>{d.label}</p>
              <p className={`text-[11px] font-mono ${dark?'text-white/30':'text-black/30'}`}>{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Races */}
      <div>
        <p className={`text-[10px] tracking-[0.2em] uppercase font-mono mb-6 ${dark?'text-white/20':'text-black/20'}`}>Races</p>
        <div className={`border-t ${dark?'border-white/8':'border-black/8'}`}>
          {RACES.map((r,i)=>(
            <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2+i*0.06}}
              className={`flex items-center justify-between py-4 border-b ${dark?'border-white/8':'border-black/8'}`}>
              <div>
                <p className={`text-sm font-mono ${dark?'text-white':'text-black'}`}>{r.name}</p>
                <p className={`text-[11px] font-mono mt-0.5 ${dark?'text-white/30':'text-black/30'}`}>{r.date}</p>
              </div>
              <span className={`text-[9px] tracking-[0.12em] uppercase font-mono ${r.status==='completed'?(dark?'text-emerald-400':'text-emerald-600'):(dark?'text-white/20':'text-black/20')}`}>
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
      const res = await fetch('https://formspree.io/f/mlgzgjon',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(form)})
      if(res.ok){ setStatus('sent'); setForm({name:'',email:'',message:''}) } else setStatus('error')
    } catch { window.location.href=`mailto:adindiga@uwaterloo.ca?subject=Message from ${form.name}&body=${form.message}`; setStatus('idle') }
  }
  const inp=`w-full border-b px-0 py-3 text-sm font-mono outline-none transition-all duration-150 bg-transparent ${dark?'border-white/10 text-white placeholder-white/20 focus:border-white/40':'border-black/10 text-black placeholder-black/20 focus:border-black/40'}`
  return (
    <Sec>
      <Label dark={dark}>Connect</Label>
      <h1 className={`font-mono text-3xl md:text-4xl leading-[1.2] mb-4 ${dark?'text-white':'text-black'}`}>Let's talk.</h1>
      <p className={`text-sm leading-relaxed max-w-sm mb-14 font-mono ${dark?'text-white/40':'text-black/40'}`}>
        Feel free to reach out. Always stoked to talk to someone new.
      </p>
      <div className="flex gap-6 mb-16">
        {[{label:'Email',href:'mailto:adindiga@uwaterloo.ca'},{label:'LinkedIn',href:'https://www.linkedin.com/in/arjundindigal'}].map(l=>(
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" data-hover
            className={`text-sm font-mono transition-all duration-150 group flex items-center gap-1.5 ${dark?'text-white/40 hover:text-white':'text-black/40 hover:text-black'}`}>
            {l.label}<span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </a>
        ))}
      </div>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
        {status==='sent'?(
          <div className="py-12">
            <p className={`font-mono text-2xl mb-2 ${dark?'text-white':'text-black'}`}>Sent.</p>
            <p className={`text-sm font-mono ${dark?'text-white/40':'text-black/40'}`}>I'll get back to you soon.</p>
            <button onClick={()=>setStatus('idle')} className={`mt-6 text-[10px] tracking-[0.12em] uppercase font-mono ${dark?'text-white/25 hover:text-white/60':'text-black/25 hover:text-black/60'}`}>Send another →</button>
          </div>
        ):(
          <form onSubmit={handleSubmit} className="space-y-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-8">
              <input required placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inp}/>
              <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inp}/>
            </div>
            <textarea required rows={5} placeholder="Message" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} className={`${inp} resize-none mt-0`}/>
            <div className="flex items-center justify-between pt-6">
              {status==='error'&&<p className="text-xs font-mono text-red-400">Something went wrong.</p>}
              <div className="flex-1"/>
              <button type="submit" disabled={status==='sending'} data-hover
                className={`text-[10px] tracking-[0.15em] uppercase font-mono transition-all duration-150 ${dark?'text-white/40 hover:text-white disabled:opacity-20':'text-black/40 hover:text-black disabled:opacity-20'}`}>
                {status==='sending'?'Sending…':'Send →'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </Sec>
  )
}

/* ─── FOOTER ────────────────────────────────────────────────── */
function Footer({dark}:{dark:boolean}) {
  return (
    <div className={`border-t ${dark?'border-white/5':'border-black/5'}`}>
      <div className="max-w-[800px] mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className={`text-[10px] tracking-[0.12em] uppercase font-mono ${dark?'text-white/15':'text-black/15'}`}>Arjun Dindigal · 2026</span>
        <div className="flex gap-6">
          {[{label:'LinkedIn',href:'https://www.linkedin.com/in/arjundindigal'},{label:'Resume',href:'/resume.pdf'},{label:'Email',href:'mailto:adindiga@uwaterloo.ca'}].map(l=>(
            <a key={l.label} href={l.href} target={l.href.startsWith('http')?'_blank':undefined} rel="noreferrer" data-hover
              className={`text-[10px] tracking-[0.12em] uppercase font-mono transition-all duration-150 ${dark?'text-white/20 hover:text-white/60':'text-black/20 hover:text-black/60'}`}>{l.label}</a>
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
    <div className={`min-h-screen transition-colors duration-400 ${dark?'bg-[#080808] text-white':'bg-[#f8f7f4] text-black'}`}>
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
