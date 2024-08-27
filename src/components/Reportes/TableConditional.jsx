import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableReportes from './TableReportes.jsx';

const TableConditional = ({
    reportesDetalles
}) => {
    const [shouldRenderTable, setShouldRenderTable] = useState(window.innerWidth >= 1200);

    useEffect(() => {
        const checkWindowSize = () => {
            if (window.innerWidth >= 1200) {
                setShouldRenderTable(true);
            } else {
                setShouldRenderTable(false);
            }
        };

        const intervalId = setInterval(checkWindowSize, 1000);

        return () => {
            clearInterval(intervalId);
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
