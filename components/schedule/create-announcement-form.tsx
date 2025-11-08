'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAnnouncement } from '@/app/actions/announcement-actions';
import { useToast } from '@/components/ui/use-toast';

export function CreateAnnouncementForm() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createAnnouncement({ title, content });

      toast.success('Announcement created successfully');

      // Reset form
      setTitle('');
      setContent('');
    } catch (error) {
      toast.error('Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Announcement</CardTitle>
        <CardDescription>
          Share important updates with all users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter announcement content"
              className="min-h-[120px]"
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Announcement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}