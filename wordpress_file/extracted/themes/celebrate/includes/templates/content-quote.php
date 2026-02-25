<?php
/**
 * The template for displaying posts in the Quote post format.
 */
$celebrate_post_social_share 	   = celebrate_option( 'celebrate_post_social_share', true, true ) ? true : false; 
$pf_quote_source =  get_post_meta( get_the_ID(), '_celebrate_pf_quote_source', true ); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php if ( ! post_password_required() ) : ?>
	<div class="tc-pf-quote clearfix">
		<?php if ( ! celebrate_is_custom_post_type() && ! is_page() ) : ?>
		<div class="tc-post-meta-wrapper clearfix">
			<?php if ( ! celebrate_is_custom_post_type() && ! is_page() ) : ?>
			<?php celebrate_post_meta(); ?>
			<?php endif; ?>
			<?php if ( comments_open() && ! is_single() && ! is_page() && ! post_password_required() ) : ?>
			<span class="tc-comment-link">
			<?php 
		comments_popup_link(  '' . esc_html__( 'No comments', 'celebrate' ), '' . esc_html__( '1 comment', 'celebrate' ), '' . esc_html__( '% comments', 'celebrate' ) ); ?>
			</span>
			<?php endif ?>
		</div>
		<?php endif; ?>
		<blockquote>
			<?php the_content(); ?>
			<?php if ( $pf_quote_source !== '' ) { ?>
			<span class="tc-quote-source"> <?php echo esc_attr( $pf_quote_source ) ?> </span>
			<?php } ?>
		</blockquote>
		<?php if ( ! is_single() && ! is_page() ) : ?>
		<?php $celebrate_show_read_more = celebrate_option( 'celebrate_show_read_more', true, true ) ? true : false; 
		if ( $celebrate_show_read_more ) { ?>
		<?php if( celebrate_option( 'celebrate_read_more' ) != "" ) { 
					$celebrate_read_more = celebrate_option( 'celebrate_read_more' );
           			$btn_title = $celebrate_read_more;
				} else { 
					$btn_title =  esc_html__( 'Continue Reading' , 'celebrate' ); 
				} ?>
		<a href="<?php the_permalink(); ?>" class="read-more-link"> <?php echo esc_attr( $btn_title ); ?> </a>
		<?php } ?>
		<?php endif; ?>
		
		
		<?php if ( is_single() ) { ?>
		<?php wp_link_pages( array( 'before' => '<div class="page-links">', 'after' => '</div>' ) ); ?>
		<div class="post-footer-meta clearfix">
			<?php celebrate_post_meta_second(); ?>
			<?php if( $celebrate_post_social_share ) { celebrate_social_share_hook(); } ?>
		</div>
		<?php } ?>
		
		
	</div>
	<?php endif; ?>
	<?php if( !is_single() && !($wp_query->post_count == $wp_query->current_post+1)) : ?>
	<div class="post-footer clearfix"></div>
	<?php endif; ?>
</article>
<!-- #post -->