<?php
/**
 * Template Name: Portfolio - 3 Column
 * The Template for displaying 3 column portfolio
 */
get_header(); 
$celebrate_portfolio_style = celebrate_option( 'celebrate_portfolio_style', true, true ) ? true : false; 
$celebrate_portfolio_filter = celebrate_option( 'celebrate_portfolio_filter', true, true ) ? true : false; 

if ( $celebrate_portfolio_style )  {
	$return_style = ' tc-portfolio-compact';
} else {
	$return_style = '';
}
?>
<div id="content-wrapper" class="main-container clearfix <?php echo esc_attr( celebrate_get_layout_class() ); ?>">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_padding_classes() ); ?>" role="main">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			<?php the_content(); ?>
			<?php endwhile; endif; ?>
			<?php if (get_query_var('paged')) { 
					$paged = get_query_var('paged'); 
				} elseif (get_query_var('page')) { 
    				$paged = get_query_var('page'); 
				} else { 
    				$paged = 1; 
				} ?>
			<?php
		$args = array(
			'post_type'      => 'tcsn_portfolio',        
			'posts_per_page' => (  esc_attr( celebrate_option( 'celebrate_portfolio_items_per_page' ) ) ?  esc_attr( celebrate_option( 'celebrate_portfolio_items_per_page' ) ) : 9),
			'paged'          => $paged, 
			'order'          => (  esc_attr( celebrate_option( 'celebrate_portfolio_arrange' ) ) ?   esc_attr( celebrate_option( 'celebrate_portfolio_arrange' ) ) : 'DESC'),   
			'orderby'        => (  esc_attr( celebrate_option( 'celebrate_portfolio_sort' ) ) ?   esc_attr( celebrate_option( 'celebrate_portfolio_sort' ) ) : 'date'),   
		);
		
		$portfolio_cats ='';
		if( $portfolio_cats && $portfolio_cats[0] == 0 ) {
			unset( $portfolio_cats[0] );
		}
		if( $portfolio_cats ){
			$args['tax_query'][] = array(
				'taxonomy'	=> 'tcsn_portfoliotags',
				'terms' 	=> $portfolio_cats,
				'field' 	=> 'term_id',
			);
		}
		$loop = new WP_Query( $args );
		
		$portfolio_taxs = '';
		$filtered_taxs = '';
		
		if( is_array( $loop->posts ) && !empty( $loop->posts ) ) {
			foreach( $loop->posts as $loop_post ) {
				$post_taxs = wp_get_post_terms( $loop_post->ID, 'tcsn_portfoliotags', array( "fields" => "all" ) );
				if( is_array( $post_taxs ) && !empty( $post_taxs ) ) {
					foreach( $post_taxs as $post_tax ) {
						if( is_array( $portfolio_cats ) && !empty( $portfolio_cats ) && ( in_array($post_tax->term_id, $portfolio_cats) || in_array( $post_tax->parent, $portfolio_cats )) )  						{
							$portfolio_taxs[urldecode( $post_tax->slug) ] = $post_tax->name;
						}
						if( empty( $portfolio_cats ) || !isset( $portfolio_cats ) ) {
							$portfolio_taxs[urldecode( $post_tax->slug )] = $post_tax->name;
						}
					}
				}
			}
		}

		$terms = get_terms( 'tcsn_portfoliotags' );
		if( !empty( $terms ) && is_array( $terms ) ) {
			foreach( $terms as $term ) {
				if( is_array( $portfolio_taxs ) && array_key_exists ( urldecode( $term->slug ) , $portfolio_taxs ) ) {
					$filtered_taxs[urldecode( $term->slug )] = $term->name;
				}
			}
		}

		$portfolio_taxs = $filtered_taxs;
		$portfolio_category = get_terms( 'tcsn_portfoliotags' );
		if( is_array( $portfolio_taxs ) && !empty( $portfolio_taxs ) ):
		if ( $celebrate_portfolio_filter ) { ?>
			<div class="tc-filter-nav-wrapper tc-portfolio-template-filter">
				<ul class="tc-filter-nav clearfix">
					<?php $all = esc_html__( 'All', 'celebrate' ); ?>
					<li><a class="filter-all active" data-filter="*" href="#"><?php echo esc_attr( $all ) ?></a></li>
					<?php foreach( $portfolio_taxs as $portfolio_tax_slug => $portfolio_tax_name ): ?>
					<li><a data-filter=".<?php echo esc_attr( $portfolio_tax_slug ); ?>" href="#"><?php echo esc_attr( $portfolio_tax_name ); ?></a></li>
					<?php endforeach; ?>
				</ul>
			</div>
			<div class="clearfix"></div>
			<?php } endif; ?>
			<div class="tc-portfolio-grid tc-portfolio tc-portfolio-grid-3col<?php echo esc_attr( $return_style ) ?>">
				<div id="items" class="filter-content">
					<?php
				while( $loop->have_posts() ): $loop->the_post();
				$filter_classes = '';
				$item_cats = get_the_terms(  get_the_ID(), 'tcsn_portfoliotags' );
				if( $item_cats ):
				foreach( $item_cats as $item_cat ) {
					$filter_classes .= urldecode( $item_cat->slug ) . ' ';
				}
				endif;
			?>
					<div class="tc-portfolio-item isotope-item <?php echo esc_attr( $filter_classes ); ?> all">
						<?php $celebrate_portfolio_type = get_post_meta( get_the_ID(), '_celebrate_portfolio_type', true ); ?>
						<?php 
					 	switch ( $celebrate_portfolio_type ) {
						case 'Image': ?>
						<?php get_template_part( 'includes/templates/portfolio-item' ); ?>
						<?php break; // end image ?>
						<?php case 'Video': ?>
						<?php get_template_part( 'includes/templates/portfolio-video-item' ); ?>
						<?php break; // end video ?>
						<?php case 'Audio': ?>
						<?php get_template_part( 'includes/templates/portfolio-item' ); ?>
						<?php break; // end audio ?>
						<?php case 'Gallery': ?>
						<?php get_template_part( 'includes/templates/portfolio-item' ); ?>
						<?php break; // end gallery ?>
						<?php default: ?>
						<?php get_template_part( 'includes/templates/portfolio-item' ); ?>
						<?php } //end switch ?>
					</div>
					<?php endwhile; ?>
				</div>
			</div>
			<div class="clearfix"></div>
			<?php celebrate_pagination( $loop->max_num_pages, $range = 2 ); ?>
		</div>
	</div>
	<!-- #primary -->
	<aside id="sidebar" role="complementary">
	<?php if ( is_active_sidebar( 'widgets-portfolio' ) ) { dynamic_sidebar( 'widgets-portfolio' ); } ?>
	</aside>
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>