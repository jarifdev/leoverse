# APOD Feature - Quick Test Guide

## 🧪 Testing APOD Image Display

### Quick Start Test

1. **Start Development Server**
   ```powershell
   cd leoverse-frontend
   npm run dev
   ```

2. **Open Browser**
   - Go to http://localhost:3000
   - Login to your account

3. **Test with Mock Data**
   Open browser console (F12) and paste:
   ```javascript
   // Simulate APOD response
   const testAPOD = {
     ok: true,
     answer: "This is a test response about a lunar eclipse. The image shows the beautiful phenomenon captured by NASA.",
     apod: {
       title: "Lunar Eclipse in Two Hemispheres (2025-09-12)",
       date: "2025-09-12",
       url: "https://apod.nasa.gov/apod/image/2509/Eclipse2TH_Payne_960.jpg",
       hdurl: "https://apod.nasa.gov/apod/image/2509/Eclipse2TH_Payne_2048.jpg"
     }
   };
   
   console.log("Test APOD data:", testAPOD);
   ```

---

## 📋 Test Scenarios

### Scenario 1: RAG API with APOD
**Query:** "Tell me about the lunar eclipse on September 12, 2025"

**Expected API Response:**
```json
{
  "ok": true,
  "answer": "On September 12, 2025, there was a total lunar eclipse...",
  "apod": {
    "title": "Lunar Eclipse in Two Hemispheres",
    "date": "2025-09-12",
    "url": "https://apod.nasa.gov/apod/image/...",
    "hdurl": "https://apod.nasa.gov/apod/image/...HD.jpg"
  }
}
```

**What You Should See:**
1. ✅ AI response text appears
2. ✅ Image loads below text
3. ✅ Image has blue border
4. ✅ Title appears below image (blue text)
5. ✅ Date appears with calendar emoji
6. ✅ "View HD Image" button visible
7. ✅ Cursor changes to pointer on hover
8. ✅ Clicking image opens HD version in new tab

---

### Scenario 2: RAG API without APOD
**Query:** "What is orbital mechanics?"

**Expected API Response:**
```json
{
  "ok": true,
  "answer": "Orbital mechanics is the study of motion..."
}
```

**What You Should See:**
1. ✅ AI response text appears
2. ✅ No image section
3. ✅ Normal chat bubble (no extra spacing)

---

### Scenario 3: APOD with Missing Fields
**Query:** Ask about space event

**API Response (minimal):**
```json
{
  "ok": true,
  "answer": "Here's information about that event...",
  "apod": {
    "url": "https://apod.nasa.gov/apod/image/example.jpg"
  }
}
```

**What You Should See:**
1. ✅ Image displays correctly
2. ✅ Generic alt text: "Astronomy Picture of the Day"
3. ✅ No title shown (gracefully handled)
4. ✅ No date shown (gracefully handled)
5. ✅ "View HD Image" button opens same URL (fallback)

---

## 🔍 Visual Checklist

### Image Display
- [ ] Image loads and displays
- [ ] Image is full-width in chat bubble
- [ ] Image maintains aspect ratio
- [ ] Rounded corners on container
- [ ] Blue border visible

### Metadata Section
- [ ] Dark background below image
- [ ] Title in blue text (if present)
- [ ] Date formatted nicely (if present)
- [ ] Calendar emoji before date

