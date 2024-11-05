import { useEffect, useState } from 'react';
import Cards from './Cards.jsx';
import TableExpedientes from './TableDemanda.jsx';

const TableConditional = ({
    currentDemandas,
    demandas,
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
    handleDownloadingDemanda,
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
        currentDemandas={currentDemandas}
        demandas={demandas}
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
        handleDownloadingDemanda={handleDownloadingDemanda}
        menuDirection={menuDirection}
        setOpenMenuIndex={setOpenMenuIndex}
        setIsOpen={setIsOpen}

        />
    ) : (
        <Cards
        currentDemandas={currentDemandas}
        demandas={demandas}
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
        handleDownloadingDemanda={handleDownloadingDemanda}
        menuDirection={menuDirection}
        setOpenMenuIndex={setOpenMenuIndex}
        setIsOpen={setIsOpen}
        />
    );
};

export default TableConditional;
