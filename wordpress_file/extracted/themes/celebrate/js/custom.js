// JavaScript Document for celebrate	
//   function disableclick(event){
//            if(event.button==2){ // this value is 3 for some othe browser
//             // Rest of code
//          return false;    
//        }
//     }
// document.body.onclick = disableclick()





jQuery(function($) {

	// Use strict 
	"use strict";

	$(document).ready(function (){

		// Tooltip
		$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});

		// Responsive menu
		$('#tc-header-primary .sf-menu').slicknav({
			label:"",
			prependTo:'#responsive-menu'
		});
		
		// Sticky menu
		function headerSticky(){
			var windowWidth=$(window).width();
			var windowPos=$(window).scrollTop();
			if(windowPos>320 && windowWidth>992){
				$('#header-sticky').fadeIn(300);
			} else {
			$('#header-sticky').slideUp(300);
			}
		}
		headerSticky();
		$(window).scroll(headerSticky);
		$(window).resize(headerSticky);

		// search on click
		function tcsnSearchInit(){
			var $searchbar = $('.tc-header-search');
			var $searchtrigger = $('#tc-trigger');
			$searchtrigger.on('click', function () {
				$searchbar.fadeIn(300);
			})
			$(document).click(function(){  
 				$searchbar.fadeOut(300);
  			});
		}
		tcsnSearchInit();
		
		$('#tc-trigger, .tc-header-search').click(function(e) { 
  			e.stopPropagation();
 		})

		// Custom Selects
		$(".woocommerce-ordering .orderby, #calc_shipping_country, #dropdown_product_cat, .wpcf7-select, .widget_archive select, .widget_categories select, .dropdown_layered_nav_size, .dropdown_product_cat").select2(); 
 
		// Custom Recent Post Widget
		$('.custom-recent-entries').isotope({
			itemSelector	: '.custom-recent-entries li',
			resizable		: true,
			layoutMode      : 'fitRows',
		});
		
		// Isotope - Portfolio
		$('.tc-portfolio-grid').isotope({
			itemSelector	: '.tc-portfolio-item',
			resizable		: true,
			 masonry: {}
		});
		
		// Isotope - Search
		var $container_search = $('.mssearch-content');
		$container_search.imagesLoaded(function () {
			$container_search.isotope({
				itemSelector: '.mssearch-item',
				// layoutMode : 'fitRows',
				 masonry: {}
			});
		});
	
		// Isotope - Portfolio 	
		$(function(){	
			var $container = $('.tc-portfolio-grid');
			$container.imagesLoaded(function () {
			$container.isotope({
			itemSelector: '.tc-portfolio-item',
			masonry: {},
			});
			});
			$('.tc-filter-nav a').on('click', function () {
			$('.tc-filter-nav a').removeClass('active');
			$(this).addClass('active');
			var selector = $(this).attr('data-filter');
			$container.isotope({
			filter: selector
			});
			return false;
			});
		});
		
		//prettyPhoto
		$('a[data-rel]').each(function () {
			$(this).attr('rel', $(this).data('rel'));
		});
		$("a[rel^='prettyPhoto'],a[rel^='prettyPhoto[gallery]']").prettyPhoto({
			animation_speed: 'fast',
			slideshow: 5000,
			autoplay_slideshow: false,
			opacity: 0.80,
			show_title: true,
			theme: 'pp_default',
			/* light_rounded / dark_rounded / light_square / dark_square / facebook */
			overlay_gallery: false,
			social_tools: false,
			changepicturecallback: function () {
			var $pp = $('.pp_default');
			if (parseInt($pp.css('left')) < 0) {
			$pp.css('left', 0);
			}
			}
		});

		// Owl carousel for portfolio
		$('.owl-carousel.tc-portfolio-carousel').owlCarousel({
			loop:$(".owl-carousel.tc-portfolio-carousel > .item").length <= 3 ? false : true,
    		margin: 30,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 3,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:3
				}
			}, // owl settings
			onInitialized: function() {
				setTimeout(function(){
					$("a[rel^='prettyPhoto']").prettyPhoto({
						animation_speed: 'fast',
						slideshow: 5000,
						autoplay_slideshow: false,
						opacity: 0.80,
						show_title: true,
						theme: 'pp_default',
						overlay_gallery: false,
						social_tools: false,
						changepicturecallback: function () {
						var $pp = $('.pp_default');
						if (parseInt($pp.css('left')) < 0) {
						$pp.css('left', 0);
						}
						}
					}); // prettyPhoto
				},100);
        	} // img zoom in owl
		}); // portfolio
		
		// Owl carousel for team
		$('.owl-carousel.tc-team-carousel').owlCarousel({
			loop: false,
    		margin: 30,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 3,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:3
				}
			}
		}); // team
		
		$('.owl-carousel.tc-team-two-col-carousel').owlCarousel({
			loop: false,
    		margin: 30,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 2,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:2
				}
			}
		}); // team

		// Owl carousel for testimonials
		$('.owl-carousel.tc-testimonial-carousel').owlCarousel({
			loop: true,
    		margin: 0,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 1,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
		}); // testimonials
		
		// Owl carousel for team
		$('.owl-carousel.tc-testimonial-carousel-2col').owlCarousel({
			loop:$(".owl-carousel.tc-testimonial-carousel-2col > .item").length <= 2 ? false : true,
    		margin: 30,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 2,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:2
				}
			}
		}); // team
		
		// Owl carousel for client
		$('.owl-carousel.tc-client-carousel').owlCarousel({
			loop:$(".owl-carousel.tc-client-carousel > .item").length <= 4 ? false : true,
    		margin: 30,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			items : 4,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:4
				}
			}
		}); // client
	
		// Owl carousel for recent posts
		$('.owl-carousel.tc-recentpost-carousel').owlCarousel({
			loop:$(".owl-carousel.tc-recentpost-carousel > .item").length <= 2 ? false : true,
    		margin: 30,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 2,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:1
				},
				1000:{
					items:2
				}
			}
		}); // recent posts
		
		// Owl carousel for recent posts variation
		$('.owl-carousel.tc-recentpost-carousel-var').owlCarousel({
			loop:$(".owl-carousel.tc-recentpost-carousel-var > .item").length <= 3 ? false : true,
    		margin: 0,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 3,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:3
				}
			}
		}); // recent posts
		
		// Owl carousel for screenshot
		$('.owl-carousel.tc-screenshot-carousel').owlCarousel({
			loop: true,
    		margin: 30,
    		nav: true,
			navText: [ '', '' ],
			dots: true,
			items : 4,
			responsiveClass:true,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:4
				}
			}, // owl settings
			onInitialized: function() {
				setTimeout(function(){
					$("a[rel^='prettyPhoto']").prettyPhoto({
						animation_speed: 'fast',
						slideshow: 5000,
						autoplay_slideshow: false,
						opacity: 0.80,
						show_title: true,
						theme: 'pp_default',
						overlay_gallery: false,
						social_tools: false,
						changepicturecallback: function () {
						var $pp = $('.pp_default');
						if (parseInt($pp.css('left')) < 0) {
						$pp.css('left', 0);
						}
						}
					}); // prettyPhoto
				},100);
        	} // img zoom in owl
		}); // screenshot

		// animation
		$( '.animate-now:not(.tcsn_animation)' ).waypoint( function () {
			$( this ).addClass( 'tcsn_animation' );
		}, { offset: '80%' } );

		// Split Sitemap list into columns	
		var pagesArray = new Array(),
		$pagesList = $('ul.tc-list-sitemap');
		
		$pagesList.find('li').each(function(){
		pagesArray.push($(this).html());
		});
		var firstList = pagesArray.splice(0, Math.round(pagesArray.length / 2)),
		secondList = pagesArray,
		ListHTML = '';
		
		function createHTML(list){
		ListHTML = '';
		for (var i = 0; i < list.length; i++) {
		ListHTML += '<li>' + list[i] + '</li>'
		}
		}
		createHTML(firstList);
		$pagesList.html(ListHTML);
		createHTML(secondList);
		$pagesList.after('<ul class="tc-list-sitemap"></ul>').next().html(ListHTML);

		// Fitvids
		$(".tc-video-wrapper").fitVids();
		
		// counter
	    $('.tc-counter').counterUp({
			delay: 10,
			time: 1000
		});
		
		// progress bar counter
	    $('.tc-progress-counter').counterUp({
			delay: 10,
			time: 600
		});
		
		// animation
		$( '.animate-now:not(.tcsn_animation)' ).waypoint( function () {
			$( this ).addClass( 'tcsn_animation' );
		}, { offset: '80%' } );
		
		// Sroll to top	
		var offset = 200;
		var duration = 300;
		$(window).scroll(function() {
		if ($(this).scrollTop() > offset) {
		$('#take-to-top').fadeIn(duration);
		} else {
		$('#take-to-top').fadeOut(duration);
		}
		});
		$('#take-to-top').on('click', function(event) {
		event.preventDefault();
		$('html, body').animate({scrollTop: 0}, duration);
		return false;
		});

	}); 
}); // Close document ready