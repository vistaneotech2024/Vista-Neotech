-- ============================================================================
-- Vista Neotech CMS Database Schema
-- PostgreSQL/Supabase Compatible
-- WordPress Migration Compatible with Enhanced Features
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================================================
-- CORE CONTENT TABLES
-- ============================================================================

-- Pages Table (Static Pages)
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    excerpt TEXT,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'trash')),
    content_type VARCHAR(50) DEFAULT 'page',
    
    -- WordPress Migration Fields
    wordpress_id VARCHAR(50),
    wordpress_url VARCHAR(500),
    
    -- SEO Fields
    meta_title VARCHAR(500),
    meta_description TEXT,
    focus_keyword VARCHAR(255),
    canonical_url VARCHAR(500),
    
    -- Open Graph
    og_title VARCHAR(500),
    og_description TEXT,
    og_image VARCHAR(500),
    og_type VARCHAR(50) DEFAULT 'website',
    
    -- Twitter Card
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    twitter_title VARCHAR(500),
    twitter_description TEXT,
    twitter_image VARCHAR(500),
    
    -- Schema Markup
    schema_markup JSONB,
    
    -- Content Structure
    template VARCHAR(100) DEFAULT 'default',
    featured_image_id UUID REFERENCES media(id),
    
    -- Ordering & Hierarchy
    menu_order INTEGER DEFAULT 0,
    parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    
    -- Metadata
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    
    -- Custom Fields (Flexible JSON)
    custom_fields JSONB DEFAULT '{}',
    
    -- Indexes
    CONSTRAINT pages_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_content_type ON pages(content_type);
CREATE INDEX idx_pages_parent ON pages(parent_id);
CREATE INDEX idx_pages_published ON pages(published_at) WHERE status = 'published';
CREATE INDEX idx_pages_search ON pages USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));

-- Blog Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    excerpt TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'trash')),
    content_type VARCHAR(50) DEFAULT 'post',
    
    -- WordPress Migration Fields
    wordpress_id VARCHAR(50),
    wordpress_url VARCHAR(500),
    
    -- SEO Fields
    meta_title VARCHAR(500),
    meta_description TEXT,
    focus_keyword VARCHAR(255),
    canonical_url VARCHAR(500),
    
    -- Open Graph
    og_title VARCHAR(500),
    og_description TEXT,
    og_image VARCHAR(500),
    og_type VARCHAR(50) DEFAULT 'article',
    
    -- Twitter Card
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    twitter_title VARCHAR(500),
    twitter_description TEXT,
    twitter_image VARCHAR(500),
    
    -- Schema Markup
    schema_markup JSONB,
    
    -- Featured Content
    featured_image_id UUID REFERENCES media(id),
    
    -- Author & Dates
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    
    -- Custom Fields
    custom_fields JSONB DEFAULT '{}',
    
    CONSTRAINT posts_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at) WHERE status = 'published';
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));

-- ============================================================================
-- TAXONOMY TABLES (Categories, Tags)
-- ============================================================================

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    menu_order INTEGER DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(500),
    meta_description TEXT,
    
    -- WordPress Migration
    wordpress_id VARCHAR(50),
    wordpress_slug VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT categories_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- WordPress Migration
    wordpress_id VARCHAR(50),
    wordpress_slug VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT tags_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_tags_slug ON tags(slug);

-- Post-Category Relationships
CREATE TABLE post_categories (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

CREATE INDEX idx_post_categories_post ON post_categories(post_id);
CREATE INDEX idx_post_categories_category ON post_categories(category_id);

-- Post-Tag Relationships
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);

-- ============================================================================
-- MEDIA MANAGEMENT (Images, Videos, Documents)
-- ============================================================================

-- Media Library Table
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500),
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    
    -- Image Specific
    width INTEGER,
    height INTEGER,
    alt_text VARCHAR(500),
    caption TEXT,
    description TEXT,
    
    -- Video Specific
    duration INTEGER, -- in seconds
    thumbnail_path VARCHAR(1000),
    thumbnail_url VARCHAR(1000),
    
    -- Optimization
    optimized_path VARCHAR(1000),
    optimized_url VARCHAR(1000),
    optimization_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    optimization_metadata JSONB,
    
    -- Variants (for responsive images)
    variants JSONB DEFAULT '[]', -- [{width: 1920, height: 1080, path: '', url: ''}, ...]
    
    -- Metadata
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- WordPress Migration
    wordpress_id VARCHAR(50),
    wordpress_url VARCHAR(1000),
    
    -- Custom Fields
    custom_fields JSONB DEFAULT '{}'
);

CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_optimization_status ON media(optimization_status);
CREATE INDEX idx_media_search ON media USING gin(to_tsvector('english', COALESCE(alt_text, '') || ' ' || COALESCE(caption, '') || ' ' || COALESCE(description, '')));

