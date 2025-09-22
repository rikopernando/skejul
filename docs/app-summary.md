---

### **Technical Specifications: Intelligent Teaching Schedule Application**

- **Product Name (Tentative):** Skedul.ai / JadwalKita
- **Document Version:** 1.0
- **Status:** Draft
- **Author:** Gemini (AI Assistant)
- **Date:** September 22, 2025

---

### ## 1. System Architecture

This application will adopt a modern Jamstack architecture powered by a Backend-as-a-Service (BaaS) to maximize development speed, scalability, and cost efficiency.

- **Frontend (Client):**
    - **Framework:** Next.js 15 (App Router).
    - **Description:** Responsible for rendering the user interface (UI), routing, and user interactions. The majority of non-sensitive business logic will reside here. Server Components will be used for data fetching, while Client Components will handle interactivity.
- **Backend as a Service (BaaS):**
    - **Platform:** Supabase.
    - **Description:** Supabase will serve as the backend backbone, handling several critical tasks:
        - **Database:** PostgreSQL as the primary relational database.
        - **Authentication:** Manages user login, registration, and session management (JWT).
        - **Auto-generated API:** Provides an automatic RESTful API on top of the database, although we will primarily interact via the ORM.
        - **Edge Functions:** Serverless functions (Deno) for running custom backend logic, especially for integrations with third-party APIs (LLM).
        - **Realtime:** Utilizes WebSockets for instant collaborative features like notifications and announcements.
        - **Storage:** (If required) for storing files like exported schedules or profile pictures.
- **External Services (Third-Party Services):**
    - **AI/LLM API:** OpenAI (GPT-4o) or Google AI (Gemini) via REST API for the AI Assistant features.
    - **Google Calendar API:** For schedule synchronization, using the OAuth 2.0 protocol.

---

### ## 2. Database Design

- **DBMS:** PostgreSQL (provided by Supabase).
- **ORM:** Drizzle ORM. Database migrations will be managed using `drizzle-kit`.

### **2.1. Entity-Relationship Diagram (ERD) - Textual Description**

- `users` (from Supabase Auth) will have a **one-to-one** relationship with `profiles`.
- A `profile` will have a role (`roles`) and can have a **one-to-one** relationship with a `teacher` (if the user is a teacher).
- `teachers`, `subjects`, `classes`, and `rooms` are master data entities.
- `schedule_slots` is the core transaction table that connects all master entities, effectively creating **many-to-many** relationships through this table. Each row represents a single class session.
- `announcements` has a **many-to-one** relationship with `profiles` (one author can create many announcements).
- `swap_requests` is a transaction table linking `profiles` (the requester & the requested) and `schedule_slots` (the schedules being swapped).

### **2.2. Detailed Table Schema (Drizzle Schema Syntax)**

This is the detailed schema to be implemented.

TypeScript

`// file: src/db/schema.ts

import { pgTable, text, varchar, timestamp, uuid, primaryKey, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enums for roles and statuses
export const userRoleEnum = pgEnum('user_role', ['admin', 'teacher']);
export const requestStatusEnum = pgEnum('request_status', ['pending', 'approved', 'rejected']);

// Linked to Supabase's auth.users table
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // Referenced from auth.users.id
  fullName: varchar('full_name', { length: 256 }),
  role: userRoleEnum('role').default('teacher').notNull(),
});

// === Master Data ===
export const teachers = pgTable('teachers', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').references(() => profiles.id).unique(),
  // Other fields like employee ID, etc.
});

export const subjects = pgTable('subjects', /* ... */);
export const classes = pgTable('classes', /* ... */);
export const rooms = pgTable('rooms', /* ... */);

// === Core Transaction Table ===
export const scheduleSlots = pgTable('schedule_slots', {
  id: uuid('id').defaultRandom().primaryKey(),
  dayOfWeek: integer('day_of_week').notNull(), // 1=Monday, ..., 5=Friday
  startTime: text('start_time').notNull(),    // "HH:MM" format
  endTime: text('end_time').notNull(),      // "HH:MM" format
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),

  // Foreign Keys
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  classId: uuid('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  roomId: uuid('room_id').references(() => rooms.id, { onDelete: 'cascade' }).notNull(),
});

// === Collaboration Features ===
export const announcements = pgTable('announcements', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    authorId: uuid('author_id').references(() => profiles.id).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const swapRequests = pgTable('swap_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    originalSlotId: uuid('original_slot_id').references(() => scheduleSlots.id).notNull(),
    requesterId: uuid('requester_id').references(() => profiles.id).notNull(), // The teacher making the request
    requestedId: uuid('requested_id').references(() => profiles.id).notNull(), // The teacher being asked
    status: requestStatusEnum('status').default('pending').notNull(),
    adminApprovalId: uuid('admin_approval_id').references(() => profiles.id), // Filled when an admin approves/rejects
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});`

