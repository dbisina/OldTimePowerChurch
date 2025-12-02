# Old Time Power Church Website

## Overview

This is a modern, mobile-first church website for Old Time Power Church, focused on revival identity and "Preparing the Way for the Lord." The application features a warm "holy" aesthetic with liquid-glass UI elements, golden light accents, and soft indigo depths. Key functionality includes searchable sermon outlines linked to YouTube clips, announcements (both graphic and non-graphic), newsletter signups, and administrative tools for managing sermons, announcements, worship/prayer media, and mailing lists.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- **React with TypeScript**: Component-based UI using functional components with hooks
- **Vite**: Fast development server and optimized production builds
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Server state management and data fetching with caching

**UI Component System**
- **shadcn/ui**: Headless component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Class Variance Authority (CVA)**: Type-safe component variant management
- **Design System**: Custom color palette with warm revival aesthetic (golden browns #b5621b, #efc64e; soft indigo #221672; neutral tones)

**Typography**
- Headings: Playfair Display (serif) for spiritual gravitas
- Body: Inter (sans-serif) for readability
- Spacing uses consistent Tailwind scale

**Key Features**
- Hero carousel with multiple slides showcasing church mission
- Service schedule cards (Sunday, Tuesday, Friday services)
- Sermon library with searchable outlines and YouTube integration
- Announcements system supporting both graphic and text-based content
- Newsletter signup with email collection
- Dark/light theme toggle with persistent preferences
- Mobile-first responsive design (320px to 1440px+)

### Backend Architecture

**Server Framework**
- **Express.js**: Minimal REST API setup with TypeScript
- **Node.js**: Runtime environment with ES modules
- **HTTP Server**: Standard Node.js HTTP server wrapping Express

**Development Setup**
- Hot module replacement via Vite in development
- Separate build process for client and server
- Static file serving for production builds
- Error overlay and dev tools in Replit environment

**Storage Layer**
- **In-Memory Storage**: Default implementation using JavaScript Maps
- **IStorage Interface**: Abstraction for CRUD operations (currently implements user management)
- Designed to be replaced with database implementation

**API Structure**
- Routes registered via `registerRoutes` function
- All API endpoints prefixed with `/api`
- Request/response logging middleware
- JSON body parsing with raw body preservation for webhooks

### Data Storage Solutions

**Database Setup (Configured but Not Active)**
- **Neon Serverless Postgres**: Cloud PostgreSQL configured via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database queries with `drizzle-orm`
- **WebSocket Connection**: Uses `ws` package for Neon's serverless connection pooling

**Schema Definition**
- Located in `shared/schema.ts` for type sharing between client and server
- Current schema includes `users` table with username/password fields
- Zod integration via `drizzle-zod` for runtime validation
- Migration files output to `./migrations` directory

**Current State**: Application uses in-memory storage by default. Database configuration exists but requires `DATABASE_URL` environment variable to activate.

### Authentication and Authorization

**Not Currently Implemented**
- Dependencies included: `passport`, `passport-local`, `express-session`, `connect-pg-simple`
- User schema exists with username/password fields
- Session management packages configured but not integrated
- Storage interface includes user CRUD methods

### Key Architectural Decisions

**Monorepo Structure**
- Client code in `/client` directory
- Server code in `/server` directory  
- Shared types in `/shared` directory
- Path aliases configured: `@/` for client, `@shared/` for shared code

**Build Strategy**
- Client: Vite builds to `dist/public` with tree-shaking and code splitting
- Server: esbuild bundles to single `dist/index.cjs` file with select dependencies bundled (allowlist includes database, session, email packages to reduce syscalls)
- External dependencies minimized for faster cold starts

**Type Safety**
- Strict TypeScript configuration across all code
- Shared schema types between client and server
- Zod schemas for runtime validation

**Component Organization**
- UI primitives in `components/ui` (shadcn/ui components)
- Feature components in `components` root
- Page components in `pages` directory
- Example components in `components/examples` for documentation

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless accessible components (@radix-ui/react-*)
- **Lucide React**: Icon library
- **React Icons**: Additional icons (specifically for Telegram icon)
- **cmdk**: Command palette component
- **react-day-picker**: Calendar/date picker
- **embla-carousel-react**: Carousel functionality
- **recharts**: Charting library (configured but not actively used)

### Form Management
- **React Hook Form**: Form state and validation
- **@hookform/resolvers**: Zod resolver integration

### Database & ORM
- **@neondatabase/serverless**: Neon Postgres driver
- **drizzle-orm**: TypeScript ORM
- **drizzle-kit**: Database migration tool
- **drizzle-zod**: Zod schema generation from Drizzle schemas

### Potential Integrations (Dependencies Present but Not Implemented)
- **Stripe**: Payment processing
- **Nodemailer**: Email sending (for newsletters, notifications)
- **OpenAI / Google Generative AI**: AI features
- **Multer**: File upload handling
- **XLSX**: Spreadsheet export/import

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development tooling
- **tsx**: TypeScript execution for dev server
- **ws**: WebSocket support for Neon database

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS & Autoprefixer**: CSS processing
- **clsx & tailwind-merge**: Conditional className utilities
- **date-fns**: Date formatting and manipulation
- **nanoid**: ID generation
- **uuid**: UUID generation