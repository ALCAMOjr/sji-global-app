import React, { useRef, useState, useContext, useEffect } from 'react';
import useAgenda from '../../hooks/tareas/useAgenda.jsx';
import useAbogados from '../../hooks/abogados/useAbogados.jsx';
import { Spinner } from "@nextui-org/react";
import { toast } from 'react-toastify';
import check from "../../assets/check.png";
import Error from "../Error.jsx";
import TableConditional from './TableConditional.jsx';
import { useMediaQuery } from 'react-responsive';
import getTareaByAbogado from '../../views/tareas/getTareabyAbogado.js';
import getTareaByExpediente from '../../views/tareas/getTareaByExpediente.js';
import Context from '../../context/abogados.context.jsx';
import { IoMdCheckmark } from "react-icons/io";

const Agenda = () => {
    const { expedientes, loading, error, setExpedientes, cancelTarea, deteleTarea } = useAgenda();
    const { abogados } = useAbogados();
    const [itemsPerPage, setItemsPerPage] = useState(200);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [originalExpedientes, setOriginalExpedientes] = useState([]);
    const [currentExpedientes, setCurrentExpedientes] = useState([]);
    const [SelectedTarea, setSelectedTarea] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [ isLoadingExpedientes, setisLoadingExpedientes] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('Numero');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
    const { jwt } = useContext(Context);

    useEffect(() => {
        if (originalExpedientes.length === 0 && expedientes.length > 0) {
            setOriginalExpedientes(expedientes);
        }
        const reversedExpedientes = [...expedientes].reverse();
        setTotalPages(Math.ceil(reversedExpedientes.length / itemsPerPage));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentExpedientes(reversedExpedientes.slice(startIndex, endIndex));
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



    const handleCancelTarea = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const {success, error} = await cancelTarea({
                id: SelectedTarea,
                setOriginalExpedientes

            });
            if (success) {
                toast.info('Se cancelo correctamente la tarea', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });
            } else {
                toast.error(`Algo mal sucedió al cancelar la tarea: ${error}`);

            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al cancelar la tarea');
        } finally {
            setIsLoading(false);
            closeModal();
        }
    };

    const handleDeleteTarea = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        try {
            const {success, error} = await deteleTarea({
                id: SelectedTarea,
                setOriginalExpedientes

            });
            if (success) {
                toast.info('Se elimino correctamente la tarea', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });
            } else {
                toast.error(`Algo mal sucedió al eliminar la tarea: ${error}`);

            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al eliminar la tarea');
        } finally {
            setIsDeleting(false);
            closeModalDelete();
        }
    };


    const openModal = (id) => {
        setSelectedTarea(id);
        setShowModal(true);

    }


    const closeModal = () => {
        setSelectedTarea(null);
        setShowModal(false);
    }

    const openModalDelete = (id) => {
        setSelectedTarea(id);
        setShowModalDelete(true);
    }


    const closeModalDelete = () => {
        setSelectedTarea(null);
        setShowModalDelete(false);
    }






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
        let filteredExpedientes = [];
        setisLoadingExpedientes(true);
    
        if (searchType === 'Nombre') {
            const lowercaseSearchTerm = searchTerm.toLowerCase();
            filteredExpedientes = originalExpedientes.filter(expediente =>
                expediente.acreditado.toLowerCase().includes(lowercaseSearchTerm)
            );
        } else if (searchType === 'Numero') {
            const lowercaseSearchTerm = searchTerm.toLowerCase();
            try {
                const expediente = await getTareaByExpediente({ numero: lowercaseSearchTerm, token: jwt });
    
                if (expediente && expediente.length > 0) {
                    filteredExpedientes.push(expediente[0]);
                } else {
                    filteredExpedientes = [];
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    filteredExpedientes = [];
                } else {
                    console.error("Something went wrong", error);
                }
            }
        } else if (searchType === 'Abogado') {
            try {
                const expedientes = await getTareaByAbogado({ username: searchTerm, token: jwt });
                if (expedientes && expedientes.length > 0) {
                    filteredExpedientes = [...expedientes];
                } else {
                    filteredExpedientes = [];
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    filteredExpedientes = [];
                } else {
                    console.error("Something went wrong", error);
                }
            }
        }
    
        setExpedientes(filteredExpedientes);
        setisLoadingExpedientes(false);
    };




    const handleSearchInputChange = async (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
    
        if (searchType === 'Numero' && searchTerm.trim() !== '') {
            setIsManualSearch(true);
        }
    
    
        if (searchType === 'Abogado' && searchTerm.trim() !== '') {
            searcherExpediente(searchTerm);
        }
    
        if (searchTerm.trim() === '') {
            setIsManualSearch(false);
            setExpedientes(originalExpedientes);
        }
    };
    

    const handleManualSearch = () => {
        if (search.trim() !== '') {
            searcherExpediente(search);
        }
    };




    if (loading || isLoadingExpedientes) return (
        <div className="flex items-center -mt-44 -ml-72 lg:-ml-44 xl:-ml-48 justify-center h-screen w-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    )

    if (error) return <Error message={error.message} />;

    return (
        <div>



            {showModal && (
                <div id="popup-modal" tabindex="-1" class={`'hidden' fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`}>
                    <div class="bg-white rounded-lg shadow w-full max-w-md">
                        <div class="p-4 md:p-5 text-center">
                            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres cancelar esta Tarea??</h3>
                            <button 
                             disabled={isLoading}
                             onClick={handleCancelTarea} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                                {isLoading ? <Spinner size='sm' color="default" /> : 'Si, estoy seguro'}
                                
                            </button>
                            <button onClick={closeModal} type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showModalDelete && (
                <div id="popup-modal" tabindex="-1" class={`'hidden' fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`}>
                    <div class="bg-white rounded-lg shadow w-full max-w-md">
                        <div class="p-4 md:p-5 text-center">
                            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres eliminar esta Tarea??</h3>
                            <button
                             disabled={isDeleting}
                             onClick={handleDeleteTarea} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                                {isDeleting ? <Spinner size='sm' color="default" /> : 'Si, estoy seguro'}
                            </button>
                            <button onClick={closeModalDelete} type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
                        </div>
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
                                                Numero
                                                {searchType === "Numero" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Abogado")}>
                                            Abogado
                                                {searchType === "Abogado" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <div className="relative w-full">
                                {searchType === "Abogado" ? (
                                    <select
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        id="etapa-dropdown"
                                        className="block p-2.5 w-full mr-32 z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        required
                                    >
                                        <option value="">Todos los Abogados</option>
                                        {abogados
                                            .filter(abogado => abogado.user_type === 'abogado')
                                            .map((abogado) => (
                                                <option key={abogado.id} value={abogado.username}>
                                                    {abogado.username}
                                                </option>
                                            ))}
                                    </select>
                                ) : (
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
                                )}
                                <button
                                    type="button"
                                    disabled={!isManualSearch && searchType !== "Etapa"}
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
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Abogado")}>
                                                Abogado
                                                {searchType === "Abogado" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>


                                    </ul>
                                </div>
                            )}
                                   <div className="relative w-full">
                                {searchType === "Abogado" ? (
                                    <select
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        id="etapa-dropdown"
                                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        required
                                    >
                                       <option value="">Todos los Abogados</option>
                                       {abogados
                                            .filter(abogado => abogado.user_type === 'abogado')
                                            .map((abogado) => (
                                                <option key={abogado.id} value={abogado.username}>
                                                    {abogado.username}
                                                </option>
                                            ))}
                                    </select>
                                ) : (
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
                                        style={{ width: "200px" }}
                                    />
                                )}
                                <button
                                    type="button"
                                    disabled={!isManualSearch && searchType !== "Etapa"}
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
                )}
    



            {expedientes.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                            <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M106.673 12.4027C110.616 13.5333 112.895 17.6462 111.765 21.5891L97.7533 70.4529C96.8931 73.4525 94.307 75.4896 91.3828 75.7948C91.4046 75.5034 91.4157 75.2091 91.4157 74.9121V27.1674C91.4157 20.7217 86.1904 15.4965 79.7447 15.4965H56.1167L58.7303 6.38172C59.8609 2.43883 63.9738 0.159015 67.9167 1.28962L106.673 12.4027Z" fill="#D2D9EE"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M32 27.7402C32 23.322 35.5817 19.7402 40 19.7402H79.1717C83.59 19.7402 87.1717 23.322 87.1717 27.7402V74.3389C87.1717 78.7572 83.59 82.3389 79.1717 82.3389H40C35.5817 82.3389 32 78.7572 32 74.3389V27.7402ZM57.1717 42.7402C57.1717 46.6062 53.8138 49.7402 49.6717 49.7402C45.5296 49.7402 42.1717 46.6062 42.1717 42.7402C42.1717 38.8742 45.5296 35.7402 49.6717 35.7402C53.8138 35.7402 57.1717 38.8742 57.1717 42.7402ZM36.1717 60.8153C37.2808 58.3975 40.7688 54.8201 45.7381 54.3677C51.977 53.7997 55.3044 57.8295 56.5522 60.0094C59.8797 55.4423 67.0336 46.8724 72.3575 45.9053C77.6814 44.9381 81.7853 48.4574 83.1717 50.338V72.6975C83.1717 75.4825 80.914 77.7402 78.1289 77.7402H41.2144C38.4294 77.7402 36.1717 75.4825 36.1717 72.6975V60.8153Z" fill="#D2D9EE"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500">No hay expedientes asignados todavía</p>
                        <p className="text-gray-400 text-sm mb-4 text-center">Ve a Position de Expedientes y asigna un nuevo Expediente para comenzar.</p>
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
                    openModal={openModal}
                    openModalDelete={openModalDelete}
                />
            )}
        </div>

    );
}

export default Agenda;