---

### ## 3. Backend & API Design

### **3.1. Design Patterns**

- **Server Actions:** All data mutation operations (Create, Update, Delete) will be executed via Next.js Server Actions. This maintains security by executing code on the server and prevents unnecessary exposure of API endpoints.
- **Server Components:** Used by default for fetching and displaying data (Read), reducing the amount of JavaScript sent to the client.

### **3.2. Supabase Edge Functions**

These functions will be created to handle logic that is not suitable for Server Actions or requires access to an isolated environment.

- **`ai-assistant`**
    - **Trigger:** HTTP POST Request from the frontend.
    - **Input:** `{ "query": "User's question", "context": "schedule_query|announcement_draft|schedule_validation" }`
    - **Process:**
        1. Validate the input.
        2. Create an appropriate prompt based on the `context`.
        3. Send a request to the LLM API.
        4. If the `context` is `schedule_query`, parse the LLM response into JSON, then query the database.
        5. Return the result as JSON.
    - **Output:** `{ "data": "Response from AI or database query result" }`

### **3.3. Authentication & Authorization**

- **Authentication:** Will use `@supabase/auth-helpers-nextjs` for session and user management. Login can be via email/password.
- **Authorization (Row Level Security - RLS):** RLS will be enabled on Supabase to ensure strict data isolation.
    - **RLS Policy Example 1 (for `profiles` table):**SQL
        
        # 
        
        `CREATE POLICY "Users can view their own profile."
        ON profiles FOR SELECT USING (auth.uid() = id);`
        
    - **RLS Policy Example 2 (for `schedule_slots` table):**SQL
        
        # 
        
        `CREATE POLICY "Teachers can only view their own schedules, Admins can view all."
        ON schedule_slots FOR SELECT USING (
          (get_my_claim('user_role')::text = 'admin') OR
          (teacher_id = (SELECT id FROM teachers WHERE profile_id = auth.uid()))
        );`
        
        *(Requires a helper function `get_my_claim` to retrieve the role from the JWT)*
        

---

### ## 4. Development & Deployment Workflow

- **Version Control:** Git, with a repository on GitHub. Will use a *feature branch* workflow.
- **Environments:**
    1. **Local (Development):** Use the Supabase CLI to run a local Supabase instance.
    2. **Staging:** A separate Supabase project for testing before releasing to production. The frontend will be deployed to Vercel (preview branches).
    3. **Production:** The main Supabase project. The frontend will be deployed to Vercel (main branch).
- **CI/CD:** Vercel will automatically deploy every push to a connected branch (preview for feature branches, production for the main branch).
- **Configuration Management:** All API keys, database URLs, and other secrets will be stored as Environment Variables in Vercel and in `.env.local` files for local development.

---

### ## 5. Feature Breakdown

This section breaks down the high-level features from the PRD into more granular technical components and tasks that need to be built.

### **5.1. Version 1.0: MVP Foundation**

- **Authentication Module**
    - UI components for Login, Registration, and Password Reset pages.
    - Implementation of Supabase Auth helpers for session management and protected routes.
    - Server Actions to handle user sign-up and sign-in logic.
- **Main Dashboard**
    - A primary calendar view component (e.g., using `fullcalendar-react`).
    - Server Components to fetch and display initial `schedule_slots`.
    - Client-side state management for interactive filters (by class, teacher, room).
- **Master Data Management (Admin)**
    - Four distinct modules for Teachers, Subjects, Classes, and Rooms.
    - Each module will include:
        - A data table to display existing records (`shadcn/ui DataTable`).
        - Modal forms for creating and editing records.
        - Server Actions for all CRUD (Create, Read, Update, Delete) operations.
