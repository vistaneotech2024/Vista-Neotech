<?php
/**
 * Custom Widgets
 */

/**
 * Custom Recent Posts Widget
 *
 */
class CELEBRATE_Widget_Recent_Posts extends WP_Widget {
	
    //Register widget with WordPress
	function __construct() {
		$widget_ops = array('classname' => 'celebrate_widget_recent_entries', 'description' => esc_html__( 'The most recent posts on your site', 'celebrate') );
		parent::__construct('celebrate-custom-recent-posts', esc_html__('Custom - Recent Posts', 'celebrate'), $widget_ops);
		$this->alt_option_name = 'celebrate_widget_recent_entries';

	}
	
	// Front-end display of widget
	function widget($args, $instance) {
		if ( ! isset( $args['widget_id'] ) ) {
			$args['widget_id'] = $this->id;
		}

		ob_start();
		extract($args);

		$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
		$number = ( ! empty( $instance['number'] ) ) ? absint( $instance['number'] ) : 10;
		if ( ! $number )
 			$number  = 10;
		$post_thumb  = isset( $instance['post_thumb'] ) ? $instance['post_thumb'] : false;
		$show_date   = isset( $instance['show_date'] ) ? $instance['show_date'] : false;
		$show_hover  = isset( $instance['show_hover'] ) ? $instance['show_hover'] : false;
		$excerpt     = isset( $instance['excerpt'] ) ? $instance['excerpt'] : false;

		$r = new WP_Query( apply_filters( 'widget_posts_args', array( 'posts_per_page' => $number, 'no_found_rows' => true, 'post_status' => 'publish', 'ignore_sticky_posts' => true ) ) );
		if ($r->have_posts()) :
?>
<?php echo balanceTags( $before_widget ); ?>
<?php if ( !empty($instance['title']) ){
			echo balanceTags( $args['before_title'] . $instance['title'] . $args['after_title'] );
		} ?>

<div class="tc-recent-post-widget tc-gallery tc-default-hover clearfix">
<ul class="custom-recent-entries">
	<?php while ( $r->have_posts() ) : $r->the_post(); ?>
	<?php ?>
	<li>
		<?php if ( $instance['post_thumb'] && has_post_thumbnail() ){ ?>
		<div class="custom-recent-entries-thumb ">
			<div class="tc-hover-image"><?php the_post_thumbnail('thumbnail'); ?>
			<?php if( $instance['show_hover'] ){ ?>
			<div class="tc-hover-content"><a class="tc-media-link" href="<?php the_permalink() ?>" title="<?php bloginfo('title'); ?>"></a></div>
			<?php } ?>
			</div>
		</div>
		<?php } ?>
		<div class="custom-recent-entries-info">
			<h6 class="recent-entry-title"> <a href="<?php the_permalink() ?>" title="<?php echo esc_attr( get_the_title() ? get_the_title() : get_the_ID() ); ?>">
			<?php if ( get_the_title() ) the_title(); else the_ID(); ?>
			</a> </h6>
			<?php if($instance['show_date']){ ?>
			<span class="custom-recent-entries-date"><?php echo esc_attr( get_the_date());?></span>
			<?php } ?>
		</div>
		<?php if($instance['excerpt']){ ?>
		<span class="custom-recent-entries-excerpt"> <?php echo wp_trim_words( get_the_excerpt(), 15, '...' ); ?> </span>
		<?php } ?>
	</li>
	<?php endwhile; ?>
</ul></div>
<?php echo balanceTags( $after_widget ); ?>
<?php	wp_reset_postdata();
		endif;
	}
	// Sanitize widget form values as they are saved
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] 			= strip_tags($new_instance['title']);
		$instance['number'] 		= (int) $new_instance['number'];
		$instance['post_thumb'] 	= (bool)$new_instance['post_thumb'];  
		$instance['show_date'] 		= (bool)$new_instance['show_date'];  
		$instance['show_hover']		= (bool)$new_instance['show_hover'];   
		$instance['excerpt'] 		= (bool)$new_instance['excerpt'];  

		if ( isset($alloptions['celebrate_widget_recent_entries']) )
			delete_option('celebrate_widget_recent_entries');

		return $instance;
	}

	// Back-end widget form
	function form( $instance ) {
		// Defaults
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'number' => 1, 'post_thumb' => 1, 'show_date' => 1, 'show_hover' => 1, 'excerpt' => 1, ) );
	
