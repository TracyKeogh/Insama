// Simple Express server for session storage
// Deploy to Railway, Render, or Vercel for free

const express = require('express');
const cors = require('cors');
const app = express();

// In-memory storage (for demo - use Redis/DB in production)
const sessions = new Map();

app.use(cors());
app.use(express.json());

// Save session
app.post('/api/sessions', (req, res) => {
  try {
    const { sessionId, data } = req.body;
    sessions.set(sessionId, {
      ...data,
      createdAt: new Date(),
      lastUpdated: new Date()
    });
    res.json({ success: true, sessionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Load session
app.get('/api/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session
app.put('/api/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { data } = req.body;
    
    if (!sessions.has(sessionId)) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const existing = sessions.get(sessionId);
    sessions.set(sessionId, {
      ...existing,
      ...data,
      lastUpdated: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete session
app.delete('/api/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    sessions.delete(sessionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', sessions: sessions.size });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
