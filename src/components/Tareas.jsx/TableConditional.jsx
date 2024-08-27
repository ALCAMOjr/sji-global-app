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
    handleDownload,
    setOpenMenuIndex,
    setIsOpen,
    openMenuIndex,
    isOpen,
    handleMenuToggle,
    handleUpdate
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
            setOpenMenuIndex={setOpenMenuIndex}
            setIsOpen={setIsOpen}
            openMenuIndex={openMenuIndex}
            isOpen={isOpen}
            handleMenuToggle={handleMenuToggle}
            handleUpdate={handleUpdate}
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
            setOpenMenuIndex={setOpenMenuIndex}
            setIsOpen={setIsOpen}
            openMenuIndex={openMenuIndex}
            isOpen={isOpen}
            handleMenuToggle={handleMenuToggle}
            handleUpdate={handleUpdate}
        />
    );
};

export default TableConditional;
