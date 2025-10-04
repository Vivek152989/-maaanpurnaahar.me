@echo off
echo =====================================================
echo    Copy Firebase Files to WordPress
echo =====================================================
echo.

echo This script will copy your Firebase configuration to WordPress
echo Make sure your Local by Flywheel site is running first!
echo.
echo Your WordPress site should be at:
echo C:\Users\%USERNAME%\Local Sites\maa-anpurna-aahar\app\public\
echo.

set /p wppath="Enter your WordPress site path (or press Enter for default): "
if "%wppath%"=="" set wppath=C:\Users\%USERNAME%\Local Sites\maa-anpurna-aahar\app\public\

echo.
echo Copying Firebase configuration files...

REM Create assets directory in active theme
mkdir "%wppath%wp-content\themes\astra\assets" 2>nul
mkdir "%wppath%wp-content\themes\astra\assets\js" 2>nul

REM Copy Firebase files
copy "wordpress-site\assets\js\firebase-config.js" "%wppath%wp-content\themes\astra\assets\js\" 2>nul
copy "wordpress-site\assets\js\wordpress-firebase-integration.js" "%wppath%wp-content\themes\astra\assets\js\" 2>nul

echo.
echo Firebase files copied successfully!
echo.

echo Next steps:
echo 1. Add Firebase functions to your theme's functions.php
echo 2. Configure Astra colors to match your brand
echo 3. Test Firebase authentication
echo.

pause