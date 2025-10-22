'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeacherForm } from '@/components/schedule/teacher-form';
import { SubjectForm } from '@/components/schedule/subject-form';
import { ClassForm } from '@/components/schedule/class-form';
import { RoomForm } from '@/components/schedule/room-form';
import { TeacherTable } from '@/components/schedule/teacher-table';
import { SubjectTable } from '@/components/schedule/subject-table';
import { ClassTable } from '@/components/schedule/class-table';
import { RoomTable } from '@/components/schedule/room-table';

export function MasterDataManagement() {
  const [activeTab, setActiveTab] = useState('teachers');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Master Data Management</h2>
        <p className="text-muted-foreground">
          Manage teachers, subjects, classes, and rooms
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>
                Manage teacher information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TeacherForm />
                <TeacherTable />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>
                Manage subject information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <SubjectForm />
                <SubjectTable />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>
                Manage class information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ClassForm />
                <ClassTable />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rooms</CardTitle>
              <CardDescription>
                Manage room information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RoomForm />
                <RoomTable />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}