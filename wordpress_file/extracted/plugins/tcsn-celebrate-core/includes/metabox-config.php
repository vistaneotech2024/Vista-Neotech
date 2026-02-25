<?php
/**
 * Include and setup custom metaboxes and fields.
 */
add_action( 'cmb2_admin_init', 'celebrate_metaboxes' );
/**
 * Hook in and add a metabox
 */
function celebrate_metaboxes() {
	
	// Prefix
	$prefix = '_celebrate_';
	
	// Display metaboxes according to post format
	add_action( 'admin_print_scripts', 'celebrate_display_metaboxes', 1000 );
    function celebrate_display_metaboxes() {
    	if ( get_post_type() == "post" ) :
        ?>
	<script type="text/javascript">
		jQuery( document ).ready( function($) {
	
		var	$pfaudio = $('#format-post-audio').hide(),
			$pfgallery = $('#format-post-gallery').hide(),
			$pflink = $('#format-post-link').hide(),
			$pfquote = $('#format-post-quote').hide(),
			$pfvideo = $('#format-post-video').hide(),
			$post_format = $('input[name="post_format"]');
	
		$post_format.each(function() {
			var $this = $(this);
			if( $this.is(':checked') )
				change_post_format( $this.val() );
		});
	
		$post_format.change(function() {
			change_post_format( $(this).val() );
		});
	
		function change_post_format( val ) {
			$pfaudio.hide();
			$pfgallery.hide();
			$pflink.hide();
			$pfquote.hide();
			$pfvideo.hide();
			
			if( val === 'audio' ) {
				$pfaudio.show();
			} else if( val === 'gallery' ) {
				$pfgallery.show();
			} else if( val === 'link' ) {
				$pflink.show();
			} else if( val === 'quote' ) {
				$pfquote.show();
			} else if( val === 'video' ) {
				$pfvideo.show();
			}
		}
	});
     </script>
	<?php
    	endif;
	 }

	// All Revolution sliders in array
	$revolutionslider = array();
	if( class_exists('RevSlider') ) {
		$theslider = new RevSlider();
		$arrSliders = $theslider->getArrSliders();
		$revolutionslider[0] = 'Select a Slider';
		foreach($arrSliders as $slider) { 
			$revolutionslider[$slider->getAlias()] = $slider->getTitle();
		}
	}
	else {
		$revolutionslider[0] = 'Install Revolution Slider Plugin';
	}

	// Page Header Background image styles
	$page_header_bg_image_style = array(
		'repeat'	=> esc_html__( 'Repeat', 'celebrate' ),
		'stretched'	=> esc_html__( 'Stretched', 'celebrate' ),
		'fixed'		=> esc_html__( 'Fixed', 'celebrate' ),
	);
	
	// Page Layout
	$page_layout = array(
		'' 				=> esc_html__( 'Default', 'celebrate' ),
		'fullwidth'		=> esc_html__( 'No Sidebar', 'celebrate' ),
		'right-sidebar'	=> esc_html__( 'Right Sidebar', 'celebrate' ),
		'left-sidebar' 	=> esc_html__( 'Left Sidebar', 'celebrate' ),
	);
	
	/**
	 * Page Settings
	 */
	$celebrate_page_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'page-settings-metabox',
		'title'         => esc_html__( 'Page Settings', 'celebrate' ),
		'object_types'  => array( 'page', ), // Post type
		'context'    => 'normal',
		'priority'   => 'high',
	) );

	$celebrate_page_metabox->add_field( array(
		'id'   		=> $prefix . 'page_layout_meta',
		'name' 		=> esc_html__( 'Sidebar Position', 'celebrate' ),
		'type' 		=> 'select',
		'options'	=> $page_layout,
	) );
	
	/**
	 * Page Tagline
	 */
	$celebrate_page_title_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'page-title-metabox',
		'title'         => esc_html__( 'Page Title', 'celebrate' ),
		'object_types'	=> array( 'page', 'post', 'tcsn_portfolio' ), // Post type
		'context'    	=> 'side',
		'priority'   	=> 'high',
	) );
	
	$celebrate_page_title_metabox->add_field( array(
		'name'  => esc_html__( 'Page Tagline', 'celebrate' ),
		'id'    => $prefix . 'page_tagline',
		'type'  => 'text',
	) );
	
	/**
	 * Page Header
	 */
	$celebrate_page_header_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'page-header-metabox',
		'title'         => esc_html__( 'Page Header Style', 'celebrate' ),
		'object_types'	=> array( 'page', 'post', 'tcsn_portfolio' ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
	) );
	
	$celebrate_page_header_metabox->add_field( array(
		'name' => esc_html__( 'Page Title Background Image - Upload or enter URL', 'celebrate' ),
		'id'   =>  $prefix . 'page_header_bg_image',
		'type' => 'file',
	) );

	$celebrate_page_header_metabox->add_field( array(
		'id'   		=> $prefix . 'page_header_bg_image_style',
		'name' 		=> esc_html__( 'Page Title Background Style', 'celebrate' ),
		'type' 		=> 'select',
		'options'	=> $page_header_bg_image_style,
	) );
	
	$celebrate_page_header_metabox->add_field( array(
		'name' => esc_html__( 'Overlay Opacity', 'celebrate' ),
		'id'   => $prefix . 'page_header_bg_image_overlay',
		'desc' => wp_kses( __( 'Useful if light colored image, to improve text visibility. <br> Give it in  decimal like:  <br> .1 <br> .3<br>If overlay assigned via theme options, give - 0 - if need image as such.', 'celebrate' ), array( 'br' => array(), ) ),
		'type'  => 'text',
	) );
	
	/**
	 * Testimonial
	 */
	$celebrate_testimonial_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'testimonial-metabox',
		'title'      	=> esc_html__( 'Client info', 'celebrate' ),
		'object_types'	=> array( 'tcsn_testimonial', ), // Post type
		'context'    	=> 'side',
		'priority'   	=> 'high',
	) );

	$celebrate_testimonial_metabox->add_field( array(
		'name'  => esc_html__( 'Testimonial Tagline', 'celebrate' ),
		'id'    => $prefix . 'testimonial_tagline',
		'type'  => 'text',
	) );
	
	$celebrate_testimonial_metabox->add_field( array(
		'name'  => esc_html__( 'Client Job Title', 'celebrate' ),
		'id'    => $prefix . 'client_info',
		'type'  => 'text',
	) );
	
	$celebrate_testimonial_metabox->add_field( array(
		'id'   		=> $prefix . 'rating_count',
		'name'  	=> esc_html__( 'Rating Count', 'celebrate' ),
		'type' 		=> 'select',
		'options'	=> array(
			'none'   		=> esc_html__('None', 'celebrate'),
        	'rating_five'   => esc_html__('Five Stars', 'celebrate'),
			'rating_four'   => esc_html__('Four Stars', 'celebrate'),
        ),
	) );
	
	/**
	 * Team Member
	 */
	$celebrate_team_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'member-info-metabox',
		'title'         => esc_html__( 'Team Member Info', 'celebrate' ),
		'object_types'	=> array( 'tcsn_team', ), // Post type
		'context'    	=> 'side',
		'priority'   	=> 'high',
	) );

	$celebrate_team_metabox->add_field( array(
		'name'	=> esc_html__( 'Member Job Title', 'celebrate' ),
		'id'    => $prefix . 'member_job',
		'type'  => 'text',
	) );
	
	$celebrate_team_metabox->add_field( array(
		'name'	=> esc_html__( 'Extra Member Info Like mail / phone (HTML Allowed)', 'celebrate' ),
		'desc'	=> 	wp_kses( __('Example Use for this Textarea : <br><br>&lt;ul class="tc-list-contact"&gt; &lt;li&gt;&lt;i class="icon-twitter tc-left-icon"&gt;&lt;/i&gt;Tweet:  @KurtDAM&lt;/li&gt; &lt;li&gt;&lt;i class="icon-phone-handset tc-left-icon"&gt;&lt;/i&gt;Phone:  + 1 234 - 567 - 8903&lt;/li&gt; &lt;li&gt;&lt;i class="icon-pencil tc-left-icon"&gt;&lt;/i&gt;Email:  &lt;a href="#"&gt;sales@example.com&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;', 'celebrate'), array( 'br' => array(), ) ),
		'id'   	=> $prefix . 'member_info_add',
		'type' 	=> 'textarea_code',
	) );
	// Team Member - Social
	$celebrate_team_social_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'member-social-metabox',
		'title'         => esc_html__( 'Member Social Network. Provide URL.', 'celebrate' ),
		'object_types'	=> array( 'tcsn_team', ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
		'show_names' 	=> true, 
	) );

	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Behance', 'celebrate' ),
		'id'   => $prefix . 'member_behance',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Delicious', 'celebrate' ),
		'id'   => $prefix . 'member_delicious',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Dribbble', 'celebrate' ),
		'id'   => $prefix . 'member_dribbble',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Dropbox', 'celebrate' ),
		'id'   => $prefix . 'member_dropbox',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Facebook', 'celebrate' ),
		'id'   => $prefix . 'member_facebook',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Flickr', 'celebrate' ),
		'id'   => $prefix . 'member_flickr',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'github', 'celebrate' ),
		'id'   => $prefix . 'member_github',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Googleplus', 'celebrate' ),
		'id'   => $prefix . 'member_googleplus',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Instagram', 'celebrate' ),
		'id'   => $prefix . 'member_instagram',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Linkedin', 'celebrate' ),
		'id'   => $prefix . 'member_linkedin',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Medium', 'celebrate' ),
		'id'   => $prefix . 'member_medium',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Paypal', 'celebrate' ),
		'id'   => $prefix . 'member_paypal',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Pinterest', 'celebrate' ),
		'id'   => $prefix . 'member_pinterest',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Reddit', 'celebrate' ),
		'id'   => $prefix . 'member_reddit',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Skype', 'celebrate' ),
		'desc' => esc_html__( 'Give Skype Username.', 'celebrate' ),
		'id'   => $prefix . 'member_skype',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Soundcloud', 'celebrate' ),
		'id'   => $prefix . 'member_soundcloud',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Stumbleupon', 'celebrate' ),
		'id'   => $prefix . 'member_stumbleupon',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Tumblr', 'celebrate' ),
		'id'   => $prefix . 'member_tumblr',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Twitter', 'celebrate' ),
		'id'   => $prefix . 'member_twitter',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Vimeo', 'celebrate' ),
		'id'   => $prefix . 'member_vimeo',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Youtube', 'celebrate' ),
		'id'   => $prefix . 'member_youtube',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Vine', 'celebrate' ),
		'id'   => $prefix . 'member_vine',
		'type'  => 'text',
	) );
	
	$celebrate_team_social_metabox->add_field( array(
		'name' => esc_html__( 'Mail', 'celebrate' ),
		'id'   => $prefix . 'member_mail',
		'type'  => 'text',
	) );
	
	/**
	 * Post formats
	 */
	// Audio Post Format
	$celebrate_audio_pf_metabox = new_cmb2_box( array(
		'id'            => 'format-post-audio',
		'title'         => esc_html__( 'Audio Embed Code', 'celebrate' ),
		'object_types'	=> array( 'post', ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
	) );
	
	$celebrate_audio_pf_metabox->add_field( array(
		'id'   => $prefix . 'pf_audio_embed',
		'type' 	=> 'textarea_code',
	) );
	
	// Video Post Format
	$celebrate_video_pf_metabox = new_cmb2_box( array(
		'id'            => 'format-post-video',
		'title'         => esc_html__( 'Video Embed Code', 'celebrate' ),
		'object_types'	=> array( 'post', ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
	) );
	
	$celebrate_video_pf_metabox->add_field( array(
		'id'   => $prefix . 'pf_video_embed',
		'type' 	=> 'textarea_code',
	) );
	
	// Quote Post Format
	$celebrate_quote_pf_metabox = new_cmb2_box( array(
		'id'            => 'format-post-quote',
		'title'      	=> esc_html__( 'Quote Source', 'celebrate' ),
		'object_types'	=> array( 'post', ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
	) );
	
	$celebrate_quote_pf_metabox->add_field( array(
		'id'   	=> $prefix . 'pf_quote_source',
		'type'	=> 'text',
	) );
	
	// Link Post Format
	$celebrate_link_pf_metabox = new_cmb2_box( array(
		'id'            => 'format-post-link',
		'title'      	=> esc_html__( 'Link Text and URL', 'celebrate' ),
		'object_types'	=> array( 'post', ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
	) );
	
	$celebrate_link_pf_metabox->add_field( array(
		'name'	=> esc_html__( 'Link text', 'celebrate' ),
		'id'   	=> $prefix . 'pf_link_text',
		'type'	=> 'text',
	) );
	
	$celebrate_link_pf_metabox->add_field( array(
		'name'	=> esc_html__( 'Link URL', 'celebrate' ),
		'id'   	=> $prefix . 'pf_link_url',
		'type'	=> 'text',
	) );
	
	// Gallery Post Format
	$celebrate_gallery_pf_metabox = new_cmb2_box( array(
		'id'            => 'format-post-gallery',
		'title'      	=> esc_html__( 'Select Revolution Slider For Gallery Post', 'celebrate' ),
		'object_types'	=> array( 'post', ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
	) );
	
	$celebrate_gallery_pf_metabox->add_field( array(
		'id'   		=> $prefix . 'select_gallery_rev_slider',
		'options'	=> $revolutionslider,
		'desc'  	=> esc_html__( 'Revolution slider for gallery post.', 'celebrate' ),
		'type' 		=> 'select',
	) );
	
	/**
	 * Portfolio
	 */
	// Portfolio help
	$celebrate_portfolio_help_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'portfolio-help-metabox',
		'title'         => esc_html__( 'Portfolio Help : Click to Open', 'celebrate' ),
		'object_types'	=> array( 'tcsn_portfolio', ), // Post type
		'context'    	=> 'side',
		'priority'   	=> 'high',
		'closed'        => true, 
	) );

	$celebrate_portfolio_help_metabox->add_field( array(
		'desc'  =>  wp_kses( __( '<strong>Go through</strong><br>Theme Options > Portfolio <br><br>Refer Help Document for more info related to portfolio.', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
		'id'   	=> $prefix . 'read_me',
		'type' 	=> 'title',
	) );
	
	// Portfolio Meta
	$celebrate_portfolio_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'portfolio-metabox',
		'title'         =>  esc_html__( 'Portfolio Item Type', 'celebrate' ),
		'object_types'	=> array( 'tcsn_portfolio', ), // Post type
		'context'    	=> 'side',
		//'priority'   	=> 'high',
	) );
	
	$celebrate_portfolio_metabox->add_field( array(
		'id'   		=> $prefix . 'portfolio_type',
		'name' 		=> '',
		'type' 		=> 'select',
		'options'	=> array(
        	'Image'   => esc_html__('Image', 'celebrate'),
			'Video'   => esc_html__('Video', 'celebrate'),
			'Audio'   => esc_html__('Audio', 'celebrate'),
			'Gallery' => esc_html__('Gallery', 'celebrate'),
        ),
	) );
	
	// Portfolio Grid Meta
	$celebrate_portfolio_grid_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'portfolio-grid-metabox',
		'title'         => esc_html__( 'Portfolio Items in Grid - Settings', 'celebrate' ),
		'object_types'	=> array( 'tcsn_portfolio', ), // Post type
		'context'    	=> 'side',
		//'priority'   	=> 'high',
	) );

	$celebrate_portfolio_grid_metabox->add_field( array(
		'name' =>  esc_html__('External Link to Heading / Link Icon', 'celebrate'),
		'desc' =>  wp_kses( __( '<br>Checkbox to enable external link to heading or link icon of portfolio grid items<br><br> If kept unchecked, link will display portfolio single post. <br><br>', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
		 'id'  => $prefix . 'external_link',
		'type' => 'checkbox',
		'std'  => 0,
	) );

	$celebrate_portfolio_grid_metabox->add_field( array(
		'id'   => $prefix . 'link_url',
		'desc' => esc_html__('Tick the checkbox and give link here', 'celebrate'),
		'type'	=> 'text',
	) );
	
	$celebrate_portfolio_grid_metabox->add_field( array(
		'name'    => esc_html__( 'If zoom on hover : Title to Image / video lightbox.', 'celebrate' ),
		'id'      => $prefix . 'zoom_title',
		'type'	  => 'text',
	) );
	
	$celebrate_portfolio_grid_metabox->add_field( array(
		'name'    => esc_html__( 'If - Video Post : Video URL', 'celebrate' ),
		'id'      => $prefix . 'video_url',
		'type'	  => 'text',
		'desc'  =>  wp_kses( __( 'Enter URL here. <br/>Video will be displayed on zoom in Lightbox.<br/><br/><strong>URL examples</strong><br/> Youtube - http://youtu.be/XSGBVzeBUbk <br/><br/>  Vimeo - http://vimeo.com/69228454', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
	) );
	
	// Portfolio Embed Code
	$celebrate_portfolio_embed_metabox = new_cmb2_box( array(
		'id'            => $prefix . 'portfolio-embed-metabox',
		'title'         => esc_html__( 'If Video / Audio Post - Embed Code :', 'celebrate' ),
		'object_types'	=> array( 'tcsn_portfolio', ), // Post type
		'context'    	=> 'normal',
		'priority'   	=> 'high',
	) );
	
	$celebrate_portfolio_embed_metabox->add_field( array(
		'id'  	=> $prefix . 'pf_video_audio_embed',
		'type' 	=> 'textarea_code',
		'desc'	=> esc_html__( 'This will be displayed on portfolio single post.', 'celebrate' ),
	) );

} // celebrate_metaboxes