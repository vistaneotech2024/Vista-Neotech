<?php
/**
 * The template for displaying Tag Archive pages.
 */
get_header(); ?>
<div id="content-wrapper" class="main-container clearfix <?php echo esc_attr( celebrate_get_layout_class() ); ?>">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_padding_classes() ); ?>" role="main">
			<?php get_template_part( '/includes/templates/archive', 'content' ); ?>
		</div>
	</div>
	<!-- #primary -->
	<?php get_sidebar(); ?>
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>