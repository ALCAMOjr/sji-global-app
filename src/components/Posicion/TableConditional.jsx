import { useEffect, useState } from 'react';
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
    handleMenuToggle,
    isLoading,
    isReversed 

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
            onPageChange={onPageChange}
            openModalTarea={openModalTarea}
            handleDownload={handleDownload}
            handleUpdate={handleUpdate}
            setOpenMenuIndex={setOpenMenuIndex}
            setIsOpen={setIsOpen}
            openMenuIndex={openMenuIndex}
            isOpen={isOpen}
            handleMenuToggle={handleMenuToggle}
            isLoading={isLoading}
            isReversed={isReversed}
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
            isLoading={isLoading}
            isReversed={isReversed}
        />
    );
};

export default TableConditional;
