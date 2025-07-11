# Cloutopia Deployment Guide & Summary

## 🚀 Overview
This document provides a comprehensive guide for deploying the Cloutopia cloud recognition website to production. The application uses a hybrid approach with **Vercel** for frontend hosting and **Google Cloud Platform** for backend services.

## 📋 Architecture Summary

### Frontend (Next.js)
- **Platform**: Vercel
- **Framework**: Next.js 14 with App Router
- **Features**: SSR/SSG, real-time chat, file upload UI
- **Domain**: Connected via Cloudflare DNS

### Backend (FastAPI)
- **Platform**: Google Cloud Run
- **Framework**: FastAPI with Python 3.11
- **Features**: AI service integration, REST API, file handling
- **Database**: Cloud SQL (PostgreSQL)

### AI Integration
- **Primary**: OpenAI GPT-4 with Autogen multi-agent system
- **Backup**: Azure OpenAI (optional)
- **Purpose**: Cloud recognition, chat responses, blog generation

## 🔧 Environment Variables Configuration

### Frontend (.env.local)
```env
# Production URLs
NEXT_PUBLIC_API_URL=https://your-backend-url.run.app
NEXT_PUBLIC_UPLOAD_URL=https://your-backend-url.run.app/api/upload

# Authentication
NEXTAUTH_SECRET=super-secure-random-string-change-this
NEXTAUTH_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### Backend (.env in Cloud Run)
```env
# Database
DATABASE_URL=postgresql://username:password@/database?host=/cloudsql/project:region:instance

# Authentication
SECRET_KEY=super-secure-jwt-secret-key-change-this
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
OPENAI_API_KEY=sk-your-actual-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-azure-endpoint.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-api-key

# File Storage
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GCS_BUCKET_NAME=cloutopia-uploads-prod

# Production settings
DEBUG=False
ENVIRONMENT=production
```

## 🌐 Deployment Steps

### 1. Frontend Deployment (Vercel)

#### Prerequisites
- GitHub repository with your code
- Vercel account connected to GitHub
- Domain configured in Cloudflare

#### Steps
1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

2. **Vercel Configuration**
   - Import repository in Vercel dashboard
   - Set **Root Directory**: `frontend`
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `.next`

3. **Environment Variables**
   Add in Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.run.app
   NEXT_PUBLIC_UPLOAD_URL=https://your-backend-url.run.app/api/upload
   NEXTAUTH_SECRET=your-secure-secret
   NEXTAUTH_URL=https://your-domain.com
   ```

4. **Custom Domain**
   - Add your domain in Vercel dashboard
   - Update Cloudflare DNS:
     ```
     Type: CNAME
     Name: @ (or www)
     Target: cname.vercel-dns.com
     ```

### 2. Backend Deployment (Google Cloud Platform)

#### Prerequisites
- Google Cloud account with billing enabled
- Google Cloud CLI installed and authenticated
- Docker installed (for local testing)

#### Initial Setup
```bash
# Install Google Cloud CLI
# Authenticate
gcloud auth login
gcloud auth application-default login

# Create project
gcloud projects create cloutopia-prod-2024
gcloud config set project cloutopia-prod-2024

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
```

#### Database Setup
```bash
# Create Cloud SQL instance
gcloud sql instances create cloutopia-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --storage-type=SSD \
    --storage-size=10GB

# Create database
gcloud sql databases create cloutopia --instance=cloutopia-db

# Create database user
gcloud sql users create cloutopia-user \
    --instance=cloutopia-db \
    --password=secure-password-here
```

#### Cloud Storage Setup
```bash
# Create bucket for file uploads
gsutil mb -p cloutopia-prod-2024 -c STANDARD -l us-central1 gs://cloutopia-uploads-prod

# Set public access for uploaded files (if needed)
gsutil iam ch allUsers:objectViewer gs://cloutopia-uploads-prod
```

#### Backend Application Deployment
```bash
# Navigate to backend directory
cd backend

# Create Dockerfile (if not exists)
cat > Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

# Deploy to Cloud Run
gcloud run deploy cloutopia-api \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars="ENVIRONMENT=production,DEBUG=False" \
    --set-cloudsql-instances=cloutopia-prod-2024:us-central1:cloutopia-db
```

