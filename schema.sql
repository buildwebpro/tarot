-- D1 schema (Phase 1: LINE bot + cache) — Phase 2 จะเพิ่ม users/history/articles แทน Firestore
CREATE TABLE IF NOT EXISTS line_users (
  line_user_id TEXT PRIMARY KEY,
  zodiac TEXT,
  tier TEXT NOT NULL DEFAULT 'free',
  paid_until TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_line_users_zodiac_tier ON line_users(zodiac, tier);

CREATE TABLE IF NOT EXISTS daily_readings (
  reading_date TEXT NOT NULL,
  zodiac TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (reading_date, zodiac)
);

CREATE TABLE IF NOT EXISTS push_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reading_date TEXT, zodiac TEXT, recipients INTEGER, status TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- log การเรียก AI (ไว้ดูต้นทุน)
CREATE TABLE IF NOT EXISTS ai_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT, provider TEXT, kind TEXT, tokens INTEGER, ms INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);
