import React, { useState } from 'react';
import {
  AttendanceRecord,
  AttendanceSession,
  CorrectionRequest,
  StudentProfile,
  Subject,
} from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { AttendanceSessionCard } from '../components/attendance/AttendanceSessionCard';
import { FaceRecognitionCamera } from '../components/attendance/FaceRecognitionCamera';
import { ManualAttendanceTable } from '../components/attendance/ManualAttendanceTable';
import { LowAttendanceAlert } from '../components/attendance/LowAttendanceAlert';
import { ReportViewModal } from '../components/reports/ReportViewModal';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  Camera,
  FileText,
  Clock,
  PlusCircle,
  AlertTriangle,
  Play,
  ClipboardList,
} from 'lucide-react';

interface FacultyDashboardProps {
  facultyName: string;
  facultyId: string;
  sessions: AttendanceSession[];
  students: StudentProfile[];
  records: AttendanceRecord[];
  corrections: CorrectionRequest[];
  onUpdateSessionState: (id: string, state: AttendanceSession['state']) => void;
  onCreateSession: (s: Omit<AttendanceSession, 'id' | 'presentCount' | 'absentCount' | 'lateCount' | 'excusedCount'>) => void;
  onRefreshData: () => void;
  onReviewCorrection: (id: string, status: 'approved' | 'rejected', reviewerName: string, comment?: string) => void;
  activeSubTab: string;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  facultyName,
  facultyId,
  sessions,
  students,
  records,
  corrections,
  onUpdateSessionState,
  onCreateSession,
  onRefreshData,
  onReviewCorrection,
  activeSubTab,
}) => {
  const { showToast } = useToast();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [activeSessionMode, setActiveSessionMode] = useState<'face' | 'manual'>('face');
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // New session form
  const [newSessionData, setNewSessionData] = useState({
    departmentId: 'DEP-CSE',
    departmentName: 'Computer Science & Engineering',
    year: '3rd Year',
    section: 'CSE-3-2',
    subjectId: 'SUB-CS301',
    subjectCode: 'CS301',
    subjectName: 'Database Management Systems',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    state: 'scheduled' as const,
    totalEnrolled: 50,
  });

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleCreateNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession({
      ...newSessionData,
      facultyId,
      facultyName,
    });
    setShowCreateSessionModal(false);
    showToast(`Created attendance session for ${newSessionData.subjectCode}!`, 'success');
  };

  const handleApproveCorrection = (id: string) => {
    onReviewCorrection(id, 'approved', facultyName, 'Medical/duty slip verified by faculty in-charge.');
    showToast('Correction request approved and attendance reconciled.', 'success');
  };

  const handleRejectCorrection = (id: string) => {
    onReviewCorrection(id, 'rejected', facultyName, 'Absence unexcused; minimum prior intimation missing.');
    showToast('Correction request rejected.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Today's Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Faculty Teaching & Attendance Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conducted by {facultyName} · Department of Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateSessionModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Create Session
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Top Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Today's Classes"
          value="2 Sessions"
          description="CS301 (10 AM), CS304 (2 PM)"
          icon={<BookOpen className="w-4 h-4 text-indigo-500" />}
        />
        <StatCard
          title="Students Present Today"
          value={currentSession ? currentSession.presentCount : 42}
          change="84.0% rate"
          isPositive={true}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          title="Students Absent"
          value={currentSession ? currentSession.absentCount : 6}
          description="In active session"
          icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
        />
        <StatCard
          title="Attendance Average"
          value="88.2%"
          change="DBMS CS301"
          isPositive={true}
          icon={<Users className="w-4 h-4 text-cyan-500" />}
        />
        <StatCard
          title="Below 75% In Course"
          value={3}
          description="Need remedial classes"
          warning={true}
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* ACTIVE ATTENDANCE WORKFLOW CONTROLLER */}
      {currentSession && (
        <div className="space-y-4">
          {/* Active Session Highlight Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge status={currentSession.state} />
                <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  {currentSession.subjectCode} · {currentSession.year} {currentSession.section}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {currentSession.subjectName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Date: {currentSession.date} · Time: {currentSession.startTime} - {currentSession.endTime} · Enrolled: {currentSession.totalEnrolled}
              </p>
            </div>

            {/* Verification Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveSessionMode('face')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeSessionMode === 'face'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Face Recognition UI
              </button>
              <button
                onClick={() => setActiveSessionMode('manual')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeSessionMode === 'manual'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" /> Manual Register Table
              </button>
            </div>
          </div>

          {/* Mode View: Face Camera vs Manual Table */}
          {activeSessionMode === 'face' ? (
            <FaceRecognitionCamera
              session={currentSession}
              students={students}
              onAttendanceMarked={onRefreshData}
            />
          ) : (
            <ManualAttendanceTable
              session={currentSession}
              students={students}
              records={records}
              onAttendanceUpdated={onRefreshData}
            />
          )}
        </div>
      )}

      {/* SESSION TIMELINE & CORRECTION AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Attendance Sessions List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Faculty Course Sessions
            </h3>
            <span className="text-xs text-slate-500 font-mono">Select session to conduct</span>
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <AttendanceSessionCard
                key={sess.id}
                session={sess}
                onStateChange={onUpdateSessionState}
                onSelect={() => setSelectedSessionId(sess.id)}
                isSelected={sess.id === selectedSessionId}
              />
            ))}
          </div>
        </div>

        {/* Correction Requests & Low Attendance Alerts */}
        <div className="lg:col-span-5 space-y-4">
          {/* Correction Requests Card */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Attendance Correction Requests
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600">
                {corrections.filter((c) => c.status === 'pending').length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {corrections.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No attendance correction requests submitted.
                </p>
              ) : (
                corrections.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {req.studentName} ({req.rollNumber})
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {req.subjectCode} · Date: {req.date}
                        </span>
                      </div>
                      <Badge status={req.status} />
                    </div>

                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] italic">
                      "{req.reason}"
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        {req.currentStatus.toUpperCase()} → <strong className="text-indigo-600">{req.requestedStatus.toUpperCase()}</strong>
                      </span>

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRejectCorrection(req.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveCorrection(req.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Low Attendance Watchlist */}
          <LowAttendanceAlert students={students} threshold={75} />
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      <Modal
        isOpen={showCreateSessionModal}
        onClose={() => setShowCreateSessionModal(false)}
        title="Schedule Attendance Session"
        subtitle="Configures classroom verification parameters for enrolled course batch"
      >
        <form onSubmit={handleCreateNewSession} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Subject
              </label>
              <select
                value={newSessionData.subjectCode}
                onChange={(e) => {
                  const val = e.target.value;
                  const name =
                    val === 'CS301'
                      ? 'Database Management Systems'
                      : val === 'CS302'
                      ? 'Operating Systems'
                      : val === 'CS304'
                      ? 'Software Engineering'
                      : 'Computer Networks';
                  setNewSessionData({ ...newSessionData, subjectCode: val, subjectName: name });
                }}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="CS301">CS301 - DBMS</option>
                <option value="CS302">CS302 - Operating Systems</option>
                <option value="CS304">CS304 - Software Engineering</option>
                <option value="CS303">CS303 - Computer Networks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class Section
              </label>
              <input
                type="text"
                value={newSessionData.section}
                onChange={(e) => setNewSessionData({ ...newSessionData, section: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newSessionData.date}
                onChange={(e) => setNewSessionData({ ...newSessionData, date: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={newSessionData.startTime}
                onChange={(e) => setNewSessionData({ ...newSessionData, startTime: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={newSessionData.endTime}
                onChange={(e) => setNewSessionData({ ...newSessionData, endTime: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCreateSessionModal(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Schedule Session
            </button>
          </div>
        </form>
      </Modal>

      {/* REPORT MODAL */}
      <ReportViewModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="Faculty Subject Attendance"
        students={students}
      />
    </div>
  );
};
