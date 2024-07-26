import React from "react";
import { Card } from "flowbite-react";
import { Pagination } from "flowbite-react";

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

const Cards = ({ currentExpedientes, currentPage, totalPages, onPageChange, openModalTarea }) => {
    return (
        <div>
              <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
          
           
            <div className="mt-24 mb-4 flex justify-center items-center flex-wrap">
                {currentExpedientes.map((expediente, index) => (
                    <div key={index} className="w-full max-w-xs mb-20 m-4">
                        <Card className="bg-white text-black transform transition duration-500 ease-in-out hover:scale-105">
                            <div className="flex flex-col">
                                {/* Upper section */}
                                <div className="p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h5 className="text-sm font-bold leading-none text-black">
                                        Crédito #{expediente.num_credito}
                                    </h5>
                                    <a
                                    onClick={() => openModalTarea(expediente)}
                                    className="text-sm font-medium text-primary hover:underline dark:text-primary cursor-pointer"
                                >
                                    Nueva Tarea
                                </a>
                                </div>
                                    <p className="text-sm font-medium text-gray-700">
                                        <span className="font-bold">Ultima Etapa Aprobada:</span> {expediente.ultima_etapa_aprobada}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        <span className="font-bold">Fecha Etapa Aprobada:</span> {expediente.fecha_ultima_etapa_aprobada}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Secuencia Etapa Aprobada:</span> {expediente.secuencia_etapa_aprobada}
                                    </p>
                                </div>
                                <hr className="border-gray-300"/>
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
                                        <span className="font-bold">Secuencia Etapa Tv:</span> {expediente.secuencia_etapa_tv}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
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
        </div>
    );
};

export default Cards;
