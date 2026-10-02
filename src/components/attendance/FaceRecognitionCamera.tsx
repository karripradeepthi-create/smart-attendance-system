import React, { useEffect, useRef, useState } from 'react';
import {
  faceRecognitionService,
  ScannerStatus,
  VerificationResult,
} from '../../services/faceRecognitionService';
import { attendanceService } from '../../services/attendanceService';
import { StudentProfile, AttendanceSession } from '../../types';
import { Camera, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { useToast } from '../ui/Toast';

interface FaceRecognitionCameraProps {
  session: AttendanceSession;
  students: StudentProfile[];
  onAttendanceMarked: () => void;
}

export const FaceRecognitionCamera: React.FC<FaceRecognitionCameraProps> = ({
  session,
  students,
  onAttendanceMarked,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus>('idle');
  const [statusDetail, setStatusDetail] = useState<string>('Initiate camera preview');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.studentId || '');
  const [lastVerification, setLastVerification] = useState<VerificationResult | null>(null);
  const [isDuplicateAlert, setIsDuplicateAlert] = useState<string | null>(null);

  const { showToast } = useToast();

  const startCameraFeed = async () => {
    if (!videoRef.current) return;
    setScannerStatus('requesting_permission');
    setStatusDetail('Requesting camera permission from browser...');
    setCameraError(null);

    const res = await faceRecognitionService.startCamera(videoRef.current);
    if (res.success) {
      setCameraActive(true);
      setScannerStatus('camera_ready');
      setStatusDetail('Camera Ready. Stand in frame to verify.');
    } else {
      setCameraActive(false);
      setCameraError(res.error || 'Failed to start camera.');
      setScannerStatus('error');
      setStatusDetail('Camera initialization failed.');
    }
  };

  const stopCameraFeed = () => {
    faceRecognitionService.stopCamera();
    setCameraActive(false);
    setScannerStatus('idle');
    setStatusDetail('Camera stopped');
  };

  useEffect(() => {
    startCameraFeed();
    return () => {
      faceRecognitionService.stopCamera();
    };
  }, []);

  const handleScanAndVerify = async () => {
    const student = students.find((s) => s.studentId === selectedStudentId) || students[0];
    if (!student) return;

    setIsDuplicateAlert(null);

    try {
      const result = await faceRecognitionService.verifyStudentFace(
        {
          studentId: student.studentId,
          name: student.name,
          course: `${session.subjectName} (${session.subjectCode})`,
        },
        (status, detail) => {
          setScannerStatus(status);
          if (detail) setStatusDetail(detail);
        }
      );

      // Now record into attendance service with duplicate prevention check
      const recordResult = attendanceService.markAttendance({
        sessionId: session.id,
        studentId: student.studentId,
        studentName: student.name,
        rollNumber: `24CSE0${student.studentId.replace('STU', '')}`,
        subjectCode: session.subjectCode,
        date: session.date,
        status: 'present',
        verificationMethod: 'face_recognition',
        confidenceScore: result.confidenceScore,
        markedByFacultyId: session.facultyId,
        markedByName: session.facultyName,
      });

      setLastVerification(result);

      if (recordResult.duplicate) {
        setIsDuplicateAlert(recordResult.message);
        showToast(`Duplicate: ${recordResult.message}`, 'info');
      } else {
        showToast(`Attendance marked for ${student.name}`, 'success');
      }

      onAttendanceMarked();
    } catch (err: any) {
      setScannerStatus('error');
      setStatusDetail('Verification error occurred.');
    }
  };

  return (
    <Card className="flex flex-col gap-5">
      {/* Service Abstraction Architecture Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Biometric Face Verification
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                Service API
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hardware-accelerated live video capture & verification pipeline abstraction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {cameraActive ? (
            <button
              onClick={stopCameraFeed}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Stop Camera
            </button>
          ) : (
            <button
              onClick={startCameraFeed}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" /> Start Camera
            </button>
          )}
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Video Preview with Biometric Reticle */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-4/3 max-w-md bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Offline or Error Fallback */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <Camera className="w-12 h-12 stroke-[1.2] mb-3 text-slate-600" />
                <p className="text-sm font-medium text-slate-300">Camera Feed Inactive</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  {cameraError || 'Click "Start Camera" above to enable live face capture.'}
                </p>
              </div>
            )}

            {/* Biometric Scanning Overlay Reticle */}
            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                {/* Target Face Box */}
                <div
                  className={`w-48 h-60 border-2 rounded-2xl relative transition-all duration-300 ${
                    scannerStatus === 'face_verified' || scannerStatus === 'attendance_marked'
                      ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                      : scannerStatus === 'scanning_face'
                      ? 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                      : 'border-white/40'
                  }`}
                >
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

                  {/* Scanning Laser Beam */}
                  {scannerStatus === 'scanning_face' && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce" />
                  )}
                </div>

                {/* Live Reticle Status Pill */}
                <div className="absolute bottom-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-[11px] font-mono text-slate-200 border border-slate-700/60 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      scannerStatus === 'camera_ready'
                        ? 'bg-amber-400 animate-pulse'
                        : scannerStatus === 'scanning_face'
                        ? 'bg-cyan-400 animate-spin'
                        : scannerStatus === 'face_verified' || scannerStatus === 'attendance_marked'
                        ? 'bg-emerald-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span>
                    {scannerStatus === 'idle' && 'Standby'}
                    {scannerStatus === 'camera_ready' && 'Camera Ready'}
                    {scannerStatus === 'scanning_face' && 'Scanning Face...'}
                    {scannerStatus === 'face_verified' && 'Face Verified'}
                    {scannerStatus === 'attendance_marked' && 'Attendance Marked Successfully'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Pipeline Step Sequence Checklist */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-md mt-3 text-center">
            {[
              { id: 'camera_ready', label: '1. Camera Ready' },
              { id: 'scanning_face', label: '2. Scanning Face' },
              { id: 'face_verified', label: '3. Face Verified' },
              { id: 'attendance_marked', label: '4. Marked Log' },
            ].map((step, idx) => {
              const order = ['camera_ready', 'scanning_face', 'face_verified', 'attendance_marked'];
              const currentIdx = order.indexOf(scannerStatus);
              const stepIdx = idx;
              const isPastOrCurrent = currentIdx >= stepIdx;

              return (
                <div
                  key={step.id}
                  className={`p-1.5 rounded text-[10px] font-medium transition-colors ${
                    isPastOrCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Verification Action & Real-time Record Display */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Student in Frame for Verification
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {students.map((st) => (
                <option key={st.studentId} value={st.studentId}>
                  {st.studentId} — {st.name} ({st.section})
                </option>
              ))}
            </select>

            <button
              onClick={handleScanAndVerify}
              disabled={scannerStatus === 'scanning_face'}
              className="mt-3 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {scannerStatus === 'scanning_face' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Biometric Features...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" /> Verify Face & Mark Attendance
                </>
              )}
            </button>

            {isDuplicateAlert && (
              <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{isDuplicateAlert}</span>
              </div>
            )}
          </div>

          {/* Verification Result Card */}
          {lastVerification ? (
            <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50 dark:border-emerald-800/40">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Verified Attendance Card
                </span>
                <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-300 font-semibold">
                  {lastVerification.confidenceScore}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Student Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{lastVerification.studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Student ID</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">{lastVerification.studentId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Course & Subject</span>
                  <span className="truncate block font-medium">{lastVerification.course}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Time Stamp</span>
                  <span className="font-mono tabular-nums">{lastVerification.date} · {lastVerification.time}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
              Waiting for face scan. Verified student details will appear here.
            </div>
          )}

          {/* Architecture disclaimer */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 border border-slate-200/60 dark:border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              Connected to <strong>faceRecognitionService.ts</strong>. Production-ready interface ready for WebAssembly biometric model integration.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
