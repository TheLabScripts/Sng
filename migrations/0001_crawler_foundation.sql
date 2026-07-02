PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS saved_searches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  radius_miles INTEGER NOT NULL DEFAULT 25 CHECK (radius_miles BETWEEN 1 AND 500),
  category TEXT NOT NULL DEFAULT 'Any',
  keywords TEXT NOT NULL DEFAULT '',
  negative_keywords TEXT NOT NULL DEFAULT '',
  min_price REAL NOT NULL DEFAULT 0,
  max_price REAL NOT NULL DEFAULT 0,
  min_estimated_profit REAL NOT NULL DEFAULT 0,
  min_deal_score INTEGER NOT NULL DEFAULT 0 CHECK (min_deal_score BETWEEN 0 AND 100),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  scan_interval_minutes INTEGER NOT NULL DEFAULT 30 CHECK (scan_interval_minutes BETWEEN 5 AND 10080),
  last_scanned_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_saved_searches_due ON saved_searches(is_active, last_scanned_at, scan_interval_minutes);

CREATE TABLE IF NOT EXISTS marketplace_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('mock', 'html_snapshot', 'generic_public', 'facebook_placeholder', 'provider_json')),
  base_url TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  config_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_search_sources (
  saved_search_id TEXT NOT NULL REFERENCES saved_searches(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES marketplace_sources(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (saved_search_id, source_id)
);

CREATE TABLE IF NOT EXISTS crawler_runs (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES marketplace_sources(id),
  saved_search_id TEXT NOT NULL REFERENCES saved_searches(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'partial')),
  started_at TEXT NOT NULL,
  finished_at TEXT,
  listings_found INTEGER NOT NULL DEFAULT 0,
  new_listings_found INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crawler_runs_search ON crawler_runs(saved_search_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_crawler_runs_source ON crawler_runs(source_id, started_at DESC);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES marketplace_sources(id),
  source TEXT NOT NULL,
  external_id TEXT,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  location_text TEXT NOT NULL DEFAULT '',
  zip_code TEXT,
  latitude REAL,
  longitude REAL,
  distance_miles REAL,
  category TEXT NOT NULL DEFAULT 'Other',
  image_urls TEXT NOT NULL DEFAULT '[]',
  seller_name TEXT,
  posted_at TEXT,
  scraped_at TEXT NOT NULL,
  raw_json TEXT NOT NULL DEFAULT '{}',
  content_hash TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_listings_source_external ON listings(source, external_id) WHERE external_id IS NOT NULL AND external_id <> '';
CREATE UNIQUE INDEX IF NOT EXISTS uq_listings_source_url_hash ON listings(source, source_url, content_hash) WHERE external_id IS NULL OR external_id = '';
CREATE INDEX IF NOT EXISTS idx_listings_active_scraped ON listings(is_active, scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_category_price ON listings(category, price);

CREATE TABLE IF NOT EXISTS listing_matches (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  saved_search_id TEXT NOT NULL REFERENCES saved_searches(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  estimated_resale_price REAL NOT NULL,
  estimated_costs REAL NOT NULL,
  estimated_profit REAL NOT NULL,
  deal_score INTEGER NOT NULL CHECK (deal_score BETWEEN 0 AND 100),
  reason TEXT NOT NULL,
  risk_flags TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'saved', 'ignored', 'contacted', 'bought', 'sold')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (listing_id, saved_search_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_matches_user_score ON listing_matches(user_id, status, deal_score DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  listing_match_id TEXT NOT NULL REFERENCES listing_matches(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'in_app',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'muted', 'sent', 'failed')),
  sent_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (user_id, listing_match_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_status ON alerts(user_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS muted_saved_search_alerts (
  user_id TEXT NOT NULL,
  saved_search_id TEXT NOT NULL REFERENCES saved_searches(id) ON DELETE CASCADE,
  muted_at TEXT NOT NULL,
  PRIMARY KEY (user_id, saved_search_id)
);

CREATE TABLE IF NOT EXISTS creator_referrals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  creator_code TEXT NOT NULL,
  referral_source TEXT,
  claimed_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_creator_referrals_code ON creator_referrals(creator_code);
