import React, { useEffect } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { IoTrash } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import { Pagination } from "flowbite-react";


const TableComponent = ({ currentExpedientes, currentPage, totalPages, onPageChange, handleMenuToggle, isOpen, openMenuIndex, openModalUpdate, openModalDelete, menuDirection, setOpenMenuIndex, setIsOpen }) => {

    console.log(currentExpedientes)
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
    }, [openMenuIndex]);

    const handleMenuClose = () => {
        setOpenMenuIndex(null);
        setIsOpen([]);
    };

    return (
        <div class="overflow-x-auto">
            <div className="flex-grow relative pl-64 mt-16 mb-80">
                <Table hoverable className="relative min-w-max ml-auto">

                    <TableHead>
                        <TableHeadCell className="p-4">
                            <Checkbox color="blue" />
                        </TableHeadCell>
                        <TableHeadCell>Nombre</TableHeadCell>
                        <TableHeadCell>Numero</TableHeadCell>
                        <TableHeadCell>URL</TableHeadCell>
                        <TableHeadCell>Expediente</TableHeadCell>

                        <TableHeadCell>
                            <span className="sr-only">Acciones</span>
                        </TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {currentExpedientes.map((expediente, index) => (
                            <TableRow key={expediente.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox color="blue" />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-sm text-gray-900 dark:text-white">
                                    {expediente.nombre}
                                </TableCell>
                                <TableCell>{expediente.numero}</TableCell>

                                <TableCell>{expediente.url}</TableCell>

                                <TableCell>{expediente.expediente}</TableCell>
                                <TableCell>
                                    <button id="menu-button" onClick={() => handleMenuToggle(index)} className={`relative group p-2 ${isOpen[index] ? 'open' : ''}`}>
                                        <div className={`relative flex overflow-hidden items-center justify-center rounded-full w-[32px] h-[32px] transform transition-all bg-white ring-0 ring-gray-300 hover:ring-8  ${isOpen[index] ? 'ring-4' : ''} ring-opacity-30 duration-200 shadow-md`}>
                                            <div className="flex flex-col justify-between w-[12px] h-[12px] transform transition-all duration-300 origin-center overflow-hidden">
                                                <div className={`bg-primary h-[1px] w-3 transform transition-all duration-300 origin-left ${isOpen[index] ? 'translate-x-6' : ''}`}></div>
                                                <div className={`bg-primary h-[1px] w-3 rounded transform transition-all duration-300 ${isOpen[index] ? 'translate-x-6' : ''} delay-75`}></div>
                                                <div className={`bg-primary h-[1px] w-3 transform transition-all duration-300 origin-left ${isOpen[index] ? 'translate-x-6' : ''} delay-150`}></div>
                                                <div className={`absolute items-center justify-between transform transition-all duration-500 top-1 -translate-x-6 ${isOpen[index] ? 'translate-x-0' : ''} flex w-0 ${isOpen[index] ? 'w-8' : ''}`}>
                                                    <div className={`absolute bg-primary h-[1px] w-3 transform transition-all duration-500 rotate-0 delay-300 ${isOpen[index] ? 'rotate-45' : ''}`}></div>
                                                    <div className={`absolute bg-primary h-[1px] w-3 transform transition-all duration-500 -rotate-0 delay-300 ${isOpen[index] ? '-rotate-45' : ''}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    {openMenuIndex === index && (
                                        <div className={`absolute right-0 bg-white mt-1 py-2 w-48 border rounded-lg shadow-lg menu-options ${menuDirection}`} style={{ zIndex: 9999, bottom: menuDirection === 'up' ? (index === currentExpedientes.length - 1 ? '2cm' : index === currentExpedientes.length - 2 ? '4cm' : 'initial') : 'initial' }}>
                                            <ul>
                                                <li className="flex items-center">
                                                    <GrUpdate className="inline-block ml-8" />
                                                    <a onClick={() => openModalUpdate(expediente)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Actualizar Expediente</a>
                                                </li>
                                                <li className="flex items-center">
                                                    <IoTrash className="inline-block ml-8" />
                                                    <a onClick={() => openModalDelete(expediente)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Eliminar Expediente</a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

        </div>

    );
};

export default TableComponent;
