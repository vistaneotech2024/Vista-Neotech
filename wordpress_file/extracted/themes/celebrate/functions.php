<?php
/**
 * Celebrate functions and definitions.
 *
 * @package WordPress
 * @subpackage Celebrate
 * @since Celebrate 1.0.0
 */

/**
 * Include ReduxFramework
 *
 */
require_once ( get_template_directory() . '/includes/redux-functions.php' );
if ( ! isset( $celebrate_options ) && file_exists( get_template_directory() . '/includes/options-config.php' ) ) {
	require_once( get_template_directory() . '/includes/options-config.php' ); 
}
	
function celebrate_removeDemoModeLink() { 
    if ( class_exists('ReduxFrameworkPlugin') ) {
        remove_filter( 'plugin_row_meta', array( ReduxFrameworkPlugin::get_instance(), 'plugin_metalinks'), null, 2 );
    }
    if ( class_exists('ReduxFrameworkPlugin') ) {
        remove_action('admin_notices', array( ReduxFrameworkPlugin::get_instance(), 'admin_notices' ) );    
    }
}
add_action('init', 'celebrate_removeDemoModeLink');

/**
 *   Remove Redux Menu under the Tools
 */
if ( ! function_exists( 'celebrate_remove_redux_tool_menu' ) ) :
	function celebrate_remove_redux_tool_menu() {
    	remove_submenu_page('tools.php','redux-about');
	}
endif; // celebrate_remove_redux_tool_menu
add_action( 'admin_menu', 'celebrate_remove_redux_tool_menu',12 );

/**
 *   Custom Styles to Redux
 */
if ( ! function_exists( 'celebrate_custom_styles_redux' ) ) :
	function celebrate_custom_styles_redux() {
		   wp_enqueue_style( 'redux-custom', get_template_directory_uri() . '/css/redux-custom.css' );
	} // celebrate_custom_styles_redux
endif;
add_action( 'redux/page/celebrate_options/enqueue', 'celebrate_custom_styles_redux' );

/**
 *  Theme includes
 */
// Helper functions
require_once ( get_template_directory() . '/includes/helpers.php' );

// Theme widgets / Sidebars
require_once ( get_template_directory() . '/includes/widgets/sidebars.php' );
require_once ( get_template_directory() . '/includes/widgets/custom-widgets.php' );

// Custom styles 
require_once ( get_template_directory() . '/includes/custom-styles.php' );

// Icons Fonts in array
require_once (get_template_directory() . '/includes/icon-font-array.php');

// Image resizer
require_once ( get_template_directory() . '/includes/aq_resizer.php' );

// Page Header
require_once( get_template_directory() .'/includes/templates/headers/page-header.php' );
require_once( get_template_directory() .'/includes/header-functions.php' );

// Layout
require_once( get_template_directory() .'/includes/layout.php' );

// Social Share
require_once( get_template_directory() .'/includes/social-share.php' );

/**
 * Sets up the content width value based on the theme's design.
 *
 */
if ( ! isset( $content_width ) )
	$content_width = 1170;

/**
 * Theme only works in WordPress 3.6 or later.
 *
 */
if ( version_compare( $GLOBALS['wp_version'], '4.1-alpha', '<' ) ) {
	require get_template_directory() . '/includes/bk-compatiblity.php';
}

if ( ! function_exists( 'celebrate_plugin_setup' ) ) :
/**
 * Recommend plugins for this theme via TGMPA script
 *
 */
function celebrate_plugin_setup() {
	require_once( get_template_directory() .'/include-plugins.php' );
	require_once( get_template_directory() . '/includes/github.php' );
}
endif; // celebrate_plugin_setup
add_action( 'after_setup_theme', 'celebrate_plugin_setup' );


if ( ! function_exists( 'celebrate_theme_setup' ) ) :
/**
 * Sets up theme defaults and registers the various WordPress features that theme supports.
 *
 */
