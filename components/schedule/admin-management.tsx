'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { updateUserRole } from '@/app/actions/profile-actions';

export function AdminManagement() {
  const { toast } = useToast();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher'>('teacher');
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!userId) {
      toast.error('Please enter a user ID');
      return;
    }

    setLoading(true);
    try {
      await updateUserRole(userId, role);

      toast.success(`User role updated to ${role}`);

      // Reset form
      setUserId('');
      setRole('teacher');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>
          Manage user roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-id">User ID</Label>
            <Input
              id="user-id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: 'admin' | 'teacher') => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleUpdateRole} disabled={loading}>
            {loading ? 'Updating...' : 'Update Role'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}