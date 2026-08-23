import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSend, 
  disabled = false, 
  placeholder = "Ask me anything about cybersecurity..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = () => {
    if (isSendingRef.current || disabled || !message.trim()) return;
    
    isSendingRef.current = true;
    onSend(message.trim());
    setMessage('');
    setTimeout(() => {
      isSendingRef.current = false;
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          flex-1 
          min-w-[60px] 
          px-4 py-3 
          bg-gray-50 dark:bg-gray-700 
          border border-gray-200 dark:border-gray-600 
          rounded-xl 
          text-gray-900 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400
          text-base
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
        style={{
          width: 'auto',
          flex: '1 1 auto',
          minWidth: '60px',
          height: '48px'
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="
          flex-shrink-0
          px-6 py-3 
          bg-blue-600 hover:bg-blue-700 
          disabled:bg-blue-400 disabled:cursor-not-allowed
          active:scale-95
          text-white font-medium
          rounded-xl 
          transition-all duration-200
          flex items-center justify-center
          gap-2
          min-w-[80px]
        "
        style={{
          height: '48px'
        }}
      >
        <Send className="w-4 h-4" />
        <span>Send</span>
      </button>
    </div>
  );
}
