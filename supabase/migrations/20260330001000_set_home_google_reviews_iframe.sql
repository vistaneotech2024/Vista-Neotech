-- Set Google reviews embed iframe src for Home page (slug = 'home')
-- Only sets it if missing/empty.

update public.pages
set custom_fields = jsonb_set(
  coalesce(custom_fields, '{}'::jsonb),
  '{google_reviews_iframe_src}',
  to_jsonb('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.1199045945223!2d77.0809865!3d28.630017100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03e0fdda324b%3A0x32910c4d5dd6a677!2sMLM%20Software%20%26%20MLM%20Consultant%20%7C%20Vista%20Neotech%20Pvt%20Ltd!5e1!3m2!1sen!2sin!4v1774868138450!5m2!1sen!2sin'::text),
  true
)
where slug = 'home'
  and (
    custom_fields is null
    or nullif(custom_fields->>'google_reviews_iframe_src', '') is null
  );

