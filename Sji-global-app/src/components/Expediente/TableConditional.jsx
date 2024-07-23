import React, { useEffect, useState } from 'react';
import TableExpedientes from './Table.jsx';
import Cards from './Cards.jsx'; 
import TableEdit from './prueba..jsx';
const TableConditional = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuToggle,
    isOpen,
    openMenuIndex,
    openModalUpdate,
    openModalDelete,
    menuDirection,
    setOpenMenuIndex,
    setIsOpen

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
        <TableEdit
           currentExpedientes={currentExpedientes}
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
    );
};

export default TableConditional;
