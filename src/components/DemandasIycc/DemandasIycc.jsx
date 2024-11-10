import { useRef, useState, useEffect, useContext } from "react";
import useDemandasIycc from "../../hooks/demandasIycc/useDemandasIycc.jsx";
import { useMediaQuery } from 'react-responsive';
import { IoMdCheckmark } from "react-icons/io";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import masicon from "../../assets/mas.png";
import create_icon from "../../assets/crear.png";
import check from "../../assets/check.png";
import { Spinner } from "@nextui-org/react";
import ModalSelection from "./SelectionModal.jsx";
import CreateModal from "./CreateModal.jsx";
import Error from "../Error.jsx";
import TableConditional from "./TableConditional.jsx";
import getAllDemandas from "../../views/demandasIycc/getAllDemandas.js";
import Context from "../../context/abogados.context.jsx";
import { toast } from "react-toastify";
import getDemandaByCredito from "../../views/demandasIycc/getDemandaByCredito.js";
import ModalDelete from "./ModalDelete.jsx";
import ModalUpdate from "./ModalUpdate.jsx";
import { getDemandaPdf, getDemandaCertificate } from "../../views/demandasIycc/optional.js";
import { saveAs } from 'file-saver';  

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DemandasIycc = () => {
  const { demandas, loading, error, setDemandas, createNewDemanda, deleteDemandaByCredito, updateDemandaByCredito } = useDemandasIycc();
  const [isCreatingDemanda, setIsCreatingDemanda] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isOpen, setIsOpen] = useState([]);
  const menuRef = useRef(null);
  const [search, setSearch] = useState('');
  const [isLoadingDemandas, setisLoadingDemandas] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [errorSelectionModal, setErrorSelectionModal] = useState("");
  const [searchType, setSearchType] = useState('Numero');
  const [isManualSearch, setIsManualSearch] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(200);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [originalDemandas, setOriginalDemandas] = useState([]);
  const [currentDemandas, setCurrentDemandas] = useState([]);
  const [menuDirection, setMenuDirection] = useState('down');
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1200 });
  const [selectedMoneda, setSelectedMoneda] = useState("");
  const [ isModalOpen, setIsModalOpen] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedDemanda, setSelectedDemanda] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { jwt } = useContext(Context);
  const [formValues, setFormValues] = useState({
    credito: "",
    subtipo: "",
    acreditado: "",
    categoria: "",
    escritura: "",
    escritura_ft: "",
    fecha_escritura: "",
    fecha_escritura_ft: "",
    inscripcion: "",
    volumen: "",
    libro: "",
    seccion: "",
    unidad: "",
    fecha: "",
    fecha_ft: "",
    monto_otorgado: "",
    monto_otorgado_ft: "",
    mes_primer_adeudo: "",
    mes_ultimo_adeudo: "",
    adeudo: "",
    adeudo_ft: "",
    adeudo_pesos: "",
    adeudo_pesos_ft: "",
    calle: "",
    numero: "",
    tipo_asentamiento: "",
    colonia_fraccionamiento: "",
    municipio: "",
    estado: "",
    codigo_postal: "",
    interes_ordinario: "",
    interes_moratorio: "",
    juzgado: "",
    hora_requerimiento: "",
    fecha_requerimiento: "",
    fecha_requerimiento_ft: "",
    folio: "",
    numero_ss: "",
    juego: ""
});

