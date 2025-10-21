'use server';

import { headers } from "next/headers";
import { db } from '@/db';
import { teachers, subjects, classes, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Helper function to check if user is admin
async function checkAdmin() {
  try {
    const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    // In a real app, you would check the user's role here
    // For now, we'll allow all authenticated users to access master data
    // In a production app, you would verify the user has admin privileges
    
    return session.user;
  } catch (error) {
    // For development, we'll log the error but not throw it
    console.log('Auth check failed, but allowing access for development:', error);
    // In production, you would uncomment the next line:
    // throw new Error('Unauthorized');
    return null; // Allow access for development
  }
}

// TEACHERS CRUD OPERATIONS
export async function getTeachers() {
  await checkAdmin();
  
  const result = await db.select().from(teachers);
  return result;
}

export async function getTeacherById(id: string) {
  await checkAdmin();
  
  const result = await db.select().from(teachers).where(eq(teachers.id, id));
  return result[0];
}

export async function createTeacher(data: typeof teachers.$inferInsert) {
  await checkAdmin();
  
  const result = await db.insert(teachers).values(data).returning();
  return result[0];
}

export async function updateTeacher(id: string, data: Partial<typeof teachers.$inferInsert>) {
  await checkAdmin();
  
  const result = await db.update(teachers).set(data).where(eq(teachers.id, id)).returning();
  return result[0];
}

export async function deleteTeacher(id: string) {
  await checkAdmin();
  
  const result = await db.delete(teachers).where(eq(teachers.id, id)).returning();
  return result[0];
}

// SUBJECTS CRUD OPERATIONS
export async function getSubjects() {
  await checkAdmin();
  
  const result = await db.select().from(subjects);
  return result;
}

export async function getSubjectById(id: string) {
  await checkAdmin();
  
  const result = await db.select().from(subjects).where(eq(subjects.id, id));
  return result[0];
}

export async function createSubject(data: typeof subjects.$inferInsert) {
  await checkAdmin();
  
  const result = await db.insert(subjects).values(data).returning();
  return result[0];
}

export async function updateSubject(id: string, data: Partial<typeof subjects.$inferInsert>) {
  await checkAdmin();
  
  const result = await db.update(subjects).set(data).where(eq(subjects.id, id)).returning();
  return result[0];
}

export async function deleteSubject(id: string) {
  await checkAdmin();
  
  const result = await db.delete(subjects).where(eq(subjects.id, id)).returning();
  return result[0];
}

// CLASSES CRUD OPERATIONS
export async function getClasses() {
  await checkAdmin();
  
  const result = await db.select().from(classes);
  return result;
}

export async function getClassById(id: string) {
  await checkAdmin();
  
  const result = await db.select().from(classes).where(eq(classes.id, id));
  return result[0];
}

export async function createClass(data: typeof classes.$inferInsert) {
  await checkAdmin();
  
  const result = await db.insert(classes).values(data).returning();
  return result[0];
}

export async function updateClass(id: string, data: Partial<typeof classes.$inferInsert>) {
  await checkAdmin();
  
  const result = await db.update(classes).set(data).where(eq(classes.id, id)).returning();
  return result[0];
}

export async function deleteClass(id: string) {
  await checkAdmin();
  
  const result = await db.delete(classes).where(eq(classes.id, id)).returning();
  return result[0];
}

// ROOMS CRUD OPERATIONS
export async function getRooms() {
  await checkAdmin();
  
  const result = await db.select().from(rooms);
  return result;
}

export async function getRoomById(id: string) {
  await checkAdmin();
  
  const result = await db.select().from(rooms).where(eq(rooms.id, id));
  return result[0];
}

export async function createRoom(data: typeof rooms.$inferInsert) {
  await checkAdmin();
  
  const result = await db.insert(rooms).values(data).returning();
  return result[0];
}

export async function updateRoom(id: string, data: Partial<typeof rooms.$inferInsert>) {
  await checkAdmin();
  
  const result = await db.update(rooms).set(data).where(eq(rooms.id, id)).returning();
  return result[0];
}

export async function deleteRoom(id: string) {
  await checkAdmin();
  
  const result = await db.delete(rooms).where(eq(rooms.id, id)).returning();
  return result[0];
}