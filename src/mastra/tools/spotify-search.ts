// src/tools/spotify-search.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const musicSearch = createTool({
  id: 'search-music',
  description: 'Search for music recommendations based on mood and genre',
  inputSchema: z.object({
    mood: z.string(),
    genres: z.array(z.string()),
    intensity: z.number(),
  }),
  outputSchema: z.object({
    recommendations: z.array(z.object({
      song: z.string(),
      artist: z.string(),
      reason: z.string(),
    })),
  }),

  async execute({ context }) {
    // Mock recommendations based on mood
    // In production, you'd call Spotify/Last.fm API
    
    const moodPlaylists: Record<string, Array<{song: string, artist: string, reason: string}>> = {
      happy: [
        { song: 'Happy', artist: 'Pharrell Williams', reason: 'Pure joy and positivity' },
        { song: 'Good Life', artist: 'OneRepublic', reason: 'Celebrating the good times' },
        { song: 'Walking on Sunshine', artist: 'Katrina and The Waves', reason: 'Infectious energy' },
        { song: 'Don\'t Stop Me Now', artist: 'Queen', reason: 'Unstoppable happiness' },
        { song: 'September', artist: 'Earth, Wind & Fire', reason: 'Feel-good vibes' },
      ],
      sad: [
        { song: 'Someone Like You', artist: 'Adele', reason: 'Embracing heartbreak' },
        { song: 'The Night We Met', artist: 'Lord Huron', reason: 'Processing loss and nostalgia' },
        { song: 'Skinny Love', artist: 'Bon Iver', reason: 'Raw emotional vulnerability' },
        { song: 'Hurt', artist: 'Johnny Cash', reason: 'Deep emotional pain' },
        { song: 'Mad World', artist: 'Gary Jules', reason: 'Melancholic reflection' },
      ],
      energetic: [
        { song: 'Eye of the Tiger', artist: 'Survivor', reason: 'Peak motivation' },
        { song: 'Lose Yourself', artist: 'Eminem', reason: 'Push through limits' },
        { song: 'Thunderstruck', artist: 'AC/DC', reason: 'Pure adrenaline' },
        { song: 'Till I Collapse', artist: 'Eminem', reason: 'Never give up energy' },
        { song: 'Stronger', artist: 'Kanye West', reason: 'Empowering beats' },
      ],
      calm: [
        { song: 'Weightless', artist: 'Marconi Union', reason: 'Scientifically proven to relax' },
        { song: 'Claire de Lune', artist: 'Claude Debussy', reason: 'Peaceful piano' },
        { song: 'Sunset Lover', artist: 'Petit Biscuit', reason: 'Gentle electronic vibes' },
        { song: 'River Flows in You', artist: 'Yiruma', reason: 'Soothing melody' },
        { song: 'To Build a Home', artist: 'The Cinematic Orchestra', reason: 'Emotional tranquility' },
      ],
      romantic: [
        { song: 'Thinking Out Loud', artist: 'Ed Sheeran', reason: 'Modern love ballad' },
        { song: 'All of Me', artist: 'John Legend', reason: 'Unconditional love' },
        { song: 'At Last', artist: 'Etta James', reason: 'Classic romance' },
        { song: 'Make You Feel My Love', artist: 'Adele', reason: 'Deep devotion' },
        { song: 'La Vie En Rose', artist: 'Louis Armstrong', reason: 'Timeless romance' },
      ],
      angry: [
        { song: 'Break Stuff', artist: 'Limp Bizkit', reason: 'Channel that rage' },
        { song: 'Killing in the Name', artist: 'Rage Against the Machine', reason: 'Revolutionary anger' },
        { song: 'Bodies', artist: 'Drowning Pool', reason: 'Intense aggression' },
        { song: 'Down with the Sickness', artist: 'Disturbed', reason: 'Raw fury' },
        { song: 'Sabotage', artist: 'Beastie Boys', reason: 'Frustrated energy' },
      ],
      nostalgic: [
        { song: 'Summer of \'69', artist: 'Bryan Adams', reason: 'Classic reminiscing' },
        { song: 'Mr. Brightside', artist: 'The Killers', reason: '2000s nostalgia' },
        { song: 'Wonderwall', artist: 'Oasis', reason: '90s memories' },
        { song: 'Bohemian Rhapsody', artist: 'Queen', reason: 'Timeless classic' },
        { song: 'Dreams', artist: 'Fleetwood Mac', reason: 'Vintage vibes' },
      ],
      anxious: [
        { song: 'Breathe Me', artist: 'Sia', reason: 'Grounding and calming' },
        { song: 'Holocene', artist: 'Bon Iver', reason: 'Perspective and peace' },
        { song: 'Clair de Lune', artist: 'Debussy', reason: 'Stress relief' },
        { song: 'Intro', artist: 'The xx', reason: 'Minimalist calm' },
        { song: 'Nude', artist: 'Radiohead', reason: 'Gentle reassurance' },
      ],
    };

    const recommendations = moodPlaylists[context.mood] || moodPlaylists['calm'];
    
    return {
      recommendations: recommendations.slice(0, 5),
    };
  },
});