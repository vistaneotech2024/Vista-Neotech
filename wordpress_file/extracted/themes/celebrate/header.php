<?php
/**
* The Header for theme.
*/
?>
<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<link rel="icon" type="image/x-icon" href="http://vistaneotech.com/wp-content/uploads/2019/04/hisdfb-150x150.png">
<head>
	
<meta name="p:domain_verify" content="0bfe8955b7e2a742657d14513749b702"/>
	
<meta charset="<?php bloginfo( 'charset' ); ?>" />
	


<?php $celebrate_layout_responsive	= celebrate_option( 'celebrate_layout_responsive', true, true ) ? true : false; 
$celebrate_header_sticky 			= celebrate_option( 'celebrate_header_sticky', true, true ) ? true : false; ?>
<?php if ( $celebrate_layout_responsive ) { ?>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<?php } ?>
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
<?php wp_head(); ?>
</head>
<body    <?php body_class(); ?>>
<div id="wrapper" class="clearfix">
<div id="tc-header-wrapper" class="clearfix">
	<?php if ( $celebrate_header_sticky ) : ?>
	<?php get_template_part('includes/templates/headers/sticky-header'); ?>
	<?php endif; ?>
	<?php
	if( celebrate_option( 'celebrate_layout_header' ) == 'v1' ) {
		get_template_part( 'includes/templates/headers/header-v1' );
	} elseif ( celebrate_option( 'celebrate_layout_header' ) == 'v2' ) {
		get_template_part( 'includes/templates/headers/header-v2' );
	} elseif ( celebrate_option( 'celebrate_layout_header' ) == 'v3' ) {
		get_template_part( 'includes/templates/headers/header-v3' );
	} else {
		get_template_part( 'includes/templates/headers/header-v1' );
	}
	?>
</div>
	<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YYQYJ6CD0G">
</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-YYQYJ6CD0G');
</script>
	
	
<!-- #header-wrapper --> 