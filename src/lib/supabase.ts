import { createClient } from '@supabase/supabase-js';
import type { Chapter, Letter } from '../utils/archive-rules';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder')
);

// Optional Supabase client for environments where Supabase credentials are provided
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ArchiveDatabase {
  chapters: Chapter[];
  letters: Letter[];
}
