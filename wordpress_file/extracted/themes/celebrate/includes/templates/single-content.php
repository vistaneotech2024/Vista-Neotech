<?php
/**
 * Template for displaying content for single post.
 */
while ( have_posts() ) : the_post(); 
	get_template_part( '/includes/templates/content', get_post_format() ); 
	celebrate_post_nav(); 
	if ( get_the_author_meta( 'description' ) && is_multi_author() ) :
		get_template_part( '/includes/templates/author-bio' ); 
 	endif; 
	comments_template(); 
endwhile; 