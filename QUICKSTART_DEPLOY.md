# Quick Start - Deploy Backend in 5 Minutes

The fastest way to get your Cloutopia backend live.

## Prerequisites
- Gemini API key (get free at https://ai.google.dev/)
- Your code pushed to GitHub
- Vercel frontend URL (e.g., `https://your-app.vercel.app`)

---

## Deploy on Render.com (Recommended)

### 1. Create Account (30 seconds)
- Go to [render.com](https://render.com)
- Click "Get Started for Free"
- Sign up with GitHub

### 2. Deploy Backend (2 minutes)
1. Click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"**
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `cloutopia-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

5. Click **"Advanced"** → **"Add Environment Variable"**:
   - `GOOGLE_GEMINI_API_KEY` = your_api_key
   - `ENVIRONMENT` = production
   - `ALLOWED_ORIGINS` = https://your-app.vercel.app

6. Click **"Create Web Service"**

### 3. Get Your Backend URL
- After deployment completes (~2-3 min), copy the URL
- Should look like: `https://cloutopia-backend.onrender.com`

### 4. Update Vercel (1 minute)
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_API_URL` = your backend URL
3. Go to **Deployments** → **Redeploy**

### 5. Test
- Visit your Vercel app
- Go to AI Chat
- Upload a cloud image
- Send a message
- You should get an AI response!

---

## Deploy on Railway.app (Alternative)

### 1. Create Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Deploy
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Set **Root Directory** to `backend`

### 3. Add Environment Variables
Go to Variables tab:
- `GOOGLE_GEMINI_API_KEY` = your_api_key
- `ENVIRONMENT` = production
- `ALLOWED_ORIGINS` = https://your-app.vercel.app

### 4. Get Domain
- Go to Settings → Domains
- Click **"Generate Domain"**
- Copy the URL

### 5. Update Vercel
Same as step 4 above.

---

## Troubleshooting

**"Service unavailable"**
- Wait 30 seconds (Render free tier wakes up)
- Check deployment logs for errors

**"CORS error"**
- Verify `ALLOWED_ORIGINS` matches your Vercel URL exactly
- Include `https://` prefix
- No trailing slash

**"API key error"**
- Check `GOOGLE_GEMINI_API_KEY` is set correctly
- Verify key at https://ai.google.dev/

---

## What's Next?

✅ Backend is deployed
✅ Frontend connects to backend
✅ AI chat works

**Optional improvements**:
- Add custom domain
- Set up monitoring (Sentry)
- Enable database for chat history
- Upgrade to paid tier for faster cold starts

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions and alternative deployment options.
