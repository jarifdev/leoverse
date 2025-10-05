# AI Assistant - Troubleshooting Guide

## Common Issues & Solutions

### ❌ Issue 1: "Request timed out" or Long Wait Times

**Symptom:** First message takes 30-60 seconds or times out

**Cause:** Your API is hosted on Render.com free tier, which "sleeps" apps after 15 minutes of inactivity. The first request after sleep needs to "wake up" the service.

**Solutions:**

1. **Wait Patiently (Recommended)**
   - First request: 30-60 seconds
   - Subsequent requests: 2-5 seconds
   - This is normal for free tier hosting

2. **Upgrade Hosting (Best Long-term)**
   - Upgrade to Render.com paid plan ($7/month)
   - Keeps service always active
   - Instant responses every time

3. **Use Different Hosting**
   - Deploy to Vercel, Railway, or AWS
   - Some offer better free tiers

---

### ❌ Issue 2: "Unable to reach the AI service"

**Symptom:** Error message about connectivity

**Causes & Solutions:**

**A. API is Down**
- Check if https://nr-test.onrender.com/ is accessible
- Visit the URL in browser
- Should return something (even if error page)
- If site is down, restart on Render.com dashboard

**B. CORS Error**
- Check browser console (F12)
- If you see "CORS policy" error
- Your API needs to allow requests from `http://localhost:3000`
- Add CORS headers to your Flask/Express app:

```python
# Flask example
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://your-domain.com"])
```

```javascript
// Express example
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com']
}));
```

**C. Wrong Endpoint**
- Current endpoint: `https://nr-test.onrender.com/chat`
- Check if your API uses different path
- Common alternatives: `/api/chat`, `/query`, `/ask`
- Update `CHATBOT_API_URL` in `AIAssistant.js` if needed

---

### ❌ Issue 3: "I couldn't generate a response"

**Symptom:** AI responds but with generic error message

**Cause:** API returned unexpected format

**Solution:** Check response format

Your API should return one of these:
```json
{"response": "Your answer here"}
```
OR
```json
{"message": "Your answer here"}
```
OR
```json
{"answer": "Your answer here"}
```

Current code handles all three formats. If your API uses different field name, update `AIAssistant.js`:

```javascript
// Around line 75
let botContent = '';
if (response.data.your_field_name) {  // Change this
  botContent = response.data.your_field_name;
}
```

---

### ❌ Issue 4: Chatbot Button Not Appearing

**Symptom:** No robot button visible on site

**Solutions:**

1. **Hard Refresh Browser**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Check Console for Errors**
   - Press F12
   - Look for red errors
   - Common issues: Import error, component crash

3. **Verify Installation**
   ```bash
   # Check if file exists
   ls components/AIAssistant.js
   
   # Check if imported in layout
   grep "AIAssistant" app/layout.js
   ```

4. **Check Z-Index Conflicts**
   - Button uses `z-50`
   - If other elements use higher z-index, button may be hidden
   - Increase to `z-[100]` in AIAssistant.js if needed

---

### ❌ Issue 5: Messages Not Scrolling

**Symptom:** New messages appear but don't auto-scroll to view

**Solution:** Refresh the chat
- Click "Clear" button
- Close and reopen chat
- Should work after refresh

**If persistent:**
- Browser console (F12) → check for errors
- Try different browser
- Hard refresh page

---

### ❌ Issue 6: "API Error (500)"

**Symptom:** Error message shows HTTP 500 status

**Cause:** Your chatbot API has an internal error

**Debugging Steps:**

1. **Check API Logs on Render.com**
   - Go to Render.com dashboard
   - Select your service
   - View "Logs" tab
   - Look for Python/Node error messages

2. **Test API Directly**
   ```bash
   # PowerShell
   $body = '{"message":"test","conversation_history":[]}'; 
   Invoke-RestMethod -Uri "https://nr-test.onrender.com/chat" -Method POST -Body $body -ContentType "application/json"
   ```

3. **Common API Errors**
   - Missing dependencies
   - Database connection failed
   - API key issues (if using OpenAI, etc.)
   - Memory limit exceeded

---

### ❌ Issue 7: Suggested Questions Not Working

