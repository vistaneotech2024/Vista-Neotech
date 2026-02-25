<?php
/*
Plugin Name: ConversioBot
Plugin URI: http://app.conversiobot.com
Description: Grow your business and provide support with our intelligent Chatbots.
Version: 1.0.10
Author: Innovative Chat Limited
Author URI: http://conversiobot.com
License: Copyright 2019, All rights reserved
*/

/*
 * Plugin Updater
 */
error_reporting(0);
require dirname( __FILE__ ).'/skin/plugin-update-checker.php';
$myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
	'https://app.conversiobot.com/wp/metadata.php',
	__FILE__,
	'conversiobot'
);

/*
 * Plugin Administration Menu
 *
 * Usage: Create admin menu
 *
 * Register the options settings
 */
function conversiobot_admin_menu() {
		add_menu_page( __( 'ConversioBot' ), __( 'ConversioBot' ), 'manage_options', 'conversiobot', 'conversiobot_custom_settings' ,plugins_url( 'image/botIcon.png', __FILE__ ) );
		register_setting( 'conversiobot-settings', 'conversiobot_script');
	}

add_action('admin_menu', 'conversiobot_admin_menu');

define( 'CONVERSIOBOT_PLUGIN_SLUG', 'conversiobot' );
define( 'CONVERSIOBOT_PLUGIN_URL', plugin_dir_path( __FILE__ ) );
define( 'CONVERSIOBOT_ROOT',  rtrim(str_replace("\\", "/", ABSPATH), "/\\") . '/');
require_once( CONVERSIOBOT_PLUGIN_URL . '/admin/admin.php' );

function checkIsJSON($string){
   return is_string($string) && is_array(json_decode($string, true)) ? true : false;
}

function conversiobot_script_init() {
    global $post;
    $conversiobot_id  = get_option('conversiobot_id');
    
    
    if(checkIsJSON($conversiobot_id)){
        $json_decode     = json_decode($conversiobot_id, true);
        $widget_bot_id   = $json_decode['default_bot_id'];
        if(count($json_decode['values'])>0){
            for($i=0;$i<count($json_decode['values']);$i++){
                if($json_decode['values'][$i]['id'] == $post->ID AND !empty($json_decode['values'][$i]['bot_id'] )){
                    $widget_bot_id   = $json_decode['values'][$i]['bot_id'] ;
                }
            }
        }
    }
    else{
        $widget_bot_id   = $conversiobot_id;
    }
    $widget = '<script>(function(p,u,s,h){p.botId = "'.$widget_bot_id.'";var a="https://app.conversiobot.com";s=u.createElement("script");s.type="text/javascript";s.id="bot-widget-script";s.src=a+"/lib/js/gadget.js";s.setAttribute("bid","'.$widget_bot_id.'");h=u.getElementsByTagName("script")[0];h.parentNode.insertBefore(s,h);})(window,document);</script>';
    if (!empty($widget_bot_id)) {
        echo "$widget";
    }
    
    
    
    //$conversiobot_id = get_option('conversiobot_id');
    //$widget = '<script>(function(p,u,s,h){p.botId = "'.$conversiobot_id.'";var a="https://app.conversiobot.com";s=u.createElement("script");s.type="text/javascript";s.id="bot-widget-script";s.src=a+"/lib/js/gadget.js";s.setAttribute("bid","'.$conversiobot_id.'");h=u.getElementsByTagName("script")[0];h.parentNode.insertBefore(s,h);})(window,document);</script>';
    //if (!empty($conversiobot_id)) {
			//echo "$widget";
    //}
}
add_action('wp_footer', 'conversiobot_script_init',100,1);