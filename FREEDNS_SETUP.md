# FreeDNS Auto-Registration Setup Guide

## Overview
This guide explains how to set up automatic subdomain registration using FreeDNS API.

## What You Need
1. A FreeDNS account (free at https://freedns.afraid.org/)
2. Your FreeDNS username and password
3. A backend server to handle API requests

## Setup Steps

### 1. Get Your FreeDNS Credentials
- Go to https://freedns.afraid.org/
- Create a free account or log in
- Note your username and password

### 2. Set Up the Backend Server

#### Option A: Deploy to Vercel/Netlify/Railway
1. Copy `server-freedns.js` to your backend project
2. Install dependencies:
   ```bash
   npm install express cors node-fetch crypto
   ```
3. Update credentials in `server-freedns.js`:
   ```javascript
   const FREEDNS_USERNAME = 'your_actual_username';
   const FREEDNS_PASSWORD = 'your_actual_password';
   ```
4. Deploy to your hosting service
5. Update the API endpoint in `GenWebsite.tsx`:
   ```typescript
   const response = await fetch('https://your-backend.vercel.app/register-subdomain', {
   ```

#### Option B: Use FreeDNS Dynamic Update URLs Directly
1. Go to https://freedns.afraid.org/api/
2. Find your SHA-1 hash (format: `username|password`)
3. Each subdomain has a unique update URL like:
   ```
   http://freedns.afraid.org/dynamic/update.php?T3M1R...
   ```
4. Call this URL to register/update the subdomain

### 3. How It Works

1. User clicks "Generate Link" in the frontend
2. Frontend generates random subdomain (e.g., `coolzone123.mooo.com`)
3. Frontend calls your backend API: `/register-subdomain`
4. Backend authenticates with FreeDNS using SHA-1 hash
5. Backend registers the subdomain as a web forward to `https://chillz0ne.dev/`
6. FreeDNS processes the registration (5-10 minutes)
7. Subdomain becomes live and redirects to ChillZone

### 4. FreeDNS API Details

**Authentication:**
- SHA-1 hash of `username|password` (no quotes, lowercase username)
- Example: `echo -n "myuser|mypass" | sha1sum`

**Update URL Format:**
```
http://freedns.afraid.org/dynamic/update.php?[SHA-1-HASH]
```

**Response:**
- Success: "Updated 1 host(s)"
- No change: "has not changed"
- Error: Error message

### 5. Testing

1. Start your backend server:
   ```bash
   node server-freedns.js
   ```

2. Test the endpoint:
   ```bash
   curl -X POST http://localhost:3001/register-subdomain \
     -H "Content-Type: application/json" \
     -d '{"subdomain":"test123","domain":"mooo.com","destination":"https://chillz0ne.dev/"}'
   ```

3. Check FreeDNS dashboard to verify registration

### 6. Security Notes

- Never commit your FreeDNS credentials to Git
- Use environment variables for credentials:
  ```javascript
  const FREEDNS_USERNAME = process.env.FREEDNS_USERNAME;
  const FREEDNS_PASSWORD = process.env.FREEDNS_PASSWORD;
  ```
- Consider rate limiting to prevent abuse
- Add authentication to your backend API

### 7. Alternative: Manual Registration

If automatic registration doesn't work, users can still register manually:
1. Click the "Manual" button on any generated link
2. Go to FreeDNS website
3. Select "Web Forward" type
4. Enter destination: `https://chillz0ne.dev/`
5. Save and wait 5-10 minutes

## Troubleshooting

**"Registration failed"**
- Check FreeDNS credentials are correct
- Verify username is lowercase
- Ensure password is max 16 characters
- Check if subdomain already exists

**"CORS error"**
- Add CORS headers to your backend
- Use a backend proxy instead of direct FreeDNS calls

**"Subdomain not working"**
- Wait 5-10 minutes for DNS propagation
- Check FreeDNS dashboard for status
- Verify web forward destination is correct

## Resources

- FreeDNS Website: https://freedns.afraid.org/
- FreeDNS API Docs: https://freedns.afraid.org/api/
- Available Domains: https://freedns.afraid.org/domain/registry/
