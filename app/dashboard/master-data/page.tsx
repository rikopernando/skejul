import { MasterDataManagement } from '@/components/schedule/master-data-management';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';
import { redirect } from 'next/navigation';

export default async function MasterDataPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();
  
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="p-6">
      <MasterDataManagement />
    </div>
  );
}