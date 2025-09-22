'use server';

import { db } from '@/db';
import { scheduleSlots, teachers, subjects, classes, rooms } from '@/db/schema';
import { auth } from '@/lib/auth';
import { and, eq, gte, lte } from 'drizzle-orm';
import { addDays, startOfWeek, endOfWeek } from 'date-fns';

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

// Mock AI assistant function - in a real implementation, this would call an AI API
async function callAIAssistant(query: string, context: string) {
  // This is a mock implementation
  // In a real app, you would call an AI API like OpenAI or Google AI
  switch (context) {
    case 'schedule_query':
      return {
        data: `I found the schedule information you requested. Here are the details for your query: "${query}"`
      };
    case 'announcement_draft':
      return {
        data: `Here's a draft announcement based on your input: "${query}"
        
Subject: Important Schedule Update

Dear Students and Faculty,

We would like to inform you about [specific details based on the query].

Please make note of these changes and adjust your schedules accordingly.

Best regards,
Administration Team`
      };
    case 'schedule_validation':
      return {
        data: `I've analyzed the schedule and found the following suggestions for improvement:
        
1. Potential conflict between [Teacher Name] and [Room Name] on [Day] at [Time]
2. Suggestion to optimize [Class Name] schedule for better resource allocation
3. Recommendation to add buffer time between consecutive classes`
      };
    default:
      return {
        data: `I understand your query: "${query}". How can I assist you further?`
      };
  }
}

// AI assistant function
export async function aiAssistant(query: string, context: string) {
  await checkAuth();

  // Call the AI assistant
  const result = await callAIAssistant(query, context);
  return result;
}