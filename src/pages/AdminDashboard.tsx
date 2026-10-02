import React, { useState } from 'react';
import {
  Department,
  FacultyProfile,
  StudentProfile,
  AttendanceSession,
  AuditLog,
} from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { AttendanceLineChart } from '../components/charts/AttendanceLineChart';
import { AttendanceBarChart } from '../components/charts/AttendanceBarChart';
import { AttendanceDonutChart } from '../components/charts/AttendanceDonutChart';
import { LowAttendanceAlert } from '../components/attendance/LowAttendanceAlert';
import { AIInsightsPanel } from '../components/ai/AIInsightsPanel';
import { ReportViewModal } from '../components/reports/ReportViewModal';
import { useToast } from '../components/ui/Toast';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  AlertTriangle,
  UserPlus,
  FileText,
  PlusCircle,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import {
  WEEKLY_ATTENDANCE_TREND,
  DEPARTMENT_COMPARISON,
} from '../data/demoData';

interface AdminDashboardProps {
  students: StudentProfile[];
  faculty: FacultyProfile[];
  departments: Department[];
  sessions: AttendanceSession[];
  auditLogs: AuditLog[];
  activeSubTab: string;
  onNavigateTab: (tab: string) => void;
  onUpdateStudents: (st: StudentProfile[]) => void;
  onUpdateFaculty: (fc: FacultyProfile[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  faculty,
  departments,
  sessions,
  auditLogs,
  activeSubTab,
  onNavigateTab,
  onUpdateStudents,
  onUpdateFaculty,
}) => {
  const { showToast } = useToast();

  // Modals state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentProfile | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Form states for adding student
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: 'DEP-CSE',
    year: '3rd Year',
    section: 'CSE-3-2',
  });

  // Form states for adding faculty
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: 'DEP-CSE',
    designation: 'Assistant Professor',
  });

  const lowAttendanceCount = students.filter((s) => s.overallAttendancePercentage < 75).length;
  const avgAttendance = (
    students.reduce((acc, s) => acc + s.overallAttendancePercentage, 0) / (students.length || 1)
  ).toFixed(1);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StudentProfile = {
      id: `STU-${Date.now()}`,
      studentId: `STU${String(students.length + 1).padStart(3, '0')}`,
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone || '+91 98400 00000',
      departmentId: newStudent.departmentId,
      departmentName: 'Computer Science & Engineering',
      year: newStudent.year,
      section: newStudent.section,
      overallAttendancePercentage: 100.0,
      classesAttended: 1,
      totalClassesHeld: 1,
      faceEnrolled: false,
      status: 'active',
    };

    onUpdateStudents([created, ...students]);
    setShowAddStudentModal(false);
    showToast(`Enrolled student ${created.name} (${created.studentId}) successfully!`, 'success');
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FacultyProfile = {
      id: `FAC-${Date.now()}`,
      facultyId: `FAC${String(faculty.length + 1).padStart(3, '0')}`,
      name: newFaculty.name,
      email: newFaculty.email,
      phone: newFaculty.phone || '+91 98000 00000',
      departmentId: newFaculty.departmentId,
      departmentName: 'Computer Science & Engineering',
      designation: newFaculty.designation,
      assignedSubjects: ['CS301'],
      status: 'active',
    };

    onUpdateFaculty([created, ...faculty]);
    setShowAddFacultyModal(false);
    showToast(`Added faculty member ${created.name} (${created.facultyId}) successfully!`, 'success');
  };

  const handleDeleteStudent = (id: string, name: string) => {
    onUpdateStudents(students.filter((s) => s.id !== id));
    showToast(`Removed student ${name} from registry`, 'info');
  };

  // Filtered lists
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || s.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Campus Administrator Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Institutional overview, attendance governance, and AI-assisted academic compliance
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Student
          </button>
          <button
            onClick={() => setShowAddFacultyModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Faculty
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Generate Report
          </button>
        </div>
      </div>

      {/* SUB-VIEW ROUTING */}
      {activeSubTab === 'dashboard' && (
        <>
          {/* Top Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard
              title="Total Students"
              value={480}
              change="+12 this term"
              isPositive={true}
              icon={<GraduationCap className="w-4 h-4 text-indigo-500" />}
              onClick={() => onNavigateTab('students')}
            />
            <StatCard
              title="Total Faculty"
              value={32}
              change="Active duty"
              isPositive={true}
              icon={<Users className="w-4 h-4 text-cyan-500" />}
              onClick={() => onNavigateTab('faculty')}
            />
            <StatCard
              title="Total Courses"
              value={12}
              description="Across 4 Depts"
              icon={<BookOpen className="w-4 h-4 text-violet-500" />}
            />
            <StatCard
              title="Today's Attendance"
              value="87.5%"
              change="+1.8% vs Mon"
              isPositive={true}
              icon={<Calendar className="w-4 h-4 text-emerald-500" />}
            />
            <StatCard
              title="Average Attendance"
              value={`${avgAttendance}%`}
              description="Semester benchmark"
              icon={<ShieldCheck className="w-4 h-4 text-blue-500" />}
            />
            <StatCard
              title="Below 75% Cutoff"
              value={lowAttendanceCount}
              change="Action alert"
              isPositive={false}
              warning={true}
              icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
            />
          </div>

          {/* AI Insights Bar */}
          <AIInsightsPanel
            role="Admin"
            stats={{
              totalStudents: 480,
              avgAttendance: parseFloat(avgAttendance),
              lowAttendanceCount,
              todayAttendance: 87.5,
              departments: DEPARTMENT_COMPARISON,
            }}
          />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Card className="lg:col-span-8">
              <AttendanceLineChart
                data={WEEKLY_ATTENDANCE_TREND}
                title="Weekly Campus Attendance Trend (Mon - Fri)"
              />
            </Card>

            <Card className="lg:col-span-4 flex flex-col justify-between">
              <AttendanceDonutChart
                title="Active Session Log Distribution"
                segments={[
                  { label: 'Present', value: 42, color: '#10b981' },
                  { label: 'Absent', value: 6, color: '#f43f5e' },
                  { label: 'Late', value: 2, color: '#f59e0b' },
                ]}
              />
              <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                Verified via Camera & Faculty Register
              </div>
            </Card>
          </div>

          {/* Department Comparison & Low Attendance Watchlist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Card className="lg:col-span-7">
              <AttendanceBarChart
                title="Department Attendance Comparison"
                data={DEPARTMENT_COMPARISON.map((d) => ({
                  label: d.department,
                  present: Math.round((d.rate / 100) * d.students),
                  absent: Math.round(((100 - d.rate) / 100) * d.students),
                }))}
              />
            </Card>

            <div className="lg:col-span-5">
              <LowAttendanceAlert students={students} threshold={75} />
            </div>
          </div>
        </>
      )}

      {/* STUDENTS VIEW */}
      {activeSubTab === 'students' && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 w-56"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Departments</option>
                <option value="DEP-CSE">Computer Science</option>
                <option value="DEP-ECE">Electronics</option>
                <option value="DEP-IT">Information Tech</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Enroll Student
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3 pl-2">ID</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Year / Section</th>
                  <th className="pb-3 text-right">Attendance</th>
                  <th className="pb-3">Biometric</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st) => (
                  <tr key={st.studentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 pl-2 font-mono font-medium">{st.studentId}</td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{st.name}</div>
                      <div className="text-[11px] text-slate-400">{st.email}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{st.departmentName}</td>
                    <td className="py-3 font-mono">{st.year} - {st.section}</td>
                    <td className="py-3 text-right font-mono font-bold tabular-nums">
                      <span className={st.overallAttendancePercentage < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}>
                        {st.overallAttendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3">
                      {st.faceEnrolled ? (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Enrolled
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge status={st.status} />
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedStudentForProfile(st)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View Profile Card"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(st.id, st.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* FACULTY VIEW */}
      {activeSubTab === 'faculty' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Faculty Directory</h3>
            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Faculty
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faculty.map((f) => (
              <div
                key={f.facultyId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {f.avatarUrl ? (
                      <img
                        src={f.avatarUrl}
                        alt={f.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {f.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{f.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{f.facultyId} · {f.designation}</p>
                    </div>
                  </div>
                  <Badge status={f.status} />
                </div>
                <div className="text-xs text-slate-500 pt-1">
                  <div>Department: {f.departmentName}</div>
                  <div>Email: {f.email}</div>
                  <div className="mt-1 flex items-center gap-1 font-mono text-[10px]">
                    Subjects: {f.assignedSubjects.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* DEPARTMENTS VIEW */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {dept.code}
                </span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{dept.name}</h4>
                <p className="text-xs text-slate-500 mt-1">HoD: {dept.headOfDepartment}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Students</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{dept.totalStudents}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Faculty</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{dept.totalFaculty}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AUDIT LOGS VIEW */}
      {activeSubTab === 'audit_logs' && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Audit Ledger</h3>
              <p className="text-xs text-slate-500">Immutable chronological record of attendance punches and approvals</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <Badge status={log.userRole} />
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Actor: {log.userName} · Target: {log.targetRecord}
                  </div>
                  {log.metadata && (
                    <div className="text-slate-400 font-mono text-[10px] mt-0.5">
                      {log.metadata}
                    </div>
                  )}
                </div>
                <div className="font-mono text-slate-400 tabular-nums text-[11px] sm:text-right">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* REPORTS VIEW */}
      {activeSubTab === 'reports' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Attendance Reports</h3>
              <p className="text-xs text-slate-500">Export verified records for university registers, accreditation, and notices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Daily Attendance Report',
                desc: 'Consolidated attendance across all active classroom lecture sessions today.',
                type: 'Daily',
              },
              {
                title: 'Low Attendance Notice List (<75%)',
                desc: 'Official candidate list for condonation fines and academic warning letters.',
                type: 'Low Attendance',
              },
              {
                title: 'Monthly Department Audit',
                desc: 'Aggregated analytics and faculty punctuality indicators for the Dean desk.',
                type: 'Monthly',
              },
            ].map((rep) => (
              <div
                key={rep.title}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rep.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="mt-4 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> View & Print
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MODAL: ADD STUDENT */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="Enroll New Student"
        subtitle="Registers student profile for classroom attendance rosters and face enrollment"
      >
        <form onSubmit={handleCreateStudent} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="e.g. Vikram Malhotra"
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              placeholder="vikram.m@student.smartcampus.edu"
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={newStudent.departmentId}
                onChange={(e) => setNewStudent({ ...newStudent, departmentId: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="DEP-CSE">Computer Science</option>
                <option value="DEP-ECE">Electronics</option>
                <option value="DEP-IT">Information Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Section
              </label>
              <input
                type="text"
                value={newStudent.section}
                onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD FACULTY */}
      <Modal
        isOpen={showAddFacultyModal}
        onClose={() => setShowAddFacultyModal(false)}
        title="Add Faculty Member"
      >
        <form onSubmit={handleCreateFaculty} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Name
            </label>
            <input
              type="text"
              required
              value={newFaculty.name}
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              placeholder="e.g. Dr. Harish Rao"
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={newFaculty.email}
              onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
              placeholder="harish.rao@smartcampus.edu"
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddFacultyModal(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Save Faculty Member
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: STUDENT PROFILE CARD */}
      {selectedStudentForProfile && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudentForProfile(null)}
          title={`Profile Card: ${selectedStudentForProfile.name}`}
          subtitle={`Roll No: 24CSE0${selectedStudentForProfile.studentId.replace('STU', '')}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {selectedStudentForProfile.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedStudentForProfile.name}
                </h4>
                <p className="text-slate-400 font-mono">{selectedStudentForProfile.studentId} · {selectedStudentForProfile.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge status={selectedStudentForProfile.status} />
                  <span className="text-[11px] text-slate-500">{selectedStudentForProfile.departmentName}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Percentage</span>
                <span className="text-base font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                  {selectedStudentForProfile.overallAttendancePercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Attended</span>
                <span className="text-base font-bold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                  {selectedStudentForProfile.classesAttended}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Total Classes</span>
                <span className="text-base font-bold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                  {selectedStudentForProfile.totalClassesHeld}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* REPORT MODAL */}
      <ReportViewModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="Institutional Attendance"
        students={students}
      />
    </div>
  );
};
