import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableTarea from './TableTareas.jsx';

const TableConditional = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    onPageChange,
    handleInitTarea,
    isLoading,
    handleCompleteTarea
}) => {
    const [shouldRenderTable, setShouldRenderTable] = useState(true); // Set to true by default

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
        <TableTarea
            currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleInitTarea={handleInitTarea}
            isLoading={isLoading}
            handleCompleteTarea={handleCompleteTarea}
        />
    ) : (
        <Cards
            currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
            handleInitTarea={handleInitTarea}
            isLoading={isLoading}
            handleCompleteTarea={handleCompleteTarea}
        />
    );
};

export default TableConditional;
