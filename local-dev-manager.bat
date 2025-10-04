@echo off
title Maa Anpurna Aahar - Local Development Manager
color 0A

:MENU
cls
echo.
echo =====================================================
echo    🍛 Maa Anpurna Aahar - Local Development Manager
echo =====================================================
echo.
echo    Current Status: WordPress + Astra + Firebase Ready
echo    Local Site: http://maa-anpurna-aahar.local
echo    Admin URL:  http://maa-anpurna-aahar.local/wp-admin
echo.
echo =====================================================
echo    Choose an option:
echo =====================================================
echo.
echo    1. 🌐 Open WordPress Site
echo    2. 🔧 Open WordPress Admin  
echo    3. 🗄️ Open Database Manager (Adminer)
echo    4. 📁 Open Site Files
echo    5. 📊 View Site Information
echo    6. 🔄 Restart Local Site
echo    7. 💾 Backup Database
echo    8. 📤 Import Data from Live Site
echo    9. 🎨 Configure Astra Theme
echo    0. ❌ Exit
echo.
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto OPEN_SITE
if "%choice%"=="2" goto OPEN_ADMIN
if "%choice%"=="3" goto OPEN_DATABASE
if "%choice%"=="4" goto OPEN_FILES
if "%choice%"=="5" goto SITE_INFO
if "%choice%"=="6" goto RESTART_SITE
if "%choice%"=="7" goto BACKUP_DB
if "%choice%"=="8" goto IMPORT_DATA
if "%choice%"=="9" goto CONFIGURE_THEME
if "%choice%"=="0" goto EXIT
goto MENU

:OPEN_SITE
echo Opening WordPress site...
start http://maa-anpurna-aahar.local
goto MENU

:OPEN_ADMIN
echo Opening WordPress admin...
start http://maa-anpurna-aahar.local/wp-admin
goto MENU

:OPEN_DATABASE
echo Opening database manager...
echo.
echo Database Connection Info:
echo Host: localhost
echo Username: root
echo Password: root
echo Database: local
echo.
echo Click "Database" tab in Local by Flywheel, then "Open Adminer"
pause
goto MENU

:OPEN_FILES
echo Opening WordPress files...
start "" "C:\Users\dduc\Local Sites\maa-anpurna-aahar\app\public"
goto MENU

:SITE_INFO
cls
echo =====================================================
echo    📊 Site Information
echo =====================================================
echo.
echo WordPress Version: Latest
echo Theme: Astra (Active)
echo PHP Version: 8.1+
echo Database: MySQL 8.0
echo.
echo 🔥 Firebase Integration: ✅ Active
echo 🛒 WooCommerce: Ready to install
echo 🎨 Astra Theme: Installed
echo 📱 Mobile Responsive: ✅ Yes
echo.
echo Site Location: C:\Users\dduc\Local Sites\maa-anpurna-aahar\
echo.
echo Database Tables:
echo - wp_users (User accounts)
echo - wp_posts (Pages/Posts/Products)  
echo - wp_options (Site settings)
echo - wp_woocommerce_* (E-commerce data)
echo.
pause
goto MENU

:RESTART_SITE
echo Restarting Local site...
echo Please use Local by Flywheel interface to restart the site
echo 1. Open Local by Flywheel
echo 2. Click "Stop site"  
echo 3. Click "Start site"
pause
goto MENU

:BACKUP_DB
echo Creating database backup...
set backup_file=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.sql
echo.
echo Backup will be saved as: %backup_file%
echo.
echo To create backup:
echo 1. Open Database Manager (Option 3)
echo 2. Select "local" database
echo 3. Click "Export" 
echo 4. Choose "SQL" format
echo 5. Save as: %backup_file%
echo.
pause
goto MENU

:IMPORT_DATA
echo =====================================================
echo    📤 Import Data from Live Site
echo =====================================================
echo.
echo To migrate your current website data:
echo.
echo 📋 User Data Migration:
echo 1. Export Firebase user data 
echo 2. Create WordPress users
echo 3. Map Firebase UIDs to WordPress user IDs
echo.
echo 🛒 Product Data Migration:
echo 1. Install WooCommerce plugin
echo 2. Create product categories
echo 3. Import product information
echo 4. Upload product images
echo.
echo 📄 Content Migration:
echo 1. Copy page content from HTML files
echo 2. Create WordPress pages
echo 3. Set up navigation menus
echo 4. Configure contact forms
echo.
echo Would you like to start with user data migration? (y/n)
set /p migrate_choice=
if /i "%migrate_choice%"=="y" goto USER_MIGRATION
goto MENU

:USER_MIGRATION
echo Starting user data migration...
echo.
echo Steps to migrate Firebase users to WordPress:
echo.
echo 1. 🔥 Export Firebase users:
echo    - Go to Firebase Console
echo    - Authentication → Users
echo    - Export user list
echo.
echo 2. 📝 Create migration script:
echo    - Map email addresses
echo    - Preserve user preferences
echo    - Maintain authentication history
echo.
echo 3. ✅ Test authentication:
echo    - Verify Google Sign-In works
echo    - Test phone/OTP authentication
echo    - Check user profiles
echo.
pause
goto MENU

:CONFIGURE_THEME
echo =====================================================
echo    🎨 Astra Theme Configuration
echo =====================================================
echo.
echo Quick setup for your brand colors:
echo.
echo 🎨 Brand Colors:
echo Primary Orange: #ff9800
echo Secondary Blue: #2c3e50  
echo Text Color: #333333
echo.
echo 📝 Typography:
echo Font Family: Segoe UI
echo Heading Weight: 600
echo Body Weight: 400
echo.
echo 🖼️ Layout:
echo Container Width: 1200px
echo Layout: Full Width
echo Sidebar: No sidebar for main pages
echo.
echo To apply these settings:
echo 1. Go to WordPress Admin (Option 2)
echo 2. Navigate to: Appearance → Customize
echo 3. Go to: Global → Colors
echo 4. Set Primary Color: #ff9800
echo 5. Set Text Color: #333333
echo 6. Go to: Global → Typography  
echo 7. Set Base Font: Segoe UI
echo.
pause
goto MENU

:EXIT
echo.
echo =====================================================
echo    Thank you for using Local Development Manager!
echo =====================================================
echo.
echo Your WordPress site is ready at:
echo http://maa-anpurna-aahar.local
echo.
echo Remember:
echo ✅ Your live website is unaffected
echo ✅ All changes are local only
echo ✅ Database is safely managed in Local
echo ✅ Firebase integration is ready
echo.
echo Happy developing! 🚀
echo.
pause
exit

echo Invalid choice. Please try again.
goto MENU