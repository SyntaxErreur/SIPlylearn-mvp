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

3. Set up environment variables
Create a `.env` file in the root directory with:
```
SESSION_SECRET=your_session_secret_here
```

4. Start the development server
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
├── server/              # Backend Express server
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage layer
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema and types
```

## Features

- React frontend with Tailwind CSS
- Express backend
- SIP-based investment model for course access
- Profile management and investment tracking
- Responsive mobile-first design

## Development

The development server includes both frontend and backend:
- Frontend: Vite development server with HMR
- Backend: Express server with automatic restart
- Shared port for both frontend and API

## Built With

- React
- TypeScript
- Express
- Tailwind CSS
- Shadcn UI
- Drizzle ORM
- TanStack Query
