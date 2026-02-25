<?php
/**
 * The Ajax Cart Icon and item number
 */
if ( celebrate_is_woocommerce_activated() ) { ?>
<div class="cart-items-wrapper"><a href="<?php echo  WC()->cart->get_cart_url(); ?>" title="<?php esc_html_e('View your shopping cart', 'celebrate'); ?>"><div class="cart-items"><?php echo sprintf(_n('<span class="item-number">%d</span>', '<span class="item-number">%d</span>',  WC()->cart->cart_contents_count, 'celebrate'),  WC()->cart->cart_contents_count);?></div></a></div>
<?php } ?>