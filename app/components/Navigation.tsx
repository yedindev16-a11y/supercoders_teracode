'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_LINKS = [
  { label: 'Challenge', href: '#challenge' },
  { label: 'City Lab', href: '#city-lab' },
  { label: 'Observatory', href: '#observatory' },
  { label: 'Discovery', href: '#discovery' },
  { label: 'Action', href: '#action' },
] as const;

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track scroll position for navbar background
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const entries = new Map<string, IntersectionObserverEntry>();

    observerRef.current = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          entries.set(entry.target.id, entry);
        }

        // Find the topmost visible section
        let topSection = '';
        let topY = Infinity;

        for (const [id, entry] of entries) {
          if (entry.isIntersecting && entry.boundingClientRect.top < topY) {
            topY = entry.boundingClientRect.top;
            topSection = id;
          }
        }

        if (topSection) {
          setActiveSection(topSection);
        }
      },
      { rootMargin: '-80px 0px -40% 0px', threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    },
    []
  );

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-eco-dark/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
          aria-label="Primary"
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="group flex items-center gap-2"
            aria-label="ECOTERRA — back to top"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <LeafIcon className="h-7 w-7 text-eco-lime-electric transition-colors group-hover:text-eco-lime-light" />
            </motion.div>
            <span className="text-lg font-mono font-bold tracking-widest text-eco-off-white">
              ECO
              <span className="text-eco-lime-electric">TERRA</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const sectionId = href.slice(1);
              const isActive = activeSection === sectionId;

              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                      isActive
                        ? 'text-eco-lime-electric'
                        : 'text-eco-off-white/70 hover:text-eco-off-white'
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-eco-lime-electric"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="flex h-5 w-6 flex-col items-center justify-between">
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 8, backgroundColor: '#D4FF00' }
                    : { rotate: 0, y: 0, backgroundColor: '#F5F5F0' }
                }
                transition={{ duration: 0.3 }}
                className="block h-0.5 w-6 origin-center rounded-full"
                style={{ backgroundColor: '#F5F5F0' }}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-6 rounded-full"
                style={{ backgroundColor: '#F5F5F0' }}
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -8, backgroundColor: '#D4FF00' }
                    : { rotate: 0, y: 0, backgroundColor: '#F5F5F0' }
                }
                transition={{ duration: 0.3 }}
                className="block h-0.5 w-6 origin-center rounded-full"
                style={{ backgroundColor: '#F5F5F0' }}
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-40 flex h-full w-[75vw] max-w-xs flex-col bg-eco-dark/95 backdrop-blur-xl border-l border-white/5 pt-24 px-8 md:hidden"
            >
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map(({ label, href }, i) => {
                  const sectionId = href.slice(1);
                  const isActive = activeSection === sectionId;

                  return (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3 }}
                    >
                      <a
                        href={href}
                        onClick={(e) => handleNavClick(e, href)}
                        className={`block rounded-lg px-4 py-3 text-lg font-medium tracking-wide transition-colors ${
                          isActive
                            ? 'bg-eco-lime-electric/10 text-eco-lime-electric'
                            : 'text-eco-off-white/70 hover:bg-white/5 hover:text-eco-off-white'
                        }`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        {label}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Badge at bottom of mobile menu */}
              <div className="mt-auto pb-8">
                <p className="text-xs font-mono tracking-widest text-eco-off-white/30 uppercase">
                  TERRACODE 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
