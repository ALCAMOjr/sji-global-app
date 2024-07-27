import React, { useEffect, Fragment, useState, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import HasTarea from '../../views/tareas/HasTarea';
import Context from '../../context/abogados.context';
const TableExpedientes = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    openModalTarea
}) => {

    return (
        <div>

            <TableContainer component={Paper} className='justify-center flex relative min-w-max items-center mt-20'>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>

                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>Numero</span>
                            </TableCell>
                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>Ultima E A</span>
                            </TableCell>
                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>Fecha</span>
                            </TableCell>
                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>Sec</span>
                            </TableCell>
                            <TableCell className='bg-blue-200'>
                                <span className='text-xs font-bold text-black'>Fecha</span>
                            </TableCell>
                            <TableCell className='bg-blue-200'>
                                <span className='text-xs font-bold text-black'>Etapa</span>
                            </TableCell>
                            <TableCell className='bg-blue-200'>
                                <span className='text-xs font-bold text-black'>Termino</span>
                            </TableCell>
                            <TableCell className='bg-blue-200'>
                                <span className='text-xs font-bold text-black'>Sec</span>
                            </TableCell>
                            <TableCell align="center" className=''>
                                <span className='text-xs font-bold text-black'>Tareas</span>
                            </TableCell>

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


    const [hasTarea, setHasTarea] = useState(false);
    const { jwt } = useContext(Context);

    useEffect(() => {
        const fetchHasTarea = async () => {
            try {
                const response = await HasTarea({ numero: expediente.num_credito, token: jwt });
                setHasTarea(response.hasTasks);
            } catch (error) {
                console.error('Error fetching tarea status', error);
            }
        };

        fetchHasTarea();
    }, [expediente.num_credito, jwt]);

    const getBackgroundColor = (aprobada, tv) => {
        if ((!aprobada || aprobada === '') && (!tv || tv === '')) {
            return 'bg-white';
        }
        if (aprobada === '1' && (!tv || tv === '')) {
            return 'bg-gray-200';
        }
        if (aprobada === tv && aprobada !== '1' && aprobada !== '') {
            return 'bg-green-200';
        }
        if (aprobada !== tv && aprobada !== '1' && aprobada !== '' && tv !== '1' && tv !== '') {
            const diff = Math.abs(aprobada - tv);
            if (diff === 1 || diff === 2) {
                return 'bg-orange-200';
            }
            if (diff > 2) {
                return 'bg-red-200';
            }
        }
        return 'bg-white';
    };

    const bgColorClass = getBackgroundColor(expediente.secuencia_etapa_aprobada, expediente.secuencia_etapa_tv);


    
    return (
        <Fragment>
             <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.num_credito}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.ultima_etapa_aprobada}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.fecha_ultima_etapa_aprobada}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.secuencia_etapa_aprobada}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.fecha}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.etapa}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.termino}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.secuencia_etapa_tv}</span>
                </TableCell>

                <TableCell align="center">
                    {hasTarea ? (
                        <button
                            type="button"
                            className="text-white bg-gray-500 cursor-not-allowed font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                            disabled
                        >
                            Ya Asignada
                        </button>
                    ) : (
                        <button
                            onClick={() => openModalTarea(expediente)}
                            type="button"
                            className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                            Nueva
                        </button>
                    )}
                </TableCell>

            </TableRow>
        </Fragment>
    );
};

export default TableExpedientes;
