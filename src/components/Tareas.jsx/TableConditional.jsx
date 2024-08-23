import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableTarea from './TableTareas.jsx';

const TableConditional = ({
    currentExpedientes,
    expedientes,
    itemsPerPage,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    onPageChange,
    handleInitTarea,
    isLoading,
    handleCompleteTarea,
    handleDownload
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
            expedientes={expedientes}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleInitTarea={handleInitTarea}
            isLoading={isLoading}
            handleCompleteTarea={handleCompleteTarea}
            handleDownload={handleDownload}
        />
    ) : (
        <Cards
            currentExpedientes={currentExpedientes}
            expedientes={expedientes}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
            handleInitTarea={handleInitTarea}
            isLoading={isLoading}
            handleCompleteTarea={handleCompleteTarea}
            handleDownload={handleDownload}
        />
    );
};

export default TableConditional;
