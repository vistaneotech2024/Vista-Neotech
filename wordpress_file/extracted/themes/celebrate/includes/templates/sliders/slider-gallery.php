<?php
/**
 * The Template for displaying slider on gallery post / portfolio
 */
$celebrate_select_gallery_rev_slider = get_post_meta( get_the_ID(), '_celebrate_select_gallery_rev_slider', true );
if ( function_exists('putRevSlider') ) { 
	putRevSlider($celebrate_select_gallery_rev_slider); 
}