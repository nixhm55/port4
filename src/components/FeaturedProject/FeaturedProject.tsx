import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { featuredProject } from '../../data/content';
import './FeaturedProject.css';

export default function FeaturedProject() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    let media: ReturnType<typeof gsap.matchMedia> | undefined;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.featured__caption', { opacity: 1, y: 0 });
        return;
      }

      media = gsap.matchMedia();

      media.add('(min-width: 900px)', () => {
        const captions = gsap.utils.toArray<HTMLElement>('.featured__caption');
        gsap.set(captions, { opacity: 0, y: 16 });
        gsap.set(captions[0], { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        });

        tl.to('.featured__media-inner', { scale: 1.1, duration: 1 }, 0)
          .to(captions[0], { opacity: 0, y: -16, duration: 0.3 }, 0.28)
          .to(captions[1], { opacity: 1, y: 0, duration: 0.3 }, 0.32)
          .to(captions[1], { opacity: 0, y: -16, duration: 0.3 }, 0.62)
          .to(captions[2], { opacity: 1, y: 0, duration: 0.3 }, 0.66)
          .to('.featured__media-inner', { scale: 1, duration: 0.4 }, 0.8);

      });

      media.add('(max-width: 899px)', () => {
        gsap.utils.toArray<HTMLElement>('.featured__caption').forEach((cap) => {
          gsap.from(cap, {
            opacity: 0,
            y: 20,
            duration: 0.7,
            scrollTrigger: { trigger: cap, start: 'top 85%' },
          });
        });
      });
    }, rootRef);

    return () => {
      media?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section id="featured" className="featured" ref={rootRef}>
      <div className="featured__sticky">
        <div className="featured__media">
          <div className="featured__media-inner" />
        </div>
        <div className="featured__content">
          <span className="featured__eyebrow">{featuredProject.index}</span>
          <h2 className="featured__title">{featuredProject.title}</h2>
          <p className="featured__subtitle">{featuredProject.subtitle}</p>
          <div className="featured__captions">
            {featuredProject.stages.map((s) => (
              <p className="featured__caption" key={s.id}>
                {s.caption}
              </p>
            ))}
          </div>
          <div className="featured__meta">
            {featuredProject.meta.map((m) => (
              <div className="featured__meta-item" key={m.label}>
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
