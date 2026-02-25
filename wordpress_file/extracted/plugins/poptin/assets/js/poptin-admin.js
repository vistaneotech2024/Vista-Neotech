jQuery(document).ready(function ($) {

	// Use the POPTIN_APP_BASE_URL from PHP
	var POPTIN_APP_BASE_URL = poptin_settings.poptin_app_base_url;

	// Browser detection function
	function detectProblematicBrowser() {
		var userAgent = navigator.userAgent;
		
		// Detect Safari (but not Chrome which also contains Safari in user agent)
		var isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
		
		// Detect Brave (Brave has a specific navigator.brave property)
		var isBrave = false;
		if (navigator.brave && navigator.brave.isBrave && navigator.brave.isBrave()) {
			isBrave = true;
		}
		
		// Also check for Brave in user agent string as fallback
		if (!isBrave && /Brave/.test(userAgent)) {
			isBrave = true;
		}
		
		return isSafari || isBrave;
	}

	// Handle iframe overlay for logged-in users
	function initIframeOverlay() {
		var $overlay = $('#poptin-iframe-overlay');
		var $dashboardButton = $('.goto_dashboard_button_pp_updatable');
		
		if ($overlay.length && $dashboardButton.length) {
			// Check if user has full registration (iframe should be available)
			var hasFullRegistration = poptin_settings.has_marketplace_token;
			
			if (hasFullRegistration) {
				// Check for problematic browsers
				var isProblematicBrowser = detectProblematicBrowser();
				
				if (isProblematicBrowser) {
					// Hide iframe overlay for Safari/Brave
					$('body').addClass('poptin-iframe-hidden');
					
					// Update button to open in new tab
					$dashboardButton.attr('target', '_blank');
					$dashboardButton.attr('href', poptin_settings.iframe_url || poptin_settings.auto_login_url);
				} else {
					// Set iframe src
					var iframeUrl = poptin_settings.iframe_url || poptin_settings.auto_login_url;
					$('#poptin-iframe').attr('src', iframeUrl);
					
					// Show iframe overlay immediately for compatible browsers
					$overlay.show();
					
					// Hide the poptin dashboard when iframe is visible
					$('.poptin .poptin-wrap, .ps-widget, #wpfooter').hide();
				}
			}
		}
	}

	// Multiple selectors to catch the logout link
	var logoutSelectors = [
		'.pplogout',
		'.pplogout a', 
		'a.pplogout',
		'.footer .pplogout a'
	];

	// Enhanced modal show function
	function showLogoutModal() {
		// console.log('Showing logout modal...');
		var modal = $('#makingsure');
		if (modal.length) {
			modal.show().css({
				'display': 'flex',
				'position': 'fixed',
				'top': '0',
				'left': '0',
				'width': '100%',
				'height': '100%',
				'z-index': '9999',
				'background': 'rgba(30, 25, 57, 0.4)',
				'align-items': 'center',
				'justify-content': 'center',
				'opacity': '1'
			});
			// console.log('Modal should be visible now');
		} else {
			// console.log('Modal element #makingsure not found!');
		}
	}

	// Helper function to focus at end of input field
	function focusAtEnd(element) {
		if (!element) return;
		
		element.focus();
		if (element.value && element.value.length > 0) {
			const length = element.value.length;
			if (element.setSelectionRange) {
				element.setSelectionRange(length, length);
			}
		}
	}

	// Helper function to handle focus based on visible form
	function handleFormFocus() {
		if ($('.popotinRegister').is(':visible')) {
			// Register form is visible - focus at end of email field
			const emailField = document.getElementById('poptinRegisterEmail');
			focusAtEnd(emailField);
		} else if ($('.popotinLogin').is(':visible')) {
			// Login form is visible - focus on User ID field
			const userIdField = document.getElementById('poptinUserId');
			if (userIdField) {
				userIdField.focus();
			}
		}
	}

	// ==============================================
	// LOGOUT HANDLERS - Work on ALL Poptin pages
	// ==============================================

	// Bind to multiple selectors
	logoutSelectors.forEach(function(selector) {
		$(document).on('click', selector, function (e) {
			// console.log('Logout clicked via selector:', selector);
			e.preventDefault();
			e.stopPropagation();
			showLogoutModal();
			return false;
		});
	});

	// Handle WordPress admin sidebar "Log Out" link - redirect to Poptin logout
	$(document).on('click', 'a[href*="poptin-logout"]', function(e) {
		// console.log('=== WORDPRESS SIDEBAR POPTIN LOGOUT CLICKED ===');
		e.preventDefault();
		e.stopPropagation();
		showLogoutModal();
		return false;
	});

	// More specific handler for links containing "Deactivate poptin" - only for <a> tags
	$(document).on('click', 'a, button', function(e) {
		var text = $(this).text().trim();
		
		// Skip WordPress admin "Log Out" link - it's not our Poptin logout
		if (text === 'Log Out' && $(this).attr('href') && $(this).attr('href').includes('wp-login.php')) {
			// console.log('WordPress admin logout detected, ignoring');
			return; // Let it work normally
		}
		
		if (text === 'Deactivate poptin >' || text === 'Deactivate Poptin >') {
			// console.log('=== DEACTIVATE LINK MATCHED ===');
			// console.log('Element:', this);
			e.preventDefault();
			e.stopPropagation();
			showLogoutModal();
			return false;
		}
	});

	// Very specific handler - target the exact link
	$(document).on('click', 'a[href="#"]', function(e) {
		var linkText = $(this).text().trim();
		// console.log('Link with href="#" clicked:', linkText);
		if (linkText.includes('Deactivate')) {
			// console.log('=== DEACTIVATE LINK FOUND VIA HREF ===');
			e.preventDefault();
			e.stopPropagation();
			showLogoutModal();
			return false;
		}
	});

	// Close modal handlers
	$(document).on('click', '[data-dismiss="modal"], .cancel-text', function (e) {
		e.preventDefault();
		$(this).parents('.modal').hide();
	});

	// Close modal when clicking outside
	$(document).on('click', '#makingsure', function (e) {
		if (e.target === this) {
			$(this).hide();
		}
	});

	// ==============================================
	// IFRAME OVERLAY INITIALIZATION
	// ==============================================
	// Initialize iframe overlay for logged-in users
	initIframeOverlay();

	// ==============================================
	// SUPPORT LINK HANDLER - Open in new tab like Full Screen
	// ==============================================
	$(document).on('click', 'a[href*="poptin-support"]', function (e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Open support link in new tab (same as Full Screen behavior)
		var supportUrl = poptin_settings.support_link;
		window.open(supportUrl, '_blank');
		
		return false;
	});

	// ==============================================
	// FULL SCREEN HANDLER - Route based on login method
	// ==============================================
	$(document).on('click', 'a[href*="poptin-full-screen"]', function (e) {
		e.preventDefault();
		e.stopPropagation();

		// Get the appropriate dashboard URL based on login method
		var fullScreenUrl = POPTIN_APP_BASE_URL; // Default fallback

		// Check if we have marketplace token data available
		if (typeof poptin_settings.has_marketplace_token !== 'undefined' && poptin_settings.has_marketplace_token) {
			// User has full registration - try to get iframe URL or use login flow
			var iframe = $('.poptin-dashboard-iframe');
			if (iframe.length > 0 && iframe.attr('src')) {
				fullScreenUrl = iframe.attr('src');
			} else {
				// If no iframe available, use the auto-login URL
				fullScreenUrl = poptin_settings.auto_login_url || POPTIN_APP_BASE_URL;
			}
		} else {
			// User has manual ID only - use external dashboard
			fullScreenUrl = POPTIN_APP_BASE_URL;
		}

		// Open in new tab
		window.open(fullScreenUrl, '_blank');

		return false;
	});

	// ==============================================
	// FORM TOGGLE HANDLERS - Run on all pages with forms
	// ==============================================
	
	$('.ppLogin').on('click', function (e) {
		e.preventDefault();
		// console.log('Login link clicked');
		$('.popotinLogin').fadeIn('slow');
		$('.popotinRegister').hide();

		// Focus on the User ID field for login form
		setTimeout(handleFormFocus, 500);
	});

	$('.ppRegister').on('click', function (e) {
		e.preventDefault();
		// console.log('Register link clicked');
		$('.popotinRegister').fadeIn('slow');
		$('.popotinLogin').hide();

		// Focus on appropriate field for register form
		setTimeout(handleFormFocus, 500);
	});

	$('input').on('change', function (e) {
		let value = e.target.value;
		if (value) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});

	// ==============================================
	// FORM HANDLING - Only run on main Poptin page
	// ==============================================
	var currentPage = window.location.href;
	var isMainPoptinPage = currentPage.includes('page=poptin') && !currentPage.includes('page=poptin-dashboard');
	
	if (isMainPoptinPage) {
		// console.log('On main Poptin page - enabling form handlers');

		jQuery('.wheremyid').on('click', function (e) {
			jQuery('#oopsiewrongid').modal('hide');
			jQuery('#whereIsMyId').modal('show');
			jQuery('#whereIsMyId').css('opacity', '1');
			jQuery('#whereIsMyId').css({
				left() {
					const sidebarWidth = jQuery('#adminmenuwrap').width();
					const value = innerWidth > 782 ? sidebarWidth : 0;
					return `${value}px`;
				}
			})
		});

		function show_loader(el) {
			$(el).find('.text-content').hide();
			$(el).find('.loader').show();
		}

		function hide_loader(el) {
			$(el).find('.text-content').show();
			$(el).find('.loader').hide();
		}

		jQuery('.pp_signup_btn').on('click', function (e) {
			e.preventDefault();
			var email = $('#poptinRegisterEmail').val();
			if (!isEmail(email)) {
				e.preventDefault();
				$('#oopsiewrongemailid').fadeIn(500);

				$('#oopsiewrongemailid').delay(2500).fadeOut();
				$('#poptinRegisterEmail')
					.addClass('error')
					.delay(3000)
					.queue(function () {
						$(this).removeClass('error').dequeue();
					});

				return false;
			} else {
				var el = this;
				show_loader(el);
				jQuery.ajax({
					url: ajaxurl,
					dataType: 'JSON',
					method: 'POST',
					data: jQuery('#registration_form').serialize(),
					success: function (data) {
						hide_loader(el);
						if (data.success == true) {
							// For full registration, redirect to iframe dashboard
							window.location.href = poptin_settings.after_registration_url;
						} else {
							if (data.message === 'Registration failed. User already registered.') {
								jQuery('#lookfamiliar').modal('show');
							} else if (data.message === 'The email has already been taken.') {
								jQuery('#lookfamiliar').modal('show');
							} else {
								if (typeof swal !== 'undefined') {
									swal('Error', data.message, 'error');
								} else {
									alert('Error: ' + data.message);
								}
							}
						}
					}
				});
			}
		});

		jQuery('.goto_dashboard_button_pp_updatable').on('click', function () {
			link = $(this);
			href = link.attr('href');
			
			// If it's an external link, don't modify it
			if (href.indexOf(POPTIN_APP_BASE_URL) === 0) {
				return true; // Allow normal navigation
			}
			
			// For internal WordPress admin links, handle normally
			return true;
		});

		jQuery('.dashboard_link').on('click', function () {
			href = $(this).data('target');
			if (href) {
				window.open(href, '_blank');
			}
		});

		jQuery('.poptinWalkthroughVideoTrigger').on('click', function (e) {
			e.preventDefault();
			jQuery('#poptinExplanatoryVideo').modal("show").css({
				left() {
					const sidebarWidth = jQuery('#adminmenuwrap').width();
					const value = innerWidth > 782 ? sidebarWidth : 0;
					return `${value}px`;
				}
			});
		});

		// close modal when wordpress sidebar collapse
		jQuery(document).on('click', '#collapse-menu', function () {
			jQuery('#poptinExplanatoryVideo').modal('hide');
		});

		$('.ppFormLogin').on('submit', function (e) {
			e.preventDefault();
			var id = $('.ppFormLogin input[type="text"]').val();
			if (id.length != 13) {
				e.preventDefault();
				$('#oopsiewrongid').fadeIn(500);

				$('#oopsiewrongid').delay(2500).fadeOut();
				$('#poptinUserId')
					.addClass('error')
					.delay(3000)
					.queue(function () {
						$(this).removeClass('error').dequeue();
					});
				return false;
			} else {
				var el = this;
				show_loader(el);
				$.post(
					ajaxurl,
					{
						data: { poptin_id: id, nonce: $('#ppFormIdRegister').val() },
						action: 'add-id'
					},
					function (status) {
						hide_loader(el);
						status = JSON.parse(status);
						if (status.success == true) {
							// For manual ID entry, redirect to logged in page (will show external link)
							window.location.href = window.location.origin + window.location.pathname + '?page=poptin';
						}
					}
				);
			}
		});

		// Handle initial focus on page load for main Poptin page
		setTimeout(handleFormFocus, 200);

	} else {
		// console.log('Not on main Poptin page - skipping form handlers');
	}

	// ==============================================
	// GLOBAL HANDLERS - Run on all Poptin pages
	// ==============================================

	// Global helper functions
	function show_loader(el) {
		$(el).find('.text-content').hide();
		$(el).find('.loader').show();
	}

	function hide_loader(el) {
		$(el).find('.text-content').show();
		$(el).find('.loader').hide();
	}

	jQuery(document).on('click', '.deactivate-poptin-confirm-yes', function () {
		var el = this;
		show_loader(el);
		jQuery.post(
			ajaxurl,
			{
				action: 'delete-id',
				data: { nonce: $('#ppFormIdDeactivate').val() }
			},
			function (status) {
				hide_loader(el);
				status = JSON.parse(status);
				if (status.success == true) {
					jQuery('#makingsure').modal('hide');
					jQuery('#byebyeModal').modal('show');
					// Redirect to main page after logout
					setTimeout(function() {
						window.location.href = window.location.origin + window.location.pathname + '?page=poptin';
					}, 2000);
				}
			}
		);
	});

	$(document).on('click', '.poptin-logout-confirm', function (e) {
		e.preventDefault();
		var button = $(this);

		button.prop('disabled', true).text('Logging out...');

		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {
				action: 'poptin_logout',
				nonce: $('#poptin-logout-nonce').val()
			},
			success: function (response) {
				if (response.success) {
					// Redirect to Poptin main page
					window.location.href = window.location.origin + window.location.pathname + '?page=poptin';
				} else {
					alert('Logout failed: ' + (response.data || 'Unknown error'));
					button.prop('disabled', false).text('Log Out');
				}
			},
			error: function (xhr, status, error) {
				alert('Logout failed. Please try again.');
				button.prop('disabled', false).text('Log Out');
			}
		});
	});

	// Show modal function for compatibility
	$.fn.modal = function (action) {
		if (action === 'show') {
			this.show().css({
				'display': 'flex',
				'position': 'fixed',
				'top': '0',
				'left': '0',
				'width': '100%',
				'height': '100%',
				'z-index': '9999',
				'background': 'rgba(30, 25, 57, 0.4)',
				'align-items': 'center',
				'justify-content': 'center',
				'opacity': '1'
			});
		} else if (action === 'hide') {
			this.hide();
		}
		return this;
	};

	// Handle focus on window load as well (in case document ready fires before forms are fully rendered)
	jQuery(window).on('load', function() {
		setTimeout(handleFormFocus, 300);
	});
});

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

