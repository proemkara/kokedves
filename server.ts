import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  validateLetterSubmission,
  sanitizePlainText,
  createSlug,
  calculateArchiveStats,
  type Chapter,
  type Letter,
  type LetterCategory,
} from './src/utils/archive-rules.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kokedves1914';
const JWT_SECRET = process.env.JWT_SECRET || 'kokedves-secret-token-key-1914';

app.use(express.json());

// Persistent database file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'kokedves-archive.json');

// Initial seed data
const initialSeedChapters: Chapter[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    title: 'BEFORE MARBLE LEARNED MY NAME',
    slug: 'before-marble-learned-my-name',
    chapter_label: 'CHAPTER I',
    subtitle: 'Of ordinary mornings, newly shared rooms, and a life not yet interrupted.',
    content: `There were mornings before the silence grew so heavy that even the grandfather clock seemed ashamed to strike the quarter-hour.

We had shared an apartment on the third floor of Thököly út, where the morning sun struck the parquet flooring at an acute, golden angle. The tea was always steep and bitter; you laughed at how I measured sugar in thirds of a teaspoon, as though precision could safeguard domestic happiness against the sudden tumult of history.

Our bed stood beside the French doors that opened toward the courtyard. In those early months, the stone balustrade was merely stone—a ledge upon which pigeons rested, a place to air damp linen in the crisp April breeze. It had not yet become an altar. It had not yet learned the weight of two elbows pressed against its grain, night after night, waiting for footsteps that the cobblestones refused to return.`,
    cover_image_url: '/assets/come-home-bride.jpg',
    display_order: 1,
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 80).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 80).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    title: 'THE FIRST BELL',
    slug: 'the-first-bell',
    chapter_label: 'CHAPTER II',
    subtitle: 'The hour in which a promise first began to sound like an absence.',
    content: `The mobilization dispatch was pinned to the door of the garrison on a Tuesday. By Thursday, the steam engine at Keleti station had swallowed three thousand men, and the soot hung over the district like grease on cold mutton.

You kissed the hollow beneath my collarbone and said, “Do not pack away the summer clothes. I will be home before the chestnuts drop.”

It is curious how a sentence spoken in haste can outlive the empire that conscripted it. I did not pack the linen suits. I hung them in the wardrobe with blocks of cedar, and when the leaves on Thököly út turned yellow and fell upon the stone walkway, I stood on the balcony and told the autumn wind that you were merely detained by poor rail connections.`,
    cover_image_url: '/assets/grief-and-waiting.jpg',
    display_order: 2,
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    title: 'THE BYGONE BALCONY',
    slug: 'the-bygone-balcony',
    chapter_label: 'CHAPTER III',
    subtitle: 'Where the years gathered, one season upon another.',
    content: `Years do not arrive in processions; they seep through window frames like November damp.

The neighbors grew polite in that cruel way reserved for the afflicted. At first, Frau Horthy from the second floor brought broth; by the fourth winter, she simply lowered her eyes when we passed on the spiral staircase, fearing perhaps that my condition was contagious. For devotion, when sustained past all practical reason, is viewed by the world as an indecency.

A letter did arrive once. The paper was stamped by the Ministry of War in Vienna, folded into three equal leaves. It spoke of Galicia. It spoke of a trench whose coordinates had already been plowed back into rye. I read the first sentence, folded the paper along its original creases, and laid it beneath the brass candlestick on the mantle.

To acknowledge a paper is to grant it jurisdiction over the soul. I returned to the balcony. The streetcars clattered below. The war had ended for everyone except the one who refused to surrender her vigil.`,
    cover_image_url: null,
    display_order: 3,
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    title: 'COME HOME, DEAR BRIDE',
    slug: 'come-home-dear-bride',
    chapter_label: 'INTERLUDE II',
    subtitle: 'An open invitation to those who have loved beyond an ending.',
    content: `If you have arrived at this house carrying an unanswered letter, do not leave it on the doorstep.

There is a strange sanctuary in grief that has outlasted its object. We do not ask for explanations here. We do not ask whether the ship sank, whether the train was derailed, or whether the beloved simply walked into a different life across an unmapped border.

In this archive, waiting is not an error in calculation. It is the purest monument one mortal can raise to another. Take up the pen. Address the one whose silence you have carried. The balcony has room for every devotion that refused to turn to dust.`,
    cover_image_url: '/assets/come-home-bride.jpg',
    display_order: 4,
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const initialSeedLetters: Letter[] = [
  // Room 1: To the Brides
  {
    id: 'b1111111-0000-0000-0000-000000000001',
    category: 'to_brides',
    sender_name: 'A Daughter of the City',
    subject: 'To the one who held the third floor',
    body: 'To the brides who remained, the city has not forgotten the silence you kept on Thököly út. We pass by the stone balustrade in our hurried coats, but every winter evening when the fog gathers over the trolley cables, we look up and see that patience is more enduring than bronze.',
    moderation_status: 'approved',
    publication_preference: 'public_review',
    is_public: true,
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    reviewed_by: 'admin',
  },
  {
    id: 'b1111111-0000-0000-0000-000000000002',
    category: 'to_brides',
    sender_name: 'An Unnamed Pilgrim',
    subject: 'The veil that outlasted winter',
    body: 'To the brides who remained, I left my own vows on a train forty years ago. Reading of your vigil made me understand that waiting is not a failure of courage; it is the stubborn refusal to let an absence rewrite a vow.',
    moderation_status: 'approved',
    publication_preference: 'public_review',
    is_public: true,
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    reviewed_by: 'admin',
  },
  // Room 2: To Férjem
  {
    id: 'f1111111-0000-0000-0000-000000000001',
    category: 'to_ferjem',
    sender_name: 'She who still watches the lane',
    subject: 'The tea on the small table',
    body: 'Dear Férjem, the leaves fell from the linden tree this morning just as they did on the week you took your valise. I still brew two cups and set yours beside the window sill where the sun warms the porcelain. It is not madness; it is simply the habit of fidelity.',
    moderation_status: 'approved',
    publication_preference: 'public_review',
    is_public: true,
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    reviewed_by: 'admin',
  },
  {
    id: 'f1111111-0000-0000-0000-000000000002',
    category: 'to_ferjem',
    sender_name: 'A quiet heart in Pest',
    subject: 'The metronome on the piano',
    body: 'Dear Férjem, the violin piece you loved was played by the orchestra at the Academy yesterday. I bought two tickets and left the chair beside me empty. No one asked why.',
    moderation_status: 'approved',
    publication_preference: 'public_review',
    is_public: true,
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    reviewed_by: 'admin',
  },
  {
    id: 'f1111111-0000-0000-0000-000000000003',
    category: 'to_ferjem',
    sender_name: 'Anonymous Keeper',
    subject: 'Held in private confidence',
    body: 'Dear Férjem, twenty-three years have gone by since the station smoke cleared. I write this only to remind myself that my promise was never broken.',
    moderation_status: 'approved',
    publication_preference: 'private',
    is_public: false, // Remains strictly private!
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    reviewed_by: 'admin',
  },
];

