export type Priority = 'high' | 'medium' | 'low';
export type TopicStatus = 'not_started' | 'in_progress' | 'completed';
export type TaskStatus = 'pending' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  major?: string;
  semester?: string;
  targetGpa?: string;
  studyGoalHoursPerWeek?: number;
  bio?: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  unitId: string;
  subjectId: string;
  name: string;
  description: string;
  priority: Priority;
  status: TopicStatus;
  estimatedHours: number;
  completedAt?: string;
  notes?: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  unitNumber: number;
  name: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  icon: string;
  examDate: string; // YYYY-MM-DD
  targetScore?: number;
  createdAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  unitId?: string;
  topicId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24-hr format e.g. "14:00")
  endTime: string; // HH:MM
  priority: Priority;
  status: TaskStatus;
  completedAt?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  examName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  location?: string;
  targetScore?: number;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  type: 'exam' | 'task' | 'topic' | 'achievement' | 'alert';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionView?: string;
  actionId?: string;
}

export type ActiveView = 
  | 'dashboard'
  | 'subjects'
  | 'subject-detail'
  | 'tasks'
  | 'schedule'
  | 'exams'
  | 'progress'
  | 'calendar'
  | 'profile'
  | 'settings';
