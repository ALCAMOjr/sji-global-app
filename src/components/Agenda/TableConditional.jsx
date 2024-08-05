import React, { useEffect, useState } from 'react';
import Cards from './Cards.jsx'; 
import TableAgenda from './TableAgenda.jsx';



const TableConditional = ({
    currentExpedientes,
    currentPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    onPageChange,
    openModal,
    openModalDelete


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
        <TableAgenda
           currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            openModal={openModal}
            openModalDelete={openModalDelete}
 
        />
    ) : (
        <Cards
           currentExpedientes={currentExpedientes}
            currentPage={currentPage}
            totalPages={totalPages}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
            openModal={openModal}
            openModalDelete={openModalDelete}
        />
    );
};

export default TableConditional;
