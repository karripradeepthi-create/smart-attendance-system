import {
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  CorrectionRequest,
  StudentProfile,
} from '../types';
import {
  DEMO_ATTENDANCE_RECORDS,
  DEMO_CORRECTION_REQUESTS,
  DEMO_SESSIONS,
  DEMO_STUDENTS,
} from '../data/demoData';

const RECORDS_STORAGE_KEY = 'smart_attendance_records_v1';
const SESSIONS_STORAGE_KEY = 'smart_attendance_sessions_v1';
const CORRECTIONS_STORAGE_KEY = 'smart_attendance_corrections_v1';
const STUDENTS_STORAGE_KEY = 'smart_attendance_students_v1';

export const attendanceService = {
  // Load sessions
  getSessions(): AttendanceSession[] {
    const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_SESSIONS;
  },

  saveSessions(sessions: AttendanceSession[]): void {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  },

  // Load records
  getRecords(): AttendanceRecord[] {
    const data = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_ATTENDANCE_RECORDS;
  },

  saveRecords(records: AttendanceRecord[]): void {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  },

  // Load students
  getStudents(): StudentProfile[] {
    const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_STUDENTS;
  },

  saveStudents(students: StudentProfile[]): void {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  },

  // Load correction requests
  getCorrections(): CorrectionRequest[] {
    const data = localStorage.getItem(CORRECTIONS_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_CORRECTION_REQUESTS;
  },

  saveCorrections(corrections: CorrectionRequest[]): void {
    localStorage.setItem(CORRECTIONS_STORAGE_KEY, JSON.stringify(corrections));
  },

  // Session lifecycle
  createSession(newSession: Omit<AttendanceSession, 'id' | 'presentCount' | 'absentCount' | 'lateCount' | 'excusedCount'>): AttendanceSession {
    const sessions = this.getSessions();
    const created: AttendanceSession = {
      ...newSession,
      id: `SES-${Date.now()}`,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0,
    };
    sessions.unshift(created);
    this.saveSessions(sessions);
    return created;
  },

  updateSessionState(sessionId: string, state: AttendanceSession['state']): void {
    const sessions = this.getSessions();
    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, state } : s));
    this.saveSessions(updated);
  },

  // Mark single attendance (checks duplicate)
  markAttendance(
    record: Omit<AttendanceRecord, 'id' | 'time'>
  ): { success: boolean; duplicate?: boolean; record?: AttendanceRecord; message: string } {
    const records = this.getRecords();
    const existingIndex = records.findIndex(
      (r) => r.sessionId === record.sessionId && r.studentId === record.studentId
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (existingIndex !== -1) {
      // Prevent duplicate face or manual punch without intention
      const existing = records[existingIndex];
      if (existing.status === record.status && existing.verificationMethod === record.verificationMethod) {
        return {
          success: false,
          duplicate: true,
          record: existing,
          message: `Student ${record.studentName} is already marked ${existing.status.toUpperCase()} at ${existing.time}.`,
        };
      }
      // Update status
      records[existingIndex] = {
        ...existing,
        status: record.status,
        verificationMethod: record.verificationMethod,
        confidenceScore: record.confidenceScore || existing.confidenceScore,
        time: timeStr,
      };
      this.saveRecords(records);
      this.recalculateSessionStats(record.sessionId);
      return {
        success: true,
        duplicate: false,
        record: records[existingIndex],
        message: `Attendance updated to ${record.status.toUpperCase()} for ${record.studentName}.`,
      };
    }

    const newRecord: AttendanceRecord = {
      ...record,
      id: `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: timeStr,
    };
    records.push(newRecord);
    this.saveRecords(records);
    this.recalculateSessionStats(record.sessionId);

    return {
      success: true,
      record: newRecord,
      message: `Marked ${record.status.toUpperCase()} for ${record.studentName}.`,
    };
  },

  // Batch mark all present
  markAllPresent(sessionId: string, facultyId: string, facultyName: string, subjectCode: string, date: string): void {
    const students = this.getStudents();
    const records = this.getRecords();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    students.forEach((student) => {
      const existingIdx = records.findIndex((r) => r.sessionId === sessionId && r.studentId === student.studentId);
      if (existingIdx !== -1) {
        records[existingIdx].status = 'present';
        records[existingIdx].verificationMethod = 'manual';
      } else {
        records.push({
          id: `REC-${Date.now()}-${student.studentId}`,
          sessionId,
          studentId: student.studentId,
          studentName: student.name,
          rollNumber: `24CSE0${student.studentId.replace('STU', '')}`,
          subjectCode,
          date,
          time: timeStr,
          status: 'present',
          verificationMethod: 'manual',
          markedByFacultyId: facultyId,
          markedByName: facultyName,
        });
      }
    });

    this.saveRecords(records);
    this.recalculateSessionStats(sessionId);
  },

  recalculateSessionStats(sessionId: string): void {
    const sessions = this.getSessions();
    const records = this.getRecords().filter((r) => r.sessionId === sessionId);
    const sessionIdx = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIdx !== -1) {
      let present = 0;
      let absent = 0;
      let late = 0;
      let excused = 0;

      records.forEach((r) => {
        if (r.status === 'present') present++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'late') late++;
        else if (r.status === 'excused') excused++;
      });

      sessions[sessionIdx].presentCount = present;
      sessions[sessionIdx].absentCount = absent;
      sessions[sessionIdx].lateCount = late;
      sessions[sessionIdx].excusedCount = excused;
      this.saveSessions(sessions);
    }
  },

  // Submit correction request
  submitCorrection(request: Omit<CorrectionRequest, 'id' | 'status' | 'submittedAt'>): CorrectionRequest {
    const corrections = this.getCorrections();
    const created: CorrectionRequest = {
      ...request,
      id: `COR-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toLocaleString(),
    };
    corrections.unshift(created);
    this.saveCorrections(corrections);
    return created;
  },

  updateCorrectionStatus(id: string, status: 'approved' | 'rejected', reviewerName: string, comment?: string): void {
    const corrections = this.getCorrections();
    const idx = corrections.findIndex((c) => c.id === id);
    if (idx !== -1) {
      corrections[idx].status = status;
      corrections[idx].reviewedBy = reviewerName;
      corrections[idx].reviewComment = comment;
      this.saveCorrections(corrections);
    }
  },
};