?>
<p>
	<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
		<?php esc_html_e( 'Title:', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr($instance['title']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr( $this->get_field_id( 'number' ) ); ?>">
		<?php esc_html_e( 'Number of posts to show:', 'celebrate' ); ?>
	</label>
	<input id="<?php echo esc_attr( $this->get_field_id( 'number' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'number' )); ?>" type="text" value="<?php echo  esc_attr($instance['number']); ?>" size="3" />
</p>
<p>
	<input type="checkbox" id="<?php echo esc_attr( $this->get_field_id( 'post_thumb' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'post_thumb' )); ?>" value="1" <?php echo ($instance['post_thumb'] == "true" ? "checked='checked'" : ""); ?> />
	<label for="<?php echo $this->get_field_id( 'post_thumb' ); ?>">
		<?php esc_html_e('Display thumbnail?', 'celebrate'); ?>
	</label>
</p>
<p>
	<input type="checkbox" id="<?php echo esc_attr( $this->get_field_id( 'show_hover' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'show_hover' )); ?>" value="1" <?php echo ($instance['show_hover'] == "true" ? "checked='checked'" : ""); ?> />
	<label for="<?php echo esc_attr( $this->get_field_id( 'show_hover' )); ?>">
		<?php esc_html_e('Show Link Icon on Thumb on Hover?', 'celebrate'); ?>
	</label>
</p>
<p>
	<input type="checkbox" id="<?php echo esc_attr( $this->get_field_id( 'show_date' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'show_date' )); ?>" value="1" <?php echo ($instance['show_date'] == "true" ? "checked='checked'" : ""); ?> />
	<label for="<?php echo esc_attr( $this->get_field_id( 'show_date' )); ?>">
		<?php esc_html_e('Display post date?', 'celebrate'); ?>
	</label>
</p>
<p>
	<input type="checkbox" id="<?php echo esc_attr( $this->get_field_id( 'excerpt' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'excerpt' )); ?>" value="1" <?php echo ($instance['excerpt'] == "true" ? "checked='checked'" : ""); ?> />
	<label for="<?php echo esc_attr( $this->get_field_id( 'excerpt' )); ?>">
		<?php esc_html_e('Display excerpt?', 'celebrate'); ?>
	</label>
</p>
<?php
	}
} // class CELEBRATE_Widget_Recent_Posts

/**
 * Custom Tag cloud Widget
 *
 */
class CELEBRATE_Widget_Tag_Cloud extends WP_Widget {
	
	//Register widget with WordPress
	function __construct() {
		$widget_ops = array( 'description' => esc_html__( 'Your most used tags in cloud format', 'celebrate') );
		parent::__construct('celebrate-custom-tag-cloud', esc_html__( 'Custom - Tag Cloud', 'celebrate' ), $widget_ops);
	}

	// Front-end display of widget
	function widget( $args, $instance ) {
		extract( $args );
		$current_taxonomy = $this->_get_current_taxonomy($instance);
		if ( !empty($instance['title']) ) {
			$title = $instance['title'];
		} else {
			if ( 'post_tag' == $current_taxonomy ) {
				$title = esc_html__('Tags', 'celebrate');
			} else {
				$tax = get_taxonomy($current_taxonomy);
				$title = $tax->labels->name;
			}
		}
		$title = apply_filters('widget_title', $title, $instance, $this->id_base);

		echo balanceTags( $before_widget );
		if ( $title )
			echo balanceTags( $before_title . $title . $after_title );

		echo '<div class="custom-tagcloud clearfix">';
		wp_tag_cloud( 'number=18', apply_filters('celebrate_widget_tag_cloud_args', array('taxonomy' => $current_taxonomy) ) );
		echo "</div>\n";
		echo balanceTags( $after_widget );
	}

	// Sanitize widget form values as they are saved
	function update( $new_instance, $old_instance ) {
		$instance['title'] = strip_tags(stripslashes($new_instance['title']));
		$instance['taxonomy'] = stripslashes($new_instance['taxonomy']);
		return $instance;
	}
	
	// Back-end widget form
	function form( $instance ) {
		
		$current_taxonomy = $this->_get_current_taxonomy($instance);
?>
<p>
	<label for="<?php echo esc_attr( $this->get_field_id('title') ); ?>">
		<?php esc_html_e( 'Title:', 'celebrate' ); ?>
	</label>
	<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id('title') ); ?>" name="<?php echo esc_attr( $this->get_field_name('title') ); ?>" value="<?php if (isset ( $instance['title'])) {echo esc_attr( $instance['title'] );} ?>" />
</p>
<?php
	}

	function _get_current_taxonomy($instance) {
		if ( !empty($instance['taxonomy']) && taxonomy_exists($instance['taxonomy']) )
			return $instance['taxonomy'];

		return 'post_tag';
	}
} // class CELEBRATE_Widget_Tag_Cloud

/**
 * Custom Flickr Feed widget
 *
 */

class CELEBRATE_Widget_Flicker_Feed extends WP_Widget {

	 //Register widget with WordPress
	function __construct() {
		$widget_ops = array( 'classname' => 'celebrate_widget_flickr', 'description' => esc_html__( 'Flickr photo stream', 'celebrate' ), );
		parent::__construct('celebrate-custom-flickr-feed', esc_html__( 'Custom - Flickr Feed', 'celebrate' ), $widget_ops);
	}
	
