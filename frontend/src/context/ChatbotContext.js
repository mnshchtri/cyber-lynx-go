import React, { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleChatbot = () => {
    setIsOpen(prev => {
      if (!prev) {
        setUnreadCount(0);
      }
      return !prev;
    });
  };

  const openChatbot = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const incrementUnread = () => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        toggleChatbot,
        openChatbot,
        closeChatbot,
        unreadCount,
        incrementUnread
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

