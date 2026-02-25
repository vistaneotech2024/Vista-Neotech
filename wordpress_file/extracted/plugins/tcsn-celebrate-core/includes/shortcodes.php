<?php
/*------------------------------------------------------------
 * Remove extra P tags for custom shortcodes via Text Editor
 * @param $content
 * @return string
 *------------------------------------------------------------*/
add_filter("the_content", "tc_celebrate_shortcode_format");
if ( ! function_exists( 'tc_celebrate_shortcode_format' ) ) {
	function tc_celebrate_shortcode_format($content) {
		// array of custom shortcodes requiring the fix
		$block = join("|",array( "tc_text_style","tc_dropcap","tc_highlight","tc_tooltip","tc_spacer","tc_spacer_wide","tc_align","tc_icon","tc_list_item","tc_list_pricing" ) );
		// opening tag
		$rep = preg_replace("/(<p>)?\[($block)(\s[^\]]+)?\](<\/p>|<br \/>)?/","[$2$3]",$content);
		// closing tag
		$rep = preg_replace("/(<p>)?\[\/($block)](<\/p>|<br \/>)?/","[/$2]",$rep);
		return $rep;
	}
}

/*
 * @param $content
 * @param bool $autop
 * @return string
 */
if ( ! function_exists( 'tc_celebrate_remove_wpautop' ) ) {
	function tc_celebrate_remove_wpautop( $content, $autop = false ) {
		if ( $autop ) { // Possible to use !preg_match('('.WPBMap::getTagsRegexp().')', $content)
			$content = wpautop( preg_replace( '/<\/?p\>/', "\n", $content ) . "\n" );
		}
		return do_shortcode( shortcode_unautop( $content ) );
	}
}
/*------------------------------------------------------------
 * Enqueue icon fonts
 *------------------------------------------------------------*/
function tcsn_vc_icon_element_fonts_enqueue( $icon_name ) {
	switch ( $icon_name ) {
		case 'fontawesome':
			wp_enqueue_style( 'font-awesome' );
			break;
		default:
			do_action( 'vc_enqueue_font_icon_element', $icon_name ); // hook to custom do enqueue style
	}
}

function tcsn_vc_btn_icon_element_fonts_enqueue( $btn_icon_name ) {
	switch ( $btn_icon_name ) {
		case 'fontawesome':
			wp_enqueue_style( 'font-awesome' );
			break;
		default:
			do_action( 'vc_enqueue_font_icon_element', $btn_icon_name ); // hook to custom do enqueue style
	}
}
/*------------------------------------------------------------
 * Pricing List
 * @since 1.0
 *------------------------------------------------------------*/
// li
if ( ! function_exists( 'tc_celebrate_list_item_sc' ) ) {
	function tc_celebrate_list_item_sc( $atts, $content = null ) {
		return '<li>' . do_shortcode( $content ) . '</li>';
	}
}
add_shortcode( 'tc_list_item', 'tc_celebrate_list_item_sc' );

// Pricing list
if ( ! function_exists( 'tc_celebrate_pricing_list_sc' ) ) {
	function tc_celebrate_pricing_list_sc( $atts, $content = null ) {
	   return '<ul class="tc-list-pricing">' . do_shortcode( $content ) . '</ul>';
	}
}
add_shortcode( 'tc_list_pricing', 'tc_celebrate_pricing_list_sc' );

