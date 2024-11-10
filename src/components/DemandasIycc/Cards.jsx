import { useEffect } from "react";
import { Card } from "flowbite-react";
import { IoTrash } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import { GrDocumentPdf } from "react-icons/gr";
import { RxHamburgerMenu } from "react-icons/rx";
import { Pagination } from "flowbite-react";
import { TbCertificate } from "react-icons/tb";
const customTheme = {
    pagination: {
        base: "flex overflow-x-auto justify-center",
        layout: {
            table: {
                base: "text-sm text-gray-700 dark:text-gray-400",
                span: "font-semibold text-gray-900 dark:text-white"
            }
        },
        pages: {
            base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
            showIcon: "inline-flex",
            previous: {
                base: "ml-0 rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                icon: "h-5 w-5"
            },
            next: {
                base: "rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                icon: "h-5 w-5"
            },
            selector: {
                base: "w-12 border border-gray-300 bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                active: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
                disabled: "cursor-not-allowed opacity-50"
            }
        }
    }
};


const formatMonthYear = (fecha) => {
    const [year, month] = fecha.split('-');
    const meses = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];
    return `${meses[parseInt(month, 10) - 1]} del ${year}`;
};

const Cards = ({ currentDemandas, handleMenuToggle, isOpen, openMenuIndex, openModalUpdate, openModalDelete, handleDownloadingDemanda, handleDownloadingCertificate, totalPages, onPageChange, setOpenMenuIndex, setIsOpen, currentPage, }) => {

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (openMenuIndex !== null && !event.target.closest("#menu-button") && !event.target.closest(".menu-options")) {
                handleMenuClose();
            }
        };

        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [openMenuIndex, isOpen]);

    const handleMenuClose = () => {
        setOpenMenuIndex(null);
        setIsOpen([]);
    };

    return (
        <div>
            <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
                {currentDemandas.map((demanda, index) => (
                    <div key={index} className="w-full max-w-xs mb-20 m-4">
                        <Card className="bg-white text-black transform transition duration-500 ease-in-out hover:scale-105">
                            <div className="mb-2 flex items-center">
                                <button
                                    id="menu-button"
                                    onClick={() => handleMenuToggle(index)}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                                >
                                    <RxHamburgerMenu />
                                </button>
                                <h5 className="text-sm  ml-12 font-bold leading-none text-gray-900 dark:text-white">
                                    Crédito # {demanda.credito}
                                </h5>
                            </div>
                            {openMenuIndex === index && (
                                <div className="absolute right-13 bg-white top-12  w-48 border rounded-lg shadow-lg">
                                    <ul>
                                        <li className="flex items-center">
                                            <GrUpdate className="inline-block ml-2" />
                                            <a
                                                onClick={() => openModalUpdate(demanda)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                role="menuitem"
                                            >
                                                Actualizar Demanda
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <IoTrash className="inline-block ml-2" />
                                            <a
                                                onClick={() => openModalDelete(demanda)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                role="menuitem"
                                            >
                                                Eliminar Demanda
                                            </a>

                                        </li>

                                        <li className="flex items-center">
                                            <TbCertificate className="inline-block ml-2" />
                                            <a
                                                onClick={() => handleDownloadingCertificate(demanda.credito)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                role="menuitem"
                                            >
                                                Descargar Certificado
                                            </a>

                                        </li>

                                        <li className="flex items-center">
                                            <GrDocumentPdf className="inline-block ml-2" />
                                            <a
                                                onClick={() => handleDownloadingDemanda(demanda.credito)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                role="menuitem"
                                            >
                                                Descargar Demanda
                                            </a>

                                        </li>
                                    </ul>
                                </div>
                            )}
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <li className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-white"><span className="text-black font-bold">Moneda:</span> {demanda.subtipo}</p>
                                                <p className="text-sm font-medium text-gray-500 dark:text-white"><span className="text-black font-bold">Acreditado:</span> {demanda.acreditado}</p>
                                                <p className="text-sm font-medium text-gray-500 dark:text-white"><span className="text-black font-bold">Demandado/Demanda:</span> {demanda.categoria}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Escritura:</span> {demanda.escritura}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Escritura Formateada:</span> {demanda.escritura_ft}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Fecha Escritura:</span>  {new Date(demanda.fecha_escritura).toLocaleDateString({
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Fecha Escritura Formateada:</span> {demanda.fecha_escritura_ft}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Inscripción:</span> {demanda.inscripcion}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Volumen:</span> {demanda.volumen}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Libro:</span> {demanda.libro}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Sección:</span> {demanda.seccion}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Unidad:</span> {demanda.unidad}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Fecha:</span>  {new Date(demanda.fecha).toLocaleDateString({
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Fecha Formateada:</span> {demanda.fecha_ft}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Monto Otorgado:</span> {demanda.monto_otorgado_ft}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Mes Primer Adeudo:</span> {formatMonthYear(demanda.mes_primer_adeudo)}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Mes Último Adeudo:</span>   {formatMonthYear(demanda.mes_ultimo_adeudo)}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Adeudo:</span> {demanda.adeudo_ft}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Adeudo en Pesos:</span> {demanda.adeudo_pesos_ft}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Calle:</span> {demanda.calle}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Número:</span> {demanda.numero}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Tipo de Asentamiento:</span> {demanda.tipo_asentamiento}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Fraccionamiento o Colonia:</span> {demanda.colonia_fraccionamiento}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Municipio:</span> {demanda.municipio}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Estado:</span> {demanda.estado}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Código Postal:</span> {demanda.codigo_postal}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Interés Ordinario:</span> {demanda.interes_ordinario}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Interés Moratorio:</span> {demanda.interes_moratorio}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Juzgado:</span> {demanda.juzgado}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Hora Requerimiento:</span> {demanda.hora_requerimiento}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Fecha Requerimiento:</span>   {new Date(demanda.fecha_requerimiento).toLocaleDateString({
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Fecha Requerimiento Formateada:</span> {demanda.fecha_requerimiento_ft}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="text-black font-bold">Juego:</span> {demanda.juego}</p>
                                       
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 items-center flex-wrap flex overflow-x-auto justify-center">
                <Pagination
                    theme={customTheme.pagination}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    previousLabel="Anterior"
                    nextLabel="Siguiente"
                    labelRowsPerPage="Filas por página:"
                    showIcons
                />
            </div>
        </div>
    );
};

export default Cards;
