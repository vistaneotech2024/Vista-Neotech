<?php
/**
 * Helper Functions
 */
 
if ( ! function_exists( 'celebrate_paging_nav' ) ) :
/**
 * Navigation : next/previous for set of posts
 *
 */
function celebrate_paging_nav() {
	global $wp_query;
	if ( $wp_query->max_num_pages < 2 )
		return;
	?>
<nav class="tcsn-post-navigation tcsn-archive-nav clearfix">
	<ul class="tcsn-post-nav clearfix">
		<?php if ( get_next_posts_link() ) : ?>
		<li>
			<?php $prev_text = esc_html__( 'Previous', 'celebrate' ); ?>
			<?php next_posts_link( '<span class="tcsn-previous-link"><span class="tcsn-prev">' . $prev_text . '</span></span>' );  ?>
		</li>
		<?php endif; ?>
		<?php if ( get_previous_posts_link() ) : ?>
		<li>
			<?php $next_text = esc_html__( 'Next', 'celebrate' ); ?>
			<?php previous_posts_link( '<span class="tcsn-next-link"><span class="tcsn-next">' . $next_text . '</span></span>' ); ?>
		</li>
		<?php endif; ?>
	</ul>
</nav>
<!-- .navigation -->

<?php
}
endif;


if ( ! function_exists( 'celebrate_post_nav' ) ) :
/**
 * Navigation : next/previous for a single post
 */
function celebrate_post_nav() {
	// Avoid empty markup if there's nowhere to navigate.
	$previous = ( is_attachment() ) ? get_post( get_post()->post_parent ) : get_adjacent_post( false, '', true );
	$next     = get_adjacent_post( false, '', false );

	if ( ! $next && ! $previous ) {
		return;
	}
	?>
<nav class="tcsn-post-navigation tcsn-single-post-nav clearfix">
		<?php
	if ( is_attachment() ) :
		previous_post_link( '%link', '<span class="previous-link"><h5>%title</h5></span>' ); else : ?>
		<ul class="tcsn-post-nav clearfix">
			<li>
				<?php $prev_text = esc_html__( 'Previous', 'celebrate' ); ?>
				<?php previous_post_link( '%link', '<span class="tcsn-previous-link"><span class="tcsn-prev">' . $prev_text . '</span><h5>%title</h5></span>' );  ?>
			</li>
			<li>
				<?php $next_text = esc_html__( 'Next', 'celebrate' ); ?>
				<?php next_post_link( '%link', '<span class="tcsn-next-link">' . $next_text . '<span class="tcsn-next"></span><h5>%title</h5></span>' ); ?>
			</li>
		</ul>
		<?php endif; ?>
</nav>
<!-- .navigation -->
<?php
}
endif;

if ( ! function_exists( 'celebrate_pagination' ) ) :
/**
 * Pagination : For custom post type - Portfolio
 *
 */
function celebrate_pagination( $pages = '', $range = 2 ) {  

     $showitems = ( $range * 2 )+1;  

     global $paged;
     if( empty( $paged ) ) $paged = 1;

     if( $pages == '' ) {
         global $wp_query;
         $pages = $wp_query->max_num_pages;
         if( !$pages ) {
             $pages = 1;
         }
     }   

     if( 1 != $pages ) {
		 
         echo "<div class='pagination-folio-page clearfix'>";
		 
         if( $paged > 1 ) {
         	echo "<span class='prev-folio-page'><a href='".get_pagenum_link($paged - 1)."'></a></span>";
         }

         for ( $i=1; $i <= $pages; $i++ ) {
			 
             if ( 1 != $pages &&( ! ( $i >= $paged+$range+1 || $i <= $paged-$range-1 ) || $pages <= $showitems ) ) {
                 echo ( $paged == $i )? "<span class='current-folio-page'>".$i."</span>":"<span class='inactive-folio-page'><a href='".get_pagenum_link( $i )."'>".$i."</a></span>";
             }
         }
		 
         if ( $paged < $pages ) {
		 echo "<span class='next-folio-page'><a href='".get_pagenum_link( $paged + 1 )."'></a></span>"; 
	     }

         echo "</div>\n";
     }
}
endif;

if ( ! function_exists( 'celebrate_is_custom_post_type' ) ) :
	/**
	 * Check if a post is a custom post type.
	 *
	 */
	function celebrate_is_custom_post_type( $post = NULL )
	{
		$all_custom_post_types = get_post_types( array ( '_builtin' => FALSE ) );
	
		// there are no custom post types
		if ( empty ( $all_custom_post_types ) )
			return FALSE;
	
		$custom_types      = array_keys( $all_custom_post_types );
		$current_post_type = get_post_type( $post );
	
		// could not detect current type
		if ( ! $current_post_type )
			return FALSE;
	
		return in_array( $current_post_type, $custom_types );
	}
endif;

/**
 * Modify archive widget 
 *
 */
if ( ! function_exists( 'celebrate_archive_postcount_filter' ) ) :
	function celebrate_archive_postcount_filter ($variable) {
	   $variable = str_replace('(', '<span class="post-count">( ', $variable);
	   $variable = str_replace(')', ' )</span>', $variable);
	   return $variable;
	}
	add_filter('get_archives_link', 'celebrate_archive_postcount_filter');
endif;

/**
 * Modify category widget 
 *
 */
if ( ! function_exists( 'celebrate_categories_postcount_filter' ) ) :
	function celebrate_categories_postcount_filter ($variable) {
	   $variable = str_replace('(', '<span class="post-count">( ', $variable);
	   $variable = str_replace(')', ' )</span>', $variable);
	   return $variable;
	}
	add_filter('wp_list_categories','celebrate_categories_postcount_filter');
endif;

/**
 * Arrows for menu dropdown
 */
class CELEBRATE_Dropdown_Walker_Nav_Menu extends Walker_Nav_Menu {
    function celebrate_display_element($element, &$children_elements, $max_depth, $depth=0, $args, &$output) {
        $id_field = $this->db_fields['id'];
	     if (!empty($children_elements[$element->$id_field]) && $element->menu_item_parent == 0) { 
            $element->title =  $element->title . '<span class="sf-sub-indicator menu-arrow-down"></span>'; 
			$element->classes[] = 'sf-with-ul';
        }
		if (!empty($children_elements[$element->$id_field]) && $element->menu_item_parent != 0) { 
            $element->title =  $element->title . '<span class="sf-sub-indicator"></span>'; 
        }

        Walker_Nav_Menu::celebrate_display_element($element, $children_elements, $max_depth, $depth, $args, $output);
    }
}

/**
 * Flush rewrite rules for custom post types on theme activation
 */
add_action( 'after_switch_theme', 'celebrate_rewrite_rules_flush' );
function celebrate_rewrite_rules_flush() {
     flush_rewrite_rules();
}

/**
 * Wrap current page in span for wp_link_pages
 */
if ( ! function_exists( 'celebrate_link_pages' ) ) :
	function celebrate_link_pages( $link ) {
		if ( ctype_digit( $link ) ) {
			return '<span class="page-link-current">' . $link . '</span>';
		}
		return $link;
	}
	add_filter( 'wp_link_pages_link', 'celebrate_link_pages' );
endif;