# SMART ATTENDANCE SYSTEM
> *"Smarter Attendance. Better Insights. Effortless Campus Management."*

A full-stack, enterprise-grade EdTech and Campus Management SaaS platform engineered with React 19, TypeScript, Tailwind CSS, Express, and Google Gemini 3.8 Flash. Built to automate attendance, eliminate proxy marking, predict student academic cutoffs, and provide deep department intelligence.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features & Capabilities](#key-features--capabilities)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Folder Structure](#folder-structure)
6. [Relational Database Schema](#relational-database-schema)
7. [Authentication & RBAC](#authentication--rbac)
8. [Attendance Verification Workflows](#attendance-verification-workflows)
9. [Gemini AI Intelligence & Assistant](#gemini-ai-intelligence--assistant)
10. [Security & Biometric Privacy Policy](#security--biometric-privacy-policy)
11. [Installation & Setup](#installation--setup)
12. [Environment Variables](#environment-variables)
13. [API Documentation](#api-documentation)
14. [Future Engineering Improvements](#future-engineering-improvements)
15. [Limitations & Disclaimers](#limitations--disclaimers)

---

## 1. Project Overview
Traditional manual paper-sheet roll calls consume 10–15 minutes of every lecture, are susceptible to buddy proxies, and delay intervention until end-of-semester condonation lists are published. **Smart Attendance System** solves these inefficiencies through:
- **Biometric Face Verification UI & Abstraction Pipeline** (Camera stream capture, landmark alignment, and vector matching simulation).
- **Zero-Proxy Manual Register Backup** (Present, Absent, Late, Excused statuses with duplicate punch defense).
- **Deterministic 75% Cutoff Forecaster** (Exact calculation of consecutive classes a student must attend to regain semester exam eligibility).
- **Gemini 3.8 Flash AI Assistant & Department Insights** (Real-time student advisory and natural language query agent).
- **Three Specialized Roles** (Administrator, Faculty Instructor, Student).

---

## 2. Key Features & Capabilities

### Administrator Console
- **Macro Campus Statistics**: Total Students (480), Total Faculty (32), Total Courses (12), Today's Attendance %, College-wide Average %, and Below-75% Student Watchlist.
- **Visual Analytics**: Weekly attendance trends, monthly volume progression, department comparison bar charts, and session status distribution.
- **Roster & Registry Management**: Searchable and filterable student and faculty tables with full profile cards and status indicators.
- **Institutional Audit Ledger**: Chronological log of all punches, approvals, and administrative actions with client device metadata.

### Faculty Teaching Studio
- **Attendance Session Management**: Schedule, start, pause, resume, and close lecture sessions.
- **Face Recognition Scanning Engine**: Live hardware camera preview with animated biometric reticle and 4-phase verification sequence (`Camera Ready` → `Scanning Face...` → `Face Verified` → `Attendance Marked Successfully`).
- **Rapid Manual Attendance Table**: Roll-number ordered grid with batch "Mark All Present", single-click toggle, and unsaved changes alert.
- **Dispute & Correction Workflow**: Review student-submitted attendance adjustment requests with one-click Approve/Reject and faculty audit remarks.

### Student Transparency Portal
- **Circular Attendance Progress Gauge**: Real-time percentage indicator with color-coded alerts (Emerald for $\ge 90\%$, Indigo for Good Standing, Rose for $<75\%$).
- **Subject-by-Subject Breakdown**: Course-level attendance tracking with built-in 75% threshold guide markers.
- **Interactive Attendance Calendar**: Color-coded monthly view (Present, Absent, Late, Excused, Holiday) with slide-out class details.
- **Attendance Forecaster**: Mathematical predictor simulating future attendances or safe skips without dropping below 75%.
- **Correction Request Form**: Formal submission portal for medical or on-duty absences.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, TypeScript, Tailwind CSS, Lucide React Icons |
| **Charts & Metrics** | Custom SVG Data Visualizations (Line, Bar, Donut, Circular Progress Gauges) |
| **Backend API** | Node.js, Express, tsx |
| **Generative AI** | `@google/genai` TypeScript SDK (Gemini 3.8 Flash) |
| **Biometric Layer** | `navigator.mediaDevices.getUserMedia` hardware camera API & `faceRecognitionService.ts` abstraction |
| **Storage & Caching** | LocalStorage state persistence layer with API abstraction |

---

## 4. System Architecture

```
                                  +-----------------------------+
                                  |     Vite / React 19 SPA     |
                                  |     (Tailwind CSS + TS)     |
                                  +--------------+--------------+
                                                 |
                   +-----------------------------+-----------------------------+
                   |                             |                             |
       +-----------v-----------+    +------------v------------+    +-----------v-----------+
       |   Admin Dashboard     |    |   Faculty Studio        |    |   Student Portal      |
       |  - Roster Management  |    |  - Face Camera UI       |    |  - Circular Gauge     |
       |  - Audit Ledger       |    |  - Manual Table         |    |  - Attendance Cal     |
       |  - Dept Analytics     |    |  - Dispute Review       |    |  - Math Forecaster    |
       +-----------+-----------+    +------------+------------+    +-----------+-----------+
                   |                             |                             |
                   +-----------------------------+-----------------------------+
                                                 |
                                  +--------------v--------------+
                                  |    Service Abstraction      |
                                  | - authService.ts            |
                                  | - attendanceService.ts      |
                                  | - faceRecognitionService.ts |
                                  | - reportService.ts          |
                                  | - aiService.ts              |
                                  +--------------+--------------+
                                                 |
                                  +--------------v--------------+
                                  |     Express Server API      |
                                  | - /api/ai/insights          |
                                  | - /api/ai/assistant         |
                                  | - /api/health               |
                                  +--------------+--------------+
                                                 |
                                  +--------------v--------------+
                                  |   Google Gemini 3.8 Flash   |
                                  +-----------------------------+
```

---

## 5. Folder Structure
```
/
├── server.ts                       # Express backend server with Vite middleware & Gemini proxy
├── metadata.json                   # Application metadata and runtime frame permissions
├── index.html                      # HTML entry with Plus Jakarta Sans & JetBrains Mono
├── package.json                    # Dependencies & build scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build settings
├── .env.example                    # Environment variable template
└── src/
    ├── main.tsx                    # React DOM entry point
    ├── App.tsx                     # Main application state orchestrator & view router
    ├── index.css                   # Tailwind CSS styling and font variables
    ├── assets/
    │   └── images/                 # AI-generated studio avatars & hero imagery
    ├── types/
    │   └── index.ts                # TypeScript entity contracts and interfaces
    ├── data/
    │   └── demoData.ts             # Realistic campus datasets (CSE, ECE, IT departments)
    ├── services/
    │   ├── authService.ts          # Session and role-switching service
    │   ├── attendanceService.ts    # Attendance sessions, punches, duplicate prevention
    │   ├── faceRecognitionService.ts # Hardware camera preview & biometric pipeline abstraction
    │   ├── aiService.ts            # Client interface for Gemini intelligence
    │   ├── reportService.ts        # CSV blob exporter and print-to-PDF engine
    │   ├── notificationService.ts  # Notification center state management
    │   └── auditService.ts         # Audit logging ledger
    ├── components/
    │   ├── Navbar.tsx              # Top bar adhering to 3-zone contract
    │   ├── Sidebar.tsx             # Collapsible responsive role navigation
    │   ├── ui/
    │   │   ├── Card.tsx            # Single-elevation card container
    │   │   ├── StatCard.tsx        # Tabular metric card with comparison badge
    │   │   ├── Badge.tsx           # Semantic status indicator
    │   │   ├── Modal.tsx           # Accessible keyboard-navigable modal
    │   │   ├── ConfirmDialog.tsx   # Action confirmation dialog
    │   │   ├── EmptyState.tsx      # Clean fallback placeholder
    │   │   ├── LoadingSkeleton.tsx # Pulse skeleton loader
    │   │   └── Toast.tsx           # Toast notification provider
    │   ├── charts/
    │   │   ├── CircularProgress.tsx # Circular percentage indicator
    │   │   ├── AttendanceLineChart.tsx # Weekly trend with smooth bezier curves
    │   │   ├── AttendanceBarChart.tsx  # Present vs Absent comparative bar chart
    │   │   └── AttendanceDonutChart.tsx # Log distribution donut chart
    │   ├── attendance/
    │   │   ├── FaceRecognitionCamera.tsx # Live camera feed with reticle and 4-phase sequence
    │   │   ├── ManualAttendanceTable.tsx # Manual register table with batch actions
    │   │   ├── AttendanceSessionCard.tsx # State card (Scheduled, Active, Paused, Completed)
    │   │   ├── AttendanceCalendar.tsx    # Interactive calendar with day inspection sheet
    │   │   ├── LowAttendanceAlert.tsx    # Watchlist alert and notification dispatcher
    │   │   └── PredictorCalculator.tsx   # Mathematical eligibility forecaster
    │   ├── ai/
    │   │   ├── AIInsightsPanel.tsx       # Real-time Gemini attendance analytics
    │   │   └── AIAssistantDrawer.tsx     # Grounded natural-language query assistant
    │   └── reports/
    │       └── ReportViewModal.tsx       # Printable official audit ledger & CSV export
    ├── pages/
    │   ├── LandingPage.tsx          # Public product landing page
    │   ├── AuthPages.tsx            # Login, Register, Forgot Password, Reset views
    │   ├── AdminDashboard.tsx       # Administrator console & subviews
    │   ├── FacultyDashboard.tsx     # Faculty classroom studio
    │   ├── StudentDashboard.tsx     # Student transparency dashboard
    │   ├── NotificationsPage.tsx    # Notification center
    │   └── ProfilePage.tsx          # Profile details & system preferences
    └── layouts/
        └── DashboardLayout.tsx      # Responsive workspace wrapper
```

---

## 6. Relational Database Schema

When connecting to production SQL (e.g. PostgreSQL with Drizzle/Prisma):

```sql
-- Users & Credentials
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments
CREATE TABLE departments (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  head_of_department VARCHAR(255) NOT NULL
);

-- Subjects
CREATE TABLE subjects (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  department_id VARCHAR(50) REFERENCES departments(id),
  semester INT NOT NULL,
  credits INT NOT NULL
);

-- Student Profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  department_id VARCHAR(50) REFERENCES departments(id),
  year VARCHAR(50) NOT NULL,
  section VARCHAR(50) NOT NULL,
  face_enrolled BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active'
);

-- Faculty Profiles
CREATE TABLE faculty_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  faculty_id VARCHAR(50) UNIQUE NOT NULL,
  department_id VARCHAR(50) REFERENCES departments(id),
  designation VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active'
);

-- Attendance Sessions
CREATE TABLE attendance_sessions (
  id VARCHAR(100) PRIMARY KEY,
  department_id VARCHAR(50) REFERENCES departments(id),
  subject_id VARCHAR(50) REFERENCES subjects(id),
  faculty_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  start_time VARCHAR(20) NOT NULL,
  end_time VARCHAR(20) NOT NULL,
  state VARCHAR(50) NOT NULL CHECK (state IN ('scheduled', 'active', 'paused', 'completed', 'cancelled')),
  total_enrolled INT DEFAULT 0
);

-- Attendance Records (Audit Ledger)
CREATE TABLE attendance_records (
  id VARCHAR(100) PRIMARY KEY,
  session_id VARCHAR(100) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id VARCHAR(50) NOT NULL,
  roll_number VARCHAR(50) NOT NULL,
  subject_code VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  verification_method VARCHAR(50) NOT NULL CHECK (verification_method IN ('face_recognition', 'manual', 'qr_backup')),
  confidence_score NUMERIC(5, 2),
  marked_by_faculty_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_student_session UNIQUE (session_id, student_id)
);

-- Correction Requests
CREATE TABLE correction_requests (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  subject_code VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  current_status VARCHAR(50) NOT NULL,
  requested_status VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by VARCHAR(255),
  review_comment TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 7. Authentication & RBAC
The system implements role-based access control with three privilege boundaries:
- **Admin**: Full access to institutional settings, student/faculty creation, audit logs, and college-wide analytics.
- **Faculty**: Class attendance lifecycle management, face verification, manual roll marks, and dispute approvals.
- **Student**: Read-only transparency for their own attendance records, calculator forecaster, and correction petitioning.

---

## 8. Attendance Verification Workflows

### Biometric Camera Verification
1. Faculty initiates session for the scheduled class.
2. The browser requests webcam authorization (`requestFramePermissions: ["camera"]`).
3. Video stream mounts onto the live `<video>` element with an animated biometric target bounding reticle.
4. When a student steps into frame, the 4-phase sequence triggers:
   - `Camera Ready`: Confirms 1280x720 video feed.
   - `Scanning Face...`: Simulates landmark detection & 128-d vector embedding extraction.
   - `Face Verified`: Confirms match with confidence score (e.g. 98.4%).
   - `Attendance Marked Successfully`: Records the attendance punch.
5. **Duplicate Prevention**: If the student was already marked in the active session, a warning notifies faculty and prevents duplicate roll punches.

### Manual Register Backup
- Instant table listing all enrolled students with Roll Number, Name, Status, and Timestamp.
- Single-click status toggles: `Present`, `Absent`, `Late`, `Excused`.
- Batch `Mark All Present` with modal confirmation.
- Unsaved changes indicator and confirmation dialog prior to committing updates to the ledger.

---

## 9. Gemini AI Intelligence & Assistant
The application interfaces server-side with Google Gemini 3.8 Flash (`@google/genai` SDK):
1. **Dynamic Attendance Insights (`POST /api/ai/insights`)**:
   - Synthesizes student risk factors, subject engagement variance (e.g. DBMS vs Computer Networks), and faculty attendance punctuality into actionable bullet points.
2. **Authorized AI Assistant (`POST /api/ai/assistant`)**:
   - Natural language assistant embedded in a slide-out drawer.
   - Restricts query responses strictly to data authorized for the logged-in user (e.g. students can only query their own subjects; faculty can query batch-level metrics).
   - If `GEMINI_API_KEY` is not present, deterministic local calculation fallbacks ensure zero app crashes.

---

## 10. Security & Biometric Privacy Policy
1. **Zero-Raw-Image Storage**: Camera frames are processed strictly in memory. The system is designed to store numerical feature embeddings (128-d vectors) rather than raw photographs.
2. **Audit Accountability**: Every manual attendance status change records the faculty identity, timestamp, and device metadata.
3. **Frontend Secret Isolation**: All Gemini SDK invocations run server-side inside `server.ts`; API keys are never exposed in client bundles.

---

## 11. Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/your-username/smart-attendance-system.git
cd smart-attendance-system

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and supply GEMINI_API_KEY if desired

# 4. Start full-stack development server
npm run dev
# Server listening at http://localhost:3000
```

---

## 12. Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for dynamic attendance insights and assistant | Injected by AI Studio |
| `APP_URL` | Hosted application URL | Auto-configured |
| `PORT` | Local server port | `3000` |

---

## 13. API Documentation

### `POST /api/ai/insights`
Generates summarized insights based on current session and department statistics.
- **Request Body**:
  ```json
  {
    "role": "Admin",
    "stats": { ... },
    "context": "Analyze overall attendance trends"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "aiPowered": true,
    "insights": [
      "DBMS maintains 92% attendance engagement.",
      "3 students in CSE-3-2 are below the 75% threshold."
    ]
  }
  ```

### `POST /api/ai/assistant`
Interacts with the natural language attendance assistant.
- **Request Body**:
  ```json
  {
    "query": "How many classes do I need to attend to reach 75%?",
    "userRole": "student",
    "userData": { "name": "Pooja Reddy" },
    "attendanceSummary": { ... }
  }
  ```
- **Response**:
  ```json
  {
    "answer": "You currently need to attend 4 consecutive classes in Computer Networks to reach 75%.",
    "aiPowered": true
  }
  ```

---

## 14. Future Engineering Improvements
- **WebAssembly face-api.js Integration**: Mount client-side TensorFlow/MediaPipe models for local client face vector extraction.
- **Push Notifications & Webhooks**: Integrate Firebase Cloud Messaging or Twilio SMS for automatic parent/guardian notifications when student attendance drops below 70%.
- **QR Code Attendance Token**: Time-synchronized rolling TOTP QR code scanned by student mobile devices as an alternative verification method.

---

## 15. Limitations & Disclaimers
- **Biometric Prototype**: The camera interface uses authentic browser hardware capture (`getUserMedia`). In this demonstration build, facial feature match confirmation is driven by the `faceRecognitionService.ts` abstraction layer. Real production deployments require linking to an external vector embedding index (e.g. pgvector or OpenCV model).
- **Demo Data Indicator**: Pre-seeded students (STU001-STU008) and faculty (FAC001-FAC003) are clearly identified as synthetic demonstration entities for university evaluation purposes.
