/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Code,
  Code2,
  Award,
  Globe,
  FileText,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  X,
  ExternalLink,
  Sparkles,
  Mail,
} from 'lucide-react';
import { playHoverSound, playClickSound } from './utils/soundEffects';
import { TypeText } from './components/TypeText';
import { GithubHeatmap } from './components/GithubHeatmap';
import {
  PROJECTS_DATA,
  CERTIFICATES_DATA,
  TECH_STACK_DATA,
  BACKGROUND_VIDEO_URL,
  PROFILE_IMAGE_URL,
  ProjectItem,
} from './data/portfolioData';

const EASE_CURVE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LanyardCanvas = lazy(() =>
  import('./components/LanyardCanvas').then(({ LanyardCanvas: Component }) => ({
    default: Component,
  }))
);

function useVelocityScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    if (reducedMotion.matches) return;

    let frameId = 0;
    let targetY = window.scrollY;
    let smoothingWheel = false;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;
    const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-layer]'));
    const originalTransforms = layers.map((layer) => layer.style.transform);
    layers.forEach((layer) => {
      layer.style.willChange = 'transform';
    });

    const scheduleFrame = () => {
      if (!frameId) frameId = requestAnimationFrame(updateFrame);
    };

    const updateFrame = (time: number) => {
      frameId = 0;
      const elapsed = Math.min(time - lastTime, 32);
      lastTime = time;

      if (reducedMotion.matches) {
        velocity = 0;
        smoothingWheel = false;
      }

      if (smoothingWheel) {
        const currentY = window.scrollY;
        const amount = 1 - Math.exp(-elapsed / 125);
        const nextY = currentY + (targetY - currentY) * amount;
        window.scrollTo({ top: nextY, behavior: 'instant' as ScrollBehavior });
        if (Math.abs(targetY - nextY) < 0.75) {
          window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
          smoothingWheel = false;
        }
      } else {
        velocity *= Math.exp(-elapsed / 115);
      }

      const offset = Math.max(-8, Math.min(8, -velocity * 1.25));
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.scrollLayer) || 1;
        const mobileScale = desktop.matches ? 1 : 0.25;
        layer.style.transform = `translate3d(0, ${offset * depth * mobileScale}px, 0)`;
      });

      if (smoothingWheel || Math.abs(velocity) > 0.015) scheduleFrame();
    };

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const elapsed = Math.max(now - lastTime, 1);
      velocity = (currentY - lastY) / elapsed;
      lastY = currentY;
      if (!smoothingWheel) targetY = currentY;
      scheduleFrame();
    };

    const canScrollInsideTarget = (target: EventTarget | null, deltaY: number) => {
      if (!(target instanceof HTMLElement)) return false;
      let element: HTMLElement | null = target;
      while (element && element !== document.body) {
        const { overflowY } = window.getComputedStyle(element);
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          element.scrollHeight > element.clientHeight
        ) {
          const canScrollUp = element.scrollTop > 0;
          const canScrollDown =
            element.scrollTop + element.clientHeight < element.scrollHeight - 1;
          if ((deltaY < 0 && canScrollUp) || (deltaY > 0 && canScrollDown)) return true;
        }
        element = element.parentElement;
      }
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (
        reducedMotion.matches ||
        !desktop.matches ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        canScrollInsideTarget(event.target, event.deltaY)
      ) {
        return;
      }

      const pixelDelta = Math.abs(event.deltaY);
      const isWheelInput =
        event.deltaMode !== 0 ||
        (pixelDelta >= 80 &&
          (Math.abs(pixelDelta % 100) < 1 || Math.abs(pixelDelta % 120) < 1));
      if (!isWheelInput || !event.cancelable) return;

      event.preventDefault();
      const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      targetY = Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - innerHeight,
          (smoothingWheel ? targetY : window.scrollY) + event.deltaY * multiplier
        )
      );
      smoothingWheel = true;
      scheduleFrame();
    };

    const stopWheelSmoothing = () => {
      smoothingWheel = false;
      targetY = window.scrollY;
      if (reducedMotion.matches) {
        velocity = 0;
        layers.forEach((layer, index) => {
          layer.style.transform = originalTransforms[index];
        });
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
        stopWheelSmoothing();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', stopWheelSmoothing, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    reducedMotion.addEventListener('change', stopWheelSmoothing);
    desktop.addEventListener('change', stopWheelSmoothing);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', stopWheelSmoothing);
      window.removeEventListener('keydown', onKeyDown);
      reducedMotion.removeEventListener('change', stopWheelSmoothing);
      desktop.removeEventListener('change', stopWheelSmoothing);
      if (frameId) cancelAnimationFrame(frameId);
      layers.forEach((layer, index) => {
        layer.style.transform = originalTransforms[index];
        layer.style.willChange = '';
      });
    };
  }, [enabled]);
}

