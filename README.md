# Cloutopia - Cloud Recognition Website

Cloutopia is an AI-powered cloud recognition platform that allows users to upload photos, chat with AI to identify cloud types and guess locations, and create blog posts from their discoveries.

## 🌤️ Features

- **Cloud Recognition**: Upload photos and get AI-powered cloud type identification
- **Location Guessing**: AI analyzes weather patterns to estimate photo locations  
- **Interactive Chat**: Conversational interface for asking questions about clouds
- **Blog Platform**: Create and share blog posts from chat conversations
- **User Authentication**: Personal dashboards and blog management

## 🏗️ Project Structure

```
cloutopia-website/
├── frontend/          # Next.js 14 with TypeScript and Tailwind CSS
├── backend/           # FastAPI with Python
├── docs/             # Project documentation
└── scripts/          # Utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (for production)

### Development Setup

1. **Clone and setup environment**:
   ```bash
   git clone <your-repo-url>
   cd cloutopia-website
   cp .env.example .env.local
   cp .env.example backend/.env
   ```

2. **Start Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🔧 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Zustand** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Production database
- **Autogen** - Multi-agent AI conversations
- **OpenAI API** - LLM integration

### Infrastructure
- **Vercel** - Frontend hosting
- **Google Cloud Platform** - Backend hosting
- **Cloudflare** - CDN and DNS

## 📖 Documentation

- [Development Plan](docs/dev_plan.md)
- [Setup Instructions](docs/setup/README.md)
- [API Documentation](http://localhost:8000/docs) (when running)

## 🔑 Environment Variables

Create `.env.local` for frontend and `.env` for backend using `.env.example` as template.

Key variables:
- `OPENAI_API_KEY` - Required for AI functionality
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret

## 🚢 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/.next`
3. Add environment variables

### Backend (Google Cloud Platform)
1. Deploy to Cloud Run:
   ```bash
   gcloud run deploy cloutopia-api --source backend
   ```
2. Set up Cloud SQL for PostgreSQL
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions and support:
1. Check the [documentation](docs/)
2. Review [setup instructions](docs/setup/README.md)
3. Open an issue on GitHub

---

Built with ❤️ for cloud enthusiasts around the world!
