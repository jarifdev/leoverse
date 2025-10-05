# AI Assistant (RAG Chatbot) - Implementation Guide

## 🤖 Overview
The AI Assistant is a floating chatbot widget that provides users with intelligent answers about space missions, orbital mechanics, sustainability, and LEOverse gameplay. It integrates with your deployed RAG (Retrieval-Augmented Generation) chatbot at https://nr-test.onrender.com/.

---

## 🎯 Key Features

### 1. **Floating Widget**
- Appears as a blue/purple gradient button with robot icon
- Fixed to bottom-right corner (non-intrusive)
- Pulsing green "online" indicator
- Available on ALL pages throughout the site
- Smooth animations (scale, fade)

### 2. **Chat Interface**
- Modern chat UI with message bubbles
- User messages: Blue gradient (right-aligned)
- AI messages: Dark blue with robot icon (left-aligned)
- Timestamps for each message
- Auto-scroll to latest message
- Message history preserved during session

### 3. **AI Integration**
- Connects to external RAG chatbot API
- Sends conversation history (last 5 messages for context)
- 30-second timeout for API calls
- Error handling with user-friendly messages
- Loading spinner during AI response

### 4. **User Experience**
- Quick-access suggested questions
- "Clear chat" button to reset conversation
- Enter key to send (Shift+Enter for new line)
- Input auto-focus when opened
- Keyboard accessible

---

## 🔌 API Integration

### Endpoint
```
POST https://nr-test.onrender.com/chat
```

### Request Format
```json
{
  "message": "What are the different orbital paths?",
  "conversation_history": [
    {
      "role": "assistant",
      "content": "Hello! I'm your LEOverse AI assistant..."
    },
    {
      "role": "user",
      "content": "Tell me about LEO"
    },
    {
      "role": "assistant",
      "content": "LEO stands for Low Earth Orbit..."
    }
  ]
}
```

### Expected Response
```json
{
  "response": "LEO, MEO, and GEO are the three main orbital paths...",
  "message": "Alternative response field"
}
```

### Error Handling
- Network timeout (30s): Shows "trouble connecting" message
- API error: Displays user-friendly error in chat
- Malformed response: Falls back to default message

---

## 🎨 Design Specifications

### Colors
- **Button:** Blue to Purple gradient (`from-blue-600 to-purple-600`)
- **User Messages:** Blue gradient (`from-blue-600 to-blue-700`)
- **AI Messages:** Dark blue with transparency (`bg-space-blue/50`)
- **Error Messages:** Red tones (`bg-red-900/30 text-red-300`)
- **Online Indicator:** Green (`bg-green-400`)

### Dimensions
- **Floating Button:** 64px × 64px circle
- **Chat Window:** 400px width × 600px height
- **Bottom-right Position:** 24px from edges (`bottom-6 right-6`)

### Animations
- Button: Scale on hover (1.1x), tap (0.9x)
- Online indicator: Pulsing scale animation (1 → 1.2 → 1)
- Chat window: Slide up with scale (opacity + y + scale)
- Messages: Fade in from below (opacity + y)

---

## 💬 Suggested Questions

### Pre-configured Prompts
1. **"What are the different orbital paths?"**
   - Explains LEO, MEO, GEO
   - Discusses altitude ranges
   - Covers use cases

2. **"Explain space sustainability"**
   - Space debris concerns
   - Sustainability Index concept
   - Best practices

3. **"What is space debris?"**
   - Definition and risks
   - Collision probabilities
   - Mitigation strategies

### Customization
Users can:
- Click suggested questions to auto-fill input
- Type their own questions
- Follow-up on previous answers (context preserved)

---

## 🛠️ Technical Implementation

### Component: `AIAssistant.js`

**Location:** `components/AIAssistant.js`

**Dependencies:**
- React hooks: `useState`, `useRef`, `useEffect`
- Framer Motion: Animations
- React Icons: `FaRobot`, `FaTimes`, `FaPaperPlane`, `FaSpinner`
- Axios: HTTP requests

