# Byteclave Resources

## Overview

Byteclave Resources is a digital resource platform that allows users to discover, browse, and download free high-quality digital tools and resources. The platform features a product catalog with search and filtering capabilities, individual product detail pages, and integrates with Firebase Firestore as the backend database for product data.

The project has a dual architecture: a static HTML/CSS/JavaScript frontend for the public-facing resource catalog, and a React-based client application with an Express backend for additional functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static Site (Primary Public Interface)**
- Pure HTML/CSS/JavaScript implementation located in root directory
- `index.html` - Main landing page with hero section, search, and product grid
- `product.html` - Individual product detail page
- `css/style.css` - Custom styling with CSS variables for theming (green/dark color scheme)
- `js/main.js` - Product listing, search, and filtering logic
- `js/product.js` - Individual product detail rendering
- `js/firebase.js` - Firebase SDK initialization and Firestore connection

**React Application (Secondary/Admin Interface)**
- Located in `client/src/` directory
- Built with Vite as the build tool
- Uses shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom theme configuration
- React Query (@tanstack/react-query) for server state management
- React Hook Form with Zod validation for forms

### Backend Architecture

**Express Server**
- Minimal Express 5.x server in `server/index.ts`
- Currently serves static files from root directory
- HTTP server setup ready for WebSocket integration if needed

**Database Layer**
- Drizzle ORM configured for PostgreSQL (`drizzle.config.ts`)
- Schema definitions in `shared/schema.ts`
- Migrations output to `./migrations` directory
- Uses `DATABASE_URL` environment variable for connection

**Firebase Integration**
- Firebase Firestore used as the primary data store for products
- Direct client-side queries from JavaScript modules
- Project: `byteclave-5dd35`

### Build System

- Vite for React client bundling (outputs to `dist/public`)
- esbuild for server bundling with dependency optimization
- Custom build script in `script/build.ts` that handles both client and server builds
- TypeScript throughout with path aliases (`@/` for client, `@shared/` for shared code)

### Data Flow

1. Static pages fetch product data directly from Firebase Firestore
2. Products are filtered/searched client-side after initial fetch
3. Product details retrieved by document ID from URL query parameters

## External Dependencies

### Firebase Services
- **Firebase Firestore** - Primary database for product catalog
- Project ID: `byteclave-5dd35`
- Products collection stores: title, description, category, imageUrl, downloadUrl, active status

### Database
- **PostgreSQL** - Secondary database via Drizzle ORM (requires `DATABASE_URL` environment variable)
- Used for additional application data beyond product catalog

### CDN Resources
- Google Fonts (Outfit, DM Sans)
- Font Awesome icons (v6.4.0)
- Firebase SDK loaded from gstatic.com

### Key NPM Dependencies
- `express` - Web server framework
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation
- `@tanstack/react-query` - React data fetching
- `react-hook-form` / `@hookform/resolvers` - Form handling
- Radix UI primitives - Accessible UI components
- `tailwindcss` - Utility-first CSS framework