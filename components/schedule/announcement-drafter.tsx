'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiAssistant } from '@/app/actions/ai-actions';
import { useToast } from '@/components/ui/use-toast';

export function AnnouncementDrafter() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateDraft = async () => {
    if (!input.trim()) {
      toast.error('Please enter a brief description for the announcement');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAssistant(input, 'announcement_draft');
      setDraft(response.data);

      toast.success('Announcement draft generated successfully');
    } catch (error) {
      toast.error('Failed to generate announcement draft');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    toast.success('Announcement draft copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligent Announcement Drafter</CardTitle>
        <CardDescription>
          Generate professional announcement drafts with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="announcement-input" className="text-sm font-medium">
            Brief Description
          </label>
          <Textarea
            id="announcement-input"
            placeholder="Enter a brief description of what you want to announce..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <Button 
          onClick={handleGenerateDraft} 
          disabled={loading || !input.trim()}
        >
          {loading ? 'Generating...' : 'Generate Draft'}
        </Button>
        
        {draft && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Draft</label>
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </Button>
            </div>
            <Textarea
              value={draft}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}