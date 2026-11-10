import React, { useState } from 'react';
import { Feather, HeartHandshake, Calendar, User, Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { Letter } from '../types';

interface CorrespondenceArchiveProps {
  letters: Letter[];
  isLoading?: boolean;
}

export const CorrespondenceArchive: React.FC<CorrespondenceArchiveProps> = ({
  letters,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'brides' | 'ferjem'>('brides');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLetterIds, setExpandedLetterIds] = useState<Record<string, boolean>>({});

  const bridesLetters = letters.filter((l) => l.category === 'to_brides' && l.moderation_status === 'approved' && l.is_public);
  const ferjemLetters = letters.filter((l) => l.category === 'to_ferjem' && l.moderation_status === 'approved' && l.is_public);

  const activeCollection = activeTab === 'brides' ? bridesLetters : ferjemLetters;

  const filteredLetters = activeCollection.filter((l) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchSender = (l.sender_name || '').toLowerCase().includes(query);
    const matchSubject = (l.subject || '').toLowerCase().includes(query);
    const matchBody = l.body.toLowerCase().includes(query);
    return matchSender || matchSubject || matchBody;
  });

  const toggleExpand = (id: string) => {
    setExpandedLetterIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="archive" className="relative py-24 sm:py-32 px-6 sm:px-12 bg-[#0D0E10] border-t border-[#333336]/60">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#333336]/60">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#77777A]">
              THE PUBLIC VAULT · TWO CORRESPONDENCE REPOSITORIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#F0EFEB] mt-2">
              The Correspondence Kept in Trust.
            </h2>
            <p className="font-serif italic text-base sm:text-lg text-[#BDBDBB] mt-2 max-w-xl">
              Letters reviewed and released into the open repository of devotion.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-[#77777A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search correspondence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] text-xs font-mono pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#BDBDBB]"
            />
          </div>
        </div>

        {/* Two Clearly Distinguishable Tabs */}
        <div className="flex border-b border-[#333336] mt-8 gap-4 sm:gap-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('brides')}
            className={`pb-3 font-mono text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'brides'
                ? 'border-[#F0EFEB] text-[#F0EFEB] font-medium'
                : 'border-transparent text-[#77777A] hover:text-[#BDBDBB]'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>Words Left for Those Who Waited ({bridesLetters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ferjem')}
            className={`pb-3 font-mono text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ferjem'
                ? 'border-[#F0EFEB] text-[#F0EFEB] font-medium'
                : 'border-transparent text-[#77777A] hover:text-[#BDBDBB]'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Words That Still Seek Their Way Home ({ferjemLetters.length})</span>
          </button>
        </div>

        {/* Active Collection Description */}
        <div className="pt-6 pb-4">
          {activeTab === 'brides' ? (
            <div className="space-y-1">
              <h3 className="font-display text-xl text-[#F0EFEB]">
                Words Left for Those Who Waited
              </h3>
              <p className="font-serif italic text-sm text-[#77777A]">
                Letters left upon the doorstep of Thököly út, addressed to the abandoned brides of the legend.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="font-display text-xl text-[#F0EFEB]">
                Words That Still Seek Their Way Home
              </h3>
              <p className="font-serif italic text-sm text-[#77777A]">
                Intimate letters to Férjem, released into public custody by women who carry their own remembrance.
              </p>
            </div>
          )}
        </div>

        {/* Letters List */}
        {isLoading ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-[#77777A]">
            Unfolding kept correspondence...
          </div>
        ) : filteredLetters.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="font-serif italic text-xl text-[#BDBDBB]">
              {activeTab === 'brides'
                ? '“No words have yet been left at her door.”'
                : '“Some letters are still waiting to be written.”'}
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-[#77777A]">
              BE THE FIRST TO INSCRIBE A LETTER IN THE CORRESPONDENCE ROOMS ABOVE.
            </p>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {filteredLetters.map((letter) => {
              const isLong = letter.body.length > 340;
              const isExpanded = Boolean(expandedLetterIds[letter.id]);

              return (
                <article
                  key={letter.id}
                  className="border border-[#333336] bg-[#08090A] p-6 sm:p-10 shadow-lg relative transition-all duration-300 hover:border-[#77777A]"
                >
                  {/* Top Metadata Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#333336]/40 text-xs font-mono uppercase tracking-wider text-[#77777A]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#BDBDBB]">
                        {letter.category === 'to_brides' ? 'Addressed To:' : 'Salutation:'}
                      </span>
                      <span className="text-[#F0EFEB] font-medium font-serif normal-case text-sm">
                        {letter.category === 'to_brides' ? 'The Abandoned Brides' : 'Dear Férjem'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[#77777A]" />
                        {letter.sender_name || 'Anonymous Writer'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#77777A]" />
                        {new Date(letter.submitted_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Letter Title if provided */}
                  {letter.subject && (
                    <h4 className="font-display text-xl sm:text-2xl font-normal text-[#F0EFEB] mt-6">
                      {letter.subject}
                    </h4>
                  )}

                  {/* Letter Content */}
                  <div className="font-serif text-lg sm:text-xl text-[#D6D5D1] leading-relaxed mt-4 whitespace-pre-line">
                    {isLong && !isExpanded
                      ? `${letter.body.slice(0, 340)}...`
                      : letter.body}
                  </div>

                  {/* Expand / Collapse Button for Long Letters */}
                  {isLong && (
                    <div className="mt-4 pt-2">
                      <button
                        onClick={() => toggleExpand(letter.id)}
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#BDBDBB] hover:text-[#F0EFEB]"
                      >
                        {isExpanded ? (
                          <>
                            Fold Manuscript <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            Unfold Full Letter <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Bottom Archival Signoff */}
                  <div className="mt-6 pt-4 border-t border-[#333336]/30 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#77777A]">
                    <span>STATUS: VERIFIED &amp; KEPT</span>
                    <span>SEAL REF: {letter.id.slice(0, 8)}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
