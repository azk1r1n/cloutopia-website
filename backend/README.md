# Cloutopia Backend

FastAPI backend with Google Gemini API integration for cloud recognition and atmospheric analysis.

## Features

- **Google Gemini AI Integration**: Powered by Gemini 2.5 Flash for fast, accurate cloud analysis
- **Streaming Responses**: Real-time word-by-word AI responses using Server-Sent Events (SSE)
- **Vision Support**: Analyzes cloud images uploaded as base64-encoded data
- **CORS Enabled**: Configured for Next.js frontend integration
- **Type-Safe**: Built with Pydantic for request/response validation

## Quick Start

### 1. Prerequisites

- Python 3.9 or higher
- Google Gemini API key (get one at https://ai.google.dev/)

### 2. Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

Create a `.env` file in the backend directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Run the Server

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Run with uvicorn (auto-reload enabled in development)
uvicorn main:app --reload --port 8000

# Or run directly
python main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)

## API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "cloutopia-backend",
  "version": "1.0.0"
}
```

### Streaming Chat (Recommended)

```bash
POST /api/chat/stream
Content-Type: application/json
```

Request body:
```json
{
  "message": "What type of cloud is this?",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

Response: Server-Sent Events (SSE) stream
```
data: {"type": "start"}

data: {"type": "token", "content": "Based"}

data: {"type": "token", "content": " on"}

data: {"type": "token", "content": " the"}

data: {"type": "done"}
```

### Non-Streaming Chat

```bash
POST /api/chat
Content-Type: application/json
```

Request body:
```json
{
  "message": "Explain cumulus clouds",
  "image": null
}
```

Response:
```json
{
  "message": "Cumulus clouds are fluffy, white clouds with flat bases..."
}
```

## Project Structure

```
backend/
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── requirements.txt        # Python dependencies
├── main.py                 # FastAPI application entry point
├── app/
│   ├── __init__.py
│   ├── config.py           # Settings and environment configuration
│   ├── models.py           # Pydantic request/response models
│   ├── services/
│   │   ├── __init__.py
│   │   └── gemini_service.py  # Gemini API integration
│   └── routers/
│       ├── __init__.py
│       └── chat.py         # Chat endpoints
└── README.md               # This file
```

## Development

### Running Tests

```bash
# Install dev dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Formatting

```bash
# Install formatting tools
pip install black isort

# Format code
black .
isort .
```

### Type Checking

```bash
# Install mypy
pip install mypy

# Run type checks
mypy app/
```

## Testing with cURL

### Test health endpoint
```bash
curl http://localhost:8000/health
```

### Test streaming chat (without image)
```bash
curl -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about cirrus clouds", "image": null}'
```

### Test non-streaming chat
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What causes rain?", "image": null}'
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key | - | Yes |
| `ENVIRONMENT` | Environment mode (development/production) | development | No |
| `PORT` | Server port | 8000 | No |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | http://localhost:3000 | No |

## Troubleshooting

### "API key error"
- Make sure you've created `.env` file and set `GOOGLE_GEMINI_API_KEY`
- Verify your API key is valid at https://ai.google.dev/

### "CORS error" from frontend
- Check that `ALLOWED_ORIGINS` includes your frontend URL
- For development: `http://localhost:3000`
- For production: Your deployed frontend URL

### "Module not found" errors
- Ensure virtual environment is activated: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

### Slow responses
- Gemini API can take 2-5 seconds for vision requests
- Check your internet connection
- Consider upgrading to a faster Gemini model

## Deployment

### Current Production Setup

**Cloutopia is currently deployed on Render.com Free Tier**

**Platform:** Render.com
**Plan:** Free (512MB RAM)
**Auto-deploy:** Enabled from `gemini_integration` branch
**URL:** `https://cloutopia-backend.onrender.com`

#### Known Issues and Solutions

**Issue 1: Memory Limits (512MB)**

The free tier occasionally hits memory limits with concurrent users or large images.

**Current Mitigations:**
- Automatic image resizing to 1024px (saves 94% memory)
- Request size limit: 15MB
- Decoded image limit: 10MB
- Explicit garbage collection after each request
- See `MEMORY_OPTIMIZATION.md` for details

**If memory issues persist, consider these alternatives:**

1. **Hugging Face Spaces** (Recommended alternative)
   - Free tier: 16GB RAM (32x more than Render!)
   - Built for ML/AI applications
   - Persistent storage
   - Good for image processing workloads
   - Deployment: Similar to Render, uses Docker

2. **Oracle Cloud Always Free Tier**
   - Free tier: 1GB RAM + 24GB storage
   - 2x Render's free tier memory
   - No spin-down (always running)
   - Requires more setup than Render

3. **Upgrade Render to Starter ($7/month)**
   - 512MB → unlimited RAM
   - No spin-down delays
   - Better performance

**Issue 2: Free Tier Spin-Down**

Render's free tier spins down after 15 minutes of inactivity, causing 30-60 second delays on first request.

**Solution: UptimeRobot Monitoring**

We use [UptimeRobot](https://uptimerobot.com/) to keep the service alive:

**Setup:**
1. Create free UptimeRobot account
2. Add new monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://your-backend.onrender.com/health`
   - **Monitoring Interval:** 5 minutes
   - **HTTP Method:** HEAD (more efficient than GET)
3. Save monitor

**How it works:**
- UptimeRobot pings `/health` every 5 minutes
- Prevents Render from spinning down due to inactivity
- `/health` endpoint supports both GET and HEAD methods
- HEAD method uses less bandwidth (no response body)

**Note:** The `/health` endpoint in `main.py` is configured for UptimeRobot:
```python
@app.api_route("/health", methods=["GET", "HEAD"], include_in_schema=False)
async def health_check():
    """Health check endpoint. Supports GET and HEAD for monitoring tools."""
    return "OK"
```

Both methods are required because:
- **HEAD**: Used by UptimeRobot (efficient, no body)
- **GET**: Used by browsers and manual testing

---

### Deployment Options

#### Option 1: Render.com (Current)

**Pros:**
- Easy setup and auto-deploy
- Free tier available
- GitHub integration

**Cons:**
- 512MB memory limit (can be tight)
- Spins down after 15 min (use UptimeRobot)

**Steps:**
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set root directory: `backend`
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables in Render dashboard:
   - `GOOGLE_GEMINI_API_KEY`
   - `ENVIRONMENT=production`
   - `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`
7. Deploy
8. Set up UptimeRobot monitoring (see above)

#### Option 2: Hugging Face Spaces

**Pros:**
- 16GB RAM (32x more than Render free tier!)
- Built for AI/ML workloads
- No spin-down on free tier
- Persistent storage

**Cons:**
- Requires Docker configuration
- Less familiar deployment flow

**Steps:**
1. Create account at huggingface.co
2. Create new Space → Docker template
3. Add your code to the Space repository
4. Create `Dockerfile` (see Option 3 below)
5. Push to Space repository
6. Configure environment variables in Settings

#### Option 3: Railway.app

**Pros:**
- $5 free credit monthly
- Good developer experience
- No sleep on free tier

**Cons:**
- Free credit runs out (~500 hours)

**Steps:**
1. Create new project on Railway
2. Connect GitHub repository
3. Set root directory: `backend`
4. Railway auto-detects Python and uses requirements.txt
5. Add environment variables
6. Deploy

#### Option 4: Oracle Cloud Always Free

**Pros:**
- 1GB RAM (2x Render)
- Always running (no spin-down)
- Truly free forever

**Cons:**
- More complex setup
- Requires manual server configuration

**Steps:**
1. Create Oracle Cloud account
2. Create VM instance (Always Free tier)
3. Install Python and dependencies
4. Set up systemd service
5. Configure firewall and reverse proxy

#### Option 5: Google Cloud Run

**Pros:**
- Serverless, scales to zero
- Pay per request
- Good Gemini API integration

**Cons:**
- Cold starts (1-3 seconds)
- Requires Docker knowledge

**Steps:**
1. Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Build and deploy:
```bash
gcloud run deploy cloutopia-backend --source .
```

## Security Notes

- **Never commit `.env` file** to version control
- **API keys** should only be in backend, never in frontend
- **Rate limiting** is recommended for production (use libraries like `slowapi`)
- **Input validation** is handled by Pydantic models
- **Image size limits** are enforced:
  - Request body: 15MB max (base64 encoded)
  - Decoded image: 10MB max
  - Images automatically resized to 1024px to save memory

## License

See main project LICENSE file.

## Support

For issues or questions, please open an issue on the GitHub repository.
