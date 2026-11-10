/**
 * Core validation, filtering, and data transformation rules for Kökedves archive.
 * Supports the two distinct correspondence rooms:
 * 1. 'to_brides' - Letters left for the abandoned brides collectively.
 * 2. 'to_ferjem' - Intimate letters addressed to 'Dear Férjem' (one's own beloved/departed).
 */

export type LetterCategory = 'to_brides' | 'to_ferjem';
export type ModerationStatus = 'pending' | 'approved' | 'rejected';
export type PublicationPreference = 'private' | 'public_review';

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  chapter_label?: string | null;
  chapter_number?: string | null;
  subtitle?: string | null;
  content: string;
  cover_image_url?: string | null;
  display_order: number;
  status: 'draft' | 'published';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Letter {
  id: string;
  category: LetterCategory;
  sender_name?: string | null;
  subject?: string | null;
  body: string;
  moderation_status: ModerationStatus;
  publication_preference: PublicationPreference;
  is_public: boolean;
  submitted_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

export interface LetterSubmissionInput {
  category: LetterCategory;
  sender_name?: string;
  subject?: string;
  body: string;
  publication_preference?: PublicationPreference;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a letter submitted to the Brides or to Férjem.
 */
export function validateLetterSubmission(input: Partial<LetterSubmissionInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.category || (input.category !== 'to_brides' && input.category !== 'to_ferjem')) {
    errors.category = 'A valid correspondence destination must be chosen.';
  }

  const sender = (input.sender_name || '').trim();
  if (sender.length > 80) {
    errors.sender_name = 'Signature must not exceed 80 characters.';
  }

  const body = (input.body || '').trim();
  if (body.length === 0) {
    errors.body = 'The letter cannot be empty.';
  } else if (body.length < 10) {
    errors.body = 'The letter must be at least 10 characters in length.';
  } else if (body.length > 5000) {
    errors.body = 'The letter may not exceed 5,000 characters.';
  }

  if (input.subject && input.subject.length > 120) {
    errors.subject = 'Subject may not exceed 120 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitizes plain text to prevent script injection while preserving line breaks and quotes.
 */
export function sanitizePlainText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .trim();
}

/**
 * Creates a URL-friendly slug from an entity title.
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Filters approved and public letters for the 'to_brides' collection.
 */
export function filterApprovedBridesLetters(letters: Letter[]): Letter[] {
  return letters
    .filter((l) => l.category === 'to_brides' && l.moderation_status === 'approved' && l.is_public)
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
}

/**
 * Filters approved and public letters for the 'to_ferjem' collection.
 * Private letters are NEVER returned here!
 */
export function filterApprovedFerjemLetters(letters: Letter[]): Letter[] {
  return letters
    .filter((l) => l.category === 'to_ferjem' && l.moderation_status === 'approved' && l.is_public && l.publication_preference === 'public_review')
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
}

/**
 * Computes dashboard archive statistics dynamically.
 */
export function calculateArchiveStats(chapters: Chapter[], letters: Letter[]) {
  const publishedChapters = chapters.filter((c) => c.status === 'published');
  const bridesLetters = letters.filter((l) => l.category === 'to_brides');
  const ferjemLetters = letters.filter((l) => l.category === 'to_ferjem');
  const pendingLetters = letters.filter((l) => l.moderation_status === 'pending');
  const approvedLetters = letters.filter((l) => l.moderation_status === 'approved');
  const privateLetters = letters.filter((l) => l.publication_preference === 'private');

  return {
    totalChapters: chapters.length,
    publishedChapters: publishedChapters.length,
    totalLetters: letters.length,
    bridesLettersCount: bridesLetters.length,
    ferjemLettersCount: ferjemLetters.length,
    pendingLetters: pendingLetters.length,
    approvedLetters: approvedLetters.length,
    privateLetters: privateLetters.length,
  };
}
