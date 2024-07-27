import React, { useState, useContext, useEffect, useRef } from 'react';
import usePosition from "../../hooks/posicion/usePositions.jsx";
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
import { Textarea } from "@nextui-org/react";
import { DateInput } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/react";
import useAbogados from '../../hooks/abogados/useAbogados.jsx';

const Position = () => {
    const { expedientes, loading, error } = usePosition();
    const { abogados } = useAbogados()
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('Numero');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(160);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentExpedientes, setCurrentExpedientes] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
    const [errors, setErrors] = useState({});
    const { jwt } = useContext(Context);
    const [selectExpedientetoTask, setSelectExpedientetoTask] = useState(null)

    useEffect(() => {
        if (expedientes) {
            setTotalPages(Math.ceil(expedientes.length / itemsPerPage));
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = currentPage * itemsPerPage;
            setCurrentExpedientes(expedientes.slice(startIndex, endIndex));
        }
    }, [expedientes, currentPage, itemsPerPage]);



    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };



    const onPageChange = (page) => {
        setCurrentPage(page);
    };




    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(+event.target.value);
        setCurrentPage(1);
    };
    const openModalTarea = (expediente) => {
        setSelectExpedientetoTask(expediente)
        setIsOpenModal(true);
    };

    const closeModalTarea = () => {
        setSelectExpedientetoTask(null)
        setIsOpenModal(null)
    };


    const toggleDropdown = () => setIsSearchOpen(!isSearchOpen);


    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setIsSearchOpen(false);
        setSearch('');
        setIsManualSearch(type === 'Numero');

        let reversedExpedientes = expedientes ? [...expedientes].reverse() : [];
        setTotalPages(Math.ceil(reversedExpedientes.length / itemsPerPage));
        setCurrentExpedientes(reversedExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    };


    const searcherExpediente = async (searchTerm) => {
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

        setCurrentExpedientes(filteredExpedientes);
        setTotalPages(Math.ceil(filteredExpedientes.length / itemsPerPage));
        setCurrentPage(1);
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

            let reversedExpedientes = expedientes ? [...expedientes].reverse() : [];
            setTotalPages(Math.ceil(reversedExpedientes.length / itemsPerPage));
            setCurrentExpedientes(reversedExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        }
    }

    const handleManualSearch = () => {
        if (search.trim() !== '') {
            searcherExpediente(search);
        }
    };






    if (loading) return (
        <div className="flex items-center -mt-44 -ml-72 lg:ml-44 xl:-ml-48 justify-center h-screen w-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );


    if (error) return <Error message={error.message} />;


    return (
        <div className="flex flex-col min-h-screen">

            {isOpenModal && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative max-w-md w-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-white border-b rounded-t dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Agendar nueva Tarea
                                </h3>
                                <button onClick={closeModalTarea} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                        </div>
                        <div className="pt-16 p-4 mx-auto">
                            <form className="space-y-4">
                                <div>
                                <label className="block text-sm font-medium text-gray-700">Tarea</label>
                                    <textarea
                                        name="observaciones"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Ingresa la Tarea"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha Estimada de Entrega</label>
                                    <input
                                        type="date"
                                        name="fecha_estimada_entrega"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha Real de Entrega</label>
                                    <input
                                        type="date"
                                        name="fecha_real_entrega"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha Estimada de Respuesta</label>
                                    <input
                                        type="date"
                                        name="fecha_estimada_respuesta"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        name="observaciones"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Ingrese observaciones"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Abogado</label>
                                    <select
                                        name="abogado_id"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Seleccione un abogado</option>
                                        {abogados.map((abogado) => (
                                            <option key={abogado.id} value={abogado.id}>
                                                {abogado.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full mt-4 rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                                >
                                    {isLoading ? (
                                        <div role="status">
                                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5533C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7234 75.2124 7.55338C69.5422 4.38335 63.2754 2.51539 56.7663 2.05081C51.7668 1.68134 46.7392 2.05829 41.8592 3.16224C39.3322 3.76176 37.8618 6.25956 38.4989 8.68497C39.1359 11.1104 41.6143 12.5452 44.1373 11.9457C47.8203 11.0764 51.6026 10.8296 55.3196 11.2228C60.8785 11.7913 66.1942 13.543 70.9048 16.3926C75.6155 19.2423 79.6142 23.1216 82.6685 27.793C84.9175 31.0338 86.6015 34.6088 87.6735 38.3892C88.4295 40.7753 91.5423 41.6631 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : (
                                        "Agendar Tarea"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}



            {currentExpedientes.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                            <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M106.673 12.4027C110.616 13.5333 112.895 17.6462 111.765 21.5891L97.7533 70.4529C96.8931 73.4525 94.307 75.4896 91.3828 75.7948C91.4046 75.5034 91.4157 75.2091 91.4157 74.9121V27.1674C91.4157 20.7217 86.1904 15.4965 79.7447 15.4965H56.1167L58.7303 6.38172C59.8609 2.43883 63.9738 0.159015 67.9167 1.28962L106.673 12.4027Z" fill="#D2D9EE"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M32 27.7402C32 23.322 35.5817 19.7402 40 19.7402H79.1717C83.59 19.7402 87.1717 23.322 87.1717 27.7402V74.3389C87.1717 78.7572 83.59 82.3389 79.1717 82.3389H40C35.5817 82.3389 32 78.7572 32 74.3389V27.7402ZM57.1717 42.7402C57.1717 46.6062 53.8138 49.7402 49.6717 49.7402C45.5296 49.7402 42.1717 46.6062 42.1717 42.7402C42.1717 38.8742 45.5296 35.7402 49.6717 35.7402C53.8138 35.7402 57.1717 38.8742 57.1717 42.7402ZM36.1717 60.8153C37.2808 58.3975 40.7688 54.8201 45.7381 54.3677C51.977 53.7997 55.3044 57.8295 56.5522 60.0094C59.8797 55.4423 67.0336 46.8724 72.3575 45.9053C77.6814 44.9381 81.7853 48.4574 83.1717 50.338V72.6975C83.1717 75.4825 80.914 77.7402 78.1289 77.7402H41.2144C38.4294 77.7402 36.1717 75.4825 36.1717 72.6975V60.8153Z" fill="#D2D9EE"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500">No hay posiciones todavía</p>
                        <p className="text-gray-400 text-sm mb-4 text-center">Crea Expedientes para comenzar.</p>
                    </div>

                </div>




            ) : (

                <TableConditional
                    currentExpedientes={currentExpedientes}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onPageChange={onPageChange}
                    openModalTarea={openModalTarea}


                />
            )}
        </div>
    )

}

export default Position;