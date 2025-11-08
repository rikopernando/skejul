'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAnnouncements } from '@/app/actions/announcement-actions';
import { useToast } from '@/components/ui/use-toast';

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    fullName: string | null;
  } | null;
};

export function AnnouncementsList() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No announcements yet.
        </p>
      ) : (
        announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <CardDescription>
                    {announcement.author?.fullName || 'Unknown'} • {format(new Date(announcement.createdAt), 'MMM d, yyyy h:mm a')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{announcement.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}