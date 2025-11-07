// src/mastra/server.ts
import express, { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { mastra } from './index.js';

const app = express();
app.use(express.json());

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    agent: 'Mood Music Recommender',
    message: 'Tell me your mood and I\'ll recommend the perfect songs!' 
  });
});

// A2A endpoint for Telex.im - using JSON-RPC 2.0 protocol
app.post('/a2a/agent/moodMusicAgent', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, any>;

    const { jsonrpc, id: requestId, method, params } = body;

    // Validate JSON-RPC 2.0 format
    if (jsonrpc !== '2.0' || !requestId) {
      res.status(400).json({
        jsonrpc: '2.0',
        id: requestId || null,
        error: {
          code: -32600,
          message: 'Invalid Request: jsonrpc must be "2.0" and id is required'
        }
      });
      return;
    }

    const moodAgent = mastra.getAgent('moodMusicAgent');
    if (!moodAgent) {
      res.status(404).json({
        jsonrpc: '2.0',
        id: requestId,
        error: {
          code: -32602,
          message: 'Mood Music Agent not found'
        }
      });
      return;
    }

    // Extract messages from params
    const { message, messages, contextId, taskId } = params || {};
    let messagesList: Record<string, any>[] = [];

    if (message) {
      messagesList = [{ role: 'user', parts: [{ kind: 'text', text: message }] }];
    } else if (messages && Array.isArray(messages)) {
      messagesList = messages;
    }

    // Convert A2A messages to Mastra format
    const mastraMessages = messagesList.map((msg: Record<string, any>) => ({
      role: msg.role || 'user',
      content: msg.parts?.map((part: Record<string, any>) => {
        if (part.kind === 'text') return part.text;
        if (part.kind === 'data') return JSON.stringify(part.data);
        return '';
      }).join('\n') || ''
    }));

    console.log('Processing messages for agent: moodMusicAgent');
    console.log('Messages:', mastraMessages);

    // Execute agent
    const response = await moodAgent.generate(mastraMessages);
    const agentText = response.text || 'I could not generate a response';

    console.log('Agent response:', agentText);

    // Build artifacts array
    const artifacts = [
      {
        artifactId: randomUUID(),
        name: 'moodMusicAgentResponse',
        parts: [{ kind: 'text', text: agentText }]
      }
    ];



    // Build conversation history
    const history: Record<string, any>[] = [
      ...messagesList.map((msg: Record<string, any>) => ({
        kind: 'message',
        role: msg.role || 'user',
        parts: msg.parts || [],
        messageId: msg.messageId || randomUUID(),
        taskId: msg.taskId || taskId || randomUUID(),
      })),
      {
        kind: 'message',
        role: 'agent',
        parts: [{ kind: 'text', text: agentText }],
        messageId: randomUUID(),
        taskId: taskId || randomUUID(),
      }
    ];

    // Return A2A-compliant response
    res.json({
      jsonrpc: '2.0',
      id: requestId,
      result: {
        id: taskId || randomUUID(),
        contextId: contextId || randomUUID(),
        status: {
          state: 'completed',
          timestamp: new Date().toISOString(),
          message: {
            messageId: randomUUID(),
            role: 'agent',
            parts: [{ kind: 'text', text: agentText }],
            kind: 'message'
          }
        },
        artifacts,
        history,
        kind: 'task'
      }
    });
  } catch (error: any) {
    console.error('A2A Error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: 'Internal error',
        data: { details: error.message }
      }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 Mood Music Agent running on port ${PORT}`);
  console.log(`📍 A2A endpoint: http://localhost:${PORT}/a2a/agent/moodMusicAgent`);
});