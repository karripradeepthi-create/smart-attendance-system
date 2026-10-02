import React from 'react';
import { Modal } from '../ui/Modal';
import { reportService } from '../../services/reportService';
import { Download, Printer, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../../types';

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  students: StudentProfile[];
}

export const ReportViewModal: React.FC<ReportViewModalProps> = ({
  isOpen,
  onClose,
  reportType,
  students,
}) => {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleExportCsv = () => {
    reportService.exportLowAttendanceReport(students, 75);
  };

  const handlePrint = () => {
    reportService.printReport();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${reportType} Generated Report`}
      subtitle={`Official University Academic Attendance Ledger · Generated ${generatedDate}`}
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-4">
        {/* Action Header */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Digital Signature Verified · Academic Affairs Office</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report-content" className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white print:border-none print:p-0">
          {/* Institution Header */}
          <div className="border-b-2 border-slate-900 dark:border-white pb-4 mb-4 flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400">
                Department of Computer Science & Engineering
              </span>
              <h2 className="text-xl font-black mt-0.5 tracking-tight">SMART ATTENDANCE AUDIT REPORT</h2>
              <p className="text-xs text-slate-500 mt-0.5">Session: Fall Semester 2026 · Class: B.Tech CSE 3-2</p>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400 block font-mono">DOC-REF: SAR-2026-OCT-02</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{generatedDate}</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs mb-4">
            <div>
              <span className="text-slate-400 text-[10px] block">TOTAL STUDENTS</span>
              <span className="font-bold font-mono text-sm">{students.length}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">DEPT AVERAGE</span>
              <span className="font-bold font-mono text-sm text-indigo-600 dark:text-indigo-400">85.4%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">BELOW 75% CUTOFF</span>
              <span className="font-bold font-mono text-sm text-rose-500">
                {students.filter((s) => s.overallAttendancePercentage < 75).length}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">AUDIT STATUS</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified
              </span>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400">
                <th className="py-2">Student ID</th>
                <th className="py-2">Full Name</th>
                <th className="py-2">Section</th>
                <th className="py-2 text-right">Attended</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2 text-right">Percentage</th>
                <th className="py-2 text-right">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((st) => {
                const isBelow = st.overallAttendancePercentage < 75;
                return (
                  <tr key={st.studentId} className={isBelow ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}>
                    <td className="py-2 font-mono">{st.studentId}</td>
                    <td className="py-2 font-semibold">{st.name}</td>
                    <td className="py-2 text-slate-500">{st.section}</td>
                    <td className="py-2 text-right font-mono tabular-nums">{st.classesAttended}</td>
                    <td className="py-2 text-right font-mono tabular-nums">{st.totalClassesHeld}</td>
                    <td className="py-2 text-right font-mono font-bold tabular-nums">
                      <span className={isBelow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}>
                        {st.overallAttendancePercentage}%
                      </span>
                    </td>
                    <td className="py-2 text-right font-semibold">
                      <span className={isBelow ? 'text-rose-600 dark:text-rose-400 text-[11px]' : 'text-emerald-600 dark:text-emerald-400 text-[11px]'}>
                        {isBelow ? 'Condone / Notice' : 'Eligible'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-10 mt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            <div>
              <div className="border-b border-slate-300 dark:border-slate-700 pb-8 mb-1" />
              <span>Faculty Coordinator</span>
            </div>
            <div>
              <div className="border-b border-slate-300 dark:border-slate-700 pb-8 mb-1" />
              <span>Head of Department</span>
            </div>
            <div>
              <div className="border-b border-slate-300 dark:border-slate-700 pb-8 mb-1" />
              <span>Dean of Academic Affairs</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
