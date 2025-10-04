<?php
/**
 * WordPress Configuration for Maa Anpurna Aahar
 * Astra Theme Customization Settings
 */

// Astra Theme Configuration Array
$astra_config = array(
    // Global Settings
    'global_settings' => array(
        'site_title' => 'Maa Anpurna Aahar',
        'tagline' => 'Authentic Handmade Food Products',
        'logo_url' => 'path/to/your/logo.png',
        'site_icon' => 'path/to/favicon.ico'
    ),
    
    // Color Scheme (Matching your current theme)
    'colors' => array(
        'theme_color' => '#ff9800',           // Primary Orange
        'accent_color' => '#2c3e50',         // Dark Blue
        'text_color' => '#333333',           // Dark Gray
        'link_color' => '#ff9800',           // Orange links
        'link_hover_color' => '#f57c00',     // Darker orange on hover
        'border_color' => '#e5e5e5',         // Light gray borders
        'background_color' => '#ffffff'       // White background
    ),
    
    // Typography Settings
    'typography' => array(
        'base_font_family' => 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        'base_font_weight' => '400',
        'base_font_size' => '16px',
        'base_line_height' => '1.6',
        
        'headings_font_family' => 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        'headings_font_weight' => '600',
        'h1_font_size' => '2.5em',
        'h2_font_size' => '2em',
        'h3_font_size' => '1.5em'
    ),
    
    // Layout Configuration
    'layout' => array(
        'site_layout' => 'ast-full-width-layout',
        'site_content_width' => '1200',
        'single_post_sidebar' => 'no-sidebar',
        'single_page_sidebar' => 'no-sidebar',
        'archive_post_sidebar' => 'right-sidebar'
    ),
    
    // Header Settings
    'header' => array(
        'header_layout' => 'header-main-layout-1',
        'header_height' => '80',
        'logo_width' => '180',
        'navigation_style' => 'ast-default-menu',
        'mobile_header_type' => 'dropdown',
        'header_background' => '#ffffff',
        'header_text_color' => '#333333'
    ),
    
    // Menu Configuration
    'navigation' => array(
        'primary_menu' => array(
            'Home' => '/',
            'About Us' => '/about',
            'Products' => '/shop',
            'Contact' => '/contact',
            'My Account' => '/my-account'
        ),
        'menu_font_size' => '16px',
        'menu_font_weight' => '500',
        'submenu_background' => '#ffffff',
        'submenu_border' => '#e5e5e5'
    ),
    
    // Footer Settings
    'footer' => array(
        'footer_widgets' => '4',
        'footer_background' => '#2c3e50',
        'footer_text_color' => '#ffffff',
        'footer_link_color' => '#ff9800',
        'copyright_text' => '© 2025 Maa Anpurna Aahar. All rights reserved.'
    ),
    
    // Blog/Archive Settings
    'blog' => array(
        'blog_layout' => 'blog-layout-1',
        'blog_grid' => '3',
        'excerpt_length' => '25',
        'read_more_text' => 'Read More',
        'blog_meta' => array('date', 'author', 'category', 'comments')
    ),
    
    // WooCommerce Integration
    'woocommerce' => array(
        'shop_columns' => '4',
        'shop_products_per_page' => '12',
        'product_gallery_layout' => 'horizontal',
        'cart_icon_style' => 'ast-cart-menu-icon',
        'shop_button_style' => 'ast-outline-button'
    ),
    
    // Performance Settings
    'performance' => array(
        'minify_css' => true,
        'minify_js' => true,
        'lazy_load_images' => true,
        'preload_local_fonts' => true,
        'disable_emojis' => true
    ),
    
    // Custom CSS for additional styling
    'custom_css' => '
        /* Custom styles for Maa Anpurna Aahar */
        .ast-theme-name {
            color: #ff9800;
        }
        
        .hero-section {
            background: linear-gradient(135deg, #ff9800, #f57c00);
            padding: 80px 0;
        }
        
        .product-card {
            border: 1px solid #e5e5e5;
            border-radius: 10px;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .btn-primary {
            background: #ff9800;
            border-color: #ff9800;
            border-radius: 25px;
            padding: 12px 30px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            background: #f57c00;
            border-color: #f57c00;
            transform: translateY(-2px);
        }
        
        .contact-form {
            background: #f8f9fa;
            padding: 40px;
            border-radius: 15px;
            margin-top: 30px;
        }
        
        .testimonial-section {
            background: #2c3e50;
            color: #ffffff;
            padding: 60px 0;
        }
        
        .footer-widget-title {
            color: #ff9800;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
        }
    '
);

/**
 * Function to apply Astra configuration
 */
function apply_astra_configuration($config) {
    // This function would be called in functions.php
    // to apply all the configuration settings
    
    foreach($config as $section => $settings) {
        if($section === 'custom_css') {
            // Add custom CSS
            wp_add_inline_style('astra-theme-css', $settings);
        } else {
            // Apply theme customizer settings
            foreach($settings as $key => $value) {
                set_theme_mod($key, $value);
            }
        }
    }
}

/**
 * Required Plugins List
 */
$required_plugins = array(
    'astra-pro-addon' => array(
        'name' => 'Astra Pro Addon',
        'slug' => 'astra-addon',
        'required' => true,
        'source' => 'premium'
    ),
    'elementor' => array(
        'name' => 'Elementor Page Builder',
        'slug' => 'elementor',
        'required' => true,
        'source' => 'repository'
    ),
    'woocommerce' => array(
        'name' => 'WooCommerce',
        'slug' => 'woocommerce',
        'required' => true,
        'source' => 'repository'
    ),
    'contact-form-7' => array(
        'name' => 'Contact Form 7',
        'slug' => 'contact-form-7',
        'required' => false,
        'source' => 'repository'
    ),
    'yoast-seo' => array(
        'name' => 'Yoast SEO',
        'slug' => 'wordpress-seo',
        'required' => false,
        'source' => 'repository'
    )
);

/**
 * Sample Page Content Templates
 */
$page_templates = array(
    'homepage' => '
        <!-- Hero Section -->
        <div class="hero-section">
            <div class="container">
                <h1>Welcome to Maa Anpurna Aahar</h1>
                <p>Authentic handmade food products made with love and tradition</p>
                <a href="/shop" class="btn btn-primary">Shop Now</a>
            </div>
        </div>
        
        <!-- Features Section -->
        <div class="features-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <h3>100% Natural</h3>
                        <p>All our products are made from natural ingredients</p>
                    </div>
                    <div class="col-md-4">
                        <h3>Handmade Quality</h3>
                        <p>Crafted with traditional methods and care</p>
                    </div>
                    <div class="col-md-4">
                        <h3>Fresh Delivery</h3>
                        <p>Direct from our kitchen to your doorstep</p>
                    </div>
                </div>
            </div>
        </div>
    ',
    
    'about' => '
        <div class="about-content">
            <h2>About Maa Anpurna Aahar</h2>
            <p>We are passionate about bringing you authentic, handmade food products that capture the essence of traditional Indian cuisine. Every item is crafted with love, using time-honored recipes passed down through generations.</p>
            
            <h3>Our Story</h3>
            <p>Founded with the vision of preserving traditional food culture, Maa Anpurna Aahar specializes in creating delicious, healthy snacks and food products. We believe in the power of home-cooked meals and the joy they bring to families.</p>
            
            <h3>Our Promise</h3>
            <ul>
                <li>100% Natural ingredients</li>
                <li>No artificial preservatives</li>
                <li>Traditional recipes</li>
                <li>Quality assurance</li>
                <li>Fresh delivery</li>
            </ul>
        </div>
    '
);

// Export configuration for use
return array(
    'config' => $astra_config,
    'plugins' => $required_plugins,
    'templates' => $page_templates
);

?>