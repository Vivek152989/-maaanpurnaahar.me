@echo off
echo =====================================================
echo    Maa Anpurna Aahar - WordPress + Astra Setup
echo =====================================================
echo.

echo Step 1: Creating WordPress directory structure...
mkdir wordpress-site 2>nul
mkdir wordpress-site\wp-content 2>nul
mkdir wordpress-site\wp-content\themes 2>nul
mkdir wordpress-site\wp-content\plugins 2>nul
mkdir wordpress-site\wp-content\uploads 2>nul
mkdir wordpress-site\assets 2>nul
mkdir wordpress-site\assets\js 2>nul
mkdir wordpress-site\assets\css 2>nul
mkdir wordpress-site\assets\images 2>nul

echo Step 2: Copying Firebase configuration files...
copy firebase-config.js wordpress-site\assets\js\ 2>nul
copy wordpress-firebase-integration.js wordpress-site\assets\js\ 2>nul

echo Step 3: Creating WordPress configuration...
copy wordpress-functions.php wordpress-site\wp-content\themes\functions.php 2>nul

echo Step 4: Setting up Astra theme configuration...
copy astra-theme-config.php wordpress-site\ 2>nul

echo.
echo =====================================================
echo Installation files created successfully!
echo =====================================================
echo.
echo Next Steps:
echo 1. Download and install Local by Flywheel or XAMPP
echo 2. Create a new WordPress site named "maa-anpurna-aahar"
echo 3. Install Astra theme and required plugins
echo 4. Copy files from 'wordpress-site' folder to your WordPress installation
echo 5. Import Astra starter template for food business
echo 6. Configure Firebase settings and customize colors
echo.

echo Required Downloads:
echo - Local by Flywheel: https://localwp.com/
echo - WordPress: https://wordpress.org/download/
echo - Astra Theme: https://wpastra.com/
echo.

echo Plugin Installation Order:
echo 1. Astra Theme (Free)
echo 2. Astra Pro Addon (Premium)
echo 3. Elementor Page Builder
echo 4. WooCommerce
echo 5. Contact Form 7
echo 6. Yoast SEO
echo.

echo Firebase Configuration Required:
echo - Enable Google Sign-In in Firebase Console
echo - Enable Phone Authentication in Firebase Console
echo - Add your domain to authorized domains
echo - Update API keys if needed
echo.

echo Custom Features Included:
echo - Firebase Authentication integration
echo - Google Sign-In for WordPress
echo - Phone/OTP authentication
echo - WooCommerce product management
echo - Custom food business styling
echo - SEO optimization
echo - Performance enhancements
echo - Mobile responsive design
echo.

pause