# Database Troubleshooting Guide

## 🔍 Issue: Data Not Being Added to Database

The signup request succeeds (no errors) but users aren't being created in the database.

## ✅ What I Fixed

### 1. UUID Generation
**Problem**: MySQL's `uuid()` function as default value might not work in all MySQL/MariaDB versions, and `lastInsertId()` doesn't work with UUIDs.

**Solution**: Generate UUID in PHP and insert it explicitly.

**Updated**: `api/auth/signup.php` now generates UUID manually:
```php
$user_id = sprintf(
    '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);
```

### 2. Better Error Reporting
Added detailed error messages to see exactly what's failing.

## 🧪 How to Test

### Step 1: Test Database Connection
Visit this URL in your browser:
```
http://localhost/leo/api/test_db.php
```

This will show you:
- ✅ Database connection status
- ✅ If `users` table exists
- ✅ Table structure (columns)
- ✅ Number of users in database
- ✅ Recent users created

### Step 2: Test Signup API Directly
You can test the signup API using a tool like Postman or curl:

**Using curl** (in PowerShell):
```powershell
curl.exe -X POST http://localhost/leo/api/auth/signup.php `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"password123\"}'
```

**Expected Response (Success)**:
```json
{
  "message": "User registered successfully",
  "token": "abc123...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "username": "testuser",
    "display_name": "testuser",
    "user_budget": "2000.00",
    "country_code": null,
    "created_at": "2025-10-05 12:34:56"
  }
}
```

### Step 3: Check MySQL Directly
Open phpMyAdmin or MySQL Workbench and run:
```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

## 🐛 Common Issues & Solutions

### Issue 1: "Users table does not exist"
**Solution**: Import the database schema:
1. Open phpMyAdmin
2. Select `leoverse` database
3. Go to Import tab
4. Choose file: `c:\Users\jbinn\Documents\leo\db_ver\leoverse_updated.sql`
5. Click "Go"

### Issue 2: "Database connection failed"
**Check**:
- Is XAMPP Apache + MySQL running?
- Is database named `leoverse`?
- Check `config/database.php` settings:
  - host: `localhost`
  - username: `root`
  - password: `` (empty)

### Issue 3: "Duplicate entry" error
**Meaning**: Email or username already exists in database.
**Solution**: Use a different email/username or delete the existing user.

### Issue 4: Silent failure (200 OK but no user created)
**Possible causes**:
1. MySQL uuid() not supported → **FIXED** (now generates UUID in PHP)
2. Table structure mismatch → Check with `test_db.php`
3. Permissions issue → Check MySQL user permissions

### Issue 5: CORS error still showing
**Solution**: Clear browser cache (Ctrl+Shift+Del) and try again.

## 📝 Debugging Steps

1. **Open Browser Console** (F12)
   - Look for network requests to `/api/auth/signup.php`
   - Check the response status and body
   - Look for any JavaScript errors

2. **Check Server Response**
   - Open Network tab in browser DevTools
   - Click on the signup request
   - View Response tab to see exact server message

3. **Check PHP Error Logs**
   - XAMPP: `C:\xampp\apache\logs\error.log`
   - Look for PHP errors or MySQL connection issues

4. **Test Database Connection**
   - Visit: `http://localhost/leo/api/test_db.php`
   - Should show database info

## 🔧 Alternative: Manual Table Creation

If database import fails, create the table manually:

```sql
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_budget` decimal(10,2) NOT NULL DEFAULT 2000.00,
  `display_name` varchar(100) DEFAULT NULL,
  `country_code` char(2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## ✅ Verification Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `leoverse` exists
- [ ] Table `users` exists with correct structure
- [ ] `test_db.php` returns success
- [ ] No CORS errors in browser console
- [ ] Signup request returns 201 status
- [ ] User appears in database after signup

## 🎯 Next Steps

1. **Visit**: http://localhost/leo/api/test_db.php
2. **Check** what it shows
3. **Try signup again** from the frontend
4. **Check browser console** for any errors
5. **Verify in database** if user was created

---

**Need help?** Share the output of `test_db.php` and browser console errors.
