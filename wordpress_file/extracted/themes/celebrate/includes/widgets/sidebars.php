<?php
/**
 * Registers widget areas.
 */
if ( ! function_exists('celebrate_widgets_init') ) {

	// Register Sidebar
	function celebrate_widgets_init()  {
		
		// Blog Widgets
		register_sidebar( array(
			'name'          => esc_html__( 'Blog Sidebar', 'celebrate' ),
			'id'            => 'widgets-blog',
			'description'   => esc_html__( 'This area will be shown as a post sidebar. Widgets will be stacked in this column.', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );
		
		// Portfolio Widgets
		register_sidebar( array(
			'name'          => esc_html__( 'Portfolio Sidebar', 'celebrate' ),
			'id'            => 'widgets-portfolio',
			'description'   => esc_html__( 'This area will be shown as a portfolio grid page sidebar. Widgets will be stacked in this column.', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );
	
		// Page Widgets
		register_sidebar( array(
			'name'          => esc_html__( 'Page Sidebar', 'celebrate' ),
			'id'            => 'widgets-page',
			'description'   => esc_html__( 'This area will be shown as a page sidebar. Widgets will be stacked in this column.', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );

		// Header Social Widget
		register_sidebar( array(
			'name'          => esc_html__( 'Header Social Icons', 'celebrate' ),
			'id'            => 'widget-social-network',
			'description'   => esc_html__( 'Widgets in this column will appear in header section,', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );
		
		// Footer column 1
		register_sidebar( array(
			'name'          => esc_html__( 'Footer-Column-1', 'celebrate' ),
			'id'            => 'footer-column-1',
			'description'   => esc_html__( 'Widgets in this column will appear in first footer column.', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );
		
		// Footer column 2
		register_sidebar( array(
			'name'          => esc_html__( 'Footer-Column-2', 'celebrate' ),
			'id'            => 'footer-column-2',
			'description'   => esc_html__( 'Widgets in this column will appear in second footer column.', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );
		
		// Footer column 3
		register_sidebar( array(
			'name'          => esc_html__( 'Footer-Column-3', 'celebrate' ),
			'id'            => 'footer-column-3',
			'description'   => esc_html__( 'Widgets in this column will appear in third footer column.', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );
		
		// Footer column 4
		register_sidebar( array(
			'name'          => esc_html__( 'Footer-Column-4', 'celebrate' ),
			'id'            => 'footer-column-4',
			'description'   => esc_html__( 'Widgets in this column will appear in fourth footer column.', 'celebrate' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		) );

		//Copyright Widgets (columns) - Dynamic
		$celebrate_copyright_columns = celebrate_option( 'celebrate_copyright_columns' );
		for ($i=1; $i<=$celebrate_copyright_columns; $i++)
		{
			register_sidebar(array(
			'name' 			=> 'Copyright-Column-'.$i,
			'id' 			=> 'widgets-copyright-'.$i,
			'description'   => esc_html__( 'This area is a dynamically generated copyright widget column. Widgets will be stacked in here.', 'celebrate' ),
			'before_widget'	=> '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
			));
		} // copyright columns
		
		// Woocommerce Widgets
		if( celebrate_is_woocommerce_activated() ) {
			register_sidebar(array(
				'name'          => esc_html__( 'Woocommerce Sidebar', 'celebrate' ),
				'id'            => 'widgets-woocommerce',
				'description'   => esc_html__( 'This area will be shown as a WooCommerce sidebar for shop pages and product posts. Widgets will be stacked in this column.', 'celebrate' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h4 class="widget-title">',
				'after_title'   => '</h4>',
			));
		} // Woocommerce Widgets
	}
// Hook into the 'widgets_init' action
add_action( 'widgets_init', 'celebrate_widgets_init' );
}