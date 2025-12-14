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

### Option 1: Render.com

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard
6. Deploy

### Option 2: Railway.app

1. Create new project on Railway
2. Connect GitHub repository
3. Railway auto-detects Python and uses requirements.txt
4. Add environment variables
5. Deploy

### Option 3: Google Cloud Run

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
- **Image size limits** should be enforced (default: 5MB)

## License

See main project LICENSE file.

## Support

For issues or questions, please open an issue on the GitHub repository.
