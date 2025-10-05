# CORS Fix - Backend API Files

## ✅ FIXED FILES
The following authentication files have been updated with proper CORS headers:
- `api/auth/signup.php`
- `api/auth/login.php`
- `api/auth/verify.php`

## 🔧 What Was Changed

### Before (Caused CORS Error):
```php
header("Access-Control-Allow-Origin: *");
```

### After (Works with any localhost port):
```php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

## 📝 To Fix Other Backend Files

You have other API files that may need the same CORS fix:
- `api/missions/create.php`
- `api/missions/add_component.php`
- `api/missions/complete.php`
- `api/missions/get_user_missions.php`
- `api/missions/get_mission_details.php`
- `api/chat/create_session.php`
- `api/chat/update_context.php`
- `api/progress/update.php`
- `api/progress/get.php`
- `api/achievements/award.php`
- `api/achievements/get_user_achievements.php`

### Option 1: Use the CORS Config File (Recommended)

I've created `config/cors.php` for you. Add this to the top of each API file:

```php
<?php
require_once '../../config/cors.php'; // Adjust path as needed
require_once '../../config/database.php';
// ... rest of your code
```

### Option 2: Manual Update

Replace the CORS headers in each file with:

```php
<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
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
```

## 🧪 Test Authentication Now

The auth endpoints should now work! Try:

1. Go to http://localhost:3002 (or whatever port Next.js is using)
2. Click "Sign Up"
3. Create an account
4. You should be redirected to country selection!

## 🐛 If Still Getting CORS Errors

1. **Check Apache is running** (XAMPP)
2. **Verify PHP files are accessible**:
   - Try: http://localhost/leo/api/auth/signup.php
   - You should see an error (method not allowed) but page should load
3. **Check browser console** for the exact error
4. **Clear browser cache** and try again
5. **Check Apache error logs** in XAMPP

## 📊 Understanding CORS

**What is CORS?**
Cross-Origin Resource Sharing - a security feature that prevents websites from accessing resources from different origins.

**Why did we get the error?**
- Frontend: `http://localhost:3002`
- Backend: `http://localhost/leo`
- Different ports = different origins = CORS policy applies

**How we fixed it:**
- Added proper CORS headers to allow requests from any `localhost` port
- Added OPTIONS method handler for preflight requests
- Enabled credentials for authentication

## 🎯 Next Steps

1. **Test signup/login** - Should work now!
2. **If missions/chat/other features have CORS errors**, update those files too
3. **Use `config/cors.php`** in all future API files

---

**Authentication should now work!** 🎉
