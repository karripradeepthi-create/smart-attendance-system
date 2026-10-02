import React from 'react';
import { UserRole } from '../types';
import { Moon, Sun, Sparkles, Shield, User, GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  userName?: string;
  onOpenAssistant?: () => void;
  onLogout?: () => void;
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  isDarkMode,
  onToggleDarkMode,
  currentPage,
  onNavigate,
  userName,
  onOpenAssistant,
  onLogout,
  isLanding = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element in high quality display styling) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                Smart Attendance
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                Campus Intelligence System
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Overview
            </button>
            <a
              href="#features"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#roles"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Role Architecture
            </a>
            <a
              href="#analytics"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Analytics
            </a>
            <a
              href="#faq"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              FAQ
            </a>
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <span className="text-[11px] font-semibold text-slate-400 px-2">Role:</span>
            <button
              onClick={() => onRoleChange?.('admin')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
            <button
              onClick={() => onRoleChange?.('faculty')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'faculty'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Faculty
            </button>
            <button
              onClick={() => onRoleChange?.('student')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'student'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Student
            </button>
          </div>
        )}

        {/* Zone 3: Actions + Theme Switcher */}
        <div className="flex items-center gap-2.5">
          {/* AI Assistant Quick Trigger */}
          {onOpenAssistant && !isLanding && (
            <button
              onClick={onOpenAssistant}
              className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/40"
              title="Open Gemini AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
          )}

          {/* Theme switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle color theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLanding ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Launch Demo
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign Out / Back to Landing"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
