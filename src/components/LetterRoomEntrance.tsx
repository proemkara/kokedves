import React from 'react';
import { Feather, HeartHandshake, ArrowRight } from 'lucide-react';

interface LetterRoomEntranceProps {
  onSelectRoom: (room: 'brides' | 'ferjem') => void;
  activeRoom: 'brides' | 'ferjem' | null;
}

export const LetterRoomEntrance: React.FC<LetterRoomEntranceProps> = ({
  onSelectRoom,
  activeRoom,
}) => {
  return (
    <section id="correspondence-entrance" className="relative py-24 sm:py-32 px-6 sm:px-12 bg-[#0D0E10] border-t border-b border-[#333336]/60">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center pb-14 border-b border-[#333336]/60 space-y-4">
          <span className="text-xs font-mono tracking-[0.35em] uppercase text-[#77777A]">
            THE THRESHOLD OF CORRESPONDENCE · TWO ROOMS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-[#F0EFEB] tracking-tight">
            The Chambers of Unsent Words.
          </h2>
          <div className="w-16 h-[1px] bg-[#BDBDBB]/40 mx-auto" />
          <p className="font-serif italic text-base sm:text-xl text-[#BDBDBB] max-w-2xl mx-auto leading-relaxed">
            “In this house, words are given two hearths: one to comfort the women who waited upon stone balconies, and another for the heart that still speaks to its own departed beloved.”
          </p>
        </div>

        {/* The Two Distinct Destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-14">
          {/* Destination 1: Letters to the Brides */}
          <div
            onClick={() => onSelectRoom('brides')}
            className={`group relative p-8 sm:p-10 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              activeRoom === 'brides'
                ? 'border-[#F0EFEB] bg-[#171719] shadow-2xl'
                : 'border-[#333336] bg-[#08090A] hover:border-[#77777A] hover:bg-[#131316]'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#77777A]">
                <span>ROOM I · COLLECTIVE VIGIL</span>
                <Feather className="w-4 h-4 text-[#BDBDBB]" />
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#F0EFEB] group-hover:text-white transition-colors">
                  Letters to the Brides
                </h3>
                <p className="font-serif italic text-base sm:text-lg text-[#BDBDBB] mt-3 leading-relaxed">
                  “For the women who remained, and the words they deserved to hear.”
                </p>
              </div>

              <p className="font-serif text-[#77777A] text-sm leading-relaxed">
                Leave words of sympathy, solace, solidarity, or quiet remembrance for the brides of Budapest. Addressed collectively to all who kept vigil at the balcony.
              </p>
            </div>

            <div className="pt-8 mt-6 border-t border-[#333336]/40 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#F0EFEB] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Enter Her Room <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono uppercase text-[#77777A]">
                ROOM REF: BRIDES-01
              </span>
            </div>
          </div>

          {/* Destination 2: Letters to Férjem */}
          <div
            onClick={() => onSelectRoom('ferjem')}
            className={`group relative p-8 sm:p-10 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              activeRoom === 'ferjem'
                ? 'border-[#F0EFEB] bg-[#171719] shadow-2xl'
                : 'border-[#333336] bg-[#08090A] hover:border-[#77777A] hover:bg-[#131316]'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#77777A]">
                <span>ROOM II · INTIMATE SOLITUDE</span>
                <HeartHandshake className="w-4 h-4 text-[#BDBDBB]" />
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#F0EFEB] group-hover:text-white transition-colors">
                  Letters to Férjem
                </h3>
                <p className="font-serif italic text-base sm:text-lg text-[#BDBDBB] mt-3 leading-relaxed">
                  “For the beloved whose absence has not silenced the heart.”
                </p>
              </div>

              <p className="font-serif text-[#77777A] text-sm leading-relaxed">
                An intimate sanctuary for women addressing their own beloved, husband, or lost companion. Inscribe your letter with confidentiality or offer it in trust for public keeping.
              </p>
            </div>

            <div className="pt-8 mt-6 border-t border-[#333336]/40 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#F0EFEB] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Write Beyond the Silence <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono uppercase text-[#77777A]">
                ROOM REF: FERJEM-02
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
