// src/mastra/server.ts
import express from 'express';
import { mastra } from './index.js'; // Note the .js extension for ES modules

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    agent: 'Mood Music Recommender',
    message: 'Tell me your mood and I\'ll recommend the perfect songs!' 
  });
});

// A2A endpoint for Telex.im
app.post('/a2a/agent/moodMusicAgent', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }
    
    console.log('Received message:', message);
    
    // Use your mastra instance, not the Mastra class
    const agent = mastra.getAgent('moodMusicAgent');
    
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agent not found' 
      });
    }
    
    const response = await agent.generate(message);
    
    res.json({
      response: response.text,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Agent error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 Mood Music Agent running on port ${PORT}`);
  console.log(`📍 A2A endpoint: http://localhost:${PORT}/a2a/agent/moodMusicAgent`);
});