/*------------------------------------------------------------
 * Text style
 * @since 1.0
 *
// [tc_text_style size="" line_height="" color="" font_weight="" letter_spacing="" align="left/center/right"]Content here[/tc_text_style] 
 *
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_text_style_sc' ) ) {
	function tc_celebrate_text_style_sc( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'size' 				=> '', 
			'line_height'		=> '', 
			'color' 			=> '', 
			'font_weight'		=> '', 
			'letter_spacing'	=> '', 
			'align'				=> '', 
		), $atts ) );
		
		
		// add text style
		$add_style = array();
		if ( $size ) {
			$add_style[] = ' font-size: ' . $size . ';';
		} 
		if ( $line_height ) {
			$add_style[] = ' line-height: ' . $line_height . ';';
		} 
		if ( $color ) {
			$add_style[] = ' color: ' . $color . ';';
		} 
		if ( $font_weight ) {
			$add_style[] = ' font-weight: ' . $font_weight . ';';
		} 
		if ( $letter_spacing ) {
			$add_style[] = ' letter-spacing: ' . $letter_spacing . ';';
		} 
		if ( $align ) {
			$add_style[] = ' text-align: ' . $align . ';';
		} 
		$add_style = implode('', $add_style);
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr($add_style) . '"';
		}
		return '<div class="tc-text-style"' . $add_style . '>' . do_shortcode( $content ) . '</div>';
	}
}
add_shortcode( 'tc_text_style', 'tc_celebrate_text_style_sc' );

/*------------------------------------------------------------
 * Dropcap
 * @since 1.0
 *
// [tc_dropcap style="dropcap-default/dropcap-circle/dropcap-square" bg_color="" color="" border_color=""]T[/tc_dropcap]
 *
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_dropcap_sc' ) ) {
	function tc_celebrate_dropcap_sc( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'bg_color'		=> '', 
			'color'			=> '', 
			'border_color'	=> '', 
			'style' 		=> '', // dropcap-default/dropcap-circle/dropcap-square
		), $atts ) );
		
		// add text style
		$add_style = array();
		if ( $bg_color ) {
			$add_style[] = ' background-color: ' . $bg_color . ';';
		} 
		if ( $color ) {
			$add_style[] = ' color: ' . $color . ';';
		} 
		if ( $border_color ) {
			$add_style[] = ' border-color: ' . $border_color . ';';
		} 
		$add_style = implode('', $add_style);
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr($add_style) . '"';
		}

		return '<span class="tc-dropcap tc-' . $style . '"' . $add_style . '>' . do_shortcode( $content ) . '</span>';
	}  
}
add_shortcode( 'tc_dropcap', 'tc_celebrate_dropcap_sc' ); 

/*------------------------------------------------------------
 * Highlight
 * @since 1.0
 *
// [tc_highlight bgcolor="" color="" font_size="" font_weight="" line_height=""]Content here[/tc_highlight] 
 *
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_text_highlight_sc' ) ) {
	function tc_celebrate_text_highlight_sc( $atts, $content = null ) {
	extract ( shortcode_atts( array(
		'bgcolor' 		=> '', 
		'color'   		=> '', 
		'font_size'		=> '', 
		'font_weight'	=> '', 
		'line_height'	=> '', 
	), $atts ) );
	
	$add_style = array();
	if( $bgcolor != ''  ) {
		$add_style[] = 'background-color: '. $bgcolor .';';
	} 
	if( $color != ''  ) {
		$add_style[] = 'color: '. $color .';';
	} 
	if( $font_size != ''  ) {
		$add_style[] = 'font-size: '. $font_size .';';
	} 
	if( $font_weight != ''  ) {
		$add_style[] = 'font-weight: '. $font_weight .';';
	} 
	if( $line_height != ''  ) {
		$add_style[] = 'line-height: '. $line_height .';';
	} 
	$add_style = implode('', $add_style);
	
	if ( $add_style ) {
		$add_style = wp_kses( $add_style, array() );
		$add_style = ' style="' . esc_attr($add_style) . '" ';
	}
	return '<span class="tc-highlight"' . $add_style . '>' . do_shortcode( $content ) . '</span>';
	}
}
add_shortcode( 'tc_highlight', 'tc_celebrate_text_highlight_sc' );	

/*------------------------------------------------------------
 * Superscript Highlight
 * @since 1.0
 *
// [tc_sup_highlight bgcolor="" color=""]Content here[/tc_sup_highlight] 
 *
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_sup_highlight_sc' ) ) {
	function tc_celebrate_sup_highlight_sc( $atts, $content = null ) {
	extract ( shortcode_atts( array(
		'bgcolor' 		=> '', 
		'color'   		=> '', 
	), $atts ) );
	
	$add_style = array();
	if( $bgcolor != ''  ) {
		$add_style[] = 'background-color: '. $bgcolor .';';
	} 
	if( $color != ''  ) {
		$add_style[] = 'color: '. $color .';';
	} 
	$add_style = implode('', $add_style);
	
	if ( $add_style ) {
		$add_style = wp_kses( $add_style, array() );
		$add_style = ' style="' . esc_attr($add_style) . '" ';
	}
	return '<sup class="tc-sup-highlight"' . $add_style . '>' . do_shortcode( $content ) . '</sup>';
	}
}
add_shortcode( 'tc_sup_highlight', 'tc_celebrate_sup_highlight_sc' );	

/*------------------------------------------------------------
 * Tooltip
 * @since 1.0
 *
// [tc_tooltip url="" title="Content inside tooltip" placement="top/bottom/left/right"]Link text[/tc_tooltip]
 *
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_tooltip_sc' ) ) {
	function tc_celebrate_tooltip_sc( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'url'       => '', 
			'title'     => '', 
			'placement'	=> 'top', // top, bottom, left, right
		), $atts ) );
		
		if( $url != ''  ) {
			$return_url = 'href="' . esc_url( $url ) . '" ';
		}
		else{
			$return_url = '';
		}
		return '<a ' . $return_url . 'title="' . esc_attr( $title ) . '" data-placement="' . esc_attr( $placement ) . '" data-toggle="tooltip">' . do_shortcode( $content ) . '</a>';
	}
}
add_shortcode( 'tc_tooltip', 'tc_celebrate_tooltip_sc' );

/*------------------------------------------------------------
 * Vertical Spacer / Gap
 * @since 1.0
 * 
// [tc_spacer height="in px"]
 * 
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_spacer_sc' ) ) {
	function tc_celebrate_spacer_sc( $atts, $content ) {
		extract ( shortcode_atts( array(
			'height'	=> '',
		), $atts ) );
		return '<span class="tc-spacer" style="height: ' . esc_attr( $height ) . ';"></span>';
	}
}
add_shortcode( 'tc_spacer', 'tc_celebrate_spacer_sc' );
	
/*------------------------------------------------------------
 * Horizontal Spacer / Gap
 * @since 1.0
 * 
// [tc_spacer_wide width="in px"]
 * 
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_wide_spacer_sc' ) ) {
	function tc_celebrate_wide_spacer_sc( $atts, $content ) {
		extract ( shortcode_atts( array(
			'width'	=> '',
		), $atts ) );
		return '<span class="tc-spacer-wide" style="width: ' . esc_attr( $width ) . ';"></span>';
	}
}
add_shortcode( 'tc_spacer_wide', 'tc_celebrate_wide_spacer_sc' );

/*------------------------------------------------------------
 * Icons
 * @since 1.0
 *
// [tc_icon icon_name="" color="" size=""]
 *
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_icon_sc' ) ) {
	function tc_celebrate_icon_sc( $atts, $content ) {
		extract( shortcode_atts( array(
			'icon_name'	=> '', 
			'color' 	=> '', 
			'size' 		=> '',
		), $atts ) );
		
		$add_style = array();
		if( $color != ''  ) {
			$add_style[] = 'color: '. $color .';';
		} 
		if( $size != ''  ) {
			$add_style[] = 'font-size: '. $size .';';
		} 
		$add_style = implode('', $add_style);
		
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr($add_style) . '" ';
		}
		return '<i class="icon-' . $icon_name . '"' . $add_style . '></i>';
	}
}
add_shortcode( 'tc_icon', 'tc_celebrate_icon_sc' );

/*------------------------------------------------------------
 * Button
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_button_sc' ) ) {
	function tc_celebrate_button_sc( $atts, $content=null ) {
		extract ( shortcode_atts( array(
			'btn_type' 			=> 'btn_default',
			'text'				=> 'Link', 
			'image' 			=> '',
			'icon_name'   		=> 'no-icon',
			'icon_fontawesome'  => 'fa fa-adjust',
			'icon_position'   	=> 'icon-left', 
			'style'  			=> 'classic', 
			'shape'  			=> 'square',
			'size'  			=> 'medium',
			'color'  			=> 'default',
			'target' 			=> '', 
			'return_target' 	=> '', 
			'url'   			=> '',
			'align'   			=> '',
			'animation'			=> '', 
			'alt'				=> '', 			
		), $atts ) );
		
		// style
		if( $style ) {
			$style = ' themebtn-' . esc_attr( $style ) . '';
		} 
		
		// size
		if( $size ) {
			$size = ' themebtn-' . esc_attr( $size ) . '';
		} 
		
		// shape
		if( $shape ) {
			$shape = ' themebtn-' . esc_attr( $shape ) . '';
		} 
		
		// color
		if( $color ) {
			$color = ' themebtn-' . esc_attr( $color ) . '';
		} 
		
		// icon name
		if( $icon_name == 'fontawesome' ) {
			$return_icon = '<span class="themebtn-icon"><i class="' . esc_attr( $icon_fontawesome ) . '"></i></span>';
		} else {
			$return_icon = '';
		}
		tcsn_vc_icon_element_fonts_enqueue( $icon_name );	
		
		// icon name
		if( $text ) {
			$return_btn_text = '<span class="themebtn-label">' . esc_attr( $text ) . '</span>';
		} else {
			$return_btn_text = '';
		}
		
		// icon_position
		if( $icon_name == 'fontawesome' ) {
			$icon_position = ' themebtn-' . esc_attr( $icon_position ) . '';
		} else { 
			$icon_position = ''; 
		}
		
		if( $text == '' &&  $icon_name ) {
			$icon_only = ' themebtn-icon-only';
		} else { 
			$icon_only = ''; 
		}
		 
		// url
		if( $url != ''  ) {
			$return_url = ' href="' . esc_url( $url ) . '"';
		} else {
			$return_url = '';
		}
	
		// target
		if( $target == 'blank' ){
			$return_target = ' target="_blank"';
		} elseif( $target == 'self' ){
			$return_target = ' target="_self"';
		} else {
			$return_target = '';
		}
		
		// image
		if( $btn_type == 'btn_img' ) {
			$img_url  = wp_get_attachment_url($image);
			$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
			$image = $img_url;
			return '<a ' . $return_target . ' ' . $return_url . ' class="themebtn-img"><img src="'. $image. '" alt="' . esc_attr( $alt ) . '"></a>';
		} else {
		
		// align
		if( $align ) {
			$aligh_start = '<div class="text-' . $align . '">';
			$aligh_end   = '</div>';
		} else {
			$aligh_start = '';
			$aligh_end   = '';
		}
		
		return '' . $aligh_start . '<a class="themebtn' . esc_attr( $icon_position ) . esc_attr( $style ) . esc_attr( $shape ) . esc_attr( $size ) . esc_attr( $color ) .  esc_attr( $icon_only ) .' ' . esc_attr( $animation ) . '"' . $return_target . ' ' . $return_url . '>'. $return_icon . $return_btn_text .'</a>' . $aligh_end . '';
		} 
	}
}
add_shortcode( 'tc_button', 'tc_celebrate_button_sc' );

/*------------------------------------------------------------
 * List with icon
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_icon_list_sc' ) ) {
	function tc_celebrate_icon_list_sc( $atts, $content = null ) {
		extract( shortcode_atts( array(
		'icon_name'   		=> 'no-icon',
		'icon_fontawesome'  => 'fa fa-adjust',
		'color'        		=> '',
		'size'         		=> '',
		'icon_color'   		=> '',
		'list_border' 		=> '', 
		'border_color'   	=> '',
		'list_content' 		=> '', 
		'animation'			=> '', 
		), $atts ) );
		
		// style
		$add_style = array();
		if( $color != ''  ) {
			$add_style[] = 'color: '. $color .';';
		} 
		if( $size != ''  ) {
			$add_style[] = 'font-size: '. $size .';';
		} 
		if( $border_color != ''  ) {
			$add_style[] = 'border-color: '. $border_color .';';
		} 
		$add_style = implode('', $add_style);
		
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr($add_style) . '"';
		}
		// icon style
		$add_style_icon = array();
		if( $icon_color != ''  ) {
			$add_style_icon[] = 'color: '. $icon_color .';';
		} 
		if( $size != ''  ) {
			$add_style_icon[] = 'font-size: '. $size .';';
		} 
		$add_style_icon = implode('', $add_style_icon);
		
		if ( $add_style_icon ) {
			$add_style_icon = wp_kses( $add_style_icon, array() );
			$add_style_icon = ' style="' . esc_attr($add_style_icon) . '"';
		}
		// border
		if($list_border == 'yes') {
			$return_list_border = ' tc-list-border';
		} else {
			$return_list_border = '';
		}
		
		// icon_name
		if( $icon_name == 'fontawesome' ) {
			$return_icon = '<i class="' . esc_attr( $icon_fontawesome ) . '"' . $add_style_icon . '></i>';
		} else {
			$return_icon = '';
		}
		tcsn_vc_icon_element_fonts_enqueue( $icon_name );	
		
		return '<p class="tc-list-icon ' . $return_list_border . ' ' . esc_attr( $animation ) . '"' . $add_style . '>' . $return_icon . '' . $list_content . '</p>';
	}
}
add_shortcode( 'tc_list_icon', 'tc_celebrate_icon_list_sc' );	

/*------------------------------------------------------------
 * Selected Lists
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_selected_list' ) ) {
	function tc_celebrate_selected_list( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'style'         	=> 'checkmark', 
			'return_style'      => '', 
			'type'         		=> '', 
			'return_type'      	=> '', 
			'size'         		=> '',
			'return_size'       => '',
			'color'         	=> '',
			'align'  			=> '',
			'return_align'		=> '',
			'animation'			=> '', 
		), $atts ) );
		$content = tc_celebrate_remove_wpautop($content, true);
		
		// size
		if( $size == 'default' ) {
			$return_size = '';
		} elseif ( $size == 'medium' ) {
			$return_size = ' tc-list-medium ';
		} else { 
			$return_size = ''; 
		}

		// style
		$add_style = array();
		if( $color != ''  ) {
			$add_style[] = 'color: '. $color .';';
		} 
		$add_style = implode('', $add_style);
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr($add_style) . '"';
		}
		// align
		if( $align == 'right' ) {
			$return_align = ' tc-list-right';
		} elseif( $align == 'left' ) {
			$return_align = ' tc-list-left';
		} else {
			$return_align = '';
		}
		// list style
		if( $style == 'checkmark' ) {
			$return_style = 'tc-list-checkmark';
		} elseif( $style == 'inline' ) {
			$return_style = 'tc-list-inline';
		} elseif( $style == 'separator' ) {
			$return_style = 'tc-list-separator';
		} elseif( $style == 'checkmark_circle' ) {
			$return_style = 'tc-list-checkmark-circle';
		} elseif( $style == 'checkmark_square' ) {
			$return_style = 'tc-list-checkmark-square';
		} elseif( $style == 'star' ) {
			$return_style = 'tc-list-star';
		} elseif( $style == 'arrow' ) {
			$return_style = 'tc-list-arrow';
		} elseif( $style == 'arrow-circle' ) {
			$return_style = 'tc-list-arrow-circle';
		} elseif( $style == 'heart' ) {
			$return_style = 'tc-list-heart';
		} elseif( $style == 'circle' ) {
			$return_style = 'tc-list-circle';
		} else {
			$return_style = '';
		}
		
		return '<div class="' . esc_attr( $return_size ) . '' . esc_attr( $return_style ) . '' .esc_attr(  $return_align ) . ' 
' . esc_attr( $animation ) . '"' . $add_style . '>' . $content . '</div>';
	}
}
add_shortcode( 'tc_selected_list', 'tc_celebrate_selected_list' );

/*------------------------------------------------------------
 * Ordered List
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_ordered_list' ) ) {
	function tc_celebrate_ordered_list( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'color'         	=> '',
			'animation'			=> '', 
		), $atts ) );
		$content = tc_celebrate_remove_wpautop($content, true);
		return '<div class="tc-ordered-list tc-color-' . $color . ' 
' . esc_attr( $animation ) . '">' . $content . '</div>';
	}
}
add_shortcode( 'tc_ordered_list', 'tc_celebrate_ordered_list' );

/*------------------------------------------------------------
 * Blockquote
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_blockquote_sc' ) ) {
	function tc_celebrate_blockquote_sc( $atts,  $content = null ) {
		extract( shortcode_atts( array(
			'source'			=> '', 
			'return_source'		=> '',
			'style' 			=> 'custom_icon',
			'return_style' 		=> '',
			'color' 			=> '',
			'font_size'			=> '', 
			'animation'			=> '', 
		), $atts ) );
		
		$content = tc_celebrate_remove_wpautop($content, true);
		
		// source
		if( $source != ''  ) {
			$return_source = '<span class="quote-source">' . esc_attr( $source ) . '</span>';
		}
		else{
			$return_source = '';
		}
		
		// add style
		$add_style = array();
		if( $color != ''  ) {
			$add_style[] = 'color: '. $color .';';
		} 
		if( $font_size != '' ) {
			$add_style[] = 'font-size: '. $font_size .';';
		} 
		$add_style = implode('', $add_style);
		
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr($add_style) . '" ';
		}

		// style
		$clearfix = '';
		if( $style == 'custom_icon'  ) {
			$return_style	= 'tc-blockquote tc-blockquote-icon';
			$clearfix 		= '';
		} elseif( $style == 'right_border'  ) {
			$return_style	= 'pull-right';
			$clearfix 		= '<div class="clearfix"></div>';
		} else { 
			$return_style	= '';
			$clearfix 		= '';
		} 

		return '<blockquote class="' . $return_style . ' ' . esc_attr( $animation ) . '" ' . $add_style . '>' . $content . '' . $return_source . '</blockquote>' . $clearfix . '';
	}
}
add_shortcode( 'tc_blockquote', 'tc_celebrate_blockquote_sc' );
		
/*------------------------------------------------------------
 * Icon Counter
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_icon_counter' ) ) {
	function tc_celebrate_icon_counter( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			'counting_style'  		=> 'tc-counter',	
			'style'  				=> 'tc-counter-top',	
			'heading'  				=> '',	
			'return_heading'  		=> '',	
			'subtext'  				=> '',	
			'return_subtext'  		=> '',	
			'image_type' 			=> 'type_icon',
			'type_img' 				=> '',
			'type_icon' 			=> '',
			'icon_name'   			=> 'no-icon',
			'icon_fontawesome'  	=> 'fa fa-adjust',
			'image' 				=> '',
			'image_width' 			=> '',
			'return_image_width' 	=> '',
			'image_height' 			=> '',
			'return_image_height' 	=> '',
			'return_image' 			=> '',
			'icon_color'  			=> '',
			'icon_bg'  				=> '',			
			'icon_bgcolor'  		=> '',
			'heading_color'  		=> '',
			'animation'				=> '', 
			), $atts ) );
	
			$content = tc_celebrate_remove_wpautop($content, true);
			
			// style
			$add_style = array();
			if ( $icon_color !== '' ) {
				$add_style[] = 'color: ' . $icon_color . ';';
			} 
			if ( $icon_bgcolor !== '' ) {
				$add_style[] = 'background-color: ' . $icon_bgcolor . ';';
			}  
			$add_style = implode('', $add_style);
			if ( $add_style ) {
				$add_style = wp_kses( $add_style, array() );
				$add_style = ' style="' . esc_attr($add_style) . '"';
			}
 			
			if( $icon_bg == 'yes' ) {
				$return_icon_bg = ' class="tc-counter-iconbg"';
			} else {
				$return_icon_bg = '';
			}
			// icon
			if( $icon_name == 'fontawesome' ) {
				$return_icon_img = '<span' .$return_icon_bg . '' . $add_style . '><i class="' . esc_attr( $icon_fontawesome ) . '"></i></span>';
			} else {
				$return_icon_img = '';
			}
			tcsn_vc_icon_element_fonts_enqueue( $icon_name );	
					
			// image
			if( $image_type == 'type_img' ){
				$img_url  = wp_get_attachment_url($image);
				$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
				$image = $img_url;
			if ( $image_width != '' ) {
				$return_image_width = ' width="'. esc_attr( $image_width ) .'"';
			}
			if ( $image_height != '' ) {
				$return_image_height = ' height="'. esc_attr( $image_height ) .'"';
			}
			$return_image = '<div class="tc-counter-thumb"><img src="'. $image. '"' . $return_image_width . ''. $return_image_height .' alt="' . esc_attr( $alt ) . '"></div>';
			} elseif ( $image_type == 'type_icon' ) {
			$return_image = '<div class="tc-counter-thumb">' . $return_icon_img . '</div>';
			} else { $return_image = ''; }
			
			// heading style
			$add_heading_style = array();
			if ( $heading_color !== '' ) {
				$add_heading_style[] = 'color: ' . $heading_color . ';';
			}  
			$add_heading_style = implode('', $add_heading_style);
			if ( $add_heading_style ) {
				$add_heading_style = wp_kses( $add_heading_style, array() );
				$add_heading_style = ' style="' . esc_attr($add_heading_style) . '"';
			}

			// heading
			if( $heading  ){
				$return_heading = '<p class="' . $counting_style . ' tc-counter-title"' . $add_heading_style . '>' . $heading . '</p>';
			} else {
				$return_heading = '';
			}  
			
			// subtext
			if( $subtext  ){
				$return_subtext = '<p class="tc-counter-subtitle"' . $add_heading_style . '>' . $subtext . '</p>';
			} else {
				$return_subtext = '';
			} 

			return '<div class="tc-icon-counter wpb_custom_element clearfix ' . $style . ' ' . esc_attr( $animation ) . '">' . $return_image . '<div class="tc-counter-content">' .$return_heading . '' .$return_subtext . '</div></div>';
	}
}
add_shortcode( 'tc_icon_counter', 'tc_celebrate_icon_counter' );

/*------------------------------------------------------------
 * Icon Counter Variation
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_icon_counter_var' ) ) {
	function tc_celebrate_icon_counter_var( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			'counting_style'	=> 'tc-counter',
			'number'  			=> '',	
			'number_color'  	=> '',
			'return_number'  	=> '',	
			'bgcolor'  			=> '',
			'arrow_color'  		=> '',
			'heading'  			=> '',	
			'return_heading'	=> '',	
			'heading_color'  	=> '',
			'animation'			=> '', 
			), $atts ) );
	
			$content = tc_celebrate_remove_wpautop($content, true);
			
			// style
			$add_style = array();
			if ( $number_color !== '' ) {
				$add_style[] = 'color: ' . $number_color . ';';
			} 
			if ( $bgcolor !== '' ) {
				$add_style[] = 'background-color: ' . $bgcolor . ';';
			}  
			$add_style = implode('', $add_style);
			if ( $add_style ) {
				$add_style = wp_kses( $add_style, array() );
				$add_style = ' style="' . esc_attr( $add_style ) . '"';
			}
			
			if ( $bgcolor !== '' ) {
				$arrow_color = ' style="color: ' . esc_attr( $bgcolor ) . '"';
			}  
			
			// heading
			if( $number  ){
				$return_number = '<div class="tc-counter-number"' . $add_style . '><span class="tc-counter-arrow"' . $arrow_color . '></span><div class="' . $counting_style . '">' . $number . '</div></div>';
			} else {
				$return_number = '';
			}  
			// heading style
			$add_heading_style = array();
			if ( $heading_color !== '' ) {
				$add_heading_style[] = 'color: ' . $heading_color . ';';
			}  
			$add_heading_style = implode('', $add_heading_style);
			if ( $add_heading_style ) {
				$add_heading_style = wp_kses( $add_heading_style, array() );
				$add_heading_style = ' style="' . esc_attr($add_heading_style) . '"';
			}

			// heading
			if( $heading  ){
				$return_heading = '<p class="tc-counter-title-var"' . $add_heading_style . '>' . $heading . '</p>';
			} else {
				$return_heading = '';
			}  

			return '<div class="tc-icon-counter-var wpb_custom_element clearfix ' . esc_attr( $animation ) . '">' .$return_number . '' .$return_heading . '</div>';
	}
}
add_shortcode( 'tc_icon_counter_var', 'tc_celebrate_icon_counter_var' );

/*------------------------------------------------------------
 * Single Image with Hover
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_single_image' ) ) {
	function tc_celebrate_single_image( $atts, $content ) { 
		extract( shortcode_atts( array(
			'image'			=> '',
			'size' 			=> 'full',
			'animation'		=> '', 
			'scale'			=> '',
			'hide_zoom'		=> '',
			'return_zoom'	=> '',
			'hide_caption'	=> '',
			), $atts ) );
			
		//on hover image scale
		if( $scale != 'yes' ) {
			$return_scale = ' tc-img-scale';
		} else {
			$return_scale = '';
		}
		
		// image
		$img_url = wp_get_attachment_image_src( $image,  $size );
		$img_url = $img_url[0];
		$img_zoom_url = wp_get_attachment_image_src( $image,  'full' );
		$img_zoom_url = $img_zoom_url[0];
		$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
		$tc_caption = get_post( $image );	
		$caption = trim( strip_tags( $tc_caption->post_excerpt ) ); 
		
		// zoom
		if( $hide_zoom != 'yes' ){
			$return_zoom = '<a class="tc-media-zoom" href="' . $img_zoom_url . '" title="' . esc_attr( $alt ) . '" data-rel="prettyPhoto"></a>';
		} else {
			$return_zoom = '';
		}
		// caption
		if( $hide_caption != 'yes' ){
			$return_caption = '<span class="tc-caption">' . $caption . '</span>';
		} else {
			$return_caption = '';
		}
		
		return '<div class="tc-gallery ' . esc_attr( $animation ) . '"><div class="tc-single-item"><div class="tc-hover-image' . esc_attr( $return_scale ) . '"><img src="' . $img_url . '" alt="' . $alt . '">' . $return_zoom . '</div>' . $return_caption . '</div></div>';
	} 
}
add_shortcode( 'tc_single_image', 'tc_celebrate_single_image' );

/*------------------------------------------------------------
 * Gallery
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_gallery_grid' ) ) {
	function tc_celebrate_gallery_grid($atts, $content) {
		extract( shortcode_atts( array(
		"images"			=> "",
		'hide_zoom'			=> '',
		'return_zoom'		=> '',
		'hide_caption'		=> '',
		'return_caption'	=> '',
		"gap"				=> "compact",
		"return_gap"		=> "",
		'column'			=> 'column_three',
		'return_column'		=> '',
		"size"				=> "full",
		"return_size"		=> "",
		"hard_crop"			=> "",
		"img_width"			=> "",
		"img_height"		=> "",
		"return_width"		=> "",
		"return_height"		=> "",
		"return_img"		=> "",
		"gallery_id"		=> "",
		"return_gallery_id"	=> "",
		'scale'				=> '',
		), $atts ) );
		
		$content = wpb_js_remove_wpautop($content, true);
		
		if( $column == 'column_three' ){
			$return_column = 'tc-portfolio-grid-3col';
		}  elseif( $column == 'column_four' ) {
			$return_column = 'tc-portfolio-grid-4col';
		}  elseif( $column == 'column_two' ) {
			$return_column = 'tc-portfolio-grid-2col';
		}  else {
			$return_column = 'tc-portfolio-grid-3col';
		}
		
		if( $gap == 'compact' ){
			$return_gap = ' tc-portfolio-compact ';
		} else {
			$return_gap = '';
		}
		
		if( $hard_crop == 'yes' ){
			$return_crop = ' true';
		} else {
			$return_crop = '';
		}
		
		if( $hard_crop == 'yes' && $img_width == '' ){
			$return_width = '600';
		} else {
			$return_width = $img_width;
		}
		
		if( $hard_crop == 'yes' && $img_height == '' ){
			$return_height = '400';
		} else {
			$return_height = $img_height;
		}
		
		if( $hard_crop == 'yes' ){
			$return_size = 'full';
		} else {
			$return_size =  $size;
		} 
		
		if( $gallery_id != '' ){
			$return_gallery_id = '[' . $gallery_id . ']';
		} else {
			$return_gallery_id = '';
		}
	
		//on hover image scale
		if( $scale != 'yes' ) {
			$return_scale = ' tc-img-scale';
		} else {
			$return_scale = '';
		}

		$output = '';
		$output .= '<div class="tc-gallery-grid tc-gallery wpb_custom_element ' . esc_attr( $return_column ) . '' . $return_gap . '">';
		if($images != '' ) {
			$gallery_images_array = explode(',',$images);
		}
		if(isset($gallery_images_array) && count($gallery_images_array) != 0) {
			$i = 0;
			foreach($gallery_images_array as $gallery_img_id) {
			$gallery_image_src	= wp_get_attachment_image_src( $gallery_img_id,$return_size );
			$image_src  		= $gallery_image_src[0];
			$alt 				= get_post_meta( $gallery_img_id, '_wp_attachment_image_alt', true );
			// zoom image
			$gallery_zoom_image_src = wp_get_attachment_image_src( $gallery_img_id, 'full' );
			$image_zoom_src  		= $gallery_zoom_image_src[0];

			if( $hide_zoom != 'yes' ){
				$return_zoom = '<a class="tc-media-zoom" href="' . $image_zoom_src . '" title="' . esc_attr( $alt ) . '" data-rel="prettyPhoto'. $return_gallery_id . '"></a>';
			} else {
				$return_zoom = '';
			}
			
			if( $hard_crop == 'yes' ){
				$image_crop_src  = aq_resize( $gallery_image_src[0], $return_width, $return_height, $return_crop );
				$return_img = '<img width="' . $return_width . '" height="' . $return_height . '" src="' . esc_url( $image_crop_src ) . '" alt="' . esc_attr( $alt ) . '"/>' . $return_zoom . '';
			}  else {
				$return_img = '<img src="' .  esc_url( $image_src ) . '" alt="' . esc_attr( $alt ) . '" />' . $return_zoom . '';
			}
		
			$output .= '<div class="tc-portfolio-item">';
				$output .= '<div class="tc-hover-image ' . esc_attr( $return_scale ) . '">';
					$output .= $return_img;
				$output .= '</div>';
			$output .= '</div>';
			$i++;
			}
		}
		$output .= '</div>';
		return $output;
	}
}
add_shortcode('tc_gallery_grid', 'tc_celebrate_gallery_grid');

/*------------------------------------------------------------
 * Recent Posts Carousel
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_recentpost_sc' ) ) {
	function tc_celebrate_recentpost_sc( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'title'     	=> '',
			'image'			=> '',
			'hover'   		=> '',
			'excerpt'   	=> '',
			'date'   		=> '',
			'limit'     	=> -1,
			'order'     	=> 'DESC',
			'orderby'   	=> 'date',
			'cat'	    	=> '',
			'author'		=> '',
			'link'			=> '',
			'comments'		=> '',
			'image_size'	=> 'full',
			'category'		=> '',
			"nav_controls"	=> "tc-only-pagination",
			'animation'		=> '', 
		), $atts ) );
	
		$cat = str_replace(' ','-',$cat);
		 
		global $post;
		$args = array(
			'post_type'      => '',
			'posts_per_page' => esc_attr( $limit ),
			'order'          => esc_attr( $order ), 
			'orderby'        => $orderby,
			'post_status'    => 'publish',
			'category_name'  => $cat, 
		);
	
		query_posts( $args );
		$output = '';
		if( have_posts() ) : 
			$output .= '<div class="owl-carousel tc-recentpost-carousel tcsn-theme wpb_custom_element ' . $nav_controls . ' ' . esc_attr( $animation ) . '">';
			while ( have_posts() ) : the_post();
				$output .= '<div class="item tc-recentpost-carousel-item clearfix">';
				$permalink		= get_permalink();
				$thumb_title	= get_the_title();	

				// thumbnail
				if( $image !== 'yes' ):
					if( has_post_thumbnail() && $hover !== 'yes' ) { 
						$output .=  '<div class="tc-hover-image"><a class="tc-media-link" href="' . esc_url( $permalink ) . '"></a>' . get_the_post_thumbnail($post->ID, $image_size) . '</div>';
					} else {
						$output .=  '' . get_the_post_thumbnail($post->ID, $image_size) . '';
				}
				endif;	
				
				if( $title !== 'yes' || $excerpt  !== 'yes' || $date !== 'yes' || $category  !== 'yes' ) {
				$output .= '<div class="tc-recentpost-content">';
				}
				
					// category
					if( $category !== 'yes' ) {
						$cats = get_the_category( $post->ID );
						if( $cats ) {
							 $output .= '<span class="tc-meta-category">';
						 foreach( $cats as $cat ) {
										$output .= '<a href="' . esc_url( get_category_link( $cat->term_id ) ) . '">'. $cat->name .'</a>';
								}
								 $output .= '</span>';
						}
					}
					
					// title
					if( $title !== 'yes' ):
						$output .= '<h5 class="tc-recentpost-heading"><a href="' . esc_url( $permalink ) . '" rel="bookmark">' . esc_attr(get_the_title()) . '</a></h5>';
					endif;	

					// excerpt
					if($excerpt!=='yes'):	
						$output .= '<div class="tc-recentpost-excerpt">';
						$content = get_the_excerpt();
						$content = str_replace( ']]>', ']]&gt;', $content );
						$output .= $content;
						$output .= '</div>';
					endif;	

					if( $date !== 'yes' || $comments !== 'yes' ) {
				    $output .= '<div class="tc-post-meta-wrapper">';
					// date
					if( $date !== 'yes' ) {
						$date_title = __( 'On ', 'celebrate' );
						$output .= '<span class="tc-meta-date"><a href="' . esc_url( $permalink ) . '" rel="bookmark"><span class="tc-meta-title">' . $date_title . '</span>' . esc_attr(get_the_date()) . '</a></span>';
					}
					// comments
					if( $comments !== 'yes' ) {		
						$output .= '<a class="tc-comment-link" href="' . esc_url(get_permalink(get_the_ID())) . '">' . esc_attr(get_comments_number(get_the_ID())) . '</a>';
					}
					$output .= '</div>';
					}
					
					if( $title !== 'yes' || $excerpt  !== 'yes' || $date !== 'yes' || $category  !== 'yes' ) {
					$output .= '</div>';
					}
				$output .= '</div>'; // item
			endwhile;
			$output .= '</div>';
			wp_reset_query();
		endif;
		return $output;
	}	
}
add_shortcode('tc_recent_post', 'tc_celebrate_recentpost_sc');

/*------------------------------------------------------------
 * Recent Posts Carousel - Variation
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_recentpost_var_sc' ) ) {
	function tc_celebrate_recentpost_var_sc( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'image'			=> '',
			'hover'   		=> '',
			'date'   		=> '',
			'limit'     	=> -1,
			'order'     	=> 'DESC',
			'orderby'   	=> 'date',
			'cat'	    	=> '',
			'link'			=> '',
			'category'		=> '',
			"nav_controls"	=> "tc-only-pagination",
			'animation'		=> '', 
			'image_size'	=> 'full',
			"hard_crop"		=> "",
			"return_crop"	=> "",
			"img_width"		=> "",
			"img_height"	=> "",
			"return_width"	=> "",
			"return_height"	=> "",
			"return_img"	=> "",
		), $atts ) );
	
		$cat = str_replace(' ','-',$cat);
		 
		global $post;
		$args = array(
			'post_type'      => '',
			'posts_per_page' => esc_attr( $limit ),
			'order'          => esc_attr( $order ), 
			'orderby'        => $orderby,
			'post_status'    => 'publish',
			'category_name'  => $cat, 
		);
		
		if( $hard_crop == 'yes' ){
			$return_crop = ' true';
		}  else {
			$return_crop = '';
		}
		
		if( $hard_crop == 'yes' && $img_width == '' ){
			$return_width = '600';
		} else {
			$return_width = $img_width;
		}
		
		if( $hard_crop == 'yes' && $img_height == '' ){
			$return_height = '400';
		} else {
			$return_height = $img_height;
		}
		
		// image size for cropping
		if( $hard_crop == 'yes' ){
			$return_size = 'full';
		} else {
			$return_size =  $image_size;
		} 
	
		query_posts( $args );
		$output = '';
		if( have_posts() ) : 
			$output .= '<div class="owl-carousel tc-recentpost-carousel-var tcsn-theme wpb_custom_element ' . $nav_controls . ' ' . esc_attr( $animation ) . '">';
			while ( have_posts() ) : the_post();
				$output .= '<div class="item tc-recentpost-carousel-item clearfix">';
				$permalink		= get_permalink();
				$thumb_title	= get_the_title();	
				$thumb       	= get_post_thumbnail_id(); 
				$img_url     	= wp_get_attachment_url( $thumb, 'thumbail' ); 
				$image       	= aq_resize( $img_url, $return_width, $return_height, $return_crop );
				// image
				if( has_post_thumbnail() ) { 
					if( $hard_crop == 'yes' ){
						$return_img = '<div class="tc-hover-image"><img width="' . $return_width . '" height="' . $return_height . '" src="' . esc_url( $image ) . '" alt="' . esc_attr( $thumb_title ) . '"/></div>';
					}  else {
						$return_img = '<div class="tc-hover-image">' . get_the_post_thumbnail($post->ID, $image_size) . '</div>';
					}
				}
				// hover content
				$output .= '<div class="tc-up-hover tc-post-hover">';
					$output .= '<div class="tc-hover-wrapper">';
						$output .= $return_img;
						$output .= '<div class="tc-hover-content"><div class="tc-hover-content-inner">';
							// date
							if( $date !== 'yes' ) {
								$date_title = __( 'On ', 'celebrate' );
								$output .= '<span class="tc-meta-date"><span class="tc-meta-title">' . $date_title . '</span><a href="' . esc_url( $permalink ) . '" rel="bookmark">' . esc_attr(get_the_date()) . '</a></span>';
							}
							// title
							$output .= '<h5 class="tc-recentpost-heading"><a href="' . esc_url( $permalink ) . '" rel="bookmark">' . esc_attr(get_the_title()) . '</a></h5>';
						$output .= '</div></div>'; 
					$output .= '</div>'; 
				$output .= '</div>'; // tc-up-hover 
			$output .= '</div>'; // item
			endwhile;
			$output .= '</div>';
			wp_reset_query();
		endif;
		return $output;
	}	
}
add_shortcode('tc_recent_post_var', 'tc_celebrate_recentpost_var_sc');

/*------------------------------------------------------------
 * Pricing
 * @since 1.0
 *------------------------------------------------------------*/
