import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IoTrash } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import TablePagination from '@mui/material/TablePagination';
import copiaricon from "../../assets/copiaricon.png"
const TableExpedientes = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuToggle,
    isOpen,
    openMenuIndex,
    openModalUpdate,
    openModalDelete,
    menuDirection,
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
                                <span className='text-sm font-bold text-black'>Nombre</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Numero</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Url</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Expediente</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Juicio</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Ubicacion</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Juzgado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Partes</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Opciones</span>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentExpedientes.map((expediente, index) => (
                            <Row
                                key={expediente.numero}
                                currentExpedientes={currentExpedientes}
                                expediente={expediente}
                                index={index}
                                handleMenuToggle={handleMenuToggle}
                                isOpen={isOpen}
                                openMenuIndex={openMenuIndex}
                                openModalUpdate={openModalUpdate}
                                openModalDelete={openModalDelete}
                                menuDirection={menuDirection}

                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[200, 400, 600]}
                component="div"
                count={currentExpedientes.length}
                rowsPerPage={totalPages}
                page={currentPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
            />
        </div>
    );
}

const Row = ({
    currentExpedientes,
    expediente,
    index,
    handleMenuToggle,
    isOpen,
    openMenuIndex,
    openModalUpdate,
    openModalDelete,
    menuDirection,
}) => {
    const [open, setOpen] = React.useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 3000);
            })
            .catch(err => {
                console.error('Error al copiar al portapapeles: ', err);
            });
    };

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" className="max-w-xs truncate">
                    {expediente.nombre}
                </TableCell>
                <TableCell className="max-w-xs truncate">{expediente.numero}</TableCell>
                <TableCell align="center" component="th" scope="row" className="text-xs max-w-xs truncate flex items-start">
                    {expediente.url && (
                        <button
                            onClick={() => handleCopy(expediente.url)}
                            className="text-white pr-2 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            {copySuccess ? (
                                <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <img src={copiaricon} alt='copiar icon' className='w-4 h-4' />
                            )}
                        </button>
                    )}
                    {expediente.url}
                </TableCell>
                <TableCell className="max-w-xs truncate">{expediente.expediente}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.juicio}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.ubicacion}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.juzgado}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.partes}</TableCell>
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
                        <div className={`absolute right-0 bg-white py-2 w-48 border rounded-lg shadow-lg menu-options ${menuDirection}`} style={{ zIndex: 9999, bottom: menuDirection === 'up' ? (index === currentExpedientes.length - 1 ? '2cm' : index === currentExpedientes.length - 2 ? '4cm' : 'initial') : 'initial' }}>
                            <ul>
                                <li className="flex items-center">
                                    <GrUpdate className="inline-block ml-8 w-4 h-4" />
                                    <a onClick={() => openModalUpdate(expediente)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Actualizar Expediente</a>
                                </li>
                                <li className="flex items-center">
                                    <IoTrash className="inline-block ml-8 w-4 h-4" />
                                    <a onClick={() => openModalDelete(expediente)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Eliminar Expediente</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </TableCell>
            </TableRow>
            {expediente.detalles && expediente.detalles.length > 0 && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Detalles
                                </Typography>
                                <Table size="small" aria-label="details">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Etapa</TableCell>
                                            <TableCell>Termino</TableCell>
                                            <TableCell>Notificación</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {expediente.detalles.map((detalle, idx) => (
                                            detalle && (
                                                <TableRow key={idx}>
                                                    <TableCell className="text-xs">{detalle.fecha}</TableCell>
                                                    <TableCell className="text-xs">{detalle.etapa}</TableCell>
                                                    <TableCell className="text-xs">{detalle.termino}</TableCell>
                                                    <TableCell className="text-xs">{detalle.notificacion}</TableCell>
                                                </TableRow>
                                            )
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </Fragment>
    );
};

export default TableExpedientes;
