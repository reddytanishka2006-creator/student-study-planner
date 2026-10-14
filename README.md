# Student Study Planner 🎓

A modern, responsive, and fully functional web application designed to help university and college students organize their subjects, syllabus units, topics, study tasks, exam deadlines, and overall academic preparation progress in one unified workspace.

Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## 🌟 Key Features & Requirements Matrix

### 1. 🔐 Authentication & Multi-User Isolation
- **Sign Up**: Register with Full Name, Email, Password, and Confirm Password.
- **Login**: Secure login with validation and session persistence in `localStorage`.
- **Logout**: Safe session clearance with confirmation dialog.
- **Forgot Password**: Password reset flow with instant update for registered email.
- **Multi-User Isolation**: Each student's subjects, units, topics, tasks, and exams are stored in a dedicated local namespace (`ssp_data_{userId}`); students cannot access another student's information.
- **Instant Demo Account**: Includes a pre-populated engineering student profile (`Tanishka Sharma`, `tanishka@study.edu` / `password123`) with realistic sample data across 5 computer science courses.

### 2. 🏠 Personalized Dashboard
- **Welcome Banner**: *"Welcome back, Tanishka! 👋"* with major, semester, and study streak badges.
- **7 Core Statistics**:
  - Total Subjects
  - Total Units
  - Total Topics
  - Completed Topics
  - Pending Topics
  - Upcoming Exams
  - Pending Tasks
- **Overall Progress**: Automated progress bar reflecting the exact percentage of completed topics across all enrolled courses.
- **Upcoming Exams**: Cards showing subject name, course code, exam date, days remaining countdown, and live preparation percentage.
- **Today's Tasks**: Quick interactive checklist to toggle task completion with one click.
- **Subject Progress Overview**: Progress breakdown with links to drill down into each course.

### 3. 📚 Subjects
- View all enrolled courses in modern cards with color banners.
- **Add / Edit / Delete Subject** with confirmation dialogs.
- Each subject includes:
  - Subject Name
  - Subject Code (e.g. `CS301`)
  - Description
  - Exam Date
  - Color picker tag
  - Total Units & Topics count
  - Live Preparation Progress (%)
- Clicking any subject opens its dedicated detail page.

### 4. 🗂️ Units
- Create, Edit, and Delete syllabus units within any subject (e.g., *Operating Systems → Unit 1: Introduction, Unit 2: Process Management, Unit 3: Process Synchronization, Unit 4: Memory Management, Unit 5: File Systems*).
- Shows unit progress and topic counts.
- Collapsible unit accordions.

### 5. 📖 Topics
- Add, Edit, and Delete topics within each unit.
- Topic fields:
  - Topic Name
  - Description / notes
  - Priority: `High`, `Medium`, `Low`
  - Status: `Not Started`, `In Progress`, `Completed`
  - Estimated Study Time (hours)
- One-click status cycle or dropdown selector.
- **Automatic Progress Updates**: Changing a topic's status instantly updates the unit progress, subject progress, dashboard metrics, and overall progress, triggering celebration confetti when completed!

### 6. 📝 Study Tasks
- Create specific study sessions (e.g., *"Revise Process Scheduling"*, *"Practice SQL Queries"*, *"Study Deadlocks"*).
- Fields: Task Title, Description, Subject, Unit (cascading), Topic (cascading), Date, Start Time, End Time, Priority, Status.
- Completed tasks are visually distinguished with line-through styling, muted opacity, and green checkmark badges.
- Filtering by Status (`All`, `Pending`, `Completed`), Date (`Today`, `This Week`), Subject, and Priority.

### 7. 📅 Study Schedule & Timetable
- Tabbed views:
  - **Daily Plan**: Table view with Previous/Next Day navigation and "Today" button.
  - **Weekly Schedule**: Overview of all sessions scheduled for the current week.
  - **All Upcoming Tasks**: Comprehensive agenda sorted by date and time.
- Clean timetable display: `Date | Time | Subject | Task | Priority | Status | Action`.

### 8. 🗓️ Exam Tracker & Countdown
- Shows all upcoming and completed exams.
- Displays Subject, Exam Date, Time, Venue, Target Score, and preparation notes.
- **Days Remaining Countdown**:
  - `X days remaining` (e.g., 13 days remaining)
  - `Tomorrow` (1 day remaining)
  - `Today!` (pulsing urgent badge)
  - `Exam Completed` (for past exam dates)
- Live preparation percentage derived directly from the subject's syllabus topics.

