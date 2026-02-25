<?php
/**
 * The template for displaying Search Results pages.
 */
get_header(); ?>
<div id="content-wrapper" class="main-container clearfix fullwidth">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_padding_classes() ); ?>" role="main">
			<div class="row">
				<?php if ( have_posts() ) : ?>
				<div class="mssearch-content">
					<?php while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( '/includes/templates/content-search' ); ?>
					<?php endwhile; ?>
				</div>
				<div class="col-md-12 col-sm-12 col-xs-12">
					<?php celebrate_paging_nav(); ?>
				</div>
				<?php else : ?>
				<div class="col-md-6 col-sm-6 col-xs-12">
					<?php get_template_part( '/includes/templates/content', 'none' ); ?>
				</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>