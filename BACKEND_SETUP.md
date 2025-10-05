# Backend Setup Instructions

## Quick Start

The frontend is now configured to work **both with and without** the backend running!

### Option 1: Run Without Backend (Demo Mode)
- The app will work perfectly for testing
- Mission data is stored locally
- Leaderboard shows demo data
- All features work except data persistence across sessions

### Option 2: Run With Backend (Full Features)

#### Prerequisites
1. **XAMPP** or **WAMP** installed (for Apache + MySQL)
2. PHP 7.4+ 
3. MySQL running

#### Steps:

1. **Start Apache and MySQL**
   - Open XAMPP Control Panel
   - Start Apache
   - Start MySQL

2. **Import Database**
   ```sql
   -- Open phpMyAdmin (http://localhost/phpmyadmin)
   -- Create database 'leoverse'
   -- Import: C:\Users\jbinn\Documents\leo\db_ver\leoverse_updated.sql
   ```

3. **Update Database Config**
   Edit: `C:\Users\jbinn\Documents\leo\config\database.php`
   ```php
   private $host = "localhost";
   private $db_name = "leoverse";
   private $username = "root";
   private $password = "";  // Your MySQL password
   ```

4. **Verify Backend Location**
   Your backend should be accessible at:
   ```
   http://localhost/leo/api/...
   ```
   
   If different, update `.env.local` in frontend:
   ```
   NEXT_PUBLIC_API_URL=http://localhost/your-path
   ```

5. **Test Backend**
   Visit: `http://localhost/leo/api/missions/create.php`
   Should show a JSON error (not a 404)

## Current Backend Location

Your PHP backend is located at:
```
C:\Users\jbinn\Documents\leo\
```

Move it to your web server document root if needed:
- **XAMPP**: `C:\xampp\htdocs\leo\`
- **WAMP**: `C:\wamp64\www\leo\`

## Frontend Configuration

The frontend automatically:
- ✅ Tries to connect to backend
- ✅ Falls back to offline mode if backend unavailable  
- ✅ Shows appropriate error messages
- ✅ Works fully in demo mode

## Testing Backend Connection

Open browser console (F12) when using the app:
- "Mission saved to backend successfully!" = Backend working ✅
- "Backend unavailable, continuing offline" = Using demo mode ⚠️

## AI Chatbot Setup

1. Get your AI API endpoint URL
2. Update `.env.local`:
   ```
   NEXT_PUBLIC_AI_API_URL=https://your-ai-api.com/endpoint
   ```
3. If not configured, chatbot uses intelligent rule-based responses

## Troubleshooting

### Backend Not Connecting
1. Check XAMPP/WAMP is running
2. Verify database is imported
3. Check `NEXT_PUBLIC_API_URL` in `.env.local`
4. Look at browser console for errors

### CORS Errors
Backend PHP files already include CORS headers:
```php
header('Access-Control-Allow-Origin: *');
```

### Database Errors
1. Ensure MySQL is running
2. Check database credentials in `config/database.php`
3. Verify tables are created

---

**The app works perfectly without the backend - start building missions now!** 🚀
