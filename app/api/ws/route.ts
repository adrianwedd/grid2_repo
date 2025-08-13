// app/api/ws/route.ts
import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { initSession, handlePreview, handleCommand, handleUndo, handleRedo, handleGet, getSession } from '@/lib/preview-session';
import type { SectionNode } from '@/types/section-system';

let wss: WebSocketServer | null = null;

// WebSocket message types
interface WSMessage {
  type: 'init' | 'preview' | 'command' | 'undo' | 'redo' | 'get' | 'subscribe';
  sessionId?: string;
  sections?: SectionNode[];
  command?: string;
  id: string; // Message ID for responses
}

interface WSResponse {
  type: 'response' | 'update';
  id?: string; // Response to message ID
  sessionId: string;
  success: boolean;
  data?: any;
  error?: string;
}

// Track connected clients by session
const sessionClients = new Map<string, Set<any>>();

function initWebSocketServer() {
  if (wss) return wss;
  
  wss = new WebSocketServer({ 
    port: 3001,
    perMessageDeflate: false 
  });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        await handleMessage(ws, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
        sendError(ws, 'Invalid message format', '');
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      // Remove from all sessions
      for (const [sessionId, clients] of sessionClients.entries()) {
        clients.delete(ws);
        if (clients.size === 0) {
          sessionClients.delete(sessionId);
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket server started on port 3001');
  return wss;
}

async function handleMessage(ws: any, message: WSMessage) {
  const { type, sessionId, sections, command, id } = message;

  try {
    switch (type) {
      case 'init':
        if (!sections) throw new Error('Sections required for init');
        const session = initSession(sections, sessionId);
        subscribeToSession(ws, session.id);
        sendResponse(ws, id, session.id, true, { sections });
        break;

      case 'subscribe':
        if (!sessionId) throw new Error('SessionId required for subscribe');
        subscribeToSession(ws, sessionId);
        sendResponse(ws, id, sessionId, true, {});
        break;

      case 'preview':
        if (!sessionId || !command) throw new Error('SessionId and command required');
        const previewResult = await handlePreview(sessionId, command);
        sendResponse(ws, id, sessionId, true, previewResult);
        // Broadcast to all clients in this session
        broadcastUpdate(sessionId, previewResult);
        break;

      case 'command':
        if (!sessionId || !command) throw new Error('SessionId and command required');
        const commandResult = await handleCommand(sessionId, command);
        sendResponse(ws, id, sessionId, true, commandResult);
        broadcastUpdate(sessionId, commandResult);
        break;

      case 'undo':
        if (!sessionId) throw new Error('SessionId required');
        const undoResult = handleUndo(sessionId);
        sendResponse(ws, id, sessionId, true, undoResult);
        broadcastUpdate(sessionId, undoResult);
        break;

      case 'redo':
        if (!sessionId) throw new Error('SessionId required');
        const redoResult = handleRedo(sessionId);
        sendResponse(ws, id, sessionId, true, redoResult);
        broadcastUpdate(sessionId, redoResult);
        break;

      case 'get':
        if (!sessionId) throw new Error('SessionId required');
        const getResult = handleGet(sessionId);
        sendResponse(ws, id, sessionId, true, getResult);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error: any) {
    sendError(ws, error.message, id, sessionId);
  }
}

function subscribeToSession(ws: any, sessionId: string) {
  if (!sessionClients.has(sessionId)) {
    sessionClients.set(sessionId, new Set());
  }
  sessionClients.get(sessionId)!.add(ws);
}

function broadcastUpdate(sessionId: string, data: any) {
  const clients = sessionClients.get(sessionId);
  if (!clients) return;

  const updateMessage: WSResponse = {
    type: 'update',
    sessionId,
    success: true,
    data
  };

  const message = JSON.stringify(updateMessage);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

function sendResponse(ws: any, messageId: string, sessionId: string, success: boolean, data?: any) {
  const response: WSResponse = {
    type: 'response',
    id: messageId,
    sessionId,
    success,
    data
  };
  ws.send(JSON.stringify(response));
}

function sendError(ws: any, error: string, messageId?: string, sessionId?: string) {
  const response: WSResponse = {
    type: 'response',
    id: messageId,
    sessionId: sessionId || '',
    success: false,
    error
  };
  ws.send(JSON.stringify(response));
}

// HTTP endpoint to start WebSocket server
export async function GET(req: NextRequest) {
  try {
    initWebSocketServer();
    return new Response(JSON.stringify({ 
      status: 'WebSocket server running on port 3001',
      endpoint: 'ws://localhost:3001'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Auto-start WebSocket server in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    initWebSocketServer();
  }, 1000);
}