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
    onPageChange
}) => {

    return (
        <div>
               
            <TableContainer component={Paper} className='justify-center flex relative min-w-max items-center mt-20'>
                <Table aria-label="collapsible table">
                    <TableHead className='bg-gray-100'>
                        <TableRow>
                            <TableCell />
                            <TableCell>Numero de Crédito</TableCell>
                            <TableCell>Estatus</TableCell>
                            <TableCell>Acreditado</TableCell>
                            <TableCell>Omisos</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Municipio</TableCell>
                            <TableCell>Calle y Número</TableCell>
                            <TableCell>Fraccionamiento o Colonia</TableCell>
                            <TableCell>Código Postal</TableCell>
                            <TableCell>Ultima Etapa Reportada</TableCell>
                            <TableCell>Fecha Última Etapa Reportada</TableCell>
                            <TableCell>Estatus Última Etapa</TableCell>
                            <TableCell>Macroetapa Aprobada</TableCell>
                            <TableCell>Última Etapa Aprobada</TableCell>
                            <TableCell>Fecha Última Etapa Aprobada</TableCell>
                            <TableCell>Etapa Construida</TableCell>
                            <TableCell>Siguiente Etapa</TableCell>
                            <TableCell>Despacho</TableCell>
                            <TableCell>Semaforo</TableCell>
                            <TableCell>Descorto</TableCell>
                            <TableCell>Abogado</TableCell>
                            <TableCell>Expediente</TableCell>
                            <TableCell>Juzgado</TableCell>
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
                <TableCell className="max-w-xs truncate">{expediente.fecha_ultima_etapa_reportada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.estatus_ultima_etapa}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.macroetapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.ultima_etapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.fecha_ultima_etapa_aprobada}</TableCell>
                <TableCell className="max-w-xs truncate">{expediente.etapa_construida}</TableCell>
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
