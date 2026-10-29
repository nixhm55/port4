import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsapConfig';
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import Intro from './components/Intro/Intro';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import FeaturedProject from './components/FeaturedProject/FeaturedProject';
import Approach from './components/Approach/Approach';
import Journey from './components/Journey/Journey';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

function App() {
  useEffect(() => {
    let mounted = true;
    const refresh = () => ScrollTrigger.refresh();
    // Refresh after the fallback delay and after web fonts finish changing layout.
    const id = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(() => {
      if (mounted) refresh();
    });
    const onLoad = () => refresh();
    window.addEventListener('load', onLoad);
    return () => {
      mounted = false;
      window.clearTimeout(id);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Intro />
        <About />
        <Projects />
        <FeaturedProject />
        <Approach />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
