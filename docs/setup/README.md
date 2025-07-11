# Cloutopia Project Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**: [Download from nodejs.org](https://nodejs.org/)
- **Python 3.11+**: [Download from python.org](https://python.org/)
- **Git**: [Download from git-scm.com](https://git-scm.com/)

## Project Structure

```
cloutopia-website/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js 14 app router
│   │   ├── (auth)/         # Authentication routes
│   │   ├── blog/           # Blog pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── chat/          # Chat interface components
│   │   ├── blog/          # Blog-related components
│   │   └── auth/          # Authentication components
│   ├── lib/               # Utility functions and configurations
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── next.config.js     # Next.js configuration
├── backend/               # FastAPI backend
│   ├── app/              # Main application code
│   │   ├── api/          # API route handlers
│   │   │   ├── auth/     # Authentication endpoints
│   │   │   ├── chat/     # Chat and cloud recognition
│   │   │   └── blog/     # Blog management
│   │   ├── core/         # Core configurations
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic services
│   │   │   ├── autogen/  # Autogen integration
│   │   │   ├── storage/  # File storage handling
│   │   │   └── ai/       # AI/ML services
│   │   └── main.py       # FastAPI application entry point
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile        # Container configuration
├── docs/                 # Project documentation
│   ├── setup/           # Setup and deployment guides
│   ├── api/             # API documentation
│   └── dev_plan.md      # Development plan
├── scripts/             # Utility scripts
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── README.md           # Project overview
└── docker-compose.yml  # Local development setup
```

## Environment Setup

### 1. Clone and Initialize Repository

```bash
# If starting from scratch
git init
git add .
git commit -m "Initial project setup"

# Create environment files
cp .env.example .env.local  # For frontend
cp .env.example backend/.env  # For backend
```

### 2. Backend Setup (FastAPI)

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

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8000/api/upload
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Backend (.env)
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cloutopia
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/cloutopia_test

# Authentication
SECRET_KEY=your-super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
OPENAI_API_KEY=your-openai-api-key
AZURE_OPENAI_ENDPOINT=your-azure-endpoint  # if using Azure

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=cloutopia-uploads
AWS_REGION=us-west-2

# Optional: Google Cloud Storage
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

## Development Workflow

### 1. Start Local Development

```bash
# Terminal 1: Start backend
cd backend
source venv/bin/activate  # Activate virtual environment
uvicorn app.main:app --reload

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### 2. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 3. Database Setup (PostgreSQL)

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb cloutopia
createdb cloutopia_test

# Run migrations (after implementing models)
cd backend
alembic upgrade head
```

## Deployment

### Frontend Deployment (Vercel)

1. **Connect to GitHub**:
   - Push code to GitHub repository
   - Connect Vercel to your GitHub account
   - Import the repository

2. **Configure Build Settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/.next`
   - Root Directory: `frontend`

3. **Environment Variables**:
   - Add production environment variables in Vercel dashboard

### Backend Deployment (Google Cloud Platform)

1. **Set up GCP Project**:
   ```bash
   # Install Google Cloud CLI
   # Create new project
   gcloud projects create cloutopia-backend
   gcloud config set project cloutopia-backend
   ```

2. **Deploy to Cloud Run**:
   ```bash
   # Build and deploy
   cd backend
   gcloud run deploy cloutopia-api \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Set up Cloud SQL**:
   ```bash
   # Create PostgreSQL instance
   gcloud sql instances create cloutopia-db \
     --database-version POSTGRES_14 \
     --tier db-f1-micro \
     --region us-central1
   ```

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill process using port 3000 or 8000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:8000 | xargs kill -9
   ```

2. **Python Virtual Environment Issues**:
   ```bash
   # Recreate virtual environment
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Node.js Dependencies**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Next Steps

1. Follow the development plan in `docs/dev_plan.md`
2. Start with Phase 1: MVP Setup
3. Set up your development environment
4. Begin implementing core features
5. Test locally before deploying

## Support Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Autogen Documentation**: https://microsoft.github.io/autogen/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
