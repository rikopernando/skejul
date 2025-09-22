import { SwapRequestsList } from '@/components/schedule/swap-requests-list';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';
import { redirect } from 'next/navigation';

export default async function SwapRequestsPage() {
  // Check if user is admin or teacher
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Swap Requests</h1>
        <p className="text-muted-foreground">
          Manage schedule swap requests
        </p>
      </div>
      
      <SwapRequestsList />
    </div>
  );
}