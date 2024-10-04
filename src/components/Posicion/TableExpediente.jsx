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
import TablePagination from '@mui/material/TablePagination';
import HasTarea from '../../views/tareas/HasTarea';
import Context from '../../context/abogados.context';
import flecha_derecha from "../../assets/flecha_derecha.png";
import flecha_izquierda from "../../assets/flecha_izquierda.png";
import { Spinner } from "@nextui-org/react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


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

const TableExpedientes = ({
    currentExpedientes,
    expedientes,
    itemsPerPage,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    openModalTarea,
    handleDownload,
    handleUpdate,
    isLoading,
    isReversed

}) => {

    const renderColumns = (expediente) => {
        const commonColumns = (
            <>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.expediente}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.juzgado}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.fecha}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.etapa}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.termino}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.notificacion}</span>
                </TableCell>
                <TableCell align='center'>
                    <span className="text-lg text-white">
                        {calculateDaysDifference(expediente.fecha)}
                    </span>
                </TableCell>
            </>
        );

        const creditColumns = (
            <>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.num_credito}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.macroetapa_aprobada}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.ultima_etapa_aprobada}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">
                        {new Date(expediente.fecha_ultima_etapa_aprobada).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                    <span className="text-xs">{expediente.estatus}</span>
                </TableCell>
            </>
        );

        return isReversed ? (
            <>
                {commonColumns}
                {creditColumns}
            </>
        ) : (
            <>
                {creditColumns}
                {commonColumns}
            </>
        );
    };

    return (
        <div>
            <TableContainer component={Paper} className='justify-center flex relative min-w-max items-center mt-20'>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {isReversed ? (
                                <>
                                    <TableCell className='bg-blue-200'>
                                        <span className='text-xs font-bold text-black'>Exp</span>
                                    </TableCell>
                                    <TableCell className='bg-blue-200'>
                                        <span className='text-xs font-bold text-black'>Juzg</span>
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
                                
                                    <TableCell align='center' className='bg-white'>
                                        <span className='text-xs font-bold text-black'>Gestión</span>
                                    </TableCell>

                                    <TableCell align='left' className='bg-white'>
                                        <span className='text-xs font-bold text-black'>Acciones</span>
                                    </TableCell>
                                    <TableCell className='bg-green-200'>
                                        <span className='text-xs font-bold text-black'>Crédito</span>
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
                                    <TableCell className='bg-green-200'>
                                        <span className='text-xs font-bold text-black'>Est</span>
                                    </TableCell>
                                    <TableCell className='bg-green-200'>
                                        <span className='text-xs font-bold text-black'>D</span>
                                    </TableCell>

                                </>
                            ) : (
                                <>
                                    <TableCell className='bg-green-200'>
                                        <span className='text-xs font-bold text-black'>Crédito</span>
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
                                    <TableCell className='bg-green-200'>
                                        <span className='text-xs font-bold text-black'>Est</span>
                                    </TableCell>
                                    <TableCell className='bg-green-200'>
                                        <span className='text-xs font-bold text-black'>D</span>
                                    </TableCell>
                                    <TableCell className='bg-blue-200'>
                                        <span className='text-xs font-bold text-black'>Exp</span>
                                    </TableCell>
                                    <TableCell className='bg-blue-200'>
                                        <span className='text-xs font-bold text-black'>Juzg</span>
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
                                
                                    <TableCell align='center' className='bg-white'>
                                        <span className='text-xs font-bold text-black'>Gestión</span>
                                    </TableCell>

                                    <TableCell align='left' className='bg-white'>
                                        <span className='text-xs font-bold text-black'>Acciones</span>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentExpedientes.map((expediente) => (
                            <Row
                                key={expediente.id}
                                expediente={expediente}
                                openModalTarea={openModalTarea}
                                handleDownload={handleDownload}
                                handleUpdate={handleUpdate}
                                isLoading={isLoading}
                                isReversed={isReversed}
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
    openModalTarea,
    handleDownload,
    handleUpdate,
    isLoading,
    isReversed

}) => {
    const [UpgradeLoading, setUpgradeLoading] = useState({});
    const [hasTarea, setHasTarea] = useState(false);
    const { jwt } = useContext(Context);
    const [downloadingDetails, setDownloadingDetails] = useState({});
    const [open, setOpen] = useState(false);

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
            return 'bg-dark-blue';
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
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                {isReversed ? (

                    <>
                        <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                            <span className="text-xs">{expediente.expediente}</span>
                        </TableCell>
                        <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                            <span className="text-xs">{expediente.juzgado}</span>
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
                                    disabled={isLoading}
                                    onClick={() => openModalTarea(expediente)}
                                    type="button"
                                    className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                >
                                    Asignar Exp
                                </button>
                            )}
                        </TableCell>
                        <TableCell align="left">
                            <button
                                disabled={isLoading}
                                onClick={() => handleUpgradeLoading(expediente.num_credito, expediente.nombre, expediente.url, expediente.num_credito)}
                                type="button"
                                className="text-white bg-blue-600 hover:blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                            >
                                {UpgradeLoading[expediente.num_credito] ? <Spinner size='sm' color="default" /> : 'Actualizar'}
                            </button>
                        </TableCell>
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
                            <span className="text-xs">{expediente.estatus}</span>
                        </TableCell>
                        <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                            <span className="text-xs">{expediente.bloquear_gestion_por_estrategia_dual}</span>
                        </TableCell>
                   

                    

                    </>
                ) : (
                    <>

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
                            <span className="text-xs">{expediente.estatus}</span>
                        </TableCell>
                        <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                            <span className="text-xs">{expediente.bloquear_gestion_por_estrategia_dual}</span>
                        </TableCell>
                        <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                            <span className="text-xs">{expediente.expediente}</span>
                        </TableCell>
                        <TableCell className={`max-w-xs truncate ${bgColorClass}`}>
                            <span className="text-xs">{expediente.juzgado}</span>
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
                                    disabled={isLoading}
                                    onClick={() => openModalTarea(expediente)}
                                    type="button"
                                    className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                >
                                    Asignar Exp
                                </button>
                            )}
                        </TableCell>
                        <TableCell align="left">
                            <button
                                disabled={isLoading}
                                onClick={() => handleUpgradeLoading(expediente.num_credito, expediente.nombre, expediente.url, expediente.num_credito)}
                                type="button"
                                className="text-white bg-blue-600 hover:blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2"
                            >
                                {UpgradeLoading[expediente.num_credito] ? <Spinner size='sm' color="default" /> : 'Actualizar'}
                            </button>
                        </TableCell>

                    </>
                )}


            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
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
                                    {expediente.detalles.length > 1 ? (
                                        expediente.detalles.map((detalle, idx) => (
                                            detalle && (
                                                <TableRow key={idx}>
                                                    <TableCell align="left">
                                                        <button
                                                            disabled={isLoading}
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

        </Fragment>
    );
}

export default TableExpedientes;