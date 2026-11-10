import React, { useState } from 'react';
import { HeartHandshake, Check, AlertCircle, Loader2, Lock, Eye } from 'lucide-react';
import { validateLetterSubmission, type PublicationPreference } from '../utils/archive-rules';

interface FerjemLetterDeskProps {
  onLetterSubmitted?: () => void;
}

export const FerjemLetterDesk: React.FC<FerjemLetterDeskProps> = ({ onLetterSubmitted }) => {
  const [senderName, setSenderName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('Dear Férjem,\n\n');
  const [preference, setPreference] = useState<PublicationPreference>('public_review');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFolding, setIsFolding] = useState<boolean>(false);
  const [isSealed, setIsSealed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateLetterSubmission({
      category: 'to_ferjem',
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
          category: 'to_ferjem',
          sender_name: senderName,
          subject,
          body,
          publication_preference: preference,
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
      setErrorMessage((err as Error).message || 'Unable to seal letter. Please try again.');
    }
  };

  const handleWriteAnother = () => {
    setIsSealed(false);
    setIsFolding(false);
    setBody('Dear Férjem,\n\n');
    setSubject('');
    setSenderName('');
  };

  return (
    <div id="room-ferjem" className="scroll-mt-24 p-6 sm:p-12 border border-[#333336] bg-[#08090A] shadow-2xl">
      {/* Header */}
      <div className="pb-8 border-b border-[#333336]/60 space-y-2">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#77777A]">
          ROOM II · LETTERS TO FÉRJEM
        </span>
        <h3 className="font-display text-2xl sm:text-4xl font-normal text-[#F0EFEB] tracking-tight">
          Letters to Férjem.
        </h3>
        <p className="font-serif italic text-base sm:text-lg text-[#BDBDBB]">
          “For the beloved who remains in the heart, though life has placed a distance between us.”
        </p>
      </div>

      {isSealed ? (
        <div className="py-12 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#171719] border-2 border-[#BDBDBB] flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-7 h-7 text-[#F0EFEB]" />
          </div>

          <h4 className="font-display text-2xl sm:text-3xl text-[#F0EFEB]">
            Sent Beyond the Silence.
          </h4>

          <p className="font-serif text-lg sm:text-xl italic text-[#D6D5D1] max-w-lg mx-auto leading-relaxed">
            “Some letters are written not in expectation of an answer, but because the heart still has something to say.”
          </p>

          <p className="text-xs font-mono uppercase tracking-widest text-[#77777A] max-w-md mx-auto">
            {preference === 'private'
              ? 'CONFIDENTIAL KEEPER SEALS: THIS MANUSCRIPT WILL REMAIN PRIVATE AND WILL NEVER BE DISPLAYED IN THE PUBLIC VAULT.'
              : 'SUBMITTED FOR PUBLIC CONSIDERATION: WILL APPEAR IN THE FÉRJEM ARCHIVE ONCE REVIEWED BY THE KEEPER.'}
          </p>

          <div className="pt-4">
            <button
              onClick={handleWriteAnother}
              type="button"
              className="text-xs font-mono uppercase tracking-widest text-[#F0EFEB] py-3 px-6 border border-[#333336] hover:border-[#BDBDBB] hover:bg-[#171719] transition-colors"
            >
              Write Another Letter
            </button>
          </div>
        </div>
      ) : isFolding ? (
        <div className="py-16 text-center space-y-6">
          <div className="w-16 h-16 mx-auto relative animate-pulse flex items-center justify-center border border-[#BDBDBB]/40 bg-[#171719]">
            <HeartHandshake className="w-7 h-7 text-[#BDBDBB]" />
          </div>
          <p className="font-display text-2xl italic text-[#F0EFEB]">
            Sealing intimate correspondence...
          </p>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#77777A]">
            {preference === 'private' ? 'ENTRUSTING TO PRIVATE ARCHIVE' : 'TRANSCRIBING FOR THE VAULT'}
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
              <label htmlFor="ferjem-sender" className="block text-xs font-mono uppercase tracking-widest text-[#77777A]">
                Your Chosen Name or Signature
              </label>
              <input
                id="ferjem-sender"
                type="text"
                placeholder="e.g. Your Faithful Heart / Anonymous"
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
              <label htmlFor="ferjem-subject" className="block text-xs font-mono uppercase tracking-widest text-[#77777A]">
                Letter Title (Optional)
              </label>
              <input
                id="ferjem-subject"
                type="text"
                placeholder="e.g. The quiet morning beside the linden tree"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={120}
                className="w-full bg-[#0D0E10] border border-[#333336] text-[#F0EFEB] font-serif text-base px-4 py-2.5 focus:outline-none focus:border-[#BDBDBB]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="ferjem-body" className="block text-xs font-mono uppercase tracking-widest text-[#77777A]">
                Letter to Your Beloved *
              </label>
              <span className="text-xs font-mono text-[#77777A]">
                {body.length} / 5,000 characters
              </span>
            </div>
            <textarea
              id="ferjem-body"
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

          {/* Privacy & Publication Preference */}
          <div className="p-4 sm:p-5 border border-[#333336] bg-[#0D0E10] space-y-3">
            <span className="block text-xs font-mono uppercase tracking-widest text-[#BDBDBB]">
              Privacy &amp; Archival Preference:
            </span>
            <div role="radiogroup" aria-label="Privacy & Archival Preference" className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <button
                type="button"
                role="radio"
                aria-checked={preference === 'private'}
                onClick={() => setPreference('private')}
                className={`p-3 border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  preference === 'private'
                    ? 'border-[#F0EFEB] bg-[#171719] text-[#F0EFEB]'
                    : 'border-[#333336] text-[#77777A] hover:text-[#BDBDBB]'
                }`}
              >
                <Lock className="w-4 h-4 shrink-0 text-[#BDBDBB]" />
                <div>
                  <span className="block font-medium">Keep Private Forever</span>
                  <span className="text-[11px] opacity-75">Never displayed in public vault</span>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={preference === 'public_review'}
                onClick={() => setPreference('public_review')}
                className={`p-3 border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  preference === 'public_review'
                    ? 'border-[#F0EFEB] bg-[#171719] text-[#F0EFEB]'
                    : 'border-[#333336] text-[#77777A] hover:text-[#BDBDBB]'
                }`}
              >
                <Eye className="w-4 h-4 shrink-0 text-[#BDBDBB]" />
                <div>
                  <span className="block font-medium">Consider for Public Vault</span>
                  <span className="text-[11px] opacity-75">May be shared after keeper's review</span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#333336]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-serif italic text-[#77777A]">
              Written in solitude. Addressed to Férjem.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest text-[#08090A] bg-[#F0EFEB] hover:bg-[#BDBDBB] disabled:opacity-50 py-3.5 px-8 transition-colors font-medium shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#08090A]" />
                  Sealing Letter...
                </>
              ) : (
                <>
                  <HeartHandshake className="w-4 h-4 text-[#08090A]" />
                  Send Beyond the Silence
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
