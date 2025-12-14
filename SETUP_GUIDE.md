# Cloutopia Setup Guide - Google Gemini Backend

This guide will help you get the Cloutopia application running with the new Google Gemini backend.

## What Was Built

✅ **Python FastAPI Backend**
- Located in `/backend` directory
- Google Gemini API integration for cloud recognition
- Streaming responses using Server-Sent Events (SSE)
- Base64 image upload support
- CORS configured for Next.js frontend

✅ **Frontend Updates**
- Modified chat interface to call real API instead of mock responses
- Streaming message display (word-by-word like ChatGPT)
- File-to-base64 conversion for image uploads
- Error handling and loading states

## Quick Start

### Step 1: Get Your Google Gemini API Key

1. Go to https://ai.google.dev/
2. Click "Get API Key" in Google AI Studio
3. Create a new API key (or use existing one)
4. Copy the API key (starts with something like `AIza...`)

### Step 2: Configure Backend

```bash
# Navigate to backend directory
cd backend

# Copy environment template
cp .env.example .env

# Edit .env and add your API key
# Replace "your_gemini_api_key_here" with your actual key
nano .env  # or use your preferred editor
```

Your `backend/.env` should look like:
```env
GOOGLE_GEMINI_API_KEY=AIzaSyD...your-actual-key
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
```

### Step 3: Install Backend Dependencies

```bash
# Make sure you're in the backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Mac/Linux
# OR
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Configure Frontend

```bash
# Go back to project root
cd ..

# Create frontend environment file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
nano .env.local  # or use your preferred editor
```

Your `.env.local` should have:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Step 5: Run Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 15.3.8
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### Step 6: Test the Application

1. Open http://localhost:3000/ai-chat in your browser
2. Try sending a message: "Tell me about cumulus clouds"
3. Watch the response stream in word-by-word (like ChatGPT!)
4. Upload a cloud image and ask "What type of cloud is this?"

## Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Health check works: http://localhost:8000/health
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Frontend running on http://localhost:3000
- [ ] Chat page loads: http://localhost:3000/ai-chat
- [ ] Text messages work (without image)
- [ ] Image uploads work
- [ ] Streaming responses appear word-by-word
- [ ] No console errors in browser

## Troubleshooting

### Backend Issues

**"API key error"**
- Check that you created `backend/.env` file
- Verify your Gemini API key is correct
- Make sure the key doesn't have extra spaces or quotes

**"ModuleNotFoundError"**
- Activate virtual environment: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

**Port already in use**
- Kill existing process: `lsof -ti:8000 | xargs kill -9`
- Or use a different port: `uvicorn main:app --reload --port 8001`

### Frontend Issues

**"CORS error" in browser console**
- Make sure backend is running on port 8000
- Check `ALLOWED_ORIGINS` in `backend/.env` includes `http://localhost:3000`
- Restart both servers

**"Failed to fetch" error**
- Verify `NEXT_PUBLIC_API_URL` in `.env.local` is set to `http://localhost:8000`
- Make sure backend server is running
- Check backend terminal for errors

**Image upload not working**
- Check browser console for errors
- Verify image is under 5MB
- Ensure backend is receiving base64 data (check backend logs)

### Still Having Issues?

1. **Check Backend Logs**: Look at Terminal 1 for Python errors
2. **Check Frontend Console**: Open browser DevTools → Console tab
3. **Test Backend Directly**:
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy","service":"cloutopia-backend","version":"1.0.0"}`

4. **Clear Browser Cache**: Hard refresh with Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Testing the Streaming

You can test the streaming endpoint directly with curl:

```bash
curl -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain cumulus clouds in one sentence", "image": null}'
```

You should see streaming output like:
```
data: {"type": "start"}

data: {"type": "token", "content": "Cumulus"}

data: {"type": "token", "content": " clouds"}

data: {"type": "done"}
```

## Project Structure

```
cloutopia-website/
├── backend/                    # Python FastAPI backend
│   ├── .env                    # Environment variables (create this)
│   ├── .env.example            # Template
│   ├── requirements.txt        # Python dependencies
│   ├── main.py                 # FastAPI app entry point
│   ├── app/
│   │   ├── config.py           # Settings
│   │   ├── models.py           # Request/response models
│   │   ├── services/
│   │   │   └── gemini_service.py  # Gemini integration
│   │   └── routers/
│   │       └── chat.py         # Chat endpoints
│   └── README.md               # Backend documentation
│
├── src/
│   ├── app/ai-chat/components/
│   │   ├── chat-interface.tsx  # Main chat UI (updated)
│   │   └── chat-input.tsx      # Input component (updated)
│   └── lib/utils/
│       └── imageUtils.ts       # Base64 conversion (new)
│
├── .env.local                  # Frontend env vars (create this)
├── .env.example                # Updated template
└── SETUP_GUIDE.md              # This file
```

## Next Steps

After you have everything running:

1. **Test different cloud images**: Try various cloud types
2. **Experiment with prompts**: Ask detailed questions about atmospheric conditions
3. **Check streaming performance**: Notice how responses appear word-by-word
4. **Review backend logs**: See how requests are processed

## Optional: Concurrently Run Both Servers

If you want to run both servers from one command:

```bash
# Install concurrently
npm install --save-dev concurrently

# Add to package.json scripts:
# "dev:backend": "cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000",
# "dev:all": "concurrently \"npm run dev\" \"npm run dev:backend\""

# Then run:
npm run dev:all
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive API documentation where you can test endpoints directly.

## Need Help?

- Backend docs: `backend/README.md`
- Original project docs: `README.md`
- Claude.md instructions: `CLAUDE.md`

---

**Happy cloud hunting!** ☁️🤖
