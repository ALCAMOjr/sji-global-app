import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableExpedientes from './TableExpediente.jsx';

const TableConditional = ({
    currentExpedientes,
    expedientes,
    itemsPerPage,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    onPageChange,
    openModalTarea,
    handleDownload,
    handleUpdate,
    setOpenMenuIndex,
    setIsOpen,
    openMenuIndex,
    isOpen,
    handleMenuToggle
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
        <TableExpedientes
            currentExpedientes={currentExpedientes}
            expedientes={expedientes}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
            openModalTarea={openModalTarea}
            handleDownload={handleDownload}
            handleUpdate={handleUpdate}
            setOpenMenuIndex={setOpenMenuIndex}
            setIsOpen={setIsOpen}
            openMenuIndex={openMenuIndex}
            isOpen={isOpen}
            handleMenuToggle={handleMenuToggle}
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
            openModalTarea={openModalTarea}
            handleDownload={handleDownload}
            handleUpdate={handleUpdate}
            setOpenMenuIndex={setOpenMenuIndex}
            setIsOpen={setIsOpen}
            openMenuIndex={openMenuIndex}
            isOpen={isOpen}
            handleMenuToggle={handleMenuToggle}
        />
    );
};

export default TableConditional;
