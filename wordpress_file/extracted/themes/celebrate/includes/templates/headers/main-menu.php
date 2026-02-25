<?php
/**
 * The Main Menu
 */

if( has_nav_menu( 'primary_menu' ) ) {
wp_nav_menu( array( 
	'theme_location'  	=> 'primary_menu',
	'container'       	=> '',
	'container_class'	=> '',
	'container_id'   	=> '',
	'menu_class'      	=> 'sf-menu',
	'menu_id'         	=> '',
	'depth'           	=> 0,
	'walker' => new CELEBRATE_Dropdown_Walker_Nav_Menu,
	) 
); 
}