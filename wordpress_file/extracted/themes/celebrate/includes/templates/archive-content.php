<?php
/**
 * Template for displaying content for archive.
 */

if ( have_posts() ) : 
	while ( have_posts() ) : the_post(); 
  		get_template_part( '/includes/templates/content', get_post_format() ); 
 	endwhile; 
 	celebrate_paging_nav(); 
else : 
	get_template_part( '/includes/templates/content', 'none' ); 
endif; 