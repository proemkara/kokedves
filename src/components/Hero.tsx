import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollDown = () => {
    const target = document.querySelector('#house-of-mourning');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#08090A]">
      {/* Background Photograph Asset 01: Come Home, Dear Bride */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/come-home-bride.jpg"
          alt="The veiled bride of Budapest facing toward the balcony"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center filter grayscale contrast-125 brightness-80 transition-all duration-1000 ease-out ${
            loaded ? 'opacity-70 scale-100' : 'opacity-0 scale-105'
          }`}
        />
        {/* Monochromatic atmospheric scrim and vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090A] via-[#08090A]/60 to-[#08090A]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090A]/40 to-[#08090A]/95" />
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      </div>

      {/* Top Introductory Sentence */}
      <div className="relative z-10 pt-16 sm:pt-24 px-6 text-center max-w-4xl mx-auto">
        <p
          className={`text-xs sm:text-sm font-mono tracking-[0.28em] sm:tracking-[0.35em] text-[#BDBDBB] uppercase transition-all duration-1000 delay-300 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          WOULD YOU ENTER A STORY THAT HAS ALREADY BEGUN MOURNING?
        </p>
      </div>

      {/* Main Expressive Headline and Inscription */}
      <div className="relative z-10 px-6 sm:px-12 max-w-5xl mx-auto text-center my-auto py-12">
        <h1
          className={`font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic font-normal tracking-tight text-[#F0EFEB] drop-shadow-2xl transition-all duration-1000 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Come home, Dear Bride.
        </h1>

        <div
          className={`mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs font-mono uppercase tracking-[0.25em] text-[#77777A] transition-all duration-1000 delay-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span>KÖKEDVES ON TELEGRAM</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>AN IMMERSIVE DIGITAL ARCHIVE</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>EST. BUDAPEST</span>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 pb-10 sm:pb-12 text-center px-4">
        <button
          onClick={handleScrollDown}
          type="button"
          className="group inline-flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#BDBDBB] hover:text-[#F0EFEB] transition-colors focus:outline-none"
          aria-label="Descend into the House of Mourning"
        >
          <span className="transition-transform group-hover:translate-y-0.5">
            Descend into the House
          </span>
          <ArrowDown className="w-4 h-4 text-[#77777A] group-hover:text-[#F0EFEB] animate-bounce transition-colors" />
        </button>
      </div>
    </section>
  );
};
