Implementation Plan: Google Gemini Backend for Cloutopia AI Chat

 Overview

 Build a Python FastAPI backend integrated with Google Gemini API to power real-time AI chat with cloud image recognition. The system will support streaming responses and base64 image uploads.

 User Requirements:
 - Separate Python FastAPI backend (port 8000)
 - Google Gemini API integration
 - Streaming responses (word-by-word like ChatGPT)
 - Base64 image encoding in JSON
 - No database persistence (ephemeral chat)

 ---
 Architecture

 Backend: Python FastAPI

 - Port: 8000
 - Framework: FastAPI with Uvicorn
 - AI Provider: Google Gemini API (gemini-1.5-flash model with vision)
 - Communication: Server-Sent Events (SSE) for streaming
 - Image Handling: Base64 decoding to PIL Image

 Frontend: Next.js Modifications

 - Replace: generateCloudResponse() mock function → Real API call
 - Add: File-to-base64 conversion utility
 - Update: Chat interface to handle streaming responses
 - Modify: Image state from blob URL to File object

 ---
 Backend Implementation

 Directory Structure

 backend/
 ├── .env                          # Environment variables (API keys)
 ├── .gitignore                    # Ignore .env, venv, cache
 ├── requirements.txt              # Python dependencies
 ├── main.py                       # FastAPI entry point
 ├── app/
 │   ├── __init__.py
 │   ├── config.py                 # Environment variable management
 │   ├── models.py                 # Pydantic request/response models
 │   ├── services/
 │   │   ├── __init__.py
 │   │   └── gemini_service.py    # Gemini API integration
 │   └── routers/
 │       ├── __init__.py
 │       └── chat.py              # Chat endpoint with streaming
 └── README.md

 Key Files

 1. backend/requirements.txt

 fastapi==0.115.0
 uvicorn[standard]==0.32.0
 python-dotenv==1.0.1
 google-generativeai==0.8.3
 pydantic==2.9.0
 pydantic-settings==2.6.0

 2. backend/.env (template)

 GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
 ENVIRONMENT=development
 PORT=8000
 ALLOWED_ORIGINS=http://localhost:3000

 3. backend/main.py

 - Create FastAPI app instance
 - Configure CORS middleware for http://localhost:3000
 - Register chat router
 - Add /health endpoint for status checks

 4. backend/app/config.py

 - Load environment variables using pydantic-settings
 - Validate required variables (API key, origins)

 5. backend/app/models.py

 class ChatRequest(BaseModel):
     message: str = Field(..., min_length=1, max_length=5000)
     image: Optional[str] = Field(None)  # Base64 with data URI prefix

 class ErrorResponse(BaseModel):
     error: str
     detail: Optional[str] = None

 6. backend/app/services/gemini_service.py

 Core Functions:

 - initialize_gemini(api_key: str) → Initialize Gemini model
 - prepare_image_from_base64(base64_str: str) → Convert base64 to PIL Image
 - async stream_gemini_response(model, message: str, image_data: str | None) → Async generator yielding tokens

 System Prompt:
 You are Cloutopia AI, an expert meteorologist specializing in cloud identification
 and geographic analysis. Analyze cloud formations, identify types (cumulus, stratus,
 cirrus, nimbus), and guess photo locations based on atmospheric patterns, lighting,
 and climate indicators. Be conversational and educational.

 7. backend/app/routers/chat.py

 Endpoint: POST /api/chat/stream

 Response Format: Server-Sent Events (SSE)
 data: {"type": "start"}
 data: {"type": "token", "content": "Based"}
 data: {"type": "token", "content": " on"}
 data: {"type": "done"}

 Error Handling:
 - Invalid API key → 500 error
 - Invalid image → 400 validation error
 - Gemini API errors → 500 with sanitized message
 - Rate limiting → 429 with retry-after

 ---
 Frontend Implementation

 Critical Files to Modify

 1. /src/lib/utils/imageUtils.ts (NEW FILE)

 export async function fileToBase64(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result as string);
     reader.onerror = (error) => reject(error);
   });
 }

 2. /src/app/ai-chat/components/chat-interface.tsx

 Current State (lines to replace):
 - Line 21: uploadedImage: string | undefined → uploadedFile: File | undefined
 - Line 33-36: handleImageUpload() → Store File object instead of blob URL
 - Lines 61-79: generateCloudResponse() → Delete entire function
 - Lines 81-109: handleSubmit() → Replace with streaming API call

 New State Variables:
 const [streamingMessage, setStreamingMessage] = useState<string>('');
 const [isStreaming, setIsStreaming] = useState(false);

 New Function: streamChatResponse()
 async function streamChatResponse(message: string, imageFile?: File): Promise<string> {
   // 1. Convert image to base64
   let imageBase64: string | null = null;
   if (imageFile) {
     imageBase64 = await fileToBase64(imageFile);
   }

   // 2. Make SSE request
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message, image: imageBase64 }),
   });

   // 3. Parse SSE stream
   const reader = response.body?.getReader();
   const decoder = new TextDecoder();
   let accumulatedContent = '';

   while (true) {
     const { done, value } = await reader.read();
     if (done) break;

     const chunk = decoder.decode(value);
     const lines = chunk.split('\n');

     for (const line of lines) {
       if (line.startsWith('data: ')) {
         const data = JSON.parse(line.slice(6));
         if (data.type === 'token') {
           accumulatedContent += data.content;
           setStreamingMessage(accumulatedContent);
         }
       }
     }
   }

   return accumulatedContent;
 }

 Updated handleSubmit()
 const handleSubmit = async (e?: React.FormEvent) => {
   e?.preventDefault();
   if (!input.trim() && !uploadedFile) return;

   const newUserMessage: Message = {
     id: Date.now().toString(),
     role: 'user',
     content: input,
     image: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
     timestamp: new Date(),
   };

   setMessages((prev) => [...prev, newUserMessage]);
   setInput('');
   const fileToSend = uploadedFile;
   setUploadedFile(undefined);
   setIsStreaming(true);
   setStreamingMessage('');

   try {
     const fullResponse = await streamChatResponse(input, fileToSend);

     const assistantMessage: Message = {
       id: (Date.now() + 1).toString(),
       role: 'assistant',
       content: fullResponse,
       timestamp: new Date(),
     };

     setMessages((prev) => [...prev, assistantMessage]);
   } catch (error) {
     console.error('Error streaming response:', error);
     const errorMessage: Message = {
       id: (Date.now() + 1).toString(),
       role: 'assistant',
       content: 'Sorry, I encountered an error. Please try again.',
       timestamp: new Date(),
     };
     setMessages((prev) => [...prev, errorMessage]);
   } finally {
     setIsStreaming(false);
     setStreamingMessage('');
   }
 };

 Display Streaming Message (add after line 139):
 {isStreaming && (
   <ChatMessage
     message={{
       id: 'streaming',
       role: 'assistant',
       content: streamingMessage,
       timestamp: new Date(),
     }}
   />
 )}

 3. /src/app/ai-chat/components/chat-input.tsx

 Update Props Interface (line 12):
 - Change: uploadedImage?: string → uploadedFile?: File

 Update Image Preview (lines 38-55):
 {uploadedFile && (
   <div className="mb-3 relative inline-block">
     <Image
       src={URL.createObjectURL(uploadedFile)}
       alt="Uploaded cloud"
       width={300}
       height={200}
       className="max-w-xs max-h-48 rounded-lg border border-gray-200 object-cover shadow-sm"
     />
     <button onClick={onRemoveImage} className="...">
       <X className="w-3.5 h-3.5" />
     </button>
   </div>
 )}

 Update Submit Disabled Logic (line 107):
 disabled={isLoading || (!input.trim() && !uploadedFile)}

 ---
 Environment Configuration

 Backend .env

 GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
 ENVIRONMENT=development
 PORT=8000
 ALLOWED_ORIGINS=http://localhost:3000

 Frontend .env.local

 NEXT_PUBLIC_API_URL=http://localhost:8000
 NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
 NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

 ---
 Step-by-Step Implementation Order

 Phase 1: Backend Setup (Day 1)

 1. Create backend directory structure
   - Create /backend folder in project root
   - Create subdirectories: app/, app/services/, app/routers/
   - Add __init__.py to all Python packages
 2. Set up Python environment
   - Create requirements.txt with dependencies
   - Create virtual environment: python -m venv venv
   - Activate: source venv/bin/activate (Mac/Linux)
   - Install: pip install -r requirements.txt
 3. Configure environment variables
   - Create .env file with template
   - Obtain Gemini API key from https://ai.google.dev/
   - Create app/config.py for settings management
 4. Implement basic FastAPI app
   - Create main.py with FastAPI instance
   - Add CORS middleware
   - Add /health endpoint
   - Test: uvicorn main:app --reload --port 8000

 Phase 2: Gemini Integration (Day 1-2)

 5. Create Pydantic models
   - Implement app/models.py with ChatRequest, ErrorResponse
   - Test validation
 6. Implement Gemini service
   - Create app/services/gemini_service.py
   - Implement initialize_gemini() function
   - Implement prepare_image_from_base64() function
   - Test basic Gemini API call (non-streaming)
 7. Implement streaming logic
   - Add stream_gemini_response() async generator
   - Test streaming with sample prompt
   - Test with base64-encoded image
 8. Create chat router
   - Implement app/routers/chat.py
   - Create POST /api/chat/stream endpoint
   - Integrate Gemini service
   - Test SSE streaming with curl

 Phase 3: Frontend Integration (Day 2)

 9. Create image utilities
   - Create /src/lib/utils/ directory
   - Create imageUtils.ts with fileToBase64() function
   - Test with sample images
 10. Update chat interface
   - Modify chat-interface.tsx state variables
   - Change uploadedImage to uploadedFile (File object)
   - Update handleImageUpload() to store File
   - Create streamChatResponse() function
   - Replace handleSubmit() with streaming version
   - Add streaming message display
 11. Update chat input
   - Modify chat-input.tsx props interface
   - Update image preview to use URL.createObjectURL(uploadedFile)
   - Update disabled logic
 12. Test integration
   - Start backend: cd backend && uvicorn main:app --reload --port 8000
   - Start frontend: npm run dev
   - Test complete flow with image upload
   - Verify streaming appears word-by-word

 Phase 4: Polish (Day 3)

 13. Error handling
   - Add user-friendly error messages
   - Test error scenarios (no API key, network failure)
   - Add console logging for debugging
 14. Documentation
   - Create backend/README.md with setup instructions
   - Update main README.md with backend info
   - Document environment variables

 ---
 Development Workflow

 Running Both Servers

 Terminal 1 (Backend):
 cd backend
 source venv/bin/activate  # Windows: venv\Scripts\activate
 uvicorn main:app --reload --port 8000

 Terminal 2 (Frontend):
 npm run dev

 Access:
 - Frontend: http://localhost:3000/ai-chat
 - Backend API: http://localhost:8000
 - Backend Health: http://localhost:8000/health

 ---
 Testing

 Manual Testing Checklist

 - Upload cloud image and send message → Verify streaming response
 - Send text-only message → Verify response without image
 - Test drag-and-drop image upload → Verify preview and send
 - Remove image before sending → Verify image cleared
 - Test error: Stop backend → Verify error message shown
 - Test large image (>5MB) → Verify handling
 - Test streaming animation → Verify word-by-word display

 Backend API Testing

 # Health check
 curl http://localhost:8000/health

 # Test streaming (replace BASE64_IMAGE with actual base64)
 curl -X POST http://localhost:8000/api/chat/stream \
   -H "Content-Type: application/json" \
   -d '{"message": "What cloud is this?", "image": null}'

 ---
 Critical Implementation Notes

 1. Image Storage: File objects stored temporarily during upload, converted to base64 only when sending to backend
 2. Streaming Display: Accumulated text updated in real-time using setStreamingMessage()
 3. Error Handling: Try-catch around API call, show user-friendly message on failure
 4. CORS: Backend must allow http://localhost:3000 in development
 5. API Key Security: Never expose Gemini API key in frontend (keep in backend .env)
 6. No Database: Messages are ephemeral, reset on page refresh (as requested)

 ---
 Next Steps After Implementation

 Optional Enhancements (Future)

 - Chat history persistence (Supabase database)
 - User authentication integration
 - Image upload to Supabase Storage (instead of base64)
 - Multi-turn conversations with context
 - Rate limiting on backend
 - Deployment to production (Render.com for backend, Vercel for frontend)

 ---
 Dependencies Summary

 Python (backend/requirements.txt)

 - fastapi - Web framework
 - uvicorn - ASGI server
 - python-dotenv - Environment variables
 - google-generativeai - Gemini SDK
 - pydantic - Data validation
 - pydantic-settings - Settings management

 Frontend (no new dependencies needed)

 - Uses native Fetch API for SSE
 - FileReader API for base64 conversion
 - Existing Next.js/React setup

 🎉 Implementation Complete!

  I've successfully built a Google Gemini backend with streaming chat for your Cloutopia application. Here's what was created:

  ✅ Backend (Python FastAPI)

  - Location: /backend directory
  - Features:
    - Google Gemini 1.5 Flash integration for cloud recognition
    - Streaming responses using Server-Sent Events (SSE)
    - Base64 image upload support
    - CORS configured for Next.js
    - Health check and API documentation endpoints

  Key Files:
  - backend/main.py - FastAPI application
  - backend/app/services/gemini_service.py - Gemini AI integration
  - backend/app/routers/chat.py - Streaming chat endpoint
  - backend/README.md - Complete backend documentation

  ✅ Frontend Updates

  - Modified: src/app/ai-chat/components/chat-interface.tsx
    - Replaced mock responses with real API calls
    - Added streaming support (word-by-word display)
    - Implemented base64 image encoding
  - Modified: src/app/ai-chat/components/chat-input.tsx
    - Updated to work with File objects
  - Created: src/lib/utils/imageUtils.ts
    - File-to-base64 conversion utility

  📋 Next Steps to Get Running:

  1. Get a Google Gemini API Key:
    - Visit https://ai.google.dev/
    - Click "Get API Key" and create one (it's free!)
  2. Configure Backend:
  cd backend
  cp .env.example .env
  # Edit .env and add your Gemini API key
  3. Install Backend Dependencies:
  python3 -m venv venv
  source venv/bin/activate  # On Mac/Linux
  pip install -r requirements.txt
  4. Configure Frontend:
  cd ..  # Back to project root
  cp .env.example .env.local
  # Edit .env.local - make sure NEXT_PUBLIC_API_URL=http://localhost:8000
  5. Run Both Servers:

  5. Terminal 1 (Backend):
  cd backend
  source venv/bin/activate
  uvicorn main:app --reload --port 8000

  5. Terminal 2 (Frontend):
  npm run dev
  6. Test It Out:
    - Open http://localhost:3000/ai-chat
    - Try: "Tell me about cumulus clouds"
    - Upload a cloud image and watch the AI analyze it!

  📚 Documentation Created:

  - SETUP_GUIDE.md - Step-by-step setup instructions
  - backend/README.md - Backend API documentation
  - Updated .env.example - Simplified environment configuration

  🔍 How to Verify Everything Works:

  1. Backend health: http://localhost:8000/health
  2. API docs: http://localhost:8000/docs (interactive Swagger UI)
  3. Chat page: http://localhost:3000/ai-chat

  The responses will stream in word-by-word just like ChatGPT! 🚀