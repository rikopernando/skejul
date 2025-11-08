import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeachersProvider } from '@/contexts/teachers-context';
import { TeacherForm } from '@/components/schedule/teacher-form';
import { TeacherTable } from '@/components/schedule/teacher-table';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';

function TeachersPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Teachers</h2>
        <p className="text-muted-foreground">
          Manage teacher information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teachers</CardTitle>
          <CardDescription>
            Add, edit, and manage teacher records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TeacherForm />
            <TeacherTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function TeachersPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="p-6">
      <TeachersProvider>
        <TeachersPageContent />
      </TeachersProvider>
    </div>
  );
}
