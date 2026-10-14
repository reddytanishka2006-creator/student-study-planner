import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, Subject, Unit, Topic, StudyTask, Exam, NotificationItem, 
  ActiveView, TopicStatus, TaskStatus, Priority 
} from '../types';
import { SEEDED_USER, getInitialSeedData } from '../data/seedData';
import { getDaysRemaining, isDateToday, parseDate, getTodayDateString } from '../utils/dateUtils';
import { api } from '../utils/api';

interface UserData {
  subjects: Subject[];
  units: Unit[];
  topics: Topic[];
  tasks: StudyTask[];
  exams: Exam[];
}

interface SubjectWithStats extends Subject {
  unitsCount: number;
  topicsCount: number;
  completedTopicsCount: number;
  progressPercentage: number;
  daysRemainingObj: ReturnType<typeof getDaysRemaining>;
}

interface PlannerContextType {
  // Auth state
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updated: Partial<User>) => void;
  loginAsDemo: () => void;

  // Navigation
  activeView: ActiveView;
  selectedSubjectId: string | null;
  setActiveView: (view: ActiveView, subjectId?: string | null) => void;

  // Search & Theme
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Core Data
  subjects: Subject[];
  units: Unit[];
  topics: Topic[];
  tasks: StudyTask[];
  exams: Exam[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Statistics & Computed
  totalSubjects: number;
  totalUnits: number;
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  overallProgress: number;
  pendingTasksCount: number;
  todayTasks: StudyTask[];
  upcomingExams: (Exam & { subject?: Subject; daysRemainingObj: ReturnType<typeof getDaysRemaining>; preparation: number })[];
  subjectsWithStats: SubjectWithStats[];

  // CRUD Operations
  // Subjects
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  getSubjectById: (id: string) => Subject | undefined;
  getSubjectStats: (id: string) => {
    unitsCount: number;
    topicsCount: number;
    completedTopics: number;
    inProgressTopics: number;
    notStartedTopics: number;
    progressPercentage: number;
    totalHours: number;
    completedHours: number;
  };

  // Units
  addUnit: (unit: Omit<Unit, 'id'>) => Unit;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  getUnitsBySubject: (subjectId: string) => Unit[];

  // Topics
  addTopic: (topic: Omit<Topic, 'id'>) => Topic;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  setTopicStatus: (topicId: string, status: TopicStatus) => void;
  getTopicsByUnit: (unitId: string) => Topic[];
  getTopicsBySubject: (subjectId: string) => Topic[];

  // Tasks
  addTask: (task: Omit<StudyTask, 'id'>) => StudyTask;
  updateTask: (id: string, updates: Partial<StudyTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (taskId: string) => void;

  // Exams
  addExam: (exam: Omit<Exam, 'id'>) => Exam;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // App Utilities
  resetToDemoData: () => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonStr: string) => boolean;
  triggerConfetti: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'ssp_all_users';
const CURRENT_USER_ID_KEY = 'ssp_current_user_id';
const THEME_STORAGE_KEY = 'ssp_theme_mode';

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize Users List
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [SEEDED_USER];
  });

  // 2. Current User ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_ID_KEY);
      if (stored) return stored;
    } catch (e) {
      console.error(e);
    }
    return SEEDED_USER.id; // default to demo student
  });

  // Current logged in user object
  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find(u => u.id === currentUserId) || null;
  }, [users, currentUserId]);

  // 3. User Data State (Subjects, Units, Topics, Tasks, Exams)
  const [data, setData] = useState<UserData>(() => {
    const userId = currentUserId || SEEDED_USER.id;
    try {
      const storedData = localStorage.getItem(`ssp_data_${userId}`);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (e) {
      console.error(e);
    }
    return getInitialSeedData();
  });

  // Load user data when currentUserId changes
  useEffect(() => {
    if (!currentUserId) return;
    try {
      const storedData = localStorage.getItem(`ssp_data_${currentUserId}`);
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        const initial = currentUserId === SEEDED_USER.id ? getInitialSeedData() : {
          subjects: [],
          units: [],
          topics: [],
          tasks: [],
          exams: []
        };
        setData(initial);
        localStorage.setItem(`ssp_data_${currentUserId}`, JSON.stringify(initial));
      }
    } catch (e) {
      console.error(e);
    }

    // Also fetch latest synced state from MongoDB Atlas backend
    api.getUserData(currentUserId).then(remoteData => {
      if (remoteData && Array.isArray(remoteData.subjects)) {
        setData(remoteData);
        localStorage.setItem(`ssp_data_${currentUserId}`, JSON.stringify(remoteData));
      }
    }).catch(err => console.warn('Backend sync notice:', err));
  }, [currentUserId]);

  // Save current user data whenever it changes
  useEffect(() => {
    if (currentUserId && data) {
      try {
        localStorage.setItem(`ssp_data_${currentUserId}`, JSON.stringify(data));
      } catch (e) {
        console.error(e);
      }

      // Debounced background sync to backend
      const timer = setTimeout(() => {
        api.saveUserData(currentUserId, data).catch(() => {});
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentUserId, data]);

  // Save users list whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  // Save currentUserId
  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(CURRENT_USER_ID_KEY, currentUserId);
      } else {
        localStorage.removeItem(CURRENT_USER_ID_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  // 4. Navigation & UI state
  const [activeView, setActiveViewRaw] = useState<ActiveView>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const setActiveView = useCallback((view: ActiveView, subjectId?: string | null) => {
    setActiveViewRaw(view);
    if (subjectId !== undefined) {
      setSelectedSubjectId(subjectId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 5. Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const theme = localStorage.getItem(THEME_STORAGE_KEY);
      if (theme) return theme === 'dark';
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 6. Dynamic Notifications
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);

  const notifications = useMemo<NotificationItem[]>(() => {
    if (!currentUser) return [];
    const items: NotificationItem[] = [];
    const today = getTodayDateString();

    // Upcoming exams within 7 days
    data.exams.forEach(exam => {
      const remaining = getDaysRemaining(exam.date);
      const subject = data.subjects.find(s => s.id === exam.subjectId);
      const subjectName = subject ? subject.name : exam.examName;

      if (!remaining.isPast && remaining.days <= 7) {
        const id = `notif_exam_${exam.id}_${remaining.days}`;
        if (!dismissedNotifications.includes(id)) {
          items.push({
            id,
            type: 'exam',
            title: remaining.days === 0 ? 'Exam Today!' : (remaining.days === 1 ? 'Exam Tomorrow!' : 'Exam Approaching'),
            message: `${subjectName} exam is in ${remaining.days === 0 ? 'today' : (remaining.days === 1 ? '1 day' : `${remaining.days} days`)}.`,
            date: today,
            read: false,
            actionView: 'exams',
            actionId: exam.id,
          });
        }
      }
    });

    // Today's pending tasks
    const todayPending = data.tasks.filter(t => t.date === today && t.status === 'pending');
    if (todayPending.length > 0) {
      const id = `notif_tasks_today_${today}_${todayPending.length}`;
      if (!dismissedNotifications.includes(id)) {
        items.push({
          id,
          type: 'task',
          title: 'Tasks Due Today',
          message: `You have ${todayPending.length} pending ${todayPending.length === 1 ? 'task' : 'tasks'} scheduled for today.`,
          date: today,
          read: false,
          actionView: 'tasks',
        });
      }
    }

    // Overdue tasks
    const overdueTasks = data.tasks.filter(t => t.date < today && t.status === 'pending');
    if (overdueTasks.length > 0) {
      const id = `notif_tasks_overdue_${today}_${overdueTasks.length}`;
      if (!dismissedNotifications.includes(id)) {
        items.push({
          id,
          type: 'alert',
          title: 'Overdue Tasks',
          message: `You have ${overdueTasks.length} overdue ${overdueTasks.length === 1 ? 'task' : 'tasks'} from previous days.`,
          date: today,
          read: false,
          actionView: 'tasks',
        });
      }
    }

    // High priority pending topics
    const highPendingTopics = data.topics.filter(t => t.priority === 'high' && t.status !== 'completed');
    if (highPendingTopics.length > 0) {
      const sampleTopic = highPendingTopics[0];
      const subject = data.subjects.find(s => s.id === sampleTopic.subjectId);
      const id = `notif_topic_high_${sampleTopic.id}`;
      if (!dismissedNotifications.includes(id)) {
        items.push({
          id,
          type: 'topic',
          title: 'High Priority Topic',
          message: `Pending high priority topic: "${sampleTopic.name}" in ${subject?.name || 'your subjects'}.`,
          date: today,
          read: false,
          actionView: 'subjects',
          actionId: sampleTopic.subjectId,
        });
      }
    }

    return items;
  }, [currentUser, data, dismissedNotifications]);

  const unreadNotificationCount = notifications.length;

  const markNotificationAsRead = useCallback((id: string) => {
    setDismissedNotifications(prev => [...prev, id]);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setDismissedNotifications(prev => [...prev, ...notifications.map(n => n.id)]);
  }, [notifications]);

  // 7. Computed Statistics
  const totalSubjects = data.subjects.length;
  const totalUnits = data.units.length;
  const totalTopics = data.topics.length;
  const completedTopics = useMemo(() => data.topics.filter(t => t.status === 'completed').length, [data.topics]);
  const inProgressTopics = useMemo(() => data.topics.filter(t => t.status === 'in_progress').length, [data.topics]);
  const notStartedTopics = useMemo(() => data.topics.filter(t => t.status === 'not_started').length, [data.topics]);

  const overallProgress = useMemo(() => {
    if (totalTopics === 0) return 0;
    return Math.round((completedTopics / totalTopics) * 100);
  }, [completedTopics, totalTopics]);

  const pendingTasksCount = useMemo(() => {
    return data.tasks.filter(t => t.status === 'pending').length;
  }, [data.tasks]);

  const todayTasks = useMemo(() => {
    const today = getTodayDateString();
    return data.tasks.filter(t => t.date === today);
  }, [data.tasks]);

  // Subject Stats Calculation Helper
  const getSubjectStats = useCallback((subjectId: string) => {
    const subjectUnits = data.units.filter(u => u.subjectId === subjectId);
    const subjectTopics = data.topics.filter(t => t.subjectId === subjectId);
    const completed = subjectTopics.filter(t => t.status === 'completed').length;
    const inProgress = subjectTopics.filter(t => t.status === 'in_progress').length;
    const notStarted = subjectTopics.filter(t => t.status === 'not_started').length;
    const progressPercentage = subjectTopics.length > 0 ? Math.round((completed / subjectTopics.length) * 100) : 0;
    
    const totalHours = subjectTopics.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    const completedHours = subjectTopics.filter(t => t.status === 'completed').reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

    return {
      unitsCount: subjectUnits.length,
      topicsCount: subjectTopics.length,
      completedTopics: completed,
      inProgressTopics: inProgress,
      notStartedTopics: notStarted,
      progressPercentage,
      totalHours,
      completedHours,
    };
  }, [data.units, data.topics]);

  // Subjects with their computed stats for fast rendering
  const subjectsWithStats = useMemo<SubjectWithStats[]>(() => {
    return data.subjects.map(subject => {
      const stats = getSubjectStats(subject.id);
      return {
        ...subject,
        unitsCount: stats.unitsCount,
        topicsCount: stats.topicsCount,
        completedTopicsCount: stats.completedTopics,
        progressPercentage: stats.progressPercentage,
        daysRemainingObj: getDaysRemaining(subject.examDate),
      };
    });
  }, [data.subjects, getSubjectStats]);

  // Upcoming Exams with Prep Progress
  const upcomingExams = useMemo(() => {
    return [...data.exams]
      .map(exam => {
        const subject = data.subjects.find(s => s.id === exam.subjectId);
        const stats = subject ? getSubjectStats(subject.id) : { progressPercentage: 0 };
        return {
          ...exam,
          subject,
          daysRemainingObj: getDaysRemaining(exam.date),
          preparation: stats.progressPercentage,
        };
      })
      .sort((a, b) => {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
      });
  }, [data.exams, data.subjects, getSubjectStats]);

  // 8. CRUD Operations
  // Subjects
  const addSubject = useCallback((subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: getTodayDateString(),
    };
    setData(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
    return newSubject;
  }, []);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
      units: prev.units.filter(u => u.subjectId !== id),
      topics: prev.topics.filter(t => t.subjectId !== id),
      tasks: prev.tasks.filter(t => t.subjectId !== id),
      exams: prev.exams.filter(e => e.subjectId !== id),
    }));
    if (selectedSubjectId === id) {
      setSelectedSubjectId(null);
      setActiveView('subjects');
    }
  }, [selectedSubjectId, setActiveView]);

  const getSubjectById = useCallback((id: string) => {
    return data.subjects.find(s => s.id === id);
  }, [data.subjects]);

  // Units
  const addUnit = useCallback((unitData: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unitData,
      id: `unit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setData(prev => ({
      ...prev,
      units: [...prev.units, newUnit],
    }));
    return newUnit;
  }, []);

  const updateUnit = useCallback((id: string, updates: Partial<Unit>) => {
    setData(prev => ({
      ...prev,
      units: prev.units.map(u => u.id === id ? { ...u, ...updates } : u),
    }));
  }, []);

  const deleteUnit = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      units: prev.units.filter(u => u.id !== id),
      topics: prev.topics.filter(t => t.unitId !== id),
      tasks: prev.tasks.filter(t => t.unitId !== id),
    }));
  }, []);

  const getUnitsBySubject = useCallback((subjectId: string) => {
    return data.units
      .filter(u => u.subjectId === subjectId)
      .sort((a, b) => a.unitNumber - b.unitNumber);
  }, [data.units]);

  // Topics
  const addTopic = useCallback((topicData: Omit<Topic, 'id'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: `top_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setData(prev => ({
      ...prev,
      topics: [...prev.topics, newTopic],
    }));
    return newTopic;
  }, []);

  const updateTopic = useCallback((id: string, updates: Partial<Topic>) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'completed' && t.status !== 'completed') {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return t;
      }),
    }));
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t.id !== id),
      tasks: prev.tasks.filter(t => t.topicId !== id),
    }));
  }, []);

  const setTopicStatus = useCallback((topicId: string, status: TopicStatus) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      }),
    }));

    if (status === 'completed') {
      triggerConfetti();
    }
  }, [triggerConfetti]);

  const getTopicsByUnit = useCallback((unitId: string) => {
    return data.topics.filter(t => t.unitId === unitId);
  }, [data.topics]);

  const getTopicsBySubject = useCallback((subjectId: string) => {
    return data.topics.filter(t => t.subjectId === subjectId);
  }, [data.topics]);

  // Tasks
  const addTask = useCallback((taskData: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<StudyTask>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  }, []);

  const toggleTaskStatus = useCallback((taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          const nextStatus: TaskStatus = t.status === 'completed' ? 'pending' : 'completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      }),
    }));
  }, []);

  // Exams
  const addExam = useCallback((examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setData(prev => ({
      ...prev,
      exams: [...prev.exams, newExam],
    }));
    return newExam;
  }, []);

  const updateExam = useCallback((id: string, updates: Partial<Exam>) => {
    setData(prev => ({
      ...prev,
      exams: prev.exams.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const deleteExam = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      exams: prev.exams.filter(e => e.id !== id),
    }));
  }, []);

  // Auth Functions
  const login = useCallback(async (email: string, pass: string) => {
    const trimmedEmail = email.toLowerCase().trim();

    // 1. Attempt backend login first
    try {
      const apiRes = await api.login(trimmedEmail, pass);
      if (apiRes.success && apiRes.user) {
        setUsers(prev => {
          const exists = prev.some(u => u.id === apiRes.user.id);
          return exists ? prev.map(u => u.id === apiRes.user.id ? { ...u, ...apiRes.user } : u) : [...prev, apiRes.user];
        });
        setCurrentUserId(apiRes.user.id);
        return { success: true };
      }
    } catch {
      // Ignore network errors and try local fallback
    }

    // 2. Fallback to local users list
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    setCurrentUserId(found.id);
    return { success: true };
  }, [users]);

  const register = useCallback(async (name: string, email: string, pass: string) => {
    const trimmedEmail = email.toLowerCase().trim();

    // 1. Attempt backend registration
    try {
      const apiRes = await api.register(name, trimmedEmail, pass);
      if (apiRes.success && apiRes.user) {
        setUsers(prev => [...prev.filter(u => u.id !== apiRes.user.id), apiRes.user]);
        setCurrentUserId(apiRes.user.id);

        const starterSeed = getInitialSeedData();
        setData(starterSeed);
        try {
          localStorage.setItem(`ssp_data_${apiRes.user.id}`, JSON.stringify(starterSeed));
        } catch (e) {
          console.error(e);
        }
        api.saveUserData(apiRes.user.id, starterSeed).catch(() => {});
        return { success: true };
      } else if (apiRes.error) {
        return { success: false, error: apiRes.error };
      }
    } catch {
      // Fallback to local registration if offline
    }

    // 2. Fallback local registration
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password: pass,
      major: 'Computer Science & Engineering',
      semester: '1st Semester',
      targetGpa: '9.0 / 10.0',
      studyGoalHoursPerWeek: 20,
      bio: 'Ready to stay organized and ace my examinations!',
      createdAt: getTodayDateString(),
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    
    const starterSeed = getInitialSeedData();
    setData(starterSeed);
    try {
      localStorage.setItem(`ssp_data_${newUser.id}`, JSON.stringify(starterSeed));
    } catch (e) {
      console.error(e);
    }

    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    api.logout();
    setCurrentUserId(null);
  }, []);

  const forgotPassword = useCallback(async (email: string, newPass: string) => {
    const trimmedEmail = email.toLowerCase().trim();

    // 1. Try backend
    try {
      const apiRes = await api.forgotPassword(trimmedEmail, newPass);
      if (apiRes.success && apiRes.user) {
        setUsers(prev => prev.map(u => u.id === apiRes.user.id ? { ...u, password: newPass } : u));
        return { success: true };
      }
    } catch {
      // Fallback to local
    }

    // 2. Local fallback
    const userIndex = users.findIndex(u => u.email.toLowerCase() === trimmedEmail);
    if (userIndex === -1) {
      return { success: false, error: 'No student registered with that email address.' };
    }
    setUsers(prev => prev.map((u, i) => i === userIndex ? { ...u, password: newPass } : u));
    return { success: true };
  }, [users]);

  const updateProfile = useCallback((updated: Partial<User>) => {
    if (!currentUserId) return;
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...updated } : u));
  }, [currentUserId]);

  const loginAsDemo = useCallback(() => {
    setCurrentUserId(SEEDED_USER.id);
  }, []);

  const resetToDemoData = useCallback(() => {
    const initial = getInitialSeedData();
    setData(initial);
    if (currentUserId) {
      localStorage.setItem(`ssp_data_${currentUserId}`, JSON.stringify(initial));
    }
    triggerConfetti();
  }, [currentUserId, triggerConfetti]);

  const exportBackupJSON = useCallback(() => {
    const payload = {
      user: currentUser,
      data,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyPlanner_${currentUser?.name.replace(/\s+/g, '_') || 'Student'}_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentUser, data]);

  const importBackupJSON = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.data && Array.isArray(parsed.data.subjects)) {
        setData(parsed.data);
        if (currentUserId) {
          localStorage.setItem(`ssp_data_${currentUserId}`, JSON.stringify(parsed.data));
        }
        triggerConfetti();
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  }, [currentUserId, triggerConfetti]);

  return (
    <PlannerContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        loginAsDemo,

        activeView,
        selectedSubjectId,
        setActiveView,

        globalSearch,
        setGlobalSearch,
        isDarkMode,
        toggleDarkMode,

        subjects: data.subjects,
        units: data.units,
        topics: data.topics,
        tasks: data.tasks,
        exams: data.exams,
        notifications,
        unreadNotificationCount,

        totalSubjects,
        totalUnits,
        totalTopics,
        completedTopics,
        inProgressTopics,
        notStartedTopics,
        overallProgress,
        pendingTasksCount,
        todayTasks,
        upcomingExams,
        subjectsWithStats,

        addSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        getSubjectStats,

        addUnit,
        updateUnit,
        deleteUnit,
        getUnitsBySubject,

        addTopic,
        updateTopic,
        deleteTopic,
        setTopicStatus,
        getTopicsByUnit,
        getTopicsBySubject,

        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,

        addExam,
        updateExam,
        deleteExam,

        markNotificationAsRead,
        clearAllNotifications,

        resetToDemoData,
        exportBackupJSON,
        importBackupJSON,
        triggerConfetti,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
