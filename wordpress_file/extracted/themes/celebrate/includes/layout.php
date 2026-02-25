<?php
/**
 * Layouts
 */
// Layout Classes
if ( ! function_exists( 'celebrate_get_layout_class' ) ) {
	function celebrate_get_layout_class() {
		
		// Vars
		$class = 'right-sidebar';
		
		// Page Layout
		if ( is_page() ) {
			$celebrate_page_layout = celebrate_option( 'celebrate_page_layout' );
			global $post;
			$page_setting = get_post_meta( get_the_ID(), '_celebrate_page_layout_meta', true );
			if ( $page_setting !== '' ) {
				$class = $page_setting;
			} else {
				$class = $celebrate_page_layout;
			}		
		}

		// Blog / Archive Layout
		$celebrate_blog_archives_layout = celebrate_option( 'celebrate_blog_archives_layout' );
		if ( is_archive() || is_author() || is_home() ) {
			$class = $celebrate_blog_archives_layout;
		}
		
		// Single Post Layout
		$celebrate_blog_single_post_layout = celebrate_option( 'celebrate_blog_single_post_layout' );
	 	if ( is_single() ) {
			$class = $celebrate_blog_single_post_layout;
		}
		return $class;
	} 
} 

// Padding Classes
if ( ! function_exists( 'celebrate_get_padding_classes' ) ) {
	function celebrate_get_padding_classes() {
		
		// Vars
		$padding_class = 'pad-top-none pad-bottom-none';

		if ( is_page() && !is_page_template('portfolio-2col.php') && !is_page_template('portfolio-3col.php') && !is_page_template('portfolio-4col.php') ) {
			$padding_class;
		} else { 
			// Add Padding to top and bottom
			$padding_class = '';
		}
		return $padding_class;
	} 
}