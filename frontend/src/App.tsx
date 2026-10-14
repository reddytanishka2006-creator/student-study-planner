import React, { useState } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { AuthView } from './components/auth/AuthView';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { SubjectDetailView } from './components/subjects/SubjectDetailView';
import { TasksView } from './components/tasks/TasksView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { ExamTrackerView } from './components/exams/ExamTrackerView';
import { ProgressView } from './components/progress/ProgressView';
import { CalendarView } from './components/calendar/CalendarView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { QuickAddModals } from './components/common/QuickAddModals';
import { PomodoroModal } from './components/pomodoro/PomodoroModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ConfirmModal } from './components/common/ConfirmModal';

const AppContent: React.FC = () => {
  const { 
    isAuthenticated, 
    currentUser, 
    activeView, 
    setActiveView, 
    logout 
  } = usePlanner();

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global modals state
  const [quickAddType, setQuickAddType] = useState<'subject' | 'task' | 'exam' | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Preset quick add parameters (e.g. from calendar or topic detail)
  const [presetDate, setPresetDate] = useState<string | undefined>();
  const [presetSubjectId, setPresetSubjectId] = useState<string | undefined>();
  const [presetUnitId, setPresetUnitId] = useState<string | undefined>();
  const [presetTopicId, setPresetTopicId] = useState<string | undefined>();
  const [presetTopicName, setPresetTopicName] = useState<string | undefined>();

  // If user is not authenticated, render AuthView (Sign In / Sign Up / Forgot Password)
  if (!isAuthenticated || !currentUser) {
    return <AuthView />;
  }

  const handleOpenQuickAdd = (type: 'subject' | 'task' | 'exam') => {
    setPresetDate(undefined);
    setPresetSubjectId(undefined);
    setPresetUnitId(undefined);
    setPresetTopicId(undefined);
    setPresetTopicName(undefined);
    setQuickAddType(type);
  };

  const handleAddTaskOnDate = (dateStr: string) => {
    setPresetDate(dateStr);
    setPresetSubjectId(undefined);
    setPresetUnitId(undefined);
    setPresetTopicId(undefined);
    setPresetTopicName(undefined);
    setQuickAddType('task');
  };

  const handleAddTaskForTopic = (subId: string, unitId: string, topId: string, topName: string) => {
    setPresetDate(undefined);
    setPresetSubjectId(subId);
    setPresetUnitId(unitId);
    setPresetTopicId(topId);
    setPresetTopicName(topName);
    setQuickAddType('task');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenQuickAdd={handleOpenQuickAdd}
        onOpenGlobalSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenConfirmLogout={() => setIsLogoutConfirmOpen(true)}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeView === 'dashboard' && (
            <DashboardView
              onOpenQuickAdd={handleOpenQuickAdd}
              onOpenPomodoro={() => setIsPomodoroOpen(true)}
            />
          )}

          {activeView === 'subjects' && (
            <SubjectsView
              onAddSubjectClick={() => handleOpenQuickAdd('subject')}
            />
          )}

          {activeView === 'subject-detail' && (
            <SubjectDetailView
              onBack={() => setActiveView('subjects')}
              onAddTaskForTopic={handleAddTaskForTopic}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView
              onAddTaskClick={() => handleOpenQuickAdd('task')}
            />
          )}

          {activeView === 'schedule' && (
            <ScheduleView />
          )}

          {activeView === 'exams' && (
            <ExamTrackerView
              onAddExamClick={() => handleOpenQuickAdd('exam')}
            />
          )}

          {activeView === 'progress' && (
            <ProgressView />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              onAddTaskOnDate={handleAddTaskOnDate}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView />
          )}

          {activeView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* GLOBAL MODALS */}
      <QuickAddModals
        type={quickAddType}
        onClose={() => setQuickAddType(null)}
        presetDate={presetDate}
        presetSubjectId={presetSubjectId}
        presetUnitId={presetUnitId}
        presetTopicId={presetTopicId}
        presetTopicName={presetTopicName}
      />

      <PomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          logout();
          setIsLogoutConfirmOpen(false);
        }}
        title="Confirm Log Out"
        message="Are you sure you want to log out of your student study session?"
        confirmLabel="Log Out"
        isDanger={true}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlannerProvider>
      <AppContent />
    </PlannerProvider>
  );
};

export default App;
