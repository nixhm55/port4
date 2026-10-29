import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { introStatement } from '../../data/content';
import './Intro.css';

export default function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const words = introStatement.split(' ');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.intro__word', { opacity: 1 });
        return;
      }
      gsap.set('.intro__word', { opacity: 0.18 });
      gsap.to('.intro__word', {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 85%',
          end: 'bottom 55%',
          scrub: 0.4,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="intro" id="statement" ref={rootRef}>
      <span className="intro__index">02</span>
      <p className="intro__text">
        {words.map((w, i) => (
          <span className="intro__word" key={i}>
            {w}&nbsp;
          </span>
        ))}
      </p>
    </section>
  );
}
