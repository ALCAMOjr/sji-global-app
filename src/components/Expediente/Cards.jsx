import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { IoTrash } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import { RxHamburgerMenu } from "react-icons/rx";
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

const Cards = ({ currentExpedientes, handleMenuToggle, isOpen, openMenuIndex, openModalUpdate, openModalDelete, setOpenMenuIndex, setIsOpen, currentPage, totalPages, onPageChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedExpediente, setSelectedExpediente] = useState(null);

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

    const CloseModal = () => {
        setShowModal(false);
        setSelectedExpediente(null);
    };

    const OpenModal = (expediente) => {
        setSelectedExpediente(expediente);
        setShowModal(true);
    };

    return (
        <div>
            <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
                {currentExpedientes.map((expediente, index) => (
                    <div key={index} className="w-full max-w-xs mb-20 m-4">
                        <Card className="bg-white text-black transform transition duration-500 ease-in-out hover:scale-105">
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    id="menu-button"
                                    onClick={() => handleMenuToggle(index)}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                                >
                                    <RxHamburgerMenu />
                                </button>
                                <h5 className="text-sm ml-4 font-bold leading-none text-gray-900 dark:text-white">
                                    Crédito #{expediente.numero}
                                </h5>
                                <a
                                    onClick={() => OpenModal(expediente)}
                                    className="text-sm font-medium text-primary hover:underline dark:text-primary cursor-pointer"
                                >
                                    Ver detalles
                                </a>
                            </div>
                            {openMenuIndex === index && (
                                <div className="absolute right-13 bg-white mt-1 py-2 w-48 border rounded-lg shadow-lg">
                                    <ul>
                                        <li className="flex items-center">
                                            <GrUpdate className="inline-block ml-2" />
                                            <a
                                                onClick={() => openModalUpdate(expediente)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                role="menuitem"
                                            >
                                                Actualizar expediente
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <IoTrash className="inline-block ml-2" />
                                            <a
                                                onClick={() => openModalDelete(expediente)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                role="menuitem"
                                            >
                                                Eliminar expediente
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <li className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-white">
                                                    <span className="text-black font-bold">Nombre:</span> {expediente.nombre}
                                                </p>
                                                <p className="truncate text-sm font-medium text-gray-500 dark:text-white">
                                                    <span className="text-black font-bold">URL:</span> {expediente.url}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Expediente:</span> {expediente.expediente}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Juzgado:</span> {expediente.juzgado}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Juicio:</span> {expediente.juicio}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Ubicación:</span> {expediente.ubicacion}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="text-black font-bold">Partes:</span> {expediente.partes}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 items-center flex-wrap flex overflow-x-auto justify-center">
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
            {showModal && selectedExpediente && (
    <div id="timeline-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="relative p-4 w-full max-w-4xl">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Detalles del Crédito #{selectedExpediente.numero}
                    </h3>
                    <button type="button" onClick={() => CloseModal()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="timeline-modal">
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
                                        <th scope="col" className="px-6 py-3">Fecha</th>
                                        <th scope="col" className="px-6 py-3">Etapa</th>
                                        <th scope="col" className="px-6 py-3">Término</th>
                                        <th scope="col" className="px-6 py-3">Notificación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedExpediente.detalles.length > 1 ? (
                                        selectedExpediente.detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{detalle.fecha}</td>
                                                <td className="px-6 py-4">{detalle.etapa}</td>
                                                <td className="px-6 py-4">{detalle.termino}</td>
                                                <td className="px-6 py-4 truncate">{detalle.notificacion}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} align="center">No hay detalles disponibles</td>
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