function tc_celebrate_pricing_sc( $atts, $content = null ) {
	extract ( shortcode_atts( array(
		'table'          		=> 'default-table', 
		'table_shape'          	=> 'pr-round', 
		'shadow'          		=> '', 
		'bg_color'     			=> '',
		'text_color'     		=> '',
		'border_color'   		=> '',
		'border_width'   		=> '',
		'icon_name'   			=> 'no-icon',
		'icon_fontawesome'  	=> 'fa fa-adjust',
		'icon_position'   		=> 'icon-left', 
		'style'  				=> 'classic', 
		'shape'  				=> 'square',
		'size'  				=> 'medium',
		'color'  				=> 'default',
		'target' 				=> '', 
		'return_target' 		=> '', 
		'url'   				=> '',
		'button_content'		=> 'link',
		'return_button'			=> '',	
		'title'          		=> 'Basic',
		'title_color'   		=> '',
		'return_title_color'	=> '',
		'return_title'          => '',	
		'price_color'   		=> '',
		'return_price_color'	=> '',
		'bnr_bg_color'      	=> '',
		'bnr_color'				=> '',	
		'return_banner'			=> '',
		'price'         		=> '149',
		'currency'      		=> '$',
		'price_label'   		=> '/month',
		'return_price'    		=> '',
		'return_content'		=> '',
		'footnote'				=> 'For Large Companies',
		'footnote_bg_color'		=> '',
		'footnote_color'		=> '',
	), $atts ) );
	
	$content = tc_celebrate_remove_wpautop($content, true);
	
	// table style
	$add_style = array();
	if( $bg_color != ''  ) {
		$add_style[] = 'background: '. $bg_color .';';
	} 
	if( $text_color != ''  ) {
		$add_style[] = 'color: '. $text_color .';';
	} 
	if( $border_color != ''  ) {
		$add_style[] = 'border-color: '. $border_color .';';
	} 
	if( $border_width != ''  ) {
		$add_style[] = 'border-width: '. $border_width .';';
	} 
	$add_style = implode('', $add_style);

	if ( $add_style ) {
		$add_style = wp_kses( $add_style, array() );
		$add_style = ' style="' . esc_attr($add_style) . '"';
	}
	
	// shadow
	if( $shadow == 'yes'  ) {
		$shadow = '';
	} else {
		$shadow = ' pr-shadow';
	}

	// featured banner
	$add_banner_style = array();
	if( $bnr_color != '' ||  $bnr_bg_color != '' ) {
		if ( $bnr_color ) {
			$add_banner_style[] = 'color: '. $bnr_color .';';
		} 
		if ( $bnr_bg_color ) {
			$add_banner_style[] = 'border-right-color: '. $bnr_bg_color .';';
		} 
	}
	$add_banner_style = implode('', $add_banner_style);
	if ( $add_banner_style ) {
		$add_banner_style = wp_kses( $add_banner_style, array() );
		$add_banner_style = ' style="' . esc_attr($add_banner_style) . '"';
	}

	if( $table == 'featured-table'  ) {
		$return_banner = '<div class="prtb-banner"'. $add_banner_style .'></div>';
	}

	// table title
	if( $title_color != ''  ) {
		$return_title_color = ' style="color: ' . $title_color . ';"';
	} else {
		$return_title_color = '';
	}
	
	if( $title != ''  ) {
		$return_title = '<span class="prtb-title"' . $return_title_color . '>' . esc_attr( $title ) . '</span>';
	}
	
	// table price
	if( $price_color != ''  ) {
		$return_price_color = ' style="color: ' . $price_color . ';"';
	} else {
		$return_price_color = '';
	}

	// price
	if( $price != ''  ) {
$return_price = '<span class="prtb-price"' . $return_price_color . '><span class="prtb-price-inner">' . esc_attr( $currency ) . '' . esc_attr( $price ) . '</span><sub>' . esc_attr( $price_label ) . '</sub></span>';
	}
	
	// content
	if( $content != ''  ) {
		$return_content = '<div class="prtb-content">' . $content . '</div>';
	}
	
	// footnote style
	$add_footnote_style = array();
	if( $footnote_bg_color != ''  ) {
		$add_footnote_style[] = 'background: '. $footnote_bg_color .';';
	} 
	if( $footnote_color != ''  ) {
		$add_footnote_style[] = 'color: '. $footnote_color .';';
	} 
	$add_footnote_style = implode('', $add_footnote_style);

	if ( $add_footnote_style ) {
		$add_footnote_style = wp_kses( $add_footnote_style, array() );
		$add_footnote_style = ' style="' . esc_attr($add_footnote_style) . '"';
	}
	if( $footnote != ''  ) {
		$return_footnote = '<div class="prtb-footnote"'. $add_footnote_style .'>' . esc_attr( $footnote ) . '</div>';
	} else {
		$return_footnote = '';
	}
	
	// button 
	// style
	if( $style ) {
		$style = ' themebtn-' . esc_attr( $style ) . '';
	} 
	
	// shape
	if( $shape ) {
		$shape = ' themebtn-' . esc_attr( $shape ) . '';
	} 
	
	// size
	if( $size ) {
		$size = ' themebtn-' . esc_attr( $size ) . '';
	} 
			
	// color
	if( $color ) {
		$color = ' themebtn-' . esc_attr( $color ) . '';
	} 
	
	// icon name
	if( $icon_name == 'fontawesome' ) {
		$return_icon = '<span class="themebtn-icon"><i class="' . esc_attr( $icon_fontawesome ) . '"></i></span>';
	} else {
		$return_icon = '';
	}
	tcsn_vc_icon_element_fonts_enqueue( $icon_name );	
		
	// icon_position
	if( $icon_name == 'fontawesome' ) {
		$icon_position = ' themebtn-' . esc_attr( $icon_position ) . '';
	} else { 
		$icon_position = ''; 
	}

	// url
	if( $url != ''  ) {
		$return_url = ' href="' . esc_url( $url ) . '"';
	} else {
		$return_url = '';
	}

	// target
	if( $target == 'blank' ){
		$return_target = ' target="_blank"';
	} elseif( $target == 'self' ){
		$return_target = ' target="_self"';
	} else {
		$return_target = '';
	}
	
	if( $button_content || $icon_name ) {
		$return_button = '<a class="themebtn' . esc_attr( $icon_position ) . esc_attr( $style ) . esc_attr( $shape ) . esc_attr( $size ) . esc_attr( $color ) . '"' . $return_target . ' ' . $return_url . '>'. $return_icon . '<span class="themebtn-label">' . $button_content .'</span></a>';
	}

	return '<div class="tc-pricing ' .  $table . ' ' . $table_shape . ' wpb_custom_element' . $shadow . '"' . $add_style . '>' . $return_banner . '<div class="tc-pricing-inner">' . $return_title . '' . $return_price . '' . $return_content . '' . $return_button . '</div>' . $return_footnote . '</div>';
}
add_shortcode('tc_pricing', 'tc_celebrate_pricing_sc');

