
import { redirect } from 'next/navigation';

import { getCurrentUserProfile } from '@/app/actions/profile-actions';

export default async function MasterDataPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  // Redirect to teachers page by default
  redirect('/dashboard/master-data/teachers');
}