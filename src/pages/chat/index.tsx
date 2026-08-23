import React, { useState, useCallback, useRef } from 'react';
import ChatInput from '@/components/Chat/ChatInput';
import { Plus, MessageSquare, X } from 'lucide-react';

interface ChatSession {
  id: string;
  name: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  createdAt: number;
}

export default function AIChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      name: 'New Chat 1',
      messages: [],
      createdAt: Date.now(),
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [isCreating, setIsCreating] = useState(false);
  const createTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Prevent duplicate chat creation with debouncing and guard
  const createNewChat = useCallback(() => {
    // Guard against rapid multiple clicks
    if (isCreating) return;
    
    // Clear any pending creation timeout
    if (createTimeoutRef.current) {
      clearTimeout(createTimeoutRef.current);
    }

    setIsCreating(true);

    // Use a small delay to prevent double clicks from creating multiple chats
    createTimeoutRef.current = setTimeout(() => {
      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        name: `New Chat ${sessions.length + 1}`,
        messages: [],
        createdAt: Date.now(),
      };

      setSessions(prev => {
        // Double-check if we already have a session with the same name
        const exists = prev.some(s => s.name === newSession.name);
        if (exists) {
          return prev;
        }
        return [...prev, newSession];
      });

      setActiveSessionId(newSession.id);
      setIsCreating(false);
      createTimeoutRef.current = null;
    }, 200);
  }, [sessions.length, isCreating]);

  const deleteChat = useCallback((id: string) => {
    if (sessions.length <= 1) {
      // Don't delete the last chat
      return;
    }

    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      }
    }
  }, [sessions, activeSessionId]);

  const handleSendMessage = useCallback((message: string) => {
    if (!activeSession) return;

    // Add user message
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [
            ...session.messages,
            { role: 'user', content: message }
          ]
        };
      }
      return session;
    });

    setSessions(updatedSessions);

    // Simulate AI response
    setTimeout(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [
              ...session.messages,
              { role: 'assistant', content: 'This is a simulated AI response.' }
            ]
          };
        }
        return session;
      }));
    }, 1000);
  }, [activeSession, activeSessionId, sessions]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header with session management */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <button
            onClick={createNewChat}
            disabled={isCreating}
            className="
              flex-shrink-0
              px-3 py-1.5 
              bg-blue-600 hover:bg-blue-700 
              disabled:bg-blue-400 disabled:cursor-not-allowed
              text-white text-sm font-medium 
              rounded-lg 
              transition-colors duration-200
              flex items-center space-x-1
            "
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Session tabs - only show existing sessions, no duplicates */}
          <div className="flex items-center space-x-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  flex items-center space-x-1 
                  px-3 py-1.5 
                  rounded-lg 
                  transition-colors duration-200
                  cursor-pointer
                  ${session.id === activeSessionId
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}
                onClick={() => setActiveSessionId(session.id)}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm truncate max-w-[100px]">{session.name}</span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(session.id);
                    }}
                    className="ml-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {activeSession?.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
                Welcome to AI Chat
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {activeSession?.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
                  p-3 rounded-lg max-w-[80%]
                  ${msg.role === 'user'
                    ? 'ml-auto bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }
                `}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat input - fixed at bottom with proper sizing */}
      <div className="flex-shrink-0">
        <ChatInput 
          onSend={handleSendMessage}
          disabled={!activeSession}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}