/*------------------------------------------------------------
 * Icon Feature
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_icon_feature_sc' ) ) {
	function tc_celebrate_icon_feature_sc( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			'heading' 				=> '',
			'heading_color'			=> '',
			'return_heading'		=> '',
			'icon_name'   			=> 'no-icon',
			'icon_fontawesome'  	=> 'fa fa-adjust',
			'icon_size'				=> '',
			'icon_color'			=> '',
			'icon_bg'				=> '',
			'icon_border'			=> '',
			'return_icon'			=> '',
			'return_icon_img'		=> '',
			'color'  				=> '',
			'border_color'   		=> '',
			'border_width'   		=> '',
			'box'					=> '',
			'text_align'   			=> 'text-center',
			'feature_icon_style'	=> 'feature_icon_simple',
			'return_icon_style'  	=> '',
			'feature_style'  		=> 'feature_icon_top',
			"return_content" 		=> "",		
			'enble_link' 			=> '', 
			'start_link'  			=> '', 
			'end_link'  			=> '', 
			"link_type" 			=> "none",	
			'btn_text'				=> 'Link', 
			'btn_icon_name'   		=> 'no-icon',
			'btn_icon_fontawesome'  => 'fa fa-adjust',
			'btn_icon_position'   	=> 'icon-left', 
			'btn_style'  			=> 'classic', 
			'btn_shape'  			=> 'square',
			'btn_size'  			=> 'medium',
			'btn_color'  			=> 'default',
			'url'   				=> '',
			'target' 				=> '', 
			'return_target' 		=> '', 
			'feature_button'  		=> '',
			'animation'				=> '',
			'number'				=> '',
			'number_color'			=> '',
			), $atts ) );
	
			$content = tc_celebrate_remove_wpautop($content, true);
			
			// number style
			$add_number_style = array();
			if ( $number_color !== '' ) {
				$add_number_style[] = 'color: ' . $number_color . ';';
			}  
			$add_number_style = implode('', $add_number_style);
			if ( $add_number_style ) {
				$add_number_style = wp_kses( $add_number_style, array() );
				$add_number_style = ' style="' . esc_attr($add_number_style) . '"';
			}
			// number
			if( $number != '' ){
				$return_number = '<span class="feature-number" ' . $add_number_style . '>' . esc_attr( $number ) . '</span>';
			} else {
				$return_number = '';
			}
			
			// heading style
			$add_heading_style = array();
			if ( $heading_color !== '' ) {
				$add_heading_style[] = 'color: ' . $heading_color . ';';
			}  
			$add_heading_style = implode('', $add_heading_style);
			if ( $add_heading_style ) {
				$add_heading_style = wp_kses( $add_heading_style, array() );
				$add_heading_style = ' style="' . esc_attr($add_heading_style) . '"';
			}
			// heading
			if( $heading != '' ){
				$return_heading = '<h4 class="feature-icon-heading" ' . $add_heading_style . '>' . esc_attr( $heading ) . '</h4>';
			} else {
				$return_heading = '';
			}

			// Icon Style
			$add_icon_style = array();
			if ( $icon_color ) {
				$add_icon_style[] = 'color: '. $icon_color .';';
			}
			if ( $icon_size ) {
				$add_icon_style[] = 'font-size: '. $icon_size .'px;';
			}
			$add_icon_style = implode('', $add_icon_style);
			if ( $add_icon_style ) {
				$add_icon_style = wp_kses( $add_icon_style, array() );
				$add_icon_style = ' style="' . esc_attr($add_icon_style) . '"';
			}
			
			// icon
			if( $icon_name == 'fontawesome' ) {
				$return_icon_img = '<i class="' . esc_attr( $icon_fontawesome ) . '"' . $add_icon_style . '></i>';
			} else {
				$return_icon_img = '';
			}
			tcsn_vc_icon_element_fonts_enqueue( $icon_name );	

			// Icon Background style
			$add_icon_bg_style = array();
			
			if ( $icon_bg ) {
				$add_icon_bg_style[] = 'background: '. $icon_bg .';';
			}
			if ( $icon_border ) {
				$add_icon_bg_style[] = 'border-color: '. $icon_border .';';
			}
			$add_icon_bg_style = implode('', $add_icon_bg_style);
			if ( $add_icon_bg_style ) {
				$add_icon_bg_style = wp_kses( $add_icon_bg_style, array() );
				$add_icon_bg_style = ' style="' . esc_attr($add_icon_bg_style) . '"';
			}
			
			// icon background style
			if( $feature_icon_style == 'feature_icon_simple' ){
				$return_icon_style = ' feature-default ';
			} elseif( $feature_icon_style == 'feature_icon_circle' ){	
				$return_icon_style = ' feature-circle ';
			} elseif( $feature_icon_style == 'feature_icon_square' ){	
				$return_icon_style = ' feature-square ';
			} else {
				$return_icon_style = '';
			}
			
			// icon
			$return_icon = '<div class="icon-wrapper"' . $add_icon_bg_style . '>' . $return_icon_img . '</div>';
			
			// button style
			if( $btn_style ) {
				$btn_style = ' themebtn-' . esc_attr( $btn_style ) . '';
			} 
			
			// button size
			if( $btn_size ) {
				$btn_size = ' themebtn-' . esc_attr( $btn_size ) . '';
			} 
			
			// button shape
			if( $btn_shape ) {
				$btn_shape = ' themebtn-' . esc_attr( $btn_shape ) . '';
			} 
			
			// button color
			if( $btn_color ) {
				$btn_color = ' themebtn-' . esc_attr( $btn_color ) . '';
			} 
			
			// button icon name
			if( $btn_icon_name == 'btn_icon_fontawesome' ) {
				$btn_return_icon = '<span class="themebtn-icon"><i class="' . esc_attr( $btn_icon_fontawesome ) . '"></i></span>';
			} else {
				$btn_return_icon = '';
			}
			tcsn_vc_btn_icon_element_fonts_enqueue( $btn_icon_name );
			
			// button iconposition
			if( $btn_icon_name == 'btn_icon_fontawesome' ) {
				$btn_icon_position = ' themebtn-' . esc_attr( $btn_icon_position ) . '';
			} else { 
				$btn_icon_position = ''; 
			}
	
			// url
			if( $url != ''  ) {
				$return_url = ' href="' . esc_url( $url ) . '"';
			} else {
				$return_url = '';
			}
		
			// target
			if( $target == 'blank' ){
				$return_target = ' target="_blank"';
			} elseif( $target == 'self' ){
				$return_target = ' target="_self"';
			} else {
				$return_target = '';
			}
			
			// if link button
			if( $link_type == 'link_btn' ) {
				$feature_button = '<a class="themebtn' . esc_attr( $btn_icon_position ) . esc_attr( $btn_style ) . esc_attr( $btn_shape ) . esc_attr( $btn_size ) . esc_attr( $btn_color ) . '"' . $return_target . ' ' . $return_url . '>'. $btn_return_icon .'<span class="themebtn-label">' . $btn_text .'</span></a>'; }
				
			// if wrapping link
			if( $link_type == 'link_wrap' ) {
				$start_link = '<a href="' . esc_url( $url ) . '"' . $return_target . '>';
				$end_link = '</a>';
			}
			
			if( $return_heading != '' ||  $content != '' ){
				$return_content = '<div class="feature-icon-desc">' . $return_heading . '' . $content . '' . $feature_button . '</div>';
			} else {
				$return_content = '';
			}

			// feature output
			if( $feature_style == 'feature_icon_top' ){
				$return_feature_style = '<div class="feature-icon-top ' . $text_align . '">'. $return_icon .'' . $return_content . '</div>';			
			} elseif( $feature_style == 'feature_icon_left' ){
				$return_feature_style = '<div class="feature-icon-left ' . $text_align . '">'. $return_icon .'' . $return_content . '</div>';
			} elseif( $feature_style == 'feature_icon_right' ){
				$return_feature_style = '<div class="feature-icon-right ' . $text_align . '">' . $return_content . ''. $return_icon .'</div>';
			} else {
				$return_feature_style = '<div class="feature-icon-top ' . $text_align . '">' . $return_icon .'' . $return_content . '</div>';	
			}

			// box style
			$add_box_style = array();
			if ( $color ) {
				$add_box_style[] = 'color: '. $color .';';
			}
			if ( $border_color ) {
				$add_box_style[] = 'border-color: '. $border_color .';';
			}
			if ( $border_width ) {
				$add_box_style[] = 'border-width: '. $border_width .';';
			}
			$add_box_style = implode('', $add_box_style);
			if ( $add_box_style ) {
				$add_box_style = wp_kses( $add_box_style, array() );
				$add_box_style = ' style="' . esc_attr($add_box_style) . '"';
			}

			// box
			if( $box == 'yes' ) {
				$box = ' icwrap-box';
			}

			return "{$start_link}<div class='feature-icon {$return_icon_style} wpb_custom_element{$box} clearfix {$animation }'{$add_box_style}>{$return_number}{$return_feature_style}</div>{$end_link}";
	}   
}
add_shortcode( 'tc_icon_feature', 'tc_celebrate_icon_feature_sc' );
	
/*------------------------------------------------------------
 * Image Feature
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_image_feature_sc' ) ) {
	function tc_celebrate_image_feature_sc( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			'heading' 				=> '',
			'heading_color'			=> '',
			'return_heading'		=> '',
			"image" 				=> "",
			"size" 					=> "full",
			'return_icon'			=> '',
			'color'  				=> '',
			'border_color'   		=> '',
			'border_width'   		=> '',
			'box'					=> '',
			'text_align'   			=> 'text-center',
			'feature_style'  		=> 'feature_icon_top',
			"return_content" 		=> "",		
			'enble_link' 			=> '', 
			'start_link'  			=> '', 
			'end_link'  			=> '', 
			"link_type" 			=> "none",	
			'btn_text'				=> 'Link', 
			'btn_icon_name'   		=> 'no-icon',
			'btn_icon_fontawesome'  => 'fa fa-adjust',
			'btn_icon_position'   	=> 'icon-left', 
			'btn_style'  			=> 'classic', 
			'btn_shape'  			=> 'square',
			'btn_size'  			=> 'medium',
			'btn_color'  			=> 'default',
			'url'   				=> '',
			'target' 				=> '', 
			'return_target' 		=> '', 
			'feature_button'  		=> '',
			'animation'				=> '',
			'number'				=> '',
			'number_color'			=> '', 
			), $atts ) );
	
			$content = tc_celebrate_remove_wpautop($content, true);
			
			// number style
			$add_number_style = array();
			if ( $number_color !== '' ) {
				$add_number_style[] = 'color: ' . $number_color . ';';
			}  
			$add_number_style = implode('', $add_number_style);
			if ( $add_number_style ) {
				$add_number_style = wp_kses( $add_number_style, array() );
				$add_number_style = ' style="' . esc_attr($add_number_style) . '"';
			}
			// number
			if( $number != '' ){
				$return_number = '<span class="feature-number" ' . $add_number_style . '>' . esc_attr( $number ) . '</span>';
			} else {
				$return_number = '';
			}
			
			// heading style
			$add_heading_style = array();
			if ( $heading_color !== '' ) {
				$add_heading_style[] = 'color: ' . $heading_color . ';';
			}  
			$add_heading_style = implode('', $add_heading_style);
			if ( $add_heading_style ) {
				$add_heading_style = wp_kses( $add_heading_style, array() );
				$add_heading_style = ' style="' . esc_attr($add_heading_style) . '"';
			}
			// heading
			if( $heading != '' ){
				$return_heading = '<h4 class="feature-icon-heading" ' . $add_heading_style . '>' . esc_attr( $heading ) . '</h4>';
			} else {
				$return_heading = '';
			}
			
			// image
			$img_url = wp_get_attachment_image_src( $image,  $size );
			$img_url = $img_url[0];
			$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
			$return_icon = '<div class="icon-wrapper"><img src="'. $img_url. '" alt="' . esc_attr( $alt ) . '" ></div>';
			
			// button style
			if( $btn_style ) {
				$btn_style = ' themebtn-' . esc_attr( $btn_style ) . '';
			} 
			
			// button size
			if( $btn_size ) {
				$btn_size = ' themebtn-' . esc_attr( $btn_size ) . '';
			} 
			
			// button shape
			if( $btn_shape ) {
				$btn_shape = ' themebtn-' . esc_attr( $btn_shape ) . '';
			} 
			
			// button color
			if( $btn_color ) {
				$btn_color = ' themebtn-' . esc_attr( $btn_color ) . '';
			} 
			
			// button icon name
			if( $btn_icon_name == 'btn_icon_fontawesome' ) {
				$btn_return_icon = '<span class="themebtn-icon"><i class="' . esc_attr( $btn_icon_fontawesome ) . '"></i></span>';
			} else {
				$btn_return_icon = '';
			}
			
			// button iconposition
			if( $btn_icon_name == 'btn_icon_fontawesome' ) {
				$btn_icon_position = ' themebtn-' . esc_attr( $btn_icon_position ) . '';
			} else { 
				$btn_icon_position = ''; 
			}
	
			// url
			if( $url != ''  ) {
				$return_url = ' href="' . esc_url( $url ) . '"';
			} else {
				$return_url = '';
			}
		
			// target
			if( $target == 'blank' ){
				$return_target = ' target="_blank"';
			} elseif( $target == 'self' ){
				$return_target = ' target="_self"';
			} else {
				$return_target = '';
			}
			
			// if link button
			if( $link_type == 'link_btn' ) {
				$feature_button = '<a class="themebtn' . esc_attr( $btn_icon_position ) . esc_attr( $btn_style ) . esc_attr( $btn_shape ) . esc_attr( $btn_size ) . esc_attr( $btn_color ) . '"' . $return_target . ' ' . $return_url . '>'. $btn_return_icon .'<span class="themebtn-label">' . $btn_text .'</span></a>'; }
				
			// if wrapping link
			if( $link_type == 'link_wrap' ) {
				$start_link = '<a href="' . esc_url( $url ) . '"' . $return_target . '>';
				$end_link = '</a>';
			}
			
			if( $return_heading != '' ||  $content != '' ){
				$return_content = '<div class="feature-icon-desc">' . $return_heading . '' . $content . '' . $feature_button . '</div>';
			} else {
				$return_content = '';
			}

			// feature output
			if( $feature_style == 'feature_icon_top' ){
				$return_feature_style = '<div class="feature-icon-top ' . $text_align . '">'. $return_icon .'' . $return_content . '</div>';			
			} elseif( $feature_style == 'feature_icon_left' ){
				$return_feature_style = '<div class="feature-icon-left ' . $text_align . '">'. $return_icon .'' . $return_content . '</div>';
			} elseif( $feature_style == 'feature_icon_right' ){
				$return_feature_style = '<div class="feature-icon-right ' . $text_align . '">' . $return_content . ''. $return_icon .'</div>';
			} else {
				$return_feature_style = '<div class="feature-icon-top ' . $text_align . '">' . $return_icon .'' . $return_content . '</div>';	
			}

			// box style
			$add_box_style = array();
			if ( $color ) {
				$add_box_style[] = 'color: '. $color .';';
			}
			if ( $border_color ) {
				$add_box_style[] = 'border-color: '. $border_color .';';
			}
			if ( $border_width ) {
				$add_box_style[] = 'border-width: '. $border_width .';';
			}
			$add_box_style = implode('', $add_box_style);
			if ( $add_box_style ) {
				$add_box_style = wp_kses( $add_box_style, array() );
				$add_box_style = ' style="' . esc_attr($add_box_style) . '"';
			}

			// box
			if( $box == 'yes' ) {
				$box = ' icwrap-box';
			}

			return "{$start_link}<div class='feature-image wpb_custom_element{$box} clearfix {$animation}'{$add_box_style}>{$return_number}{$return_feature_style}</div>{$end_link}";
	}
}
add_shortcode( 'tc_image_feature', 'tc_celebrate_image_feature_sc' );
	
/*------------------------------------------------------------
 * Clients
 * @since 1.0
 *------------------------------------------------------------*/
// client wrapper
if( ! function_exists('tc_celebrate_client_wrapper' ) ){
    function tc_celebrate_client_wrapper( $atts, $content = null ) {
		extract( shortcode_atts( array(
			"nav_controls"	=> "tc-only-pagination",
			'animation'		=> '', 
		), $atts ) );
       return '<div class="owl-carousel tc-client-carousel tcsn-theme ' . $nav_controls . ' ' . esc_attr( $animation ) . '">' . do_shortcode( $content ) . '</div>';
    }
    add_shortcode('tc_client_wrapper', 'tc_celebrate_client_wrapper');
}
// client item
if ( ! function_exists( 'tc_celebrate_client' ) ) {
	function tc_celebrate_client( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			"image" 				=> "",
			"size" 					=> "full",
			"return_image"			=> "",
			"heading" 				=> "",
			"return_heading"		=> "",
		), $atts ) );
	
		$content = tc_celebrate_remove_wpautop( $content, true );

		// client image
		if( $image ){
			$img_url = wp_get_attachment_image_src( $image,  $size );
			$img_url = $img_url[0];
			$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
			$image = $img_url;
			$return_image = '<img src="' . esc_url( $img_url ) . '" alt="' . esc_attr( $alt ) . '" >';
		} else {
			$return_image = '';	
		}

		// heading
		if( $heading != '' ){
			$return_heading = '<h6 class="tc-client-title">' . esc_attr( $heading ) . '</h6>';
		} else {
			$return_heading = '';
		}
		
		if( $return_heading || $content ){
			$return_caption = '' . $return_heading. '' . $content . '';
		} else {
			$return_caption = '';	
		}
		
		return '<div class="item tc-client-item tc-up-hover"><div class="tc-hover-wrapper">' . $return_image . '<div class="tc-hover-content"><div class="tc-hover-content-inner">' . $return_caption . '</div></div></div></div>';
	}
}
add_shortcode( 'tc_client_item', 'tc_celebrate_client' );	