	//Register widget with WordPress
	function widget( $args, $instance ) {

		extract( $args );
		
		$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
		
		echo balanceTags( $before_widget );
		
		if ( !empty($instance['title']) ){
			echo balanceTags( $args['before_title'] . $instance['title'] . $args['after_title'] );
		}
		
		echo '<div class="flickr-feed clearfix">';
			echo'<script src="http://www.flickr.com/badge_code_v2.gne?count='. $instance['number'] .'&amp;display='. $instance['sortby'] .'&amp;size=s&amp;layout=x&amp;source=user&amp;user='. $instance['flickr_id'] .'"></script>';
			echo '<div class=" clearfix"></div><p class="flickr-stream"><a href="http://www.flickr.com/photos/'. $instance['flickr_id'] .'" target="_blank">View stream on flickr</a></p>';
		echo '</div>';

		echo balanceTags( $after_widget );
	}

	// Sanitize widget form values as they are saved
	function update( $new_instance, $old_instance )
	{
		$instance = $old_instance;

		$instance['title'] = strip_tags($new_instance['title']);
		$instance['flickr_id'] = strip_tags( $new_instance['flickr_id'] );
		$instance['number'] = (int) $new_instance['number'];
		$instance['sortby'] = strip_tags( $new_instance['sortby'] );
		
		return $instance;
	}
	
	// Back-end widget form
	function form( $instance )
	{   
		//Defaults
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'flickr_id' => '52617155@N08', 'number' => '6', 'sortby' => 'latest', ) );
		
 ?>
<p>
	<label for="<?php echo esc_attr( $this->get_field_id('title') ); ?>">
		<?php esc_html_e( 'Title :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr( $this->get_field_id('title') ); ?>" name="<?php echo esc_attr( $this->get_field_name('title') ); ?>" type="text" value="<?php echo esc_attr( $instance['title'] ); ?>" />
</p>
<p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('flickr_id')); ?>">
		<?php esc_html_e( 'Flickr ID : <a href="http://idgettr.com/" target="_blank">Get your flickr ID</a>', 'celebrate' ); ?>
	</label>
	<input class="widefat" type="text" id="<?php echo esc_attr($this->get_field_id('flickr_id')); ?>" name="<?php echo esc_attr($this->get_field_name('flickr_id')); ?>" value="<?php echo esc_attr($instance['flickr_id']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('number')); ?>">
		<?php esc_html_e( 'Number of photos to show (max 10) :', 'celebrate' ) ?>
	</label>
	<input class="widefat" type="text" style="width: 25px;" id="<?php echo esc_attr($this->get_field_id('number')); ?>" name="<?php echo esc_attr($this->get_field_name('number')); ?>" value="<?php echo esc_attr($instance['number']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('sortby')); ?>">
		<?php esc_html_e( 'Sort by :', 'celebrate' ); ?>
	</label>
	<select name="<?php echo esc_attr($this->get_field_name('sortby')); ?>" id="<?php echo esc_attr($this->get_field_id('sortby')); ?>" class="widefat">
		<option value="latest"<?php selected($instance['sortby'], 'latest'); ?>>
		<?php esc_html_e( 'latest', 'celebrate' ); ?>
		</option>
		<option value="random"<?php selected($instance['sortby'], 'random'); ?>>
		<?php esc_html_e( 'random', 'celebrate' ); ?>
		</option>
	</select>
</p>
<?php
	}
} // class CELEBRATE_Widget_Flicker_Feed

/**
 * Custom Contact info widget
 *
 */

class CELEBRATE_Widget_Contact_Info extends WP_Widget {
	
	//Register widget with WordPress
	function __construct() {
		$widget_ops = array( 'classname' => 'celebrate_widget_conatct_info', 'description' => esc_html__( 'Contact info', 'celebrate' ), );
		parent::__construct('celebrate-custom-contact-info', esc_html__( 'Custom - Contact Info', 'celebrate' ), $widget_ops);
	}
	
	function widget( $args, $instance )
	{
		extract( $args );
		$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
		$address = apply_filters( 'widget_text', empty( $instance['address'] ) ? '' : $instance['address'], $instance );

		echo balanceTags( $before_widget );
		
		if ( !empty($instance['title']) ){
			
			echo balanceTags( $args['before_title'] . $instance['title'] . $args['after_title'] );
		}
		?>
<div class="widget-contact-info">
	<ul class="tc-widget-contact-list">
		<?php if($instance['phone']): ?>
		<li><span class="widget-phone tc-contact-icon"></span><span class="tc-widget-add-text"><?php echo esc_attr( $instance['phone'] ); ?></span></li>
		<?php endif; ?>
		<?php if($instance['emailtxt']): ?>
		<li><span class="widget-email tc-contact-icon"></span><span class="tc-widget-add-text">
			<?php if($instance['email']){ ?>
			<a href="mailto:<?php echo  esc_attr( $instance['email'] ); ?>">
			<?php } ?>
			<?php if($instance['emailtxt']) { echo esc_attr( $instance['emailtxt'] ); } else { echo esc_attr( $instance['email'] ); } ?>
			<?php if($instance['email']){ ?>
			</a>
			<?php } ?>
			</span></li>
		<?php endif; ?>
		<?php if($instance['address']): ?>
		<li><span class="widget-address tc-contact-icon"></span><div class="tc-widget-add-text"><?php echo !empty( $instance['filter'] ) ? wpautop( $address ) : $address; ?></div></li>
		<?php endif; ?>
	</ul>
</div>
<?php
		echo balanceTags( $after_widget );
	}
	
