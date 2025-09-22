import { CreateAnnouncementForm } from '@/components/schedule/create-announcement-form';
import { AnnouncementsList } from '@/components/schedule/announcements-list';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';
import { redirect } from 'next/navigation';

export default async function AnnouncementsPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();
  
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          Manage and view announcements
        </p>
      </div>
      
      <div className="grid gap-6">
        <CreateAnnouncementForm />
        <AnnouncementsList />
      </div>
    </div>
  );
}