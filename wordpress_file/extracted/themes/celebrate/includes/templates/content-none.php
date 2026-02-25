<?php
/**
 * The template for displaying a "No posts found" message.
 */
?>
<h4 class="post-title entry-title">
	<?php esc_attr_e( 'Nothing Found', 'celebrate' ); ?>
</h4>
<div class="page-content">
	<?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>
	<p><?php printf( esc_html__( 'Ready to go for your first post? <a href="%1$s">Get started</a>.', 'celebrate' ), admin_url( 'post-new.php' ) ); ?></p>
	<?php elseif ( is_search() ) : ?>
	<p>
		<?php esc_attr_e( 'Sorry, no results were found for your search terms. Please try again with different keywords.', 'celebrate' ); ?>
	</p>
	<?php get_search_form(); ?>
	<?php else : ?>
	<p>
		<?php esc_attr_e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Try with search.', 'celebrate' ); ?>
	</p>
	<?php get_search_form(); ?>
	<?php endif; ?>
</div>
