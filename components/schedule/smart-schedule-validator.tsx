'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiAssistant } from '@/app/actions/ai-actions';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

export function SmartScheduleValidator() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidateSchedule = async () => {
    setLoading(true);
    setFeedback('');
    
    try {
      // In a real implementation, you would send the actual schedule data
      // For now, we'll send a mock request
      const response = await aiAssistant('Validate current schedule', 'schedule_validation');
      setFeedback(response.data);

      toast.success('Schedule validation completed');
    } catch (error) {
      toast.error('Failed to validate schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Schedule Validator</CardTitle>
        <CardDescription>
          AI-powered analysis to identify potential conflicts and optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleValidateSchedule} 
          disabled={loading}
        >
          {loading ? 'Validating...' : 'Validate Schedule'}
        </Button>
        
        {feedback && (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>AI Recommendations</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {feedback}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}