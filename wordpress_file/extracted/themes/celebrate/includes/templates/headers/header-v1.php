<?php
/**
 * Header variation 1
 */
$celebrate_show_header_social		= celebrate_option( 'celebrate_show_header_social', true, true ) ? true : false;
$celebrate_show_sec_header_text 	= celebrate_option( 'celebrate_show_sec_header_text', true, true ) ? true : false;
$celebrate_show_cart_item			= celebrate_option( 'celebrate_show_cart_item', true, true ) ? true : false;
$celebrate_show_header_search		= celebrate_option( 'celebrate_show_header_search', true, true ) ? true : false;
$celebrate_hide_xs_sec_header_text	= celebrate_option( 'celebrate_hide_xs_sec_header_text', true, true ) ? true : false;
$celebrate_hide_cart_icon			= celebrate_option( 'celebrate_hide_cart_icon', true, true ) ? true : false;
// menu color style
$celebrate_menu_color_style				= celebrate_option( 'celebrate_menu_color_style');
if ( $celebrate_menu_color_style ) {
	$celebrate_return_menu_color_style	= $celebrate_menu_color_style;
} else { 
	$celebrate_return_menu_color_style 	= 'tc-menu-default'; 
}
// hide sec header text for mobile
if ( $celebrate_hide_xs_sec_header_text ) {
	$celebrate_mobile_sec_header_text = '';
} else { 
	$celebrate_mobile_sec_header_text	= ' hidden-xs'; 
}
// hide cart icon for mobile
if ( $celebrate_hide_cart_icon ) {
	$celebrate_mobile_cart_icon	= '';
} else { 
	$celebrate_mobile_cart_icon	= ' hidden-xs'; 
}
// header transparency
$celebrate_header_transparent	= celebrate_option( 'celebrate_header_transparent', true, true ) ? true : false;
if ( $celebrate_header_transparent ) {
	$celebrate_return_header_transparent = 'tc-header-transparent ';
} else { 
	$celebrate_return_header_transparent = 'tc-header-default '; 
}
?>
<div class="<?php echo esc_attr( $celebrate_return_header_transparent); ?> clearfix">
	<?php if ( $celebrate_show_sec_header_text || $celebrate_show_header_social || $celebrate_show_header_search ) { ?>
	<div id="tc-header-secondary" class="clearfix">
		<div class="main-container">
			<div class="tc-header-secondary-inner">
				<?php if ( $celebrate_show_sec_header_text ) { ?>
				<div class="tc-header-sec-left">
					<div class="tc-header-sec-text<?php echo esc_attr( $celebrate_mobile_sec_header_text); ?>"><?php echo wp_kses_post( celebrate_option( 'celebrate_sec_header_custom_text', esc_html__( 'Tagline Here', 'celebrate' ) ) ); ?> </div>
				</div>
				<!-- /.tc-header-sec-left -->
				<?php } ?>
				<?php if ( $celebrate_show_header_social || $celebrate_show_header_search ) { ?>
				<div class="tc-header-sec-right">
					<?php if( $celebrate_show_header_search ) { ?>
					<div id="tc-trigger-wrapper"> <a id="tc-trigger" href="#"></a> </div>
					<?php } ?>
					<?php if ( $celebrate_show_header_social ) { ?>
					<div class="tc-header-wiget-area">
						<?php if ( is_active_sidebar( 'widget-social-network' ) ) { dynamic_sidebar( 'widget-social-network' ); } ?>
					</div>
					<?php  }  ?>
				</div>
				<!-- /.tc-header-sec-right -->
				<?php } ?>
				<?php if( $celebrate_show_header_search ) { ?>
				<div class="tc-header-search">
					<div class="tc-search-dropdown">
						<div class="tc-search-dropdown-inner clearfix">
							<div class="tc-search-form">
								<?php get_search_form(); ?>
							</div>
						</div>
					</div>
				</div>
				<!-- /.tc-header-search -->
				<?php } ?>
			</div>
		</div>
	</div>
	<!-- /#tc-header-secondary -->
	<?php } ?>
	<div id="tc-header-primary" class="clearfix">
		<div class="main-container">
			<div class="tc-header-left clearfix">
				<?php get_template_part( 'includes/templates/headers/logo' ); ?>
			</div>
			<?php if( celebrate_is_woocommerce_activated() && $celebrate_show_cart_item ) { ?>
			<div class="cart-responsive <?php echo esc_attr( $celebrate_mobile_cart_icon ); ?>">
				<?php get_template_part( 'includes/woocommerce/ajaxcart' ); ?>
			</div>
			<?php  } ?>
			<div id="tc-menubar-default" class="main-navigation <?php echo esc_attr( $celebrate_return_menu_color_style ) ?>">
				<?php get_template_part( 'includes/templates/headers/main-menu' ); ?>
			</div>
		</div>
	</div>
	<!-- /#tc-header-primary -->
	<div id="responsive-menu"></div>
</div>
<?php celebrate_page_header_hook(); ?>
<!-- /#header variation --> 