/*------------------------------------------------------------
 * Portfolio Grid
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_portfolio_grid' ) ) {
	function tc_celebrate_portfolio_grid( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'heading'   		=> '',
			'limit'     		=> -1,
			'order'	    		=> 'DESC',
			'orderby'   		=> 'date',
			'tax'       		=> '',
			'hide_link'			=> '',
			'hide_zoom'			=> '',
			'column'			=> '',
			'return_column'		=> '',
			'excerpt'			=> '',
			'hide_hover'		=> '',
			'target'         	=> '', 
			'return_target'     => '', 
			'portfolio_type'    => 'with_filter', 
			'with_filter'       => '', 
			'without_filter'    => '', 
			"size"				=> "full",
			"hard_crop"			=> "",
			"return_crop"		=> "",
			"img_width"			=> "",
			"img_height"		=> "",
			"return_width"		=> "",
			"return_height"		=> "",
			"return_img"		=> "",
			"gap"				=> "compact",
			"return_gap"		=> "",
			"img_link"			=> "",
			"link_heading"		=> "",
			"hover_heading"		=> "",
			'scale'				=> '',
			'show_category'		=> '',
			'animation'			=> '', 
			'return_link'		=> '', 
			'return_zoom'		=> '', 
			'text_align'		=> 'text-left',
		), $atts ) );
		
		$output = '';
		
		//on hover image scale
		if( $scale != 'yes' ) {
			$return_scale = ' tc-img-scale';
		} else {
			$return_scale = '';
		}
		
		// target
		if( $target == 'blank' ){
			$return_target = ' target="_blank"';
		} elseif( $target == 'self' ){
			$return_target = ' target="_self"';
		} else {
			$return_target = '';
		}
	
		global $post;
		$args = array(
			'post_type'          => 'tcsn_portfolio',
			'tcsn_portfoliotags' => $tax,
			'posts_per_page'     => esc_attr( $limit ),
			'order'              => esc_attr( $order ), 
			'orderby'            => $orderby,
			'post_status'        => 'publish',
		);
		
		if( $portfolio_type == 'with_filter' ){ 
		
		$portfolio_cats ='';
		if( $portfolio_cats && $portfolio_cats[0] == 0 ) {
			unset( $portfolio_cats[0] );
		}
		if( $portfolio_cats ){
			$args['tax_query'][] = array(
				'taxonomy'	=> 'tcsn_portfoliotags',
				'terms' 	=> $portfolio_cats,
				'field' 	=> 'term_id',
			);
		}
		$loop = new WP_Query( $args );
		
		$portfolio_taxs = '';
		$filtered_taxs = '';
		
		if( is_array( $loop->posts ) && !empty( $loop->posts ) ) {
			foreach( $loop->posts as $loop_post ) {
				$post_taxs = wp_get_post_terms( $loop_post->ID, 'tcsn_portfoliotags', array( "fields" => "all" ) );
				if( is_array( $post_taxs ) && !empty( $post_taxs ) ) {
					foreach( $post_taxs as $post_tax ) {
						if( is_array( $portfolio_cats ) && !empty( $portfolio_cats ) && ( in_array($post_tax->term_id, $portfolio_cats) || in_array( $post_tax->parent, $portfolio_cats )) )  						{
							$portfolio_taxs[urldecode( $post_tax->slug) ] = $post_tax->name;
						}
						if( empty( $portfolio_cats ) || !isset( $portfolio_cats ) ) {
							$portfolio_taxs[urldecode( $post_tax->slug )] = $post_tax->name;
						}
					}
				}
			}
		}

		$terms = get_terms( 'tcsn_portfoliotags' );
		if( !empty( $terms ) && is_array( $terms ) ) {
			foreach( $terms as $term ) {
				if( is_array( $portfolio_taxs ) && array_key_exists ( urldecode( $term->slug ) , $portfolio_taxs ) ) {
					$filtered_taxs[urldecode( $term->slug )] = $term->name;
				}
			}
		}

		$portfolio_taxs = $filtered_taxs;
		$portfolio_category = get_terms( 'tcsn_portfoliotags' );
		if( is_array( $portfolio_taxs ) && !empty( $portfolio_taxs ) ):
			$output .= '<div class="tc-filter-nav-wrapper ' . esc_attr( $animation ) . '"><ul class="tc-filter-nav clearfix">';
			$all = __( 'All', 'putveu' ); 
			$output .= '<li><a class="tc-filter-all active" data-filter="*" href="#">';
			$output .= '' . $all . '';
			$output .= '</a></li>';
			foreach( $portfolio_taxs as $portfolio_tax_slug => $portfolio_tax_name ): 
			$output .= '<li>';
				$output .= '<a data-filter=".' .  $portfolio_tax_slug . '" href="#">' . $portfolio_tax_name  . '';
			$output .= '</a></li>';
			endforeach; 
			$output .= '</ul></div>';
		endif; 
		}

		if( $column == 'column_three' ){
			$return_column = 'tc-portfolio-grid-3col';
		}  elseif( $column == 'column_four' ) {
			$return_column = 'tc-portfolio-grid-4col';
		}  else {
			$return_column = 'tc-portfolio-grid-3col';
		}
		
		if( $gap == 'compact' ){
			$return_gap = ' tc-portfolio-compact ';
		}  else {
			$return_gap = '';
		}
		
		if( $hard_crop == 'yes' ){
			$return_crop = ' true';
		}  else {
			$return_crop = '';
		}
		
		if( $hard_crop == 'yes' && $img_width == '' ){
			$return_width = '600';
		} else {
			$return_width = $img_width;
		}
		
		if( $hard_crop == 'yes' && $img_height == '' ){
			$return_height = '400';
		} else {
			$return_height = $img_height;
		}
		
		// image size for cropping
		if( $hard_crop == 'yes' ){
			$return_size = 'full';
		} else {
			$return_size =  $size;
		} 

		 $query = new WP_Query( $args );
		 if ($query->have_posts()) :		
			$output .= '<div class="tc-portfolio-grid tc-portfolio wpb_custom_element ' . esc_attr( $return_column ) . '' . esc_attr( $return_gap ) . ' ' . esc_attr( $animation ) . '">';	
			  $output .= '<div id="items" class="filter-content">';
			while ( $query->have_posts() ) : $query->the_post();

				$filter_classes = '';
				$item_cats = get_the_terms( $post->ID, 'tcsn_portfoliotags' );
				if( $item_cats ):
				foreach( $item_cats as $item_cat ) {
					$filter_classes .= urldecode( $item_cat->slug ) . ' ';
				}
				endif;
				
				// if both zoom and link
				if( $hide_zoom !== 'yes' && $hide_link !== 'yes' ){
					$return_icon_position = ' tc-duo';
				} else { 
					$return_icon_position = '';
				}

				$output .= '<div class="tc-portfolio-item  isotope-item'. esc_attr( $return_icon_position ) . ' ' . esc_attr( $text_align ) . ' '. esc_attr( $filter_classes ) . 'all">';
					$thumb       					= get_post_thumbnail_id(); 
					$img_url     					= wp_get_attachment_url( $thumb, $return_size ); 
					$image       					= aq_resize( $img_url, $return_width, $return_height, $return_crop );
					$thumb_title 					= get_the_title();
					$permalink   					= get_permalink();
					$tc_celebrate_portfolio_type	= get_post_meta( $post->ID, '_celebrate_portfolio_type', true );  
					$link_url 	   					= get_post_meta( $post->ID, '_celebrate_link_url', true );
					$external_link					= get_post_meta( $post->ID, '_celebrate_external_link', true );   
					$tc_celebrate_video_url 		= get_post_meta( $post->ID, '_celebrate_video_url', true );  
					$tc_celebrate_zoom_title 		= get_post_meta( $post->ID, '_celebrate_zoom_title', true ); 
					
					// zoom
					if( $hide_zoom !== 'yes' ):	
						if( $tc_celebrate_portfolio_type == 'Video' ){	
							$return_zoom ='<a class="tc-media-zoom" href="' . esc_url( $tc_celebrate_video_url ) . '" title="' . esc_attr( $tc_celebrate_zoom_title ) .' " data-rel="prettyPhoto"></a>';
						} else {
							$return_zoom ='<a class="tc-media-zoom" href="' . esc_url( $img_url ) . '" title="' . esc_attr( $thumb_title ) . '" data-rel="prettyPhoto"></a>';	
						}
					endif;
						
					// link
					if( $hide_link !== 'yes' ):	
						if ( $external_link == true ) { 
							$return_link = '<a class="tc-media-link"  href="' . esc_url( $link_url ) . '"' . $return_target . '></a>';
						} else { 
							$return_link = '<a class="tc-media-link" href="' . esc_url( $permalink ) . '"' . $return_target . '></a>';
						}	
					endif;	
					
					// image
					if( $hard_crop == 'yes' ){
						$return_img = '<div class="tc-hover-image">' . $return_link . '' . $return_zoom . '<img width="' . $return_width . '" height="' . $return_height . '" src="' . esc_url( $image ) . '" alt="' . esc_attr( $thumb_title ) . '"/></div>';
					}  else {
						$return_img = '<div class="tc-hover-image">' . $return_link . '' . $return_zoom . '' . get_the_post_thumbnail($post->ID, $size) . '</div>';
					}
					
					// image / hover outout
					$output .= '<div class="tc-up-hover' . esc_attr( $return_scale ) . '">';
						if( $hide_hover == 'yes' ){
							$output .= $return_img;
						} else {
							$output .= '<div class="tc-hover-wrapper">';
								$output .= '' . $return_img . '';
								$output .= '<div class="tc-hover-content">';
	
								// hover heading
								if( $hover_heading != 'yes' ) {	
									if( $link_heading !== 'yes' ) {	
										if ( $external_link == true ) { 
											$output .= '<h5 class="tc-folio-title"><a href="' . esc_url( $link_url ) . '"' . $return_target . '>' . get_the_title() . '</a></h5>';
										} else { 
											$output .= '<h5 class="tc-folio-title"><a href="' . esc_url( $permalink ) . '"' . $return_target . '>' . get_the_title() . '</a></h5>';
										}	
									} else {
										$output .= '<h5 class="tc-folio-title">' . get_the_title() . '</h5>';
									}
								}
								// hover category
								if( $show_category !== 'yes' ):	
								$cats = get_the_terms( $post->ID, 'tcsn_portfoliotags' );
								if(!empty($cats)) {
									$output .= '<div class="tc-folio-category">';
										foreach( $cats as $cat ) {
											$term_link = get_term_link( $cat, 'tcsn_portfoliotags' );
											$output .= '<a href="' . $term_link. '">'. $cat->name .'</a>';
										}
									$output .= '</div>';
								}
								endif;
								$output .= '</div>'; // tc-hover-content
							$output .= '</div>'; // tc-hover-wrapper
						}
						$output .= '</div>'; // tc-up-hover	
				
					if( $heading != 'yes' || $excerpt == 'yes' ){ 	
						$output .= '<div class="tc-portfolio-excerpt-wrapper">'; 
					}
				    // heading
					if( $heading != 'yes' ) {	
						if( $link_heading !== 'yes' ) {	
							if ( $external_link == true ) { 
								$output .= '<h5><a href="' . esc_url( $link_url ) . '"' . $return_target . '><span class="pf-heading">' . get_the_title() . '</span></a></h5>';
							} else { 
								$output .= '<h5><a href="' . esc_url( $permalink ) . '"' . $return_target . '><span class="pf-heading">' . get_the_title() . '</span></a></h5>';
							}	
						} else {
							$output .= '<h5><span class="pf-heading">' . get_the_title() . '</span></h5>';
						}
					}
					// excerpt
					if( $excerpt == 'yes' ):	
						$output .= '<div class="tc-portfolio-excerpt">';
						$content = get_the_excerpt();
						$content = str_replace( ']]>', ']]&gt;', $content );
						$output .= $content;
						$output .= '</div>';
					endif;	
					if( $heading != 'yes' || $excerpt == 'yes' ){ 	
						$output .= '</div>';
					}
				$output .= '</div>'; // tc-portfolio-item
			endwhile;
			$output .= '</div>';
			$output .= '</div>';
			wp_reset_postdata();
		endif;
		return $output;
	}
}
add_shortcode('tc_portfolio_grid', 'tc_celebrate_portfolio_grid');

/*------------------------------------------------------------
 * Portfolio Carousel
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_portfolio_carousel' ) ) {
	function tc_celebrate_portfolio_carousel( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'heading'   		=> '',
			'limit'     		=> -1,
			'order'	    		=> 'DESC',
			'orderby'   		=> 'date',
			'tax'       		=> '',
			'hide_link'			=> '',
			'hide_zoom'			=> '',
			'excerpt'			=> '',
			'hide_hover'		=> '',
			'target'         	=> '', 
			'return_target'     => '', 
			"size"				=> "full",
			"hard_crop"			=> "",
			"return_crop"		=> "",
			"img_width"			=> "",
			"img_height"		=> "",
			"return_width"		=> "",
			"return_height"		=> "",
			"return_img"		=> "",
			"img_link"			=> "",
			"link_heading"		=> "",
			"hover_heading"		=> "",
			'scale'				=> '',
			"nav_controls"		=> "tc-only-pagination",
			"show_category"		=> "",
			'animation'			=> '', 
			'return_link'		=> '', 
			'return_zoom'		=> '', 
			'text_align'		=> 'text-left',
		), $atts ) );
	
		global $post;
		$args = array(
			'post_type'          => 'tcsn_portfolio',
			'tcsn_portfoliotags' => $tax,
			'posts_per_page'     => esc_attr( $limit ),
			'order'              => esc_attr( $order ), 
			'orderby'            => $orderby,
			'post_status'        => 'publish',
		);
       
	    $output = '';
		
		//on hover image scale
		if( $scale != 'yes' ) {
			$return_scale = ' tc-img-scale';
		} else {
			$return_scale = '';
		}
			
		// target
		if( $target == 'blank' ){
			$return_target = ' target="_blank"';
		} elseif( $target == 'self' ){
			$return_target = ' target="_self"';
		} else {
			$return_target = '';
		}
		
		if( $hard_crop == 'yes' ){
			$return_crop = ' true';
		}  else {
			$return_crop = '';
		}
		
		if( $hard_crop == 'yes' && $img_width == '' ){
			$return_width = '600';
		} else {
			$return_width = $img_width;
		}
		
		if( $hard_crop == 'yes' && $img_height == '' ){
			$return_height = '400';
		} else {
			$return_height = $img_height;
		}
		
		// image size for cropping
		if( $hard_crop == 'yes' ){
			$return_size = 'full';
		} else {
			$return_size =  $size;
		} 
		
		// if both zoom and link
		if( $hide_zoom !== 'yes' && $hide_link !== 'yes' ){
		$return_icon_position = ' tc-duo';
		} else { 
			$return_icon_position = '';
		}

		
     	 $query = new WP_Query( $args );
		 if ($query->have_posts()) :
		 	$output .= '<div class="owl-carousel tc-portfolio-carousel tcsn-theme tc-portfolio wpb_custom_element ' . esc_attr( $text_align ) . ' ' . $nav_controls . ' ' . esc_attr( $animation ) . '">';
			while ( $query->have_posts() ) : $query->the_post();
				$output .= '<div class="item'. esc_attr( $return_icon_position ) . '">';
					$thumb       					= get_post_thumbnail_id(); 
					$img_url     					= wp_get_attachment_url( $thumb, $return_size ); 
					$image       					= aq_resize( $img_url, $return_width, $return_height, $return_crop );
					$thumb_title 					= get_the_title();
					$permalink   					= get_permalink();
					$tc_celebrate_portfolio_type	= get_post_meta( $post->ID, '_celebrate_portfolio_type', true );  
					$link_url 	   					= get_post_meta( $post->ID, '_celebrate_link_url', true );
					$external_link					= get_post_meta( $post->ID, '_celebrate_external_link', true );   
					$tc_celebrate_video_url 		= get_post_meta( $post->ID, '_celebrate_video_url', true );  
					$tc_celebrate_zoom_title 		= get_post_meta( $post->ID, '_celebrate_zoom_title', true ); 
					
					// zoom
					if( $hide_zoom !== 'yes' ):	
						if( $tc_celebrate_portfolio_type == 'Video' ){	
							$return_zoom ='<a class="tc-media-zoom" href="' . esc_url( $tc_celebrate_video_url ) . '" title="' . esc_attr( $tc_celebrate_zoom_title ) .' " data-rel="prettyPhoto"></a>';
						} else {
							$return_zoom ='<a class="tc-media-zoom" href="' . esc_url( $img_url ) . '" title="' . esc_attr( $thumb_title ) . '" data-rel="prettyPhoto"></a>';	
						}
					endif;
						
					// link
					if( $hide_link !== 'yes' ):	
						if ( $external_link == true ) { 
							$return_link = '<a class="tc-media-link"  href="' . esc_url( $link_url ) . '"' . $return_target . '></a>';
						} else { 
							$return_link = '<a class="tc-media-link" href="' . esc_url( $permalink ) . '"' . $return_target . '></a>';
						}	
					endif;	
					
					// image
					if( $hard_crop == 'yes' ){
						$return_img = '<div class="tc-hover-image">' . $return_link . '' . $return_zoom . '<img width="' . $return_width . '" height="' . $return_height . '" src="' . esc_url( $image ) . '" alt="' . esc_attr( $thumb_title ) . '"/></div>';
					}  else {
						$return_img = '<div class="tc-hover-image">' . $return_link . '' . $return_zoom . '' . get_the_post_thumbnail($post->ID, $size) . '</div>';
					}
					
					// image / hover outout
					$output .= '<div class="tc-up-hover' . esc_attr( $return_scale ) . '">';
						if( $hide_hover == 'yes' ){
							$output .= $return_img;
						} else {
							$output .= '<div class="tc-hover-wrapper">';
								$output .= '' . $return_img . '';
								$output .= '<div class="tc-hover-content">';
	
								// hover heading
								if( $hover_heading != 'yes' ) {	
									if( $link_heading !== 'yes' ) {	
										if ( $external_link == true ) { 
											$output .= '<h5 class="tc-folio-title"><a href="' . esc_url( $link_url ) . '"' . $return_target . '>' . get_the_title() . '</a></h5>';
										} else { 
											$output .= '<h5 class="tc-folio-title"><a href="' . esc_url( $permalink ) . '"' . $return_target . '>' . get_the_title() . '</a></h5>';
										}	
									} else {
										$output .= '<h5 class="tc-folio-title">' . get_the_title() . '</h5>';
									}
								}
								// hover category
								if( $show_category !== 'yes' ):	
								$cats = get_the_terms( $post->ID, 'tcsn_portfoliotags' );
								if(!empty($cats)) {
									$output .= '<div class="tc-folio-category">';
										foreach( $cats as $cat ) {
											$term_link = get_term_link( $cat, 'tcsn_portfoliotags' );
											$output .= '<a href="' . $term_link. '">'. $cat->name .'</a>';
										}
									$output .= '</div>';
								}
								endif;
								$output .= '</div>'; // tc-hover-content
							$output .= '</div>'; // tc-hover-wrapper
						}
						$output .= '</div>'; // tc-up-hover	
				
					if( $heading != 'yes' || $excerpt == 'yes' ){ 	
						$output .= '<div class="tc-portfolio-excerpt-wrapper">'; 
					}
				    // heading
					if( $heading != 'yes' ) {	
						if( $link_heading !== 'yes' ) {	
							if ( $external_link == true ) { 
								$output .= '<h5><a href="' . esc_url( $link_url ) . '"' . $return_target . '><span class="pf-heading">' . get_the_title() . '</span></a></h5>';
							} else { 
								$output .= '<h5><a href="' . esc_url( $permalink ) . '"' . $return_target . '><span class="pf-heading">' . get_the_title() . '</span></a></h5>';
							}	
						} else {
							$output .= '<h5><span class="pf-heading">' . get_the_title() . '</span></h5>';
						}
					}
					// excerpt
					if( $excerpt == 'yes' ):	
						$output .= '<div class="tc-portfolio-excerpt">';
						$content = get_the_excerpt();
						$content = str_replace( ']]>', ']]&gt;', $content );
						$output .= $content;
						$output .= '</div>';
					endif;	
					if( $heading != 'yes' || $excerpt == 'yes' ){ 	
						$output .= '</div>';
					}	
					
				$output .= '</div>'; // owl item
			endwhile;
			$output .= '</div>';
			wp_reset_postdata();
		endif;
		return $output;
	}
}
add_shortcode('tc_portfolio_carousel', 'tc_celebrate_portfolio_carousel');

/*------------------------------------------------------------
 * Team Member - style 1
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_team' ) ) {
	function tc_celebrate_team( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'limit'     			=> -1,
			'order'	    			=> 'DESC',
			'orderby'   			=> 'date',
			'tax'       			=> '',
			'id'      				=> '',
			'text_align'			=> 'text-left',
			'image_type'			=> '',
			'image_link'			=> '',
			'heading_link'			=> '',
			'target'				=> '',
			'return_target'			=> '',
			'excerpt'				=> '',
			'carousel'  			=> '',
			'return_carousel'		=> '',
			'social_style'			=> 'tc-social-onhover',
			'social_color'			=> 'tc-social-dark',
			'social_hover'			=> 'tc-social-default tc-social-mini',
			"nav_controls"		    => "tc-only-pagination",
			'animation'				=> '', 
			'return_social'			=> '', 
			'return_caption'		=> '', 
			'typography'			=> 'typo_default', 
			'box'					=> '', 
			'box_bg'				=> '', 
			'border_color'			=> '', 
			'show_info'				=> '', 
			'show_excerpt'			=> '', 
		), $atts ) );

		global $post;
		
		$args = array(
			'name'           		=> esc_attr( $id ),
			'post_type'      		=> 'tcsn_team',
			'posts_per_page'		=> esc_attr( $limit ),
			'order'          		=> esc_attr( $order ), 
			'orderby'        		=> $orderby,
			'post_status'    		=> 'publish',
			'tcsn_teamtags'			=> $tax,
		);

		$output = '';
		
		// box style
		$add_box_style = array();
		if ( $box_bg ) {
			$add_box_style[] = 'background-color: ' . $box_bg . ';';
		}
		if ( $border_color ) {
			$add_box_style[] = 'border-color: ' . $border_color . ';';
		}
		$add_box_style = implode('', $add_box_style);
		if ( $add_box_style ) {
			$add_box_style = wp_kses( $add_box_style, array() );
			$add_box_style = ' style="' . esc_attr($add_box_style) . '"';
		}

		// box
		if( $box == 'yes' ) {
			$return_box = ' tc-team-box '; 
		} else { 
			$return_box = ''; 
		}
		
		// typography style
		if( $typography == 'typo_alt' ){
			$return_typography = ' tc-typo-alt';
		} else {
			$return_typography = '';
		} 
		
		// single or carousel
		if( $carousel == 'yes' ) {
			$return_carousel = ' clearfix';
			$return_nav_controls = '';
		} else {
			$return_carousel = ' owl-carousel tc-team-carousel tcsn-theme';
			$return_nav_controls = $nav_controls;
		}

		// target
		if( $target == 'blank' ){
			$return_target = ' target="_blank"';
		} elseif( $target == 'self' ){
			$return_target = ' target="_self"';
		} else {
			$return_target = '';
		}
		
		$loop = new WP_Query( $args );
		if ($loop->have_posts()) :	
			$output .= '<div class="tc-team tc-team-default '.  esc_attr( $text_align ) . '' .  esc_attr( $return_typography ) . ' wpb_custom_element ' . esc_attr( $return_nav_controls ) . '' .  esc_attr( $return_carousel ) . ' ' . esc_attr( $animation ) . ''.  esc_attr( $return_box ) . '">';	
			while ( $loop->have_posts() ) : $loop->the_post();
			$output .= '<div class="tc-team-item item clearfix"' . $add_box_style . '>';
				$permalink 			= get_permalink();
				$thumb_title 		= get_the_title();	
				$thumb     			= get_post_thumbnail_id(); 
				$img_url   			= wp_get_attachment_url( $thumb, 'full' ); 
				$image       		= aq_resize( $img_url, 170, 170, true );
				$member_job         = get_post_meta( $post->ID, '_celebrate_member_job', true );  
				$member_behance     = get_post_meta( $post->ID, '_celebrate_member_behance', true );   
				$member_blogger     = get_post_meta( $post->ID, '_celebrate_member_blogger', true );        
				$member_delicious   = get_post_meta( $post->ID, '_celebrate_member_delicious', true );    
				$member_dribbble    = get_post_meta( $post->ID, '_celebrate_member_dribbble', true );
				$member_dropbox     = get_post_meta( $post->ID, '_celebrate_member_dropbox', true );       
				$member_facebook    = get_post_meta( $post->ID, '_celebrate_member_facebook', true );      
				$member_flickr      = get_post_meta( $post->ID, '_celebrate_member_flickr', true );  
				$member_github  	= get_post_meta( $post->ID, '_celebrate_member_github', true );       
				$member_googleplus  = get_post_meta( $post->ID, '_celebrate_member_googleplus', true );    
				$member_instagram   = get_post_meta( $post->ID, '_celebrate_member_instagram', true );        
				$member_linkedin    = get_post_meta( $post->ID, '_celebrate_member_linkedin', true );        
				$member_paypal      = get_post_meta( $post->ID, '_celebrate_member_paypal', true );          
				$member_pinterest   = get_post_meta( $post->ID, '_celebrate_member_pinterest', true );  
				$member_reddit   	= get_post_meta( $post->ID, '_celebrate_member_reddit', true );        
				$member_skype       = get_post_meta( $post->ID, '_celebrate_member_skype', true );             
				$member_soundcloud  = get_post_meta( $post->ID, '_celebrate_member_soundcloud', true );       
				$member_stumbleupon	= get_post_meta( $post->ID, '_celebrate_member_stumbleupon', true );       
				$member_tumblr      = get_post_meta( $post->ID, '_celebrate_member_tumblr', true );            
				$member_twitter     = get_post_meta( $post->ID, '_celebrate_member_twitter', true );             
				$member_vimeo       = get_post_meta( $post->ID, '_celebrate_member_vimeo', true );          
				$member_youtube     = get_post_meta( $post->ID, '_celebrate_member_youtube', true );
				$member_vine        = get_post_meta( $post->ID, '_celebrate_member_vine', true );         
				$member_mail        = get_post_meta( $post->ID, '_celebrate_member_mail', true );
				$member_job    		= get_post_meta( $post->ID, '_celebrate_member_job', true );
				$member_info_add 	= get_post_meta( $post->ID, '_celebrate_member_info_add', true );

				// link to image
				if( $image_link !== 'yes' ) {
					$return_link = '<a class="tc-media-link" href="' .  esc_url( $permalink ) . '"' . $return_target . ' rel="bookmark"></a>';
				} else {
					$return_link = '';
				}
				
				// link to heading
				if( $heading_link !== 'yes' ) {
					$link_start = '<a href="' .  esc_url( $permalink ) . '"' . $return_target . ' rel="bookmark">';
					$link_end 	= '</a>';
				} else {
					$link_start = '';
					$link_end 	= '';
				}
				
				// social
				$return_member_behance = '';
				if( $member_behance != ''  ) {
					$return_member_behance .= '<li><a href="' . esc_url( $member_behance ) . '" class="behance" target="_blank" title="behance"></a></li>';
				}
				$return_member_blogger = '';
				if( $member_blogger != ''  ) {
					$return_member_blogger .= '<li><a href="' . esc_url( $member_blogger ) . '" class="blogger" target="_blank" title="blogger"></a></li>';
				}
				$return_member_delicious = '';
				if( $member_delicious != ''  ) {
					$return_member_delicious .= '<li><a href="' . esc_url( $member_delicious ) . '" class="delicious" target="_blank" title="delicious"></a></li>';
				}
				$return_member_dribbble = '';
				if( $member_dribbble != ''  ) {
					$return_member_dribbble .= '<li><a href="' . esc_url( $member_dribbble ) . '" class="dribbble" target="_blank" title="dribbble"></a></li>';
				}
				$return_member_dropbox = '';
				if( $member_dropbox != ''  ) {
					$return_member_dropbox .= '<li><a href="' . esc_url( $member_dropbox ) . '" class="dropbox" target="_blank" title="dropbox"></a></li>';
				}
				$return_member_facebook = '';
				if( $member_facebook != ''  ) {
					$return_member_facebook .= '<li><a href="' . esc_url( $member_facebook ) . '" class="facebook" target="_blank" title="facebook"></a></li>';
				}
				$return_member_flickr = '';
				if( $member_flickr != ''  ) {
					$return_member_flickr .= '<li><a href="' . esc_url( $member_flickr ) . '" class="flickr" target="_blank" title="flickr"></a></li>';
				}
				$return_member_github = '';
				if( $member_github != ''  ) {
					$return_member_github .= '<li><a href="' . esc_url( $member_github ) . '" class="github" target="_blank" title="github"></a></li>';
				}
				$return_member_googleplus = '';
				if( $member_googleplus != ''  ) {
					$return_member_googleplus .= '<li><a href="' . esc_url( $member_googleplus ) . '" class="googleplus" target="_blank" title="googleplus"></a></li>';
				}
				$return_member_instagram = '';
				if( $member_instagram != ''  ) {
					$return_member_instagram .= '<li><a href="' . esc_url( $member_instagram ) . '" class="instagram" target="_blank" title="instagram"></a></li>';
				}
				$return_member_linkedin = '';
				if( $member_linkedin != ''  ) {
					$return_member_linkedin .= '<li><a href="' . esc_url( $member_linkedin ) . '" class="linkedin" target="_blank" title="linkedin"></a></li>';
				}
				$return_member_paypal = '';
				if( $member_paypal != ''  ) {
					$return_member_paypal .= '<li><a href="' . esc_url( $member_paypal ) . '" class="paypal" target="_blank" title="paypal"></a></li>';
				}
				$return_member_pinterest = '';
				if( $member_pinterest != ''  ) {
					$return_member_pinterest .= '<li><a href="' . esc_url( $member_pinterest ) . '" class="pinterest" target="_blank" title="pinterest"></a></li>';
				}
				$return_member_reddit = '';
				if( $member_reddit != ''  ) {
					$return_member_reddit .= '<li><a href="' . esc_url( $member_reddit ) . '" class="reddit" target="_blank" title="reddit"></a></li>';
				}
				$return_member_skype = '';
				if( $member_skype != ''  ) {
					$return_member_skype .= '<li><a href="skype:' . esc_url( $member_skype ) . '?chat" class="skype" target="_blank" title="skype"></a></li>';
				}
				$return_member_soundcloud = '';
				if( $member_soundcloud != ''  ) {
					$return_member_soundcloud .= '<li><a href="' . esc_url( $member_soundcloud ) . '" class="soundcloud" target="_blank" title="soundcloud"></a></li>';
				}
				$return_member_stumbleupon = '';
				if( $member_stumbleupon != ''  ) {
					$return_member_stumbleupon .= '<li><a href="' . esc_url( $member_stumbleupon ) . '" class="stumbleupon" target="_blank" title="stumbleupon"></a></li>';
				}
				$return_member_tumblr = '';
				if( $member_tumblr != ''  ) {
					$return_member_tumblr .= '<li><a href="' . esc_url( $member_tumblr ) . '" class="tumblr" target="_blank" title="tumblr"></a></li>';
				}
				$return_member_twitter = '';
				if( $member_twitter != ''  ) {
					$return_member_twitter .= '<li><a href="' . esc_url( $member_twitter ) . '" class="twitter" target="_blank" title="twitter"></a></li>';
				}
				$return_member_vimeo = '';
				if( $member_vimeo != ''  ) {
					$return_member_vimeo .= '<li><a href="' . esc_url( $member_vimeo ) . '" class="vimeo" target="_blank" title="vimeo"></a></li>';
				}
				$return_member_youtube = '';
				if( $member_youtube != ''  ) {
					$return_member_youtube .= '<li><a href="' . esc_url( $member_youtube ) . '" class="youtube" target="_blank" title="youtube"></a></li>';
				}
				$return_member_vine = '';
				if( $member_vine != ''  ) {
					$return_member_vine .= '<li><a href="' . esc_url( $member_vine ) . '" class="vine" target="_blank" title="vine"></a></li>';
				}
				$return_member_mail = '';
				if( $member_mail != ''  ) {
					$return_member_mail .= '<li><a href="mailto:' . esc_attr( $member_mail ) . '" class="mail" target="_blank" title="mail"></a></li>';
				}
				
				if( $social_style == 'tc-social-onhover' ){
					$return_social_color = ' tc-social-light';
				} else {
					$return_social_color = $social_color;
				}
				
				$return_social = '<ul class="tc-social ' . esc_attr( $social_hover ) . ' ' . esc_attr( $return_social_color ) . ' clearfix">' . $return_member_behance . '' . $return_member_blogger . '' . $return_member_delicious . '' . $return_member_dribbble . '' . $return_member_dropbox . '' . $return_member_facebook . '' . $return_member_flickr . '' . $return_member_github . '' . $return_member_googleplus . '' . $return_member_instagram . '' . $return_member_linkedin . '' . $return_member_paypal . '' . $return_member_pinterest . '' . $return_member_reddit . '' . $return_member_skype . '' . $return_member_soundcloud . '' . $return_member_stumbleupon . '' . $return_member_tumblr . '' . $return_member_twitter . '' . $return_member_vimeo . '' . $return_member_youtube . '' . $return_member_vine . '' . $return_member_mail . '</ul>';

				if( $social_style == 'tc-social-onhover' ){
					$return_caption = '<div class="tc-hover-content">' . $return_social . '</div>';
				}

				//image
				if( has_post_thumbnail() ) {
				if( $image_type == 'tc-member-image-circle' ){
					$output .= '<div class="tc-member-image tc-up-hover clearfix"><div class="tc-member-image-circle">' . $return_link . '<div class="tc-hover-wrapper"><img src="' . esc_url( $image ) . '" alt="' . esc_attr( $thumb_title ) . '"/>' . $return_caption . '</div></div></div>';
				}  else {
					$output .= '<div class="tc-member-image tc-up-hover">' . $return_link . '<div class="tc-hover-wrapper">' . get_the_post_thumbnail($post->ID, 'full') . '' . $return_caption . '</div></div>';
				}
				}
				$output .= '<div class="tc-member-content">';
				// member meta
				$output .= '<h4 class="tc-member-name">' . $link_start . '' .  esc_attr(get_the_title()) .'' . $link_end . '</h4>';
				if( $member_job ) {
					$output .= '<div class="tc-member-job">' . $member_job . '</div>';
				}
				// excerpt
				if( $excerpt !== 'yes' ):	
				$output .= '<div class="tc-member-excerpt">';
				$content = get_the_excerpt();
					$content = str_replace( ']]>', ']]&gt;', $content );
					$output .= $content;
				
				$output .= '</div>';
				endif;	
				// member info
				if( $member_info_add && $show_info !== 'yes' ) {
					$output .= '<div class="tc-member-info">' . $member_info_add . '</div>';
				}
				// social
				if( $social_style == 'tc-social-below' ){
					$output .= $return_social;
				}
				$output .= '</div>'; // member-info-content ends
				$output .= '</div>';
		endwhile;
			$output .= '</div>';
			wp_reset_postdata();
		endif;
		return $output;
	}
}
add_shortcode('tc_team', 'tc_celebrate_team');

/*------------------------------------------------------------
 * Team Member - style 2
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_two_col_team' ) ) {
	function tc_celebrate_two_col_team( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'limit'     			=> -1,
			'order'	    			=> 'DESC',
			'orderby'   			=> 'date',
			'tax'       			=> '',
			'id'      				=> '',
			'text_align'			=> 'text-left',
			'image_type'			=> '',
			'image_link'			=> '',
			'heading_link'			=> '',
			'target'				=> '',
			'return_target'			=> '',
			'excerpt'				=> '',
			'carousel'  			=> '',
			'return_carousel'		=> '',
			'social_style'			=> 'tc-social-onhover',
			'social_color'			=> 'tc-social-dark',
			'social_hover'			=> 'tc-social-default tc-social-mini',
			"nav_controls"		    => "tc-only-pagination",
			'animation'				=> '', 
			'return_social'			=> '', 
			'return_caption'		=> '', 
			'typography'			=> 'typo_default', 
			'box'					=> '', 
			'box_bg'				=> '', 
			'border_color'			=> '', 
			'show_info'				=> '', 
			'show_excerpt'			=> '', 
		), $atts ) );

		global $post;
		
		$args = array(
			'name'           		=> esc_attr( $id ),
			'post_type'      		=> 'tcsn_team',
			'posts_per_page'		=> esc_attr( $limit ),
			'order'          		=> esc_attr( $order ), 
			'orderby'        		=> $orderby,
			'post_status'    		=> 'publish',
			'tcsn_teamtags'			=> $tax,
		);

		$output = '';
		
		// box style
		$add_box_style = array();
		if ( $box_bg ) {
			$add_box_style[] = 'background-color: ' . $box_bg . ';';
		}
		if ( $border_color ) {
			$add_box_style[] = 'border-color: ' . $border_color . ';';
		}
		$add_box_style = implode('', $add_box_style);
		if ( $add_box_style ) {
			$add_box_style = wp_kses( $add_box_style, array() );
			$add_box_style = ' style="' . esc_attr($add_box_style) . '"';
		}

		// box
		if( $box == 'yes' ) {
			$return_box = ' tc-team-box '; 
		} else { 
			$return_box = ''; 
		}
		
		// typography style
		if( $typography == 'typo_alt' ){
			$return_typography = ' tc-typo-alt';
		} else {
			$return_typography = '';
		} 
		
		// single or carousel
		if( $carousel == 'yes' ) {
			$return_carousel = ' clearfix';
			$return_nav_controls = '';
		} else {
			$return_carousel = ' owl-carousel tc-team-two-col-carousel tcsn-theme';
			$return_nav_controls = $nav_controls;
		}

		// target
		if( $target == 'blank' ){
			$return_target = ' target="_blank"';
		} elseif( $target == 'self' ){
			$return_target = ' target="_self"';
		} else {
			$return_target = '';
		}
		
		$loop = new WP_Query( $args );
		if ($loop->have_posts()) :	
			$output .= '<div class="tc-team tc-team-two-col '.  esc_attr( $text_align ) . '' .  esc_attr( $return_typography ) . ' wpb_custom_element ' . esc_attr( $return_nav_controls ) . '' .  esc_attr( $return_carousel ) . ' ' . esc_attr( $animation ) . ''.  esc_attr( $return_box ) . '">';	
			while ( $loop->have_posts() ) : $loop->the_post();
			$output .= '<div class="tc-team-item item clearfix"' . $add_box_style . '>';
				$permalink 			= get_permalink();
				$thumb_title 		= get_the_title();	
				$thumb     			= get_post_thumbnail_id(); 
				$img_url   			= wp_get_attachment_url( $thumb, 'full' ); 
				$image       		= aq_resize( $img_url, 170, 170, true );
				$member_job         = get_post_meta( $post->ID, '_celebrate_member_job', true );  
				$member_behance     = get_post_meta( $post->ID, '_celebrate_member_behance', true );   
				$member_blogger     = get_post_meta( $post->ID, '_celebrate_member_blogger', true );        
				$member_delicious   = get_post_meta( $post->ID, '_celebrate_member_delicious', true );    
				$member_dribbble    = get_post_meta( $post->ID, '_celebrate_member_dribbble', true );
				$member_dropbox     = get_post_meta( $post->ID, '_celebrate_member_dropbox', true );       
				$member_facebook    = get_post_meta( $post->ID, '_celebrate_member_facebook', true );      
				$member_flickr      = get_post_meta( $post->ID, '_celebrate_member_flickr', true );  
				$member_github  	= get_post_meta( $post->ID, '_celebrate_member_github', true );       
				$member_googleplus  = get_post_meta( $post->ID, '_celebrate_member_googleplus', true );    
				$member_instagram   = get_post_meta( $post->ID, '_celebrate_member_instagram', true );        
				$member_linkedin    = get_post_meta( $post->ID, '_celebrate_member_linkedin', true );        
				$member_paypal      = get_post_meta( $post->ID, '_celebrate_member_paypal', true );          
				$member_pinterest   = get_post_meta( $post->ID, '_celebrate_member_pinterest', true );  
				$member_reddit   	= get_post_meta( $post->ID, '_celebrate_member_reddit', true );        
				$member_skype       = get_post_meta( $post->ID, '_celebrate_member_skype', true );             
				$member_soundcloud  = get_post_meta( $post->ID, '_celebrate_member_soundcloud', true );       
				$member_stumbleupon	= get_post_meta( $post->ID, '_celebrate_member_stumbleupon', true );       
				$member_tumblr      = get_post_meta( $post->ID, '_celebrate_member_tumblr', true );            
				$member_twitter     = get_post_meta( $post->ID, '_celebrate_member_twitter', true );             
				$member_vimeo       = get_post_meta( $post->ID, '_celebrate_member_vimeo', true );          
				$member_youtube     = get_post_meta( $post->ID, '_celebrate_member_youtube', true );
				$member_vine        = get_post_meta( $post->ID, '_celebrate_member_vine', true );         
				$member_mail        = get_post_meta( $post->ID, '_celebrate_member_mail', true );
				$member_job    		= get_post_meta( $post->ID, '_celebrate_member_job', true );
				$member_info_add 	= get_post_meta( $post->ID, '_celebrate_member_info_add', true );

				// link to image
				if( $image_link !== 'yes' ) {
					$return_link = '<a class="tc-media-link" href="' .  esc_url( $permalink ) . '"' . $return_target . ' rel="bookmark"></a>';
				} else {
					$return_link = '';
				}
				
				// link to heading
				if( $heading_link !== 'yes' ) {
					$link_start = '<a href="' .  esc_url( $permalink ) . '"' . $return_target . ' rel="bookmark">';
					$link_end 	= '</a>';
				} else {
					$link_start = '';
					$link_end 	= '';
				}
				
				// social
				$return_member_behance = '';
				if( $member_behance != ''  ) {
					$return_member_behance .= '<li><a href="' . esc_url( $member_behance ) . '" class="behance" target="_blank" title="behance"></a></li>';
				}
				$return_member_blogger = '';
				if( $member_blogger != ''  ) {
					$return_member_blogger .= '<li><a href="' . esc_url( $member_blogger ) . '" class="blogger" target="_blank" title="blogger"></a></li>';
				}
				$return_member_delicious = '';
				if( $member_delicious != ''  ) {
					$return_member_delicious .= '<li><a href="' . esc_url( $member_delicious ) . '" class="delicious" target="_blank" title="delicious"></a></li>';
				}
				$return_member_dribbble = '';
				if( $member_dribbble != ''  ) {
					$return_member_dribbble .= '<li><a href="' . esc_url( $member_dribbble ) . '" class="dribbble" target="_blank" title="dribbble"></a></li>';
				}
				$return_member_dropbox = '';
				if( $member_dropbox != ''  ) {
					$return_member_dropbox .= '<li><a href="' . esc_url( $member_dropbox ) . '" class="dropbox" target="_blank" title="dropbox"></a></li>';
				}
				$return_member_facebook = '';
				if( $member_facebook != ''  ) {
					$return_member_facebook .= '<li><a href="' . esc_url( $member_facebook ) . '" class="facebook" target="_blank" title="facebook"></a></li>';
				}
				$return_member_flickr = '';
				if( $member_flickr != ''  ) {
					$return_member_flickr .= '<li><a href="' . esc_url( $member_flickr ) . '" class="flickr" target="_blank" title="flickr"></a></li>';
				}
				$return_member_github = '';
				if( $member_github != ''  ) {
					$return_member_github .= '<li><a href="' . esc_url( $member_github ) . '" class="github" target="_blank" title="github"></a></li>';
				}
				$return_member_googleplus = '';
				if( $member_googleplus != ''  ) {
					$return_member_googleplus .= '<li><a href="' . esc_url( $member_googleplus ) . '" class="googleplus" target="_blank" title="googleplus"></a></li>';
				}
				$return_member_instagram = '';
				if( $member_instagram != ''  ) {
					$return_member_instagram .= '<li><a href="' . esc_url( $member_instagram ) . '" class="instagram" target="_blank" title="instagram"></a></li>';
				}
				$return_member_linkedin = '';
				if( $member_linkedin != ''  ) {
					$return_member_linkedin .= '<li><a href="' . esc_url( $member_linkedin ) . '" class="linkedin" target="_blank" title="linkedin"></a></li>';
				}
				$return_member_paypal = '';
				if( $member_paypal != ''  ) {
					$return_member_paypal .= '<li><a href="' . esc_url( $member_paypal ) . '" class="paypal" target="_blank" title="paypal"></a></li>';
				}
				$return_member_pinterest = '';
				if( $member_pinterest != ''  ) {
					$return_member_pinterest .= '<li><a href="' . esc_url( $member_pinterest ) . '" class="pinterest" target="_blank" title="pinterest"></a></li>';
				}
				$return_member_reddit = '';
				if( $member_reddit != ''  ) {
					$return_member_reddit .= '<li><a href="' . esc_url( $member_reddit ) . '" class="reddit" target="_blank" title="reddit"></a></li>';
				}
				$return_member_skype = '';
				if( $member_skype != ''  ) {
					$return_member_skype .= '<li><a href="skype:' . esc_url( $member_skype ) . '?chat" class="skype" target="_blank" title="skype"></a></li>';
				}
				$return_member_soundcloud = '';
				if( $member_soundcloud != ''  ) {
					$return_member_soundcloud .= '<li><a href="' . esc_url( $member_soundcloud ) . '" class="soundcloud" target="_blank" title="soundcloud"></a></li>';
				}
				$return_member_stumbleupon = '';
				if( $member_stumbleupon != ''  ) {
					$return_member_stumbleupon .= '<li><a href="' . esc_url( $member_stumbleupon ) . '" class="stumbleupon" target="_blank" title="stumbleupon"></a></li>';
				}
				$return_member_tumblr = '';
				if( $member_tumblr != ''  ) {
					$return_member_tumblr .= '<li><a href="' . esc_url( $member_tumblr ) . '" class="tumblr" target="_blank" title="tumblr"></a></li>';
				}
				$return_member_twitter = '';
				if( $member_twitter != ''  ) {
					$return_member_twitter .= '<li><a href="' . esc_url( $member_twitter ) . '" class="twitter" target="_blank" title="twitter"></a></li>';
				}
				$return_member_vimeo = '';
				if( $member_vimeo != ''  ) {
					$return_member_vimeo .= '<li><a href="' . esc_url( $member_vimeo ) . '" class="vimeo" target="_blank" title="vimeo"></a></li>';
				}
				$return_member_youtube = '';
				if( $member_youtube != ''  ) {
					$return_member_youtube .= '<li><a href="' . esc_url( $member_youtube ) . '" class="youtube" target="_blank" title="youtube"></a></li>';
				}
				$return_member_vine = '';
				if( $member_vine != ''  ) {
					$return_member_vine .= '<li><a href="' . esc_url( $member_vine ) . '" class="vine" target="_blank" title="vine"></a></li>';
				}
				$return_member_mail = '';
				if( $member_mail != ''  ) {
					$return_member_mail .= '<li><a href="mailto:' . esc_attr( $member_mail ) . '" class="mail" target="_blank" title="mail"></a></li>';
				}
				
				if( $social_style == 'tc-social-onhover' ){
					$return_social_color = ' tc-social-light';
				} else {
					$return_social_color = $social_color;
				}
				
				$return_social = '<ul class="tc-social ' . esc_attr( $social_hover ) . ' ' . esc_attr( $return_social_color ) . ' clearfix">' . $return_member_behance . '' . $return_member_blogger . '' . $return_member_delicious . '' . $return_member_dribbble . '' . $return_member_dropbox . '' . $return_member_facebook . '' . $return_member_flickr . '' . $return_member_github . '' . $return_member_googleplus . '' . $return_member_instagram . '' . $return_member_linkedin . '' . $return_member_paypal . '' . $return_member_pinterest . '' . $return_member_reddit . '' . $return_member_skype . '' . $return_member_soundcloud . '' . $return_member_stumbleupon . '' . $return_member_tumblr . '' . $return_member_twitter . '' . $return_member_vimeo . '' . $return_member_youtube . '' . $return_member_vine . '' . $return_member_mail . '</ul>';

				if( $social_style == 'tc-social-onhover' ){
					$return_caption = '<div class="tc-hover-content">' . $return_social . '</div>';
				}

				//image
				if( has_post_thumbnail() ) {
				if( $image_type == 'tc-member-image-circle' ){
					$output .= '<div class="tc-member-image tc-up-hover clearfix"><div class="tc-member-image-circle">' . $return_link . '<div class="tc-hover-wrapper"><img src="' . esc_url( $image ) . '" alt="' . esc_attr( $thumb_title ) . '"/>' . $return_caption . '</div></div></div>';
				}  else {
					$output .= '<div class="tc-member-image tc-up-hover">' . $return_link . '<div class="tc-hover-wrapper">' . get_the_post_thumbnail($post->ID, 'full') . '' . $return_caption . '</div></div>';
				}
				}
				$output .= '<div class="tc-member-content">';
				// member meta
				$output .= '<h4 class="tc-member-name">' . $link_start . '' .  esc_attr(get_the_title()) .'' . $link_end . '</h4>';
				if( $member_job ) {
					$output .= '<div class="tc-member-job">' . $member_job . '</div>';
				}
				// excerpt
				if( $excerpt !== 'yes' ):	
				$output .= '<div class="tc-member-excerpt">';
				$content = get_the_excerpt();
					$content = str_replace( ']]>', ']]&gt;', $content );
					$output .= $content;
				
				$output .= '</div>';
				endif;	
				// member info
				if( $member_info_add && $show_info !== 'yes' ) {
					$output .= '<div class="tc-member-info">' . $member_info_add . '</div>';
				}
				// social
				if( $social_style == 'tc-social-below' ){
					$output .= $return_social;
				}
				$output .= '</div>'; // member-info-content ends
				$output .= '</div>';
		endwhile;
			$output .= '</div>';
			wp_reset_postdata();
		endif;
		return $output;
	}
}
add_shortcode('tc_team_two_col', 'tc_celebrate_two_col_team');

/*------------------------------------------------------------
 * Testimonial
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_testimonial' ) ) {
	function tc_celebrate_testimonial( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'id'  					=> '',
			'carousel'  			=> '',
			'return_carousel'		=> '',
			'show_rating'		    => '',
			'style'  				=> 'tc-testimonial-default',
			'column'  				=> 'column_one',
			'limit'     			=> -1,
			'order'     			=> 'DESC',
			'orderby'   			=> 'date',
			'size'  				=> '',
			'line_height'  			=> '',
			'bg_color'  			=> '',
			'color'  				=> '',
			'name_color'  			=> '',
			'job_color'  			=> '',
			'tagline_color'  		=> '',	
			"nav_controls"		    => "tc-only-pagination",
			'rating_count'  		=> '',
			'icon_color'  			=> '',
		), $atts ) );
	
		global $post;
		$args = array(
			'name'           	=> esc_attr( $id ),
			'post_type'      	=> 'tcsn_testimonial',
			'posts_per_page'	=> esc_attr( $limit ),
			'order'          	=> esc_attr( $order ), 
			'orderby'        	=> $orderby,
			'post_status'    	=> 'publish',
		);
		
		// single or carousel
		if( $carousel == 'yes' ) {
			$return_carousel = ' clearfix';
			$return_nav_controls = '';
		} elseif( $carousel != 'yes' && $column == 'column_one' ) {
			$return_carousel = ' owl-carousel tc-testimonial-carousel tcsn-theme';
			$return_nav_controls = $nav_controls;
		} elseif( $carousel != 'yes' && $column == 'column_two' ) {
			$return_carousel = ' owl-carousel tc-testimonial-carousel-2col tcsn-theme';
			$return_nav_controls = $nav_controls;
		} else {
			$return_carousel = ' owl-carousel tc-testimonial-carousel tcsn-theme';
			$return_nav_controls = $nav_controls;
		}

		// content
		$add_style = array();
		if( $bg_color != ''  ) {
			$add_style[] = 'background-color: ' . $bg_color . ';';
		} 
		if( $color != ''  ) {
			$add_style[] = 'color: ' . $color . ';';
		} 
		if( $size != ''  ) {
			$add_style[] = 'font-size: ' . $size . ';';
		} 
		if( $line_height != ''  ) {
			$add_style[] = 'line-height: ' . $line_height . ';';
		} 

		$add_style = implode('', $add_style);
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr( $add_style ) . '"';
		}
		
		// icon style
		$add_icon_style = array();
		if ( $icon_color ) {
			$add_icon_style[] = ' color: ' . $icon_color . ';';
		}  
		$add_icon_style = implode('', $add_icon_style);
		if ( $add_icon_style ) {
			$add_icon_style = wp_kses( $add_icon_style, array() );
			$add_icon_style = ' style="' . esc_attr( $add_icon_style ) . '"';
		}
		
		// tagline style
		$add_tagline_style = array();
		if ( $tagline_color ) {
			$add_tagline_style[] = ' color: ' . $tagline_color . ';';
		}  
		$add_tagline_style = implode('', $add_tagline_style);
		if ( $add_tagline_style ) {
			$add_tagline_style = wp_kses( $add_tagline_style, array() );
			$add_tagline_style = ' style="' . esc_attr( $add_tagline_style ) . '"';
		}
		
		// name style
		$add_name_style = array();
		if ( $name_color ) {
			$add_name_style[] = ' color: ' . $name_color . ';';
		}  
		$add_name_style = implode('', $add_name_style);
		if ( $add_name_style ) {
			$add_name_style = wp_kses( $add_name_style, array() );
			$add_name_style = ' style="' . esc_attr( $add_name_style ) . '"';
		}

		$output = '';
		
		$query = new WP_Query( $args );
		if ($query->have_posts()) :	
		$output .= '<div class="wpb_custom_element tc-testimonial' .  esc_attr( $return_carousel ) . ' ' .  esc_attr( $return_nav_controls ) . '">';
			while ( $query->have_posts() ) : $query->the_post();
				$output .= '<div class="tc-testimonial-item item clearfix">';
				$thumb       			= get_post_thumbnail_id(); 
				$img_url     			= wp_get_attachment_url( $thumb, 'full' ); 
				$image       			= aq_resize( $img_url, 120, 120, true );
				$client_name 		    = get_the_title();
				$testimonial_tagline 	= get_post_meta( $post->ID, '_celebrate_testimonial_tagline', true );
				$client_info 			= get_post_meta( $post->ID, '_celebrate_client_info', true );
				$rating_count 			= get_post_meta( $post->ID, '_celebrate_rating_count', true );

				$output .= '<div class="tc-testimonial-content ' . $style . '">';
					
					if( $style == 'tc-testimonial-default' ) {
					$output .= '<div class="tc-testimonial-head">';
					$output .= '<span class="tc-testimonial-icon"' . $add_icon_style . '></span>';
					// tagline
					if( $testimonial_tagline ){
						$output .= '<span class="tc-testimonial-tagline"' . $add_tagline_style . '>' . esc_attr( $testimonial_tagline ) . '</span>';
					} 
					$output .= '</div>'; // tc-testimonial-head
					}
					
					$output .= '<div class="tc-testimonial-text"' . $add_style . '>';
					if( $style == 'tc-testimonial-box' ) {
						// tagline
						if( $testimonial_tagline ){
							$output .= '<span class="tc-testimonial-tagline"' . $add_tagline_style . '>' . esc_attr( $testimonial_tagline ) . '</span>';
						} 
					}
					$content = get_the_content();
					$content = apply_filters( 'the_content', $content );
					$content = str_replace( ']]>', ']]&gt;', $content );
					$output .= $content;
					if( $style == 'tc-testimonial-box' ) {
						$output .= '<span class="tc-testimonial-arrow" style="color: ' . $bg_color . ';"></span>';
					}
					
					if( $style == 'tc-testimonial-default' ) {
						$output .= '</div>'; // tc-testimonial-text
					}
						if( $show_rating != 'yes' && $rating_count == 'rating_five' ){
						$output .= '<div class="tc-rating-wrap clearfix"><span class="tc-rating-star"></span><span class="tc-rating-star"></span><span class="tc-rating-star"></span><span class="tc-rating-star"></span><span class="tc-rating-star"></span></div>';
					} elseif( $show_rating != 'yes' && $rating_count == 'rating_four' ){
						$output .= '<div class="tc-rating-wrap clearfix"><span class="tc-rating-star"></span><span class="tc-rating-star"></span><span class="tc-rating-star"></span><span class="tc-rating-star"></span><span class="tc-rating-star tc-rating-star-disabled"></span></div>';
					}
					if( $style == 'tc-testimonial-box' ) {
						$output .= '</div>'; // tc-testimonial-text
					}
					$output .= '<div class="tc-testimonial-info">';
					if ( has_post_thumbnail() ) {	
						$output .= '<span class="tc-testimonial-img"><img src="' . esc_url( $image ) . '" alt="' . esc_attr( $client_name ) . '"/></span>';
					}
					// heading
					if( $client_name ){
						$output .= '<h5 class="tc-testimonial-client-name"' . $add_name_style . '>' . esc_attr( $client_name ) . '</h5>';
					} 
					// job title
					if( $job_color ){
						$add_job_style = ' style="color: ' . esc_attr( $job_color ) . '"';
					} else { 
						$add_job_style = ''; 
					}
					if( $client_info ){ 
						$output .= '<span class="tc-testimonial-client-job"' . $add_job_style . '>' . esc_attr( $client_info ) . '</span>';
					} 
					$output .= '</div>'; // tc-testimonial-info
			$output .= '</div></div>';
			endwhile;
			$output .= '</div>';
			wp_reset_postdata();
		endif;
		return $output;
	}
}
add_shortcode('tc_testimonial', 'tc_celebrate_testimonial');

/*------------------------------------------------------------
 * Video Lightbox
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_videobtn_sc' ) ) {
function tc_celebrate_videobtn_sc( $atts, $content ) { 
	extract( shortcode_atts( array(
		'image'				=> '',
		'size' 				=> 'full',
		'video_title'		=> '',
		'video_link'		=> '',
		'video_text'		=> 'Watch Video',
		'return_video_text'	=> '',
		'color' 			=> '',
		), $atts ) );
		
		// add text style
		$add_style = array();
		if ( $color ) {
			$add_style[] = ' color: ' . $color . ';';
		} 
		$add_style = implode('', $add_style);
		if ( $add_style ) {
			$add_style = wp_kses( $add_style, array() );
			$add_style = ' style="' . esc_attr($add_style) . '"';
		}
		if( $video_text ){
			$return_video_text = '<span' . $add_style . '>' . esc_attr( $video_text ) . '</span>';
		} 

		// image
		$img_url = wp_get_attachment_image_src( $image,  $size );
		$img_url = $img_url[0];
		$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
		
		return '<div class="tc-video-box"><img src="' . $img_url . '" alt="' . $alt . '" class="tc-video-box-img"><span class="tc-video-box-content"><a title="' . esc_attr( $video_title ) . '" href="' . esc_attr( $video_link ) . '" class="tc-video-box-icon" data-rel="prettyPhoto"></a>' . $return_video_text . '</span></div>';
} 
}
add_shortcode( 'tc_video_button', 'tc_celebrate_videobtn_sc' );

/*------------------------------------------------------------
 * 18. Social Share
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_social_share_sc' ) ) {
	function tc_celebrate_social_share_sc( $atts, $content = null ) {
		extract ( shortcode_atts( array(
			'facebook'		=> '', 
			'twitter'		=> '', 
			'googleplus'	=> '', 
			'linkedin'		=> '', 
			'pinterest'		=> '', 
			'mail'			=> '', 
			'animation'		=> '', 
		), $atts ) );
		
	$output = '';
	
	// facebook
	if( $facebook == 'yes' ){
		$return_facebook = '<li><a href="http://www.facebook.com/sharer.php?u=' . get_the_permalink() . '" title="' . get_the_title() . '" class="share-facebook"></a></li>';
	} else {
		$return_facebook = '';
	}
	// twitter
	if( $twitter == 'yes' ){
		$return_twitter = '<li><a href="http://twitter.com/home?status=' . get_the_title() . ' ' . get_the_permalink() . '" title="' . get_the_title() . '" class="share-twitter"></a></li>';
	} else {
		$return_twitter = '';
	}
	// googleplus
	if( $googleplus == 'yes' ){
		$return_googleplus = '<li><a href="https://plus.google.com/share?url=' . get_the_permalink() . '" title="' . get_the_title() . '" class="share-googleplus"></a></li>';
	} else {
		$return_googleplus = '';
	}
	// linkedin
	if( $linkedin == 'yes' ){
		$return_linkedin = '<li><a href="http://linkedin.com/shareArticle?url=<' . get_the_permalink() . '" title="' . get_the_title() . '" class="share-linkedin"></a></li>';
	} else {
		$return_linkedin = '';
	}
	// pinterest
	if( $pinterest == 'yes' ){
		$pinterestimage = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'full' );
		$return_pinterest = '<li><a href="http://pinterest.com/pin/create/button/?url=' . get_the_permalink() . '&amp;description=' . get_the_title() . '&amp;media=<?php echo urlencode($pinterestimage[0]); ?>" class="share-pinterest"></a></li>';
	} else {
		$return_pinterest = '';
	}
	// mail
	if( $mail == 'yes' ){
		$return_mail = '<li><a href="mailto:?subject=' . get_the_title() . '&amp;body=' . get_the_permalink() . '" class="share-mail"></a></li>';
	} else {
		$return_mail = '';
	}

	$output .= '<div class="tc-social-share tc-share-sc clearfix ' . esc_attr( $animation ) . '"><ul>' . $return_facebook . '' . $return_twitter . '' . $return_googleplus . '' . $return_linkedin . '' . $return_pinterest . '' . $return_mail . '</ul></div>';		
	
	return $output;
	}
}
add_shortcode('tc_social_share', 'tc_celebrate_social_share_sc');

/*------------------------------------------------------------
 * Timeline
 * @since 1.0
 *------------------------------------------------------------*/
