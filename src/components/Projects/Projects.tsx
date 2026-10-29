import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { projects } from '../../data/content';
import './Projects.css';

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = projects.find((p) => p.id === activeId) || null;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.project', { opacity: 1, clipPath: 'inset(0 0 0 0)' });
        gsap.set(['.project__title', '.project__meta-item'], { opacity: 1, x: 0, y: 0 });
        return;
      }
      const items = gsap.utils.toArray<HTMLElement>('.project');
      items.forEach((item, i) => {
        const fromLeft = i % 2 === 0;
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 80%' } });
        const media = item.querySelector('.project__media-inner');
        const title = item.querySelector('.project__title');
        const metaItems = item.querySelectorAll('.project__meta-item');

        if (media) {
          tl.from(media, {
            clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
            duration: 1.1,
            ease: 'power4.inOut',
          });
        }
        if (title) {
          tl.from(
            title,
            { x: fromLeft ? -40 : 40, opacity: 0, duration: 0.8, ease: 'power3.out' },
            0.2
          );
        }
        if (metaItems.length) {
          tl.from(metaItems, { opacity: 0, y: 12, stagger: 0.08, duration: 0.6 }, 0.4);
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(['.modal__backdrop', '.modal__panel'], { opacity: 1, yPercent: 0 });
        return;
      }
      gsap.fromTo('.modal__backdrop', { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(
        '.modal__panel',
        { yPercent: 6, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }, modalRef);
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveId(null);
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      ctx.revert();
      triggerRef.current?.focus();
    };
  }, [active]);

  return (
    <section id="projects" className="projects" ref={rootRef}>
      <div className="projects__header">
        <span className="projects__label">03 — Selected Work</span>
        <h2 className="projects__heading">Demonstration projects</h2>
        <p className="projects__note">
          The following cases are editable sample content, built to showcase layout and motion —
          replace with real work.
        </p>
      </div>

      <div className="projects__list">
        {projects.map((project, i) => (
          <article
            className={`project project--${i % 2 === 0 ? 'left' : 'right'} project--${project.tone}`}
            key={project.id}
          >
            <button
              className="project__media"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActiveId(project.id);
              }}
              aria-label={`Open ${project.title} details`}
            >
              <span className="project__media-inner" />
              <span className="project__media-index">{String(i + 1).padStart(2, '0')}</span>
            </button>
            <div className="project__info">
              <h3 className="project__title">{project.title}</h3>
              <p className="project__desc">{project.description}</p>
              <div className="project__meta">
                <span className="project__meta-item">{project.category}</span>
                <span className="project__meta-item">{project.year}</span>
              </div>
              <button
                className="project__link"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setActiveId(project.id);
                }}
              >
                <span>View case</span>
                <span className="project__arrow">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          aria-describedby="project-modal-description"
          ref={modalRef}
        >
          <button className="modal__backdrop" onClick={() => setActiveId(null)} aria-label="Close project details" />
          <div className="modal__panel">
            <button ref={closeButtonRef} className="modal__close" onClick={() => setActiveId(null)} aria-label="Close">
              ×
            </button>
            <span className="modal__category">
              {active.category} — {active.year}
            </span>
            <h3 id="project-modal-title" className="modal__title">{active.title}</h3>
            <p id="project-modal-description" className="modal__desc">{active.description}</p>
            <p className="modal__disclaimer">This is placeholder demonstration content for the Yasmi template.</p>
          </div>
        </div>
      )}
    </section>
  );
}
