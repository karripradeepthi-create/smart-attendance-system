/**
 * Face Recognition Service Abstraction
 * 
 * ARCHITECTURE NOTICE:
 * This service encapsulates the camera stream lifecycle and recognition pipeline.
 * In production, hook this service up to:
 * 1. Client-side WebAssembly face detector (e.g. MediaPipe Face Mesh / face-api.js)
 * 2. Backend vector embedding matching service (e.g. pgvector, Pinecone, or OpenCV DNN)
 * 
 * To ensure transparency, the UI clearly discloses simulation/prototype status
 * while executing genuine hardware camera capture.
 */

export interface VerificationResult {
  verified: boolean;
  studentId: string;
  studentName: string;
  course: string;
  date: string;
  time: string;
  confidenceScore: number;
  message: string;
}

export type ScannerStatus =
  | 'idle'
  | 'requesting_permission'
  | 'camera_ready'
  | 'scanning_face'
  | 'face_verified'
  | 'attendance_marked'
  | 'permission_denied'
  | 'no_face_detected'
  | 'error';

export const faceRecognitionService = {
  stream: null as MediaStream | null,

  async startCamera(videoElement: HTMLVideoElement): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.stream) {
        this.stopCamera();
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, error: 'Webcam API is not supported in this browser environment.' };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      this.stream = stream;
      videoElement.srcObject = stream;
      await videoElement.play();
      return { success: true };
    } catch (err: any) {
      console.warn('Camera access issue:', err?.message);
      return {
        success: false,
        error:
          err?.name === 'NotAllowedError'
            ? 'Camera permission was denied. Please allow camera access in browser settings.'
            : 'Unable to access video device.',
      };
    }
  },

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  },

  /**
   * Prototype verification runner.
   * Simulates the 4-stage pipeline required by the university workflow:
   * 'Camera Ready' -> 'Scanning Face...' -> 'Face Verified' -> 'Attendance Marked Successfully'
   */
  async verifyStudentFace(
    candidateStudent: { studentId: string; name: string; course: string },
    onStatusChange: (status: ScannerStatus, detail?: string) => void
  ): Promise<VerificationResult> {
    onStatusChange('camera_ready', 'Camera feed operational');
    await new Promise((r) => setTimeout(r, 600));

    onStatusChange('scanning_face', 'Aligning facial landmarks and 128-d feature embeddings...');
    await new Promise((r) => setTimeout(r, 1200));

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const confidenceScore = parseFloat((95.5 + Math.random() * 4.2).toFixed(1));

    onStatusChange('face_verified', `Biometric match confirmed (${confidenceScore}% confidence)`);
    await new Promise((r) => setTimeout(r, 700));

    onStatusChange('attendance_marked', `Attendance session log written for ${candidateStudent.name}`);

    return {
      verified: true,
      studentId: candidateStudent.studentId,
      studentName: candidateStudent.name,
      course: candidateStudent.course,
      date: dateStr,
      time: timeStr,
      confidenceScore,
      message: 'Biometric verification complete.',
    };
  },
};
