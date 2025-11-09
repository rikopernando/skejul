# Database Seeding Scripts

## Schedule Seeder

The schedule seeder (`seed-schedule.ts`) creates sample **schedule slots** using your existing master data (teachers, subjects, classes, rooms).

**Important**: This seeder only creates schedule slots. You must have existing teachers, subjects, classes, and rooms in your database first. Use the master data pages to create these, or run `npm run db:seed` for sample master data.

### Prerequisites

Make sure you have the following master data in your database:
- Teachers
- Subjects
- Classes
- Rooms

You can create these through the UI at:
- `/dashboard/master-data/teachers`
- `/dashboard/master-data/subjects`
- `/dashboard/master-data/classes`
- `/dashboard/master-data/rooms`

Or run the main seeder: `npm run db:seed`

### Usage

```bash
npm run db:seed-schedule
```

### What Gets Created

The seeder creates a realistic school schedule:

**Grade 10A Weekly Schedule:**
- **Monday**: Math (8:00-9:30), English (9:45-11:15), Physics (11:30-13:00), PE (13:15-14:45)
- **Tuesday**: Chemistry (8:00-9:30), Biology (9:45-11:15), History (11:30-13:00), Math (13:15-14:45)
- **Wednesday**: English (8:00-9:30), Geography (9:45-11:15), Physics (11:30-13:00), Chemistry (13:15-14:45)
- **Thursday**: Math (8:00-9:30), Biology (9:45-11:15), English (11:30-13:00), History (13:15-14:45)
- **Friday**: Physics (8:00-9:30), Math (9:45-11:15), Geography (11:30-13:00), PE (13:15-14:45)

**Grade 10B Partial Schedule:**
- **Monday**: English (8:00-9:30), Math (9:45-11:15), Biology (11:30-13:00)
- **Tuesday**: Physics (8:00-9:30), History (9:45-11:15), Chemistry (11:30-13:00)

### Important Notes

- **One-time use**: The seeder will skip if schedule slots already exist to avoid duplicates
- **Re-seeding**: To re-seed schedules, delete existing schedule slots first (via the UI or database)
- **Master data required**: You must have teachers, subjects, classes, and rooms before running this seeder
- **Prerequisites**: Make sure your database is running and migrations are applied

### How It Works

The seeder will:
1. Check if schedule slots already exist (skips if they do)
2. Fetch all existing teachers, subjects, classes, and rooms from the database
3. Validate that you have master data (exits if any are missing)
4. Create schedule slots using the first available records from your master data
5. Generate a weekly schedule pattern that demonstrates proper scheduling

**Note**: The seeder uses array indices to assign schedules, so it will use:
- First 8 teachers (or however many you have)
- First 8 subjects (or however many you have)
- First 2 classes (or however many you have)
- First 8 rooms (or however many you have)

### Extending the Seeder

You can easily modify `scripts/seed-schedule.ts` to:
- Add more classes and their schedules
- Create schedules for different days/times
- Add more teachers, subjects, or rooms
- Customize the academic year or grade levels

### Troubleshooting

**Error: "Data already exists"**
- The database already has schedule data
- Run `npm run db:reset` to clear it, then seed again

**Error: "Cannot connect to database"**
- Make sure your database is running: `npm run db:up`
- Check your `.env` file has correct database credentials

**Error: "Module not found"**
- Run `npm install` to ensure all dependencies are installed
