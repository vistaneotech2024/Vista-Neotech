<?php
/**
 * The Footer for theme.
 */
$celebrate_show_footer    		= celebrate_option( 'celebrate_show_footer', true, true ) ? true : false;
$celebrate_show_copyright 		= celebrate_option( 'celebrate_show_copyright', true, true ) ? true : false;
$celebrate_show_take_top  		= celebrate_option( 'celebrate_show_take_top', true, true ) ? true : false; 
$celebrate_show_footer_overlay	= celebrate_option( 'celebrate_show_footer_overlay', true, true ) ? true : false; 
$celebrate_footer_first_col 	= celebrate_option( 'celebrate_footer_first_col' );
$celebrate_footer_second_col 	= celebrate_option( 'celebrate_footer_second_col' );
$celebrate_footer_third_col 	= celebrate_option( 'celebrate_footer_third_col' );
$celebrate_footer_fourth_col 	= celebrate_option( 'celebrate_footer_fourth_col' );
?>
<?php if ( $celebrate_show_footer ) : ?>
<?php if ( is_active_sidebar( 'footer-column-1' ) || is_active_sidebar( 'footer-column-2' ) || is_active_sidebar( 'footer-column-3' ) || is_active_sidebar( 'footer-column-4' ) ) { ?>
<footer id="footer">
	<?php if ( $celebrate_show_footer_overlay ) { ?>
	<span class="tc-footer-overlay"></span>
	<?php } ?>
	<div class="main-container">
		<div class="row">
			<?php
		// get footer columns
		if ( celebrate_option( 'celebrate_columns_footer' ) ) { 
			$footer_columns = celebrate_option( 'celebrate_columns_footer' ); 
		} else { 
			$footer_columns = '3'; 
		}
		
		if( $footer_columns == '1' ){
			$footer_columns_class = 'col-md-12 col-sm-12 col-xs-12 ';
			$footer_column_col1 = '';
			$footer_column_col2 = '';
		} elseif( $footer_columns == '2' ){
			$footer_columns_class = 'col-md-6 col-sm-6 col-xs-12 ';
			$footer_column_col1 = '';
			$footer_column_col2 = '';
		} elseif( $footer_columns == '3' ){
			$footer_columns_class = 'col-md-4 col-sm-4 col-xs-12 ';
			$footer_column_col1 = '';
			$footer_column_col2 = '';
		} elseif( $footer_columns == '4' ){
			$footer_columns_class = 'col-md-3 col-sm-3 col-xs-12 ';
			$footer_column_col1 = '';
			$footer_column_col2 = '';
		} elseif( $footer_columns == '5' ){
			$footer_columns_class = '';
			$footer_column_col1 = 'col-md-3 col-sm-3 col-xs-12 ';
			$footer_column_col2 = 'col-md-6 col-sm-6 col-xs-12 ';
		} elseif( $footer_columns == '6' ){
			$footer_columns_class = '';
			$footer_column_col1 = 'col-md-3 col-sm-3 col-xs-12 ';
			$footer_column_col2 = 'col-md-9 col-sm-9 col-xs-12 ';
		} else {
			$footer_columns_class = 'col-md-12 col-sm-12 col-xs-12 ';
		}
		?>
			<?php if( is_active_sidebar( 'footer-column-1' ) && $footer_columns == '1' || $footer_columns == '2' || $footer_columns == '3' || $footer_columns == '4' || $footer_columns == '5' || $footer_columns == '6' ) { ?>
			<div class="<?php echo esc_attr( $footer_columns_class );?><?php echo esc_attr( $footer_column_col1 );?><?php echo esc_attr( $celebrate_footer_first_col );?>">
				<?php if ( function_exists('dynamic_sidebar') && dynamic_sidebar('footer-column-1') ) ?>
			</div>
			<?php } // widgets area 1 ?>
			<?php if( is_active_sidebar( 'footer-column-2' ) && $footer_columns == '2' || $footer_columns == '3' || $footer_columns == '4' || $footer_columns == '5' || $footer_columns == '6' ) { ?>
			<div class="<?php echo esc_attr( $footer_columns_class );?><?php echo esc_attr( $footer_column_col2 );?><?php echo esc_attr( $celebrate_footer_second_col );?>">
				<?php if ( function_exists('dynamic_sidebar') && dynamic_sidebar('footer-column-2') ) ?>
			</div>
			<?php } // widgets area 2 ?>
			<?php if( is_active_sidebar( 'footer-column-3' ) && $footer_columns == '3' || $footer_columns == '4' || $footer_columns == '5' ) { ?>
			<div class="<?php echo esc_attr( $footer_columns_class );?><?php echo esc_attr( $footer_column_col1 );?><?php echo esc_attr( $celebrate_footer_third_col );?>">
				<?php if ( function_exists('dynamic_sidebar') && dynamic_sidebar('footer-column-3') ) ?>
			</div>
			<?php } // widgets area 3 ?>
			<?php if( is_active_sidebar( 'footer-column-4' ) && $footer_columns == '4' ) { ?>
			<div class="<?php echo esc_attr( $footer_columns_class );?><?php echo esc_attr( $celebrate_footer_fourth_col );?>">
				<?php if ( function_exists('dynamic_sidebar') && dynamic_sidebar('footer-column-4') ) ?>
			</div>
			<?php } // widgets area 4 ?>
		</div>
	</div>
</footer>
<!-- #footer -->
<?php } ?>
<?php endif; ?>
<?php if ( $celebrate_show_copyright &&  is_active_sidebar( 'widgets-copyright-1' ) || is_active_sidebar( 'widgets-copyright-2' ) ) : ?>
<div id="copyright">
	<div class="main-container">
		<div class="row">
			<?php
$celebrate_copyright_columns = celebrate_option( 'celebrate_copyright_columns' );
switch ($celebrate_copyright_columns) {
case 1:
$class = 'col-md-12 col-sm-12 col-xs-12';
break;

case 2:
$class = 'col-md-6 col-sm-6 col-xs-12';
break;
}
for ($i = 1; $i <= $celebrate_copyright_columns; $i++) {
echo "<div class='$class'>";
if ( is_active_sidebar( 'widgets-copyright-'.$i ) ) {  dynamic_sidebar('Copyright-Column-'.$i); } 
echo "</div>";
}
?>
		</div>
	</div>
</div>
<a href="https://api.whatsapp.com/send/?phone=919811190082&text=Hi&type=phone_number&app_absent=0" style="position: fixed; z-index: 999999; bottom: 20px; left: 10px;"><img src="https://vistaneotech.com/wp-content/uploads/2026/01/whatsapp_logo1.png" width="50px" /></a>
<!-- #copyright -->
<?php endif; ?>
<?php if ( $celebrate_show_take_top ) { ?>
<!--<a id="take-to-top" href="#"></a>-->
<?php } ?>
</div>

<!-- #wrapper -->
<?php wp_footer(); ?>
</body></html>