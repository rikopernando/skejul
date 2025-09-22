'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { 
  getTeachers, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from '@/app/actions/master-data-actions';
import { Trash2, Edit, Plus } from 'lucide-react';

// Type definitions
type Teacher = {
  id: string;
  name: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Subject = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Class = {
  id: string;
  name: string;
  grade?: number;
  academicYear?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Room = {
  id: string;
  name: string;
  capacity?: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
};

export function MasterDataManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('teachers');
  
  // Teachers state
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherForm, setTeacherForm] = useState({ name: '', employeeId: '' });
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  
  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', description: '' });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  
  // Classes state
  const [classes, setClasses] = useState<Class[]>([]);
  const [classForm, setClassForm] = useState({ name: '', grade: '', academicYear: '' });
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  
  // Rooms state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomForm, setRoomForm] = useState({ name: '', capacity: '', location: '' });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  // Load data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      switch (activeTab) {
        case 'teachers':
          const teachersData = await getTeachers();
          setTeachers(teachersData);
          break;
        case 'subjects':
          const subjectsData = await getSubjects();
          setSubjects(subjectsData);
          break;
        case 'classes':
          const classesData = await getClasses();
          setClasses(classesData);
          break;
        case 'rooms':
          const roomsData = await getRooms();
          setRooms(roomsData);
          break;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    }
  };

  // Teacher handlers
  const handleCreateTeacher = async () => {
    try {
      const newTeacher = await createTeacher({
        name: teacherForm.name,
        employeeId: teacherForm.employeeId || undefined
      });
      setTeachers([...teachers, newTeacher]);
      setTeacherForm({ name: '', employeeId: '' });
      toast({
        title: 'Success',
        description: 'Teacher created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create teacher',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateTeacher = async () => {
    if (!editingTeacher) return;
    try {
      const updatedTeacher = await updateTeacher(editingTeacher.id, {
        name: teacherForm.name,
        employeeId: teacherForm.employeeId || undefined
      });
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? updatedTeacher : t));
      setEditingTeacher(null);
      setTeacherForm({ name: '', employeeId: '' });
      toast({
        title: 'Success',
        description: 'Teacher updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update teacher',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Teacher deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete teacher',
        variant: 'destructive'
      });
    }
  };

  // Subject handlers
  const handleCreateSubject = async () => {
    try {
      const newSubject = await createSubject({
        name: subjectForm.name,
        code: subjectForm.code || undefined,
        description: subjectForm.description || undefined
      });
      setSubjects([...subjects, newSubject]);
      setSubjectForm({ name: '', code: '', description: '' });
      toast({
        title: 'Success',
        description: 'Subject created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create subject',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    try {
      const updatedSubject = await updateSubject(editingSubject.id, {
        name: subjectForm.name,
        code: subjectForm.code || undefined,
        description: subjectForm.description || undefined
      });
      setSubjects(subjects.map(s => s.id === editingSubject.id ? updatedSubject : s));
      setEditingSubject(null);
      setSubjectForm({ name: '', code: '', description: '' });
      toast({
        title: 'Success',
        description: 'Subject updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subject',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter(s => s.id !== id));
      toast({
        title: 'Success',
        description: 'Subject deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subject',
        variant: 'destructive'
      });
    }
  };

  // Class handlers
  const handleCreateClass = async () => {
    try {
      const newClass = await createClass({
        name: classForm.name,
        grade: classForm.grade ? parseInt(classForm.grade) : undefined,
        academicYear: classForm.academicYear || undefined
      });
      setClasses([...classes, newClass]);
      setClassForm({ name: '', grade: '', academicYear: '' });
      toast({
        title: 'Success',
        description: 'Class created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create class',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;
    try {
      const updatedClass = await updateClass(editingClass.id, {
        name: classForm.name,
        grade: classForm.grade ? parseInt(classForm.grade) : undefined,
        academicYear: classForm.academicYear || undefined
      });
      setClasses(classes.map(c => c.id === editingClass.id ? updatedClass : c));
      setEditingClass(null);
      setClassForm({ name: '', grade: '', academicYear: '' });
      toast({
        title: 'Success',
        description: 'Class updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update class',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await deleteClass(id);
      setClasses(classes.filter(c => c.id !== id));
      toast({
        title: 'Success',
        description: 'Class deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete class',
        variant: 'destructive'
      });
    }
  };

  // Room handlers
  const handleCreateRoom = async () => {
    try {
      const newRoom = await createRoom({
        name: roomForm.name,
        capacity: roomForm.capacity ? parseInt(roomForm.capacity) : undefined,
        location: roomForm.location || undefined
      });
      setRooms([...rooms, newRoom]);
      setRoomForm({ name: '', capacity: '', location: '' });
      toast({
        title: 'Success',
        description: 'Room created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create room',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    try {
      const updatedRoom = await updateRoom(editingRoom.id, {
        name: roomForm.name,
        capacity: roomForm.capacity ? parseInt(roomForm.capacity) : undefined,
        location: roomForm.location || undefined
      });
      setRooms(rooms.map(r => r.id === editingRoom.id ? updatedRoom : r));
      setEditingRoom(null);
      setRoomForm({ name: '', capacity: '', location: '' });
      toast({
        title: 'Success',
        description: 'Room updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update room',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await deleteRoom(id);
      setRooms(rooms.filter(r => r.id !== id));
      toast({
        title: 'Success',
        description: 'Room deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete room',
        variant: 'destructive'
      });
    }
  };

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingTeacher(null);
                      setTeacherForm({ name: '', employeeId: '' });
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Teacher
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingTeacher 
                          ? 'Edit the teacher details below' 
                          : 'Enter the details for the new teacher'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher-name">Name</Label>
                        <Input
                          id="teacher-name"
                          value={teacherForm.name}
                          onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                          placeholder="Enter teacher name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher-employee-id">Employee ID</Label>
                        <Input
                          id="teacher-employee-id"
                          value={teacherForm.employeeId}
                          onChange={(e) => setTeacherForm({...teacherForm, employeeId: e.target.value})}
                          placeholder="Enter employee ID (optional)"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={editingTeacher ? handleUpdateTeacher : handleCreateTeacher}
                        disabled={!teacherForm.name}
                      >
                        {editingTeacher ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.employeeId || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setTeacherForm({
                                name: teacher.name,
                                employeeId: teacher.employeeId || ''
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingSubject(null);
                      setSubjectForm({ name: '', code: '', description: '' });
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSubject ? 'Edit Subject' : 'Add Subject'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingSubject 
                          ? 'Edit the subject details below' 
                          : 'Enter the details for the new subject'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject-name">Name</Label>
                        <Input
                          id="subject-name"
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                          placeholder="Enter subject name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject-code">Code</Label>
                        <Input
                          id="subject-code"
                          value={subjectForm.code}
                          onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                          placeholder="Enter subject code (optional)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject-description">Description</Label>
                        <Input
                          id="subject-description"
                          value={subjectForm.description}
                          onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                          placeholder="Enter description (optional)"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={editingSubject ? handleUpdateSubject : handleCreateSubject}
                        disabled={!subjectForm.name}
                      >
                        {editingSubject ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.code || '-'}</TableCell>
                        <TableCell>{subject.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSubject(subject);
                              setSubjectForm({
                                name: subject.name,
                                code: subject.code || '',
                                description: subject.description || ''
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubject(subject.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingClass(null);
                      setClassForm({ name: '', grade: '', academicYear: '' });
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingClass ? 'Edit Class' : 'Add Class'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingClass 
                          ? 'Edit the class details below' 
                          : 'Enter the details for the new class'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="class-name">Name</Label>
                        <Input
                          id="class-name"
                          value={classForm.name}
                          onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                          placeholder="Enter class name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class-grade">Grade</Label>
                        <Input
                          id="class-grade"
                          type="number"
                          value={classForm.grade}
                          onChange={(e) => setClassForm({...classForm, grade: e.target.value})}
                          placeholder="Enter grade (optional)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class-academic-year">Academic Year</Label>
                        <Input
                          id="class-academic-year"
                          value={classForm.academicYear}
                          onChange={(e) => setClassForm({...classForm, academicYear: e.target.value})}
                          placeholder="Enter academic year (optional)"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={editingClass ? handleUpdateClass : handleCreateClass}
                        disabled={!classForm.name}
                      >
                        {editingClass ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell>{classItem.name}</TableCell>
                        <TableCell>{classItem.grade || '-'}</TableCell>
                        <TableCell>{classItem.academicYear || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingClass(classItem);
                              setClassForm({
                                name: classItem.name,
                                grade: classItem.grade?.toString() || '',
                                academicYear: classItem.academicYear || ''
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClass(classItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingRoom(null);
                      setRoomForm({ name: '', capacity: '', location: '' });
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingRoom ? 'Edit Room' : 'Add Room'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingRoom 
                          ? 'Edit the room details below' 
                          : 'Enter the details for the new room'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="room-name">Name</Label>
                        <Input
                          id="room-name"
                          value={roomForm.name}
                          onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                          placeholder="Enter room name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="room-capacity">Capacity</Label>
                        <Input
                          id="room-capacity"
                          type="number"
                          value={roomForm.capacity}
                          onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                          placeholder="Enter capacity (optional)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="room-location">Location</Label>
                        <Input
                          id="room-location"
                          value={roomForm.location}
                          onChange={(e) => setRoomForm({...roomForm, location: e.target.value})}
                          placeholder="Enter location (optional)"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}
                        disabled={!roomForm.name}
                      >
                        {editingRoom ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{room.capacity || '-'}</TableCell>
                        <TableCell>{room.location || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingRoom(room);
                              setRoomForm({
                                name: room.name,
                                capacity: room.capacity?.toString() || '',
                                location: room.location || ''
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}