import { User, Subject, Unit, Topic, StudyTask, Exam } from '../types';
import { getRelativeOffsetDate, getTodayDateString } from '../utils/dateUtils';

export const SEEDED_USER: User = {
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

export function getInitialSeedData(): {
  subjects: Subject[];
  units: Unit[];
  topics: Topic[];
  tasks: StudyTask[];
  exams: Exam[];
} {
  const today = getTodayDateString();
  const dMinus2 = getRelativeOffsetDate(-2);
  const dMinus1 = getRelativeOffsetDate(-1);
  const dPlus1 = getRelativeOffsetDate(1);
  const dPlus2 = getRelativeOffsetDate(2);
  const dPlus5 = getRelativeOffsetDate(5);
  const dPlus10 = getRelativeOffsetDate(10);
  const dPlus13 = getRelativeOffsetDate(13);
  const dPlus18 = getRelativeOffsetDate(18);
  const dPlus25 = getRelativeOffsetDate(25);
  const dPlus32 = getRelativeOffsetDate(32);

  // 1. SUBJECTS
  const subjects: Subject[] = [
    {
      id: 'sub_os',
      name: 'Operating Systems',
      code: 'CS301',
      description: 'Core concepts of process scheduling, virtual memory, threads, synchronization, and file management.',
      color: '#4f46e5', // Indigo
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
      color: '#0284c7', // Sky
      icon: 'database',
      examDate: dPlus13,
      targetScore: 95,
      createdAt: '2026-08-15',
    },
    {
      id: 'sub_aiml',
      name: 'Artificial Intelligence & ML',
      code: 'CS303',
      description: 'Heuristic search algorithms, neural network fundamentals, regression, and probabilistic reasoning.',
      color: '#7c3aed', // Purple
      icon: 'brain',
      examDate: dPlus18,
      targetScore: 88,
      createdAt: '2026-08-16',
    },
    {
      id: 'sub_dsa',
      name: 'Data Structures & Algorithms',
      code: 'CS304',
      description: 'Advanced trees, graph algorithms, dynamic programming, and greedy optimization paradigms.',
      color: '#059669', // Emerald
      icon: 'code',
      examDate: dPlus25,
      targetScore: 96,
      createdAt: '2026-08-16',
    },
    {
      id: 'sub_cn',
      name: 'Computer Networks',
      code: 'CS305',
      description: 'OSI & TCP/IP stack layers, routing protocols, flow control, subnetting, and socket programming.',
      color: '#ea580c', // Orange
      icon: 'network',
      examDate: dPlus32,
      targetScore: 90,
      createdAt: '2026-08-17',
    },
  ];

  // 2. UNITS
  const units: Unit[] = [
    // Operating Systems units
    { id: 'unit_os_1', subjectId: 'sub_os', unitNumber: 1, name: 'Introduction to Operating Systems', description: 'OS architecture, kernel types, and system call interfaces' },
    { id: 'unit_os_2', subjectId: 'sub_os', unitNumber: 2, name: 'Process Management & Scheduling', description: 'Process control blocks, scheduling algorithms, and threads' },
    { id: 'unit_os_3', subjectId: 'sub_os', unitNumber: 3, name: 'Process Synchronization & Deadlocks', description: 'Semaphores, critical sections, and deadlock prevention' },
    { id: 'unit_os_4', subjectId: 'sub_os', unitNumber: 4, name: 'Memory Management & Virtual Memory', description: 'Paging, segmentation, page replacement, and thrashing' },
    { id: 'unit_os_5', subjectId: 'sub_os', unitNumber: 5, name: 'Storage & File Systems', description: 'File systems layout, inode concepts, and disk scheduling algorithms' },

    // DBMS units
    { id: 'unit_dbms_1', subjectId: 'sub_dbms', unitNumber: 1, name: 'Relational Model & ER Design', description: 'Entity-relationship diagrams, keys, and relational schema' },
    { id: 'unit_dbms_2', subjectId: 'sub_dbms', unitNumber: 2, name: 'SQL & Relational Algebra', description: 'DDL, DML, joins, subqueries, and views' },
    { id: 'unit_dbms_3', subjectId: 'sub_dbms', unitNumber: 3, name: 'Normalization & Indexing', description: 'Functional dependencies, 1NF to BCNF, and B+ trees' },
    { id: 'unit_dbms_4', subjectId: 'sub_dbms', unitNumber: 4, name: 'Transactions & Concurrency', description: 'ACID properties, serializability, two-phase locking' },

    // AI & ML units
    { id: 'unit_ai_1', subjectId: 'sub_aiml', unitNumber: 1, name: 'Search & Problem Solving', description: 'BFS, DFS, A* search, and minimax with alpha-beta pruning' },
    { id: 'unit_ai_2', subjectId: 'sub_aiml', unitNumber: 2, name: 'Knowledge Representation', description: 'First order logic, inference engines, and ontologies' },
    { id: 'unit_ai_3', subjectId: 'sub_aiml', unitNumber: 3, name: 'Supervised Learning Fundamentals', description: 'Linear regression, logistic classification, and decision trees' },
    { id: 'unit_ai_4', subjectId: 'sub_aiml', unitNumber: 4, name: 'Neural Networks & Deep Learning', description: 'Perceptrons, backpropagation, and loss optimization' },

    // DSA units
    { id: 'unit_dsa_1', subjectId: 'sub_dsa', unitNumber: 1, name: 'Linear Structures & Hashing', description: 'Linked lists, stacks, queues, hash tables, and collision handling' },
    { id: 'unit_dsa_2', subjectId: 'sub_dsa', unitNumber: 2, name: 'Trees & Balanced Trees', description: 'Binary trees, BST, AVL trees, and Red-Black trees' },
    { id: 'unit_dsa_3', subjectId: 'sub_dsa', unitNumber: 3, name: 'Graphs & Shortest Paths', description: 'Dijkstra, Bellman-Ford, Floyd-Warshall, and MSTs' },
    { id: 'unit_dsa_4', subjectId: 'sub_dsa', unitNumber: 4, name: 'Dynamic Programming & Greedy', description: 'Knapsack, LCS, LIS, coin change, and intervals' },

    // Computer Networks units
    { id: 'unit_cn_1', subjectId: 'sub_cn', unitNumber: 1, name: 'Foundations & Physical Layer', description: 'Topologies, transmission media, and switching' },
    { id: 'unit_cn_2', subjectId: 'sub_cn', unitNumber: 2, name: 'Data Link Layer & MAC', description: 'Framing, error detection CRC, sliding window, and CSMA/CD' },
    { id: 'unit_cn_3', subjectId: 'sub_cn', unitNumber: 3, name: 'Network Layer & Subnetting', description: 'IPv4/IPv6, CIDR, distance vector, and link state routing' },
    { id: 'unit_cn_4', subjectId: 'sub_cn', unitNumber: 4, name: 'Transport Layer & Congestion', description: 'TCP three-way handshake, UDP, flow control, and slow start' },
  ];

  // 3. TOPICS
  const topics: Topic[] = [
    // Operating Systems topics
    // Unit 1
    { id: 'top_os_1', unitId: 'unit_os_1', subjectId: 'sub_os', name: 'History & Evolution of OS', description: 'Batch systems, time-sharing, real-time operating systems', priority: 'low', status: 'completed', estimatedHours: 1.5 },
    { id: 'top_os_2', unitId: 'unit_os_1', subjectId: 'sub_os', name: 'OS Structures & System Calls', description: 'Dual mode operation, trap handling, POSIX system calls', priority: 'medium', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_os_3', unitId: 'unit_os_1', subjectId: 'sub_os', name: 'Monolithic vs Microkernel Design', description: 'Comparison of kernel abstractions and performance tradeoffs', priority: 'medium', status: 'completed', estimatedHours: 1.5 },

    // Unit 2
    { id: 'top_os_4', unitId: 'unit_os_2', subjectId: 'sub_os', name: 'Process Concept & State Diagrams', description: 'Process control blocks, context switching mechanics', priority: 'high', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_os_5', unitId: 'unit_os_2', subjectId: 'sub_os', name: 'CPU Scheduling Algorithms', description: 'FCFS, SJF, Round Robin, Priority Scheduling and multilevel queues', priority: 'high', status: 'in_progress', estimatedHours: 3.0 },
    { id: 'top_os_6', unitId: 'unit_os_2', subjectId: 'sub_os', name: 'Threads & Multithreading Models', description: 'Kernel vs user threads, pthread API, and multithreading models', priority: 'medium', status: 'completed', estimatedHours: 2.0 },

    // Unit 3
    { id: 'top_os_7', unitId: 'unit_os_3', subjectId: 'sub_os', name: 'Critical Section & Peterson’s Solution', description: 'Mutual exclusion, progress, and bounded waiting conditions', priority: 'high', status: 'completed', estimatedHours: 2.5 },
    { id: 'top_os_8', unitId: 'unit_os_3', subjectId: 'sub_os', name: 'Semaphores & Classical IPC Problems', description: 'Dining Philosophers, Producer-Consumer, Readers-Writers', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_os_9', unitId: 'unit_os_3', subjectId: 'sub_os', name: 'Deadlocks & Banker’s Algorithm', description: 'Deadlock characterization, avoidance, and safety algorithm', priority: 'high', status: 'in_progress', estimatedHours: 2.5 },

    // Unit 4
    { id: 'top_os_10', unitId: 'unit_os_4', subjectId: 'sub_os', name: 'Paging & Segmentation Architecture', description: 'Translation Lookaside Buffer (TLB), multi-level paging', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_os_11', unitId: 'unit_os_4', subjectId: 'sub_os', name: 'Virtual Memory & Page Replacement', description: 'FIFO, LRU, Optimal page replacement, Belady’s anomaly', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_os_12', unitId: 'unit_os_4', subjectId: 'sub_os', name: 'Thrashing & Working Set Model', description: 'Locality of reference, page fault frequency management', priority: 'medium', status: 'not_started', estimatedHours: 2.0 },

    // Unit 5
    { id: 'top_os_13', unitId: 'unit_os_5', subjectId: 'sub_os', name: 'File Organization & Directory Layout', description: 'Hierarchical file systems, hard links vs soft links', priority: 'medium', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_os_14', unitId: 'unit_os_5', subjectId: 'sub_os', name: 'File Allocation & Free Space Management', description: 'Contiguous, linked, and indexed allocation (inodes)', priority: 'high', status: 'in_progress', estimatedHours: 2.5 },
    { id: 'top_os_15', unitId: 'unit_os_5', subjectId: 'sub_os', name: 'Disk Scheduling Algorithms', description: 'FCFS, SSTF, SCAN, C-SCAN, LOOK disk head movement', priority: 'medium', status: 'not_started', estimatedHours: 1.5 },

    // DBMS topics
    // Unit 1
    { id: 'top_dbms_1', unitId: 'unit_dbms_1', subjectId: 'sub_dbms', name: 'Entity Relationship Modeling', description: 'Entities, attributes, relationships, weak entities, Cardinality', priority: 'high', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_dbms_2', unitId: 'unit_dbms_1', subjectId: 'sub_dbms', name: 'Relational Schema Mapping', description: 'Converting ER diagrams into relational tables with integrity constraints', priority: 'medium', status: 'completed', estimatedHours: 2.0 },
    // Unit 2
    { id: 'top_dbms_3', unitId: 'unit_dbms_2', subjectId: 'sub_dbms', name: 'Complex SQL Queries & Subqueries', description: 'Correlated subqueries, nested joins, aggregation functions', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_dbms_4', unitId: 'unit_dbms_2', subjectId: 'sub_dbms', name: 'Relational Algebra Operations', description: 'Selection, projection, Cartesian product, join, division', priority: 'high', status: 'completed', estimatedHours: 2.5 },
    // Unit 3
    { id: 'top_dbms_5', unitId: 'unit_dbms_3', subjectId: 'sub_dbms', name: 'Functional Dependencies & 1NF/2NF/3NF', description: 'Attribute closure, canonical cover, lossless join decomposition', priority: 'high', status: 'completed', estimatedHours: 3.5 },
    { id: 'top_dbms_6', unitId: 'unit_dbms_3', subjectId: 'sub_dbms', name: 'Boyce-Codd Normal Form (BCNF)', description: 'Testing for BCNF, dependency preservation tradeoffs', priority: 'high', status: 'in_progress', estimatedHours: 2.0 },
    { id: 'top_dbms_7', unitId: 'unit_dbms_3', subjectId: 'sub_dbms', name: 'B+ Tree Indexing Structure', description: 'Search, insert, and delete operations on dynamic B+ trees', priority: 'medium', status: 'in_progress', estimatedHours: 2.5 },
    // Unit 4
    { id: 'top_dbms_8', unitId: 'unit_dbms_4', subjectId: 'sub_dbms', name: 'ACID Properties & States', description: 'Atomicity, Consistency, Isolation, Durability transaction states', priority: 'medium', status: 'completed', estimatedHours: 1.5 },
    { id: 'top_dbms_9', unitId: 'unit_dbms_4', subjectId: 'sub_dbms', name: 'Serializability & Concurrency Control', description: 'Conflict vs view serializability, precedence graphs', priority: 'high', status: 'not_started', estimatedHours: 3.0 },
    { id: 'top_dbms_10', unitId: 'unit_dbms_4', subjectId: 'sub_dbms', name: 'Two-Phase Locking (2PL) Protocol', description: 'Strict 2PL, rigorous 2PL, lock escalation and timestamp ordering', priority: 'high', status: 'not_started', estimatedHours: 2.5 },

    // AI & ML topics
    { id: 'top_ai_1', unitId: 'unit_ai_1', subjectId: 'sub_aiml', name: 'A* Search & Admissible Heuristics', description: 'f(n) = g(n) + h(n), consistency criteria, optimality proofs', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_ai_2', unitId: 'unit_ai_1', subjectId: 'sub_aiml', name: 'Minimax & Alpha-Beta Pruning', description: 'Adversarial search in two-player zero-sum board games', priority: 'medium', status: 'completed', estimatedHours: 2.5 },
    { id: 'top_ai_3', unitId: 'unit_ai_2', subjectId: 'sub_aiml', name: 'Propositional & First-Order Logic', description: 'Resolution refutation, unification algorithms, Horn clauses', priority: 'medium', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_ai_4', unitId: 'unit_ai_3', subjectId: 'sub_aiml', name: 'Linear & Logistic Regression', description: 'Gradient descent optimization, mean squared error, log loss', priority: 'high', status: 'in_progress', estimatedHours: 3.5 },
    { id: 'top_ai_5', unitId: 'unit_ai_3', subjectId: 'sub_aiml', name: 'Decision Trees & Information Gain', description: 'Entropy, Gini impurity, ID3 algorithm, tree pruning', priority: 'medium', status: 'not_started', estimatedHours: 2.5 },
    { id: 'top_ai_6', unitId: 'unit_ai_4', subjectId: 'sub_aiml', name: 'Multi-layer Perceptron & Backprop', description: 'Activation functions (ReLU, Sigmoid), chain rule gradient derivation', priority: 'high', status: 'not_started', estimatedHours: 4.0 },

    // DSA topics
    { id: 'top_dsa_1', unitId: 'unit_dsa_1', subjectId: 'sub_dsa', name: 'Array Sliding Window & Two Pointers', description: 'Techniques for sub-array problems and fast convergence', priority: 'high', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_dsa_2', unitId: 'unit_dsa_1', subjectId: 'sub_dsa', name: 'Hash Map Collision Handling', description: 'Separate chaining, open addressing with linear and quadratic probing', priority: 'medium', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_dsa_3', unitId: 'unit_dsa_2', subjectId: 'sub_dsa', name: 'Binary Search Tree & Traversals', description: 'In-order, pre-order, post-order, and level-order traversals', priority: 'high', status: 'completed', estimatedHours: 2.5 },
    { id: 'top_dsa_4', unitId: 'unit_dsa_2', subjectId: 'sub_dsa', name: 'AVL Tree Self-Balancing Rotations', description: 'LL, RR, LR, RL balancing rotations, balance factors', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_dsa_5', unitId: 'unit_dsa_3', subjectId: 'sub_dsa', name: 'Dijkstra’s Algorithm & Min-Heap', description: 'Single-source shortest path for non-negative edge weights', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_dsa_6', unitId: 'unit_dsa_3', subjectId: 'sub_dsa', name: 'Bellman-Ford & Negative Cycles', description: 'Edge relaxation techniques and detecting negative weight cycles', priority: 'medium', status: 'in_progress', estimatedHours: 2.5 },
    { id: 'top_dsa_7', unitId: 'unit_dsa_4', subjectId: 'sub_dsa', name: '0/1 Knapsack & Subset Sum', description: 'Top-down memoization vs bottom-up tabulation approach', priority: 'high', status: 'in_progress', estimatedHours: 3.5 },
    { id: 'top_dsa_8', unitId: 'unit_dsa_4', subjectId: 'sub_dsa', name: 'Longest Common Subsequence (LCS)', description: 'String alignment matrix dynamic programming formulation', priority: 'high', status: 'not_started', estimatedHours: 2.5 },

    // CN topics
    { id: 'top_cn_1', unitId: 'unit_cn_1', subjectId: 'sub_cn', name: 'OSI vs TCP/IP 5-Layer Stack', description: 'Data encapsulation, protocols at each layer, encapsulation headers', priority: 'medium', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_cn_2', unitId: 'unit_cn_2', subjectId: 'sub_cn', name: 'Error Detection: CRC & Parity', description: 'Polynomial division for Cyclic Redundancy Check calculation', priority: 'medium', status: 'completed', estimatedHours: 2.0 },
    { id: 'top_cn_3', unitId: 'unit_cn_2', subjectId: 'sub_cn', name: 'Sliding Window Protocols (Go-Back-N)', description: 'Selective repeat, window size constraints, piggybacking', priority: 'high', status: 'completed', estimatedHours: 3.0 },
    { id: 'top_cn_4', unitId: 'unit_cn_3', subjectId: 'sub_cn', name: 'IPv4 Addressing & CIDR Subnetting', description: 'Variable length subnet masks (VLSM), broadcast and network address calc', priority: 'high', status: 'in_progress', estimatedHours: 3.0 },
    { id: 'top_cn_5', unitId: 'unit_cn_3', subjectId: 'sub_cn', name: 'Distance Vector vs Link State Routing', description: 'Count-to-infinity problem, Bellman-Ford vs Dijkstra routing implementations', priority: 'high', status: 'not_started', estimatedHours: 2.5 },
    { id: 'top_cn_6', unitId: 'unit_cn_4', subjectId: 'sub_cn', name: 'TCP 3-Way Handshake & Flow Control', description: 'SYN, SYN-ACK, ACK, sliding window advertised buffer, fast retransmit', priority: 'high', status: 'not_started', estimatedHours: 3.0 },
  ];

  // 4. STUDY TASKS
  const tasks: StudyTask[] = [
    {
      id: 'task_01',
      title: 'Revise Process Scheduling',
      description: 'Practice 5 numerical problems on Round Robin and Priority Preemptive algorithms.',
      subjectId: 'sub_os',
      unitId: 'unit_os_2',
      topicId: 'top_os_5',
      date: today,
      startTime: '10:00',
      endTime: '11:30',
      priority: 'high',
      status: 'pending',
    },
    {
      id: 'task_02',
      title: 'Practice SQL Queries',
      description: 'Write complex nested joins, group by, and aggregate queries on student database.',
      subjectId: 'sub_dbms',
      unitId: 'unit_dbms_2',
      topicId: 'top_dbms_3',
      date: today,
      startTime: '12:00',
      endTime: '13:30',
      priority: 'medium',
      status: 'completed',
      completedAt: `${today}T13:25:00`,
    },
    {
      id: 'task_03',
      title: 'Study Deadlocks & Banker’s Algorithm',
      description: 'Derive safety sequence for multi-resource allocation matrices.',
      subjectId: 'sub_os',
      unitId: 'unit_os_3',
      topicId: 'top_os_9',
      date: today,
      startTime: '15:00',
      endTime: '17:00',
      priority: 'high',
      status: 'pending',
    },
    {
      id: 'task_04',
      title: 'Revise Unit 4 Memory Paging',
      description: 'Review TLB hit ratios, 2-level page tables, and inverted page table diagrams.',
      subjectId: 'sub_os',
      unitId: 'unit_os_4',
      topicId: 'top_os_10',
      date: today,
      startTime: '18:00',
      endTime: '19:30',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 'task_05',
      title: 'Solve 0/1 Knapsack DP Problems',
      description: 'Code bottom-up 2D and 1D space optimized tabulation on LeetCode/GeeksforGeeks.',
      subjectId: 'sub_dsa',
      unitId: 'unit_dsa_4',
      topicId: 'top_dsa_7',
      date: dPlus1,
      startTime: '09:30',
      endTime: '11:30',
      priority: 'high',
      status: 'pending',
    },
    {
      id: 'task_06',
      title: 'Review B+ Trees & Indexing',
      description: 'Understand leaf node split heuristics and node pointer calculations.',
      subjectId: 'sub_dbms',
      unitId: 'unit_dbms_3',
      topicId: 'top_dbms_7',
      date: dPlus1,
      startTime: '14:00',
      endTime: '16:00',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 'task_07',
      title: 'Gradient Descent Mathematical Derivation',
      description: 'Work out partial derivatives for linear regression weight updates.',
      subjectId: 'sub_aiml',
      unitId: 'unit_ai_3',
      topicId: 'top_ai_4',
      date: dPlus2,
      startTime: '10:30',
      endTime: '12:30',
      priority: 'high',
      status: 'pending',
    },
    {
      id: 'task_08',
      title: 'Practice CIDR Subnetting Questions',
      description: 'Calculate valid host ranges, broadcast IP, and subnet masks for 10 problems.',
      subjectId: 'sub_cn',
      unitId: 'unit_cn_3',
      topicId: 'top_cn_4',
      date: dPlus2,
      startTime: '16:00',
      endTime: '17:30',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 'task_09',
      title: 'Review Critical Section Solutions',
      description: 'Completed Peterson algorithm proof and Test-and-Set hardware primitive.',
      subjectId: 'sub_os',
      unitId: 'unit_os_3',
      topicId: 'top_os_7',
      date: dMinus1,
      startTime: '11:00',
      endTime: '12:30',
      priority: 'high',
      status: 'completed',
      completedAt: `${dMinus1}T12:20:00`,
    },
    {
      id: 'task_10',
      title: 'ER Diagrams and Cardinality Practice',
      description: 'Draw university management system schema diagram with total participation.',
      subjectId: 'sub_dbms',
      unitId: 'unit_dbms_1',
      topicId: 'top_dbms_1',
      date: dMinus2,
      startTime: '14:00',
      endTime: '15:30',
      priority: 'medium',
      status: 'completed',
      completedAt: `${dMinus2}T15:30:00`,
    },
  ];

  // 5. EXAMS
  const exams: Exam[] = [
    {
      id: 'exam_os',
      subjectId: 'sub_os',
      examName: 'Mid-Term Examination: Operating Systems',
      date: dPlus5,
      time: '10:00 AM - 01:00 PM',
      location: 'Academic Block B, Room 304',
      targetScore: 92,
      notes: 'Covers Units 1 to 5 with heavy weightage on CPU Scheduling, Deadlocks, and Paging.',
    },
    {
      id: 'exam_dbms',
      subjectId: 'sub_dbms',
      examName: 'Final Theory Exam: DBMS',
      date: dPlus13,
      time: '02:00 PM - 05:00 PM',
      location: 'Science Hall 101',
      targetScore: 95,
      notes: 'Comprehensive exam: SQL queries, normalization proofs, and 2PL transaction recovery.',
    },
    {
      id: 'exam_aiml',
      subjectId: 'sub_aiml',
      examName: 'Mid-Term: Artificial Intelligence & ML',
      date: dPlus18,
      time: '10:00 AM - 12:00 PM',
      location: 'Engineering Building, Lab 4',
      targetScore: 88,
      notes: 'Focus on A* heuristics admissibility and supervised regression models.',
    },
    {
      id: 'exam_dsa',
      subjectId: 'sub_dsa',
      examName: 'Semester Lab & Theory: Data Structures',
      date: dPlus25,
      time: '09:00 AM - 12:00 PM',
      location: 'Computer Center Lab 2',
      targetScore: 96,
      notes: 'Coding round + written exam on Graph shortest paths & Dynamic Programming.',
    },
    {
      id: 'exam_cn',
      subjectId: 'sub_cn',
      examName: 'Final Exam: Computer Networks',
      date: dPlus32,
      time: '02:00 PM - 05:00 PM',
      location: 'Hall A',
      targetScore: 90,
      notes: 'Subnetting calculations, TCP state machine, and routing protocols.',
    },
  ];

  return { subjects, units, topics, tasks, exams };
}
