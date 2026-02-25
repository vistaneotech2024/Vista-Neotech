<?php
/**
 * Visual Composer Extend
 */
// celebrate button colors
$celebrate_buttons = array( 
 	esc_html__( "Default", "celebrate" )	=> "default",
	esc_html__( "Grey", "celebrate" )		=> "grey",
	esc_html__( "Indigo", "celebrate" )		=> "indigo",
	esc_html__( "Red", "celebrate" )		=> "red",
	esc_html__( "Pink", "celebrate" )		=> "pink",
	esc_html__( "Purple", "celebrate" )		=> "purple",
	esc_html__( "Blue", "celebrate" )		=> "blue",
	esc_html__( "Cyan", "celebrate" )		=> "cyan",
	esc_html__( "Teal", "celebrate" )		=> "teal",
	esc_html__( "Green", "celebrate" )		=> "green",
	esc_html__( "Lime", "celebrate" )		=> "lime",
	esc_html__( "Yellow", "celebrate" )		=> "yellow",
	esc_html__( "Orange", "celebrate" )		=> "orange",
	esc_html__( "Skyblue", "celebrate" )	=> "skyblue",
	esc_html__( "Brown", "celebrate" )		=> "brown",
	esc_html__( "White", "celebrate" )		=> "white",
);

// celebrate basic colors
$celebrate_basic_colors = array( 
	esc_html__( "Grey", "celebrate" )		=> "grey",
	esc_html__( "Indigo", "celebrate" )		=> "indigo",
	esc_html__( "Red", "celebrate" )		=> "red",
	esc_html__( "Pink", "celebrate" )		=> "pink",
	esc_html__( "Purple", "celebrate" )		=> "purple",
	esc_html__( "Blue", "celebrate" )		=> "blue",
	esc_html__( "Cyan", "celebrate" )		=> "cyan",
	esc_html__( "Teal", "celebrate" )		=> "teal",
	esc_html__( "Green", "celebrate" )		=> "green",
	esc_html__( "Lime", "celebrate" )		=> "lime",
	esc_html__( "Yellow", "celebrate" )		=> "yellow",
	esc_html__( "Orange", "celebrate" )		=> "orange",
	esc_html__( "Skyblue", "celebrate" )	=> "skyblue",
	esc_html__( "Brown", "celebrate" )		=> "brown",
	esc_html__( "White", "celebrate" )		=> "white",
);

// celebrate animations
$celebrate_css_animations = array( 
 	esc_html__( "None", "celebrate" )			=> "", 
	esc_html__( "Zoom In", "celebrate" ) 		=> "animate-now animated zoomIn", 
	esc_html__( "Fade In Down", "celebrate" ) 	=> "animate-now animated fadeInDown", 
	esc_html__( "Fade In Left", "celebrate" ) 	=> "animate-now animated fadeInLeft",
	esc_html__( "Fade In Right", "celebrate" )	=> "animate-now animated fadeInRight",
	esc_html__( "Fade In Up", "celebrate" ) 	=> "animate-now animated fadeInUp",
	esc_html__( "RubberBand", "celebrate" )		=> "animate-now animated rubberBand",
	esc_html__( "Shake", "celebrate" )			=> "animate-now animated shake",
	esc_html__( "Swing", "celebrate" ) 			=> "animate-now animated swing",
	esc_html__( "Roll In", "celebrate" ) 		=> "animate-now animated rollIn",
);

/**
 * Custom Shortcodes in Visual Composer
 */

// Horizontal Empty space
vc_map( array(
   "name"     	=> esc_html__( "Horizontal Empty Space", "celebrate" ),
   "base"	  	=> "tc_spacer_wide",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Width", "celebrate" ),
		"param_name"  	=> "width",
		"value" 	  	=> "", 
		'admin_label'   => true,
		"description"	=> esc_html__( "Provide unit. Like : 20px", "celebrate" )
	  	),
	),
) );

// Button
vc_map( array(
   "name"     => esc_html__( "Theme Custom Button", "celebrate" ),
   "base"     => "tc_button",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
   	array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Type", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "btn_type",
		"value"       	=> array (
			esc_html__( "Default - Icon / Text", "celebrate" )	=> "btn_default", 
			esc_html__( "Image", "celebrate" )					=> "btn_img", 
		),
	  ),
   	 array(
		"type"        => "attach_image",
		"class"       => '',
		"heading"     => esc_html__( "Button in Image format", "celebrate" ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"param_name"  => "image",
		"value" 	  => '', 
		"dependency"  => array( "element" => "btn_type", "value" => "btn_img" ),
		"description" => esc_html__( "Select button image from media library.", "celebrate" )
	 ),
   	 array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button Text", "celebrate" ),
		   "group" 	 	  => esc_html__( "Link", 'celebrate' ),
		   "param_name"   => "text",
		   "value"        => "Link",
		   'admin_label'  => true,
		   "dependency"   => array( "element" => "btn_type", "value" => "btn_default" ),
		   "description"  => esc_html__( "Leave blank this field if need - Only Icon - button.", "celebrate" )
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Style", "celebrate" ),
		"group" 	 	=> esc_html__( "General", 'celebrate' ),
		"param_name"	=> "style",
		"value"       	=> array (
			 esc_html__( "Classic", "celebrate" )	=> "classic", 
			 esc_html__( "Outline", "celebrate" )	=> "outline",
		),
		"dependency"  	=> array( "element" => "btn_type", "value" => "btn_default" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Shape", "celebrate" ),
		"group" 	 	=> esc_html__( "General", 'celebrate' ),
		"param_name"	=> "shape",
		"value"       	=> array (
			 esc_html__( "Square", "celebrate" )			=> "square",  
			 esc_html__( "Round", "celebrate" )				=> "round",
			 esc_html__( "Rounded Corners", "celebrate" )	=> "rounded", 
		),
		"dependency"  	=> array( "element" => "btn_type", "value" => "btn_default" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Size", "celebrate" ),
		"group" 	 	=> esc_html__( "General", 'celebrate' ),
		"param_name"	=> "size",
		"value"       	=> array (
			 esc_html__( "Medium", "celebrate" )	=> "medium", 
			 esc_html__( "Big", "celebrate" )		=> "big", 
			 esc_html__( "Small", "celebrate" )	=> "small", 
		),
		"dependency"  	=> array( "element" => "btn_type", "value" => "btn_default" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Color", "celebrate" ),
		"group" 	 	=> esc_html__( "General", 'celebrate' ),
		"param_name"	=> "color",
		"value"       	=> $celebrate_buttons,
		"dependency"  	=> array( "element" => "btn_type", "value" => "btn_default" ),
		),
 	array(
		'type' => 'dropdown',
		'heading' => __( 'Icon', 'celebrate' ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		'param_name'  => 'icon_name',
		'value' => array(
		    __( 'No Icon', 'celebrate' )								=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		"dependency"  	=> array( "element" => "btn_type", "value" => "btn_default" ),
		'description' => __( 'Select icon library.', 'celebrate' ),
		
	 ),
	 array(
		'type' => 'iconpicker',
		'heading' => __( 'Icon', 'celebrate' ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		'param_name' => 'icon_fontawesome',
		'value' => 'fa fa-adjust',
		'settings' => array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' => array(
			'element' => 'icon_name',
			'value' => 'fontawesome',
		),
		'description' => __( 'Select icon from library.', 'celebrate' ),
	 ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Icon Position", "celebrate" ),
		"group" 	 	=> esc_html__( "General", 'celebrate' ),
		"param_name"	=> "icon_position",
		"value"       	=> array (
			 esc_html__( "Default - Left", "celebrate" )	=> "icon-left", 
			 esc_html__( "Right", "celebrate" )				=> "icon-right", 
		),
		"dependency"  	=> array( "element" => "btn_type", "value" => "btn_default" ),
	  ),
   	 array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button URL", "celebrate" ),
		   "group" 	 	  => esc_html__( "Link", 'celebrate' ),
		   "param_name"   => "url",
		   "value"        => "",
		   'admin_label'  => true,
		   "description"  => "",
	  ),
	array(
		"type"        => "dropdown",
		"class"       => "",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"group" 	  => esc_html__( "Link", 'celebrate' ),
		"param_name"  => "target",
		"value"       => array (
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )	=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Align", "celebrate" ),
		"group" 	 	=> esc_html__( "General", 'celebrate' ),
		"param_name"	=> "align",
		"value"       	=> array (
			 esc_html__( "Default - Left", "celebrate" )	=> "", 
			 esc_html__( "Right", "celebrate" )			=> "right",
			 esc_html__( "Center", "celebrate" )			=> "center",
		),
	  ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) ); // Button

// Blockquote
vc_map( array(
   "name"     => esc_html__( "Blockquote", "celebrate" ),
   "base"     => "tc_blockquote",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
   array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Select Style", "celebrate" ),
		"param_name"	=> "style",
		"value"       	=> array (
			esc_html__( "Custom  - Quote Icon", "celebrate" )		=> "custom_icon", 
			esc_html__( "Default - Left Border", "celebrate" )	=> "left_border", 
			esc_html__( "Default - Right Border", "celebrate" )	=> "right_border", 
			),
		),
	array(
			"type"        => "textfield",
			"heading"     => esc_html__( "Font Size", "celebrate" ),
			"param_name"  => "font_size",
			"value"       => '',
			"description" => esc_html__( "Provide unit to font size like px or em. Example : 48px", "celebrate" ),
		),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Text Color", "celebrate" ),
		 "param_name"  	=> "color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "This will be appicable to icons too.", "celebrate" ),
		 ),
	array(
			"type"        => "textfield",
			"heading"     => esc_html__( "Quote Source", "celebrate" ),
			"param_name"  => "source",
			"value"       => "",
		),
	array(
			"type"        => "textarea",
			"heading"     => esc_html__( "Content", "celebrate" ),
			"param_name"  => "content",
			"value"       => esc_html__( "Quote text here", "celebrate" ),
			"description" => esc_html__( "Enter your content.", "celebrate" )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) );

// Lists
vc_map( array(
   "name"     => esc_html__( "Selected Lists", "celebrate" ),
   "base"     => "tc_selected_list",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
	 array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "List Style", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "style",
		"value"       	=> array (
			esc_html__( "Checkmark", "celebrate" )		=> "checkmark", 
			esc_html__( "Inline", "celebrate" )			=> "inline", 
			esc_html__( "Pipe Separator", "celebrate" )	=> "separator", 
			esc_html__( "Checkmark Circle", "celebrate" )	=> "checkmark_circle", 
			esc_html__( "Checkmark Square", "celebrate" )	=> "checkmark_square", 
			esc_html__( "Star", "celebrate" )				=> "star", 
			esc_html__( "Arrow", "celebrate" )			=> "arrow", 
			esc_html__( "Arrow Circle", "celebrate" )		=> "arrow-circle", 
			esc_html__( "Heart", "celebrate" )			=> "heart", 
			esc_html__( "Circle", "celebrate" )			=> "circle", 
		),
		'admin_label'   => true,
	  ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Font Size", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "size",
		"value"       	=> array (
			esc_html__( "Default", "celebrate" )	=> "default", 
			esc_html__( "Medium", "celebrate" )	=> "medium", 
			),
		),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Font Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "This will be applied to icon too. Leave blank for theme default.", "celebrate" )
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "List Text Align", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "align",
		"value"       	=> array (
			esc_html__( "None", "celebrate" )		=> "",
			esc_html__( "Left", "celebrate" )		=> "left",
			esc_html__( "Right", "celebrate" )	=> "right",
			),
		"dependency"  	=> array( "element" => "style", "value" => array( "inline", "separator" ) ),
		),	
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		"group" 	    => esc_html__( "General", 'celebrate' ),
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"	=> "content",
		"value"       	=> "",
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter list here. Use 'Bulleted list' button from default WP editor. Refer help doc (Shortcodes Section) for more info.", "celebrate" )
		),
	)
) ); // Lists

//  Ordered list
vc_map( array(
   "name"     	=> esc_html__( "Styled - Ordered list", "celebrate" ),
   "base"	  	=> "tc_ordered_list",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
	array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "List Number Color", "celebrate" ),
		"param_name"	=> "color",
		"value"       	=> $celebrate_basic_colors,
	),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"	=> "content",
		"value"       	=> "",
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter list here. Use 'Ordred list' button from default WP editor. Refer help doc (Shortcodes Section) for more info.", "celebrate" )
	),
	),
) ); // Ordered list


