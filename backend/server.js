import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: db.isMongoDB() ? 'MongoDB Atlas' : 'Local JSON Document DB',
    message: 'Student Study Planner Backend & Database is running perfectly',
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
    res.status(201).json({ success: true, user });
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

    res.json({ success: true, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login error' });
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
    res.json({ success: true, message: 'Password updated successfully', user: updated });
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
  });
}

startServer();
