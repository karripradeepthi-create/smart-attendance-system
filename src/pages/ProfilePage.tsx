import React, { useState } from 'react';
import { User } from '../types';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { User as UserIcon, Mail, Phone, Building, ShieldCheck, Lock, Bell, Moon, Sun, Save } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateUser: (u: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  isDarkMode,
  onToggleDarkMode,
  onUpdateUser,
}) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '+91 98480 22331',
    department: 'Computer Science & Engineering',
    year: user.year || '3rd Year',
    section: user.section || 'CSE-3-2',
    notifyEmail: true,
    notifySms: false,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
    });
    showToast('Profile and preferences updated successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Identity */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {user.studentId || user.facultyId || 'USR-ADMIN'} · {user.email}
              </p>
            </div>
            <span className="self-center sm:self-auto px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {user.role} Member
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Computer Science & Engineering
            </span>
            {user.year && (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                {user.year} ({user.section})
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Institutional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                University Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                readOnly
                value={formData.department}
                className="w-full text-xs px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        {/* Preferences & Security */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            System Preferences & Security
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-1 text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Theme Appearance</span>
                <span className="text-slate-500">Toggle dark / light ambient mode</span>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Attendance Alerts</span>
                <span className="text-slate-500">Instant notification when verified or flagged below 75%</span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyEmail}
                onChange={(e) => setFormData({ ...formData, notifyEmail: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
};
