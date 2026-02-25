<?php
/**
 * Template Name: Sitemap
 * The template for displaying sitemap.
 */
get_header(); ?>
<div id="content-wrapper" class="main-container clearfix <?php echo esc_attr( celebrate_get_layout_class() ); ?>">
	<div id="primary" class="content-area">
		<div id="content-main">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			<?php the_content(); ?>
			<?php endwhile; endif; ?>
			<ul class="tc-list-sitemap">
				<?php wp_list_pages( 'title_li=' ); ?>
			</ul>
			<div class="clearfix"></div>
		</div>
	</div>
	<!-- #primary -->
	<?php get_sidebar(); ?>
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>