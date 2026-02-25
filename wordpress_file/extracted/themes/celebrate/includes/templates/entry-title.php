<?php
/**
 * The Title for page / post 
 */
?>
<?php if ( is_single() ) : ?>
<h4 class="post-title entry-title">
  <?php the_title(); ?>
</h4>
<?php elseif ( is_page() ) : ?>
<h4 class="post-title entry-title no-display"></h4>
<?php else : ?>
<h4 class="post-title entry-title"><a href="<?php the_permalink(); ?>" rel="bookmark">
  <?php the_title(); ?>
  </a></h4>
<?php endif; ?>