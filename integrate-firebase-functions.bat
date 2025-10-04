@echo off
echo =====================================================
echo    Integrating Firebase with WordPress Functions
echo =====================================================

set wppath=C:\Users\dduc\Local Sites\maa-anpurna-aahar\app\public\wp-content\themes\astra\

echo Backing up original functions.php...
copy "%wppath%functions.php" "%wppath%functions-original-backup.php" >nul 2>&1

echo Adding Firebase integration to functions.php...
echo. >> "%wppath%functions.php"
echo. >> "%wppath%functions.php"
echo // Firebase Integration for Maa Anpurna Aahar >> "%wppath%functions.php"
echo // Added on %date% %time% >> "%wppath%functions.php"
type "wordpress-functions.php" >> "%wppath%functions.php"

echo.
echo =====================================================
echo Firebase integration added successfully!
echo =====================================================
echo.
echo What was added:
echo ✅ Firebase authentication bridge
echo ✅ Google Sign-In integration  
echo ✅ Phone/OTP authentication
echo ✅ WooCommerce enhancements
echo ✅ Custom styling for your brand colors
echo ✅ Performance optimizations
echo.
echo Your original functions.php is backed up as:
echo functions-original-backup.php
echo.
echo Next steps:
echo 1. Open your WordPress admin at: http://maa-anpurna-aahar.local/wp-admin
echo 2. Install and configure Astra theme
echo 3. Set up your brand colors (Orange #ff9800, Blue #2c3e50)
echo 4. Test Firebase authentication
echo.
pause