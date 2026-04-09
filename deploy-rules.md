# Deploy Firestore Rules

You're getting a permissions error because the Firestore security rules haven't been updated on the server yet.

## Quick Fix - Deploy Rules via Firebase Console:

1. Go to https://console.firebase.google.com/
2. Select your project
3. Click "Firestore Database" in the left sidebar
4. Click the "Rules" tab at the top
5. Replace ALL the content with the rules from `firestore.rules` file
6. Click "Publish" button

## The Key Change in Rules:

The `isSuperAdmin()` function now checks for your email:

```javascript
function isSuperAdmin() {
  return isAuthenticated() && 
         (request.auth.uid == "HfjrcUIslZPCvNI3fxiQJVK1ebB3" ||
          request.auth.token.email.lower().matches(".*rj\\.po.*"));
}
```

This allows any email containing "rj.po" to have super admin access.

## After Deploying:

1. Log out completely from the site
2. Clear browser cache (Ctrl+Shift+Delete)
3. Log back in
4. The Admin Chat should work immediately

## Alternative: Use Firebase CLI

If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:rules
```

This will deploy the rules from your `firestore.rules` file.
