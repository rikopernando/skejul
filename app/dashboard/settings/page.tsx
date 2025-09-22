import { GoogleCalendarSettings } from '@/components/schedule/google-calendar-settings';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  // Check if user is authenticated
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>
      
      <GoogleCalendarSettings />
    </div>
  );
}