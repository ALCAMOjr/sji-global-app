import { useContext, useState, useEffect } from 'react';
import Context from '../../context/abogados.context.jsx';
import getReporte from '../../views/reportes/getReporte.js';
import getReporteDetalle from '../../views/reportes/getReporteDetalle.js';

export default function useReportes() {
    const { jwt } = useContext(Context);
    const [reportes, setReportes] = useState([]);
    const [reportesDetalles, setReportesDetalles] = useState([]);
    const [loadingReportes, setLoadingReportes] = useState(true);
    const [loadingDetalles, setLoadingDetalles] = useState(true);
    const [errorReportes, setErrorReportes] = useState(null);
    const [errorDetalles, setErrorDetalles] = useState(null);

    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
            setLoadingReportes(true);
            getReporte({ token: jwt })
                .then(data => {
                    setReportes(data);
                    setLoadingReportes(false);
                })
                .catch(err => {
                    setErrorReportes(err);
                    setLoadingReportes(false);
                });

            setLoadingDetalles(true);
            getReporteDetalle({ token: jwt })
                .then(data => {
                    setReportesDetalles(data);
                    setLoadingDetalles(false);
                })
                .catch(err => {
                    setErrorDetalles(err);
                    setLoadingDetalles(false);
                }); 
        }
    }, [jwt]);

    return { 
        reportes, 
        reportesDetalles, 
        loadingReportes, 
        loadingDetalles, 
        errorReportes, 
        errorDetalles,
        setReportes,
        setReportesDetalles
    };
}
