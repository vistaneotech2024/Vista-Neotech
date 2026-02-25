<?php
/**
 * Plugin Name: Celebrate Core
 * Description: Creates Shortcodes and Custom Post Types
 * Version:     1.0.0
 * Author:      Tansh
 * Author URI:  http://themeforest.net/user/tansh
 * Text Domain: celebrate
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /lang
 */
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
require_once( plugin_dir_path( __FILE__ ) . 'class-tcsn-celebrate-core.php' );
tc_celebrate_core::get_instance();