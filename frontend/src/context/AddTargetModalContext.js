import React, { createContext, useContext, useState } from 'react';

const AddTargetModalContext = createContext();

export const useAddTargetModal = () => {
  const context = useContext(AddTargetModalContext);
  if (!context) {
    throw new Error('useAddTargetModal must be used within AddTargetModalProvider');
  }
  return context;
};

export const AddTargetModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AddTargetModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </AddTargetModalContext.Provider>
  );
};

