<?php
/**
 * Template Name: Page - Without Page Title
 * The template for displaying pages with no page title
 */
get_header(); ?>
<?php $celebrate_page_comments = celebrate_option( 'celebrate_page_comments', true, true ) ? true : false; ?>
<div id="content-wrapper" class="main-container clearfix <?php echo esc_attr( celebrate_get_layout_class() ); ?>">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_padding_classes() ); ?>" role="main">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<div class="entry-content">
					<?php the_content(); ?>
					<?php wp_link_pages( array( 'before' => '<div class="page-links">', 'after' => '</div>' ) ); ?>
				</div>
			</article>
			<?php if ( $celebrate_page_comments ) { ?>
			<?php comments_template(); ?>
			<?php } ?>
			<?php endwhile; endif; ?>
		</div>
	</div>
	<!-- #primary -->
	<?php get_sidebar(); ?>
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>