-- Media Collections (Galleries, Albums)
CREATE TABLE media_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'gallery', -- gallery, album, playlist
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE media_collection_items (
    collection_id UUID REFERENCES media_collections(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    PRIMARY KEY (collection_id, media_id)
);

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(255),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor', 'author', 'contributor')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    -- WordPress Migration
    wordpress_id VARCHAR(50),
    
    -- Metadata
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- User Sessions (for auth)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- ============================================================================
-- CONTENT BLOCKS & COMPONENTS (Page Builder)
-- ============================================================================

-- Content Blocks (Reusable Components)
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL, -- hero, feature_card, cta, testimonial, etc.
    content JSONB NOT NULL, -- Flexible JSON structure for block data
    settings JSONB DEFAULT '{}',
    is_reusable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_content_blocks_slug ON content_blocks(slug);
CREATE INDEX idx_content_blocks_type ON content_blocks(type);

-- Page/Post Content Blocks (Ordered Components)
CREATE TABLE page_content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    block_id UUID REFERENCES content_blocks(id) ON DELETE SET NULL,
    block_type VARCHAR(100) NOT NULL,
    block_content JSONB NOT NULL,
    order_index INTEGER NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CHECK (
        (page_id IS NOT NULL AND post_id IS NULL) OR
        (page_id IS NULL AND post_id IS NOT NULL)
    )
);

CREATE INDEX idx_page_content_blocks_page ON page_content_blocks(page_id);
CREATE INDEX idx_page_content_blocks_post ON page_content_blocks(post_id);
CREATE INDEX idx_page_content_blocks_order ON page_content_blocks(order_index);

-- ============================================================================
-- NAVIGATION & MENUS
-- ============================================================================

-- Menus Table
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(100), -- header, footer, sidebar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_menus_slug ON menus(slug);
CREATE INDEX idx_menus_location ON menus(location);

-- Menu Items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    target VARCHAR(20) DEFAULT '_self', -- _self, _blank
    order_index INTEGER NOT NULL,
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    custom_link VARCHAR(500),
    icon VARCHAR(100),
    css_classes VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CHECK (
        (page_id IS NOT NULL AND custom_link IS NULL) OR
        (post_id IS NOT NULL AND custom_link IS NULL) OR
        (custom_link IS NOT NULL AND page_id IS NULL AND post_id IS NULL)
    )
);

CREATE INDEX idx_menu_items_menu ON menu_items(menu_id);
CREATE INDEX idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX idx_menu_items_order ON menu_items(order_index);

-- ============================================================================
-- SEO & ANALYTICS
-- ============================================================================

-- SEO Settings (Global)
CREATE TABLE seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name VARCHAR(255),
    site_description TEXT,
    default_meta_title VARCHAR(500),
    default_meta_description TEXT,
    og_image VARCHAR(500),
    twitter_handle VARCHAR(100),
    facebook_app_id VARCHAR(100),
    google_analytics_id VARCHAR(100),
    google_tag_manager_id VARCHAR(100),
    schema_markup JSONB,
    robots_txt TEXT,
    sitemap_settings JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Redirects (301, 302)
CREATE TABLE redirects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_url VARCHAR(500) NOT NULL,
    destination_url VARCHAR(500) NOT NULL,
    redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302)),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    hit_count INTEGER DEFAULT 0,
    last_hit_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(source_url)
);

CREATE INDEX idx_redirects_source ON redirects(source_url);
CREATE INDEX idx_redirects_status ON redirects(status);

-- ============================================================================
-- CONTENT VERSIONING & REVISIONS
-- ============================================================================

-- Page Revisions
CREATE TABLE page_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    title VARCHAR(500),
    content TEXT,
    excerpt TEXT,
    meta_title VARCHAR(500),
    meta_description TEXT,
    custom_fields JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(page_id, version)
);

CREATE INDEX idx_page_revisions_page ON page_revisions(page_id);

-- Post Revisions
CREATE TABLE post_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    title VARCHAR(500),
    content TEXT,
    excerpt TEXT,
    meta_title VARCHAR(500),
    meta_description TEXT,
    custom_fields JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(post_id, version)
);

CREATE INDEX idx_post_revisions_post ON post_revisions(post_id);

-- ============================================================================
-- SETTINGS & CONFIGURATION
-- ============================================================================

-- Site Settings (Key-Value Store)
CREATE TABLE site_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    group_name VARCHAR(100),
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_site_settings_group ON site_settings(group_name);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default admin user (password should be changed immediately)
-- Password: 'admin123' (bcrypt hash - CHANGE THIS IN PRODUCTION!)
INSERT INTO users (email, username, password_hash, first_name, last_name, display_name, role)
VALUES (
    'admin@vistaneotech.com',
    'admin',
    '$2b$10$YourBcryptHashHere', -- Replace with actual bcrypt hash
    'Admin',
    'User',
    'Administrator',
    'super_admin'
);

-- Insert default SEO settings
INSERT INTO seo_settings (
    site_name,
    site_description,
    default_meta_title,
    default_meta_description
) VALUES (
    'Vista Neotech',
    'MLM Software Developers, Direct Selling Consultants',
    'Vista Neotech – MLM Software & Direct Selling Solutions',
    'Expert MLM software and direct selling consultant offering tailored solutions for network marketing success.'
);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Published Pages View
CREATE VIEW published_pages AS
SELECT * FROM pages WHERE status = 'published';

-- Published Posts View
CREATE VIEW published_posts AS
SELECT * FROM posts WHERE status = 'published';

-- Media Library View (with optimization status)
CREATE VIEW media_library AS
SELECT 
    m.*,
    u.display_name as uploaded_by_name,
    CASE 
        WHEN m.mime_type LIKE 'image/%' THEN 'image'
        WHEN m.mime_type LIKE 'video/%' THEN 'video'
        WHEN m.mime_type LIKE 'audio/%' THEN 'audio'
        ELSE 'document'
    END as media_category
FROM media m
LEFT JOIN users u ON m.uploaded_by = u.id;
