import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { disciplines, approachStatement } from '../../data/content';
import './Approach.css';

export default function Approach() {
  const rootRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(['.approach__row', '.approach__row-line', '.approach__statement-word'], {
          opacity: 1,
          scaleX: 1,
          y: 0,
        });
        return;
      }

      gsap.set('.approach__statement-word', { opacity: 0.15 });
      gsap.to('.approach__statement-word', {
        opacity: 1,
        stagger: 0.03,
        ease: 'none',
        scrollTrigger: { trigger: '.approach__statement', start: 'top 85%', end: 'bottom 60%', scrub: 0.4 },
      });

      gsap.utils.toArray<HTMLElement>('.approach__row').forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 90%' },
        });
        const line = row.querySelector('.approach__row-line');
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: 'power4.inOut',
              transformOrigin: 'left center',
              scrollTrigger: { trigger: row, start: 'top 90%' },
            }
          );
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="approach" className="approach" ref={rootRef}>
      <div className="approach__top">
        <span className="approach__label">04 — Approach</span>
        <p className="approach__statement">
          {approachStatement.split(' ').map((w, i) => (
            <span className="approach__statement-word" key={i}>
              {w}&nbsp;
            </span>
          ))}
        </p>
      </div>
      <div className="approach__list">
        {disciplines.map((d, i) => (
          <button
            className={`approach__row ${openIndex === i ? 'is-open' : ''}`}
            key={d.title}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="approach__row-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="approach__row-title">{d.title}</span>
            <span className="approach__row-note">{d.note}</span>
            <span className="approach__row-line" />
          </button>
        ))}
      </div>
    </section>
  );
}
