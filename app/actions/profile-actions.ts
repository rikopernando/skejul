'use server';

import { eq } from 'drizzle-orm';
import { headers } from "next/headers";

import { auth } from '@/lib/auth';
import { db } from '@/db';
import { profiles } from '@/db/schema';

// Get current user profile
export async function getCurrentUserProfile() {
  try {
    const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    // Try to find the profile
    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, session.user.id)
    });

    // If profile doesn't exist, create it
    if (!profile) {
      console.log('Profile not found, creating one for user:', session.user.id);
      
      // Create a new profile with default role
      const [newProfile] = await db.insert(profiles).values({
        id: session.user.id,
        fullName: session.user.name || 'New User',
        role: 'teacher' // Default role
      }).returning();
      
      profile = newProfile;
    }

    return profile;
  } catch (error) {
    // For development, we'll log the error but not throw it
    console.log('Auth check failed, but allowing access for development:', error);
    // In production, you would uncomment the next line:
    // throw new Error('Unauthorized');
    return null; // Allow access for development
  }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: typeof profiles.$inferSelect.role) {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  });

  // Check if current user is admin
  const currentProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session?.user?.id || '')
  });

  if (!currentProfile || currentProfile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can update user roles');
  }

  // Update the user's role
  await db.update(profiles)
    .set({ role })
    .where(eq(profiles.id, userId));

  return { success: true };
}

// Create teacher profile
export async function createTeacherProfile(profileData: { 
  profileId: string; 
  name: string; 
  employeeId?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  });

  // Check if current user is admin
  const currentProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session?.user?.id || '')
  });

  if (!currentProfile || currentProfile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can create teacher profiles');
  }

  // Create the teacher profile
  await db.insert(profiles)
    .values({
      id: profileData.profileId,
      fullName: profileData.name,
      role: 'teacher'
    });

  return { success: true };
}