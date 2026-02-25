<?php
/**
 * The default template for displaying content of search results
 */
?>
<div id="search-results">
	<div class="col-md-4 col-sm-4 col-xs-12 mssearch-item">
		<div class="archive-inner">
			<?php if ( has_post_thumbnail() ) { ?>
			<div class="archive-thumb"> <?php echo '<a href="' .  esc_url( get_permalink() ) . '">' . get_the_post_thumbnail( $post->ID, 'full', array( 'title' => '' ) ) . '</a>';  ?> </div>
			<?php } ?>
			<h5 class="archive-entry-title"><a href="<?php the_permalink(); ?>">
				<?php the_title(); ?>
				</a></h5>
			<?php 
			
		// excerpt	
		if ( has_excerpt() ) {
			
			$excerpt = the_excerpt(); 
			
		// Create excerpts from the trimmed content
		} else {
		$content = get_the_content('');
			$content = do_shortcode( $content );
			$content = apply_filters('the_content', $content);
			$content = str_replace(']]>', ']]>', $content);
			$content = apply_filters('the_content', $content);
			$excerpt = ''. wp_trim_words( $content, 30 ) . '';
		}
		
			echo '<p>';
			echo esc_attr ( $excerpt );
			echo '</p>';
			
			?>
			<?php $celebrate_show_read_more = celebrate_option( 'celebrate_show_read_more', true, true ) ? true : false; 
		if ( $celebrate_show_read_more ) { ?>
			<?php if( celebrate_option( 'celebrate_read_more' ) != "" ) { 
					$celebrate_read_more = celebrate_option( 'celebrate_read_more' );
           			$btn_title = $celebrate_read_more;
				} else { 
					$btn_title =  esc_html__( 'Continue Reading' , 'celebrate' ); 
				} ?>
			<a href="<?php the_permalink(); ?>" class="read-more-link"> <?php echo esc_attr( $btn_title ); ?> </a>
			<?php } ?>
		</div>
	</div>
	<!--/search-result--> 
</div>