### 9. 📊 Progress Analytics
- **Overall Syllabus Progress** gauge.
- **Subject-wise Preparation Breakdown** with color-coded bars.
- **Topic Status Distribution**: Completed, In Progress, Not Started cards.
- **Priority Topic Completion**: Track high-priority topics vs medium/low.
- **Study Hours Analytics**: Completed study hours vs remaining hours.

### 10. 📆 Interactive Calendar
- Full month grid view with days of the week.
- Distinct color-coded events for **Exams** (red/rose) and **Study Tasks** (indigo/emerald).
- **Click Event for Details**: Displays modal with full notes and quick "Mark Done" toggle.
- **Click any Day**: Quickly schedules a study task on that date.
- Previous / Next Month and Today controls.

### 11. 🔍 Global Search & Filtering
- Search modal triggered by the header search bar or `Ctrl + K`.
- Searches across **Subjects**, **Units**, **Topics**, **Tasks**, and **Exams** simultaneously.
- Jump straight to any search result with one click.

### 12. 🔔 Dynamic Notifications & Reminders
- Notification bell with unread badge counter and popover menu:
  - Approaching exams within 7 days (e.g., *"🔔 Operating Systems exam is in 5 days"*).
  - Tasks scheduled for today (e.g., *"🔔 You have 3 tasks due today"*).
  - Overdue tasks from previous days.
  - Unfinished high-priority topics.
- Dismiss individual reminders or clear all.

### 13. 👤 Student Profile
- Displays Name, Email, Major, Semester, Target GPA, Weekly Study Goal, and Avatar.
- Full edit form with real-time saving and avatar selector.

### 14. ⚙️ Settings, Dark Mode & Data Backup
- **Dark Mode / Light Mode**: Smooth theme toggling saved to preference.
- **JSON Backup Export**: Download complete student data as a JSON file.
- **JSON Backup Import**: Restore saved study data from file or text.
- **Reset to Sample Demo Data**: Restore full engineering template at any time.

### 15. ⏱️ Bonus: Pomodoro Focus Timer
- Integrated study timer with 25m Focus, 5m Short Break, and 15m Long Break intervals.
- Links to the active course/task with completion chime and celebration confetti.

---

## 📁 Project Structure

```text
student-study-planner/
├── frontend/                     # React 18 + TypeScript + Vite Client
│   ├── src/                      # UI Components, Context, Pages, Hooks
│   │   ├── components/           # Dashboard, Subjects, Tasks, Schedule, etc.
│   │   ├── context/              # PlannerContext & state management
│   │   ├── data/                 # Seed data and mock stores
│   │   ├── types/                # TypeScript interface definitions
│   │   └── utils/                # Date and schedule utilities
│   ├── public/                   # Static assets & _redirects for SPA routing
│   ├── index.html                # Entry HTML document
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Tailwind CSS styling configuration
│   └── vite.config.ts            # Vite bundler & backend API proxy (/api)
│
├── backend/                      # Node.js + Express REST API & Database
│   ├── data/                     # Database storage
│   │   └── database.json         # JSON database engine with multi-user records
│   ├── db.js                     # Atomic database CRUD operations & seed loader
│   ├── server.js                 # Express server & REST API endpoints
│   ├── package.json              # Backend dependencies (express, cors, dotenv)
│   └── .env.example              # Sample environment configuration
│
├── vercel.json                   # Vercel deployment configuration with SPA rewrites
├── start.bat                     # One-click launcher for Frontend & Backend
├── package.json                  # Root monorepo script runner
└── README.md                     # Documentation
```

---

## 🚀 Running the Project

### Option A: One-Click Launcher (Windows)
Double-click `start.bat` in the project root to automatically launch both the Backend (Port `5000`) and the Frontend (Port `5173`).

### Option B: Terminal Commands

```bash
# In the project root:

# 1. Start the Backend API
npm run start:backend
# -> Runs at http://localhost:5000/

# 2. In a separate terminal, start the Frontend
npm run start:frontend
# -> Runs at http://localhost:5173/
```

### Option C: Build for Production / Deployment

```bash
# Build frontend static bundle ready for deployment
npm run build
# -> Output generated in frontend/dist/
```

---

## 🌐 Deployment Ready Guide

### 1. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: Pre-configured with [vercel.json](file:///c:/student-study-planner/vercel.json) and [frontend/public/_redirects](file:///c:/student-study-planner/frontend/public/_redirects).

### 2. Backend Deployment (Render / Railway / Heroku / Fly.io)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Endpoint**: `/api/health`

---

## 🧪 Demo Credentials

- **Email**: `tanishka@study.edu`
- **Password**: `password123`
*(Or click the "Instant Demo" button on the login screen)*