const resetFormValues = () => {
    setFormValues({
      credito: "",
      subtipo: "", 
      acreditado: "",
      categoria: "",
      escritura: "",
      escritura_ft: "",
      fecha_escritura: "",
      fecha_escritura_ft: "",
      inscripcion: "",
      volumen: "",
      libro: "",
      seccion: "",
      unidad: "",
      fecha: "",
      fecha_ft: "",
      monto_otorgado: "",
      monto_otorgado_ft: "",
      mes_primer_adeudo: "",
      mes_ultimo_adeudo: "",
      adeudo: "",
      adeudo_ft: "",
      adeudo_pesos: "", 
      adeudo_pesos_ft: "", 
      calle: "",
      numero: "",
      tipo_asentamiento: "",
      colonia_fraccionamiento: "",
      municipio: "",
      estado: "",
      codigo_postal: "",
      interes_ordinario: "",
      interes_moratorio: "",
      juzgado: "",
      hora_requerimiento: "",
      fecha_requerimiento: "",
      fecha_requerimiento_ft: "",
      folio: "",
      numero_ss: "",
      juego: ""
    });
};


  useEffect(() => {
    if (originalDemandas.length === 0 && demandas.length > 0) {
      setOriginalDemandas(demandas);
    }
    setTotalPages(Math.ceil(demandas.length / itemsPerPage));

    const reversedDemandas = [...demandas].reverse();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setCurrentDemandas(reversedDemandas.slice(startIndex, endIndex));
  }, [demandas, itemsPerPage, currentPage, originalDemandas.length]);


  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };


  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const openSelectionModal = () => {
    setSelectedMoneda("");
    setIsSelectionModalOpen(true);
  };

  const closeSelectionModal = () => {
    setIsSelectionModalOpen(false);
    setErrorSelectionModal("");
  };

  const reverse = () => {
    setIsModalOpen(false);
    setIsSelectionModalOpen(true);
    resetFormValues();
  };

  const openCreateModal = () => {
    if (!selectedMoneda) {
      setErrorSelectionModal("Selecciona un tipo de moneda antes de continuar.");
      return;
    }
    setIsModalOpen(true)
    setIsSelectionModalOpen(false);
    setErrorSelectionModal("");
  };


  const closeCreateModal = () => {
    setIsModalOpen(false);
    resetFormValues();
  };


  const handleCreateDemanda = async (e) => {
    e.preventDefault();
    setIsCreatingDemanda(true);
    if (!formValues.credito || !selectedMoneda) {
      toast.error('Los campos crédito y subtipo son obligatorios.');
      setIsCreatingDemanda(false);
      return;
    }

    const demandaData = {
      ...formValues,
      subtipo: selectedMoneda
    };

    try {
      const { success, error } = await createNewDemanda(demandaData, setOriginalDemandas);

      if (success) {
        toast.info('Se creó la demanda con éxito', {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: '#1D4ED8' }
        });
        closeCreateModal();
      } else {
        if (error === 'Los campos crédito y subtipo son obligatorios.') {
          toast.error('Los campos crédito y subtipo son obligatorios.');
        } else if (error === 'El número de credito no existe en CreditosSIAL.') {
          toast.error('El número de credito no existe en CreditosSIAL.');
        } else if (error === 'Ya existe una demanda con este crédito.') {
          toast.error('Ya existe una demanda con este crédito.');
        } else if (error === 'No se encontró una plantilla para el subtipo proporcionado.') {
          toast.error('No se encontró una plantilla para el subtipo proporcionado. Por favor crea una plantilla para el subtipo proporcionado');
        } else {
          toast.error("Algo sucedió al crear la demanda. Intente de nuevo");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Algo mal sucedió al crear la demanda. Intente de nuevo');
    } finally {
      setIsCreatingDemanda(false);
    }
  };

  const handleDownloadingDemanda = async (credito) => {
    setOpenMenuIndex(null);
    setIsOpen([]);
    const toastId = toast.loading('Descargando PDF...', {
        icon: <Spinner size="sm" />,
        progressStyle: {
            background: '#1D4ED8',
        }
    });
    
    try {
        const pdfBuffer = await getDemandaPdf({ credito, token: jwt });
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
        saveAs(blob, `demanda_${credito}.pdf`); 
        toast.update(toastId, {
            render: 'PDF descargado correctamente',
            type: 'info',
            icon: <img src={check} alt="Success Icon" />,
            progressStyle: {
                background: '#1D4ED8',
            },
            isLoading: false
        });
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
            toast.update(toastId, {
                render: 'El crédito ingresado no es válido o no se encontró. Intente de nuevo',
                type: 'error',
                isLoading: false
            });
        } else {
            toast.update(toastId, {
                render: 'Error al descargar el PDF. Intente de nuevo',
                type: 'error',
                isLoading: false
            });
        }
    }
};

const handleDownloadingCertificate = async (credito) => {
  setOpenMenuIndex(null);
  setIsOpen([]);
  const toastId = toast.loading('Descargando Certificado...', {
    icon: <Spinner size="sm" />,
    progressStyle: {
      background: '#1D4ED8',
    }
  });

  try {
    const pdfBuffer = await getDemandaCertificate({ credito, token: jwt });
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    saveAs(blob, `certificado_${credito}.pdf`);
    toast.update(toastId, {
      render: 'Certificado descargado correctamente',
      type: 'info',
      icon: <img src={check} alt="Success Icon" />,
      progressStyle: {
        background: '#1D4ED8',
      },
      isLoading: false
    });
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      toast.update(toastId, {
        render: 'El crédito ingresado no es válido o no se encontró. Intente de nuevo',
        type: 'error',
        isLoading: false
      });
    } else {
      toast.update(toastId, {
        render: 'Error al descargar el Certificado. Intente de nuevo',
        type: 'error',
        isLoading: false
      });
    }
  }
};

