import { useState, useRef, useEffect } from 'react';
import api from '../../api/axiosConfig';

const AIChat = () => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('ai_chats');
    return saved ? JSON.parse(saved) : [
      {
        id: Date.now(),
        title: 'New Chat',
        messages: [
          { role: 'assistant', content: 'Hello! I\'m your cybersecurity assistant. Ask me anything about cybersecurity fundamentals, best practices, threat detection, or phishing awareness.' }
        ]
      }
    ];
  });
  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem('active_chat_id');
    return saved ? parseInt(saved) : chats[0]?.id || Date.now();
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentChat = chats.find(c => c.id === activeChatId) || chats[0];
  const messages = currentChat?.messages || [];

  useEffect(() => {
    localStorage.setItem('ai_chats', JSON.stringify(chats));
    localStorage.setItem('active_chat_id', String(activeChatId));
  }, [chats, activeChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { role: 'user', content: userMsg }]
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userMsg });
      const reply = response.data.response || 'Sorry, I could not process that.';
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, { role: 'assistant', content: reply }]
          };
        }
        return chat;
      }));
    } catch (error) {
      console.error('Chat error:', error);
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, { role: 'assistant', content: 'Error: Could not reach the AI service. Please try again later.' }]
          };
        }
        return chat;
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    const newId = Date.now();
    setChats(prev => [...prev, {
      id: newId,
      title: `New Chat ${prev.length + 1}`,
      messages: [
        { role: 'assistant', content: 'Hello! I\'m your cybersecurity assistant. Ask me anything about cybersecurity fundamentals, best practices, threat detection, or phishing awareness.' }
      ]
    }]);
    setActiveChatId(newId);
  };

  const deleteChat = (chatId) => {
    if (chats.length <= 1) {
      // Don't delete the last chat, just clear messages
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [
              { role: 'assistant', content: 'Hello! I\'m your cybersecurity assistant. Ask me anything about cybersecurity fundamentals, best practices, threat detection, or phishing awareness.' }
            ]
          };
        }
        return chat;
      }));
      return;
    }
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(chats.find(c => c.id !== chatId)?.id || chats[0]?.id);
    }
  };

  const updateChatTitle = (chatId, newTitle) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, title: newTitle };
      }
      return chat;
    }));
  };

  // Auto-update chat title based on first user message
  useEffect(() => {
    const chat = chats.find(c => c.id === activeChatId);
    if (chat && chat.messages.length > 1 && chat.title === 'New Chat' || chat.title.startsWith('New Chat')) {
      const firstUserMsg = chat.messages.find(m => m.role === 'user');
      if (firstUserMsg) {
        const newTitle = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
        updateChatTitle(activeChatId, newTitle);
      }
    }
  }, [chats, activeChatId]);

  return (
    <div className="flex flex-col h-full w-full max-w-full pt-4 md:pt-0">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">AI Security Assistant</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Ask me about cybersecurity fundamentals, best practices, and threat awareness.</p>
        </div>
        <button
          onClick={newChat}
          className="btn-primary text-sm"
        >
          <span className="material-symbols-outlined">add</span>
          New Chat
        </button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row gap-4 overflow-hidden h-[calc(100vh-260px)] md:h-[calc(100vh-300px)]">
        {/* Chat History Sidebar */}
        <div className="w-full md:w-56 flex-shrink-0 glass-card rounded-xl p-3 overflow-y-auto custom-scrollbar max-h-48 md:max-h-full">
          <h3 className="font-label-code text-label-code text-on-surface-variant uppercase text-xs mb-2">History</h3>
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-surface-variant/20 transition-colors ${activeChatId === chat.id ? 'bg-primary/10 border-r-2 border-primary' : ''}`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <span className="font-body-sm text-sm text-on-surface truncate flex-1">{chat.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                  className="text-on-surface-variant hover:text-error transition-colors p-1"
                  aria-label="Delete chat"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 glass-card p-4 md:p-6 rounded-xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-highest/50 text-on-surface'
                  }`}
                >
                  <p className="font-body-md whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-container-highest/50 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="mt-4 flex gap-3">
            <textarea
              rows="1"
              className="flex-1 bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none font-body-md"
              placeholder="Ask a cybersecurity question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="btn-primary flex-shrink-0 self-end"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
