# Deployment Guide - Cloutopia

Complete guide to deploying both frontend (Next.js) and backend (FastAPI) for Cloutopia.

## Architecture Overview

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: FastAPI Python server (deployed separately)
- **Database/Auth**: Supabase (already cloud-hosted)

---

## Backend Deployment

### Option 1: Render.com (Recommended - FREE)

**Step 1: Prepare Your Repository**
1. Commit all backend changes to your GitHub repository
2. Push to main branch

**Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

**Step 3: Deploy Backend**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `cloutopia-backend`
   - **Region**: Choose closest to your users (Oregon, Frankfurt, etc.)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Step 4: Add Environment Variables**
In Render dashboard, add these environment variables:
- `GOOGLE_GEMINI_API_KEY`: Your Gemini API key from https://ai.google.dev/
- `ENVIRONMENT`: `production`
- `ALLOWED_ORIGINS`: Your Vercel URL (e.g., `https://your-app.vercel.app`)

**Step 5: Deploy**
1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. Copy your backend URL (e.g., `https://cloutopia-backend.onrender.com`)

**Note**: Free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

### Option 2: Railway.app (Alternative - FREE)

**Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

**Step 2: Deploy Backend**
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Railway auto-detects Python
5. Set **Root Directory** to `backend`

**Step 3: Add Environment Variables**
In Railway dashboard, go to Variables tab and add:
- `GOOGLE_GEMINI_API_KEY`: Your Gemini API key
- `ENVIRONMENT`: `production`
- `ALLOWED_ORIGINS`: Your Vercel URL
- `PORT`: `8000` (Railway will override this automatically)

**Step 4: Get Backend URL**
1. Go to Settings → Domains
2. Click **"Generate Domain"**
3. Copy your backend URL (e.g., `https://cloutopia-backend.up.railway.app`)

---

### Option 3: Google Cloud Run (Serverless)

**Prerequisites**:
- Google Cloud account
- `gcloud` CLI installed
- Docker installed (for local testing)

**Step 1: Build and Push Docker Image**
```bash
cd backend

# Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/cloutopia-backend .

# Test locally
docker run -p 8080:8080 \
  -e GOOGLE_GEMINI_API_KEY=your_key \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  gcr.io/YOUR_PROJECT_ID/cloutopia-backend

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/cloutopia-backend
```

**Step 2: Deploy to Cloud Run**
```bash
gcloud run deploy cloutopia-backend \
  --image gcr.io/YOUR_PROJECT_ID/cloutopia-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production \
  --set-env-vars GOOGLE_GEMINI_API_KEY=your_key \
  --set-env-vars ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Step 3: Get Backend URL**
- After deployment, Cloud Run provides a URL like: `https://cloutopia-backend-xxxxx-uc.a.run.app`

---

## Frontend Deployment (Vercel)

Your Next.js frontend is already deployed on Vercel. Now you need to connect it to the backend.

### Update Vercel Environment Variables

**Step 1: Get Backend URL**
- Copy your deployed backend URL from Render/Railway/Cloud Run

**Step 2: Update Vercel Environment Variables**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | Your backend URL (e.g., `https://cloutopia-backend.onrender.com`) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | All |

**Step 3: Redeploy Frontend**
1. After adding environment variables, click **"Deployments"**
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**

**Important**: Environment variable changes require a redeploy to take effect.

---

## Update Backend CORS Settings

After deploying, you need to update the backend's CORS configuration to allow your Vercel domain.

### For Render/Railway:
1. Go to your backend service dashboard
2. Update the `ALLOWED_ORIGINS` environment variable:
   - If single domain: `https://your-app.vercel.app`
   - If multiple domains: `https://your-app.vercel.app,https://custom-domain.com`
3. The backend will auto-restart with new settings

### For Cloud Run:
```bash
gcloud run services update cloutopia-backend \
  --update-env-vars ALLOWED_ORIGINS=https://your-app.vercel.app,https://preview.vercel.app
```

**Tip**: Include preview URLs for testing:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

---

## Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "cloutopia-backend",
  "version": "1.0.0"
}
```

### 2. Test Backend API Docs
Visit: `https://your-backend-url.onrender.com/docs`

You should see FastAPI's interactive Swagger documentation.

### 3. Test Frontend Connection
1. Go to your deployed Vercel app
2. Navigate to the AI Chat page
3. Upload a cloud image
4. Send a message
5. Verify you get a streaming AI response