**State Management:**
```javascript
const [isOpen, setIsOpen] = useState(false);        // Chat window visibility
const [messages, setMessages] = useState([]);       // Chat history
const [inputMessage, setInputMessage] = useState(''); // User input
const [isLoading, setIsLoading] = useState(false);  // API loading state
```

**Key Functions:**

1. **handleSendMessage(e)**
   - Prevents default form submission
   - Adds user message to chat
   - Calls RAG API with message + history
   - Adds AI response to chat
   - Handles errors gracefully

2. **scrollToBottom()**
   - Auto-scrolls to latest message
   - Triggered on new messages

3. **clearChat()**
   - Resets conversation
   - Keeps welcome message

4. **handleKeyPress(e)**
   - Send on Enter
   - New line on Shift+Enter

---

## 📦 Installation

### Added to Layout
File: `app/layout.js`

```javascript
import AIAssistant from '@/components/AIAssistant'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-space-gradient star-field">
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
        <AIAssistant />  {/* Available everywhere! */}
      </body>
    </html>
  )
}
```

**Why in Layout?**
- Renders on ALL pages
- Persistent across navigation
- Single instance throughout app

---

## 🧪 Testing Guide

### 1. Visual Test
- [ ] Button appears bottom-right on all pages
- [ ] Green indicator pulses smoothly
- [ ] Button has hover effect (scales to 1.1x)
- [ ] Click opens chat window with smooth animation

### 2. Functional Test
- [ ] Welcome message displays on open
- [ ] Can type in input field
- [ ] Send button enabled when text present
- [ ] Enter key sends message
- [ ] Shift+Enter creates new line
- [ ] Suggested questions fill input when clicked

### 3. API Test
- [ ] Sending message shows loading spinner
- [ ] AI response appears after API call
- [ ] Message bubbles display correctly (user right, AI left)
- [ ] Timestamps show correctly
- [ ] Error message displays on API failure
- [ ] Conversation history maintained

### 4. UI Test
- [ ] Messages auto-scroll to bottom
- [ ] Clear button resets chat
- [ ] Close button hides chat window
- [ ] Can reopen chat (state preserved until cleared)
- [ ] Responsive on different screen sizes

### 5. Edge Cases
- [ ] Long messages wrap correctly
- [ ] Empty input cannot be sent
- [ ] Multiple rapid messages handled
- [ ] Network timeout shows error
- [ ] API unavailable shows user-friendly message

---

## 🔍 API Testing Commands

### Test with curl (PowerShell)
```powershell
$body = @{
    message = "What are orbital paths?"
    conversation_history = @()
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://nr-test.onrender.com/chat" -Method POST -Body $body -ContentType "application/json"
```

### Test with curl (bash)
```bash
curl -X POST https://nr-test.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are orbital paths?",
    "conversation_history": []
  }'
```

### Expected Response Fields
- `response`: Main answer text
- OR `message`: Alternative response field

---

## 🚀 Usage Examples

### Example Conversation 1: Orbital Paths
**User:** "What are the different orbital paths?"

**AI:** "LEO, MEO, and GEO are the three main orbital altitudes. LEO (Low Earth Orbit) is 160-2,000km, ideal for Earth observation. MEO (Medium Earth Orbit) is 2,000-35,786km, used for GPS. GEO (Geostationary Earth Orbit) is 35,786km, perfect for communications."

### Example Conversation 2: Sustainability
**User:** "Explain space sustainability"

**AI:** "Space sustainability focuses on preserving the orbital environment for future generations. Key aspects include: minimizing space debris, designing satellites for deorbiting, collision avoidance, and responsible launch practices. The Space Sustainability Index (SI) measures these efforts."

### Example Conversation 3: Crisis Management
**User:** "What should I do during a debris alert?"

**AI:** "During a debris alert, you have three options: 1) Ignore the warning (risky, free), 2) Deploy cleanup technology (expensive, safest), or 3) Initiate international cooperation (balanced approach). Consider your remaining budget and sustainability goals."

---

## 🎓 Benefits for Users

### Educational
- Learn about real space concepts
- Understand orbital mechanics
- Discover sustainability practices
- Get mission planning advice

