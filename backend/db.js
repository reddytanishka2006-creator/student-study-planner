import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { UserModel } from './models/User.js';
import { UserDataModel } from './models/UserData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getOffsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

const DEFAULT_SEEDED_USER = {
  id: 'user_tanishka_01',
  name: 'Tanishka Sharma',
  email: 'tanishka@study.edu',
  password: 'password123',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  major: 'Computer Science & Engineering',
  semester: '5th Semester',
  targetGpa: '9.4 / 10.0',
  studyGoalHoursPerWeek: 28,
  bio: 'CS sophomore passionate about systems programming, distributed systems, and preparing for upcoming semester finals and coding interviews.',
  createdAt: '2026-08-01',
};

function getSeedData() {
  const dMinus2 = getOffsetDate(-2);
  const dMinus1 = getOffsetDate(-1);
  const today = formatDate(new Date());
  const dPlus1 = getOffsetDate(1);
  const dPlus2 = getOffsetDate(2);
  const dPlus5 = getOffsetDate(5);
  const dPlus13 = getOffsetDate(13);
  const dPlus18 = getOffsetDate(18);
  const dPlus25 = getOffsetDate(25);
  const dPlus32 = getOffsetDate(32);

  const subjects = [
    {
      id: 'sub_os',
      name: 'Operating Systems',
      code: 'CS301',
      description: 'Core concepts of process scheduling, virtual memory, threads, synchronization, and file management.',
      color: '#4f46e5',
      icon: 'cpu',
      examDate: dPlus5,
      targetScore: 92,
      createdAt: '2026-08-15',
    },
    {
      id: 'sub_dbms',
      name: 'Database Management Systems',
      code: 'CS302',
      description: 'Relational algebra, SQL queries, ER modeling, normalization forms, and ACID transaction recovery.',
      color: '#0284c7',
      icon: 'database',
      examDate: dPlus13,
      targetScore: 95,
      createdAt: '2026-08-15',
    },
    {
      id: 'sub_cn',
      name: 'Computer Networks',
      code: 'CS303',
      description: 'OSI & TCP/IP stack, routing protocols, flow & congestion control, socket programming, and network security.',
      color: '#059669',
      icon: 'network',
      examDate: dPlus18,
      targetScore: 90,
      createdAt: '2026-08-15',
    },
    {
      id: 'sub_daa',
      name: 'Design & Analysis of Algorithms',
      code: 'CS304',
      description: 'Asymptotic notation, Divide-and-Conquer, Dynamic Programming, Greedy approaches, and NP-completeness.',
      color: '#d97706',
      icon: 'code',
      examDate: dPlus25,
      targetScore: 88,
      createdAt: '2026-08-15',
    },
    {
      id: 'sub_se',
      name: 'Software Engineering & DevOps',
      code: 'CS305',
      description: 'Agile methodologies, CI/CD pipelines, Docker containerization, microservices architecture, and testing.',
      color: '#e11d48',
      icon: 'layers',
      examDate: dPlus32,
      targetScore: 94,
      createdAt: '2026-08-15',
    }
  ];

  const units = [
    { id: 'unit_os_1', subjectId: 'sub_os', title: 'Unit 1: Introduction to Operating Systems & System Calls', order: 1 },
    { id: 'unit_os_2', subjectId: 'sub_os', title: 'Unit 2: Process Management & CPU Scheduling', order: 2 },
    { id: 'unit_os_3', subjectId: 'sub_os', title: 'Unit 3: Inter-Process Communication & Synchronization', order: 3 },
    { id: 'unit_os_4', subjectId: 'sub_os', title: 'Unit 4: Deadlocks & Handling Strategies', order: 4 },
    { id: 'unit_os_5', subjectId: 'sub_os', title: 'Unit 5: Memory Management & Virtual Memory', order: 5 },
    { id: 'unit_dbms_1', subjectId: 'sub_dbms', title: 'Unit 1: Database Architecture & ER Model', order: 1 },
    { id: 'unit_dbms_2', subjectId: 'sub_dbms', title: 'Unit 2: Relational Model & SQL Operations', order: 2 },
    { id: 'unit_dbms_3', subjectId: 'sub_dbms', title: 'Unit 3: Relational Database Design & Normalization', order: 3 },
    { id: 'unit_dbms_4', subjectId: 'sub_dbms', title: 'Unit 4: Transaction Processing & Concurrency Control', order: 4 },
    { id: 'unit_cn_1', subjectId: 'sub_cn', title: 'Unit 1: Network Architectures & Physical/Data Link Layer', order: 1 },
    { id: 'unit_cn_2', subjectId: 'sub_cn', title: 'Unit 2: Network Layer & IP Addressing', order: 2 },
    { id: 'unit_cn_3', subjectId: 'sub_cn', title: 'Unit 3: Transport Layer & TCP Flow Control', order: 3 },
    { id: 'unit_daa_1', subjectId: 'sub_daa', title: 'Unit 1: Mathematical Foundations & Divide and Conquer', order: 1 },
    { id: 'unit_daa_2', subjectId: 'sub_daa', title: 'Unit 2: Greedy Algorithms & Dynamic Programming', order: 2 },
    { id: 'unit_se_1', subjectId: 'sub_se', title: 'Unit 1: Software Development Life Cycle & Agile', order: 1 },
    { id: 'unit_se_2', subjectId: 'sub_se', title: 'Unit 2: Software Design Patterns & Architecture', order: 2 }
  ];

  const topics = [
    { id: 'top_os_1_1', unitId: 'unit_os_1', subjectId: 'sub_os', title: 'Dual-mode operation & Kernel vs User Mode', priority: 'High', status: 'Completed', estimatedHours: 2, completedAt: dMinus2 },
    { id: 'top_os_1_2', unitId: 'unit_os_1', subjectId: 'sub_os', title: 'System calls (fork, exec, wait, exit)', priority: 'High', status: 'Completed', estimatedHours: 3, completedAt: dMinus2 },
    { id: 'top_os_2_1', unitId: 'unit_os_2', subjectId: 'sub_os', title: 'Process Control Block (PCB) & Context Switching', priority: 'Medium', status: 'Completed', estimatedHours: 2.5, completedAt: dMinus1 },
    { id: 'top_os_2_2', unitId: 'unit_os_2', subjectId: 'sub_os', title: 'Scheduling Algorithms: FCFS, SJF, Round Robin', priority: 'High', status: 'Completed', estimatedHours: 4, completedAt: dMinus1 },
    { id: 'top_os_3_1', unitId: 'unit_os_3', subjectId: 'sub_os', title: 'Critical Section Problem & Race Conditions', priority: 'High', status: 'In Progress', estimatedHours: 3 },
    { id: 'top_os_3_2', unitId: 'unit_os_3', subjectId: 'sub_os', title: 'Semaphores, Mutex Locks & Monitors', priority: 'High', status: 'In Progress', estimatedHours: 3.5 },
    { id: 'top_os_4_1', unitId: 'unit_os_4', subjectId: 'sub_os', title: 'Deadlock Characterization & Banker Algorithm', priority: 'High', status: 'Not Started', estimatedHours: 4 },
    { id: 'top_os_5_1', unitId: 'unit_os_5', subjectId: 'sub_os', title: 'Paging, Segmentation & TLB', priority: 'High', status: 'Not Started', estimatedHours: 4.5 },
    { id: 'top_db_1_1', unitId: 'unit_dbms_1', subjectId: 'sub_dbms', title: 'Three-schema architecture & Data Independence', priority: 'Medium', status: 'Completed', estimatedHours: 2 },
    { id: 'top_db_2_1', unitId: 'unit_dbms_2', subjectId: 'sub_dbms', title: 'Complex SQL: Subqueries, Joins & Group By', priority: 'High', status: 'In Progress', estimatedHours: 3.5 },
    { id: 'top_db_3_1', unitId: 'unit_dbms_3', subjectId: 'sub_dbms', title: 'Functional Dependencies & Normal Forms (1NF, 2NF, 3NF, BCNF)', priority: 'High', status: 'In Progress', estimatedHours: 4.5 },
    { id: 'top_cn_1_1', unitId: 'unit_cn_1', subjectId: 'sub_cn', title: 'OSI vs TCP/IP reference models', priority: 'Medium', status: 'Completed', estimatedHours: 2 },
    { id: 'top_daa_1_1', unitId: 'unit_daa_1', subjectId: 'sub_daa', title: 'Master Theorem for Recurrence Relations', priority: 'High', status: 'Completed', estimatedHours: 3 },
    { id: 'top_se_1_1', unitId: 'unit_se_1', subjectId: 'sub_se', title: 'Agile Scrum Ceremonies & User Stories', priority: 'Medium', status: 'Completed', estimatedHours: 2 }
  ];

  const tasks = [
    {
      id: 'task_01',
      title: 'Practice Banker Algorithm Numerical Problems',
      description: 'Solve 5 previous year university exam questions on resource allocation graphs and safe sequence determination.',
      subjectId: 'sub_os',
      unitId: 'unit_os_4',
      topicId: 'top_os_4_1',
      date: today,
      startTime: '10:00',
      endTime: '12:00',
      priority: 'High',
      status: 'Pending',
      createdAt: '2026-10-12',
    },
    {
      id: 'task_02',
      title: 'Revise SQL Joins & Nested Queries Sheet',
      description: 'Complete hands-on database lab exercises focusing on correlated subqueries and aggregate functions.',
      subjectId: 'sub_dbms',
      unitId: 'unit_dbms_2',
      topicId: 'top_db_2_1',
      date: today,
      startTime: '14:30',
      endTime: '16:00',
      priority: 'High',
      status: 'Pending',
      createdAt: '2026-10-13',
    },
    {
      id: 'task_03',
      title: 'Operating Systems: Semaphores & Mutex Implementation',
      description: 'Review classic synchronization problems: Producer-Consumer and Dining Philosophers in C.',
      subjectId: 'sub_os',
      unitId: 'unit_os_3',
      topicId: 'top_os_3_2',
      date: today,
      startTime: '17:00',
      endTime: '18:30',
      priority: 'Medium',
      status: 'Completed',
      createdAt: '2026-10-14',
    },
    {
      id: 'task_04',
      title: 'Computer Networks: Subnetting & CIDR Calculation',
      description: 'Solve VLSM subnetting tables and assign IP ranges for a mock campus network topology.',
      subjectId: 'sub_cn',
      unitId: 'unit_cn_2',
      date: dPlus1,
      startTime: '09:30',
      endTime: '11:30',
      priority: 'High',
      status: 'Pending',
      createdAt: '2026-10-13',
    }
  ];

  const exams = [
    {
      id: 'exam_os',
      subjectId: 'sub_os',
      title: 'Operating Systems Theory Midterm',
      examDate: dPlus5,
      startTime: '09:30',
      durationMinutes: 180,
      venue: 'Auditorium Hall B - Desk 42',
      targetScore: 92,
      notes: 'Focus on CPU Scheduling, Deadlocks (Banker Algorithm), and Paging / Segmentation questions.',
    },
    {
      id: 'exam_dbms',
      subjectId: 'sub_dbms',
      title: 'Database Management Systems Semester Exam',
      examDate: dPlus13,
      startTime: '14:00',
      durationMinutes: 180,
      venue: 'Computing Complex - Lab 4',
      targetScore: 95,
      notes: 'Thoroughly revise 3NF vs BCNF proofs, B+ tree index insertions, and ACID serializability checks.',
    },
    {
      id: 'exam_cn',
      subjectId: 'sub_cn',
      title: 'Computer Networks Final Assessment',
      examDate: dPlus18,
      startTime: '10:00',
      durationMinutes: 120,
      venue: 'Engineering Block 3 - Hall 102',
      targetScore: 90,
      notes: 'TCP 3-way handshake sequence diagram and subnetting calculations carry high weightage.',
    }
  ];

  return { subjects, units, topics, tasks, exams };
}

