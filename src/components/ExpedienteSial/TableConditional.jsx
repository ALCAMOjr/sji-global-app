import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableExpedientes from './TableExpedienteSial.jsx'; // Cambiado a TableExpedientes

const TableConditional = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    onPageChange,
}) => {
    const [shouldRenderTable, setShouldRenderTable] = useState(true); // Inicialmente renderiza la tabla

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
        <TableExpedientes
            currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
        />
    ) : (
        <Cards
            currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
        />
    );
};

export default TableConditional;