/**
 * ------------------------------------------------
 * Start: Support widget popup script
 * @since 1.3.2
 * ------------------------------------------------ 
 */
const poptinSupportWidgetBase = {
	getSelectors() {
		return {
			scope: '.ps-widget',
			triggerBtn: '.ps-widget__trigger-btn',
			popover: '.ps-widget__popover',
			headerBg: '.ps-widget__popover__header__bg',
			bird: '.ps-widget__popover__header__bird'
		}
	},

	getElements() {
		const selectors = this.getSelectors()
		const $scope = this.$(selectors.scope)

		return {
			$scope,
			$document: this.$(document),
			$triggerBtn: $scope.find(selectors.triggerBtn),
			$popover: $scope.find(selectors.popover),
			$headerBg: $scope.find(selectors.headerBg),
			$bird: $scope.find(selectors.bird)
		}
	},

	get isPopoverOpen() {
		const { $popover } = this.getElements()
		return $popover.hasClass('open')
	},

	reset() {
		const { $popover, $headerBg, $bird, $triggerBtn, $document } = this.getElements()
		$popover.removeClass('open').removeAttr('style')
		$headerBg.removeAttr('style')
		$bird.removeAttr('style')
		$triggerBtn.find('img').removeAttr('style')
		$document.off('click.ps-outside-click')
	},

	init($) {
		this.$ = $
		const { $scope } = this.getElements()
		if (!$scope.length) return;
		this.events()
	}
}

