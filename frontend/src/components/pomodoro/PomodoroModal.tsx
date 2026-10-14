import React, { useState, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Modal } from '../common/Modal';
import { 
  Play, Pause, RotateCcw, Timer, Sparkles, 
  Coffee, Brain, CheckCircle2, Volume2 
} from 'lucide-react';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({ isOpen, onClose }) => {
  const { subjects, tasks, triggerConfetti } = usePlanner();

  const [mode, setMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // Set default subject if available
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Mode durations
  const durations = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  const switchMode = (newMode: 'work' | 'short_break' | 'long_break') => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      triggerConfetti();
      // Play a browser audio beep or chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        console.error(e);
      }

      if (mode === 'work') {
        setCompletedSessions(prev => prev + 1);
        switchMode('short_break');
      } else {
        switchMode('work');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, triggerConfetti]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentDuration = durations[mode];
  const progressPercent = Math.round(((currentDuration - timeLeft) / currentDuration) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pomodoro Focus Timer"
      subtitle="Boost your revision retention using timed study blocks"
      maxWidth="md"
    >
      <div className="space-y-6 text-center py-2">
        
        {/* Mode Tabs */}
        <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mx-auto w-fit">
          <button
            onClick={() => switchMode('work')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'work'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Study Focus (25m)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'long_break'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Big Digital Clock Display */}
        <div className="py-4">
          <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-slate-900 dark:text-white">
            {formatSeconds(timeLeft)}
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-2">
            {mode === 'work' ? 'Deep Work Session' : 'Rest & Refresh'} • {completedSessions} Sessions Completed
          </p>
        </div>

        {/* Linear Progress */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              mode === 'work' ? 'bg-indigo-600' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Studying Subject Selector */}
        <div className="text-left bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Focus Topic / Subject
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Studying</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(durations[mode]);
            }}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
