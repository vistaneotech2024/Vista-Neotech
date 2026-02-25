<?php 
/**
 * Custom styles through options panel
 */
if ( ! function_exists( 'celebrate_custom_inline_styles' ) ) :
	function celebrate_custom_inline_styles() {
		wp_enqueue_style( 'celebrate-inline-style', get_template_directory_uri() . '/css/custom_script.css' );
	
		// Custom Styles
		$celebrate_custom_css_output = '';
		$celebrate_onepage_header_height = '';
		$celebrate_menu_typography_color_onepage = '';
		$celebrate_menu_border_onepage = '';
		$celebrate_dropdown_background_onepage = '';
		$celebrate_menu_border = '';
		$celebrate_dropdown_background = '';
		$celebrate_primary_header_height = '';
		$celebrate_layout_responsive = '';
		$celebrate_sticky_header_height = '';
		$celebrate_woocommerce_shop_columns = '';
		$celebrate_woocommerce_related_products_column = '';
		$celebrate_overlay_value = '';
		$celebrate_page_header_padding = '';
		$celebrate_page_header_top_padding = '';
		$celebrate_page_header_bottom_padding = '';
		$celebrate_theme_tab_color = '';
		$celebrate_themebase_color_first_value = '';
		$celebrate_themebase_color_second_value = '';
		$celebrate_themebase_color_third_value = '';
		$celebrate_page_dimensions = '';
		$celebrate_custom_css = '';
	
		// is_onepage_template
		if( is_page_template('template-one-page.php') ) { 
			// one oage header height
			if( '' != celebrate_option( 'celebrate_onepage_header_height' ) ) {
				$celebrate_onepage_header_height .= '#header-one-page .sf-menu li a { height: ' . esc_attr( celebrate_option( 'celebrate_onepage_header_height' ) ) . 'px; line-height: ' . esc_attr( celebrate_option( 'celebrate_onepage_header_height' ) ) . 'px }'; 
			}
			// one page menu color on load	
			if( '' != celebrate_option( 'celebrate_menu_typography_color_onepage' ) ) {
					$celebrate_menu_typography_color_onepage .= '#header-one-page.hsticky-initial .sf-menu a { color: ' . esc_attr( celebrate_option( 'celebrate_menu_typography_color_onepage' ) ) . '; }'; 	
			}
			// one page menu border
			if( '' != celebrate_option( 'celebrate_menu_border_onepage' ) ) {
					$celebrate_menu_border_onepage .= '#header-one-page .sf-menu > li.megamenu > ul.sub-menu > li, #header-one-page .sf-menu ul li { border-color: ' . esc_attr( celebrate_option( 'celebrate_menu_border_onepage' ) ) . '; }'; 	
			}
			// one page menu dropdown
			if( '' != celebrate_option( 'celebrate_dropdown_background_onepage' ) ) {
					$celebrate_dropdown_background_onepage .= '#header-one-page .sf-menu ul { background-color: ' . esc_attr( celebrate_option( 'celebrate_dropdown_background_onepage' ) ) . '; } #header-one-page .sf-menu ul::before { border-bottom-color: ' . esc_attr( celebrate_option( 'celebrate_dropdown_background_onepage' ) ) . '; }'; 	
			}
		} // is_onepage_template
		
		// main menu border
		if( '' != celebrate_option( 'celebrate_menu_border' ) ) {
					$celebrate_menu_border .= '#header-one-page .sf-menu > li.megamenu > ul.sub-menu > li, #header-one-page .sf-menu ul li { border-color: ' . esc_attr( celebrate_option( 'celebrate_menu_border' ) ) . '; }'; 	
		}
		// main menu dropdown
		if( '' != celebrate_option( 'celebrate_dropdown_background' ) ) {
					$celebrate_dropdown_background .= '.sf-menu ul { background-color: ' . esc_attr( celebrate_option( 'celebrate_dropdown_background' ) ) . '; } .sf-menu ul::before { border-bottom-color: ' . esc_attr( celebrate_option( 'celebrate_dropdown_background' ) ) . '; }'; 	
		}	
			
		// primary header height
		if( '' != celebrate_option( 'celebrate_primary_header_height' ) ) {
			$celebrate_primary_header_height .= '.sf-menu:first-child > li a { height: ' . esc_attr( celebrate_option( 'celebrate_primary_header_height' ) ) . 'px; line-height: ' . esc_attr( celebrate_option( 'celebrate_primary_header_height' ) ) . 'px }'; 
		}
		
		// responsive layout
		if( celebrate_option( 'celebrate_layout_responsive', '0' ) == '0' ) {
			$celebrate_layout_responsive .= 'html, body { overflow-x: visible; }'; 
		}
		
		// sticky header height
		if( '' != celebrate_option( 'celebrate_sticky_header_height' ) ) {
			$celebrate_sticky_header_height .= '#header-sticky .sf-menu:first-child > li a { height: ' . esc_attr( celebrate_option( 'celebrate_sticky_header_height' ) ) . 'px; line-height: ' . esc_attr( celebrate_option( 'celebrate_sticky_header_height' ) ) . 'px }'; 
		}
	
		// woo shop columns
		if( celebrate_option( 'celebrate_woocommerce_shop_columns' ) == '4' ) {
			$celebrate_woocommerce_shop_columns .= '.woocommerce-page.post-type-archive-product ul.products li.product, .woocommerce-page.archive.tax-product_cat ul.products li.product { width:22.15%; }'; 
		} elseif( celebrate_option( 'celebrate_woocommerce_shop_columns' ) == '2' ) {
			$celebrate_woocommerce_shop_columns .= '.woocommerce-page.post-type-archive-product ul.products li.product, .woocommerce-page.archive.tax-product_cat ul.products li.product { width:48.1%; }'; 
		} else {
			$celebrate_woocommerce_shop_columns .= '.woocommerce-page.post-type-archive-product ul.products li.product, .woocommerce-page.archive.tax-product_cat ul.products li.product { width:30.8%; }'; 
		}
	
		// woo related product columns
		if( celebrate_option( 'celebrate_woocommerce_related_products_column' ) == '4' ) {
			$celebrate_woocommerce_related_products_column .= '.woocommerce .related ul li.product, .woocommerce .related ul.products li.product, .woocommerce .upsells.products ul li.product, .woocommerce .upsells.products ul.products li.product, .woocommerce-page .related ul li.product, .woocommerce-page .related ul.products li.product, .woocommerce-page .upsells.products ul li.product, .woocommerce-page .upsells.products ul.products li.product { width:22.15%; }'; 
		} elseif( celebrate_option( 'celebrate_woocommerce_related_products_column' ) == '2' ) {
			$celebrate_woocommerce_related_products_column .= '.woocommerce .related ul li.product, .woocommerce .related ul.products li.product, .woocommerce .upsells.products ul li.product, .woocommerce .upsells.products ul.products li.product, .woocommerce-page .related ul li.product, .woocommerce-page .related ul.products li.product, .woocommerce-page .upsells.products ul li.product, .woocommerce-page .upsells.products ul.products li.product { width:48.1%; }'; 
		} else {
			$celebrate_woocommerce_related_products_column .= '.woocommerce .related ul li.product, .woocommerce .related ul.products li.product, .woocommerce .upsells.products ul li.product, .woocommerce .upsells.products ul.products li.product, .woocommerce-page .related ul li.product, .woocommerce-page .related ul.products li.product, .woocommerce-page .upsells.products ul li.product, .woocommerce-page .upsells.products ul.products li.product { width:30.8%; }'; 
		}
	
		// page title overlay
		if( '' != celebrate_option( 'celebrate_overlay_value' ) ) {
			$celebrate_overlay_value .= '#page-header { box-shadow: inset 0px 0px 0 2000px rgba(0,0,0,' . esc_attr( celebrate_option( 'celebrate_overlay_value' ) ) . '); }'; 	
		}
		// page title padding
		if( '' != celebrate_option( 'celebrate_page_header_top_padding' ) || '' != celebrate_option( 'celebrate_page_header_bottom_padding' ) ) {
			$celebrate_page_header_top_padding .= '#page-header { padding-top: ' . esc_attr( celebrate_option( 'celebrate_page_header_top_padding' ) ) . 'px!important; }';
			$celebrate_page_header_bottom_padding .= '#page-header { padding-bottom: ' . esc_attr( celebrate_option( 'celebrate_page_header_bottom_padding' ) ) . 'px!important; }';  		$celebrate_page_header_padding .= '@media (min-width: 1200px) { ' . $celebrate_page_header_top_padding . '' . $celebrate_page_header_bottom_padding. ' }'; 
		}
	
		// tab / accordion colors
		if( '' != celebrate_option( 'celebrate_theme_tab_color' ) ) {
			$celebrate_theme_tab_color .= '.theme-tabs .vc_tta-tab.vc_active a, .theme-tabs .vc_active .vc_tta-panel-title a, .woocommerce div.product .woocommerce-tabs ul.tabs li.active a { color: ' . esc_attr( celebrate_option( 'celebrate_theme_tab_color' ) ) . '!important; } .theme-tabs .vc_tta-tab.vc_active, .theme-tabs .vc_tta-color-grey.vc_tta-style-classic .vc_active .vc_tta-panel-heading, .woocommerce div.product .woocommerce-tabs ul.tabs li.active a { border-top-color: ' . esc_attr( celebrate_option( 'celebrate_theme_tab_color' ) ) . '!important; } .theme-tabs .vc_tta-tabs-position-left .vc_tta-tab.vc_active { border-left-color: ' . esc_attr( celebrate_option( 'celebrate_theme_tab_color' ) ) . '!important; } .theme-tabs .vc_tta-tabs-position-right .vc_tta-tab.vc_active { border-right-color: ' . esc_attr( celebrate_option( 'celebrate_theme_tab_color' ) ) . '!important; } .theme-tabs .vc_tta-color-grey.vc_tta-style-classic .vc_active .vc_tta-panel-heading .vc_tta-controls-icon::after, .theme-tabs .vc_tta-color-grey.vc_tta-style-classic .vc_active .vc_tta-panel-heading .vc_tta-controls-icon::before { border-color: ' . esc_attr( celebrate_option( 'celebrate_theme_tab_color' ) ) . '!important; }'; 
		}
		
		// first themebase color
		if( '' != celebrate_option( 'celebrate_themebase_color_first_value' ) ) {
			$celebrate_themebase_color_first_value .= '#take-to-top, .custom-tagcloud a:hover, .tcsn-theme .owl-dots .owl-dot.active span, .tcsn-theme .owl-prev::after, .tcsn-theme .owl-next::after, .slicknav_menu { background-color: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_first_value' ) ) . '; } .pagination-folio-page span, .pagination-folio-page a, .page-links a, .woocommerce-pagination a.page-numbers, .woocommerce-pagination .page-numbers span, .prtb-price { color: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_first_value' ) ) . '; }'; 	
		}	
		
		// second themebase color
		if( '' != celebrate_option( 'celebrate_themebase_color_second_value' ) ) {
			$celebrate_themebase_color_second_value .= '.tc-sticky-post, .pagination-folio-page span:hover, .pagination-folio-page .current-folio-page, .page-links a:hover, .page-link-current, .tc-search-submit, .tc-arrow-infobox-content, .tc-info-highlight, .tc-counter-iconbg, .tc-highlight, .tc-sup-highlight, .woocommerce-pagination a.page-numbers:hover, .woocommerce-pagination .page-numbers.current, .prtb-footnote, .tc-social.tc-social-square li a:hover, .tc-social.tc-social-circle li a:hover, .tc-social-share li a:hover, .woocommerce .widget_price_filter .ui-slider .ui-slider-handle { background: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_second_value' ) ) . '; } blockquote.tc-blockquote-icon::before, .widget_nav_menu li a:hover, .widget_nav_menu .current-menu-item a, .widget_recent_entries ul li a::before, .widget_archive ul li::before, .widget_categories ul li::before, .tc-process-tagline, .prtb-title, .tc-timeline li h4 span, .tc-testimonial-tagline, .woocommerce .price, .woocommerce .stock { color: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_second_value' ) ) . '!important; } .woocommerce-pagination .page-numbers.current { border-color: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_second_value' ) ) . '; } '; 	
		}	
		
		// third themebase color
		if( '' != celebrate_option( 'celebrate_themebase_color_third_value' ) ) {
			$celebrate_themebase_color_third_value .= '.widget_archive ul li::before, .widget_categories ul li::before, .tc-pf-quote blockquote, .tc-pf-link-content, .tc-timeline li:hover h4::before { background: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_first_value' ) ) . '; } .tc-process-item:hover .process-img { background: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_first_value' ) ) . '!important; } .tc-social-share li a, .tc-filter-nav a:hover, .tc-filter-nav li a.active { color: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_first_value' ) ) . '; } .custom-tagcloud a { color: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_first_value' ) ) . '!important; } .tc-timeline li:hover h4::before { border-color: ' . esc_attr( celebrate_option( 'celebrate_themebase_color_first_value' ) ) . '; }'; 	
		}	
	
		// page title padding
		if('' != celebrate_option( 'celebrate_main_container_width' ) || '' != celebrate_option( 'celebrate_content_width' ) || '' != celebrate_option( 'celebrate_sidebar_width' )) 	{   		
			$celebrate_page_dimensions .= '@media (min-width: 1200px) { .main-container, .vc_row-fluid.main-container{ width: ' . esc_attr( celebrate_option( 'celebrate_main_container_width' ) ) . 'px; } .content-area{ width: ' . esc_attr( celebrate_option( 'celebrate_content_width' ) ) . 'px; } #sidebar{ width: ' . esc_attr( celebrate_option( 'celebrate_sidebar_width' ) ) . 'px; } }'; 
		}
		
		// custom css via theme options
		if( '' != celebrate_option( 'celebrate_custom_css' ) ) {
			$celebrate_custom_css .= '' . esc_attr( celebrate_option( 'celebrate_custom_css' ) ) . ''; 	
		}

		// page title background styles
		$page_title_style 			= '';
		$bg_image 					= '';
		$bg_image_style 			= '';
		$header_bg_image_overlay	= '';
		
		$bg_image       			= get_post_meta( get_the_ID(), '_celebrate_page_header_bg_image', true );
		$bg_image_style 			= get_post_meta( get_the_ID(), '_celebrate_page_header_bg_image_style', true );
		$header_bg_image_overlay	= get_post_meta( get_the_ID(), '_celebrate_page_header_bg_image_overlay', true );
		
		if( $header_bg_image_overlay != '' ) {
		$return_header_bg_image_overlay = 'box-shadow: inset 0px 0px 0 2000px rgba(0,0,0,'. $header_bg_image_overlay .') !important;';
  		} else {
		$return_header_bg_image_overlay = '';
		}

		// Background image
		if ( $bg_image ) {
			if ( $bg_image_style == 'repeat' || $bg_image_style == '' ) {
				$page_title_style .= '#page-header { background: url('.  esc_url( $bg_image ) .') repeat !important; ' . esc_attr ( $return_header_bg_image_overlay ) . '}';
			}
			if ( $bg_image_style == 'stretched' ) {
				$page_title_style .= '#page-header { background: url('. esc_url( $bg_image ) .') no-repeat center center !important; background-size: cover !important; ' . esc_attr ( $return_header_bg_image_overlay ) . '}';
			}
			if ( $bg_image_style == 'fixed' ) {
				$page_title_style .= '#page-header { background: url('.  esc_url( $bg_image ) .') no-repeat center top fixed  !important; ' . esc_attr ( $return_header_bg_image_overlay ) . '}';
			}
		} // Background image
		// page title background styles
	
	// custom css output	
	$celebrate_custom_css_output = '' . $celebrate_onepage_header_height . '' . $celebrate_menu_typography_color_onepage . '' . $celebrate_dropdown_background_onepage . '' . $celebrate_menu_border . '' . $celebrate_dropdown_background . '' . $celebrate_primary_header_height . '' . $celebrate_layout_responsive . '' . $celebrate_sticky_header_height . '' . $celebrate_woocommerce_shop_columns . '' . $celebrate_woocommerce_related_products_column . '' . $celebrate_overlay_value . '' . $celebrate_page_header_padding . '' . $celebrate_theme_tab_color . '' . $celebrate_themebase_color_first_value . '' . $celebrate_themebase_color_second_value . '' . $celebrate_themebase_color_third_value . '' . $celebrate_page_dimensions . '' . $celebrate_custom_css . '' . $page_title_style . '';
	
		wp_add_inline_style( 'celebrate-inline-style', $celebrate_custom_css_output );
	} 
endif;
add_action( 'wp_enqueue_scripts', 'celebrate_custom_inline_styles', 30 );