// timeline wrapper
if( ! function_exists('tc_celebrate_timeline_wrapper' ) ){
    function tc_celebrate_timeline_wrapper( $atts, $content = null ) {
		extract( shortcode_atts( array(
			"animation"		=> "",
		), $atts ) );
       return '<ul class="tc-timeline ' . esc_attr( $animation ) . '">' . do_shortcode( $content ) . '</ul>';
    }
    add_shortcode('tc_timeline_wrapper', 'tc_celebrate_timeline_wrapper');
}
// timeline item
if ( ! function_exists( 'tc_celebrate_timeline' ) ) {
	function tc_celebrate_timeline( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			"heading" 		=> "Where it all begun",
			"sub_heading"	=> "2008.",
		), $atts ) );
	
		$content = tc_celebrate_remove_wpautop( $content, true );
		
		// sub heading
		if( $sub_heading ){
			$return_sub_heading = '<span>' . esc_attr( $sub_heading ) . '</span>';
		} else {
			$return_sub_heading = '';
		}
		
		// heading
		if( $heading || $sub_heading ){
			$return_heading = '<h4>' . $return_sub_heading . '' . esc_attr( $heading ) . '</h4>';
		} else {
			$return_heading = '';
		}

		return '<li>' . $return_heading . '' . $content . '</li>';
	}
}
add_shortcode( 'tc_timeline_item', 'tc_celebrate_timeline' );	

