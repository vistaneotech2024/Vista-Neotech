<?php
/**
 * Sticky Header 
 */ 
$celebrate_sticky_menu_color_style = celebrate_option( 'celebrate_sticky_menu_color_style');
if ($celebrate_sticky_menu_color_style ) {
	$celebrate_return_sticky_menu_color_style = $celebrate_sticky_menu_color_style;
} else { 
	$celebrate_return_sticky_menu_color_style = 'tc-menu-default '; 
}
?>
<div id="header-sticky">
	<div class="header-sticky-inner clearfix">
		<div class="main-container clearfix">
			<div class="tc-header-left clearfix">
				<div class="tc-logo">
					<?php if ( celebrate_option( 'celebrate_logo_type' ) == "celebrate_show_image_logo") { ?>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php bloginfo('title'); ?>"><img src="<?php echo esc_url( celebrate_image_option( 'celebrate_sticky_logo' ) ); ?>" alt="<?php bloginfo('title'); ?>"></a>
					<?php } elseif ( celebrate_option( 'celebrate_logo_type' ) == "celebrate_show_text_logo") { ?>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php bloginfo('title'); ?>"><?php echo  esc_attr( esc_attr( celebrate_option( 'celebrate_text_logo' ) ) ); ?></a>
					<?php } else { ?>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php bloginfo('title'); ?>">
					<?php bloginfo('title'); ?>
					</a>
					<?php } ?>
				</div>
			</div>
			<!-- /.header-left -->
			<nav class="main-navigation <?php  echo esc_attr( $celebrate_return_sticky_menu_color_style ) ?>">
				<?php 
if( has_nav_menu( 'sticky_menu' ) ) {
wp_nav_menu( array( 
	'theme_location'  	=> 'sticky_menu',
	'container'       	=> '',
	'container_class'	=> '',
	'container_id'   	=> '',
	'menu_class'      	=> 'sf-menu',
	'menu_id'         	=> '',
	'depth'           	=> 0,
	'walker' 		  	=> new CELEBRATE_Dropdown_Walker_Nav_Menu,
	) 
); 
} ?>
			</nav>
		</div>
	</div>
</div>
<!-- #header-sticky --> 