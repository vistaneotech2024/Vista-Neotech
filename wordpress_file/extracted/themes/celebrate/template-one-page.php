<?php
/**
 * Template Name: One Page
 * The template for displaying pages with no page title
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
<div id="wrapper" class="clearfix">
	<?php $celebrate_page_comments = celebrate_option( 'celebrate_page_comments', true, true ) ? true : false; ?>
	<header id="header-one-page">
		<div class="main-container">
			<div class="tc-header-left clearfix">
				<?php get_template_part( 'includes/templates/headers/logo-onepage' ); ?>
			</div>
			<div class="main-navigation">
				<?php if( has_nav_menu( 'one_page_menu' ) ) {
wp_nav_menu( array( 
	'theme_location'  	=> 'one_page_menu',
	'container'       	=> '',
	'container_class'	=> '',
	'container_id'   	=> '',
	'menu_class'      	=> 'sf-menu',
	'menu_id'         	=> 'tc-onepage-nav',
	'depth'           	=> 0,
	'walker' => new CELEBRATE_Dropdown_Walker_Nav_Menu,
	) 
); 
} ?>
			</div>
		</div>
		<div id="responsive-onepage-menu"></div>
	</header>
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
</div>
<!-- #wrapper -->
<?php wp_footer(); ?>
</body>
</html>