// Local JSON File Database Fallback
function loadLocalDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      users: [DEFAULT_SEEDED_USER],
      userData: {
        [DEFAULT_SEEDED_USER.id]: getSeedData()
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error loading local DB, re-seeding:', err);
    const fallbackDb = {
      users: [DEFAULT_SEEDED_USER],
      userData: {
        [DEFAULT_SEEDED_USER.id]: getSeedData()
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackDb, null, 2), 'utf-8');
    return fallbackDb;
  }
}

function saveLocalDb(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving local database:', err);
    return false;
  }
}

let isMongoConnected = false;

export async function initDatabase(uri) {
  if (!uri || uri.includes('<db_password>') || uri.includes('<password>')) {
    console.log('ℹ️  MongoDB URI not configured or contains placeholder <db_password>.');
    console.log('👉 Provide your password to connect to MongoDB Atlas.');
    console.log('📁 Using local database file in backend/data/database.json in the meantime.');
    loadLocalDb();
    return false;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    isMongoConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // Check if initial user exists, if not seed
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding default demo student into MongoDB...');
      await UserModel.create(DEFAULT_SEEDED_USER);
      await UserDataModel.create({
        userId: DEFAULT_SEEDED_USER.id,
        ...getSeedData()
      });
      console.log('✅ MongoDB seeded successfully.');
    }
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    console.log('📁 Falling back to local database engine.');
    isMongoConnected = false;
    loadLocalDb();
    return false;
  }
}

