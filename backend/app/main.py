from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import uuid
import shutil
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()

# Import AI service
try:
    from .services.ai_service import cloud_recognition_service
except ImportError:
    # Fallback when imports fail
    cloud_recognition_service = None
    print("Warning: AI service not available - some imports failed")

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
uploads_dir = os.getenv("UPLOAD_DIR", "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Pydantic models for request/response
class ChatMessage(BaseModel):
    message: str
    image_url: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    cloud_type: Optional[str] = None
    confidence: Optional[float] = None
    location_guess: Optional[str] = None
    weather_conditions: Optional[str] = None
    analysis_details: Optional[dict] = None

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

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(chat_message: ChatMessage):
    """
    Enhanced chat endpoint for cloud recognition with AI analysis
    """
    try:
        user_message = chat_message.message
        image_url = chat_message.image_url
        
        # Initialize response
        response_data = {
            "response": "",
            "cloud_type": None,
            "confidence": None,
            "location_guess": None,
            "weather_conditions": None,
            "analysis_details": None
        }
        
        if image_url and cloud_recognition_service:
            try:
                # Convert URL to file path for analysis
                if image_url.startswith('/uploads/'):
                    image_path = os.path.join(uploads_dir, image_url.replace('/uploads/', ''))
                    
                    if os.path.exists(image_path):
                        # Perform AI analysis
                        analysis_result = cloud_recognition_service.analyze_cloud_image(
                            image_path, user_message
                        )
                        
                        if analysis_result.get("success"):
                            # Extract analysis data
                            cloud_id = analysis_result.get("cloud_identification", {})
                            location_analysis = analysis_result.get("location_analysis", {})
                            weather_pred = analysis_result.get("weather_prediction", {})
                            
                            response_data.update({
                                "response": analysis_result.get("chat_summary", "Analysis completed"),
                                "cloud_type": cloud_id.get("primary_type"),
                                "confidence": analysis_result.get("confidence_score"),
                                "location_guess": location_analysis.get("estimated_region"),
                                "weather_conditions": weather_pred.get("current_conditions"),
                                "analysis_details": {
                                    "cloud_identification": cloud_id,
                                    "location_analysis": location_analysis,
                                    "weather_prediction": weather_pred
                                }
                            })
                        else:
                            response_data["response"] = f"I had trouble analyzing the image: {analysis_result.get('error', 'Unknown error')}"
                    else:
                        response_data["response"] = "Sorry, I couldn't find the uploaded image. Please try uploading again."
                else:
                    response_data["response"] = "Please upload an image so I can analyze the clouds for you!"
                    
            except Exception as e:
                response_data["response"] = f"I encountered an error while analyzing your image: {str(e)}"
        
        elif image_url:
            # AI service not available, provide fallback response
            response_data["response"] = """I can see you've uploaded an image! However, the AI analysis service is currently unavailable. 
            Here's what I would normally analyze:
            
            🌤️ Cloud types and formations
            📍 Potential location based on atmospheric conditions  
            🌦️ Weather predictions and conditions
            📏 Cloud altitude and characteristics
            
            Please ensure the AI service is properly configured with API keys."""
            
        else:
            # No image provided
            if user_message:
                response_data["response"] = f"""You asked: "{user_message}"
                
I'm here to help you identify clouds and analyze weather patterns! To get the most accurate analysis, please:

1. Upload a clear photo of the sky/clouds
2. Ask specific questions about what you see
3. I'll provide detailed information about:
   - Cloud types and formations
   - Weather conditions and predictions  
   - Potential location estimates
   - Atmospheric analysis

What would you like to know about clouds?"""
            else:
                response_data["response"] = """Hello! I'm your cloud recognition assistant. I can help you:

🌤️ **Identify cloud types** (Cumulus, Stratus, Cirrus, etc.)
📍 **Estimate locations** based on atmospheric conditions
🌦️ **Predict weather** from cloud formations
📊 **Provide detailed analysis** of sky conditions

Upload a photo of clouds or sky, and I'll give you a comprehensive analysis!"""
        
        return ChatResponse(**response_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Image upload endpoint with cloud analysis
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Check file size (10MB limit)
        max_size = int(os.getenv("MAX_FILE_SIZE", "10485760"))
        contents = await file.read()
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(uploads_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        
        # Generate file URL
        file_url = f"/uploads/{unique_filename}"
        
        # Analyze image if AI service is available
        analysis_result = None
        if cloud_recognition_service:
            try:
                analysis_result = cloud_recognition_service.analyze_cloud_image(file_path)
            except Exception as e:
                print(f"AI analysis failed: {e}")
        
        return {
            "message": "File uploaded successfully",
            "file_url": file_url,
            "file_path": file_path,
            "file_size": len(contents),
            "analysis": analysis_result
        }
        
    except HTTPException:
        raise
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
