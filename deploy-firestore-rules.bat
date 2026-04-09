@echo off
echo ========================================
echo   RJ.P Games - Firestore Rules Deployment
echo ========================================
echo.
echo This script will deploy your Firestore security rules
echo to enable admin access for lily.smith7406@gmail.com
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [1/3] Checking Firebase CLI installation...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Firebase CLI is not installed!
    echo.
    echo Please install it first:
    echo   npm install -g firebase-tools
    echo.
    pause
    exit /b 1
)
echo ✓ Firebase CLI is installed

echo.
echo [2/3] Checking Firebase login status...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo You are not logged in to Firebase.
    echo Opening browser for authentication...
    firebase login
    if errorlevel 1 (
        echo ERROR: Firebase login failed!
        pause
        exit /b 1
    )
)
echo ✓ You are logged in to Firebase

echo.
echo [3/3] Deploying Firestore rules...
firebase deploy --only firestore:rules
if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed!
    echo.
    echo Possible reasons:
    echo - You don't have permission to deploy to this project
    echo - The project ID in .firebaserc is incorrect
    echo - Network connection issues
    echo.
    echo Try manual deployment via Firebase Console:
    echo https://console.firebase.google.com/project/gen-lang-client-0919821529/firestore/rules
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Next steps:
echo 1. Log out of the website completely
echo 2. Clear your browser cache (Ctrl+Shift+Delete)
echo 3. Log back in with lily.smith7406@gmail.com
echo 4. Try accessing Admin Dashboard
echo.
echo Your admin features should now work!
echo.
pause
