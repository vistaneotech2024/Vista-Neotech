<?php
// Retrieve theme option values
if ( ! function_exists( 'celebrate_option' ) ) {
	function celebrate_option( $id, $fallback = '', $param = false ) {

		global $celebrate_options;
		if ( isset( $celebrate_options ) && count( $celebrate_options ) > 0 && is_array( $celebrate_options ) ) {
			if ( array_key_exists( $id, $celebrate_options ) ) {
				$output = $celebrate_options[ $id ];
			}
			elseif ( isset( $fallback ) ) {
				$output = $fallback;
			}
			else {
				$output = '';
			}
			if ( $param ) {
				return (bool) $output;
			}
			else {
				return $output;
			}
		}
		else {
			if ( isset( $fallback ) ) {
				return $fallback;
			}
			else {
				return false;
			}
		}
	}
} // celebrate_option

// Retrieve theme option values - image
if ( function_exists( 'celebrate_option' ) && ! function_exists( 'celebrate_image_option' ) ) {
	function celebrate_image_option( $id, $key = 'url' ){
		$field = celebrate_option( $id );
		if ( is_array( $field ) && array_key_exists( $key, $field ) ) {
			return $field[$key];
		}
		else {
			return false;
		}
	}
} // celebrate_image_option