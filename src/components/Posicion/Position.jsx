import { useState, useContext, useEffect, useRef } from 'react';
import FullScreenModal from './FullScreenModal.jsx'
import usePosition from "../../hooks/posicion/usePositions.jsx";
import { Spinner } from "@nextui-org/react";
import Error from "../Error.jsx";
import { toast } from 'react-toastify';
import TableConditional from './TableConditional.jsx';
import { useMediaQuery } from 'react-responsive';
import check from "../../assets/check.png";
import Context from '../../context/abogados.context.jsx';
import getPositionByNumero from '../../views/position/getPositionByNumber.js';
import useAbogados from '../../hooks/abogados/useAbogados.jsx';
import { IoMdCheckmark } from "react-icons/io";
import getPositionExpedientes from '../../views/position/getPositionExpedientes.js';
import useAgenda from '../../hooks/tareas/useAgenda.jsx';
import useExpedientesSial from "../../hooks/expedientesial/useExpedienteSial.jsx";
import getPositionByEtapa from '../../views/position/getPositionByEtapa.js';
import getPositionFiltros from '../../views/position/getPositionFiltros.js';
import useExpedientes from '../../hooks/expedientes/useExpedientes.jsx';
import { filtros } from "../../utils/Filtros.js"
import getPositionByFecha from '../../views/position/getPositionbyFecha.js';

