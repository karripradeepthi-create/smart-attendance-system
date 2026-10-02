import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { Card } from '../components/ui/Card';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowLeft, CheckCircle2, AlertCircle, Building, Sparkles } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

type AuthView = 'login' | 'register' | 'forgot_password' | 'reset_password' | 'email_verification' | 'profile_setup';

interface AuthPagesProps {
  onSuccess: (user: User) => void;
  onBackToLanding: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ onSuccess, onBackToLanding }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('DEP-CSE');
  const [studentId, setStudentId] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) {
      setErrorMsg('Please enter your university email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.user) {
        showToast(`Welcome back, ${res.user.name}`, 'success');
        onSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Login failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Authentication service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register({
        name,
        email,
        role,
        department,
        studentId: role === 'student' ? studentId || 'STU088' : undefined,
      });
      if (res.success && res.user) {
        showToast('Account created successfully! Proceeding to portal.', 'success');
        onSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMsg('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    showToast('Redirecting to Google Campus Single Sign-On (SSO)...', 'info');
    // Fast mock integration with demo faculty or student
    authService.login('pooja.reddy@student.smartcampus.edu').then((res) => {
      if (res.user) onSuccess(res.user);
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please provide your registered institutional email.');
      return;
    }
    setView('email_verification');
    showToast(`Password recovery link dispatched to ${email}`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Smart Attendance Home
        </button>

        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            S
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Attendance
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {view === 'login' && 'Sign in to Campus Portal'}
          {view === 'register' && 'Register New Account'}
          {view === 'forgot_password' && 'Reset Institutional Password'}
          {view === 'email_verification' && 'Verification Email Sent'}
          {view === 'profile_setup' && 'Setup Your Campus Profile'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Integrated university identity & attendance access system
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-8 shadow-xl">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials Assistant */}
          {view === 'login' && (
            <div className="mb-5 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
              <span className="font-bold flex items-center gap-1.5 mb-1.5 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" /> One-Click Role Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('dean.academics@smartcampus.edu');
                    setPassword('admin123');
                  }}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded font-semibold text-[11px] hover:border-indigo-500 transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ramesh.sharma@smartcampus.edu');
                    setPassword('faculty123');
                  }}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded font-semibold text-[11px] hover:border-indigo-500 transition-colors"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('pooja.reddy@student.smartcampus.edu');
                    setPassword('student123');
                  }}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded font-semibold text-[11px] hover:border-indigo-500 transition-colors"
                >
                  Student
                </button>
              </div>
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@smartcampus.edu"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot_password')}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-slate-600 dark:text-slate-400"
                >
                  Remember this device for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-slate-900 text-slate-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google Campus Account
              </button>

              <div className="text-center text-xs text-slate-500 pt-2">
                Need an institutional account?{' '}
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </div>
            </form>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pooja Reddy"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@student.smartcampus.edu"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Campus Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  >
                    <option value="DEP-CSE">Computer Science</option>
                    <option value="DEP-ECE">Electronics (ECE)</option>
                    <option value="DEP-IT">Information Tech</option>
                    <option value="DEP-EEE">Electrical (EEE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <div className="text-center text-xs text-slate-500 pt-2">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Sign In instead
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your verified institutional email address. We will dispatch an authentication link to securely reset your credentials.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@smartcampus.edu"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Send Password Reset Link
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-xs font-semibold text-slate-500 hover:underline"
                >
                  Cancel & Return to Login
                </button>
              </div>
            </form>
          )}

          {/* EMAIL VERIFICATION CONFIRMATION */}
          {view === 'email_verification' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                An authorization token and recovery link has been dispatched to <strong>{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