export const db = {
  isMongoDB() {
    return isMongoConnected;
  },

  async getUsers() {
    if (isMongoConnected) {
      return await UserModel.find().lean();
    }
    return loadLocalDb().users;
  },

  async getUserById(id) {
    if (isMongoConnected) {
      return await UserModel.findOne({ id }).lean();
    }
    return loadLocalDb().users.find(u => u.id === id);
  },

  async getUserByEmail(email) {
    if (isMongoConnected) {
      return await UserModel.findOne({ email: email.toLowerCase() }).lean();
    }
    return loadLocalDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async createUser(userData) {
    const newUser = {
      id: userData.id || `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      major: userData.major || 'Undergraduate Student',
      semester: userData.semester || 'Current Semester',
      targetGpa: userData.targetGpa || '9.0 / 10.0',
      studyGoalHoursPerWeek: userData.studyGoalHoursPerWeek || 20,
      bio: userData.bio || 'Ready to excel in upcoming exams and courses!',
      createdAt: formatDate(new Date())
    };

    if (isMongoConnected) {
      const created = await UserModel.create(newUser);
      await UserDataModel.create({
        userId: newUser.id,
        subjects: [],
        units: [],
        topics: [],
        tasks: [],
        exams: []
      });
      return created.toObject();
    }

    const current = loadLocalDb();
    current.users.push(newUser);
    current.userData[newUser.id] = {
      subjects: [],
      units: [],
      topics: [],
      tasks: [],
      exams: []
    };
    saveLocalDb(current);
    return newUser;
  },

  async updateUser(id, updates) {
    if (isMongoConnected) {
      return await UserModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).lean();
    }
    const current = loadLocalDb();
    const idx = current.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    current.users[idx] = { ...current.users[idx], ...updates };
    saveLocalDb(current);
    return current.users[idx];
  },

  async getUserData(userId) {
    if (isMongoConnected) {
      let data = await UserDataModel.findOne({ userId }).lean();
      if (!data) {
        const seed = userId === DEFAULT_SEEDED_USER.id ? getSeedData() : {
          subjects: [],
          units: [],
          topics: [],
          tasks: [],
          exams: []
        };
        data = await UserDataModel.create({ userId, ...seed });
        return data.toObject();
      }
      return {
        subjects: data.subjects || [],
        units: data.units || [],
        topics: data.topics || [],
        tasks: data.tasks || [],
        exams: data.exams || []
      };
    }

    const current = loadLocalDb();
    if (!current.userData[userId]) {
      current.userData[userId] = userId === DEFAULT_SEEDED_USER.id ? getSeedData() : {
        subjects: [],
        units: [],
        topics: [],
        tasks: [],
        exams: []
      };
      saveLocalDb(current);
    }
    return current.userData[userId];
  },

  async saveUserData(userId, data) {
    if (isMongoConnected) {
      await UserDataModel.findOneAndUpdate(
        { userId },
        { 
          $set: {
            subjects: data.subjects || [],
            units: data.units || [],
            topics: data.topics || [],
            tasks: data.tasks || [],
            exams: data.exams || []
          } 
        },
        { upsert: true, returnDocument: 'after' }
      );
      return true;
    }

    const current = loadLocalDb();
    current.userData[userId] = data;
    saveLocalDb(current);
    return true;
  },

  async resetUserData(userId) {
    const initial = userId === DEFAULT_SEEDED_USER.id ? getSeedData() : {
      subjects: [],
      units: [],
      topics: [],
      tasks: [],
      exams: []
    };

    if (isMongoConnected) {
      await UserDataModel.findOneAndUpdate(
        { userId },
        { $set: initial },
        { upsert: true, returnDocument: 'after' }
      );
      return initial;
    }

    const current = loadLocalDb();
    current.userData[userId] = initial;
    saveLocalDb(current);
    return initial;
  }
};
