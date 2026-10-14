import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { StudyTask, Priority, TaskStatus } from '../../types';
import { 
  CheckSquare, Plus, Search, Calendar, Clock, BookOpen, 
  Filter, Check, Trash2, Edit3, Sparkles, AlertCircle, X
} from 'lucide-react';
import { formatDate, getTodayDateString, isDateToday, isDateThisWeek } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';

interface TasksViewProps {
  onAddTaskClick: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onAddTaskClick }) => {
  const { 
    tasks, 
    subjects, 
    units, 
    topics, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus 
  } = usePlanner();

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Edit task state
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Form states for edit
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editUnitId, setEditUnitId] = useState('');
  const [editTopicId, setEditTopicId] = useState('');
  const [editDate, setEditDate] = useState(getTodayDateString());
  const [editStartTime, setEditStartTime] = useState('10:00');
  const [editEndTime, setEditEndTime] = useState('11:30');
  const [editPriority, setEditPriority] = useState<Priority>('medium');
  const [editStatus, setEditStatus] = useState<TaskStatus>('pending');

  const openEditModal = (task: StudyTask) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditSubjectId(task.subjectId);
    setEditUnitId(task.unitId || '');
    setEditTopicId(task.topicId || '');
    setEditDate(task.date);
    setEditStartTime(task.startTime);
    setEditEndTime(task.endTime);
    setEditPriority(task.priority);
    setEditStatus(task.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    updateTask(editingTask.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      subjectId: editSubjectId,
      unitId: editUnitId || undefined,
      topicId: editTopicId || undefined,
      date: editDate,
      startTime: editStartTime,
      endTime: editEndTime,
      priority: editPriority,
      status: editStatus,
    });
    setEditingTask(null);
  };

  // Filter logic
  const filteredTasks = tasks.filter(t => {
    // Search
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Status
    if (statusFilter !== 'all' && t.status !== statusFilter) {
      return false;
    }
    // Date
    if (dateFilter === 'today' && !isDateToday(t.date)) {
      return false;
    }
    if (dateFilter === 'week' && !isDateThisWeek(t.date)) {
      return false;
    }
    // Subject
    if (subjectFilter !== 'all' && t.subjectId !== subjectFilter) {
      return false;
    }
    // Priority
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  const availableUnitsForEdit = units.filter(u => u.subjectId === editSubjectId);
  const availableTopicsForEdit = topics.filter(top => top.unitId === editUnitId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize study sessions, revision goals, numerical practice, and syllabus milestones.
          </p>
        </div>

        <button
          onClick={onAddTaskClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Tasks</option>
              <option value="completed">Completed Tasks</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Any Date</option>
              <option value="today">Scheduled for Today</option>
              <option value="week">Scheduled this Week</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

        </div>

        {/* Active filter count & clear button */}
        {(search || statusFilter !== 'all' || dateFilter !== 'all' || subjectFilter !== 'all' || priorityFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Showing {filteredTasks.length} filtered tasks</span>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setDateFilter('all');
                setSubjectFilter('all');
                setPriorityFilter('all');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';
          const subject = subjects.find(s => s.id === task.subjectId);
          const unit = units.find(u => u.id === task.unitId);
          const topic = topics.find(t => t.id === task.topicId);

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                isDone
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200/80 dark:border-emerald-900/40 opacity-75 hover:opacity-100'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md hover:border-indigo-400'
              }`}
            >
              {/* Left: Checkbox + Content */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                  }`}
                  title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                >
                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm sm:text-base font-bold ${
                      isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>

                    {/* Subject badge */}
                    {subject && (
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white shrink-0"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.code}
                      </span>
                    )}

                    {/* Priority badge */}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      task.priority === 'high'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        : (task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className={`text-xs mt-1 leading-relaxed ${
                      isDone ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {task.description}
                    </p>
                  )}

                  {/* Context: Unit / Topic / Schedule */}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(task.date, { month: 'short', includeYear: true })}
                      {isDateToday(task.date) && (
                        <span className="ml-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          (Today)
                        </span>
                      )}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {task.startTime} - {task.endTime}
                    </span>

                    {unit && (
                      <span className="truncate max-w-xs">
                        Unit {unit.unitNumber}: {unit.name}
                      </span>
                    )}

                    {topic && (
                      <span className="truncate max-w-xs font-medium text-indigo-600 dark:text-indigo-400">
                        Topic: {topic.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  onClick={() => openEditModal(task)}
                  className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingTaskId(task.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <CheckSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No tasks match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add a new task or adjust your filters above.
            </p>
          </div>
        )}
      </div>

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <Modal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          title="Edit Study Task"
          subtitle="Update task schedule or details"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Cascading Subject -> Unit -> Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <select
                  value={editSubjectId}
                  onChange={(e) => {
                    setEditSubjectId(e.target.value);
                    setEditUnitId('');
                    setEditTopicId('');
                  }}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit (Optional)
                </label>
                <select
                  value={editUnitId}
                  onChange={(e) => {
                    setEditUnitId(e.target.value);
                    setEditTopicId('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Unit</option>
                  {availableUnitsForEdit.map(u => (
                    <option key={u.id} value={u.id}>Unit {u.unitNumber}: {u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic (Optional)
                </label>
                <select
                  value={editTopicId}
                  onChange={(e) => setEditTopicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Topic</option>
                  {availableTopicsForEdit.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Times */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                Save Task Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={() => {
          if (deletingTaskId) {
            deleteTask(deletingTaskId);
            setDeletingTaskId(null);
          }
        }}
        title="Delete Study Task"
        message="Are you sure you want to delete this study task?"
        confirmLabel="Yes, Delete Task"
      />

    </div>
  );
};