### Interactivity
- [ ] Cursor changes to pointer over image
- [ ] Hover reduces opacity to 90%
- [ ] Clicking image opens HD version
- [ ] "View HD Image" button works
- [ ] HD opens in new tab (doesn't replace current page)

### Responsive Behavior
- [ ] Image resizes with chat window
- [ ] Text doesn't overflow
- [ ] Looks good on narrow widths
- [ ] Maintains readability

---

## 🧪 Manual API Test

### Test Real RAG API with PowerShell

```powershell
# Test query that might return APOD
$body = '{"query":"What astronomical event happened on September 12, 2025?"}'; 
$response = Invoke-RestMethod -Uri "https://nr-test.onrender.com/api/rag" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 120

# Display response
$response | ConvertTo-Json -Depth 5

# Check if APOD exists
if ($response.apod) {
    Write-Host "`n✅ APOD data present!" -ForegroundColor Green
    Write-Host "Title: $($response.apod.title)" -ForegroundColor Cyan
    Write-Host "Date: $($response.apod.date)" -ForegroundColor Cyan
    Write-Host "URL: $($response.apod.url)" -ForegroundColor Cyan
    Write-Host "HD URL: $($response.apod.hdurl)" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ No APOD data in response" -ForegroundColor Yellow
}
```

---

## 🐛 Debugging Steps

### Issue: Image Not Displaying

**1. Check Console for Errors**
```javascript
// F12 → Console tab, look for:
// - "Failed to load resource" (broken image URL)
// - "CORS error" (unlikely with NASA images)
// - JavaScript errors
```

**2. Verify APOD Data in Message**
```javascript
// In browser console, inspect messages array
// (While on a page with chatbot open)
const messages = document.querySelector('[class*="AIAssistant"]');
console.log("Check if apod exists in message object");
```

**3. Test Image URL Directly**
- Copy image URL from API response
- Paste in new browser tab
- Should display NASA image

**4. Check Network Tab**
- F12 → Network tab
- Filter by "Img"
- Look for APOD image requests
- Status should be 200

### Issue: HD Link Not Working

**Check hdurl field:**
```javascript
// Verify hdurl exists in response
console.log(response.apod.hdurl);

// If undefined, button uses url as fallback
```

### Issue: Date Not Formatting

**Check date format:**
```javascript
// Date should be "YYYY-MM-DD"
const testDate = "2025-09-12";
console.log(new Date(testDate).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}));
// Should output: "September 12, 2025"
```

---

## 📊 Performance Check

### Image Loading
- **Lazy Loading**: Image only loads when scrolled into view
- **Initial Load**: Chat should be responsive immediately
- **Image Size**: Preview URL typically 100-500KB, HD 1-5MB

### Memory Usage
- Images stored in message state
- Browser handles image caching
- Should not cause memory issues in typical use

---

## ✅ Success Criteria

Your APOD feature is working if:

1. ✅ RAG API returns APOD data in response
2. ✅ Image displays in chat below text answer
3. ✅ Image is clickable and opens HD version
4. ✅ Metadata (title, date) displays correctly
5. ✅ Messages without APOD still work normally
6. ✅ No console errors
7. ✅ Performance remains smooth
8. ✅ Images load lazily (don't slow down chat)

---

## 🎯 Sample Test Queries

Try these with your chatbot:

```
1. "What happened on September 12, 2025?"
2. "Tell me about recent astronomical events"
3. "Show me NASA's astronomy picture"
4. "Explain the lunar eclipse visible last month"
5. "What space phenomena occurred on [specific date]?"
```

**Note:** APOD images only appear if:
- The query relates to a specific astronomical event
- Your RAG API has access to APOD data
- The API chooses to include APOD in response

---

## 📞 Need Help?

### Common Questions

**Q: Why don't I see images for every query?**  
A: Images only appear when the RAG API includes APOD data in the response. Not all queries trigger APOD inclusion.

**Q: Image takes long to load**  
A: First load of an image from NASA can take a few seconds. Subsequent views use browser cache.

**Q: Can I customize the image display?**  
A: Yes! Edit `components/AIAssistant.js` lines ~250-280 to modify styling.

**Q: What if API returns video instead of image?**  
A: Current implementation only handles images. See APOD_IMAGE_FEATURE.md for video support enhancement ideas.

---

## 🚀 Next Steps

After testing:
1. Try various queries to see APOD in action
2. Test on different browsers (Chrome, Firefox, Edge)
3. Test on mobile (responsive design)
4. Share with users and gather feedback
5. Consider enhancements (gallery view, zoom modal, etc.)

---

**Happy Testing!** 🎉  
If images appear and work smoothly, your APOD feature is ready to go! ✨
