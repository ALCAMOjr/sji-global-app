import React from 'react';
import useReportes from '../../hooks/reportes/useReportes.jsx';
import { Spinner } from "@nextui-org/react";
import Error from "../Error.jsx";
import TableConditional from './TableConditional.jsx';

const Reporte = () => {
    const { reportes, reportesDetalles, loadingDetalles, loadingReportes, errorDetalles, errorReportes } = useReportes();

    if (loadingDetalles || loadingReportes) return (
        <div className="flex items-center -mt-44 -ml-72 lg:-ml-44 xl:-ml-48 justify-center h-screen w-screen">
            <Spinner className="h-10 w-10" color="primary" />
        </div>
    );

    if (errorDetalles) {
        return <Error message={errorDetalles.message} />;
    } else if (errorReportes) {
        return <Error message={errorReportes.message} />;
    }

    return (
        <div>
            {reportes.length === 0 && reportesDetalles.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                            <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M106.673 12.4027C110.616 13.5333 112.895 17.6462 111.765 21.5891L97.7533 70.4529C96.8931 73.4525 94.307 75.4896 91.3828 75.7948C91.4046 75.5034 91.4157 75.2091 91.4157 74.9121V27.1674C91.4157 20.7217 86.1904 15.4965 79.7447 15.4965H56.1167L58.7303 6.38172C59.8609 2.43883 63.9738 0.159015 67.9167 1.28962L106.673 12.4027Z" fill="#D2D9EE"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M32 27.7402C32 23.322 35.5817 19.7402 40 19.7402H79.1717C83.59 19.7402 87.1717 23.322 87.1717 27.7402V74.3389C87.1717 78.7572 83.59 82.3389 79.1717 82.3389H40C35.5817 82.3389 32 78.7572 32 74.3389V27.7402ZM57.1717 42.7402C57.1717 46.6062 53.8138 49.7402 49.6717 49.7402C45.5296 49.7402 42.1717 46.6062 42.1717 42.7402C42.1717 38.8742 45.5296 35.7402 49.6717 35.7402C53.8138 35.7402 57.1717 38.8742 57.1717 42.7402ZM36.1717 60.8153C37.2808 58.3975 40.7688 54.8201 45.7381 54.3677C51.977 53.7997 55.3044 57.8295 56.5522 60.0094C59.8797 55.4423 67.0336 46.8724 72.3575 45.9053C77.6814 44.9381 81.7853 48.4574 83.1717 50.338V72.6975C83.1717 75.4825 80.914 77.7402 78.1289 77.7402H41.2144C38.4294 77.7402 36.1717 75.4825 36.1717 72.6975V60.8153Z" fill="#D2D9EE"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500">No hay ningun reporte todavía</p>
                        <p className="text-gray-400 text-sm mb-4 text-center">Ve a Position de Expedientes y crea una nueva tarea para comenzar.</p>
                    </div>
                </div>
            ) : (
                <div className="w-auto mt-8 -ml-64 lg:-ml-0 xl:-ml-0  bg-white border top-24 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                {reportes.map((reporte, index) => (
                  <div key={index} id="fullWidthTabContent" className="border-t border-gray-200 dark:border-gray-600">
                    <div
                      className="p-4 lg:ml-54 xl:ml-54 bg-white rounded-lg md:p-8 dark:bg-gray-800"
                      id="stats"
                      role="tabpanel"
                      aria-labelledby="stats-tab"
                    >
                      <dl className="grid max-w-screen-xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 p-4 mx-auto text-gray-900 dark:text-white">
                        {Object.entries(reporte).map(([key, value]) => (
                          key !== "Total_Registros" && (
                            <div className="flex flex-col items-center justify-center text-center" key={key}>
                              <dt className="mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">{value}</dt>
                              <dd className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400">{key}</dd>
                            </div>
                          )
                        ))}
                      </dl>
                    </div>
                  </div>
                ))}
                    <TableConditional
                        reportesDetalles={reportesDetalles}
                    />
                </div>
            )}
        </div>
    );
}

export default Reporte;
