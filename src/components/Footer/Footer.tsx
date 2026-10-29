import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__wordmark">Yasmi</span>
        <button className="footer__top" onClick={scrollTop} aria-label="Back to top">
          <span>Back to top</span>
          <span className="footer__arrow">↑</span>
        </button>
        <span className="footer__meta">© {year} Yasmi — Demonstration portfolio template</span>
      </div>
    </footer>
  );
}