- **Manual Schedule Creation (Admin)**
    - An interactive calendar where clicking an empty slot triggers a creation modal.
    - A form within the modal with dropdowns populated from master data.
    - Real-time conflict validation logic within the Server Action called upon submission. The action will query the database to check for teacher/room clashes before inserting a new record.
- **Export Functionality**
    - A server action that fetches the current filtered schedule data.
    - A library (e.g., `jspdf`, `xlsx`) to generate a file (PDF or Excel) on the server.
    - A client-side button to trigger the download.

### **5.2. Version 1.1: AI Assistant Features**

- **JadwalBot Chat Component**
    - A floating chat widget UI.
    - State management for the conversation history.
    - An API handler that sends user queries to the `ai-assistant` Edge Function.
- **Intelligent Announcement Drafter**
    - A dedicated UI section within the admin dashboard.
    - A textarea for brief input and a button that calls the `ai-assistant` function with the `announcement_draft` context.
- **Smart Schedule Validator**
    - A "Validate Schedule" button on the main schedule view.
    - A Server Action that sends the schedule data (for the current view) as JSON to the `ai-assistant` function with the `schedule_validation` context.
    - A UI component (e.g., a toast or modal) to display the AI-generated feedback.

### **5.3. Version 1.2: Collaboration Features**

- **Google Calendar Synchronization**
    - A settings page for users to initiate the OAuth 2.0 flow with Google.
    - Server-side logic to securely store and refresh OAuth tokens.
    - Server Actions to create, update, or delete events in the user's Google Calendar when a `schedule_slot` is modified.
- **Announcement Module**
    - A form for Admins to create and post announcements.
    - A real-time component on the main dashboard that subscribes to the `announcements` table via Supabase Realtime to display new posts instantly.
- **Schedule Swap System**
    - A "Request Swap" button on the schedule slot details view.
    - A modal form to select another teacher and submit the request, which creates a record in the `swap_requests` table.
    - A dedicated section in the Admin dashboard to view and act upon pending requests.
    - A real-time notification system (e.g., a bell icon with a badge) for all involved parties, powered by Supabase Realtime.

---

### ## 6. Core User Flows

This section details the step-by-step user journey for critical actions within the application.

### **6.1. User Flow: Admin Creates a Schedule Slot**

1. **Login:** The Admin authenticates and is redirected to the main dashboard.
2. **Navigate:** The Admin navigates to the `/dashboard/schedule` page.
3. **Filter:** They select a target class (e.g., "Class 10-A") from the filter dropdowns to view its specific schedule.
4. **Initiate Creation:** The Admin clicks on an empty time slot in the calendar.
5. **Form Interaction:** A modal form appears. The Admin selects a Teacher, Subject, and Room from pre-populated dropdowns.
6. **Submit:** The Admin clicks the "Save" button.
7. **Backend Process:**
    - A Server Action is invoked with the form data.
    - The action performs a final validation check against the database to ensure the selected teacher and room are available at that specific time.
    - If there are no conflicts, a new record is inserted into the `schedule_slots` table.
    - If a conflict exists, an error message is returned to the client without creating a record.
8. **UI Feedback:** The frontend UI is automatically updated (the path is revalidated) to display the newly created schedule slot on the calendar, and a success notification is shown.

### **6.2. User Flow: Teacher Requests a Schedule Swap**

1. **Login:** The Teacher authenticates and sees their personal schedule on the dashboard.
2. **Select Slot:** They click on a specific class session they wish to swap.
3. **Initiate Swap:** In the details view for that slot, they click the "Request Swap" button.
4. **Form Interaction:** A modal form appears. They select a colleague to swap with from a dropdown list of available teachers. They can add an optional message.
5. **Submit:** The Teacher clicks "Submit Request".
6. **Backend Process:**
    - A Server Action is invoked, creating a new record in the `swap_requests` table with a `status` of 'pending'.
7. **Real-time Notification:**
    - Using Supabase Realtime, a notification is instantly pushed to the requested colleague and all users with the 'admin' role.
8. **Admin Action:**
    - An Admin sees the pending request on their dashboard.
    - They review the details and click either "Approve" or "Reject".
9. **Finalization:**
    - Clicking "Approve" triggers a Server Action that updates the `teacher_id` on the original `schedule_slot` record and changes the `swap_requests` status to 'approved'.
    - Real-time notifications are sent to the involved teachers confirming the outcome.