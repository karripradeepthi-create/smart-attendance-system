import React, { useEffect, useState } from 'react';
import { User, UserRole, StudentProfile, FacultyProfile, AttendanceSession, AttendanceRecord, CorrectionRequest, NotificationItem, AuditLog } from './types';
import { authService } from './services/authService';
import { attendanceService } from './services/attendanceService';
import { notificationService } from './services/notificationService';
import { auditService } from './services/auditService';
import { ToastProvider } from './components/ui/Toast';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DEMO_DEPARTMENTS, DEMO_FACULTY } from './data/demoData';

export default function App() {
  const [page, setPage] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<User>(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Core application datasets managed via services
  const [students, setStudents] = useState<StudentProfile[]>(() => attendanceService.getStudents());
  const [faculty, setFaculty] = useState<FacultyProfile[]>(DEMO_FACULTY);
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => attendanceService.getSessions());
  const [records, setRecords] = useState<AttendanceRecord[]>(() => attendanceService.getRecords());
  const [corrections, setCorrections] = useState<CorrectionRequest[]>(() => attendanceService.getCorrections());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => notificationService.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => auditService.getLogs());

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleRoleChange = (role: UserRole) => {
    const switched = authService.switchRole(role);
    setCurrentUser(switched);
    setActiveTab('dashboard');
  };

  const handleRefreshData = () => {
    setStudents(attendanceService.getStudents());
    setSessions(attendanceService.getSessions());
    setRecords(attendanceService.getRecords());
    setCorrections(attendanceService.getCorrections());
    setNotifications(notificationService.getNotifications());
    setAuditLogs(auditService.getLogs());
  };

  const handleUpdateSessionState = (id: string, state: AttendanceSession['state']) => {
    attendanceService.updateSessionState(id, state);
    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: `Updated session state to ${state.toUpperCase()}`,
      targetRecord: `Session ID ${id}`,
    });
    handleRefreshData();
  };

  const handleCreateSession = (newSess: Omit<AttendanceSession, 'id' | 'presentCount' | 'absentCount' | 'lateCount' | 'excusedCount'>) => {
    attendanceService.createSession(newSess);
    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Created new attendance session',
      targetRecord: `${newSess.subjectCode} (${newSess.section})`,
    });
    handleRefreshData();
  };

  const handleSubmitCorrection = (req: Omit<CorrectionRequest, 'id' | 'status' | 'submittedAt'>) => {
    attendanceService.submitCorrection(req);
    notificationService.addNotification({
      userId: 'USR-FAC-1',
      title: 'New Correction Request',
      message: `${req.studentName} requested attendance adjustment for ${req.subjectCode}.`,
      type: 'correction',
    });
    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Submitted attendance correction request',
      targetRecord: `${req.subjectCode} on ${req.date}`,
    });
    handleRefreshData();
  };

  const handleReviewCorrection = (id: string, status: 'approved' | 'rejected', reviewerName: string, comment?: string) => {
    attendanceService.updateCorrectionStatus(id, status, reviewerName, comment);
    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: `${status.toUpperCase()} attendance correction request`,
      targetRecord: `Request ${id}`,
      metadata: comment,
    });
    handleRefreshData();
  };

  // Find active student profile if user is student
  const currentStudentProfile =
    students.find((s) => s.studentId === currentUser.studentId) || students[0];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ToastProvider>
      {/* 1. Public Landing Page */}
      {page === 'landing' && (
        <LandingPage
          onNavigateLogin={() => setPage('login')}
          onLaunchDemo={() => setPage('dashboard')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {/* 2. Authentication UI */}
      {page === 'login' && (
        <AuthPages
          onSuccess={(user) => {
            setCurrentUser(user);
            setPage('dashboard');
            setActiveTab('dashboard');
          }}
          onBackToLanding={() => setPage('landing')}
        />
      )}

      {/* 3. Role-Based Dashboard Workspace */}
      {page === 'dashboard' && (
        <DashboardLayout
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onNavigateLanding={() => setPage('landing')}
          onLogout={() => {
            authService.logout();
            setPage('landing');
          }}
          unreadCount={unreadCount}
          attendanceSummary={{
            currentUser,
            totalStudents: students.length,
            sessionsCount: sessions.length,
            recordsCount: records.length,
          }}
        >
          {/* Notification Tab */}
          {activeTab === 'notifications' ? (
            <NotificationsPage
              notifications={notifications}
              onMarkAsRead={(id) => {
                notificationService.markAsRead(id);
                handleRefreshData();
              }}
              onMarkAllAsRead={() => {
                notificationService.markAllAsRead();
                handleRefreshData();
              }}
            />
          ) : activeTab === 'profile' || activeTab === 'settings' ? (
            <ProfilePage
              user={currentUser}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onUpdateUser={(updated) => {
                authService.setCurrentUser(updated);
                setCurrentUser(updated);
              }}
            />
          ) : currentUser.role === 'admin' ? (
            <AdminDashboard
              students={students}
              faculty={faculty}
              departments={DEMO_DEPARTMENTS}
              sessions={sessions}
              auditLogs={auditLogs}
              activeSubTab={activeTab}
              onNavigateTab={setActiveTab}
              onUpdateStudents={(newSt) => {
                attendanceService.saveStudents(newSt);
                setStudents(newSt);
              }}
              onUpdateFaculty={setFaculty}
            />
          ) : currentUser.role === 'faculty' ? (
            <FacultyDashboard
              facultyName={currentUser.name}
              facultyId={currentUser.facultyId || 'FAC001'}
              sessions={sessions}
              students={students}
              records={records}
              corrections={corrections}
              onUpdateSessionState={handleUpdateSessionState}
              onCreateSession={handleCreateSession}
              onRefreshData={handleRefreshData}
              onReviewCorrection={handleReviewCorrection}
              activeSubTab={activeTab}
            />
          ) : (
            <StudentDashboard
              student={currentStudentProfile}
              records={records}
              corrections={corrections}
              onSubmitCorrection={handleSubmitCorrection}
              activeSubTab={activeTab}
            />
          )}
        </DashboardLayout>
      )}
    </ToastProvider>
  );
}