// 1. Responsive Background (Desktop + Mobile Artwork) — Classic Crisp Pixel Backdrop
function BackgroundOrbs({
  active,
  onReady,
}: {
  active: boolean;
  onReady: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.screen.width < 768);
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      return;
    }

    void video.play().catch((error: unknown) => {
      console.error('Failed to start background video playback:', error);
    });
  }, [active]);

  return (
    <div
      className="fixed top-0 left-0 z-0 overflow-hidden pointer-events-none transition-colors duration-300"
      style={{
        width: '100vw',
        height: '100svh',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <video
        ref={videoRef}
        src={BACKGROUND_VIDEO_URL}
        autoPlay={active}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onLoadedMetadata={onReady}
        onError={() => {
          console.error('Failed to load background video:', BACKGROUND_VIDEO_URL);
          onReady();
        }}
        className="w-full h-full object-cover object-center transition-opacity duration-500"
        style={{
          opacity: isMobile ? 0.35 : 0.28,
          objectPosition: isMobile ? '90% top' : 'center center',
        }}
      />
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,12,0.78) 0%, rgba(8,8,12,0.88) 50%, rgba(8,8,12,0.96) 100%)',
        }}
      />

      {/* Crisp Classic Grid Overlay */}
      <div
        className="absolute inset-0 bg-[size:32px_32px]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
        }}
      />
    </div>
  );
}

// 2. Top Floating Navigation Bar (Classic Pixel Art HUD)
function Navbar({
  showApp,
}: {
  showApp: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    let rafId = 0;
    let ticking = false;

    const updateActiveSection = () => {
      setScrolled(window.scrollY > 20);
      for (const id of ['home', 'about', 'portfolio', 'contact']) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(id);
          break;
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!showApp) return;
    if (sessionStorage.getItem('navbarPlayed') === 'true') {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem('navbarPlayed', 'true');
    }, 250);
    return () => clearTimeout(timer);
  }, [showApp]);

  if (!mounted) return null;

  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, selector: string) => {
    e.preventDefault();
    const target = document.querySelector(selector);
    if (!target) return;
    const targetY = target.getBoundingClientRect().top + window.scrollY - 3;
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / 1200, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo({ top: startY + diff * eased });
      if (elapsed < 1200) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -30 }}
      transition={{ duration: 0.8, ease: EASE_CURVE }}
      style={{
        position: 'fixed',
        top: 16,
        left: 24,
        right: 24,
        zIndex: 50,
      }}
    >
      <div
        className="modern-card max-w-7xl mx-auto"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          width: '100%',
          backgroundColor: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
          borderRadius: '0.875rem',
        }}
      >
        <span
          className="font-pixel-title flex items-center gap-2"
          style={{
            fontSize: 13,
            color: 'var(--accent)',
            letterSpacing: '0.08em',
          }}
        >
          <span
            className="inline-block w-2.5 h-2.5 animate-pulse"
            style={{ backgroundColor: 'var(--accent)' }}
          />
          kagenoureal
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
                className={`font-pixel-title nav-link-item ${isActive ? 'pixel-dither-bg' : ''}`}
                style={{
                  fontSize: 12,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: 2,
                      background: 'var(--accent)',
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

// 3. Hero Section
const HERO_SKILLS = [
  'Node.js',
  'Express',
  'Next.js',
  'React',
  'Bun',
  'Laravel',
];

const TECH_STACK_CATEGORIES = [
  { id: 'languages', title: 'Languages & Web' },
  { id: 'frameworks', title: 'Frameworks & Runtime' },
  { id: 'skills', title: 'Focus Areas' },
] as const;

function HeroSection({ showApp }: { showApp: boolean }) {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (!showApp) return;
    if (sessionStorage.getItem('heroPlayed') === 'true') {
      setPlayed(true);
      return;
    }
    const t1 = setTimeout(() => {
      setPlayed(true);
    }, 150);
    const t2 = setTimeout(() => {
      sessionStorage.setItem('heroPlayed', 'true');
    }, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [showApp]);

  return (
    <section
      id="home"
      data-scroll-layer="0.25"
      className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-8 md:pb-10 flex items-center justify-between relative z-[1] overflow-hidden"
    >
      {/* 3D WebGL Lanyard Canvas (Desktop + HP Mobile) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: showApp ? 'auto' : 'none',
        }}
      >
        {showApp && (
          <Suspense fallback={null}>
            <LanyardCanvas />
          </Suspense>
        )}
      </div>

      <div
        className="relative z-20 w-full md:max-w-[560px]"
      >
        <motion.div
          initial={false}
          animate={
            played
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8, ease: EASE_CURVE }}
          style={{ marginBottom: 20 }}
        >
          <span
            className="font-pixel-title modern-card inline-flex items-center gap-2 px-4 py-1.5"
            style={{
              fontSize: 11,
              color: 'var(--accent)',
              borderColor: 'var(--border-strong)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ★ OPEN TO INTERESTING STUFF
          </span>
        </motion.div>

        <div>
          <motion.h1
            initial={false}
            animate={
              played
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.85, y: 50 }
            }
            transition={{ duration: 0.9, ease: EASE_CURVE }}
            className="font-pixel-title"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 58px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 4,
            }}
          >
            Backend
          </motion.h1>
          <motion.h1
            initial={false}
            animate={
              played
                ? { opacity: 1, x: 0, rotate: 0 }
                : { opacity: 0, x: -80, rotate: -4 }
            }
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_CURVE }}
            className="font-pixel-title"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 58px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--accent)',
              letterSpacing: '-0.02em',
              marginBottom: 22,
            }}
          >
            Developer
          </motion.h1>
        </div>

        <motion.div
          initial={false}
          animate={played ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ marginBottom: 14 }}
        >
          <span
            className="font-pixel-title"
            style={{
              fontSize: 14,
              color: 'var(--accent)',
              letterSpacing: '0.06em',
            }}
          >
            <TypeText
              text={[
                'Backend Development',
                'Bot Development',
                'Reverse Engineering',
                'Vibe Coding',
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="█"
              deletingSpeed={50}
              cursorBlinkDuration={0.5}
            />
          </span>
        </motion.div>

        <motion.div
          initial={false}
          animate={
            played
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 40 }
          }
          transition={{ duration: 0.9, delay: 0.45 }}
          style={{ marginBottom: 26, width: '100%', maxWidth: 500 }}
        >
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              letterSpacing: '0.01em',
              textWrap: 'pretty',
            }}
          >
            I build backend systems, bots, APIs, scrapers, and Linux-side tooling. I use AI heavily — getting the thing to work matters more than memorizing every damn syntax.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={played ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.6 },
            },
          }}
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 28,
          }}
        >
          {HERO_SKILLS.map((skill) => (
            <motion.span
              key={skill}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="font-pixel-title modern-card"
              style={{
                fontSize: 10.5,
                color: 'var(--text-primary)',
                padding: '6px 14px',
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={false}
          animate={played ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12.5,
              color: 'var(--text-muted)',
            }}
          >
            ▼ check the projects before I break something again
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12.5,
              color: 'var(--text-muted)',
            }}
          >
            ↗ open to interesting projects, collabs, and weird technical stuff
          </span>
        </motion.div>

        {/* Scroll Indicator Left-Aligned under text */}
        <motion.div
          initial={false}
          animate={played ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="inline-flex"
        >
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="modern-card inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-zinc-950/80 hover:bg-red-950/30 backdrop-blur-md shadow-lg transition cursor-pointer"
          >
            <span
              className="font-pixel-title text-[10px] tracking-widest font-bold uppercase"
              style={{ color: 'var(--accent)' }}
            >
              SCROLL
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent)' }}>▼            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// 4. About Section
const aboutStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16 } },
};

const aboutFadeUp = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_CURVE },
  },
};

