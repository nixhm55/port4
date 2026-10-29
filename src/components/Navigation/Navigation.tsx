import { useEffect, useState, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { navLinks } from '../../data/content';
import './Navigation.css';

export default function Navigation() {
  const { direction, atTop } = useScrollDirection(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const hidden = direction === 'down' && !atTop && !menuOpen;

  const handleNavClick = useCallback((e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
    if (e.currentTarget.closest('.nav__mobile')) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 881px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <header className={`nav ${hidden ? 'nav--hidden' : ''} ${atTop ? 'nav--top' : 'nav--scrolled'} ${menuOpen ? 'nav--menu-open' : ''}`}>
      <div className="nav__inner">
        <a href="#home" className="nav__logo" onClick={(e) => handleNavClick(e, '#home')}>
          Nisam
        </a>
        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav__link" onClick={(e) => handleNavClick(e, link.href)}>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <a href="#contact" className="nav__cta" onClick={(e) => handleNavClick(e, '#contact')}>
          <span>Start a project</span>
        </a>
        <button
          ref={toggleRef}
          className={`nav__toggle ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
      <nav id="mobile-navigation" className={`nav__mobile ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile" aria-hidden={!menuOpen}>
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            className="nav__mobile-link"
            tabIndex={menuOpen ? 0 : -1}
            style={{ transitionDelay: `${i * 40}ms` }}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
