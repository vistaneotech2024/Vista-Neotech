<?php get_header(); ?>
<div id="content-wrapper" class="main-container clearfix fullwidth">
	<div id="primary" class="content-area">
		<div id="content-main" role="main">
			<div class="error-404 clearfix">
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<h1 class="heading-404"> <?php echo esc_attr( celebrate_option( 'celebrate_404_heading', esc_html__( '404', 'celebrate' ) ) ); ?> </h1>
					</div>
					<div class="col-md-6 col-md-offset-3 error-form-wrapper">
						<p> <?php echo esc_attr( celebrate_option( 'celebrate_404_text', esc_html__( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Try with search.', 'celebrate' ) ) ); ?> </p>
						<?php get_search_form(); ?>
					</div>
					<div class="col-md-12 col-sm-12 col-xs-12 link-404"> <a class="link-404" href="<?php echo esc_url( home_url( '/' ) ); ?>"> <?php echo esc_attr( celebrate_option( 'celebrate_404_link_text', esc_html__( 'Back to Home', 'celebrate' ) ) ); ?> </a> </div>
				</div>
			</div>
		</div>
	</div>
	<!-- #primary --> 
</div>
<!-- #content-wrapper -->
<?php get_footer(); ?>