**Symptom:** Click suggested question button but nothing happens

**Solution:** Check if in loading state
- Can't click while AI is responding
- Wait for current response to finish
- Then suggested questions will work

**If still broken:**
- Check browser console for errors
- Try typing question manually instead

---

## 🔍 Debugging Commands

### Test API Endpoint (PowerShell)
```powershell
# Simple test
$body = '{"message":"hello","conversation_history":[]}'; 
Invoke-RestMethod -Uri "https://nr-test.onrender.com/chat" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 90

# With error details
try {
    $body = '{"message":"hello","conversation_history":[]}'; 
    $response = Invoke-RestMethod -Uri "https://nr-test.onrender.com/chat" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 90
    Write-Host "Success:" 
    $response | ConvertTo-Json
} catch {
    Write-Host "Error:"
    $_.Exception.Message
}
```

### Check API Status
```powershell
# Quick check if API is online
Invoke-WebRequest -Uri "https://nr-test.onrender.com" -Method GET -TimeoutSec 10
```

### View Component Errors (Browser Console)
```javascript
// Press F12 in browser, then type:
localStorage.clear()  // Clear any cached errors
location.reload()     // Refresh page
```

---

## ⚙️ Configuration Changes

### Increase Timeout (for very slow APIs)
File: `components/AIAssistant.js`
```javascript
// Line ~71
timeout: 120000  // Change from 60000 to 120000 (2 minutes)
```

### Change API Endpoint
File: `components/AIAssistant.js`
```javascript
// Line ~8
const CHATBOT_API_URL = 'https://your-new-api-url.com';
```

### Disable "Waking up" Message
File: `components/AIAssistant.js`
```javascript
// Line ~16
const [isFirstMessage, setIsFirstMessage] = useState(false);  // Change true to false
```

---

## 🧪 Quick Test Checklist

Run through these steps:

1. [ ] Open browser, go to http://localhost:3000
2. [ ] Press F12, check Console tab for errors
3. [ ] See robot button in bottom-right corner
4. [ ] Click button → chat opens smoothly
5. [ ] See welcome message with timing note
6. [ ] Type "hello" and press Enter
7. [ ] See "Waking up AI service..." message
8. [ ] Wait 30-60 seconds (first time only)
9. [ ] AI responds with actual answer
10. [ ] Send another message → responds in 2-5 seconds
11. [ ] Click suggested question → auto-fills input
12. [ ] Click "Clear" → chat resets
13. [ ] Click X → chat closes
14. [ ] Navigate to different page → button still visible

---

## 🆘 Still Having Issues?

### Collect Debug Information:

1. **Browser Console Log** (F12 → Console tab)
   - Screenshot any red errors
   - Note: "Chatbot API error:" messages

2. **Network Tab** (F12 → Network tab)
   - Filter by "chat"
   - Click the failed request
   - Check "Response" tab for error details

3. **API Logs** (Render.com Dashboard)
   - Your service → Logs tab
   - Look for errors around time of request

4. **Test API Separately**
   - Use Postman or curl
   - Verify API works outside of website
   - If API works but website doesn't → CORS issue

### Quick Fixes to Try:

1. Clear browser cache
2. Try incognito/private window
3. Test in different browser
4. Restart dev server (`npm run dev`)
5. Check if API is actually running

---

## 📞 API Requirements Checklist

Your deployed chatbot API must:

- ✅ Accept POST requests to `/chat` endpoint
- ✅ Accept JSON body with `message` field
- ✅ Allow CORS from your domain
- ✅ Return JSON with `response`, `message`, or `answer` field
- ✅ Handle `conversation_history` array (optional but recommended)
- ✅ Respond within 60 seconds (preferably faster)
- ✅ Use HTTPS (not HTTP)

Example working request:
```bash
POST https://nr-test.onrender.com/chat
Content-Type: application/json

{
  "message": "What is LEO?",
  "conversation_history": []
}
```

Example working response:
```json
{
  "response": "LEO stands for Low Earth Orbit, which is an orbital altitude between 160-2000 km above Earth's surface..."
}
```

---

**Most Common Issue:** First request timeout due to free tier cold start. **Solution:** Just wait patiently!
