'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// ─── HOOK ─────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent">
      {children}
    </span>
  );
}

function SectionHeader({
  num, eyebrow, title, sub, align = 'left',
}: {
  num: string; eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; align?: 'left' | 'center';
}) {
  return (
    <Reveal className={`mb-14 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'}`}>
      <div className={`flex items-center gap-3 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="font-mono text-[11px] text-faint tabular-nums">{num}</span>
        <span className="h-px w-6 bg-line-strong" />
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="font-display text-[2rem] md:text-[2.7rem] font-bold leading-[1.08] tracking-[-0.02em] text-bright">
        {title}
      </h2>
      {sub && <p className="mt-5 text-[1.02rem] leading-relaxed text-body max-w-2xl">{sub}</p>}
    </Reveal>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-body border border-line rounded-full px-2.5 py-1 whitespace-nowrap">
      {children}
    </span>
  );
}

const ArrowUpRight = ({ cls = 'w-3.5 h-3.5' }: { cls?: string }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
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
    { label: 'Experience', href: '#experience' },
    { label: 'Work', href: '#terragrow' },
    { label: 'Research', href: '#research' },
    { label: 'Recognition', href: '#recognition' },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-void/85 backdrop-blur-md border-b border-line' : 'border-b border-transparent'
    }`}>
      <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main">
        <a href="#top" className="font-display font-bold text-[0.95rem] tracking-[-0.01em] text-bright">
          Prima Wijayakusuma
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-body hover:text-bright transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 bg-bright text-void text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
            Contact
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 -mr-2 text-bright"
            aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              {open
                ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" d="M3.75 7h16.5M3.75 12h16.5m-16.5 5h16.5" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-panel border-t border-line px-6 py-5 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm text-body">{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}
            className="bg-bright text-void text-sm font-semibold text-center py-3 rounded-full mt-1">Contact</a>
        </div>
      )}
    </header>
  );
}

// ─── 01 HERO ──────────────────────────────────────────────────────────────────

