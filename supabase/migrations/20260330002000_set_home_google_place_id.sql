-- Set Google Place ID for Home page (slug = 'home')
-- Only sets it if missing/empty.

update public.pages
set custom_fields = jsonb_set(
  coalesce(custom_fields, '{}'::jsonb),
  '{google_place_id}',
  to_jsonb('ChIJSzLa_eADDTkRd6bWXU0MkTI'::text),
  true
)
where slug = 'home'
  and (
    custom_fields is null
    or nullif(custom_fields->>'google_place_id', '') is null
  );