interface DatabaseSchema {
  chapters: Chapter[];
  letters: Letter[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        chapters: initialSeedChapters,
        letters: initialSeedLetters,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // If old schema existed with brides, migrate smoothly to chapters + letters
    return {
      chapters: parsed.chapters || initialSeedChapters,
      letters: parsed.letters || initialSeedLetters,
    };
  } catch (err) {
    console.error('Error loading database file, using fallback in-memory seed:', err);
    return {
      chapters: initialSeedChapters,
      letters: initialSeedLetters,
    };
  }
}

function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

let db = loadDatabase();

// Authentication middleware for administrative routes
function verifyAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const validToken = crypto.createHmac('sha256', JWT_SECRET).update(ADMIN_PASSWORD).digest('hex');

  if (token === validToken || token === ADMIN_PASSWORD) {
    return next();
  }

  return res.status(403).json({ error: 'Invalid administrative credentials' });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect passphrase' });
  }
  const token = crypto.createHmac('sha256', JWT_SECRET).update(ADMIN_PASSWORD).digest('hex');
  return res.json({
    token,
    user: {
      displayName: 'The Keeper of the Archive',
      role: 'admin',
    },
  });
});

// Admin Verify Token
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const validToken = crypto.createHmac('sha256', JWT_SECRET).update(ADMIN_PASSWORD).digest('hex');
  if (token === validToken || token === ADMIN_PASSWORD) {
    return res.json({ valid: true });
  }
  return res.status(403).json({ valid: false });
});

// Admin Stats
app.get('/api/admin/stats', verifyAdminAuth, (req, res) => {
  const stats = calculateArchiveStats(db.chapters, db.letters);
  res.json(stats);
});

// CHAPTERS ENDPOINTS
app.get('/api/chapters', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  if (isAdmin) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
    const validToken = crypto.createHmac('sha256', JWT_SECRET).update(ADMIN_PASSWORD).digest('hex');
    if (token === validToken || token === ADMIN_PASSWORD) {
      return res.json([...db.chapters].sort((a, b) => a.display_order - b.display_order));
    }
  }

  const published = db.chapters
    .filter((c) => c.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  res.json(published);
});

