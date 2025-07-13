# Cloutopia - Cloud Recognition App

A Next.js application for cloud recognition and atmospheric analysis. Upload images of clouds or sky, and get AI-powered identification of cloud formations with location insights.

## Features

- 🌤️ **Cloud Identification**: AI-powered recognition of cloud formations
- 🌍 **Location Analysis**: Atmospheric pattern analysis to guess photo locations  
- 💬 **Interactive Chat**: Large chat interface for seamless interaction
- 📸 **Image Upload**: Drag-and-drop or click to upload cloud photos
- ☀️ **Light Theme**: Modern, clean light interface
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Python (future integration)

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Upload an Image**: Click the upload button or drag and drop a cloud/sky photo
2. **Ask Questions**: Type questions about cloud formations, weather patterns, or location
3. **Get AI Analysis**: Receive detailed analysis of cloud types and atmospheric conditions
4. **Location Insights**: Get educated guesses about where the photo might have been taken

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
└── components/
    ├── Header.tsx        # Navigation header
    ├── ChatInterface.tsx # Main chat interface
    └── ImageUpload.tsx   # File upload component
```

## Development

- The page auto-updates as you edit files
- Built with TypeScript for type safety
- Uses Tailwind CSS for styling
- Prepared for Python backend integration

## Future Enhancements

- [ ] Python backend integration for AI analysis
- [ ] Real-time weather data integration
- [ ] User authentication and chat history
- [ ] Advanced cloud classification models
- [ ] Geolocation-based suggestions

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