// List with icon
vc_map( array(
   "name"     => esc_html__( "List with Icon", "celebrate" ),
   "base"     => "tc_list_icon",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
   	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "List Text", "celebrate" ),
		"param_name"  	=> "list_content",
		"value" 	  	=> "", 
		'admin_label'   => true,
	  	),
	array(
		'type' => 'dropdown',
		'heading' => __( 'Icon', 'celebrate' ),
		'param_name'  => 'icon_name',
		'value' => array(
		    __( 'No Icon', 'celebrate' )								=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		'description' => __( 'Select icon library.', 'celebrate' ),
		
	 ),
	 array(
		'type' => 'iconpicker',
		'heading' => __( 'Icon', 'celebrate' ),
		'param_name' => 'icon_fontawesome',
		'value' => 'fa fa-adjust',
		'settings' => array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' => array(
			'element' => 'icon_name',
			'value' => 'fontawesome',
		),
		'description' => __( 'Select icon from library.', 'celebrate' ),
	 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Icon color", "celebrate" ),
		 "param_name"  => "icon_color",
         "value"       => '',
         "description" => "Leave blank for same color as body font color.", 
		 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "List text color", "celebrate" ),
         "param_name"  => "color",
         "value"       => '', 
         "description" => "Leave blank for same color as body font color",
		 ),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Font Size", "celebrate" ),
		"param_name"  => "size",
		"value"      => '',
		"description" => esc_html__( "Give it as : 20px. Leave blank for same as body font size.", "celebrate" )
	  	),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Enable border bottom", "celebrate" ),
		"param_name"  => "list_border",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Border color", "celebrate" ),
		 "param_name"  => "border_color",
         "value"       => '',
		 "dependency"  => array( "element" => "list_border", "not_empty" => true ),
         "description" => "Leave blank for default.", 
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) ); // List with icon

// Icon Feature
vc_map( array(
   "name"     	=> esc_html__( "Icon Feature", "celebrate" ),
   "base"	  	=> "tc_icon_feature",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Feature Heading", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"  	=> "heading",
		"value" 	  	=> "", 
		'admin_label' 	=> true,
		"description"	=> '',
	  	),
	array(
		'type' => 'dropdown',
		'heading' => __( 'Icon', 'celebrate' ),
		'param_name'  => 'icon_name',
		'value' => array(
		    __( 'No Icon', 'celebrate' )								=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		"group" 	 	=> esc_html__( "General", 'celebrate' ),
		'description' => __( 'Select icon library.', 'celebrate' ),
		
	 ),
	 array(
		'type' => 'iconpicker',
		'heading' => __( 'Icon', 'celebrate' ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		'param_name' => 'icon_fontawesome',
		'value' => 'fa fa-adjust',
		'settings' => array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' => array(
			'element' => 'icon_name',
			'value' => 'fontawesome',
		),
		'description' => __( 'Select icon from library.', 'celebrate' ),
	 ),
    array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Icon Position", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "feature_style",
		"value"       	=> array (
			esc_html__( "Top", "celebrate" )	=> "feature_icon_top", 
			esc_html__( "Left", "celebrate" )	=> "feature_icon_left", 
			esc_html__( "Right", "celebrate" )	=> "feature_icon_right", 
			),
		"description"	=> '',
		),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Feature Number", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"  	=> "number",
		"value" 	  	=> "", 
		'admin_label' 	=> true,
		"description"	=> '',
	  	),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Text Align", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "text_align",
		"value"       	=> array (
			esc_html__( "Center", "celebrate" )		=> "text-center", 
			esc_html__( "Left", "celebrate" )		=> "text-left", 
			esc_html__( "Right", "celebrate" )		=> "text-right", 
			),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Icon Style", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "feature_icon_style",
		"value"       	=> array (
			esc_html__( "Icon with No background", "celebrate" )		=> "feature_icon_simple", 
			esc_html__( "Icon with Circle background", "celebrate" )	=> "feature_icon_circle", 
			esc_html__( "Icon with Square background", "celebrate" )	=> "feature_icon_square", 
			),
		"description"	=> '',
		),	
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Icon Size", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"  	=> "icon_size",
		"dependency"  	=> array( "element" => "feature_icon_style", "value" => "feature_icon_simple" ),
		"value" 	  	=> "",
		"description"	=> esc_html__( "No need of unit. It will be in px. Leave blank for theme default.", "celebrate" ),
	  	),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Icon Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "icon_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Icon Background Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "icon_bg",
		 "dependency"  	=> array( "element" => "feature_icon_style", "value" => array( "feature_icon_circle", "feature_icon_square" ) ),
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Icon Border Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "icon_border",
		 "value" 	   	=> '', 
		 "dependency"  	=> array( "element" => "feature_icon_style", "value" => array( "feature_icon_circle", "feature_icon_square" ) ),
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Heading Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "heading_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Number Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "number_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Text color", "celebrate" ),
		 "group" 	   => esc_html__( "General", 'celebrate' ),
         "param_name"  => "color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",  
		 ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Wrap feature with a border", "celebrate" ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"param_name"  => "box",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Border Width", "celebrate" ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"param_name"  => "border_width",
		"dependency"  => array( "element" => "box", "not_empty" => true ),
		"value"       => "",
		"description" => esc_html__( "Example (top / right / bottom / left): 2px 2px 2px 2px", "celebrate" )
		),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Border Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "border_color",
		 "value" 	   	=> '', 
		 "dependency"   => array( "element" => "box", "not_empty" => true ),
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Link type", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "link_type",
		"value"       	=> array (
			esc_html__( "None", "celebrate" )						=> "none", 
			esc_html__( "Button below text", "celebrate" )			=> "link_btn", 
			esc_html__( "Wrap feature in a link", "celebrate" )	=> "link_wrap", 
		),
	  ),
	 array(
		   "type"         	=> "textfield",
		   "heading"      	=> esc_html__( "Button Text", "celebrate" ),
		   "group" 	     	=> esc_html__( "Link", 'celebrate' ),
		   "param_name"   	=> "btn_text",
		   "value"        	=> "Link",
		   "dependency"   	=> array( "element" => "link_type", "value" => "link_btn" ),
		   'description'	=> esc_html__( 'Leave this field blank for Icon Only button', 'celebrate' )
	  ),
	array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Style", "celebrate" ),
	    "group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_style",
		"value"       	=> array (
			 esc_html__( "Classic", "celebrate" )	=> "classic", 
			 esc_html__( "Outline", "celebrate" )	=> "outline",
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Shape", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_shape",
		"value"       	=> array (
			 esc_html__( "Square", "celebrate" )			=> "square",
			 esc_html__( "Round", "celebrate" )				=> "round",
			 esc_html__( "Rounded Corners", "celebrate" )	=> "rounded", 
			   
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Size", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_size",
		"value"       	=> array (
			 esc_html__( "Medium", "celebrate" )	=> "medium", 
			 esc_html__( "Big", "celebrate" )		=> "big", 
			 esc_html__( "Small", "celebrate" )	=> "small", 
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Color", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_color",
		"value"       	=> $celebrate_buttons,
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
		),
	array(
		'type' => 'dropdown',
		'heading' => __( 'Icon', 'celebrate' ),
		'param_name'  => 'btn_icon_name',
		'value' => array(
		    __( 'No Icon', 'celebrate' )								=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		"dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
		"group" 	     	=> esc_html__( "Link", 'celebrate' ),
		'description' => __( 'Select icon library.', 'celebrate' ),
		
	 ),
	 array(
		'type' => 'iconpicker',
		'heading' => __( 'Icon', 'celebrate' ),
		"group" 	  => esc_html__( "Link", 'celebrate' ),
		'param_name' => 'btn_icon_fontawesome',
		'value' => 'fa fa-adjust',
		'settings' => array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' => array(
			'element' => 'btn_icon_name',
			'value' => 'fontawesome',
		),
		'description' => __( 'Select icon from library.', 'celebrate' ),
	 ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Icon Position", "celebrate" ),
		   "group" 	     	=> esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_icon_position",
		"value"       	=> array (
			 esc_html__( "Default - Left", "celebrate" )	=> "icon-left", 
			 esc_html__( "Right", "celebrate" )				=> "icon-right", 
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
   	 array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button URL", "celebrate" ),
		   "group" 	 	  => esc_html__( "Link", 'celebrate' ),
		   "param_name"   => "url",
		   "value"        => "",
		   'admin_label'  => true,
		   "description"  => "",
	  ),
	array(
		"type"        => "dropdown",
		"class"       => "",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"group" 	  => esc_html__( "Link", 'celebrate' ),
		"param_name"  => "target",
		"value"       => array (
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )	=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter your content.", "celebrate" )
		),
	),
) ); // Icon Feature

// Image Feature
vc_map( array(
   "name"     	=> esc_html__( "Image Feature", "celebrate" ),
   "base"	  	=> "tc_image_feature",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Feature Heading", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"  	=> "heading",
		"value" 	  	=> "", 
		'admin_label' 	=> true,
		"description"	=> '',
	  	),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Feature Number", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"  	=> "number",
		"value" 	  	=> "", 
		'admin_label' 	=> true,
		"description"	=> '',
	  	),
    array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image Position", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "feature_style",
		"value"       	=> array (
			esc_html__( "Top", "celebrate" )	=> "feature_icon_top", 
			esc_html__( "Left", "celebrate" )	=> "feature_icon_left", 
			esc_html__( "Right", "celebrate" )	=> "feature_icon_right", 
			),
		"description"	=> '',
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Text Align", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "text_align",
		"value"       	=> array (
			esc_html__( "Center", "celebrate" )		=> "text-center", 
			esc_html__( "Left", "celebrate" )		=> "text-left", 
			esc_html__( "Right", "celebrate" )		=> "text-right", 
			),
		),
    array(
		"type"        => "attach_image",
		"heading"     => esc_html__( "Select Image", "celebrate" ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"param_name"  => "image",
		"value" 	  => '', 
		"description" => esc_html__( "Select image from media library.", "celebrate" )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "size",
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )		=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Heading Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "heading_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Number Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "number_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Text color", "celebrate" ),
		 "group" 	   => esc_html__( "General", 'celebrate' ),
         "param_name"  => "color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",  
		 ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Wrap feature with a border", "celebrate" ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"param_name"  => "box",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Border Width", "celebrate" ),
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"param_name"  => "border_width",
		"dependency"  => array( "element" => "box", "not_empty" => true ),
		"value"       => "",
		"description" => esc_html__( "Example (top / right / bottom / left): 2px 2px 2px 2px", "celebrate" )
		),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Border Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "border_color",
		 "value" 	   	=> '', 
		 "dependency"   => array( "element" => "box", "not_empty" => true ),
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Link type", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "link_type",
		"value"       	=> array (
			esc_html__( "None", "celebrate" )						=> "none", 
			esc_html__( "Button below text", "celebrate" )			=> "link_btn", 
			esc_html__( "Wrap feature in a link", "celebrate" )		=> "link_wrap", 
		),
	  ),
	 array(
		   "type"         	=> "textfield",
		   "heading"      	=> esc_html__( "Button Text", "celebrate" ),
		   "group" 	     	=> esc_html__( "Link", 'celebrate' ),
		   "param_name"   	=> "btn_text",
		   "value"        	=> "Link",
		   "dependency"   	=> array( "element" => "link_type", "value" => "link_btn" ),
		   'description'	=> esc_html__( 'Leave this field blank for Icon Only button', 'celebrate' )
	  ),
	array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Style", "celebrate" ),
	    "group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_style",
		"value"       	=> array (
			 esc_html__( "Classic", "celebrate" )	=> "classic", 
			 esc_html__( "Outline", "celebrate" )	=> "outline",
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Shape", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_shape",
		"value"       	=> array (
			 esc_html__( "Square", "celebrate" )			=> "square",
			 esc_html__( "Round", "celebrate" )				=> "round",
			 esc_html__( "Rounded Corners", "celebrate" )	=> "rounded", 
			  
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Size", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_size",
		"value"       	=> array (
			 esc_html__( "Medium", "celebrate" )	=> "medium", 
			 esc_html__( "Big", "celebrate" )		=> "big", 
			 esc_html__( "Small", "celebrate" )	=> "small", 
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Color", "celebrate" ),
		"group" 	    => esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_color",
		"value"       	=> $celebrate_buttons,
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
		),
	array(
		'type' => 'dropdown',
		'heading' => __( 'Icon', 'celebrate' ),
		'param_name'  => 'btn_icon_name',
		'value' => array(
		    __( 'No Icon', 'celebrate' )								=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		"dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
		"group" 	     	=> esc_html__( "Link", 'celebrate' ),
		'description' => __( 'Select icon library.', 'celebrate' ),
		
	 ),
	 array(
		'type' => 'iconpicker',
		'heading' => __( 'Icon', 'celebrate' ),
		"group" 	  => esc_html__( "Link", 'celebrate' ),
		'param_name' => 'btn_icon_fontawesome',
		'value' => 'fa fa-adjust',
		'settings' => array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' => array(
			'element' => 'btn_icon_name',
			'value' => 'fontawesome',
		),
		'description' => __( 'Select icon from library.', 'celebrate' ),
	 ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Icon Position", "celebrate" ),
		   "group" 	     	=> esc_html__( "Link", 'celebrate' ),
		"param_name"	=> "btn_icon_position",
		"value"       	=> array (
			 esc_html__( "Default - Left", "celebrate" )	=> "icon-left", 
			 esc_html__( "Right", "celebrate" )				=> "icon-right", 
		),
		 "dependency"   => array( "element" => "link_type", "value" => "link_btn" ),
	  ),
   	 array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button URL", "celebrate" ),
		   "group" 	 	  => esc_html__( "Link", 'celebrate' ),
		   "param_name"   => "url",
		   "value"        => "",
		   'admin_label'  => true,
		   "description"  => "",
	  ),
	array(
		"type"        => "dropdown",
		"class"       => "",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"group" 	  => esc_html__( "Link", 'celebrate' ),
		"param_name"  => "target",
		"value"       => array (
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )	=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter your content.", "celebrate" )
		),
	),
) ); // Image Feature

