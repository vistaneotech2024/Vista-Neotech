<?php
/**
 * The Template for displaying all single posts.
 */
get_header(); ?>
<?php $celebrate_show_breadcrumb_blog   	= celebrate_option( 'celebrate_show_breadcrumb_blog', true, true ) ? true : false; 
$celebrate_show_blog_tagline		= celebrate_option( 'celebrate_show_blog_tagline', true, true ) ? true : false; ?>
<div id="page-header">
	<div class="main-container clearfix">
		<div class="tc-page-info">
			<h3 class="page-title entry-title"> <?php echo celebrate_option( 'celebrate_blog_title', esc_html__( 'Blog', 'celebrate' ) ); ?> </h3>
			<?php if( $celebrate_show_blog_tagline ) { ?>
			<span class="tc-page-tagline">
			<?php $page_tagline 	= get_post_meta( $post->ID, '_celebrate_page_tagline', true ); 
			if( $page_tagline != "" ) { 
			 	echo esc_attr( $page_tagline ); 
			} else { 
				echo  esc_attr( celebrate_option( 'celebrate_page_tagline', esc_html__( 'How we work with our clients', 'celebrate' ) ) ); 
		 	} ?>
			</span>
			<?php } ?>
		</div>
		<?php if( $celebrate_show_breadcrumb_blog ) { get_template_part( 'includes/templates/headers/breadcrumb' ); } ?>
	</div>
</div>
<div id="content-wrapper" class="main-container clearfix <?php echo esc_attr( celebrate_get_layout_class() ); ?>">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_padding_classes() ); ?>" role="main">
			<?php get_template_part( '/includes/templates/single', 'content' ); ?>
		</div>
	</div>
	<!-- #primary -->
	<?php get_sidebar(); ?>
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>