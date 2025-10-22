// Type definitions for master data entities
export type Teacher = {
  id: string;
  profileId: string | null;
  name: string;
  employeeId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Subject = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Class = {
  id: string;
  name: string;
  grade: number | null;
  academicYear: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Room = {
  id: string;
  name: string;
  capacity: number | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Union type for all master data entities
export type MasterDataEntity = Teacher | Subject | Class | Room;

// Type for form data (nullable/optional values)
export type TeacherFormData = {
  name: string;
  employeeId: string;
};

export type SubjectFormData = {
  name: string;
  code: string;
  description: string;
};

export type ClassFormData = {
  name: string;
  grade: string;
  academicYear: string;
};

export type RoomFormData = {
  name: string;
  capacity: string;
  location: string;
};