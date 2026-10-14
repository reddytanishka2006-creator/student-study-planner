import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  BarChart3, CheckCircle2, Clock, Circle, BookOpen, 
  Layers, ArrowUpRight, Sparkles, TrendingUp, Award, 
  Flame, Target, AlertCircle
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { 
    overallProgress, 
    totalTopics, 
    completedTopics, 
    inProgressTopics, 
    notStartedTopics, 
    totalSubjects, 
    totalUnits, 
    subjectsWithStats, 
    topics,
    setActiveView 
  } = usePlanner();

  // Study hours calculations
  const totalEstimatedHours = topics.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const completedHours = topics
    .filter(t => t.status === 'completed')
    .reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const remainingHours = totalEstimatedHours - completedHours;

  // Priority-wise breakdown
  const highTopics = topics.filter(t => t.priority === 'high');
  const highCompleted = highTopics.filter(t => t.status === 'completed').length;
  const highProgress = highTopics.length > 0 ? Math.round((highCompleted / highTopics.length) * 100) : 0;

  const medTopics = topics.filter(t => t.priority === 'medium');
  const medCompleted = medTopics.filter(t => t.status === 'completed').length;
  const medProgress = medTopics.length > 0 ? Math.round((medCompleted / medTopics.length) * 100) : 0;

  const lowTopics = topics.filter(t => t.priority === 'low');
  const lowCompleted = lowTopics.filter(t => t.status === 'completed').length;
  const lowProgress = lowTopics.length > 0 ? Math.round((lowCompleted / lowTopics.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Syllabus Mastery & Study Progress
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time analytics across your enrolled subjects, topic completion rates, and estimated study hours.
        </p>
      </div>

      {/* Top Hero Cards: Overall Progress + Topic Breakdown + Study Hours */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* BIG OVERALL PROGRESS CARD (Prompt Requirement) */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-600/15 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-4 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Overall Academic Progress</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight">{overallProgress}%</span>
              <span className="text-sm font-semibold text-indigo-200">Completed</span>
            </div>

            <p className="mt-2 text-xs text-indigo-100 leading-relaxed">
              You have completed <strong>{completedTopics}</strong> out of <strong>{totalTopics}</strong> total syllabus topics across all {totalSubjects} courses.
            </p>
          </div>

          {/* Progress bar inside card */}
          <div className="mt-6 pt-4 border-t border-indigo-400/30 relative z-10">
            <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden p-0.5">
              <div 
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-indigo-200 mt-2 font-medium">
              <span>{totalTopics - completedTopics} topics remaining</span>
              <span>Target: 100% Final Prep</span>
            </div>
          </div>
        </div>

        {/* TOPIC STATISTICS BREAKDOWN (Prompt Requirement) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Completed Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Topics</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {completedTopics}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0}% of all syllabus
            </p>
          </div>

          {/* In Progress Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 w-fit mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">In Progress</span>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {inProgressTopics}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              Currently active studies
            </p>
          </div>

          {/* Not Started Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-fit mb-3">
                <Circle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Not Started</span>
              <div className="text-3xl font-black text-slate-700 dark:text-slate-300 mt-1">
                {notStartedTopics}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              Queued for upcoming review
            </p>
          </div>

        </div>

      </div>

      {/* SUBJECT-WISE PROGRESS LIST (Prompt Requirement) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Subject-wise Preparation Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated completion percentage based on individual subject topic counts
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {subjectsWithStats.length} Subjects Active
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {subjectsWithStats.map((subject) => (
            <div 
              key={subject.id}
              onClick={() => setActiveView('subject-detail', subject.id)}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {subject.name}
                    </span>
                    <span className="ml-2 text-xs font-mono font-semibold text-slate-400">
                      ({subject.code})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {subject.completedTopicsCount} of {subject.topicsCount} Topics Mastered
                  </span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {subject.progressPercentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: `${subject.progressPercentage}%`,
                    backgroundColor: subject.color 
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>{subject.unitsCount} Units</span>
                <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1 font-semibold">
                  <span>Drill down to topics</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIORITY MASTERY & STUDY HOURS ESTIMATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Priority Completion Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Priority Topic Completion</span>
          </h2>

          <div className="space-y-3 pt-1">
            {/* High Priority */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-rose-600 dark:text-rose-400">High Priority Topics</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{highCompleted}/{highTopics.length} ({highProgress}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-rose-500" style={{ width: `${highProgress}%` }} />
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-600 dark:text-amber-400">Medium Priority Topics</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{medCompleted}/{medTopics.length} ({medProgress}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${medProgress}%` }} />
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-600 dark:text-slate-400">Low Priority Topics</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{lowCompleted}/{lowTopics.length} ({lowProgress}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-slate-500" style={{ width: `${lowProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Study Hours Analytics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Study Hours Analytics</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Completed Study Time</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {completedHours.toFixed(1)} hrs
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Remaining Study Time</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {remainingHours.toFixed(1)} hrs
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-2 border border-indigo-100 dark:border-indigo-900/40">
            <Award className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>Total syllabus study plan: <strong>{totalEstimatedHours.toFixed(1)} hours</strong> across all courses.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
