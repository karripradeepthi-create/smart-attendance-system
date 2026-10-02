import { AttendanceRecord, StudentProfile } from '../types';

export interface ReportFilterOptions {
  reportType:
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'student'
    | 'subject'
    | 'department'
    | 'low_attendance';
  dateFrom?: string;
  dateTo?: string;
  department?: string;
  subjectCode?: string;
  threshold?: number;
}

export const reportService = {
  /**
   * Generates a genuine CSV file and initiates browser download
   */
  exportToCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((item) => {
            const str = String(item).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Exports Low Attendance Report
   */
  exportLowAttendanceReport(students: StudentProfile[], threshold: number = 75): void {
    const lowStudents = students.filter((s) => s.overallAttendancePercentage < threshold);
    const headers = ['Student ID', 'Student Name', 'Department', 'Year & Section', 'Attendance %', 'Classes Attended', 'Total Classes', 'Status'];
    const rows = lowStudents.map((s) => [
      s.studentId,
      s.name,
      s.departmentName,
      `${s.year} - ${s.section}`,
      `${s.overallAttendancePercentage}%`,
      s.classesAttended,
      s.totalClassesHeld,
      s.status.toUpperCase(),
    ]);

    this.exportToCsv(`Low_Attendance_Report_Below_${threshold}pct_${new Date().toISOString().split('T')[0]}`, headers, rows);
  },

  /**
   * Exports Session Attendance Records
   */
  exportSessionReport(records: AttendanceRecord[], sessionTitle: string): void {
    const headers = ['Record ID', 'Roll Number', 'Student Name', 'Subject Code', 'Date', 'Time', 'Status', 'Verification Method', 'Marked By'];
    const rows = records.map((r) => [
      r.id,
      r.rollNumber,
      r.studentName,
      r.subjectCode,
      r.date,
      r.time,
      r.status.toUpperCase(),
      r.verificationMethod,
      r.markedByName,
    ]);

    this.exportToCsv(`Attendance_${sessionTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`, headers, rows);
  },

  /**
   * Triggers browser print-to-PDF workflow
   */
  printReport(): void {
    window.print();
  },
};
