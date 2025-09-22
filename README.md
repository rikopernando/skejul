# Schedule Management Application

## Overview
This is a comprehensive schedule management application built with Next.js 15, Better Auth, and PostgreSQL.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   # Make sure your PostgreSQL database is running
   # Update .env with your database connection details
   npm run db:setup
   ```

3. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Create users manually:**
   - Open your browser and go to http://localhost:3000/sign-up
   - Create an admin user with:
     - Email: admin@example.com
     - Password: admin123
     - Name: Admin User
   - Create teacher users as needed

6. **Make the admin user an administrator:**
   - Option 1 (Command line): 
     ```bash
     npm run db:list-users  # Find the user ID for admin@example.com
     npm run db:make-admin-with-id <user-id>
     ```
   - Option 2 (Through the app): 
     - Log in as the admin user
     - Go to the Admin Management page in the dashboard
     - Update your own role to admin

## Features

### Authentication
- User registration and login
- Role-based access control (admin/teacher)

### Master Data Management
- Teachers management
- Subjects management
- Classes management
- Rooms management

### Schedule Management
- Weekly calendar view
- Schedule creation and editing
- Export to Excel/CSV

### AI Assistant
- JadwalBot chat assistant
- Announcement drafter
- Schedule validator

### Collaboration
- Announcements system
- Schedule swap requests
- Google Calendar integration (stub)

## User Credentials

After creating users manually, you can use these credentials:

### Admin User
- Email: admin@example.com
- Password: admin123

### Teacher Users
Create teacher accounts as needed through the sign-up page.

## Development

### Database Scripts
- `npm run db:setup` - Set up database schema
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset-data` - Reset database tables
- `npm run db:make-admin` - Give admin privileges to admin user
- `npm run db:make-admin-with-id <user-id>` - Give admin privileges to specific user
- `npm run db:list-users` - List all users and their IDs
- `npm run db:check` - Check current users in database

### Running the Application
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Admin Management

To manage user roles:
1. Log in as an admin user
2. Navigate to the Admin section in the sidebar
3. Use the User Management page to update user roles

## Technology Stack
- **Frontend:** Next.js 15 (App Router)
- **Backend:** Better Auth for authentication
- **Database:** PostgreSQL with Drizzle ORM
- **UI:** shadcn/ui components with Tailwind CSS
- **Authentication:** Better Auth
- **State Management:** React Server Components and Client Components