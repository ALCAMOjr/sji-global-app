import React, { useEffect, useState } from 'react';
import TableComponent from './Table.jsx';
import Cards from './Cards.jsx'; 

const TableConditional = ({
    currentExpedientes,
    currentPage,
    totalPages,
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
        <TableComponent
           currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
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
    ) : (
        <Cards
           currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
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
