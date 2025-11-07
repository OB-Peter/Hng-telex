// src/tools/mood-analyzer.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const moodAnalyzer = createTool({
  id: 'analyze-mood',
  description: 'Analyzes user text to determine their emotional state and mood',
  inputSchema: z.object({
    userMessage: z.string().describe('The user\'s message describing their mood'),
  }),
  outputSchema: z.object({
    primaryMood: z.enum([
      'happy', 'sad', 'energetic', 'calm', 
      'angry', 'nostalgic', 'romantic', 'anxious', 
      'motivated', 'melancholic'
    ]),
    intensity: z.number().min(1).max(10),
    suggestedGenres: z.array(z.string()),
    suggestedTempo: z.enum(['slow', 'medium', 'fast']),
    vibe: z.string(),
  }),

  async execute({ context }) {
    const msg = context.userMessage.toLowerCase();
    
    let mood = 'calm';
    let intensity = 5;
    let genres: string[] = [];
    let tempo = 'medium';
    let vibe = '';

    // Happy/Excited
    if (msg.match(/happy|excited|great|amazing|wonderful|joyful|cheerful/)) {
      mood = 'happy';
      intensity = 8;
      genres = ['pop', 'dance', 'funk', 'disco'];
      tempo = 'fast';
      vibe = 'upbeat and energetic';
    }
    
    // Sad/Down
    else if (msg.match(/sad|depressed|down|heartbroken|lonely|hurt/)) {
      mood = 'sad';
      intensity = msg.match(/very|really|extremely/) ? 9 : 6;
      genres = ['indie', 'alternative', 'acoustic', 'soul'];
      tempo = 'slow';
      vibe = 'melancholic and introspective';
    }
    
    // Energetic/Workout
    else if (msg.match(/energetic|pumped|workout|gym|exercise|motivated/)) {
      mood = 'energetic';
      intensity = 9;
      genres = ['rock', 'edm', 'hip-hop', 'electronic'];
      tempo = 'fast';
      vibe = 'high-energy and motivating';
    }
    
    // Calm/Relaxed
    else if (msg.match(/calm|relax|chill|peaceful|tired|sleepy/)) {
      mood = 'calm';
      intensity = 3;
      genres = ['lo-fi', 'ambient', 'jazz', 'classical'];
      tempo = 'slow';
      vibe = 'peaceful and soothing';
    }
    
    // Romantic
    else if (msg.match(/romantic|love|date|intimate/)) {
      mood = 'romantic';
      intensity = 7;
      genres = ['r&b', 'soul', 'jazz', 'indie'];
      tempo = 'medium';
      vibe = 'romantic and intimate';
    }
    
    // Angry/Frustrated
    else if (msg.match(/angry|mad|frustrated|annoyed/)) {
      mood = 'angry';
      intensity = 8;
      genres = ['rock', 'metal', 'punk', 'rap'];
      tempo = 'fast';
      vibe = 'intense and aggressive';
    }
    
    // Nostalgic
    else if (msg.match(/nostalgic|memories|past|remember|miss/)) {
      mood = 'nostalgic';
      intensity = 6;
      genres = ['classic rock', '80s', '90s', 'indie'];
      tempo = 'medium';
      vibe = 'nostalgic and reflective';
    }
    
    // Anxious/Stressed
    else if (msg.match(/anxious|stressed|worried|nervous/)) {
      mood = 'anxious';
      intensity = 7;
      genres = ['ambient', 'classical', 'acoustic', 'meditation'];
      tempo = 'slow';
      vibe = 'calming and grounding';
    }

    return {
      primaryMood: mood as any,
      intensity,
      suggestedGenres: genres,
      suggestedTempo: tempo as any,
      vibe,
    };
  },
});