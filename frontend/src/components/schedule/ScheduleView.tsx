import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { StudyTask } from '../../types';
import { 
  Calendar, Clock, CheckCircle2, Circle, ChevronLeft, 
  ChevronRight, CalendarDays, Filter, BookOpen, Check
} from 'lucide-react';
import { formatDate, getTodayDateString, isDateToday, isDateThisWeek, parseDate, getRelativeOffsetDate } from '../../utils/dateUtils';

export const ScheduleView: React.FC = () => {
  const { tasks, subjects, toggleTaskStatus } = usePlanner();
  
  const [tab, setTab] = useState<'today' | 'weekly' | 'upcoming'>('today');
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  const targetDateStr = getRelativeOffsetDate(selectedDayOffset);

  // Grouped datasets
  const todayTasks = tasks.filter(t => isDateToday(t.date));
  const weeklyTasks = tasks.filter(t => isDateThisWeek(t.date)).sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const upcomingTasks = tasks.filter(t => t.date >= getTodayDateString()).sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  // Current day tasks for today tab navigation
  const currentDayTasks = tasks
    .filter(t => t.date === targetDateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const renderTaskTable = (taskList: StudyTask[]) => {
    return (
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Study Task</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {taskList.map((task) => {
              const subject = subjects.find(s => s.id === task.subjectId);
              const isDone = task.status === 'completed';

              return (
                <tr 
                  key={task.id} 
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    isDone ? 'bg-emerald-50/10 dark:bg-emerald-950/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {formatDate(task.date, { month: 'short', includeYear: true })}
                    {isDateToday(task.date) && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
                        Today
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {task.startTime} - {task.endTime}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {subject ? (
                      <span 
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-white font-bold text-[11px]"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.name}
                      </span>
                    ) : (
                      <span className="text-slate-400">General</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      <span className={isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                        {task.title}
                      </span>
                    </div>
                    {task.description && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      task.priority === 'high'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        : (task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')
                    }`}>
                      {task.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {isDone ? 'Completed' : 'Pending'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                        isDone
                          ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isDone ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </td>
                </tr>
              );
            })}

            {taskList.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No study sessions scheduled for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Schedule & Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured daily and weekly agenda to manage study hours effectively.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setTab('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'today'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Daily Plan
          </button>
          <button
            onClick={() => setTab('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'weekly'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'upcoming'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Upcoming
          </button>
        </div>
      </div>

      {/* Date Navigator (Visible for Daily Plan) */}
      {tab === 'today' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <button
            onClick={() => setSelectedDayOffset(prev => prev - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Day</span>
          </button>

          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {formatDate(targetDateStr, { month: 'long', includeYear: true })}
            </h3>
            <p className="text-[11px] text-slate-400">
              {selectedDayOffset === 0 ? 'Today' : (selectedDayOffset === 1 ? 'Tomorrow' : (selectedDayOffset === -1 ? 'Yesterday' : `${selectedDayOffset} days offset`))}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedDayOffset !== 0 && (
              <button
                onClick={() => setSelectedDayOffset(0)}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold"
              >
                Today
              </button>
            )}
            <button
              onClick={() => setSelectedDayOffset(prev => prev + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span>Next Day</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RENDER TABLE ACCORDING TO ACTIVE TAB */}
      <div>
        {tab === 'today' && renderTaskTable(currentDayTasks)}
        {tab === 'weekly' && renderTaskTable(weeklyTasks)}
        {tab === 'upcoming' && renderTaskTable(upcomingTasks)}
      </div>

    </div>
  );
};
