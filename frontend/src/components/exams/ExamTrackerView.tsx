import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Exam } from '../../types';
import { 
  GraduationCap, Plus, Calendar, Clock, MapPin, 
  Target, Edit3, Trash2, ArrowUpRight, CheckCircle2, 
  AlertTriangle, BookOpen, Sparkles
} from 'lucide-react';
import { formatDate, getTodayDateString } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';

interface ExamTrackerViewProps {
  onAddExamClick: () => void;
}

export const ExamTrackerView: React.FC<ExamTrackerViewProps> = ({ onAddExamClick }) => {
  const { 
    upcomingExams, 
    subjects, 
    updateExam, 
    deleteExam, 
    setActiveView 
  } = usePlanner();

  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);

  // Edit form state
  const [subjectId, setSubjectId] = useState('');
  const [examName, setExamName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [targetScore, setTargetScore] = useState<number>(90);
  const [notes, setNotes] = useState('');

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setSubjectId(exam.subjectId);
    setExamName(exam.examName);
    setDate(exam.date);
    setTime(exam.time);
    setLocation(exam.location || '');
    setTargetScore(exam.targetScore || 90);
    setNotes(exam.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;
    updateExam(editingExam.id, {
      subjectId,
      examName: examName.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      targetScore: Number(targetScore),
      notes: notes.trim(),
    });
    setEditingExam(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Exam Tracker & Countdown
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor your exam schedules, days countdown, and live syllabus readiness.
          </p>
        </div>

        <button
          onClick={onAddExamClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Exam</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {upcomingExams.map((exam) => {
          const remaining = exam.daysRemainingObj;
          const subject = exam.subject;
          const isUrgent = remaining.days <= 5 && !remaining.isPast;

          return (
            <div
              key={exam.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between relative overflow-hidden group ${
                isUrgent
                  ? 'border-rose-300 dark:border-rose-900/60'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Top accent bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: subject?.color || '#6366f1' }}
              />

              <div>
                {/* Header line: Subject code, status badge, action buttons */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {subject && (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {subject.code}
                      </span>
                    )}

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      remaining.isPast
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : (remaining.days === 0
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
                            : (remaining.days <= 3
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'))
                    }`}>
                      {remaining.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(exam)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Exam"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingExamId(exam.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subject Name and Exam Name */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {subject?.name || exam.examName}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {exam.examName}
                </p>

                {/* Date and Time Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Exam Date: <strong>{formatDate(exam.date, { month: 'long', includeYear: true })}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Time: <strong>{exam.time}</strong></span>
                  </div>
                  {exam.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.location}</span>
                    </div>
                  )}
                  {exam.targetScore && (
                    <div className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Target Score: <strong>{exam.targetScore}%</strong></span>
                    </div>
                  )}
                </div>

                {exam.notes && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 italic leading-relaxed">
                    “{exam.notes}”
                  </p>
                )}
              </div>

              {/* Bottom: Preparation Progress */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Preparation:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{exam.preparation}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${exam.preparation}%`, 
                      backgroundColor: subject?.color || '#6366f1' 
                    }}
                  />
                </div>

                {subject && (
                  <button
                    onClick={() => setActiveView('subject-detail', subject.id)}
                    className="w-full mt-2 pt-2 flex items-center justify-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>View Subject Syllabus & Topics</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {upcomingExams.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <GraduationCap className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No exams configured</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your upcoming midterms and finals to stay organized and receive early reminders.
            </p>
          </div>
        )}
      </div>

      {/* EDIT EXAM MODAL */}
      {editingExam && (
        <Modal
          isOpen={!!editingExam}
          onClose={() => setEditingExam(null)}
          title="Edit Exam Schedule"
          subtitle="Update exam date, time, and preparation notes"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
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
                Exam Name / Type *
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
                placeholder="e.g. Mid-Term Theory Examination"
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 01:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hall / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hall 304"
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
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Study / Syllabus Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Important units to focus on..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingExam(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                Save Exam Details
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingExamId}
        onClose={() => setDeletingExamId(null)}
        onConfirm={() => {
          if (deletingExamId) {
            deleteExam(deletingExamId);
            setDeletingExamId(null);
          }
        }}
        title="Delete Exam"
        message="Are you sure you want to remove this exam from your tracker?"
        confirmLabel="Yes, Delete Exam"
      />

    </div>
  );
};
