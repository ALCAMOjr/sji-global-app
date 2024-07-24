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
import getExpedienteByNumero from '../../views/expedientes/getExpedienteByNumero.js';
import Context from '../../context/abogados.context.jsx';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import masicon from "../../assets/mas.png"



const Expedientes = () => {
    const { expedientes, loading, error, registerNewExpediente, deleteExpediente, updateExpediente } = useExpedientes();
    const [isLoading, setIsLoading] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [isOpen, setIsOpen] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('Nombre');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentExpedientes, setCurrentExpedientes] = useState([]);
    const [menuDirection, setMenuDirection] = useState('down');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ismodalOpenUpdate, setisModalOpenUpdate] = useState(false);
    const [isModalOpenDelete, setisModalOpenDelete] = useState(false);
    const [numeroActive, setNumeroActive] = useState(false);
    const [nombreActive, setNombreActive] = useState(false);
    const [urlActive, setUrlActive] = useState(false);
    const [expedienteActive, setExpedienteActive] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
    const { jwt } = useContext(Context);


    useEffect(() => {
        let reversedExpedientes = expedientes ? [...expedientes].reverse() : [];
        setTotalPages(Math.ceil(reversedExpedientes.length / itemsPerPage));
        setCurrentExpedientes(reversedExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

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


    const [formData, setFormData] = useState({
        id: '',
        numero: '',
        nombre: '',
        url: '',
        expediente: '',
        juzgado: '',
        juicio: '',
        ubicacion: '',
        partes: '',

    });


    const handleChange = (e) => {
        let value = e.target.value;


        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };


    const openModal = () => {
        setFormData({
            id: '',
            numero: '',
            nombre: '',
            url: '',
            expediente: '',
            juzgado: '',
            juicio: '',
            ubicacion: '',
            partes: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { numero, nombre, url, expediente } = formData;

        try {
            const { success, error } = await registerNewExpediente({ numero, nombre, url, expediente });

            if (success) {
                toast.info('Se creó correctamente el expediente', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });
            } else {
                if (error === 'El expediente con este número ya existe.') {
                    toast.error('El número de expediente ya existe. Intente con otro número.');
                } else if (error === 'No se pudo obtener la información de la URL proporcionada. Intente de nuevo.') {
                    toast.error('No se pudo obtener la información de la URL proporcionada. Intente de nuevo.');
                } else {
                    toast.error('Algo mal sucedió al crear el expediente: ' + error);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al crear el expediente');
        } finally {
            setIsModalOpen(false);
            setIsLoading(false);
        }
    };


    const openModalUpdate = (expediente) => {
        setFormData({
            id: expediente.id,
            numero: expediente.numero,
            nombre: expediente.nombre,
            url: expediente.url,
            expediente: expediente.expediente,
            juzgado: expediente.juzgado,
            juicio: expediente.juicio,
            ubicacion: expediente.ubicacion,
            partes: expediente.partes,

        });
        setisModalOpenUpdate(true);
        setOpenMenuIndex(null);
    };

    const closeModalUpdate = () => {
        setisModalOpenUpdate(false);
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { success, error } = await updateExpediente({
                id: formData.id,
                numero: formData.numero,
                nombre: formData.nombre,
                url: formData.url,
                expediente: formData.expediente,
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
                    toast.error('No se pudo obtener la información de la URL proporcionada. Intente de nuevo.');
                } else {
                    toast.error('Algo mal sucedió al actualizar el Expediente: ' + error);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al actualizar el Expediente');
        } finally {
            setisModalOpenUpdate(false);

            setIsLoading(false);
        }
    };


    const openModalDelete = (expediente) => {
        setFormData({
            id: expediente.id,
            numero: expediente.numero,
            nombre: expediente.nombre,
            url: expediente.url,
            expediente: expediente.expediente,
            juzgado: expediente.juzgado,
            juicio: expediente.juicio,
            ubicacion: expediente.ubicacion,
            partes: expediente.partes,
        });
        setisModalOpenDelete(true);
        setOpenMenuIndex(null);
    };

    const closeModalDelete = () => {
        setisModalOpenDelete(false);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true);

        try {
            const { success, error } = await deleteExpediente({
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
        }
    };


    const handleMenuToggle = (index) => {
        setOpenMenuIndex(index === openMenuIndex ? null : index);

        setIsOpen(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
        if (index >= currentExpedientes.length - 2) {
            setMenuDirection('up');
        } else {
            setMenuDirection('down');
        }
    };



    const toggleDropdown = () => setIsSearchOpen(!isSearchOpen);


    const handleSearchTypeChange = (type) => {
        console.log(type)
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
            filteredExpedientes = expedientes.filter(expediente => expediente.nombre.toLowerCase().includes(lowercaseSearchTerm));
        } else if (searchType === 'Numero') {
            try {

                console.log(lowercaseSearchTerm, jwt)
                const expediente = await getExpedienteByNumero({ numero: lowercaseSearchTerm, token: jwt });
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
        <div className="flex items-center -mt-44 ml-0 lg:ml-44 xl:ml-44 justify-start h-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );

    if (error) return <Error message={error.message} />;

    return (
        <div className="flex flex-col min-h-screen">
          
                <div className="absolute right-56 top-24 z-50">
                    <div className="relative">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button color='primary'
                                    isIconOnly
                                    aria-label="Mas"
                                    
                                >
                                    <img src={masicon} alt="Mas" className='w-4 h-4'/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem  key="new">Subir Archivo</DropdownItem>
                                <DropdownItem onClick={openModal} key="copy">Crear Expediente</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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
                                        type="number"
                                        name="numero"
                                        id="floating_numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_numero"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Numero de Expediente
                                    </label>
                                </div>

                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="floating_nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="floating_nombre" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre del expediente</label>
                                </div>
                            </div>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="url"
                                        id="floating_url"
                                        value={formData.url}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                    />
                                    <label htmlFor="floating_apellido" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">URL (Opcional)</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="expediente"
                                        id="floating_expediente"
                                        value={formData.expediente}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "

                                    />
                                    <label htmlFor="floating_cedula" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Expediente (Opcional)</label>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full mt-4 rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                                >
                                    {isLoading ? (
                                        <div role="status">
                                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8435 15.1192 80.8826 10.723 75.2124 7.41289C69.5422 4.10282 63.2754 1.94025 56.7459 1.05182C51.9119 0.367309 46.9723 0.446843 42.1812 1.27873C39.776 1.69443 38.3056 4.18666 38.9427 6.6121C39.5798 9.03754 42.0486 10.4294 44.4933 10.107C48.1735 9.60903 51.9217 9.65443 55.5554 10.2378C60.8781 11.1108 65.9404 13.1622 70.3623 16.2552C74.7841 19.3482 78.4674 23.4103 81.0915 28.1577C83.2563 31.8759 84.9323 35.9276 86.0774 40.1518C86.7802 42.5095 89.5422 43.6781 91.9676 43.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : (
                                        'Guardar'
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
                                Actualizar Expedientes
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
                                    type="number"
                                    name="numero"
                                    id="floating_numero"
                                    value={formData.numero}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer 'pointer-events-none"
                                    placeholder=" "
                                    required
                                    readOnly
                                />
                                <label
                                    htmlFor="floating_numero"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Número de Expediente
                                </label>
                            </div>

                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="floating_nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer ${nombreActive ? '' : 'pointer-events-none'}`}
                                        placeholder=" "
                                        required
                                        readOnly={!nombreActive}
                                    />
                                    <label
                                        htmlFor="floating_nombre"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Nombre
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            checked={nombreActive}
                                            onChange={() => setNombreActive(!nombreActive)}
                                            id="nombre-checkbox"
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="nombre-checkbox"
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
                                        value={formData.url}
                                        onChange={handleChange}
                                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer ${urlActive ? '' : 'pointer-events-none'}`}
                                        placeholder=" "
                                        readOnly={!urlActive}
                                    />
                                    <label
                                        htmlFor="floating_url"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        URL (Opcional)
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            checked={urlActive}
                                            onChange={() => setUrlActive(!urlActive)}
                                            id="url-checkbox"
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                                        value={formData.expediente}
                                        onChange={handleChange}
                                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer ${expedienteActive ? '' : 'pointer-events-none'}`}
                                        placeholder=" "
                                        readOnly={!expedienteActive}
                                    />
                                    <label
                                        htmlFor="floating_expediente"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Expediente (Opcional)
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            checked={expedienteActive}
                                            onChange={() => setExpedienteActive(!expedienteActive)}
                                            id="expediente-checkbox"
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="expediente-checkbox"
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
                                            <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            <div className="absolute top-0 left-0 z-0 w-full h-full"></div>


            <div id="popup-modal" tabindex="-1" class={`${isModalOpenDelete ? '' : 'hidden'} fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`}>
                <div class="bg-white rounded-lg shadow w-full max-w-md">
                    <div class="p-4 md:p-5 text-center">
                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 class="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres eliminar este Expediente??</h3>
                        <button onClick={handleDelete} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                            {isDeleting ? <Spinner size='sm' color="default" /> : 'Si, estoy seguro'}
                        </button>
                        <button onClick={closeModalDelete} type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
                    </div>
                </div>
            </div>


       
    <>
        {isDesktopOrLaptop ? (
            <form className="max-w-xs mx-auto mb-4 fixed top-28 left-1/2 transform -translate-x-1/2 z-10 -translate-y-1/2">
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
                                        Numero
                                        {searchType === "Numero" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
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
            </form>
        ) : (
            <form className="max-w-xs mx-auto mb-4 fixed top-28 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
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
            </form>
        )}
    </>


            {currentExpedientes.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                            <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M106.673 12.4027C110.616 13.5333 112.895 17.6462 111.765 21.5891L97.7533 70.4529C96.8931 73.4525 94.307 75.4896 91.3828 75.7948C91.4046 75.5034 91.4157 75.2091 91.4157 74.9121V27.1674C91.4157 20.7217 86.1904 15.4965 79.7447 15.4965H56.1167L58.7303 6.38172C59.8609 2.43883 63.9738 0.159015 67.9167 1.28962L106.673 12.4027Z" fill="#D2D9EE"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M32 27.7402C32 23.322 35.5817 19.7402 40 19.7402H79.1717C83.59 19.7402 87.1717 23.322 87.1717 27.7402V74.3389C87.1717 78.7572 83.59 82.3389 79.1717 82.3389H40C35.5817 82.3389 32 78.7572 32 74.3389V27.7402ZM57.1717 42.7402C57.1717 46.6062 53.8138 49.7402 49.6717 49.7402C45.5296 49.7402 42.1717 46.6062 42.1717 42.7402C42.1717 38.8742 45.5296 35.7402 49.6717 35.7402C53.8138 35.7402 57.1717 38.8742 57.1717 42.7402ZM36.1717 60.8153C37.2808 58.3975 40.7688 54.8201 45.7381 54.3677C51.977 53.7997 55.3044 57.8295 56.5522 60.0094C59.8797 55.4423 67.0336 46.8724 72.3575 45.9053C77.6814 44.9381 81.7853 48.4574 83.1717 50.338V72.6975C83.1717 75.4825 80.914 77.7402 78.1289 77.7402H41.2144C38.4294 77.7402 36.1717 75.4825 36.1717 72.6975V60.8153Z" fill="#D2D9EE"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500">No hay expedientes todavía</p>
                        <p className="text-gray-400 text-sm mb-4 text-center">Crea un nuevo expediente para comenzar.</p>
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
                    handleMenuToggle={handleMenuToggle}
                    isOpen={isOpen}
                    openMenuIndex={openMenuIndex}
                    openModalUpdate={openModalUpdate}
                    openModalDelete={openModalDelete}
                    menuDirection={menuDirection}
                    setOpenMenuIndex={setOpenMenuIndex}
                    setIsOpen={setIsOpen}

                />
            )}
        </div>
    )

}

export default Expedientes;