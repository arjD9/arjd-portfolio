'use client'
import { useEffect, useRef, useState } from 'react'
import { Cormorant_Garamond, Inter } from 'next/font/google'

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-display' })
const sans = Inter({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-sans' })

const D = { fontFamily: 'var(--font-display), Georgia, serif' }
const S = { fontFamily: 'var(--font-sans), system-ui, sans-serif' }

/* ─── DATA ──────────────────────────────────────────────────── */

const EMAIL = 'adindiga@uwaterloo.ca'
const LINKEDIN = 'https://www.linkedin.com/in/arjundindigal'
const RESUME = '/resume.pdf'

type Experience = { id: string; company: string; role: string; year: string; date: string; location: string; bullets: string[] }

const EXPERIENCES: Experience[] = [
  {
    id: 'linamar-toronto', company: 'Linamar Corporation', role: 'Mechanical Design Engineering Intern, Automation & Tooling', year: '2026 –',
    date: 'Sept 2026 – Present', location: 'Toronto, ON',
    bullets: [
      'Designed and released 5 EOAT systems and 3 production fixtures for ABB robotic welding and automation cells.',
      'Supported the design and integration of 8+ mechanical assemblies, resolving design, interference, and packaging constraints.',
      'Performed structural, payload, and mounting analyses to validate tooling against robot and application requirements.',
      'Generated CAD models, GD&T drawings, BOMs, and manufacturing documentation for fabrication and integration.',
      'Supported commissioning, troubleshooting, and deployment of production equipment with cross-functional teams.',
    ],
  },
  {
    id: 'watonomous', company: 'WATonomous', role: 'Mechanical Engineer, Humanoid Team', year: '2026 –',
    date: 'May 2026 – Present', location: 'Waterloo, ON',
    bullets: [
      'Designed humanoid arm and forearm assemblies in Onshape, applying GD&T and FEA before fabrication.',
      'Performed actuator selection and sizing using torque, packaging, backdrivability, and range-of-motion requirements.',
      'Built and tested 3D-printed prototypes to validate joint geometry, component fit, and mechanical integration.',
      'Integrated hardware across mechanical, electrical, and ROS 2 interfaces, resolving issues through structured validation testing.',
    ],
  },
  {
    id: 'linamar', company: 'Linamar Corporation', role: 'Mechanical Design Engineering Intern', year: '2026',
    date: 'Jan 2026 – May 2026', location: 'Guelph, ON',
    bullets: [
      'Designed and validated 10+ production fixtures using SolidWorks, GD&T, and DFMA principles.',
      'Reduced cycle times by 20–40 seconds per operation through fixture redesigns and ergonomic process improvements.',
      'Reverse engineered failed electromechanical and robotic components, releasing replacement hardware to restore production uptime.',
      'Reduced defective parts by 10%+ through fixture redesigns, cycle studies, and improved part-handling methods.',
      'Delivered designs from concept through fabrication, validation, and production deployment.',
    ],
  },
  {
    id: 'rocketry', company: 'Waterloo Rocketry', role: 'Mechanical Engineer', year: '2025',
    date: 'Aug 2025 – Jan 2026', location: 'Waterloo, ON',
    bullets: [
      'Built test fixtures and camera systems for 10+ static engine tests with real-time telemetry.',
      'Designed 3D-printed enclosures and support structures for harsh testing environments.',
      'Assembled and calibrated propulsion systems within 5% of predicted thrust.',
    ],
  },
  {
    id: 'pratyin', company: 'Pratyin Infotech Consulting', role: 'Software Development Intern', year: '2025',
    date: 'May 2025 – Aug 2025', location: 'Toronto, ON',
    bullets: [
      'Java + FastAPI integration syncing 5,000+ invoices with 99.7% accuracy.',
      'Automated Python data pipelines processing 200,000 records/month, cutting manual work by 20%.',
      'Shipped 2 production-ready features in 2 months, zero critical bugs deployed.',
    ],
  },
]

type Item = {
  id: string
  name: string
  line: string
  meta?: string
  detail: string
  imgs: string[]
  video?: string | null
  parts?: Item[]
}

// ─── ADD NEW PARTS HERE ──────────────────────────────────────
// 1. Drop photos into /public/images/prints/
// 2. Copy one object below, paste at the end, update id / name / line / detail / imgs
const PARTS: Item[] = [
  {
    id: 'p1', name: 'Custom Keychain', line: 'Aluminum · Plastic', meta: 'Aluminum · Plastic',
    detail: 'Designed and manufactured a custom aluminum keychain assembly from concept to production by developing detailed CAD models and engineering drawings, then machining the components using manual mill and lathe operations. Applied GD&T principles, precision drilling, tapping, deburring, and assembly techniques while maintaining dimensional accuracy, manufacturability, and high-quality surface finishes throughout the fabrication process.',
    imgs: ['/images/prints/keychain-01.jpeg', '/images/prints/keychain-02.jpeg', '/images/prints/keychain-03.png', '/images/prints/keychain-04.png', '/images/prints/keychain-05.png', '/images/prints/keychain-06.png', '/images/prints/keychain-07.png'],
  },
  {
    id: 'p2', name: 'Spring Holder', line: 'Aluminum · Plastic', meta: 'Aluminum · Plastic',
    detail: 'Designed a wall-mounted spring holder assembly in SolidWorks to improve operator accessibility and reduce production cycle time by enabling faster spring retrieval at the workstation. Developed a two-component design with threaded fastening features and coordinated with the tool room on manufacturing tolerances, fitment, and fabrication considerations to ensure reliable assembly, durability, and manufacturability in a production environment.',
    imgs: ['/images/prints/springholder-01.jpg', '/images/prints/springholder-02.jpg', '/images/prints/springholder-03.jpg', '/images/prints/springholder-04.jpg'],
  },
  {
    id: 'p3', name: 'Shaft Holder', line: 'PETG', meta: 'PETG',
    detail: 'Designed and developed a wall-mounted shaft holder to improve workplace organization and operator efficiency by keeping critical components directly at the workstation. Modeled the assembly in SolidWorks and manufactured it using PETG 3D printing, optimizing the design for durability, ease of installation, and practical use within a production environment.',
    imgs: ['/images/prints/shaftholder-01.jpg', '/images/prints/shaftholder-02.jpg', '/images/prints/shaftholder-03.jpg'],
  },
  {
    id: 'p4', name: 'Sanding Ring', line: 'PETG · Heat Treated 4140 Steel', meta: 'PETG · Heat Treated 4140 Steel',
    detail: 'Designed and developed a protective sanding ring fixture to prevent damage to welded shaft assemblies during post-weld finishing operations. Identified a recurring production issue where operators were scratching parts while sanding weld overlap areas, leading to scrap and increased costs. Iterated through 4–5 design revisions using rapid PETG 3D-printed prototypes before finalizing a production-ready solution that improved protection, usability, and overall manufacturing efficiency while reducing part damage and associated losses.',
    imgs: ['/images/prints/pturing-01.jpg', '/images/prints/pturing-02.jpg', '/images/prints/pturing-03.jpg', '/images/prints/pturing-04.jpg'],
  },
  {
    id: 'p5', name: 'Chuck Key Holder', line: 'PLA', meta: 'PLA',
    detail: 'Designed and manufactured a dedicated chuck key holder to improve workplace organization and accessibility within the shop environment. Created the model in SolidWorks and produced the final part using high-infill PLA 3D printing to ensure durability and reliable daily use, eliminating clutter and preventing chuck keys from being misplaced or falling around the workstation.',
    imgs: ['/images/prints/chuckholder-01.jpg', '/images/prints/chuckholder-02.jpg'],
  },
  {
    id: 'p6', name: 'Gauge Holder', line: 'Carbon Fibre PLA', meta: 'Carbon Fibre PLA',
    detail: 'Designed a customizable gauge holder in SolidWorks to reduce tool loss and damage caused by operators frequently dropping or misplacing gauges on the production floor. Developed a parameterized design with adjustable gauge spacing based on total length requirements, allowing the model to be quickly modified and 3D printed in carbon fiber PLA for different gauge sizes while improving durability, organization, and manufacturing efficiency.',
    imgs: ['/images/prints/guageholder-01.jpg'],
  },
  {
    id: 'p7', name: 'Reverse Engineered Robotic Gripper', line: 'Steel', meta: 'Steel',
    detail: 'Reverse engineered a robotic arm gripper by taking precise measurements using vernier calipers and recreating the full assembly in SolidWorks to match existing geometry and functionality. Designed and manufactured a replacement gripper in aluminum using milling and machining processes to restore functionality while waiting for an official replacement, ensuring minimal downtime in production and maintaining operational continuity.',
    imgs: ['/images/prints/arm-01.jpg', '/images/prints/arm-02.jpeg'],
  },
  {
    id: 'p8', name: 'Temperature Sensor Holder', line: 'PLA · FDM', meta: 'PLA · FDM',
    detail: 'Collaborated with a quality engineer to address an issue where temperature sensors were being improperly stored, causing washers to fall off and leading to inefficiencies and material loss. Measured the operation and sensor assembly using precision tools, then designed a universal temperature sensor holder in SolidWorks. Manufactured the solution using carbon fiber PLA 3D printing with over 25 slots to accommodate multiple sensor types, improving organization, reducing part loss, saving operator time, and providing a standardized storage solution for future use.',
    imgs: ['/images/prints/tempsensor-01.jpg', '/images/prints/tempsensor-02.jpg'],
  },
  {
    id: 'p9', name: 'Reverse Engineered Nozzle', line: 'Copper', meta: 'Copper',
    detail: 'A weld nozzle on a production line failed and the original drawing had incomplete dimensions, so I reverse engineered the part by taking measurements, performing calculations, and reconstructing the full geometry in SolidWorks. I then optimized the design to slightly reduce material usage while maintaining functionality, created a complete manufacturing drawing for the machine shop, and coordinated fabrication. The replacement weld nozzle was produced and returned to service within one day, minimizing downtime and restoring production quickly.',
    imgs: ['/images/prints/nozzle-01.jpg', '/images/prints/nozzle-02.jpg'],
  },
  {
    id: 'p10', name: 'Chuck Key Organization Plate', line: 'Carbon Fibre PLA', meta: 'Carbon Fibre PLA',
    detail: 'Identified an organization issue on a weld line where chuck keys for different operations were frequently misplaced, leading to downtime and inefficiency. Designed and 3D printed carbon fiber PLA organization plates for three distinct operations, incorporating engraved labels for clear identification and structured storage. The solution improved tool organization, reduced lost equipment, and made it easier for operators to quickly return chuck keys to the correct location, increasing overall workflow efficiency.',
    imgs: ['/images/prints/organization-01.jpg', '/images/prints/organization-02.jpg', '/images/prints/organization-03.jpg', '/images/prints/organization-04.jpg'],
  },
  {
    id: 'p11', name: 'Pinion Housing', line: 'Delrin', meta: 'Delrin',
    detail: 'Designed a pinion holder in SolidWorks and manufactured it from Delrin to improve the safe handling and transportation of pinions on the shop floor. The holder was integrated onto a cart-based system to allow operators to move multiple pinions efficiently between workstations while preventing damage, improving organization, and reducing handling time during production.',
    imgs: ['/images/prints/pinionholder-01.jpeg', '/images/prints/pinionholder-02.jpeg', '/images/prints/pinionholder-03.jpeg'],
  },
  {
    id: 'p12', name: 'Ring Gear Housing', line: 'ABS', meta: 'ABS',
    detail: 'Designed and 3D printed ABS holders for two different ring gear challenge parts to improve organization and handling on the weld machine. The holders were engineered to fit precisely within an existing enclosure and included a sliding, snug-fit geometry to securely locate the ring gears during operation. ABS was selected for its heat resistance due to elevated part temperatures during production, reducing scattering, improving workflow efficiency, and ensuring consistent, repeatable part placement on the machine.',
    imgs: ['/images/prints/rdmptuholder-01.jpg', '/images/prints/rdmptuholder-02.jpg', '/images/prints/rdmptuholder-03.jpg', '/images/prints/rdmptuholder-04.jpg'],
  },
]

const PROJECTS: Item[] = [
  {
    id: 'vex', name: 'Autonomous VEX Retrieval Bot', line: 'PID control, sensor fusion, custom chassis', meta: 'C++ · PID · Sensor fusion · CAD',
    detail: 'Designed and built an autonomous robotic system for a school engineering project focused on solving a structured object retrieval scenario under constrained time and performance conditions. Led the mechanical design of the robot including a custom chassis, drivetrain architecture, and a mechanically actuated elevator system used for lifting and placing objects. Engineered gear ratios, torque transmission paths, and structural supports to ensure stable and repeatable motion during autonomous operation. Manufactured and assembled 8+ custom CAD-designed components, iterating on weight distribution, rigidity, and system layout to improve efficiency and reliability. Achieved 15% overall weight reduction through structural optimization while maintaining mechanical strength. Autonomous performance was supported through PID control and sensor fusion algorithms, resulting in 98% turn accuracy and 92% object retrieval success, with consistent performance across repeated test runs.',
    imgs: ['/images/vex-01.jpg', '/images/vex-02.jpeg', '/images/vex-03.jpeg', '/images/vex-04.jpg', '/images/vex-05.jpg', '/images/vex-06.jpg', '/images/vex-07.jpg', '/images/vex-08.jpg', '/images/vex-09.jpg'],
    video: 'https://www.youtube.com/embed/U5MgGNN_4Jk?si=gar5LqpS8Pg7ZvK1',
  },
  {
    id: 'cart', name: 'Reverse Engineered Regress Cart', line: '100+ kg production cart, redesigned with DFMA', meta: 'Siemens NX · SolidWorks · DFMA · GD&T',
    detail: 'Reverse-engineered an industrial production cart used in a real operational environment and redesigned it using DFMA principles to reduce mechanical complexity, improve manufacturability, and enhance technician usability. Developed full CAD models in SolidWorks and Siemens NX, iterating through multiple design revisions focused on structural efficiency and ease of assembly. Produced detailed GD&T manufacturing drawings and worked directly with machinists to coordinate fabrication using waterjet cutting processes. The final system was a 100+ kg load-bearing cart that improved workflow efficiency by reducing assembly time, minimizing part count, and optimizing ergonomic interaction points for end users while maintaining structural integrity under industrial use conditions.',
    imgs: ['/images/cart-01.jpg', '/images/cart-02.jpg', '/images/cart-03.png', '/images/cart-04.jpg'],
    video: 'https://www.youtube.com/embed/2CA7vmuQ3vw',
  },
  {
    id: 'gauge', name: 'Runout Gauge', line: 'Bearing-supported inspection gauge, deployed in production', meta: 'SolidWorks · FDM · Tolerance analysis',
    detail: 'Designed a custom runout gauge for in-process quality inspection on the shop floor at Linamar, taking the project from initial SolidWorks CAD design through FDM rapid prototyping for fit and functional validation, followed by final machining in aluminum for production deployment. Iterated the design from an initial concept where rotation occurred directly on a gear surface to a refined bearing-supported puck and housing system, eliminating surface-induced vibration and improving rotational smoothness and measurement consistency. Developed approximately 8 custom components including structural housing, alignment features, and bearing interfaces, ensuring manufacturability through collaboration with tool room and shop floor machinists. Validated measurement repeatability by benchmarking against coordinate measuring machine (CMM) data, confirming high accuracy performance. Successfully deployed into production use, significantly improving inspection reliability and reducing per-part inspection time in a live manufacturing environment.',
    imgs: ['/images/runout-01.jpeg', '/images/runout-02.jpeg', '/images/runout-03.jpg', '/images/runout-04.jpg', '/images/runout-05.jpg', '/images/runout-06.jpeg', '/images/runout-07.jpeg'],
    video: 'https://www.youtube.com/embed/CsTB8vzFzGU',
  },
  {
    id: 'stairs', name: 'Welded Stairs', line: 'Load-tested industrial access structure', meta: 'SolidWorks weldments · Fabrication · Structural',
    detail: 'Designed and iterated a welded steel stair and platform system to improve industrial line access, using SolidWorks weldments and sheet metal tools to develop multiple design configurations including straight, L-shaped, and platform-based layouts. Performed full structural layout from first principles, defining stringer geometry, tread bracket positioning, and load paths to ensure safe and ergonomic access between production areas. Produced detailed fabrication drawings and coordinated directly with the weldment team and shop floor personnel to support manufacturing and assembly of the final structure. While fabrication was executed by the welding team, led all CAD modeling, design iteration, and engineering documentation to ensure accuracy and manufacturability. The final structure was physically load-tested above expected design conditions, validated for structural integrity, and finished with protective primer and paint for long-term industrial use.',
    imgs: ['/images/stairs-01.jpg', '/images/stairs-02.jpg', '/images/stairs-03.jpg', '/images/stairs-04.jpg', '/images/stairs-05.jpg', '/images/stairs-06.jpg', '/images/stairs-07.jpg', '/images/stairs-08.jpg', '/images/stairs-09.jpg', '/images/stairs-10.jpg', '/images/stairs-11.jpg'],
  },
  {
    id: 'parts', name: 'Printed & Machined Parts', line: 'Fixtures, holders and replacements made on the shop floor',
    detail: 'An ongoing collection of parts designed and made across different projects: enclosures, jigs, brackets, and custom hardware. Materials range from PLA and ABS to PETG, carbon fibre PLA, Delrin, aluminum and copper.',
    imgs: ['/images/prints/tempsensor-01.jpg'], parts: PARTS,
  },
]

const TOOLKIT = 'SolidWorks (Weldments, Sheet Metal, PDM, FEA), Fusion 360, Onshape, Siemens NX, AutoCAD, Inventor, GD&T, DFMA, Machining, FDM/SLA, Fixture Design, Python, MATLAB, C/C++ (ESP32), Linux, Git, STM32, ROS'
const INTERESTS = 'Robotics, rocketry, manufacturing, triathlon, golf, lifting, photography'

const GYM_TRACKER_URL = 'https://docs.google.com/spreadsheets/d/1n55fCkjTbq4fRDdX-duE-72flZUlar5hGinjMlM436Y/view?usp=sharing'
const STRAVA_URL = 'https://www.strava.com/athletes/arjundindigal'
const SPOTIFY_URL = 'https://open.spotify.com/user/arjundindigal?si=d149e66474c34a82'

const DISCIPLINES = [
  ['Swim', 'Continuous swim technique, easy swim, aerobic swim'],
  ['Bike', 'Long, threshold, zone 2, aero lock'],
  ['Run', 'Tempo, long, brick run'],
  ['Strength', 'Anterior, posterior, upper'],
  ['Weekly volume', 'Around 10–15 hours per week'],
]

const PRS = [
  ['5K', '19:30'],
  ['10K', '42:00'],
  ['Half marathon', '1:31'],
  ['Marathon', '3:14'],
]

const RACING = [
  ['IRONMAN 70.3 La Quinta', 'December 6, 2026', 'Next race'],
  ['IRONMAN Barcelona 140.6', '2027', 'Training for'],
]

type Section = 'home' | 'about' | 'projects' | 'training'

/* ─── SMALL PIECES ──────────────────────────────────────────── */

const muted = 'text-[#8f897a]'
const linkCls = 'underline decoration-[#ece6d8]/15 underline-offset-[5px] transition-colors duration-200 hover:decoration-[#ece6d8]/60'

function Back({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`mb-16 text-[13px] transition-colors duration-200 hover:text-[#ece6d8] ${muted}`} style={S}>
      ← {label}
    </button>
  )
}

function Gallery({ imgs, alt }: { imgs: string[]; alt: string }) {
  const [i, setI] = useState(0)
  const [bad, setBad] = useState<Set<number>>(new Set())
  if (!imgs.length) return null
  const step = (d: number) => setI(n => (n + d + imgs.length) % imgs.length)
  return (
    <div className="mb-10">
      <div className="relative aspect-[3/2] overflow-hidden bg-[#211f1a]">
        {bad.has(i) ? (
          <div className={`flex h-full w-full items-center justify-center text-[12px] ${muted}`} style={S}>Photo not found</div>
        ) : (
          <img
            key={i}
            src={imgs[i]}
            alt={`${alt} ${i + 1}`}
            className="fade h-full w-full object-cover"
            onError={() => setBad(prev => new Set(prev).add(i))}
          />
        )}
      </div>
      {imgs.length > 1 && (
        <div className={`mt-3 flex items-center justify-between text-[12px] ${muted}`} style={S}>
          <button onClick={() => step(-1)} className="transition-colors hover:text-[#ece6d8]">← Prev</button>
          <span>{i + 1} / {imgs.length}</span>
          <button onClick={() => step(1)} className="transition-colors hover:text-[#ece6d8]">Next →</button>
        </div>
      )}
    </div>
  )
}

function Detail({ item }: { item: Item }) {
  return (
    <div className="fade">
      <h1 className="mb-2 text-[38px] font-light leading-[1.1] tracking-tight" style={D}>{item.name}</h1>
      {item.meta && <p className={`mb-10 text-[13px] ${muted}`} style={S}>{item.meta}</p>}
      <Gallery key={item.id} imgs={item.imgs} alt={item.name} />
      {item.video && (
        <div className="mb-10 aspect-video">
          <iframe
            src={item.video}
            title={item.name}
            className="h-full w-full"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <p className="text-[14px] font-light leading-[1.8] text-[#c9c3b4]" style={S}>{item.detail}</p>
    </div>
  )
}

/* A small photo that trails the cursor while a project title is hovered (mouse devices only). */
function HoverPreview({ src }: { src: string | null }) {
  const box = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, init: false })
  const [ok, setOk] = useState(true)
  useEffect(() => { setOk(true) }, [src])
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let raf = 0
    const move = (e: MouseEvent) => {
      const p = pos.current
      p.tx = e.clientX; p.ty = e.clientY
      if (!p.init) { p.x = e.clientX; p.y = e.clientY; p.init = true }
    }
    const tick = () => {
      const p = pos.current
      p.x += (p.tx - p.x) * 0.12
      p.y += (p.ty - p.y) * 0.12
      if (box.current) box.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 90}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', move)
    tick()
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
      style={{ opacity: src && ok ? 1 : 0, transition: 'opacity .25s ease' }}
    >
      <div className="h-[150px] w-[220px] overflow-hidden bg-[#211f1a]">
        {src && <img src={src} alt="" className="h-full w-full object-cover" onError={() => setOk(false)} />}
      </div>
    </div>
  )
}

