import React, { useState } from 'react';
import { Feather, Check, AlertCircle, Loader2 } from 'lucide-react';
import { validateLetterSubmission } from '../utils/archive-rules';

interface BridesLetterDeskProps {
  onLetterSubmitted?: () => void;
}

export const BridesLetterDesk: React.FC<BridesLetterDeskProps> = ({ onLetterSubmitted }) => {
  const [senderName, setSenderName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('To the Brides Who Remained…\n\n');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFolding, setIsFolding] = useState<boolean>(false);
  const [isSealed, setIsSealed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateLetterSubmission({
      category: 'to_brides',
      sender_name: senderName,
      subject,
      body,
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'to_brides',
          sender_name: senderName,
          subject,
          body,
          publication_preference: 'public_review',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit letter');
      }

      setIsSubmitting(false);
      setIsFolding(true);

      setTimeout(() => {
        setIsFolding(false);
        setIsSealed(true);
        if (onLetterSubmitted) onLetterSubmitted();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage((err as Error).message || 'Unable to leave letter. Please try again.');
    }
  };

  const handleWriteAnother = () => {
    setIsSealed(false);
    setIsFolding(false);
    setBody('To the Brides Who Remained…\n\n');
    setSubject('');
    setSenderName('');
  };

  return (
    <div id="room-brides" className="scroll-mt-24 p-6 sm:p-12 border border-[#333336] bg-[#08090A] shadow-2xl">
      {/* Header */}
      <div className="pb-8 border-b border-[#333336]/60 space-y-2">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#77777A]">
          ROOM I · LETTERS TO THE BRIDES
        </span>
        <h3 className="font-display text-2xl sm:text-4xl font-normal text-[#F0EFEB] tracking-tight">
          Letters Left at Her Door.
        </h3>
        <p className="font-serif italic text-base sm:text-lg text-[#BDBDBB]">
          “For the brides who waited, and for the words the world never gave them.”
        </p>
      </div>

      {isSealed ? (
        <div className="py-12 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#171719] border-2 border-[#BDBDBB] flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-7 h-7 text-[#F0EFEB]" />
          </div>

          <h4 className="font-display text-2xl sm:text-3xl text-[#F0EFEB]">
            Left Upon the Threshold.
          </h4>

          <p className="font-serif text-lg sm:text-xl italic text-[#D6D5D1] max-w-lg mx-auto leading-relaxed">
            “Your words have been left at her door, entrusted to the keeping of this house.”
          </p>

          <p className="text-xs font-mono uppercase tracking-widest text-[#77777A] max-w-md mx-auto">
            SUBMISSION IS SECURELY RECORDED AND PRESENTED FOR ARCHIVAL REVIEW BEFORE ENTRY INTO THE PUBLIC VAULT.
          </p>

          <div className="pt-4">
            <button
              onClick={handleWriteAnother}
              type="button"
              className="text-xs font-mono uppercase tracking-widest text-[#F0EFEB] py-3 px-6 border border-[#333336] hover:border-[#BDBDBB] hover:bg-[#171719] transition-colors"
            >
              Leave Another Letter
            </button>
          </div>
        </div>
      ) : isFolding ? (
        <div className="py-16 text-center space-y-6">
          <div className="w-16 h-16 mx-auto relative animate-pulse flex items-center justify-center border border-[#BDBDBB]/40 bg-[#171719]">
            <Feather className="w-7 h-7 text-[#BDBDBB]" />
          </div>
          <p className="font-display text-2xl italic text-[#F0EFEB]">
            Folding letter for the brides...
          </p>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#77777A]">
            PLACING ENVELOPE UPON THE STONE BALCONY
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="pt-8 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-[#171719] border border-[#77777A] text-[#F0EFEB] text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#BDBDBB] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="brides-sender" className="block text-xs font-mono uppercase tracking-widest text-[#77777A]">
                Your Chosen Name or Signature
              </label>
              <input
                id="brides-sender"
                type="text"
                placeholder="e.g. A Pilgrim from the Chain Bridge"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={80}
                className="w-full bg-[#0D0E10] border border-[#333336] text-[#F0EFEB] font-serif text-base px-4 py-2.5 focus:outline-none focus:border-[#BDBDBB]"
              />
              {fieldErrors.sender_name && (
                <p className="text-xs font-mono text-[#BDBDBB]">{fieldErrors.sender_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="brides-subject" className="block text-xs font-mono uppercase tracking-widest text-[#77777A]">
                Letter Title (Optional)
              </label>
              <input
                id="brides-subject"
                type="text"
                placeholder="e.g. The silence across the tramlines"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={120}
                className="w-full bg-[#0D0E10] border border-[#333336] text-[#F0EFEB] font-serif text-base px-4 py-2.5 focus:outline-none focus:border-[#BDBDBB]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="brides-body" className="block text-xs font-mono uppercase tracking-widest text-[#77777A]">
                Your Message to the Brides *
              </label>
              <span className="text-xs font-mono text-[#77777A]">
                {body.length} / 5,000 characters
              </span>
            </div>
            <textarea
              id="brides-body"
              rows={9}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={5000}
              className="w-full bg-[#0D0E10] border border-[#333336] text-[#F0EFEB] font-serif text-lg leading-relaxed p-4 focus:outline-none focus:border-[#BDBDBB] resize-y"
            />
            {fieldErrors.body && (
              <p className="text-xs font-mono text-[#BDBDBB]">{fieldErrors.body}</p>
            )}
          </div>

          <div className="pt-4 border-t border-[#333336]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-serif italic text-[#77777A]">
              Addressed collectively to all who waited. Will be kept in trust for archival review.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest text-[#08090A] bg-[#F0EFEB] hover:bg-[#BDBDBB] disabled:opacity-50 py-3.5 px-8 transition-colors font-medium shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#08090A]" />
                  Leaving Letter...
                </>
              ) : (
                <>
                  <Feather className="w-4 h-4 text-[#08090A]" />
                  Leave This Letter
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
