import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { StudyTask, Exam } from '../../types';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, GraduationCap, CheckSquare, Plus, X, 
  MapPin, Check, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { formatDate, getTodayDateString, parseDate } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';

export const CalendarView: React.FC<{ onAddTaskOnDate?: (dateStr: string) => void }> = ({ onAddTaskOnDate }) => {
  const { tasks, exams, subjects, toggleTaskStatus } = usePlanner();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<{
    type: 'task' | 'exam';
    task?: StudyTask;
    exam?: Exam;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Total grid cells = (leading days + month days + trailing days to complete rows)
  const calendarCells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

  // Leading days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
      isToday: dateStr === getTodayDateString(),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: dateStr === getTodayDateString(),
    });
  }

  // Trailing days
  const remainingCells = 35 - calendarCells.length;
  const trailingCount = remainingCells >= 0 ? remainingCells : (42 - calendarCells.length);
  for (let d = 1; d <= trailingCount; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
      isToday: dateStr === getTodayDateString(),
    });
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visual schedule of upcoming exam dates, deadlines, and planned study sessions.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 px-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Exams & Tests</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span>Pending Study Tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Completed Tasks</span>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 bg-slate-50/60 dark:bg-slate-800/40">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/60">
          {calendarCells.map((cell) => {
            const dayTasks = tasks.filter(t => t.date === cell.dateStr);
            const dayExams = exams.filter(e => e.date === cell.dateStr);

            return (
              <div
                key={cell.dateStr}
                onClick={() => onAddTaskOnDate && onAddTaskOnDate(cell.dateStr)}
                className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors group cursor-pointer ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/40 dark:bg-slate-950/40 text-slate-300 dark:text-slate-600'
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                } ${cell.isToday ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''}`}
              >
                {/* Top: Day Number & Add button */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    cell.isToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : (cell.isCurrentMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400')
                  }`}>
                    {cell.dayNum}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddTaskOnDate) onAddTaskOnDate(cell.dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-opacity"
                    title={`Add task for ${cell.dateStr}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Event chips */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  
                  {/* Exams */}
                  {dayExams.map((exam) => {
                    const subject = subjects.find(s => s.id === exam.subjectId);
                    return (
                      <div
                        key={exam.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent({ type: 'exam', exam });
                        }}
                        className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 text-[10px] font-bold truncate flex items-center gap-1 shadow-2xs hover:scale-[1.02] transition-transform"
                        title={`Exam: ${exam.examName}`}
                      >
                        <GraduationCap className="w-2.5 h-2.5 shrink-0 text-rose-600 dark:text-rose-400" />
                        <span className="truncate">{subject?.code || ''} Exam</span>
                      </div>
                    );
                  })}

                  {/* Tasks */}
                  {dayTasks.map((task) => {
                    const isDone = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent({ type: 'task', task });
                        }}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate flex items-center gap-1 transition-all ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 line-through opacity-75'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                        }`}
                        title={task.title}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isDone ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}
                </div>

                <div />
              </div>
            );
          })}
        </div>
      </div>

      {/* EVENT DETAIL MODAL (Prompt Requirement: Clicking an event should show its details) */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.type === 'exam' ? 'Exam Details' : 'Task Details'}
          subtitle={formatDate(selectedEvent.type === 'exam' ? selectedEvent.exam!.date : selectedEvent.task!.date, { month: 'long', includeYear: true })}
        >
          {selectedEvent.type === 'exam' && selectedEvent.exam && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                    {selectedEvent.exam.examName}
                  </h4>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                  Subject: {subjects.find(s => s.id === selectedEvent.exam?.subjectId)?.name || 'General'}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Time: <strong>{selectedEvent.exam.time}</strong></span>
                </div>
                {selectedEvent.exam.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Venue: <strong>{selectedEvent.exam.location}</strong></span>
                  </div>
                )}
                {selectedEvent.exam.notes && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mt-2 text-slate-700 dark:text-slate-300 italic">
                    "{selectedEvent.exam.notes}"
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {selectedEvent.type === 'task' && selectedEvent.task && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                    {selectedEvent.task.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedEvent.task.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedEvent.task.status}
                  </span>
                </div>
                {selectedEvent.task.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    {selectedEvent.task.description}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Time: <strong>{selectedEvent.task.startTime} - {selectedEvent.task.endTime}</strong></span>
                </div>
                <div>
                  Priority: <strong className="capitalize">{selectedEvent.task.priority}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (selectedEvent.task) {
                      toggleTaskStatus(selectedEvent.task.id);
                      setSelectedEvent(null);
                    }
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
                    selectedEvent.task.status === 'completed'
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {selectedEvent.task.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}
                </button>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

    </div>
  );
};
