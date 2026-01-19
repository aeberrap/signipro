# Email Signature Generator

## Overview

This is an Email Signature Generator web application that allows users to create professional email signatures with live preview and one-click copy functionality. The app supports both light and dark themes and generates signatures compatible with Gmail, Apple Mail, and other email clients.

The project follows a full-stack TypeScript architecture with a React frontend and Express backend, using a shared schema approach for type safety across the stack.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with hot module replacement

The frontend is located in `client/src/` with a standard structure:
- `pages/` - Route components (home.tsx, not-found.tsx)
- `components/ui/` - Reusable shadcn/ui components
- `hooks/` - Custom React hooks (use-toast, use-mobile)
- `lib/` - Utility functions and query client configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: Node.js with HTTP server
- **Development**: tsx for TypeScript execution with hot reload
- **Build**: esbuild for production bundling

The backend is located in `server/` with:
- `index.ts` - Main server entry point with middleware setup
- `routes.ts` - API route registration (prefix all routes with `/api`)
- `storage.ts` - Data storage interface with in-memory implementation
- `static.ts` - Static file serving for production
- `vite.ts` - Vite dev server integration

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table definitions
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Storage Interface**: Abstract IStorage interface in `server/storage.ts` allowing swap between MemStorage and database implementations

Current schema includes a users table with id, username, and password fields. The storage layer currently uses in-memory storage (MemStorage) but is designed to be easily swapped for database-backed storage.

### Build System
- **Development**: `npm run dev` - Runs tsx with Vite dev server
- **Production Build**: `npm run build` - Builds both client (Vite) and server (esbuild)
- **Database**: `npm run db:push` - Pushes schema changes via Drizzle Kit

## External Dependencies

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migration and schema management
- **connect-pg-simple**: PostgreSQL session store (available but not currently active)

### UI/Styling
- **Radix UI**: Full suite of accessible, unstyled components
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for form validation
- **zod**: Schema validation library