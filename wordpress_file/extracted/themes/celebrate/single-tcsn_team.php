<?php
/**
 * The template for displaying team member single post.
 */
get_header(); ?>
<?php $celebrate_page_header_team 	= celebrate_option( 'celebrate_page_header_team', true, true ) ? true : false; 
$celebrate_show_breadcrumb        	= celebrate_option( 'celebrate_show_breadcrumb', true, true ) ? true : false;
$celebrate_team_predefined_content	= celebrate_option( 'celebrate_team_predefined_content', true, true ) ? true : false; 
?>
<?php if( $celebrate_page_header_team ) { ?>
<div id="page-header">
	<div class="main-container clearfix">
		<div class="tc-page-info">
			<h3 class="page-title entry-title">
				<?php the_title(); ?>
			</h3>
		</div>
		<?php if( $celebrate_show_breadcrumb ) { get_template_part( 'includes/templates/headers/breadcrumb' ); } ?>
	</div>
</div>
<?php } ?>
<div id="content-wrapper" class="main-container clearfix fullwidth">
	<div id="primary" class="content-area">
		<div id="content-main" class="<?php echo esc_attr( celebrate_get_padding_classes() ); ?>" role="main">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<div class="row tc-team tc-team-single">
					<?php if( $celebrate_team_predefined_content ) { ?>
					<div class="col-md-3 col-sm-3 col-xs-12">
						<?php if ( has_post_thumbnail() ) { ?>
						<div class="tc-member-image">
							<?php the_post_thumbnail(); ?>
						</div>
						<?php } ?>
						<?php 
				$member_job         = get_post_meta( get_the_ID(), '_celebrate_member_job', true );
				$member_email       = get_post_meta( get_the_ID(), '_celebrate_member_email', true ); 
				$member_email_link  = get_post_meta( get_the_ID(), '_celebrate_member_email_link', true ); 
				$member_behance     = get_post_meta( get_the_ID(), '_celebrate_member_behance', true ); 
				$member_blogger     = get_post_meta( get_the_ID(), '_celebrate_member_blogger', true );      
				$member_delicious   = get_post_meta( get_the_ID(), '_celebrate_member_delicious', true );    
				$member_dribbble    = get_post_meta( get_the_ID(), '_celebrate_member_dribbble', true ); 
				$member_dropbox     = get_post_meta( get_the_ID(), '_celebrate_member_dropbox', true );       
				$member_facebook    = get_post_meta( get_the_ID(), '_celebrate_member_facebook', true );       
				$member_flickr      = get_post_meta( get_the_ID(), '_celebrate_member_flickr', true );   
				$member_github  	= get_post_meta( get_the_ID(), '_celebrate_member_github', true );        
				$member_googleplus  = get_post_meta( get_the_ID(), '_celebrate_member_googleplus', true );
				$member_instagram   = get_post_meta( get_the_ID(), '_celebrate_member_instagram', true );
				$member_linkedin    = get_post_meta( get_the_ID(), '_celebrate_member_linkedin', true );  
				$member_medium      = get_post_meta( get_the_ID(), '_celebrate_member_medium', true );        
				$member_paypal      = get_post_meta( get_the_ID(), '_celebrate_member_paypal', true );           
				$member_pinterest   = get_post_meta( get_the_ID(), '_celebrate_member_pinterest', true ); 
				$member_reddit   	= get_post_meta( get_the_ID(), '_celebrate_member_reddit', true );         
				$member_skype       = get_post_meta( get_the_ID(), '_celebrate_member_skype', true );              
				$member_soundcloud  = get_post_meta( get_the_ID(), '_celebrate_member_soundcloud', true ); 
				$member_stumbleupon	= get_post_meta( get_the_ID(), '_celebrate_member_stumbleupon', true ); 
				$member_tumblr      = get_post_meta( get_the_ID(), '_celebrate_member_tumblr', true );             
				$member_twitter     = get_post_meta( get_the_ID(), '_celebrate_member_twitter', true );              
				$member_vimeo       = get_post_meta( get_the_ID(), '_celebrate_member_vimeo', true );           
				$member_youtube     = get_post_meta( get_the_ID(), '_celebrate_member_youtube', true ); 
				$member_vine        = get_post_meta( get_the_ID(), '_celebrate_member_vine', true );          
				$member_mail        = get_post_meta( get_the_ID(), '_celebrate_member_mail', true ); 
			?>
						<div class="tc-member-content">
							<h5 class="tc-member-name">
								<?php the_title(); ?>
							</h5>
							<span class="tc-member-job"><?php echo esc_attr( $member_job ); ?></span>
							<ul class="tc-social tc-social-mini clearfix">
								<?php if( $member_behance != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_behance ) ?>" class="behance" target="_blank" title="behance"></a></li>
								<?php } ?>
								<?php if( $member_delicious != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_delicious ) ?>" class="delicious" target="_blank" title="delicious"></a></li>
								<?php } ?>
								<?php if( $member_dribbble != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_dribbble ) ?>" class="dribbble" target="_blank" title="dribbble"></a></li>
								<?php } ?>
								<?php if( $member_dropbox != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_dropbox ) ?>" class="dropbox" target="_blank" title="dropbox"></a></li>
								<?php } ?>
								<?php if( $member_facebook != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_facebook ) ?>" class="facebook" target="_blank" title="facebook"></a></li>
								<?php } ?>
								<?php if( $member_flickr != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_flickr ) ?>" class="flickr" target="_blank" title="flickr"></a></li>
								<?php } ?>
								<?php if( $member_github != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_github ) ?>" class="github" target="_blank" title="github"></a></li>
								<?php } ?>
								<?php if( $member_googleplus != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_googleplus ) ?>" class="googleplus" target="_blank" title="googleplus"></a></li>
								<?php } ?>
								<?php if( $member_instagram != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_instagram ) ?>" class="instagram" target="_blank" title="instagram"></a></li>
								<?php } ?>
								<?php if( $member_linkedin != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_linkedin ) ?>" class="linkedin" target="_blank" title="linkedin"></a></li>
								<?php } ?>
								<?php if( $member_medium != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_medium ) ?>" class="medium" target="_blank" title="medium"></a></li>
								<?php } ?>
								<?php if( $member_paypal != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_paypal ) ?>" class="paypal" target="_blank" title="paypal"></a></li>
								<?php } ?>
								<?php if( $member_pinterest != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_pinterest ) ?>" class="pinterest" target="_blank" title="pinterest"></a></li>
								<?php } ?>
								<?php if( $member_reddit != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_reddit ) ?>" class="reddit" target="_blank" title="reddit"></a></li>
								<?php } ?>
								<?php if( $member_skype != ''  ) { ?>
								<li><a href="skype:<?php echo esc_url( $member_skype ) ?>?chat" class="skype" target="_blank" title="skype"></a></li>
								<?php } ?>
								<?php if( $member_soundcloud != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_soundcloud ) ?>" class="soundcloud" target="_blank" title="soundcloud"></a></li>
								<?php } ?>
								<?php if( $member_stumbleupon != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_stumbleupon ) ?>" class="stumbleupon" target="_blank" title="stumbleupon"></a></li>
								<?php } ?>
								<?php if( $member_tumblr != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_tumblr ) ?>" class="tumblr" target="_blank" title="tumblr"></a></li>
								<?php } ?>
								<?php if( $member_twitter != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_twitter ) ?>" class="twitter" target="_blank" title="twitter"></a></li>
								<?php } ?>
								<?php if( $member_vimeo != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_vimeo ) ?>" class="vimeo" target="_blank" title="vimeo"></a></li>
								<?php } ?>
								<?php if( $member_youtube != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_youtube ) ?>" class="youtube" target="_blank" title="youtube"></a></li>
								<?php } ?>
								<?php if( $member_vine != ''  ) { ?>
								<li><a href="<?php echo esc_url( $member_vine ) ?>" class="vine" target="_blank" title="vine"></a></li>
								<?php } ?>
								<?php if( $member_mail != ''  ) { ?>
								<li><a href="mailto:<?php echo esc_attr( $member_mail ) ?>" class="mail" target="_blank" title="mail"></a></li>
								<?php } ?>
							</ul>
						</div>
					</div>
					<?php } ?>
					<div class="col-md-9 col-sm-9 col-xs-12">
						<?php the_content(); ?>
					</div>
					
				</div>
			</article>
			<?php celebrate_post_nav(); ?>
			<?php endwhile; endif; ?>
		</div>
	</div>
	<!-- #primary --> 
</div>
<!-- #content wrapper -->
<?php get_footer(); ?>