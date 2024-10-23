import React, { useEffect, Fragment, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const TableDemanda = ({
    currentDemandas,
    demandas,
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
                                key={demanda.id}
                                demanda={demanda}

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
    demanda,
}) => {

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell></TableCell>
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