#### Environment Variables for Cloud Run
Set these in the Cloud Run console or via CLI:
```bash
gcloud run services update cloutopia-api \
    --region us-central1 \
    --set-env-vars="DATABASE_URL=postgresql://cloutopia-user:secure-password-here@/cloutopia?host=/cloudsql/cloutopia-prod-2024:us-central1:cloutopia-db" \
    --set-env-vars="SECRET_KEY=your-jwt-secret" \
    --set-env-vars="OPENAI_API_KEY=your-openai-key" \
    --set-env-vars="GOOGLE_CLOUD_PROJECT=cloutopia-prod-2024" \
    --set-env-vars="GCS_BUCKET_NAME=cloutopia-uploads-prod"
```

### 3. Database Migration
```bash
# Run database initialization (one-time)
gcloud run jobs create db-init \
    --image gcr.io/cloutopia-prod-2024/cloutopia-api \
    --set-cloudsql-instances=cloutopia-prod-2024:us-central1:cloutopia-db \
    --set-env-vars="DATABASE_URL=postgresql://cloutopia-user:secure-password-here@/cloutopia?host=/cloudsql/cloutopia-prod-2024:us-central1:cloutopia-db" \
    --command="python,init_db.py"

gcloud run jobs execute db-init --region us-central1
```

## 🔒 Security Configuration

### 1. API Keys Management
- Store API keys in Google Secret Manager
- Use IAM roles for service accounts
- Never commit secrets to version control

### 2. CORS Configuration
Update FastAPI CORS settings for production:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # Restrict to your domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### 3. SSL/TLS
- Vercel provides automatic HTTPS
- Cloud Run provides automatic HTTPS
- Cloudflare provides additional SSL protection

## 📊 Monitoring & Analytics

### 1. Application Monitoring
```bash
# Enable Cloud Run logging
gcloud logging sinks create cloutopia-logs \
    cloud-run-revision-logs \
    --log-filter='resource.type="cloud_run_revision"'
```

### 2. Performance Monitoring
- **Frontend**: Vercel Analytics (automatic)
- **Backend**: Google Cloud Monitoring
- **Database**: Cloud SQL Insights

### 3. Error Tracking
Optional: Integrate Sentry for error tracking:
```bash
pip install sentry-sdk[fastapi]
```

## 💰 Cost Estimates (Monthly)

### Google Cloud Platform
| Service | Tier | Estimated Cost |
|---------|------|----------------|
| Cloud Run | Free tier + usage | $0-25 |
| Cloud SQL | db-f1-micro | $15-30 |
| Cloud Storage | Standard | $1-5 |
| **Total GCP** | | **$16-60** |

### Vercel
| Plan | Features | Cost |
|------|----------|------|
| Hobby | Personal projects | $0 |
| Pro | Commercial use | $20 |

### Third-party Services
| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| OpenAI API | Moderate usage | $10-50 |
| Cloudflare | Basic plan | $0-20 |

### **Total Monthly Cost: $26-150**

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database schema finalized
- [ ] API endpoints tested
- [ ] Frontend builds successfully

### Deployment Process
- [ ] Backend deployed to Cloud Run
- [ ] Database initialized with schema
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] Domain configured and SSL working

### Post-deployment
- [ ] Health checks passing
- [ ] API endpoints accessible
- [ ] File upload working
- [ ] Chat functionality working
- [ ] Blog creation working
- [ ] Analytics configured
- [ ] Monitoring set up

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: cloutopia-prod-2024
      - name: Deploy to Cloud Run
        run: |
          cd backend
          gcloud run deploy cloutopia-api --source . --region us-central1
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FastAPI CORS configuration
   - Verify frontend origin URLs

2. **Database Connection**
   - Verify Cloud SQL instance is running
   - Check connection string format
   - Ensure service account has SQL permissions

3. **File Upload Issues**
   - Check Cloud Storage bucket permissions
   - Verify GOOGLE_APPLICATION_CREDENTIALS

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variable references

### Useful Commands
```bash
# Check Cloud Run logs
gcloud run services logs read cloutopia-api --region us-central1

# Check Cloud SQL connections
gcloud sql operations list --instance cloutopia-db

# Test API endpoint
curl https://your-backend-url.run.app/health

# Check frontend build locally
cd frontend && npm run build
```

## 📞 Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)

---

**Last Updated**: January 2025
**Status**: Ready for production deployment
**Estimated Setup Time**: 2-4 hours for initial deployment
