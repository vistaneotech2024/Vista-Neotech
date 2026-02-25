<?php
/**
 * The Social Share For Product
 */

// Product Social share hook
if( ! function_exists( 'celebrate_product_social_share_hook' ) ) {
	function celebrate_product_social_share_hook() {
		do_action( 'celebrate_product_social_share_hook' );
	}
}
add_action( 'celebrate_product_social_share_hook', 'celebrate_default_product_social_share_hook' );

if( ! function_exists( 'celebrate_default_product_social_share_hook' ) ) {
	function celebrate_default_product_social_share_hook() {
		celebrate_product_social_share();
	}
}

// Social share
if ( ! function_exists('celebrate_product_social_share') ) {
	function celebrate_product_social_share() {
		$celebrate_show_woo_facebook_share   = celebrate_option( 'celebrate_show_woo_facebook_share', true, true ) ? true : false; 
		$celebrate_show_woo_twitter_share    = celebrate_option( 'celebrate_show_woo_twitter_share', true, true ) ? true : false; 
		$celebrate_show_woo_googleplus_share = celebrate_option( 'celebrate_show_woo_googleplus_share', true, true ) ? true : false; 
		$celebrate_show_woo_linkedin_share   = celebrate_option( 'celebrate_show_woo_linkedin_share', true, true ) ? true : false; 
		$celebrate_show_woo_pinterest_share  = celebrate_option( 'celebrate_show_woo_pinterest_share', true, true ) ? true : false; 
		$celebrate_show_woo_mail_share       = celebrate_option( 'celebrate_show_woo_mail_share', true, true ) ? true : false; 

?>
<div class="tc-social-share tc-share-sc clearfix">
	<ul>
			<?php if( $celebrate_show_woo_facebook_share ) { ?>
			<li><a href="http://www.facebook.com/sharer.php?u=<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-facebook"></a></li>
			<?php } ?>
			<?php if( $celebrate_show_woo_twitter_share ) { ?>
			<li> <a href="http://twitter.com/home?status=<?php the_title(); ?> <?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-twitter"></a></li>
			<?php } ?>
			<?php if( $celebrate_show_woo_googleplus_share ) { ?>
			<li><a href="https://plus.google.com/share?url=<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-googleplus"></a></li>
			<?php } ?>
			<?php if( $celebrate_show_woo_linkedin_share ) { ?>
			<li><a href="http://linkedin.com/shareArticle?url=<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-linkedin"></a></li>
			<?php } ?>
			<?php if( $celebrate_show_woo_pinterest_share ) { ?>
			<?php $pinterestimage = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'full' ); ?>
			<li><a href="http://pinterest.com/pin/create/button/?url=<?php echo urlencode(get_permalink()); ?>&amp;description=<?php the_title(); ?>&amp;media=<?php echo urlencode($pinterestimage[0]); ?>" class="share-pinterest"></a></li>
			<?php } ?>
			<?php if( $celebrate_show_woo_mail_share ) { ?>
			<li><a href="mailto:?subject=<?php the_title(); ?>&amp;body=<?php the_permalink(); ?>" class="share-mail"></a></li>
			<?php } ?>
		</ul>
	</div>
<?php	
	} 	
}

