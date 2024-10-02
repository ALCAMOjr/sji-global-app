import React, { useEffect, useState, useContext } from "react";
import { Card } from "flowbite-react";
import { Pagination } from "flowbite-react";
import HasTarea from '../../views/tareas/HasTarea';
import Context from '../../context/abogados.context';
import flecha_derecha from "../../assets/flecha_derecha.png";
import flecha_izquierda from "../../assets/flecha_izquierda.png";
import { Spinner } from "@nextui-org/react"
import { RxHamburgerMenu } from "react-icons/rx";

const customTheme = {
    pagination: {
        base: "flex overflow-x-auto justify-center",
        layout: {
            table: {
                base: "text-sm text-gray-700 dark:text-gray-400",
                span: "font-semibold text-gray-900 dark:text-white"
            }
        },
        pages: {
            base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
            showIcon: "inline-flex",
            previous: {
                base: "ml-0 rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                icon: "h-5 w-5"
            },
            next: {
                base: "rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                icon: "h-5 w-5"
            },
            selector: {
                base: "w-12 border border-gray-300 bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                active: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
                disabled: "cursor-not-allowed opacity-50"
            }
        }
    }
};

const Cards = ({ currentExpedientes, currentPage, totalPages, onPageChange, openModalTarea, handleDownload, handleUpdate, setOpenMenuIndex, setIsOpen, openMenuIndex, isOpen, handleMenuToggle, isLoading }) => {
    const { jwt } = useContext(Context);
    const [tasksStatus, setTasksStatus] = useState({});
    const [showModalDetails, setShowModalDetails] = useState(false);
    const [selectedExpedienteDetails, setSelectedExpedienteDetails] = useState(null);
    const [UpgradeLoading, setUpgradeLoading] = useState({});
    const [downloadingDetails, setDownloadingDetails] = useState({});



    const handleDownloadLoading = async (url, fecha, id) => {
        setDownloadingDetails(prevState => {
            const newState = { ...prevState };
            Object.keys(newState).forEach(key => {
                newState[key] = true;
            });
            newState[id] = true;
            return newState;
        });

        await handleDownload(url, fecha);
        setDownloadingDetails(prevState => {
            const newState = { ...prevState };
            Object.keys(newState).forEach(key => {
                newState[key] = false;
            });
            return newState;
        });
    };

    const handleUpgradeLoading = async (numero, nombre, url, id) => {
        setUpgradeLoading(prevState => ({ ...prevState, [id]: true }));
        await handleUpdate(numero, nombre, url);
        setUpgradeLoading(prevState => ({ ...prevState, [id]: false }));
    };


    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (openMenuIndex !== null && !event.target.closest("#menu-button") && !event.target.closest(".menu-options")) {
                handleMenuClose();
            }
        };

        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [openMenuIndex, isOpen]);

    const handleMenuClose = () => {
        setOpenMenuIndex(null);
        setIsOpen([]);
    };

    const CloseModalDetails = () => {
        setShowModalDetails(false);
        setSelectedExpedienteDetails(null);
    };

    const OpenModalDetails = (expediente) => {
        setSelectedExpedienteDetails(expediente);
        setShowModalDetails(true);
    };

    useEffect(() => {
        const fetchTaskStatuses = async () => {
            const statuses = await Promise.all(currentExpedientes.map(async (expediente) => {
                try {
                    const response = await HasTarea({ numero: expediente.num_credito, token: jwt });
                    return { [expediente.num_credito]: response.hasTasks };
                } catch (error) {
                    console.error('Error fetching tarea status', error);
                    return { [expediente.num_credito]: false };
                }
            }));
            setTasksStatus(Object.assign({}, ...statuses));
        };

        fetchTaskStatuses();
    }, [currentExpedientes, jwt]);

    const getSprintIcon = (notificacion) => {
        if (!notificacion) return null;

        switch (notificacion) {
            case 'NO NOTIFICADA/TERMINADA':
            case 'SOLICITADA':
                return <img src={flecha_derecha} alt="Derecha" />;
            case 'NOTIFICADA/TERMINADA':
                return <img src={flecha_izquierda} alt="Izquierda" />;
            default:
                return null;
        }
    };

    const getBackgroundColor = (macroetapa) => {
        switch (macroetapa) {
            case '01. Asignación':
                return 'bg-[#F5F5F5]'; // Blanco suave
            case '02. Convenios previos a demanda':
                return 'bg-[#D3D3D3]'; // Gris Claro
            case '03. Demanda sin emplazamiento':
                return 'bg-[#FFDEAD]'; // Amarillo Claro
            case '04. Emplazamiento sin sentencia':
                return 'bg-[#FFA07A]'; // Naranja Claro
            case '06. Convenio Judicial':
                return 'bg-[#D8BFD8]'; // Morado Claro
            case '07. Juicio con sentencia':
                return 'bg-[#FFA07A]'; // Rojo Claro
            case '08. Proceso de ejecución':
                return 'bg-[#FFB6C1]'; // Rosa Claro
            case '09. Adjudicación':
                return 'bg-[#FFD700]'; // Dorado Claro
            case '10. Escrituración en proceso':
                return 'bg-[#87CEEB]'; // Azul Claro
            case '15. Autoseguros':
                return 'bg-[#90EE90]'; // Verde Claro
            case '16. Liquidación':
                return 'bg-[#20B2AA]'; // Aqua Claro
            case '17. Entrega por Poder Notarial':
                return 'bg-[#AFEEEE]'; // Turquesa Claro
            case '18. Irrecuperabilidad':
                return 'bg-[#778899]'; // Gris Azul Claro
            default:
                return 'bg-white'; // Por defecto blanco
        }
    };

    const parseDate = (dateStr) => {
        if (!dateStr) {
            return;
        }

        const monthMap = {
            'ene.': '01',
            'feb.': '02',
            'mar.': '03',
            'abr.': '04',
            'may.': '05',
            'jun.': '06',
            'jul.': '07',
            'ago.': '08',
            'sep.': '09',
            'oct.': '10',
            'nov.': '11',
            'dic.': '12'
        };

        const [day, month, year] = dateStr.split('/');
        const monthNum = monthMap[month.toLowerCase()] || '01';
        return new Date(`${year}-${monthNum}-${day}`);
    };

    const calculateDaysDifference = (dateStr) => {
        const date = parseDate(dateStr);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
            <div className="mt-24 mb-4 flex justify-center items-center flex-wrap">
                {currentExpedientes.map((expediente, index) => {


                    const color = getBackgroundColor(expediente.macroetapa_aprobada);
                    const sprintIcon = getSprintIcon(expediente.notificacion);
                    const daysDifference = expediente.fecha ? calculateDaysDifference(expediente.fecha) : '';

                    const daysDisplay = daysDifference > 30 ? daysDifference : '';
                    return (
                        <div key={index} className="w-full max-w-xs mb-20 m-4">
                            <Card className={`bg-white text-black transform transition duration-500 ease-in-out hover:scale-105`}>
                                <div className="flex flex-col">
                                    <div className="p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            {UpgradeLoading[expediente.num_credito] ? (
                                                <Spinner size="sm" color="primary" />
                                            ) : (
                                                <button
                                                    id="menu-button"
                                                    onClick={() => handleMenuToggle(index)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                                                >
                                                    <RxHamburgerMenu />
                                                </button>
                                            )}
                                            <h5 className="text-sm font-bold ml-4 leading-none text-black">
                                                Crédito #{expediente.num_credito}
                                            </h5>
                                            {openMenuIndex === index && (
                                                <div className="absolute right-13 bg-white mt-24 py-2 w-48 border rounded-lg shadow-lg">
                                                    <ul>
                                                        <li className="flex items-center">
                                                            <a
                                                                disabled={Object.values(UpgradeLoading).some(isLoading => isLoading) || showModalDetails}

                                                                onClick={() => {
                                                                    if (!Object.values(UpgradeLoading).some(isLoading => isLoading) && !showModalDetails) {
                                                                        OpenModalDetails(expediente);
                                                                    }
                                                                }}
                                                                className="block text-sm mb-1 font-medium text-black hover:underline dark:text-black cursor-pointer"
                                                            >
                                                                Ver Detalles
                                                            </a>
                                                        </li>

                                                        <li className="flex items-center">
                                                            <a
                                                                disabled={Object.values(UpgradeLoading).some(isLoading => isLoading) || showModalDetails}
                                                                onClick={() => {
                                                                    if (!Object.values(UpgradeLoading).some(isLoading => isLoading) && !showModalDetails) {
                                                                        handleUpgradeLoading(expediente.num_credito, expediente.nombre, expediente.url, expediente.num_credito);
                                                                    }
                                                                }}        className="block text-sm mb-2 font-medium text-primary hover:underline dark:text-primary cursor-pointer"
                                                            >
                                                                Actualizar Expediente
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                            {tasksStatus[expediente.num_credito] ? (
                                                <button
                                                    type="button"
                                                    className="text-gray-500 cursor-not-allowed font-medium rounded-full text-xs px-5 py-2.5 text-center"

                                                >
                                                    Ya Asignada
                                                </button>
                                            ) : (
                                                <a
                                                    disabled={Object.values(UpgradeLoading).some(isLoading => isLoading) && showModalDetails}
                                                    onClick={() => {
                                                        if (!Object.values(UpgradeLoading).some(isLoading => isLoading) && !showModalDetails) {
                                                            openModalTarea(expediente);
                                                        }
                                                    }}
                                                    className={`text-sm font-medium text-primary hover:underline dark:text-primary ${Object.values(UpgradeLoading).some(isLoading => isLoading) || showModalDetails ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}        >
                                                    Asignar Exp
                                                </a>

                                            )}

                                        </div>
                                        <p className="text-sm font-medium text-gray-700">
                                            <span className="font-bold">MacroEtapa</span> {expediente.macroetapa_aprobada}
                                        </p>
                                        <p className="text-sm font-medium text-gray-700">
                                            <span className="font-bold">Ultima E A:</span> {expediente.ultima_etapa_aprobada}
                                        </p>
                                        <p className="text-sm font-medium text-gray-700">
                                            <span className="font-bold">Fecha:</span>
                                            {new Date(expediente.fecha_ultima_etapa_aprobada).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">Est:</span> {expediente.fecha}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">D:</span> {expediente.fecha}
                                        </p>
                                    </div>
                                    <hr className="border-gray-300" />
                                    <div className="p-4">
                                    <p className="text-sm text-gray-700">
                                            <span className="font-bold">Exp:</span> {expediente.fecha}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">Juzg:</span> {expediente.fecha}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">Fecha:</span> {expediente.fecha}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">Etapa:</span> {expediente.etapa}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">Termino:</span> {expediente.termino}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">Notificación:</span> {expediente.notificacion}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">Dias:</span> {daysDisplay}
                                        </p>
                                        <p className="text-sm text-gray-700 flex items-center">
                                            <span className="font-bold">Color MacroEtapa:</span>
                                            <span
                                                className={`inline-block ml-2 w-3 h-3 rounded-full ${color}`}
                                            />

                                        </p>
                                        <div>
                                            <span className="text-xs"> <span className="text-sm text-gray-700 font-bold">Sprints:</span>
                                                {sprintIcon && <span className="text-xs">{sprintIcon}</span>}
                                            </span>
                                        </div>

                                    </div>

                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>
            <div className="mt-24 mb-4 items-center flex-wrap flex overflow-x-auto justify-center">
                <Pagination
                    theme={customTheme.pagination}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    previousLabel="Anterior"
                    nextLabel="Siguiente"
                    labelRowsPerPage="Filas por página:"
                    showIcons
                />
            </div>

            {showModalDetails && selectedExpedienteDetails && (
                <div id="timeline-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="relative p-4 w-full max-w-4xl">
                        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Detalles del Expediente #{selectedExpedienteDetails.numero}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => CloseModalDetails()}
                                    className={`text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white ${Object.values(downloadingDetails).some(isDownloading => isDownloading) ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={Object.values(downloadingDetails).some(isDownloading => isDownloading)}
                                    data-modal-toggle="timeline-modal"
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>

                            </div>
                            <div className="p-4 md:p-5">
                                <div className="overflow-x-auto">
                                    <div className="max-h-96 overflow-y-auto">
                                        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-600 sticky top-0">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">Descarga</th>
                                                    <th scope="col" className="px-6 py-3">Fecha</th>
                                                    <th scope="col" className="px-6 py-3">Etapa</th>
                                                    <th scope="col" className="px-6 py-3">Término</th>
                                                    <th scope="col" className="px-6 py-3">Notificación</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedExpedienteDetails.detalles.length > 1 ? (
                                                    selectedExpedienteDetails.detalles.map((detalle, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    disabled={Object.values(downloadingDetails).some(isDownloading => isDownloading)}
                                                                    onClick={() => handleDownloadLoading(selectedExpedienteDetails.url, detalle.fecha, detalle.id)}
                                                                    type="button"
                                                                    className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                                                                >
                                                                    {downloadingDetails[detalle.id] ? <Spinner size="sm" color="default" /> : 'PDF'}
                                                                </button>

                                                            </td>
                                                            <td className="px-6 py-4">{detalle.fecha}</td>
                                                            <td className="px-6 py-4">{detalle.etapa}</td>
                                                            <td className="px-6 py-4">{detalle.termino}</td>
                                                            <td className="px-6 py-4 truncate">{detalle.notificacion}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} align="center">No hay detalles disponibles</td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cards;