const aboutAvatarVariant = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE_CURVE },
  },
};

function AboutSection({ showApp }: { showApp: boolean }) {
  const [avatarError, setAvatarError] = useState(false);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const heatmapInView = useInView(heatmapRef, { once: true, amount: 0.1 });

  const scrollToPortfolio = () => {
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const projectCount = PROJECTS_DATA.length;

  const stats = [
    {
      icon: <Code size={18} style={{ color: 'var(--accent)' }} />,
      value: String(projectCount),
      title: 'PROJECTS',
    },
    {
      icon: <Award size={18} style={{ color: 'var(--accent)' }} />,
      value: String(CERTIFICATES_DATA.length),
      title: 'CERTIFICATES',
    },
    {
      icon: <Award size={18} style={{ color: 'var(--accent)' }} />,
      value: String(TECH_STACK_DATA.length),
      title: 'STACK',
    },
  ];

  return (
    <section
      id="about"
      data-scroll-layer="0.5"
      className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-6 md:pt-6 md:pb-8 relative z-[2] -mt-2 md:-mt-4"
      style={{ color: 'var(--text-primary)' }}
    >
      <motion.div
        style={{ width: '100%' }}
        initial={{ opacity: 0, y: 35 }}
        whileInView={showApp ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8 }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '36px',
          }}
        >
          <motion.div
            variants={aboutStagger}
            initial="hidden"
            whileInView={showApp ? 'show' : undefined}
            viewport={{ once: true, margin: '-80px' }}
            style={{ maxWidth: '600px', width: '100%' }}
          >
            <motion.div variants={aboutFadeUp} style={{ marginBottom: 14 }}>
              <span
                className="font-pixel-title"
                style={{
                  fontSize: 12,
                  color: 'var(--accent)',
                  letterSpacing: '0.16em',
                }}
              >
                [ CHARACTER PROFILE // ABOUT ME ]
              </span>
            </motion.div>

            <motion.div variants={aboutFadeUp}>
              <div
                className="font-pixel-title"
                style={{
                  fontSize: 'clamp(28px,4.5vw,42px)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: 'var(--text-primary)',
                }}
              >
                <div>Kagenou</div>
                <div
                  style={{
                    color: 'var(--accent)',
                    fontSize: 'clamp(16px,2.2vw,24px)',
                    marginTop: 8,
                  }}
                >
                  Backend Developer / Vibe Coder
                </div>
              </div>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, delay: 0.2 },
                },
              }}
              style={{
                marginTop: 18,
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                maxWidth: '520px',
              }}
            >
              I&apos;m mainly into backend development and reverse engineering, with bots, servers, networking, APIs, scraping, Linux, and automation in the mix. I can build web interfaces too, but frontend isn&apos;t my main lane.
              <br />
              I&apos;m a heavy AI-assisted coder: AI writes a lot of the code; I bring the ideas and prompts, then test, debug, integrate, and iterate until it works.
              <br />
              Most projects start with &quot;wtf, can I automate this?&quot; I like figuring out how stuff works under the hood, breaking it, fixing it, and somehow shipping the weird result.
              <br />
              Somehow it works. Don&apos;t ask me why.
            </motion.p>

            <motion.div
              variants={aboutFadeUp}
              style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}
            >
              <a
                href="https://github.com/kagenouReal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button
                  className="modern-btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <FileText size={15} />
                  GitHub Profile
                </button>
              </a>
            </motion.div>

            {/* Quote Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.3 },
                },
              }}
              className="modern-card"
              style={{
                marginTop: 20,
                padding: '12px 20px',
                fontSize: 13,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                width: 'fit-content',
              }}
            >
              <span className="font-pixel-title text-xs" style={{ color: 'var(--accent)' }}>
                ▸
              </span>
              <span style={{ color: 'var(--text-primary)' }}>
                “Just coding, reversing, vibing, and somehow shipping.”
              </span>
            </motion.div>

          </motion.div>

          <motion.div
            variants={aboutAvatarVariant}
            initial="hidden"
            whileInView={showApp ? 'show' : undefined}
            viewport={{ once: true }}
            style={{
              width: '48%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <div className="relative modern-card p-4">
              {!avatarError ? (
                <img
                  src={PROFILE_IMAGE_URL}
                  alt="Kagenou Profile Avatar"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  style={{
                    width: 250,
                    height: 250,
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: '0.5rem',
                    border: '2px solid var(--border)',
                  }}
                />
              ) : (
                <div
                  className="font-pixel-title"
                  style={{
                    width: 250,
                    height: 250,
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 64,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    borderRadius: '0.5rem',
                  }}
                >
                  K
                </div>
              )}

              <div
                className="mt-3 py-1.5 px-3 text-center font-pixel-title text-[10px] tracking-wider"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                  border: '1px solid var(--border-strong)',
                }}
              >
                ★ BACKEND DEV // VIBE CODER ★
              </div>
            </div>
          </motion.div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginTop: 28,
          }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30, y: 20 }}
              whileInView={showApp ? { opacity: 1, x: 0, y: 0 } : undefined}
              transition={{ duration: 0.65, delay: 0.05 * idx }}
              whileHover={{ y: -3 }}
              onClick={scrollToPortfolio}
              className="modern-card"
              style={{
                position: 'relative',
                padding: '18px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: '2px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                {stat.icon}
              </div>
              <div
                className="font-pixel-title"
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {stat.value}
              </div>
              <div
                className="font-pixel-title"
                style={{ fontSize: 11.5, letterSpacing: '0.08em', color: 'var(--text-primary)' }}
              >
                {stat.title}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  color: 'var(--accent)',
                }}
              >
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* GitHub Heatmap D3 Component */}
        <motion.div
          ref={heatmapRef}
          initial={{ opacity: 0, y: 30 }}
          animate={showApp && heatmapInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ marginTop: 20 }}
        >
          <GithubHeatmap username="kagenouReal" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// 5. Project Card Component
