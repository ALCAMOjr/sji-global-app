import React from 'react';
import ReactDOM from 'react-dom';

const FullScreenModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Usamos createPortal para renderizar el modal en un lugar diferente en el DOM (fuera del input).
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white w-full h-full lg:w-3/4 lg:h-3/4 rounded-lg shadow-lg p-6 overflow-auto">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times; {/* Close Button */}
        </button>
        {children}
      </div>
    </div>,
    document.body // El modal se renderiza dentro del <body> del documento
  );
};

export default FullScreenModal;
