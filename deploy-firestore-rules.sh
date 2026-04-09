#!/bin/bash

echo "========================================"
echo "  RJ.P Games - Firestore Rules Deployment"
echo "========================================"
echo ""
echo "This script will deploy your Firestore security rules"
echo "to enable admin access for lily.smith7406@gmail.com"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "[1/3] Checking Firebase CLI installation..."
if ! command -v firebase &> /dev/null; then
    echo "ERROR: Firebase CLI is not installed!"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g firebase-tools"
    echo ""
    exit 1
fi
echo "✓ Firebase CLI is installed"

echo ""
echo "[2/3] Checking Firebase login status..."
if ! firebase projects:list &> /dev/null; then
    echo "You are not logged in to Firebase."
    echo "Opening browser for authentication..."
    firebase login
    if [ $? -ne 0 ]; then
        echo "ERROR: Firebase login failed!"
        exit 1
    fi
fi
echo "✓ You are logged in to Firebase"

echo ""
echo "[3/3] Deploying Firestore rules..."
firebase deploy --only firestore:rules
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Deployment failed!"
    echo ""
    echo "Possible reasons:"
    echo "- You don't have permission to deploy to this project"
    echo "- The project ID in .firebaserc is incorrect"
    echo "- Network connection issues"
    echo ""
    echo "Try manual deployment via Firebase Console:"
    echo "https://console.firebase.google.com/project/gen-lang-client-0919821529/firestore/rules"
    echo ""
    exit 1
fi

echo ""
echo "========================================"
echo "  ✓ DEPLOYMENT SUCCESSFUL!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Log out of the website completely"
echo "2. Clear your browser cache (Ctrl+Shift+Delete)"
echo "3. Log back in with lily.smith7406@gmail.com"
echo "4. Try accessing Admin Dashboard"
echo ""
echo "Your admin features should now work!"
echo ""
