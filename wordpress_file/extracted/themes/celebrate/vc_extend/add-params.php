<?php
/**
 * Add new params to VC
 */

// vc_add_param parameter doesn't exist
if ( !function_exists('vc_add_param') ) {
	return;
}
/**
 * Progressbar
 *
 */
vc_add_param("vc_progress_bar", array(
	"type"		  	=> "checkbox",
	"class"		  	=> "",
	"heading"     	=> esc_html__( '***** ------ Theme Styled Progressbar ----- *****', 'celebrate' ),
	"param_name"	=> "theme_bar",
	"value"       	=> array ( "Yes, please" => "yes" ),
));
	 
/**
 * Tour
 *
 */
vc_add_param("vc_tta_tour", array(
	"type"		  	=> "checkbox",
	"class"		  	=> "",
	"heading"     	=> esc_html__( '***** ------ Theme Styled Tabs ----- *****', 'celebrate' ),
	"param_name"	=> "theme_tab",
	"value"       	=> array ( "Yes, please" => "yes" ),
	'description' => esc_html__( "Select Classic - style, square - shape, grey - color, spacing and gap 1px. Background color of active tab / hover for theme styled tabs can be changed via theme options.", 'celebrate' )
));

/**
 * Tab
 *
 */
vc_add_param("vc_tta_tabs", array(
	"type"		  	=> "checkbox",
	"class"		  	=> "",
	"heading"     	=> esc_html__( '***** ------ Theme Styled Tabs ----- *****', 'celebrate' ),
	"param_name"	=> "theme_tab",
	"value"       	=> array ( "Yes, please" => "yes" ),
	'description' => esc_html__( "Select Classic - style, square - shape, grey - color, spacing and gap 1px. Background color of active tab / hover for theme styled tabs can be changed via theme options.", 'celebrate' )
));

/**
 * Accordion
 *
 */
vc_add_param("vc_tta_accordion", array(
	"type"		  	=> "checkbox",
	"class"		  	=> "",
	"heading"     	=> esc_html__( '***** ------ Make it Theme Styled ----- *****', 'celebrate' ),
	"param_name"	=> "theme_tab",
	"value"       	=> array ( "Yes, please" => "yes" ),
	'description' => esc_html__( "Accordion style, shape, color, content area fill will not work once theme style is checked.", 'celebrate' )
));

/**
 * Column
 *
 */
vc_add_param("vc_column", array(
	"type"		  	=> "dropdown",
	"class"		  	=> "",
	"heading"     	=> esc_html__( "Font Color Style For Dark Background", 'celebrate' ),
	"param_name"	=> "text_color",
	"value"       	=> array (
		esc_html__( "Default", 'celebrate' )				=> "default_typo",
		esc_html__( "For Dark backgrounds", 'celebrate' )	=> "alt_typo", 
		),
	'description' => wp_kses( esc_html__( 'This will apply predefined colors for text / headings / links.<br> If you need your custom color set either use - Text Style - shortcode or refer help document for more details.', 'celebrate' ), array( 'br' => array(), ) ),
));

/**
 * Row
 *
 */
vc_add_param("vc_row", array(
	"type"		  	=> "colorpicker",
	"class"		  	=> "",
	"heading"     	=> esc_html__( 'Row Overlay', 'celebrate' ),
	"param_name"	=> "tc_row_overlay",
	'description' 	=> esc_html__( "Useful if light colored background images, to improve the text visibility. Be sure to set opacity (Alpha) to make it work properly.", 'celebrate' )
));

/**
 * Row
 *
 */
vc_add_param("vc_row", array(
	"type"		  	=> "checkbox",
	"class"		  	=> "",
	"heading"     	=> esc_html__( 'Header Banner Row?', 'celebrate' ),
	"param_name"	=> "tc_row_header_banner",
	"value"       	=> array ( "Yes, please" => "yes" ),
	'description'   => esc_html__( "If you have - transparent header and no page title - set first row of page as header banner row. This will adjust padding for responsive devices.", 'celebrate' )
));

/**
 * Row
 *
 */
vc_add_param("vc_row", array(
	"type"		  	=> "checkbox",
	"class"		  	=> "",
	"heading"     	=> esc_html__( '5 Column Layout', 'celebrate' ),
	"param_name"	=> "tc_columns_custom_five",
	"value"       	=> array ( "Yes, please" => "yes" ),
	'description' => esc_html__( "To use this option - select 6 columns layout for this row. Leave 6th column blank.", 'celebrate' )
));