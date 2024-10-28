import React, { useEffect, Fragment, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IoTrash } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";

import TablePagination from '@mui/material/TablePagination';

const TableDemanda = ({
    currentDemandas,
    demandas,
    itemsPerPage,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuToggle,
    isOpen,
    openMenuIndex,
    openModalUpdate,
    openModalDelete,
    setOpenMenuIndex,
    setIsOpen
}) => {

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
        <div>

            <TableContainer component={Paper} className='justify-center flex relative min-w-max items-center mt-20'>
                <Table aria-label="collapsible table">
                    <TableHead className='bg-gray-100'>
                        <TableRow>
                            <TableCell />
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Opciones</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Crédito</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Subtipo</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Acreditado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Categoria</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Escritura</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Escritura Formateada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha Escritura</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha Escritura Formateada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Inscripcion</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Volumen</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Libro</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Seccion</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Unidad</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Numero (SS)</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Folio</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha Formateada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Monto Otorgado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>MOnto Otorgado Formatedo</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Mes Primer Adeudo</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Mes Ultimo Adeudo</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Adeudo</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Adeudo Formateado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Adeudo en Pesos</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Adeudo en Pesos Formateado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Calle</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Número</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fraccionamiento o Colonia</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Municipio</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Estado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Código Postal</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Interes Ordinario</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Interes Moratorio</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Juzgado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Hora Requerida</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha Requerimiento</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha Requerimiento Formateada</span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentDemandas.map((demanda, index) => (
                            <Row
                                key={demanda.credito}
                                currenDemandas={currentDemandas}
                                demanda={demanda}
                                index={index}
                                handleMenuToggle={handleMenuToggle}
                                isOpen={isOpen}
                                openMenuIndex={openMenuIndex}
                                openModalUpdate={openModalUpdate}
                                openModalDelete={openModalDelete}



                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[200, 400, 600]}
                component="div"
                count={demandas.length}
                rowsPerPage={itemsPerPage}
                page={currentPage - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
                slotProps={{
                    actions: {
                        previousButton: {
                            disabled: currentPage === 1,
                        },
                        nextButton: {
                            disabled: currentPage >= totalPages,
                        },
                    },
                }}
            />
        </div>

    );
}

const Row = ({
    currenDemandas,
    demanda,
    handleMenuToggle,
    index,
    isOpen,
    openMenuIndex,
    openModalUpdate,
    openModalDelete,
}) => {

    const isMenuOpen = isOpen[index] !== undefined ? isOpen[index] : false;

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell></TableCell>
                <TableCell>
                    <button id="menu-button" onClick={() => handleMenuToggle(index)} className={`relative group p-2 ${isMenuOpen ? 'open' : ''}`}>
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
                        <div className={`absolute left-24 bg-white py-2 w-48 border rounded-lg shadow-lg menu-options`} style={{
                            zIndex: 9999,
                            marginTop: index === 0 || index === currenDemandas.length - 1 ? -120 : 0,
                            marginRight: index === 0 || index === currenDemandas.length - 1 ? 90 : 0,
                        }}>
                            <ul>
                                <li className="flex items-center">
                                    <GrUpdate className="inline-block ml-8 w-4 h-4" />
                                    <a onClick={() => openModalUpdate(demanda)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Actualizar Demanda</a>
                                </li>
                                <li className="flex items-center">
                                    <IoTrash className="inline-block ml-8 w-4 h-4" />
                                    <a onClick={() => openModalDelete(demanda)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Eliminar Demanda</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </TableCell>
                <TableCell className="max-w-xs truncate">{demanda.credito}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.subtipo}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.acreditado}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.categoria}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.escritura}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.escritura_ft}</TableCell>
                <TableCell className="max-w-xs truncate">
                    {new Date(demanda.fecha_escritura).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </TableCell>

                <TableCell className="max-w-xs truncate">{demanda.fecha_escritura_ft}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.inscripcion}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.volumen}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.libro}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.seccion}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.unidad}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.numero_ss}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.folio}</TableCell>
                <TableCell className="max-w-xs truncate">
                    {new Date(demanda.fecha).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </TableCell>

                <TableCell className="max-w-xs truncate">{demanda.fecha_ft}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.monto_otorgado}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.monto_otorgado_ft}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.mes_primer_adeudo}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.mes_ultimo_adeudo}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.adeudo}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.adeudo_ft}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.adeudo_pesos}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.adeudo_pesos_ft}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.calle}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.numero}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.colonia_fraccionamiento}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.municipio}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.estado}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.codigo_postal}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.interes_ordinario}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.interes_moratorio}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.juzgado}</TableCell>
                <TableCell className="max-w-xs truncate">{demanda.hora_requerimiento}</TableCell>
                <TableCell className="max-w-xs truncate">
                    {new Date(demanda.fecha_requerimiento).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </TableCell>
                <TableCell className="max-w-xs truncate">{demanda.fecha_requerimiento_ft}</TableCell>
            </TableRow>
        </Fragment>
    );
};

export default TableDemanda;
