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
import flecha_derecha from "../../assets/flecha_derecha.png";
import flecha_izquierda from "../../assets/flecha_izquierda.png";

const TableExpedientes = ({
    currentExpedientes,
    expedientes,
    itemsPerPage,
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
                                <span className='text-xs font-bold text-black'>Notificación</span>
                            </TableCell>
                            <TableCell align='center' className='bg-white'>
                                <span className='text-xs font-bold text-black'>Días</span>
                            </TableCell>

                            <TableCell align='center' className='bg-white'>
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
const parseDate = (dateStr) => {
    if (!dateStr) {
        return;
    }

    const monthMap = {
        'ene.': '01',
        'feb.': '02',
        'mar.': '03',
        'abr.': '04',
        'may.': '05',
        'jun.': '06',
        'jul.': '07',
        'ago.': '08',
        'sep.': '09',
        'oct.': '10',
        'nov.': '11',
        'dic.': '12'
    };

    const [day, month, year] = dateStr.split('/');
    const monthNum = monthMap[month.toLowerCase()] || '01';
    return new Date(`${year}-${monthNum}-${day}`);
};

const calculateDaysDifference = (dateStr) => {
    const date = parseDate(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

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

    const getDaysBackgroundColor = (days) => {
        if (days >= 90) {
            return 'bg-dark-red';
        } else if (days >= 60) {
            return 'bg-dark-green';
        } else if (days >= 30) {
            return 'bg-dark-blue'; o
        } else {
            return '';
        }
    };


    const getSprintIcon = (notificacion) => {
        if (!notificacion) return null;

        switch (notificacion) {
            case 'NO NOTIFICADA/TERMINADA':
            case 'SOLICITADA':
                return <img src={flecha_derecha} alt="Derecha" />;
            case 'NOTIFICADA/TERMINADA':
                return <img src={flecha_izquierda} alt="Izquierda" />;
            default:
                return null;
        }
    };

    const bgColorClass = getBackgroundColor(expediente.macroetapa_aprobada);
    const sprintIcon = getSprintIcon(expediente.notificacion);
    const daysDifference = expediente.fecha ? calculateDaysDifference(expediente.fecha) : '';

    const daysBackgroundColor = getDaysBackgroundColor(daysDifference);
    const daysDisplay = daysDifference > 30 ? daysDifference : '';

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
                <TableCell align='center' className={`max-w-xs truncate ${daysBackgroundColor}`}>
                    <span className="text-lg text-white">{daysDisplay}</span>
                </TableCell>
                <TableCell align="right" className={`max-w-xs truncate`}>
                    {sprintIcon && <span className="text-xs">{sprintIcon}</span>}
                </TableCell>
                <TableCell align="right">
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
                            Asignar Tarea
                        </button>
                    )}
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default TableExpedientes;