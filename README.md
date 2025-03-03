# SIPlylearn Platform

A comprehensive learning platform that combines tech education with investment-based course access.

## Prerequisites

- Node.js (v18 or v20)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd siplylearn
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will start on `http://localhost:5000`

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and helpers
│   │   └── pages/      # Page components
└── shared/             # Shared types and schemas
    └── schema.ts       # Type definitions
```

## Features

- React frontend with Tailwind CSS
- SIP-based investment model for course access
- Profile management and investment tracking
- Responsive mobile-first design
- Mock data persistence using localStorage

## Development

The development server includes:
- Vite development server with HMR
- Mock data service for development
- TypeScript type checking

## Built With

- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- TanStack Query