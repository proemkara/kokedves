import React from 'react';

export const UnansweredQuestion: React.FC = () => {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex items-center justify-center bg-[#0D0E10] border-t border-b border-[#333336]/60 overflow-hidden">
      {/* Background with Asset 02 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/grief-and-waiting.jpg"
          alt="The veiled bride with hand on veil: Did grief take her, or did the waiting?"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter grayscale contrast-130 brightness-60"
        />
        <div className="absolute inset-0 bg-[#08090A]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090A]/50 to-[#08090A]/95" />
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-30" />
      </div>

      {/* Atmospheric Central Literary Question */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center py-20 space-y-8">
        <span className="text-xs font-mono tracking-[0.35em] uppercase text-[#BDBDBB]">
          A SILENT INTERLUDE
        </span>

        <h2 className="font-display italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F0EFEB] tracking-tight leading-tight max-w-3xl mx-auto drop-shadow-xl">
          Did grief take her, or did the waiting?
        </h2>

        <div className="w-12 h-[1px] bg-[#BDBDBB]/40 mx-auto" />

        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#77777A]">
          THE ARCHIVE MAY GROW, BUT ITS REMEMBRANCE SHALL NEVER DIMINISH.
        </p>
      </div>
    </section>
  );
};
