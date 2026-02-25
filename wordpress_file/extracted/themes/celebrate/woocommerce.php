<?php
/**
 * The template for woocommerce.
 */
get_header();
$celebrate_page_header_woo 		= celebrate_option( 'celebrate_page_header_woo', true, true ) ? true : false; 
$celebrate_breadcrumb_woo 		= celebrate_option( 'celebrate_breadcrumb_woo', true, true ) ? true : false;
$celebrate_show_page_tagline	= celebrate_option( 'celebrate_show_page_tagline', true, true ) ? true : false; 
$celebrate_product_social_share	= celebrate_option( 'celebrate_product_social_share', true, true ) ? true : false; 
?>
<?php if( $celebrate_page_header_woo || $celebrate_breadcrumb_woo ) { ?>
<div id="page-header-wrapper" class="clearfix">
	<?php if( $celebrate_page_header_woo ) { ?>
	<div id="page-header" class="clearfix">
		<div class="main-container clearfix">
			<div class="tc-page-info">
				<h3 class="page-title entry-title">
					<?php if( celebrate_option( 'celebrate_woocommerce_shop_title' ) != "" && is_single() || is_shop() ) { ?>
					<?php echo esc_attr( celebrate_option( 'celebrate_woocommerce_shop_title' ) ); ?>
					<?php } else { ?>
					<?php echo esc_attr( get_the_archive_title() ); ?>
					<?php } ?>
				</h3>
				<?php if( $celebrate_show_page_tagline ) { ?>
				<span class="tc-page-tagline">
				<?php  echo  esc_attr( celebrate_option( 'celebrate_page_tagline', esc_html__( 'How we work with our clients', 'celebrate' ) ) ); ?>
				</span>
				<?php } ?>
			</div>
			<?php if( $celebrate_breadcrumb_woo ) { get_template_part( 'includes/templates/headers/breadcrumb' ); } ?>
		</div>
	</div>
	<!-- #page header -->
	<?php } ?>
</div>
<?php } ?>
<div id="content-wrapper" class="main-container clearfix <?php echo esc_attr( celebrate_get_woocommerce_layout_class() ); ?>">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_woo_padding_classes() ); ?>" role="main">
			<?php  if( celebrate_is_woocommerce_activated() ) { woocommerce_content(); } ?>
		</div>
	</div>
	<!-- #primary -->
	<?php if ( celebrate_woocommerce_sidebar() ) { ?>
	<aside id="sidebar" role="complementary">
		<?php dynamic_sidebar('widgets-woocommerce'); ?>
	</aside>
	<?php } ?>
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>
