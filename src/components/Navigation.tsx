import React, { useState } from 'react';
import { Menu, X, KeyRound } from 'lucide-react';
import { AmbientSound } from './AmbientSound';

interface NavigationProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'The Legend', href: '#story' },
    { label: 'Chapters', href: '#chapters' },
    { label: 'Correspondence', href: '#correspondence-entrance' },
    { label: 'Public Vault', href: '#archive' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#08090A]/85 border-b border-[#333336]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-xl sm:text-2xl tracking-[0.2em] text-[#F0EFEB] hover:text-[#BDBDBB] transition-colors whitespace-nowrap shrink-0 uppercase"
        >
          Kökedves
        </a>

        {/* Zone 2: Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-[#BDBDBB]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="hover:text-[#F0EFEB] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#BDBDBB] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Utilities & Keeper's Desk Action */}
        <div className="flex items-center gap-3 shrink-0">
          <AmbientSound />

          <button
            onClick={onOpenAdmin}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#BDBDBB] hover:text-[#F0EFEB] px-3 py-1.5 border border-[#333336] hover:border-[#77777A] bg-[#0D0E10]/80 transition-colors"
            title="Open Administrative Keeper's Desk"
            aria-label="The Keeper's Desk"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#BDBDBB]" />
            <span className="hidden sm:inline">The Keeper's Desk</span>
            {isAdminLoggedIn && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#BDBDBB]" title="Authenticated" />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 text-[#BDBDBB] hover:text-[#F0EFEB] focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#333336] bg-[#0D0E10] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-mono tracking-widest uppercase text-[#BDBDBB] hover:text-[#F0EFEB] py-1 border-b border-[#333336]/30"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-left text-sm font-mono tracking-widest uppercase text-[#F0EFEB] py-2 flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-[#BDBDBB]" />
                The Keeper's Desk {isAdminLoggedIn ? '(Active)' : ''}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
