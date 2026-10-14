import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { ActiveView } from '../../types';
import { 
  LayoutDashboard, BookOpen, CheckSquare, CalendarDays, 
  GraduationCap, BarChart3, User, Settings, LogOut, 
  Sparkles, CheckCircle2, ChevronRight, X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenConfirmLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  onOpenConfirmLogout,
}) => {
  const { 
    activeView, 
    setActiveView, 
    overallProgress, 
    completedTopics, 
    totalTopics,
    pendingTasksCount
  } = usePlanner();

  const navItems: { view: ActiveView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'subjects', label: 'Subjects', icon: BookOpen },
    { view: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { view: 'schedule', label: 'Schedule', icon: CalendarDays },
    { view: 'exams', label: 'Exams', icon: GraduationCap },
    { view: 'progress', label: 'Progress', icon: BarChart3 },
    { view: 'calendar', label: 'Calendar', icon: CalendarDays },
    { view: 'profile', label: 'Profile', icon: User },
    { view: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view, null);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full justify-between p-4 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors">
      <div>
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between pb-4 mb-2 lg:hidden border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-white">Study Planner</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Academic Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view || (item.view === 'subjects' && activeView === 'subject-detail');

            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Widget & Logout */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
        {/* Quick Overall Progress card */}
        <div 
          onClick={() => handleNavClick('progress')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-800/60 dark:to-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/40 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Syllabus Completion
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {overallProgress}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span>{completedTopics} of {totalTopics} topics</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={onOpenConfirmLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
