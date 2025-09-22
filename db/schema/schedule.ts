import { pgTable, text, varchar, timestamp, uuid, primaryKey, integer, pgEnum as drizzlePgEnum } from 'drizzle-orm/pg-core';
import { user } from './auth';

// Enums for roles and statuses
export const userRoleEnum = drizzlePgEnum('user_role', ['admin', 'teacher']);
export const requestStatusEnum = drizzlePgEnum('request_status', ['pending', 'approved', 'rejected']);

// Profiles table - extends the auth user
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().references(() => user.id),
  fullName: varchar('full_name', { length: 256 }),
  role: userRoleEnum('role').default('teacher').notNull(),
});

// === Master Data ===
export const teachers = pgTable('teachers', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: text('profile_id').references(() => profiles.id).unique(),
  name: varchar('name', { length: 256 }).notNull(),
  employeeId: varchar('employee_id', { length: 50 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  code: varchar('code', { length: 50 }).unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  grade: integer('grade'),
  academicYear: varchar('academic_year', { length: 9 }), // e.g., "2024/2025"
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rooms = pgTable('rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  capacity: integer('capacity'),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// === Core Transaction Table ===
export const scheduleSlots = pgTable('schedule_slots', {
  id: uuid('id').defaultRandom().primaryKey(),
  dayOfWeek: integer('day_of_week').notNull(), // 1=Monday, ..., 7=Sunday
  startTime: text('start_time').notNull(),    // "HH:MM" format
  endTime: text('end_time').notNull(),      // "HH:MM" format
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Foreign Keys
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  classId: uuid('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  roomId: uuid('room_id').references(() => rooms.id, { onDelete: 'cascade' }).notNull(),
});

// === Collaboration Features ===
export const announcements = pgTable('announcements', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
    content: text('content').notNull(),
    authorId: text('author_id').references(() => profiles.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const swapRequests = pgTable('swap_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    originalSlotId: uuid('original_slot_id').references(() => scheduleSlots.id).notNull(),
    requesterId: text('requester_id').references(() => profiles.id).notNull(), // The teacher making the request
    requestedId: text('requested_id').references(() => profiles.id).notNull(), // The teacher being asked
    status: requestStatusEnum('status').default('pending').notNull(),
    adminApprovalId: text('admin_approval_id').references(() => profiles.id), // Filled when an admin approves/rejects
    message: text('message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});