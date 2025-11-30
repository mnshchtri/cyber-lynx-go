import React from 'react';
import { useChatbot } from '../../context/ChatbotContext';

const ChatbotButton = () => {
  const { isOpen, toggleChatbot, unreadCount } = useChatbot();

  return (
    <button
      onClick={toggleChatbot}
      className={`fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-50 ${
        isOpen ? 'hidden' : ''
      }`}
      title="AI Assistant"
      style={{ zIndex: 9999 }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ChatbotButton;

