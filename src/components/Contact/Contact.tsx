import { useLayoutEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { gsap } from '../../lib/gsapConfig';
import { prefersReducedMotion } from '../../lib/motion';
import { contactContent } from '../../data/content';
import './Contact.css';

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'ready'>('idle');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(['.contact__line-inner', '.contact__detail', '.contact__form', '.contact__rule'], {
          opacity: 1,
          yPercent: 0,
          y: 0,
          scaleX: 1,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        defaults: { ease: 'power3.out' },
      });

      tl.set('.contact__line-inner', { yPercent: 110 })
        .to('.contact__line-inner', { yPercent: 0, duration: 1, stagger: 0.1 })
        .from('.contact__detail', { opacity: 0, y: 16, stagger: 0.08, duration: 0.6 }, 0.4)
        .from('.contact__form', { opacity: 0, y: 24, duration: 0.7 }, 0.5);

      gsap.fromTo(
        '.contact__rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power4.inOut',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${form.name || 'website visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${contactContent.email}?subject=${subject}&body=${body}`;
    setStatus('ready');
  };

  return (
    <section id="contact" className="contact" ref={rootRef}>
      <div className="contact__top">
        <h2 className="contact__heading">
          <span className="contact__line">
            <span className="contact__line-inner">Let&apos;s build something</span>
          </span>
          <span className="contact__line">
            <span className="contact__line-inner">quietly ambitious.</span>
          </span>
        </h2>
      </div>
      <span className="contact__rule" />
      <div className="contact__grid">
        <div className="contact__details">
          <a href={`mailto:${contactContent.email}`} className="contact__detail contact__email">
            {contactContent.email}
          </a>
          <div className="contact__socials">
            {contactContent.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="contact__detail contact__social">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field">
            <label htmlFor="name">Name</label>
            <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="contact__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="contact__field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button type="submit" className="contact__submit">
            <span>Send message</span>
            <span className="contact__arrow">→</span>
          </button>
          <p className="contact__hint" role="status">
            {status === 'ready'
              ? 'Your email client should now be open with this message pre-filled.'
              : 'This form opens your default email client — no data is stored or transmitted by this site.'}
          </p>
        </form>
      </div>
    </section>
  );
}