const Position = () => {
    const { registerNewTarea } = useAgenda()
    const { updateExpediente, savePdfs, fetchFilename } = useExpedientes();
    const { etapas, loadingEtapas, errorEtapas } = useExpedientesSial();
    const { expedientes, loading, error, setExpedientes } = usePosition();
    const { abogados } = useAbogados()
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('Numero');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(200);
    const [currentPage, setCurrentPage] = useState(1);
    const [originalExpedientes, setOriginalExpedientes] = useState([]);
    const [currentExpedientes, setCurrentExpedientes] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
    const [isLoadingExpedientes, setisLoadingExpedientes] = useState(false);
    const { jwt } = useContext(Context);
    const [selectExpedientetoTask, setSelectExpedientetoTask] = useState(null);
    const [fechaError, setFechaError] = useState('');
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [isOpen, setIsOpen] = useState([]);
    const [formData, setFormData] = useState({
        tarea: '',
        fecha_entrega: '',
        observaciones: '',
        abogado_id: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // Para controlar el modal

    const handleOpenModal = () => {
        console.log('Opening Modal');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    // Función para formatear la fecha
    const monthNames = {
        '01': 'ene.',
        '02': 'feb.',
        '03': 'mar.',
        '04': 'abr.',
        '05': 'may.',
        '06': 'jun.',
        '07': 'jul.',
        '08': 'ago.',
        '09': 'sep.',
        '10': 'oct.',
        '11': 'nov.',
        '12': 'dic.',
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${parseInt(day)}/${monthNames[month]}/${year}`;
    };

    const handleMenuToggle = (index) => {
        setOpenMenuIndex(index === openMenuIndex ? null : index);

        setIsOpen(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

        if (name === 'fecha_entrega') {
            setFechaError('');
        }
    };

    const handleCreateTarea = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { tarea, fecha_entrega, observaciones, abogado_id } = formData;


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(`${fecha_entrega}T00:00:00`);
        selectedDate.setHours(0, 0, 0, 0);


        if (selectedDate.getTime() < today.getTime()) {
            setFechaError('La fecha no puede estar en el pasado. Debes seleccionar hoy o una fecha futura.');
            setIsLoading(false);
            return;
        }


        try {
            const { success, error } = await registerNewTarea({
                exptribunalA_numero: selectExpedientetoTask.expTribunalA_numero,
                abogado_id,
                tarea,
                fecha_entrega,
                observaciones
            });


            if (success) {
                toast.info('Se creó correctamente la tarea', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });
                const expedientes = await getPositionExpedientes({ token: jwt })
                setExpedientes(expedientes)
            } else {
                if (error === 'Ya existe una tarea asignada a este expediente.') {
                    toast.error('Ya existe una tarea asignada a este expediente.');
                } else if (error === 'ID de abogado inválido o el usuario no es un abogado.') {
                    toast.error('ID de abogado inválido o el usuario no es un abogado.');
                } else if (error === 'El numero de expediente es inválido.') {
                    toast.error('El numero de expediente no existe en el tribunal virtual. Por favor crea el expediente en Expediente Tv e intente de nuevo.');

                } else {
                    toast.error('Algo mal sucedió al crear la tarea: ' + error);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al crear la tarea');
        } finally {
            setIsLoading(false);
            closeModalTarea();
        }
    };




    const handleUpdate = async (numero, nombre, url) => {
        setIsLoading(true);
        if (!url) {
            toast.error('La URL no existe para este expediente.');
            setIsLoading(false);
            return;
        }

        try {
            const { success, error } = await updateExpediente({
                numero: numero,
                nombre: nombre,
                url: url,
                setOriginalExpedientes

            });
            if (success) {
                toast.info('Se actualizó correctamente el Expediente', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });
            } else {
                if (error === 'No se pudo obtener la información de la URL proporcionada. Intente de nuevo.') {
                    toast.error('La URL proporcionada es incorrecta. Intente de nuevo.');

                } else if (error === 'Tribunal no funciono') {
                    toast.error('El Tribunal Virtual fallo al devolver los datos. Intente de nuevo.');
                }
                else {
                    toast.error('Algo mal sucedió al actualizar el Expediente: ' + error);
                }
            }

        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al actualizar el Expediente');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (url, fecha) => {
        try {
            const { success: saveSuccess, fileName, error: saveError } = await savePdfs({ url, fecha });

            if (!saveSuccess) {
                if (saveError === 'Tribunal no funciono') {
                    toast.error('El Tribunal Virtual falló al devolver el PDF. Intente más tarde.');
                } else {
                    toast.error(`Error al descargar el PDF del Tribunal Virtual, Intente de nuevo`);
                }
                return;
            }

            const { success: fetchSuccess, data, error: fetchError } = await fetchFilename(fileName);
            if (!fetchSuccess) {
                if (fetchError === 'PDF no encontrado.') {
                    toast.error('El PDF solicitado no se encontró en el Tribunal Virtual. Intente de nuevo');
                } else {
                    toast.error(`Error al descargar el PDF del Tribunal Virtual, Intente de nuevo`);
                }
                return;
            }

            const downloadUrl = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            toast.info('PDF descargado con éxito.', {
                icon: () => <img src={check} alt="Success Icon" />,
                progressStyle: {
                    background: '#1D4ED8',
                },
            });
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
            toast.error('Error al descargar el PDF, Intente de nuevo');
        }
    };



    useEffect(() => {
        if (originalExpedientes.length === 0 && expedientes.length > 0) {
            setOriginalExpedientes(expedientes);
        }
        setTotalPages(Math.ceil(expedientes.length / itemsPerPage));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentExpedientes(expedientes.slice(startIndex, endIndex));
    }, [expedientes, itemsPerPage, currentPage, originalExpedientes.length]);

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

    const openModalTarea = (expediente) => {
        setSelectExpedientetoTask(expediente)
        setIsOpenModal(true);
    };

    const closeModalTarea = () => {
        setIsOpenModal(false);
        setFormData({
            tarea: '',
            fecha_entrega: '',
            observaciones: '',
            abogado_id: ''
        });
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



    const handleSearchInputChange = async (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);

        if (searchType === 'Numero' && searchTerm.trim() !== '') {
            setIsManualSearch(true);
        }
        if (searchType === 'Fecha' && searchTerm.trim() !== '') {
            setIsManualSearch(true);
        }
        if (searchType === 'Nombre' && searchTerm.trim() !== '') {
            searcherExpediente(searchTerm);
        }

        if (searchType === 'Etapa' && searchTerm.trim() !== '') {
            searcherExpediente(searchTerm);
        }

        if (searchType === 'Filtros') {
            if (searchTerm.trim() !== '') {
                try {
                    const parsedValue = JSON.parse(searchTerm);
                    searcherExpediente(parsedValue);
                } catch (error) {
                    console.error('Error al parsear el filtro:', error);
                }
            }
        }

        if (searchTerm.trim() === '') {
            setIsManualSearch(false);
            setExpedientes(originalExpedientes);
        }
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
                const expediente = await getPositionByNumero({ numero: lowercaseSearchTerm, token: jwt });

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
        } else if (searchType === 'Fecha') {
            const format_fecha = formatDate(searchTerm);
            try {
                const expedientesResponse = await getPositionByFecha({ fecha: format_fecha, token: jwt });

                const expedientes = expedientesResponse.data;

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
        } else if (searchType === 'Etapa') {
            try {
                const expedientes = await getPositionByEtapa({ etapa: searchTerm, token: jwt });

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
        } else if (searchType === 'Filtros') {
            try {

                const { etapa, termino, notificacion } = searchTerm;


                const expedientes = await getPositionFiltros({ etapa: etapa, termino: termino, notificacion: notificacion, token: jwt });

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

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setIsSearchOpen(false);
        setSearch('');
        setIsManualSearch(type === 'Numero' && type === 'Fecha');
        setExpedientes(originalExpedientes);

        if (type === 'Filtros Multiples') {
            handleOpenModal(); // Esto debe abrir el modal
        }
    };



    const handleManualSearch = () => {
        if (search.trim() !== '') {
            searcherExpediente(search);
        }
    };




    if (loading || loadingEtapas || isLoadingExpedientes) return (
        <div className="flex items-center -mt-44 -ml-72 lg:-ml-44 xl:-ml-48 justify-center h-screen w-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );


    if (error || errorEtapas) return <Error message={error.message} />;


    return (
        <div className="flex flex-col min-h-screen">
            {isOpenModal && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative max-w-md w-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-white border-b rounded-t dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Asignar Expediente
                                </h3>
                                <button onClick={closeModalTarea} disabled={isLoading} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                        </div>
                        <div className="pt-16 p-4 mx-auto">
                            <form className="space-y-4" onSubmit={handleCreateTarea}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tarea</label>
                                    <textarea
                                        name="tarea"
                                        value={formData.tarea}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="Ingresa Gestión"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
                                    <input
                                        type="date"
                                        name="fecha_entrega"
                                        value={formData.fecha_entrega}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    />
                                    {fechaError && (
                                        <p className="mt-2 text-sm text-red-600">{fechaError}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        name="observaciones"
                                        value={formData.observaciones}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="Ingrese observaciones"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Abogado</label>
                                    <select
                                        name="abogado_id"
                                        value={formData.abogado_id}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    >
                                        <option value="">Seleccione un abogado</option>
                                        {abogados
                                            .filter(abogado => abogado.user_type === 'abogado')
                                            .map((abogado) => (
                                                <option key={abogado.id} value={abogado.id}>
                                                    {abogado.username}
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
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5533C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8435 15.1192 80.8826 10.7237 75.2124 7.55338C69.5422 4.38303 63.2754 2.51562 56.7226 2.05191C51.7666 1.72076 46.7749 2.10213 41.8886 3.17641C39.3706 3.75162 37.9242 6.26221 38.5606 8.6879C39.197 11.1136 41.678 12.5285 44.2091 12.1372C47.9794 11.5281 51.8462 11.5135 55.6292 12.0928C60.8787 12.8773 65.8552 14.7495 70.2053 17.5733C74.5555 20.3972 78.178 24.1219 80.841 28.4807C83.1378 32.1457 84.9054 36.1701 86.0992 40.4294C86.7861 42.7992 89.5422 43.9002 91.9676 43.2631Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Cargando...</span>
                                        </div>
                                    ) : (
                                        'Asignar Expediente'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Filtros Múltiples */}
            <FullScreenModal isOpen={isModalOpen} onClose={handleCloseModal} />

            {/* Resto del código de tu componente */}


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
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Fecha")}>
                                                Fecha Tv
                                                {searchType === "Fecha" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Etapa")}>
                                                MacroEtapa
                                                {searchType === "Etapa" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Filtros")}>
                                                Mas Filtros
                                                {searchType === "Filtros" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Filtros Multiples")}>
                                                Filtros Múltiples
                                                {searchType === "Filtros Multiples" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                            )}





                            <div className="relative w-full">
                                {searchType === "Etapa" ? (
                                    <select
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        id="etapa-dropdown"
                                        className="block p-2.5 w-[300px] z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        required
                                    >
                                        <option value="">Todas las Etapas</option>
                                        {etapas.map((etapa, index) => (
                                            <option key={index} value={etapa.macroetapa_aprobada}>
                                                {etapa.macroetapa_aprobada}
                                            </option>
                                        ))}
                                    </select>
                                ) : searchType === "Filtros" ? (
                                    <select
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        id="filtros-dropdown"
                                        className="block p-2.5 w-[300px] z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        required
                                    >
                                        <option value="">Sin Filtro</option>
                                        {filtros.map((filtro, index) => (
                                            <option key={index} value={JSON.stringify(filtro.value)}>
                                                {filtro.name}
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
                                        type={searchType === "Fecha" ? "date" : "search"}
                                        id="search-dropdown"
                                        className="block p-2.5 w-full  z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        placeholder={searchType === "Fecha" ? "" : "Buscar Expedientes:"}
                                        required
                                        style={{ width: "300px" }}
                                    />
                                )}
                                <button
                                    type="button"
                                    disabled={!isManualSearch && searchType !== "Etapa" && searchType !== "Filtros"}
                                    onClick={handleManualSearch}
                                    className={`absolute top-0 ml-4 p-2.5 text-sm font-medium h-full text-white ${searchType === "Fecha" ? "left-[280px]" : "right-0"} ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-primary border-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary-dark dark:hover:bg-primary-dark dark:focus:ring-primary"}`}
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
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Fecha")}>
                                                Fecha Tv
                                                {searchType === "Fecha" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Etapa")}>
                                                MacroEtapa
                                                {searchType === "Etapa" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Filtros")}>
                                                Mas Filtros
                                                {searchType === "Filtros" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                            </button>
                                        </li>

                                    </ul>
                                </div>
                            )}
                            <div className="relative w-full">
                                {searchType === "Etapa" ? (
                                    <select
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        id="etapa-dropdown"
                                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        required
                                    >
                                        <option value="">Todas las Etapas</option>
                                        {etapas.map((etapa, index) => (
                                            <option key={index} value={etapa.macroetapa_aprobada}>
                                                {etapa.macroetapa_aprobada}
                                            </option>
                                        ))}
                                    </select>
                                ) : searchType === "Filtros" ? (
                                    <select
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        id="filtros-dropdown"
                                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        required
                                    >

                                        <option value="">Sin Filtro</option>
                                        {filtros.map((filtro, index) => (
                                            <option key={index} value={JSON.stringify(filtro.value)}>
                                                {filtro.name}
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
                                        type={searchType === "Fecha" ? "date" : "search"}
                                        id="search-dropdown"
                                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                                        placeholder={searchType === "Fecha" ? "" : "Buscar Expedientes:"}
                                        required
                                        style={{ width: "200px" }}
                                    />
                                )}
                                <button
                                    type="button"
                                    disabled={!isManualSearch && searchType !== "Etapa" && searchType !== "Filtros"}
                                    onClick={handleManualSearch}
                                    className={`absolute top-0 ml-4 p-2.5 text-sm font-medium h-full text-white ${searchType === "Fecha" ? "left-[180px]" : "right-0"} ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-primary border-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary-dark dark:hover:bg-primary-dark dark:focus:ring-primary"}`}
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
                        <p className="text-gray-500">No hay posiciones todavía</p>
                        <p className="text-gray-400 text-sm mb-4 text-center">Crea Expedientes para comenzar.</p>
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
                    openModalTarea={openModalTarea}
                    handleDownload={handleDownload}
                    handleUpdate={handleUpdate}
                    setOpenMenuIndex={setOpenMenuIndex}
                    setIsOpen={setIsOpen}
                    openMenuIndex={openMenuIndex}
                    isOpen={isOpen}
                    handleMenuToggle={handleMenuToggle}
                    isLoading={isLoading}

                />
            )}
        </div>
    )

}

export default Position;