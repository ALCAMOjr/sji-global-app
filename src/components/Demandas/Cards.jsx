import React from "react";
import { Card } from "flowbite-react";
import { Pagination } from "flowbite-react";

/* const customTheme = {
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
}; */

const Cards = ({ currentDemandas, currentPage, totalPages, onPageChange }) => {
    return (
        <div>
            <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
               
                    <div className="w-full max-w-xs mb-20 m-4">
                        <Card className="bg-white text-black transform transition duration-500 ease-in-out hover:scale-105">
                            <div className="mb-4 flex items-center justify-between">
                                <h5 className="text-sm font-bold leading-none text-gray-900 dark:text-white">
                                    Crédito #
                                </h5>
                            </div>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <li className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-white">
                                                    <span className="text-black font-bold">Subtipo</span> 
                                                </p>
                                                <p className="text-sm font-medium text-gray-500 dark:text-white">
                                                    <span className="text-black font-bold">Acreditado:</span> 
                                                </p>
                                                <p className="truncate text-sm font-medium text-gray-500 dark:text-white">
                                                    <span className="text-black font-bold">Categoria:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Escritura:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Escritura Formateada:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Fecha:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Fecha Formateada:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Inscripcion:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Volumen:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Libro:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Seccion:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Unidad:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Fecha1:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Fecha1 Formateada:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Monto Otorgado:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Monto Otorgado Formateado:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Mes Primer Adeudo:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Mes Ultimo Adeudo:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Adeudo:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Adeudo Formateado:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Adeudo en Pesos:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Adeudo en Pesos Formateado:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Calle:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Número:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Fraccionamiento o Colonia:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Municipio:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold"> Estado:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Código Postal:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Interes Ordinario:</span>
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold"> Interes Moratorio</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Juzgado:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Hora Requerimiento:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Fecha Requerimiento:</span> 
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Fecha Requerimiento Formateado:</span> 
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                
            </div>
           {/*  <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 items-center flex-wrap flex overflow-x-auto justify-center">
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
            </div> */}
        </div>
    );
};

export default Cards;
