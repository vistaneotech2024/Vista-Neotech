<?php
/**
 * The template for displaying comments.
 */
/*
 * If the current post is password protected and the visitor has not yet
 * entered password, will return early without loading the comments.
 */
if ( post_password_required() )
	return;
?>
<?php if ( comments_open() ) : ?>
<div id="comments" class="comments-area clearfix">
	<?php if ( have_comments() ) : ?>
	<h5 class="comments-title">
		<?php
			printf( _n( '<span class="comment-highlight">1 Comment</span>', '<span class="comment-highlight">%1$s Comments</span>', get_comments_number(), 'celebrate' ),
				number_format_i18n( get_comments_number() ), get_the_title() );
		?>
	</h5>
	<?php endif; ?>
	<?php if ( have_comments() ) : ?>
	<ul class="commentlist">
		<?php
			wp_list_comments( array(
				'style'       => 'ul',
				'avatar_size' => 90,
				'callback'    => 'celebrate_comment',
			) );
			?>
	</ul>
	<?php endif; ?>
	<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
	<nav class="tcsn-post-navigation clearfix">
	<ul class="tcsn-post-nav">
			<li>
				<?php $prev_text = esc_html__( 'Previous Comments', 'celebrate' ); ?>
				<?php previous_comments_link( '<h5><span class="tcsn-previous-link"><span class="tcsn-prev"> ' . $prev_text . '</span></span></h5>' ); ?>
			</li>
			<li>
				<?php $next_text = esc_html__( 'Next Comments', 'celebrate' ); ?>
				<?php next_comments_link( '<h5><span class="tcsn-next-link"><span class="tcsn-next">' . $next_text . ' </span></span></h5>' ); ?>
			</li>
		</ul>
	</nav>
	<?php endif; ?>
	<?php if ( ! comments_open() && get_comments_number() ) : ?>
	<p class="no-comments">
		<?php esc_html_e( 'Comments are closed.' , 'celebrate' ); ?>
	</p>
	<?php endif; ?>
	<?php
	$commenter = wp_get_current_commenter();
	$req = get_option( 'require_name_email' );
	$aria_req = ( $req ? " aria-required='true'" : '' );
	$form_name = esc_html__( 'Name (required)', 'celebrate' );
	$form_email = esc_html__( 'Email (required)', 'celebrate' );
	$form_website = esc_html__( 'Website (if any)', 'celebrate' );
	$form_comment = esc_html__( 'Comment here', 'celebrate' );
	$fields =  array(
		'author' =>
		'<p class="comment-form-author"><label for="author">' . esc_html__( 'Name', 'celebrate' ) . '</label> ' .
		'<input id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) .
		'" size="30"' . $aria_req . ' placeholder="' .  esc_attr($form_name) . '"/></p>',
    	'email' =>
		'<p class="comment-form-email"><label for="email">' . esc_html__( 'Email', 'celebrate' ) . '</label> ' .
		'<input id="email" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) .
		'" size="30"' . $aria_req . ' placeholder="' .  esc_attr($form_email) . '"/></p>',
		'url' =>
		'<p class="comment-form-url"><label for="url">' . esc_html__( 'Website (if any)', 'celebrate' ) . '</label>' .
		'<input id="url" name="url" type="text" value="' . esc_attr( $commenter['comment_author_url'] ) .
		'" size="30" placeholder="' .  esc_attr($form_website) . '"/></p><div class="clearfix"></div>',
	);

	$comments_args = array(
		'fields' => $fields,
				'title_reply'       => esc_html__( 'Leave a Reply', 'celebrate' ),
				'label_submit' => esc_html__('Post comment','celebrate'),
				'comment_field' =>  '<p class="comment-form-comment"><label for="comment">' . _x( 'Comment', 'noun', 'celebrate' ) .
		'</label><textarea id="comment" name="comment" cols="45" rows="6" aria-required="true" placeholder="' . $form_comment . '">' .
		'</textarea></p>',
				'comment_notes_before' => '',
				'comment_notes_after' => '',
		);
	comment_form($comments_args); ?>
</div>
<!-- comment form -->
<?php endif; ?>