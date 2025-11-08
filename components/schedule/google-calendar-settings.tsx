'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initiateGoogleOAuth } from '@/app/actions/google-calendar-actions';
import { useToast } from '@/components/ui/use-toast';

export function GoogleCalendarSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const result = await initiateGoogleOAuth();

      // In a real implementation, you would redirect the user to the authorization URL
      // window.location.href = result.authorizationUrl;

      toast.success('Google Calendar connection initiated. In a real app, you would be redirected to Google for authorization.');
    } catch (error) {
      toast.error('Failed to initiate Google Calendar connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar Sync</CardTitle>
        <CardDescription>
          Connect your Google Calendar to sync schedule events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Sync with Google Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Automatically sync your schedule with Google Calendar
            </p>
          </div>
          <Button onClick={handleConnect} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}