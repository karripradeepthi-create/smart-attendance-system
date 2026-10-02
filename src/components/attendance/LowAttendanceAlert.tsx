import React from 'react';
import { StudentProfile } from '../../types';
import { Card } from '../ui/Card';
import { AlertTriangle, Bell, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface LowAttendanceAlertProps {
  students: StudentProfile[];
  threshold?: number;
  onSendAlert?: (student: StudentProfile) => void;
  isStudentView?: boolean;
}

export const LowAttendanceAlert: React.FC<LowAttendanceAlertProps> = ({
  students,
  threshold = 75,
  isStudentView = false,
}) => {
  const { showToast } = useToast();
  const lowStudents = students.filter((s) => s.overallAttendancePercentage < threshold);

  // Math helper: how many consecutive classes needed to reach threshold T?
  // Let A = attended, N = total held. We want (A + x) / (N + x) >= T / 100
  // A + x >= (T * N + T * x) / 100
  // 100A + 100x >= TN + Tx
  // x * (100 - T) >= TN - 100A
  // x = ceil((TN - 100A) / (100 - T))
  const calculateNeededClasses = (attended: number, total: number, target: number = 75) => {
    if (total === 0) return 0;
    const currentPercent = (attended / total) * 100;
    if (currentPercent >= target) return 0;
    const numerator = target * total - 100 * attended;
    const denominator = 100 - target;
    return Math.ceil(numerator / denominator);
  };

  const handleNotifyStudent = (student: StudentProfile) => {
    showToast(`Official attendance advisory dispatched to ${student.name} (${student.email})`, 'success');
  };

  if (lowStudents.length === 0) {
    return (
      <Card className="border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/20 dark:bg-emerald-950/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
              No Low Attendance Warnings
            </h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              All students are maintaining healthy attendance at or above the {threshold}% academic threshold.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // If student-facing card
  if (isStudentView) {
    const student = lowStudents[0];
    const needed = calculateNeededClasses(student.classesAttended, student.totalClassesHeld, threshold);

    return (
      <Card className="border-rose-300/80 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200 uppercase">
                Low Attendance Warning
              </span>
              <h4 className="text-base font-bold text-rose-950 dark:text-rose-100 mt-1">
                Your current attendance is {student.overallAttendancePercentage}%
              </h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-1 leading-relaxed">
                University academic regulations mandate a minimum of <strong>{threshold}%</strong> attendance to sit for end-semester examinations without condonation fines.
              </p>
              <div className="mt-3 p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-rose-200 dark:border-rose-800/60 inline-flex items-center gap-3">
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Classes needed to reach {threshold}%:
                </span>
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
                  {needed} consecutive classes
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Admin / Faculty overview table
  return (
    <Card className="border-amber-200/80 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/10">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-amber-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Low Attendance Watchlist ({lowStudents.length})
            </h4>
            <p className="text-xs text-slate-500">
              Students falling below the mandatory {threshold}% threshold in active courses
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-amber-100/60 dark:divide-slate-800/60 mt-2">
        {lowStudents.map((st) => {
          const needed = calculateNeededClasses(st.classesAttended, st.totalClassesHeld, threshold);

          return (
            <div key={st.studentId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{st.name}</span>
                  <span className="font-mono text-slate-400">({st.studentId})</span>
                  <span className="font-medium text-slate-500">{st.section}</span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Attended {st.classesAttended} of {st.totalClassesHeld} classes held
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                    {st.overallAttendancePercentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Needs <strong className="text-slate-700 dark:text-slate-300 font-mono">{needed}</strong> classes
                  </span>
                </div>

                <button
                  onClick={() => handleNotifyStudent(st)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200/80 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Notify
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