### 4. Check Browser Console
Open browser DevTools → Console. You should NOT see:
- CORS errors
- 404 errors to API endpoints
- Connection refused errors

---

## Troubleshooting

### CORS Errors
**Symptom**: Console shows "Access-Control-Allow-Origin" error

**Solution**:
1. Check backend `ALLOWED_ORIGINS` includes your Vercel URL (with `https://`)
2. Ensure Vercel URL doesn't have trailing slash
3. Check backend logs for rejected requests

### 404 Not Found
**Symptom**: API calls return 404

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel matches your backend URL exactly
2. Check endpoint path is `/api/chat/stream` (not `/chat/stream`)
3. Ensure backend is deployed and running

### Backend Cold Start (Render Free Tier)
**Symptom**: First request takes 30+ seconds

**Solution**:
1. This is expected on Render's free tier
2. Consider upgrading to paid tier ($7/month) for always-on
3. Or switch to Railway which doesn't sleep on free tier (until credit runs out)

### Gemini API Errors
**Symptom**: 500 errors from backend, logs show API key issues

**Solution**:
1. Verify `GOOGLE_GEMINI_API_KEY` is set correctly in backend environment
2. Check API key is valid at https://ai.google.dev/
3. Ensure API key has Gemini API enabled

### Environment Variables Not Working
**Symptom**: Frontend still uses localhost:8000

**Solution**:
1. Verify environment variables are set in Vercel dashboard
2. Click "Redeploy" after changing environment variables
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

---

## Cost Summary

### Recommended Setup (100% Free)

| Service | Tier | Cost | Limitations |
|---------|------|------|-------------|
| Frontend (Vercel) | Hobby | **$0** | Generous free tier |
| Backend (Render) | Free | **$0** | Spins down after 15 min inactivity, 750 hrs/month |
| Database (Supabase) | Free | **$0** | 500MB database, 50K monthly active users |
| Gemini API | Free | **$0** | 1500 requests/day (flash model) |

**Total**: $0/month

### Alternative Setup (Railway)

| Service | Cost | Notes |
|---------|------|-------|
| Frontend (Vercel) | $0 | Same as above |
| Backend (Railway) | $0 | $5 free credit/month, ~500 hours |
| Database (Supabase) | $0 | Same as above |
| Gemini API | $0 | Same as above |

**Total**: $0/month (until free credit exhausted)

### Paid Upgrade (Recommended for Production)

| Service | Cost | Benefits |
|---------|------|----------|
| Backend (Render Starter) | $7/month | Always-on, no cold starts |
| Vercel Pro | $20/month | Better analytics, more bandwidth |
| Supabase Pro | $25/month | 8GB database, better performance |

---

## Monitoring and Logs

### Render
- Dashboard → Your Service → Logs
- Real-time log streaming
- Search and filter logs

### Railway
- Dashboard → Your Service → Deployments → Logs
- Live logs with timestamps
- Download logs

### Vercel
- Dashboard → Your Project → Logs
- Function logs and edge logs
- Real-time monitoring

### Cloud Run
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=cloutopia-backend" --limit 50
```

---

## Next Steps

1. **Set up monitoring**: Add services like Sentry or LogRocket for error tracking
2. **Add rate limiting**: Implement rate limits on backend to prevent abuse
3. **Enable caching**: Add Redis for caching Gemini responses
4. **Custom domain**: Connect a custom domain to your Vercel app
5. **CI/CD**: Set up automatic deployment on push to main branch (already enabled on Vercel/Render)

---

## Security Checklist

- [ ] Backend `.env` file is in `.gitignore` (already done)
- [ ] Gemini API key is only in backend environment (never in frontend)
- [ ] CORS is restricted to your specific domains (not `*`)
- [ ] Supabase RLS (Row Level Security) policies are enabled
- [ ] HTTPS is enforced (automatic on Vercel/Render/Railway)
- [ ] Environment variables are never logged or exposed
- [ ] Backend has input validation (handled by Pydantic)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend logs in your deployment platform
3. Check Vercel function logs
4. Verify all environment variables are set correctly
5. Test endpoints individually using curl or Postman

For platform-specific issues:
- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app
- **Cloud Run**: https://cloud.google.com/run/docs
- **Vercel**: https://vercel.com/docs
