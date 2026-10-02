import React, { useState } from 'react';
import { AttendanceRecord, AttendanceSession, AttendanceStatus, StudentProfile } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';
import { CheckCheck, Search, Filter, Save, AlertCircle } from 'lucide-react';

interface ManualAttendanceTableProps {
  session: AttendanceSession;
  students: StudentProfile[];
  records: AttendanceRecord[];
  onAttendanceUpdated: () => void;
}

export const ManualAttendanceTable: React.FC<ManualAttendanceTableProps> = ({
  session,
  students,
  records,
  onAttendanceUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [pendingChanges, setPendingChanges] = useState<Record<string, AttendanceStatus>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMarkAllModal, setShowMarkAllModal] = useState(false);

  const { showToast } = useToast();

  // Find record for student in this session
  const getStudentStatus = (studentId: string): { status: AttendanceStatus; time: string; method: string } => {
    if (pendingChanges[studentId]) {
      return { status: pendingChanges[studentId], time: 'Pending save', method: 'manual' };
    }
    const found = records.find((r) => r.sessionId === session.id && r.studentId === studentId);
    if (found) {
      return { status: found.status, time: found.time, method: found.verificationMethod };
    }
    return { status: 'absent', time: '-', method: 'unmarked' };
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setPendingChanges((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAllChanges = () => {
    const studentKeys = Object.keys(pendingChanges);
    if (studentKeys.length === 0) return;

    studentKeys.forEach((sId) => {
      const student = students.find((s) => s.studentId === sId);
      if (!student) return;
      attendanceService.markAttendance({
        sessionId: session.id,
        studentId: student.studentId,
        studentName: student.name,
        rollNumber: `24CSE0${student.studentId.replace('STU', '')}`,
        subjectCode: session.subjectCode,
        date: session.date,
        status: pendingChanges[sId],
        verificationMethod: 'manual',
        markedByFacultyId: session.facultyId,
        markedByName: session.facultyName,
      });
    });

    setPendingChanges({});
    showToast(`Saved attendance updates for ${studentKeys.length} student(s)`, 'success');
    onAttendanceUpdated();
  };

  const handleMarkAllPresent = () => {
    attendanceService.markAllPresent(
      session.id,
      session.facultyId,
      session.facultyName,
      session.subjectCode,
      session.date
    );
    setPendingChanges({});
    showToast('Marked all students as PRESENT', 'success');
    onAttendanceUpdated();
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    const { status } = getStudentStatus(s.studentId);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  return (
    <Card className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-52"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <Filter className="w-3 h-3 text-slate-400 ml-1" />
            {['all', 'present', 'absent', 'late', 'excused'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMarkAllModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Present
          </button>

          {hasUnsavedChanges && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer animate-pulse"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes ({Object.keys(pendingChanges).length})
            </button>
          )}
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>You have unsaved attendance marks. Click <strong>"Save Changes"</strong> to record them permanently to the ledger.</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="pb-3 pl-2">Roll Number</th>
              <th className="pb-3">Student Name</th>
              <th className="pb-3">Current Status</th>
              <th className="pb-3">Logged Time</th>
              <th className="pb-3">Method</th>
              <th className="pb-3 text-right pr-2">Change Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No students match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((st) => {
                const info = getStudentStatus(st.studentId);
                const rollNo = `24CSE0${st.studentId.replace('STU', '')}`;
                const isPending = !!pendingChanges[st.studentId];

                return (
                  <tr
                    key={st.studentId}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isPending ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                    }`}
                  >
                    <td className="py-3 pl-2 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {rollNo}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{st.name}</div>
                      <div className="text-[11px] text-slate-400">{st.studentId}</div>
                    </td>
                    <td className="py-3">
                      <Badge status={info.status} />
                      {isPending && (
                        <span className="ml-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                          (Unsaved)
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {info.time}
                    </td>
                    <td className="py-3 text-[11px] text-slate-500 capitalize">
                      {info.method.replace('_', ' ')}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                        {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(st.studentId, s)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize transition-all cursor-pointer ${
                              info.status === s
                                ? s === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : s === 'absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : s === 'late'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog before saving pending changes */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSaveAllChanges}
        title="Confirm Attendance Updates"
        message={`Are you sure you want to commit attendance marks for ${
          Object.keys(pendingChanges).length
        } student(s)? This will update student attendance percentages and write to the audit ledger.`}
        confirmLabel="Save & Record"
      />

      {/* Confirmation Dialog before Mark All Present */}
      <ConfirmDialog
        isOpen={showMarkAllModal}
        onClose={() => setShowMarkAllModal(false)}
        onConfirm={handleMarkAllPresent}
        title="Mark All Enrolled Students Present"
        message={`This will set all ${students.length} students enrolled in ${session.subjectCode} to 'PRESENT' status for today's session.`}
        confirmLabel="Confirm Mark All"
      />
    </Card>
  );
};