// Icon Feature Styled
vc_map( array(
   "name"     	=> esc_html__( "Icon Feature - Styled", "celebrate" ),
   "base"	  	=> "tc_icon_feature_var",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Feature Heading", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"  	=> "heading",
		"value" 	  	=> "", 
		'admin_label' 	=> true,
		"description"	=> '',
	  	),
	array(
		'type' 			=> 'dropdown',
		'heading' 		=> __( 'Icon', 'celebrate' ),
		'param_name'	=> 'icon_name',
		'value' 		=> array(
		    __( 'No Icon', 'celebrate' )								=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		"group" 	 	=> esc_html__( "Content", 'celebrate' ),
		'description' 	=> __( 'Select icon library.', 'celebrate' ),
		
	 ),
	 array(
		'type' 			=> 'iconpicker',
		'heading' 		=> __( 'Icon', 'celebrate' ),
		"group" 	  	=> esc_html__( "Content", 'celebrate' ),
		'param_name'	=> 'icon_fontawesome',
		'value' 		=> 'fa fa-adjust',
		'settings' 		=> array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' 	=> array(
			'element'	=> 'icon_name',
			'value' 	=> 'fontawesome',
		),
		'description' 	=> __( 'Select icon from library.', 'celebrate' ),
	 ),
	array(
		"type"        => "attach_image",
		"heading"     => esc_html__( "Background Image", "celebrate" ),
		"param_name"  => "image",
		"value" 	  => '', 
		"description" => esc_html__( "Select image from media library.", "celebrate" ),
		"group" 	  => esc_html__( "Image", 'celebrate' ),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"group" 	    => esc_html__( "Image", 'celebrate' ),
		"param_name"	=> "size",
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )		=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),	
	array(
		"type"        	=> "checkbox",
		"heading"     	=> esc_html__( "Keep Feature Highlighted", "celebrate" ),
		"param_name"	=> "highlight",
		"group" 	 	=> esc_html__( "General", 'celebrate' ), 
		"value"       	=> array ( "Yes, please" => "yes" ),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Text Align", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "text_align",
		"value"       	=> array (
			esc_html__( "Center", "celebrate" )		=> "text-center", 
			esc_html__( "Left", "celebrate" )		=> "text-left", 
			esc_html__( "Right", "celebrate" )		=> "text-right", 
			),
		),	
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Background Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "bg_color",
		 "value" 	   	=> '', 
		 ),
	
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Icon Size", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"  	=> "icon_size",
		"value" 	  	=> "",
		"description"	=> esc_html__( "No need of unit. It will be in px. Leave blank for theme default.", "celebrate" ),
	  	),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Icon Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "icon_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Heading Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "heading_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Text color", "celebrate" ),
		 "group" 	   => esc_html__( "General", 'celebrate' ),
         "param_name"  => "color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",  
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	array(
		"type"        	=> "checkbox",
		"heading"     	=> esc_html__( "Hide - Link On Hover", "celebrate" ),
		"param_name"	=> "enable_link",
		  "group" 	 	=> esc_html__( "Link", 'celebrate' ),
		"value"       	=> array ( "Yes, please" => "yes" ),
		),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Link Background Color", "celebrate" ),
		 "group" 	    => esc_html__( "Link", 'celebrate' ),
		 "param_name"	=> "link_bg_color",
		 "value" 	   	=> '', 
		 ),
   	 array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button URL", "celebrate" ),
		   "group" 	 	  => esc_html__( "Link", 'celebrate' ),
		   "param_name"   => "url",
		   "value"        => "",
		   'admin_label'  => true,
		   "description"  => "",
	  ),
	array(
		"type"        => "dropdown",
		"class"       => "",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"group" 	  => esc_html__( "Link", 'celebrate' ),
		"param_name"  => "target",
		"value"       => array (
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )		=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter your content.", "celebrate" )
		),
	),
		
) ); // Icon Feature - Styled

// Icon Counter
vc_map( array(
   "name"     	=> esc_html__( "Counter", "celebrate" ),
   "base"	  	=> "tc_icon_counter",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Counting Style", "celebrate" ),
		"param_name"	=> "counting_style",
		"value"       	=> array (
			esc_html__( "Counter", "celebrate" )	=> "tc-counter", 
			esc_html__( "Static", "celebrate" )		=> "tc-static", 
			),
		"description"	=> '',
		),
   array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image or Icon", "celebrate" ),
		"param_name"	=> "image_type",
		"value"       	=> array (
			esc_html__( "Icon", "celebrate" )		=> "type_icon", 
			esc_html__( "Image", "celebrate" )		=> "type_img", 
			esc_html__( "None", "celebrate" )		=> "", 
			),
		"description"	=> '',
		),
   array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Style", "celebrate" ),
		"param_name"	=> "style",
		"value"       	=> array (
			esc_html__( "Icon / Image to Top", "celebrate" )	=> "tc-counter-top", 
			esc_html__( "Icon / Image to left", "celebrate" )	=> "tc-counter-left", 
			),
		"description"	=> '',
	),

   	array(
		"type"        => "attach_image",
		"heading"     => esc_html__( "Select Image", "celebrate" ),
		"param_name"  => "image",
		"dependency"  => array( "element" => "image_type", "value" => "type_img" ),
		"value" 	  => '', 
		"description" => esc_html__( "Select image from media library.", "celebrate" )
		),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Image Width", "celebrate" ),
		"param_name"  	=> "image_width",
		"dependency"  	=> array( "element" => "image_type", "value" => "type_img" ),
		"value" 	  	=> "", 
		"description"	=> esc_html__( "No need of unit. Leave blank for default.", "celebrate" ),
	  	),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Image Height", "celebrate" ),
		"param_name"  	=> "image_height",
		"dependency"  	=> array( "element" => "image_type", "value" => "type_img" ),
		"value" 	  	=> "", 
		"description"	=> esc_html__( "No need of unit. Leave blank for default.", "celebrate" ),
	  	),
	array(
		'type' => 'dropdown',
		'heading' => __( 'Select Icon', 'celebrate' ),
		'param_name'  => 'icon_name',
		'value' => array(
		    __( 'No Icon', 'celebrate' )								=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )		=> 'fontawesome',

		),
		"dependency"  	=> array( "element" => "image_type", "value" => "type_icon" ),
		'description' => __( 'Select icon library.', 'celebrate' ),
		
	 ),
	 array(
		'type' => 'iconpicker',
		'heading' => __( 'Icon', 'celebrate' ),
		'param_name' => 'icon_fontawesome',
		'value' => 'fa fa-adjust',
		'settings' => array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' => array(
			'element' => 'icon_name',
			'value' => 'fontawesome',
		),
		'description' => __( 'Select icon from library.', 'celebrate' ),
	 ),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Icon Color", "celebrate" ),
		"param_name"  => "icon_color",
		"value"       => '', 
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		"dependency"  	=> array( "element" => "image_type", "value" => "type_icon" ),
		 ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Icon with Background", "celebrate" ),
		"param_name"  => "icon_bg",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		"dependency"  	=> array( "element" => "image_type", "value" => "type_icon" ),
		),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Icon Background Color", "celebrate" ),
		"param_name"  => "icon_bgcolor",
		"value"       => '', 
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		"dependency"  => array( "element" => "icon_bg", "not_empty" => true ),
		 ),
   	array(
		"type"         => "textfield",
		"heading"      => esc_html__( "Number", "celebrate" ),
		"param_name"   => "heading",
		"value"        => "",
		'admin_label'  => true,
		"description"  => "",
	  ),
	array(
	   "type"         => "textfield",
	   "heading"      => esc_html__( "Text", "celebrate" ),
	   "param_name"   => "subtext",
	   "value"        => "",
	   'admin_label'  => true,
	  ),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Text Color", "celebrate" ),
		"param_name"  => "heading_color",
		"value"       => '', 
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	),
) ); // Icon Counter

// Counter - Variation
vc_map( array(
   "name"     	=> esc_html__( "Counter - Variation", "celebrate" ),
   "base"	  	=> "tc_icon_counter_var",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Counting Style", "celebrate" ),
		"param_name"	=> "counting_style",
		"value"       	=> array (
			esc_html__( "Counter", "celebrate" )	=> "tc-counter", 
			esc_html__( "Static", "celebrate" )		=> "tc-static", 
			),
		"description"	=> '',
		),
	array(
		"type"         => "textfield",
		"heading"      => esc_html__( "Number", "celebrate" ),
		"param_name"   => "number",
		"value"        => "",
		'admin_label'  => true,
		"description"  => "",
	  ),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Number Color", "celebrate" ),
		"param_name"  => "number_color",
		"value"       => '', 
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Number Background Color", "celebrate" ),
		"param_name"  => "bgcolor",
		"value"       => '', 
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
	   "type"         => "textfield",
	   "heading"      => esc_html__( "Heading", "celebrate" ),
	   "param_name"   => "heading",
	   "value"        => "",
	   'admin_label'  => true,
	  ),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Heading Color", "celebrate" ),
		"param_name"  => "heading_color",
		"value"       => '', 
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	),
) ); // Counter - Variation

// Single Image with Caption
vc_map( array(
   "name"     	=> esc_html__( "Single Image with Caption", "celebrate" ),
   "base"	  	=> "tc_single_image",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   	array(
		"type"        => "attach_image",
		"heading"     => esc_html__( "Select Image", "celebrate" ),
		"param_name"  => "image",
		"value" 	  => '', 
		"description" => esc_html__( "Select image from media library.", "celebrate" )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )		=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "No Image Scale on Hover", "celebrate" ),
		"param_name"  => "scale",
		"value"       => array ( "Yes, please" => "yes" ),
	),
	array(
		"type"        => "checkbox",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Hide zoom Icon on Hover", "celebrate" ),
		"param_name"  => "hide_zoom",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Hide Caption", "celebrate" ),
		"param_name"  => "hide_caption",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	),
) ); // Single Image with Caption