/*------------------------------------------------------------
 * Author Box
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_authorbox' ) ) {
	function tc_celebrate_authorbox( $atts, $content ) { 
		extract( shortcode_atts( array(
			'style'			=> 'style_left_img',
			'size' 			=> 'full',
			'image'			=> '',
			'heading'		=> 'Consult Our Expert',
			), $atts ) );
			
			$content = tc_celebrate_remove_wpautop($content, true);
			
			// heading
			if( $heading  ){
				$return_heading = '<h5>' . esc_attr ( $heading ) . '</h5>';
			} else { 
				$return_heading = '';
			}
			
			// image
			if( $image  ){
				$img_url = wp_get_attachment_image_src( $image,  $size );
			$img_url = $img_url[0];
			$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
				$return_image = '<span class="tc-authorbox-img"><img src="' . $img_url . '" alt="' . $alt . '"></span>';
			} else { 
				$return_image = '';
			}

			if( $style == 'style_right_img' ){
				return '<div class="tc-authorbox tc-authorbox-right-img wpb_custom_element">' . $return_heading . '<div class="tc-authorbox-content"><div class="tc-authorbox-content-inner">' . $content . '</div>' . $return_image . '</div></div>'; 
			 } else {
				return '<div class="tc-authorbox tc-authorbox-left-img wpb_custom_element">' . $return_heading . '<div class="tc-authorbox-content">' . $return_image . '<div class="tc-authorbox-content-inner">' . $content . '</div></div></div>'; 
			}
	} 
}
add_shortcode( 'tc_authorbox', 'tc_celebrate_authorbox' );

/*------------------------------------------------------------
 * Icon Feature - Styled variation
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_icon_feature_var_sc' ) ) {
	function tc_celebrate_icon_feature_var_sc( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			'heading' 				=> '',
			'heading_color'			=> '',
			'return_heading'		=> '',
			'icon_name'   			=> 'no-icon',
			'icon_fontawesome'  	=> 'fa fa-adjust',
			'icon_size'				=> '',
			'icon_color'			=> '',
			'return_icon'			=> '',
			'return_icon_img'		=> '',
			'color'  				=> '',
			'text_align'   			=> 'text-center',
			'return_feature_style'	=> '',
			"return_content" 		=> "",		
			'enable_link' 			=> '', 
			'url'   				=> '',
			'target' 				=> '', 
			'return_target' 		=> '', 
			'feature_button'  		=> '',
			'animation'				=> '',
			'image'					=> '',
			'size' 					=> 'full',
			'bg_color' 				=> '',
			'link_bg_color' 		=> '',
			'no_feature_button' 	=> '',
			'highlight' 			=> '',
			), $atts ) );
	
			$content = tc_celebrate_remove_wpautop($content, true);
			
			// box style
			$add_style = array();
			if ( $bg_color !== '' ) {
				$add_style[] = 'background-color: ' . $bg_color . ';';
			}  
			$add_style = implode('', $add_style);
			if ( $add_style ) {
				$add_style = wp_kses( $add_style, array() );
				$add_style = ' style="' . esc_attr($add_style) . '"';
			}
			
			// link style
			$add_link_style = array();
			if ( $link_bg_color !== '' ) {
				$add_link_style[] = 'background-color: ' . $link_bg_color . ';';
			}  
			$add_link_style = implode('', $add_link_style);
			if ( $add_link_style ) {
				$add_link_style = wp_kses( $add_link_style, array() );
				$add_link_style = ' style="' . esc_attr($add_link_style) . '"';
			}
			
			// image
			if( $image  ){
				$img_url = wp_get_attachment_image_src( $image,  $size );
				$img_url = $img_url[0];
				$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
				$return_image = '<div class="icon-feature-styled-bg" style="background: url(' . $img_url . ') no-repeat"></div>';
			} else { 
				$return_image = '';
			}
			
			// heading style
			$add_heading_style = array();
			if ( $heading_color !== '' ) {
				$add_heading_style[] = 'color: ' . $heading_color . ';';
			}  
			$add_heading_style = implode('', $add_heading_style);
			if ( $add_heading_style ) {
				$add_heading_style = wp_kses( $add_heading_style, array() );
				$add_heading_style = ' style="' . esc_attr($add_heading_style) . '"';
			}
			// heading
			if( $heading != '' ){
				$return_heading = '<h4 class="feature-icon-heading" ' . $add_heading_style . '>' . esc_attr( $heading ) . '</h4>';
			} else {
				$return_heading = '';
			}

			// Icon Style
			$add_icon_style = array();
			if ( $icon_color ) {
				$add_icon_style[] = 'color: '. $icon_color .';';
			}
			if ( $icon_size ) {
				$add_icon_style[] = 'font-size: '. $icon_size .'px;';
			}
			$add_icon_style = implode('', $add_icon_style);
			if ( $add_icon_style ) {
				$add_icon_style = wp_kses( $add_icon_style, array() );
				$add_icon_style = ' style="' . esc_attr($add_icon_style) . '"';
			}
			
			// icon
			if( $icon_name == 'fontawesome' ) {
				$return_icon_img = '<i class="' . esc_attr( $icon_fontawesome ) . '"' . $add_icon_style . '></i>';
			} else {
				$return_icon_img = '';
			}
			tcsn_vc_icon_element_fonts_enqueue( $icon_name );	
			
			// icon
			$return_icon = '<div class="icon-wrapper">' . $return_icon_img . '</div>';

			// url
			if( $url != ''  ) {
				$return_url = ' href="' . esc_url( $url ) . '"';
			} else {
				$return_url = '';
			}
		
			// target
			if( $target == 'blank' ){
				$return_target = ' target="_blank"';
			} elseif( $target == 'self' ){
				$return_target = ' target="_self"';
			} else {
				$return_target = '';
			}
			
			// if link button
			if( $enable_link != 'yes' ) {
				$feature_button 	= '<a class="icon-feature-styled-link" href="' .  esc_url ( $url ) . '"' . $return_target . '' . $add_link_style . '></a>'; 
				$no_feature_button	= ''; 
			} else {
				$feature_button 	= ''; 
				$no_feature_button	= ' tc-no-feature-btn'; 
			}
 
			if( $return_heading != '' ||  $content != '' ){
				$return_content = '<div class="feature-icon-desc"><div class="feature-icon-desc-inner">'. $return_icon .'' . $return_heading . '' . $content . '</div>' . $feature_button . '</div>';
			} else {
				$return_content = '';
			}
			
			// highlight
			if( $highlight == 'yes' ) {
				$return_highlight = 'feature-icon-styled-hover '; 
			} else { 
				$return_highlight = ''; 
			}

			// feature output
			$return_feature_style = '<div class="feature-icon-styled-content feature-icon-top ' .  esc_attr( $text_align ) . '' . esc_attr( $no_feature_button ) . '">' . $return_content . '</div>';			

			return "<div class='{$return_highlight}feature-icon feature-icon-styled wpb_custom_element clearfix {$animation }'{$add_style }>{$return_image}{$return_feature_style}</div>";
	}   
}
add_shortcode( 'tc_icon_feature_var', 'tc_celebrate_icon_feature_var_sc' );

/*------------------------------------------------------------
 * Process
 * @since 1.0
 *------------------------------------------------------------*/
