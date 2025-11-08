# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Skejul is a comprehensive schedule management application for educational institutions, built with Next.js 15, Better Auth, PostgreSQL, and Drizzle ORM. The application provides master data management, schedule creation/editing, AI assistance, and collaboration features.

## Development Commands

### Development Server
```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production with Turbopack
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database Management
```bash
# Drizzle ORM Commands
npm run db:generate      # Generate migrations from schema
npm run db:push          # Push schema changes to database
npm run db:pull          # Pull schema from database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Docker Database Commands
npm run db:up            # Start production PostgreSQL (port 5432)
npm run db:down          # Stop production PostgreSQL
npm run db:dev           # Start development PostgreSQL (port 5433)
npm run db:dev-down      # Stop development PostgreSQL

# Database Setup & Seeding
npm run db:setup         # Initialize database schema
npm run db:seed          # Seed with sample data (excludes users)
npm run db:reset         # Drop all tables and recreate schema
npm run db:reset-data    # Reset all data (keep schema)

# User Management
npm run db:list-users              # List all users with IDs
npm run db:check                   # Check current users
npm run db:make-admin              # Make admin@example.com an admin
npm run db:make-admin-with-id <id> # Make specific user an admin
```

### Docker Commands
```bash
npm run docker:build     # Build Docker image
npm run docker:up        # Start all services
npm run docker:down      # Stop all services
npm run docker:logs      # Follow logs
```

## Architecture Overview

### Authentication & Authorization
- **Better Auth** handles authentication with email/password
- Auth route handler: `app/api/auth/[...all]/route.ts`
- Server-side auth: `lib/auth.ts` (betterAuth instance)
- Client-side auth: `lib/auth-client.ts` (createAuthClient)
- Custom plugin in `lib/auth.ts` automatically creates profiles with default "teacher" role on sign-up
- Role-based access control uses `profiles` table with `user_role` enum: 'admin' | 'teacher'
- Protected routes check session and role via `auth.api.getSession()` in server components/actions

### Database Schema (`db/schema/`)
- **auth.ts**: Better Auth tables (user, account, session, verification)
- **schedule.ts**: Main application tables
  - `profiles`: Extends auth users with fullName and role
  - Master data: `teachers`, `subjects`, `classes`, `rooms`
  - `schedule_slots`: Core transaction table with foreign keys to master data
  - Collaboration: `announcements`, `swap_requests`

### Server Actions Pattern (`app/actions/`)
All data mutations use Next.js Server Actions:
- `master-data-actions.ts`: CRUD for teachers, subjects, classes, rooms
- `schedule-actions.ts`: Schedule slot operations with conflict validation
- `ai-actions.ts`: AI assistant interactions (mock)
- `announcement-actions.ts`: Announcement management
- `swap-actions.ts`: Schedule swap request handling
- `export-actions.ts`: Excel/CSV export generation
- `google-calendar-actions.ts`: Google Calendar sync (stub)
- `profile-actions.ts`: User profile and role management

### State Management
- **Server Components**: Primary data fetching pattern
- **React Context**: Used for master data state in `contexts/master-data-context.tsx`
  - Provides centralized state for teachers, subjects, classes, rooms
  - Manages loading states and data mutations
  - Used across master data management pages
- **Custom Hooks** (`hooks/`):
  - `use-teacher-data.ts`, `use-subject-data.ts`, `use-class-data.ts`, `use-room-data.ts`: Fetch master data
  - `use-mobile.ts`: Responsive design helper

### Component Organization
- **app/**: Next.js App Router pages
  - `dashboard/`: Main app pages (schedule, master-data, ai-assistant, announcements, swap-requests, settings)
  - `sign-in/`, `sign-up/`: Authentication pages
- **components/schedule/**: All schedule-related components
  - Calendar views, modals, forms, tables
  - AI assistant components (JadwalBot, validator, announcement drafter)
  - Admin management, swap requests, Google Calendar settings
- **components/ui/**: shadcn/ui components (auto-generated, don't manually edit)

### Path Aliases
TypeScript paths configured in `tsconfig.json`:
- `@/*` maps to root directory
- Example: `import { db } from "@/db"`

## Key Implementation Details

### Schedule Slot Creation
- Modal-based creation from calendar clicks (`create-schedule-slot-modal.tsx`)
- Server-side conflict validation in `schedule-actions.ts`
- Validates teacher/room/class conflicts for same day/time
- Foreign key constraints ensure referential integrity

### Master Data Management
- Tab-based UI in `app/dashboard/master-data/page.tsx`
- React Context provides centralized state management
- CRUD operations via server actions
- Form validation using react-hook-form + zod
- Tables use custom components (not TanStack Table)

### Better Auth Integration
- Plugin system used for automatic profile creation
- Session management handled automatically
- Email/password authentication enabled
- Sessions checked in layout.tsx for protected routes

### AI Features (Mock Implementation)
- JadwalBot: Chat assistant for schedule queries
- Announcement Drafter: AI-assisted announcement creation
- Schedule Validator: AI-powered schedule conflict detection
- All AI features use mock responses (can be extended with real AI APIs)

### Export Functionality
- Uses `xlsx` library for Excel generation
- Exports filtered schedule data based on current view
- Triggered via `export-schedule-button.tsx`

## Database Setup Flow

1. Start PostgreSQL: `npm run db:dev` (dev) or `npm run db:up` (prod)
2. Copy `.env.example` to `.env` and configure DATABASE_URL
3. Initialize schema: `npm run db:setup`
4. Seed data: `npm run db:seed`
5. Create users via UI at http://localhost:3000/sign-up
6. Grant admin role: `npm run db:list-users` then `npm run db:make-admin-with-id <id>`

**Important**: Users cannot be seeded programmatically due to Better Auth's password hashing. Always create users through the sign-up UI.

## Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret key for session encryption
- `BETTER_AUTH_URL`: Application base URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Public-facing auth URL

## Testing

Currently no test suite is configured. The codebase uses TypeScript for type safety and ESLint for code quality.

## Docker Deployment

The project includes Docker support:
- `Dockerfile`: Multi-stage build for Next.js standalone output
- `docker-compose.yaml`: Orchestrates app and PostgreSQL
- Production service on port 3000, dev database on port 5433

## Task Management Workflow

### Task Discovery and Execution
This project includes a custom task management system:
1. List tasks: `task-manager list-tasks`
2. Start task: `task-manager start-task <task_id>`
3. Complete task: `task-manager complete-task <task_id> "completion message"`
4. Cancel task: `task-manager cancel-task <task_id> "reason"`

**Critical Rules**:
- Always run `task-manager start-task` before working on a task
- Always run `task-manager complete-task` or `task-manager cancel-task` when done
- Work on one task at a time
- Provide meaningful completion/cancellation messages

## Common Patterns

### Creating a New Server Action
1. Add function to appropriate file in `app/actions/`
2. Use `"use server"` directive at top of file
3. Validate session with `await auth.api.getSession({ headers: await headers() })`
4. Perform database operations using Drizzle ORM
5. Return serializable data (no Date objects, functions, etc.)

### Adding a New Master Data Entity
1. Define schema in `db/schema/schedule.ts`
2. Generate migration: `npm run db:generate`
3. Push to database: `npm run db:push`
4. Create server actions in `app/actions/master-data-actions.ts`
5. Add form component in `components/schedule/`
6. Add table component in `components/schedule/`
7. Update master data context if needed

### Protected Route Implementation
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  // Check role if needed: session.user.role
}
```

## Important Notes

- **Turbopack** is enabled for dev and build (faster compilation)
- **React 19** and **Next.js 15** are used (cutting edge, check compatibility)
- **Drizzle Studio** provides GUI for database inspection
- **Better Auth** differs from NextAuth - check docs for migration patterns
- The project uses **standalone output** for optimized Docker builds
- Google Calendar integration is stubbed - requires OAuth setup for production