const openModalUpdate = (demanda) => {
    setFormValues({
        credito: demanda.credito,
        subtipo: demanda.subtipo,
        acreditado: demanda.acreditado,
        categoria: demanda.categoria,
        escritura: demanda.escritura,
        escritura_ft: demanda.escritura_ft,
        fecha_escritura: formatDate(demanda.fecha_escritura),
        fecha_escritura_ft: demanda.fecha_escritura_ft,
        inscripcion: demanda.inscripcion,
        volumen: demanda.volumen,
        libro: demanda.libro,
        seccion: demanda.seccion,
        unidad: demanda.unidad,
        fecha: formatDate(demanda.fecha),
        fecha_ft: demanda.fecha_ft,
        monto_otorgado: demanda.monto_otorgado,
        monto_otorgado_ft: demanda.monto_otorgado_ft,
        mes_primer_adeudo: demanda.mes_primer_adeudo,
        mes_ultimo_adeudo: demanda.mes_ultimo_adeudo,
        adeudo: demanda.adeudo,
        adeudo_ft: demanda.adeudo_ft,
        adeudo_pesos: demanda.adeudo_pesos,
        adeudo_pesos_ft: demanda.adeudo_pesos_ft,
        calle: demanda.calle,
        numero: demanda.numero,
        tipo_asentamiento: demanda.tipo_asentamiento,
        colonia_fraccionamiento: demanda.colonia_fraccionamiento,
        municipio: demanda.municipio,
        estado: demanda.estado,
        codigo_postal: demanda.codigo_postal,
        interes_ordinario: demanda.interes_ordinario,
        interes_moratorio: demanda.interes_moratorio,
        juzgado: demanda.juzgado,
        hora_requerimiento: demanda.hora_requerimiento,
        fecha_requerimiento: formatDate(demanda.fecha_requerimiento),
        fecha_requerimiento_ft: demanda.fecha_requerimiento_ft,
        folio: demanda.folio ,
        numero_ss: demanda.numero_ss,
        juego: demanda.juego
    });
    setShowModalUpdate(true);
    setSelectedMoneda(demanda.subtipo);
    setOpenMenuIndex(null);
    setIsOpen([]);
};


  const closeModalUpdate = () => {
    setShowModalUpdate(false);
    resetFormValues()
};

const handleUpdate = async (e) => {
  e.preventDefault();
  setIsUpdating(true);

  try {
      const { success, error } = await updateDemandaByCredito(formValues.credito, formValues, setOriginalDemandas);
      if (success) {
          toast.info('Demanda actualizada correctamente', {
              icon: () => <img src={check} alt="Success Icon" />,
              progressStyle: {
                  background: '#1D4ED8',
              }
          });
          closeModalUpdate();
      } else if (error === "Demanda no encontrada") {
          toast.error('La demanda no ha sido encontrada. Intente de nuevo');
      } else {
          toast.error('Algo mal sucedió al actualizar la demanda. Intente de nuevo', error);
      }
  } catch (error) {
      console.error(error);
      toast.error('Algo mal sucedió al actualizar la demanda. Intente de nuevo');
  } finally {
      setIsUpdating(false);
  }
};

  const openModalDelete = (demanda) => {
    setSelectedDemanda(demanda);
    setShowModalDelete(true);
    setOpenMenuIndex(null);
    setIsOpen([]);
}

const closeModalDelete = () => {
    setSelectedDemanda(null);
    setShowModalDelete(false);
}



