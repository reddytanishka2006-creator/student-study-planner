import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { db, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'study_planner_fallback_secret_key_2026';

app.use(cors());
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
