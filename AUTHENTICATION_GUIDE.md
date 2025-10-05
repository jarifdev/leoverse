# Authentication Setup Complete! 🔐

## What's New

Your LEOverse application now has **full authentication** integrated with your backend database!

## ✅ Completed Features

### 1. Backend PHP API
- **Location**: `c:\Users\jbinn\Documents\leo\api\auth\`
- **Endpoints**:
  - `signup.php` - User registration with validation
  - `login.php` - User authentication
  - `verify.php` - Token verification
- **Database**: Uses your `users` table with password hashing (bcrypt)
- **Security**: Password validation, email validation, unique username/email checks

### 2. Frontend Authentication Pages
- **`/signup`** - Complete registration form with validation
- **`/login`** - Login with username or email
- **Landing page** - Login/Signup buttons (top-right when not logged in)

### 3. Protected Routes
- All pages now require authentication except:
  - `/` (Landing page)
  - `/login`
  - `/signup`
- Automatic redirect to login if not authenticated

### 4. User Session Management
- **Persistent login** via localStorage
- **Auth token** sent with all API requests
- **Logout functionality** in navigation bar
- User info displayed in navbar

### 5. Navigation Bar
- Added to all authenticated pages
- Shows username/display name
- Quick access to Mission Builder and Leaderboard
- Logout button with confirmation

## 🚀 How to Use

### Step 1: Start Backend Server
```bash
# Make sure your PHP server is running (e.g., XAMPP)
# Backend should be accessible at: http://localhost/leo
```

### Step 2: Start Frontend
```bash
cd C:\Users\jbinn\Downloads\NASA_hackathon\leoverse-frontend
npm run dev
```

**Current server**: http://localhost:3002

### Step 3: Create an Account
1. Go to http://localhost:3002
2. Click **"Sign Up"** button (top-right)
3. Fill in:
   - Email address
   - Username (3-50 chars, letters/numbers/underscore)
   - Display Name (optional)
   - Password (min 6 chars)
4. Click "Create Account"

### Step 4: Start Building Missions!
- You'll be automatically redirected to country selection
- Your session persists even after closing browser
- Use the navbar to navigate between pages

## 📝 Database Schema

Your backend uses this `users` table structure:

```sql
CREATE TABLE `users` (
  `id` char(36) PRIMARY KEY DEFAULT uuid(),
  `email` varchar(255) UNIQUE NOT NULL,
  `username` varchar(50) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_budget` decimal(10,2) DEFAULT 2000.00,
  `display_name` varchar(100),
  `country_code` char(2),
  `created_at` timestamp DEFAULT current_timestamp()
);
```

## 🔒 Security Features

1. **Password Hashing**: Bcrypt encryption (not plain text)
2. **Input Validation**:
   - Email format validation
   - Username pattern validation (alphanumeric + underscore)
   - Password length requirement (min 6 chars)
3. **Duplicate Prevention**: Checks for existing email/username
4. **Auth Tokens**: Bearer token sent with all authenticated requests
5. **Protected Routes**: Client-side route guarding

## 🎯 User Flow

```
Landing Page (/)
    ↓
[Not Logged In?] → Sign Up (/signup) → Create Account
    ↓                                        ↓
    ←───────────────────────────────────────
    ↓
[Logged In] → Country Selection (/country)
    ↓
Budget Overview (/budget)
    ↓
Mission Builder (/mission) ← [Navbar Access]
    ↓
Results (/result)
    ↓
Leaderboard (/leaderboard) ← [Navbar Access]
```

## 🔧 Configuration

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost/leo
NEXT_PUBLIC_AI_API_URL=your-ai-api-url
```

### API Endpoints
All API calls automatically include:
- `Authorization: Bearer <token>` header
- Proper CORS headers
- JSON content-type

## 🆘 Troubleshooting

### "Invalid credentials" on login
- Check username/email spelling
- Verify password is correct
- Ensure backend database is accessible

### "Email already registered"
- Use a different email address
- Or login with existing account

### "Backend unavailable"
- Verify PHP server (XAMPP) is running
- Check database connection in `config/database.php`
- Confirm API URL in `.env.local`

### Can't access protected pages
- Make sure you're logged in
- Check browser console for errors
- Try logging out and back in

### Session not persisting
- Check browser localStorage for `leoverse-storage`
- Ensure cookies/storage not blocked
- Try clearing browser cache

## 📱 Features by Page

### Landing Page (/)
- Hero section with animation
- Feature showcase
- Login/Signup buttons (when not authenticated)
- Direct navigation to country selection (when authenticated)

### Signup Page (/signup)
- Full registration form
- Real-time validation
- Password confirmation
- Link to login page

### Login Page (/login)
- Login with username OR email
- Remember session
- Link to signup page
- Error handling with user feedback

### All Protected Pages
- **Navbar** with:
  - Logo (links to country selection)
  - Mission Builder link
  - Leaderboard link
  - User display name
  - Logout button
- Automatic redirect if not authenticated
- Loading state while checking auth

## 🎨 UI Components

### Navbar
- **Fixed top position** with backdrop blur
- **Responsive** - collapses on mobile
- **User indicator** with icon
- **Logout button** with confirmation

### Auth Forms
- **Icon-based inputs** for better UX
- **Loading states** during API calls
- **Error messages** with animations
- **Form validation** with helpful hints

## 🔄 State Management

### Zustand Store (lib/store.js)
```javascript
{
  user: {
    id: 'uuid',
    email: 'user@example.com',
    username: 'space_explorer',
    display_name: 'Captain Awesome',
    user_budget: 2000.00,
    country_code: null,
    created_at: '2025-10-05'
  },
  authToken: 'generated-token-string',
  isAuthenticated: true,
  // ... other state
}
```

### Persisted Data
The following state persists across sessions:
- `user` - User information
- `authToken` - Authentication token
- `isAuthenticated` - Auth status
- `selectedCountry` - Last selected country
- `progress` - User progress data

## 📊 API Integration

### Auth API Client (lib/api.js)
```javascript
// Automatic token injection on all requests
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth endpoints
authAPI.signup({ email, username, password, display_name })
authAPI.login({ login, password })
authAPI.verify({ user_id })
```

## 🎯 Next Steps

1. **Test the authentication flow**:
   - Create a test account
   - Login and logout
   - Navigate between pages
   - Verify session persistence

2. **Import database schema**:
   ```bash
   # In MySQL/phpMyAdmin
   mysql -u root leoverse < c:/Users/jbinn/Documents/leo/db_ver/leoverse_updated.sql
   ```

3. **Optional enhancements**:
   - Add password reset functionality
   - Implement "Remember me" option
   - Add profile page to update user info
   - Enable social login (Google, GitHub, etc.)

4. **AI Chatbot**:
   - Add your AI API URL to `.env.local`
   - Update `NEXT_PUBLIC_AI_API_URL` variable
   - Chatbot will automatically use real API

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify backend server is running
3. Check database connection
4. Review `.env.local` configuration
5. Ensure all dependencies are installed

## 🎉 Success!

Your LEOverse application now has:
✅ Complete user authentication
✅ Secure password handling
✅ Protected routes
✅ Persistent sessions
✅ Professional navigation
✅ Backend integration

**Ready to build amazing space missions!** 🚀🌟
