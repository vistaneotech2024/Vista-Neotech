<?php
/**
 * WooCommerce functions
 */

/**
 * Declare WooCommerce support 
 *
 */
add_action( 'after_setup_theme', 'woocommerce_support' );
function woocommerce_support() {
	add_theme_support( 'woocommerce' );
}

/**
 * Disable WooCommerce styles
 *
 */
add_filter( 'woocommerce_enqueue_styles', 'celebrate_dequeue_styles' );
function celebrate_dequeue_styles( $enqueue_styles ) {
	unset( $enqueue_styles['woocommerce-general'] );	// Remove the gloss
	return $enqueue_styles;
}

/**
 * Remove WooCommerce Generator tag, styles, and scripts here
 *
 */
add_action( 'wp_enqueue_scripts', 'child_manage_woocommerce_styles', 99 );
function child_manage_woocommerce_styles() {
	// Remove WooCommerce Generator tag in <head>
	remove_action( 'wp_head', array( $GLOBALS['woocommerce'], 'generator' ) );		
}

/**
 * Remove page title from content section as custom page title is set.
 *
 */
add_filter('woocommerce_show_page_title', 'celebrate_woo_page_title_remove');
if(!function_exists('celebrate_woo_page_title_remove')){
	function celebrate_woo_page_title_remove(){
		return function_exists('is_shop') && is_shop() ? false : true;
	}
}

/**
 * Products per page for the shop
 *
 */
add_filter( 'loop_shop_per_page', create_function( '$cols', 'return 12;' ), 20 );

/**
 *  Change number or products per row 
 *
 */
 add_filter( 'loop_shop_columns', 'celebrate_loop_shop_columns');

if (!function_exists('celebrate_loop_shop_columns')) {
	function celebrate_loop_shop_columns() {
		$columns =  esc_attr( celebrate_option( 'celebrate_woocommerce_shop_columns' ) );
		return $columns;
	}
}

/**
 * Change number of related products output
 *
 */
function woo_related_products_limit() {
	global $product;
	$args['posts_per_page'] =  esc_attr( celebrate_option( 'celebrate_woocommerce_related_products' ) );
	return $args;
}
add_filter( 'woocommerce_output_related_products_args', 'celebrate_related_products_args' );
function celebrate_related_products_args( $args ) {
	$args['posts_per_page'] =  esc_attr( celebrate_option( 'celebrate_woocommerce_related_products' ) ); // number of related products
	$args['columns'] =  esc_attr( celebrate_option( 'celebrate_woocommerce_related_products_column' ) ); // columns number
	return $args;
}

/**
 * Change number of upsells output
 *
 */
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15 );
add_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_upsells', 15 );
if ( ! function_exists( 'woocommerce_output_upsells' ) ) {
	function woocommerce_output_upsells() {
		woocommerce_upsell_display( 3,3 ); // Display 3 products in rows of 3
	}
}

// Override woo pagination 
if( celebrate_is_woocommerce_activated() ) {
	add_filter( 'woocommerce_pagination_args' , 'celebrate_override_pagination_args' );
	if( ! function_exists('celebrate_override_pagination_args' ) ) {
		function celebrate_override_pagination_args( $args ) {
			$args['prev_text'] = '<i class="icon-chevron-left"></i>';
			$args['next_text'] = '<i class="icon-chevron-right"></i>';
			return $args;
		}
	}
}