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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...chat.messages, { role: 'user', content: userMsg }] };
      }
      return chat;
    }));
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userMsg });
      const reply = response.data.response || 'Sorry, I could not process that.';
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: [...chat.messages, { role: 'assistant', content: reply }] };
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
      title: 'New Chat',
      messages: [
        { role: 'assistant', content: 'Hello! I\'m your cybersecurity assistant. Ask me anything about cybersecurity fundamentals, best practices, threat detection, or phishing awareness.' }
      ]
    }]);
    setActiveChatId(newId);
  };

  const deleteChat = (chatId) => {
    if (chats.length <= 1) {
      setChats([{
        id: Date.now(),
        title: 'New Chat',
        messages: [
          { role: 'assistant', content: 'Hello! I\'m your cybersecurity assistant. Ask me anything about cybersecurity fundamentals, best practices, threat detection, or phishing awareness.' }
        ]
      }]);
      setActiveChatId(Date.now());
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

  useEffect(() => {
    const chat = chats.find(c => c.id === activeChatId);
    if (chat && chat.messages.length > 1 && (chat.title === 'New Chat' || chat.title.startsWith('New Chat'))) {
      const firstUserMsg = chat.messages.find(m => m.role === 'user');
      if (firstUserMsg) {
        const newTitle = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
        updateChatTitle(activeChatId, newTitle);
      }
    }
  }, [chats, activeChatId]);

  return (
    <div className="flex flex-col h-full w-full max-w-full pt-4 md:pt-0">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold text-on-surface">AI Security Assistant</h1>
        <p className="text-muted text-sm">Ask me about cybersecurity fundamentals, best practices, and threat awareness.</p>
      </header>

      {/* History Section – fixed layout */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h3 className="font-label-code text-[10px] text-muted uppercase tracking-wider">History</h3>
          <button
            onClick={newChat}
            className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Chat
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                activeChatId === chat.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface/30 text-on-surface-variant hover:bg-surface/50'
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span className="font-body-sm text-sm max-w-[120px] truncate">{chat.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                className="text-muted hover:text-error transition-colors"
                aria-label="Delete chat"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 glass-card rounded-xl flex flex-col overflow-hidden h-[calc(100vh-420px)] md:h-[calc(100vh-440px)]">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface/50 border-l-2 border-accent-purple text-on-surface'
                }`}
              >
                <p className="font-body-md whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface/50 rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-glass-border flex-shrink-0">
          <div className="flex gap-3">
            <textarea
              rows="1"
              className="flex-1 bg-input border border-glass-border rounded-lg p-3 text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none font-body-md"
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
