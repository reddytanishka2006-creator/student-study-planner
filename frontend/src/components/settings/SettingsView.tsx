import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  Settings, Sun, Moon, Download, Upload, RotateCcw, 
  ShieldCheck, AlertTriangle, Check, Sparkles, Database, 
  Bell, Palette
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const SettingsView: React.FC = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    resetToDemoData, 
    exportBackupJSON, 
    importBackupJSON,
    currentUser 
  } = usePlanner();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const ok = importBackupJSON(importJsonText.trim());
    if (ok) {
      setImportStatus('Data successfully restored!');
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Failed to parse backup JSON. Please check formatting.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackupJSON(content);
        if (ok) {
          setImportStatus('Backup file loaded successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Settings & Data
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Personalize your appearance, configure backups, or reset study planner data.
        </p>
      </div>

      {importStatus && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
          importStatus.includes('successfully')
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
        }`}>
          <span>{importStatus}</span>
        </div>
      )}

      {/* 1. APPEARANCE SETTINGS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Appearance & Theme</span>
        </h2>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Dark Mode Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Easier on your eyes during late-night study and revision sessions.
            </p>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${
              isDarkMode
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 shadow-xs'
            }`}
          >
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{isDarkMode ? 'Dark Enabled' : 'Light Enabled'}</span>
          </button>
        </div>
      </div>

      {/* 2. BACKUP & EXPORT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Backup, Export & Restore</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Save your data as a standalone JSON file so you can transfer it between devices or keep offline records.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Export Planner JSON</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Download all subjects, units, topics, tasks, and exam data.
              </p>
            </div>
            <button
              onClick={exportBackupJSON}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import JSON File */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Import JSON Backup File</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select a previously saved StudyPlanner_*.json file to restore.
              </p>
            </div>
            <label className="mt-4 w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. RESET TO REALISTIC DEMO DATA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Sample Demo Data</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xl">
              Restore the full realistic engineering template featuring Operating Systems, DBMS, AI & ML, Data Structures, and Computer Networks with units, topics, upcoming exams, and today's tasks.
            </p>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-bold text-xs transition-colors shrink-0"
          >
            Reset Data
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetToDemoData();
          setIsResetConfirmOpen(false);
        }}
        title="Reset Study Planner Data"
        message="This will overwrite current subjects, units, topics, and tasks with the default realistic engineering sample data (Tanishka Sharma). Are you sure?"
        confirmLabel="Yes, Reset Data"
        isDanger={true}
      />

    </div>
  );
};
