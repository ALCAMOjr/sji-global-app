import React, { useState, useContext, useEffect, useRef } from 'react';
import useExpedientesSial from "../../hooks/expedientesial/useExpedienteSial.jsx";
import { Spinner, Tooltip, Button } from "@nextui-org/react";
import Error from "./Error.jsx";
import { toast } from 'react-toastify';
import TableConditional from './TableConditional.jsx';
import { useMediaQuery } from 'react-responsive';
import agregar from "../../assets/agregar.png"
import check from "../../assets/check.png";
import Context from '../../context/abogados.context.jsx';
import getExpedienteByNumeroSial from '../../views/expedientesial/getExpedientebyNumero.js';
import { IoMdCheckmark } from "react-icons/io";
import masicon from "../../assets/mas.png"


const ExpedientesSial = () => {
    const { expedientes, loadingExpedientes, errorExpedientes, uploadFile, setExpedientes } = useExpedientesSial();
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('Numero');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(200);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [originalExpedientes, setOriginalExpedientes] = useState([]);
    const [currentExpedientes, setCurrentExpedientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [ isLoadingExpedientes, setisLoadingExpedientes] = useState(false);
    const [errors, setErrors] = useState({});
    const inputFileRef = useRef(null);
    const { jwt } = useContext(Context);
    const [areFilesValid, setAreFilesValid] = useState(true);

    useEffect(() => {
        if (originalExpedientes.length === 0 && expedientes.length > 0) {
            setOriginalExpedientes(expedientes);
        }
        setTotalPages(Math.ceil(expedientes.length / itemsPerPage));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentExpedientes(expedientes.slice(startIndex, endIndex));
    }, [expedientes, itemsPerPage, currentPage]);
    
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage + 1); 
    };
    
    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };
    

   
    const onPageChange = (page) => {
        setCurrentPage(page);
    };


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFiles([]);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = [];
        let hasInvalidFile = false;

        files.forEach(file => {
            if (file.type === 'application/vnd.ms-excel' || file.type === 'text/csv' || file.name.endsWith('.csv')) {
                validFiles.push(file);
            } else {
                hasInvalidFile = true;
            }
        });
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...files]);
        if (hasInvalidFile) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                uploadFile: 'Uno o más archivos no son de tipo CSV. Por favor, seleccione solo archivos CSV.',
            }));
            setAreFilesValid(false);
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                uploadFile: '',
            }));
            setAreFilesValid(true);
        }
    };

    const handleRemoveFile = (fileToRemove) => {
        setSelectedFiles(prevSelectedFiles =>
            prevSelectedFiles.filter(file => file !== fileToRemove)
        );
    };

    const handleUploadFile = async () => {
        if (selectedFiles.length === 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                uploadFile: 'No ha seleccionado ningún archivo aún.',
            }));
            return;
        }

        setIsLoading(true);

        try {
            const { success, error } = await uploadFile(setOriginalExpedientes, selectedFiles);
            if (success) {
                toast.info('Archivos subidos correctamente.', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    },
                });
            
            } else {
                toast.error(`Algo mal sucedió al subir los archivos. Verifique los campos e intente de nuevo.`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al subir los archivos');
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setSelectedFiles([]);
            setErrors({});
        }
    };

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


    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setIsSearchOpen(false);
        setSearch('');
        setIsManualSearch(type === 'Numero');

        setExpedientes(originalExpedientes);
    };


    const searcherExpediente = async (searchTerm) => {
        setisLoadingExpedientes(true)
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        let filteredExpedientes = [];
        if (searchType === 'Nombre') {
            filteredExpedientes = expedientes.filter(expediente => expediente.acreditado.toLowerCase().includes(lowercaseSearchTerm));
        } else if (searchType === 'Numero') {
            try {
                const expediente = await getExpedienteByNumeroSial({ numero: lowercaseSearchTerm, token: jwt });

                if (expediente) {
                    filteredExpedientes.push(expediente);
                } else {
                    filteredExpedientes = [];
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    filteredExpedientes = [];
                } else {
                    console.error("Somethin was wrong")
                }
            }
        }

        setExpedientes(filteredExpedientes);
        setisLoadingExpedientes(false);
    };



    const handleSearchInputChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);


        if (searchType === 'Numero' && searchTerm.trim() !== '') {
            setIsManualSearch(true);
        }

        if (searchType === 'Nombre' && searchTerm.trim() !== '') {
            searcherExpediente(searchTerm);
        }

        if (searchTerm.trim() === '') {
            setIsManualSearch(false);
            setExpedientes(originalExpedientes);      
        
        }
    }

    const handleManualSearch = () => {
        if (search.trim() !== '') {
            searcherExpediente(search);
        }
    };






    if (loadingExpedientes || isLoadingExpedientes) return (
        <div className="flex items-center -mt-44 -ml-72 lg:-ml-44 xl:-ml-48 justify-center h-screen w-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );


    if (errorExpedientes) return <Error message={errorExpedientes.message} />;


    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative">
                <Tooltip showArrow={true} content="Subir Archivo">
                    <Button
                        color='primary'
                        className='fixed right-16 lg:right-56 xl:right-56 mt-24 lg:mt-0 xl:mt-0 top-3/4 lg:top-24 xl:top-24 z-50'
                        isIconOnly
                        aria-label="Mas"
                        onClick={openModal}
                    >
                        <img src={masicon} alt="Mas" className='w-4 h-4' />
                    </Button>
                </Tooltip>
            </div>


            {isModalOpen && (
                <div
                    id="verification-modal"
                    tabIndex="-1"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-x-hidden overflow-y-auto bg-black bg-opacity-50"
                >
                    <div className="relative w-auto max-w-4xl max-h-[100vh] min-w-[40vw] flex items-center justify-center">
                        <div className="relative rounded-lg shadow bg-white max-w-md w-full mx-auto">
                            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-white bg-gray-200">
                                <h3 className="text-xl font-semibold text-primary/80">Subir Archivo</h3>
                                <button
                                    type="button"
                                    className="text-black bg-transparent hover:bg-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={closeModal}
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
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
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-6 flex flex-col items-center">
                                <div className="flex flex-col items-center w-full max-w-xs">
                                    <button
                                        className="relative mb-2 w-full h-auto flex items-center justify-center bg-gray-200 rounded-xl border-2 border-dashed border-black text-white"
                                        onClick={() => inputFileRef.current.click()}
                                    >
                                        <div className="flex flex-col items-center">
                                            {isLoading ? (
                                                <Spinner
                                                    className="text-center mt-6 mb-8 text-sm"
                                                    label="Cargando..."
                                                    color="primary"
                                                    size="lg"
                                                    labelColor="primary"
                                                />
                                            ) : (
                                                <>
                                                    <img
                                                        src={agregar}
                                                        className="absolute h-8 w-8 mb-8 z-10"
                                                        style={{ top: '30%', transform: 'translateY(-50%)' }}
                                                        alt="Circulo Icon"
                                                    />
                                                    <span className="text-sm text-black text-center mt-24 mb-4 z-30">
                                                        {selectedFiles.length > 0 ? (
                                                            selectedFiles.map((file, index) => (
                                                                <div key={index} className="flex justify-between items-center w-full">
                                                                    <span>{file.name}</span>
                                                                    <button
                                                                        onClick={() => handleRemoveFile(file)}
                                                                        className="text-black bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-6 h-6 inline-flex justify-center items-center"
                                                                    >
                                                                        <svg
                                                                            className="w-3 h-3"
                                                                            aria-hidden="true"
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
                                                                </div>
                                                            ))
                                                        ) : (
                                                            'Click para subir archivos'
                                                        )}
                                                    </span>
                                                    {errors.uploadFile && <p className="text-[#E16060] text-xs">{errors.uploadFile}</p>}
                                                </>
                                            )}
                                        </div>
                                    </button>
                                    <input
                                        type="file"
                                        ref={inputFileRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </div>
                                <div className="flex justify-end mt-4 w-full">
                                    <button
                                        disabled={isLoading || !areFilesValid}
                                        onClick={handleUploadFile}
                                        className="bg-primary text-white text-lg px-4 py-1 rounded-lg flex items-center justify-center mt-4"
                                    >
                                        Subir Archivos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <>
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
                                                Numero
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
                    <div className="max-w-xs mx-auto mb-4 -ml-8 fixed top-28 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
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
                                                Numero
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
            </>


            {expedientes.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                            <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M106.673 12.4027C110.616 13.5333 112.895 17.6462 111.765 21.5891L97.7533 70.4529C96.8931 73.4525 94.307 75.4896 91.3828 75.7948C91.4046 75.5034 91.4157 75.2091 91.4157 74.9121V27.1674C91.4157 20.7217 86.1904 15.4965 79.7447 15.4965H56.1167L58.7303 6.38172C59.8609 2.43883 63.9738 0.159015 67.9167 1.28962L106.673 12.4027Z" fill="#D2D9EE"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M32 27.7402C32 23.322 35.5817 19.7402 40 19.7402H79.1717C83.59 19.7402 87.1717 23.322 87.1717 27.7402V74.3389C87.1717 78.7572 83.59 82.3389 79.1717 82.3389H40C35.5817 82.3389 32 78.7572 32 74.3389V27.7402ZM57.1717 42.7402C57.1717 46.6062 53.8138 49.7402 49.6717 49.7402C45.5296 49.7402 42.1717 46.6062 42.1717 42.7402C42.1717 38.8742 45.5296 35.7402 49.6717 35.7402C53.8138 35.7402 57.1717 38.8742 57.1717 42.7402ZM36.1717 60.8153C37.2808 58.3975 40.7688 54.8201 45.7381 54.3677C51.977 53.7997 55.3044 57.8295 56.5522 60.0094C59.8797 55.4423 67.0336 46.8724 72.3575 45.9053C77.6814 44.9381 81.7853 48.4574 83.1717 50.338V72.6975C83.1717 75.4825 80.914 77.7402 78.1289 77.7402H41.2144C38.4294 77.7402 36.1717 75.4825 36.1717 72.6975V60.8153Z" fill="#D2D9EE"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500">No hay expedientes todavía</p>
                        <p className="text-gray-400 text-sm mb-4 text-center">Sube un nuevo archivo para comenzar.</p>
                    </div>

                </div>




            ) : (

                <TableConditional
                    currentExpedientes={currentExpedientes}
                    expedientes={expedientes}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onPageChange={onPageChange}


                />
            )}
        </div>
    )

}

export default ExpedientesSial;