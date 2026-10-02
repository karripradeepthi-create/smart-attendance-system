import React, { useState } from 'react';
import { HERO_IMAGE_URL } from '../data/demoData';
import { Navbar } from '../components/Navbar';
import {
  ShieldCheck,
  Camera,
  BarChart3,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  Bell,
  Cpu,
  Fingerprint,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onLaunchDemo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onLaunchDemo,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does face-recognition attendance prevent proxy attendance?',
      a: 'The Smart Attendance System matches 128-dimensional biometric facial embedding vectors captured live via classroom camera feeds against encrypted student templates, preventing buddy punching and spoofing.',
    },
    {
      q: 'What happens if a student is unable to use biometric verification?',
      a: 'Faculty members have manual fallback attendance controls (Present, Late, Excused) with comprehensive audit logging, ensuring no student is unfairly penalized during medical leaves or lighting anomalies.',
    },
    {
      q: 'How does the 75% low-attendance warning system function?',
      a: 'The system continuously monitors attendance ratios per subject and overall semester enrollment. If a student drops below the university cutoff (75%), automated alerts and mathematical projection advice are sent to both student and department mentors.',
    },
    {
      q: 'How is student biometric privacy protected?',
      a: 'Our architecture adheres to zero-raw-storage security rules: raw camera frames are processed into mathematical feature vectors and immediately discarded without storing unencrypted biometric imagery.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        currentPage="landing"
        onNavigate={(p) => (p === 'login' ? onNavigateLogin() : null)}
        isLanding={true}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Next-Gen Campus EdTech Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1] text-balance">
                SMART ATTENDANCE SYSTEM
              </h1>

              <p className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                "Automate attendance. Understand student engagement. Improve academic outcomes."
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                Smarter Attendance. Better Insights. Effortless Campus Management. Built for modern universities, faculty coordinators, and students.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onLaunchDemo}
                  className="px-6 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" /> Explore Live Demo
                </button>

                <button
                  onClick={onNavigateLogin}
                  className="px-5 py-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl transition-all cursor-pointer"
                >
                  Login to Portal
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Role-Based Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-indigo-500" />
                  <span>Biometric Verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-500" />
                  <span>Gemini Analytics</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Interactive Campus & Dashboard Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 group">
                <img
                  src={HERO_IMAGE_URL}
                  alt="Smart University Campus Auditorium"
                  className="w-full h-64 sm:h-72 object-cover filter brightness-[0.92] dark:brightness-[0.85]"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Mockup Overlays */}
                <div className="absolute inset-x-4 bottom-4 space-y-3">
                  {/* Top pill row */}
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Session: CS301 (DBMS)</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-indigo-600/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      CSE 3-2
                    </span>
                  </div>

                  {/* Dashboard stats card */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Present</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">42</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Absent</span>
                      <span className="text-base font-extrabold text-rose-400 font-mono tabular-nums">6</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Rate</span>
                      <span className="text-base font-extrabold text-indigo-300 font-mono tabular-nums">87.5%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">AI Verify</span>
                      <span className="text-xs font-bold text-cyan-300 flex items-center justify-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" /> 98.4%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Why Smart Attendance? */}
      <section id="why" className="py-16 md:py-24 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              01. Paradigm Shift
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Why Upgrade to Smart Attendance?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Paper roll-calls consume 15% of classroom lecture hours, suffer from proxy marking, and delay critical low-attendance student interventions until it is too late.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Lost Lecture Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Conduct high-speed verification in seconds or mark an entire batch with instant batch confirmation, giving educators their 15 minutes back.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Eliminate Proxy Punctures
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Biometric face verification and audit trails guarantee that marked records reflect actual classroom attendance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Proactive 75% Cutoff Defense
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatic mathematical predictors project the exact number of consecutive classes a student must attend before exam eligibility is compromised.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section id="how" className="py-16 md:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              02. Workflow Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              How the System Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              {
                step: '01',
                title: 'Session Creation',
                desc: 'Faculty selects Department, Year, Section, and Subject to initiate a verified attendance session.',
              },
              {
                step: '02',
                title: 'Biometric Capture',
                desc: 'Students step in front of the classroom camera or faculty uses quick-mark manual table with zero proxy.',
              },
              {
                step: '03',
                title: 'Duplicate Guard',
                desc: 'The service prevents multiple punches for the same student, ensuring absolute ledger integrity.',
              },
              {
                step: '04',
                title: 'AI Analytics & Sync',
                desc: 'Instant calculations update student percentages, calendar sheets, and notify dean/faculty desks.',
              },
            ].map((st) => (
              <div
                key={st.step}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                  {st.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Role-Based Access */}
      <section id="roles" className="py-16 md:py-24 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              03. Three Specialized Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Tailored Role Dashboards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Admin */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Administrator
                  </span>
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  University Oversight
                </h3>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Manage Students & Faculty
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Department-wide Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Audit Ledger & Reports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> System-wide Cutoff Alerts
                  </li>
                </ul>
              </div>
              <button
                onClick={onLaunchDemo}
                className="mt-6 w-full py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer"
              >
                Launch Admin View →
              </button>
            </div>

            {/* Faculty */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/80 dark:border-indigo-500/60 shadow-lg shadow-indigo-500/5 flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-600 text-white uppercase tracking-wider">
                Active Classroom Engine
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Faculty
                  </span>
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Classroom Conduct & Verification
                </h3>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Start & Manage Live Sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Face Recognition & Manual Punch
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Review Correction Requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> One-Click Export CSV & PDF
                  </li>
                </ul>
              </div>
              <button
                onClick={onLaunchDemo}
                className="mt-6 w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
              >
                Launch Faculty View →
              </button>
            </div>

            {/* Student */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Student
                  </span>
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Student Transparency
                </h3>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Circular Attendance Gauge
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Subject-wise Breakdown
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Interactive Attendance Calendar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Mathematical Forecast Predictor
                  </li>
                </ul>
              </div>
              <button
                onClick={onLaunchDemo}
                className="mt-6 w-full py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer"
              >
                Launch Student View →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section id="faq" className="py-16 md:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              04. Common Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Call To Action */}
      <section className="py-20 bg-indigo-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to modernise your campus attendance?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Experience the complete full-stack portal with face recognition abstractions, deterministic predictors, and Gemini intelligence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLaunchDemo}
              className="px-6 py-3.5 text-xs font-bold text-indigo-600 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              Explore Live System <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateLogin}
              className="px-5 py-3.5 text-xs font-bold text-white bg-indigo-700/80 hover:bg-indigo-800 border border-indigo-400/40 rounded-xl transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Smart Attendance System</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#why" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Why Smart Attendance
            </a>
            <a href="#roles" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Roles
            </a>
            <a href="#faq" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              FAQ
            </a>
            <button
              onClick={onNavigateLogin}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Portal Login
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} Smart Attendance System · EdTech Campus SaaS
          </div>
        </div>
      </footer>
    </div>
  );
};
