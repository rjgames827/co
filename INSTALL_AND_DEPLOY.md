# 🚀 Install Firebase CLI and Deploy Rules

## Step 1: Install Firebase CLI

Open PowerShell or Command Prompt and run:

```bash
npm install -g firebase-tools
```

Wait for installation to complete (may take 1-2 minutes).

## Step 2: Restart Your Terminal

Close and reopen your terminal/PowerShell window.

## Step 3: Run the Deployment Script

```bash
deploy-firestore-rules.bat
```

This will:
1. Login to Firebase (opens browser)
2. Deploy the rules
3. Show success message

## Step 4: Test Your Admin Access

1. Log out of the website
2. Clear browser cache (Ctrl+Shift+Delete)
3. Log back in with lily.smith7406@gmail.com
4. Open Admin Dashboard
5. All tabs should now load!

---

## Alternative: Manual Deployment via Firebase Console

If you don't want to install Firebase CLI, you can deploy manually:

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/gen-lang-client-0919821529/firestore/rules

### Step 2: Copy the Rules
Open the `firestore.rules` file in your project and copy ALL the content.

### Step 3: Paste and Publish
1. Paste the content into the Firebase Console editor
2. Click the "Publish" button
3. Wait for "Rules published successfully" message

### Step 4: Test Your Admin Access
1. Log out of the website
2. Clear browser cache (Ctrl+Shift+Delete)
3. Log back in with lily.smith7406@gmail.com
4. Open Admin Dashboard
5. All tabs (Suggestions, Appeals, Analytics) should now load!

---

## Why This Is Needed

The Admin Dashboard tabs are showing "Permission denied" because:
- Your local code recognizes you as admin ✅
- But the Firebase server doesn't have the updated rules yet ❌
- The tabs try to read from Firestore collections (suggestions, appeals, etc.)
- The server blocks the requests because the old rules don't recognize your email

Once you deploy the rules, the server will recognize your email and allow access.
