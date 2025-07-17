# Cloutopia - Cloud Recognition App

A Next.js application for cloud recognition and atmospheric analysis. Upload images of clouds or sky, and get AI-powered identification of cloud formations with location insights.

## 🌟 Features

- 🌤️ **Cloud Identification**: AI-powered recognition of cloud formations
- 🌍 **Location Analysis**: Atmospheric pattern analysis to guess photo locations  
- 💬 **Interactive Chat**: Large chat interface for seamless interaction with AI
- 📸 **Image Upload**: Drag-and-drop or click to upload cloud photos
- 👤 **User Authentication**: Secure sign-up and login with Supabase
- 🏠 **User Dashboard**: Personal dashboard to manage analysis history
- 📝 **Blog System**: Share cloud discoveries and read community stories
- ☀️ **Light Theme**: Modern, clean light interface
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)
- **Backend**: Python (future integration)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- Git configured

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cloutopia-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy the project URL and anon key from the API settings
3. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📖 Documentation

For detailed documentation about the project structure and how different components work together, see the `docs/` folder:

- [Project Structure Guide](./docs/project-structure.md) - Overview of the codebase organization
- [Component Guide](./docs/components-guide.md) - Detailed explanation of React components
- [Authentication Flow](./docs/authentication.md) - How user authentication works
- [Routing Guide](./docs/routing.md) - Next.js App Router and navigation

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account or sign in to access all features
2. **Upload an Image**: Navigate to the AI Chat page and upload a cloud/sky photo
3. **Ask Questions**: Type questions about cloud formations, weather patterns, or location
4. **Get AI Analysis**: Receive detailed analysis of cloud types and atmospheric conditions
5. **User Dashboard**: Access your personal dashboard to view analysis history
6. **Share Stories**: Create blog posts from your cloud discoveries

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx               # Home page (redirects to ai-chat)
│   ├── layout.tsx             # Root layout with fonts and metadata
│   ├── globals.css            # Global styles
│   ├── ai-chat/               # Main cloud recognition chat interface
│   ├── auth/                  # Authentication pages (login, signup, etc.)
│   ├── blog/                  # Blog system (list, individual posts)
│   ├── about/                 # About page
│   ├── contact/               # Contact page
│   └── protected/             # User dashboard (requires authentication)
├── components/                 # Reusable React components
│   ├── Header.tsx             # Main navigation header
│   ├── Footer.tsx             # Site footer
│   ├── auth-button.tsx        # Authentication state button
│   ├── login-form.tsx         # Login form component
│   ├── sign-up-form.tsx       # Registration form component
│   └── ImageUpload.tsx        # File upload component
├── content/                   # Static content and data
│   └── articles.ts            # Blog articles data
└── lib/                       # Utilities and configurations
    └── supabase/              # Supabase client configurations
```

## 🔐 Authentication Features

- **Sign Up**: Create new user accounts with email/password
- **Sign In**: Secure login for existing users  
- **Password Reset**: Email-based password recovery
- **Protected Routes**: Dashboard and user-specific features require authentication
- **Session Management**: Automatic session handling with middleware

## 🌐 Available Pages

- **`/`** - Home page (redirects to AI chat)
- **`/ai-chat`** - Main cloud recognition interface
- **`/about`** - About Cloutopia and how it works
- **`/blog`** - Community blog posts and articles
- **`/blog/[id]`** - Individual blog post pages
- **`/contact`** - Contact form and information
- **`/auth/login`** - User login page
- **`/auth/sign-up`** - User registration page
- **`/auth/forgot-password`** - Password reset page
- **`/protected`** - User dashboard (authentication required)

## 🔧 Development Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Environment Variables for Production

```bash
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🔮 Future Enhancements

- [ ] Python backend integration for AI analysis
- [ ] Real-time weather data integration
- [ ] Chat history persistence
- [ ] Advanced cloud classification models
- [ ] Geolocation-based suggestions
- [ ] Blog post creation from chat history
- [ ] Image analysis improvements
- [ ] Social features and sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or issues, please:

1. Check the [documentation](./docs/)
2. Open an issue on GitHub
3. Contact us through the [contact page](http://localhost:3000/contact)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS


