-- WordPress URL & Metadata Extraction Script
-- For Vista Neotech (Yoast SEO)
-- Table Prefix: npO_
-- Run this query on your WordPress database

-- ============================================
-- 1. ALL PUBLISHED POSTS AND PAGES
-- ============================================
SELECT 
    p.ID,
    p.post_title,
    p.post_name AS slug,
    p.post_type,
    p.post_status,
    p.post_date,
    p.post_modified,
    p.post_parent,
    CONCAT('https://vistaneotech.com/', 
        CASE 
            WHEN p.post_type = 'post' THEN CONCAT('blog/', p.post_name)
            WHEN p.post_type = 'page' THEN p.post_name
            ELSE CONCAT(p.post_type, '/', p.post_name)
        END
    ) AS url,
    p.post_content
FROM npO_posts p
WHERE p.post_status = 'publish'
    AND p.post_type IN ('post', 'page')
ORDER BY p.post_type, p.post_date DESC;

-- ============================================
-- 2. YOAST SEO METADATA (Titles, Descriptions, OG Tags)
-- ============================================
SELECT 
    p.ID,
    p.post_title,
    p.post_name AS slug,
    p.post_type,
    CONCAT('https://vistaneotech.com/', 
        CASE 
            WHEN p.post_type = 'post' THEN CONCAT('blog/', p.post_name)
            WHEN p.post_type = 'page' THEN p.post_name
            ELSE CONCAT(p.post_type, '/', p.post_name)
        END
    ) AS url,
    -- Meta Title
    COALESCE(
        NULLIF(pm_title.meta_value, ''),
        p.post_title
    ) AS meta_title,
    -- Meta Description
    pm_desc.meta_value AS meta_description,
    -- Focus Keyword
    pm_focus.meta_value AS focus_keyword,
    -- OG Title
    pm_og_title.meta_value AS og_title,
    -- OG Description
    pm_og_desc.meta_value AS og_description,
    -- OG Image
    pm_og_image.meta_value AS og_image,
    -- Twitter Title
    pm_twitter_title.meta_value AS twitter_title,
    -- Twitter Description
    pm_twitter_desc.meta_value AS twitter_description,
    -- Twitter Image
    pm_twitter_image.meta_value AS twitter_image,
    -- Canonical URL
    pm_canonical.meta_value AS canonical_url,
    -- Robots Meta
    pm_robots.meta_value AS robots_meta,
    -- Schema Type
    pm_schema.meta_value AS schema_type
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
LEFT JOIN npO_postmeta pm_schema ON p.ID = pm_schema.post_id AND pm_schema.meta_key = '_yoast_wpseo_schema_page_type'
WHERE p.post_status = 'publish'
    AND p.post_type IN ('post', 'page')
ORDER BY p.post_type, p.post_date DESC;

-- ============================================
-- 3. CATEGORIES AND TAXONOMY
-- ============================================
SELECT 
    t.term_id,
    t.name AS category_name,
    t.slug AS category_slug,
    tt.taxonomy,
    tt.parent,
    tt.count AS post_count,
    td.description AS category_description,
    CONCAT('https://vistaneotech.com/category/', t.slug) AS category_url
FROM npO_terms t
INNER JOIN npO_term_taxonomy tt ON t.term_id = tt.term_id
LEFT JOIN npO_term_taxonomy td ON t.term_id = td.term_id
WHERE tt.taxonomy IN ('category', 'post_tag')
ORDER BY tt.taxonomy, tt.count DESC;

-- ============================================
-- 4. POST-CATEGORY RELATIONSHIPS
-- ============================================
SELECT 
    p.ID AS post_id,
    p.post_name AS post_slug,
    p.post_type,
    CONCAT('https://vistaneotech.com/', 
        CASE 
            WHEN p.post_type = 'post' THEN CONCAT('blog/', p.post_name)
            ELSE p.post_name
        END
    ) AS post_url,
    t.term_id,
    t.name AS category_name,
    t.slug AS category_slug,
    tt.taxonomy
FROM npO_posts p
INNER JOIN npO_term_relationships tr ON p.ID = tr.object_id
INNER JOIN npO_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
INNER JOIN npO_terms t ON tt.term_id = t.term_id
WHERE p.post_status = 'publish'
    AND p.post_type = 'post'
    AND tt.taxonomy IN ('category', 'post_tag')
ORDER BY p.ID, tt.taxonomy;

-- ============================================
-- 5. INTERNAL LINKS (Extract from post content)
-- Note: This is a basic extraction - may need refinement
-- ============================================
SELECT 
    p.ID AS source_post_id,
    p.post_name AS source_slug,
    CONCAT('https://vistaneotech.com/', 
        CASE 
            WHEN p.post_type = 'post' THEN CONCAT('blog/', p.post_name)
            ELSE p.post_name
        END
    ) AS source_url,
    -- Extract links (basic regex - may need adjustment)
    SUBSTRING_INDEX(SUBSTRING_INDEX(p.post_content, 'href="https://vistaneotech.com/', -1), '"', 1) AS linked_url
FROM npO_posts p
WHERE p.post_status = 'publish'
    AND p.post_content LIKE '%href="https://vistaneotech.com/%'
ORDER BY p.ID;

-- ============================================
-- 6. CUSTOM POST TYPES (If any)
-- ============================================
SELECT DISTINCT post_type, COUNT(*) AS count
FROM npO_posts
WHERE post_status = 'publish'
GROUP BY post_type
ORDER BY count DESC;

-- ============================================
-- 7. EXISTING REDIRECTS (If using Redirection plugin)
-- ============================================
SELECT 
    id,
    url AS source_url,
    action_data AS target_url,
    action_code AS redirect_type,
    match_type,
    regex
FROM npO_redirection_items
WHERE status = 'enabled'
ORDER BY id;

-- ============================================
-- EXPORT INSTRUCTIONS:
-- ============================================
-- 1. Run each query separately
-- 2. Export results as CSV
-- 3. Save with descriptive names:
--    - wordpress-urls.csv
--    - wordpress-metadata.csv
--    - wordpress-categories.csv
--    - wordpress-post-categories.csv
--    - wordpress-internal-links.csv
--    - wordpress-post-types.csv
--    - wordpress-redirects.csv (if applicable)
-- 4. Share all CSV files for processing
