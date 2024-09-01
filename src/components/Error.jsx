import React from "react";

function Error(props) {
  const { message } = props;

  const handleReload = () => {
    window.location.reload();
  };

  let displayMessage;
  
  if (message.includes("Network Error")) {
    displayMessage = "Error de conexión. Revisa tu conexión a Internet e intenta de nuevo.";
  } else if (message.includes("Request failed with status code 403")) {
    displayMessage = "Recurso no permitido. Asegúrate de tener los permisos necesarios.";
  } else {
    displayMessage = "Algo mal sucedio. Por favor, espere un momento e intenta nuevamente.";
  }

  return (
    <div className="flex justify-center items-center h-screen -mt-24 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0">
      <div className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 max-w-md">
        <div className="flex items-center">
          <svg
            className="flex-shrink-0 w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Error</span>
          <h3 className="text-lg font-medium">{message}</h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          {displayMessage}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
            onClick={handleReload}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;
