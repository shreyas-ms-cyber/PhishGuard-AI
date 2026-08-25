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
  placeholder = "Type a message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSendingRef = useRef(false);

  // Auto-focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = () => {
    // Prevent double sends
    if (isSendingRef.current || disabled || !message.trim()) {
      return;
    }

    isSendingRef.current = true;
    onSend(message.trim());
    setMessage('');
    isSendingRef.current = false;

    // Keep focus after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
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
          flex-1 min-w-[50px] 
          px-4 py-2.5 
          bg-gray-50 dark:bg-gray-700 
          border border-gray-200 dark:border-gray-600 
          rounded-lg 
          text-gray-900 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
        style={{
          // Ensure input takes all available space
          width: '100%',
          flex: '1 1 auto',
          minWidth: '50px'
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="
          flex-shrink-0 
          px-4 py-2.5 
          bg-blue-600 hover:bg-blue-700 
          disabled:bg-blue-400 disabled:cursor-not-allowed
          text-white 
          rounded-lg 
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          flex items-center justify-center
        "
        style={{
          width: 'auto',
          minWidth: '60px'
        }}
      >
        <Send className="w-5 h-5" />
        <span className="hidden sm:inline ml-2">Send</span>
      </button>
    </div>
  );
}
