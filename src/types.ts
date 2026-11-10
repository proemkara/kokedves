export type {
  LetterCategory,
  ModerationStatus,
  PublicationPreference,
  Chapter,
  Letter,
  LetterSubmissionInput,
  ValidationResult,
} from './utils/archive-rules';

export interface AdminStats {
  totalChapters: number;
  publishedChapters: number;
  totalLetters: number;
  bridesLettersCount: number;
  ferjemLettersCount: number;
  pendingLetters: number;
  approvedLetters: number;
  privateLetters: number;
}