	function update( $new_instance, $old_instance )
	{
		$instance = $old_instance;

		$instance['title'] = strip_tags( stripslashes($new_instance['title']) );
		
		if ( current_user_can('unfiltered_html') )
			$instance['address'] =  $new_instance['address'];
		else
			$instance['address'] = stripslashes( wp_filter_post_kses( addslashes($new_instance['address']) ) ); // wp_filter_post_kses() expects slashed
			
		$instance['filter'] = isset($new_instance['filter']);
		$instance['phone'] = $new_instance['phone'];
		$instance['email'] = $new_instance['email'];
		$instance['emailtxt'] = $new_instance['emailtxt'];

		return $instance;
	}

	function form( $instance )
	{
		// Defaults
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'address' => '', 'phone' => '', 'email' => '',  'emailtxt' => '', ) );

 ?>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('title')); ?>">
		<?php esc_html_e( 'Title :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($instance['title']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('phone')); ?>">
		<?php esc_html_e( 'Phone :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('phone')); ?>" name="<?php echo esc_attr($this->get_field_name('phone')); ?>" type="text" value="<?php echo esc_attr($instance['phone']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('email')); ?>">
		<?php esc_html_e( 'Email address :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('email')); ?>" name="<?php echo esc_attr($this->get_field_name('email')); ?>" type="text" value="<?php echo esc_attr($instance['email']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('emailtxt')); ?>">
		<?php esc_html_e( 'Email Link Text :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('emailtxt')); ?>" name="<?php echo esc_attr($this->get_field_name('emailtxt')); ?>" type="text" value="<?php echo esc_attr($instance['emailtxt']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('address')); ?>">
		<?php esc_html_e( 'Address :', 'celebrate' ); ?>
	</label>
	<textarea class="widefat" rows="3" cols="20" id="<?php echo esc_attr($this->get_field_id('address')); ?>" name="<?php echo esc_attr($this->get_field_name('address')); ?>"><?php echo esc_attr($instance['address']); ?></textarea>
</p>
<p>
	<input id="<?php echo esc_attr($this->get_field_id('filter')); ?>" name="<?php echo esc_attr($this->get_field_name('filter')); ?>" type="checkbox" <?php checked(isset($instance['filter']) ? $instance['filter'] : 0); ?> />
	&nbsp;
	<label for="<?php echo esc_attr($this->get_field_id('filter')); ?>">
		<?php esc_html_e( 'Automatically add paragraphs to address', 'celebrate' ); ?>
	</label>
</p>
<?php
	}
} // class CELEBRATE_Widget_Contact_Info


/**
 * Social Network Widget
 *
 */
class CELEBRATE_Widget_Social_Network extends WP_Widget {
	
	//Register widget with WordPress
	function __construct() {
		$widget_ops = array( 'classname' => 'celebrate_widget_social_network', 'description' => esc_html__( 'Social network', 'celebrate' ), );
		parent::__construct('celebrate-custom-social-network', esc_html__( 'Custom - Social Network', 'celebrate' ), $widget_ops);
	}
	
	// Front-end display of widget
	function widget( $args, $instance ) {
	extract( $args );
	$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
	echo balanceTags( $before_widget );
	
	if ( !empty($instance['title']) ){
		echo balanceTags( $args['before_title'] . $instance['title'] . $args['after_title'] );
	}
	?>
<?php $add_bg = ''; $add_color_style = ''; ?>
<?php if ( !empty($instance['background']) ){ $add_bg = ''. $instance['background'] .''; 
	} else {  $add_bg = ''; } ?>
<?php if ( !empty($instance['color_style']) ){ $add_color_style = ''. $instance['color_style'] .''; 
	} else {  $add_color_style = ''; } ?>
<ul class="tc-social clearfix <?php echo esc_attr( $add_bg ) ?> <?php echo esc_attr( $add_color_style ) ?>">
	<?php if($instance['behance']): ?>
	<li><a href="<?php echo esc_url( $instance['behance'] ); ?>"  class="behance" target="_blank" title="<?php esc_html_e( 'behance', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['delicious']): ?>
	<li><a href="<?php echo esc_url( $instance['delicious'] ); ?>"  class="delicious" target="_blank" title="<?php esc_html_e( 'delicious', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['dribbble']): ?>
	<li><a href="<?php echo esc_url( $instance['dribbble'] ); ?>"  class="dribbble" target="_blank" title="<?php esc_html_e( 'dribbble', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['dropbox']): ?>
	<li><a href="<?php echo esc_url( $instance['dropbox'] ); ?>"  class="dropbox" target="_blank" title="<?php esc_html_e( 'dropbox', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['facebook']): ?>
	<li><a href="<?php echo esc_url( $instance['facebook'] ); ?>"  class="facebook" target="_blank" title="<?php esc_html_e( 'facebook', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['flickr']): ?>
	<li><a href="<?php echo esc_url( $instance['flickr'] ); ?>"  class="flickr" target="_blank" title="<?php esc_html_e( 'flickr', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['forumbee']): ?>
	<li><a href="<?php echo esc_url( $instance['forumbee'] ); ?>"  class="forumbee" target="_blank" title="<?php esc_html_e( 'forumbee', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['foursquare']): ?>
	<li><a href="<?php echo esc_url( $instance['foursquare'] ); ?>"  class="foursquare" target="_blank" title="<?php esc_html_e( 'foursquare', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['github']): ?>
	<li><a href="<?php echo esc_url( $instance['github'] ); ?>"  class="github" target="_blank" title="<?php esc_html_e( 'github', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['googleplus']): ?>
	<li><a href="<?php echo esc_url( $instance['googleplus'] ); ?>"  class="googleplus" target="_blank" title="<?php esc_html_e( 'googleplus', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['instagram']): ?>
	<li><a href="<?php echo esc_url( $instance['instagram'] ); ?>" class="instagram" target="_blank" title="<?php esc_html_e( 'instagram', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['linkedin']): ?>
	<li><a href="<?php echo esc_url( $instance['linkedin'] ); ?>"  class="linkedin" target="_blank" title="<?php esc_html_e( 'linkedin', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['medium']): ?>
	<li><a href="<?php echo esc_url( $instance['medium'] ); ?>"  class="medium" target="_blank" title="<?php esc_html_e( 'medium', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['paypal']): ?>
	<li><a href="<?php echo esc_url( $instance['paypal'] ); ?>"  class="paypal" target="_blank" title="<?php esc_html_e( 'paypal', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['pinterest']): ?>
	<li><a href="<?php echo esc_url( $instance['pinterest'] ); ?>"  class="pinterest" target="_blank" title="<?php esc_html_e( 'pinterest', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['reddit']): ?>
	<li><a href="skype:<?php echo esc_url( $instance['reddit'] ); ?>?chat"  class="reddit" target="_blank" title="<?php esc_html_e( 'reddit', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['skype']): ?>
	<li><a href="skype:<?php echo esc_url( $instance['skype'] ); ?>?chat"  class="skype" target="_blank" title="<?php esc_html_e( 'skype', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['soundcloud']): ?>
	<li><a href="<?php echo esc_url( $instance['soundcloud'] ); ?>"  class="soundcloud" target="_blank" title="<?php esc_html_e( 'soundcloud', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['spotify']): ?>
	<li><a href="<?php echo esc_url( $instance['spotify'] ); ?>"  class="spotify" target="_blank" title="<?php esc_html_e( 'spotify', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['stumbleupon']): ?>
	<li><a href="<?php echo esc_url( $instance['stumbleupon'] ); ?>"  class="stumbleupon" target="_blank" title="<?php esc_html_e( 'stumbleupon', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['tumblr']): ?>
	<li><a href="<?php echo esc_url( $instance['tumblr'] ); ?>"  class="tumblr" target="_blank" title="<?php esc_html_e( 'tumblr', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['twitter']): ?>
	<li><a href="<?php echo esc_url( $instance['twitter'] ); ?>"  class="twitter" target="_blank" title="<?php esc_html_e( 'twitter', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['yahoo']): ?>
	<li><a href="<?php echo esc_url( $instance['yahoo'] ); ?>"  class="yahoo" target="_blank" title="<?php esc_html_e( 'yahoo', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['youtube']): ?>
	<li><a href="<?php echo esc_url( $instance['youtube'] ); ?>"  class="youtube" target="_blank" title="<?php esc_html_e( 'youtube', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['vimeo']): ?>
	<li><a href="<?php echo esc_url( $instance['vimeo'] ); ?>"  class="vimeo" target="_blank" title="<?php esc_html_e( 'vimeo', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['vine']): ?>
	<li><a href="<?php echo esc_url( $instance['vine'] ); ?>"  class="vine" target="_blank" title="<?php esc_html_e( 'vine', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['vk']): ?>
	<li><a href="<?php echo esc_url( $instance['vk'] ); ?>"  class="vk" target="_blank" title="<?php esc_html_e( 'vk', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['xing']): ?>
	<li><a href="<?php echo esc_url( $instance['xing'] ); ?>"  class="xing" target="_blank" title="<?php esc_html_e( 'xing', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['yelp']): ?>
	<li><a href="<?php echo esc_url( $instance['yelp'] ); ?>"  class="yelp" target="_blank" title="<?php esc_html_e( 'yelp', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['rss']): ?>
	<li><a href="<?php echo esc_url( $instance['rss'] ); ?>"  class="rss" target="_blank" title="<?php esc_html_e( 'rss', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
	<?php if($instance['mail']): ?>
	<li><a href="mailto:<?php echo esc_attr( $instance['mail'] ); ?>"  class="mail" target="_blank" title="<?php esc_html_e( 'mail', 'celebrate' ); ?>"></a></li>
	<?php endif; ?>
</ul>
<?php
	echo balanceTags( $after_widget );
	}
	
	// Sanitize widget form values as they are saved
	function update( $new_instance, $old_instance ) {
	$instance = $old_instance;
	
	$instance['title'] = strip_tags($new_instance['title']);
	$instance['background'] = strip_tags( $new_instance['background'] );
	$instance['color_style'] = strip_tags( $new_instance['color_style'] );
	$instance['behance'] = $new_instance['behance'];
	$instance['delicious'] = $new_instance['delicious'];
	$instance['dribbble'] = $new_instance['dribbble'];
	$instance['dropbox'] = $new_instance['dropbox'];
	$instance['facebook'] = $new_instance['facebook'];
	$instance['flickr'] = $new_instance['flickr'];
	$instance['forumbee'] = $new_instance['forumbee'];
	$instance['foursquare'] = $new_instance['foursquare'];
	$instance['github'] = $new_instance['github'];
	$instance['googleplus'] = $new_instance['googleplus'];
	$instance['instagram'] = $new_instance['instagram'];
	$instance['linkedin'] = $new_instance['linkedin'];
	$instance['medium'] = $new_instance['medium'];
	$instance['paypal'] = $new_instance['paypal'];		
    $instance['pinterest'] = $new_instance['pinterest'];
	$instance['reddit'] = $new_instance['reddit'];						
	$instance['skype'] = $new_instance['skype'];
	$instance['soundcloud'] = $new_instance['soundcloud'];
	$instance['spotify'] = $new_instance['spotify'];		
	$instance['stumbleupon'] = $new_instance['stumbleupon'];
	$instance['tumblr'] = $new_instance['tumblr'];								
	$instance['twitter'] = $new_instance['twitter'];								
	$instance['vimeo'] = $new_instance['vimeo'];	
	$instance['vine'] = $new_instance['vine'];
	$instance['vk'] = $new_instance['vk'];
	$instance['xing'] = $new_instance['xing'];									
	$instance['yahoo'] = $new_instance['yahoo'];
	$instance['yelp'] = $new_instance['yelp'];
	$instance['youtube'] = $new_instance['youtube'];
	$instance['rss'] = $new_instance['rss'];
	$instance['mail'] = $new_instance['mail'];

	return $instance;
	}
	
	// Back-end widget form
	function form( $instance ) {
		
		// Defaults
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'background' => '', 'color_style' => '', 'behance' => '', 'delicious' => '', 'dribbble' => '', 'dropbox' => '', 'facebook' => '', 'flickr' => '', 'forumbee' => '', 'foursquare' => '', 'github' => '', 'googleplus' => '', 'instagram' => '', 'linkedin' => '', 'medium' => '', 'paypal' => '', 'pinterest' => '', 'reddit' => '', 'skype' => '', 'soundcloud' => '', 'spotify' => '', 'stumbleupon' => '', 'tumblr' => '', 'twitter' => '', 'viadeo' => '', 'vimeo' => '', 'vine' => '', 'vk' => '', 'xing' => '', 'yahoo' => '', 'yelp' => '', 'youtube' => '', 'rss' => '','mail' => '', ) );
		
	?>
<p>Enter the full URL. Leave the field blank, if do not want to display any social link.</p>
<p>
	<label for="<?php echo esc_attr( $this->get_field_id('title') ); ?>">
		<?php esc_html_e( 'Title :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr( $this->get_field_id('title') ); ?>" name="<?php echo esc_attr( $this->get_field_name('title') ); ?>" type="text" value="<?php echo esc_attr( $instance['title'] ); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('background')); ?>">
		<?php esc_html_e( 'Background on Hover :', 'celebrate' ); ?>
	</label>
	<select name="<?php echo esc_attr($this->get_field_name('background')); ?>" id="<?php echo esc_attr($this->get_field_id('background')); ?>" class="widefat">
		<option value="tc-social-default"<?php selected($instance['background'], 'tc-social-default'); ?>>
		<?php esc_html_e( 'Default - No Background', 'celebrate' ); ?>
		</option>
		<option value="tc-social-default tc-social-mini"<?php selected($instance['background'], 'tc-social-default tc-social-mini'); ?>>
		<?php esc_html_e( 'Small Size Icon - No Background', 'celebrate' ); ?>
		</option>
		<option value="tc-social-square"<?php selected($instance['background'], 'tc-social-square'); ?>>
		<?php esc_html_e( 'Square', 'celebrate' ); ?>
		</option>
		<option value="tc-social-circle"<?php selected($instance['background'], 'tc-social-circle'); ?>>
		<?php esc_html_e( 'Circle', 'celebrate' ); ?>
		</option>
	</select>
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('color_style')); ?>">
		<?php esc_html_e( 'Color Style :', 'celebrate' ); ?>
	</label>
	<select name="<?php echo esc_attr($this->get_field_name('color_style')); ?>" id="<?php echo esc_attr($this->get_field_id('color_style')); ?>" class="widefat">
		<option value="tc-social-dark"<?php selected($instance['color_style'], 'tc-social-dark'); ?>>
		<?php esc_html_e( 'Default / Dark - For Light Backgrounds', 'celebrate' ); ?>
		</option>
		<option value="tc-social-light"<?php selected($instance['color_style'], 'tc-social-light'); ?>>
		<?php esc_html_e( 'Light - For Dark Backgrounds', 'celebrate' ); ?>
		</option>
	</select>
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('behance')); ?>">
		<?php esc_html_e( 'Behance URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('behance')); ?>" name="<?php echo esc_attr($this->get_field_name('behance')); ?>" type="text" value="<?php echo esc_attr($instance['behance']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('delicious')); ?>">
		<?php esc_html_e( 'Delicious URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('delicious')); ?>" name="<?php echo esc_attr($this->get_field_name('delicious')); ?>" type="text" value="<?php echo esc_attr($instance['delicious']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('dribbble')); ?>">
		<?php esc_html_e( 'Dribbble URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('dribbble')); ?>" name="<?php echo esc_attr($this->get_field_name('dribbble')); ?>" type="text" value="<?php echo esc_attr($instance['dribbble']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('dropbox')); ?>">
		<?php esc_html_e( 'Dropbox URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('dropbox')); ?>" name="<?php echo esc_attr($this->get_field_name('dropbox')); ?>" type="text" value="<?php echo esc_attr($instance['dropbox']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('facebook')); ?>">
		<?php esc_html_e( 'Facebook URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('facebook')); ?>" name="<?php echo esc_attr($this->get_field_name('facebook')); ?>" type="text" value="<?php echo esc_attr($instance['facebook']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('flickr')); ?>">
		<?php esc_html_e( 'Flickr URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('flickr')); ?>" name="<?php echo esc_attr($this->get_field_name('flickr')); ?>" type="text" value="<?php echo esc_attr($instance['flickr']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('forumbee')); ?>">
		<?php esc_html_e( 'Forumbee URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('forumbee')); ?>" name="<?php echo esc_attr($this->get_field_name('forumbee')); ?>" type="text" value="<?php echo esc_attr($instance['forumbee']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('foursquare')); ?>">
		<?php esc_html_e( 'Foursquare URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('foursquare')); ?>" name="<?php echo esc_attr($this->get_field_name('foursquare')); ?>" type="text" value="<?php echo esc_attr($instance['foursquare']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('github')); ?>">
		<?php esc_html_e( 'Github URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('github')); ?>" name="<?php echo esc_attr($this->get_field_name('github')); ?>" type="text" value="<?php echo esc_attr($instance['github']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('googleplus')); ?>">
		<?php esc_html_e( 'Googleplus URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('googleplus')); ?>" name="<?php echo esc_attr($this->get_field_name('googleplus')); ?>" type="text" value="<?php echo esc_attr($instance['googleplus']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('instagram')); ?>">
		<?php esc_html_e( 'Instagram URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('instagram')); ?>" name="<?php echo esc_attr($this->get_field_name('instagram')); ?>" type="text" value="<?php echo esc_attr( $instance['instagram']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('linkedin')); ?>">
		<?php esc_html_e( 'Linkedin URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('linkedin')); ?>" name="<?php echo esc_attr($this->get_field_name('linkedin')); ?>" type="text" value="<?php echo esc_attr($instance['linkedin']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('medium')); ?>">
		<?php esc_html_e( 'Medium URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('medium')); ?>" name="<?php echo esc_attr($this->get_field_name('medium')); ?>" type="text" value="<?php echo esc_attr($instance['medium']); ?>" />
</p>
<p>
	<label for="<?php echo $this->get_field_id('paypal'); ?>">
		<?php esc_html_e( 'Paypal URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo $this->get_field_id('paypal'); ?>" name="<?php echo $this->get_field_name('paypal'); ?>" type="text" value="<?php echo esc_attr( $instance['paypal'] ); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('pinterest')); ?>">
		<?php esc_html_e( 'Pinterest URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('pinterest')); ?>" name="<?php echo esc_attr($this->get_field_name('pinterest')); ?>" type="text" value="<?php echo esc_attr($instance['pinterest']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('reddit')); ?>">
		<?php esc_html_e( 'Reddit URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('reddit')); ?>" name="<?php echo esc_attr($this->get_field_name('reddit')); ?>" type="text" value="<?php echo esc_attr($instance['reddit']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('skype')); ?>">
		<?php esc_html_e( "Skype Username : Provide Username Only", 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('skype')); ?>" name="<?php echo esc_attr($this->get_field_name('skype')); ?>" type="text" value="<?php echo esc_attr($instance['skype']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('soundcloud')); ?>">
		<?php esc_html_e( 'Soundcloud URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('soundcloud')); ?>" name="<?php echo esc_attr($this->get_field_name('soundcloud')); ?>" type="text" value="<?php echo esc_attr($instance['soundcloud']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('spotify')); ?>">
		<?php esc_html_e( 'Spotify URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('spotify')); ?>" name="<?php echo esc_attr($this->get_field_name('spotify')); ?>" type="text" value="<?php echo esc_attr($instance['spotify']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('stumbleupon')); ?>">
		<?php esc_html_e( 'Stumbleupon URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('stumbleupon')); ?>" name="<?php echo esc_attr($this->get_field_name('stumbleupon')); ?>" type="text" value="<?php echo esc_attr($instance['stumbleupon']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('tumblr')); ?>">
		<?php esc_html_e( 'Tumblr URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('tumblr')); ?>" name="<?php echo esc_attr($this->get_field_name('tumblr')); ?>" type="text" value="<?php echo esc_attr($instance['tumblr']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('twitter')); ?>">
		<?php esc_html_e( 'Twitter URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('twitter')); ?>" name="<?php echo esc_attr($this->get_field_name('twitter')); ?>" type="text" value="<?php echo esc_attr($instance['twitter']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('vimeo')); ?>">
		<?php esc_html_e( 'Vimeo URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('vimeo')); ?>" name="<?php echo esc_attr($this->get_field_name('vimeo')); ?>" type="text" value="<?php echo esc_attr($instance['vimeo']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('vine')); ?>">
		<?php esc_html_e( 'Vine URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('vine')); ?>" name="<?php echo esc_attr($this->get_field_name('vine')); ?>" type="text" value="<?php echo esc_attr($instance['vine']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('vk')); ?>">
		<?php esc_html_e( 'VK URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('vk')); ?>" name="<?php echo esc_attr($this->get_field_name('vk')); ?>" type="text" value="<?php echo esc_attr($instance['vk']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('xing')); ?>">
		<?php esc_html_e( 'Xing URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('xing')); ?>" name="<?php echo esc_attr($this->get_field_name('xing')); ?>" type="text" value="<?php echo esc_attr($instance['xing']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('yahoo')); ?>">
		<?php esc_html_e( 'Yahoo URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('yahoo')); ?>" name="<?php echo esc_attr($this->get_field_name('yahoo')); ?>" type="text" value="<?php echo esc_attr($instance['yahoo']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('yelp')); ?>">
		<?php esc_html_e( 'Yelp URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('yelp')); ?>" name="<?php echo esc_attr($this->get_field_name('yelp')); ?>" type="text" value="<?php echo esc_attr($instance['yelp']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('youtube')); ?>">
		<?php esc_html_e( 'Youtube URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('youtube')); ?>" name="<?php echo esc_attr($this->get_field_name('youtube')); ?>" type="text" value="<?php echo esc_attr($instance['youtube']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('rss')); ?>">
		<?php esc_html_e( 'RSS URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('rss')); ?>" name="<?php echo esc_attr($this->get_field_name('rss')); ?>" type="text" value="<?php echo esc_attr($instance['rss']); ?>" />
</p>
<p>
	<label for="<?php echo esc_attr($this->get_field_id('mail')); ?>">
		<?php esc_html_e( 'Mail URL :', 'celebrate' ); ?>
	</label>
	<input class="widefat" id="<?php echo esc_attr($this->get_field_id('mail')); ?>" name="<?php echo esc_attr($this->get_field_name('mail')); ?>" type="text" value="<?php echo esc_attr($instance['mail']); ?>" />
</p>
<?php
	}
} // class CELEBRATE_Widget_Social_Network

/**
 * Register custom widgets
 *
 */
function celebrate_custom_widgets_init() {
	if ( !is_blog_installed() )
	return;
	
	register_widget( 'CELEBRATE_Widget_Recent_Posts' );
	register_widget( 'CELEBRATE_Widget_Tag_Cloud' );
	register_widget( 'CELEBRATE_Widget_Flicker_Feed' );
	register_widget( 'CELEBRATE_Widget_Contact_Info' );
	register_widget( 'CELEBRATE_Widget_Social_Network' );
}
add_action( 'widgets_init', 'celebrate_custom_widgets_init', 1 );

