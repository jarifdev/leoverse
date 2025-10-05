# LEOVERSE - Quick Setup & Troubleshooting

## 🚨 Current Error: ERR_BLOCKED_BY_CLIENT

This error means your browser is blocking the API request. Here's how to fix it:

### Immediate Fixes:

1. **Disable Browser Extensions** (Most Common Cause)
   - Ad blockers (uBlock Origin, AdBlock Plus, etc.)
   - Privacy extensions (Privacy Badger, Ghostery)
   - Security extensions
   - Try in **Incognito/Private mode** (Ctrl+Shift+N in Chrome)

2. **Check Your API URL**
   ```bash
   # Make sure your backend is running
   # Test with: http://localhost/leo/api/auth/login.php
   ```

3. **CORS Configuration**
   - Your PHP backend needs proper CORS headers
   - See DEPLOYMENT.md for details

## 🔧 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
# Copy the example file
copy .env.example .env.local

# Edit .env.local and set:
NEXT_PUBLIC_API_URL=http://localhost/leo
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the App
Open http://localhost:3000 in your browser

## 🌐 Netlify Deployment

### Quick Deploy Steps:

1. **Set Environment Variable in Netlify**
   - Go to Site settings → Environment variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/leo`

2. **Deploy via GitHub**
   ```bash
   git add .
   git commit -m "Configure for Netlify"
   git push origin main
   ```

3. **Or Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

## ⚠️ Important Notes

### Backend Hosting
Netlify doesn't support PHP! You need to host your backend separately:
- InfinityFree (free)
- 000webhost (free)
- Heroku with PHP buildpack
- Railway.app
- Your own VPS/hosting

### HTTPS Requirement
For production, your backend MUST use HTTPS. Browsers block HTTP requests from HTTPS sites.

### CORS Headers
Every PHP file needs these headers:
```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
```

## 🐛 Common Issues

### Issue: API calls return CORS error
**Solution**: Update PHP backend CORS headers

### Issue: Can't login/signup
**Solution**: 
1. Check if backend is running
2. Check browser console for errors
3. Disable ad blockers
4. Try incognito mode

### Issue: Build fails on Netlify
**Solution**:
1. Check build logs for specific error
2. Make sure all dependencies are in package.json
3. Clear cache and retry

### Issue: Page shows but no data loads
**Solution**:
1. Check if NEXT_PUBLIC_API_URL is set in Netlify
2. Verify backend is accessible from internet
3. Check backend has HTTPS

## 📞 Testing Your Setup

### Test Backend
```bash
# Test if backend is accessible
curl http://localhost/leo/api/auth/login.php
```

### Test Frontend
```bash
# Build to check for errors
npm run build

# If build succeeds, try running
npm run start
```

### Test API Connection
Open browser console (F12) and run:
```javascript
fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/login.php')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

## 📚 Documentation

- **DEPLOYMENT.md** - Complete deployment guide
- **DESIGN_SYSTEM.md** - Design guidelines
- **EARTH_BACKGROUNDS.md** - Earth imagery implementation
- **README.md** - Project overview

## 🆘 Still Stuck?

1. Check browser console (F12) for exact error
2. Check Netlify build logs
3. Test backend API with Postman
4. Disable ALL browser extensions
5. Try different browser

---

**Remember**: `ERR_BLOCKED_BY_CLIENT` is almost always caused by browser extensions. Start by testing in incognito mode!
