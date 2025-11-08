'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createSwapRequest } from '@/app/actions/swap-actions';
import { useToast } from '@/components/ui/use-toast';
import { useTeacherData } from '@/hooks/use-teacher-data';

interface RequestSwapModalProps {
  slotId: string;
  onSwapRequested: () => void;
}

export function RequestSwapModal({ slotId, onSwapRequested }: RequestSwapModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [requestedId, setRequestedId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { teachers } = useTeacherData();

  const handleSubmit = async () => {
    if (!requestedId) {
      toast.error('Please select a teacher to swap with');
      return;
    }

    setLoading(true);
    try {
      await createSwapRequest({
        originalSlotId: slotId,
        requestedId,
        message
      });

      toast.success('Swap request sent successfully');

      // Reset form and close modal
      setRequestedId('');
      setMessage('');
      setIsOpen(false);
      onSwapRequested();
    } catch (error) {
      toast.error('Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Request Swap</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Schedule Swap</DialogTitle>
          <DialogDescription>
            Request to swap this schedule slot with another teacher
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Swap With
            </Label>
            <Select value={requestedId} onValueChange={setRequestedId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add an optional message..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}