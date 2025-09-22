import { AnnouncementDrafter } from '@/components/schedule/announcement-drafter';
import { SmartScheduleValidator } from '@/components/schedule/smart-schedule-validator';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';
import { redirect } from 'next/navigation';

export default async function AIAssistantPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();
  
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Leverage AI-powered tools to enhance your schedule management
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <AnnouncementDrafter />
        <SmartScheduleValidator />
      </div>
    </div>
  );
}