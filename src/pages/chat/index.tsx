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
  const lastClickTimeRef = useRef<number>(0);

  // PREVENT DUPLICATE CHAT CREATION
  const createNewChat = useCallback(() => {
    const now = Date.now();
    
    // Prevent double clicks within 500ms
    if (now - lastClickTimeRef.current < 500) {
      return;
    }
    lastClickTimeRef.current = now;

    // Prevent if already creating
    if (isCreating) return;
    
    if (createTimeoutRef.current) {
      clearTimeout(createTimeoutRef.current);
    }

    setIsCreating(true);

    createTimeoutRef.current = setTimeout(() => {
      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        name: `New Chat ${sessions.length + 1}`,
        messages: [],
        createdAt: Date.now(),
      };

      setSessions(prev => {
        // Check if we already have a session with same name
        const exists = prev.some(s => s.name === newSession.name);
        if (exists) {
          // If exists, create with unique name
          const uniqueName = `New Chat ${prev.length + 1}`;
          return [...prev, { ...newSession, name: uniqueName }];
        }
        return [...prev, newSession];
      });

      setActiveSessionId(newSession.id);
      setIsCreating(false);
      createTimeoutRef.current = null;
    }, 200);
  }, [sessions.length, isCreating]);

  const deleteChat = useCallback((id: string) => {
    if (sessions.length <= 1) return;
    
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
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [
            ...session.messages,
            { role: 'user' as const, content: message }
          ]
        };
      }
      return session;
    }));

    // Simulate AI response
    setTimeout(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [
              ...session.messages,
              { role: 'assistant' as const, content: "I'm analyzing your request. Let me help you with that!" }
            ]
          };
        }
        return session;
      }));
    }, 1000);
  }, [activeSession, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3 overflow-x-auto flex-1">
          <button
            onClick={createNewChat}
            disabled={isCreating}
            className="
              flex-shrink-0
              px-4 py-2 
              bg-blue-600 hover:bg-blue-700 
              disabled:bg-blue-400 disabled:cursor-not-allowed
              text-white text-sm font-medium 
              rounded-lg 
              transition-all duration-200
              flex items-center gap-2
            "
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          {/* Session Tabs - ONE PER SESSION, NO DUPLICATES */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  flex items-center gap-1.5 
                  px-3 py-1.5 
                  rounded-lg 
                  transition-all duration-200
                  cursor-pointer
                  whitespace-nowrap
                  ${session.id === activeSessionId
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}
                onClick={() => setActiveSessionId(session.id)}
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-sm">{session.name}</span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(session.id);
                    }}
                    className="ml-0.5 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSession?.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Hello! I'm your cybersecurity assistant.
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Ask me anything about cybersecurity fundamentals, best practices, 
                threat detection, or phishing awareness.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {activeSession?.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
                  p-3 rounded-xl max-w-[80%]
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

      {/* Chat Input - FULL WIDTH with keyboard support */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800">
        <ChatInput 
          onSend={handleSendMessage}
          disabled={!activeSession}
          placeholder="Ask me anything about cybersecurity..."
        />
      </div>
    </div>
  );
}
