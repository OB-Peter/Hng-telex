import { Mastra } from '@mastra/core/mastra';
import { moodMusicAgent } from '../agents/mood-music-agent';

export const moodMusicWorkflow = {
  id: 'mood-music-recommender',
  name: 'Mood Music Recommender',
  description: 'A workflow that recommends songs based on mood',
  long_description: 'You are a friendly music recommendation assistant. When users tell you how they\'re feeling, analyze their mood and recommend 5 perfect songs that match their vibe.',
  short_description: 'Get personalized music recommendations based on your mood',
  category: 'utilities',
  nodes: [
    {
      id: 'mood_agent',
      name: 'Mood Music Recommender Agent',
      type: 'a2a/mastra-a2a-node',
      typeVersion: 1,
      position: [816, -112],
      parameters: {},
      "url": "https://your-agent-url.com/a2a/agent/moodMusicAgent"
    },
  ],
};