const handleDelete = async () => {
  setIsDeleting(true);

  try {
      const { success, error } = await deleteDemandaByCredito(selectedDemanda.credito, setOriginalDemandas);
      if (success) {
          toast.info('Se eliminó correctamente la Demanda', {
              icon: () => <img src={check} alt="Success Icon" />,
              progressStyle: {
                  background: '#1D4ED8',
              }
          });
      } else if (error == "Demanda no encontrada"){
          toast.error(`La demanda no ha sido encontrada, Intente de nuevo`);
      } else {
          toast.error("Algo mal sucedió al eliminar la demanda. Intente de nuevo", error)
      }
  } catch (error) {
      console.error(error);
      toast.error('Algo mal sucedió al eliminar la demanda. Intente de nuevo');
  } finally {
      setIsDeleting(false);
      closeModalDelete();
  }
};


  const handleMenuToggle = (index) => {
    setOpenMenuIndex(index === openMenuIndex ? null : index);

    setIsOpen(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
    if (index >= currentDemandas.length - 2) {
      setMenuDirection('up');
    } else {
      setMenuDirection('down');
    }
  };



  const toggleDropdown = () => setIsSearchOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchTypeChange = async (type) => {
    setSearchType(type);
    setIsSearchOpen(false);
    setSearch('');
    setIsManualSearch(type === 'Numero');
    await handleGetDemandas()

  };


  const searcherDemanda = async (searchTerm) => {
    setisLoadingDemandas(true)
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    let filteredDemandas = [];
    if (searchType === 'Nombre') {
      filteredDemandas = demandas.filter(demanda => demanda.nombre.toLowerCase().includes(lowercaseSearchTerm));
    } else if (searchType === 'Numero') {
      try {
        const demanda = await getDemandaByCredito({ numero: lowercaseSearchTerm, token: jwt });
        if (demanda[0]) {
          filteredDemandas.push(demanda[0]);
        } else {
          filteredDemandas = [];
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          filteredDemandas = [];
        } else {
          console.error("Somethin was wrong")
        }
      }
    }

    setDemandas(filteredDemandas);
    setisLoadingDemandas(false)
    setCurrentPage(1);
  };



  const handleSearchInputChange = async (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);


    if (searchType === 'Numero' && searchTerm.trim() !== '') {
      setIsManualSearch(true);
    }

    if (searchType === 'Nombre' && searchTerm.trim() !== '') {
      searcherDemanda(searchTerm);
    }

    if (searchTerm.trim() === '') {
      setIsManualSearch(false);
      await handleGetDemandas()

    }
  }

  const handleManualSearch = () => {
    if (search.trim() !== '') {
      searcherDemanda(search);
    }
  };

  const handleGetDemandas = async () => {
    try {
      setisLoadingDemandas(true);
      const demandas = await getAllDemandas({ token: jwt })
      setDemandas(demandas);
    } catch (error) {
      console.error("Something went wrong", error);
    }
    setisLoadingDemandas(false);
  };

  if (loading || isLoadingDemandas) return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="primary" />
    </div>
  );


  if (error) return <Error message={error.message} />;



  return (
    <div className="flex flex-col min-h-screen">

      <>
        <div className="relative">
          <Dropdown>
            <DropdownTrigger>
              <Button color='primary'
                className='fixed right-16 lg:right-56 xl:right-56 mt-24 lg:mt-0 xl:mt-0 top-3/4 lg:top-24 xl:top-24 z-50'
                isIconOnly
                aria-label="Mas"
              >
                <img src={masicon} alt="Mas" className='w-4 h-4' />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem startContent={<img src={create_icon} alt="Create Icon" className="w-6 h-6 flex-shrink-0" />} onClick={openSelectionModal} key="create">
                Crear Demanda
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {isSelectionModalOpen && (
          <ModalSelection
            closeSelectionModal={closeSelectionModal}
            setSelectedMoneda={setSelectedMoneda}
            selectedMoneda={selectedMoneda}
            openCreateModal={openCreateModal}
            setError={setErrorSelectionModal}
            error={errorSelectionModal}
          />
        )}

        {isModalOpen && (
          <CreateModal
            closeModal={closeCreateModal}
            moneda={selectedMoneda}
            reverse={reverse}
            formValues={formValues}
            setFormValues={setFormValues}
            handleCreate={handleCreateDemanda}
            isCreatingDemanda={isCreatingDemanda}

          />
        )}
      </>


      {showModalDelete && (
                <ModalDelete
               handleDelete={handleDelete}
               closeModalDelete={closeModalDelete}
               isDeleting={isDeleting}
              />
            )}

           {showModalUpdate && (
                <ModalUpdate
               closeModal={closeModalUpdate}
               moneda={selectedMoneda}
               formValues={formValues}
               setFormValues={setFormValues}
               handleUpdate={handleUpdate}
               isUpdatingDemanda={isUpdating}
              />
            )}

      {isDesktopOrLaptop ? (
        <div className="max-w-xs mx-auto mb-4 fixed top-28 left-1/2 transform -translate-x-1/2 z-10 -translate-y-1/2">
          <div className="flex">
            <button
              id="dropdown-button"
              onClick={toggleDropdown}
              className="flex-shrink-0 z-10 inline-flex items-center py-1 px-2 text-xs font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              type="button"
            >
              Filtrar por:
              <svg
                className={`w-2 h-2 ms-1 transition-transform ${isSearchOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {isSearchOpen && (
              <div
                ref={menuRef}
                id="dropdown"
                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-8"
              >
                <ul className="py-1 text-xs text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                  <li>
                    <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Numero")}>
                      Crédito
                      {searchType === "Numero" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                    </button>
                  </li>

                </ul>
              </div>
            )}
            <div className="relative w-full">
              <input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch();
                  }
                }}
                value={search}
                onChange={handleSearchInputChange}
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                placeholder="Buscar Demandas:"
                required
                style={{ width: "300px" }}
              />
              <button
                type="button"
                disabled={!isManualSearch}
                onClick={handleManualSearch}
                className={`absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-primary border-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary-dark dark:hover:bg-primary-dark dark:focus:ring-primary"}`}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Buscar</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xs mx-auto mb-4 -ml-4 fixed top-28 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex">
            <button
              id="dropdown-button"
              onClick={toggleDropdown}
              className="flex-shrink-0 z-10 inline-flex items-center py-1 px-2 text-xs font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              type="button"
            >
              Filtrar por:
              <svg
                className={`w-2 h-2 ms-1 transition-transform ${isSearchOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {isSearchOpen && (
              <div
                ref={menuRef}
                id="dropdown"
                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700 absolute mt-8"
              >
                <ul className="py-1 text-xs text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                  <li>
                    <button type="button" className="inline-flex w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSearchTypeChange("Numero")}>
                      Crédito
                      {searchType === "Numero" && <IoMdCheckmark className="w-3 h-3 ml-1" />}
                    </button>
                  </li>


                </ul>
              </div>
            )}
            <div className="relative w-full">
              <input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch();
                  }
                }}
                value={search}
                onChange={handleSearchInputChange}
                type="search"
                id="search-dropdown"
                className="block p-1.5 w-full z-20 text-xs text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary"
                placeholder="Buscar Demandas:"
                required
                style={{ width: "200px" }}
              />
              <button
                type="button"
                disabled={!isManualSearch}
                onClick={handleManualSearch}
                className={`absolute top-0 right-0 p-1.5 text-xs font-medium h-full text-white ${!isManualSearch ? "bg-gray-400 border-gray-400 cursor-not-allowed" : "bg-primary border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"}`}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Buscar</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {demandas.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0">
          <div className="flex flex-col items-center justify-center">
            <div className="text-gray-400 mb-2">
              <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M106.673 12.4027C110.616 13.5333 112.895 17.6462 111.765 21.5891L97.7533 70.4529C96.8931 73.4525 94.307 75.4896 91.3828 75.7948C91.4046 75.5034 91.4157 75.2091 91.4157 74.9121V27.1674C91.4157 20.7217 86.1904 15.4965 79.7447 15.4965H56.1167L58.7303 6.38172C59.8609 2.43883 63.9738 0.159015 67.9167 1.28962L106.673 12.4027Z" fill="#D2D9EE"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M32 27.7402C32 23.322 35.5817 19.7402 40 19.7402H79.1717C83.59 19.7402 87.1717 23.322 87.1717 27.7402V74.3389C87.1717 78.7572 83.59 82.3389 79.1717 82.3389H40C35.5817 82.3389 32 78.7572 32 74.3389V27.7402ZM57.1717 42.7402C57.1717 46.6062 53.8138 49.7402 49.6717 49.7402C45.5296 49.7402 42.1717 46.6062 42.1717 42.7402C42.1717 38.8742 45.5296 35.7402 49.6717 35.7402C53.8138 35.7402 57.1717 38.8742 57.1717 42.7402ZM36.1717 60.8153C37.2808 58.3975 40.7688 54.8201 45.7381 54.3677C51.977 53.7997 55.3044 57.8295 56.5522 60.0094C59.8797 55.4423 67.0336 46.8724 72.3575 45.9053C77.6814 44.9381 81.7853 48.4574 83.1717 50.338V72.6975C83.1717 75.4825 80.914 77.7402 78.1289 77.7402H41.2144C38.4294 77.7402 36.1717 75.4825 36.1717 72.6975V60.8153Z" fill="#D2D9EE"></path>
              </svg>
            </div>
            <p className="text-gray-500">No hay Demandas todavía</p>
            <p className="text-gray-400 text-sm mb-4 text-center">Crea un nuevo demanda para comenzar.</p>
          </div>

        </div>




      ) : (

        <TableConditional
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
          handleDownloadingCertificate={handleDownloadingCertificate}
          menuDirection={menuDirection}
          setOpenMenuIndex={setOpenMenuIndex}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default DemandasIycc;
