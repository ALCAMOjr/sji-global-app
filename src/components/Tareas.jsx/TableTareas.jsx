import React, { useEffect, Fragment, useState, useContext } from 'react';
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
import copiaricon from "../../assets/copiaricon.png"
import { Spinner } from "@nextui-org/react";



const TableTarea = ({
    currentExpedientes,
    expedientes,
    itemsPerPage,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleInitTarea,
    handleCompleteTarea,
    handleDownload,
    handleUpdate
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
                                <span className='text-sm font-bold text-black'>Crédito</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Url</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Expediente</span>
                            </TableCell>

                            <TableCell>
                                <span className='text-sm font-bold text-black'>Juzgado</span>
                            </TableCell>
                            <TableCell align='left'>
                                <span className='text-sm font-bold text-black'>Acciones</span>
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
                                handleInitTarea={handleInitTarea}
                                handleCompleteTarea={handleCompleteTarea}
                                handleDownload={handleDownload}
                                handleUpdate={handleUpdate}

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

const Row = ({
    expediente,
    handleInitTarea,
    handleCompleteTarea,
    handleDownload,
    handleUpdate
}) => {
    const [open, setOpen] = useState(false);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloadingDetails, setDownloadingDetails] = useState({});
    const [UpgradeLoading, setUpgradeLoading] = useState({});
    const [TaskStartLoading, setTaskStartLoading] = useState({});
    const [TaskCompleteLoading, setTaskCompleteLoading] = useState({});


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

    const handleDownloadLoading = async (url, fecha, id) => {
        setDownloadingDetails(prevState => ({ ...prevState, [id]: true }));
        await handleDownload(url, fecha);
        setDownloadingDetails(prevState => ({ ...prevState, [id]: false }));
    };

    const handleUpgradeLoading = async (numero, nombre, url, id) => {
        setUpgradeLoading(prevState => ({ ...prevState, [id]: true }));
        await handleUpdate(numero, nombre, url);
        setUpgradeLoading(prevState => ({ ...prevState, [id]: false }));
    };

    const handleTaskStartLoading = async (id) => {
        setTaskStartLoading(prevState => ({ ...prevState, [id]: true }));
        await handleInitTarea(id);
        setTaskStartLoading(prevState => ({ ...prevState, [id]: false }));
    };

    const handleTaskCompleteLoading = async (id) => {
        setTaskCompleteLoading(prevState => ({ ...prevState, [id]: true }));
        await handleCompleteTarea(id);
        setTaskCompleteLoading(prevState => ({ ...prevState, [id]: false }));
    };


    const isAnyDownloadInProgress = Object.values(downloadingDetails).some(isDownloading => isDownloading);
    const isAnyUpgradeInProgress = Object.values(UpgradeLoading).some(isUpgrading => isUpgrading);


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
                <TableCell className="max-w-xs">{expediente.juzgado}</TableCell>
                <TableCell align="left">
                    <button
                        disabled={isAnyDownloadInProgress || isAnyUpgradeInProgress}
                        onClick={() => handleUpgradeLoading(expediente.numero, expediente.nombre, expediente.url, expediente.numero)}
                        type="button"
                        className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                    >
                        {UpgradeLoading[expediente.numero] ? <Spinner size='sm' color="default" /> : 'Actualizar'}
                    </button>
                </TableCell>
            </TableRow>
            {expediente.tareas && expediente.tareas.length > 0 && (
                <Fragment>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                    Gestion del Crédito
                                    </Typography>
                                    <Table size="small" aria-label="details">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tarea</TableCell>
                                                <TableCell>Fecha de Entrega</TableCell>
                                                <TableCell>Observaciones</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align='center'>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {expediente.tareas.map((tarea, idx) => (
                                                tarea && (
                                                    <TableRow key={idx}>
                                                        <TableCell className="text-xs">{tarea.tarea}</TableCell>
                                                        <TableCell className="text-xs">
                                                            {new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </TableCell>
                                                        <TableCell className="text-xs">{tarea.observaciones}</TableCell>
                                                        <TableCell className="text-xs">{tarea.estado_tarea}</TableCell>
                                                        <TableCell align="center">
                                                            {tarea.estado_tarea === 'Asignada' && (
                                                                <button
                                                                    onClick={() => handleTaskStartLoading(tarea.tareaId)}
                                                                    type="button"
                                                                    className="text-primary bg-white border border-primary hover:bg-gray-100 focus:outline-none focus:ring-4 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                                                                >
                                                                    {TaskStartLoading[tarea.tareaId] ? <Spinner size='sm' color="primary" /> : 'Iniciar Gestion'}
                                                                </button>
                                                            )}
                                                            {tarea.estado_tarea === 'Iniciada' && (
                                                                <button
                                                                    onClick={() => handleTaskCompleteLoading(tarea.tareaId)}
                                                                    type="button"
                                                                    className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                                                                >
                                                                    {TaskCompleteLoading[tarea.tareaId] ? <Spinner size='sm' color="default" /> : 'Finalizar Gestion'}
                                                                </button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            ))}

                                            <TableRow>
                                                <TableCell colSpan={9} align="center">
                                                    <IconButton
                                                        aria-label="expand nested row"
                                                        size="small"
                                                        onClick={() => setNestedOpen(!nestedOpen)}
                                                    >
                                                        {nestedOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                                    <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Detalles
                                                            </Typography>
                                                            <Table size="small" aria-label="details">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Descarga</TableCell>
                                                                        <TableCell>Fecha</TableCell>
                                                                        <TableCell>Etapa</TableCell>
                                                                        <TableCell>Termino</TableCell>
                                                                        <TableCell>Notificación</TableCell>

                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {expediente.details.length > 1 ? (
                                                                        expediente.details.map((detalle, idx) => (
                                                                            detalle && (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell align="left">
                                                                                        <button
                                                                                            disabled={isAnyUpgradeInProgress || isAnyDownloadInProgress}
                                                                                            onClick={() => handleDownloadLoading(expediente.url, detalle.fecha, detalle.id)}
                                                                                            type="button"
                                                                                            className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                                                                                        >
                                                                                            {downloadingDetails[detalle.id] ? <Spinner size='sm' color="default" /> : 'PDF'}
                                                                                        </button>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-xs truncate">{detalle.fecha}</TableCell>
                                                                                    <TableCell className="text-xs truncate">{detalle.etapa}</TableCell>
                                                                                    <TableCell className="text-xs truncate">{detalle.termino}</TableCell>
                                                                                    <TableCell className="text-xs truncate">{detalle.notificacion}</TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        ))
                                                                    ) : (
                                                                        <TableRow>
                                                                            <TableCell colSpan={5} align="center">No hay detalles disponibles</TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </Fragment>
            )}
        </Fragment>
    );
};


export default TableTarea;
