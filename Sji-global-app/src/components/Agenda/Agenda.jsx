import React, { Fragment, useState, useContext, useEffect } from 'react';
import useAbogados from "../../hooks/abogados/useAbogados.jsx";
import { Spinner } from "@nextui-org/react";
import logo_admin from "../../assets/admin.jpg"
import logo_advisor from "../../assets/advisor.jpg"
import { toast } from 'react-toastify';
import check from "../../assets/check.png";
import Error from './Error.jsx';
const options = [
    { name: 'Selecciona el tipo de usuario:', value: '' },
    { name: 'Coordinador', value: 'coordinador' },
    { name: 'Abogado', value: 'abogado' },
];




const Agenda = () => {
    const { abogados, loading, error, deteleAbogado, updateAbogado, registerNewAbogado } = useAbogados();
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1200);
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

   

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    const openModal = (abogado) => {
        setSelectedAbogado(abogado);
        setShowModal(true);
    }


    const closeModal = () => {
        setSelectedAbogado(null);
        setShowModal(false);
    }


    if (loading) return (
        <div className="flex items-center -mt-44 -ml-72 lg:ml-44 xl:-ml-48 justify-center h-screen w-screen">
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
                            <h3 class="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres eliminar este Abogado??</h3>
                            <button  type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                                {isDeleting ? <Spinner size='sm' color="default" /> : 'Si, estoy seguro'}
                            </button>
                            <button  type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 ${isLargeScreen ? 'ml-60' : 'mr-20'}`} style={{ marginBottom: '15rem' }}>
                {abogados.map((abogados) => (
                    <div key={abogados.id} className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-6 transform transition duration-500 ease-in-out hover:scale-105 mb-8 ml-12 mr-12 w-full md:w-11/12">
                        <div className="flex flex-col items-center">
                            <img className="w-40 h-40 mb-3 rounded-full shadow-lg" src={abogados.user_type === 'coordinador' ? logo_admin : logo_advisor} alt="abogado image" />
                            <h5 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">{abogados.username}</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{abogados.user_type}</span>
                            <div className="flex mt-4 md:mt-6">
                                <button onClick={() => openModal(abogados)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Eliminar</button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Agenda;
