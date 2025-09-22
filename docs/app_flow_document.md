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