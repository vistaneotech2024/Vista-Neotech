<?php
/**
 * Back compatibility (4.1)
 */
/**
 * Prevent switching to theme on WordPress versions prior to 4.1 
 * Switches to the default theme.
 *
 */
function celebrate_theme_switch() {
	switch_theme( WP_DEFAULT_THEME, WP_DEFAULT_THEME );
	unset( $_GET['activated'] );
	add_action( 'admin_notices', 'celebrate_wp_upgrade_notice' );
}
add_action( 'after_switch_theme', 'celebrate_theme_switch' );

/**
 * Prints an update nag after an unsuccessful attempt to 
 * switch to theme on WordPress versions prior to 4.1.
 *
 */
function celebrate_wp_upgrade_notice() {
	$message = sprintf( wp_kses( __( 'Theme requires at least WordPress version 4.1 You have version %s. Please upgrade and try again.', 'celebrate' ), array( 'a' => array( 'href' => array() ) ) ), $GLOBALS['wp_version'] );
	printf( '<div class="error"><p>%s</p></div>', $message );
}

/**
 * Prevents the Theme Preview loading on WordPress versions prior to 4.1.
 *
 */
function celebrate_theme_preview() {
	if ( isset( $_GET['preview'] ) ) {
		wp_die( sprintf( wp_kses( __( 'Theme requires at least WordPress version 4.1. You have version %s. Please upgrade and try again.', 'celebrate' ), array( 'a' => array( 'href' => array() ) ) ), $GLOBALS['wp_version'] ) );
	}
}
add_action( 'template_redirect', 'celebrate_theme_preview' );