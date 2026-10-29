import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { milestones } from '../../data/content';
import './Journey.css';

export default function Journey() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(['.journey__progress', '.journey__item'], { opacity: 1, scaleY: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        '.journey__progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
        }
      );

      gsap.utils.toArray<HTMLElement>('.journey__item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: i % 2 === 0 ? -30 : 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className="journey" ref={rootRef}>
      <span className="journey__label">05 — Journey</span>
      <div className="journey__timeline">
        <div className="journey__track">
          <span className="journey__progress" />
        </div>
        <div className="journey__items">
          {milestones.map((m) => (
            <div className="journey__item" key={m.year}>
              <span className="journey__year">{m.year}</span>
              <h3 className="journey__title">{m.title}</h3>
              <p className="journey__note">{m.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
