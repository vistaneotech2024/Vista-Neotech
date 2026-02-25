<?php
/**
 * The template for displaying Author Bios.
 */
?>
<div class="tc-author-info clearfix">
	<div class="tc-author-avatar"> <a class="author-link" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" rel="author"><?php echo get_avatar( get_the_author_meta( 'user_email' ), 120 ); ?></a> </div>
	<div class="tc-author-description">
		<h5 class="tc-author-title"><?php printf( esc_html__( '%s', 'celebrate' ), get_the_author() ); ?></h5>
		<p class="tc-author-bio">
			<?php the_author_meta( 'description' ); ?>
		</p>
	</div>
</div>
<!-- .author-info --> 