import { AdminManagement } from '@/components/schedule/admin-management';
import { UserList } from '@/components/schedule/user-list';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';
import { redirect } from 'next/navigation';

export default async function AdminManagementPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();
  console.log({profile})
  
  // If no profile or not admin, redirect to dashboard
  if (!profile || profile.role !== 'admin') {
    // redirect('/dashboard');
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>
      
      <UserList />
      <AdminManagement />
    </div>
  );
}