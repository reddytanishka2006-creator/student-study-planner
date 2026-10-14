import React, { useState, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  Search, BookOpen, Layers, CheckSquare, GraduationCap, 
  ArrowRight, X, Sparkles, Clock 
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    subjects, 
    units, 
    topics, 
    tasks, 
    exams, 
    setActiveView 
  } = usePlanner();

  const [query, setQuery] = useState('');

  // Shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Results
  const matchedSubjects = q ? subjects.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) : [];
  const matchedUnits = q ? units.filter(u => u.name.toLowerCase().includes(q) || (u.description && u.description.toLowerCase().includes(q))) : [];
  const matchedTopics = q ? topics.filter(t => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) : [];
  const matchedTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) : [];
  const matchedExams = q ? exams.filter(e => e.examName.toLowerCase().includes(q) || (e.notes && e.notes.toLowerCase().includes(q))) : [];

  const totalResults = matchedSubjects.length + matchedUnits.length + matchedTopics.length + matchedTasks.length + matchedExams.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, units, topics, tasks, exams..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!q ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
              <p>Type keywords to search across your whole study system.</p>
              <p className="mt-1 text-[11px] text-slate-400">E.g., "Operating Systems", "Scheduling", "SQL", "Midterm"</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found matching "{query}".
            </div>
          ) : (
            <>
              {/* Subjects */}
              {matchedSubjects.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Subjects ({matchedSubjects.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedSubjects.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveView('subject-detail', s.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">{s.name}</span>
                            <span className="ml-2 font-mono text-[10px] text-slate-400 font-semibold">{s.code}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Units */}
              {matchedUnits.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Units ({matchedUnits.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedUnits.map(u => {
                      const parentSub = subjects.find(s => s.id === u.subjectId);
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            if (parentSub) {
                              setActiveView('subject-detail', parentSub.id);
                            }
                            onClose();
                          }}
                          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-sky-600" />
                            <div>
                              <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">Unit {u.unitNumber}: {u.name}</span>
                              <span className="ml-2 text-[10px] text-slate-400">({parentSub?.name})</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Topics */}
              {matchedTopics.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Topics ({matchedTopics.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedTopics.map(t => {
                      const parentSub = subjects.find(s => s.id === t.subjectId);
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            if (parentSub) {
                              setActiveView('subject-detail', parentSub.id);
                            }
                            onClose();
                          }}
                          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${t.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <div>
                              <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">{t.name}</span>
                              <span className="ml-2 text-[10px] text-slate-400">({parentSub?.name})</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {t.status.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {matchedTasks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Study Tasks ({matchedTasks.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveView('tasks');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">{t.title}</span>
                            <span className="ml-2 text-[10px] text-slate-400">({formatDate(t.date)})</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exams */}
              {matchedExams.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Exams ({matchedExams.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedExams.map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          setActiveView('exams');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <GraduationCap className="w-4 h-4 text-rose-600" />
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">{e.examName}</span>
                            <span className="ml-2 text-[10px] text-slate-400">({formatDate(e.date)})</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                          Exam
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
