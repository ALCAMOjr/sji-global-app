import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableReportes from './TableReportes.jsx';



const TableConditional = ({
    reportesDetalles


}) => {
    const [shouldRenderTable, setShouldRenderTable] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1200) {
                setShouldRenderTable(true);
            } else {
                setShouldRenderTable(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return shouldRenderTable ? (
        <TableReportes
        reportesDetalles={reportesDetalles}
        />
    ) : (
        <Cards
        reportesDetalles={reportesDetalles}
        />
    );
};

export default TableConditional;
