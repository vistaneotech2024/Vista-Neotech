<?php
/**
 * Include the TGM_Plugin_Activation class.
 */
require_once ( get_template_directory() . '/includes/class-tgm-plugin-activation.php' );

add_action( 'tgmpa_register', 'celebrate_theme_register_required_plugins' );
/**
 * Register the required plugins for this theme.
 */
function celebrate_theme_register_required_plugins() {
	/*
	 * Array of plugin arrays. Required keys are name and slug.
	 * If the source is NOT from the .org repo, then source is also required.
	 */
	$plugins = array(

		// celebrate Core Plugin 
		array(
			'name'     				=> esc_html__( 'Celebrate Core', 'celebrate' ), // The plugin name 
			'slug'     				=> 'tcsn-celebrate-core', // The plugin slug (typically the folder name)
			'source'   				=> get_template_directory() . '/includes/plugins/tcsn-celebrate-core.zip', // The plugin source
			'required' 				=> true, // If false, the plugin is only 'recommended' instead of required
			'version' 				=> '1.0.0', // E.g. 1.0.0. If set, the active plugin must be this version or higher, otherwise a notice is presented
			'force_activation' 		=> false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch
			'force_deactivation' 	=> false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins
			'external_url' 			=> '', // If set, overrides default API URL and points to an external URL
		),
		
		// WPBakery Visual Composer Plugin
		array(
			'name'     				=> esc_html__( 'WPBakery Visual Composer', 'celebrate' ), // The plugin name
			'slug'     				=> 'js_composer', // The plugin slug (typically the folder name)
			'source'   				=> get_template_directory() . '/includes/plugins/js_composer.zip', // The plugin source
			'required' 				=> true, // If false, the plugin is only 'recommended' instead of required
			'version' 				=> '5.2.1', // E.g. 1.0.0. If set, the active plugin must be this version or higher, otherwise a notice is presented
			'force_activation' 		=> false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch
			'force_deactivation' 	=> false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins
			'external_url' 			=> '', // If set, overrides default API URL and points to an external URL
		),
		
		// Revolution Slider
		array(
			'name'     				=> esc_html__( 'Revolution Slider', 'celebrate' ), // The plugin name 
			'slug'     				=> 'revslider', // The plugin slug (typically the folder name)
			'source'   				=> get_template_directory() . '/includes/plugins/revslider.zip', // The plugin source
			'required' 				=> false, // If false, the plugin is only 'recommended' instead of required
			'version' 				=> '5.4.5.1', // E.g. 1.0.0. If set, the active plugin must be this version or higher, otherwise a notice is presented
			'force_activation' 		=> false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch
			'force_deactivation' 	=> false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins
			'external_url' 			=> '', // If set, overrides default API URL and points to an external URL
		),
				
		// Redux Framework
		array(
			'name'     				=> esc_html__( 'Redux Framework', 'celebrate' ), // The plugin name 
			'slug'     				=> 'redux-framework', // The plugin slug (typically the folder name)
			'required' 				=> true, // If false, the plugin is only 'recommended' instead of required
			'force_activation' 		=> false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch
			'force_deactivation' 	=> false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins
			'external_url' 			=> '', // If set, overrides default API URL and points to an external URL
		),
		
		// Contact Form 7
		array(
			'name'      => esc_html__( 'Contact Form 7', 'celebrate' ), // The plugin name
			'slug'      => 'contact-form-7',
			'required'  => false,
        ),
		
		// Breadcrumb NavXT
		array(
			'name'      => esc_html__( 'Breadcrumb NavXT', 'celebrate' ), // The plugin name
			'slug'      => 'breadcrumb-navxt',
			'required'  => false,
        ),
		
		// Woocommerce
		array(
			'name'      => esc_html__( 'Woocommerce', 'celebrate' ), // The plugin name
			'slug'      => 'woocommerce',
			'required'  => false,
        ),
		
		// WooSidebars Sidebars
		array(
			'name'      => esc_html__( 'WooSidebars', 'celebrate' ), // The plugin name 
			'slug'      => 'woosidebars',
			'required'  => false,
        ),

	);
	
	/*
	 * Array of configuration settings. Amend each line as needed.
	 *
	 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
	 * strings available, please help us make TGMPA even better by giving us access to these translations or by
	 * sending in a pull-request with .po file(s) with the translations.
	 *
	 * Only uncomment the strings in the config array if you want to customize the strings.
	 */
	$config = array(
		'id'           => 'tgmpa',                 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',
		'menu'         => 'tgmpa-install-plugins', // Menu slug.
		'parent_slug'  => 'themes.php',            // Parent menu slug.
		'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
		'has_notices'  => true,                    // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => false,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.
	);
	tgmpa( $plugins, $config );
}

// Demo Import Plugin Recommend
$celebrate_demo_plugin_disble = celebrate_option( 'celebrate_demo_plugin_disble', true, true ) ? true : false; 
if( $celebrate_demo_plugin_disble ) {
	add_action( 'tgmpa_register', 'celebrate_demo_import_plugins' );
	/**
	 * Register the required plugins for this theme.
	 */
	function celebrate_demo_import_plugins() {
		
		/*
		 * Array of plugin arrays. Required keys are name and slug.
		 * If the source is NOT from the .org repo, then source is also required.
		 */
		$plugins = array(
			// One Click Demo Import
			array(
				'name'      => esc_html__( 'One Click Demo Import', 'celebrate' ), // The plugin name 
				'slug'      => 'one-click-demo-import',
				'required'  => false,
			), 
		);
		
		/*
		 * Array of configuration settings. Amend each line as needed.
		 *
		 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
		 * strings available, please help us make TGMPA even better by giving us access to these translations or by
		 * sending in a pull-request with .po file(s) with the translations.
		 *
		 * Only uncomment the strings in the config array if you want to customize the strings.
		 */
		$config = array(
			'id'           => 'tgmpa',                 // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => '',
			'menu'         => 'tgmpa-install-plugins', // Menu slug.
			'parent_slug'  => 'themes.php',            // Parent menu slug.
			'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
			'has_notices'  => true,                    // Show admin notices or not.
			'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => false,                   // Automatically activate plugins after installation or not.
			'message'      => '',                      // Message to output right before the plugins table.
		);
	
		tgmpa( $plugins, $config );
	}
}