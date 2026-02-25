<?php
/**
 * Header Settings
 */
// Header Classes
add_filter( 'body_class', 'celebrate_body_class_header' );
if ( ! function_exists( 'celebrate_body_class_header' ) ) {
	function celebrate_body_class_header( $classes ) {
		if( celebrate_option( 'celebrate_layout_header' ) == 'v1' ) {
			$classes[] = 'tc-header-v1';
		} elseif ( celebrate_option( 'celebrate_layout_header' ) == 'v2' ) {
			$classes[] = 'tc-header-v2';
		} elseif ( celebrate_option( 'celebrate_layout_header' ) == 'v3' ) {
			$classes[] = 'tc-header-v3';
		} else {
			$classes[] = 'tc-header-v1';
		}
		return $classes;
	}
}

// Header Type
add_filter( 'body_class', 'celebrate_body_class_header_transparency' );
if ( ! function_exists( 'celebrate_body_class_header_transparency' ) ) {
	function celebrate_body_class_header_transparency( $classes ) {
		$celebrate_header_transparent	= celebrate_option( 'celebrate_header_transparent', true, true ) ? true : false;
		if ($celebrate_header_transparent ) {
			$classes[] = ' tc-has-header-transparent';
		} else { 
			$classes[] = ''; 
		}
		return $classes;
	}
}

// Page Header Type
add_filter( 'body_class', 'celebrate_body_class_page_header' );
if ( ! function_exists( 'celebrate_body_class_page_header' ) ) {
	function celebrate_body_class_page_header( $classes ) {
		$celebrate_layout_page_header	= celebrate_option( 'celebrate_layout_page_header');
		if ($celebrate_layout_page_header ) {
			$classes[] = $celebrate_layout_page_header;
		} else { 
			$classes[] = 'tc-page-header-full'; 
		}
		return $classes;
	}
}