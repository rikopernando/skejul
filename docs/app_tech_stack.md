
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