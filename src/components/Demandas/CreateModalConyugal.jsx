import flecha_reversa from "../../assets/flecha_reversa.png";

const CreateModalConyugal = ({ closeModal, moneda, reverse }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg shadow-lg relative">
        <button
          onClick={closeModal}
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

        <button
          onClick={reverse}
          type="button"
          className="absolute top-4 left-4 bg-transparent hover:bg-gray-200 rounded-lg w-8 h-8 flex items-center justify-center"
        >
          <img
            src={flecha_reversa}
            alt="Flecha Reversa"
            className="w-6 h-6"
          />
        </button>

        <h2 className="text-xl font-semibold mt-8 mb-4">Crear Demanda Conyugal {moneda}</h2>
        <h3 className="text-xl font-light mt-8 mb-4">En Desarrollo... </h3>

      </div>
    </div>
  );
};

export default CreateModalConyugal;
