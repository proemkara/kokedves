-- KÖKEDVES: BRIDE WHO NEVER LEFT
-- Supabase PostgreSQL Database Schema & Row-Level Security (RLS)
-- Two distinct correspondence collections: 'to_brides' and 'to_ferjem'

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  chapter_label TEXT,
  subtitle TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chapters_order ON public.chapters(display_order);
CREATE INDEX IF NOT EXISTS idx_chapters_status ON public.chapters(status);

-- 2. LETTERS TABLE
CREATE TABLE IF NOT EXISTS public.letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('to_brides', 'to_ferjem')),
  sender_name TEXT,
  subject TEXT,
  body TEXT NOT NULL,
  moderation_status TEXT NOT NULL CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  publication_preference TEXT NOT NULL CHECK (publication_preference IN ('private', 'public_review')) DEFAULT 'public_review',
  is_public BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

CREATE INDEX IF NOT EXISTS idx_letters_category ON public.letters(category);
CREATE INDEX IF NOT EXISTS idx_letters_moderation ON public.letters(moderation_status);
CREATE INDEX IF NOT EXISTS idx_letters_public ON public.letters(category, is_public, moderation_status);

-- 3. PROFILES TABLE (ADMINISTRATORS)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')) DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- CHAPTERS POLICIES
CREATE POLICY "Public can view published chapters" 
  ON public.chapters FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage chapters" 
  ON public.chapters FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- LETTERS POLICIES
-- Public visitors can read ONLY approved public letters (never private or pending!)
CREATE POLICY "Public can view approved public letters" 
  ON public.letters FOR SELECT 
  USING (moderation_status = 'approved' AND is_public = true AND publication_preference = 'public_review');

-- Anyone can submit a letter (starts pending, is_public false)
CREATE POLICY "Public can submit letters" 
  ON public.letters FOR INSERT 
  WITH CHECK (moderation_status = 'pending' AND is_public = false);

-- Admins can read, review, moderate, and delete letters
CREATE POLICY "Admins can manage all letters" 
  ON public.letters FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view profiles" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (true);
