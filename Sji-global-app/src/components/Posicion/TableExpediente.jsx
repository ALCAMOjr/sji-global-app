import React, { useEffect, Fragment, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const TableExpedientes = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    openModalTarea
}) => {

    console.log(currentExpedientes)
    return (
        <div>
               
            <TableContainer component={Paper} className='justify-center flex relative min-w-max items-center mt-20'>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                           
                            <TableCell className='bg-green-200'>Numero</TableCell>
                            <TableCell className='bg-green-200'>Ultima Etapa Aprobada</TableCell>
                            <TableCell className='bg-green-200'>Fecha Etapa Aprobada</TableCell>
                            <TableCell className='bg-green-200'>Secuencia Etapa Aprobada</TableCell>
                            <TableCell className='bg-blue-200'>Fecha</TableCell>
                            <TableCell className='bg-blue-200'>Etapa</TableCell>
                            <TableCell className='bg-blue-200'>Termino</TableCell>
                            <TableCell className='bg-blue-200'>Secuencia Etapa Tv</TableCell>
                            <TableCell align="center"  className='bg-primary/40'>Tareas</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentExpedientes.map((expediente, index) => (
                            <Row
                                key={expediente.id}
                                expediente={expediente}
                                openModalTarea={openModalTarea}
                            
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[160, 300, 600]}
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
    openModalTarea
}) => {

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell className="max-w-xs truncate">{expediente.num_credito}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.ultima_etapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.fecha_ultima_etapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.secuencia_etapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.fecha}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.etapa}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.termino}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.secuencia_etapa_tv}</TableCell>

               
             <TableCell align="center" > <button onClick={() => openModalTarea(expediente)} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Nueva Tarea</button></TableCell>
            </TableRow>
        </Fragment>
    );
};

export default TableExpedientes;
