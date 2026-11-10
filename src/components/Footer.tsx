import React from 'react';
import { Feather, KeyRound } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="relative bg-[#08090A] border-t border-[#333336] py-16 sm:py-24 px-6 sm:px-12 text-center text-[#77777A]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center gap-2">
          <Feather className="w-4 h-4 text-[#BDBDBB]" />
          <span className="font-display tracking-[0.25em] text-lg text-[#F0EFEB] uppercase">
            Kökedves
          </span>
        </div>

        <p className="font-serif italic text-lg sm:text-xl text-[#BDBDBB] max-w-xl mx-auto leading-relaxed">
          “The archive may grow, but its remembrance shall never diminish.”
        </p>

        <div className="w-12 h-[1px] bg-[#333336] mx-auto" />

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase tracking-widest text-[#77777A]">
          <span>BUDAPEST · THÖKÖLY ÚT 61</span>
          <span aria-hidden="true">·</span>
          <span>ESTABLISHED IN RECOLLECTION</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={onOpenAdmin}
            type="button"
            className="hover:text-[#F0EFEB] transition-colors inline-flex items-center gap-1.5"
          >
            <KeyRound className="w-3 h-3" />
            The Keeper's Desk
          </button>
        </div>

        <p className="text-[11px] font-mono text-[#77777A]/70 pt-4">
          KÖKEDVES — BRIDE WHO NEVER LEFT · A DIGITAL VAULT OF ENDURING DEVOTION
        </p>
      </div>
    </footer>
  );
};
