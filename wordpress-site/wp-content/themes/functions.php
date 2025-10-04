<?php
/**
 * Maa Anpurna Aahar WordPress Functions
 * Integration with Astra Theme and Firebase Authentication
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function maa_anpurna_theme_setup() {
    // Add theme support for various features
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('title-tag');
    add_theme_support('custom-background');
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => 'Primary Menu',
        'footer' => 'Footer Menu'
    ));
}
add_action('after_setup_theme', 'maa_anpurna_theme_setup');

/**
 * Enqueue Scripts and Styles
 */
function maa_anpurna_scripts() {
    // Firebase SDK
    wp_enqueue_script('firebase-app', 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js', array(), '9.22.0', true);
    wp_enqueue_script('firebase-auth', 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js', array('firebase-app'), '9.22.0', true);
    wp_enqueue_script('firebase-firestore', 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js', array('firebase-app'), '9.22.0', true);
    
    // Your Firebase configuration
    wp_enqueue_script('firebase-config', get_template_directory_uri() . '/assets/js/firebase-config.js', array('firebase-app', 'firebase-auth', 'firebase-firestore'), '1.0.0', true);
    
    // Custom theme scripts
    wp_enqueue_script('maa-anpurna-theme', get_template_directory_uri() . '/assets/js/theme.js', array('jquery'), '1.0.0', true);
    
    // Custom theme styles
    wp_enqueue_style('maa-anpurna-style', get_stylesheet_uri(), array('astra-theme-css'), '1.0.0');
    
    // Localize script for AJAX
    wp_localize_script('maa-anpurna-theme', 'maa_anpurna_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('maa_anpurna_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'maa_anpurna_scripts');

/**
 * Astra Theme Customizations
 */
function maa_anpurna_astra_customizations() {
    // Apply color scheme
    set_theme_mod('astra-settings[theme-color]', '#ff9800');
    set_theme_mod('astra-settings[text-color]', '#333333');
    set_theme_mod('astra-settings[link-color]', '#ff9800');
    set_theme_mod('astra-settings[link-h-color]', '#f57c00');
    
    // Header customizations
    set_theme_mod('astra-settings[header-height]', 80);
    set_theme_mod('astra-settings[header-main-rt-section]', 'button');
    set_theme_mod('astra-settings[header-main-rt-section-button-text]', 'My Account');
    set_theme_mod('astra-settings[header-main-rt-section-button-link-option]', array(
        'url' => home_url('/my-account'),
        'is_external' => '',
        'nofollow' => ''
    ));
    
    // Typography
    set_theme_mod('astra-settings[font-family-body]', "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
    set_theme_mod('astra-settings[font-family-headings]', "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
    
    // Layout
    set_theme_mod('astra-settings[site-layout]', 'ast-full-width-layout');
    set_theme_mod('astra-settings[site-content-width]', 1200);
}
add_action('init', 'maa_anpurna_astra_customizations');

/**
 * Firebase Authentication Integration
 */
class MaaAnpurnaFirebaseAuth {
    
    public function __construct() {
        add_action('wp_ajax_firebase_login', array($this, 'handle_firebase_login'));
        add_action('wp_ajax_nopriv_firebase_login', array($this, 'handle_firebase_login'));
        add_action('wp_ajax_firebase_register', array($this, 'handle_firebase_register'));
        add_action('wp_ajax_nopriv_firebase_register', array($this, 'handle_firebase_register'));
    }
    
    /**
     * Handle Firebase login and sync with WordPress
     */
    public function handle_firebase_login() {
        check_ajax_referer('maa_anpurna_nonce', 'nonce');
        
        $firebase_uid = sanitize_text_field($_POST['firebase_uid']);
        $email = sanitize_email($_POST['email']);
        $display_name = sanitize_text_field($_POST['display_name']);
        
        // Check if user exists in WordPress
        $user = get_user_by('email', $email);
        
        if (!$user) {
            // Create new WordPress user
            $user_id = wp_create_user($email, wp_generate_password(), $email);
            if (!is_wp_error($user_id)) {
                update_user_meta($user_id, 'firebase_uid', $firebase_uid);
                update_user_meta($user_id, 'display_name', $display_name);
                wp_update_user(array(
                    'ID' => $user_id,
                    'display_name' => $display_name,
                    'nickname' => $display_name
                ));
                $user = get_user_by('id', $user_id);
            }
        } else {
            // Update existing user's Firebase UID
            update_user_meta($user->ID, 'firebase_uid', $firebase_uid);
        }
        
        if ($user && !is_wp_error($user)) {
            // Log in the user to WordPress
            wp_set_current_user($user->ID);
            wp_set_auth_cookie($user->ID);
            
            wp_send_json_success(array(
                'message' => 'Login successful',
                'redirect_url' => home_url('/my-account')
            ));
        } else {
            wp_send_json_error('Login failed');
        }
    }
    
    /**
     * Handle Firebase registration and sync with WordPress
     */
    public function handle_firebase_register() {
        check_ajax_referer('maa_anpurna_nonce', 'nonce');
        
        $firebase_uid = sanitize_text_field($_POST['firebase_uid']);
        $email = sanitize_email($_POST['email']);
        $display_name = sanitize_text_field($_POST['display_name']);
        $phone = sanitize_text_field($_POST['phone']);
        
        // Create WordPress user
        $user_id = wp_create_user($email, wp_generate_password(), $email);
        
        if (!is_wp_error($user_id)) {
            // Add user meta
            update_user_meta($user_id, 'firebase_uid', $firebase_uid);
            update_user_meta($user_id, 'phone_number', $phone);
            update_user_meta($user_id, 'display_name', $display_name);
            
            // Update user details
            wp_update_user(array(
                'ID' => $user_id,
                'display_name' => $display_name,
                'nickname' => $display_name,
                'first_name' => $display_name
            ));
            
            // Auto-login after registration
            wp_set_current_user($user_id);
            wp_set_auth_cookie($user_id);
            
            wp_send_json_success(array(
                'message' => 'Registration successful',
                'redirect_url' => home_url('/my-account')
            ));
        } else {
            wp_send_json_error('Registration failed: ' . $user_id->get_error_message());
        }
    }
}
new MaaAnpurnaFirebaseAuth();

/**
 * Custom WooCommerce Modifications
 */
function maa_anpurna_woocommerce_mods() {
    // Change "Add to Cart" button text
    add_filter('woocommerce_product_add_to_cart_text', function($text) {
        return 'Add to Basket';
    });
    
    // Custom shop columns
    add_filter('loop_shop_columns', function() {
        return 4; // 4 products per row
    });
    
    // Products per page
    add_filter('loop_shop_per_page', function() {
        return 12; // 12 products per page
    });
}
add_action('init', 'maa_anpurna_woocommerce_mods');

/**
 * Custom Post Types for Food Categories
 */
function maa_anpurna_custom_post_types() {
    // Recipe post type
    register_post_type('recipe', array(
        'labels' => array(
            'name' => 'Recipes',
            'singular_name' => 'Recipe'
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-carrot'
    ));
    
    // Testimonial post type
    register_post_type('testimonial', array(
        'labels' => array(
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial'
        ),
        'public' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-testimonial'
    ));
}
add_action('init', 'maa_anpurna_custom_post_types');

/**
 * Custom Widgets
 */
function maa_anpurna_widgets_init() {
    register_sidebar(array(
        'name' => 'Homepage Sidebar',
        'id' => 'homepage-sidebar',
        'before_widget' => '<div class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
    
    register_sidebar(array(
        'name' => 'Footer Column 1',
        'id' => 'footer-1',
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4 class="footer-widget-title">',
        'after_title' => '</h4>',
    ));
    
    register_sidebar(array(
        'name' => 'Footer Column 2',
        'id' => 'footer-2',
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4 class="footer-widget-title">',
        'after_title' => '</h4>',
    ));
    
    register_sidebar(array(
        'name' => 'Footer Column 3',
        'id' => 'footer-3',
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4 class="footer-widget-title">',
        'after_title' => '</h4>',
    ));
}
add_action('widgets_init', 'maa_anpurna_widgets_init');

/**
 * Security Enhancements
 */
function maa_anpurna_security() {
    // Remove WordPress version from head
    remove_action('wp_head', 'wp_generator');
    
    // Disable file editing from admin
    define('DISALLOW_FILE_EDIT', true);
    
    // Hide login errors
    add_filter('login_errors', function() {
        return 'Something is wrong!';
    });
}
add_action('init', 'maa_anpurna_security');

/**
 * SEO Enhancements
 */
function maa_anpurna_seo() {
    // Add structured data for food business
    add_action('wp_head', function() {
        if (is_front_page()) {
            ?>
            <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "FoodEstablishment",
                "name": "Maa Anpurna Aahar",
                "description": "Authentic handmade food products made with love and tradition",
                "url": "<?php echo home_url(); ?>",
                "logo": "<?php echo get_site_icon_url(); ?>",
                "servesCuisine": "Indian",
                "priceRange": "$$",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "IN"
                }
            }
            </script>
            <?php
        }
    });
}
add_action('init', 'maa_anpurna_seo');

/**
 * Performance Optimizations
 */
function maa_anpurna_performance() {
    // Lazy load images
    add_filter('wp_lazy_loading_enabled', '__return_true');
    
    // Optimize jQuery loading
    if (!is_admin()) {
        wp_deregister_script('jquery');
        wp_register_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js', false, '3.6.0', true);
        wp_enqueue_script('jquery');
    }
    
    // Remove unnecessary scripts
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
}
add_action('init', 'maa_anpurna_performance');

/**
 * Admin Dashboard Customizations
 */
function maa_anpurna_admin_customizations() {
    // Custom admin logo
    add_action('admin_head', function() {
        echo '<style>
            #wpadminbar #wp-admin-bar-wp-logo > .ab-item .ab-icon:before {
                content: "🍛";
                color: #ff9800;
            }
            .login h1 a {
                background-image: url(' . get_site_icon_url() . ');
                background-size: contain;
                width: 100px;
                height: 100px;
            }
        </style>';
    });
    
    // Custom footer text
    add_filter('admin_footer_text', function() {
        return 'Thank you for using <strong>Maa Anpurna Aahar</strong> website!';
    });
}
add_action('init', 'maa_anpurna_admin_customizations');

?>