function ProjectCard({
  project,
  index,
  onSelectDetail,
  animateOnReveal,
}: {
  project: ProjectItem;
  index: number;
  onSelectDetail: (p: ProjectItem) => void;
  animateOnReveal: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
      whileInView={animateOnReveal ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: 0.65, delay: 0.05 * index }}
      whileHover={{ y: -3 }}
      className="group relative modern-card p-4 sm:p-5 flex flex-col min-h-[290px]"
    >
      <div
        className="w-full h-36 overflow-hidden mb-3.5 relative"
        style={{
          border: '2px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        {project.image_url && !imgErr ? (
          <img
            src={project.image_url}
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xs font-pixel-title"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.title}
          </div>
        )}
        <div
          className="absolute top-2.5 right-2.5 px-2.5 py-1 font-pixel-title text-[9px]"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--accent)',
          }}
        >
          QUEST #{index + 1}
        </div>
      </div>

      <h3
        className="font-pixel-title text-[15px] mb-2 leading-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {project.title}
      </h3>
      <p
        className="text-[12.5px] leading-relaxed line-clamp-2 min-h-[38px]"
        style={{ color: 'var(--text-secondary)' }}
      >
        {project.description}
      </p>

      <div className="mt-auto pt-4 flex items-center justify-between">
        {project.live_url ? (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel-title flex items-center gap-1.5 text-[11px] transition-all hover:translate-x-0.5"
            style={{ color: 'var(--accent)' }}
          >
            GitHub Repo
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            No Link
          </div>
        )}

        <button
          onClick={() => onSelectDetail(project)}
          className="modern-btn-secondary px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] cursor-pointer"
        >
          Details
          <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// 6. Portfolio Showcase Section
