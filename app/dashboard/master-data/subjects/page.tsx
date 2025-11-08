import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectsProvider } from '@/contexts/subjects-context';
import { SubjectForm } from '@/components/schedule/subject-form';
import { SubjectTable } from '@/components/schedule/subject-table';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';

function SubjectsPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
        <p className="text-muted-foreground">
          Manage subject information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>
            Add, edit, and manage subject records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SubjectForm />
            <SubjectTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function SubjectsPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="p-6">
      <SubjectsProvider>
        <SubjectsPageContent />
      </SubjectsProvider>
    </div>
  );
}
