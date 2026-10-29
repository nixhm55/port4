import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { heroContent } from '../../data/content';
import './Hero.css';

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(['.hero__label', '.hero__line-inner', '.hero__intro', '.hero__frame', '.hero__scroll-cue'], {
          opacity: 1,
          y: 0,
          x: 0,
          yPercent: 0,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.set('.hero__line-inner', { yPercent: 110 })
        .set('.hero__label', { opacity: 0, y: 12 })
        .set('.hero__intro', { opacity: 0, y: 24 })
        .set('.hero__frame', { opacity: 0, x: 60, rotate: 6 })
        .set('.hero__scroll-cue', { opacity: 0 })
        .to('.hero__label', { opacity: 1, y: 0, duration: 0.7 }, 0.1)
        .to(
          '.hero__line-inner',
          { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' },
          0.25
        )
        .to('.hero__frame', { opacity: 1, x: 0, rotate: 0, duration: 1.2, ease: 'power3.out' }, 0.5)
        .to('.hero__intro', { opacity: 1, y: 0, duration: 0.9 }, 0.9)
        .to('.hero__scroll-cue', { opacity: 1, duration: 0.6 }, 1.3);

      gsap.to('.hero__frame', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to('.hero__bg-word', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to('.hero__headline', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={rootRef}>
      <span className="hero__bg-word" aria-hidden="true">
        YASMI
      </span>
      <div className="hero__inner">
        <p className="hero__label">{heroContent.label}</p>
        <h1 className="hero__headline">
          {heroContent.headlineLines.map((line, i) => (
            <span className="hero__line" key={i}>
              <span className="hero__line-inner">{line}</span>
            </span>
          ))}
        </h1>
        <div className="hero__bottom">
          <p className="hero__intro">{heroContent.intro}</p>
          <div className="hero__frame" aria-hidden="true">
            <div className="hero__frame-inner" />
          </div>
        </div>
      </div>
      <div className="hero__scroll-cue">
        <span className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
