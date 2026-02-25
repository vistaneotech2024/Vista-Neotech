-- ============================================
-- QUERY 2: YOAST SEO METADATA EXTRACTION
-- MOST IMPORTANT QUERY - RUN THIS FIRST
-- ============================================
-- 
-- This query extracts all SEO metadata from Yoast SEO plugin
-- Export result as: wordpress-metadata.csv
--
-- Instructions:
-- 1. Copy this entire query
-- 2. Paste into your database tool (phpMyAdmin, MySQL Workbench, etc.)
-- 3. Run the query
-- 4. Export results as CSV
-- 5. Save as: wordpress-metadata.csv in scripts/audit/ directory
--
-- ============================================

SELECT 
    p.ID,
    p.post_title,
    p.post_name AS slug,
    p.post_type,
    p.post_date,
    p.post_modified,
    CONCAT('https://vistaneotech.com/', 
        CASE 
            WHEN p.post_type = 'post' THEN CONCAT('blog/', p.post_name)
            WHEN p.post_type = 'page' THEN p.post_name
            ELSE CONCAT(p.post_type, '/', p.post_name)
        END
    ) AS url,
    -- Meta Title (falls back to post title if empty)
    COALESCE(NULLIF(pm_title.meta_value, ''), p.post_title) AS meta_title,
    -- Meta Description
    pm_desc.meta_value AS meta_description,
    -- Focus Keyword
    pm_focus.meta_value AS focus_keyword,
    -- Open Graph Title
    pm_og_title.meta_value AS og_title,
    -- Open Graph Description
    pm_og_desc.meta_value AS og_description,
    -- Open Graph Image
    pm_og_image.meta_value AS og_image,
    -- Twitter Title
    pm_twitter_title.meta_value AS twitter_title,
    -- Twitter Description
    pm_twitter_desc.meta_value AS twitter_description,
    -- Twitter Image
    pm_twitter_image.meta_value AS twitter_image,
    -- Canonical URL
    pm_canonical.meta_value AS canonical_url,
    -- Robots Meta (index/noindex, follow/nofollow)
    pm_robots.meta_value AS robots_meta
FROM npO_posts p
LEFT JOIN npO_postmeta pm_title ON p.ID = pm_title.post_id AND pm_title.meta_key = '_yoast_wpseo_title'
LEFT JOIN npO_postmeta pm_desc ON p.ID = pm_desc.post_id AND pm_desc.meta_key = '_yoast_wpseo_metadesc'
LEFT JOIN npO_postmeta pm_focus ON p.ID = pm_focus.post_id AND pm_focus.meta_key = '_yoast_wpseo_focuskw'
LEFT JOIN npO_postmeta pm_og_title ON p.ID = pm_og_title.post_id AND pm_og_title.meta_key = '_yoast_wpseo_opengraph-title'
LEFT JOIN npO_postmeta pm_og_desc ON p.ID = pm_og_desc.post_id AND pm_og_desc.meta_key = '_yoast_wpseo_opengraph-description'
LEFT JOIN npO_postmeta pm_og_image ON p.ID = pm_og_image.post_id AND pm_og_image.meta_key = '_yoast_wpseo_opengraph-image'
LEFT JOIN npO_postmeta pm_twitter_title ON p.ID = pm_twitter_title.post_id AND pm_twitter_title.meta_key = '_yoast_wpseo_twitter-title'
LEFT JOIN npO_postmeta pm_twitter_desc ON p.ID = pm_twitter_desc.post_id AND pm_twitter_desc.meta_key = '_yoast_wpseo_twitter-description'
LEFT JOIN npO_postmeta pm_twitter_image ON p.ID = pm_twitter_image.post_id AND pm_twitter_image.meta_key = '_yoast_wpseo_twitter-image'
LEFT JOIN npO_postmeta pm_canonical ON p.ID = pm_canonical.post_id AND pm_canonical.meta_key = '_yoast_wpseo_canonical'
LEFT JOIN npO_postmeta pm_robots ON p.ID = pm_robots.post_id AND pm_robots.meta_key = '_yoast_wpseo_meta-robots'
WHERE p.post_status = 'publish'
    AND p.post_type IN ('post', 'page')
ORDER BY p.post_type, p.post_date DESC;

-- ============================================
-- EXPORT INSTRUCTIONS:
-- ============================================
-- After running this query:
-- 1. Export results as CSV
-- 2. Include column headers
-- 3. Save as: wordpress-metadata.csv
-- 4. Place in: scripts/audit/ directory
-- ============================================