// Recent Posts Carousel
vc_map( array(
   "name"     => esc_html__( "Recent Posts", "celebrate" ),
   "base"     => "tc_recent_post",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
   	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Number of Posts to Show in Carousel", "celebrate" ),
		"param_name"  => "limit",
		"value"       => "",
		'description' => esc_html__( 'Fill in the number. Ex - 5. This number is number of recent posts those rotate in carousel, not the number of columns. Recent Posts Carousel is 2 column.', 'celebrate' ),
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Filter by Category", "celebrate" ),
		"param_name"  => "cat",
		"value"       => '',
		'admin_label'   => true,
		"description" => "Filter output by posts categories, enter category names here. Separate with commas.",
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Sort Posts By", "celebrate" ),
		"param_name"  => "orderby",
		"value"       => array ( 
			esc_html__( "Date", "celebrate" )   => "date", 
			esc_html__( "Random", "celebrate" ) => "rand", 
			esc_html__( "Author", "celebrate" ) => "author", 
			esc_html__( "Title", "celebrate" )  => "title", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Arrange Sorted Posts", "celebrate" ),
		"param_name"  => "order",
		"value"       => array ( 
			esc_html__( "Descending", "celebrate" )	=> "DESC", 
			esc_html__( "Ascending", "celebrate" )		=> "ASC", 
		 ),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Image Size", "celebrate" ),
		"param_name"  => "image_size",
		"value"       => array ( 
			esc_html__( "Full", "celebrate" )   		=> "full", 
			esc_html__( "Medium", "celebrate" ) 		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Image", "celebrate" ),
		"param_name"  => "image",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Hover /  Link On Hover", "celebrate" ),
		"param_name"  => "hover",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Title", "celebrate" ),
		"param_name"  => "title",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Date", "celebrate" ),
		"param_name"  => "date",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Category", "celebrate" ),
		"param_name"  => "category",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Comments", "celebrate" ),
		"param_name"  => "comments",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Post Excerpt", "celebrate" ),
		"param_name"  => "excerpt",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Navigation Type", "celebrate"),
		"param_name" 	=> "nav_controls",
		"value"       	=> array (
			esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
			esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
		),
		"description"   => "",
	   ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) ); // Recent Posts Carousel

// Recent Posts Carousel Variation
vc_map( array(
   "name"     => esc_html__( "Recent Posts - Variation", "celebrate" ),
   "base"     => "tc_recent_post_var",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
   	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Number of Posts to Show in Carousel", "celebrate" ),
		"param_name"  => "limit",
		"value"       => "",
		'description' => esc_html__( 'Fill in the number. Ex - 5. This number is number of recent posts those rotate in carousel, not the number of columns. Recent Posts Carousel is 2 column.', 'celebrate' ),
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Filter by Category", "celebrate" ),
		"param_name"  => "cat",
		"value"       => '',
		'admin_label'   => true,
		"description" => "Filter output by posts categories, enter category names here. Separate with commas.",
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Sort Posts By", "celebrate" ),
		"param_name"  => "orderby",
		"value"       => array ( 
			esc_html__( "Date", "celebrate" )   => "date", 
			esc_html__( "Random", "celebrate" ) => "rand", 
			esc_html__( "Author", "celebrate" ) => "author", 
			esc_html__( "Title", "celebrate" )  => "title", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Arrange Sorted Posts", "celebrate" ),
		"param_name"  => "order",
		"value"       => array ( 
			esc_html__( "Descending", "celebrate" )	=> "DESC", 
			esc_html__( "Ascending", "celebrate" )	=> "ASC", 
		 ),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Image Size", "celebrate" ),
		"param_name"  => "image_size",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( 
			esc_html__( "Full", "celebrate" )   		=> "full", 
			esc_html__( "Medium", "celebrate" ) 		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )		=> "thumbnail", 
			),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Enable hard cropping", "celebrate" ),
		"param_name"  => "hard_crop",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => esc_html__( "", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Width", "celebrate" ),
		"param_name"  => "img_width",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 600. Make sure all images to be displayed are of more width than hard cropping width given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Height", "celebrate" ),
		"param_name"  => "img_height",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 400. Make sure all images to be displayed are of more height than hard cropping height given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Date", "celebrate" ),
		"param_name"  => "date",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Navigation Type", "celebrate"),
		"param_name" 	=> "nav_controls",
		"value"       	=> array (
			esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
			esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
		),
		"description"   => "",
	   ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) ); // Recent Posts Carousel Variation

// Gallery Grid
vc_map( array(
   "name"     => esc_html__( "Image Gallery Grid", "celebrate" ),
   "base"     => "tc_gallery_grid",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
	array(
		"type"        => "dropdown",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Number of columns", "celebrate" ),
		"param_name"  => "column",
		"value"       => array (
			esc_html__( "Three Columns", "celebrate" )	=> "column_three", 
			esc_html__( "Two Columns", "celebrate" )	=> "column_two", 
			esc_html__( "Four Columns", "celebrate" )	=> "column_four", 
			),
		"description" => '',
		),
    array(
		"type"        => "dropdown",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Gallery Grid Items Display", "celebrate" ),
		"param_name"  => "gap",
		"value"       => array (
			esc_html__( "Compact", "celebrate" )	=> "compact", 
			esc_html__( "With Gaps", "celebrate" )	=> "default", 
			),
		"description" => '',
		),
	array(
		"type"        => "attach_images",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Gallery Images", "celebrate" ),
		"param_name"  => "images",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value" 	  => '', 
		"description" => esc_html__( "Select images from media library.", "celebrate" )
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "No Image Scale on Hover", "celebrate" ),
		"param_name"  => "scale",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
	),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"group" 	    => esc_html__( "Image Settings", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )		=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		"type"        => "checkbox",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Enable hard cropping", "celebrate" ),
		"param_name"  => "hard_crop",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => esc_html__( "", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Width", "celebrate" ),
		"param_name"  => "img_width",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 600. Make sure all images to be displayed are of more width than hard cropping width given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Height", "celebrate" ),
		"param_name"  => "img_height",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 400. Make sure all images to be displayed are of more height than hard cropping height given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "checkbox",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Hide zoom Icon on Hover", "celebrate" ),
		"param_name"  => "hide_zoom",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        	=> "textfield",
		"holder"      	=> "div",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Group these images in a separate gallery", "celebrate" ),
		"group" 	    => esc_html__( "Image Gallery", 'celebrate' ),
		"param_name"  	=> "gallery_id",
		"value" 	  	=> "", 
		"description"	=> esc_html__( "Provide unique ID here. Ex. gallery-1 / gallery-2", "celebrate" )
	  	),
	),
) ); // Gallery Grid

// Portfolio Carousel
vc_map( array(
   "name"     => esc_html__( "Portfolio Carousel", "celebrate" ),
   "base"     => "tc_portfolio_carousel",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Number of posts to show in carousel", "celebrate" ),
		"param_name"  => "limit",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => "",
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "No Image Scale on Hover", "celebrate" ),
		"param_name"  => "scale",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
	),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"group" 	    => esc_html__( "Image Settings", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )			=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Enable hard cropping", "celebrate" ),
		"param_name"  => "hard_crop",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description"=> esc_html__( "", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Width", "celebrate" ),
		"param_name"  => "img_width",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 600. Make sure all images to be displayed are of more width than hard cropping width given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Height", "celebrate" ),
		"param_name"  => "img_height",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 400. Make sure all images to be displayed are of more height than hard cropping height given above, otherwise those will not be displayed.", "celebrate" )
		),
	 array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Posts to Show", "celebrate" ),
		"param_name"  => "portfolio_type",
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => array (
			esc_html__( "Posts from all categories", "celebrate" )				=> "with_filter", 
			esc_html__( "Show posts from selected categories", "celebrate" )	=> "without_filter",  
			),
		"description" => '',
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Filter by Category", "celebrate" ),
		"param_name"  => "tax",
		"dependency"  	=> array( "element" => "portfolio_type", "value" => "without_filter" ),
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => '',
		"description" => esc_html__( 'Enter --- CATEGORY SLUG --- here. Separate with commas. Find category slug here : Portfolio Items > Portfolio Categories. This will help to group portfolio items from selected categories in grid. Make sure to remove slug from here if you are using filter portfolio type.', 'celebrate' ),
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Sort Posts By", "celebrate" ),
		"param_name"  => "orderby",
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => array (
			esc_html__( "Date", "celebrate" )   	=> "date", 
			esc_html__( "Random", "celebrate" )	=> "rand", 
			esc_html__( "Title", "celebrate" )  	=> "title", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Arrange Sorted Posts", "celebrate" ),
		"param_name"  => "order",
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => array ( 
			esc_html__( "Descending", "celebrate" )	=> "DESC", 
			esc_html__( "Ascending", "celebrate" )		=> "ASC", 
		),
		"description" => '',
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Text Align", "celebrate" ),
		"param_name"	=> "text_align",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Left", "celebrate" )	=> "text-left", 
			esc_html__( "Center", "celebrate" )	=> "text-center", 
			esc_html__( "Right", "celebrate" )	=> "text-right", 
			),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Heading on Hover", "celebrate" ),
		"param_name"  => "hover_heading",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Category on Hover", "celebrate" ),
		"param_name"  => "show_category",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	 array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide link Icon on Hover", "celebrate" ),
		"param_name"  => "hide_link",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide zoom Icon on Hover", "celebrate" ),
		"param_name"  => "hide_zoom",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	 array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Hover Completely", "celebrate" ),
		"param_name"  => "hide_hover",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Heading below Image", "celebrate" ),
		"param_name"  => "heading",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Show Excerpt", "celebrate" ),
		"param_name"  => "excerpt",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Link to Heading", "celebrate" ),
		"param_name"  => "link_heading",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"param_name"  => "target",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( 
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )	=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Navigation Type", "celebrate"),
		"param_name" 	=> "nav_controls",
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
			esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
		),
		"description"   => "",
	   ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) ); // portfolio carousel

// Portfolio Grid
vc_map( array(
   "name"     => esc_html__( "Portfolio Grid", "celebrate" ),
   "base"     => "tc_portfolio_grid",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => esc_html__( 'Content', 'celebrate' ),
   "params"   => array(
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Number of posts to show in grid", "celebrate" ),
		"param_name"  => "limit",
		"value"       => "",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"description" => '',
		),
   array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Number of columns", "celebrate" ),
		"param_name"  => "column",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array (
			esc_html__( "Three Columns", "celebrate" )	=> "column_three", 
			esc_html__( "Four Columns", "celebrate" )	=> "column_four", 
			),
		"description" => '',
		),
  array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Portfolio Grid Items Display", "celebrate" ),
		"param_name"  => "gap",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array (
			esc_html__( "Compact", "celebrate" )	=> "compact", 
			esc_html__( "With Gaps", "celebrate" )	=> "default", 
			),
		"description" => '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "No Image Scale on Hover", "celebrate" ),
		"param_name"  => "scale",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
	),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"group" 	    => esc_html__( "Image Settings", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )		=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Enable hard cropping", "celebrate" ),
		"param_name"  => "hard_crop",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => esc_html__( "", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Width", "celebrate" ),
		"param_name"  => "img_width",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 600. Make sure all images to be displayed are of more width than hard cropping width given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Height", "celebrate" ),
		"param_name"  => "img_height",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 400. Make sure all images to be displayed are of more height than hard cropping height given above, otherwise those will not be displayed.", "celebrate" )
		),
	 array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Type of portfolio", "celebrate" ),
		"param_name"  => "portfolio_type",
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => array (
			esc_html__( "Portfolio with filter (Posts from all categories)", "celebrate" )							=> "with_filter", 
			esc_html__( "Portfolio without filter (Option to show posts from selected categories)", "celebrate" )	=> "without_filter",  
			),
		"description" => '',
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Filter by Category", "celebrate" ),
		"param_name"  => "tax",
		"dependency"  => array( "element" => "portfolio_type", "value" => "without_filter" ),
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => '',
		"description" => esc_html__( 'Enter --- CATEGORY SLUG --- here. Separate with commas. Find category slug here : Portfolio Items > Portfolio Categories. This will help to group portfolio items from selected categories in grid. Make sure to remove slug from here if you are using filter portfolio type.', 'celebrate' ),
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Sort Posts By", "celebrate" ),
		"param_name"  => "orderby",
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => array (
			esc_html__( "Date", "celebrate" )   	=> "date", 
			esc_html__( "Random", "celebrate" )		=> "rand", 
			esc_html__( "Title", "celebrate" )  	=> "title", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Arrange Sorted Posts", "celebrate" ),
		"param_name"  => "order",
		"group" 	  => esc_html__( "Posts", 'celebrate' ),
		"value"       => array ( 
			esc_html__( "Descending", "celebrate" )	=> "DESC", 
			esc_html__( "Ascending", "celebrate" )	=> "ASC", 
		),
		"description" => '',
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Text Align", "celebrate" ),
		"param_name"	=> "text_align",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Left", "celebrate" )	=> "text-left", 
			esc_html__( "Center", "celebrate" )	=> "text-center", 
			esc_html__( "Right", "celebrate" )	=> "text-right", 
			),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Heading on Hover", "celebrate" ),
		"param_name"  => "hover_heading",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Category on Hover", "celebrate" ),
		"param_name"  => "show_category",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	 array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide link Icon on Hover", "celebrate" ),
		"param_name"  => "hide_link",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide zoom Icon on Hover", "celebrate" ),
		"param_name"  => "hide_zoom",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	 array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Hover Completely", "celebrate" ),
		"param_name"  => "hide_hover",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => esc_html__( "This will give extra flexibility to link image to item details / external page.", "celebrate" )
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Heading below Image", "celebrate" ),
		"param_name"  => "heading",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Show Excerpt", "celebrate" ),
		"param_name"  => "excerpt",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => "",
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "No Link to Heading", "celebrate" ),
		"param_name"  => "link_heading",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"param_name"  => "target",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( 
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )		=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		"group" 	    => esc_html__( "General", 'celebrate' ),
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) ); // Portfolio Grid

