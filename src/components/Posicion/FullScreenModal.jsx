import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const FullScreenModal = ({ isOpen, onClose, juzgados, acuerdos, onSearch }) => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [juzgado, setJuzgado] = useState('');
  const [acuerdo, setAcuerdo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = () => {

    if (!desde || !hasta) {
      setErrorMessage('Los campos "Desde" y "Hasta" son obligatorios.');
      return;
    }

    if (new Date(hasta) < new Date(desde)) {
      setErrorMessage('La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
      return;
    }

    setErrorMessage('');

    onSearch({ desde, hasta, juzgado, acuerdo });
    // onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white w-full sm:w-3/4 md:w-2/3 lg:w-1/3 h-[490px] rounded-lg shadow-lg p-8 overflow-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl h-12 w-12 flex justify-center items-center"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col space-y-4">
          <h1 className="text-black font-bold text-center">Filtros Múltiples</h1>

          <div className="flex flex-col w-full">
            <label htmlFor="desde" className="text-gray-700 font-medium">Desde</label>
            <input
              type="date"
              id="desde"
              value={desde}
              required
              onChange={(e) => setDesde(e.target.value)}
              className={`border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary ${errorMessage ? 'border-red-500' : ''}`}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="hasta" className="text-gray-700 font-medium">Hasta</label>
            <input
              type="date"
              id="hasta"
              value={hasta}
              required
              onChange={(e) => setHasta(e.target.value)}
              className={`border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary ${errorMessage ? 'border-red-500' : ''}`}
            />
          </div>


          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex flex-col w-full">
            <label htmlFor="select1" className="text-gray-700 font-medium">Juzgado</label>
            <select
              id="select1"
              value={juzgado}
              onChange={(e) => setJuzgado(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Selecciona un juzgado</option>
              {juzgados.map((juzgado, index) => (
                <option key={index} value={juzgado.juspos}>
                  {juzgado.juspos}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="select2" className="text-gray-700 font-medium">Acuerdo</label>
            <select
              id="select2"
              value={acuerdo}
              onChange={(e) => setAcuerdo(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Selecciona un acuerdo</option>
              {acuerdos.map((acuerdo, index) => (
                <option key={index} value={JSON.stringify(acuerdo.value)}>
                  {acuerdo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mt-12">
            <button
              type="submit"
              onClick={handleSearch}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


FullScreenModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  juzgados: PropTypes.array.isRequired,
  acuerdos: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired
};

export default FullScreenModal;
