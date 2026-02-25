<?php
/**
 * The template for displaying Portfolio item content
 */
$celebrate_link_target           	= celebrate_option( 'celebrate_link_target', true, true ) ? true : false; 
$celebrate_zoom_on_hover          	= celebrate_option( 'celebrate_zoom_on_hover', true, true ) ? true : false; 
$celebrate_link_on_hover          	= celebrate_option( 'celebrate_link_on_hover', true, true ) ? true : false; 
$celebrate_portfolio_hrheading    	= celebrate_option( 'celebrate_portfolio_hrheading', true, true ) ? true : false; 
$celebrate_portfolio_heading      	= celebrate_option( 'celebrate_portfolio_heading', true, true ) ? true : false; 
$celebrate_portfolio_heading_link	= celebrate_option( 'celebrate_portfolio_heading_link', true, true ) ? true : false; 
$celebrate_portfolio_excerpt      	= celebrate_option( 'celebrate_portfolio_excerpt', true, true ) ? true : false; 
$celebrate_portfolio_hover        	= celebrate_option( 'celebrate_portfolio_hover', true, true ) ? true : false; 
$celebrate_portfolio_img_scale    	= celebrate_option( 'celebrate_portfolio_img_scale', true, true ) ? true : false; 
$celebrate_portfolio_img_size  	  	= celebrate_option( 'celebrate_portfolio_img_size' );
// image size
if ( $celebrate_portfolio_img_size ) {
	$return_celebrate_portfolio_img_size = $celebrate_portfolio_img_size;
} else { 
	$return_celebrate_portfolio_img_size = 'full';
}
// link target
if( $celebrate_link_target ) {
	$return_target = '';
} else {
	$return_target = '';
}
// zoom / link
if ($celebrate_portfolio_img_scale ) {
	$return_scale = ' tc-img-scale';
} else { 
	$return_scale = ''; 
}

if( $celebrate_zoom_on_hover && $celebrate_link_on_hover ){
	$return_icon_position = ' tc-duo';
} else { 
	$return_icon_position = '';
} 
?>
<?php if (  has_post_thumbnail() || $celebrate_portfolio_heading || $celebrate_portfolio_excerpt ) { ?>
<div class="tc-up-hover<?php echo esc_attr( $return_scale ) ?><?php echo esc_attr( $return_icon_position ) ?>">
	<div class="tc-hover-wrapper">
		<?php if ( has_post_thumbnail() ) : ?>
		<div class="tc-hover-image">
			<?php the_post_thumbnail( $return_celebrate_portfolio_img_size ); ?>
			<?php if ( $celebrate_zoom_on_hover ) { ?>
			<a class="tc-media-zoom" href="<?php the_post_thumbnail_url( 'full' ); ?>" title="<?php echo esc_attr( get_post_meta( get_the_ID(), '_celebrate_zoom_title', true ) ); ?>" data-rel="prettyPhoto"></a>
			<?php } ?>
			<?php if ( $celebrate_link_on_hover ) { ?>
			<?php if ( get_post_meta( get_the_ID(), '_celebrate_external_link', true ) == true ) { ?>
			<a class="tc-media-link"  href="<?php echo esc_url( get_post_meta( get_the_ID(), '_celebrate_link_url', true ) ); ?>"<?php echo esc_attr( $return_target )?>></a>
			<?php } else { ?>
			<a class="tc-media-link" href="<?php the_permalink(); ?>"<?php echo esc_attr($return_target)?>></a>
			<?php } ?>
			<?php } ?>
		</div>
		<?php if ( $celebrate_portfolio_hover ) { ?>
		<div class="tc-hover-content">
			<?php if ( $celebrate_portfolio_hrheading ) : ?>
			<?php if ( $celebrate_portfolio_hrheading && $celebrate_portfolio_heading_link ) { ?>
			<?php if ( get_post_meta( get_the_ID(), '_celebrate_external_link', true ) == true ) { ?>
			<h5 class="tc-folio-title"><a href="<?php echo esc_url( get_post_meta( get_the_ID(), '_celebrate_link_url', true ) ); ?>"<?php echo esc_attr( $return_target )?>>
				<?php the_title(); ?>
				</a></h5>
			<?php } else { ?>
			<h5 class="tc-folio-title"><a href="<?php the_permalink(); ?>"<?php echo esc_attr( $return_target )?>>
				<?php the_title(); ?>
				</a></h5>
			<?php } ?>
			<?php } else { ?>
			<h5 class="tc-folio-title">
				<?php the_title(); ?>
			</h5>
			<?php } ?>
			<?php endif; ?>
		</div>
		<?php } ?>
		<?php endif; ?>
	</div>
</div>
<?php if ( $celebrate_portfolio_heading || $celebrate_portfolio_excerpt ) { ?>
<div class="tc-portfolio-excerpt-wrapper">
	<?php } ?>
	<?php if ( $celebrate_portfolio_heading ) : ?>
	<?php if ( $celebrate_portfolio_heading && $celebrate_portfolio_heading_link ) { ?>
	<?php if ( get_post_meta( get_the_ID(), '_celebrate_external_link', true ) == true ) { ?>
	<h4 class="pf-heading"><a href="<?php echo esc_url( get_post_meta( get_the_ID(), '_celebrate_link_url', true ) ); ?>"<?php echo esc_attr( $return_target )?>>
		<?php the_title(); ?>
		</a></h4>
	<?php } else { ?>
	<h4 class="pf-heading"><a href="<?php the_permalink(); ?>"<?php echo esc_attr( $return_target )?>>
		<?php the_title(); ?>
		</a></h4>
	<?php } ?>
	<?php } else { ?>
	<h4 class="pf-heading">
		<?php the_title(); ?>
	</h4>
	<?php } ?>
	<?php endif; ?>
	<?php if( $celebrate_portfolio_excerpt ){ ?>
	<div class="tc-portfolio-excerpt">
		<?php the_excerpt(); ?>
	</div>
	<?php } ?>
	<?php if ( $celebrate_portfolio_heading || $celebrate_portfolio_excerpt ) { ?>
</div>
<?php } ?>
<?php } ?>