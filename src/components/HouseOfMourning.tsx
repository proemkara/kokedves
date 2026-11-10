import React from 'react';

export const HouseOfMourning: React.FC = () => {
  return (
    <section
      id="house-of-mourning"
      className="relative py-28 sm:py-36 px-6 sm:px-12 bg-[#0D0E10] border-t border-b border-[#333336]/60 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-20" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#77777A]">
          THE ENTRYWAY · ARCHIVE PRESERVATION
        </span>

        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-[#F0EFEB] tracking-tight leading-tight">
          Some stories do not know how to end.
        </h2>

        <div className="w-16 h-[1px] bg-[#BDBDBB]/40 mx-auto" />

        <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#D6D5D1] leading-relaxed max-w-2xl mx-auto font-light italic">
          “There are promises time cannot quite dissolve, and names that linger long after the voices that once spoke them have fallen silent. This is a house for such things: for the waiting, the departed, and the hearts that remember.”
        </p>

        <div className="pt-4">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#BDBDBB]">
            A living archive. An everlasting remembrance.
          </p>
        </div>
      </div>
    </section>
  );
};
