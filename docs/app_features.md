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