### Gameplay Help
- Component recommendations
- Budget optimization tips
- Strategy suggestions
- Crisis management guidance

### Accessibility
- Always available (floating button)
- No need to leave current page
- Quick access to information
- Context-aware responses

---

## 🔧 Customization Options

### Change Button Position
```javascript
// In AIAssistant.js
className="fixed bottom-6 left-6 z-50"  // Move to bottom-left
className="fixed top-6 right-6 z-50"   // Move to top-right
```

### Change Window Size
```javascript
className="... w-[500px] h-[700px] ..."  // Larger window
className="... w-[350px] h-[500px] ..."  // Smaller window
```

### Add More Suggested Questions
```javascript
<button
  type="button"
  onClick={() => setInputMessage('How do I optimize my mission?')}
  className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full"
>
  Optimize Mission?
</button>
```

### Change API Timeout
```javascript
timeout: 60000  // 60 seconds instead of 30
```

---

## 🐛 Troubleshooting

### Issue: "Trouble connecting" message
**Cause:** API unavailable or slow
**Solution:** 
- Check if https://nr-test.onrender.com/ is online
- Increase timeout value
- Check network connection

### Issue: Button not appearing
**Cause:** Component not imported in layout
**Solution:**
- Verify import in `app/layout.js`
- Check for JavaScript errors in console
- Ensure component file exists

### Issue: Chat window too small/large on mobile
**Cause:** Fixed width doesn't adapt
**Solution:** Add responsive classes:
```javascript
className="... w-[400px] md:w-[500px] lg:w-[600px] ..."
```

### Issue: Messages not scrolling
**Cause:** Ref not working
**Solution:**
- Check `messagesEndRef` is defined
- Ensure `useEffect` dependency includes `messages`

---

## 📱 Mobile Responsiveness

### Current Behavior
- Fixed 400px width on all screens
- May overflow on small devices

### Recommended Enhancement
```javascript
className="fixed bottom-4 right-4 z-50 w-[95vw] max-w-[400px] h-[80vh] max-h-[600px] ..."
```

This makes it:
- 95% of viewport width (with 400px max)
- 80% of viewport height (with 600px max)
- Better mobile experience

---

## 🔐 Security Considerations

### CORS
- API must allow requests from your domain
- Currently allows all origins (fine for public chatbot)

### Input Sanitization
- All user input sent to external API
- No local storage of sensitive data
- Conversation history cleared on page refresh

### Rate Limiting
- Consider adding rate limiting on frontend
- Prevent spam requests
- Example: Max 1 message per 2 seconds

---

## 📊 Analytics Opportunities

### Track Usage
```javascript
// Add to handleSendMessage
console.log('User asked:', userMessage);
// Send to analytics service
analytics.track('chatbot_message', {
  message_length: userMessage.length,
  timestamp: new Date()
});
```

### Common Questions
- Track most asked questions
- Improve suggested prompts
- Identify knowledge gaps

---

## 🎯 Future Enhancements

### Potential Features
1. **Voice Input:** Add speech-to-text
2. **Message Reactions:** Like/dislike responses
3. **Export Chat:** Download conversation history
4. **Theme Toggle:** Light/dark mode
5. **Multi-language:** Support other languages
6. **Persistent History:** Save across sessions
7. **Typing Indicator:** Show when AI is "typing"
8. **Rich Media:** Display images, links in responses
9. **Code Snippets:** Syntax highlighting for code
10. **Feedback Loop:** "Was this helpful?" buttons

---

## 📝 Summary

✅ **Floating AI assistant button** (bottom-right)  
✅ **Smooth animations** (Framer Motion)  
✅ **RAG chatbot integration** (https://nr-test.onrender.com/)  
✅ **Message history** (last 5 for context)  
✅ **Suggested questions** (quick prompts)  
✅ **Error handling** (user-friendly messages)  
✅ **Available site-wide** (all pages)  
✅ **Responsive design** (works on all screens)  
✅ **Keyboard accessible** (Enter to send)  

The AI Assistant is now live and ready to help users learn about space! 🚀🤖
