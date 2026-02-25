<?php
/**
 * The Logo
 */
?>
<div class="tc-logo">
	<?php if ( celebrate_option( 'celebrate_logo_type' ) == "celebrate_show_image_logo") { ?>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php bloginfo('title'); ?>"><img src="<?php echo esc_url( celebrate_image_option( 'celebrate_image_logo' ) ); ?>" alt="<?php bloginfo('title'); ?>"></a>
	<?php } elseif ( celebrate_option( 'celebrate_logo_type' ) == "celebrate_show_text_logo") { ?>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php bloginfo('title'); ?>"><?php echo esc_attr( celebrate_option( 'celebrate_text_logo' ) ); ?></a>
	<?php } else { ?>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php bloginfo('title'); ?>">
	<?php bloginfo('title'); ?>
	</a>
	<?php } ?>
</div>