<?php
/**
* Options for Admin Options Panel
*/

if (!class_exists('Redux_Framework_celebrate_config')) {
    class Redux_Framework_celebrate_config
    {
        public $args = array();
        public $sections = array();
        public $theme;
        public $ReduxFramework;
        public function __construct()
        {
            if (!class_exists('ReduxFramework')) {
                return;
            }
            // This is needed. Bah WordPress bugs.  ;)
            if (true == Redux_Helpers::isTheme(__FILE__)) {
                $this->initSettings();
            } else {
                add_action('plugins_loaded', array(
                    $this,
                    'initSettings'
                ), 10);
            }
        }
        public function initSettings()
        {
            // Just for demo purposes. Not needed per say.
            $this->theme = wp_get_theme();
            // Set the default arguments
            $this->setArguments();
            // Set a few help tabs so you can see how it's done
            $this->setHelpTabs();
            // Create the sections and fields
            $this->setSections();
            if (!isset($this->args['opt_name'])) { // No errors please
                return;
            }
           // If Redux is running as a plugin, this will remove the demo notice and links
            add_action( 'redux/loaded', array( $this, 'remove_demo' ) );
            // Function to test the compiler hook and demo CSS output.
            // Above 10 is a priority, but 2 in necessary to include the dynamically generated CSS to be sent to the function.
            //add_filter('redux/options/'.$this->args['opt_name'].'/compiler', array( $this, 'compiler_action' ), 10, 3);
            // Change the arguments after they've been declared, but before the panel is created
            //add_filter('redux/options/'.$this->args['opt_name'].'/args', array( $this, 'change_arguments' ) );
            // Change the default value of a field after it's been set, but before it's been useds
            //add_filter('redux/options/'.$this->args['opt_name'].'/defaults', array( $this,'change_defaults' ) );
            // Dynamically add a section. Can be also used to modify sections/fields
            //add_filter('redux/options/' . $this->args['opt_name'] . '/sections', array($this, 'dynamic_section'));
            $this->ReduxFramework = new ReduxFramework($this->sections, $this->args);
        }
        /**
        This is a test function that will let you see when the compiler hook occurs.
        It only runs if a field	set with compiler=>true is changed.
        * */
        function compiler_action($options, $css, $changed_values)
        {
            echo '<h1>The compiler hook has run!</h1>';
            echo "<pre>";
            print_r($changed_values); // Values that have changed since the last save
            echo "</pre>";
            //print_r($options); //Option values
            //print_r($css); // Compiler selector CSS values  compiler => array( CSS SELECTORS )
            /*
            
            // Demo of how to use the dynamic CSS and write your own static CSS file
            

            
            global $wp_filesystem;
            
            if( empty( $wp_filesystem ) ) {
            

            
            WP_Filesystem();
            
            }
            if( $wp_filesystem ) {
            
            $wp_filesystem->put_contents(
            
            $filename,
            
            $css,
            
            FS_CHMOD_FILE // predefined mode settings for WP files
            
            );
            
            }
            
            */
        }
        /**
        Custom function for filtering the sections array. Good for child themes to override or add to the sections.        
        Simply include this function in the child themes functions.php file.
        
        NOTE: the defined constants for URLs, and directories will NOT be available at this point in a child theme,
        
        so you must use get_template_directory_uri() if you want to use any of the built in icons
        * */
        function dynamic_section($sections)
        {
            //$sections = array();
            $sections[] = array(
                'title' => esc_html__('Section via hook', 'celebrate'),
                'desc' => '<p class="description">This is a section created by adding a filter to the sections array. Can be used by child themes to add/remove sections from the options.</p>',
                'icon' => 'el-icon-paper-clip',
                // Leave this as a blank section, no options just some intro text set above.
                'fields' => array()
            );
            return $sections;
        }
        /**
        Filter hook for filtering the args. Good for child themes to override or add to the args array. Can also be used in other functions.
        * */
        function change_arguments($args)
        {
            //$args['dev_mode'] = true;
            return $args;
        }
        /**
        Filter hook for filtering the default value of any given field. Very useful in development mode.
        * */
        function change_defaults($defaults)
        {
            $defaults['str_replace'] = 'Testing filter hook!';
            return $defaults;
        }
        // Remove the demo link and the notice of integrated demo from the redux-framework plugin
        function remove_demo()
        {
            // Used to hide the demo mode link from the plugin page. Only used when Redux is a plugin.
            if (class_exists('ReduxFrameworkPlugin')) {
                remove_filter('plugin_row_meta', array(
                    ReduxFrameworkPlugin::instance(),
                    'plugin_metalinks'
                ), null, 2);
                // Used to hide the activation notice informing users of the demo panel. Only used when Redux is a plugin.
                remove_action('admin_notices', array(
                    ReduxFrameworkPlugin::instance(),
                    'admin_notices'
                ));
            }
        }
        public function setSections()
        {
            /**
            Used within different fields. Simply examples. Search for ACTUAL DECLARATION for field examples
            * */
            // Background Patterns Reader
            ob_start();
            $ct              = wp_get_theme();
            $this->theme     = $ct;
            $item_name       = $this->theme->get('Name');
            $tags            = $this->theme->Tags;
            $screenshot      = $this->theme->get_screenshot();
            $class           = $screenshot ? 'has-screenshot' : '';
            $customize_title = sprintf(esc_html__('Customize &#8220;%s&#8221;', 'celebrate'), $this->theme->display('Name'));
?>
<div id="current-theme" class="<?php
            echo esc_attr($class);
?>">
  <?php
            if ($screenshot):
?>
  <?php
                if (current_user_can('edit_theme_options')):
?>
  <a href="<?php
                    echo esc_url(wp_customize_url());
?>" class="load-customize hide-if-no-customize" title="<?php
                    echo esc_attr($customize_title);
?>"> <img src="<?php
                    echo esc_url($screenshot);
?>" alt="<?php
                    esc_attr_e('Current theme preview', 'celebrate');
?>" /> </a>
  <?php
                endif;
?>
  <img class="hide-if-customize" src="<?php
                echo esc_url($screenshot);
?>" alt="<?php
                esc_attr_e('Current theme preview', 'celebrate');
?>" />
  <?php
            endif;
?>
  <h4><?php
            echo $this->theme->display('Name');
?></h4>
  <div>
    <ul class="theme-info">
      <li><?php
            printf(esc_html__('By %s', 'celebrate'), $this->theme->display('Author'));
?></li>
      <li><?php
            printf(esc_html__('Version %s', 'celebrate'), $this->theme->display('Version'));
?></li>
      <li><?php
            echo '<strong>' . esc_html_e('Tags', 'celebrate') . ':</strong> ';
?><?php
            printf($this->theme->display('Tags'));
?></li>
    </ul>
    <p class="theme-description"><?php
            echo $this->theme->display('Description');
?></p>
    <?php
            if ($this->theme->parent()) {
                printf(' <p class="howto">' . esc_html__('This <a href="%1$s">child theme</a> requires its parent theme, %2$s.', 'celebrate') . '</p>', esc_html__('http://codex.wordpress.org/Child_Themes', 'celebrate'), $this->theme->parent()->display('Name'));
            }
?>
  </div>
</div>
<?php
            $item_info = ob_get_contents();
            ob_end_clean();
            $sampleHTML = '';
            if (file_exists( get_template_directory() . '/info-html.html')) {
                /** @global WP_Filesystem_Direct $wp_filesystem  */
                global $wp_filesystem;
                if (empty($wp_filesystem)) {
                    require_once( ABSPATH . '/wp-admin/includes/file.php' );
                    WP_Filesystem();
                }
                $sampleHTML = $wp_filesystem->get_contents( get_template_directory() . '/info-html.html');
            }
            // General 
            $this->sections[] = array(
                'icon' => 'el-icon-cog',
                'title' => esc_html__('General', 'celebrate'),
                'fields' => array(
					array(
                        'id' => 'celebrate_start_field',
                        'type' => 'info',
						'style' => 'success',
                        'notice' => true,
                        'desc' => esc_html__('Fill in the fields in Options Panel if need to change default settings. Ok to leave blank otherwise.', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_responsive_field',
                        'type' => 'info',
                        'desc' => esc_html__('Responsive', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_layout_responsive',
                        'type' => 'switch',
                        'title' => esc_html__('Responsiveness', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_get_header_code',
                        'type' => 'textarea',
                        'required' => '',
                        'title' => esc_html__('Functions / code in Header', 'celebrate'),
                        'subtitle' => esc_html__('This will be added into the header of theme. Ex. Analytics. Refer online help doc for more details.', 'celebrate'),
                        'validate' => '', 
                        'desc' => ''
                    ),
					array(
                        'id' => 'celebrate_comment_field',
                        'type' => 'info',
                        'desc' => esc_html__('Comments on Pages (not blog posts). Enable by default, please disable if not required.', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_page_comments',
                        'type' => 'switch',
                        'title' => esc_html__('Comments on pages', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    )
                )
            );
            // Layout 
            $this->sections[] = array(
                'icon' => 'el-icon-cog',
                'title' => esc_html__('Layout', 'celebrate'),
				'desc' =>  wp_kses( __('Fill in the fields below if need to change default settings.<br>If you need to change any one of the following, change others too in proportion.', 'celebrate'), array( 'br' => array(), ) ),
                'fields' => array(
                    array(
                        'id' => 'celebrate_main_container_width',
                        'type' => 'text',
                        'title' => esc_html__('Main Container Width', 'celebrate'),
						'desc' =>  wp_kses( __('No need of unit. Default is : 1170<br> This width is = Content Section Width + Sidebar Width + Gap between Content Section and Sidebar.', 'celebrate'), array( 'br' => array(), ) ),
                        'default' => '',
						'validate' => 'numeric'
                    ),
                    array(
                        'id' => 'celebrate_content_width',
                        'type' => 'text',
                        'title' => esc_html__('Content Section Width', 'celebrate'),
                        'desc' =>  wp_kses( __('No need of unit. Default is : 830<br> This will be applicable for both content sections with left / right sidebar.', 'celebrate'), array( 'br' => array(), ) ),
                        'default' => '',
						'validate' => 'numeric'
                    ),
                    array(
                        'id' => 'celebrate_sidebar_width',
                        'type' => 'text',
                        'title' => esc_html__('Sidebar Width', 'celebrate'),
                        'desc' =>  wp_kses( __('No need of unit. Default is : 290<br> This will be applicable for both left / right sidebar.', 'celebrate'), array( 'br' => array(), ) ),
                        'default' => '',
						'validate' => 'numeric'
                    ),
                )
            );

            // Typography and Styling
            $this->sections[] = array(
                'title' => esc_html__(' Typography & Styling', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-magic',
                'fields' => array(
                    array(
                        'id' => 'celebrate_body_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Body Typography', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_body_typography',
                        'type' => 'typography',
                        'title' => '',
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => true, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'body'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-family' => 'Open Sans',
                            'color' => '',
                            'font-style' => '400',
                            'font-size' => '15px',
                        )
                    ),
                    array(
                        'id' => 'celebrate_headings_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Headings Typography', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_headeritem_info_field',
                        'type' => 'info',
                        'style' => 'success',
                        'notice' => true,
                        'desc' => esc_html__("These will work for headings and link inside headings.", 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_h1_typography',
                        'type' => 'typography',
                        'title' => esc_html__('H1', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'h1',
                            'h1 a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'color' => '',
                            'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '',
                            'line-height' => '',
                        )
                    ),
                    array(
                        'id' => 'celebrate_h2_typography',
                        'type' => 'typography',
                        'title' => esc_html__('H2', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'h2',
                            'h2 a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'color' => '',
                            'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '',
                            'line-height' => '',
                        )
                    ),
                    array(
                        'id' => 'celebrate_h3_typography',
                        'type' => 'typography',
                        'title' => esc_html__('H3', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'h3',
                            'h3 a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'color' => '',
                            'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '',
                            'line-height' => '',
                        )
                    ),
                    array(
                        'id' => 'celebrate_h4_typography',
                        'type' => 'typography',
                        'title' => esc_html__('H4', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'h4',
                            'h4 a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'color' => '',
                            'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '',
                            'line-height' => '',
                        )
                    ),
                    array(
                        'id' => 'celebrate_h5_typography',
                        'type' => 'typography',
                        'title' => esc_html__('H5', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'h5',
                            'h5 a',
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'color' => '',
                            'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '',
                            'line-height' => '',
                        )
                    ),
                    array(
                        'id' => 'celebrate_h6_typography',
                        'type' => 'typography',
                        'title' => esc_html__('H6', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'h6',
                            'h6 a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'color' => '',
                           'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '',
                            'line-height' => '',
                        )
                    ),
                    array(
                        'id' => 'celebrate_other_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('General', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_theme_link_color',
                        'type' => 'link_color',
                        'output' => array(
                            'a'
                        ),
                        'title' => esc_html__('Link Color', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'regular' => true,
                        'hover' => false,
                        'active' => false,
                        'visited' => false,
                        'default' => array(
                            'regular' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_theme_link_hover_color',
                        'type' => 'link_color',
                       'output' => array(
                            'a',
                            'h1 a',
                            'h2 a',
                            'h3 a',
                            'h4 a',
                            'h5 a',
                            'h6 a',
                        ),
                        'title' => esc_html__('Link Hover Color', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'regular' => false,
                        'hover' => true,
                        'active' => false,
                        'visited' => false,
                    ),
					array(
                        'id' 		=> 'celebrate_theme_link_visited_color',
                        'type' 		=> 'link_color',
                       'output' 	=> array(
                            '#content-wrapper a',
                        ),
                        'title' 	=> esc_html__('Content Section Link Visited Color', 'celebrate'),
                        'subtitle' 	=> '',
                        'desc' 		=> '',
                        'regular'	=> false,
                        'hover' 	=> false,
                        'active' 	=> false,
                        'visited' 	=> true,
						  'default' => array(
                            'visited'	=> '#101010'
                        )
                    ),
					//array(
//                        'id' => 'celebrate_blog_sidebar_link_typography',
//                        'type' => 'link_color',
//                        'output' => array(
//                            '.blog #sidebar a'
//                        ),
//                        'title' => esc_html__('Links in Blog Sidebar', 'celebrate'),
//                        'subtitle' => '',
//                        'desc' => esc_html__('In case feel like too much colored links in blog sidebar.', 'celebrate'),
//                        'regular' => true,
//                        'hover' => true,
//                        'active' => false,
//                        'visited' => false,
//                        'default' => array(
//                            'regular' => '',
//                            'hover' => ''
//                        )
//                    ),
                    array(
                        'id' => 'celebrate_button_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Button Font', 'celebrate'),
                        'font-family' => true,
                        'google' => true,
                        'font-backup' => false,
                        'font-style' => false,
                        'subsets' => false,
                        'font-size' => false,
                        'font-weight' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => false,
                        'all_styles' => false,
                        'output' => array(
                            '.themebtn-label',
                            'input[type="submit"]',
							'input[type="reset"]',
							'.read-more-link'
                        ),
                        'units' => 'px',
                        'subtitle' => '',
                        'default' => array(
                            'font-family' => 'Montserrat',
                            'font-style' => '700'
                        )
                    ),
					array(
                        'id' => 'celebrate_testimonial_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Testimonial', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => false,
                        'letter-spacing' => false,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            '.testimonial-content',
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-style' => '400',
                            'font-family' => 'Open Sans',
                        )
                    ),
					array(
                        'id' => 'celebrate_quote_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Blockquote', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => false,
                        'letter-spacing' => false,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            'blockquote',
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-style' => '400',
                            'font-family' => 'Open Sans',
                        )
                    ),
					array(
                        'id' => 'celebrate_theme_tab_color',
                        'type' => 'color',
                        'title' => esc_html__('Theme default tab / accordion color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color',
						'desc' => esc_html__('Specify only of you are using - Theme Styled Tabs / Accordion', 'celebrate'),
                    ),
                    array(
                        'id' => 'celebrate_secheader_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Secondary Header', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_secondary_header_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Text', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => false, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => true,
                        'preview' => false, // Disable the previewer
                        'all_styles' => false, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            '#tc-header-secondary'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-family' => '',
                            'color' => '',
                            'font-style' => '',
                            'font-size' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_secheader_link_typography',
                        'type' => 'link_color',
                        'output' => array(
                            '#tc-header-secondary a'
                        ),
                        'title' => esc_html__('Topbar Link Color', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'regular' => true,
                        'hover' => true,
                        'active' => false,
                        'visited' => false,
                        'default' => array(
                            'regular' => '',
                            'hover' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_pageheader_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Page Header', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_page_title_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Page Title', 'celebrate'),
                        'font-family' => true,
                        'google' => true,
                        'font-backup' => false,
                        'font-style' => true,
                        'subsets' => true,
                        'font-size' => true,
                        'font-weight' => true,
                        'letter-spacing' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => false,
                        'all_styles' => false,
                        'output' => array(
                            '.page-title'
                        ),
                        'units' => 'px',
                        'default' => array(
                            'font-style' => '300',
                            'font-family' => 'Open Sans',
                            'font-size' => '36px',
                            'letter-spacing' => '',
                            'color' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_page_tagline_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Page Tagline', 'celebrate'),
                        'font-family' => true,
                        'google' => true,
                        'font-backup' => false,
                        'font-style' => true,
                        'subsets' => true,
                        'font-size' => true,
                        'font-weight' => true,
                        'letter-spacing' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => true,
                        'preview' => false,
                        'all_styles' => false,
                        'output' => array(
                            '.tc-page-tagline'
                        ),
                        'units' => 'px',
                        'default' => array(
                            'font-style' => '300',
                            'font-family' => 'Open Sans',
                            'font-size' => '36px',
                            'letter-spacing' => '',
                            'color' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_breadcrumb_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Breadcrumb Typography', 'celebrate'),
                        'font-family' => false,
                        'google' => false,
                        'font-backup' => false,
                        'font-style' => false,
                        'subsets' => false,
                        'font-size' => true,
                        'font-weight' => false,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => true,
                        'preview' => false,
                        'all_styles' => false,
                        'output' => array(
                            '.breadcrumbs'
                        ),
                        'units' => 'px',
                        'default' => array(
                            'font-size' => '',
                            'color' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_page_header_link',
                        'type' => 'link_color',
                        'output' => array(
                            '.breadcrumbs a'
                        ),
                        'title' => esc_html__('Breadcrumb Link Color', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'regular' => true,
                        'hover' => true,
                        'active' => false,
                        'visited' => false,
                        'default' => array(
                            'regular' => '',
                            'hover' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_footer_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Footer Typography', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_footer_typography',
                        'type' => 'typography',
                        'title' => '',
                        'google' => true,
                        'font-backup' => false,
                        'font-style' => true,
                        'subsets' => true,
                        'font-size' => true,
                        'line-height' => true,
                        'text-align' => false,
                        'color' => true,
                        'preview' => false, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            '#footer'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'color' => '',
                            'font-style' => '',
                            'font-family' => '',
                            'font-size' => '',
                            'line-height' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_footer_headings',
                        'type' => 'color',
                        'output' => array(
                            '#footer h1',
                            '#footer h2',
                            '#footer h3',
                            '#footer h4',
                            '#footer h5',
                            '#footer h6',
                            '#footer h1 a',
                            '#footer h2 a',
                            '#footer h3 a',
                            '#footer h4 a',
                            '#footer h5 a',
                            '#footer h6 a',
                        ),
                        'title' => esc_html__('Headings / Widgets Headings Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
    				array(
                        'id' => 'celebrate_footer_link_color',
                        'type' => 'link_color',
                        'output' => array(
                            '#footer a',
                        ),
                        'title' => esc_html__('Link', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'regular' => true,
                        'hover' => true,
                        'active' => false,
                        'visited' => false,
                        'default' => array(
                            'regular' => '',
							'hover' => ''
                        )
                    ),
					 array(
                        'id' => 'celebrate_copyright_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Copyright', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_copyright_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Text', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => false, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => true,
                        'preview' => false, // Disable the previewer
                        'all_styles' => false, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            '#copyright'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-family' => '',
                            'color' => '',
                            'font-style' => '',
                            'font-size' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_copyright_link_typography',
                        'type' => 'link_color',
                        'output' => array(
                            '#copyright a'
                        ),
                        'title' => esc_html__('Topbar Link Color', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'regular' => true,
                        'hover' => true,
                        'active' => false,
                        'visited' => false,
                        'default' => array(
                            'regular' => '',
                            'hover' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_widget_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Widgets', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_widget_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Widget Heading', 'celebrate'),
						'desc' => esc_html__('Font Color will only work for widgets in contet section. For others like footer it will take heading color of respective section.', 'celebrate'),
                        'font-family' => true,
                        'google' => true,
                        'font-backup' => false,
                        'font-style' => true,
                        'subsets' => true,
                        'font-size' => true,
                        'font-weight' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => true,
                        'preview' => false,
                        'all_styles' => false,
                        'output' => array(
                            '.widget-title'
                        ),
                        'units' => 'px',
                        'subtitle' => '',
                        'default' => array(
                            'font-size' => '17px',
                            'font-style' => '',
                            'font-family' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_widget_custom_menu',
                        'type' => 'info',
                        'desc' => esc_html__('WP Default Widgets - Custom Menu', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_custom_menu_typography',
                        'type' => 'typography',
                       //  'title' => esc_html__('', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => false, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            '.widget_nav_menu li a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-style' => '400',
                            'font-family' => 'Open Sans',
                            'font-size' => '15px'
                        )
                    ),
					array(
                        'id' => 'celebrate_custom_menu_bg',
                        'type' => 'color',
                        'title' => esc_html__('Custom Menu Background', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_custom_menu_link',
                        'type' => 'link_color',
                        'output' => array(
                             '.widget_nav_menu li a'
                        ),
                        'title' => esc_html__('Custom Menu Link', 'celebrate'),
                        'regular' => true, // Disable Regular Color
                        'hover' => true, // Disable Hover Color
                        'active' => false, // Disable Active Color
                        'visited' => false, // Enable Visited Color
                        'default' => array(
                            'regular' => '',
                            'hover' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_custom_menu_link_active',
                        'type' => 'color',
                        'title' => esc_html__('Custom Menu Link Active Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                )
            );
			// Theme Base Colors
            $this->sections[] = array(
                'title' => esc_html__('Theme Base Colors', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-cog',
                'fields' => array(
                 array(
                        'id' => 'celebrate_themebase_color_field',
                        'type' => 'info',
						'style' => 'warning',
						'desc'	=>  wp_kses( __('Below are basic colors used for theme, some of them cannnot be override individually ullike those in shortcodes etc.<br>You can choose to override colors at once via child theme. All colors are sorted in color.css: Themefolder / css / color.css<br><br>Refer help doc <a href="http://knowledgebase.tanshcreative.com/where-how-to-edit-styles/" target="_blank">for more info realated to css / styles modification.</a>', 'celebrate'), array( 'br' => array(), 'a' => array( 'href' => array(), 'title' => array(), 'target' => array() ), 'a' => array( 'href' => array(), 'title' => array(), 'target' => array() ), ) ),
                    ),
					array(
                        'id' => 'celebrate_themebase_color_first',
                        'type' => 'info',
                        'notice' => true,
                        'title' => 'First Theme Base Color',
                        'desc' => ''
                    ),
					array(
                        'id' => 'celebrate_themebase_color_first_value',
                        'type' => 'color',
                        'title' => esc_html__('Select Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color',
						'desc' => esc_html__('Works for: Take to top, Carousel Arrows, Carousel Active Dots, Pagination number color, Mobile menu background color', 'celebrate'),
                    ),
					array(
                        'id' => 'celebrate_themebase_color_second',
                        'type' => 'info',
                        'notice' => true,
                        'title' => 'Second Theme Base Color',
                        'desc' => ''
                    ),
					array(
                        'id' => 'celebrate_themebase_color_second_value',
                        'type' => 'color',
                        'title' => esc_html__('Select Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color',
						'desc' => esc_html__('Works for: Pagination hover background, Search Submit, Sticky Post label, Default Social Hover etc.', 'celebrate'),
                    ),
					array(
                        'id' => 'celebrate_themebase_color_third',
                        'type' => 'info',
                        'notice' => true,
                        'title' => 'Third Theme Base Color',
                        'desc' => ''
                    ), 
					array(
                        'id' => 'celebrate_themebase_color_third_value',
                        'type' => 'color',
                        'title' => esc_html__('Select Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color',
						'desc' => esc_html__('Works for: Social Share link color, Portfolio filter link hover / active color, custom tagcloud color, category, archive widget before dot color, quote and link post format background color.', 'celebrate'),
                    ), 
                )
            ); // Theme Base Colors
            // Body
            $this->sections[] = array(
                'title' => esc_html__('Body / Others', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-cog',
                'fields' => array(
                    array(
                        'id' => 'celebrate_body_field',
                        'type' => 'info',
                        'desc' => esc_html__('Body', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_body_background',
                        'type' => 'background',
                        'output' => array(
                            'body'
                        ),
                        'title' => esc_html__('Body Background', 'celebrate'),
                        'default' => array(
                            'background-color' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_content_section_field',
                        'type' => 'info',
                        'desc' => esc_html__('Content Section', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_content_section_background',
                        'type' => 'background',
                        'output' => array(
                            '#wrapper'
                        ),
                        'title' => esc_html__('Content Section Background', 'celebrate'),
                        'default' => array(
                            'background-color' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_page_setting_field',
                        'type' => 'info',
                        'desc' => esc_html__('Page Settings', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_page_layout',
                        'type' => 'select',
                        'title' => esc_html__('Page Layout Style', 'celebrate'),
                        'subtitle' => '',
                        'desc' => esc_html__('Select default layout style for pages. These can be override for individual page on - Edit Page - via meta options.', 'celebrate'),
                        'options' => array(
                            'right-sidebar' => esc_html__('Right Sidebar', 'celebrate'),
                            'left-sidebar' => esc_html__('Left Sidebar', 'celebrate'),
                            'fullwidth' => esc_html__('No Sidebar', 'celebrate')
                        ),
                        'default' => 'fullwidth'
                    ),
                )
            );

            // Header
            $this->sections[] = array(
                'icon'   => 'el-icon-cog',
                'title'  => esc_html__('Header Section', 'celebrate'),
                'desc'   => '',
                'fields' => array(
                    array(
                        'id'       => 'celebrate_layout_header',
                        'type'     => 'image_select',
                        'title'    => esc_html__('Select Header Layout', 'celebrate'),
                        'subtitle' => '',
                        'options'  => array(
                            'v1' => array(
                                'alt' => 'Header 1',
                                'img' => get_template_directory_uri() . "/includes/img/header-1.jpg"
                            ),
							'v2' => array(
                                'alt' => 'Header 2',
                                'img' => get_template_directory_uri() . "/includes/img/header-2.jpg"
                            ),
							'v3' => array(
                                'alt' => 'Header 3',
                                'img' => get_template_directory_uri() . "/includes/img/header-3.jpg"
                            ),
                        ),
                        'default'	=> 'v2'
                    ),
					array(
                        'id' 		=> 'celebrate_header_transparent',
                        'type' 		=> 'switch',
                        'title' 	=> esc_html__('Make Header Transparent / Semi Transparent', 'celebrate'),
                        'subtitle'	=> '',
                        'default' 	=> true
                    ),
					array(
                        'id'       	=> 'celebrate_header_sticky',
                        'type'     	=> 'switch',
                        'title'    	=> esc_html__('Sticky Header', 'celebrate'),
                        'subtitle'	=> '',
                        'default'  	=> true
                    ),
					array(
                        'id'       => 'celebrate_layout_page_header',
                        'type'     => 'image_select',
                        'title'    => esc_html__('Select Page Title Layout', 'celebrate'),
                        'subtitle' => '',
                        'options'  => array(
                            'tc-page-header-full' => array(
                                'alt' => 'Page Title 1',
                                'img' => get_template_directory_uri() . "/includes/img/page-title-1.jpg"
                            ),
							'tc-page-header-aligned' => array(
                                 'alt' => 'Page Title 1',
                                'img' => get_template_directory_uri() . "/includes/img/page-title-2.jpg"
                            ),
                        ),
                        'default'	=> 'tc-page-header-full'
                    ),
                    array(
                        'id'   	=> 'celebrate_header_item_info_field',
                        'type' 	=> 'info',
                        'desc'	=>  wp_kses( __('Enable (ON) / Disable (OFF) Elements<br>Following will work according to header layout selected.', 'celebrate'), array( 'br' => array(), ) ),
                    ),
					array(
                        'id'   	=> 'celebrate_header_item_info_field',
                        'type' 	=> 'info',
						'style' => 'warning',
                        'desc'	=>  wp_kses( __('First row in header = SECONDARY Header<br>Second row in header = PRIMARY Header', 'celebrate'), array( 'br' => array(), ) ),
                    ),
					array(
                        'id' 		=> 'celebrate_show_header_social',
                        'type' 		=> 'switch',
                        'title' 	=> esc_html__('Social Icons', 'celebrate'),
                        'subtitle'	=> '',
                        'default' 	=> true
                    ),
					array(
                        'id' 		=> 'celebrate_show_header_search',
                        'type' 		=> 'switch',
                        'title' 	=> esc_html__('Search', 'celebrate'),
                        'subtitle'	=> '',
                        'default' 	=> true
                    ),
					array(
                        'id' 		=> 'celebrate_show_sec_header_text',
                        'type' 		=> 'switch',
                        'title' 	=> esc_html__('Custom Text in Secondary Header', 'celebrate'),
                        'subtitle'	=> '',
                        'default' 	=> true,
                    ),
					array(
                        'id' 		=> 'celebrate_sec_header_custom_text',
                        'type' 		=> 'textarea',
                        'title' 	=> esc_html__('Textarea for Custom Text in Secondary Header', 'celebrate'),
                        'desc' 		=> '',
						'subtitle'	=>  wp_kses( __('Write here. <br>HTML is allowed..<br><br>Example:<br><br>&lt;ul class="tc-header-contact"&gt;&lt;li&gt;&lt;i class="icon-phone-handset"&gt;&lt;/i&gt;123 456 78&lt;/li&gt;&lt;li&gt;&lt;i class="icon-pencil"&gt;&lt;/i&gt;&lt;a href="#"&gt;sales@example.com&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;<br><br>OR<br><br>Tagline Here', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
                        'default' 	=> '<ul class="tc-header-contact"><li><i class="icon-phone-handset"></i>123 456 78</li><li><i class="icon-pencil"></i><a href="#">sales@example.com</a></li></ul>',
						'validate' => 'html',
						'required' => array('celebrate_show_sec_header_text','equals','1')
                    ),
					array(
                        'id' 		=> 'celebrate_show_cart_item',
                        'type' 		=> 'switch',
                        'title' 	=> esc_html__('Cart Icon', 'celebrate'),
                        'subtitle'	=> '',
                        'default' 	=> true
                    ),
					array(
                        'id' 		=> 'celebrate_show_pri_header_text',
                        'type' 		=> 'switch',
                        'title' 	=> esc_html__('Custom Text in Primary Header', 'celebrate'),
                        'subtitle'	=> '',
                        'default' 	=> true,
                    ),
					array(
                        'id' 		=> 'celebrate_pri_header_custom_text',
                        'type' 		=> 'textarea',
                        'title' 	=> esc_html__('Textarea for Custom Text in Primary Header ( Ex. button )', 'celebrate'),
                        'desc' 		=> '',
						'subtitle'	=>  wp_kses( __('Write here. <br>HTML is allowed..<br><br>Example:<br><br>&lt;a class="themebtn themebtn-icon-left themebtn-classic themebtn-square themebtn-medium themebtn-teal " href="#"&gt;&lt;span class="themebtn-icon"&gt;&lt;i class="icon-ion-pricetag"&gt;&lt;/i&gt;&lt;/span&gt;&lt;span class="themebtn-label"&gt;Quick Quote&lt;/span&gt;&lt;/a&gt;<br><br>OR<br><br>Some Info Here', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
                        'default' 	=> '<a class="themebtn themebtn-icon-left themebtn-classic themebtn-square themebtn-medium themebtn-teal " href="#"><span class="themebtn-icon"><i class="icon-ion-pricetag"></i></span><span class="themebtn-label">Quick Quote</span></a>',
						'validate' => 'html',
						'required' => array('celebrate_show_pri_header_text','equals','1')
                    ),
					array(
                        'id' 		=> 'celebrate_show_page_tagline',
                        'type' 		=> 'switch',
                        'title' 	=> esc_html__('Page Tagline', 'celebrate'),
                        'subtitle'	=> '',
                        'default' 	=> true,
						'desc' => esc_html__('This is a Tagline below page title', 'celebrate'),
                    ),
					array(
                        'id' 		=> 'celebrate_page_tagline',
                        'type'		=> 'text',
                        'title' 	=> esc_html__('Page Tagline', 'celebrate'),
                        'validate'	=> '',
                        'default' 	=> 'Company Tagline Goes Here',
						'desc' 		=> esc_html__('Can be override on each page.', 'celebrate'),
						'validate' 	=> 'no_html',
                    ),
					array(
                        'id'   	=> 'celebrate_header_mobile_settings',
                        'type' 	=> 'info',
						 'desc'	=>  wp_kses( __('Show (ON) / Hide (OFF) elements for MOBILE devices', 'celebrate'), array( 'br' => array(), ) ),
                    ),
					array(
                        'id'       	=> 'celebrate_hide_xs_sec_header_text',
                        'type'     	=> 'switch',
                        'title'    	=> esc_html__('Secondary Header Custom Text', 'celebrate'),
                        'subtitle'	=> '',
                        'default'  	=> false
                    ),
					array(
                        'id'       	=> 'celebrate_hide_cart_icon',
                        'type'     	=> 'switch',
                        'title'    	=> esc_html__('Cart Icon', 'celebrate'),
                        'subtitle'	=> '',
                        'default'  	=> false
                    ),
                )
            ); // Header Main Section ends

            // Header - Layout and Styling
            $this->sections[] = array(
                'icon' 			=> 'el-icon-cog',
                'title' 		=> esc_html__('Layout and Styling', 'celebrate'),
                'desc' 			=> '',
                'subsection'	=> true,
                'fields' => array(
                    array(
                        'id' 	=> 'celebrate_topbar_field',
                        'type'	=> 'info',
                        'desc' 	=> esc_html__('Secondary Header', 'celebrate')
                    ),
					array(
						'id'        => 'celebrate_secondary_header_bg',
						'type'      => 'color_rgba',
						'output'    => array('background-color' => '#tc-header-secondary'),
						'title'     => esc_html__('Secondary Header Background Color', 'celebrate'),
						'subtitle'  => '',
						'desc'      => esc_html__('Do not forget to press - Choose - button, to apply the selected color.', 'celebrate'),
						'options'       => array(
							'show_input'                => true,
							'show_initial'              => true,
							'show_alpha'                => true,
							'show_palette'              => false,
							'show_palette_only'         => false,
							'show_selection_palette'    => true,
							'max_palette_size'          => 10,
							'allow_empty'               => true,
							'clickout_fires_change'     => false,
							'choose_text'               => 'Choose',
							'cancel_text'               => 'Cancel',
							'show_buttons'              => true,
							'use_extended_classes'      => true,
							'palette'                   => null,  // show default
							'input_text'                => 'Select Color'
						),                        
					),
					array(
                        'id' => 'celebrate_secondary_header_padding',
                        'type' => 'spacing',
                        'output' => array(
                            '#tc-header-secondary .tc-header-secondary-inner'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'padding', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => true, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Padding (top & bottom)', 'celebrate'),
                        'subtitle' => '',
                        'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'padding-top' => '',
                            'padding-bottom' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_secondary_header_border',
                        'type' => 'border',
                        'title' => esc_html__('Border Bottom', 'celebrate'),
                        'output' => array(
                            '#tc-header-secondary'
                        ),
                        'all' => false,
                        'left' => false,
                        'right' => false,
                        'top' => false,
                        'default' => array(
                            'border-color' => '',
                            'border-style' => '',
                            'border-bottom' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_header_field',
                        'type' => 'info',
                        'desc' => esc_html__('Primary Header', 'celebrate')
                    ),
					array(
						'id'        => 'celebrate_primary_header_bg',
						'type'      => 'color_rgba',
						'output'    => array('background-color' => '#tc-header-primary'),
						'title'     => esc_html__('Primary Header Background Color', 'celebrate'),
						'subtitle'  => '',
						'desc'      => esc_html__('Do not forget to press - Choose - button, to apply the selected color.', 'celebrate'),
						'options'       => array(
							'show_input'                => true,
							'show_initial'              => true,
							'show_alpha'                => true,
							'show_palette'              => false,
							'show_palette_only'         => false,
							'show_selection_palette'    => true,
							'max_palette_size'          => 10,
							'allow_empty'               => true,
							'clickout_fires_change'     => false,
							'choose_text'               => 'Choose',
							'cancel_text'               => 'Cancel',
							'show_buttons'              => true,
							'use_extended_classes'      => true,
							'palette'                   => null,  // show default
							'input_text'                => 'Select Color'
						),                        
					),
                    array(
                        'id' => 'celebrate_primary_header_border',
                        'type' => 'border',
                        'title' => esc_html__('Border Bottom', 'celebrate'),
                        'output' => array(
                            '#tc-header-primary'
                        ),
                        'all' => false,
                        'left' => false,
                        'right' => false,
                        'top' => false,
                        'default' => array(
                            'border-color' => '',
                            'border-style' => '',
                            'border-bottom' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_primary_header_height',
                        'type' => 'text',
                        'title' => esc_html__('Header Height', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'subtitle' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
						'validate' => 'numeric'
                    ),
					array(
                        'id' => 'celebrate_header_sticky_field',
                        'type' => 'info',
                        'desc' => esc_html__('Header Common Dimensions', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_logo_spacing',
                        'type' => 'spacing',
                        'output' => array(
                            '.tc-logo'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'margin', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => false, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Margin Top to Logo', 'celebrate'),
					    'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'margin-top' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_header_search_spacing',
                        'type' => 'spacing',
                        'output' => array(
                            '#tc-trigger-wrapper'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'margin', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => false, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Margin Top to Search Icon', 'celebrate'),
                        'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'margin-top' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_cart_spacing',
                        'type' => 'spacing',
                        'output' => array(
                            '.cart-items-wrapper'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'margin', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => false, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Margin Top to Cart Icon', 'celebrate'),
                        'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'margin-top' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_priheader_text_spacing',
                        'type' => 'spacing',
                        'output' => array(
                            '.tc-header-pri-text'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'margin', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => false, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Margin Top to Custom Text in Primary Header', 'celebrate'),
                        'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'margin-top' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_header_sticky_field',
                        'type' => 'info',
                        'desc' => esc_html__('Sticky Header', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_stheader_background',
                        'type' => 'background',
                        'output' => array(
                            '#header-sticky'
                        ),
                        'title' => esc_html__('Background', 'celebrate'),
						'background-image' => false,
                        'background-repeat' => false,
                        'background-size' => false,
                        'background-attachment' => false,
                        'background-position' => false,
						'transparent' => false,
						'preview' => false,
                    ),
					array(
                        'id' => 'celebrate_sticky_header_height',
                        'type' => 'text',
                        'title' => esc_html__('Sticky Header Height', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'subtitle' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
						'validate' => 'numeric'
                    ),
					array(
                        'id' => 'celebrate_sticky_logo_spacing',
                        'type' => 'spacing',
                        'output' => array(
                            '#header-sticky .tc-logo'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'margin', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => false, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Margin Top to Logo', 'celebrate'),
						'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'margin-top' => ''
                        )
                    ),
                )
            );
			// Logo
            $this->sections[] = array(
                'icon' => 'el-icon-cog',
                'title' => esc_html__('Logo', 'celebrate'),
                'desc' => '',
                'subsection' => true,
                'fields' => array(
                    array(
                        'id' => 'celebrate_logo_field',
                        'type' => 'info',
                        'desc' => esc_html__("Logo", 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_logo_type',
                        'type' => 'image_select',
                        'title' => 'Select Logo Type',
                        'subtitle' => '',
                        'options' => array(
                            'celebrate_show_image_logo' => array(
                                'alt' => 'Image Logo',
                                'img' => get_template_directory_uri() . "/includes/img/image-logo.png"
                            ),
                            'celebrate_show_text_logo' => array(
                                'alt' => 'Text Logo',
                                'img' => get_template_directory_uri() . "/includes/img/text-logo.png"
                            )
                        ),
                        'default' => 'celebrate_show_image_logo'
                    ),
					array(
                        'id' => 'celebrate_image_logo_field',
                        'type' => 'info',
                        'style' => 'warning',
                        'desc' => esc_html__("If Image Logo : Upload logo image here", 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_image_logo',
                        'type' => 'media',
                        'title' => esc_html__('Logo Image', 'celebrate'),
                        'default' => array(
                            'url' => get_template_directory_uri() . '/img/logo.png'
                        )
                    ),
                    array(
                        'id' => 'celebrate_retina_logo_dimensions',
                        'type' => 'dimensions',
                        'output' => array(
                            '.tc-logo a img'
                        ),
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'title' => esc_html__('Logo - Width', 'celebrate'),
                        'subtitle' =>  wp_kses( __('If you need retina logo, upload double size logo above and provide dimentions here. <br><br> It should be the width of normal / standard logo, not the retina logo.', 'celebrate'), array( 'br' => array(), ) ),
                        'default' => array(
                            'width' => '',
                            'height' => ''
                        )
                    ),
					 array(
                        'id' => 'celebrate_sticky_logo_field',
                        'type' => 'info',
                        'desc' => esc_html__("Sticky Header Logo", 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_sticky_logo',
                        'type' => 'media',
                        'title' => esc_html__('Logo Image', 'celebrate'),
                        'default' => array(
                            'url' => get_template_directory_uri() . '/img/logo.png'
                        )
                    ),
					array(
                        'id' => 'celebrate_sticly_logo_dimensions',
                        'type' => 'dimensions',
                        'output' => array(
                            '#header-sticky .tc-logo a img'
                        ),
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'title' => esc_html__('Logo - Width', 'celebrate'),
                        'subtitle' =>  wp_kses( __('If you need retina logo, upload double size logo above and provide dimentions here. <br><br> It should be the width of normal logo, not the retina logo.', 'celebrate'), array( 'br' => array(), ) ),
                        'default' => array(
                            'width' => '',
                            'height' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_text_logo_field',
                        'type' => 'info',
					    'style' => 'warning',
                        'desc' => esc_html__("If Text Logo", 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_text_logo',
                        'type' => 'text',
                        'title' => esc_html__('', 'celebrate'),
                        'subtitle' => esc_html__('Enter text for logo', 'celebrate'),
                        'desc' => '',
                        'default' => 'Mylogo',
						'validate' => 'no_html'
                    ),
                    array(
                        'id' => 'celebrate_font_logo',
                        'type' => 'typography',
                        'output' => array(
                            '.tc-logo a'
                        ),
                        'title' => '',
                        'subtitle' => esc_html__('Set font for logo text.', 'celebrate'),
                        'google' => true,
                        'subsets' => true,
                        'color' => false,
                        'text-align' => false,
                        'default' => array(
                            'font-size' => '',
                            'font-family' => '',
                            'font-weight' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_link_logo',
                        'type' => 'link_color',
                        'output' => array(
                            '.tc-logo a'
                        ),
                        'desc' => esc_html__('Set font color and hover color for logo text.', 'celebrate'),
                        'regular' => true, // Disable Regular Color
                        'hover' => true, // Disable Hover Color
                        'active' => false, // Disable Active Color
                        'visited' => false, // Enable Visited Color
                        'default' => array(
                            'regular' => '',
                            'hover' => ''
                        )
                    ),
                )
            );
			// Menu
            $this->sections[] = array(
                'icon' => 'el-icon-cog',
                'title' => esc_html__('Menu', 'celebrate'),
                'desc' => '',
                'subsection' => true,
                'fields' => array(
					array(
                        'id' => 'celebrate_image_logo_field',
                        'type' => 'info',
                        'style' => 'warning',
						 'desc' => wp_kses( __('Theme default settings will work if not assigned below.<br>Basically theme has Default Menu Style for dark backgrounds and Alt Menu Style for light backgrounds. Those are applied as per the header variation.<br>Any style can assigned for header menu and sticky header menu depending on your preferred background color.', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
                    ),
                    array(
                        'id' => 'celebrate_menu_color_style',
                        'type' => 'select',
                        'title' => esc_html__('Header Menu', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
                            'tc-menu-default'	=> esc_html__('Default Menu Style', 'celebrate'),
							'tc-menu-alt' 	  	=> esc_html__('Alt Menu Style', 'celebrate'),

                        ),
                        'default' => ''
                    ),
					array(
                        'id' => 'celebrate_sticky_menu_color_style',
                        'type' => 'select',
                        'title' => esc_html__('Sticky Header Menu', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
                            'tc-menu-default'	=> esc_html__('Default Menu Style', 'celebrate'),
							'tc-menu-alt' 	  	=> esc_html__('Alt Menu Style', 'celebrate'),

                        ),
                        'default' => ''
                    ),
					 array(
                        'id' => 'celebrate_menu_typography_field',
                        'type' => 'info',
                        'desc' => esc_html__('Default Menu Style - Typography', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_menu_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Menu link', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            '.sf-menu a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '17px'
                        )
                    ),
					array(
                        'id' => 'celebrate_menu_typography_color',
                        'type' => 'color',
                        'output' => array(
                            '.sf-menu a'
                        ),
                        'title' => esc_html__('Menu Link Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_menu_typography_hover_color',
                        'type' => 'color',
                        'output' => array(
                            '.sf-menu li a:hover'
                        ),
                        'title' => esc_html__('Menu Link Hover Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_menu_link_active',
                        'type' => 'color',
                        'output' => array(
                            '.sf-menu li.current-menu-item a',
                            '.sf-menu li.current-menu-ancestor > a'
                        ),
                        'title' => esc_html__('Menu Link Active Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_menu_dropdown_typography',
                        'type' => 'typography',
                        'title' => esc_html__('Dropdown Link', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => false, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                             '.sf-menu li li a, .sf-menu .sub-menu li.current-menu-item li a, .sf-menu li.current-menu-item li a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-style' => '400',
                            'font-family' => 'Opan Sans',
                            'font-size' => '15px'
                        )
                    ),
					array(
                        'id' => 'celebrate_dropdown_link_color',
                        'type' => 'color',
                        'output' => array(
                            '.sf-menu li li a, .sf-menu .sub-menu li.current-menu-item li a, .sf-menu li.current-menu-item li a, .sf-menu ul li.current-menu-item a, .sf-menu li li.current-menu-ancestor > a:hover, .sf-menu li.megamenu li.current-menu-ancestor > a, .sf-menu li.megamenu li:hover > a'
                        ),
                        'title' => esc_html__('Dropdown Link Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_dropdown_link_active',
                        'type' => 'color',
                        'output' => array(
                            '.sf-menu .sub-menu li.current-menu-item li a:hover, .sf-menu .sub-menu li.current-menu-item a, .sf-menu li li.current-menu-ancestor > a, .sf-menu ul li a:hover, .sf-menu ul li:hover > a, .sf-menu > li.megamenu > ul > li > a:hover, .sf-menu li.megamenu li li:hover > a'
                        ),
                        'title' => esc_html__('Dropdown Link - Hover / Active - Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_dropdown_background',
                        'type' => 'color',
                        'title' => esc_html__('Dropdown Background Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_menu_border',
                        'type' => 'color',
                        'title' => esc_html__('Border Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_menu_alt_info_field',
                        'type' => 'info',
                        'style' => 'success',
                        'notice' => true,
                        'desc' => wp_kses( __("Alt Menu Style - Typography", 'celebrate'), array( 'br' => array(), ) ),
                    ),
					array(
                        'id' => 'celebrate_alt_menu_typography_color',
                        'type' => 'color',
                        'output' => array(
                            '.tc-menu-alt .sf-menu a'
                        ),
                        'title' => esc_html__('Menu Link Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_alt_menu_typography_hover_color',
                        'type' => 'color',
                        'output' => array(
                            '.tc-menu-alt .sf-menu li a:hover'
                        ),
                        'title' => esc_html__('Menu Link Hover Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_alt_menu_link_active',
                        'type' => 'color',
                        'output' => array(
                            '.tc-menu-alt .sf-menu li.current-menu-item a',
                            '.tc-menu-alt .sf-menu li.current-menu-ancestor > a'
                        ),
                        'title' => esc_html__('Menu Link Active Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_alt_dropdown_link_color',
                        'type' => 'color',
                        'output' => array(
                            '.tc-menu-alt .sf-menu li li a, .tc-menu-alt .sf-menu .sub-menu li.current-menu-item li a, .tc-menu-alt .sf-menu li.current-menu-item li a, .tc-menu-alt .sf-menu ul li.current-menu-item a, .tc-menu-alt .sf-menu li li.current-menu-ancestor > a:hover, .tc-menu-alt .sf-menu li.megamenu li.current-menu-ancestor > a, .tc-menu-alt .sf-menu li.megamenu li:hover > a'
                        ),
                        'title' => esc_html__('Dropdown Link Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_alt_dropdown_link_active',
                        'type' => 'color',
                        'output' => array(
                            '.tc-menu-alt .sf-menu .sub-menu li.current-menu-item li a:hover, .tc-menu-alt .sf-menu .sub-menu li.current-menu-item a, .tc-menu-alt .sf-menu li li.current-menu-ancestor > a, .tc-menu-alt .sf-menu ul li a:hover, .tc-menu-alt .sf-menu ul li:hover > a, .tc-menu-alt .sf-menu > li.megamenu > ul > li > a:hover, .tc-menu-alt .sf-menu li.megamenu li li:hover > a'
                        ),
                        'title' => esc_html__('Dropdown Link - Hover / Active - Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
				array(
                        'id' => 'celebrate_alt_dropdown_background',
                        'type' => 'background',
                        'output' => array(
                            '.tc-menu-alt .sf-menu ul',
                            '.tc-menu-alt .sf-menu ul ul'
                        ),
                        'title' => esc_html__('Dropdown Background Color', 'celebrate'),
                        'background-image' => false,
                        'background-repeat' => false,
                        'background-size' => false,
                        'background-attachment' => false,
                        'background-position' => false,
					    'transparent' => false,
                        'preview' => false,
                        'default' => array(
                            'background-color' => ''
                        )
                    ),
                )
            ); // menu
            // Page header
            $this->sections[] = array(
                'title' => esc_html__('Page Title + Breadcrumb', 'celebrate'),
                'desc' => '',
                'subsection' => true,
                'icon' => 'el-icon-cog',
                'fields' => array(
                    array(
                        'id' => 'celebrate_page_header_background',
                        'type' => 'background',
                        'output' => array(
                            '#page-header'
                        ),
                        'title' => esc_html__('Background', 'celebrate'),
                        'default' => array(
                            'background-color' => ''
                        )
                    ),
					array(
                        'id' 		=> 'celebrate_overlay_value',
                        'type' 		=> 'text',
                        'title' 	=> esc_html__('Dark Overlay to Page Title Background Image', 'celebrate'),
                        'validate'	=> '',
						'desc' 		=> wp_kses( __( 'Leave blank if need to use image as such. Useful if light colored image, to improve text visibility. <br> Give it in  decimal like:  <br> .1 <br> .3', 'celebrate' ), array( 'br' => array(), ) ),
                        'default' 	=> ''
                    ),
					array(
                        'id' => 'celebrate_page_header_top_padding',
                        'type' => 'text',
                        'title' => esc_html__('Padding Top', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
						'validate' => 'numeric'
                    ),
					array(
                        'id' => 'celebrate_page_header_bottom_padding',
                        'type' => 'text',
                        'title' => esc_html__('Padding Bottom', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
						'validate' => 'numeric'
                    ),
                    array(
                        'id' => 'celebrate_pageheader_border',
                        'type' => 'border',
                        'title' => esc_html__('Border Top', 'celebrate'),
                        'output' => array(
                            '#page-header'
                        ),
                        'all' => false,
                        'left' => false,
                        'right' => false,
						'bottom' => false,
                        'default' => array(
                            'border-color' => '',
                            'border-style' => '',
                            'border-bottom' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_pageheader_border_btm',
                        'type' => 'border',
                        'title' => esc_html__('Border Bottom', 'celebrate'),
                        'output' => array(
                            '#page-header'
                        ),
                        'all' => false,
                        'left' => false,
                        'right' => false,
						'top' => false,
                        'default' => array(
                            'border-color' => '',
                            'border-style' => '',
                            'border-bottom' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_topbar_field',
                        'type' => 'info',
                        'desc' => esc_html__('Breadcrumb', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_show_breadcrumb',
                        'type' => 'switch',
                        'title' => esc_html__('Breadcrumb', 'celebrate'),
                        'default' => true,
						 'desc' => esc_html__('Breadcrumb for blog and portfolio posts can be set separately in respective section.', 'celebrate'),
                    ),
					array(
                        'id' => 'celebrate_breadcrumb_spacing',
                        'type' => 'spacing',
                        'output' => array(
                            '.breadcrumbs'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'margin', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => false, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Margin Top to Breadcrumbs', 'celebrate'),
					    'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'margin-top' => ''
                        )
                    ),
					
                )
            );
            // Footer
            $this->sections[] = array(
                'title' => esc_html__('Footer', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-cog',
                'fields' => array(
					array(
                        'id' => 'celebrate_show_footer',
                        'type' => 'switch',
                        'title' => esc_html__('Footer', 'celebrate'),
                        'default' => true
                    ),
                    array(
                        'id' => 'celebrate_columns_footer',
                        'type' => 'image_select',
                        'title' => esc_html__('Number of Columns', 'celebrate'),
                        'subtitle' => '',
                        'desc' =>  wp_kses( __('Select number of columns. <br> Then add widgets to these columns: Appearance > Widgets', 'celebrate'), array( 'br' => array(),  ) ),
                        'options' => array(
                            '1' => array(
                                'alt' => 'One Column',
                                'img' => get_template_directory_uri() . "/includes/img/col1.png"
                            ),
                            '2' => array(
                                'alt' => 'Two Columns',
                                'img' => get_template_directory_uri() . "/includes/img/col2.png"
                            ),
                            '3' => array(
                                'alt' => 'Three Columns',
                                'img' => get_template_directory_uri() . "/includes/img/col3.png"
                            ),
                            '4' => array(
                                'alt' => 'Four Columns',
                                'img' => get_template_directory_uri() . "/includes/img/col4.png"
                            ),
							'5' => array(
                                'alt' => 'One Fourth Vaiation 1',
                                'img' => get_template_directory_uri() . "/includes/img/col3-var.jpg"
                            ),
							'6' => array(
                                'alt' => 'One Fourth Vaiation 2',
                                'img' => get_template_directory_uri() . "/includes/img/col2-var.jpg"
                            )
                        ),
                        'default' => '3'
                    ),
                    array(
                        'id' => 'celebrate_footer_background_img',
                        'type' => 'background',
                        'output' => array(
                            '#footer'
                        ),
                        'title' => esc_html__('Background', 'celebrate'),
                        'default' => array(
                            'background-color' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_show_footer_overlay',
                        'type' => 'switch',
                        'title' => esc_html__('Overlay To footer', 'celebrate'),
                        'default' => true
                    ),
					array(
						'id'        => 'celebrate_footer_background_color',
						'type'      => 'color_rgba',
						'output'    => array('background-color' => '.tc-footer-overlay'),
						'title'     => esc_html__('Footer Overlay Color', 'celebrate'),
						'subtitle'  => '',
						'desc'      => esc_html__('Do not forget to press - Choose - button, to apply the selected color.', 'celebrate'),
						'options'       => array(
							'show_input'                => true,
							'show_initial'              => true,
							'show_alpha'                => true,
							'show_palette'              => false,
							'show_palette_only'         => false,
							'show_selection_palette'    => true,
							'max_palette_size'          => 10,
							'allow_empty'               => true,
							'clickout_fires_change'     => false,
							'choose_text'               => 'Choose',
							'cancel_text'               => 'Cancel',
							'show_buttons'              => true,
							'use_extended_classes'      => true,
							'palette'                   => null,  // show default
							'input_text'                => 'Select Color'
						),                        
					),
                    array(
                        'id' => 'celebrate_footer_padding',
                        'type' => 'spacing',
                        'output' => array(
                            '#footer'
                        ), 
                        'mode' => 'padding', 
                        'all' => false, 
                        'top' => true,
                        'right' => false, 
                        'bottom' => true, 
                        'left' => false, 
                        'units' => 'px',
                        'units_extended' => 'false', 
                        'display_units' => 'true', 
                        'title' => esc_html__('Padding (top & bottom)', 'celebrate'),
                        'subtitle' => '',
                        'desc' =>  esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'padding-top' => '',
                            'padding-bottom' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_footer_border',
                        'type' => 'border',
                        'title' => esc_html__('Border Top', 'celebrate'),
                        'output' => array(
                            '#footer'
                        ),
                        'all' => false,
                        'left' => false,
                        'right' => false,
						'bottom' => false,
                        'top' => true,
                        'default' => array(
                            'border-color' => '',
                            'border-style' => '',
                            'border-top' => ''
                        )
                    ),
					array(
                        'id' => 'tcsn-copyright-field',
                        'type' => 'info',
                        'desc' =>  wp_kses( __('Copyright', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
                    ),
                    array(
                        'id' => 'celebrate_show_copyright',
                        'type' => 'switch',
                        'title' => esc_html__('Copyright', 'celebrate'),
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_copyright_columns',
                        'type' => 'image_select',
                        'title' => esc_html__('Number of Columns', 'celebrate'),
                        'subtitle' => '',
                        'desc' =>  wp_kses( __('Select number of columns. <br> Then add widgets to these columns: Appearance > Widgets', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
                        'options' => array(
                            '1' => array(
                                'alt' => 'One Column',
                                'img' => get_template_directory_uri() . "/includes/img/col1.png"
                            ),
                            '2' => array(
                                'alt' => 'Two Columns',
                                'img' => get_template_directory_uri() . "/includes/img/col2.png"
                            )
                        ),
                        'default' => '2'
                    ),
				   array(
                        'id' => 'celebrate_copyright_background',
                        'type' => 'background',
						'background-image' => false,
                        'background-repeat' => false,
                        'background-size' => false,
						'transparent' => false,
						'preview' => false,
                        'background-attachment' => false,
                        'background-position' => false,
                        'output' => array(
                            '#copyright'
                        ),
                        'title' => esc_html__('Background', 'celebrate'),
                        'default' => array(
                            'background-color' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_copyright_padding',
                        'type' => 'spacing',
                        'output' => array(
                            '#copyright'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'padding', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => true, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Padding Top', 'celebrate'),
                        'subtitle' => '',
						'desc' =>  wp_kses( __("No need of unit. <br> It is placed inside footer so padding bottom to copyright is footer's padding bottom", 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
                        'default' => array(
                            'padding-top' 		=> '',
							'padding-bottom'	=> '',
                        )
                    ),
					array(
                        'id' => 'celebrate_copyright_border',
                        'type' => 'border',
                        'title' => esc_html__('Border Top', 'celebrate'),
                        'output' => array(
                            '#copyright'
                        ),
                        'all' => false,
                        'left' => false,
                        'right' => false,
						'bottom' => false,
                        'top' => true,
                        'default' => array(
                            'border-color' => '',
                            'border-style' => '',
                            'border-top' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_others_field',
                        'type' => 'info',
                        'desc' => esc_html__('Others', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_show_take_top',
                        'type' => 'switch',
                        'title' => esc_html__('Show Take to Top Arrow', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_footer_alignment_field',
                        'type' => 'info',
                        'desc' => esc_html__('Footer Columns Text Alignment', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_footer_first_col',
                        'type' => 'select',
                        'title' => esc_html__('Footer First Column', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
							''				=> esc_html__('Default - Left', 'celebrate'),
                            'text-center'	=> esc_html__('Text Center', 'celebrate'),
							'text-right'	=> esc_html__('Text Right', 'celebrate'),
                        ),
                        'default' => ''
                    ),
					array(
                        'id' => 'celebrate_footer_second_col',
                        'type' => 'select',
                        'title' => esc_html__('Footer Second Column', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
							''				=> esc_html__('Default - left', 'celebrate'),
                            'text-center'	=> esc_html__('Text Center', 'celebrate'),
							'text-right'	=> esc_html__('Text Right', 'celebrate'),
                        ),
                        'default' => ''
                    ),
					array(
                        'id' => 'celebrate_footer_third_col',
                        'type' => 'select',
                        'title' => esc_html__('Footer Third Column', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
							''				=> esc_html__('Default - left', 'celebrate'),
                            'text-center'	=> esc_html__('Text Center', 'celebrate'),
							'text-right'	=> esc_html__('Text Right', 'celebrate'),
                        ),
                        'default' => ''
                    ),
					array(
                        'id' => 'celebrate_footer_fourth_col',
                        'type' => 'select',
                        'title' => esc_html__('Footer Fourth Column', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
							''				=> esc_html__('Default - left', 'celebrate'),
                            'text-center'	=> esc_html__('Text Center', 'celebrate'),
							'text-right'	=> esc_html__('Text Right', 'celebrate'),
                        ),
                        'default' => ''
                    ),
                )
            );
            // Blog
            $this->sections[] = array(
                'title' => esc_html__('Blog', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-cog',
                'fields' => array(
					array(
                        'id' => 'celebrate_blog_title',
                        'type' => 'text',
                        'title' => esc_html__('Blog Page Title', 'celebrate'),
                        'validate' => '',
                        'default' => 'Blog',
						'validate' => 'no_html'
                    ),
                    array(
                        'id' => 'celebrate_archive_field',
                        'type' => 'info',
                        'desc' => esc_html__('Archives / Main Blog Page', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_blog_archives_layout',
                        'type' => 'select',
                        'title' => esc_html__('Select Post Archives Page Layout', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
                            'right-sidebar' => esc_html__('Right Sidebar', 'celebrate'),
                            'left-sidebar' => esc_html__('Left Sidebar', 'celebrate'),
                            'fullwidth' => esc_html__('No Sidebar', 'celebrate')
                        ),
                        'default' => 'right-sidebar'
                    ),
					array(
                        'id' => 'celebrate_excerpt_length',
                        'type' => 'text',
                        'title' => esc_html__('Excerpt Length', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'desc' => wp_kses( __("Number of words. <br> If you do not have excerpt written in excerpt textarea on 'Edit Post' screen, content will be displayed limited to provided number of words. <br> Default is 40", 'celebrate'), array( 'br' => array(), ) ),
						'validate' => 'numeric'
                    ),
					array(
                        'id' => 'celebrate_show_read_more',
                        'type' => 'switch',
                        'title' => esc_html__('Show Blog Read More Button', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_read_more',
                        'type' => 'text',
                        'title' => esc_html__('Blog Read More Button Text', 'celebrate'),
                        'default' => '',
						'validate' => 'no_html'
                    ),
                    array(
                        'id' => 'celebrate_single_post_field',
                        'type' => 'info',
                        'desc' => esc_html__('Single Post', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_blog_single_post_layout',
                        'type' => 'select',
                        'title' => esc_html__('Select Layout', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
                            'right-sidebar'	=> esc_html__('Right Sidebar', 'celebrate'),
                            'left-sidebar' 	=> esc_html__('Left Sidebar', 'celebrate'),
                            'fullwidth'   	=> esc_html__('No Sidebar', 'celebrate')
                        ),
                        'default' => 'right-sidebar'
                    ),
					array(
                        'id' => 'celebrate_blog_predefined_content',
                        'type' => 'switch',
                        'title' => esc_html__('Feature Image on Single Post', 'celebrate'),
                        'subtitle' => '',
                        'desc' => esc_html__('This will work for all post formats', 'celebrate'),
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_breadcrumb_blog',
                        'type' => 'switch',
                        'title' => esc_html__('Breadcrumb on Single Post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_blog_tagline',
                        'type' => 'switch',
                        'title' => esc_html__('Tagline on Single Post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
                )
            );
            // Portfolio
            $this->sections[] = array(
                'title' => esc_html__('Portfolio', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-cog',
                'fields' => array(
                    array(
                        'id' => 'celebrate_portfolio_grid',
                        'type' => 'info',
                        'desc' => esc_html__('Portfolio Grid Pages (3,4 columns)', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_portfolio_items_per_page',
                        'type' => 'text',
                        'title' => esc_html__('Portfolio items per page', 'celebrate'),
                        'desc' => esc_html__('Specify the number of portfolio items to display per page.', 'celebrate'),
                        'validate' => '',
                        'default' => '9',
						'validate' => 'numeric'
                    ),
					array(
                        'id' => 'celebrate_portfolio_style',
                        'type' => 'switch',
                        'title' => esc_html__('Make Portfolio Items Compact / without Gap', 'celebrate'),
                        'subtitle' => '',
                        'default' => false
                    ),
                    array(
                        'id' => 'celebrate_portfolio_sort',
                        'type' => 'select',
                        'title' => esc_html__('Sort Portfolio Items', 'celebrate'),
                        'subtitle' => '',
                        'options' => array(
                            'date' 	=> 'By Date',
                            'rand' 	=> 'Random',
                            'title'	=> 'By Title'
                        ),
                        'default' => 'date'
                    ),
                    array(
                        'id' => 'celebrate_portfolio_arrange',
                        'type' => 'select',
                        'title' => esc_html__('Arrange Sorted Portfolio Items', 'celebrate'),
                        'subtitle' => '',
                        'desc' => esc_html__('For more flexible re-ordering you can use any plugin', 'celebrate'),
                        'options' => array(
                            'DESC' => 'Descending',
                            'ASC' => 'Ascending'
                        ),
                        'default' => 'DESC'
                    ),
                    array(
                        'id' => 'celebrate_portfolio_filter',
                        'type' => 'switch',
                        'title' => esc_html__('Portfolio Filter', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_portfolio_imghvr_settings',
                        'type' => 'info',
						'style' => 'success',
                        'desc' => esc_html__('Image / Hover Settings', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_portfolio_img_scale',
                        'type' => 'switch',
                        'title' => esc_html__('Image scale On Hover', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' 		=> 'celebrate_portfolio_img_size',
                        'type' 		=> 'select',
                        'title' 	=> esc_html__('Image Size', 'celebrate'),
                        'subtitle'	=> '',
                        'options'	=> array(
                            'full' 		=> 'Full',
                            'medium' 	=> 'Medium',
                        ),
                        'default'	=> ''
                    ),
					array(
                        'id' => 'celebrate_portfolio_hover',
                        'type' => 'switch',
                        'title' => esc_html__('Hover to Portfolio Image', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_portfolio_hrheading',
                        'type' => 'switch',
                        'title' => esc_html__('Heading On Hover', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_zoom_on_hover',
                        'type' => 'switch',
                        'title' => esc_html__('Zoom on hover', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
                    array(
                        'id' => 'celebrate_link_on_hover',
                        'type' => 'switch',
                        'title' => esc_html__('Link on hover', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_portfolio_other-settings',
                        'type' => 'info',
						'style' => 'success',
                        'desc' => esc_html__('Other Settings', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_portfolio_heading',
                        'type' => 'switch',
                        'title' => esc_html__('Heading below Portfolio Image', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					 array(
                        'id' => 'celebrate_portfolio_heading_link',
                        'type' => 'switch',
                        'title' => esc_html__('Link to Heading of Portfolio Item', 'celebrate'),
						'subtitle' => esc_html__('Link will be displayed as per the option selected on portfolio item edit page. This option will work for both, heading on hover and below image.', 'celebrate'),
                        'default' => true
                    ),
                    array(
                        'id' => 'celebrate_portfolio_excerpt',
                        'type' => 'switch',
                        'title' => esc_html__('Excerpt below Portfolio Item', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_link_target',
                        'type' => 'switch',
                        'title' => esc_html__('Link Target', 'celebrate'),
                        'subtitle' => '',
						'desc' => esc_html__('Open all links to heading / link icon in new window', 'celebrate'),
                        'default' => false
                    ),

                    array(
                        'id' => 'celebrate_portfolio_details_page',
                        'type' => 'info',
                        'desc' => esc_html__('Portfolio Details Page / Single Portfolio Post', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_portfolio_predefined_content',
                        'type' => 'switch',
                        'title' => esc_html__('Featured Image', 'celebrate'),
                        'subtitle' => '',
                        'desc' => esc_html__('Check to enable featured image on portfolio details page.', 'celebrate'),
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_page_header_portfolio',
                        'type' => 'switch',
                        'title' => esc_html__('Show Page Header On Single Portfolio Post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_breadcrumb_portfolio',
                        'type' => 'switch',
                        'title' => esc_html__('Show Breadcrumb On Single Portfolio Post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_portfolio_tagline',
                        'type' => 'switch',
                        'title' => esc_html__('Show Tagline below Page Title On Single Portfolio Post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
                )
            );
			// CPT
            $this->sections[] = array(
                'title' => esc_html__('CPT Settings', 'celebrate'),
                'desc' => esc_html__('Custom Post Types Slugs - Your prefered word in URL for custom post types', 'celebrate'),
                'icon' => 'el-icon-cog',
                'fields' => array(
					array(
                        'id' => 'celebrate_cpt_slug_info',
                        'type' => 'info',
						 'style' => 'success',
                        'desc' => wp_kses( __('This will need to flush permalinks after you save new slug here. <br>Refer help doc for more info about flushing permalinks.', 'celebrate'), array( 'br' => array(), ) ),
                    ),
					array(
                        'id' => 'celebrate_portfolio_field',
                        'type' => 'info',
                        'desc' => esc_html__('Portfolio', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_portfolio_slug',
                        'type' => 'text',
                        'title' => esc_html__('Rewrite Portfolio Slug', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'desc' => esc_html__("Use if need custom word in place of 'portfolio-items' in URL.", 'celebrate'),
						'validate' => 'no_html'
                    ),
                    array(
                        'id' => 'celebrate_team_field',
                        'type' => 'info',
                        'desc' => esc_html__('Team', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_page_header_team',
                        'type' => 'switch',
                        'title' => esc_html__('Show Page Header On Single Team Member Post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_team_slug',
                        'type' => 'text',
                        'title' => esc_html__('Rewrite Team Slug', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'desc' =>  esc_html__("Use if need custom word in place of 'team-member' in URL.", 'celebrate'),
						'validate' => 'no_html'
                    ),
					array(
                        'id' => 'celebrate_team_predefined_content',
                        'type' => 'switch',
                        'title' => esc_html__('Predefined content on Team Single Post', 'celebrate'),
                        'subtitle' => '',
                        'desc' => esc_html__('OFF this if need complete blank page for custom structure', 'celebrate'),
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_testimonial_field',
                        'type' => 'info',
                        'desc' => esc_html__('Testimonial', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_page_header_testimonial',
                        'type' => 'switch',
                        'title' => esc_html__('Show Page Header On Single Testimonial Post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_testimonial_slug',
                        'type' => 'text',
                        'title' => esc_html__('Rewrite Testimonial Slug', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'desc' =>  esc_html__("Use if need custom word in place of 'reviews' in URL.", 'celebrate'),
						'validate' => 'no_html'
                    ),
                )
            );
			// Social Share
            $this->sections[] = array(
                'title' => esc_html__('Social Share', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-cog',
                'fields' => array(
                    array(
                        'id' => 'celebrate_blog_social_share_field',
                        'type' => 'info',
                        'desc' => esc_html__('Social Share for Blog and CPT', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_post_social_share',
                        'type' => 'switch',
                        'title' => esc_html__('Show Social Share on Blog Post', 'celebrate'),
                        'desc' => esc_html__('Will be displayed on single post', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_blog_social_share_select_field',
                        'type' => 'info',
                        'desc' => esc_html__('Select to display', 'celebrate')
                    ),
                   	array(
                        'id' => 'celebrate_show_facebook_share',
                        'type' => 'switch',
                        'title' => esc_html__('Facebook Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_twitter_share',
                        'type' => 'switch',
                        'title' => esc_html__('Twitter Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_googleplus_share',
                        'type' => 'switch',
                        'title' => esc_html__('Googleplus Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_linkedin_share',
                        'type' => 'switch',
                        'title' => esc_html__('Linkedin Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_pinterest_share',
                        'type' => 'switch',
                        'title' => esc_html__('Pinterest Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_mail_share',
                        'type' => 'switch',
                        'title' => esc_html__('Mail Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
                )
            );
			 // Woocommerce
            $this->sections[] = array(
                'title' => esc_html__('Woocommerce', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-cog',
                'fields' => array(
					array(
                        'id' => 'celebrate_page_header_woo',
                        'type' => 'switch',
                        'title' => esc_html__('Page Header On Woo Pages', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_breadcrumb_woo',
                        'type' => 'switch',
                        'title' => esc_html__('Breadcrumb On Woo Pages', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
                    array(
                        'id' => 'celebrate_woocommerce_shop_title',
                        'type' => 'text',
                        'title' => esc_html__('Shop Page Title', 'celebrate'),
                        'validate' => '',
                        'default' => 'Products',
						'validate' => 'no_html'
                    ),
                    array(
                        'id' => 'celebrate_shop_layout',
                        'type' => 'select',
                        'title' => esc_html__('Select Shop Layout', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
                            'right-sidebar' => esc_html__('Right Sidebar', 'celebrate'),
                            'left-sidebar' => esc_html__('Left Sidebar', 'celebrate'),
                            'fullwidth' => esc_html__('No Sidebar', 'celebrate')
                        ),
                        'default' => 'right-sidebar'
                    ),
                    array(
                        'id' => 'celebrate_woocommerce_shop_columns',
                        'type' => 'select',
                        'title' => esc_html__('Shop Columns', 'celebrate'),
                        'subtitle' => '',
                        'options' => array(
                            '2' => '2',
                            '3' => '3',
                            '4' => '4'
                        ),
                        'default' => '3'
                    ),
                    array(
                        'id' => 'celebrate_product_field',
                        'type' => 'info',
                        'desc' => esc_html__('Product Page', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_product_layout',
                        'type' => 'select',
                        'title' => esc_html__('Select Product Page Layout.', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'options' => array(
                            'right-sidebar' => esc_html__('Right Sidebar', 'celebrate'),
                            'left-sidebar' => esc_html__('Left Sidebar', 'celebrate'),
                            'fullwidth' => esc_html__('No Sidebar', 'celebrate')
                        ),
                        'default' => 'right-sidebar'
                    ),
                    array(
                        'id' => 'celebrate_related_product_field',
                        'type' => 'info',
                        'desc' => esc_html__('Related Products', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_woocommerce_related_products_column',
                        'type' => 'select',
                        'title' => esc_html__('Related Products Columns', 'celebrate'),
                        'subtitle' => '',
                        'desc' => esc_html__('', 'celebrate'),
                        'options' => array(
                            '1' => '1',
                            '2' => '2',
                            '3' => '3',
                            '4' => '4'
                        ),
                        'default' => '3'
                    ),
                    array(
                        'id' => 'celebrate_woocommerce_related_products',
                        'type' => 'text',
                        'title' => esc_html__('Number of Related Products', 'celebrate'),
                        'subtitle' => '',
                        'desc' => '',
                        'default' => '3'
                    ),
                    array(
                        'id' => 'celebrate_product_social_share_field',
                        'type' => 'info',
                        'desc' => esc_html__('Social Share', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_product_social_share',
                        'type' => 'switch',
                        'title' => esc_html__('Show Social Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
                    array(
                        'id' => 'celebrate_show_woo_facebook_share',
                        'type' => 'switch',
                        'title' => esc_html__('Facebook Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_woo_twitter_share',
                        'type' => 'switch',
                        'title' => esc_html__('Twitter Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_woo_googleplus_share',
                        'type' => 'switch',
                        'title' => esc_html__('Googleplus Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_woo_linkedin_share',
                        'type' => 'switch',
                        'title' => esc_html__('Linkedin Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_woo_pinterest_share',
                        'type' => 'switch',
                        'title' => esc_html__('Pinterest Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
					array(
                        'id' => 'celebrate_show_woo_mail_share',
                        'type' => 'switch',
                        'title' => esc_html__('Mail Share', 'celebrate'),
                        'subtitle' => '',
                        'default' => true
                    ),
                )
            ); // woo
			// Misc
            $this->sections[] = array(
                'title' => esc_html__('Misc', 'celebrate'),
                'icon' => 'el-icon-cog',
                'fields' => array(
					array(
                        'id' => 'celebrate_404_field',
                        'type' => 'info',
                        'desc' => esc_html__('404 Page', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_404_heading',
                        'type' => 'text',
                        'title' => esc_html__('404 Page Big Heading', 'celebrate'),
                        'validate' => '',
                        'default' => '404',
						'validate' => 'no_html'
                    ),
					array(
                        'id' => 'celebrate_404_text',
                        'type' => 'text',
                        'title' => esc_html__('404 Page Text', 'celebrate'),
                        'validate' => '',
                        'default' => 'Sorry...the page you are looking for does not exist. Try with search.',
						'validate' => 'no_html'
                    ),
					array(
                        'id' => 'celebrate_404_link_text',
                        'type' => 'text',
                        'title' => esc_html__('404 Page Back to Home Link Text', 'celebrate'),
                        'validate' => '',
                        'default' => 'Back to Home',
						'validate' => 'no_html'
                    ),
					array(
                        'id' => 'celebrate_search_field',
                        'type' => 'info',
                        'desc' => esc_html__('Search Field', 'celebrate')
                    ),
					array(
                        'id' => 'celebrate_search_text',
                        'type' => 'text',
                        'title' => esc_html__('Search Field Text', 'celebrate'),
                        'validate' => '',
                        'default' => 'What’re you looking for...',
						'validate' => 'no_html'
                    ),
                )
            );
			// One Page
            $this->sections[] = array(
                'title' => esc_html__('One Page Template', 'celebrate'),
                'icon' => 'el-icon-cog',
                'fields' => array(
					array(
						'id'        => 'celebrate_onepage_header_bg',
						'type'      => 'color_rgba',
						'output'    => array('background-color' => '#header-one-page'),
						'title'     => esc_html__('One Page Header Background Color', 'celebrate'),
						'subtitle'  => '',
						'desc'      => esc_html__('Do not forget to press - Choose - button, to apply the selected color.', 'celebrate'),
						'options'       => array(
							'show_input'                => true,
							'show_initial'              => true,
							'show_alpha'                => true,
							'show_palette'              => false,
							'show_palette_only'         => false,
							'show_selection_palette'    => true,
							'max_palette_size'          => 10,
							'allow_empty'               => true,
							'clickout_fires_change'     => false,
							'choose_text'               => 'Choose',
							'cancel_text'               => 'Cancel',
							'show_buttons'              => true,
							'use_extended_classes'      => true,
							'palette'                   => null,  // show default
							'input_text'                => 'Select Color'
						),                        
					),
					array(
						'id'        => 'celebrate_onepage_header_scroll_bg',
						'type'      => 'color_rgba',
						'output'    => array('background-color' => '#header-one-page.hsticky'),
						'title'     => esc_html__('One Page Header Background Color - On scroll', 'celebrate'),
						'subtitle'  => '',
						'desc'      => esc_html__('Do not forget to press - Choose - button, to apply the selected color.', 'celebrate'),
						'options'       => array(
							'show_input'                => true,
							'show_initial'              => true,
							'show_alpha'                => true,
							'show_palette'              => false,
							'show_palette_only'         => false,
							'show_selection_palette'    => true,
							'max_palette_size'          => 10,
							'allow_empty'               => true,
							'clickout_fires_change'     => false,
							'choose_text'               => 'Choose',
							'cancel_text'               => 'Cancel',
							'show_buttons'              => true,
							'use_extended_classes'      => true,
							'palette'                   => null,  // show default
							'input_text'                => 'Select Color'
						),                        
					),
					array(
                        'id' => 'celebrate_onepage_header_height',
                        'type' => 'text',
                        'title' => esc_html__('Header Height', 'celebrate'),
                        'validate' => '',
                        'default' => '',
						'subtitle' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
						'validate' => 'numeric'
                    ),
					array(
                        'id' => 'celebrate_onepage_logo_spacing',
                        'type' => 'spacing',
                        'output' => array(
                            '#header-one-page .tc-logo'
                        ), // An array of CSS selectors to apply this font style to
                        'mode' => 'margin', // absolute, padding, margin, defaults to padding
                        'all' => false, // Have one field that applies to all
                        'top' => true, // Disable the top
                        'right' => false, // Disable the right
                        'bottom' => false, // Disable the bottom
                        'left' => false, // Disable the left
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'display_units' => 'true', // Set to false to hide the units if the units are specified
                        'title' => esc_html__('Margin Top to Logo', 'celebrate'),
					    'desc' => esc_html__('No need of unit. It will be in px.', 'celebrate'),
                        'default' => array(
                            'margin-top' => ''
                        )
                    ),
					// logo
					  array(
                        'id' => 'celebrate_onepage_logo_field',
                        'type' => 'info',
                        'desc' => esc_html__("Logo", 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_onepage_logo_type',
                        'type' => 'image_select',
                        'title' => 'Select Logo Type',
                        'subtitle' => '',
                        'options' => array(
                            'celebrate_show_image_onepage_logo' => array(
                                'alt' => 'Image Logo',
                                'img' => get_template_directory_uri() . "/includes/img/image-logo.png"
                            ),
                            'celebrate_show_text_onepage_logo' => array(
                                'alt' => 'Text Logo',
                                'img' => get_template_directory_uri() . "/includes/img/text-logo.png"
                            )
                        ),
                        'default' => 'celebrate_show_image_onepage_logo'
                    ),
					array(
                        'id' => 'celebrate_image_onepage_logo_field',
                        'type' => 'info',
                        'style' => 'warning',
                        'desc' => esc_html__("If Image Logo : Upload logo image here", 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_image_onepage_logo',
                        'type' => 'media',
                        'title' => esc_html__('Logo Image', 'celebrate'),
                        'default' => array(
                            'url' => get_template_directory_uri() . '/img/logo.png'
                        )
                    ),
                    array(
                        'id' => 'celebrate_retina_onepage_logo_dimensions',
                        'type' => 'dimensions',
                        'output' => array(
                            '#header-one-page .tc-logo a img'
                        ),
                        'units' => 'px', // You can specify a unit value. Possible: px, em, %
                        'units_extended' => 'false', // Allow users to select any type of unit
                        'title' => esc_html__('Logo - Width', 'celebrate'),
                        'subtitle' =>  wp_kses( __('If you need retina logo, upload double size logo above and provide dimentions here. <br><br> It should be the width of normal / standard logo, not the retina logo.', 'celebrate'), array( 'br' => array(), ) ),
                        'default' => array(
                            'width' => '',
                            'height' => ''
                        )
                    ),
					array(
                        'id' => 'celebrate_text_onepage_logo_field',
                        'type' => 'info',
					    'style' => 'warning',
                        'desc' => esc_html__("If Text Logo", 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_text_onepage_logo',
                        'type' => 'text',
                        'title' => esc_html__('', 'celebrate'),
                        'subtitle' => esc_html__('Enter text for logo', 'celebrate'),
                        'desc' => '',
                        'default' => 'Mylogo',
						'validate' => 'no_html'
                    ),
                    array(
                        'id' => 'celebrate_font_onepage_logo',
                        'type' => 'typography',
                        'output' => array(
                            '#header-one-page .tc-logo a'
                        ),
                        'title' => '',
                        'subtitle' => esc_html__('Set font for logo text.', 'celebrate'),
                        'google' => true,
                        'subsets' => true,
                        'color' => false,
                        'text-align' => false,
                        'default' => array(
                            'font-size' => '',
                            'font-family' => '',
                            'font-weight' => ''
                        )
                    ),
                    array(
                        'id' => 'celebrate_link_onepage_logo',
                        'type' => 'link_color',
                        'output' => array(
                            '#header-one-page .tc-logo a'
                        ),
                        'desc' => esc_html__('Set font color and hover color for logo text.', 'celebrate'),
                        'regular' => true, // Disable Regular Color
                        'hover' => true, // Disable Hover Color
                        'active' => false, // Disable Active Color
                        'visited' => false, // Enable Visited Color
                        'default' => array(
                            'regular' => '',
                            'hover' => ''
                        )
                    ), // logo ends
					
					array(
                        'id' => 'celebrate_menu_typography_field_onepage',
                        'type' => 'info',
                        'desc' => esc_html__('One Page Menu Style - Typography', 'celebrate')
                    ),
                    array(
                        'id' => 'celebrate_menu_typography_onepage',
                        'type' => 'typography',
                        'title' => esc_html__('Menu link', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => true, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                            '#header-one-page .sf-menu a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-style' => '700',
                            'font-family' => 'Montserrat',
                            'font-size' => '17px'
                        )
                    ),
					array(
                        'id' => 'celebrate_menu_typography_color_onepage',
                        'type' => 'color',
                        'title' => esc_html__('Menu Link Color ', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_menu_typography_scroll_onepage',
                        'type' => 'color',
                        'output' => array(
                            '#header-one-page .sf-menu a'
                        ),
                        'title' => esc_html__('Menu Link Color On Scroll', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_menu_typography_hover_color_onepage',
                        'type' => 'color',
                        'output' => array(
                            '#header-one-page .sf-menu li a:hover'
                        ),
                        'title' => esc_html__('Menu Link Hover Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_menu_link_active_onepage',
                        'type' => 'color',
                        'output' => array(
                            '#header-one-page .sf-menu li.current-menu-item a',
                            '#header-one-page .sf-menu li.current-menu-ancestor > a'
                        ),
                        'title' => esc_html__('Menu Link Active Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_menu_dropdown_typography_onepage',
                        'type' => 'typography',
                        'title' => esc_html__('Dropdown Link', 'celebrate'),
                        'google' => true, // Disable google fonts. Won't work if you haven't defined your google api key
                        'font-backup' => false, // Select a backup non-google font in addition to a google font
                        'font-style' => true, // Includes font-style and weight. Can use font-style or font-weight to declare
                        'subsets' => true, // Only appears if google is true and subsets not set to false
                        'font-size' => true,
                        'line-height' => false,
                        'text-align' => false,
                        'color' => false,
                        'preview' => false, // Disable the previewer
                        'all_styles' => true, // Enable all Google Font style/weight variations to be added to the page
                        'output' => array(
                             '#header-one-page .sf-menu li li a, #header-one-page .sf-menu .sub-menu li.current-menu-item li a, #header-one-page .sf-menu li.current-menu-item li a'
                        ),
                        'units' => 'px', // Defaults to px
                        'subtitle' => '',
                        'default' => array(
                            'font-style' => '400',
                            'font-family' => 'Opan Sans',
                            'font-size' => '15px'
                        )
                    ),
					array(
                        'id' => 'celebrate_dropdown_link_color_onepage',
                        'type' => 'color',
                        'output' => array(
                            '#header-one-page .sf-menu li li a, #header-one-page .sf-menu .sub-menu li.current-menu-item li a, #header-one-page .sf-menu li.current-menu-item li a, #header-one-page .sf-menu ul li.current-menu-item a, #header-one-page .sf-menu li li.current-menu-ancestor > a:hover, #header-one-page .sf-menu li.megamenu li.current-menu-ancestor > a, #header-one-page .sf-menu li.megamenu li:hover > a'
                        ),
                        'title' => esc_html__('Dropdown Link Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
                    array(
                        'id' => 'celebrate_dropdown_link_active_onepage',
                        'type' => 'color',
                        'output' => array(
                            '#header-one-page .sf-menu .sub-menu li.current-menu-item li a:hover, #header-one-page .sf-menu .sub-menu li.current-menu-item a, #header-one-page .sf-menu li li.current-menu-ancestor > a, #header-one-page .sf-menu ul li a:hover, #header-one-page .sf-menu ul li:hover > a, #header-one-page .sf-menu > li.megamenu > ul > li > a:hover, #header-one-page .sf-menu li.megamenu li li:hover > a'
                        ),
                        'title' => esc_html__('Dropdown Link - Hover / Active - Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_dropdown_background_onepage',
                        'type' => 'color',
                        'title' => esc_html__('Dropdown Background Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),
					array(
                        'id' => 'celebrate_menu_border_onepage',
                        'type' => 'color',
                        'title' => esc_html__('Border Color', 'celebrate'),
                        'transparent' => false,
                        'default' => '',
                        'validate' => 'color'
                    ),// menu ends
                )
            ); // one Page
			// Changelog
            $this->sections[] = array(
                'title' => esc_html__('Changelog', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-idea-alt',
                'fields' => array(
					   array(
                        'id' => 'celebrate_changelog_field',
                        'type' => 'info',
                        'desc' =>  wp_kses( __('Please check this for detailed changelog: <a href="http://knowledgebase.tanshcreative.com/celebrate-changelog/" target="_blank">Changelog</a>', 'celebrate'), array( 'a' => array( 'href' => array(), 'title' => array(), 'target' => array() ), ) ),
                    ),
                )
            );
            // Custom CSS
            $this->sections[] = array(
                'title' => esc_html__('Custom CSS', 'celebrate'),
                'desc' => '',
                'icon' => 'el-icon-css',
                'fields' => array(
                    array(
                        'id' => 'celebrate_custom_css',
                        'type' => 'ace_editor',
                        'title' => esc_html__('CSS Code', 'celebrate'),
                        'subtitle' => esc_html__("Paste your CSS Code here. ** Always keep backup, in case of accidental 'Reset'. Consider using child theme for easy theme update. Refer help document for more info about where/how to edit styles.", 'celebrate'),
                        'mode' => 'css',
                        'theme' => 'chrome', // monokai
                        'desc' => '',
                        'default' => ""
                    )
                )
            );
			
			// Divider        
            $this->sections[] = array(
                'type' => 'divide'
            );
			
            // Import - Export
            $this->sections[] = array(
                'title' => esc_html__('Import / Export', 'celebrate'),
                'icon' => 'el-icon-refresh',
                'fields' => array(
					array(
                        'id' => 'celebrate_import_field',
                        'type' => 'info',
						'style' => 'success',
                        'notice' => true,
                         'desc' =>  wp_kses( __('If you have finished demo data import, you may deactivate demo import plugin.<br>OFF this to disable its notification.', 'celebrate'), array( 'br' => array(), ) ),
                    ),
					array(
                        'id' => 'celebrate_demo_plugin_disble',
                        'type' => 'switch',
                        'title' => esc_html__('Demo Import Plugin Notification On Dashboard', 'celebrate'),
                        'subtitle' => '',
                        'default' => true,
                    ),
					array(
                        'id' => 'celebrate_import_field',
                        'type' => 'info',
						'style' => 'success',
                        'notice' => true,
                         'desc' =>  wp_kses( __('Below is not a site data - demo pages / posts ( XML ) import field. <br> This is options panel data import field. Not generally required if you are importing demo data XML.<br><br>If you are looking for theme demo data check here: Appearance > Import Theme Demo Data.  <br><br> Please refer help document for details.', 'celebrate'), array( 'br' => array(), ) ),
                    ),
                    array(
                        'id' => 'opt-import-export',
                        'type' => 'import_export',
                        'title' => 'Redux Options - Import Export',
                        'subtitle' => 'Save and restore your Redux options',
                        'full_width' => false
                    )
                )
            );
			
            // Theme Information
            $this->sections[] = array(
                'icon' => 'dashicons dashicons-warning',
                'title' => esc_html__('Theme Information', 'celebrate'),
                'desc' => '',
                'fields' => array(
                    array(
                        'id' => 'opt-raw-info',
                        'type' => 'raw',
                        'content' => $item_info
                    )
                )
            );
			
			// Plugins Misc
            $this->sections[] = array(
                'icon' => 'dashicons dashicons-warning',
                'title' => esc_html__('Plugins Misc', 'celebrate'),
                'desc' => '',
                'fields' => array(
                     array(
                        'id' => 'celebrate_vc_extras',
                        'type' => 'switch',
                        'title' => esc_html__('Disable Visual Composer Extra Elements', 'celebrate'),
                        'subtitle' => '',
						'desc' =>  wp_kses( __('<br>Theme does not modify plugin itself. It is provided as it is. <br><br>Theme has some additions related to elements / params and extra elements disabled.<br>You can enable other extra elements provided by visual composer here.<br><br><strong>If need to enable: Go for : OFF</strong><br><br>Plugin itself has many elements. Theme does not support ( provides customization for ) all elements provided by visual composer.<br><br> <strong>By support, it does not mean that those elements do not work or cannot be used.</strong> Yes, those can be used. Also, those elements should work as provided by plugin.<br><br>Difference is that, styles for these elements are provided by plugin by default and not customized for theme. You can use if those go with your need, at your choice. Please note that no support from theme author will be provided for customization of plugin elements.<br><br> <strong>If you have license of plugin purchased on your own,</strong> you can even get support from plugin author in case any doubts related to these or other plugin elements.<br><br> Please note that, on Themeforest, when you get any paid plugin at no extra cost, included with theme, you are purchasing a theme and not a plugin. To get support from plugin author directly and automatic updates at your own, it needs to purchase plugin separately. This is purely optional. <br><br> Under both cases : "self purchased" or "included with theme", plugin will work same. <br> Where the difference act is : Support from plugin author and direct auto updates.', 'celebrate'), array( 'br' => array(), 'strong' => array(), ) ),
                        'default' => true,
                    ),
                )
            );

        }
        public function setHelpTabs()
        {
            // Custom page help tabs, displayed using the help API. Tabs are shown in order of definition.
            $this->args['help_tabs'][]  = array(
                'id' => 'redux-help-tab-1',
                'title' => esc_html__('Help Document', 'celebrate'),
                'content' =>  wp_kses( __('Please go through help document for more info. It is included in main zip file you have downloaded. <br><br>Make sure to select option "All Files and Documentation" while downloading.', 'celebrate'), array( 'br' => array(), ) ),
            );
            // Set the help sidebar
            $this->args['help_sidebar'] = '';
        }
        /**
        All the possible arguments for Redux.
        For full documentation on arguments, please refer to: https://github.com/ReduxFramework/ReduxFramework/wiki/Arguments
        * */
        public function setArguments()
        {
            $theme      = wp_get_theme(); // For use with some settings. Not necessary.
            $this->args = array(
            	'opt_name'                  => 'celebrate_options',
				// Must be defined by theme/plugin
				'google_api_key'            => 'AIzaSyCFxtSiTN0WS0Ao9ZekIOxFuNt_avlm4CA',
				// Must be defined to update the google fonts cache for the typography module
				'display_name' => $theme->get('Name'), // Name that appears at the top of your panel
                'display_version' => $theme->get('Version'), // Version that appears at the top of your panel
				'google_update_weekly'      => false,
				// Set to keep your google fonts updated weekly
				'last_tab'                  => '',
				// force a specific tab to always show on reload
				'menu_icon'                 => '',
				// menu icon
				'menu_title' 				=> esc_html__('Theme Options', 'celebrate'),
				'page_title' 				=> esc_html__('Theme Options', 'celebrate'),
				'page_slug'                 => '_options',
				'page_permissions'          => 'manage_options',
				'menu_type'                 => 'menu',
				// ('menu'|'submenu')
				'page_parent'               => 'themes.php',
				// requires menu_type = 'submenu
				'page_priority'             => null,
				'allow_sub_menu'            => true,
				// allow submenus to be added if menu_type == menu
				'save_defaults'             => true,
				// Save defaults to the DB on it if empty
				'footer_credit'             => false,
				'async_typography'          => false,
				'disable_google_fonts_link' => false,
				'class'                     => '',
				// Class that gets appended to all redux-containers
				'admin_bar'                 => true,
				'admin_bar_priority'        => 999,
				// Show the panel pages on the admin bar
				'admin_bar_icon'            => '',
				// admin bar icon
				'help_tabs'                 => array(),
				'help_sidebar'              => '',
				'database'                  => '',
				// possible: options, theme_mods, theme_mods_expanded, transient, network
				'customizer'                => true,
				// setting to true forces get_theme_mod_expanded
				'global_variable'           => '',
				// Changes global variable from $GLOBALS['YOUR_OPT_NAME'] to whatever you set here. false disables the global variable
				'output'                    => true,
				// Dynamically generate CSS
				'compiler'                  => true,
				// Initiate the compiler hook
				'output_tag'                => true,
				// Print Output Tag
				'output_location'           => array( 'frontend' ),
				// Where  the dynamic CSS will be added. Can be any combination from: 'frontend', 'login', 'admin'
				'transient_time'            => '',
				'default_show'              => false,
				// If true, it shows the default value
				'default_mark'              => '',
				// What to print by the field's title if the value shown is default
				'update_notice'             => false,
				// Recieve an update notice of new commits when in dev mode
				'disable_save_warn'         => false,
				// Disable the save warn
				'open_expanded'             => false,
				'hide_expand'               => false,
				// Start the panel fully expanded to start with
				'network_admin'             => true,
				// Enable network admin when using network database mode
				'network_sites'             => true,
				// Enable sites as well as admin when using network database mode
				'hide_reset'                => false,
				'hide_save'                 => false,
				'hints'                     => array(
					'icon'          => 'el el-question-sign',
					'icon_position' => 'right',
					'icon_color'    => 'lightgray',
					'icon_size'     => 'normal',
					'tip_style'     => array(
						'color'   => 'light',
						'shadow'  => true,
						'rounded' => false,
						'style'   => '',
					),
					'tip_position'  => array(
						'my' => 'top_left',
						'at' => 'bottom_right',
					),
					'tip_effect'    => array(
						'show' => array(
							'effect'   => 'slide',
							'duration' => '500',
							'event'    => 'mouseover',
						),
						'hide' => array(
							'effect'   => 'fade',
							'duration' => '500',
							'event'    => 'click mouseleave',
						),
					),
				),
				'show_import_export'        => true,
				'show_options_object'       => false,
				'dev_mode'                  => false,
				'templates_path'            => '',
				// Path to the templates file for various Redux elements
				'ajax_save'                 => true,
				// Disable the use of ajax saving for the panel
				'use_cdn'                   => true,
				'cdn_check_time'            => 1440,
				'options_api'               => true,
            );
            // SOCIAL ICONS -> Setup custom links in the footer for quick links in your panel footer icons.
            /*$this->args['share_icons'][] = array(
            
            'url'   => 'https://github.com/ReduxFramework/ReduxFramework',
            
            'title' => 'Visit us on GitHub',
            
            'icon'  => 'el-icon-github'
            
            //'img'   => '', // You can use icon OR img. IMG needs to be a full URL.
            
            );
            
            $this->args['share_icons'][] = array(
            
            'url'   => 'https://www.facebook.com/pages/Redux-Framework/243141545850368',
            
            'title' => 'Like us on Facebook',
            
            'icon'  => 'el-icon-facebook'
            
            );
            
            $this->args['share_icons'][] = array(
            
            'url'   => 'http://twitter.com/reduxframework',
            
            'title' => 'Follow us on Twitter',
            
            'icon'  => 'el-icon-twitter'
            
            );
            
            $this->args['share_icons'][] = array(
            
            'url'   => 'http://www.linkedin.com/company/redux-framework',
            
            'title' => 'Find us on LinkedIn',
            
            'icon'  => 'el-icon-linkedin'
            
            );*/
            // Panel Intro text -> before the form
            if (!isset($this->args['global_variable']) || $this->args['global_variable'] !== false) {
                if (!empty($this->args['global_variable'])) {
                    $v = $this->args['global_variable'];
                } else {
                    $v = str_replace('-', '_', $this->args['opt_name']);
                }
                $this->args['intro_text'] = sprintf(__('', 'celebrate'), $v);
            } else {
                $this->args['intro_text'] = '';
            }
            // Add content after the form.
            $this->args['footer_text'] = '';
        }
    }
    global $reduxConfig;
    $reduxConfig = new Redux_Framework_celebrate_config();
}
/**
Custom function for the callback referenced above
*/
if (!function_exists('redux_my_custom_field')):
    function redux_my_custom_field($field, $value)
    {
        print_r($field);
        echo '<br/>';
        print_r($value);
    }
endif;
/**
Custom function for the callback validation referenced above
* */
if (!function_exists('redux_validate_callback_function')):
    function redux_validate_callback_function($field, $value, $existing_value)
    {
        $error           = false;
        $value           = 'just testing';
        /*
        do your validation
        if(something) {
        $value = $value;
        } elseif(something else) {
        $error = true;
        $value = $existing_value;
        $field['msg'] = 'your custom error message';
        }
        */
        $return['value'] = $value;
        if ($error == true) {
            $return['error'] = $field;
        }
        return $return;
    }
endif;