// Testimonial
vc_map( array(
   "name"		=> esc_html__( "Testimonial", "celebrate" ),
   "base"		=> "tc_testimonial",
   "class"		=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"		=> array(
   	 array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Testimonial Style", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "style",
		"value"       	=> array (
			esc_html__( "Testimonial Default", 'celebrate' )	=> "tc-testimonial-default", 
			esc_html__( "Testimonial Boxed", 'celebrate' )		=> "tc-testimonial-box",
		),
	  ),
	 array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Disable Rating", "celebrate" ),
		"param_name"  => "show_rating",
		"group" 	  => esc_html__( "General", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		),
	 array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Box Background color", "celebrate" ),
		 "group" 	   => esc_html__( "General", 'celebrate' ),
         "param_name"  => "bg_color",
		 "dependency"  => array( "element" => "style", "value" => "tc-testimonial-box" ),
         "value"       => '', 
         "description" => "Leave blank for theme default.",  
		 ),
	 array(
	   "type"         => "textfield",
	   "heading"      => esc_html__( "Text Size", "celebrate" ),
	   "group" 	      => esc_html__( "Typography", 'celebrate' ),
	   "param_name"   => "size",
	   "value"        => "",
	   "description"  => "Provide unit, like px. Leave blank for theme default.",  
	  ),
	 array(
	   "type"         => "textfield",
	   "heading"      => esc_html__( "Line Height", "celebrate" ),
	   "group" 	      => esc_html__( "Typography", 'celebrate' ),
	   "param_name"   => "line_height",
	   "value"        => "",
	   "description"  => "Provide unit, like px. Leave blank for theme default.",  
	  ),
   	 array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Text color", "celebrate" ),
		 "group" 	   => esc_html__( "Typography", 'celebrate' ),
         "param_name"  => "color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",  
		 ),
	 array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Quote Icon color", "celebrate" ),
		 "group" 	   => esc_html__( "Typography", 'celebrate' ), 
         "param_name"  => "icon_color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",
		 "dependency"  => array( "element" => "style", "value" => "tc-testimonial-default" ),
		 ),
	 array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Testimonial Tagline color", "celebrate" ),
		 "group" 	   => esc_html__( "Typography", 'celebrate' ), 
         "param_name"  => "tagline_color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",
		 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Client Name color", "celebrate" ),
		 "group" 	   => esc_html__( "Typography", 'celebrate' ), 
         "param_name"  => "name_color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",
		 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Job Name color", "celebrate" ),
		 "group" 	   => esc_html__( "Typography", 'celebrate' ), 
         "param_name"  => "job_color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",
		 ),
   	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Number of Testimonial to Show in Carousel", "celebrate" ),
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"param_name"  => "limit",
		"value"       => "",
		'admin_label' => true,
		"description" => esc_html__( 'Fill in the number. Ex - 4. This number is number of testimonials those rotate in carousel, not the number of columns. Testimonial Carousel is single column.', 'celebrate' ),
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Number of columns", "celebrate" ),
		"param_name"  => "column",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => array (
			esc_html__( "Single Column", "celebrate" )	=> "column_one", 
			esc_html__( "Two Columns", "celebrate" )	=> "column_two", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Sort Testimonials By", "celebrate" ),
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"param_name"  => "orderby",
		"value"       => array ( 
			"Date"   => "date", 
			"Random" => "rand", 
			"Title"  => "title", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Arrange Sorted Testimonials", "celebrate" ),
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"param_name"  => "order",
		"value"       => array ( 
			esc_html__( "Descending", "celebrate" )	=> "DESC", 
			esc_html__( "Ascending", "celebrate" )		=> "ASC", 
		 ),
		"description" => '',
		),
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Navigation Type", "celebrate"),
		"param_name" 	=> "nav_controls",
		"group" 	    => esc_html__( "Carousel", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
			esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
		),
		"description"   => "",
	   ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Disable Carousel in case you need to show single selected testimonial. In this case settings done under carousel tab will not work.", "celebrate" ),
		"group" 	  => esc_html__( "Single Selected Testimonial", 'celebrate' ),
		"param_name"  => "carousel",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "ID of Testimonial to Show", "celebrate" ),
		"group" 	  => esc_html__( "Single Selected Testimonial", 'celebrate' ),
		"param_name"  => "id",
		"value"       => '',
		'admin_label' => true,
		"dependency"  => array( "element" => "carousel", "not_empty" => true ),
		'description' => esc_html__( 'Refer help document - for how to get ID. Keep Testimonial ID field blank if carousel is being used.', 'celebrate' )
		),
	)
) ); // End Testimonial

// Team member - Style 1 
vc_map( array(
   "name"              => esc_html__( "Team - Style 1", "celebrate" ),
   "base"              => "tc_team",
   "class"             => "",
   "icon"	  		   => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"		   => esc_html__( 'Content', 'celebrate' ),
   "params"            => array(
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Member Image Type", "celebrate"),
		"param_name" 	=> "image_type",
		"value"       	=> array (
			esc_html__( "Default - Sqaure", "celebrate" )	=> "", 
			esc_html__( "Circle", "celebrate" )				=> "tc-member-image-circle", 
		),
		"description"   => "",
	   ),	
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Text Align", "celebrate" ),
		"param_name"	=> "text_align",
		"value"       	=> array (
			esc_html__( "Left", "celebrate" )	=> "text-left", 
			esc_html__( "Center", "celebrate" )	=> "text-center", 
			esc_html__( "Right", "celebrate" )	=> "text-right", 
			),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Extra Member Info", "celebrate" ),
		"param_name"  => "show_info",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
		
   array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Excerpt", "celebrate" ),
		"param_name"  => "excerpt",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Social Style", "celebrate" ),
		"param_name"	=> "social_style",
		"value"       	=> array (
			esc_html__( "On Hover", "celebrate" )			=> "tc-social-onhover", 
			esc_html__( "Below Content", "celebrate" )		=> "tc-social-below", 
			esc_html__( "None - Hide Social", "celebrate" )	=> "tc-social-none", 
			),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Social Hover Style", "celebrate" ),
		"param_name"	=> "social_hover",
		"value"       	=> array (
			esc_html__( "No Background - Small Size Icon", "celebrate" )	=> "tc-social-default tc-social-mini", 
			esc_html__( "No Background - Big Icon", "celebrate" )			=> "tc-social-default", 
			esc_html__( "Square Background", "celebrate" )					=> "tc-social-square", 
			esc_html__( "Circle Background", "celebrate" )					=> "tc-social-circle", 
			),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Social Color Style", "celebrate" ),
		"param_name"	=> "social_color",
		"dependency" 	=> array( "element" => "social_style", "value" => "tc-social-below" ),
		"value"       	=> array (
			esc_html__( "Default / Dark - For Light Backgrounds", "celebrate" )	=> "tc-social-dark", 
			esc_html__( "Light - For Dark Backgrounds", "celebrate" )			=> "tc-social-light", 
			),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Link Icon on Hover", "celebrate" ),
		"param_name"  => "image_link",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),	
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Do not link heading to member details page", "celebrate" ),
		"param_name"  => "heading_link",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"param_name"  => "target",
		"value"       => array ( 
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )		=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Make it Boxed", "celebrate" ),
		"param_name"  => "box",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Box Background Color", "celebrate" ),
		"param_name"  => "box_bg",
		"value"       => '', 
		"dependency"  => array( "element" => "box", "not_empty" => true ),
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Box Border Color", "celebrate" ),
		"param_name"  => "border_color",
		"value"       => '', 
		"dependency"  => array( "element" => "box", "not_empty" => true ),
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	 array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Number of Team Members to show in carousel", "celebrate" ),
		"param_name"  => "limit",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => "",
		"description" =>  wp_kses( __('This is a number of team members to show in carousel, not number of columns for carousel. Carousel displays 3 items at a time.<br> In case you need team members in custom number of columns skip carousel and opt for - Single Selected Team Member', 'celebrate'), array( 'br' => array(), ) ),
		),
	 array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Members to Show", "celebrate" ),
		"param_name"  => "portfolio_type",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => array (
			esc_html__( "Members from all categories", "celebrate" )			=> "with_filter", 
			esc_html__( "Show Members from selected categories", "celebrate" )	=> "without_filter",  
			),
		"description" => '',
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Filter by Category", "celebrate" ),
		"param_name"  => "tax",
		"dependency"  => array( "element" => "portfolio_type", "value" => "without_filter" ),
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => '',
		"description" => esc_html__( 'Enter --- CATEGORY SLUG --- here. Separate with commas. Find category slug here : Team > Team Categories. This will help to group team items from selected categories. Make sure to remove slug from here if you are using filter portfolio type.', 'celebrate' ),
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Sort Members By", "celebrate" ),
		"param_name"  => "orderby",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => array (
			esc_html__( "Date", "celebrate" )   => "date", 
			esc_html__( "Random", "celebrate" )	=> "rand", 
			esc_html__( "Title", "celebrate" )  => "title", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Arrange Sorted Members", "celebrate" ),
		"param_name"  => "order",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => array ( 
			esc_html__( "Descending", "celebrate" )	=> "DESC", 
			esc_html__( "Ascending", "celebrate" )	=> "ASC", 
		),
		"description" => '',
		),	
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Navigation Type", "celebrate"),
		"param_name" 	=> "nav_controls",
		"group" 	    => esc_html__( "Carousel", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
			esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
		),
		"description"   => "",
	   ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Disable Carousel in case you need to show single selected team member. In this case settings done under carousel tab will not work.", "celebrate" ),
		"group" 	  => esc_html__( "Single Selected Team Member", 'celebrate' ),
		"param_name"  => "carousel",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "ID of Team Member to Show", "celebrate" ),
		"group" 	  => esc_html__( "Single Selected Team Member", 'celebrate' ),
		"param_name"  => "id",
		"value"       => '',
		'admin_label' => true,
		"dependency"  => array( "element" => "carousel", "not_empty" => true ),
		'description' => esc_html__( 'Refer help document - for how to get ID. Keep Team ID field blank if carousel is being used.', 'celebrate' )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Predefined Typography Style", "celebrate" ),
		"group" 	    => esc_html__( "Typography", 'celebrate' ),
		"param_name"	=> "typography",
		"value"       	=> array (
			esc_html__( "Default", 'celebrate' )						=> "typo_default", 
			esc_html__( "Alt ( For Dark Backgrounds )", 'celebrate' )	=> "typo_alt",
		),
		"description" => esc_html__( 'In theme, Alt style is set for dark backgrounds. Refer - Typography - section of Theme Options.', 'celebrate' ),
	  ),
	)
) ); // Team member - Style 1 

