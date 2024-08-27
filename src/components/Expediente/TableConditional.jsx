import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableExpedientes from './TableExpedientes.jsx';

const TableConditional = ({
    currentExpedientes,
    expedientes,
    itemsPerPage,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    onPageChange,
    handleMenuToggle,
    isOpen,
    openMenuIndex,
    openModalUpdate,
    openModalDelete,
    menuDirection,
    setOpenMenuIndex,
    setIsOpen
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
        <TableExpedientes
            currentExpedientes={currentExpedientes}
            expedientes={expedientes}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleMenuToggle={handleMenuToggle}
            isOpen={isOpen}
            openMenuIndex={openMenuIndex}
            openModalUpdate={openModalUpdate}
            openModalDelete={openModalDelete}
            menuDirection={menuDirection}
            setOpenMenuIndex={setOpenMenuIndex}
            setIsOpen={setIsOpen}
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
            handleMenuToggle={handleMenuToggle}
            isOpen={isOpen}
            openMenuIndex={openMenuIndex}
            openModalUpdate={openModalUpdate}
            openModalDelete={openModalDelete}
            menuDirection={menuDirection}
            setOpenMenuIndex={setOpenMenuIndex}
            setIsOpen={setIsOpen}
        />
    );
};

export default TableConditional;
