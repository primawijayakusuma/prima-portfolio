'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// ─── HOOK ─────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Eyebrow({ children, on = 'light' }: { children: React.ReactNode; on?: 'light' | 'dark' }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5 ${
      on === 'dark' ? 'bg-white/10 border border-white/15' : 'bg-accent-soft'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${on === 'dark' ? 'bg-cyan' : 'bg-accent'}`} />
      <span className={`text-[10px] font-bold tracking-[1.3px] uppercase ${on === 'dark' ? 'text-cyan' : 'text-accent-deep'}`}>
        {children}
      </span>
    </div>
  );
}

function SectionHead({
  eyebrow, title, sub, on = 'light', center = true,
}: {
  eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; on?: 'light' | 'dark'; center?: boolean;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${visible ? 'visible' : ''} max-w-2xl mb-12 ${center ? 'mx-auto text-center' : ''}`}>
      <Eyebrow on={on}>{eyebrow}</Eyebrow>
      <h2 className={`text-[2.1rem] md:text-[2.6rem] font-medium tracking-[-1px] leading-[1.12] mb-4 ${on === 'dark' ? 'text-on-dark' : 'text-ink'}`}>
        {title}
      </h2>
      {sub && <p className={`text-[1.02rem] leading-relaxed ${on === 'dark' ? 'text-on-dark-muted' : 'text-slate-body'}`}>{sub}</p>}
    </div>
  );
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const ArrowUpRight = ({ cls = 'w-3.5 h-3.5' }: { cls?: string }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9m8 0v8" />
  </svg>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Research', href: '#research' },
    { label: 'Awards', href: '#awards' },
    { label: 'Projects', href: '#projects' },
    { label: 'Publications', href: '#publications' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/92 backdrop-blur border-b border-hairline' : 'bg-transparent'
    }`}>
      <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-semibold text-[0.95rem] tracking-[-0.3px] text-ink">
          Prima Wijayakusuma
        </a>
        <div className="hidden lg:flex items-center gap-7">
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-slate-body hover:text-ink transition-colors">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="#contact"
            className="hidden sm:inline-block bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-graphite transition-colors">
            Get in touch
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-1.5" aria-label="Menu">
            <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-hairline px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm text-slate-body">{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}
            className="bg-ink text-white text-sm font-medium text-center py-3 rounded-full">Get in touch</a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 80); return () => clearTimeout(t); }, []);
  const anim = (d: number) =>
    `transition-all duration-700 ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    + ` [transition-delay:${d}ms]`;

  return (
    <section className="relative overflow-hidden bg-ink pt-16">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-[18%] -left-[12%] w-[560px] h-[560px] rounded-full bg-accent/20 blur-[130px]" />
        <div className="absolute bottom-[-25%] right-[-8%] w-[460px] h-[460px] rounded-full bg-cyan/15 blur-[120px]" />
      </div>

      <div className="relative max-w-[1180px] mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        <div>
          <div className={anim(0)} style={{ transitionDelay: '0ms' }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="text-cyan text-[10px] font-bold tracking-[1.3px] uppercase">Jakarta, ID</span>
            </div>
          </div>

          <h1 className={`text-[clamp(2.6rem,6vw,4.2rem)] font-medium text-white leading-[1.04] tracking-[-2px] mb-5 ${anim(100)}`}
            style={{ transitionDelay: '100ms' }}>
            Prima<br /><span className="grad-text">Wijayakusuma</span>
          </h1>

          <p className={`text-lg text-on-dark-muted mb-8 ${anim(200)}`} style={{ transitionDelay: '200ms' }}>
            Innovation Practitioner and Technopreneur
          </p>

          <div className={`flex flex-wrap gap-3 mb-10 ${anim(300)}`} style={{ transitionDelay: '300ms' }}>
            <a href="#projects"
              className="bg-white text-ink font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors">
              View projects
            </a>
            <a href="https://www.linkedin.com/in/primawijayakusuma/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/25 text-white font-medium text-sm px-6 py-3.5 rounded-full hover:border-white/50 hover:bg-white/5 transition-all">
              LinkedIn <ArrowUpRight />
            </a>
          </div>

          <div className={`flex flex-wrap gap-x-8 gap-y-3 ${anim(400)}`} style={{ transitionDelay: '400ms' }}>
            {[
              ['2', 'Gold medals'],
              ['5', 'Publications'],
              ['2', 'Registered IP'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-medium text-white tracking-[-0.5px]">{n}</div>
                <div className="text-[11px] text-on-dark-muted uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`flex justify-center lg:justify-end ${anim(300)}`} style={{ transitionDelay: '250ms' }}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/30 to-cyan/20 blur-2xl" aria-hidden />
            <div className="relative w-[260px] sm:w-[320px] aspect-[3/4] rounded-[1.6rem] overflow-hidden border border-white/15">
              <Image src="/img/portrait.jpg" alt="Prima Wijayakusuma" fill sizes="320px" className="object-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-hairline">
              <Image src="/img/about-booth.jpg" alt="Prima presenting his work at an exhibition"
                width={1200} height={675} sizes="(max-width:1024px) 100vw, 560px" className="w-full h-auto" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow>Hello World!</Eyebrow>
            <h2 className="text-[2rem] md:text-[2.4rem] font-medium tracking-[-1px] leading-[1.15] mb-6 text-ink">
              I am <span className="grad-text">Prima Wijayakusuma</span>
            </h2>
            <div className="space-y-4 text-[0.98rem] leading-relaxed text-slate-body">
              <p>
                Prima Wijayakusuma is an Innovation Practitioner and Technopreneur with experience in engineering research, electronics, electromagnetic applications, and smart technology systems.
              </p>
              <p>
                His work focuses on transforming technical ideas into practical and impactful solutions, particularly in Smart Electronics Innovation, sustainable innovation, and electromagnetic applications for smart agriculture and health.
              </p>
              <p>
                He has received multiple international awards in innovation and research, including two gold medals, one silver medal, one bronze medal, and a special innovation award from the Korea Invention Promotion Association (KIPA).
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── EDUCATION ────────────────────────────────────────────────────────────────

function Education() {
  const items = [
    {
      period: '2025 – Present', school: 'Beijing Institute of Technology',
      lines: ['Admitted on Master Program', 'School of Integrated Circuits and Electronics Science'],
    },
    {
      period: '2021 – 2025', school: 'Mercu Buana University',
      lines: ['Bachelor of Engineering (Electrical Engineering)', 'Summa Cum Laude', 'Best Graduate Class of 2025'],
    },
    {
      period: '2023', school: 'Beijing Institute of Technology',
      lines: ['Electronics Science and Technology', 'School of Integrated Circuits and Electronics Science', 'Exchange Programme 2023 Spring Semester'],
    },
  ];
  return (
    <section id="education" className="py-20 bg-surface">
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionHead eyebrow="My Education" title="Where the groundwork was laid." />
        <div className="max-w-3xl mx-auto">
          {items.map((it, i) => (
            <Reveal key={it.period + it.school} delay={i * 90}>
              <div className="grid sm:grid-cols-[150px_1fr] gap-4 sm:gap-8 py-7 border-t border-hairline first:border-t-0">
                <div className="text-sm font-semibold text-accent-deep pt-0.5">{it.period}</div>
                <div>
                  <h3 className="text-lg font-semibold text-ink mb-2">{it.school}</h3>
                  <ul className="space-y-1">
                    {it.lines.map(l => (
                      <li key={l} className="text-sm text-slate-body leading-relaxed">{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RESEARCH & INNOVATION ────────────────────────────────────────────────────

function Research() {
  const items = [
    {
      year: '2023', title: 'International Research Collaborations',
      org: 'Amur State University, Russia', img: '/img/research-amsu.jpg',
      body: 'In 2023, I received an invitation from Amur State University (AMSU), Russia, to collaborate on aerospace research, with funding support from AMSU. This opportunity arose from my research on Inertial Navigation Systems and Kalman Filter Approaching, leading to an international partnership for further innovation in the field',
    },
    {
      year: '2024', title: 'International Conference Committee',
      org: 'IEEE Indonesia Sections 2023 Committee', img: '/img/research-ieee.jpg',
      body: 'In 2023, I served as a committee member for the IEEE Indonesia Sections, where I played an active role in organizing and coordinating events. I contributed to the success of key activities, in collaboration with the IEEE Antennas and Propagation Society and the IEEE Indonesia Section. My involvement also included supporting the overall management and ensuring the smooth execution of these prestigious events.',
    },
    {
      year: '2024', title: 'DIKTI Research Grant Recipient',
      org: 'Directorate General of Higher Education, Indonesia', img: '/img/research-readcharge.jpg',
      body: 'In 2024, I was awarded the DIKTI Research Grant for the development of REaDCharge, an innovative tool designed to address sustainable energy challenges. This project focused on creating an efficient energy harvesting and storage system, aiming to provide power solutions for remote areas. The grant supported the research and development of REaDCharge, allowing me to enhance its capabilities in energy efficiency and environmental sustainability.',
    },
  ];
  return (
    <section id="research" className="py-20 bg-white">
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionHead eyebrow="Research and Innovations" title="Collaborations, committees, and grants." />
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100}>
              <article className="lift h-full bg-white border border-hairline rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-surface-2">
                  <Image src={it.img} alt={it.org} fill sizes="(max-width:768px) 100vw, 360px" className="object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-accent-deep mb-2">{it.year}</div>
                  <h3 className="text-base font-semibold text-ink leading-snug mb-1.5">{it.title}</h3>
                  <div className="text-xs text-stone mb-4">{it.org}</div>
                  <p className="text-[13px] text-slate-body leading-relaxed">{it.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AWARDS ───────────────────────────────────────────────────────────────────

function Awards() {
  const items = [
    {
      title: 'Gold Medal and Special Award for Incubation Opportunity on The World Invention Technology Expo (WINTEX) 2023.',
      org: 'Korea Invention Promotion Association (KIPA)', img: '/img/award-wintex.jpg',
      body: 'I received The Best International Invention Award from the Korea Invention Promotion Association (KIPA), South Korea’s largest and most prestigious research and innovation body, for my innovation “TerraGrow.” This IoT-based ergonomics platform for real-time plant monitoring and automated watering was recognized for its excellence in addressing sustainability and technological advancement on a global scale.',
    },
    {
      title: 'Gold Medal on The World Young Inventors Exhibitions Malaysia, Kuala Lumpur',
      org: 'MINDS (Malaysian Invention and Design Society)', img: '/img/award-wyie-gold.jpg',
      body: 'I won a Gold Medal at the 35th ITEX (International Invention, Innovation, and Technology Exhibition) in Kuala Lumpur, Malaysia, under the WYIE (World Young Inventors Exhibition) category. Competing against 424 inventions from over 20 countries, including entries from companies, inventors, and universities, I presented “TerraGrow,” an IoT-based ergonomics platform designed for real-time plant monitoring and automated watering.',
    },
    {
      title: 'The Best International Inventions',
      org: 'Korea Invention Promotion Association (KIPA)', img: '/img/award-kipa-ceremony.jpg',
      body: 'I received The Best International Invention Award from the Korea Invention Promotion Association (KIPA), South Korea’s largest and most prestigious research and innovation body, for my innovation “TerraGrow.” This IoT-based ergonomics platform for real-time plant monitoring and automated watering was recognized for its excellence in addressing sustainability and technological advancement on a global scale.',
    },
    {
      title: '3rd Best Champion The Most Outstanding Student LLDIKTI 3 Area 2024',
      org: 'Indonesian Region III Higher Education Service Institution', img: '/img/award-pilmapres.jpg',
      body: 'This selection of outstanding students is a prestigious event in the world of Indonesian education and students. The selection of outstanding students measures how competent students are at the Written Ideas level which refers to SDG, English and student portfolio. I brought the case of SDG 3, namely health with the implementation of technology(SDG 9).',
    },
  ];
  return (
    <section id="awards" className="py-20 bg-ink relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #16bccc 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
      </div>
      <div className="relative max-w-[1180px] mx-auto px-6">
        <SectionHead on="dark" eyebrow="Awards" title="Recognized across four countries." />
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((a, i) => (
            <Reveal key={a.title} delay={i * 90}>
              <article className="h-full bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="relative aspect-[16/9] bg-white/5">
                  <Image src={a.img} alt={a.org} fill sizes="(max-width:768px) 100vw, 560px" className="object-cover" />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-on-dark leading-snug mb-2">{a.title}</h3>
                  <div className="text-xs text-cyan mb-4">{a.org}</div>
                  <p className="text-[13px] text-on-dark-muted leading-relaxed">{a.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

type Project = {
  name: string; tag: string; blurb: string;
  images: { src: string; alt: string }[];
  features?: { n: string; title: string; body: string }[];
  specs?: string[];
  meta?: string[];
  note?: string;
  link?: { label: string; href: string };
};

function Projects() {
  const projects: Project[] = [
    {
      name: 'TerraGrow', tag: 'IoT · Smart agriculture',
      blurb: 'TerraGrow is a cutting-edge and sustainable platform that combines state-of-the-art technology and advanced agricultural practices to revolutionize plant monitoring and irrigation. Harnessing the power of the Internet of Things (IoT), TerraGrow enables real-time monitoring of plant health and environmental conditions, providing actionable insights for optimal crop management. The platform’s ergonomic design ensures user comfort during operation, while the intuitive interface makes it easy to use for users of all expertise levels. Moreover, TerraGrow is an affordable solution, making sustainable farming accessible to a wider audience.',
      images: [
        { src: '/img/terragrow-device.png', alt: 'TerraGrow sensor device' },
        { src: '/img/terragrow-app.png', alt: 'TerraGrow mobile application' },
        { src: '/img/terragrow-diagram.jpg', alt: 'TerraGrow soil and plant monitoring diagram' },
      ],
      features: [
        { n: '01', title: 'Provide Realtime Remote Monitoring', body: 'TerraGrow can provide monitor plant conditions, temperature, humidity, pH, and plant nutrition through mobile or web applications.' },
        { n: '02', title: 'Adjustable and Easy to use', body: 'TerraGrow boasts a remarkable feature of being highly adjustable, allowing users to customize it to their specific needs. Its user-friendly interface ensures effortless operation, making it accessible to users of all levels of expertise.' },
        { n: '03', title: 'High Tech Sensors', body: 'This pH, Humidity and Soil Moisture sensor works by measuring the acidity or alkalinity of a nutrient or soil solution that contains the nutrients needed by plants.' },
        { n: '04', title: 'Versatile Connectivity', body: 'TerraGrow offers versatile connectivity options, enabling seamless integration such as Wi-Fi, LoRa, and other IoT protocols. This flexibility based on their preferences and specific environmental conditions, ensuring a robust and adaptable system for plant monitoring and irrigation.' },
      ],
      meta: ['Intellectual Rights No : EC00202371089', 'EC002023127215'],
      link: { label: 'bit.ly/TerraGrow', href: 'https://bit.ly/TerraGrow' },
    },
    {
      name: 'SEHATIN', tag: 'IoT · Health monitoring',
      blurb: 'SEHATIN (Smart Electronic Devices for Health Monitoring and Anticipations with IoT Technology) is an innovative health monitoring system that leverages IoT technology to provide real-time tracking and management of health parameters. It integrates advanced sensors and smart devices to monitor vital signs, detect anomalies, and send alerts for immediate medical attention. SEHATIN is designed to promote preventive healthcare, enabling early anticipation of health issues and improving accessibility to health monitoring, especially for remote or underserved areas. This platform reflects a commitment to advancing healthcare through technological innovation.',
      images: [
        { src: '/img/sehatin-wearable.png', alt: 'SEHATIN wearable device worn on a wrist' },
        { src: '/img/sehatin-app.png', alt: 'SEHATIN application screen' },
        { src: '/img/sehatin-exploded.png', alt: 'SEHATIN device exploded view' },
      ],
      specs: ['SPO2 Monitoring', 'Blood Pressure Monitoring', 'Heart Rate Monitoring', 'Body Temperature Monitoring', 'Cloud Data Interface'],
      note: 'This project was created in order to submit ideas in competitions and grants',
    },
    {
      name: 'MUADIPS', tag: 'Renewable energy',
      blurb: 'Multi Angle Direction and Automated Tracking Solar Panel System (MUADIPS) is an innovative solar energy solution designed to maximize energy efficiency by utilizing automated tracking technology. MUADIPS adjusts solar panels to follow the sun’s movement throughout the day, ensuring optimal energy absorption from multiple angles. This system enhances power generation efficiency compared to fixed solar panels and promotes the use of renewable energy for sustainable development.',
      images: [
        { src: '/img/muadips-diagram.png', alt: 'MUADIPS sun-tracking system diagram' },
        { src: '/img/muadips-device.png', alt: 'MUADIPS controller device' },
        { src: '/img/muadips-app.png', alt: 'MUADIPS application screens' },
      ],
      specs: [
        'Cutting edge desgin memberikan kesan mewah dan flagship.',
        'Menggunakan bahan yang ramah lingkungan dan murah.',
        'Easy to use and acessible untuk orang awam dalam implementasinya.',
        'Muadips menggunakan metode motorik sederhana dan mudah digunakan',
      ],
      note: 'This project was created for a collaborative project to create solar panel automation and controllers in 2024.',
    },
    {
      name: 'MBERR', tag: 'Research centre',
      blurb: 'Mercu Buana Energy Harvesting Center (MBERR) is a research hub at Universitas Mercu Buana focused on developing sustainable energy solutions. It specializes in harnessing renewable energy sources like solar, wind, and thermal energy, transforming them into efficient power systems. MBERR supports innovation in energy storage and smart grids, contributing to global sustainability goals such as SDG 7 (Affordable and Clean Energy) and SDG 9 (Industry, Innovation, and Infrastructure).',
      images: [
        { src: '/img/mberr-diagram.jpg', alt: 'MBERR applications diagram' },
        { src: '/img/mberr-logo.png', alt: 'MBERR energy systems overview' },
      ],
      note: 'This project was created to participate in a grant competition for energy-efficient buildings.',
    },
    {
      name: 'ReadCharge', tag: 'Solar literacy',
      blurb: 'ReadCharge is a combination tool of the concept of charging spot and reading spot, which aims to increase reading productivity by utilizing solar panels in energy sources with additional insights into the uniqueness of Science and Engineering Implementation.',
      images: [
        { src: '/img/readcharge-render.png', alt: 'ReadCharge solar reading station' },
        { src: '/img/readcharge-logo.png', alt: 'ReadCharge logo' },
      ],
      note: 'Created in the context of a research grant from DIKTI for the development of ReadCharge, an innovative energy-based solution aimed at advancing technology and addressing real-world energy challenges.',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-surface">
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionHead eyebrow="Projects and Creations" title="Five things built, not just proposed." />
        <div className="space-y-6">
          {projects.map((p, i) => <ProjectCard key={p.name} project={p} delay={i * 60} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, delay }: { project: Project; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <article className="bg-white border border-hairline rounded-2xl overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
          {/* gallery */}
          <div className="grid grid-cols-2 gap-px bg-hairline">
            {p.images.map((im, idx) => (
              <div key={im.src}
                className={`relative bg-surface-2 ${idx === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'}`}>
                <Image src={im.src} alt={im.alt} fill sizes="(max-width:1024px) 100vw, 520px"
                  className={idx === 0 ? 'object-cover' : 'object-contain p-4'} />
              </div>
            ))}
          </div>

          {/* content */}
          <div className="p-7 md:p-9">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-medium text-ink tracking-[-0.5px]">{p.name}</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-deep bg-accent-soft rounded-full px-2.5 py-1">
                {p.tag}
              </span>
            </div>
            <p className={`text-[13.5px] text-slate-body leading-relaxed ${open ? '' : 'line-clamp-4'}`}>{p.blurb}</p>
            <button onClick={() => setOpen(!open)}
              className="text-xs font-semibold text-accent hover:text-accent-deep mt-2 transition-colors">
              {open ? 'Show less' : 'Read more'}
            </button>

            {p.specs && (
              <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2 mt-6">
                {p.specs.map(s => (
                  <li key={s} className="flex items-start gap-2 text-[13px] text-slate-body leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}

            {p.features && (
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {p.features.map(f => (
                  <div key={f.n} className="rounded-xl bg-surface border border-hairline p-4">
                    <div className="text-[10px] font-bold tracking-widest text-accent mb-1.5">{f.n}</div>
                    <div className="text-[13px] font-semibold text-ink mb-1 leading-snug">{f.title}</div>
                    <p className="text-[11.5px] text-slate-body leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>
            )}

            {p.meta && (
              <div className="flex flex-wrap gap-2 mt-6">
                {p.meta.map(m => (
                  <span key={m} className="text-[11px] font-medium text-slate-body bg-surface-2 rounded-full px-3 py-1.5">{m}</span>
                ))}
              </div>
            )}

            {p.note && <p className="text-[11.5px] text-stone italic mt-5 leading-relaxed">{p.note}</p>}

            {p.link && (
              <a href={p.link.href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep mt-5 transition-colors">
                {p.link.label} <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// ─── PUBLICATIONS ─────────────────────────────────────────────────────────────

function Publications() {
  const pubs = [
    {
      title: 'A Robot Arm Movement System Using A System Of Four Degrees Of Freedom To Transport Goods"',
      venue: 'International Journal for Research Trends and Innovation . ISSN Approved Journal No: 2456-3315 | Impact factor: 8.14 | ESTD Year: 2016 Volume 8 Issue 7, July-2023 - IJRTI',
      body: 'I published a paper that presents an innovative robotic arm system utilizing a four degrees of freedom (DOF) mechanism to efficiently transport goods, contributing to advancements in automation and logistics. This publication demonstrates my ability to conduct impactful research in robotics and automation, further establishing my expertise in the field.',
      href: 'https://www.ijrti.org/papers/IJRTI2307114.pdf',
    },
    {
      title: 'Kalman Filter for Tracking a Noisy Cosinousoidal Signal',
      venue: 'Conference Paper of “the 9th International Conference on Computer and Communication Engineering 2023 — PUBLISHED ON IEEE XPLORE SCOPUS INDEXED“',
      body: 'I published a paper, which focuses on developing a Kalman filter algorithm for tracking noisy cosine signals, was published on IEEE Xplore and is Scopus-indexed, contributing to advancements in signal processing for noise reduction and improved tracking accuracy. This publication reflects my expertise in signal processing and my ability to produce research with significant academic impact.',
      href: 'https://ieeexplore.ieee.org/abstract/document/10246039',
    },
    {
      title: 'DEVELOPMENT OF CASSAVA CHIP PRODUCTION IN THE KERANGGAN ECO-TOURISM VILLAGE BY IMPLEMENTING CREATIVE AND INNOVATIVE TECHNOLOGY',
      venue: 'International Conference on Community Development (ICCD) 2024',
      body: 'The project involves the development of cassava chip production in the Keranggan Eco-Tourism Village, integrating creative and innovative technology to improve the local economy and promote sustainable practices.',
      href: 'https://doi.org/10.33068/iccd.v6i1.805',
    },
    {
      title: 'Improving the Green Economy Utilizing ReadCharge Solar Literacy Technology at SMP Arrihlah',
      venue: 'Jurnal Abdi Masyarakat (JAM)',
      body: 'This research empowered the Arrihlah School community through ReadCharge, a solar-powered literacy station, to promote reading interest and renewable energy awareness. The program included design, training, and evaluation, resulting in a 100% increase in literacy engagement and environmental awareness.',
      href: 'https://www.researchgate.net/profile/Sawarni-Hasibuan/publication/393999050_Improving_the_Green_Economy_Utilizing_ReadCharge_Solar_Literacy_Technology_at_SMP_Arrihlah/links/688369674eccfb3f29c4f32d/Improving-the-Green-Economy-Utilizing-ReadCharge-Solar-Literacy-Technology-at-SMP-Arrihlah.pdf',
    },
    {
      title: 'TerraGrow: Integrated platform for real time plant monitoring and automated watering system with IoT and fuzzy Sugeno Algorithm',
      venue: 'HardwareX Elsevier, Q2 Scopus',
      body: 'P. W. Kusuma, G. P. N. Hakim, and B. Li, “TerraGrow: Integrated platform for real time plant monitoring and automated watering system with IoT and fuzzy Sugeno Algorithm,” Hardwarex, vol. 24, p. e00724, 2025, doi: 10.1016/j.ohx.2025.e00724.',
      href: 'https://www.sciencedirect.com/science/article/pii/S2468067225001026?via%3Dihub',
    },
  ];
  return (
    <section id="publications" className="py-20 bg-white">
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionHead eyebrow="Publications" title="Peer-reviewed, and public." />
        <div className="max-w-3xl mx-auto space-y-4">
          {pubs.map((p, i) => (
            <Reveal key={p.href} delay={i * 70}>
              <a href={p.href} target="_blank" rel="noopener noreferrer"
                className="lift block bg-white border border-hairline rounded-2xl p-6 group">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-[15px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <span className="text-stone group-hover:text-accent transition-colors flex-shrink-0 mt-1">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="text-[11.5px] text-accent-deep mb-3 leading-relaxed">{p.venue}</div>
                <p className="text-[13px] text-slate-body leading-relaxed">{p.body}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────

function Recommendations() {
  const recs = [
    {
      name: 'Novia Sya’baniyah',
      role: 'Ex-Business market research intern at MD Co || Software Development Enthusiast',
      when: 'August 23, 2022, Novia worked with Prima on the same team',
      body: 'Prima has one project with me, namely Sigmades. He has good creative thinking and self-confidence. I am lucky to have the opportunity to work on a smart village development project with him. It’s my utmost to recommend Prima in his future career.',
    },
    {
      name: 'Jheskia Ardito Sawung',
      role: 'Electrical Engineering Student of Institut Teknologi Kalimantan | Laboratory Assistant',
      when: 'June 12, 2024, Jheskia worked with Prima on the same team',
      body: 'I had the pleasure of working closely with Prima Wijaya Kusuma as the Project Manager for the SEHATIN project at MSIB 6 IoT Engineering, Indobot Academy. Prima is an exceptional leader who consistently supports team development. His extensive knowledge and expertise in IoT have been invaluable in ensuring the success of our project. I highly recommend Prima for any future projects. He demonstrates strong leadership qualities and excels in public speaking.',
    },
    {
      name: 'Tri Sunu Wulan Nuari',
      role: 'Mahasiswa di Universitas Pembangunan Nasional Veteran Jakarta',
      when: 'July 4, 2024, Tri Sunu worked with Prima on the same team',
      body: 'Prima Wijaya, Project Manager of the SEHATIN Project at MSIB 6 IoT Engineer Camp Indobot Academy, is an outstanding leader with extensive knowledge in IoT. He consistently supports team development, solves complex problems efficiently, and excels in communication. I highly recommend Prima for leadership roles due to his dedication and strong leadership qualities',
    },
  ];
  return (
    <section id="recommendations" className="py-20 bg-surface">
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionHead eyebrow="Read the reviews" title="What people who worked with him say." />
        <div className="grid md:grid-cols-3 gap-6">
          {recs.map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <figure className="h-full bg-white border border-hairline rounded-2xl p-7 flex flex-col">
                <svg className="w-7 h-7 text-accent-soft mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c.3 0 .6 0 .9-.1C7.9 16.7 6.4 18 4.5 18v2c4 0 7-3.3 7-7.6V10.5C11.5 8 9.9 6 7.5 6zm11 0C16 6 14 8 14 10.5s2 4.5 4.5 4.5c.3 0 .6 0 .9-.1-.5 1.8-2 3.1-3.9 3.1v2c4 0 7-3.3 7-7.6V10.5C22.5 8 20.9 6 18.5 6z" />
                </svg>
                <blockquote className="text-[13.5px] text-slate-body leading-relaxed flex-1">{r.body}</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-hairline">
                  <div className="text-sm font-semibold text-ink">{r.name}</div>
                  <div className="text-[11.5px] text-slate-body leading-snug mt-1">{r.role}</div>
                  <div className="text-[10.5px] text-stone mt-2">{r.when}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  const links = [
    { label: 'Email', value: 'primawijayakusuma38@gmail.com', href: 'mailto:primawijayakusuma38@gmail.com' },
    { label: 'LinkedIn', value: 'in/primawijayakusuma', href: 'https://www.linkedin.com/in/primawijayakusuma/' },
    { label: 'GitHub', value: 'primawijayakusuma', href: 'https://github.com/primawijayakusuma' },
    { label: 'Portfolio', value: 'bit.ly/PrimaWijaya', href: 'https://bit.ly/PrimaWijaya' },
  ];
  return (
    <section id="contact" className="py-24 bg-ink relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-accent/12 blur-[140px]" />
      </div>
      <div className="relative max-w-[1180px] mx-auto px-6 text-center">
        <Reveal>
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-7 border border-white/15">
            <Image src="/img/avatar.png" alt="Prima Wijaya Kusuma" width={200} height={200} className="w-full h-full object-cover" />
          </div>
          <Eyebrow on="dark">Reach Me</Eyebrow>
          <h2 className="text-[2.1rem] md:text-[2.8rem] font-medium text-white tracking-[-1.2px] mb-4">
            Prima Wijaya Kusuma
          </h2>
          <p className="text-on-dark-muted mb-12 max-w-md mx-auto">
            Open to research collaborations, innovation projects, and conversations about smart electronics.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {links.map(l => (
              <a key={l.label} href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-left hover:bg-white/[0.08] hover:border-white/20 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-widest text-cyan mb-1.5">{l.label}</div>
                <div className="text-[13px] text-on-dark break-all leading-snug flex items-center gap-1.5">
                  {l.value}
                  <span className="text-on-dark-muted group-hover:text-cyan transition-colors flex-shrink-0">
                    <ArrowUpRight cls="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-ink border-t border-white/8 py-8">
      <div className="max-w-[1180px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-on-dark-muted text-sm">© {new Date().getFullYear()} Prima Wijayakusuma</p>
        <p className="text-on-dark-muted text-xs">Innovation Practitioner and Technopreneur · Jakarta, ID</p>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex flex-col">
      <Nav />
      <Hero />
      <About />
      <Education />
      <Research />
      <Awards />
      <Projects />
      <Publications />
      <Recommendations />
      <Contact />
      <Footer />
    </main>
  );
}