// Team member - Style 2 
vc_map( array(
   "name"              => esc_html__( "Team - Style 2", "celebrate" ),
   "base"              => "tc_team_two_col",
   "class"             => "",
   "icon"	  		   => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"		   => esc_html__( 'Content', 'celebrate' ),
   "params"            => array(
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Member Image Type", "celebrate"),
		"param_name" 	=> "image_type",
		"value"       	=> array (
			esc_html__( "Default - Sqaure", "celebrate" )	=> "", 
			esc_html__( "Circle", "celebrate" )				=> "tc-member-image-circle", 
		),
		"description"   => "",
	   ),	
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Text Align", "celebrate" ),
		"param_name"	=> "text_align",
		"value"       	=> array (
			esc_html__( "Left", "celebrate" )	=> "text-left", 
			esc_html__( "Center", "celebrate" )	=> "text-center", 
			esc_html__( "Right", "celebrate" )	=> "text-right", 
			),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Extra Member Info", "celebrate" ),
		"param_name"  => "show_info",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
		
   array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Excerpt", "celebrate" ),
		"param_name"  => "excerpt",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Social Style", "celebrate" ),
		"param_name"	=> "social_style",
		"value"       	=> array (
			esc_html__( "On Hover", "celebrate" )			=> "tc-social-onhover", 
			esc_html__( "Below Content", "celebrate" )		=> "tc-social-below", 
			esc_html__( "None - Hide Social", "celebrate" )	=> "tc-social-none", 
			),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Social Hover Style", "celebrate" ),
		"param_name"	=> "social_hover",
		"value"       	=> array (
			esc_html__( "No Background - Small Size Icon", "celebrate" )	=> "tc-social-default tc-social-mini", 
			esc_html__( "No Background - Big Icon", "celebrate" )			=> "tc-social-default", 
			esc_html__( "Square Background", "celebrate" )					=> "tc-social-square", 
			esc_html__( "Circle Background", "celebrate" )					=> "tc-social-circle", 
			),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Social Color Style", "celebrate" ),
		"param_name"	=> "social_color",
		"dependency" 	=> array( "element" => "social_style", "value" => "tc-social-below" ),
		"value"       	=> array (
			esc_html__( "Default / Dark - For Light Backgrounds", "celebrate" )	=> "tc-social-dark", 
			esc_html__( "Light - For Dark Backgrounds", "celebrate" )			=> "tc-social-light", 
			),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Hide Link Icon on Hover", "celebrate" ),
		"param_name"  => "image_link",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),	
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Do not link heading to member details page", "celebrate" ),
		"param_name"  => "heading_link",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"param_name"  => "target",
		"value"       => array ( 
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )		=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Make it Boxed", "celebrate" ),
		"param_name"  => "box",
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => '',
		),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Box Background Color", "celebrate" ),
		"param_name"  => "box_bg",
		"value"       => '', 
		"dependency"  => array( "element" => "box", "not_empty" => true ),
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Box Border Color", "celebrate" ),
		"param_name"  => "border_color",
		"value"       => '', 
		"dependency"  => array( "element" => "box", "not_empty" => true ),
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	 array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Number of Team Members to show in carousel", "celebrate" ),
		"param_name"  => "limit",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => "",
		"description" =>  wp_kses( __('This is a number of team members to show in carousel, not number of columns for carousel. Carousel displays 3 items at a time.<br> In case you need team members in custom number of columns skip carousel and opt for - Single Selected Team Member', 'celebrate'), array( 'br' => array(), ) ),
		),
	 array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Members to Show", "celebrate" ),
		"param_name"  => "portfolio_type",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => array (
			esc_html__( "Members from all categories", "celebrate" )			=> "with_filter", 
			esc_html__( "Show Members from selected categories", "celebrate" )	=> "without_filter",  
			),
		"description" => '',
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "Filter by Category", "celebrate" ),
		"param_name"  => "tax",
		"dependency"  => array( "element" => "portfolio_type", "value" => "without_filter" ),
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => '',
		"description" => esc_html__( 'Enter --- CATEGORY SLUG --- here. Separate with commas. Find category slug here : Team > Team Categories. This will help to group team items from selected categories. Make sure to remove slug from here if you are using filter portfolio type.', 'celebrate' ),
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Sort Members By", "celebrate" ),
		"param_name"  => "orderby",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => array (
			esc_html__( "Date", "celebrate" )   => "date", 
			esc_html__( "Random", "celebrate" )	=> "rand", 
			esc_html__( "Title", "celebrate" )  => "title", 
			),
		"description" => '',
		),
	array(
		"type"        => "dropdown",
		"heading"     => esc_html__( "Arrange Sorted Members", "celebrate" ),
		"param_name"  => "order",
		"group" 	  => esc_html__( "Carousel", 'celebrate' ),
		"value"       => array ( 
			esc_html__( "Descending", "celebrate" )	=> "DESC", 
			esc_html__( "Ascending", "celebrate" )	=> "ASC", 
		),
		"description" => '',
		),	
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Navigation Type", "celebrate"),
		"param_name" 	=> "nav_controls",
		"group" 	    => esc_html__( "Carousel", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
			esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
		),
		"description"   => "",
	   ),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Disable Carousel in case you need to show single selected team member. In this case settings done under carousel tab will not work.", "celebrate" ),
		"group" 	  => esc_html__( "Single Selected Team Member", 'celebrate' ),
		"param_name"  => "carousel",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "textfield",
		"heading"     => esc_html__( "ID of Team Member to Show", "celebrate" ),
		"group" 	  => esc_html__( "Single Selected Team Member", 'celebrate' ),
		"param_name"  => "id",
		"value"       => '',
		'admin_label' => true,
		"dependency"  => array( "element" => "carousel", "not_empty" => true ),
		'description' => esc_html__( 'Refer help document - for how to get ID. Keep Team ID field blank if carousel is being used.', 'celebrate' )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Predefined Typography Style", "celebrate" ),
		"group" 	    => esc_html__( "Typography", 'celebrate' ),
		"param_name"	=> "typography",
		"value"       	=> array (
			esc_html__( "Default", 'celebrate' )						=> "typo_default", 
			esc_html__( "Alt ( For Dark Backgrounds )", 'celebrate' )	=> "typo_alt",
		),
		"description" => esc_html__( 'In theme, Alt style is set for dark backgrounds. Refer - Typography - section of Theme Options.', 'celebrate' ),
	  ),
	)
) ); // Team member - Style 2 

// Video Lightbox
vc_map( array(
   "name"     	=> esc_html__( "Video Lightbox", "celebrate" ),
   "base"	  	=> "tc_video_button",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   	array(
		"type"        => "attach_image",
		"heading"     => esc_html__( "Select Image", "celebrate" ),
		"param_name"  => "image",
		"value" 	  => '', 
		"description" => esc_html__( "Select image from media library.", "celebrate" )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )		=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Text Below Play Icon", "celebrate" ),
		"param_name"  	=> "video_text",
		"value" 	  	=> esc_html__( "Watch Video", "celebrate" ), 
		"description"	=> '',
	  	),
	array(
		"type"        => "colorpicker",
		"heading"     => esc_html__( "Text Color", "celebrate" ),
		"param_name"  => "color",
		"value"       => '', 
		"description" => esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Video Link", "celebrate" ),
		"param_name"  	=> "video_link",
		"value" 	  	=> "", 
		"description"	=> '',
	  	),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Video Title", "celebrate" ),
		"param_name"  	=> "video_title",
		"value" 	  	=> "", 
		"description"	=> '',
	  	),
	),
) );



// Social Share
vc_map( array(
   "name"     	=> esc_html__( "Social Share", "celebrate" ),
   "base"	  	=> "tc_social_share",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Facebook", "celebrate" ),
		"param_name"  => "facebook",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Twitter", "celebrate" ),
		"param_name"  => "twitter",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Googleplus", "celebrate" ),
		"param_name"  => "googleplus",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Linkedin", "celebrate" ),
		"param_name"  => "linkedin",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Pinterest", "celebrate" ),
		"param_name"  => "pinterest",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "Mail", "celebrate" ),
		"param_name"  => "mail",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	),
) ); // Social Share


