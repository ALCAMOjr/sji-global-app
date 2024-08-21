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
    expedientes,
    itemsPerPage,
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
                                <span className='text-sm font-bold text-black'>Numero</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Estatus</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Acreditado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Omisos</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Estado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Municipio</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Calle y Número</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fraccionamiento o Colonia</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Código Postal</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Ultima Etapa Reportada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha Última Etapa Reportada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Estatus Última Etapa</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Macroetapa Aprobada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Última Etapa Aprobada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Fecha Última Etapa Aprobada</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Etapa Construida</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Siguiente Etapa</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Despacho</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Semaforo</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Descorto</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Abogado</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Expediente</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-bold text-black'>Juzgado</span>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentExpedientes.map((expediente, index) => (
                            <Row
                                key={expediente.id}
                                expediente={expediente}

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
}) => {

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell></TableCell>
                <TableCell className="max-w-xs truncate">{expediente.num_credito}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.estatus}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.acreditado}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.omisos}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.estado}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.municipio}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.calle_y_numero}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.fraccionamiento_o_colonia}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.codigo_postal}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.ultima_etapa_reportada}</TableCell>
                <TableCell className="max-w-xs truncate"> {new Date(expediente.fecha_ultima_etapa_reportada).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.estatus_ultima_etapa}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.macroetapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.ultima_etapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{new Date(expediente.fecha_ultima_etapa_aprobada).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.siguiente_etapa}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.despacho}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.semaforo}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.descorto}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.abogado}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.expediente}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.juzgado}</TableCell>
            </TableRow>
        </Fragment>
    );
};

export default TableExpedientes;