app.post('/api/chapters', verifyAdminAuth, (req, res) => {
  const { title, chapter_label, subtitle, content, cover_image_url, display_order, status } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newChapter: Chapter = {
    id: crypto.randomUUID(),
    title: sanitizePlainText(title),
    slug: `${createSlug(title)}-${Date.now().toString(36)}`,
    chapter_label: chapter_label ? sanitizePlainText(chapter_label) : null,
    subtitle: subtitle ? sanitizePlainText(subtitle) : null,
    content: sanitizePlainText(content),
    cover_image_url: cover_image_url || null,
    display_order: display_order ?? (db.chapters.length + 1),
    status: status || 'published',
    published_at: status === 'published' ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.chapters.push(newChapter);
  saveDatabase(db);
  res.status(201).json(newChapter);
});

app.put('/api/chapters/:id', verifyAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = db.chapters.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  const current = db.chapters[index];
  const { title, chapter_label, subtitle, content, cover_image_url, display_order, status } = req.body;

  db.chapters[index] = {
    ...current,
    title: title !== undefined ? sanitizePlainText(title) : current.title,
    chapter_label: chapter_label !== undefined ? (chapter_label ? sanitizePlainText(chapter_label) : null) : current.chapter_label,
    subtitle: subtitle !== undefined ? (subtitle ? sanitizePlainText(subtitle) : null) : current.subtitle,
    content: content !== undefined ? sanitizePlainText(content) : current.content,
    cover_image_url: cover_image_url !== undefined ? cover_image_url : current.cover_image_url,
    display_order: display_order !== undefined ? Number(display_order) : current.display_order,
    status: status !== undefined ? status : current.status,
    published_at: status === 'published' && !current.published_at ? new Date().toISOString() : current.published_at,
    updated_at: new Date().toISOString(),
  };

  saveDatabase(db);
  res.json(db.chapters[index]);
});

app.delete('/api/chapters/:id', verifyAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = db.chapters.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Chapter not found' });
  }
  db.chapters.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, id });
});

// LETTERS ENDPOINTS
// Public: returns ONLY approved and public letters, segregated by category ('to_brides' | 'to_ferjem')
// Admin: returns all letters or filtered by category/status
app.get('/api/letters', (req, res) => {
  const { category, status, admin } = req.query;

  if (admin === 'true') {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
    const validToken = crypto.createHmac('sha256', JWT_SECRET).update(ADMIN_PASSWORD).digest('hex');
    if (token === validToken || token === ADMIN_PASSWORD) {
      let filtered = [...db.letters];
      if (status && status !== 'all') {
        filtered = filtered.filter((l) => l.moderation_status === status);
      }
      if (category && (category === 'to_brides' || category === 'to_ferjem')) {
        filtered = filtered.filter((l) => l.category === category);
      }
      return res.json(filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()));
    }
  }

  // Public visitors: ONLY approved and public letters (never private or pending!)
  let publicLetters = db.letters.filter((l) => l.moderation_status === 'approved' && l.is_public);
  if (category && (category === 'to_brides' || category === 'to_ferjem')) {
    publicLetters = publicLetters.filter((l) => l.category === category);
  }

  res.json(publicLetters.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()));
});

// Submit Letter (Public)
// Category must be 'to_brides' or 'to_ferjem'
app.post('/api/letters', (req, res) => {
  const validation = validateLetterSubmission(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
  }

  const { category, sender_name, subject, body, publication_preference } = req.body;

  const pref = publication_preference === 'private' ? 'private' : 'public_review';

  const newLetter: Letter = {
    id: crypto.randomUUID(),
    category,
    sender_name: sender_name ? sanitizePlainText(sender_name) : null,
    subject: subject ? sanitizePlainText(subject) : null,
    body: sanitizePlainText(body),
    moderation_status: 'pending', // Starts strictly pending
    publication_preference: pref,
    is_public: false, // Never public on initial submission
    submitted_at: new Date().toISOString(),
    reviewed_at: null,
    reviewed_by: null,
  };

  db.letters.unshift(newLetter);
  saveDatabase(db);

  const confirmationMessage =
    category === 'to_brides'
      ? 'Your words have been left at her door, entrusted to the keeping of this house.'
      : 'Some letters are written not in expectation of an answer, but because the heart still has something to say.';

  res.status(201).json({
    success: true,
    message: confirmationMessage,
    letter: {
      id: newLetter.id,
      category: newLetter.category,
      sender_name: newLetter.sender_name,
      submitted_at: newLetter.submitted_at,
      moderation_status: newLetter.moderation_status,
      publication_preference: newLetter.publication_preference,
    },
  });
});

// Moderate Letter (Admin)
app.put('/api/letters/:id/moderate', verifyAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, action } = req.body;

  const index = db.letters.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Letter not found' });
  }

  if (action === 'delete') {
    db.letters.splice(index, 1);
    saveDatabase(db);
    return res.json({ success: true, id, action: 'deleted' });
  }

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid moderation status' });
  }

  const letter = db.letters[index];
  letter.moderation_status = status;
  letter.reviewed_at = new Date().toISOString();
  letter.reviewed_by = 'admin';

  // CRITICAL PRIVACY RULE:
  // If approved AND publication_preference === 'public_review', mark is_public = true.
  // If publication_preference === 'private', is_public MUST REMAIN FALSE.
  if (status === 'approved' && letter.publication_preference === 'public_review') {
    letter.is_public = true;
  } else {
    letter.is_public = false;
  }

  saveDatabase(db);
  res.json(letter);
});

// ----------------------------------------------------
// DEV SERVER / STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Kökedves Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
