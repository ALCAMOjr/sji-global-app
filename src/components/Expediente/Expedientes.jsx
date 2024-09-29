import React, { useRef, useState, useContext, useEffect } from 'react';
import useExpedientes from "../../hooks/expedientes/useExpedientes.jsx";
import { Spinner } from "@nextui-org/react";
import Error from "../Error.jsx";
import { IoMdCheckmark } from "react-icons/io";
import { toast } from 'react-toastify';
import check from "../../assets/check.png";
import TableConditional from './TableConditional.jsx';
import { useMediaQuery } from 'react-responsive';
import getExpedienteByNumero from '../../views/expedientes/getExpedienteByNumero.js';
import Context from '../../context/abogados.context.jsx';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import masicon from "../../assets/mas.png"
import getNombrebyNumero from '../../views/expedientesial/getNamebyNumber.js';
import { getExpedienteJobStatus } from "../../views/expedientes/optional.js"
import agregar from "../../assets/agregar.png"
const Expedientes = () => {
    const { expedientes, loading, error, registerNewExpediente, uploadFile, deleteExpediente, updateExpediente, UpdateAllExpedientes, setExpedientes } = useExpedientes();
    const [isLoading, setIsLoading] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [isOpen, setIsOpen] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);
    const [search, setSearch] = useState('');
    const [isLoadingExpedientes, setisLoadingExpedientes] = useState(false);
    const [searchType, setSearchType] = useState('Numero');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(200);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [originalExpedientes, setOriginalExpedientes] = useState([]);
    const [currentExpedientes, setCurrentExpedientes] = useState([]);
    const [menuDirection, setMenuDirection] = useState('down');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [areFilesValid, setAreFilesValid] = useState(true);
    const [errors, setErrors] = useState({});
    const inputFileRef = useRef(null);
    const [ismodalOpenUpdate, setisModalOpenUpdate] = useState(false);
    const [isModalOpenDelete, setisModalOpenDelete] = useState(false);
    const [urlActive, setUrlActive] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
    const { jwt } = useContext(Context);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [IsLoadingUpdateAllExpedientes, setIsLoadingUpdateAllExpedientes] = useState(false)
    const [progress, setProgress] = useState(0);
    const [isCheckedUpdate, setIsCheckedUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); 


    const handleCheckboxUpdateChange = (event) => {
        setIsCheckedUpdate(event.target.checked);
    };


    const openModalUpload = () => {
        setIsModalOpenUpload(true);
    };

    const closeModalUpload = () => {
        setIsModalOpenUpload(false);
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
        setIsUpdating(false); 
        setProgress(0); 
        
        try {
            const { success, jobId, error } = await uploadFile(setOriginalExpedientes, selectedFiles, isCheckedUpdate);
    
            if (success) {
                if (isCheckedUpdate && jobId) {
                    setIsUpdating(true);
                    const { success: monitorSuccess, result } = await monitorJobProgress(jobId);
    
                    if (monitorSuccess) {
                        if (result.expedientesConDetalles && result.expedientesConDetalles.length > 0) {
                        toast.info('Se le notificó por correo electrónico con el resultado del proceso.', {
                            icon: () => <img src={check} alt="Success Icon" />,
                            progressStyle: {
                                background: '#1D4ED8',
                            }
                        });
                        setExpedientes(result.expedientesConDetalles);
                    } else {
                        toast.info('Se le notificó por correo electrónico con el resultado del proceso.', {
                            icon: () => <img src={check} alt="Success Icon" />,
                            progressStyle: {
                                background: '#1D4ED8',
                            }
                        });
                       window.location.reload()
                    }
                    
                      
                    } else {
                        toast.info('Se le notificó por correo electrónico con el resultado del proceso.', {
                            icon: () => <img src={check} alt="Success Icon" />,
                            progressStyle: {
                                background: '#1D4ED8',
                            }
                        });
                        window.location.reload();
                    }
                } else {
                    toast.info('Archivos subidos correctamente.', {
                        icon: () => <img src={check} alt="Success Icon" />,
                        progressStyle: {
                            background: '#1D4ED8',
                        },
                    });
                }
            } else if (error === "Campos inválidos en los archivos.") {
                toast.error('Los campos de los archivos CSV son incorrectos. Revísalos y vuelve a intentarlo.');
            } else if (error === "Formato de archivo no válido. Solo se permiten archivos .csv") {
                toast.error('Formato de archivo no válido. Solo se permiten archivos .csv, Cambia el formato e intente de nuevo.');
            }
             else {
                toast.error(`Algo mal sucedió al subir los archivos. Intente de nuevo`);
            }
        } catch (error) {
            console.error('Error al subir los archivos:', error);
            toast.error('Algo mal sucedió al subir los archivos. Verifique los campos e intente de nuevo.');
        } finally {
            setIsLoading(false);
            setIsModalOpenUpload(false);
            setSelectedFiles([]);
            setErrors({});
        }
    };
    
    

    useEffect(() => {
        if (originalExpedientes.length === 0 && expedientes.length > 0) {
            setOriginalExpedientes(expedientes);
        }
        setTotalPages(Math.ceil(expedientes.length / itemsPerPage));

        const reversedExpedientes = [...expedientes].reverse();

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

    const [formData, setFormData] = useState({
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

        if (e.target.name === 'numero' && errorMsg) {
            setErrorMsg('');
            setIsSubmitDisabled(false);
        }
    };



    const handleNumeroBlur = async () => {
        if (formData.numero.trim() === '') {
            setErrorMsg('');
            setIsSubmitDisabled(false);
            setFormData({
                ...formData,
                nombre: ''
            });
            return;
        }
        const nombre = await getNombrebyNumero({ numero: formData.numero, token: jwt });

        if (nombre) {
            setFormData({
                ...formData,
                nombre
            });
            setErrorMsg('');
            setIsSubmitDisabled(false);
        } else {
            setFormData({
                ...formData,
                nombre: ''
            });
            setErrorMsg(`El Expediente con el número: ${formData.numero} no ha sido encontrado`);
            setIsSubmitDisabled(true);
        }
    };





    const openModal = () => {
        setFormData({
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
        setErrorMsg('');
    };

    const monitorJobProgress = async (jobId) => {
        try {
            let progress = 0;
            let result = null;
            let state = '';

            while (progress < 100) {
                const response = await getExpedienteJobStatus({ token: jwt, jobId });
                state = response.state;
                progress = response.progress
                setProgress(progress);
                if (state === 'completed') {
                    result = response.result;
                    return { success: true, result };
                } else if (state === 'failed') {
                    result = response.result;
                    return { success: false, error: "Something was wrong." };
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            return { success: false, error: 'Something was wrong.' };

        } catch (error) {
            return { success: false, error: error.message };
        }
    };


    const handleUpdateAllExpedientes = async (e) => {
        e.preventDefault();
        setIsLoadingUpdateAllExpedientes(true);
        setProgress(0);

        try {
            const { success, jobId } = await UpdateAllExpedientes(setOriginalExpedientes);

            if (success) {
                const { success: monitorSuccess, result } = await monitorJobProgress(jobId);

                if (monitorSuccess) {
                    if (result.expedientesConDetalles && result.expedientesConDetalles.length > 0) {
                    toast.info('Se le notificó por correo electrónico con el resultado del proceso.', {
                        icon: () => <img src={check} alt="Success Icon" />,
                        progressStyle: {
                            background: '#1D4ED8',
                        }
                    });
                    setExpedientes(result.expedientesConDetalles);
                } else {
                    toast.info('Se le notificó por correo electrónico con el resultado del proceso.', {
                        icon: () => <img src={check} alt="Success Icon" />,
                        progressStyle: {
                            background: '#1D4ED8',
                        }
                    });
                   window.location.reload()
                }
                
                  
                } else {
                    toast.info('Se le notificó por correo electrónico con el resultado del proceso.', {
                        icon: () => <img src={check} alt="Success Icon" />,
                        progressStyle: {
                            background: '#1D4ED8',
                        }
                    });
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo salió mal durante la actualización de los expedientes. Intenta nuevo');
        } finally {
            setIsLoadingUpdateAllExpedientes(false);
        }
    };




    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { numero, nombre, url } = formData;

        if (!nombre) {
            setIsLoading(false);
            return;
        }

        try {
            const { success, error } = await registerNewExpediente({ numero, nombre, url, setOriginalExpedientes });

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
                    toast.error('La URL proporcionada es incorrecta. Intente de nuevo.');
                }
                else if (error === 'Tribunal no funciono') {
                    toast.error('El Tribunal Virtual fallo al devolver los datos. Intente de nuevo.');
                }
                else {
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
        setUrlActive(false)
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.url) {
            toast.error('La URL no existe. Por favor, agrega una URL e intenta de nuevo.');
            setIsLoading(false);
            return;
        }

        try {
            const { success, error } = await updateExpediente({
                numero: formData.numero,
                nombre: formData.nombre,
                url: formData.url,
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
            setisModalOpenUpdate(false);
            setIsLoading(false);
        }
    };


    const openModalDelete = (expediente) => {
        setFormData({
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
                numero: formData.numero,
                setOriginalExpedientes
            });

            if (success) {
                toast.info('Se elimino correctamente el expediente', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });
            } else {
                if (error == "El expediente tiene tareas pendientes sin completar")
                toast.error(`No se puede eliminar el expediente, El expediente tiene tareas pendientes sin completar`);
                else {
                    toast.error(`Algo mal sucedió al eliminar el expediente`, error);
           
                }
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
            filteredExpedientes = expedientes.filter(expediente => expediente.nombre.toLowerCase().includes(lowercaseSearchTerm));
        } else if (searchType === 'Numero') {
            try {
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

        setExpedientes(filteredExpedientes);
        setisLoadingExpedientes(false)
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
            setExpedientes(originalExpedientes);
        }
    }

    const handleManualSearch = () => {
        if (search.trim() !== '') {
            searcherExpediente(search);
        }
    };






    if (loading || isLoadingExpedientes) return (
        <div className="flex items-center -mt-44 -ml-72 lg:-ml-44 xl:-ml-48 justify-center h-screen w-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );

    if (error) return <Error message={error.message} />;

    return (
        <div className="flex flex-col min-h-screen">

            <div className="relative">


                <Dropdown>
                    <DropdownTrigger>
                        <Button color='primary'
                            className='fixed right-16 lg:right-56 xl:right-56  mt-24 lg:mt-0 xl:mt-0 top-3/4 lg:top-24 xl:top-24 z-50'
                            isIconOnly
                            aria-label="Mas"

                        >
                            <img src={masicon} alt="Mas" className='w-4 h-4' />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem onClick={openModal} key="new">Crear Expediente</DropdownItem>
                        <DropdownItem onClick={handleUpdateAllExpedientes} key="copy">Actualizar Expedientes</DropdownItem>
                        <DropdownItem onClick={openModalUpload} key="copy">Subir Expedientes</DropdownItem>
                    </DropdownMenu>
                </Dropdown>


            </div>



            {isModalOpenUpload && (
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
                                    disabled={isLoading || isUpdating}
                                    className="text-black bg-transparent hover:bg-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={closeModalUpload}
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
                                        disabled={isUpdating || isLoading}
                                        className="relative mb-2 w-full h-auto flex items-center justify-center bg-gray-200 rounded-xl border-2 border-dashed border-black text-white"
                                        onClick={() => inputFileRef.current.click()}
                                    >
                                        <div className="flex flex-col items-center">
                                            {isLoading ? (
                                                  <div className="flex flex-col items-center">
                                                  <Spinner
                                                    className="text-center mt-6 mb-8 text-sm"
                                                    label={isUpdating ? `Actualizando Expedientes... ${progress}%` : `Subiendo Archivos...`}
                                                    color="primary"
                                                    size="lg"
                                                    labelColor="primary"
                                                  />
                                                  
                                                  {isUpdating && (
                                                    <h3 className="text-sm text-center font-semibold text-primary/80">
                                                      Se le notificará por correo electrónico cuando se complete el proceso.
                                                    </h3>
                                                  )}
                                                </div>
                                              
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
                                <div className="flex flex-col">
                                    <div className="flex">
                                        <input
                                            type="checkbox"
                                            id="acceptMessages"
                                            className="mr-2"
                                            checked={isCheckedUpdate}
                                            disabled={isUpdating}
                                            onChange={handleCheckboxUpdateChange} 
                                        />
                                        <label className='-mt-1' htmlFor="acceptMessages">
                                            Actualizar Expedientes
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 w-full">
                                    <button
                                        disabled={isLoading || !areFilesValid || isUpdating}
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


            {IsLoadingUpdateAllExpedientes && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 mx-auto mt-20 max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <Spinner className='text-center mt-16 mr-24 ml-24 mb-16 text-sm' label={`Actualizando Expedientes... ${progress}%`} color="primary" size='lg' labelColor="primary" />
                        <h3 className="text-sm text-center font-semibold text-primary/80">Se le notificará por correo electrónico cuando se complete el proceso.</h3>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 mx-auto mt-20 max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Crear Nuevo Expediente
                            </h3>
                            <button onClick={closeModal} disabled={isLoading} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                                        onBlur={handleNumeroBlur}
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
                                    {errorMsg && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errorMsg}
                                        </p>
                                    )}
                                </div>

                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="floating_nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:border-primary"
                                        placeholder=" "
                                        readOnly
                                    />
                                    <label htmlFor="floating_nombre" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre del expediente</label>
                                </div>
                            </div>
                            <div className="grid gap-4 mb-4 grid-cols-1">
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
                                    <label htmlFor="floating_url" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">URL del expediente ( Opcional )</label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitDisabled || isLoading}
                                className="w-full mt-4 rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                            >
                                {isLoading ? (
                                    <div role="status">
                                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5533C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7234 75.2124 7.55338C69.5422 4.38335 63.2754 2.51539 56.7663 2.05081C51.7668 1.68134 46.7392 2.05829 41.8592 3.16224C39.3322 3.76176 37.8618 6.25956 38.4989 8.68497C39.1359 11.1104 41.6143 12.5452 44.1373 11.9457C47.8203 11.0764 51.6026 10.8296 55.3196 11.2228C60.8785 11.7913 66.1942 13.543 70.9048 16.3926C75.6155 19.2423 79.6142 23.1216 82.6685 27.793C84.9175 31.0338 86.6015 34.6088 87.6735 38.3892C88.4295 40.7753 91.5423 41.6631 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Cargando...</span>
                                    </div>
                                ) : (
                                    "Crear Expediente"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {ismodalOpenUpdate && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 mx-auto mt-20 max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Actualizar Expediente
                            </h3>
                            <button onClick={closeModalUpdate} disabled={isLoading} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
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


                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="floating_nombre"
                                        value={formData.nombre}

                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer pointer-events-none"
                                        placeholder=" "
                                        required
                                        readOnly
                                    />
                                    <label
                                        htmlFor="floating_nombre"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Nombre
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
                                    readOnly={!urlActive || isLoading}
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


                            <div>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full mt-4 rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                                >
                                    {isLoading ? (
                                        <div role="status">
                                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="white" />
                                            </svg>
                                            <span className="sr-only">Actualizando...</span>
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


            <div id="popup-modal" tabIndex="-1" className={`${isModalOpenDelete ? '' : 'hidden'} fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`}>
                <div className="bg-white rounded-lg shadow w-full max-w-md">
                    <div className="p-4 md:p-5 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres eliminar este Expediente??</h3>
                        <button onClick={handleDelete} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                            {isDeleting ? <Spinner size='sm' color="default" /> : 'Si, estoy seguro'}
                        </button>
                        <button onClick={closeModalDelete} disabled={isDeleting} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
                    </div>
                </div>
            </div>



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
                        <p className="text-gray-400 text-sm mb-4 text-center">Crea un nuevo expediente para comenzar.</p>
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