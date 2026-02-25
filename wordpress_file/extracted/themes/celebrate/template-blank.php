<?php
/**
 * Template Name: Blank Page
 * The template for displaying pages without header and footer.
 */
?>
<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<?php $celebrate_layout_responsive	= celebrate_option( 'celebrate_layout_responsive', true, true ) ? true : false; 
$celebrate_header_sticky 			= celebrate_option( 'celebrate_header_sticky', true, true ) ? true : false; ?>
<?php if ( $celebrate_layout_responsive ) { ?>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<?php } ?>
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php $celebrate_page_comments	= celebrate_option( 'celebrate_page_comments', true, true ) ? true : false; 
      $celebrate_show_take_top	= celebrate_option( 'celebrate_show_take_top', true, true ) ? true : false; ?>
<div id="wrapper" class="clearfix">
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
	<?php if ( $celebrate_show_take_top ) { ?>
<a id="take-to-top" href="#"></a>
<?php } ?>
</div>
<!-- #wrapper -->
<?php wp_footer(); ?>
</body>
</html>