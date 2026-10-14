import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  BookOpen, Layers, CheckCircle2, Clock, Calendar, 
  CheckSquare, AlertCircle, ArrowUpRight, Flame, Plus, 
  Sparkles, Timer, ChevronRight, Check
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface DashboardViewProps {
  onOpenQuickAdd: (type: 'subject' | 'task' | 'exam') => void;
  onOpenPomodoro: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQuickAdd,
  onOpenPomodoro,
}) => {
  const { 
    currentUser, 
    totalSubjects, 
    totalUnits, 
    totalTopics, 
    completedTopics, 
    inProgressTopics,
    notStartedTopics,
    pendingTasksCount, 
    overallProgress, 
    upcomingExams, 
    todayTasks,
    subjectsWithStats,
    toggleTaskStatus,
    setActiveView 
  } = usePlanner();

  const pendingTopics = totalTopics - completedTopics;

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-600/10">
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Exam Prep Active • {currentUser?.semester || 'Semester Session'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
              You're making strong academic progress. Keep going! You have <strong className="text-white underline decoration-amber-400 decoration-2">{todayTasks.filter(t => t.status === 'pending').length} tasks</strong> to finish today and upcoming exams on your horizon.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenPomodoro}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs backdrop-blur-md transition-all shadow-sm"
            >
              <Timer className="w-4 h-4 text-rose-300" />
              <span>Start Study Timer</span>
            </button>
            <button
              onClick={() => onOpenQuickAdd('task')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4 text-indigo-700" />
              <span>Add Study Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID (7 Key Metrics from Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        
        {/* Total Subjects */}
        <div 
          onClick={() => setActiveView('subjects')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Subjects</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalSubjects}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-0.5">
            View all <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Total Units */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Units</span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalUnits}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across syllabus</p>
        </div>

        {/* Total Topics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Topics</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalTopics}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Course syllabus</p>
        </div>

        {/* Completed Topics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Completed</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {completedTopics}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Mastered topics</p>
        </div>

        {/* Pending Topics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Topics</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {pendingTopics}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{inProgressTopics} in progress</p>
        </div>

        {/* Upcoming Exams */}
        <div 
          onClick={() => setActiveView('exams')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Upcoming Exams</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {upcomingExams.filter(e => !e.daysRemainingObj.isPast).length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 group-hover:text-rose-600 flex items-center gap-0.5">
            Tracker <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Pending Tasks */}
        <div 
          onClick={() => setActiveView('tasks')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Pending Tasks</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {pendingTasksCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 group-hover:text-indigo-600 flex items-center gap-0.5">
            Open Tasks <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

      </div>

      {/* 3. OVERALL PROGRESS SECTION */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Overall Study Progress
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                {overallProgress}% Completed
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Calculated automatically based on your completed syllabus topics ({completedTopics} of {totalTopics} completed)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{completedTopics} Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{inProgressTopics} Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>{notStartedTopics} Todo</span>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-700 relative shadow-sm"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* 4. TWO-COLUMN LAYOUT: UPCOMING EXAMS & TODAY'S TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: UPCOMING EXAMS (Prompt requirement) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Exams
              </h2>
            </div>
            <button
              onClick={() => setActiveView('exams')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingExams.slice(0, 4).map((exam) => {
              const remaining = exam.daysRemainingObj;
              const isUrgent = remaining.days <= 5 && !remaining.isPast;

              return (
                <div
                  key={exam.id}
                  onClick={() => setActiveView('exams')}
                  className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-md ${
                    isUrgent
                      ? 'border-rose-200 dark:border-rose-900/60 shadow-xs'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: exam.subject?.color || '#6366f1' }}
                        />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {exam.subject?.name || exam.examName}
                        </h3>
                        {exam.subject?.code && (
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {exam.subject.code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Exam Date: {formatDate(exam.date, { month: 'long', includeYear: true })} • {exam.time}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        remaining.isPast
                          ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          : (remaining.days <= 3
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse-subtle'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300')
                      }`}>
                        {remaining.label}
                      </span>
                    </div>
                  </div>

                  {/* Preparation percentage progress bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Preparation Progress</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{exam.preparation}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${exam.preparation}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {upcomingExams.length === 0 && (
              <div className="p-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No upcoming exams scheduled. Click "+ Add Exam" to stay on track.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TODAY'S TASKS (Prompt requirement) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Tasks
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length} Done
              </span>
            </div>

            <button
              onClick={() => onOpenQuickAdd('task')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {todayTasks.map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex items-start gap-3 group ${
                    isDone
                      ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                    }`}
                    title={isDone ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold truncate ${
                        isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                      }`}>
                        {task.title}
                      </span>
                    </div>
                    {task.description && (
                      <p className={`text-xs mt-0.5 line-clamp-1 ${
                        isDone ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.startTime} - {task.endTime}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                        task.priority === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : (task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {todayTasks.length === 0 && (
              <div className="p-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No tasks scheduled for today. Create your study tasks to start!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 5. SUBJECT-WISE PROGRESS SUMMARY (Prompt requirement) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Subject Progress Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Detailed syllabus mastery for each registered course
            </p>
          </div>
          <button
            onClick={() => setActiveView('subjects')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>All Subjects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectsWithStats.map((subject) => (
            <div
              key={subject.id}
              onClick={() => setActiveView('subject-detail', subject.id)}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: subject.color }} 
                  />
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {subject.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                  {subject.progressPercentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${subject.progressPercentage}%`,
                    backgroundColor: subject.color 
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{subject.unitsCount} Units • {subject.topicsCount} Topics</span>
                <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-0.5">
                  View units <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
