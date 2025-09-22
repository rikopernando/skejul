'use server';

import { db } from '@/db';
import { swapRequests, scheduleSlots, profiles } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

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

// Get swap requests for the current user
export async function getSwapRequests() {
  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
    }
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Fetch swap requests where the current user is involved
  const result = await db.select({
    id: swapRequests.id,
    originalSlotId: swapRequests.originalSlotId,
    requesterId: swapRequests.requesterId,
    requestedId: swapRequests.requestedId,
    status: swapRequests.status,
    message: swapRequests.message,
    createdAt: swapRequests.createdAt,
    requester: {
      id: profiles.id,
      fullName: profiles.fullName
    }
  })
  .from(swapRequests)
  .leftJoin(profiles, eq(swapRequests.requesterId, profiles.id))
  .where(
    and(
      eq(swapRequests.requestedId, session.user.id),
      eq(swapRequests.status, 'pending')
    )
  );

  return result;
}

// Create a new swap request
export async function createSwapRequest(data: { 
  originalSlotId: string; 
  requestedId: string; 
  message?: string 
}) {
  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
    }
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Create the swap request
  const result = await db.insert(swapRequests).values({
    originalSlotId: data.originalSlotId,
    requesterId: session.user.id,
    requestedId: data.requestedId,
    message: data.message
  }).returning();

  return result[0];
}

// Approve a swap request
export async function approveSwapRequest(id: string) {
  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
    }
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin or the requested teacher
  const swapRequest = await db.query.swapRequests.findFirst({
    where: eq(swapRequests.id, id)
  });

  if (!swapRequest) {
    throw new Error('Swap request not found');
  }

  if (swapRequest.requestedId !== session.user.id && 
      (await getUserRole(session.user.id)) !== 'admin') {
    throw new Error('Unauthorized: Only the requested teacher or admin can approve this request');
  }

  // Update the swap request status
  const result = await db.update(swapRequests).set({
    status: 'approved',
    adminApprovalId: session.user.id
  }).where(eq(swapRequests.id, id)).returning();

  // Update the schedule slot to swap teachers
  await db.update(scheduleSlots).set({
    teacherId: swapRequest.requesterId
  }).where(eq(scheduleSlots.id, swapRequest.originalSlotId));

  return result[0];
}

// Reject a swap request
export async function rejectSwapRequest(id: string) {
  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${(await auth.api.getSession({ headers: {} }))?.session?.token || ''}`
    }
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin or the requested teacher
  const swapRequest = await db.query.swapRequests.findFirst({
    where: eq(swapRequests.id, id)
  });

  if (!swapRequest) {
    throw new Error('Swap request not found');
  }

  if (swapRequest.requestedId !== session.user.id && 
      (await getUserRole(session.user.id)) !== 'admin') {
    throw new Error('Unauthorized: Only the requested teacher or admin can reject this request');
  }

  // Update the swap request status
  const result = await db.update(swapRequests).set({
    status: 'rejected',
    adminApprovalId: session.user.id
  }).where(eq(swapRequests.id, id)).returning();

  return result[0];
}

// Helper function to get user role
async function getUserRole(userId: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId)
  });
  
  return profile?.role || 'teacher';
}