// Pricing
vc_map( array(
   "name"                 => esc_html__( "Pricing Table", "celebrate" ),
   "base"                 => "tc_pricing",
   "class"                => "",
   "icon"	              => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"             => esc_html__( 'Content', 'celebrate' ),
   "params"               => array(
		array(
	  		"type"        => "dropdown",
		    "holder"      => "div",
		    "class"       => "",
		    "heading"     => esc_html__( "Table type", "celebrate" ),
		    "param_name"  => "table",
		    "value"       => array ( 
				esc_html__( "Normal", "celebrate" )	=> "default-table", 
				esc_html__( "Featured", "celebrate" )	=> "featured-table", 
			),
			"group" 	  => esc_html__( "General", 'celebrate' ),
	    ),
		array(
	  		"type"        => "dropdown",
		    "holder"      => "div",
		    "class"       => "",
		    "heading"     => esc_html__( "Table Corners", "celebrate" ),
		    "param_name"  => "table_shape",
		    "value"       => array ( 
				esc_html__( "Round", "celebrate" )	=> "pr-round", 
				esc_html__( "Square", "celebrate" )	=> "pr-corner", 
			),
			"group" 	  => esc_html__( "General", 'celebrate' ),
	    ),
		array(
			"type"        => "checkbox",
			"heading"     => esc_html__( "Hide Shadow to Pricing Table", "celebrate" ),
			"group" 	  => esc_html__( "General", 'celebrate' ),
			"param_name"  => "shadow",
			"value"       => array ( "Yes, please" => "yes" ),
		),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Table background Color", "celebrate" ),
			"param_name"  	=> "bg_color",
			"value" 	   	=> '', 
			"description" 	=> esc_html__( "Leave blank for theme default.", "celebrate" ),
			"group" 	  	=> esc_html__( "General", 'celebrate' ),
		),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Table Text Color", "celebrate" ),
			"param_name"  	=> "text_color",
			"value" 	   	=> '', 
			"description" 	=> esc_html__( "Leave blank for theme default.", "celebrate" ),
			"group" 	  	=> esc_html__( "General", 'celebrate' ),
		),
		array(
			"type"        => "textfield",
			"holder"      => "div",
			"class"       => "",
			"heading"     => esc_html__( "Border Width", "celebrate" ),
			"param_name"  => "border_width",
			"value"       => "",
			"description" => esc_html__( "Example (top / right / bottom / left): 2px 2px 2px 2px. Leave blank for theme default.", "celebrate" ),
			"group" 	  => esc_html__( "General", 'celebrate' ),
		),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Table Border Color", "celebrate" ),
			"param_name"  	=> "border_color",
			"value" 	   	=> '', 
			"description" 	=> esc_html__( "Leave blank for theme default.", "celebrate" ),
			"group" 	  	=> esc_html__( "General", 'celebrate' ),
		),
		array(
		   "type"         	=> "textfield",
		   "holder"       	=> "div",
		   "class"        	=> "",
		   "heading"      	=> esc_html__( "Banner Text", "celebrate" ),
		   "param_name"   	=> "banner",
		   "value"        	=> "Lifetime Unlimited",
    	   "description"  	=> "",
		   "group" 	  		=> esc_html__( "Banner", 'celebrate' ),
		   "dependency"  	=> array( "element" => "table", "value" => "featured-table" ),
	    ),
	    array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Banner section - Background Color", "celebrate" ),
			"param_name"  	=> "bnr_bg_color",
			"value" 	   	=> '', 
			 "group" 	    => esc_html__( "Banner", 'celebrate' ),
			"dependency"  	=> array( "element" => "table", "value" => "featured-table" ),
		),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Banner section - Font Color", "celebrate" ),
			"param_name"  	=> "bnr_color",
			"value" 	   	=> '', 
			"group" 	    => esc_html__( "Banner", 'celebrate' ),
			"dependency"  	=> array( "element" => "table", "value" => "featured-table" ),
		),
		array(
			"type"        => "textfield",
			"holder"      => "div",
			"class"       => "",
			"heading"     => esc_html__( "Title", "celebrate" ),
			"param_name"  => "title",
			"value"       => "Basic",
			"group" 	  => esc_html__( "Table Head", 'celebrate' ),
			"description" => esc_html__( "Heading of Table. Ex. Basic", "celebrate" )
		),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Title Color", "celebrate" ),
			"param_name"	=> "title_color",
			"value" 	   	=> '', 
			"group" 	    => esc_html__( "Table Head", 'celebrate' ),
		),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Price Color", "celebrate" ),
			"param_name"	=> "price_color",
			"value" 	   	=> '', 
			"group" 	    => esc_html__( "Table Head", 'celebrate' ),
		),
	    array(
			"type"        => "textfield",
			"holder"      => "div",
			"class"       => "",
			"heading"     => esc_html__( "Currency Symbol", "celebrate" ),
			"param_name"  => "currency",
			"value"       => esc_html__( "$", "celebrate" ),
			"description" => "",
			"group" 	  => esc_html__( "Price", 'celebrate' ),
		),
		array(
			"type"        => "textfield",
			"holder"      => "div",
			"class"       => "",
			"heading"     => esc_html__( "Price", "celebrate" ),
			"param_name"  => "price",
			"value"       => esc_html__( "149", "celebrate" ),
			"description" => "",
			"group" 	  => esc_html__( "Price", 'celebrate' ),
		),
		array(
			"type"        => "textfield",
			"holder"      => "div",
			"class"       => "",
			"heading"     => esc_html__( "Price Label", "celebrate" ),
			"param_name"  => "price_label",
			"value"       => esc_html__( "/month", "celebrate" ),
			"description" => "",
			"group" 	  => esc_html__( "Price", 'celebrate' ),
		),
		array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Footnote Text", "celebrate" ),
		   "param_name"   => "footnote",
		   "value"        => "For Large Companies",
		   'admin_label'  => true,
		   "description"  => esc_html__( "Leave blank this field if need to hide footnote", "celebrate" ),
		   "group" 	      => esc_html__( "Footnote", 'celebrate' ),
	  	),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Footnote background Color", "celebrate" ),
			"param_name"  	=> "footnote_bg_color",
			"value" 	   	=> '', 
			"description" 	=> esc_html__( "Leave blank for theme default.", "celebrate" ),
			"group" 	  	=> esc_html__( "Footnote", 'celebrate' ),
		),
		array(
			"type"        	=> "colorpicker",
			"holder"      	=> "div",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Footnote Color", "celebrate" ),
			"param_name"  	=> "footnote_color",
			"value" 	   	=> '', 
			"description" 	=> esc_html__( "Leave blank for theme default.", "celebrate" ),
			"group" 	  	=> esc_html__( "Footnote", 'celebrate' ),
		),
		array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button Text", "celebrate" ),
		   "param_name"   => "button_content",
		   "value"        => "Link",
		   'admin_label'  => true,
		   "description"  => esc_html__( "Leave blank this field if need - Only Icon - button.", "celebrate" ),
		   "group" 	      => esc_html__( "Button", 'celebrate' ),
	  	),
	 	array(
			"type"       	=> "dropdown",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Button Style", "celebrate" ),
			"param_name"	=> "style",
			"value"       	=> array (
				 esc_html__( "Classic", "celebrate" )	=> "classic", 
				 esc_html__( "Outline", "celebrate" )	=> "outline",
				),
			"group" 	    => esc_html__( "Button", 'celebrate' ),
	  	),
	 	array(
			"type"       	=> "dropdown",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Button Shape", "celebrate" ),
			"param_name"	=> "shape",
			"value"       	=> array (
				esc_html__( "Square", "celebrate" )				=> "square", 
				 esc_html__( "Round", "celebrate" )				=> "round",
				 esc_html__( "Rounded Corners", "celebrate" )	=> "rounded", 
				  
				),
			"group" 	    => esc_html__( "Button", 'celebrate' ),
	 	 ),
		 array(
			"type"       	=> "dropdown",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Button Size", "celebrate" ),
			"param_name"	=> "size",
			"value"       	=> array (
				 esc_html__( "Medium", "celebrate" )	=> "medium", 
				 esc_html__( "Big", "celebrate" )		=> "big", 
				 esc_html__( "Small", "celebrate" )		=> "small", 
				),
			"group" 	    => esc_html__( "Button", 'celebrate' ),
	  	),
	 	array(
			"type"       	=> "dropdown",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Button Color", "celebrate" ),
			"param_name"	=> "color",
			"value"       	=> $celebrate_buttons,
			"group" 	    => esc_html__( "Button", 'celebrate' ),
		),
		array(
			'type' => 'dropdown',
			'heading' => __( 'Icon', 'celebrate' ),
			'param_name'  => 'icon_name',
			'value' => array(
				__( 'No Icon', 'celebrate' )								=> 'no-icon',
				__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',
	
			),
			"group" 	    => esc_html__( "Button", 'celebrate' ),
			'description' => __( 'Select icon library.', 'celebrate' ),
			
		 ),
		 array(
			'type' => 'iconpicker',
			'heading' => __( 'Icon', 'celebrate' ),
			"group" 	  => esc_html__( "Button", 'celebrate' ),
			'param_name' => 'icon_fontawesome',
			'value' => 'fa fa-adjust',
			'settings' => array(
				'emptyIcon' => false,
				'iconsPerPage' => 4000,
			),
			'dependency' => array(
				'element' => 'icon_name',
				'value' => 'fontawesome',
			),
			'description' => __( 'Select icon from library.', 'celebrate' ),
		 ),
	 	array(
			"type"       	=> "dropdown",
			"class"       	=> '',
			"heading"     	=> esc_html__( "Button Icon Position", "celebrate" ),
			"param_name"	=> "icon_position",
			"value"       	=> array (
				 esc_html__( "Default - Left", "celebrate" )	=> "icon-left", 
			 	 esc_html__( "Right", "celebrate" )				=> "icon-right", 
				),
			"group" 	    => esc_html__( "Button", 'celebrate' ),
	  	),
   	 	array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button URL", "celebrate" ),
		   "param_name"   => "url",
		   "value"        => "",
		   'admin_label'  => true,
		   "description"  => "",
		   "group" 	      => esc_html__( "Button", 'celebrate' ),
	  	),
		array(
			"type"        => "dropdown",
			"class"       => "",
			"heading"     => esc_html__( "Open link in", "celebrate" ),
			"param_name"  => "target",
			"value"       => array (
				esc_html__( "Default", "celebrate" )		=> "", 
				esc_html__( "New Window", "celebrate" )	=> "blank", 
				esc_html__( "Same Window", "celebrate" )	=> "self", 
				),
			"description" => "",
			"group" 	  => esc_html__( "Button", 'celebrate' ),
	    ),
	    array(
			"type"        => "textarea_html",
			"holder"      => "div",
			"class"       => "",
			"heading"     => esc_html__( "Content", "celebrate" ),
			"param_name"  => "content",
			"value"       => "",
			"description" => esc_html__( "Enter your content.", "celebrate" ),
			"group" 	  => esc_html__( "Content", 'celebrate' ),
		),
	)
) ); // pricing

// Clients
// Clients wrapper
vc_map( array(
    "name" => esc_html__("Clients", "celebrate"),
    "base" => "tc_client_wrapper",
    "as_parent" => array('only' => 'tc_client_item'),
    "content_element" => true,
    "show_settings_on_create" => false,
    "is_container" => true,
	"icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
	"category"	=> esc_html__( 'Content', 'celebrate' ),
    "js_view" => 'VcColumnView',
	"params" => array(
		array(
			"type"       	=> "dropdown",
			"heading" 		=> esc_html__("Navigation Type", "celebrate"),
            "param_name" 	=> "nav_controls",
			"value"       	=> array (
				esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
				esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
			),
		),
		array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
    ),
) );
// Client item
vc_map( array(
   "name"     	=> esc_html__( "Client Item", "celebrate" ),
   "base"	  	=> "tc_client_item",
   "content_element" => true,
   "as_child" => array('only' => 'tc_client_wrapper'),
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
    array(
		"type"        => "attach_image",
		"heading"     => esc_html__( "Select Image", "celebrate" ),
		"param_name"  => "image",
		"value" 	  => '', 
		"description" => esc_html__( "Select image from media library. Better to keep all images of same width / height.", "celebrate" )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )			=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
   	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Title", "celebrate" ),
		"param_name"  	=> "heading",
		"value" 	  	=> "", 
		'admin_label'   => true,
		"description"	=> esc_html__( "Leave Title and Text field below blank if need no hover", "celebrate" )
	  	),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Short Text On Hover", "celebrate" ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Leave Title and this field blank if need no hover", "celebrate" )
		),
	),
) ); // Clients
if ( class_exists( 'WPBakeryShortCodesContainer' ) ) {
    class WPBakeryShortCode_Tc_Client_Wrapper extends WPBakeryShortCodesContainer {
    }
}
if ( class_exists( 'WPBakeryShortCode' ) ) {
    class WPBakeryShortCode_Tc_Client_Item extends WPBakeryShortCode {
    }
} 
// End Clients

// Timeline
// Timeline wrapper
vc_map( array(
    "name" 						=> esc_html__("Timeline", "celebrate"),
    "base" 						=> "tc_timeline_wrapper",
    "as_parent" 				=> array('only' => 'tc_timeline_item'),
    "content_element" 			=> true,
    "show_settings_on_create"	=> false,
    "is_container" 				=> true,
	"icon"	    				=> get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
	"category"					=> esc_html__( 'Content', 'celebrate' ),
    "js_view" 					=> 'VcColumnView',
	"params" => array(
		 array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
    ),
) );
// Timeline item
vc_map( array(
   "name"     			=> esc_html__( "Timeline Item", "celebrate" ),
   "base"	  			=> "tc_timeline_item",
   "content_element"	=> true,
   "as_child" 			=> array('only' => 'tc_timeline_wrapper'),
   "icon"	    		=> get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"			=> esc_html__( 'Content', 'celebrate' ),
   "params"   			=> array(
   	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Heading", "celebrate" ),
		"param_name"  	=> "heading",
		"value" 	  	=> "Where it all begun", 
		'admin_label'   => true,
		"description"	=> '',
	  	),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Prefix Text to Heading", "celebrate" ),
		"param_name"  	=> "sub_heading",
		"value" 	  	=> "2008.", 
		'admin_label'   => true,
		"description"	=> '',
	  	),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter your content.", "celebrate" )
		),
	),
) ); // Timeline
if ( class_exists( 'WPBakeryShortCodesContainer' ) ) {
    class WPBakeryShortCode_Tc_Timeline_Wrapper extends WPBakeryShortCodesContainer {
    }
}
if ( class_exists( 'WPBakeryShortCode' ) ) {
    class WPBakeryShortCode_Tc_Timeline_Item extends WPBakeryShortCode {
    }
} 
// End Timeline

// Author Box
vc_map( array(
   "name"     	=> esc_html__( "Author Box", "celebrate" ),
   "base"	  	=> "tc_authorbox",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   	array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Style", "celebrate" ),
		"param_name"	=> "style",
		"value"       	=> array (
			 esc_html__( "Image To Left", "celebrate" )	=> "style_left_img", 
			 esc_html__( "Image To Right", "celebrate" )	=> "style_right_img",
		),
	  ),
	array(
	   "type"         	=> "textfield",
	   "heading"      	=> esc_html__( "Heading", "celebrate" ),
	   "param_name"   	=> "heading",
	   "value"        	=> "Consult Our Expert",
	   'description'	=> esc_html__( 'Leave this field blank for No Heading', 'celebrate' )
	  ),
    array(
		"type"        => "attach_image",
		"heading"     => esc_html__( "Image", "celebrate" ),
		"param_name"  => "image",
		"value" 	  => '', 
		"description" => esc_html__( "Select image from media library.", "celebrate" ),
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )			=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter your content.", "celebrate" ),
		),
	),
) ); // Author Box
	
