<?php
function poptin_get_iframe_url() {
    $poptin_id = get_option('poptin_id', '');
    $token = get_option('poptin_marketplace_token', '');
    $user_id = get_option('poptin_user_id', '');

    // If we have marketplace token (full registration), get the actual login URL
    if (!empty($token) && !empty($user_id)) {
        $curl_URL = POPTIN_MARKETPLACE_LOGIN_URL;
        $curl_post_array = array(
            'token' => $token,
            'user_id' => $user_id
        );
        
        $curl_options = array(
            CURLOPT_URL => $curl_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 20,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $curl_post_array,
            CURLOPT_CAINFO => POPTIN_CACERT_PATH
        );

        // Only disable SSL verification for WordPress playground
        if (strpos(site_url(), 'playground.wordpress.net') !== false) {
            $curl_options[CURLOPT_SSL_VERIFYPEER] = false;
        }
        
        $curl = curl_init();
        curl_setopt_array($curl, $curl_options);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        
        if (!$err && $response) {
            $response_array = json_decode($response);
            if (isset($response_array->success) && $response_array->success && isset($response_array->login_url)) {
                $login_url = $response_array->login_url;
                // // Replace poptin.test with ngrok URL for development
                // $login_url = str_replace('http://poptin.test/', POPTIN_APP_BASE_URL, $login_url);
                return $login_url;
            }
        }
        
        // Fallback to base URL if API call fails
        return POPTIN_APP_BASE_URL;
    }
    
    // If we only have poptin_id (manual entry), use regular dashboard
    if (!empty($poptin_id)) {
        return POPTIN_APP_BASE_URL;
    }
    
    // Fallback
    return POPTIN_APP_BASE_URL;
}

// Include helper functions
function poptin_is_logged_in() {
    $poptin_id = get_option('poptin_id', '');
    
    // For manual ID entry, we only need the poptin_id and it should be 13 characters
    if (!empty($poptin_id) && strlen($poptin_id) == 13) {
        return true;
    }
    
    return false;
}

function poptin_has_full_registration() {
    $token = get_option('poptin_marketplace_token', '');
    $user_id = get_option('poptin_user_id', '');
    return !empty($token) && !empty($user_id);
}

function poptin_enqueue_dashboard_assets() {
	if (poptin_is_logged_in()) {
		wp_enqueue_script('poptin-iframe', POPTIN_URL . '/assets/js/poptin-iframe.js', ['jquery'], POPTIN_VERSION, true);
		
		// Add admin_url and POPTIN_APP_BASE_URL to JavaScript for iframe messages
		wp_localize_script('poptin-iframe', 'poptin_iframe_vars', array(
			'admin_url' => admin_url('admin.php'),
			'poptin_app_base_url' => POPTIN_APP_BASE_URL
		));
	}
}
add_action('admin_enqueue_scripts', 'poptin_enqueue_dashboard_assets');