import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateLetterSubmission,
  sanitizePlainText,
  createSlug,
  filterApprovedBridesLetters,
  filterApprovedFerjemLetters,
  calculateArchiveStats,
  type Chapter,
  type Letter,
} from './archive-rules';

test('validateLetterSubmission validates category and body', () => {
  const result = validateLetterSubmission({});
  assert.equal(result.valid, false);
  assert.ok(result.errors.category);
  assert.ok(result.errors.body);
});

test('validateLetterSubmission accepts valid Brides letter', () => {
  const result = validateLetterSubmission({
    category: 'to_brides',
    sender_name: 'A Visitor from Buda',
    subject: 'For the ones who waited',
    body: 'We carry your memory like an ember against the chill of the Danube winter.',
  });
  assert.equal(result.valid, true);
});

test('validateLetterSubmission accepts valid Férjem letter', () => {
  const result = validateLetterSubmission({
    category: 'to_ferjem',
    sender_name: 'Your Faithful Heart',
    subject: 'Autumn in the courtyard',
    body: 'The leaves have fallen upon the balustrade, but your absence remains as clear as morning frost.',
    publication_preference: 'private',
  });
  assert.equal(result.valid, true);
});

test('filterApprovedBridesLetters isolates approved public letters to brides', () => {
  const mockLetters: Letter[] = [
    {
      id: 'l1',
      category: 'to_brides',
      body: 'Letter 1 to brides',
      moderation_status: 'approved',
      publication_preference: 'public_review',
      is_public: true,
      submitted_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'l2',
      category: 'to_brides',
      body: 'Letter 2 pending',
      moderation_status: 'pending',
      publication_preference: 'public_review',
      is_public: false,
      submitted_at: '2026-01-02T00:00:00Z',
    },
    {
      id: 'l3',
      category: 'to_ferjem',
      body: 'Letter 3 to ferjem',
      moderation_status: 'approved',
      publication_preference: 'public_review',
      is_public: true,
      submitted_at: '2026-01-03T00:00:00Z',
    },
  ];

  const bridesApproved = filterApprovedBridesLetters(mockLetters);
  assert.equal(bridesApproved.length, 1);
  assert.equal(bridesApproved[0].id, 'l1');
});

test('filterApprovedFerjemLetters strictly excludes private and pending letters', () => {
  const mockLetters: Letter[] = [
    {
      id: 'l1',
      category: 'to_ferjem',
      body: 'Private letter to ferjem',
      moderation_status: 'approved',
      publication_preference: 'private',
      is_public: false, // Must remain false!
      submitted_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'l2',
      category: 'to_ferjem',
      body: 'Public approved letter to ferjem',
      moderation_status: 'approved',
      publication_preference: 'public_review',
      is_public: true,
      submitted_at: '2026-01-02T00:00:00Z',
    },
    {
      id: 'l3',
      category: 'to_ferjem',
      body: 'Pending letter to ferjem',
      moderation_status: 'pending',
      publication_preference: 'public_review',
      is_public: false,
      submitted_at: '2026-01-03T00:00:00Z',
    },
  ];

  const ferjemApproved = filterApprovedFerjemLetters(mockLetters);
  assert.equal(ferjemApproved.length, 1);
  assert.equal(ferjemApproved[0].id, 'l2');
});

test('calculateArchiveStats calculates category and privacy counts accurately', () => {
  const mockChapters: Chapter[] = [
    {
      id: 'c1',
      title: 'Chapter 1',
      slug: 'c1',
      content: 'Text',
      display_order: 1,
      status: 'published',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    },
  ];
  const mockLetters: Letter[] = [
    {
      id: 'l1',
      category: 'to_brides',
      body: 'Text',
      moderation_status: 'pending',
      publication_preference: 'public_review',
      is_public: false,
      submitted_at: '2026-01-01',
    },
    {
      id: 'l2',
      category: 'to_ferjem',
      body: 'Text',
      moderation_status: 'approved',
      publication_preference: 'private',
      is_public: false,
      submitted_at: '2026-01-02',
    },
  ];

  const stats = calculateArchiveStats(mockChapters, mockLetters);
  assert.equal(stats.totalChapters, 1);
  assert.equal(stats.totalLetters, 2);
  assert.equal(stats.bridesLettersCount, 1);
  assert.equal(stats.ferjemLettersCount, 1);
  assert.equal(stats.pendingLetters, 1);
  assert.equal(stats.approvedLetters, 1);
  assert.equal(stats.privateLetters, 1);
});
