import React, { useEffect, useState, useContext } from "react";
import { Card } from "flowbite-react";
import { Pagination } from "flowbite-react";
import HasTarea from '../../views/tareas/HasTarea';
import Context from '../../context/abogados.context';
import igualicon from "../../assets/igual.png";
import sprinticon from "../../assets/sprint.png";

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
const colorMapping = {
    '01': '#F5F5F5', // Asignación
    '02': '#D3D3D3', // Convenios previos a demanda
    '03': '#FFFFE0', // Demanda sin emplazamiento
    '04': '#FFA07A', // Emplazamiento sin sentencia
    '06': '#D8BFD8', // Convenio Judicial
    '07': '#FFA07A', // Juicio con sentencia
    '08': '#FFB6C1', // Proceso de ejecución
    '09': '#FFD700', // Adjudicación
    '10': '#87CEEB', // Escrituración en proceso
    '15': '#90EE90', // Autoseguros
    '16': '#20B2AA', // Liquidación
    '17': '#AFEEEE', // Entrega por Poder Notarial
    '18': '#778899'  // Irrecuperabilidad
};

const Cards = ({ currentExpedientes, currentPage, totalPages, onPageChange, openModalTarea }) => {
    const { jwt } = useContext(Context);
    const [tasksStatus, setTasksStatus] = useState({});

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

    return (
        <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
            <div className="mt-24 mb-4 flex justify-center items-center flex-wrap">
                {currentExpedientes.map((expediente, index) => {

                    const isEqual = expediente.macroetapa && expediente.macroetapa_aprobada === expediente.macroetapa;
                    const color = getBackgroundColor(expediente.macroetapa_aprobada);

                    return (
                        <div key={index} className="w-full max-w-xs mb-20 m-4">
                            <Card className={`bg-white text-black transform transition duration-500 ease-in-out hover:scale-105`}>
                                <div className="flex flex-col">
                                    {/* Upper section */}
                                    <div className="p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h5 className="text-sm font-bold leading-none text-black">
                                                Crédito #{expediente.num_credito}
                                            </h5>
                                            {tasksStatus[expediente.num_credito] ? (
                                                <button
                                                    type="button"
                                                    className="text-gray-500 cursor-not-allowed font-medium rounded-full text-xs px-5 py-2.5 text-center"
                                                    disabled
                                                >
                                                    Ya Asignada
                                                </button>
                                            ) : (
                                                <a
                                                    onClick={() => openModalTarea(expediente)}
                                                    className="text-sm font-medium text-primary hover:underline dark:text-primary cursor-pointer"
                                                >
                                                    Nueva Tarea
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">
                                            <span className="font-bold">MacroEtapa</span> {expediente.macroetapa_aprobada}
                                        </p>
                                        <p className="text-sm font-medium text-gray-700">
                                            <span className="font-bold">Ultima Etapa Aprobada:</span> {expediente.ultima_etapa_aprobada}
                                        </p>
                                        <p className="text-sm font-medium text-gray-700">
                                            <span className="font-bold">Fecha Etapa Aprobada:</span>
                                            {new Date(expediente.fecha_ultima_etapa_aprobada).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <hr className="border-gray-300" />
                                    {/* Lower section */}
                                    <div className="p-4">
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
                                        {/* Sprint Icons */}
                                        <div>
                                            <span className="text-xs"> <span className="text-sm text-gray-700 font-bold">Sprints:</span>
                                                {expediente.macroetapa ? (
                                                    isEqual ? (
                                                        <img src={igualicon} alt="Igual" className="w-6 h-6" />
                                                    ) : (
                                                        <img src={sprinticon} alt="Sprint" className="w-6 h-6" />
                                                    )
                                                ) : null}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">MacroEtapa:</span> {expediente.macroetapa}
                                        </p>

                                        <p className="text-sm text-gray-700 flex items-center">
                                            <span className="font-bold">Color MacroEtapa:</span>
                                            <span
                                                className={`inline-block ml-2 w-3 h-3 rounded-full ${color}`}
                                            />

                                        </p>


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
        </div>
    );
};

export default Cards;