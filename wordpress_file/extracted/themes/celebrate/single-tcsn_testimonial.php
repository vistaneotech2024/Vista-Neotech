<?php
/**
 * The template for displaying testimonial single post.
 */
get_header(); ?>
<?php $celebrate_page_header_testimonial	= celebrate_option( 'celebrate_page_header_testimonial', true, true ) ? true : false; 
$celebrate_cpt_social_share 			  	= celebrate_option( 'celebrate_cpt_social_share', true, true ) ? true : false; 
$celebrate_show_breadcrumb               	= celebrate_option( 'celebrate_show_breadcrumb', true, true ) ? true : false; ?>
<?php if( $celebrate_page_header_testimonial ) { ?>
<div id="page-header">
	<div class="main-container clearfix">
		<div class="tc-page-info">
			<h3 class="page-title entry-title">
				<?php the_title(); ?>
			</h3>
		</div>
		<?php if( $celebrate_show_breadcrumb ) { get_template_part( 'includes/templates/headers/breadcrumb' ); } ?>
	</div>
</div>
<?php } ?>
<div id="content-wrapper" class="main-container clearfix fullwidth">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_padding_classes() ); ?>" role="main">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12 tc-testimonial-single">
						<?php if ( has_post_thumbnail() && ! post_password_required() ) : ?>
						<div class="tc-testimonial-img">
							<?php the_post_thumbnail(); ?>
						</div>
						<?php endif; ?>
						<?php $celebrate_client_info = get_post_meta( get_the_ID(), '_celebrate_client_info', true ); ?>
						<h5 class="tc-testimonial-client-name">
							<?php the_title(); ?>
						</h5>
						<span class="tc-testimonial-client-job"><?php echo esc_attr($celebrate_client_info); ?></span>
						<div class="tc-testimonial-single-content">
							<?php the_content(); ?>
						</div>
					</div>
				</div>
			</article>
			<?php celebrate_post_nav(); ?>
			<?php endwhile; endif; ?>
		</div>
	</div>
	<!-- #primary --> 
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>