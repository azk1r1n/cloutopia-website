from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Cloutopia API",
    description="Cloud Recognition and Blog Platform API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Cloutopia API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "chat": "/api/chat",
            "upload": "/api/upload",
            "blogs": "/api/blogs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "cloutopia-api"}

@app.post("/api/chat")
async def chat_with_ai(message: dict):
    """
    Chat endpoint for cloud recognition
    Expected input: {"message": "text", "image_url": "optional"}
    """
    try:
        user_message = message.get("message", "")
        image_url = message.get("image_url")
        
        # Simulate AI response for now
        if image_url:
            response = {
                "response": f"I can see your uploaded image! Based on the cloud formations, these appear to be cumulus clouds. The lighting suggests this photo was taken during mid-day with good visibility. The cloud structure indicates fair weather conditions. Can you tell me more about when and where this was taken?",
                "cloud_type": "Cumulus",
                "confidence": 0.85,
                "location_guess": "Temperate region, possibly mid-latitude",
                "weather_conditions": "Fair weather, stable atmosphere"
            }
        else:
            response = {
                "response": f"You asked: '{user_message}'. I'm here to help you identify clouds and guess locations from your photos! Please upload an image and I'll analyze the cloud types and try to determine the location."
            }
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.post("/api/upload")
async def upload_image(file: bytes):
    """
    Image upload endpoint
    """
    try:
        # For now, just return a success message
        # In production, this would save the file and return the URL
        return {
            "message": "File uploaded successfully",
            "file_url": "/uploads/sample.jpg",
            "file_size": len(file)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.get("/api/blogs")
async def get_blogs():
    """
    Get all blog posts
    """
    # Sample blog data
    sample_blogs = [
        {
            "id": 1,
            "title": "Amazing Cumulus Clouds Over California",
            "content": "Today I captured some beautiful cumulus clouds...",
            "author": "CloudWatcher",
            "created_at": "2024-01-15T10:30:00Z",
            "cloud_types": ["Cumulus"],
            "location": "California, USA"
        },
        {
            "id": 2,
            "title": "Dramatic Cumulonimbus Formation",
            "content": "Witnessed an incredible storm cloud development...",
            "author": "StormChaser",
            "created_at": "2024-01-14T15:45:00Z",
            "cloud_types": ["Cumulonimbus"],
            "location": "Texas, USA"
        }
    ]
    return {"blogs": sample_blogs}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
