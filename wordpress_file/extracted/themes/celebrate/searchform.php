<form role="search" method="get" class="tc-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<input type="search" class="tc-search-field" placeholder="<?php echo esc_attr( celebrate_option( 'celebrate_search_text', esc_html__( 'What’re you looking for...', 'celebrate' ) ) ); ?>" value="<?php echo get_search_query(); ?>" name="s" />
	<button type="submit" class="tc-search-submit"></button>
</form>