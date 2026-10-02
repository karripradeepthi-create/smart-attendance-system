export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  departmentId?: string;
  studentId?: string;
  facultyId?: string;
  year?: string;
  section?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  durationYears: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  semester: number;
  credits: number;
  facultyId: string;
  facultyName: string;
}

export interface StudentProfile {
  id: string;
  studentId: string; // e.g. STU001
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  year: string; // e.g. 3rd Year
  section: string; // e.g. CSE-3-2
  overallAttendancePercentage: number;
  classesAttended: number;
  totalClassesHeld: number;
  avatarUrl?: string;
  faceEnrolled: boolean;
  status: 'active' | 'probation' | 'inactive';
}

export interface FacultyProfile {
  id: string;
  facultyId: string; // e.g. FAC001
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  assignedSubjects: string[]; // subject codes
  status: 'active' | 'on_leave';
  avatarUrl?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectCode: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AttendanceStatus;
  verificationMethod: 'face_recognition' | 'manual' | 'qr_backup';
  confidenceScore?: number; // 0-100 for face recognition
  markedByFacultyId: string;
  markedByName: string;
}

export type SessionState = 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface AttendanceSession {
  id: string;
  departmentId: string;
  departmentName: string;
  year: string;
  section: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  state: SessionState;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
}

export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  currentStatus: AttendanceStatus;
  requestedStatus: AttendanceStatus;
  reason: string;
  evidenceUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'attendance_alert' | 'session_start' | 'correction' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetRecord: string;
  timestamp: string;
  metadata?: string;
}

export interface SubjectAttendanceStat {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  facultyName: string;
}

export interface DayAttendanceLog {
  date: string;
  day: string;
  subject: string;
  faculty: string;
  time: string;
  status: AttendanceStatus;
}
