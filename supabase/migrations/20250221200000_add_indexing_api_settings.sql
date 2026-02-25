-- Admin-stored API keys for auto-indexing (Bing, etc.). One row; admin page reads/updates.
CREATE TABLE IF NOT EXISTS indexing_api_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  bing_webmaster_api_key TEXT,
  google_indexing_api_key TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO indexing_api_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE indexing_api_settings IS 'API keys for search engine / indexing APIs (Bing Webmaster, Google Indexing, etc.). Set via Admin > Indexing.';
