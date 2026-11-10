import React from 'react';
import { MapPin, Feather } from 'lucide-react';

export const StoryBehindMarble: React.FC = () => {
  return (
    <section id="story" className="relative py-24 sm:py-32 px-6 sm:px-12 bg-[#08090A] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Metadata Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12 border-b border-[#333336]/60">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#77777A]">
              THE ORIGINAL LEGEND · HISTORICAL CHRONICLE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#F0EFEB] mt-2">
              The Bride Who Never Left.
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#BDBDBB]">
            <MapPin className="w-3.5 h-3.5 text-[#77777A]" />
            <span>THÖKÖLY ÚT 61 — BUDAPEST, HUNGARY</span>
          </div>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-12">
          {/* Column 1: Literary Story Text */}
          <div className="lg:col-span-7 space-y-6 text-[#D6D5D1] font-serif text-lg sm:text-xl leading-relaxed">
            <p className="first-letter:text-5xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:text-[#F0EFEB] first-letter:leading-none">
              In Budapest, behind the neoclassical facade of Thököly út 61, a newly married woman was left behind when her husband answered the call of duty shortly after their wedding vows. He left with a promise that the separation would be measured in weeks; she held to that promise as though it were carved in granite.
            </p>

            <p>
              Each afternoon, as the shadows lengthened across the Fourteenth District, she appeared upon the third-floor stone balcony. She wore the dark dress of an empire in retreat, her hands resting quietly upon the wrought-iron railing. The seasons turned: the acacia blooms of May withered under summer dust, the autumn rains washed the tram lines, and the winter frosts encrusted the stonework. Still, she remained.
            </p>

            <p>
              When a folded wartime dispatch finally reached the concierge, bearing the sterile bureaucratic confirmation of her husband's demise on an eastern battlefield, she refused to withdraw indoors. Grief did not cause her to weep aloud; instead, it solidified her vigil into something immutable. The waiting had already ceased to be a temporary circumstance—it had become her life's definitive work.
            </p>

            <p>
              Decades passed. Empires dissolved into republics; borders contracted; the cobblestones were paved over with asphalt. Yet visitors to the district would glance upward and find that quiet figure gazing toward the avenue, watching for the return of a man whose train had never arrived.
            </p>

            <div className="pt-8 border-t border-[#333336]/60 flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[#77777A]">
              <Feather className="w-4 h-4 text-[#BDBDBB]" />
              <span>Written by the Last Faithful Heart, The Kökedves.</span>
            </div>
          </div>

          {/* Column 2: Archival Photograph Presentation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative border border-[#333336] bg-[#0D0E10] p-3 sm:p-4 shadow-2xl">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#171719]">
                <img
                  src="/assets/come-home-bride.jpg"
                  alt="Archival portrait of the veiled bride at Thököly út 61"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-115 brightness-90 hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090A]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="font-display italic text-lg sm:text-xl text-[#F0EFEB] drop-shadow-md">
                    “The balcony became a symbol of devotion, absence, and remembrance.”
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#333336]/60 flex items-center justify-between text-xs font-mono text-[#77777A]">
                <span>ARCHIVE REF: BUD-THK-61</span>
                <span>CHRONICLE 1914–1940</span>
              </div>
            </div>

            <p className="text-xs font-serif italic text-[#77777A] text-center px-4">
              A fictionalized Budapest remembrance preserved in stone, memory, and continuous digital correspondence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