/* ─── HOME ──────────────────────────────────────────────────── */

function Home({ go }: { go: (s: Section) => void }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="fade">
      <h1 className="mb-6 text-[56px] font-light leading-none tracking-tight md:text-[68px]" style={D}>Arjun Dindigal</h1>
      <div className="mb-24 space-y-1 text-[15px] font-light" style={S}>
        <p>Mechatronics Engineering</p>
        <p>University of Waterloo</p>
        <p className={muted}>Seeking summer 2027 opportunities</p>
      </div>

      <div className="mb-24">
        {EXPERIENCES.map(e => {
          const isOpen = open === e.id
          return (
            <div key={e.id}>
              <button
                onClick={() => setOpen(isOpen ? null : e.id)}
                aria-expanded={isOpen}
                className="group flex w-full items-baseline justify-between gap-6 py-3 text-left"
              >
                <span>
                  <span className="text-[22px] font-normal leading-tight transition-opacity duration-200 group-hover:opacity-50" style={D}>{e.company}</span>
                  <span className={`block text-[12px] font-light ${muted}`} style={S}>{e.role}</span>
                </span>
                <span className={`flex-shrink-0 text-[13px] font-light ${muted}`} style={S}>{e.year}</span>
              </button>
              {isOpen && (
                <div className="fade pb-6 pt-1">
                  <p className={`mb-3 text-[12px] ${muted}`} style={S}>{e.date} · {e.location}</p>
                  <ul className="space-y-2 text-[13px] font-light leading-[1.75] text-[#c9c3b4]" style={S}>
                    {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[14px] font-light" style={S}>
        <button onClick={() => go('about')} className={linkCls}>About</button>
        <button onClick={() => go('projects')} className={linkCls}>Projects</button>
        <button onClick={() => go('training')} className={linkCls}>Training</button>
        <a href={RESUME} target="_blank" rel="noreferrer" className={linkCls}>Resume</a>
        <a href={LINKEDIN} target="_blank" rel="noreferrer" className={linkCls}>LinkedIn</a>
        <a href={`mailto:${EMAIL}`} className={linkCls}>Email</a>
      </nav>
    </div>
  )
}

/* ─── ABOUT ─────────────────────────────────────────────────── */

function About({ go }: { go: (s: Section) => void }) {
  const rows = [
    ['Education', 'B.A.Sc. Mechatronics Engineering, University of Waterloo, 2025 – 2030'],
    ['Location', 'Waterloo / Toronto, ON'],
    ['Toolkit', TOOLKIT],
    ['Outside', INTERESTS],
    ['Contact', EMAIL],
  ]
  return (
    <div className="fade">
      <Back label="Arjun Dindigal" onClick={() => go('home')} />
      <h1 className="mb-10 text-[38px] font-light leading-[1.1] tracking-tight" style={D}>About</h1>
      <div className="mb-16 space-y-5 text-[14px] font-light leading-[1.85] text-[#c9c3b4]" style={S}>
        <p>
          I&rsquo;m a Mechatronics Engineering student focused on R&amp;D in robotics systems, with interests spanning
          mechanical design, electromechanics, perception, and software. I built my foundation through self-directed
          learning and hands-on co-ops, driven by curiosity for how complex systems are engineered end to end.
        </p>
        <p>
          My approach is rooted in experimentation and iteration: breaking problems down from first principles,
          building working prototypes, and refining through testing and failure.
        </p>
      </div>
      <dl className="text-[13px] font-light" style={S}>
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-8 border-t border-[#ece6d8]/10 py-4">
            <dt className={`w-20 flex-shrink-0 ${muted}`}>{k}</dt>
            <dd className="leading-relaxed">{k === 'Contact' ? <a href={`mailto:${v}`} className={linkCls}>{v}</a> : v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* ─── PROJECTS ──────────────────────────────────────────────── */

function Projects({ go }: { go: (s: Section) => void }) {
  const [project, setProject] = useState<Item | null>(null)
  const [part, setPart] = useState<Item | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const top = () => window.scrollTo({ top: 0 })

  // Level 3: a single part
  if (project && part) {
    return (
      <div>
        <Back label={project.name} onClick={() => { setPart(null); top() }} />
        <Detail item={part} />
      </div>
    )
  }

  // Level 2: a project, or the parts grid
  if (project) {
    if (project.parts) {
      return (
        <div className="fade">
          <Back label="Projects" onClick={() => { setProject(null); top() }} />
          <h1 className="mb-4 text-[38px] font-light leading-[1.1] tracking-tight" style={D}>{project.name}</h1>
          <p className="mb-14 max-w-[520px] text-[14px] font-light leading-[1.8] text-[#c9c3b4]" style={S}>{project.detail}</p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-9">
            {project.parts.map(p => (
              <button key={p.id} onClick={() => { setPart(p); top() }} className="group text-left">
                <div className="mb-3 aspect-[4/3] overflow-hidden bg-[#211f1a]">
                  <img
                    src={p.imgs[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <p className="text-[18px] font-normal leading-tight" style={D}>{p.name}</p>
                <p className={`mt-0.5 text-[12px] font-light ${muted}`} style={S}>{p.line}</p>
              </button>
            ))}
          </div>
        </div>
      )
    }
    return (
      <div>
        <Back label="Projects" onClick={() => { setProject(null); top() }} />
        <Detail item={project} />
      </div>
    )
  }

  // Level 1: list
  return (
    <div className="fade">
      <Back label="Arjun Dindigal" onClick={() => go('home')} />
      <h1 className="mb-12 text-[38px] font-light leading-[1.1] tracking-tight" style={D}>Projects</h1>
      <HoverPreview src={hover} />
      <div>
        {PROJECTS.map(p => (
          <button
            key={p.id}
            onClick={() => { setHover(null); setProject(p); top() }}
            onMouseEnter={() => setHover(p.imgs[0] ?? null)}
            onMouseLeave={() => setHover(null)}
            className="group block w-full py-3 text-left"
          >
            <span className="block text-[22px] font-normal leading-tight transition-opacity duration-200 group-hover:opacity-50" style={D}>{p.name}</span>
            <span className={`block text-[12px] font-light ${muted}`} style={S}>{p.line}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── TRAINING ──────────────────────────────────────────────── */

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <p className={`mb-4 text-[11px] uppercase tracking-[0.16em] ${muted}`} style={S}>{label}</p>
      {children}
    </section>
  )
}

function Training({ go }: { go: (s: Section) => void }) {
  const links = [
    ['Training tracker', GYM_TRACKER_URL],
    ['Strava', STRAVA_URL],
    ['Spotify', SPOTIFY_URL],
  ]
  return (
    <div className="fade">
      <Back label="Arjun Dindigal" onClick={() => go('home')} />
      <h1 className="mb-5 text-[38px] font-light leading-[1.1] tracking-tight" style={D}>Training</h1>
      <p className="mb-16 max-w-[440px] text-[14px] font-light leading-[1.85] text-[#c9c3b4]" style={S}>
        Outside of engineering I&rsquo;m at the gym, on a golf course, or training for races. Constant improvement keeps my headspace level.
      </p>

      <Block label="Personal records">
        <div>
          {PRS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-t border-[#ece6d8]/10 py-4">
              <p className="text-[20px] font-normal leading-tight" style={D}>{k}</p>
              <p className="text-[20px] font-light tabular-nums" style={D}>{v}</p>
            </div>
          ))}
          <div className="border-t border-[#ece6d8]/10 pt-4">
            <a href={STRAVA_URL} target="_blank" rel="noreferrer" className={`text-[13px] font-light ${linkCls}`} style={S}>Full history on Strava</a>
          </div>
        </div>
      </Block>

      <Block label="Racing">
        <div>
          {RACING.map(([name, date, tag]) => (
            <div key={name} className="flex items-baseline justify-between gap-6 border-t border-[#ece6d8]/10 py-4">
              <div>
                <p className="text-[20px] font-normal leading-tight" style={D}>{name}</p>
                <p className={`text-[12px] font-light ${muted}`} style={S}>{date}</p>
              </div>
              <span className={`flex-shrink-0 text-[12px] font-light ${muted}`} style={S}>{tag}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Ironman training">
        <div>
          {DISCIPLINES.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-t border-[#ece6d8]/10 py-4">
              <p className="text-[20px] font-normal leading-tight" style={D}>{k}</p>
              <p className={`text-right text-[12px] font-light ${muted}`} style={S}>{v}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Golf">
        <div className="mb-8 flex flex-wrap items-end gap-x-10 gap-y-4">
          <div>
            <p className={`text-[11px] ${muted}`} style={S}>Handicap</p>
            <p className="text-[64px] font-light leading-none" style={D}>8.6</p>
          </div>
          <p className="min-w-[200px] flex-1 text-[14px] font-light leading-[1.8] text-[#c9c3b4]" style={S}>
            Playing consistently for two years. A good way to take the load off and compete with friends, and easily one of my favourite hobbies.
          </p>
        </div>
        <div className="aspect-video bg-black">
          <iframe
            src="https://www.youtube.com/embed/iriOazO32T0"
            title="Golf"
            className="h-full w-full"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Block>

      <div className="flex flex-wrap gap-x-8 gap-y-2 text-[14px] font-light" style={S}>
        {links.map(([label, href]) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className={linkCls}>{label}</a>
        ))}
      </div>
    </div>
  )
}

/* ─── ROOT ──────────────────────────────────────────────────── */

export default function Portfolio() {
  const [section, setSection] = useState<Section>('home')
  const go = (s: Section) => { setSection(s); window.scrollTo({ top: 0 }) }

  return (
    <div className={`${display.variable} ${sans.variable} min-h-screen bg-[#14130f] text-[#ece6d8] antialiased`}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
        .fade { animation: fadeUp .5s ease both }
        ::selection { background: #ece6d8; color: #14130f }
      `}</style>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-[640px] flex-col px-6 pb-12 pt-24 md:pt-32">
        <div className="flex-1">
          {section === 'home' && <Home key="home" go={go} />}
          {section === 'about' && <About key="about" go={go} />}
          {section === 'projects' && <Projects key="projects" go={go} />}
          {section === 'training' && <Training key="training" go={go} />}
        </div>
        <footer className={`mt-24 text-[11px] font-light ${muted}`} style={S}>© 2026 Arjun Dindigal</footer>
      </main>
    </div>
  )
}