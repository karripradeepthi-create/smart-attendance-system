import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { AIAssistantDrawer } from '../components/ai/AIAssistantDrawer';
import { Menu, ChevronRight, Bell, Sparkles } from 'lucide-react';

interface DashboardLayoutProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateLanding: () => void;
  onLogout: () => void;
  unreadCount?: number;
  attendanceSummary: any;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  onRoleChange,
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onSelectTab,
  onNavigateLanding,
  onLogout,
  unreadCount = 0,
  attendanceSummary,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Format breadcrumb title
  const formattedTabTitle = activeTab
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentUser.role}
        onRoleChange={onRoleChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        currentPage="dashboard"
        onNavigate={(p) => (p === 'landing' ? onNavigateLanding() : null)}
        userName={currentUser.name}
        onOpenAssistant={() => setAssistantOpen(true)}
        onLogout={onLogout}
        isLanding={false}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          role={currentUser.role}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          unreadCount={unreadCount}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 md:ml-64 flex flex-col min-w-0">
          {/* Subheader / Breadcrumbs bar */}
          <div className="h-13 px-4 sm:px-6 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="w-4 h-4" />
              </button>

              <span className="text-slate-400 font-medium capitalize">{currentUser.role} Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formattedTabTitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick AI Trigger */}
              <button
                onClick={() => setAssistantOpen(true)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>

              {/* Notification icon */}
              <button
                onClick={() => onSelectTab('notifications')}
                className="relative p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* User profile capsule */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono capitalize">
                    {currentUser.studentId || currentUser.facultyId || currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Viewport Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        currentUser={currentUser}
        attendanceSummary={attendanceSummary}
      />
    </div>
  );
};
