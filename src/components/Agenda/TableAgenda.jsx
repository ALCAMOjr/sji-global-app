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
import TablePagination from '@mui/material/TablePagination';
import copiaricon from "../../assets/copiaricon.png";

const TableAgenda = ({
    currentExpedientes,
    expedientes,
    itemsPerPage,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    openModal,
    openModalDelete
}) => {
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentExpedientes.map((expediente, index) => (
                            <Row
                                key={expediente.numero}
                                currentExpedientes={currentExpedientes}
                                expediente={expediente}
                                index={index}
                                openModal={openModal}
                                openModalDelete={openModalDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[200, 400, 600]}
                component="div"
                count={expedientes.length}  
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

const Row = ({ expediente, openModal, openModalDelete }) => {
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
            </TableRow>
            {expediente.tareas && expediente.tareas.length > 0 && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                Gestion del Expediente
                                </Typography>
                                <Table size="small" aria-label="details">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Gestión</TableCell>
                                            <TableCell>Fecha de Asignación</TableCell>
                                            {expediente.tareas.some(t => t.estado_tarea === "Finalizada") ? (
                                                <>
                                                    <TableCell>Fecha de Inicio</TableCell>
                                                    <TableCell>Fecha de Entrega</TableCell>
                                                </>
                                            ) : expediente.tareas.some(t => t.estado_tarea === "Cancelada") ? (
                                                <TableCell>Fecha de Cancelación</TableCell>
                                            ) : expediente.tareas.some(t => t.estado_tarea === "Iniciada") ? (
                                                <TableCell>Fecha de Inicio</TableCell>
                                            ) : (
                                                <TableCell>Fecha Estimada de Entrega</TableCell>
                                            )}
                                            <TableCell>Observaciones</TableCell>
                                            <TableCell>
                                                {expediente.tareas.some(t => t.estado_tarea === "Iniciada" || t.estado_tarea === "Asignada")
                                                    ? "Abogado a realizarla"
                                                    : expediente.tareas.some(t => t.estado_tarea === "Finalizada")
                                                        ? "Abogado quien la realizó"
                                                        : expediente.tareas.some(t => t.estado_tarea === "Cancelada")
                                                            ? "Abogado quien debía realizarla"
                                                            : "Abogado"}
                                            </TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align='center'>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {expediente.tareas.map((tarea, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="text-xs">{tarea.tarea}</TableCell>
                                                <TableCell className="text-xs">
                                                    {new Date(tarea.fecha_registro).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                {tarea.estado_tarea === "Finalizada" ? (
                                                    <>
                                                        <TableCell className="text-xs">
                                                            {new Date(tarea.fecha_inicio).toLocaleDateString('es-ES', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </TableCell>
                                                        <TableCell className="text-xs">
                                                            {new Date(tarea.fecha_real_entrega).toLocaleDateString('es-ES', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </TableCell>
                                                    </>
                                                ) : tarea.estado_tarea === "Cancelada" ? (
                                                    <TableCell className="text-xs">
                                                        {new Date(tarea.fecha_cancelacion).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                ) : tarea.estado_tarea === "Iniciada" ? (
                                                    <TableCell className="text-xs">
                                                        {new Date(tarea.fecha_inicio).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                ) : (
                                                    <TableCell className="text-xs">
                                                        {new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-xs">{tarea.observaciones}</TableCell>
                                                <TableCell className="text-xs">{tarea.abogadoUsername}</TableCell>
                                                <TableCell className="text-xs">{tarea.estado_tarea}</TableCell>
                                                <TableCell align='center'>
                                                    {tarea.estado_tarea === "Asignada" || tarea.estado_tarea === "Iniciada" ? (
                                                        <button
                                                            type="button"
                                                            className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                            onClick={() => openModal(tarea.tareaId)}
                                                        >
                                                            Cancelar Gestión
                                                        </button>
                                                    ) : tarea.estado_tarea === "Terminada" || tarea.estado_tarea === "Cancelada" ? (
                                                        <button
                                                            type="button"
                                                            className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                            onClick={() => openModalDelete(tarea.tareaId)}
                                                        >
                                                            Eliminar Gestión
                                                        </button>
                                                    ) : null}
                                                </TableCell>
                                            </TableRow>
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

export default TableAgenda;
