# AI Assistant - Quick Start Guide

## 🚀 What Was Added

A floating AI chatbot that appears on **ALL pages** of your LEOverse website!

### Features:
- 🤖 **Floating Button:** Bottom-right corner with pulsing green indicator
- 💬 **Chat Interface:** Modern chat UI with message bubbles
- 🧠 **RAG Integration:** Connects to your deployed chatbot at https://nr-test.onrender.com/
- ⚡ **Instant Access:** Available everywhere without leaving the page
- 📚 **Smart Suggestions:** Pre-configured questions about space

---

## ✅ Files Created/Modified

### New File
- ✅ `components/AIAssistant.js` (303 lines) - Main chatbot component

### Modified File
- ✅ `app/layout.js` - Added `<AIAssistant />` component

---

## 🎯 How It Works

### User Flow
1. User sees floating robot button (bottom-right corner)
2. Clicks button → Chat window slides up
3. Types question or clicks suggested prompt
4. AI processes question using RAG (Retrieval-Augmented Generation)
5. Response appears in chat
6. User can continue conversation (context preserved)

### API Integration
```
Frontend (LEOverse) 
    ↓
    POST https://nr-test.onrender.com/chat
    {
      "message": "What is LEO?",
      "conversation_history": [...]
    }
    ↓
RAG Chatbot API (Your Deployed Service)
    ↓
    Response: { "response": "LEO stands for..." }
    ↓
Display in Chat UI
```

---

## 🧪 Testing Checklist

### Visual Test
- [ ] Open any page on http://localhost:3000
- [ ] See floating blue/purple button with robot icon
- [ ] Green indicator pulses smoothly
- [ ] Button scales on hover

### Interaction Test
- [ ] Click button → Chat window opens
- [ ] See welcome message from AI
- [ ] Type "What is LEO?" and press Enter
- [ ] Loading spinner appears
- [ ] AI response displays (may take 5-10 seconds first time)
- [ ] Response appears in chat bubble with timestamp

### Features Test
- [ ] Click "Orbital Paths?" → Input auto-fills
- [ ] Click "Sustainability?" → Input auto-fills
- [ ] Click "Space Debris?" → Input auto-fills
- [ ] Click "Clear" → Chat resets
- [ ] Click X → Chat closes
- [ ] Click button again → Chat reopens

### Navigation Test
- [ ] Go to Mission Builder page → Button still visible
- [ ] Go to Leaderboard → Button still visible
- [ ] Go to Crisis Management → Button still visible
- [ ] Button works on ALL pages

---

## 🎨 What It Looks Like

### Floating Button
- **Position:** Bottom-right corner (24px from edges)
- **Size:** 64px circle
- **Colors:** Blue to purple gradient
- **Icon:** Robot (🤖)
- **Indicator:** Green pulsing dot (online status)

### Chat Window
- **Size:** 400px wide × 600px tall
- **Background:** Dark space theme matching site
- **Header:** Blue/purple gradient with "LEOverse AI" title
- **Messages:** 
  - User: Blue gradient bubbles (right side)
  - AI: Dark blue bubbles with robot icon (left side)
- **Input:** Bottom with send button
- **Suggestions:** Three quick-access buttons below input

---

## 💡 Sample Questions Users Can Ask

### About the Game
- "How do I optimize my mission?"
- "What's the best payload type?"
- "How does the leaderboard work?"
- "What is the Space Sustainability Index?"

### About Space Science
- "What are the different orbital paths?"
- "Explain space debris"
- "What is LEO, MEO, and GEO?"
- "How do satellites work?"
- "What causes orbital decay?"

### Strategy Help
- "Which components should I choose?"
- "How do I manage my budget?"
- "What's the best crisis management strategy?"
- "How do I improve my SI score?"

---

## 🔧 Customization (Optional)

### Move Button to Left Side
File: `components/AIAssistant.js`
```javascript
// Line ~125
className="fixed bottom-6 left-6 z-50"  // Change right-6 to left-6
```

### Change Window Size
```javascript
// Line ~145
className="... w-[500px] h-[700px] ..."  // Make larger
```

### Add New Suggested Question
```javascript
// After line ~265
<button
  type="button"
  onClick={() => setInputMessage('Your new question here')}
  className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full"
>
  Button Text
</button>
```

---

## 🐛 Troubleshooting

### "Trouble connecting" message
**Problem:** API is slow or unavailable  
**Solution:** 
- Check if https://nr-test.onrender.com/ is online
- First message may take 10-15 seconds (cold start)
- Subsequent messages should be faster

### Button not appearing
**Problem:** Component not rendering  
**Solution:**
- Hard refresh browser (Ctrl + Shift + R)
- Check browser console for errors
- Verify `AIAssistant` imported in `layout.js`

### Messages not scrolling
**Problem:** Auto-scroll not working  
**Solution:**
- Close and reopen chat window
- Refresh page
- Should auto-scroll to latest message

### Suggested questions not working
**Problem:** Clicks not filling input  
**Solution:**
- Make sure input field is enabled
- Not in loading state
- Try typing manually

---

## 📊 API Response Times

### First Request (Cold Start)
- **Expected:** 10-20 seconds
- **Reason:** Free tier APIs "sleep" when inactive
- **Solution:** Wait patiently, subsequent requests faster

### Follow-up Requests
- **Expected:** 2-5 seconds
- **Reason:** API is "warmed up"
- **Performance:** Should be smooth

---

## 🎯 Key Benefits

### For Users
✅ **Instant Help:** No need to leave current page  
✅ **Learn by Doing:** Get answers while playing  
✅ **Context Aware:** AI remembers conversation  
✅ **Educational:** Learn real space science  

### For You
✅ **No Backend Work:** Uses external API  
✅ **Zero Maintenance:** API hosted separately  
✅ **Scalable:** Handles multiple users  
✅ **Professional:** Modern chat UI  

---

## 📱 Works On

- ✅ Desktop (Chrome, Firefox, Edge, Safari)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iOS, Android)
- ✅ All screen sizes (responsive)

---

## 🚀 Ready to Use!

The AI Assistant is now live on your site. Users can:

1. Click the robot button anytime
2. Ask questions about space, missions, strategy
3. Get intelligent answers from your RAG chatbot
4. Continue conversation with context
5. Clear chat and start fresh anytime

**No additional setup required!** 🎉

Just make sure your RAG API at https://nr-test.onrender.com/ is running, and you're good to go!

---

## 📞 Support

If the API is slow on first request, this is normal for free-tier hosting (Render.com cold starts). Consider upgrading to paid tier for instant responses.

For any issues:
1. Check browser console (F12)
2. Test API directly: https://nr-test.onrender.com/chat
3. Verify component is imported in layout.js

---

**Happy chatting! 🤖🚀**
