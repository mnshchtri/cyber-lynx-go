import React, { useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Chatbot from './components/chatbot/Chatbot';
import ChatbotButton from './components/chatbot/ChatbotButton';
import './App.css';
import { ThemeContext } from './context/ThemeContext';
import { AddTargetModalProvider } from './context/AddTargetModalContext';
import { ChatbotProvider } from './context/ChatbotContext';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <ChatbotProvider>
      <AddTargetModalProvider>
        <Router>
          <div id="app" className={`flex min-h-screen w-full bg-background-primary ${darkMode ? 'dark' : 'light'}`}>
            <Sidebar 
              isCollapsed={isCollapsed} 
              toggleSidebar={toggleSidebar}
              isMobileNavOpen={isMobileNavOpen}
              toggleMobileNav={toggleMobileNav} 
            />
            <div className="flex-grow transition-all duration-300 ease-in-out">
              <header className="md:hidden flex items-center justify-between p-4 bg-surface-light shadow-md">
                <button onClick={toggleMobileNav}>
                  <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-primary">CyberLynX</h1>
              </header>
              <MainContent />
            </div>
            {isMobileNavOpen && (
              <div 
                className="md:hidden fixed inset-0 bg-black opacity-50 z-10" 
                onClick={toggleMobileNav}
              ></div>
            )}
            {/* AI Chatbot - Available on all pages */}
            <ChatbotButton />
            <Chatbot />
          </div>
        </Router>
      </AddTargetModalProvider>
    </ChatbotProvider>
  );
}

export default App;
