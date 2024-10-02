import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const FullScreenModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white w-1/3 h-auto lg:w-1/3 lg:h-1/2 rounded-lg shadow-lg p-6 overflow-auto">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times; {/* Botón de cierre */}
        </button>

        {/* Contenido del modal */}
        <div className="flex flex-col space-y-4">
          <h1 className='text-black font-bold'>Filtros Multiples </h1>
          {/* Campo "Desde" */}
          <div className="flex flex-col w-full">
            <label htmlFor="desde" className="text-gray-700 font-medium">Desde</label>
            <input 
              type="date" 
              id="desde" 
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Campo "Hasta" */}
          <div className="flex flex-col w-full">
            <label htmlFor="hasta" className="text-gray-700 font-medium">Hasta</label>
            <input 
              type="date" 
              id="hasta" 
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Input desplegable 1 */}
          <div className="flex flex-col w-full">
            <label htmlFor="select1" className="text-gray-700 font-medium">Juzgado</label>
            <select
              id="select1"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Juzgado</option>
              {/* Añade opciones aquí según sea necesario */}
            </select>
          </div>

          {/* Input desplegable 2 */}
          <div className="flex flex-col w-full">
            <label htmlFor="select2" className="text-gray-700 font-medium">Notificación</label>
            <select
              id="select2"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Notificación</option>
              {/* Añade opciones aquí según sea necesario */}
            </select>
          </div>

          {/* Botón Enviar */}
          <div className="flex justify-center mt-8">
            <button 
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Enviar
            </button>
          </div>

          {/* Otros contenidos del modal */}
          {children}
        </div>

      </div>
    </div>,
    document.body // El modal se renderiza dentro del <body> del documento
  );
};

// Validación de PropTypes
FullScreenModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default FullScreenModal;
