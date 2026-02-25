-- Bing Webmaster URL submission logs (Phase 3 SEO)
-- Stores URL, status, timestamp, API response for audit and duplicate prevention

CREATE TABLE IF NOT EXISTS bing_submission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | success | error
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  api_response JSONB,
  error_message TEXT,
  source TEXT DEFAULT 'admin'  -- admin | api
);

CREATE INDEX IF NOT EXISTS idx_bing_submission_logs_url ON bing_submission_logs(url);
CREATE INDEX IF NOT EXISTS idx_bing_submission_logs_submitted_at ON bing_submission_logs(submitted_at);
CREATE INDEX IF NOT EXISTS idx_bing_submission_logs_status ON bing_submission_logs(status);

COMMENT ON TABLE bing_submission_logs IS 'Logs for Bing Webmaster URL Submission API calls; used for retry and duplicate prevention';