// process wrapper
if( ! function_exists('tc_celebrate_process_wrapper_sc' ) ){
    function tc_celebrate_process_wrapper_sc( $atts, $content = null ) {
		extract( shortcode_atts( array(
			"process_columns"	=> "process-grid-4col",
		), $atts ) );
       return '<div class="tc-process-wrapper ' . $process_columns . '">'.do_shortcode($content).'</div>';
    }
    add_shortcode('tc_process_wrapper', 'tc_celebrate_process_wrapper_sc');
}
// process item
if ( ! function_exists( 'tc_celebrate_process_sc' ) ) {
	function tc_celebrate_process_sc( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			"heading" 				=> "",
			"return_heading"		=> "",
			"sub_heading" 			=> "",
			"return_sub_heading"	=> "",
			"image_type" 			=> "type_icon",
			"type_img" 				=> "",
			"type_icon" 			=> "",
			'icon_name'   			=> 'no-icon',
			'icon_fontawesome'  	=> 'fa fa-adjust',
			"return_icon" 			=> "",
			"icon_color"			=> "",
			"icon_bg" 				=> "",
			"image" 				=> "",
			"return_icon" 			=> "",
			"return_image"			=> "",
			"number" 				=> "",
			"return_number" 		=> "",
			"heading_color"			=> "",
			"sub_heading_color"		=> "",
			"color"  				=> "",
		), $atts ) );
	
			$content = tc_celebrate_remove_wpautop( $content, true );
			// color
			$add_feature_style = array();
			if ( $color !== '' ) {
				$add_feature_style[] = 'color: ' . $color . ';';
			}  
			$add_feature_style = implode('', $add_feature_style);
			if ( $add_feature_style ) {
				$add_feature_style = wp_kses( $add_feature_style, array() );
				$add_feature_style = ' style="' . esc_attr($add_feature_style) . '"';
			}
			
			// heading style
			$add_heading_style = array();
			if ( $heading_color !== '' ) {
				$add_heading_style[] = 'color: ' . $heading_color . ';';
			}  
			$add_heading_style = implode('', $add_heading_style);
			if ( $add_heading_style ) {
				$add_heading_style = wp_kses( $add_heading_style, array() );
				$add_heading_style = ' style=" ' . esc_attr( $add_heading_style ) . '"';
			}
			// heading
			if( $heading != '' ){
				$return_heading = '<h5 class="tc-process-heading"' . $add_heading_style . '>' . esc_attr( $heading ) . '</h5>';
			} else {
				$return_heading = '';
			}
			
			// heading style
			$add_sub_heading_style = array();
			if ( $sub_heading_color !== '' ) {
				$add_sub_heading_style[] = 'color: ' . $sub_heading_color . ';';
			}  
			$add_sub_heading_style = implode('', $add_sub_heading_style);
			if ( $add_sub_heading_style ) {
				$add_sub_heading_style = wp_kses( $add_sub_heading_style, array() );
				$add_sub_heading_style = ' style=" ' . esc_attr( $add_sub_heading_style ) . '"';
			}
			// heading
			if( $sub_heading != '' ){
				$return_sub_heading = '<p class="tc-process-tagline"' . $add_sub_heading_style . '>' . esc_attr( $sub_heading ) . '</p>';
			} else {
				$return_sub_heading = '';
			}
			
			// Icon Style
			$add_icon_style = array();
			if ( $icon_color ) {
				$add_icon_style[] = 'color: '. $icon_color .';';
			}
			if ( $icon_bg ) {
				$add_icon_style[] = 'background-color: '. $icon_bg .'; border-color: '. $icon_bg .';';
			}
			$add_icon_style = implode('', $add_icon_style);
			if ( $add_icon_style ) {
				$add_icon_style = wp_kses( $add_icon_style, array() );
				$add_icon_style = ' style="' . esc_attr($add_icon_style) . '"';
			}
			
			// icon
			if( $icon_name == 'fontawesome' ) {
				$return_icon = '<i class="' . esc_attr( $icon_fontawesome ) . '"></i>';
			} else {
				$return_icon = '';
			}
			tcsn_vc_icon_element_fonts_enqueue( $icon_name );	

			// image / icon
			if( $image_type == 'type_img' ){
				$img_url  = wp_get_attachment_url($image);
				$alt = get_post_meta( $image, '_wp_attachment_image_alt', true );
				$image = $img_url;
			$return_image = '<div class="process-img-wrapper"><div class="process-img"' . $add_icon_style . '><img src="'. $image. '" alt="' . esc_attr( $alt ) . '" ></div></div>';
			} elseif ( $image_type == 'type_icon' ) {
				$return_image = '<div class="process-img-wrapper"><div class="process-img"' . $add_icon_style . '>' . $return_icon . '</div></div>';
			} else {
				$return_image = '';	
			}

			return '<div class="tc-process-item wpb_custom_element">' . $return_image . '<div class="process-content"' .$add_feature_style . '>' . $return_heading. '' . $return_sub_heading. '' .$content . '</div></div>';
	}
}
add_shortcode( 'tc_process_item', 'tc_celebrate_process_sc' );	

/*------------------------------------------------------------
 * Screenshot carousel
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_screenshot_sc' ) ) {
    function tc_celebrate_screenshot_sc($atts, $content) {
		extract( shortcode_atts( array(
		"images" 		=> "",
		"size"			=> "full",
		"return_size"	=> "",
		"hard_crop"		=> "",
		"img_width"		=> "",
		"img_height"	=> "",
		"return_width"	=> "",
		"return_height"	=> "",
		"zoom"			=> "",
		"return_zoom"	=> "",
		'scale'			=> '',
		"nav_controls"	=> "tc-only-pagination",
		'animation'		=> '', 
		), $atts ) );
	
		//on hover image scale
		if( $scale != 'yes' ) {
			$return_scale = ' tc-img-scale';
		} else {
			$return_scale = '';
		}
		
		if( $hard_crop == 'yes' ){
			$return_crop = ' true';
		} else {
			$return_crop = '';
		}
		
		if( $hard_crop == 'yes' && $img_width == '' ){
			$return_width = '600';
		} else {
			$return_width = $img_width;
		}
		
		if( $hard_crop == 'yes' && $img_height == '' ){
			$return_height = '400';
		} else {
			$return_height = $img_height;
		}
		
		if( $hard_crop == 'yes' ){
			$return_size = 'full';
		} else {
			$return_size =  $size;
		} 
		
        $output = "";
        $output .= '<div class="owl-carousel tc-screenshot-carousel tcsn-theme wpb_custom_element ' . esc_attr( $nav_controls ) . ' ' . esc_attr( $animation ) . '">';
        if($images != '' ) {
            $screenshot_images_array = explode(',',$images);
        }
        if(isset($screenshot_images_array) && count($screenshot_images_array) != 0) {
			$i = 0;
            foreach($screenshot_images_array as $screenshot_img_id) {
                $screenshot_image_src = wp_get_attachment_image_src( $screenshot_img_id,$size,true );
				$image_src  = $screenshot_image_src[0];
				$alt = get_post_meta( $screenshot_img_id, '_wp_attachment_image_alt', true );
                $output .= '<div class="item clearfix"><div class="tc-screenshot-item' . esc_attr( $return_scale ) . '">';
				if($zoom != 'yes') {
					$return_zoom = '<a class="tc-media-zoom" href="' . esc_url( $image_src ) . '" title=" ' . esc_attr( $alt ) . '" data-rel="prettyPhoto"></a>';
				}
				if( $hard_crop == 'yes' ){
					$image_crop_src  = aq_resize( $screenshot_image_src[0], $return_width, $return_height, $return_crop );
					$output .= '<div class="tc-hover-image">' . $return_zoom . '<img width="' . $return_width . '" height="' . $return_height . '" src="' . esc_url( $image_crop_src ) . '" alt="' . esc_attr( $alt ) . '"/></div>';
				}  else {
					$output .= '<div class="tc-hover-image"><img src="' .  esc_url( $image_src ) . '" alt="' . esc_attr( $alt ) . '" />' . $return_zoom . '</div>';
				}
				$output .= '</div></div>';
				$i++;
            }
        }
        $output .= '</div>';
        return $output;
    }
	add_shortcode('tc_screenshot', 'tc_celebrate_screenshot_sc');
}

/*------------------------------------------------------------
 * CTA Box
 * @since 1.0
 *------------------------------------------------------------*/
if ( ! function_exists( 'tc_celebrate_cta_box_sc' ) ) {
	function tc_celebrate_cta_box_sc( $atts, $content = null ) { 
		extract( shortcode_atts( array(
			'style'  		 		=> '',
			'return_style'			=> '',
			'box_bg'    			=> '', 
			'box_padding'    		=> '',
			'border_width'    		=> '', 
			'border_color'    		=> '', 
			'font_color'      		=> '',
			'heading'				=> '',
			'return_heading'   		=> '',
			'heading_color'   		=> '',
			'heading_size'   		=> '',
			'animation'  			=> '',
			'button_content'		=> 'Link', 
			'icon_name'   			=> 'no-icon',
			'icon_fontawesome'  	=> 'fa fa-adjust',
			'icon_position'   		=> 'icon-left', 
			'style'  				=> 'classic', 
			'shape'  				=> 'square',
			'size'  				=> 'medium',
			'color'  				=> 'default',
			'target' 				=> '', 
			'return_target' 		=> '', 
			'url'   				=> '',
			), $atts ) );
			
			$content = wpb_js_remove_wpautop($content, true);
			// main style
			if( $style == '') {
				$return_style = '';
			} elseif ( $style == 'centered' )  {
				$return_style = ' cta-center';
			}
			// box style
			$add_box_style = array();
			if ( $box_padding ) {
				$add_box_style[] = ' padding: ' . $box_padding . ';';
			} 
			if ( $box_bg ) {
				$add_box_style[] = ' background: ' . $box_bg . ';';
			} 
			if ( $font_color ) {
				$add_box_style[] = ' color: ' . $font_color . ';';
			} 
			if ( $border_width ) {
				$add_box_style[] = ' border-width: ' . $border_width . ';';
			} 
			if ( $border_color ) {
				$add_box_style[] = ' border-color: ' . $border_color . ';';
			} 
			$add_box_style = implode('', $add_box_style);
			if ( $add_box_style ) {
				$add_box_style = wp_kses( $add_box_style, array() );
				$add_box_style = ' style="' . esc_attr($add_box_style) . '"';
			} 
			// heading style
			$add_heading_style = array();
			if ( $heading_color ) {
				$add_heading_style[] = ' color: ' . $heading_color . ';';
			}  
			if ( $heading_size ) {
				$add_heading_style[] = ' font-size: ' . $heading_size . ';';
			}  
			$add_heading_style = implode('', $add_heading_style);
			if ( $add_heading_style ) {
				$add_heading_style = wp_kses( $add_heading_style, array() );
				$add_heading_style = ' style="' . esc_attr($add_heading_style) . '"';
			}

			// heading
			if( $heading != '' ){
				$return_heading = '<h4 class="cta-heading"' . $add_heading_style . '>' . esc_attr( $heading ) . '</h4>';
			} else {
				$return_heading = '';
			}
			
			// style
			if( $style ) {
				$style = ' themebtn-' . esc_attr( $style ) . '';
			} 
			
			// size
			if( $size ) {
				$size = ' themebtn-' . esc_attr( $size ) . '';
			} 
			
			// shape
			if( $shape ) {
				$shape = ' themebtn-' . esc_attr( $shape ) . '';
			} 
			
			// color
			if( $color ) {
				$color = ' themebtn-' . esc_attr( $color ) . '';
			} 
			
			// icon name
			if( $icon_name == 'fontawesome' ) {
				$return_icon = '<span class="themebtn-icon"><i class="' . esc_attr( $icon_fontawesome ) . '"></i></span>';
			} else {
				$return_icon = '';
			}
			tcsn_vc_icon_element_fonts_enqueue( $icon_name );	
			
			// icon name
			if( $button_content ) {
				$return_btn_text = '<span class="themebtn-label">' . esc_attr( $button_content ) . '</span>';
			} else {
				$return_btn_text = '';
			}
			
			// icon_position
			if( $icon_name == 'fontawesome' ) {
				$icon_position = ' themebtn-' . esc_attr( $icon_position ) . '';
			} else { 
				$icon_position = ''; 
			}
			
			if( $button_content == '' &&  $icon_name ) {
				$icon_only = ' themebtn-icon-only';
			} else { 
				$icon_only = ''; 
			}
			 
			// url
			if( $url != ''  ) {
				$return_url = ' href="' . esc_url( $url ) . '"';
			} else {
				$return_url = '';
			}
		
			// target
			if( $target == 'blank' ){
				$return_target = ' target="_blank"';
			} elseif( $target == 'self' ){
				$return_target = ' target="_self"';
			} else {
				$return_target = '';
			}
				
			// button
			if ( $button_content != '' ) {
			$return_button = '<a class="themebtn' . esc_attr( $icon_position ) . esc_attr( $style ) . esc_attr( $shape ) . esc_attr( $size ) . esc_attr( $color ) .  esc_attr( $icon_only ) .'"' . $return_target . ' ' . $return_url . '>'. $return_icon . $return_btn_text .'</a>';
			} else {
				$return_button = '';
			}

			return '<div class="tc-cta-box' . esc_attr( $return_style ) . ' wpb_custom_element ' . esc_attr( $animation ) . '"' . $add_box_style . '><div class="cta-left">' . $return_heading . '' . $content . '</div><div class="cta-right">' . $return_button . '</div><div class="clearfix"></div></div>';
	}
	add_shortcode( 'tc_cta_box', 'tc_celebrate_cta_box_sc' );
}