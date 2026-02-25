<?php
/**
 * The Image for post 
 */
if ( is_single() ) {
	if( has_post_thumbnail() && ! post_password_required() ) { ?>
<div class="tc-post-thumb">
	<?php the_post_thumbnail(); ?>
</div>
<?php } 
} else { ?>
<?php if( has_post_thumbnail() && ! post_password_required() ) { ?>
<div class="tc-post-thumb">
	<?php  if ( is_sticky() ) { ?>
	<span class="tc-sticky-post">
	<?php _e( 'Sticky Post', 'celebrate' ); ?>
	</span>
	<?php  } ?>
	<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
	<?php the_post_thumbnail(); ?>
	</a> </div>
<?php } 
	} ?>