-- Database Schema for AccessiAid

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
  preferences_json TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  summary TEXT NOT NULL,
  color TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  type TEXT CHECK(type IN ('overview', 'challenge', 'simulation', 'solution', 'tool', 'resource', 'myth_fact')) NOT NULL,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  easy_read_body TEXT,
  language TEXT DEFAULT 'en',
  display_order INTEGER DEFAULT 0,
  sources_json TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  type TEXT CHECK(type IN ('video', 'image', 'audio')) NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,
  transcript TEXT,
  source_credit TEXT
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options_json TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  content_block_id TEXT REFERENCES content_blocks(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_block_id)
);

CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  sections_completed_json TEXT DEFAULT '[]',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category_id)
);

CREATE TABLE IF NOT EXISTS aac_items (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  symbol_icon TEXT NOT NULL,
  audio_phrase TEXT NOT NULL,
  category_group TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS emergency_cards (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_json TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
