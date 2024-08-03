import React, { Fragment } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TableReportes = ({ reportesDetalles }) => {
    return (
        <TableContainer component={Paper} className="justify-center flex relative min-w-max items-center mt-20">
            <Table aria-label="collapsible table">
                <TableBody>
                    {reportesDetalles.map((reporte, index) => (
                        <Row key={index} reporte={reporte} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const Row = ({ reporte }) => {
    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <span className="text-sm font-bold text-black">Asignación</span>
                </TableCell>
                <TableCell  align='center' className="max-w-xs truncate">{reporte.Asignacion}</TableCell>
            </TableRow>
            <TableRow className='bg-gray-200'>
                <TableCell className='bg-gray-200'>
                    <span className="text-sm font-bold text-black">Presentación</span>
                </TableCell>
                <TableCell  align='center' className="max-w-xs truncate">{reporte.Presentacion}</TableCell>
            </TableRow>
            <TableRow className='bg-green-200'>
                <TableCell>
                    <span className="text-sm font-bold text-black">Nivelado</span>
                </TableCell>
                <TableCell  align='center' className="max-w-xs truncate">{reporte.Nivelado}</TableCell>
            </TableRow>
            <TableRow className='bg-orange-200'>
                <TableCell>
                    <span className="text-sm font-bold text-black">Empuje 1 o 2 niveles</span>
                </TableCell>
                <TableCell align='center' className="max-w-xs truncate">{reporte.Empuje1o2niveles}</TableCell>
            </TableRow>
            <TableRow className='bg-red-200'>
                <TableCell>
                    <span className="text-sm font-bold text-black">Empuje 3 o más niveles</span>
                </TableCell>
                <TableCell  align='center' className="max-w-xs truncate">{reporte.Empuje3omasniveles}</TableCell>
            </TableRow>
            <TableRow className='bg-white'>
                <TableCell>
                    <span className="text-sm font-bold text-black">Total de registros</span>
                </TableCell>
                <TableCell  align='center' className="max-w-xs truncate">{reporte.TotalRegistros}</TableCell>
            </TableRow>
        </Fragment>
    );
};

export default TableReportes;
