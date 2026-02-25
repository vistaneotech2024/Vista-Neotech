<?php
/**
 * Celebrate Core
 */
 
/**
 * Define constants used by the plugin.
 *
 */
 
/* Set constant path to the plugin directory */
define( 'TCCELEBRATESC_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );

/* Set the constant path to the plugin directory URI */
define( 'TCCELEBRATESC_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );

/**
 * tc_celebrate_core class.
 */
if( ! class_exists( 'tc_celebrate_core' ) ) {
class tc_celebrate_core {

	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since   1.0.0
	 */
	protected $version = '1.0.0';

	/**
	 * Unique identifier for your plugin.
	 *
	 * Use this value (not the variable name) as the text domain when internationalizing strings of text. It should
	 * match the Text Domain file header in the main plugin file.
	 *
	 * @since   1.0.0
	 */
	protected $plugin_slug = 'celebrate';

	/**
	 * Instance of this class.
	 *
     * @since   1.0.0
	 */
	protected static $instance = null;

	/**
	 * Slug of the plugin screen.
	 *
	 * @since   1.0.0
	 */
	protected $plugin_screen_hook_suffix = null;

	/**
	 * Initialize the plugin
	 *
	 * @since   1.0.0
	 */
	private function __construct() {
		
		// Make shortcodes available
		require_once( TCCELEBRATESC_DIR . 'includes/shortcodes.php' );
		
		// Image Resizer
		require_once( TCCELEBRATESC_DIR . 'includes/aq_resizer.php' );
		
		// Meta Boxes
		if ( file_exists(  TCCELEBRATESC_DIR . 'includes/meta-box/init.php' ) ) {
			require_once  TCCELEBRATESC_DIR . 'includes/meta-box/init.php';
		} 
		require_once ( TCCELEBRATESC_DIR . 'includes/metabox-config.php' );

		add_filter( 'the_content', array( $this, 'tc_celebrate_remove_sc_wrapping_spaces' ) );
	
		// init process for button control
		add_action( 'init', array( &$this, 'init' ) );
	 	   
		// Add scripts and styles
		add_action( 'wp_enqueue_scripts', array( &$this, 'tc_celebrate_add_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( &$this, 'tc_celebrate_add_styles' ) );
		
		// Load plugin text domain
		add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
	}

	/**
	 * Return an instance of this class.
	 *
	 * @since   1.0.0
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since   1.0.0
	 */
	public function load_plugin_textdomain() {

		$domain = $this->plugin_slug;
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain( $domain, WP_LANG_DIR . '/' . $domain . '/' . $domain . '-' . $locale . '.mo' );
		load_plugin_textdomain( $domain, FALSE, dirname( plugin_basename( __FILE__ ) ) . '/lang/' );
	}
	
	/**
	 * Registers TinyMCE rich editor buttons
	 *
	 * @since   1.0.0
	 */
	function init() {
		// Don't bother doing this stuff if the current user lacks permissions
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
			return;
	 
		// Add only in Rich Editor mode
		if ( get_user_option('rich_editing') == 'true') {
			// filter the tinyMCE buttons and add our own
			add_filter( 'mce_external_plugins', array( &$this, 'add_tc_celebrate_tinymce_plugin' ) );
			add_filter( 'mce_buttons_3', array( &$this, 'register_tc_celebrate_tinymce_buttons' ) );
		}
	}

	/**
	 * Defins TinyMCE rich editor js plugin
	 *
	 * @since   1.0.0
	 */
	 function add_tc_celebrate_tinymce_plugin( $plugin_array ) {
		$plugin_array['tcsnshortcodes'] =  TCCELEBRATESC_URI . 'includes/tinymce.js';
		return $plugin_array;
	}

	/**
	 * Register TinyMCE rich editor buttons
	 *
	 * @since   1.0.0
	 */
	function register_tc_celebrate_tinymce_buttons( $buttons ) {
		array_push( $buttons,"tcsngeneral","tcsntypo");
		return $buttons; 
	}
	
	// Remove spaces wrapping shortcodes
	function tc_celebrate_remove_sc_wrapping_spaces( $content ) {
		$array = array(
			'<p>[' => '[',
			']</p>' => ']',
			']<br>' => ']'
		);
		$content = strtr( $content, $array );
		return $content;
	}
	
	/**
	 *  Enqueue Javascript files
	 *
	 * @since   1.0.0
     */
	function tc_celebrate_add_scripts() { 
	
	}

	/**
     * Enqueue Style sheets
	 *
	 * @since   1.0.0
     */
	function tc_celebrate_add_styles() { // Enable this and write styles in this (sc-custom.css) if using outside theme.
		// wp_enqueue_style( 'cpt-custom-style', TCCELEBRATESC_URI . 'css/sc-custom.css' );
		
	}
 } 
} // class tc_celebrate_core

/**
 * Allow shortcodes in widgets / excerpt	
 *
 */
add_filter( 'widget_text', 'do_shortcode' );
add_filter( 'the_excerpt', 'do_shortcode' );
	
/**
 * Registers portfolio post type
 *
 * @since  1.0.0
 */
add_action( 'init', 'tc_celebrate_register_portfolio_posttype' );
function tc_celebrate_register_portfolio_posttype() {
	global $tc_celebrate_options;
	$tc_celebrate_portfolio_slug = '';
	if(isset($tc_celebrate_options['tc_celebrate_portfolio_slug'])) { $tc_celebrate_portfolio_slug = $tc_celebrate_options['tc_celebrate_portfolio_slug']; }
	if( $tc_celebrate_portfolio_slug != ''  ) {
		$return_tc_celebrate_portfolio_slug = $tc_celebrate_portfolio_slug;
	}
	else{
		$return_tc_celebrate_portfolio_slug = 'portfolio-items';
	}
	$labels = array(
		'name'               => _x( 'Portfolio Items', 'post type general name', 'celebrate' ),
		'singular_name'      => _x( 'Portfolio Item', 'post type singular name', 'celebrate' ),
		'all_items'          => __( 'Portfolio Items', 'celebrate' ),
		'add_new'            => __( 'Add New', 'celebrate' ),
		'add_new_item'       => __( 'Add New Portfolio Item', 'celebrate' ),
		'edit_item'          => __( 'Edit Portfolio Item', 'celebrate' ),
		'new_item'           => __( 'New Portfolio Item', 'celebrate' ),
		'view_item'          => __( 'View Portfolio Item', 'celebrate' ),
		'search_items'       => __( 'Search Portfolio Items', 'celebrate' ),
		'not_found'          => __( 'No Portfolio Items found', 'celebrate' ),
		'not_found_in_trash' => __( 'No Portfolio Items found in Trash', 'celebrate' ),
    );
	$args = array(
		'labels'          => $labels,
	    'public'          => true,  
        'show_ui'         => true,  
        'capability_type' => 'post',  
        'hierarchical'    => false,  
        'can_export'      => true,
        'has_archive'     => false,
		'menu_icon'       => 'dashicons-portfolio',
        'rewrite'         => array( 'slug' => $return_tc_celebrate_portfolio_slug ),
        'supports'        => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
	);
	register_post_type( 'tcsn_portfolio', $args );
}

/**
 * Register custom taxonomy for portfolio items.
 *
 * @since  1.0.0
 */
add_action( 'init', 'tc_celebrate_register_portfolio_taxonomy' );
function tc_celebrate_register_portfolio_taxonomy() {
    $labels = array(
        'name'              => _x( 'Portfolio Categories', 'taxonomy general name', 'celebrate' ),
        'singular_name'     => _x( 'Portfolio Category', 'taxonomy singular name', 'celebrate' ),
        'search_items'      => __( 'Search Portfolio Categories', 'celebrate' ),
        'all_items'         => __( 'All Portfolio Categories', 'celebrate' ),
		'edit_item'         => __( 'Edit Portfolio Category', 'celebrate' ),
		'view_item'         => __( 'View Portfolio Category', 'celebrate' ),
        'parent_item'       => __( 'Parent Portfolio Category', 'celebrate' ),
        'parent_item_colon' => __( 'Parent Portfolio Category:', 'celebrate' ),
        'update_item'       => __( 'Update Portfolio Category', 'celebrate' ),
        'add_new_item'      => __( 'Add New Portfolio Category', 'celebrate' ),
        'new_item_name'     => __( 'New Portfolio Category Name', 'celebrate' ),
    );
    $args = array(
        'hierarchical' => true,
        'labels'       => $labels,
        'show_ui'      => true,
        'rewrite'      => true,
    );
    register_taxonomy( 'tcsn_portfoliotags', array( 'tcsn_portfolio' ), $args );
}

/**
 * Registers team post type
 *
 * @since  1.0.0
 */
add_action( 'init', 'tc_celebrate_register_team_posttype' );
function tc_celebrate_register_team_posttype() {
	global $tc_celebrate_options;
	$tc_celebrate_team_slug = '';
	if(isset($tc_celebrate_options['tc_celebrate_team_slug'])) { $tc_celebrate_team_slug = $tc_celebrate_options['tc_celebrate_team_slug']; }
	if( $tc_celebrate_team_slug != ''  ) {
		$return_tc_celebrate_team_slug = $tc_celebrate_team_slug;
	}
	else{
		$return_tc_celebrate_team_slug = 'team-member';
	}
	$labels = array(
		'name'               => _x( 'Team', 'post type general name', 'celebrate' ),
		'singular_name'      => _x( 'Team Member', 'post type singular name', 'celebrate' ),
		'all_items'          => __( 'Team Members', 'celebrate' ),
		'add_new'            => __( 'Add New', 'tcsn-team' ),
		'add_new_item'       => __( 'Add New Team Member', 'celebrate' ),
		'edit_item'          => __( 'Edit Team Member', 'celebrate' ),
		'new_item'           => __( 'New Team Member', 'celebrate' ),
		'view_item'          => __( 'View Team Member', 'celebrate' ),
		'search_items'       => __( 'Search Team Members', 'celebrate' ),
		'not_found'          => __( 'No Team Members found', 'celebrate' ),
		'not_found_in_trash' => __( 'No Team Members found in Trash', 'celebrate' ),
    );
	$args = array(
		'labels'          => $labels,
	    'public'          => true,  
        'show_ui'         => true,  
        'capability_type' => 'post',  
        'hierarchical'    => false,  
        'can_export'      => true,
        'has_archive'     => false,
		'menu_icon'       => 'dashicons-businessman',
        'rewrite'         => array( 'slug' => $return_tc_celebrate_team_slug ),
        'supports'        => array( 'title', 'editor', 'thumbnail', 'excerpt'  ),
	);
	register_post_type( 'tcsn_team', $args );
}

/**
 * Register custom taxonomy for team items.
 *
 * @since  1.0.0
 */
add_action( 'init', 'tc_celebrate_register_team_taxonomy' );
function tc_celebrate_register_team_taxonomy() {
    $labels = array(
        'name'              => _x( 'Team Categories', 'taxonomy general name', 'celebrate' ),
        'singular_name'     => _x( 'Team Category', 'taxonomy singular name', 'celebrate' ),
        'search_items'      => __( 'Search Team Categories', 'celebrate' ),
        'all_items'         => __( 'All Team Categories', 'celebrate' ),
		'edit_item'         => __( 'Edit Team Category', 'celebrate' ),
		'view_item'         => __( 'View Team Category', 'celebrate' ),
        'parent_item'       => __( 'Parent Team Category', 'celebrate' ),
        'parent_item_colon' => __( 'Parent Team Category:', 'celebrate' ),
        'update_item'       => __( 'Update Team Category', 'celebrate' ),
        'add_new_item'      => __( 'Add New Team Category', 'celebrate' ),
        'new_item_name'     => __( 'New Team Category Name', 'celebrate' ),
    );
    $args = array(
        'hierarchical' => true,
        'labels'       => $labels,
        'show_ui'      => true,
        'rewrite'      => true,
    );
    register_taxonomy( 'tcsn_teamtags', array( 'tcsn_team' ), $args );
}

/**
 * Registers testimonial post type
 *
 * @since  1.0.0
 */
add_action( 'init', 'tc_celebrate_register_testimonial_posttype' );
function tc_celebrate_register_testimonial_posttype() {
	global $tc_celebrate_options;
	$tc_celebrate_testimonial_slug = '';
	if(isset($tc_celebrate_options['tc_celebrate_testimonial_slug'])) { $tc_celebrate_testimonial_slug = $tc_celebrate_options['tc_celebrate_testimonial_slug']; }
	if( $tc_celebrate_testimonial_slug != ''  ) {
		$return_tc_celebrate_testimonial_slug = $tc_celebrate_testimonial_slug;
	}
	else{
		$return_tc_celebrate_testimonial_slug = 'reviews';
	}
	$labels = array(
		'name'               => _x( 'Testimonial', 'post type general name', 'celebrate' ),
		'singular_name'      => _x( 'Testimonial', 'post type singular name', 'celebrate' ),
		'all_items'          => __( 'Testimonials', 'celebrate' ),
		'add_new'            => __( 'Add New', 'celebrate' ),
		'add_new_item'       => __( 'Add New Testimonial', 'celebrate' ),
		'edit_item'          => __( 'Edit Testimonial', 'celebrate' ),
		'new_item'           => __( 'New Testimonial', 'celebrate' ),
		'view_item'          => __( 'View Testimonial', 'celebrate' ),
		'search_items'       => __( 'Search Testimonials', 'celebrate' ),
		'not_found'          => __( 'No Testimonials found', 'celebrate' ),
		'not_found_in_trash' => __( 'No Testimonials found in Trash', 'celebrate' ),
    );
	$args = array(
		'labels'          => $labels,
	    'public'          => true,  
        'show_ui'         => true,  
        'capability_type' => 'post',  
        'hierarchical'    => false,  
        'can_export'      => true,
        'has_archive'     => false,
		'menu_icon'       => 'dashicons-editor-quote',
        'rewrite'         => array( 'slug' => $return_tc_celebrate_testimonial_slug ),
        'supports'        => array( 'title', 'editor', 'thumbnail' ),
	);
	register_post_type( 'tcsn_testimonial', $args );
}

/**
 * Custom Twitter Feed Widget
 *
 */

class TC_Celebrate_Widget_Twitter_Feed_new extends WP_Widget {
	
	//Register widget with WordPress
	function __construct() {
		$widget_ops = array( 'classname' => 'tcsn_widget_twitter clearfix', 'description' => __( 'Twitter feed widget', 'celebrate' ), );
		parent::__construct('tcsn-custom-twitter-feed', __( 'Custom - Twitter Feed', 'celebrate' ), $widget_ops);
	}
	
	// Front-end display of widget
	function widget( $args, $instance )
	{
		extract( $args );
		$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
		$consumer_key = $instance['consumer_key'];
		$consumer_secret = $instance['consumer_secret'];
		$user_token = $instance['user_token'];
		$user_secret = $instance['user_secret'];
		$twitter_id = $instance['twitter_id'];
		$count = (int) $instance['count'];

		echo $before_widget;
		
		if ( !empty($instance['title']) ){
			echo $args['before_title'] . $instance['title'] . $args['after_title'];
		}

		if( $consumer_key && $consumer_secret && $user_token && $user_secret && $twitter_id && $count ) { 
		$transName = 'list-tweets-'.$args['widget_id'];
		$cacheTime = 10;
		if( false === ( $twitterData = get_transient($transName) ) ) {
		     // require Twitter OAuth class
		     @require_once 'twitteroauth/twitteroauth.php';
		     $twitterConnection = new TwitterOAuth(
							$consumer_key,	   // App Consumer Key
							$consumer_secret,  // App Consumer secret
							$user_token,       // App Access token
							$user_secret       // App Access token secret
							);
		    $twitterData = $twitterConnection->get(
							  'statuses/user_timeline',
							  array(
							    'screen_name'     => $twitter_id,
							    'count'           => $count,
							    'exclude_replies' => false,
							    'include_rts'     => true, // true to include RT's or false to exclude them
							  )
							);
		     if( $twitterConnection->http_code != 200 )
		     {
				 // Get the value of a transient
		          $twitterData = get_transient( $transName );
		     }

		     // Set/update the value of a transient
		     set_transient( $transName, $twitterData, 60 * $cacheTime );
		};
		$tweets = get_transient( $transName );
		if( $tweets && is_array( $tweets ) ) {
			
		?>
<div id="twitter-<?php echo esc_attr($args['widget_id']); ?>">
    <ul class="list-twitter">
        <?php foreach( $tweets as $tweet ): ?>
        <li>
            <?php
				// Access as an object
				$tweetLatest = $tweet->text;
				
				$tweetLatest = preg_replace('/http:\/\/([a-z0-9_\.\-\+\&\!\#\~\/\,]+)/i', '<a href="http://$1" target="_blank">http://$1</a>', $tweetLatest);
				// #
        		$tweetLatest = preg_replace('/(^|\s)#(\w*[a-zA-Z_]+\w*)/', '\1<a target="_blank" href="https://twitter.com/search?q=%23\2&src=hash">#\2</a>', $tweetLatest);
				// @
				$tweetLatest = preg_replace('/@([a-z0-9_]+)/i', '&nbsp;<a href="http://twitter.com/$1" target="_blank">@$1</a>&nbsp;', $tweetLatest);
								echo $tweetLatest;
			?>
            <span class="tweet-time"><small>
            <?php
				$tweetTime = strtotime($tweet->created_at);
				$timeAgo = $this->ago($tweetTime);
			?>
            <a href="http://twitter.com/<?php echo esc_attr($tweet->user->screen_name); ?>/statuses/<?php echo esc_attr($tweet->id_str); ?>"><?php echo esc_attr($timeAgo); ?></a></small></span> </li>
        <?php endforeach; ?>
    </ul>
	<div class="twitter-info"><i class="icon-twitter twitter-widget-icon"></i>
        <?php _e('Follow &#64;', 'celebrate'); echo esc_attr($twitter_id) ?>
    </div>
</div>
<?php }}
		
		echo $after_widget;
	}
	
	function ago( $time )
	{
	   $periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
	   $lengths = array("60","60","24","7","4.35","12","10");

	   $now = time();

	       $difference = $now - $time;
	       $tense      = "ago";

	   for( $j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++ ) {
	       $difference /= $lengths[$j];
	   }

	   $difference = round( $difference );

	   if( $difference != 1 ) {
	       $periods[$j].= "s";
	   }

	   return "$difference $periods[$j] $tense ";
	}
	
	// Sanitize widget form values as they are saved
	function update( $new_instance, $old_instance )
	{
		$instance = $old_instance;

		$instance['title'] = strip_tags($new_instance['title']);
		$instance['consumer_key'] = $new_instance['consumer_key'];
		$instance['consumer_secret'] = $new_instance['consumer_secret'];
		$instance['user_token'] = $new_instance['user_token'];
		$instance['user_secret'] = $new_instance['user_secret'];
		$instance['twitter_id'] = $new_instance['twitter_id'];
		$instance['count'] = $new_instance['count'];

		return $instance;
	}
	
	// Back-end widget form
	function form( $instance )
	{   
			//Defaults
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'consumer_key' => '', 'consumer_secret' => '', 'user_token' => '', 'user_secret' => '', 'twitter_id' => '', 'count' => '',  ) );
		
 ?>
<p><a href="http://dev.twitter.com/apps" target="_blank">Find or Create your Twitter App</a></p>
<p>
    <label for="<?php echo esc_attr( $this->get_field_id('title') ); ?>">
        <?php _e('Title:', 'celebrate'); ?>
    </label>
    <input class="widefat" id="<?php echo esc_attr( $this->get_field_id('title') ); ?>" name="<?php echo esc_attr( $this->get_field_name('title') ); ?>" type="text" value="<?php echo esc_attr( $instance['title'] ); ?>" />
</p>
<p>
    <label for="<?php echo esc_attr($this->get_field_id('consumer_key')); ?>">
        <?php _e('App Consumer Key :', 'celebrate'); ?>
    </label>
    <input class="widefat" id="<?php echo esc_attr($this->get_field_id('consumer_key')); ?>" name="<?php echo esc_attr($this->get_field_name('consumer_key')); ?>" type="text" value="<?php echo esc_attr($instance['consumer_key']); ?>" />
</p>
<p>
    <label for="<?php echo esc_attr($this->get_field_id('consumer_secret')); ?>">
        <?php _e('App Consumer Secret :', 'celebrate'); ?>
    </label>
    <input class="widefat" id="<?php echo esc_attr($this->get_field_id('consumer_secret')); ?>" name="<?php echo esc_attr($this->get_field_name('consumer_secret')); ?>" type="text" value="<?php echo esc_attr($instance['consumer_secret']); ?>" />
</p>
<p>
    <label for="<?php echo esc_attr($this->get_field_id('user_token')); ?>">
        <?php _e('App Access Token :', 'celebrate'); ?>
    </label>
    <input class="widefat" id="<?php echo esc_attr($this->get_field_id('user_token')); ?>" name="<?php echo esc_attr($this->get_field_name('user_token')); ?>" type="text" value="<?php echo esc_attr(esc_attr($instance['user_token'])); ?>" />
</p>
<p>
    <label for="<?php echo esc_attr($this->get_field_id('user_secret') ); ?>">
        <?php _e('App Access Token Secret :', 'celebrate'); ?>
    </label>
    <input class="widefat" id="<?php echo esc_attr($this->get_field_id('user_secret')); ?>" name="<?php echo esc_attr($this->get_field_name('user_secret')); ?>" type="text" value="<?php echo  esc_attr($instance['user_secret']); ?>" />
</p>
<p>
    <label for="<?php echo esc_attr($this->get_field_id('twitter_id')); ?>">
        <?php _e('Twitter Username :', 'celebrate'); ?>
    </label>
    <input class="widefat" id="<?php echo esc_attr($this->get_field_id('twitter_id')); ?>" name="<?php echo esc_attr($this->get_field_name('twitter_id')); ?>" type="text" value="<?php echo  esc_attr($instance['twitter_id']); ?>" />
</p>
<label for="<?php echo esc_attr($this->get_field_id('count')); ?>">
    <?php _e('Number of Tweets :', 'celebrate'); ?>
</label>
<input class="widefat" style="width: 25px;" id="<?php echo esc_attr($this->get_field_id('count')); ?>" name="<?php echo esc_attr($this->get_field_name('count')); ?>" type="text" value="<?php echo  esc_attr($instance['count']); ?>" />
</p>
<?php
	}
} // class TC_Celebrate_Widget_Twitter_Feed_new

/**
 * Register custom widgets
 *
 */
function tc_celebrate_custom_widgets_init() {
	if ( !is_blog_installed() )
	return;
	register_widget( 'TC_Celebrate_Widget_Twitter_Feed_new' );
}
add_action( 'widgets_init', 'tc_celebrate_custom_widgets_init', 1 );