import React, { Fragment, useState, useContext, useEffect } from 'react';
import useExpedientes from "../../hooks/expedientes/useExpedientes.jsx";
import { Spinner } from "@nextui-org/react";
import Error from "./Error.jsx";
import { IoMdCheckmark } from "react-icons/io";
import { toast } from 'react-toastify';
import check from "../../assets/check.png";
import TableConditional from './TableConditional.jsx';
import { useMediaQuery } from 'react-responsive';
import { RiChatNewLine } from "react-icons/ri";
import { ModalContext } from './ContextModal.jsx';



const Expedientes = () => {
    const { expedientes, loading, error, registerNewExpediente, deleteExpediente, updateExpediente } = useExpedientes();
    const [isLoading, setIsLoading] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [isOpen, setIsOpen] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('Nombre'); 
    const [isManualSearch, setIsManualSearch] = useState(false);
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentExpedientes, setCurrentExpedientes] = useState([]);
    const [menuDirection, setMenuDirection] = useState('down');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { openModalContext, closeModalContext, isOpenModalContext, openModalUpdateContext, closeModalUpdateContext, isOpenModalUpdateContext, openModalDeleteContext, closeModalDeleteContext, isOpenModalDeleteContext, isOpenModalViewAllContext } = useContext(ModalContext);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [ismodalOpenUpdate, setisModalOpenUpdate] = useState(false);
    const [isModalOpenDelete, setisModalOpenDelete] = useState(false);
    const [NumeroActive, setNumeroActive] = useState(false);
    const [NombreActive, setNombreActive] = useState(false);
    const [URLActive, setURLActive] = useState(false);
    const [ExpedienteActive, setExpedienteActive] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
  



    const handleMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setIsTooltipVisible(false);
    };

    const [formData, setFormData] = useState({
        id: '',
        Numero: '',
        Nombre: '',
        URL: '',
        Expediente: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { Numero, Nombre, URL, Expediente } = formData;
        try {
        const { success, error } = await registerNewExpediente({ Numero, Nombre, URL, Expediente });
        if (success) {
            toast.info('Se creó correctamente el expediente', {
                icon: () => <img src={check} alt="Success Icon" />,
                progressStyle: {
                    background: '#1D4ED8',
                }
            });
        } else {
            toast.error('Algo mal sucedió al crear el expediente: ' + error.message);
        }
    } catch (error) {
        toast.error('Algo mal sucedió al crear el expediente: ');

    } finally {
        setIsModalOpen(false);
        closeModalContext();
    }

        setIsLoading(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true); 

        try {
            const { success } = await updateExpediente({
                id: formData.id,
                NUmero: formData.Numero,
                Nombre: formData.Nombre,
                URL: formData.URL,
                Expediente: formData.Expediente,
            });

            if (success) {
                toast.info('Se actualizo correctamente el Expediente', {
                    icon: () => <img src={check} alt="Success Icon" />, 
                    progressStyle: {
                      background: '#1D4ED8',
                    }
                  });
            } else {
                toast.error('Algo mal sucedió al actualizar el Expediente: ' + error.message);
            }

        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al actualizar el Expediente'); 
        } finally {
            setisModalOpenUpdate(false);
            closeModalUpdateContext();
        }

        setIsLoading(false); 
    };

    const openModal = () => {
        setFormData({
            id: '',
            Numero: '',
            Nombre: '',
            URL: '',
            Expediente: ''
        });
        setIsModalOpen(true);
        openModalContext()
        setIsTooltipVisible(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        closeModalContext()
    };

    useEffect(() => {
        let reversedExpedientes = expedientes ? [...expedientes].reverse() : null;

        if (reversedExpedientes) {
            setTotalPages(Math.ceil(reversedExpedientes.length / itemsPerPage));
            setCurrentExpedientes(reversedExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } else {
            setTotalPages(2);
            setCurrentExpedientes([]);
        }
    }, [expedientes, currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const toggleDropdown = () => setIsSearchOpen(!isSearchOpen);



    const handleMenuToggle = (index) => {
        setOpenMenuIndex(index === openMenuIndex ? null : index);

        setIsOpen(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });

        // Determine menu direction
        if (index >= currentExpedientes.length - 2) {
            setMenuDirection('up');
        } else {
            setMenuDirection('down');
        }
    };
    const openModalUpdate = (expediente) => {
        setFormData({
            id: expediente.id,
            Numero: expediente.Numero,
            Nombre: expediente.Nombre,
            URL: expediente.URL,
            Expediente: expediente.Expediente
        });
        setisModalOpenUpdate(true);
        openModalUpdateContext();
        setOpenMenuIndex(null);
    };

    const closeModalUpdate = () => {
        setisModalOpenUpdate(false);
        closeModalUpdateContext();
    };

    const openModalDelete = (expediente) => {
        setFormData({
            id: expediente.id,
            Numero: expediente.Numero,
            Nombre: expediente.Nombre,
            URL: expediente.URL,
            Expediente: expediente.Expediente
        });
        setisModalOpenDelete(true);
        openModalDeleteContext();
        setOpenMenuIndex(null);
    };

    const closeModalDelete = () => {
        setisModalOpenDelete(false);
        closeModalDeleteContext();
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true);

        try {
            const { success } = await deleteExpediente({
                id: formData.id,
            });

            if (success) {
                toast.info('Se elimino correctamente el expediente', {
                    icon: () => <img src={check} alt="Success Icon" />, 
                    progressStyle: {
                      background: '#1D4ED8',
                    }
                  });
            } else {
                toast.error('Algo mal sucedió al eliminar el expediente: ' + error.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al eliminar el expediente');
        } finally {
            setIsDeleting(false);
            setisModalOpenDelete(false);
            closeModalDeleteContext();
        }
    };


    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setIsSearchOpen(false);
        setSearch('');
        setIsManualSearch(type === 'Numero'); 
        
        let reversedExpedientes = expedientes ? [...expedientes].reverse() : null;
        if (reversedExpedientes) {
            setTotalPages(Math.ceil(reversedExpedientes.length / itemsPerPage));
            setCurrentExpedientes(reversedExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } else {
            setTotalPages(2);
            setCurrentExpedientes([]);
        }
    };
    
    const searcherExpediente = (searchTerm) => {
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        let filteredExpedientes = [];
    
        if (searchType === 'Nombre') {
            filteredExpedientes = expedientes.filter(expediente => expediente.Nombre.toLowerCase().includes(lowercaseSearchTerm));
        } else if (searchType === 'Numero') {
            filteredExpedientes = expedientes.filter(expediente => expediente.Numero.toLowerCase().includes(lowercaseSearchTerm));
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
            searcherExpediente(searchTerm);
        } else if (searchType === 'Nombre' && searchTerm.trim() !== '') {
            searcherExpediente(searchTerm);
        } else if (searchTerm.trim() === '') {
            setIsManualSearch(false);
            let reversedExpedientes = expedientes ? [...expedientes].reverse() : null;
            if (reversedExpedientes) {
                setTotalPages(Math.ceil(reversedExpedientes.length / itemsPerPage));
                setCurrentExpedientes(reversedExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            } else {
                setTotalPages(2);
                setCurrentExpedientes([]);
            }
        }
    };
    
    const handleManualSearch = () => {
        if (search.trim() !== '') {
            searcherExpediente(search);
        }
    };
    

    if (loading) return (
        <div className="flex items-start justify-center h-screen top-2 pt-20">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );

    if (error) return <Error message={error.message} />;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="dark:from-blue-900 absolute top-0 left-0 z-0 w-full h-full"></div>
            {!isOpenModalContext && !isOpenModalUpdateContext && !isOpenModalDeleteContext && !isOpenModalViewAllContext && !isModalOpen && (
                    <div className="fixed right-1/4 top-24 z-50">
                        <div className="relative">
                            <button
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                type="button"
                                onClick={openModal}
                                className="text-white bg-primary hover:bg-primary/80 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <RiChatNewLine />
                                <span className="sr-only">Open modal</span>
                            </button>

                            {isTooltipVisible && (
                                <div
                                    id="tooltip-share"
                                    role="tooltip"
                                    className="absolute z-10 w-auto px-2 py-1 text-xs font-medium text-gray-900 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm -top-10 left-1/2 transform -translate-x-1/2"
                                >
                                    Nuevo Expediente
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            )}
                        </div>
                </div>
            )}

            <div id="popup-modal" tabindex="-1" class={`${isModalOpenDelete ? '' : 'hidden'} fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`}>
                <div class="bg-white rounded-lg shadow w-full max-w-md">
                    <div class="p-4 md:p-5 text-center">
                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 class="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres eliminar este Expediente??</h3>
                        <button onClick={handleDelete} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                            {isDeleting ? <Spinner className="h-5 w-5" color="red" /> : 'Si, estoy seguro'}
                        </button>
                        <button onClick={closeModalDelete} type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
                    </div>
                </div>
            </div>




            {isModalOpen && (
                    <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                        <div className="relative p-4 mx-auto mt-20 max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Crear Nuevo Expediente
                                </h3>
                                <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="p-4 md:p-5">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="text"
                                            name="Numero"
                                            id="floating_numero"
                                            value={formData.Numero}
                                            onChange={handleChange}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                            required
                                        />
                                        <label
                                            htmlFor="floating_numero"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Numero de Expediente
                                        </label>
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="text"
                                            name="Nombre"
                                            id="floating_nombre"
                                            value={formData.Nombre}
                                            onChange={handleChange}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                            required
                                        />
                                        <label htmlFor="floating_nombre" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre del expediente</label>
                                    </div>
                                </div>
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="text"
                                            name="URL"
                                            id="floating_url"
                                            value={formData.URL}
                                            onChange={handleChange}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label htmlFor="floating_apellido" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">URL (Opcional)</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="text"
                                            name="Expediente"
                                            id="floating_expediente"
                                            value={formData.Expediente}
                                            onChange={handleChange}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "

                                        />
                                        <label htmlFor="floating_cedula" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Expediente (Opcional)</label>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full mt-4 rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                                    >
                                        {isLoading ? (
                                            <div role="status">
                                                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="white" />
                                                </svg>
                                                <span class="sr-only">Creando...</span>
                                            </div>
                                        ) : (
                                            'Crear'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


            {ismodalOpenUpdate && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 mx-auto mt-20 max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Actualizar Prospecto
                            </h3>
                            <button onClick={closeModalUpdate} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-4 md:p-5">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="Numero"
                                    id="floating_Numero"
                                    value={formData.Numero}
                                    onChange={handleChange}
                                    className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${NumeroActive ? '' : 'pointer-events-none'}`}
                                    placeholder=" "
                                    required
                                    readOnly={!NumeroActive}
                                />
                                <label
                                    htmlFor="floating_Numero"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                   Número
                                </label>
                                <div className="flex items-center">
                                    <input
                                        checked={NumeroActive}
                                        onChange={() => setNumeroActive(!NumeroActive)}
                                        id="numero-checkbox"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        htmlFor="numero-checkbox"
                                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Editar
                                    </label>
                                </div>
                            </div>

                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="name"
                                        id="floating_first_name"
                                        value={formData.Nombre}
                                        onChange={handleChange}
                                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${NombreActive ? '' : 'pointer-events-none'}`}
                                        placeholder=" "
                                        required
                                        readOnly={!NombreActive}
                                    />
                                    <label
                                        htmlFor="floating_name"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Nombre
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            checked={NombreActive}
                                            onChange={() => setNombreActive(!NombreActive)}
                                            id="name-checkbox"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="name-checkbox"
                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            Editar
                                        </label>
                                    </div>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="url"
                                        id="floating_url"
                                        value={formData.URL}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                        required
                                        readOnly={!URLActive}
                                    />
                                    <label
                                        htmlFor="floating_url"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        URL (Opcional)
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            checked={URLActive}
                                            onChange={() => setURLActive(!URLActive)}
                                            id="url-checkbox"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="url-checkbox"
                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            Editar
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="expediente"
                                        id="floating_expediente"
                                        value={formData.Expediente}
                                        onChange={handleChange}
                                        className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                                        placeholder=" "
                                        required
                                        readOnly={!ExpedienteActive}
                                    />
                                 
                                    <label
                                        htmlFor="floating_expediente"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Expediente (Opcional) 
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            checked={ExpedienteActive}
                                            onChange={() => setExpedienteActive(!ExpedienteActive)}
                                            id="phone-checkbox"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="phone-checkbox"
                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            Editar
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full mt-4 rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                                >
                                    {isLoading ? (
                                        <div role="status">
                                            <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="white" />
                                            </svg>
                                            <span class="sr-only">Actualizando...</span>
                                        </div>
                                    ) : (
                                        'Actualizar'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {!isOpenModalContext && !isOpenModalUpdateContext && !isOpenModalDeleteContext && !isOpenModalViewAllContext && (
                <>
                    {isDesktopOrLaptop ? (
                        <form className="max-w-xs mx-auto mb-4" style={{ position: 'fixed', top: '11%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
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
                                        id="dropdown"
                                        className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-8"
                                    >
                                        <ul className="py-1 text-xs text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                                            <li>
                                                <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Nombre")}>
                                                    Nombre
                                                    {searchType === "Nombre" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                                </button>
                                            </li>
                                            <li>
                                                <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Numero")}>
                                                    Id
                                                    {searchType === "Id" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                <div className="relative w-full">
                                    <input
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        type="search"
                                        id="search-dropdown"
                                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                        placeholder="Search Prospects:"
                                        required
                                        style={{ width: "300px" }} 
                                    />
                                    <button
                                        type="button"
                                        disabled={!isManualSearch}
                                        onClick={handleManualSearch} 
                                        className={`absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}`}
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
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form className="max-w-xs mx-auto mb-4" style={{ position: 'fixed', top: '11%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
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
                                        id="dropdown"
                                        className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700 absolute mt-8"
                                    >
                                        <ul className="py-1 text-xs text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                                            <li>
                                                <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Nombre")}>
                                                    Nombre
                                                    {searchType === "Nombre" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                                </button>
                                            </li>
                                            <li>
                                                <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Id")}>
                                                    Id
                                                    {searchType === "Id" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                <div className="relative w-full">
                                    <input
                                        value={search}
                                        onChange={handleSearchInputChange}
                                        type="search"
                                        id="search-dropdown"
                                        className="block p-1.5 w-full z-20 text-xs text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                        placeholder="Search Prospects:"
                                        required
                                        style={{ width: "200px" }}
                                    />
                                    <button
                                        type="button"
                                        disabled={!isManualSearch} 
                                        onClick={handleManualSearch} 
                                        className={`absolute top-0 right-0 p-1.5 text-xs font-medium h-full text-white ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}`}
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
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </form>


                    )}
                </>
            )}
            <TableConditional
                currentExpedientes={currentExpedientes}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                handleMenuToggle={handleMenuToggle}
                isOpen={isOpen}
                openMenuIndex={openMenuIndex}
                openModalUpdate={openModalUpdate}
                openModalDelete={openModalDelete}
                menuDirection={menuDirection} // Pasar menuDirection a Cards
                setOpenMenuIndex={setOpenMenuIndex}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

export default Prospects;