const poptinSupportWidget = jQuery.extend(poptinSupportWidgetBase, {
	events() {
		const { $triggerBtn } = this.getElements()
		$triggerBtn.on('click', this.popoverToggleHandler.bind(this))
	},

	popoverToggleHandler(ev) {
		ev.preventDefault()
		ev.stopPropagation()

		const { $document } = this.getElements()

		if (!this.isPopoverOpen) {
			if (innerWidth < 782) {
				this.$('#poptinExplanatoryVideo').modal('hide');
				this.$('#whereIsMyId').modal('hide')
			}
			this.animateAndOpenPopover()
			$document.on('click.ps-outside-click', this.outsideCloseHandler.bind(this))
			return;
		}

		this.animateAndClosePopover()
	},

	outsideCloseHandler(ev) {
		const $target = this.$(ev.target)
		const { $popover, $triggerBtn } = this.getElements()

		if ($target.closest($popover).length || $target.closest($triggerBtn).length) {
			return;
		}

		this.animateAndClosePopover()
	},

	animateAndOpenPopover() {
		const { $popover, $headerBg, $bird, $triggerBtn } = this.getElements()
		const openingStyles = {
			bottom: 80,
			opacity: 1
		}

		$triggerBtn.find('img').css('transform', 'rotate(180deg)')
		$popover.show().animate(openingStyles, 300, () => {
			$popover.addClass('open')
		})

		$bird.animate({ right: 0 }, 500)
		$headerBg.css('transform', 'scaleY(1)')
	},

	animateAndClosePopover() {
		const { $popover, $triggerBtn } = this.getElements()
		const openingStyles = {
			bottom: 30,
			opacity: 0
		}

		$triggerBtn.find('img').css('transform', 'rotate(0deg)')
		$popover.animate(openingStyles, 300, this.reset.bind(this))
		$popover.fadeOut('slow')
	},
})

jQuery(($) => poptinSupportWidget.init($))
/**
 * ------------------------------------------------
 * End: Support widget popup script
 * ------------------------------------------------ 
 */