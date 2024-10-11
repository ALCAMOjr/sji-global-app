import { useRef, useState, useEffect } from "react";
import useExpedientes from "../../hooks/expedientes/useExpedientes.jsx";
import { useMediaQuery } from 'react-responsive';
import { IoMdCheckmark } from "react-icons/io";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import masicon from "../../assets/mas.png";
import create_icon from "../../assets/crear.png";
import { Spinner } from "@nextui-org/react";

const Demandas = () => {
  const { expedientes, loading, setExpedientes } = useExpedientes();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);
  const [search, setSearch] = useState('');
  const [isLoadingExpedientes, setisLoadingExpedientes] = useState(false);
  const [searchType, setSearchType] = useState('Numero');
  const [isManualSearch, setIsManualSearch] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });

  const toggleDropdown = () => setIsSearchOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchTypeChange = async (type) => {
    setSearchType(type);
    setIsSearchOpen(false);
    setSearch('');
    setIsManualSearch(type === 'Numero');
    await handleGetExpedientes();
  };

  const handleSearchInputChange = async (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (searchType === 'Numero' && searchTerm.trim() !== '') {
      setIsManualSearch(true);
    }
    if (searchTerm.trim() === '') {
      setIsManualSearch(false);
      await handleGetExpedientes();
    }
  };

  const handleManualSearch = () => {
    if (search.trim() !== '') {
      (search);
    }
  };

  const handleGetExpedientes = async () => {
    try {
      setisLoadingExpedientes(true);
      setExpedientes(expedientes);
    } catch (error) {
      console.error("Something went wrong", error);
    }
    setisLoadingExpedientes(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading || isLoadingExpedientes) return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Spinner className="h-10 w-10" color="primary" />
    </div>
  );

  // Definición de los campos con propiedades personalizadas
  const fields = [
    { label: "CRÉDITO", type: "number", placeholder: "Ingrese el crédito" },
    { label: "ACREDITADO", type: "text", placeholder: "Nombre del acreditado", resizable: true },
    { label: "ESCRITURA", type: "text", placeholder: "Número de escritura", resizable: true },
    { label: "FECHA ESCRITURA", type: "text", placeholer: "Fecha de escritura", resizable: true },
    { label: "INSCRIPCION", type: "text", placeholder: "Número de inscripción" },
    { label: "VOLUMEN", type: "number", placeholder: "Ingrese el volumen" },
    { label: "LIBRO", type: "text", placeholder: "Número de libro" },
    { label: "SECCION", type: "text", placeholder: "Sección correspondiente", resizable: true },
    { label: "UNIDAD", type: "text", placeholder: "Unidad de medida" },
    { label: "FECHA", type: "date" },
    { label: "MONTO OTORGADO", type: "number", placeholder: "Monto otorgado en pesos" },
    { label: "MES DE PRIMER ADEUDO", type: "text", placeholder: "Mes del primer adeudo" },
    { label: "MES CON ULTIMO ADEUDO", type: "text", placeholder: "Mes del último adeudo" },
    { label: "ADEUDO EN PESOS", type: "text", placeholder: "Monto del adeudo en pesos", resizable: true  },
    { label: "ADEUDO", type: "number", placeholder: "Ingrese el adeudo" },
    { label: "CALLE", type: "text", placeholder: "Nombre de la calle", resizable: true },
    { label: "NUMERO", type: "text", placeholder: "Número de la propiedad" },
    { label: "COLONIA/FRACCIONAMIENTO", type: "text", placeholder: "Colonia o fraccionamiento", resizable: true },
    { label: "CODIGO POSTAL", type: "text", placeholder: "Código postal" },
    { label: "MUNICIPIO", type: "text", placeholder: "Nombre del municipio" },
    { label: "ESTADO", type: "text", placeholder: "Estado" },
    { label: "NOMENCLATURA", type: "text", placeholder: "Nomenclatura correspondiente" },
    { label: "INTERES ORDINARIO", type: "number", placeholder: "Interés ordinario %" },
    { label: "INTERES MORATORIO", type: "number", placeholder: "Interés moratorio %" },
    { label: "JUZGADO", type: "text", placeholder: "Juzgado correspondiente", resizable: true},
    { label: "HORA REQUERIMIENTO", type: "time" },
    { label: "FECHA REQUERIMIENTO", type: "date" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Dropdown>
          <DropdownTrigger>
            <Button color='primary'
              className='fixed right-16 lg:right-56 xl:right-56 mt-24 lg:mt-0 xl:mt-0 top-3/4 lg:top-24 xl:top-24 z-50'
              isIconOnly
              aria-label="Mas"
            >
              <img src={masicon} alt="Mas" className='w-4 h-4' />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem startContent={<img src={create_icon} alt="Create Icon" className="w-6 h-6 flex-shrink-0" />} onClick={openModal} key="create">
              Crear Demanda
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-5xl overflow-y-auto max-h-screen shadow-lg relative">
            {/* Botón de cierre */}
           
            <button onClick={closeModal} type="button" className="absolute top-4 right-4  text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
            <h2 className="text-xl font-semibold mb-4">Crear Demanda</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <div key={field.label} className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    {field.resizable ? (
                      <textarea
                        placeholder={field.placeholder || ""}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder || ""}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button type="button" onClick={() => { /* lógica para crear la demanda */ closeModal(); }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-600">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDesktopOrLaptop ? (
        <div className="max-w-xs mx-auto mb-4 fixed top-28 left-1/2 transform -translate-x-1/2 z-10 -translate-y-1/2">
          <div className="flex">
            <button
              id="dropdown-button"
              onClick={toggleDropdown}
              className="flex-shrink-0 z-10 inline-flex items-center py-1 px-2 text-xs font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              type="button"
            >
              Filtrar por:
              <svg
                className={`w-2 h-2 ms-1 transition-transform ${isSearchOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {isSearchOpen && (
              <div
                ref={menuRef}
                id="dropdown"
                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-8"
              >
                <ul className="py-1 text-xs text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                  <li>
                    <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Numero")}>
                      Crédito
                      {searchType === "Numero" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                    </button>
                  </li>

                </ul>
              </div>
            )}
            <div className="relative w-full">
              <input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch();
                  }
                }}
                value={search}
                onChange={handleSearchInputChange}
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                placeholder="Buscar Expedientes:"
                required
                style={{ width: "300px" }}
              />
              <button
                type="button"
                disabled={!isManualSearch}
                onClick={handleManualSearch}
                className={`absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-primary border-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary-dark dark:hover:bg-primary-dark dark:focus:ring-primary"}`}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Buscar</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xs mx-auto mb-4 -ml-4 fixed top-28 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex">
            <button
              id="dropdown-button"
              onClick={toggleDropdown}
              className="flex-shrink-0 z-10 inline-flex items-center py-1 px-2 text-xs font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              type="button"
            >
              Filtrar por:
              <svg
                className={`w-2 h-2 ms-1 transition-transform ${isSearchOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {isSearchOpen && (
              <div
                ref={menuRef}
                id="dropdown"
                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700 absolute mt-8"
              >
                <ul className="py-1 text-xs text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                  <li>
                    <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Numero")}>
                      Crédito
                      {searchType === "Numero" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                    </button>
                  </li>


                </ul>
              </div>
            )}
            <div className="relative w-full">
              <input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch();
                  }
                }}
                value={search}
                onChange={handleSearchInputChange}
                type="search"
                id="search-dropdown"
                className="block p-1.5 w-full z-20 text-xs text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                placeholder="Buscar Expedientes:"
                required
                style={{ width: "200px" }}
              />
              <button
                type="button"
                disabled={!isManualSearch}
                onClick={handleManualSearch}
                className={`absolute top-0 right-0 p-1.5 text-xs font-medium h-full text-white ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-primary border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"}`}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Buscar</span>
              </button>
            </div>
          </div>
        </div>
      )}





      {/* <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border px-4 py-2">No.</th>
              <th className="border px-4 py-2">Crédito</th>
              <th className="border px-4 py-2">Acreditado</th>
              <th className="border px-4 py-2">Escritura</th>
              <th className="border px-4 py-2">Fecha Escritura</th>
              <th className="border px-4 py-2">Inscripción</th>
              <th className="border px-4 py-2">Volumen</th>
              <th className="border px-4 py-2">Libro</th>
              <th className="border px-4 py-2">Propiedad</th>
              {/* Agrega más columnas según sea necesario 
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Demandas;
