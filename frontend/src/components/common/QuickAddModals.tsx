import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Modal } from './Modal';
import { Priority, TaskStatus } from '../../types';
import { getTodayDateString, getRelativeOffsetDate } from '../../utils/dateUtils';

interface QuickAddModalsProps {
  type: 'subject' | 'task' | 'exam' | null;
  onClose: () => void;
  presetDate?: string;
  presetSubjectId?: string;
  presetUnitId?: string;
  presetTopicId?: string;
  presetTopicName?: string;
}

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#0284c7', // Sky
  '#7c3aed', // Purple
  '#059669', // Emerald
  '#ea580c', // Orange
  '#e11d48', // Rose
  '#0891b2', // Cyan
];

export const QuickAddModals: React.FC<QuickAddModalsProps> = ({
  type,
  onClose,
  presetDate,
  presetSubjectId,
  presetUnitId,
  presetTopicId,
  presetTopicName,
}) => {
  const { 
    subjects, 
    units, 
    topics, 
    addSubject, 
    addTask, 
    addExam, 
    setActiveView 
  } = usePlanner();

  // Subject Form State
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subExamDate, setSubExamDate] = useState(getRelativeOffsetDate(14));
  const [subColor, setSubColor] = useState('#4f46e5');
  const [subScore, setSubScore] = useState<number>(90);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState(presetTopicName ? `Study ${presetTopicName}` : '');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskSubId, setTaskSubId] = useState(presetSubjectId || (subjects[0]?.id || ''));
  const [taskUnitId, setTaskUnitId] = useState(presetUnitId || '');
  const [taskTopicId, setTaskTopicId] = useState(presetTopicId || '');
  const [taskDate, setTaskDate] = useState(presetDate || getTodayDateString());
  const [taskStartTime, setTaskStartTime] = useState('10:00');
  const [taskEndTime, setTaskEndTime] = useState('11:30');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');

  // Exam Form State
  const [examSubId, setExamSubId] = useState(subjects[0]?.id || '');
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState(getRelativeOffsetDate(10));
  const [examTime, setExamTime] = useState('10:00 AM - 01:00 PM');
  const [examLocation, setExamLocation] = useState('');
  const [examScore, setExamScore] = useState<number>(90);
  const [examNotes, setExamNotes] = useState('');

  if (!type) return null;

  // 1. CREATE SUBJECT
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;

    const newSub = addSubject({
      name: subName.trim(),
      code: subCode.trim().toUpperCase(),
      description: subDesc.trim(),
      examDate: subExamDate,
      color: subColor,
      icon: 'book',
      targetScore: Number(subScore),
    });

    onClose();
    setActiveView('subject-detail', newSub.id);
  };

  // 2. CREATE STUDY TASK
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskSubId) return;

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      subjectId: taskSubId,
      unitId: taskUnitId || undefined,
      topicId: taskTopicId || undefined,
      date: taskDate,
      startTime: taskStartTime,
      endTime: taskEndTime,
      priority: taskPriority,
      status: 'pending',
    });

    onClose();
  };

  // 3. CREATE EXAM
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !examSubId || !examDate) return;

    addExam({
      subjectId: examSubId,
      examName: examTitle.trim(),
      date: examDate,
      time: examTime.trim(),
      location: examLocation.trim(),
      targetScore: Number(examScore),
      notes: examNotes.trim(),
    });

    onClose();
    setActiveView('exams');
  };

  const filteredUnits = units.filter(u => u.subjectId === taskSubId);
  const filteredTopics = topics.filter(t => t.unitId === taskUnitId);

  return (
    <>
      {/* 1. NEW SUBJECT MODAL */}
      {type === 'subject' && (
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Create New Subject"
          subtitle="Add a syllabus course to organize your units and exams"
        >
          <form onSubmit={handleCreateSubject} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  required
                  placeholder="e.g. Operating Systems"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  required
                  placeholder="e.g. CS301"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                rows={2}
                placeholder="Overview of subject curriculum..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Date *
                </label>
                <input
                  type="date"
                  value={subExamDate}
                  onChange={(e) => setSubExamDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subScore}
                  onChange={(e) => setSubScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Color Tag
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSubColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      subColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                Create Subject
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. NEW STUDY TASK MODAL */}
      {type === 'task' && (
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Create Study Task"
          subtitle="Schedule a topic review or practice session"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                placeholder="e.g. Study Deadlocks & Banker's Algorithm"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Task Details / Notes
              </label>
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                rows={2}
                placeholder="Specific problems, textbook pages, or exercise sets..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <select
                  value={taskSubId}
                  onChange={(e) => {
                    setTaskSubId(e.target.value);
                    setTaskUnitId('');
                    setTaskTopicId('');
                  }}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Course</option>
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
                  value={taskUnitId}
                  onChange={(e) => {
                    setTaskUnitId(e.target.value);
                    setTaskTopicId('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Unit</option>
                  {filteredUnits.map(u => (
                    <option key={u.id} value={u.id}>Unit {u.unitNumber}: {u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic (Optional)
                </label>
                <select
                  value={taskTopicId}
                  onChange={(e) => setTaskTopicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Topic</option>
                  {filteredTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
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
                  value={taskStartTime}
                  onChange={(e) => setTaskStartTime(e.target.value)}
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
                  value={taskEndTime}
                  onChange={(e) => setTaskEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                Add Study Task
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. NEW EXAM MODAL */}
      {type === 'exam' && (
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Schedule New Exam"
          subtitle="Track examination date, location, and countdown"
        >
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Course *
              </label>
              <select
                value={examSubId}
                onChange={(e) => setExamSubId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exam Title *
              </label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                required
                placeholder="e.g. Final Semester Theory Exam"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Date *
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={examTime}
                  onChange={(e) => setExamTime(e.target.value)}
                  placeholder="e.g. 02:00 PM - 05:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hall / Venue
                </label>
                <input
                  type="text"
                  value={examLocation}
                  onChange={(e) => setExamLocation(e.target.value)}
                  placeholder="e.g. Examination Hall 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={examScore}
                  onChange={(e) => setExamScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preparation Notes
              </label>
              <textarea
                value={examNotes}
                onChange={(e) => setExamNotes(e.target.value)}
                rows={2}
                placeholder="High-weightage units or formula sheets needed..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                Schedule Exam
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
