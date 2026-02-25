<?php
/**
 * The Social Share For Post
 */

// Post Social share hook
function celebrate_social_share_hook() {
	do_action( 'celebrate_social_share_hook' );
}
add_action( 'celebrate_social_share_hook', 'celebrate_default_social_share_hook' );

if( ! function_exists( 'celebrate_default_social_share_hook' ) ) {
	function celebrate_default_social_share_hook() {
		celebrate_social_share();
	}
}
// Social Share
if ( ! function_exists('celebrate_social_share') ) {
	function celebrate_social_share() {
		$celebrate_show_facebook_share   = celebrate_option( 'celebrate_show_facebook_share', true, true ) ? true : false; 
		$celebrate_show_twitter_share    = celebrate_option( 'celebrate_show_twitter_share', true, true ) ? true : false; 
		$celebrate_show_googleplus_share = celebrate_option( 'celebrate_show_googleplus_share', true, true ) ? true : false; 
		$celebrate_show_linkedin_share   = celebrate_option( 'celebrate_show_linkedin_share', true, true ) ? true : false; 
		$celebrate_show_pinterest_share  = celebrate_option( 'celebrate_show_pinterest_share', true, true ) ? true : false; 
		$celebrate_show_mail_share       = celebrate_option( 'celebrate_show_mail_share', true, true ) ? true : false; 
?>
<div class="tc-social-share clearfix">
	<ul>
		<?php if( $celebrate_show_facebook_share ) { ?>
		<li><a href="http://www.facebook.com/sharer.php?u=<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-facebook"><?php echo esc_attr_e('Facebook', 'celebrate'); ?></a></li>
		<?php } ?>
		<?php if( $celebrate_show_twitter_share ) { ?>
		<li> <a href="http://twitter.com/home?status=<?php the_title(); ?> <?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-twitter"><?php echo esc_attr_e('Twitter', 'celebrate'); ?></a></li>
		<?php } ?>
		<?php if( $celebrate_show_googleplus_share ) { ?>
		<li><a href="https://plus.google.com/share?url=<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-googleplus"><?php echo esc_attr_e('Googleplus', 'celebrate'); ?></a></li>
		<?php } ?>
		<?php if( $celebrate_show_linkedin_share ) { ?>
		<li><a href="http://linkedin.com/shareArticle?url=<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="share-linkedin"><?php echo esc_attr_e('Linkedin', 'celebrate'); ?></a></li>
		<?php } ?>
		<?php if( $celebrate_show_pinterest_share ) { ?>
		<?php $pinterestimage = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'full' ); ?>
		<li><a href="http://pinterest.com/pin/create/button/?url=<?php echo urlencode(get_permalink()); ?>&amp;description=<?php the_title(); ?>&amp;media=<?php echo urlencode($pinterestimage[0]); ?>" class="share-pinterest"><?php echo esc_attr_e('Pinterest', 'celebrate'); ?></a></li>
		<?php } ?>
		<?php if( $celebrate_show_mail_share ) { ?>
		<li><a href="mailto:?subject=<?php the_title(); ?>&amp;body=<?php the_permalink(); ?>" class="share-mail"><?php echo esc_attr_e('Mail', 'celebrate'); ?></a></li>
		<?php } ?>
	</ul>
</div>
<?php	}
	} 	
