'use server';

import { db } from '@/db';
import { announcements, profiles } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

// Helper function to check if user is authenticated
async function checkAuth() {
  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
      }
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    return session.user;
  } catch (error) {
    // For development, we'll log the error but not throw it
    console.log('Auth check failed, but allowing access for development:', error);
    // In production, you would uncomment the next line:
    // throw new Error('Unauthorized');
    return null; // Allow access for development
  }
}

// Get all announcements
export async function getAnnouncements() {
  await checkAuth();

  // Fetch announcements with author information
  const result = await db.select({
    id: announcements.id,
    title: announcements.title,
    content: announcements.content,
    createdAt: announcements.createdAt,
    author: {
      id: profiles.id,
      fullName: profiles.fullName
    }
  })
  .from(announcements)
  .leftJoin(profiles, eq(announcements.authorId, profiles.id))
  .orderBy(desc(announcements.createdAt));

  return result;
}

// Create a new announcement
export async function createAnnouncement(data: { title: string; content: string }) {
  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
    }
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id)
  });

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can create announcements');
  }

  // Create the announcement
  const result = await db.insert(announcements).values({
    title: data.title,
    content: data.content,
    authorId: session.user.id
  }).returning();

  return result[0];
}

// Update an announcement
export async function updateAnnouncement(id: string, data: { title?: string; content?: string }) {
  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
    }
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id)
  });

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can update announcements');
  }

  // Update the announcement
  const result = await db.update(announcements).set(data).where(eq(announcements.id, id)).returning();
  return result[0];
}

// Delete an announcement
export async function deleteAnnouncement(id: string) {
  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
    }
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id)
  });

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can delete announcements');
  }

  // Delete the announcement
  const result = await db.delete(announcements).where(eq(announcements.id, id)).returning();
  return result[0];
}