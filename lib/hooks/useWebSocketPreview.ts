// lib/hooks/useWebSocketPreview.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import type { SectionNode } from '@/types/section-system';

interface WSMessage {
  type: 'init' | 'preview' | 'command' | 'undo' | 'redo' | 'get' | 'subscribe';
  sessionId?: string;
  sections?: SectionNode[];
  command?: string;
  id: string;
}

interface WSResponse {
  type: 'response' | 'update';
  id?: string;
  sessionId: string;
  success: boolean;
  data?: any;
  error?: string;
}

interface PreviewState {
  sections: SectionNode[];
  sessionId?: string;
  connected: boolean;
  loading: boolean;
  error?: string;
}

export function useWebSocketPreview(initialSections: SectionNode[] = []) {
  const [state, setState] = useState<PreviewState>({
    sections: initialSections,
    connected: false,
    loading: false
  });

  const wsRef = useRef<WebSocket | null>(null);
  const pendingMessages = useRef<Map<string, (response: WSResponse) => void>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket('ws://localhost:3001');

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({ ...prev, connected: true, error: undefined }));
        
        // Subscribe to existing session if we have one
        if (state.sessionId) {
          sendMessage({
            type: 'subscribe',
            sessionId: state.sessionId,
            id: generateId()
          });
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const response: WSResponse = JSON.parse(event.data);
          
          if (response.type === 'response' && response.id) {
            // Handle response to specific message
            const callback = pendingMessages.current.get(response.id);
            if (callback) {
              callback(response);
              pendingMessages.current.delete(response.id);
            }
          } else if (response.type === 'update') {
            // Handle broadcast updates from other clients
            if (response.success && response.data) {
              setState(prev => ({
                ...prev,
                sections: response.data.sections || prev.sections
              }));
            }
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setState(prev => ({ ...prev, connected: false }));
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          connected: false, 
          error: 'Connection error' 
        }));
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        error: 'Failed to connect' 
      }));
    }
  }, [state.sessionId]);

  const sendMessage = useCallback((message: WSMessage): Promise<WSResponse> => {
    return new Promise((resolve, reject) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      pendingMessages.current.set(message.id, resolve);
      wsRef.current.send(JSON.stringify(message));

      // Timeout after 10 seconds
      setTimeout(() => {
        if (pendingMessages.current.has(message.id)) {
          pendingMessages.current.delete(message.id);
          reject(new Error('Message timeout'));
        }
      }, 10000);
    });
  }, []);

  const init = useCallback(async (sections: SectionNode[], sessionId?: string) => {
    setState(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      const response = await sendMessage({
        type: 'init',
        sections,
        sessionId,
        id: generateId()
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          sections: response.data.sections,
          sessionId: response.sessionId,
          loading: false
        }));
      } else {
        throw new Error(response.error || 'Init failed');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  }, [sendMessage]);

  const preview = useCallback(async (command: string) => {
    if (!state.sessionId) throw new Error('No active session');
    
    setState(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      const response = await sendMessage({
        type: 'preview',
        sessionId: state.sessionId,
        command,
        id: generateId()
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          sections: response.data.sections || prev.sections,
          loading: false
        }));
        return response.data;
      } else {
        throw new Error(response.error || 'Preview failed');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  }, [state.sessionId, sendMessage]);

  const command = useCallback(async (cmd: string) => {
    if (!state.sessionId) throw new Error('No active session');
    
    setState(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      const response = await sendMessage({
        type: 'command',
        sessionId: state.sessionId,
        command: cmd,
        id: generateId()
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          sections: response.data.sections || prev.sections,
          loading: false
        }));
        return response.data;
      } else {
        throw new Error(response.error || 'Command failed');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  }, [state.sessionId, sendMessage]);

  const undo = useCallback(async () => {
    if (!state.sessionId) return;
    
    try {
      const response = await sendMessage({
        type: 'undo',
        sessionId: state.sessionId,
        id: generateId()
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          sections: response.data.sections || prev.sections
        }));
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  }, [state.sessionId, sendMessage]);

  const redo = useCallback(async () => {
    if (!state.sessionId) return;
    
    try {
      const response = await sendMessage({
        type: 'redo',
        sessionId: state.sessionId,
        id: generateId()
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          sections: response.data.sections || prev.sections
        }));
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  }, [state.sessionId, sendMessage]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    ...state,
    init,
    preview,
    command,
    undo,
    redo,
    connect
  };
}