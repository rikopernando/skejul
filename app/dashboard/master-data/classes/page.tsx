import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassesProvider } from '@/contexts/classes-context';
import { ClassForm } from '@/components/schedule/class-form';
import { ClassTable } from '@/components/schedule/class-table';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';

function ClassesPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
        <p className="text-muted-foreground">
          Manage class information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classes</CardTitle>
          <CardDescription>
            Add, edit, and manage class records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ClassForm />
            <ClassTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ClassesPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="p-6">
      <ClassesProvider>
        <ClassesPageContent />
      </ClassesProvider>
    </div>
  );
}
