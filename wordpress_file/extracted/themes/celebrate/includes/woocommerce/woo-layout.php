<?php
/**
 * Woocommerce Layouts
 */
// Layout Classes
if ( ! function_exists( 'celebrate_get_woocommerce_layout_class' ) ) {
	function celebrate_get_woocommerce_layout_class() {
		// Vars
		$class = 'right-sidebar';
		$celebrate_shop_layout = celebrate_option( 'celebrate_shop_layout' );
		$celebrate_product_layout = celebrate_option( 'celebrate_product_layout' );
		
		// Main Shop Page / Archives layout
		if ( is_shop() || is_product_category() || is_product_tag() ) {
			$class = $celebrate_shop_layout;
		}
		
		// Single Product Layout
		if ( is_singular( 'product' ) ) {
			$class = $celebrate_product_layout;
		}
		return $class;
	} 
} 

// Padding Classes
if ( ! function_exists( 'celebrate_get_woo_padding_classes' ) ) {
	function celebrate_get_woo_padding_classes() {
		
		// Vars
		$padding_class = 'pad-top-none pad-bottom-none';

		if ( celebrate_is_woocommerce_activated() && !is_cart() && !is_checkout() && !is_woocommerce() ) {
			$padding_class;
		} else { 
			// Add Padding to top and bottom
			$padding_class = '';
		}

		return $padding_class;
	} 
} 

// Sidebar on woocommerce pages when assigned
if ( !function_exists('celebrate_woocommerce_sidebar') ) {
	function celebrate_woocommerce_sidebar() {
		$class = celebrate_get_woocommerce_layout_class();
		if ( $class == 'right-sidebar' || $class == 'left-sidebar') {
			return true;
		} else {
			return false;
		}
	} 
} 