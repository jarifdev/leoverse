# 🚨 QUICK FIX: ERR_BLOCKED_BY_CLIENT Error

## The Problem
You're seeing `ERR_BLOCKED_BY_CLIENT` because:
1. Your browser extension is blocking the request
2. Your API is on `localhost` (won't work on Netlify)
3. CORS headers might be misconfigured

## ⚡ Immediate Solutions

### Solution 1: Test Locally First
```powershell
# 1. Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost/leo" > .env.local

# 2. Restart dev server
npm run dev
```

### Solution 2: Disable Browser Extensions
1. Open browser in **Incognito/Private Mode**
2. Or disable these extensions:
   - uBlock Origin
   - AdBlock Plus
   - Privacy Badger
   - Any VPN extensions

### Solution 3: Fix Your PHP Backend CORS

Add to **ALL your PHP files** at the very top:

```php
<?php
// CORS Headers - Add to EVERY PHP API file
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-netlify-site.netlify.app'
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

## 🌐 For Netlify Deployment

### Step 1: Host Your Backend API
Your `localhost/leo` won't work on Netlify. You need to:

1. **Upload PHP backend to a public server**:
   - Web hosting with PHP support
   - VPS (DigitalOcean, Linode)
   - Heroku with PHP buildpack

2. **Get the public URL** (e.g., `https://api.yoursite.com/leo`)

### Step 2: Update Environment Variable in Netlify

1. Go to Netlify Dashboard
2. Your Site → **Site settings** → **Environment variables**
3. Add:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://your-backend-url.com/leo
   ```
4. Click **Save**
5. Trigger a new deploy

### Step 3: Update CORS in PHP Backend

Add your Netlify URL to allowed origins:

```php
$allowed_origins = [
    'https://your-site-name.netlify.app',
    'https://your-custom-domain.com' // if you have one
];
```

## 🧪 Testing

### Test API Endpoint:
```powershell
# Replace with your actual API URL
curl -X POST https://your-api-url.com/leo/api/auth/login.php `
  -H "Content-Type: application/json" `
  -d '{"login":"test","password":"test"}'
```

### Test in Browser Console:
```javascript
fetch('https://your-api-url.com/leo/api/auth/login.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({login: 'test', password: 'test'})
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## 📝 Checklist

- [ ] Backend API is hosted publicly (not localhost)
- [ ] Backend has CORS headers with Netlify domain
- [ ] Backend is accessible via HTTPS
- [ ] Environment variable set in Netlify
- [ ] Site redeployed after adding env variable
- [ ] Tested in incognito mode (no extensions)
- [ ] API endpoint responds to test requests

## 🆘 Still Not Working?

1. **Check Netlify Logs**:
   - Deploys → Click latest deploy → View function logs

2. **Check Browser Console**:
   - F12 → Console tab → Look for errors
   - F12 → Network tab → Check failed requests

3. **Verify API is accessible**:
   - Open API URL in browser
   - Should see JSON response or error (not 404)

## 💡 Common Mistakes

❌ Using `http://localhost/leo` in Netlify environment variables
✅ Use public URL: `https://api.yoursite.com/leo`

❌ Forgetting to redeploy after adding environment variables
✅ Trigger new deploy after any env var changes

❌ CORS headers missing in PHP files
✅ Add CORS headers to ALL PHP API files

❌ Testing with ad blocker enabled
✅ Test in incognito mode or disable extensions

---

**Remember**: Netlify can only host your **frontend** (React/Next.js). Your PHP backend must be hosted separately on a server that supports PHP!
