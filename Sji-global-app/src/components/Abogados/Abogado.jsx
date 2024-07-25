import React, { Fragment, useState, useContext, useEffect } from 'react';
import useAbogados from "../../hooks/abogados/useAbogados.jsx";
import { Spinner } from "@nextui-org/react";
import logo_admin from "../../assets/admin.jpg"
import logo_advisor from "../../assets/advisor.jpg"
import Error from "./Error.jsx";
import { toast } from 'react-toastify';
import check from "../../assets/check.png";
import { useMediaQuery } from 'react-responsive';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { RiChatNewLine } from "react-icons/ri";
import { Listbox, Transition } from '@headlessui/react'
import { FiEye, FiEyeOff } from 'react-icons/fi';

const options = [
    { name: 'Selecciona el tipo de usuario:', value: '' },
    { name: 'Coordinador', value: 'coordinador' },
    { name: 'Abogado', value: 'abogado' },
];




const Abogados = () => {
    const { abogados, loading, error, deteleAbogado, updateAbogado, registerNewAbogado } = useAbogados();
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1200);
    const [showModal, setShowModal] = useState(false);
    const [selectedAbogado, setSelectedAbogado] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [usertypeError, setusertypeError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        user_type: '',
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        telefono: ''

    });


    const handleChange = (e) => {
        let value = e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleTypeChange = (value) => {
        if (value !== '') {
            setusertypeError(null);
        }
        setFormData({
            ...formData,
            user_type: value
        });
    };


    const handleMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setIsTooltipVisible(false);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const { success, error } = await deteleAbogado(selectedAbogado.id);
            if (success) {
                toast.info('Se eliminó correctamente el abogado', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });
            } else {
                toast.error(`Algo mal sucedió al crear el abogado: ${error.message}`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al eliminar el abogado');
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };


    const openModal = (abogado) => {
        setSelectedAbogado(abogado);
        setShowModal(true);
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.user_type === '') {
            setusertypeError('Este campo es obligatorio');
            setIsLoading(false);
            return;
        } else {
            setusertypeError(null);
        }


        try {

            const { success, error } = await registerNewAbogado({
                username: formData.username,
                password: formData.password,
                userType: formData.user_type,
                nombre: formData.nombre,
                apellido: formData.apellido,
                cedula: formData.cedula,
                email: formData.email,
                telefono: formData.telefono

            });

            if (success) {
                toast.info('Se creó correctamente el abogado', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#1D4ED8',
                    }
                });

                setIsModalOpenCreate(false);
            } else {

                if (error === 'El nombre de usuario ya existe') {

                    toast.error('El nombre de usuario ya existe. Por favor, elige otro.');
                } else {
                    toast.error(`Algo mal sucedió al crear el abogado: ${error.message}`);

                }
                setIsModalOpenCreate(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al crear el abogado');
            setIsModalOpenCreate(false);
        }

        setIsLoading(false);
    };



    const openModalCreate = () => {
        setFormData({
            id: '',
            username: '',
            password: '',
            user_type: '',
            nombre: '',
            apellido: '',
            cedula: '',
            email: '',
            telefono: ''

        });
        setIsModalOpenCreate(true)
        setIsTooltipVisible(false);
    }


    const closeModalCreate = () => {
        setIsModalOpenCreate(false)
    }
    const closeModal = () => {
        setSelectedAbogado(null);
        setShowModal(false);
    }


    if (loading) return (
        <div className="flex items-center -mt-44 -ml-60 lg:ml-44 xl:-ml-48 justify-center h-screen w-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );


    if (error) return <Error message={error.message} />;

    return (
        <div>
            {!showModal && !isModalOpenCreate && (
                <div className="fixed right-1/4 top-24 z-50">
                    <div className="relative">
                        <button
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            type="button"
                            onClick={openModalCreate}
                            className="text-white bg-primary hover:bg-primary/80 focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary dark:hover:bg-primary focus:outline-none dark:focus:ring-primary"
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
                                Nuevo Abogado
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isModalOpenCreate && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 mx-auto mt-20 max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Crear Nuevo Abogado
                            </h3>
                            <button onClick={closeModalCreate} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                                        name="username"
                                        id="floating_username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_username"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Usuario
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="floating_password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_password"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Contraseña
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleShowPassword}
                                        className="absolute right-0 top-0 mt-3 mr-3"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
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
                                    <label htmlFor="floating_nombre" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
                                </div>
                            </div>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="apellido"
                                        id="floating_apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="floating_apellido" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Apellido</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="cedula"
                                        id="floating_cedula"
                                        value={formData.cedula}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="floating_cedula" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cédula</label>
                                </div>
                            </div>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="email"
                                        name="email"
                                        id="floating_email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="floating_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo Electrónico</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="telefono"
                                        id="floating_telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="floating_telefono" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Teléfono</label>
                                </div>
                            </div>
                            <div className="relative z-20 mb-8">
                                <Listbox value={formData.user_type} onChange={handleTypeChange}>
                                    <Listbox.Button className="relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-[10px] text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-black dark:border-dark-3">
                                        <span className={`block truncate ${usertypeError ? 'text-red-500' : ''}`}>
                                            {usertypeError || formData.user_type || 'Selecciona el tipo de usuario'}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            {options.map((type, typeIdx) => (
                                                <Listbox.Option
                                                    key={typeIdx}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'text-white bg-primary' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={type.value}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                    }`}
                                                            >
                                                                {type.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                                    <CheckIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                                                </span>
                                                            ) : null}

                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </Listbox>
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



            {showModal && (
                <div id="popup-modal" tabindex="-1" class={`'hidden' fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`}>
                    <div class="bg-white rounded-lg shadow w-full max-w-md">
                        <div class="p-4 md:p-5 text-center">
                            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres eliminar este Abogado??</h3>
                            <button onClick={handleDelete} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                                {isDeleting ? <Spinner size='sm' color="default" /> : 'Si, estoy seguro'}
                            </button>
                            <button onClick={closeModal} type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
                        </div>
                    </div>
                </div>
            )}


<div className="mt-24 mb-4 -ml-44 mr-20 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0  flex justify-center items-center flex-wrap">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full justify-center items-center">
    {abogados.map((abogado) => (
      <div key={abogado.id} className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-6 transform transition duration-500 ease-in-out hover:scale-105 mb-8 mx-auto w-full md:w-11/12">
        <div className="flex flex-col items-center">
          <img className="w-40 h-40 mb-3 rounded-full shadow-lg" src={abogado.user_type === 'coordinador' ? logo_admin : logo_advisor} alt="abogado image" />
          <h5 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">{abogado.username}</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">{abogado.user_type}</span>
          <div className="flex mt-4 md:mt-6">
            <button onClick={() => openModal(abogado)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
</div>

    );
}

export default Abogados;
