<?php
/**
 * The sidebar containing the widget area, displays on posts and pages.
 */
// No sidebar if No Sidebar layout is selected 
$celebrate_main_layout = celebrate_get_layout_class();
if ( $celebrate_main_layout == 'fullwidth' ) return; 
?>
<aside id="sidebar">
  <?php if( is_page() ){
			if ( is_active_sidebar( 'widgets-page' ) ) {
				dynamic_sidebar('widgets-page'); 
			}
	} else {
			if ( is_active_sidebar( 'widgets-blog' ) ) {
				dynamic_sidebar('widgets-blog');
			}
	}		
	?>
</aside>