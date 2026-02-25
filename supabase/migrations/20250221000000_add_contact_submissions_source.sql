-- Add source column to contact_submissions for popup vs contact form.
-- Run this in Supabase SQL Editor or via Supabase CLI if you use migrations.

ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS source text DEFAULT 'contact_form';

COMMENT ON COLUMN contact_submissions.source IS 'contact_form | popup';
