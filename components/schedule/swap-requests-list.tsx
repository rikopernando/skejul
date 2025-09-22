'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSwapRequests, approveSwapRequest, rejectSwapRequest } from '@/app/actions/swap-actions';
import { useToast } from '@/components/ui/use-toast';

type SwapRequest = {
  id: string;
  originalSlotId: string;
  requesterId: string;
  requestedId: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  createdAt: Date;
  requester: {
    id: string;
    fullName: string | null;
  } | null;
};

export function SwapRequestsList() {
  const { toast } = useToast();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const loadSwapRequests = async () => {
    try {
      const data = await getSwapRequests();
      setSwapRequests(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load swap requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveSwapRequest(id);
      
      toast({
        title: 'Success',
        description: 'Swap request approved'
      });
      
      // Refresh the list
      loadSwapRequests();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve swap request',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectSwapRequest(id);
      
      toast({
        title: 'Success',
        description: 'Swap request rejected'
      });
      
      // Refresh the list
      loadSwapRequests();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject swap request',
        variant: 'destructive'
      });
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
      {swapRequests.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No pending swap requests.
        </p>
      ) : (
        swapRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Swap Request</CardTitle>
                  <CardDescription>
                    From {request.requester?.fullName || 'Unknown'} • {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.message && (
                  <div>
                    <h4 className="font-medium">Message:</h4>
                    <p className="whitespace-pre-wrap">{request.message}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => handleApprove(request.id)} variant="default">
                    Approve
                  </Button>
                  <Button onClick={() => handleReject(request.id)} variant="destructive">
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}