// Process
// Process wrapper
vc_map( array(
    "name" => esc_html__("Process", "celebrate"),
    "base" => "tc_process_wrapper",
    "as_parent" => array('only' => 'tc_process_item'),
    "content_element" => true,
    "show_settings_on_create" => false,
    "is_container" => true,
	"icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
	"category"	=> esc_html__( 'Content', 'celebrate' ),
    "js_view" => 'VcColumnView',
	"params" => array(
		array(
			"type"       	=> "dropdown",
			"heading" 		=> esc_html__("Number of Columns", "celebrate"),
            "param_name" 	=> "process_columns",
			"value"       	=> array (
				esc_html__( "Four Columns", "celebrate" )	=> "process-grid-4col", 
				esc_html__( "Three Columns", "celebrate" )	=> "process-grid-3col", 
			),
		),
    ),
) );
// Process item
vc_map( array(
   "name"     	=> esc_html__( "Process", "celebrate" ),
   "base"	  	=> "tc_process_item",
   "content_element" => true,
   "as_child" => array('only' => 'tc_process_wrapper'),
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
    array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Process Heading", "celebrate" ),
		"param_name"  	=> "heading",
		"value" 	  	=> "", 
		'admin_label'   => true,
		"description"	=> '',
		"group" 	    => esc_html__( "Content", 'celebrate' ),
	  	),
	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Process Tagline", "celebrate" ),
		"param_name"  	=> "sub_heading",
		"value" 	  	=> "", 
		'admin_label'   => true,
		"description"	=> '',
		"group" 	    => esc_html__( "Content", 'celebrate' ),
	  	),
    array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image or Icon", "celebrate" ),
		"param_name"	=> "image_type",
		"value"       	=> array (
			esc_html__( "Icon", "celebrate" )	=> "type_icon", 
			esc_html__( "Image", "celebrate" )	=> "type_img", 
			),
		"description"	=> '',
		),
   	array(
		"type"        	=> "attach_image",
		"heading"     	=> esc_html__( "Select Image", "celebrate" ),
		"param_name" 	=> "image",
		"dependency"  	=> array( "element" => "image_type", "value" => "type_img" ),
		"value" 	  	=> '', 
		"description"	=> esc_html__( "Select image from media library if no matching icon to your requirement. Image size: 64 x 64", "celebrate" )
		),
	array(
		'type' 			=> 'dropdown',
		'heading' 		=> __( 'Icon', 'celebrate' ),
		'param_name'	=> 'icon_name',
		'value' 		=> array(
		    __( 'No Icon', 'celebrate' )							=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		'description' 	=> __( 'Select icon library.', 'celebrate' ),
		"dependency"  	=> array( "element" => "image_type", "value" => "type_icon" ),
		
	 ),
	 array(
		'type' 			=> 'iconpicker',
		'heading' 		=> __( 'Icon', 'celebrate' ),
		'param_name'	=> 'icon_fontawesome',
		'value' 		=> 'fa fa-adjust',
		'settings' 		=> array(
			'emptyIcon' => false,
			'iconsPerPage' => 4000,
		),
		'dependency' 	=> array(
			'element'	=> 'icon_name',
			'value' 	=> 'fontawesome',
		),
		'description' 	=> __( 'Select icon from library.', 'celebrate' ),
		"dependency"  	=> array( "element" => "image_type", "value" => "type_icon" ),
	 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Icon Color", "celebrate" ),
		 "param_name"  	=> "icon_color",
		 "dependency"  	=> array( "element" => "image_type", "value" => "type_icon" ),
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Circle Background Color", "celebrate" ),
		 "param_name"  	=> "icon_bg",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),	 
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Heading Color", "celebrate" ),
		 "param_name"  	=> "heading_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Tagline Color", "celebrate" ),
		 "param_name"  	=> "sub_heading_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
         "type"        => "colorpicker",
         "heading"     => esc_html__( "Text color", "celebrate" ),
         "param_name"  => "color",
         "value"       => '', 
         "description" => "Leave blank for theme default.",  
		 ),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter your content.", "celebrate" )
		),
	),
) ); // Process
if ( class_exists( 'WPBakeryShortCodesContainer' ) ) {
    class WPBakeryShortCode_Tc_Process_Wrapper extends WPBakeryShortCodesContainer {
    }
}
if ( class_exists( 'WPBakeryShortCode' ) ) {
    class WPBakeryShortCode_Tc_Process_Item extends WPBakeryShortCode {
    }
} 
// End Process

// Screenshot Carousel
vc_map( array(
   "name"     => __( "Screenshot Carousel", "celebrate" ),
   "base"     => "tc_screenshot",
   "class"    => '',
   "icon"	  => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category" => __( 'Content', 'celebrate' ),
   "params"   => array(
	array(
		"type"        => "attach_images",
		"holder"      => "div",
		"class"       => '',
		"heading"     => __( "Screenshots", "celebrate" ),
		"param_name"  => "images",
		"value" 	  => '', 
		"description" => __( "Select screenshots from media library.", "celebrate" )
		),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Image size", "celebrate" ),
		"param_name"	=> "size",
		"group" 	    => esc_html__( "Image Settings", 'celebrate' ),
		"value"       	=> array (
			esc_html__( "Full", "celebrate" )		=> "full", 
			esc_html__( "Medium", "celebrate" )		=> "medium", 
			esc_html__( "Thumbnail", "celebrate" )	=> "thumbnail", 
			),
		"description"	=> '',
		),
	array(
		"type"        => "checkbox",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Enable hard cropping", "celebrate" ),
		"param_name"  => "hard_crop",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
		"description" => esc_html__( "", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Width", "celebrate" ),
		"param_name"  => "img_width",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 600. Make sure all images to be displayed are of more width than hard cropping width given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "textfield",
		"holder"      => "div",
		"class"       => '',
		"heading"     => esc_html__( "Height", "celebrate" ),
		"param_name"  => "img_height",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"dependency"  => array( "element" => "hard_crop", "not_empty" => true ),
		"description" => esc_html__( "No need of unit. Give it like: 400. Make sure all images to be displayed are of more height than hard cropping height given above, otherwise those will not be displayed.", "celebrate" )
		),
	array(
		"type"        => "checkbox",
		"heading"     => esc_html__( "No Image Scale on Hover", "celebrate" ),
		"param_name"  => "scale",
		"group" 	  => esc_html__( "Image Settings", 'celebrate' ),
		"value"       => array ( "Yes, please" => "yes" ),
	),
	array(
		"type"        => "checkbox",
		"holder"      => "div",
		"class"       => '',
		"heading"     => __( "Disable Zoom", "celebrate" ),
		"param_name"  => "zoom",
		"value"       => array ( "Yes, please" => "yes" ),
		),
	array(
		"type"       	=> "dropdown",
		"heading" 		=> esc_html__("Navigation Type", "celebrate"),
		"param_name" 	=> "nav_controls",
		"value"       	=> array (
			esc_html__( "Pager", "celebrate" )				=> "tc-only-pagination", 
			esc_html__( "Navigation Arrows", "celebrate" )	=> "tc-only-buttons", 
		),
		"description"   => "",
	   ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description'   => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	)
) );

// CTA Box
vc_map( array(
   "name"     	=> esc_html__( "CTA Box", "celebrate" ),
   "base"	  	=> "tc_cta_box",
   "class"    	=> '',
   "icon"	    => get_template_directory_uri() . "/img/vc-icons/vc-custom-icon.png",
   "category"	=> esc_html__( 'Content', 'celebrate' ),
   "params"   	=> array(
   	array(
		"type"        	=> "textfield",
		"heading"     	=> esc_html__( "Heading", "celebrate" ),
		"group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"  	=> "heading",
		"value" 	  	=> "",
		'admin_label' => true,
		"description"	=> '',
	  	),
  	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "Style", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "style",
		"value"       	=> array (
			esc_html__( "Default", "celebrate" )		=> "",
			esc_html__( "Center Text", "celebrate" )	=> "centered",
			),
		),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Box Background Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "box_bg",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		 "type"        	=> "textfield",
		 "heading"     	=> esc_html__( "Box Padding", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "box_padding",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Give it like (Top Right Bottom Left) : 20px 20px 20px 20px. Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		 "type"        	=> "textfield",
		 "heading"     	=> esc_html__( "Box Border Width", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "border_width",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Give it like (Top Right Bottom Left) : 0 1px 0 0. Leave blank for no border.", "celebrate" ),
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Border Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "border_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank if no border. Border width is necessary to make it work.", "celebrate" ),
		 ),
	array(
		 "type"        	=> "textfield",
		 "heading"     	=> esc_html__( "Heading Size", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "heading_size",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Provide unit. Like : 22px", "celebrate" ),
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Heading Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "heading_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" )
		 ),
	array(
		 "type"        	=> "colorpicker",
		 "heading"     	=> esc_html__( "Font Color", "celebrate" ),
		 "group" 	    => esc_html__( "General", 'celebrate' ),
		 "param_name"  	=> "font_color",
		 "value" 	   	=> '', 
		 "description"	=> esc_html__( "Leave blank for theme default.", "celebrate" ),
		 ),
	array(
		"type"       	=> "dropdown",
		"heading"     	=> esc_html__( "CSS Animation", "celebrate" ),
		"group" 	    => esc_html__( "General", 'celebrate' ),
		"param_name"	=> "animation",
		"value"       	=> $celebrate_css_animations,
		'description' => esc_html__( 'Select type of animation for element to be animated when it "enters" the browsers viewport (Note: works only in modern browsers).', 'celebrate' )
		),
	 array(
	   "type"         => "textfield",
	   "class"        => "",
	   "heading"      => esc_html__( "Button Text", "celebrate" ),
	   "group" 	 	  => esc_html__( "Button", 'celebrate' ),
	   "param_name"   => "button_content",
	   "value"        => "Link",
	   'admin_label'  => true,
	   "description"  => esc_html__( "Leave blank this field if need - Only Icon - button.", "celebrate" )
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Style", "celebrate" ),
		"group" 	 	=> esc_html__( "Button", 'celebrate' ),
		"param_name"	=> "style",
		"value"       	=> array (
			 esc_html__( "Classic", "celebrate" )	=> "classic", 
			 esc_html__( "Outline", "celebrate" )	=> "outline",
		),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Shape", "celebrate" ),
		 "group" 	 	=> esc_html__( "Button", 'celebrate' ),
		"param_name"	=> "shape",
		"value"       	=> array (
			 esc_html__( "Square", "celebrate" )			=> "square",  
			 esc_html__( "Round", "celebrate" )				=> "round",
			 esc_html__( "Rounded Corners", "celebrate" )	=> "rounded", 
		),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Size", "celebrate" ),
		"group" 	 	=> esc_html__( "Button", 'celebrate' ),
		"param_name"	=> "size",
		"value"       	=> array (
			 esc_html__( "Medium", "celebrate" )	=> "medium", 
			 esc_html__( "Big", "celebrate" )		=> "big", 
			 esc_html__( "Small", "celebrate" )	=> "small", 
		),
	  ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Color", "celebrate" ),
		"group" 	 	=> esc_html__( "Button", 'celebrate' ),
		"param_name"	=> "color",
		"value"       	=> $celebrate_buttons,
		),
 	array(
		'type'        => 'dropdown',
		'heading'     => __( 'Icon', 'celebrate' ),
		"group" 	  => esc_html__( "Button", 'celebrate' ),
		'param_name'  => 'icon_name',
		'value'       => array(
		    __( 'No Icon', 'celebrate' )							=> 'no-icon',
			__( 'Font Awesome + Theme Custom Icons', 'celebrate' )	=> 'fontawesome',

		),
		'description' => __( 'Select icon library.', 'celebrate' ),
	 ),
	 array(
		'type'       => 'iconpicker',
		'heading'    => __( 'Icon', 'celebrate' ),
		"group" 	 => esc_html__( "Button", 'celebrate' ),
		'param_name' => 'icon_fontawesome',
		'value'      => 'fa fa-adjust',
		'settings'   => array(
			'emptyIcon' 	=> false,
			'iconsPerPage'	=> 4000,
		),
		'dependency'	=> array(
			'element'	=> 'icon_name',
			'value' 	=> 'fontawesome',
		),
		'description' 	=> __( 'Select icon from library.', 'celebrate' ),
	 ),
	 array(
		"type"       	=> "dropdown",
		"class"       	=> '',
		"heading"     	=> esc_html__( "Button Icon Position", "celebrate" ),
		 "group" 	 	=> esc_html__( "Button", 'celebrate' ),
		"param_name"	=> "icon_position",
		"value"       	=> array (
			 esc_html__( "Default - Left", "celebrate" )	=> "icon-left", 
			 esc_html__( "Right", "celebrate" )				=> "icon-right", 
		),
	  ),
   	 array(
		   "type"         => "textfield",
		   "class"        => "",
		   "heading"      => esc_html__( "Button URL", "celebrate" ),
		   "group" 	 	  => esc_html__( "Button", 'celebrate' ),
		   "param_name"   => "url",
		   "value"        => "",
		   'admin_label'  => true,
		   "description"  => "",
	  ),
	array(
		"type"        => "dropdown",
		"class"       => "",
		"heading"     => esc_html__( "Open link in", "celebrate" ),
		"group" 	  => esc_html__( "Button", 'celebrate' ),
		"param_name"  => "target",
		"value"       => array (
			esc_html__( "Default", "celebrate" )		=> "", 
			esc_html__( "New Window", "celebrate" )		=> "blank", 
			esc_html__( "Same Window", "celebrate" )	=> "self", 
		),
		"description" => "",
	   ),
	array(
		"type"        	=> "textarea_html",
		"heading"     	=> esc_html__( "Content", "celebrate" ),
		 "group" 	    => esc_html__( "Content", 'celebrate' ),
		"param_name"	=> "content",
		"value"       	=> '',
		'admin_label'   => true,
		"description"	=> esc_html__( "Enter your content.", "celebrate" )
		),
	),
) );