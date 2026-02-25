<?php
/**
 * The template for displaying portfolio single post.
 */

get_header(); ?>
<?php $celebrate_portfolio_type         = get_post_meta( get_the_ID(), '_celebrate_portfolio_type', true ); 
$celebrate_pf_video_audio_embed         = get_post_meta( get_the_ID(), '_celebrate_pf_video_audio_embed', true ); 
$celebrate_page_header_portfolio        = celebrate_option( 'celebrate_page_header_portfolio', true, true ) ? true : false; 
$celebrate_portfolio_predefined_content	= celebrate_option( 'celebrate_portfolio_predefined_content', true, true ) ? true : false;
$celebrate_breadcrumb_portfolio         = celebrate_option( 'celebrate_breadcrumb_portfolio', true, true ) ? true : false; 
$celebrate_show_portfolio_tagline		= celebrate_option( 'celebrate_show_portfolio_tagline', true, true ) ? true : false; ?>
<?php if( $celebrate_page_header_portfolio ) { ?>
<div id="page-header">
	<div class="main-container clearfix">
		<div class="tc-page-info">
			<h3 class="page-title entry-title">
				<?php the_title(); ?>
			</h3>
			<?php if( $celebrate_show_portfolio_tagline ) { ?>
			<span class="tc-page-tagline">
			<?php $page_tagline 	= get_post_meta( $post->ID, '_celebrate_page_tagline', true ); 
			if( $page_tagline != "" ) { 
			 	echo esc_attr( $page_tagline ); 
			} else { 
				echo esc_attr( celebrate_option( 'celebrate_page_tagline', esc_html__( 'How we work with our clients', 'celebrate' ) ) ); 
		 	} ?>
			</span>
			<?php } ?>
		</div>
		<?php if( $celebrate_breadcrumb_portfolio ) { get_template_part( 'includes/templates/headers/breadcrumb' ); } ?>
	</div>
</div>
<?php } ?>
<div id="content-wrapper" class="main-container clearfix fullwidth">
	<div id="primary" class="content-area">
		<div id="content-main" class="pad-top-none" role="main">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<?php if( $celebrate_portfolio_predefined_content ) { ?>
				<div class="tc-post-thumb">
					<?php 
			switch ( $celebrate_portfolio_type ) {
				case 'Image': ?>
					<div class="folio-thumb">
						<?php the_post_thumbnail(); ?>
					</div>
					<?php break; // end image ?>
					<?php case 'Video': ?>
					<div class="tc-video-wrapper">
						<?php  echo wp_kses( $celebrate_pf_video_audio_embed, celebrate_embed_allowed_tags() ); ?>
					</div>
					<?php break; // end video ?>
					<?php case 'Audio': ?>
					<div class="tc-audio-wrapper"> <?php echo wp_kses( $celebrate_pf_video_audio_embed, celebrate_embed_allowed_tags() ); ?> </div>
					<?php break; // end audio ?>
					<?php case 'Gallery': ?>
					<div class="gallery-wrapper">
						<?php get_template_part( 'includes/templates/sliders/slider-gallery' ); ?>
					</div>
					<?php break; // end gallery ?>
					<?php default: ?>
					<div class="folio-thumb">
						<?php the_post_thumbnail(); ?>
					</div>
					<?php } //end switch ?>
				</div>
				<?php } ?>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
			</article>
			<?php celebrate_post_nav(); ?>
			<?php endwhile; ?>
			<?php endif; ?>
		</div>
	</div>
	<!-- #primary --> 
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>