import React, { useState, useRef, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  Bell, Sun, Moon, Search, Plus, Timer, GraduationCap, 
  Menu, X, Check, Calendar, BookOpen, CheckSquare, 
  LogOut, User as UserIcon, Settings, ChevronDown, Sparkles
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenPomodoro: () => void;
  onOpenQuickAdd: (type: 'subject' | 'task' | 'exam') => void;
  onOpenGlobalSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onOpenPomodoro,
  onOpenQuickAdd,
  onOpenGlobalSearch,
}) => {
  const { 
    currentUser, 
    logout, 
    isDarkMode, 
    toggleDarkMode, 
    notifications, 
    unreadNotificationCount,
    markNotificationAsRead,
    clearAllNotifications,
    setActiveView 
  } = usePlanner();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (addRef.current && !addRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      
      {/* Left side: Mobile menu toggle + Logo Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Study Planner
            </span>
            <span className="ml-2 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
              Pro
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Global Quick Search Button / Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search subjects, topics, tasks, exams...</span>
          </div>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        
        {/* Mobile search icon */}
        <button
          onClick={onOpenGlobalSearch}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl md:hidden"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Pomodoro Focus Timer button */}
        <button
          onClick={onOpenPomodoro}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl border border-rose-200 dark:border-rose-900/40 transition-colors shadow-xs"
          title="Focus Pomodoro Timer"
        >
          <Timer className="w-4 h-4 animate-pulse-subtle" />
          <span className="hidden sm:inline">Focus Timer</span>
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative" ref={addRef}>
          <button
            onClick={() => setShowAddMenu(prev => !prev)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
            title="Create New"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
              <button
                onClick={() => { setShowAddMenu(false); onOpenQuickAdd('task'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>New Study Task</span>
              </button>
              <button
                onClick={() => { setShowAddMenu(false); onOpenQuickAdd('subject'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>New Subject</span>
              </button>
              <button
                onClick={() => { setShowAddMenu(false); onOpenQuickAdd('exam'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>New Exam Date</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(prev => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Notifications & Reminders"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Reminders & Alerts ({notifications.length})
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <Sparkles className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                    You are all caught up! No pending alerts.
                  </div>
                ) : (
                  notifications.map(item => (
                    <div 
                      key={item.id} 
                      className="py-2.5 flex items-start justify-between gap-2 text-xs group hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                          {item.message}
                        </p>
                      </div>
                      <button
                        onClick={() => markNotificationAsRead(item.id)}
                        className="text-slate-300 hover:text-emerald-500 p-1 transition-colors"
                        title="Dismiss"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Avatar / Menu */}
        <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.charAt(0) || 'S'}
              </div>
            )}
            <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
              {currentUser?.name?.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden md:inline" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setShowProfileMenu(false); setActiveView('profile'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); setActiveView('settings'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Settings & Backup</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => { setShowProfileMenu(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
