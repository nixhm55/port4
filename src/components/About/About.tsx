import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { aboutContent } from '../../data/content';
import './About.css';

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(['.about__heading', '.about__visual', '.about__copy', '.about__fact', '.about__label'], {
          opacity: 1,
          x: 0,
          y: 0,
          clipPath: 'inset(0 0 0 0)',
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        defaults: { ease: 'power3.out', duration: 1 },
      });

      tl.from('.about__label', { opacity: 0, y: 14, duration: 0.6 })
        .from('.about__heading', { opacity: 0, x: -50, duration: 1 }, 0.1)
        .from('.about__visual', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut' }, 0.2)
        .from('.about__copy', { opacity: 0, y: 30, duration: 0.9, stagger: 0.1 }, 0.35)
        .from('.about__fact', { opacity: 0, y: 20, stagger: 0.1, duration: 0.7 }, 0.55);

      gsap.to('.about__visual-inner', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about" ref={rootRef}>
      <div className="about__grid">
        <div className="about__col-left">
          <span className="about__label">{aboutContent.label}</span>
          <h2 className="about__heading">{aboutContent.heading}</h2>
        </div>
        <div className="about__visual">
          <div className="about__visual-inner" />
        </div>
        <div className="about__col-right">
          {aboutContent.paragraphs.map((p, i) => (
            <p className="about__copy" key={i}>
              {p}
            </p>
          ))}
          <div className="about__facts">
            {aboutContent.facts.map((f) => (
              <div className="about__fact" key={f.label}>
                <span className="about__fact-label">{f.label}</span>
                <span className="about__fact-value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
