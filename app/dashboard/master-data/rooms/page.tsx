import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RoomsProvider } from '@/contexts/rooms-context';
import { RoomForm } from '@/components/schedule/room-form';
import { RoomTable } from '@/components/schedule/room-table';
import { getCurrentUserProfile } from '@/app/actions/profile-actions';

function RoomsPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Rooms</h2>
        <p className="text-muted-foreground">
          Manage room information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
          <CardDescription>
            Add, edit, and manage room records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RoomForm />
            <RoomTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function RoomsPage() {
  // Check if user is admin
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="p-6">
      <RoomsProvider>
        <RoomsPageContent />
      </RoomsProvider>
    </div>
  );
}
