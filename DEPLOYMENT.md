# LEOVERSE Netlify Deployment Guide

## 🚀 Deployment Checklist

### 1. Pre-Deployment Setup

#### A. Environment Variables
You need to set up environment variables in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add the following variables:

```
NEXT_PUBLIC_API_URL = https://your-api-domain.com/leo
```

**Important**: Replace `https://your-api-domain.com/leo` with your actual backend API URL.

#### B. Backend API Setup
Your PHP backend needs to be hosted somewhere (not Netlify, as Netlify doesn't support PHP). Options:

1. **Shared hosting** (cPanel, Hostinger, etc.)
2. **VPS** (DigitalOcean, Linode, AWS EC2)
3. **Heroku** (with PHP buildpack)
4. **Railway.app** (supports PHP)

Make sure your backend API has:
- CORS headers properly configured
- HTTPS enabled (required for production)
- All endpoints accessible

### 2. Fix CORS Issues

The `ERR_BLOCKED_BY_CLIENT` error is often caused by:

#### A. Browser Extensions
- Disable ad blockers (uBlock, AdBlock, Privacy Badger)
- Disable privacy extensions
- Try in incognito/private mode

#### B. CORS Configuration
Make sure your PHP backend has proper CORS headers. Update all your PHP files:

```php
<?php
// Add at the top of EVERY PHP API file
header("Access-Control-Allow-Origin: *"); // Or specify your Netlify domain
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

#### C. For Production (Secure CORS)
Replace `*` with your actual Netlify domain:

```php
$allowed_origins = [
    'https://your-app.netlify.app',
    'https://leoverse.netlify.app', // your actual domain
    'http://localhost:3000' // for local development
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
```

### 3. Netlify Configuration

The `netlify.toml` file has been created with optimal settings. Update it:

1. Open `netlify.toml`
2. Replace `YOUR_PRODUCTION_API_URL_HERE` with your actual backend URL
3. Commit the changes

### 4. Deploy to Netlify

#### Option A: Git-based Deployment (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Add Netlify configuration"
git push origin main
```

2. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Netlify will auto-detect Next.js settings
   - Add environment variables
   - Click "Deploy site"

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Option C: Drag & Drop (Not Recommended for Next.js)

1. Build locally: `npm run build`
2. Upload `.next` folder to Netlify

### 5. Common Deployment Issues & Fixes

#### Issue 1: Build Fails
**Error**: `Module not found` or `Cannot find module`

**Fix**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clean install
npm install

# Try build locally first
npm run build
```

#### Issue 2: API Calls Fail (ERR_BLOCKED_BY_CLIENT)
**Causes**:
- Browser extensions blocking requests
- CORS not configured on backend
- Wrong API URL in environment variables
- Mixed content (HTTP API on HTTPS site)

**Fix**:
1. Check browser console for exact error
2. Verify `NEXT_PUBLIC_API_URL` in Netlify environment variables
3. Ensure backend API uses HTTPS
4. Check backend CORS headers
5. Test API directly with Postman/curl

#### Issue 3: Environment Variables Not Working
**Error**: API calls go to `undefined` or `localhost`

**Fix**:
1. Environment variables must start with `NEXT_PUBLIC_` to be accessible in browser
2. Set variables in Netlify dashboard, not just `.env.local`
3. Redeploy after adding environment variables
4. Clear build cache: Site settings → Build & deploy → Clear cache and retry

#### Issue 4: 404 on Page Refresh
**Fix**: Already handled in `netlify.toml` with redirects

#### Issue 5: Images/Assets Not Loading
**Fix**:
```javascript
// In next.config.js (create if doesn't exist)
module.exports = {
  images: {
    domains: ['your-api-domain.com'],
  },
}
```

### 6. Post-Deployment Testing

After deployment, test these:

- [ ] Home page loads
- [ ] Login/Signup works
- [ ] Country selection works
- [ ] Mission builder loads components
- [ ] API calls successful (check Network tab)
- [ ] No CORS errors in console
- [ ] Images and videos load
- [ ] Responsive design works
- [ ] All routes work (no 404s)

### 7. Monitoring & Debugging

#### View Build Logs
1. Go to Netlify dashboard
2. Click on your deployment
3. View "Deploy log" for errors

#### View Runtime Errors
1. Check browser console (F12)
2. Go to Network tab
3. Look for failed requests (red)
4. Check response for error details

#### Common Console Errors

**Error**: `Mixed Content`
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'
```
**Fix**: Change API URL to HTTPS

**Error**: `CORS policy`
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Fix**: Update backend CORS headers

**Error**: `ERR_BLOCKED_BY_CLIENT`
```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```
**Fix**: Disable browser extensions or ad blockers

### 8. Netlify Environment Variables Setup

Set these in Netlify dashboard:

```bash
# Required
NEXT_PUBLIC_API_URL=https://your-backend.com/leo

# Optional (if you add these features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 9. Performance Optimization

Add to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-api-domain.com'],
  },
  // Optimize for Netlify
  output: 'standalone',
}

module.exports = nextConfig
```

### 10. Quick Troubleshooting Commands

```bash
# Check build locally
npm run build
npm run start

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run lint

# Deploy to Netlify
netlify deploy --prod
```

## 🔧 Backend Deployment Options

Since Netlify doesn't support PHP, deploy your backend separately:

### Option 1: InfinityFree (Free)
- Free PHP hosting with MySQL
- Good for testing
- URL: https://infinityfree.net

### Option 2: 000webhost (Free)
- Free PHP hosting
- URL: https://www.000webhost.com

### Option 3: Heroku (Free tier available)
```bash
# Add PHP buildpack
heroku buildpacks:add heroku/php

# Deploy
git push heroku main
```

### Option 4: Railway.app
- Supports PHP
- Easy deployment
- Free tier available

### Option 5: Your Own Server
- VPS (DigitalOcean, Linode)
- Shared hosting (Hostinger, Bluehost)

## 📝 Final Checklist

Before going live:

- [ ] Backend API deployed and accessible via HTTPS
- [ ] CORS properly configured on backend
- [ ] Environment variables set in Netlify
- [ ] `netlify.toml` configured with correct API URL
- [ ] Code pushed to GitHub
- [ ] Site connected to Netlify
- [ ] Build successful
- [ ] All features tested on production URL
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Custom domain configured (optional)

## 🆘 Still Having Issues?

1. **Check Netlify build logs** for specific errors
2. **Check browser console** (F12) for frontend errors
3. **Test API directly** with Postman to isolate backend issues
4. **Try different browser** to rule out extension issues
5. **Clear browser cache** and try again

## 📞 Common Error Solutions

| Error | Solution |
|-------|----------|
| `ERR_BLOCKED_BY_CLIENT` | Disable ad blockers, check CORS |
| `404 Not Found` | Check netlify.toml redirects |
| `500 Internal Server` | Check backend API logs |
| `CORS Error` | Update backend CORS headers |
| `Mixed Content` | Use HTTPS for API |
| Build fails | Check Node version, dependencies |

---

**Note**: The main issue you're facing (`ERR_BLOCKED_BY_CLIENT`) is typically a browser extension blocking the request. Try disabling all extensions or testing in incognito mode first. If the issue persists after deployment, ensure your backend API has proper CORS headers and is accessible via HTTPS.
