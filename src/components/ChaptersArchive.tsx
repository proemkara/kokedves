import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';
import type { Chapter } from '../types';

interface ChaptersArchiveProps {
  chapters: Chapter[];
  isLoading?: boolean;
}

export const ChaptersArchive: React.FC<ChaptersArchiveProps> = ({
  chapters,
  isLoading = false,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  const selectedIndex = chapters.findIndex((c) => c.id === selectedChapterId);
  const selectedChapter = selectedIndex !== -1 ? chapters[selectedIndex] : null;

  const handlePrevChapter = () => {
    if (selectedIndex > 0) {
      setSelectedChapterId(chapters[selectedIndex - 1].id);
    }
  };

  const handleNextChapter = () => {
    if (selectedIndex < chapters.length - 1) {
      setSelectedChapterId(chapters[selectedIndex + 1].id);
    }
  };

  return (
    <section id="chapters" className="relative py-24 sm:py-32 px-6 sm:px-12 bg-[#08090A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 border-b border-[#333336]/60">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#77777A]">
              THE LITERARY ARCHIVE · MANUSCRIPT FOLIO
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#F0EFEB] mt-2">
              The Unfinished Chapters.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-[#BDBDBB] max-w-md">
            “Each chapter preserves an hour from the years of waiting, transcribed from notebooks discovered along the Danube.”
          </p>
        </div>

        {/* Chapters Grid */}
        {isLoading ? (
          <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-[#77777A]">
            Gathering manuscript pages...
          </div>
        ) : chapters.length === 0 ? (
          <div className="py-20 text-center font-serif italic text-lg text-[#77777A]">
            No manuscript leaves have yet been bound into this edition.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-12">
            {chapters.map((chapter) => (
              <article
                key={chapter.id}
                onClick={() => setSelectedChapterId(chapter.id)}
                className="group relative border border-[#333336] bg-[#0D0E10] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#77777A] hover:bg-[#171719]/40 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#77777A] uppercase">
                    <span>{chapter.chapter_number || 'ARCHIVE LEAF'}</span>
                    {chapter.published_at && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(chapter.published_at).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </div>

                  {chapter.cover_image_url && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-[#171719] border border-[#333336]/40 mt-2">
                      <img
                        src={chapter.cover_image_url}
                        alt={chapter.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter grayscale contrast-120 group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#F0EFEB] group-hover:text-[#BDBDBB] transition-colors leading-snug">
                    {chapter.title}
                  </h3>

                  {chapter.subtitle && (
                    <p className="font-serif italic text-[#BDBDBB] text-base leading-relaxed">
                      {chapter.subtitle}
                    </p>
                  )}

                  <p className="font-serif text-[#77777A] text-sm line-clamp-3 leading-relaxed">
                    {chapter.content}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#333336]/40 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#BDBDBB] group-hover:text-[#F0EFEB] flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Read Chapter
                  </span>
                  <span className="text-xs font-mono text-[#77777A]">
                    {Math.ceil(chapter.content.split(/\s+/).length / 200)} min read
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Chapter Dedicated Reader Modal */}
      {selectedChapter && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#08090A]/95 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 lg:p-10 animate-fade-in"
        >
          <div className="relative w-full max-w-3xl bg-[#0D0E10] border border-[#333336] p-6 sm:p-12 shadow-2xl my-8">
            {/* Top Bar with Close and Chapter Number */}
            <div className="flex items-center justify-between pb-6 border-b border-[#333336]/60">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#77777A]">
                {selectedChapter.chapter_number || 'ARCHIVE LEAF'} · KÖKEDVES MANUSCRIPT
              </span>
              <button
                onClick={() => setSelectedChapterId(null)}
                className="text-[#77777A] hover:text-[#F0EFEB] p-1.5 border border-[#333336] hover:border-[#77777A] transition-colors"
                aria-label="Close reading view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chapter Header */}
            <div className="text-center py-8 space-y-3">
              <h2
                id="reader-title"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#F0EFEB] tracking-tight"
              >
                {selectedChapter.title}
              </h2>
              {selectedChapter.subtitle && (
                <p className="font-serif italic text-lg sm:text-xl text-[#BDBDBB] max-w-xl mx-auto">
                  {selectedChapter.subtitle}
                </p>
              )}
              <div className="w-12 h-[1px] bg-[#BDBDBB]/40 mx-auto mt-4" />
            </div>

            {/* Optional Cover in Reader */}
            {selectedChapter.cover_image_url && (
              <div className="mb-8 aspect-[16/9] w-full overflow-hidden border border-[#333336] bg-[#171719]">
                <img
                  src={selectedChapter.cover_image_url}
                  alt={selectedChapter.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
              </div>
            )}

            {/* Complete Chapter Text */}
            <div className="font-serif text-lg sm:text-xl text-[#D6D5D1] leading-loose space-y-6 max-w-prose mx-auto">
              {selectedChapter.content.split('\n\n').map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:text-[#F0EFEB] first-letter:leading-none'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Navigation Between Chapters */}
            <div className="mt-12 pt-8 border-t border-[#333336]/60 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevChapter}
                disabled={selectedIndex === 0}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#BDBDBB] hover:text-[#F0EFEB] disabled:opacity-30 disabled:pointer-events-none py-2 px-3 border border-[#333336] hover:border-[#77777A]"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Chapter
              </button>

              <button
                onClick={() => setSelectedChapterId(null)}
                className="text-xs font-mono uppercase tracking-widest text-[#77777A] hover:text-[#F0EFEB]"
              >
                Return to Archive
              </button>

              <button
                onClick={handleNextChapter}
                disabled={selectedIndex === chapters.length - 1}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#BDBDBB] hover:text-[#F0EFEB] disabled:opacity-30 disabled:pointer-events-none py-2 px-3 border border-[#333336] hover:border-[#77777A]"
              >
                Next Chapter
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