function celebrate_theme_setup() {
	
	// Makes theme available for translation.
	// Translations can be added to the /languages/ directory.
	load_theme_textdomain( 'celebrate', get_template_directory() . '/languages' );

    // Adds RSS feed links to <head> for posts and comments.
	add_theme_support( 'automatic-feed-links' );
	
	// Add document title
	add_theme_support( 'title-tag' );
	
    // Switches default core markup for search form, comment form, and comments 
	// to output valid HTML5.
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list' ) );

	// This theme supports all available post formats by default.
	add_theme_support( 'post-formats', array(
		'audio', 'gallery', 'image', 'link', 'quote', 'video'
	) );

	// Add Menu Support
    register_nav_menus( array(
        'primary_menu'		=> 'Primary Menu',
		'sticky_menu'		=> 'Sticky Menu',
		'one_page_menu'		=> 'One Page Menu',
    ) );  

    // Thumbnail support
	add_theme_support( 'post-thumbnails' );
}
endif; // celebrate_theme_setup
add_action( 'after_setup_theme', 'celebrate_theme_setup' );

if ( ! function_exists( 'celebrate_plugin_scripts_styles' ) ) :
/**
 * Enqueue Plugins Scripts and Styles
 *
 */
 
function celebrate_plugin_scripts_styles() {
	
	// enqueue scripts
	wp_enqueue_script( 'modernizr.custom', get_template_directory_uri() . '/js/modernizr.custom.js', array('jquery'), '1.0.0', false );
	wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/js/bootstrap.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'easing', get_template_directory_uri() . '/js/jquery.easing.1.3.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'superfish', get_template_directory_uri() . '/js/superfish.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'slicknav', get_template_directory_uri() . '/js/jquery.slicknav.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'select2', get_template_directory_uri() . '/js/select2.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script('imagesloaded');
	wp_enqueue_script( 'isotope', get_template_directory_uri() . '/js/isotope.pkgd.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'prettyPhoto', get_template_directory_uri() . '/js/jquery.prettyPhoto.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'owl-carousel', get_template_directory_uri() . '/js/owl.carousel.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'scroll-scripts', get_template_directory_uri() . '/js/scroll-scripts.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'fitvids', get_template_directory_uri() . '/js/jquery.fitvids.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'jquery.counterup', get_template_directory_uri() . '/js/jquery.counterup.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'waypoint', get_template_directory_uri() . '/js/waypoint.js', array('jquery'), '1.0.0', true );
	if( is_page_template('template-one-page.php') ) {
		wp_enqueue_script( 'onepage', get_template_directory_uri() . '/js/onepage.nav.js', array('jquery'), '1.0.0', true );
	}

	// enqueue styles
	wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/css/bootstrap.min.css' );
	wp_enqueue_style( 'slicknav', get_template_directory_uri() . '/css/slicknav.min.css' );
	wp_enqueue_style( 'select2', get_template_directory_uri() . '/css/select2.css' );
	wp_enqueue_style( 'prettyPhoto', get_template_directory_uri() . '/css/prettyPhoto.css' );
	wp_enqueue_style( 'owl-carousel', get_template_directory_uri() . '/css/owl.carousel.css' );
	wp_enqueue_style( 'animate', get_template_directory_uri() . '/css/animate.css' );
	wp_enqueue_style( 'celebrate-fonts', get_template_directory_uri() . '/css/iconfont.css' );
	
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
endif; // celebrate_plugin_scripts_styles
add_action( 'wp_enqueue_scripts', 'celebrate_plugin_scripts_styles' );


if ( ! function_exists( 'celebrate_custom_scripts_styles' ) ) :
/**
 * Enqueue Custom Scripts and Styles
 *
 */
 
function celebrate_custom_scripts_styles() {

	// enqueue scripts
	wp_enqueue_script( 'celebrate-custom', get_template_directory_uri() . '/js/custom.js', array('jquery'), '1.0.0', true );
	
	// enqueue styles
	wp_enqueue_style( 'celebrate-style', get_stylesheet_uri() );
	wp_enqueue_style( 'celebrate-style-colors', get_template_directory_uri() . '/css/colors.css' );

	// register style
	wp_register_style( 'celebrate-responsive-style', get_template_directory_uri() . '/css/responsive.css' );
		
	// Add header stylesheet
	if ( celebrate_option( 'celebrate_layout_header' ) == "v2" ) {
		wp_register_style( 'celebrate-header-v2-style', get_template_directory_uri() . '/css/header-v2.css' );
		wp_enqueue_style( 'celebrate-header-v2-style' );
	} elseif ( celebrate_option( 'celebrate_layout_header' ) == "v3" ) {
		wp_register_style( 'celebrate-header-v3-style', get_template_directory_uri() . '/css/header-v3.css' );
		wp_enqueue_style( 'celebrate-header-v3-style' );
	}
	
	// To disable responsiveness
	$celebrate_layout_responsive = celebrate_option( 'celebrate_layout_responsive', true, true ) ? true : false; 
	if(  $celebrate_layout_responsive ) { 
		wp_enqueue_style( 'celebrate-responsive-style' );
	}
}
endif; // celebrate_custom_scripts_styles
add_action( 'wp_enqueue_scripts', 'celebrate_custom_scripts_styles', 20 );

if ( ! function_exists( 'celebrate_custom_scripts_override' ) ) :
/**
 * Enqueue Custom Scripts and Styles
 *
 */
function celebrate_custom_scripts_override() {
	wp_enqueue_style( 'celebrate-custom-override', get_template_directory_uri() . '/css/custom-override.css' );
	wp_enqueue_style( 'celebrate-custom-style', get_template_directory_uri() . '/css/custom.css' );
}
endif; // celebrate_custom_scripts_styles
add_action( 'wp_enqueue_scripts', 'celebrate_custom_scripts_override', 40 );

if ( ! function_exists( 'celebrate_embed_allowed_tags' ) ) :
/**
 *
 * Allowed tags for video / audio embed
 *
 */ 
	function celebrate_embed_allowed_tags() {	
	$celebrate_embed_allowed = array(
	'a' => array(
	'href' => array (),
	'title' => array ()),
	'b' => array(
	'style'=> array(),
	),
	);
	// iframe
	$celebrate_embed_allowed['iframe'] = array(
	'src' => array(),
	'height' => array(),
	'width' => array(),
	'frameborder' => array(),
	'allowfullscreen' => array(),
	);
	// video
	$celebrate_embed_allowed['video'] = array(
		'width' => true,
		'height' => true
	);
	// source
	$celebrate_embed_allowed['source'] = array(
		'src' => true,
		'type' => true
	);
	return $celebrate_embed_allowed;
	}
endif;

if( ! function_exists('celebrate_comment' ) ) {
/**
 * Custom callback function for comment display
 *
 */
	function celebrate_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	switch ( $comment->comment_type ) :
		case 'pingback' :
		case 'trackback' :
	?>
<li class="post pingback">
		<p><?php _e( 'Pingback:', 'celebrate' ); ?> <?php comment_author_link(); ?><?php edit_comment_link( __( 'Edit', 'celebrate' ), '<span class="edit-link">', '</span>' ); ?></p>
	<?php
			break;
		default :
	?>	
<li <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">
	<div id="div-comment-<?php comment_ID(); ?>" class="comment-body">
		<div class="tc-comment-author vcard">
			<div class="tc-comment-author-img">
				<?php if ( 0 != $args['avatar_size'] ) echo get_avatar( $comment, $args['avatar_size']); ?>
			</div>
		</div>
		<div class="tc-comment-text-wrapper">
			<h6 class="tc-comment-author"><?php printf( wp_kses( __( '<cite class="fn custom-fn">%s</cite>', 'celebrate' ), array( 'a' => array( 'href' => array() ) ) ), get_comment_author_link() ); ?></h6>
			<span class="tc-comment-metadata"><a href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>"><?php printf( esc_html__( '%1$s at %2$s', 'celebrate' ), get_comment_date(),  get_comment_time() ); ?> </a>
			<?php edit_comment_link(); ?>
			</span> <span class="tc-reply">
			<?php comment_reply_link( array_merge( $args, array( 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
			</span>
			<div class="tc-comment-text clearfix">
				<?php comment_text() ?>
			</div>
			<?php if ( '0' == $comment->comment_approved ) : ?>
			<p class="comment-awaiting-moderation">
				<?php esc_html_e( 'Your comment is awaiting moderation.', 'celebrate' ) ?>
			</p>
			<?php endif; ?>
		</div>
	</div>
	<?php
	break;
	endswitch;
	}
} // end comment callback function

if ( ! function_exists( 'celebrate_post_date' ) ) :
/**
 *
 * Prints HTML with date information for current post.
 *
 */
function celebrate_post_date( $echo = true ) {
	$celebrate_date_title = __( 'On ', 'celebrate' );
	$celebrate_format_prefix = '%2$s';
	printf( '<span class="tc-meta-date post-date updated"><span class="tc-meta-title">' . $celebrate_date_title . '</span><span class="entry-date"><a href="%1$s" rel="bookmark">%4$s</a></span></span>',
		esc_url( get_permalink() ),
		esc_attr( sprintf( esc_html__( 'Permalink to %s', 'celebrate' ), the_title_attribute( 'echo=0' ) ) ),
		esc_attr( get_the_date() ),
		esc_html( sprintf( $celebrate_format_prefix, get_post_format_string( get_post_format() ), get_the_date() ) )
	);
}
endif;

if ( ! function_exists( 'celebrate_post_meta' ) ) :
/**
 *
 * Prints HTML with meta information for current post: author, date, categories.
 *
 */
function celebrate_post_meta() {
	
	// Post author
	if ( 'post' == get_post_type() ) {
		$celebrate_author_title = __( 'By ', 'celebrate' );
		printf( '<span class="tc-meta-author author"><span class="tc-meta-title">' . $celebrate_author_title . '</span><a class="url fn n" href="%1$s" title="%2$s" rel="author">%3$s</a></span>',
			esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
			esc_attr( sprintf( esc_html__( 'View all posts by %s', 'celebrate' ), get_the_author() ) ),
			get_the_author()
		);
	}

	// Categories
	$celebrate_categories_list = get_the_category_list( esc_html__( ' ', 'celebrate' ) );
	$celebrate_categories_title = __( 'In ', 'celebrate' );
	if ( $celebrate_categories_list ) {
		echo '<span class="tc-meta-category"><span class="tc-meta-title">' . $celebrate_categories_title . '</span>' . $celebrate_categories_list . '</span>';
	}
	
	// Post date
	celebrate_post_date();
}
endif;

if ( ! function_exists( 'celebrate_post_meta_second' ) ) :
/**
 *
 * Prints HTML with meta information for current post: tags
 *
 */
function celebrate_post_meta_second() {
	// Tags
	$celebrate_tag_title = esc_html__( 'Tags: ', 'celebrate' );
	$celebrate_tag_list = get_the_tag_list( '' );
	if ( $celebrate_tag_list ) {
		echo '<span class="tc-meta-tag">' . $celebrate_tag_list . '</span>';
	}
}
endif;

/**
 *
 * Initialize Visual Composer as a part of theme
 */
if( function_exists('vc_set_as_theme') ) {
	vc_set_as_theme(true); 

	// Extend Visual composer
	require_once( get_template_directory() . '/vc_extend/vc_extend.php' );
	require_once( get_template_directory() . '/vc_extend/remove-params-elements.php' );
	require_once( get_template_directory() . '/vc_extend/add-params.php' );

}

// After VC Init
add_action( 'vc_after_init', 'celebrate_vc_after_init_actions' );
function celebrate_vc_after_init_actions() {
    // Enable VC by default on a list of Post Types
    if( function_exists('vc_set_default_editor_post_types') ){ 
        $list = array(
            'page',
            'post',
            'tcsn_portfolio',
			'tcsn_team',
        );
        vc_set_default_editor_post_types( $list );
    }
}

/**
 * Excerpt length
 */
if ( ! function_exists( 'celebrate_custom_excerpt_length' ) ) {
	function celebrate_custom_excerpt_length( $length ) {
		$celebrate_excerpt_length = celebrate_option( 'celebrate_excerpt_length' );
		if ( $celebrate_excerpt_length != '' ) {
				return esc_attr( $celebrate_excerpt_length );
			} else { 
				return 40; 
		}
	}
}
add_filter( 'excerpt_length', 'celebrate_custom_excerpt_length', 999 );

/**
 * Excerpt more string 
 */
if ( ! function_exists( 'celebrate_custom_excerpt_more' ) ) {
	function celebrate_custom_excerpt_more( $more ) {
		return '&hellip;';
	}
}
add_filter( 'excerpt_more', 'celebrate_custom_excerpt_more' );

/**
 * Custom admin styles
 */
if ( ! function_exists( 'celebrate_enqueue_custom_admin_style' ) ) :
function celebrate_enqueue_custom_admin_style( $hook ) {
    if ( 'post.php' != $hook ) {
        return;
    }
	wp_enqueue_style( 'celebrate-fonts', get_template_directory_uri() . '/css/iconfont.css' );
    wp_enqueue_style( 'celebrate-vc-admin', get_template_directory_uri() . '/css/vc-admin.css' );
}
endif;
add_action( 'admin_enqueue_scripts', 'celebrate_enqueue_custom_admin_style' );

/**
 * Custom cf7 styles
 */
if ( ! function_exists( 'celebrate_wpcf7_form_elements' ) ) :
	function celebrate_wpcf7_form_elements( $html ) {
	$text = esc_html__( 'Please Select...', 'celebrate' );
	$html = str_replace('---', '' . $text . '', $html);
	return $html;
	}
endif;
add_filter('wpcf7_form_elements', 'celebrate_wpcf7_form_elements');


/**
 * Code in Header [ Google Analytics ]
 */ 
if ( !function_exists('celebrate_get_header_code') ) {
	add_action('wp_head', 'celebrate_get_header_code' );
	function celebrate_get_header_code() {
		echo celebrate_option ( 'celebrate_get_header_code' );
	} 
} 

/**
 * Celebrate demo data import
 *
 */
function celebrate_import_data() {
  return array(
    array(
      'import_file_name'             => 'Celebrate Demo Data',
      'local_import_file'            => get_template_directory() . '/includes/imports/content.xml',
      'local_import_widget_file'     => get_template_directory() . '/includes/imports/widgets.wie',
      'local_import_redux'           => array(
        array(
          'file_path'   =>  get_template_directory() . '/includes/imports/redux.json',
          'option_name' => 'celebrate_options',
        ),
      ),
      'import_notice'                => wp_kses( __( 'Make sure all the required / recommended plugins are <strong>Installed and Activated.</strong><br>Custom Post Types Import will fail otherwise example: Woocommerce / Portfolio / Sliders etc.<br><br>Please be patient...click on the Import button only once and wait, <strong>it may take - FEW - minutes.</strong><br><br>After import, error log file may get generated. Nothing to panic, go thorough file. Minor errors like some media / images / sidebar / widget Failed to import, can be ignored. Check if you have posts and pages imported fine.<br><br>Demo Data Import not working? <a href="http://knowledgebase.tanshcreative.com/troubleshooting-demo-data-import/" target="_blank">Please check help document for more details.</a>', 'celebrate' ), array( 'strong' => array(), 'br' => array(), 'a' => array( 'href' => array(), 'title' => array(), 'target' => array() ), ) ), // import notice
    ),
  );
}
add_filter( 'pt-ocdi/import_files', 'celebrate_import_data' );

// After import
function celebrate_after_import_setup() {
    $main_menu	= get_term_by( 'name', 'Primary Menu', 'nav_menu' );
    set_theme_mod( 'nav_menu_locations', array(
            'primary_menu'	=> $main_menu->term_id,
			'sticky_menu' 	=> $main_menu->term_id,
        )
    );
    $front_page_id = get_page_by_title( 'Home' );
    $blog_page_id  = get_page_by_title( 'Blog' );
    update_option( 'show_on_front', 'page' );
    update_option( 'page_on_front', $front_page_id->ID );
    update_option( 'page_for_posts', $blog_page_id->ID );
	
	//Import Revolution Slider
   if ( class_exists( 'RevSlider' ) ) {
	   $slider_array = array(
		  get_template_directory() . '/includes/imports/master.zip',
		  get_template_directory() . '/includes/imports/app-presentation.zip',
		  );
	   $slider = new RevSlider();
	   foreach($slider_array as $filepath){
		 $slider->importSliderFromPost(true,true,$filepath);  
	   }
	   $slider_import_text = esc_html__( 'Slider Imported', 'celebrate' );
	   echo $slider_import_text;
  }
}
add_action( 'pt-ocdi/after_import', 'celebrate_after_import_setup' );

// Custom Header
function celebrate_plugin_page_setup( $default_settings ) {
    $default_settings['parent_slug'] = 'themes.php';
    $default_settings['page_title']  = esc_html__( 'Celebrate Demo Import' , 'celebrate' );
    $default_settings['menu_title']  = esc_html__( 'Import Theme Demo Data' , 'celebrate' );
    $default_settings['capability']  = 'import';
    $default_settings['menu_slug']   = 'pt-one-click-demo-import';

    return $default_settings;
}
add_filter( 'pt-ocdi/plugin_page_setup', 'celebrate_plugin_page_setup' );

// Branding
add_filter( 'pt-ocdi/disable_pt_branding', '__return_true' );

// Demo Import Styles
add_action('admin_head', 'celebarte_demo_import_styles');
function celebarte_demo_import_styles() {
  echo '<style>
    .ocdi__intro-text { display: none !important; }
  </style>';
}

/**
 * WooCommerce
 *
 */
// Check if WooCommerce is activated
if ( ! function_exists( 'celebrate_is_woocommerce_activated' ) ) {
	function celebrate_is_woocommerce_activated() {
		if ( class_exists( 'woocommerce' ) ) { return true; } else { return false; }
	}
} // celebrate_is_woocommerce_activated

// WooCommerce functions
if( celebrate_is_woocommerce_activated() ) {
	require_once( get_template_directory() . '/includes/woocommerce/woocommerce.php' );
	require_once( get_template_directory() . '/includes/woocommerce/woo-social-share.php' );
	require_once( get_template_directory() . '/includes/woocommerce/woo-layout.php' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}

// Enqueue Scripts and Styles for WooCommerce if installed
if( ! function_exists('celebrate_woocommerce_scripts_styles' ) ) {
	function celebrate_woocommerce_scripts_styles() {
		if( celebrate_is_woocommerce_activated() ) {
			wp_enqueue_style( 'woocommerce-style',  get_template_directory_uri() . '/css/woocommerce.css' );
		}	
	}
	add_action( 'wp_enqueue_scripts', 'celebrate_woocommerce_scripts_styles' );
} // celebrate_woocommerce_scripts_styles

// Cart item numbers update
add_filter( 'woocommerce_add_to_cart_fragments', 'celebrate_woocommerce_add_to_cart' );
function celebrate_woocommerce_add_to_cart( $fragments ) {
	ob_start();
	?>
	<div class="cart-items-wrapper"><a href="<?php echo  WC()->cart->get_cart_url(); ?>" title="<?php esc_html_e('View your shopping cart', 'celebrate'); ?>"><div class="cart-items"><?php echo sprintf(_n('<span class="item-number">%d</span>', '<span class="item-number">%d</span>',  WC()->cart->cart_contents_count, 'celebrate'),  WC()->cart->cart_contents_count);?></div></a></div>
	<?php
	$fragments['div.cart-items-wrapper'] = ob_get_clean();
    return $fragments;
}

// Import only original size images
add_filter( 'pt-ocdi/regenerate_thumbnails_in_content_import', '__return_false' );


