# Gadang Barubah Interactive Game Interface

## Overview

Gadang Barubah is an interactive web application showcasing an Indonesian restaurant experience with a cultural mascot named "Uni". The application features a game-style interface with traditional Minangkabau cultural elements, allowing users to explore various restaurant services through an engaging, mascot-driven experience. The project combines modern web technologies with Indonesian cultural aesthetics to create an immersive digital experience for restaurant promotion and customer engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing with multiple service pages
- **UI Framework**: Shadcn/ui component library with Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with custom design tokens for Indonesian cultural theming
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Design System
- **Color Palette**: Custom dark red background (#3f1113) with warm cream and gold accents representing traditional Indonesian aesthetics
- **Typography**: Poppins and Inter fonts for modern readability with cultural appeal
- **Component Structure**: Gaming-inspired UI elements including animated mascot, chatbox, and floating interactive elements
- **Responsive Design**: Mobile-first approach with consistent 8px grid system

### Backend Architecture
- **Runtime**: Node.js with Express server framework
- **Development**: TypeScript with ES modules for type safety and modern JavaScript features
- **Storage Interface**: Abstracted storage layer with in-memory implementation for user management
- **API Structure**: RESTful API design with /api prefix for all backend routes

### Data Storage Solutions
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory for type consistency
- **Database Provider**: Configured for Neon Database serverless PostgreSQL
- **Migration System**: Drizzle Kit for database schema migrations and management

### Authentication and Authorization
- **User Schema**: Basic username/password authentication system
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Security**: Express middleware for request logging and error handling

### Development and Build System
- **Bundler**: Vite with React plugin for fast HMR and optimized production builds
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Asset Management**: Vite asset resolution with custom aliases for clean imports
- **Environment**: Separate development and production configurations

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, PostCSS, Autoprefixer
- **UI Components**: Radix UI component primitives, Shadcn/ui, Lucide React icons

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database Layer**: Drizzle ORM, Neon Database serverless driver
- **Session Management**: Connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod for runtime type validation and schema generation

### Styling and Design
- **CSS Framework**: Tailwind CSS with custom configuration
- **Typography**: Google Fonts (Poppins, Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Component Styling**: Class Variance Authority for component variant management
- **Utilities**: clsx and tailwind-merge for conditional styling

### Development Tools
- **Package Management**: NPM with lockfile for dependency consistency
- **Development Server**: Vite dev server with HMR and error overlay
- **Code Formatting**: TypeScript compiler with strict configuration
- **Asset Processing**: Vite asset pipeline with image optimization

### Third-Party Integrations
- **Carousel Components**: Embla Carousel for interactive content sliders
- **Date Handling**: date-fns for date manipulation and formatting
- **Development Environment**: Replit-specific plugins for development workflow
- **Font Loading**: Google Fonts API for web font delivery