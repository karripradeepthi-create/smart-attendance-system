import React, { useState } from 'react';
import {
  AttendanceRecord,
  CorrectionRequest,
  StudentProfile,
  SubjectAttendanceStat,
} from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/charts/CircularProgress';
import { AttendanceCalendar } from '../components/attendance/AttendanceCalendar';
import { PredictorCalculator } from '../components/attendance/PredictorCalculator';
import { LowAttendanceAlert } from '../components/attendance/LowAttendanceAlert';
import { AIInsightsPanel } from '../components/ai/AIInsightsPanel';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ClipboardList,
  FileText,
} from 'lucide-react';
import { DEMO_STUDENT_SUBJECTS } from '../data/demoData';

interface StudentDashboardProps {
  student: StudentProfile;
  records: AttendanceRecord[];
  corrections: CorrectionRequest[];
  onSubmitCorrection: (req: Omit<CorrectionRequest, 'id' | 'status' | 'submittedAt'>) => void;
  activeSubTab: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  records,
  corrections,
  onSubmitCorrection,
  activeSubTab,
}) => {
  const { showToast } = useToast();
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // Correction request form state
  const [correctionForm, setCorrectionForm] = useState({
    subjectCode: 'CS303',
    subjectName: 'Computer Networks',
    date: new Date().toISOString().split('T')[0],
    currentStatus: 'absent' as const,
    requestedStatus: 'present' as const,
    reason: '',
  });

  const subjectStats: SubjectAttendanceStat[] = DEMO_STUDENT_SUBJECTS;

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionForm.reason.trim()) {
      showToast('Please provide an explanatory reason for your correction request', 'error');
      return;
    }

    onSubmitCorrection({
      studentId: student.studentId,
      studentName: student.name,
      rollNumber: `24CSE0${student.studentId.replace('STU', '')}`,
      subjectCode: correctionForm.subjectCode,
      subjectName: correctionForm.subjectName,
      date: correctionForm.date,
      currentStatus: correctionForm.currentStatus,
      requestedStatus: correctionForm.requestedStatus,
      reason: correctionForm.reason,
    });

    setShowCorrectionModal(false);
    showToast('Attendance correction request submitted to course faculty for audit.', 'success');
  };

  const studentRecords = records.filter((r) => r.studentId === student.studentId);
  const presentDays = student.classesAttended;
  const missedDays = student.totalClassesHeld - student.classesAttended;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome, {student.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Roll: 24CSE0{student.studentId.replace('STU', '')} · {student.year} ({student.section}) · {student.departmentName}
          </p>
        </div>

        <button
          onClick={() => setShowCorrectionModal(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <ClipboardList className="w-3.5 h-3.5" /> Request Attendance Correction
        </button>
      </div>

      {/* Low Attendance Warning if below 75% */}
      {student.overallAttendancePercentage < 75 && (
        <LowAttendanceAlert students={[student]} threshold={75} isStudentView={true} />
      )}

      {/* Circular Progress Gauge & Summary Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Circular Attendance Gauge */}
        <Card className="lg:col-span-4 flex flex-col items-center justify-center p-6 text-center">
          <CircularProgress
            percentage={student.overallAttendancePercentage}
            size={190}
            strokeWidth={14}
            label="Cumulative Semester Attendance"
            sublabel="Minimum 75% required for examination hall ticket"
          />
        </Card>

        {/* Right: Quick Stat Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            title="Classes Attended"
            value={presentDays}
            description="Verified sessions"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          />
          <StatCard
            title="Classes Missed"
            value={missedDays}
            description="Absences logged"
            icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
          />
          <StatCard
            title="Late Marks"
            value={2}
            description="Grace tolerance"
            icon={<Clock className="w-4 h-4 text-amber-500" />}
          />
          <StatCard
            title="Total Sessions Held"
            value={student.totalClassesHeld}
            description="Fall Semester 2026"
            icon={<Calendar className="w-4 h-4 text-indigo-500" />}
          />
          <StatCard
            title="Highest Subject"
            value="96.0%"
            description="Web Technologies (CS305)"
            icon={<BookOpen className="w-4 h-4 text-emerald-500" />}
          />
          <StatCard
            title="Lowest Subject"
            value="78.3%"
            description="Computer Networks (CS303)"
            warning={true}
            icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
          />
        </div>
      </div>

      {/* AI Insights Grounded in Student Attendance */}
      <AIInsightsPanel
        role="Student"
        stats={{
          studentName: student.name,
          overallAttendance: student.overallAttendancePercentage,
          classesAttended: student.classesAttended,
          totalClasses: student.totalClassesHeld,
          subjectStats,
        }}
      />

      {/* Subject-wise Attendance Breakdown */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Subject-wise Attendance Status
            </h3>
            <p className="text-xs text-slate-500">
              Per-course lecture attendance with minimum threshold tracker
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Semester 6 (B.Tech CSE)</span>
        </div>

        <div className="space-y-4">
          {subjectStats.map((sub) => {
            const isLow = sub.percentage < 75;
            return (
              <div key={sub.subjectCode} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white mr-2">
                      {sub.subjectName}
                    </span>
                    <span className="font-mono text-slate-400">({sub.subjectCode})</span>
                    <span className="text-slate-500 ml-2 hidden sm:inline">
                      · {sub.facultyName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {sub.attended}/{sub.total} classes
                    </span>
                    <span
                      className={`font-mono font-bold tabular-nums text-xs ${
                        isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  {/* 75% threshold notch */}
                  <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-slate-400/80 z-10" />
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isLow ? 'bg-rose-500' : sub.percentage >= 90 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Attendance Forecaster & Calculator */}
      <PredictorCalculator
        initialAttended={student.classesAttended}
        initialTotal={student.totalClassesHeld}
      />

      {/* Attendance Calendar & Day-Wise Breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Interactive Attendance Calendar
        </h3>
        <AttendanceCalendar />
      </div>

      {/* Correction Requests Status */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              My Attendance Correction Requests
            </h3>
            <p className="text-xs text-slate-500">
              Audited correction logs submitted to department faculty
            </p>
          </div>
          <button
            onClick={() => setShowCorrectionModal(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            + New Request
          </button>
        </div>

        <div className="space-y-2">
          {corrections.filter((c) => c.studentId === student.studentId).length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              No pending attendance correction requests.
            </p>
          ) : (
            corrections
              .filter((c) => c.studentId === student.studentId)
              .map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{c.subjectName}</span>
                      <span className="font-mono text-slate-400">({c.subjectCode})</span>
                      <Badge status={c.status} />
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Date: {c.date} · Requested: {c.currentStatus.toUpperCase()} → {c.requestedStatus.toUpperCase()}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] italic mt-1">
                      Reason: "{c.reason}"
                    </p>
                    {c.reviewComment && (
                      <p className="text-indigo-600 dark:text-indigo-400 text-[11px] mt-0.5">
                        Faculty Note ({c.reviewedBy}): {c.reviewComment}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                    {c.submittedAt}
                  </span>
                </div>
              ))
          )}
        </div>
      </Card>

      {/* SUBMISSION MODAL: ATTENDANCE CORRECTION */}
      <Modal
        isOpen={showCorrectionModal}
        onClose={() => setShowCorrectionModal(false)}
        title="Submit Attendance Correction Request"
        subtitle="Reroutes missed punches or disputed marks to course faculty with audit tracking"
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Subject
            </label>
            <select
              value={correctionForm.subjectCode}
              onChange={(e) => {
                const code = e.target.value;
                const found = subjectStats.find((s) => s.subjectCode === code);
                setCorrectionForm({
                  ...correctionForm,
                  subjectCode: code,
                  subjectName: found ? found.subjectName : 'Course Subject',
                });
              }}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {subjectStats.map((s) => (
                <option key={s.subjectCode} value={s.subjectCode}>
                  {s.subjectCode} - {s.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date of Class
              </label>
              <input
                type="date"
                required
                value={correctionForm.date}
                onChange={(e) => setCorrectionForm({ ...correctionForm, date: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recorded Status
              </label>
              <select
                value={correctionForm.currentStatus}
                onChange={(e) =>
                  setCorrectionForm({ ...correctionForm, currentStatus: e.target.value as any })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Requested Status
              </label>
              <select
                value={correctionForm.requestedStatus}
                onChange={(e) =>
                  setCorrectionForm({ ...correctionForm, requestedStatus: e.target.value as any })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="present">Present</option>
                <option value="excused">Excused (Medical/Duty)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason & Substantiating Notes
            </label>
            <textarea
              required
              rows={3}
              value={correctionForm.reason}
              onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
              placeholder="e.g. Attended departmental lab presentation or medical dispensary visit..."
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCorrectionModal(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
