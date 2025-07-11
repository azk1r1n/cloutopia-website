# Cloutopia - Cloud Recognition Website Development Plan

## Project Overview
Cloutopia is a cloud recognition website that allows users to upload photos and chat with an LLM to identify cloud types and guess locations. The platform includes blogging functionality and user authentication.

## Core Functionalities

### 1. Home Page - Cloud Recognition Chat
- **Photo Upload**: Users can upload images of clouds/sky
- **Chat Interface**: Large chat window for LLM interaction
- **Cloud Recognition**: Backend LLM identifies cloud types and predicts location
- **Interactive Q&A**: Users can ask follow-up questions about their photos

### 2. Blog Page
- **Community Blogs**: Centralized blog posts from all users
- **Auto-Generation**: Convert chat histories into blog posts
- **Blog Discovery**: Browse and read other users' cloud recognition stories

### 3. User Management
- **Authentication**: User login/registration system
- **Personal Dashboard**: View and edit personal blogs
- **Blog Creation**: Create new blogs manually or from chat history
- **Profile Management**: Basic user profile functionality

## Technology Stack Recommendations

### Frontend (Beginner-Friendly)
- **Framework**: **Next.js 14** with TypeScript
  - Pros: Full-stack capabilities, easy deployment, great documentation
  - Built-in routing, API routes, and optimizations
  - Excellent for beginners with good learning resources
- **Styling**: **Tailwind CSS**
  - Utility-first CSS framework
  - Rapid development and consistent design
- **UI Components**: **shadcn/ui**
  - Pre-built, customizable components
  - Works seamlessly with Tailwind CSS
- **State Management**: **Zustand** (lightweight) or built-in React state
- **File Upload**: **react-dropzone**
- **Chat UI**: Custom components with real-time updates

### Backend API
- **Framework**: **FastAPI** (Python)
  - Excellent for beginners
  - Automatic API documentation
  - Great performance and modern Python features
  - Easy integration with AI/ML libraries
- **Database**: **PostgreSQL** with **SQLAlchemy**
  - Reliable, scalable, and well-supported
  - Good ORM support
- **Authentication**: **FastAPI-Users**
  - Simple authentication system
  - JWT token support
- **File Storage**: **AWS S3** or **Google Cloud Storage**
- **AI Integration**: **Autogen + OpenAI API**
  - Multi-agent conversations for cloud recognition
  - Integration with vision models (GPT-4V or Claude 3)

### Deployment Strategy

#### Backend Deployment Options
1. **Google Cloud Platform (GCP) - Recommended for Beginners**
   - **Cloud Run**: Serverless container deployment
   - **Cloud SQL**: Managed PostgreSQL
   - **Cloud Storage**: File storage
   - **Benefits**: Pay-as-you-go, automatic scaling, easy setup

2. **AWS Alternative**
   - **AWS Lambda + API Gateway**: Serverless functions
   - **RDS**: Managed database
   - **S3**: File storage

#### Frontend Deployment
- **Vercel** (Recommended - created by Next.js team)
  - Automatic deployments from GitHub
  - Edge functions and global CDN
  - Free tier available
- **Netlify** (Alternative)
  - Similar features to Vercel
  - Good for static sites

#### Domain & DNS
- **Cloudflare**: Already set up ✅
  - Configure DNS to point to Vercel/Netlify
  - Use Cloudflare's CDN and security features

## Development Phases

### Phase 1: MVP Setup (Week 1-2)
- [ ] Set up project structure
- [ ] Create basic Next.js frontend
- [ ] Set up FastAPI backend
- [ ] Implement basic file upload
- [ ] Create simple chat interface
- [ ] Deploy to staging environment

### Phase 2: Core Features (Week 3-4)
- [ ] Integrate Autogen for cloud recognition
- [ ] Implement user authentication
- [ ] Create blog system (CRUD operations)
- [ ] Add database models and API endpoints
- [ ] Implement chat-to-blog conversion

### Phase 3: Polish & Deploy (Week 5-6)
- [ ] UI/UX improvements
- [ ] Testing and bug fixes
- [ ] Production deployment
- [ ] Domain configuration
- [ ] Performance optimization

## Cost Estimates (Monthly)

### GCP (Recommended)
- **Cloud Run**: $0-25 (free tier covers most development)
- **Cloud SQL**: $10-50 (depending on usage)
- **Cloud Storage**: $1-10
- **Total**: ~$10-85/month

### Frontend Hosting
- **Vercel**: Free tier sufficient for development
- **Pro**: $20/month if needed

### Third-party Services
- **OpenAI API**: $10-100 (depending on usage)
- **Domain**: Already have ✅

## Getting Started Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed
- [ ] Git configured
- [ ] GCP account created (free tier)
- [ ] OpenAI API key obtained

### Initial Setup
- [ ] Clone/initialize repository
- [ ] Set up development environment
- [ ] Create basic project structure
- [ ] Install dependencies
- [ ] Set up environment variables
- [ ] Create first deployment

## Security Considerations
- Environment variables for API keys
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure file upload handling
- HTTPS everywhere
- Regular dependency updates

## Monitoring & Analytics
- **Vercel Analytics**: Frontend performance
- **GCP Monitoring**: Backend performance
- **Error tracking**: Sentry (optional)
- **User analytics**: Google Analytics (optional)

---

## Next Steps
1. Review this plan and adjust based on your preferences
2. Set up the development environment
3. Create the basic project structure
4. Start with Phase 1 implementation
5. Test each component before moving to the next phase

This plan prioritizes simplicity and ease of development while maintaining scalability for future growth.
