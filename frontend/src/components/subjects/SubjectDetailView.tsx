import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Unit, Topic, Priority, TopicStatus } from '../../types';
import { 
  ArrowLeft, Plus, Layers, BookOpen, Clock, Calendar, 
  CheckCircle2, Circle, AlertCircle, Edit3, Trash2, 
  ChevronDown, ChevronUp, Sparkles, Check, CheckSquare
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';

interface SubjectDetailViewProps {
  onBack: () => void;
  onAddTaskForTopic?: (subjectId: string, unitId: string, topicId: string, topicName: string) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({ 
  onBack,
  onAddTaskForTopic,
}) => {
  const { 
    selectedSubjectId, 
    getSubjectById, 
    getSubjectStats, 
    getUnitsBySubject, 
    getTopicsByUnit, 
    addUnit, 
    updateUnit, 
    deleteUnit, 
    addTopic, 
    updateTopic, 
    deleteTopic, 
    setTopicStatus 
  } = usePlanner();

  const subject = selectedSubjectId ? getSubjectById(selectedSubjectId) : undefined;
  const stats = selectedSubjectId ? getSubjectStats(selectedSubjectId) : null;
  const units = selectedSubjectId ? getUnitsBySubject(selectedSubjectId) : [];

  // Collapsed units tracking
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  // Unit Modals
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deletingUnitId, setDeletingUnitId] = useState<string | null>(null);
  const [unitNumber, setUnitNumber] = useState<number>(1);
  const [unitName, setUnitName] = useState('');
  const [unitDescription, setUnitDescription] = useState('');

  // Topic Modals
  const [targetUnitForTopic, setTargetUnitForTopic] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  // Topic Form State
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [topicPriority, setTopicPriority] = useState<Priority>('medium');
  const [topicStatus, setTopicStatusForm] = useState<TopicStatus>('not_started');
  const [topicHours, setTopicHours] = useState<number>(2.0);

  if (!subject || !stats) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">Subject not found.</p>
        <button
          onClick={onBack}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Subjects
        </button>
      </div>
    );
  }

  const toggleCollapse = (unitId: string) => {
    setCollapsedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Unit handlers
  const handleOpenAddUnit = () => {
    setUnitNumber(units.length + 1);
    setUnitName('');
    setUnitDescription('');
    setIsAddUnitOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUnit) {
      updateUnit(editingUnit.id, {
        unitNumber: Number(unitNumber),
        name: unitName.trim(),
        description: unitDescription.trim(),
      });
      setEditingUnit(null);
    } else {
      addUnit({
        subjectId: subject.id,
        unitNumber: Number(unitNumber),
        name: unitName.trim(),
        description: unitDescription.trim(),
      });
      setIsAddUnitOpen(false);
    }
  };

  // Topic handlers
  const handleOpenAddTopic = (unitId: string) => {
    setTargetUnitForTopic(unitId);
    setTopicName('');
    setTopicDescription('');
    setTopicPriority('medium');
    setTopicStatusForm('not_started');
    setTopicHours(2.0);
  };

  const handleOpenEditTopic = (t: Topic) => {
    setEditingTopic(t);
    setTopicName(t.name);
    setTopicDescription(t.description || '');
    setTopicPriority(t.priority);
    setTopicStatusForm(t.status);
    setTopicHours(t.estimatedHours || 1.5);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTopic) {
      updateTopic(editingTopic.id, {
        name: topicName.trim(),
        description: topicDescription.trim(),
        priority: topicPriority,
        status: topicStatus,
        estimatedHours: Number(topicHours),
      });
      setEditingTopic(null);
    } else if (targetUnitForTopic) {
      addTopic({
        subjectId: subject.id,
        unitId: targetUnitForTopic,
        name: topicName.trim(),
        description: topicDescription.trim(),
        priority: topicPriority,
        status: topicStatus,
        estimatedHours: Number(topicHours),
      });
      setTargetUnitForTopic(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Subjects</span>
        </button>

        <button
          onClick={handleOpenAddUnit}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Unit</span>
        </button>
      </div>

      {/* Subject Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Accent strip */}
        <div 
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: subject.color }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {subject.code}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                Exam: {formatDate(subject.examDate, { month: 'long', includeYear: true })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {subject.name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {subject.description || 'No description provided.'}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-center px-2">
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {stats.unitsCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">Units</div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {stats.topicsCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">Topics</div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.progressPercentage}%
              </div>
              <div className="text-[11px] font-semibold text-slate-400">Preparation</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Syllabus Completion ({stats.completedTopics} of {stats.topicsCount} topics mastered)
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {stats.progressPercentage}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%`, backgroundColor: subject.color }}
            />
          </div>
        </div>
      </div>

      {/* UNITS & TOPICS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Course Units & Topics</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {units.length} syllabus {units.length === 1 ? 'unit' : 'units'}
          </span>
        </div>

        {/* Units List */}
        <div className="space-y-4">
          {units.map((unit) => {
            const unitTopics = getTopicsByUnit(unit.id);
            const unitCompleted = unitTopics.filter(t => t.status === 'completed').length;
            const unitProgress = unitTopics.length > 0 ? Math.round((unitCompleted / unitTopics.length) * 100) : 0;
            const isCollapsed = !!collapsedUnits[unit.id];

            return (
              <div
                key={unit.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                {/* Unit Header Bar */}
                <div 
                  onClick={() => toggleCollapse(unit.id)}
                  className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      U{unit.unitNumber}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        Unit {unit.unitNumber} – {unit.name}
                      </h3>
                      {unit.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {unit.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Unit Progress Ring / Pill */}
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-indigo-600 transition-all"
                          style={{ width: `${unitProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {unitProgress}%
                      </span>
                    </div>

                    <span className="text-xs text-slate-400">
                      {unitCompleted}/{unitTopics.length} Topics
                    </span>

                    {/* Unit actions */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setEditingUnit(unit);
                          setUnitNumber(unit.unitNumber);
                          setUnitName(unit.name);
                          setUnitDescription(unit.description || '');
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Edit Unit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingUnitId(unit.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Delete Unit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Topics Container */}
                {!isCollapsed && (
                  <div className="p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800/80">
                    <div className="flex items-center justify-between pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Unit Topics ({unitTopics.length})
                      </span>
                      <button
                        onClick={() => handleOpenAddTopic(unit.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Topic</span>
                      </button>
                    </div>

                    {/* Topics List Items */}
                    <div className="space-y-2.5 pt-3">
                      {unitTopics.map((topic) => {
                        const isDone = topic.status === 'completed';
                        const isInProgress = topic.status === 'in_progress';

                        return (
                          <div
                            key={topic.id}
                            className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isDone
                                ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200/80 dark:border-emerald-900/40'
                                : (isInProgress
                                    ? 'bg-amber-50/20 dark:bg-amber-950/10 border-amber-200/80 dark:border-amber-900/40'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800')
                            }`}
                          >
                            {/* Left: Topic Status toggle button + Name */}
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              {/* One-click status cycle button */}
                              <button
                                onClick={() => {
                                  const nextStatus: TopicStatus = 
                                    topic.status === 'not_started' ? 'in_progress' :
                                    topic.status === 'in_progress' ? 'completed' : 'not_started';
                                  setTopicStatus(topic.id, nextStatus);
                                }}
                                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                                  isDone
                                    ? 'bg-emerald-500 text-white shadow-xs'
                                    : (isInProgress
                                        ? 'bg-amber-500 text-white shadow-xs'
                                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500')
                                }`}
                                title={`Current: ${topic.status.replace('_', ' ')} (Click to toggle)`}
                              >
                                {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                                {isInProgress && <Clock className="w-3.5 h-3.5" />}
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className={`text-sm font-bold ${
                                    isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                                  }`}>
                                    {topic.name}
                                  </h4>

                                  {/* Priority Badge */}
                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                    topic.priority === 'high'
                                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                      : (topic.priority === 'medium'
                                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')
                                  }`}>
                                    {topic.priority} Priority
                                  </span>

                                  {/* Estimated study time */}
                                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {topic.estimatedHours}h study
                                  </span>
                                </div>

                                {topic.description && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                    {topic.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Right: Status Dropdown + Actions */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {/* Status Dropdown */}
                              <select
                                value={topic.status}
                                onChange={(e) => setTopicStatus(topic.id, e.target.value as TopicStatus)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition-colors ${
                                  isDone
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : (isInProgress
                                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700')
                                }`}
                              >
                                <option value="not_started">Not Started</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>

                              {/* Quick Plan Study Task button */}
                              {onAddTaskForTopic && (
                                <button
                                  onClick={() => onAddTaskForTopic(subject.id, unit.id, topic.id, topic.name)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Plan a study task for this topic"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Edit topic */}
                              <button
                                onClick={() => handleOpenEditTopic(topic)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Topic"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete topic */}
                              <button
                                onClick={() => setDeletingTopicId(topic.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Delete Topic"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {unitTopics.length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                          No topics added to this unit yet. Click "+ Add Topic" above.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {units.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Layers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No units created yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Break down {subject.name} into syllabus units (e.g. Unit 1: Introduction, Unit 2: Process Management).
              </p>
              <button
                onClick={handleOpenAddUnit}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Create First Unit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT UNIT */}
      {(isAddUnitOpen || editingUnit) && (
        <Modal
          isOpen={isAddUnitOpen || !!editingUnit}
          onClose={() => { setIsAddUnitOpen(false); setEditingUnit(null); }}
          title={editingUnit ? 'Edit Unit' : 'Add Unit'}
          subtitle={`Under ${subject.name}`}
        >
          <form onSubmit={handleSaveUnit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Number *
                </label>
                <input
                  type="number"
                  min="1"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Title *
                </label>
                <input
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  required
                  placeholder="e.g. Process Management"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={unitDescription}
                onChange={(e) => setUnitDescription(e.target.value)}
                rows={2}
                placeholder="Key concepts covered in this unit..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setIsAddUnitOpen(false); setEditingUnit(null); }}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                {editingUnit ? 'Save Unit' : 'Create Unit'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: ADD / EDIT TOPIC */}
      {(targetUnitForTopic || editingTopic) && (
        <Modal
          isOpen={!!targetUnitForTopic || !!editingTopic}
          onClose={() => { setTargetUnitForTopic(null); setEditingTopic(null); }}
          title={editingTopic ? 'Edit Topic' : 'Add Topic'}
          subtitle={`Under ${subject.name}`}
        >
          <form onSubmit={handleSaveTopic} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Topic Name *
              </label>
              <input
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                required
                placeholder="e.g. CPU Scheduling"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                rows={2}
                placeholder="Algorithms, formulas, or key notes..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={topicPriority}
                  onChange={(e) => setTopicPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={topicStatus}
                  onChange={(e) => setTopicStatusForm(e.target.value as TopicStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Est. Time (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={topicHours}
                  onChange={(e) => setTopicHours(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setTargetUnitForTopic(null); setEditingTopic(null); }}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                {editingTopic ? 'Save Topic' : 'Add Topic'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATIONS */}
      <ConfirmModal
        isOpen={!!deletingUnitId}
        onClose={() => setDeletingUnitId(null)}
        onConfirm={() => {
          if (deletingUnitId) {
            deleteUnit(deletingUnitId);
            setDeletingUnitId(null);
          }
        }}
        title="Delete Unit"
        message="Are you sure you want to delete this unit? All topics under this unit will also be deleted."
        confirmLabel="Yes, Delete Unit"
      />

      <ConfirmModal
        isOpen={!!deletingTopicId}
        onClose={() => setDeletingTopicId(null)}
        onConfirm={() => {
          if (deletingTopicId) {
            deleteTopic(deletingTopicId);
            setDeletingTopicId(null);
          }
        }}
        title="Delete Topic"
        message="Are you sure you want to remove this topic from the unit?"
        confirmLabel="Yes, Delete Topic"
      />

    </div>
  );
};
