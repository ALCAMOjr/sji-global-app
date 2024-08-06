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
import igualicon from "../../assets/igual.png";
import sprinticon from "../../assets/sprint.png";


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
                            {/* Encabezados de la tabla */}
                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>Numero</span>
                            </TableCell>
                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>MacroEtapa</span>
                            </TableCell>
                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>Ultima E A</span>
                            </TableCell>
                            <TableCell className='bg-green-200'>
                                <span className='text-xs font-bold text-black'>Fecha</span>
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
                                <span className='text-xs font-bold text-black'>Notification</span>
                            </TableCell>
                            <TableCell className='bg-blue-200'>
                                <span className='text-xs font-bold text-black'>MacroEtapa</span>
                            </TableCell>
                            <TableCell className='bg-white'>
                                <span className='text-xs font-bold text-black'>Sprints</span>
                            </TableCell>
                            <TableCell align="center" className=''>
                                <span className='text-xs font-bold text-black'>Tareas</span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentExpedientes.map((expediente) => (
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
    }, [expediente, jwt]);

    const getBackgroundColor = (macroetapa) => {
        switch (macroetapa) {
            case '01. Asignación':
                return 'bg-[#F5F5F5]'; 
            case '02. Convenios previos a demanda':
                return 'bg-[#D3D3D3]'; 
            case '03. Demanda sin emplazamiento':
                return 'bg-[#FFDEAD]'; 
            case '04. Emplazamiento sin sentencia':
                return 'bg-[#FFA07A]'; 
            case '06. Convenio Judicial':
                return 'bg-[#D8BFD8]'; 
            case '07. Juicio con sentencia':
                return 'bg-[#FFA07A]'; 
            case '08. Proceso de ejecución':
                return 'bg-[#FFB6C1]';
            case '09. Adjudicación':
                return 'bg-[#FFD700]';
            case '10. Escrituración en proceso':
                return 'bg-[#87CEEB]'; 
            case '15. Autoseguros':
                return 'bg-[#90EE90]';
            case '16. Liquidación':
                return 'bg-[#20B2AA]'; 
            case '17. Entrega por Poder Notarial':
                return 'bg-[#AFEEEE]';
            case '18. Irrecuperabilidad':
                return 'bg-[#778899]'; 
            default:
                return 'bg-white'; 
        }
    };

    const bgColorClass = getBackgroundColor(expediente.macroetapa_aprobada);

    const isEqual = expediente.macroetapa && expediente.macroetapa_aprobada === expediente.macroetapa;

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.num_credito}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.macroetapa_aprobada}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.ultima_etapa_aprobada}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">
                        {new Date(expediente.fecha_ultima_etapa_aprobada).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}</span>
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
                    <span className="text-xs">{expediente.notificacion}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                    <span className="text-xs">{expediente.macroetapa}</span>
                </TableCell>
                <TableCell className={`max-w-xs truncate`}>
                    <span className="text-xs">
                        {expediente.macroetapa ? (
                            isEqual ? (
                                <img src={igualicon} alt="Igual" className="w-6 h-6" />
                            ) : (
                                <img src={sprinticon} alt="Sprint" className="w-6 h-6" />
                            )
                        ) : null}
                    </span>
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
