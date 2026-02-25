<?php
/**
 * The Page header
 */
// Page header hook
function celebrate_page_header_hook() {
	do_action( 'celebrate_page_header_hook' );
}
add_action( 'celebrate_page_header_hook', 'celebrate_default_page_header_hook' );

if( ! function_exists( 'celebrate_default_page_header_hook' ) ) {
	function celebrate_default_page_header_hook() {
		celebrate_page_header();
	}
}

// Page Title
if ( ! function_exists('celebrate_page_title') ) {
	function celebrate_page_title( $page_title='' ) {
		// Archives   
		if ( is_home() ) { 
				$page_title = celebrate_option( 'celebrate_blog_title', esc_html__( 'Blog', 'celebrate' ) );
		} elseif ( is_archive() ) {
			// Daily archive
			if ( is_day() ) {
				$page_title = sprintf( esc_html__( 'Daily Archives: %s', 'celebrate' ), get_the_date() );
			// Monthly archive
			} elseif ( is_month() ) {
				$page_title = sprintf( esc_html__( 'Monthly Archives: %s', 'celebrate' ), get_the_date( _x( 'F Y', 'monthly archives date format', 'celebrate' ) ) );	
			// Yearly archive
			} elseif ( is_year() ) {
				$page_title = sprintf( esc_html__( 'Yearly Archives: %s', 'celebrate' ), get_the_date( _x( 'Y', 'yearly archives date format', 'celebrate' ) ) );	
			//Author
			} elseif ( is_author() ) { 
         $page_title = sprintf( esc_html__( 'All posts by %s', 'celebrate' ), get_the_author() );

			// Standard title
			} else {
				$page_title = single_term_title("", false);
				if ( $page_title == '' ) {
					$post_id = get_the_ID();
					$page_title = get_the_title( $post_id );
				}
			}
		// Search
		} elseif( is_search() ) {
			$page_title =  sprintf( esc_html__( ' Search Results : %s', 'celebrate' ), get_search_query() );   
		// else
		} else {
			$post_id = get_the_ID();
			$page_title = get_the_title( $post_id );
		}
		return esc_attr( $page_title );
	} 
} 

// Page Header
if ( ! function_exists( 'celebrate_page_header' ) ) {
	function celebrate_page_header() {
		if ( is_singular( array( 'tcsn_portfolio', 'tcsn_team', 'tcsn_testimonial' ) ) ) return;
		if ( is_single() ) return;
		if ( is_404() ) return;
		if ( is_page_template('template-no-page-header.php')  ) return;
		
		// Return if WooCommerce
		if ( function_exists('is_woocommerce') ) {
			if ( is_woocommerce() && !is_singular( 'page' ) ) return;
		}
		
		// Page title
global $post;
$page_title						= celebrate_page_title();
$celebrate_show_page_tagline	= celebrate_option( 'celebrate_show_page_tagline', true, true ) ? true : false; 
$celebrate_show_breadcrumb		= celebrate_option( 'celebrate_show_breadcrumb', true, true ) ? true : false; ?>
<div id="page-header">
	<div class="main-container clearfix">
		<div class="tc-page-info">
			<h3 class="page-title entry-title"> <?php echo esc_attr( $page_title ); ?> </h3>
			<?php if( $celebrate_show_page_tagline && !is_search() ) { ?>
			<span class="tc-page-tagline">
			<?php $page_tagline = get_post_meta( $post->ID, '_celebrate_page_tagline', true ); 
			if( $page_tagline != "" ) { 
			 	echo esc_attr( $page_tagline ); 
			} else { 
				echo esc_attr( celebrate_option( 'celebrate_page_tagline', esc_html__( 'Company Tagline Goes Here', 'celebrate' ) ) ); 
		 	} ?>
			</span>
			<?php } ?>
		</div>
		<?php if( $celebrate_show_breadcrumb ) { get_template_part( 'includes/templates/headers/breadcrumb' ); } ?>
	</div>
</div>
<?php	
    } 
}