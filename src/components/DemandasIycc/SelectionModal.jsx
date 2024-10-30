import { useEffect } from "react";

const ModalSelection = ({ openCreateModal, closeSelectionModal, setSelectedMoneda, selectedMoneda, error, setError }) => {

  const handleSelection = (moneda) => {
    setSelectedMoneda(moneda);
    if (moneda) {
      setError(""); 
    }
  };

  useEffect(() => {
    if (selectedMoneda) {
      setError(""); 
    }
  }, [selectedMoneda, setError]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg shadow-lg relative">
        <button
          onClick={closeSelectionModal}
          type="button"
          className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
        >
          <svg
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">Crear Demanda</h2>
        <h3 className="text-lg font-semibold mb-6">Individual y Con Consentimiento</h3>
        <div className="flex space-x-12 mb-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="individual-pesos"
              name="moneda-individual"
              value="Pesos"
              checked={selectedMoneda === "Pesos"}
              onChange={() => handleSelection("Pesos")}
            />
            <label htmlFor="individual-pesos" className="ml-2">Pesos</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="individual-vsmm"
              name="moneda-individual"
              value="VSMM"
              checked={selectedMoneda === "VSMM"}
              onChange={() => handleSelection("VSMM")}
            />
            <label htmlFor="individual-vsmm" className="ml-2">VSMM</label>
          </div>
        </div>
        {error && (
          <p className="text-primary mb-4 transition-opacity duration-500 ease-in-out">
            {error}
          </p>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};


export default ModalSelection;
