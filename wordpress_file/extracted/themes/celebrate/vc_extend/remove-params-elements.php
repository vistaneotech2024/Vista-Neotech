<?php
/**
 * Remove params and elements from VC
 */
 
/**
 * Remove elements from VC
 * Following elements from VC are not required for theme hence not styled and removed. You can enable them easily if necessary via theme options.
 */
$celebrate_vc_extras = celebrate_option( 'celebrate_vc_extras', true, true ) ? true : false; 
if(  $celebrate_vc_extras ) { 
	if ( function_exists( 'vc_remove_element' ) ) {
		add_action( 'init', 'celebrate_remove_vc_element' );
		if ( ! function_exists( 'celebrate_remove_vc_element' ) ) {	
			function celebrate_remove_vc_element() {		
				// Comment - vc_remove_element() - of respective element if need to enable that visual composer element
				vc_remove_element("vc_btn"); 
				vc_remove_element("vc_cta"); 
				vc_remove_element("vc_button");  
				vc_remove_element("vc_cta_button"); 
				vc_remove_element("vc_button2"); 
				vc_remove_element("vc_cta_button2");  
				vc_remove_element("vc_posts_grid"); 
				vc_remove_element("vc_posts_slider"); 
				vc_remove_element("vc_basic_grid"); 
				vc_remove_element("vc_media_grid"); 
				vc_remove_element("vc_masonry_grid"); 
				vc_remove_element("vc_masonry_media_grid"); 
			} 	
		} 
	}
	
	// hide grid option of VC
	add_action('admin_head', 'celebrate_hide_vc_grid');
	function celebrate_hide_vc_grid() {
	  echo '<style>
		a[href*="vc_grid_item"] {
		  display: none !important;
		} 
	  </style>';
	}
}