function PortfolioSection({ showApp }: { showApp: boolean }) {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    setIsPhone(window.screen.width < 768);
  }, []);

  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'techstack'>('projects');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const visibleProjects = showAllProjects ? PROJECTS_DATA : PROJECTS_DATA.slice(0, 3);

  return (
    <>
      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[999] flex items-center justify-center px-6"
            style={{ backgroundColor: 'var(--modal-backdrop)' }}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="modern-btn-secondary absolute top-6 right-6 w-11 h-11 flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightboxImage}
              alt="Certificate Preview"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
              className="max-w-[88vw] max-h-[88vh] object-contain shadow-2xl"
              style={{
                border: '3px solid var(--accent)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            style={{ backgroundColor: 'var(--modal-backdrop)' }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: EASE_CURVE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl modern-card p-6 md:p-8"
              style={{ color: 'var(--text-primary)' }}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="modern-btn-secondary absolute top-5 right-5 w-10 h-10 flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <div
                className="w-full h-52 sm:h-64 overflow-hidden mb-6"
                style={{
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2
                className="font-pixel-title text-xl md:text-2xl mb-3"
                style={{ color: 'var(--accent)' }}
              >
                {selectedProject.title}
              </h2>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                {selectedProject.description}
              </p>

              <div className="mb-6">
                <p
                  className="font-pixel-title text-xs uppercase tracking-wider mb-2.5"
                  style={{ color: 'var(--accent)' }}
                >
                  Technologies Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-pixel-title px-3 py-1 text-[11px]"
                      style={{
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-7">
                <p
                  className="font-pixel-title text-xs uppercase tracking-wider mb-2.5"
                  style={{ color: 'var(--accent)' }}
                >
                  Key Features
                </p>
                <ul className="space-y-2">
                  {selectedProject.key_features.map((feat, i) => (
                    <li
                      key={i}
                      className="modern-card p-2.5 px-3.5 text-xs sm:text-sm flex items-start gap-3"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                      <span
                        className="font-pixel-title text-xs mt-0.5 flex-shrink-0"
                        style={{ color: 'var(--accent)' }}
                      >
                        ▸
                      </span>
                      <span style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={selectedProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-btn-primary px-5 py-3 text-xs font-bold flex items-center gap-2 transition"
                >
                  Open on GitHub
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="modern-btn-secondary px-5 py-3 text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="portfolio"
        data-scroll-layer="0.75"
        className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-8 md:pt-6 md:pb-10 relative z-[3] -mt-2 md:-mt-4"
        style={{ color: 'var(--text-primary)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={showApp ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8 }}
          className="text-center mb-7"
        >
          <h1
            className="font-pixel-title text-2xl md:text-4xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Portfolio Showcase
          </h1>
          <p
            className="max-w-xl mx-auto text-sm md:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Some things I built, broke, fixed, and somehow decided to keep.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={showApp ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="w-full max-w-2xl modern-card p-1.5 flex gap-1.5">
            {(['projects', 'certificates', 'techstack'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab !== 'projects') setShowAllProjects(false);
                  }}
                  className={`flex-1 font-pixel-title py-3 text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    !isActive ? 'pixel-dither-hover' : ''
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--btn-primary-bg)',
                          color: 'var(--btn-primary-text)',
                          fontWeight: 700,
                          boxShadow: '3px 3px 0px #000000',
                        }
                      : {
                          color: 'var(--text-secondary)',
                        }
                  }
                >
                  {tab === 'projects'
                    ? 'Projects'
                    : tab === 'certificates'
                    ? 'Certificates'
                    : 'Tech Stack'}
                </button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.6, ease: EASE_CURVE } }}
                  className={`grid md:grid-cols-2 ${
                    isPhone ? 'min-[65rem]:grid-cols-3' : 'xl:grid-cols-3'
                  } gap-5 px-1`}
                >
                  <AnimatePresence mode="popLayout">
                    {visibleProjects.map((project, idx) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.45,
                          delay: 0.04 * idx,
                          ease: EASE_CURVE,
                        }}
                      >
                        <ProjectCard
                          project={project}
                          index={idx}
                          onSelectDetail={(p) => setSelectedProject(p)}
                          animateOnReveal={showApp}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {PROJECTS_DATA.length > 3 && (
                  <motion.div
                    layout
                    transition={{ duration: 0.5, ease: EASE_CURVE }}
                    className="flex justify-center"
                  >
                    <motion.button
                      layout
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAllProjects((showing) => !showing)}
                      className="modern-btn-secondary px-6 py-3 text-xs flex items-center gap-2 cursor-pointer"
                    >
                      {showAllProjects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {showAllProjects ? 'See Less' : 'See More'}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'certificates' && (
              <div
                className={`grid md:grid-cols-2 ${
                  isPhone ? 'min-[65rem]:grid-cols-3' : 'xl:grid-cols-3'
                } gap-5 px-1`}
              >
                {CERTIFICATES_DATA.map((cert, idx) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30, y: 20 }}
                    whileInView={showApp ? { opacity: 1, x: 0, y: 0 } : undefined}
                    transition={{ duration: 0.65, delay: 0.05 * idx }}
                    whileHover={{ y: -3 }}
                    onClick={() => {
                      setLightboxImage(cert.image_url);
                      setLightboxOpen(true);
                    }}
                    className="group cursor-pointer modern-card p-4"
                  >
                    <div
                      className="overflow-hidden h-52"
                      style={{
                        border: '2px solid var(--border)',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    >
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <h3
                      className="font-pixel-title mt-3 text-[13px] text-center"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {cert.title}
                    </h3>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'techstack' && (
              <div className="min-h-[360px] max-w-5xl mx-auto space-y-9">
                {TECH_STACK_CATEGORIES.map((category) => {
                  const items = TECH_STACK_DATA.filter((item) => item.category === category.id);
                  if (items.length === 0) return null;

                  return (
                    <section
                      key={category.id}
                      aria-labelledby={`tech-${category.id}`}
                      className="border-t-2 pt-5"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h2
                          id={`tech-${category.id}`}
                          className="font-pixel-title text-xs sm:text-sm text-[var(--accent)]"
                        >
                          {category.title}
                        </h2>
                        <span
                          className="shrink-0 font-mono text-[10px] tracking-wider"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {String(items.length).padStart(2, '0')} ITEMS
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {items.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30, y: 20 }}
                            whileInView={showApp ? { opacity: 1, x: 0, y: 0 } : undefined}
                            transition={{ duration: 0.65, delay: 0.05 * idx }}
                            whileHover={{ y: -2 }}
                            className="group modern-card pixel-dither-hover flex items-center gap-3 min-h-[88px] w-full p-3"
                          >
                            <div
                              className="relative flex h-12 w-12 shrink-0 items-center justify-center border-2"
                              style={{
                                borderColor: 'var(--border)',
                                backgroundColor: 'var(--bg-secondary)',
                              }}
                            >
                              {item.logo_url ? (
                                <img
                                  src={item.logo_url}
                                  alt={item.name}
                                  referrerPolicy="no-referrer"
                                  className="relative z-10 h-8 w-8 object-contain"
                                />
                              ) : (
                                <div
                                  className="relative z-10 h-8 w-8"
                                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                                />
                              )}
                            </div>
                            <p
                              className="min-w-0 font-mono text-xs font-medium leading-snug line-clamp-2"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {item.name}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}

// 7. Contact Section (Form + Direct Channels)
function WhatsAppIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 448 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.39-.51 1.08-.78 4.23-1.84 7.05-3.05 8.45-3.63 4.02-1.68 4.86-1.97 5.4-1.98.12 0 .39.03.56.17.14.12.18.28.2.45-.02.07-.02.13-.04.2z"/>
    </svg>
  );
}

function ContactChannelsCard({ showApp }: { showApp: boolean }) {
  const socialGridLinks = [
    {
      title: 'WhatsApp',
      user: 'wa.me/kagenouReal',
      icon: WhatsAppIcon,
      link: 'https://wa.me/kagenouReal',
      highlight: true,
      desc: 'Fastest response for inquiries',
    },
    {
      title: 'Telegram',
      user: 't.me/kagenouonly',
      icon: TelegramIcon,
      link: 'https://t.me/kagenouonly',
      highlight: false,
      desc: 'Direct chats & messaging',
    },
    {
      title: 'Email',
      user: 'kagenoureal@gmail.com',
      icon: Mail,
      link: 'mailto:kagenoureal@gmail.com',
      highlight: false,
      desc: 'Send me an email',
    },
    {
      title: 'TikTok',
      user: '@veryy_lazyy',
      icon: TikTokIcon,
      link: 'https://tiktok.com/@veryy_lazyy',
      highlight: false,
      desc: 'Short clips & automation stuff',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={showApp ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8 }}
      className="modern-card w-full p-6 sm:p-7 md:p-8 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-2.5 h-2.5 animate-pulse"
            style={{ backgroundColor: 'var(--accent)' }}
          />
          <h2
            className="font-pixel-title text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--accent)' }}
          >
            Direct Channels
          </h2>
        </div>

        <p className="text-base mb-7 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Open to interesting projects, collabs, automation ideas, API stuff, and technically cursed experiments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {socialGridLinks.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30, y: 20 }}
                whileInView={showApp ? { opacity: 1, x: 0, y: 0 } : undefined}
                transition={{ duration: 0.65, delay: 0.05 * idx }}
                className="group modern-card min-h-[76px] min-w-0 p-4 flex items-center justify-between gap-3 transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: item.highlight ? 'var(--bg-badge)' : 'var(--bg-card)',
                  borderColor: item.highlight ? 'var(--accent)' : 'var(--border)',
                }}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className="w-11 h-11 shrink-0 flex items-center justify-center font-pixel-title text-sm"
                    style={{
                      border: '2px solid var(--border)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: item.highlight ? '#ffffff' : 'var(--accent)',
                    }}
                  >
                    <IconComp />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-pixel-title text-sm" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </p>
                      {item.highlight && (
                        <span
                          className="font-pixel-title text-[10px] px-2 py-0.5"
                          style={{
                            backgroundColor: 'var(--accent)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        >
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="break-all text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {item.user}
                    </p>
                  </div>
                </div>
                <div
                  className="w-9 h-9 shrink-0 flex items-center justify-center modern-card"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--accent)',
                  }}
                >
                  <ArrowUpRight size={16} />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <div
        className="mt-7 pt-5 flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{ borderTop: '2px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <span className="font-pixel-title text-[11px] flex items-center gap-2">
          <Sparkles size={12} style={{ color: 'var(--accent)' }} />
          OPEN TO INTERESTING STUFF
        </span>
        <span className="font-pixel-title text-[11px]">PROJECTS • COLLABS • WEIRD IDEAS</span>
      </div>
    </motion.div>
  );
}

function ContactSection({ showApp }: { showApp: boolean }) {
  return (
    <section
      id="contact"
      data-scroll-layer="1"
      className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-10 md:pt-6 md:pb-12 relative z-[4] -mt-2 md:-mt-4"
      style={{ color: 'var(--text-primary)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={showApp ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 sm:mb-10 lg:mb-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          whileInView={showApp ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE_CURVE }}
          viewport={{ once: true }}
          className="font-pixel-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Contact Me
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={showApp ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_CURVE }}
          viewport={{ once: true }}
          className="text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Got a project idea, a weird API, or something that needs automating? Let&apos;s talk.
        </motion.p>
      </motion.div>

      <div className="w-full">
        <ContactChannelsCard showApp={showApp} />
      </div>

      <div
        className="mt-12 text-center font-pixel-title text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        © 2026 Kagenou — still shipping somehow.
      </div>
    </section>
  );
}

// 8. Intro Splash Screen
function IntroSplash() {
  const icons = [Code2, User, Globe];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '20px',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: EASE_CURVE }}
        style={{
          textAlign: 'center',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
          maxWidth: '380px',
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.25 } },
          }}
          style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icons.map((IconComp, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, scale: 0.5, y: 40 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              transition={{ duration: 1.2, ease: EASE_CURVE }}
              animate={{ y: [0, -6, 0] }}
              className="modern-card"
              style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComp size={20} style={{ color: 'var(--accent)' }} />
            </motion.div>
          ))}
        </motion.div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <motion.span
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 1.2, ease: EASE_CURVE }}
              className="font-pixel-title"
              style={{
                fontSize: 'clamp(16px, 2.8vw, 24px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Welcome
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 1.2, ease: EASE_CURVE }}
              className="font-pixel-title"
              style={{
                fontSize: 'clamp(16px, 2.8vw, 24px)',
                fontWeight: 700,
                color: 'var(--accent)',
              }}
            >
              to my
            </motion.span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1.2, ease: EASE_CURVE }}
            className="font-pixel-title"
            style={{
              fontSize: 'clamp(16px, 2.8vw, 24px)',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              color: 'var(--accent)',
            }}
          >
            Portfolio
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.2, ease: EASE_CURVE }}
          className="modern-card font-pixel-title"
          style={{
            padding: '10px 20px',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
          }}
        >
          ★ github.com/kagenouReal ★
        </motion.div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="font-pixel-title"
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 10,
          letterSpacing: '0.12em',
          pointerEvents: 'none',
        }}
      >
        ↑ SWIPE UP TO ENTER
      </motion.div>
    </div>
  );
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (typeof image.decode === 'function') {
        image.decode().then(() => resolve()).catch(reject);
      } else {
        resolve();
      }
    };
    image.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    image.src = src;
  });
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const [soundEnabled] = useState(true);
  const introVoiceRef = useRef<HTMLAudioElement>(null);
  const backgroundSoundRef = useRef<HTMLAudioElement>(null);
  const introVoicePrimedRef = useRef(false);
  const introVoiceStartedRef = useRef(false);
  const showAppRef = useRef(false);
  const splashPointerStartYRef = useRef<number | null>(null);
  const [swipeToEnter, setSwipeToEnter] = useState(false);
  const [coreAssetsReady, setCoreAssetsReady] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [minimumSplashElapsed, setMinimumSplashElapsed] = useState(false);

  useVelocityScroll(showApp);

  const startIntroVoiceAfterSplash = () => {
    const audio = introVoiceRef.current;
    if (!audio || !introVoicePrimedRef.current || introVoiceStartedRef.current) return;

    introVoiceStartedRef.current = true;
    audio.currentTime = 0;
    audio.loop = false;
    audio.volume = 0.24816;
    audio.muted = false;
  };

  const handleSplashPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    splashPointerStartYRef.current = event.clientY;
  };

  const handleSplashPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const startY = splashPointerStartYRef.current;
    splashPointerStartYRef.current = null;
    if (startY === null || startY - event.clientY < 60) return;

    setSwipeToEnter(true);
    const backgroundSound = backgroundSoundRef.current;
    if (backgroundSound && backgroundSound.paused) {
      backgroundSound.loop = true;
      backgroundSound.volume = 0.825;
      void backgroundSound.play().catch((error: unknown) => {
        console.warn('The browser blocked background sound playback:', error);
      });
    }

    const audio = introVoiceRef.current;
    if (!audio || introVoicePrimedRef.current || introVoiceStartedRef.current) return;

    audio.muted = true;
    audio.loop = true;
    audio.currentTime = 0;
    void audio.play().then(() => {
      introVoicePrimedRef.current = true;
      if (showAppRef.current) startIntroVoiceAfterSplash();
    }).catch((error: unknown) => {
      audio.pause();
      audio.muted = false;
      audio.loop = false;
      console.warn('The browser blocked intro voice playback after the splash swipe:', error);
    });
  };

  useEffect(() => {
    if (!soundEnabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], .modern-card, .modern-btn-primary, .modern-btn-secondary, input, textarea, .nav-link-item'
      );
      if (interactive) {
        playHoverSound(true);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], .modern-card, .modern-btn-primary, .modern-btn-secondary, input, textarea, .nav-link-item'
      );
      if (interactive) {
        playClickSound(true);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, [soundEnabled]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#portfolio') {
      showAppRef.current = true;
      setShowIntro(false);
      setShowApp(true);
      return;
    }
    showAppRef.current = false;
    setShowIntro(true);
    setShowApp(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const timer = setTimeout(() => {
      setMinimumSplashElapsed(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const coreAssets = [
      fetch('/assets/kartu.glb').then((response) => {
        if (!response.ok) throw new Error(`Card model preload failed: HTTP ${response.status}`);
        return response.arrayBuffer();
      }),
      preloadImage('/assets/card-avatar.png'),
    ];

    void Promise.allSettled(coreAssets).then((results) => {
      for (const result of results) {
        if (result.status === 'rejected') {
          console.error('A core visual asset failed to preload:', result.reason);
        }
      }
      if (!cancelled) setCoreAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (minimumSplashElapsed && coreAssetsReady && backgroundReady && swipeToEnter) {
      setShowIntro(false);
    }
  }, [minimumSplashElapsed, coreAssetsReady, backgroundReady, swipeToEnter]);

  const handleIntroExit = () => {
    showAppRef.current = true;
    setShowApp(true);
    startIntroVoiceAfterSplash();
  };

  useEffect(() => {
    if (showApp) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      touchAction: body.style.touchAction,
    };
    const previousRootOverflow = root.style.overflow;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    root.style.overflow = 'hidden';

    return () => {
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.touchAction = previousBodyStyles.touchAction;
      root.style.overflow = previousRootOverflow;
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [showApp]);

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      <audio
        ref={introVoiceRef}
        src="/assets/intro-voice.mp3"
        preload="auto"
        onError={() => console.error('Failed to load intro voice: /assets/intro-voice.mp3')}
      />
      <audio
        ref={backgroundSoundRef}
        src="/assets/background-sound.mp3"
        preload="auto"
        loop
        onError={() => console.error('Failed to load background sound: /assets/background-sound.mp3')}
      />
      <BackgroundOrbs active={showApp} onReady={() => setBackgroundReady(true)} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navbar showApp={showApp} />
        <HeroSection showApp={showApp} />
        <AboutSection showApp={showApp} />
        <PortfolioSection showApp={showApp} />
        <ContactSection showApp={showApp} />
      </div>

      <AnimatePresence onExitComplete={handleIntroExit}>
        {showIntro && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 9999,
              height: '100dvh',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              onPointerDown={handleSplashPointerDown}
              onPointerUp={handleSplashPointerUp}
              style={{ width: '100%', height: '100%' }}
            >
              <IntroSplash />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