function Hero() {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 60); return () => clearTimeout(t); }, []);
  const step = (d: number) => ({
    className: `transition-all duration-700 ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`,
    style: { transitionDelay: `${d}ms` },
  });

  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -left-32 w-[620px] h-[620px] rounded-full bg-accent/10 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[520px] h-[520px] rounded-full bg-cyan/[0.07] blur-[130px]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28 grid lg:grid-cols-[1.35fr_0.65fr] gap-14 lg:gap-16 items-center">
        <div>
          <div {...step(0)}>
            <div className="flex items-center gap-3 mb-7">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-70 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <Eyebrow>Jakarta, ID · Beijing, CN</Eyebrow>
            </div>
          </div>

          <h1 {...step(80)} className={`${step(80).className} font-display text-[clamp(2.4rem,5.6vw,4.1rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bright mb-5`}>
            Prima Wijayakusuma
          </h1>

          <p {...step(160)} className={`${step(160).className} font-display text-[0.95rem] md:text-base font-medium tracking-[0.04em] text-accent mb-8`}>
            Engineer · Innovation Practitioner · Technology Builder
          </p>

          <p {...step(240)} className={`${step(240).className} text-[1.1rem] md:text-[1.28rem] leading-[1.5] text-bright/90 max-w-[42rem] mb-6`}>
            Turning scientific and engineering ideas into technologies that can be built, tested, validated, and developed toward real-world products.
          </p>

          <p {...step(320)} className={`${step(320).className} text-[0.94rem] leading-relaxed text-dim max-w-[38rem] mb-8`}>
            Working across electronics, RF and wireless systems, intelligent sensing, AI, digital health, biomedical technology, environmental monitoring, and precision agriculture.
          </p>

          <div {...step(380)} className={`${step(380).className} flex flex-wrap items-center gap-x-2.5 gap-y-2 mb-10`}>
            {['AIoT', 'Smart Electronics', 'Intelligent Sensing', 'Deep Tech'].map((t, i) => (
              <span key={t} className="flex items-center gap-2.5">
                {i > 0 && <span className="text-faint text-xs">·</span>}
                <span className="font-mono text-[11px] tracking-wide text-body">{t}</span>
              </span>
            ))}
          </div>

          <div {...step(440)} className={`${step(440).className} flex flex-wrap gap-3`}>
            <a href="#terragrow"
              className="group inline-flex items-center gap-2 bg-bright text-void font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors">
              Explore My Work
              <span className="group-hover:translate-x-0.5 transition-transform"><ArrowUpRight /></span>
            </a>
            <a href="#research"
              className="inline-flex items-center gap-2 border border-line-strong text-bright font-medium text-sm px-6 py-3.5 rounded-full hover:bg-white/5 transition-colors">
              Research &amp; Publications
            </a>
            <a href="https://www.linkedin.com/in/primawijayakusuma/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-body font-medium text-sm px-4 py-3.5 hover:text-bright transition-colors">
              LinkedIn <ArrowUpRight cls="w-3 h-3" />
            </a>
          </div>
        </div>

        <div {...step(300)} className={`${step(300).className} flex lg:justify-end`}>
          <figure className="relative w-full max-w-[300px]">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/15 to-transparent" aria-hidden />
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-panel-2">
              <Image src="/img/hero-portrait.jpg" alt="Portrait of Prima Wijayakusuma"
                fill sizes="(max-width: 1024px) 60vw, 300px" className="object-cover" priority />
            </div>
          </figure>
        </div>
      </div>

      {/* Secondary evidence strip — subordinate to the positioning above */}
      <div className="relative border-t border-line">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-wrap gap-x-10 gap-y-4">
          {[
            ['Peer-reviewed publications', '5'],
            ['International gold medals', '2'],
            ['Registered intellectual property', '2'],
          ].map(([label, n]) => (
            <div key={label} className="flex items-baseline gap-2.5">
              <span className="font-display text-sm font-bold text-bright tabular-nums">{n}</span>
              <span className="text-[11px] uppercase tracking-[0.12em] text-faint">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 02 ABOUT ─────────────────────────────────────────────────────────────────

function About() {
  const paras = [
    'I am an engineer and innovation practitioner focused on turning scientific and engineering ideas into technologies that can be built, tested, and developed toward real-world products.',
    'My work spans the early stages of technology development, from problem exploration and engineering design to prototyping, validation, and product development. With a background in electronics, my interests include wireless systems, RF engineering, intelligent sensing, AI, and human-centered technologies, with applications across digital health, biomedical systems, environmental monitoring, and precision agriculture.',
    'I am particularly interested in bridging research and product development — bringing together technical ideas, multidisciplinary collaboration, and practical requirements to transform promising concepts into functional and validated solutions.',
    'Throughout my journey, I have been involved in applied research and engineering innovation, receiving Gold Medals at international invention exhibitions as well as a Special Award from the Korea Invention Promotion Association (KIPA). I have also contributed to international publications across Elsevier journals, IEEE Xplore, Scopus-indexed proceedings, and other peer-reviewed venues.',
    'Beyond engineering, I contribute to sustainability-driven collaboration through SDSN Indonesia while pursuing my Master’s degree at Beijing Institute of Technology.',
  ];
  return (
    <section id="about" className="py-24 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader num="02" eyebrow="About" title="Engineering ideas into real-world technology." />

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-start">
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
              {paras.map((p, i) => (
                <p key={i} className={`text-[0.95rem] leading-[1.75] text-body ${i === 0 ? 'sm:col-span-2 text-[1.05rem] text-bright/85' : ''}`}>
                  {p}
                </p>
              ))}
            </div>
            <div className="rule mt-10 mb-6" />
            <p className="text-[0.95rem] leading-[1.75] text-body max-w-2xl">
              My long-term direction lies at the intersection of engineering, technology development, and innovation management — helping turn ideas into technologies, and technologies into products that create meaningful impact.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <figure>
              <div className="relative aspect-[3/2] rounded-xl overflow-hidden border border-line bg-panel-2">
                <Image src="/img/about-research.jpg" alt="Prima presenting engineering research at an exhibition"
                  fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-faint">
                Presenting applied research at an international exhibition
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 03 EXPERIENCE ────────────────────────────────────────────────────────────

function Experience() {
  const roles = [
    {
      title: 'Assistant Network Manager',
      org: 'UN Sustainable Development Solutions Network Indonesia',
      period: 'Mar 2026 — Present',
      place: 'Indonesia / Remote',
      body: [
        'I support network coordination, member engagement, strategic communications, and sustainability-driven collaboration across SDSN Indonesia. The role involves connecting universities, research institutions, and other stakeholders to strengthen initiatives supporting the Sustainable Development Goals in Indonesia.',
        'I also contribute to partnership development, institutional engagement, review processes, and the implementation of collaborative programs across the network.',
      ],
      tags: ['Sustainability', 'Network Development', 'Partnerships', 'Innovation', 'SDGs'],
      img: '/img/role-sdsn.jpg',
      imgAlt: 'Prima at an SDGs centre',
    },
    {
      title: 'Founder',
      org: 'SEHATIN',
      period: 'Oct 2020 — Present',
      place: '',
      body: [
        'SEHATIN — Science and Engineering for Health Innovation Network — is a science, engineering, and technology platform focused on healthcare innovation, biomedical systems, medical engineering, and artificial intelligence.',
        'Originally developed as a knowledge-sharing platform, SEHATIN is evolving toward an innovation ecosystem connecting research, engineering, and entrepreneurship. Its mission is to help translate scientific knowledge and engineering ideas into healthcare technologies with practical real-world applications.',
        'NOVA emerged as its first flagship venture, extending this mission from knowledge dissemination toward technology and venture development.',
      ],
      tags: ['Healthcare Innovation', 'Science Communication', 'Biomedical Engineering', 'Innovation Ecosystem'],
      img: '/img/sehatin-logo.png',
      imgAlt: 'SEHATIN logo',
      contain: true,
    },
  ];

  return (
    <section id="experience" className="py-24 bg-panel border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          num="03"
          eyebrow="Experience"
          title="Beyond the Lab"
          sub="Engineering, innovation, entrepreneurship, and collaboration."
        />

        <div className="space-y-5">
          {roles.map((r, i) => (
            <Reveal key={r.title} delay={i * 90}>
              <article className="card card-lift rounded-2xl p-7 md:p-9 grid lg:grid-cols-[auto_1fr_auto] gap-7 lg:gap-10">
                <div className={`relative w-full lg:w-[132px] h-[132px] rounded-xl overflow-hidden border border-line flex-shrink-0 ${r.contain ? 'bg-white/[0.06]' : 'bg-panel-2'}`}>
                  <Image src={r.img} alt={r.imgAlt} fill sizes="132px"
                    className={r.contain ? 'object-contain p-5' : 'object-cover'} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold text-bright tracking-[-0.01em]">{r.title}</h3>
                  <p className="text-[0.9rem] text-accent mt-1 mb-4">{r.org}</p>
                  <div className="space-y-3 mb-5">
                    {r.body.map(b => (
                      <p key={b.slice(0, 24)} className="text-[0.9rem] leading-[1.7] text-body">{b}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.tags.map(t => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>

                <div className="lg:text-right lg:min-w-[140px]">
                  <div className="font-mono text-[11px] text-bright/70 whitespace-nowrap">{r.period}</div>
                  {r.place && <div className="font-mono text-[11px] text-faint mt-1 whitespace-nowrap">{r.place}</div>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 04 TERRAGROW — FEATURED CASE STUDY ───────────────────────────────────────

function TerraGrow() {
  const journey = [
    ['Problem', 'Water efficiency and accessible precision agriculture'],
    ['Engineering', 'Multi-sensor IoT hardware + ESP32'],
    ['Intelligence', 'Sugeno fuzzy inference for irrigation decisions'],
    ['Prototype', 'Integrated modular physical device'],
    ['Validation', 'Bench and greenhouse testing'],
    ['Research', 'Peer-reviewed publication'],
    ['Recognition', 'International invention awards'],
  ];

  const highlights = [
    ['Multi-Sensor Sensing', 'Real-time soil moisture, pH, temperature, and humidity monitoring.'],
    ['Local Intelligence', 'Sugeno fuzzy control enables irrigation decisions to be executed locally on the ESP32.'],
    ['Connected Monitoring', 'IoT connectivity enables remote supervision and monitoring while maintaining local autonomous control.'],
    ['Reproducible Hardware', 'Modular hardware, printable enclosure, documented implementation, and open design resources support reproducibility and further development.'],
  ];

  const figures = [
    { src: '/img/terragrow-device.png', alt: 'TerraGrow hardware prototype', cap: 'Hardware Prototype', contain: true, span: true },
    { src: '/img/terragrow-app.png', alt: 'TerraGrow IoT monitoring interface', cap: 'IoT Monitoring Interface', contain: true },
    { src: '/img/terragrow-diagram.jpg', alt: 'TerraGrow system architecture and plant monitoring diagram', cap: 'System Architecture' },
  ];

  return (
    <section id="terragrow" className="relative py-24 border-b border-line overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="absolute top-0 left-1/4 w-[560px] h-[560px] rounded-full bg-accent/[0.07] blur-[150px] pointer-events-none" aria-hidden />

      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Title block */}
        <Reveal className="max-w-4xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[11px] text-faint tabular-nums">04</span>
            <span className="h-px w-6 bg-line-strong" />
            <Eyebrow>Featured Engineering Case Study</Eyebrow>
          </div>
          <h2 className="font-display text-[2.6rem] md:text-[4rem] font-bold leading-[0.98] tracking-[-0.035em] text-bright mb-6">
            TerraGrow
          </h2>
          <p className="text-[1.15rem] md:text-[1.4rem] leading-[1.4] text-bright/90 max-w-3xl mb-6">
            From an engineering prototype to an award-winning and peer-reviewed open-source precision agriculture platform.
          </p>
          <p className="font-mono text-[11px] md:text-xs tracking-wide text-dim">
            IoT · Embedded Systems · Fuzzy Control · Precision Agriculture · Open-Source Hardware
          </p>
        </Reveal>

        {/* Overview + figures */}
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-start mb-16">
          <Reveal>
            <div className="space-y-4 text-[0.97rem] leading-[1.75] text-body">
              <p>
                TerraGrow is an open-source precision agriculture platform developed to make intelligent irrigation and environmental monitoring more accessible, reproducible, and practical.
              </p>
              <p>
                Built around an ESP32, the system integrates real-time soil moisture, pH, air temperature, and humidity sensing with a Sugeno fuzzy controller to enable autonomous irrigation decisions directly on the device.
              </p>
              <p>
                Instead of relying entirely on cloud-based decision making, TerraGrow brings sensing, control, connectivity, and irrigation automation into a compact and modular hardware platform designed for practical deployment.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-4">
              {figures.map(f => (
                <figure key={f.src} className={f.span ? 'col-span-2' : ''}>
                  <div className={`relative rounded-xl overflow-hidden border border-line bg-panel-2 ${f.span ? 'aspect-[16/10]' : 'aspect-square'}`}>
                    <Image src={f.src} alt={f.alt} fill
                      sizes="(max-width: 1024px) 50vw, 300px"
                      className={f.contain ? 'object-contain p-5' : 'object-cover'} />
                  </div>
                  <figcaption className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">{f.cap}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Research-to-product journey */}
        <Reveal className="mb-16">
          <div className="card rounded-2xl p-7 md:p-9">
            <div className="flex items-center gap-3 mb-8">
              <Eyebrow>Research to product</Eyebrow>
            </div>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">
              {journey.map(([stage, desc], i) => (
                <li key={stage} className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <div className="font-display text-sm font-bold text-bright mb-1.5">{stage}</div>
                  <p className="text-[12.5px] leading-relaxed text-dim">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* System highlights */}
        <Reveal className="mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map(([t, d]) => (
              <div key={t} className="card rounded-xl p-6">
                <h3 className="font-display text-sm font-bold text-bright mb-2.5">{t}</h3>
                <p className="text-[12.5px] leading-relaxed text-body">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Publication highlight */}
        <Reveal className="mb-16">
          <div className="relative rounded-2xl border border-accent/30 bg-accent/[0.06] p-7 md:p-9 overflow-hidden">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
              <div className="min-w-0">
                <Eyebrow>Published Research</Eyebrow>
                <h3 className="font-display text-lg md:text-[1.4rem] font-bold leading-snug text-bright mt-4 mb-4">
                  TerraGrow: Integrated platform for real time plant monitoring and automated watering system with IoT and fuzzy Sugeno Algorithm
                </h3>
                <p className="text-[0.9rem] text-body mb-1.5">
                  Prima Wijayakusuma · Galang Persada Nurani Hakim · Bin Li
                </p>
                <p className="font-mono text-[11.5px] text-dim mb-5">
                  HardwareX · Elsevier · Volume 24 · e00724 · 2025
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['First Author', 'Elsevier', 'HardwareX', 'Open Access', 'Open-Source Hardware'].map(b => (
                    <span key={b} className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent border border-accent/30 bg-accent/10 rounded px-2 py-1">
                      {b}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <a href="https://www.sciencedirect.com/science/article/pii/S2468067225001026"
                    target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-bright text-void font-semibold text-sm px-5 py-3 rounded-full hover:bg-white/90 transition-colors">
                    Read the Paper
                    <span className="group-hover:translate-x-0.5 transition-transform"><ArrowUpRight /></span>
                  </a>
                  <span className="font-mono text-[11px] text-faint">DOI: 10.1016/j.ohx.2025.e00724</span>
                </div>
              </div>

              <figure className="w-full md:w-[190px]">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-line bg-white">
                  <Image src="/img/paper-hardwarex.jpg" alt="First page of the TerraGrow paper in HardwareX"
                    fill sizes="190px" className="object-cover object-top" />
                </div>
              </figure>
            </div>
          </div>
        </Reveal>

        {/* Recognition tied to the project */}
        <Reveal>
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center card rounded-2xl p-7 md:p-9">
            <div>
              <Eyebrow>International Recognition</Eyebrow>
              <ul className="mt-5 space-y-2.5">
                {[
                  'Gold Medal — The World Young Inventors Exhibition, Kuala Lumpur, Malaysia',
                  'Gold Medal — The World Invention Technology Expo (WINTEX) 2023',
                  'Special Award / The Best International Inventions — Korea Invention Promotion Association (KIPA)',
                ].map(a => (
                  <li key={a} className="flex items-start gap-3 text-[0.9rem] text-body leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[11px] text-faint mt-6">
                Prototype → Validation → International Recognition → Peer-Reviewed Publication
              </p>
            </div>
            <figure className="w-full lg:w-[260px]">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-line bg-panel-2">
                <Image src="/img/terragrow-booth.jpg" alt="TerraGrow presented at the ITEX international exhibition"
                  fill sizes="260px" className="object-cover" />
              </div>
              <figcaption className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">Exhibited at ITEX</figcaption>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 05 VENTURES ──────────────────────────────────────────────────────────────

function Ventures() {
  return (
    <section id="ventures" className="py-24 bg-panel border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          num="05"
          eyebrow="Ventures &amp; Innovation"
          title="Technologies being built, not only studied."
          sub="Two ventures translating sensing, AI, and healthcare needs into technology platforms."
        />

        <div className="space-y-6">
          {/* NOVA */}
          <Reveal>
            <article className="card rounded-2xl overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-7 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="font-display text-2xl font-bold text-bright tracking-[-0.02em]">NOVA</span>
                  <span className="text-[11px] font-medium text-dim border-l border-line pl-3">CEO</span>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-5">Human Risk Intelligence</p>

                <div className="space-y-3.5 text-[0.92rem] leading-[1.7] text-body mb-6">
                  <p>
                    NOVA is developing Human Risk Intelligence technologies that transform fragmented physiological, behavioral, and environmental data into actionable insights for individuals, caregivers, healthcare teams, and organizations.
                  </p>
                  <p>
                    Its technology direction combines intelligent sensing, AI-driven risk assessment, connected devices, historical event analysis, and human-centered alerting to support earlier awareness and response to human health and safety risks.
                  </p>
                  <p>
                    NOVA represents my work in translating research, sensing technologies, AI, and healthcare needs into a scalable technology platform.
                  </p>
                </div>

                <div className="rounded-xl border border-cyan/25 bg-cyan/[0.06] px-4 py-3 mb-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan mb-1">Recognition</div>
                  <div className="text-[0.87rem] text-bright/90">Most Potential Award — Startup Alliance China 2026</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-7">
                  {['Human Risk Intelligence', 'AI', 'Digital Health', 'Connected Devices', 'Human-Centered Technology'].map(t => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>

                <a href="https://nova-body-vital-assistant.vercel.app" target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-bright hover:text-accent transition-colors">
                  Visit NOVA
                  <span className="group-hover:translate-x-0.5 transition-transform"><ArrowUpRight /></span>
                </a>
              </div>

              <div className="relative min-h-[240px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-line bg-panel-2">
                <Image src="/img/venture-nova-pitch.jpg" alt="Prima presenting NOVA"
                  fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" />
              </div>
            </article>
          </Reveal>

          {/* Medivue */}
          <Reveal delay={90}>
            <article className="card rounded-2xl p-7 md:p-10">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="font-display text-2xl font-bold text-bright tracking-[-0.02em]">Medivue</span>
                    <span className="text-[11px] font-medium text-dim border-l border-line pl-3">CIO</span>
                  </div>
                  <p className="text-[1.02rem] leading-snug text-bright/90 mb-5">
                    Built for the moments between first contact and definitive care.
                  </p>
                  <div className="space-y-3.5 text-[0.92rem] leading-[1.7] text-body">
                    <p>
                      Medivue is developing a connected rapid assessment system designed to preserve critical physiological context as a patient moves from the scene of an emergency toward definitive hospital care.
                    </p>
                    <p>
                      The concept explores how rapid physiological assessment, connected sensing, intelligent interpretation, and information continuity can help bridge the gap between first responders, ambulances, and receiving hospitals.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-6">
                  <div className="rounded-xl border border-line bg-white/[0.03] p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim mb-2">Stage</div>
                    <p className="text-[0.87rem] text-bright/90 mb-3">Medivue is currently at an early / pre-seed stage.</p>
                    <div className="rule my-4" />
                    <div className="font-display text-sm font-bold text-bright mb-1.5">Early stage. Shared ambition.</div>
                    <p className="text-[12.5px] leading-relaxed text-body">
                      Medivue is open to conversations with investors and collaborators who share the ambition of improving continuity between first assessment and the care that follows.
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['MedTech', 'Emergency Care', 'Connected Health', 'Physiological Sensing', 'Product Innovation'].map(t => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                    <a href="https://medivue-corp.vercel.app" target="_blank" rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-bright hover:text-accent transition-colors">
                      Visit Medivue
                      <span className="group-hover:translate-x-0.5 transition-transform"><ArrowUpRight /></span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 06 SELECTED ENGINEERING WORK ─────────────────────────────────────────────

function SelectedWork() {
  const projects = [
    {
      name: 'SEHATIN',
      kind: 'IoT · Health monitoring',
      body: 'A health monitoring system using IoT to track health parameters in real time, integrating sensors and connected devices to monitor vital signs, detect anomalies, and raise alerts. Designed to support preventive care and improve access to monitoring in remote or underserved areas.',
      specs: ['SpO₂ monitoring', 'Blood pressure monitoring', 'Heart rate monitoring', 'Body temperature monitoring', 'Cloud data interface'],
      img: '/img/sehatin-wearable.png',
      note: 'Developed for competition and grant submissions.',
      contain: true,
    },
    {
      name: 'MUADIPS',
      kind: 'Renewable energy',
      body: 'Multi Angle Direction and Automated Tracking Solar Panel System — a solar energy system that adjusts panel orientation to follow the sun through the day, improving energy capture compared with fixed installations.',
      specs: ['Simple motorised tracking mechanism', 'Low-cost, environmentally friendly materials', 'Straightforward to deploy and operate'],
      img: '/img/muadips-diagram.png',
      note: 'Built for a collaborative solar automation and controller project in 2024.',
      contain: true,
    },
    {
      name: 'ReadCharge',
      kind: 'Solar literacy',
      body: 'A combined charging and reading station that uses solar panels as its energy source, built to encourage reading while making the underlying science and engineering visible to its users.',
      specs: ['Solar-powered station', 'Public literacy deployment', 'Community evaluation'],
      img: '/img/readcharge-render.png',
      note: 'Developed under a DIKTI research grant.',
      contain: true,
    },
    {
      name: 'MBERR',
      kind: 'Research centre',
      body: 'Mercu Buana Energy Harvesting Center — a research hub focused on renewable energy sources including solar, wind, and thermal energy, and on converting them into efficient power systems. Supports work on energy storage and smart grids toward SDG 7 and SDG 9.',
      specs: ['Energy harvesting', 'Storage and smart grids', 'SDG 7 · SDG 9'],
      img: '/img/mberr-diagram.jpg',
      note: 'Prepared for a grant competition on energy-efficient buildings.',
    },
  ];

  return (
    <section id="work" className="py-24 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          num="06"
          eyebrow="Selected Engineering Work"
          title="Other systems I&rsquo;ve built."
          sub="Earlier and parallel engineering projects across sensing, energy, and connected hardware."
        />

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <article className="card card-lift rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[16/9] bg-panel-2 border-b border-line">
                  <Image src={p.img} alt={`${p.name} project`} fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    className={p.contain ? 'object-contain p-7' : 'object-cover'} />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="font-display text-lg font-bold text-bright">{p.name}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint text-right">{p.kind}</span>
                  </div>
                  <p className="text-[0.88rem] leading-[1.7] text-body mb-5">{p.body}</p>
                  <ul className="space-y-1.5 mb-5">
                    {p.specs.map(s => (
                      <li key={s} className="flex items-start gap-2.5 text-[12.5px] text-dim">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-accent flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="font-mono text-[10.5px] text-faint mt-auto pt-4 border-t border-line">{p.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 07 RESEARCH & PUBLICATIONS ───────────────────────────────────────────────

function Research() {
  const featured = {
    year: '2025',
    title: 'TerraGrow: Integrated platform for real time plant monitoring and automated watering system with IoT and fuzzy Sugeno Algorithm',
    venue: 'HardwareX · Elsevier · Volume 24 · e00724',
    type: 'Journal article · Open access',
    authors: 'Prima Wijayakusuma · Galang Persada Nurani Hakim · Bin Li',
    href: 'https://www.sciencedirect.com/science/article/pii/S2468067225001026',
    doi: '10.1016/j.ohx.2025.e00724',
  };

  const pubs = [
    {
      year: '2023',
      title: 'Kalman Filter for Tracking a Noisy Cosinousoidal Signal',
      venue: 'The 9th International Conference on Computer and Communication Engineering',
      type: 'Conference paper · IEEE Xplore · Scopus-indexed',
      href: 'https://ieeexplore.ieee.org/abstract/document/10246039',
    },
    {
      year: '2023',
      title: 'A Robot Arm Movement System Using A System Of Four Degrees Of Freedom To Transport Goods',
      venue: 'International Journal for Research Trends and Innovation · Volume 8, Issue 7',
      type: 'Journal article',
      href: 'https://www.ijrti.org/papers/IJRTI2307114.pdf',
    },
    {
      year: '2024',
      title: 'Development of Cassava Chip Production in the Keranggan Eco-Tourism Village by Implementing Creative and Innovative Technology',
      venue: 'International Conference on Community Development (ICCD)',
      type: 'Conference paper',
      href: 'https://doi.org/10.33068/iccd.v6i1.805',
    },
    {
      year: '—',
      title: 'Improving the Green Economy Utilizing ReadCharge Solar Literacy Technology at SMP Arrihlah',
      venue: 'Jurnal Abdi Masyarakat (JAM)',
      type: 'Journal article · Community engagement',
      href: 'https://www.researchgate.net/profile/Sawarni-Hasibuan/publication/393999050_Improving_the_Green_Economy_Utilizing_ReadCharge_Solar_Literacy_Technology_at_SMP_Arrihlah/links/688369674eccfb3f29c4f32d/Improving-the-Green-Economy-Utilizing-ReadCharge-Solar-Literacy-Technology-at-SMP-Arrihlah.pdf',
    },
  ];

  const activity = [
    {
      year: '2023',
      title: 'International Research Collaboration',
      org: 'Amur State University, Russia',
      body: 'Invited to collaborate on aerospace research with funding support from AMSU, following work on inertial navigation systems and Kalman filter approaches.',
    },
    {
      year: '2023',
      title: 'Conference Committee',
      org: 'IEEE Indonesia Section',
      body: 'Committee member organising and coordinating events with the IEEE Antennas and Propagation Society and the IEEE Indonesia Section.',
    },
    {
      year: '2024',
      title: 'DIKTI Research Grant',
      org: 'Directorate General of Higher Education, Indonesia',
      body: 'Awarded for the development of ReadCharge, an energy harvesting and storage system aimed at power solutions for remote areas.',
    },
  ];

  return (
    <section id="research" className="py-24 bg-panel border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          num="07"
          eyebrow="Research &amp; Publications"
          title="Research &amp; Publications"
          sub="Peer-reviewed work across sensing, electronics, wireless systems, intelligent systems, and engineering applications."
        />

        {/* Featured publication */}
        <Reveal className="mb-5">
          <a href={featured.href} target="_blank" rel="noopener noreferrer"
            className="group block rounded-2xl border border-accent/30 bg-accent/[0.06] p-7 md:p-8 hover:border-accent/50 transition-colors">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-[11px] text-accent tabular-nums">{featured.year}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent border border-accent/30 rounded px-2 py-0.5">Featured</span>
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold leading-snug text-bright group-hover:text-accent transition-colors mb-3">
              {featured.title}
            </h3>
            <p className="text-[0.86rem] text-body mb-1">{featured.authors}</p>
            <p className="font-mono text-[11.5px] text-dim">{featured.venue}</p>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-5 border-t border-accent/20">
              <span className="font-mono text-[11px] text-faint">{featured.type} · DOI {featured.doi}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-bright">
                View Publication
                <span className="group-hover:translate-x-0.5 transition-transform"><ArrowUpRight /></span>
              </span>
            </div>
          </a>
        </Reveal>

        {/* Remaining publications */}
        <div className="space-y-3 mb-16">
          {pubs.map((p, i) => (
            <Reveal key={p.href} delay={i * 60}>
              <a href={p.href} target="_blank" rel="noopener noreferrer"
                className="group card rounded-xl p-6 grid sm:grid-cols-[54px_1fr_auto] gap-4 sm:gap-6 items-start">
                <span className="font-mono text-[11px] text-accent tabular-nums pt-1">{p.year}</span>
                <div className="min-w-0">
                  <h3 className="text-[0.95rem] font-semibold leading-snug text-bright group-hover:text-accent transition-colors mb-2">
                    {p.title}
                  </h3>
                  <p className="font-mono text-[11px] text-dim leading-relaxed">{p.venue}</p>
                  <p className="font-mono text-[10.5px] text-faint mt-1">{p.type}</p>
                </div>
                <span className="text-dim group-hover:text-accent transition-colors pt-1 hidden sm:block">
                  <ArrowUpRight />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Research activity */}
        <Reveal>
          <div className="flex items-center gap-3 mb-7">
            <Eyebrow>Collaborations &amp; Grants</Eyebrow>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {activity.map(a => (
              <div key={a.title} className="card rounded-xl p-6">
                <div className="font-mono text-[11px] text-accent tabular-nums mb-3">{a.year}</div>
                <h3 className="font-display text-sm font-bold text-bright mb-1">{a.title}</h3>
                <p className="text-[11.5px] text-dim mb-3">{a.org}</p>
                <p className="text-[12.5px] leading-relaxed text-body">{a.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 08 RECOGNITION ───────────────────────────────────────────────────────────

function Recognition() {
  const dimensions = [
    ['Engineering & Invention', 'International invention awards including WYIE, WINTEX, and KIPA recognition.'],
    ['Research', 'Peer-reviewed publications including Elsevier / HardwareX and IEEE-related venues.'],
    ['Technology & Venture Building', 'Most Potential Award — Venture Builders, Startup Alliance China 2026.'],
  ];

  const awards = [
    {
      award: 'Most Potential Award', org: 'Venture Builders — Startup Alliance China', country: 'China', year: '2026',
      project: 'NOVA', img: '/img/rec-venture-builders.jpg',
      note: 'Received through Venture Builders at Startup Alliance China 2026 for NOVA and its technology direction.',
    },
    {
      award: 'Gold Medal', org: 'The World Young Inventors Exhibition (WYIE) — MINDS', country: 'Malaysia', year: '2023',
      project: 'TerraGrow', img: '/img/rec-itex-gold.jpg',
      note: 'Presented at the 35th ITEX in Kuala Lumpur under the WYIE category.',
    },
    {
      award: 'Gold Medal & Special Award', org: 'The World Invention Technology Expo (WINTEX) — KIPA', country: 'Korea', year: '2023',
      project: 'TerraGrow', img: '/img/rec-kipa.jpg',
      note: 'Special Award for Incubation Opportunity from the Korea Invention Promotion Association.',
    },
    {
      award: 'The Best International Inventions', org: 'Korea Invention Promotion Association (KIPA)', country: 'Korea', year: '2023',
      project: 'TerraGrow', img: '/img/rec-special-award.jpg',
      note: '',
    },
    {
      award: '3rd Best Champion — The Most Outstanding Student', org: 'LLDIKTI Region III', country: 'Indonesia', year: '2024',
      project: '', img: '/img/rec-pilmapres.jpg',
      note: 'Written ideas on SDG 3 with technology implementation (SDG 9).',
    },
    {
      award: 'Incubator Opportunity Award', org: 'INOTEK Foundation', country: 'Indonesia', year: '',
      project: 'TerraGrow', img: '/img/rec-wintex-inotek.jpg',
      note: '',
    },
  ];

  return (
    <section id="recognition" className="py-24 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          num="08"
          eyebrow="Recognition"
          title="Engineering and innovation recognized internationally."
          sub="Progression across three dimensions of the work — invention, research, and venture building."
        />

        <Reveal className="mb-14">
          <div className="grid md:grid-cols-3 gap-4">
            {dimensions.map(([t, d], i) => (
              <div key={t} className="card rounded-xl p-6">
                <div className="font-mono text-[10px] text-accent tabular-nums mb-3">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display text-sm font-bold text-bright mb-2">{t}</h3>
                <p className="text-[12.5px] leading-relaxed text-body">{d}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[11px] text-faint mt-6 text-center">
            Engineering → Research → Technology Development → Venture Building
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((a, i) => (
            <Reveal key={a.award + a.org} delay={i * 60}>
              <article className="card card-lift rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[4/3] bg-panel-2 border-b border-line">
                  <Image src={a.img} alt={`${a.award}, ${a.org}`} fill
                    sizes="(max-width: 1024px) 50vw, 380px" className="object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-[0.95rem] font-bold leading-snug text-bright mb-2">{a.award}</h3>
                  <p className="text-[12.5px] leading-relaxed text-body mb-4">{a.org}</p>
                  {a.note && <p className="text-[11.5px] leading-relaxed text-dim mb-4">{a.note}</p>}
                  <dl className="mt-auto pt-4 border-t border-line flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[10.5px]">
                    {a.country && (
                      <div className="flex gap-1.5"><dt className="text-faint">Country</dt><dd className="text-body">{a.country}</dd></div>
                    )}
                    {a.year && (
                      <div className="flex gap-1.5"><dt className="text-faint">Year</dt><dd className="text-body">{a.year}</dd></div>
                    )}
                    {a.project && (
                      <div className="flex gap-1.5"><dt className="text-faint">Project</dt><dd className="text-accent">{a.project}</dd></div>
                    )}
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 09 EDUCATION ─────────────────────────────────────────────────────────────

function Education() {
  const main = [
    {
      school: 'Beijing Institute of Technology',
      degree: 'Master’s Degree',
      detail: 'School of Integrated Circuits and Electronics',
      period: '2025 — Present',
      img: '/img/edu-bit.jpg',
    },
    {
      school: 'Universitas Mercu Buana',
      degree: 'Bachelor of Engineering — Electrical Engineering',
      detail: 'Summa Cum Laude · Best Graduate, Class of 2025',
      period: '2021 — 2025',
      img: '/img/edu-medal.jpg',
    },
  ];
  return (
    <section id="education" className="py-24 bg-panel border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader num="09" eyebrow="Education" title="Education" />

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {main.map((e, i) => (
            <Reveal key={e.school} delay={i * 80}>
              <article className="card rounded-2xl p-7 flex gap-6 h-full">
                <div className="relative w-[92px] h-[112px] rounded-lg overflow-hidden border border-line bg-panel-2 flex-shrink-0">
                  <Image src={e.img} alt={e.school} fill sizes="92px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-accent mb-2">{e.period}</div>
                  <h3 className="font-display text-base font-bold text-bright leading-snug mb-1.5">{e.school}</h3>
                  <p className="text-[0.87rem] text-body leading-snug mb-1">{e.degree}</p>
                  <p className="text-[12px] text-dim leading-snug">{e.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-line px-6 py-4">
            <span className="font-mono text-[11px] text-faint">2023</span>
            <span className="text-[0.87rem] text-body">
              Exchange Programme, Spring Semester — Electronics Science and Technology, Beijing Institute of Technology
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 10 RECOMMENDATIONS ───────────────────────────────────────────────────────

function Recommendations() {
  const recs = [
    {
      name: 'Adnan Hasyim Wibowo',
      role: 'Project Manager @ SDGs Hub UI',
      quote: 'Prima consistently demonstrated technical expertise and the creativity to turn complex ideas into innovative solutions. His ability to bridge research, innovation, and real-world impact makes him stand out.',
    },
    {
      name: 'Dendy Mahendra',
      role: 'Collaborator — ReadCharge Project',
      quote: 'Prima contributed far beyond technical implementation, demonstrating strong leadership, collaboration, and the ability to communicate complex ideas clearly. His dedication helped the project create real community impact.',
    },
  ];
  const initials = (n: string) => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('');

  return (
    <section className="py-24 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader num="10" eyebrow="Selected Recommendations" title="What collaborators say." />

        <div className="grid md:grid-cols-2 gap-5">
          {recs.map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <figure className="card rounded-2xl p-8 h-full flex flex-col">
                <blockquote className="text-[1rem] leading-[1.7] text-bright/85 flex-1">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 pt-6 border-t border-line flex items-center gap-4">
                  <span aria-hidden className="w-11 h-11 rounded-full border border-line bg-white/[0.06] flex items-center justify-center font-display text-[13px] font-bold text-accent flex-shrink-0">
                    {initials(r.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9rem] font-semibold text-bright">{r.name}</span>
                    <span className="block text-[12px] text-dim leading-snug mt-0.5">{r.role}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-faint mt-1.5">LinkedIn Recommendation</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 11 BUILD WITH ME ─────────────────────────────────────────────────────────

function BuildWithMe() {
  const areas = [
    ['Invent & Prototype', 'Turning early technical concepts into architectures, proof-of-concepts, and functional prototypes.'],
    ['AIoT & Smart Electronics', 'Connected sensing systems combining embedded electronics, IoT, wireless connectivity, data, and intelligent algorithms.'],
    ['Research → Product', 'Helping translate research concepts into technologies that can be validated, iterated, and developed toward practical products.'],
    ['Deep-Tech Collaboration', 'Working alongside founders, researchers, and multidisciplinary teams on technically ambitious early-stage ideas.'],
  ];

  return (
    <section id="build" className="relative py-24 border-b border-line overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan/[0.06] blur-[150px] pointer-events-none" aria-hidden />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <Reveal className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[11px] text-faint tabular-nums">11</span>
            <span className="h-px w-6 bg-line-strong" />
            <Eyebrow>Build with me</Eyebrow>
          </div>
          <h2 className="font-display text-[2.2rem] md:text-[3.2rem] font-bold leading-[1.02] tracking-[-0.03em] text-bright mb-7">
            From an idea to <span className="grad">something real.</span>
          </h2>
          <p className="text-[1.05rem] leading-[1.6] text-bright/85 mb-5">
            I build alongside deep-tech founders, researchers, and multidisciplinary teams — turning early ideas into technologies that can be designed, prototyped, tested, validated, and developed toward real-world applications.
          </p>
          <p className="text-[0.94rem] leading-[1.7] text-body">
            My strongest interests sit at the intersection of AIoT, smart electronics, intelligent sensing, connected systems, and human-centered technology. I am open to collaborations involving new inventions, technical product development, research-to-product translation, prototyping, early-stage technology exploration, and selected engineering consulting engagements.
          </p>
        </Reveal>

        <Reveal className="mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {areas.map(([t, d], i) => (
              <div key={t} className="card rounded-xl p-6 h-full">
                <div className="font-mono text-[10px] text-accent tabular-nums mb-4">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display text-sm font-bold text-bright mb-2.5 leading-snug">{t}</h3>
                <p className="text-[12.5px] leading-relaxed text-body">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-line-strong bg-white/[0.035] p-8 md:p-12 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h3 className="font-display text-[1.6rem] md:text-[2rem] font-bold tracking-[-0.02em] text-bright mb-4">
                Have an idea worth building?
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-body max-w-2xl">
                Whether it starts as a research question, an engineering challenge, or an early product idea, I am always interested in conversations around technologies that can create meaningful real-world impact.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:flex-shrink-0">
              <a href="mailto:primawijayakusuma38@gmail.com?subject=Let%E2%80%99s%20build%20something"
                className="group inline-flex items-center gap-2 bg-bright text-void font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors">
                Let&rsquo;s Build Something
                <span className="group-hover:translate-x-0.5 transition-transform"><ArrowUpRight /></span>
              </a>
              <a href="#contact"
                className="inline-flex items-center border border-line-strong text-bright font-medium text-sm px-6 py-3.5 rounded-full hover:bg-white/5 transition-colors">
                Start a Conversation
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CONTACT / FOOTER ─────────────────────────────────────────────────────────

function Contact() {
  const links = [
    { label: 'Email', value: 'primawijayakusuma38@gmail.com', href: 'mailto:primawijayakusuma38@gmail.com' },
    { label: 'LinkedIn', value: 'in/primawijayakusuma', href: 'https://www.linkedin.com/in/primawijayakusuma/' },
    { label: 'GitHub', value: 'primawijayakusuma', href: 'https://github.com/primawijayakusuma' },
  ];
  return (
    <footer id="contact" className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="font-display text-[2rem] md:text-[2.6rem] font-bold tracking-[-0.025em] text-bright mt-5 mb-4">
                Prima Wijayakusuma
              </h2>
              <p className="text-[0.95rem] text-body max-w-lg">
                Engineer, innovation practitioner, and technology builder — open to research collaborations, early-stage technology projects, and conversations about what could be built.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3 w-full lg:w-[340px]">
              {links.map(l => (
                <a key={l.label} href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group card rounded-xl px-5 py-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint mb-1.5">{l.label}</div>
                  <div className="text-[12.5px] text-bright break-all flex items-center gap-1.5">
                    {l.value}
                    <span className="text-dim group-hover:text-accent transition-colors flex-shrink-0">
                      <ArrowUpRight cls="w-3 h-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rule mt-14 mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-mono text-[11px] text-faint">
              © {new Date().getFullYear()} Prima Wijayakusuma
            </p>
            <p className="font-mono text-[11px] text-faint">
              Engineer · Innovation Practitioner · Technology Builder
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <TerraGrow />
        <Ventures />
        <SelectedWork />
        <Research />
        <Recognition />
        <Education />
        <Recommendations />
        <BuildWithMe />
      </main>
      <Contact />
    </>
  );
}
