# Copilot Instructions for Cloutopia Cloud Recognition App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js 14 cloud recognition application called Cloutopia with the following specifications:

## Project Overview
- **Purpose**: Cloud recognition app where users upload images and chat with an LLM to identify cloud formations and guess locations
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and App Router
- **Backend**: Python (future integration)
- **UI Theme**: Light theme with modern, clean interface

## Key Features
1. **Image Upload**: Users can upload cloud/sky photos
2. **Chat Interface**: Large chat window for interaction with LLM
3. **Cloud Recognition**: AI-powered cloud formation identification
4. **Location Guessing**: LLM attempts to guess photo location based on cloud patterns
5. **Responsive Design**: Works on desktop and mobile devices

## Technical Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **File Handling**: File upload with image preview
- **Icons**: Lucide React or Heroicons

## Code Style Guidelines
1. Use TypeScript for all components and utilities
2. Follow Next.js App Router conventions
3. Use Tailwind CSS for styling with light theme as default
4. Create reusable components in `src/components/`
5. Use proper error handling and loading states
6. Implement responsive design patterns
7. Follow accessibility best practices

## Component Structure
- `ChatInterface`: Main chat window component
- `ImageUpload`: File upload with drag-and-drop
- `MessageBubble`: Individual chat messages
- `Header`: Navigation and branding
- `Sidebar`: Optional sidebar for features

## API Integration
- Prepare for Python backend integration
- Use proper TypeScript types for API responses
- Implement error handling for network requests
- Consider using React Query or SWR for data fetching

When generating code, prioritize:
1. Clean, readable TypeScript code
2. Modern React patterns (hooks, functional components)
3. Responsive and accessible UI
4. Light theme consistency
5. Performance optimization
