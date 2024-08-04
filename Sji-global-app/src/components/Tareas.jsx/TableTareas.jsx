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
import copiaricon from "../../assets/copiaricon.png"
const TableTarea = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,

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
    expediente,


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



    const handleActionClick = (estadoTarea) => {
        console.log(`Acción para el estado de tarea: ${estadoTarea}`);
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
                                    Tarea del Espediente
                                </Typography>
                                <Table size="small" aria-label="details">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tarea</TableCell>
                                            <TableCell>Fecha de Entrega</TableCell>
                                            <TableCell>Observaciones</TableCell>
                                            <TableCell>Status</TableCell>


                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {expediente.tareas.map((tarea, idx) => (
                                            tarea && (
                                                <TableRow key={idx}>
                                                    <TableCell className="text-xs">{tarea.tarea}</TableCell>
                                                    <TableCell className="text-xs">  {new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}</TableCell>
                                                    <TableCell className="text-xs">{tarea.observaciones}</TableCell>
                                                    <TableCell className="text-xs">{tarea.estado_tarea}</TableCell>
                                                    <TableCell align='center'>
                                                        {tarea.estado_tarea === 'Asignada' && (
                                                            <button
                                                                type="button"
                                                                className="text-primary bg-white border border-primary hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                                                            >
                                                                Iniciar Tarea
                                                            </button>
                                                        )}
                                                        {tarea.estado_tarea === 'Iniciada' && (
                                                            <button
                                                                type="button"
                                                                className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"

                                                            >
                                                                Finalizar Tarea
                                                            </button>
                                                        )}
                                                    </TableCell>
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

export default TableTarea;
