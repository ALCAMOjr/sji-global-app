import React, { useState, createContext } from 'react';


export const ModalContext = createContext();

export const ProviderModal = ({ children }) => {
  const [isOpenModalContext, setisOpenModalContext] = useState(false);
  const [isOpenModalUpdateContext, setisOpenModalUpdateContext] = useState(false); 
  const [isOpenModalDeleteContext, setisOpenModalDeleteContext] = useState(false);  
  const [isOpenModalViewAllContext, setisOpenModalViewAllContext] = useState(false);  

  const contextValue = {
    isOpenModalContext,
    isOpenModalUpdateContext,
    isOpenModalDeleteContext,
    isOpenModalViewAllContext,
    openModalContext: () => setisOpenModalContext(true),
    closeModalContext: () => setisOpenModalContext(false),
    openModalUpdateContext: () => setisOpenModalUpdateContext(true),
    closeModalUpdateContext: () => setisOpenModalUpdateContext(false),
    openModalDeleteContext: () =>  setisOpenModalDeleteContext(true),
    closeModalDeleteContext: () =>  setisOpenModalDeleteContext(false),
    openModalViewAllContext: () =>  setisOpenModalViewAllContext(true),
    closeModalViewAllContext: () =>  setisOpenModalViewAllContext(false),
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};
