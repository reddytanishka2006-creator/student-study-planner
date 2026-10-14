import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { db, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'study_planner_fallback_secret_key_2026';

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
}

// JWT Authentication Middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Root endpoint - API Status & Landing Page
app.get('/', (req, res) => {
  const isMongo = db.isMongoDB();
  const frontendUrl = process.env.FRONTEND_URL || 'https://student-study-planner-tsjs.vercel.app';
  
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Study Planner API - Online</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #090d16;
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 600px;
      width: 100%;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 12px #10b981;
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      padding: 14px 28px;
      border-radius: 14px;
      font-weight: 700;
      text-decoration: none;
      font-size: 15px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6);
    }
    .endpoints {
      margin-top: 32px;
      text-align: left;
      background: #0d131f;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 16px;
      font-size: 13px;
      color: #94a3b8;
      font-family: monospace;
    }
    .ep-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #1e293b;
    }
    .ep-item:last-child { border-bottom: none; }
    .method { color: #38bdf8; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="pulse"></span>
      Backend & Database Live
    </div>
    <h1>Student Study Planner API</h1>
    <p>The backend REST API server and MongoDB Atlas database are running and ready to handle student authentication, syllabus tracking, tasks, and exam data.</p>
    
    <a href="${frontendUrl}" class="btn" target="_blank">
      Open Study Planner App &rarr;
    </a>

    <div class="endpoints">
      <div class="ep-item"><span class="method">GET</span> <span>/api/health</span></div>
      <div class="ep-item"><span class="method">POST</span> <span>/api/auth/login</span></div>
      <div class="ep-item"><span class="method">POST</span> <span>/api/auth/register</span></div>
      <div class="ep-item"><span class="method">GET</span> <span>/api/data/:userId</span></div>
    </div>
  </div>
</body>
</html>`);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: db.isMongoDB() ? 'MongoDB Atlas' : 'Local JSON Document DB',
    jwtConfigured: Boolean(process.env.JWT_SECRET),
    message: 'Student Study Planner Backend, JWT Auth & Database are running perfectly',
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await db.createUser({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({ 
      success: true, 
      token, 
      user 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({ 
      success: true, 
      token, 
      user 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login error' });
  }
});

// Verify token and get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    const updated = await db.updateUser(user.id, { password: newPassword });
    const token = generateToken(updated);

    res.json({ 
      success: true, 
      message: 'Password updated successfully', 
      token, 
      user: updated 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const updated = await db.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// User study planner data endpoints (Subjects, Units, Topics, Tasks, Exams)
app.get('/api/data/:userId', async (req, res) => {
  try {
    const data = await db.getUserData(req.params.userId);
    res.json({ data });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.put('/api/data/:userId', async (req, res) => {
  try {
    const success = await db.saveUserData(req.params.userId, req.body);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.post('/api/data/:userId/reset', async (req, res) => {
  try {
    const data = await db.resetUserData(req.params.userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error resetting data:', err);
    res.status(500).json({ error: 'Failed to reset data' });
  }
});

// Initialize database and start server
async function startServer() {
  await initDatabase(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Database provider: ${db.isMongoDB() ? 'MongoDB Atlas 🍃' : 'Local JSON Document DB 📁'}`);
    console.log(`JWT Authentication: Enabled 🔐`);
  });
}

startServer();
