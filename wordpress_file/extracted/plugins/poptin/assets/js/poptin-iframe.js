window.addEventListener('DOMContentLoaded', () => {
	// Handle iframe mouse events for scroll behavior
	let iframe = document.querySelector('.poptin-dashboard-iframe');
	if (iframe) {
		iframe.addEventListener('mouseenter', () => {
			document.body.style.overflow = 'hidden';
		});
		
		iframe.addEventListener('mouseleave', () => {
			document.body.style.overflow = 'initial';
		});
	}

	// Handle logout messages from iframe
	window.addEventListener('message', (event) => {
		if (event.data === 'poptin/logout_from_iframe') {
			// Handle logout
			window.location.href = poptin_iframe_vars.admin_url + '?page=poptin&poptin_logout=true';
		}
	});
});