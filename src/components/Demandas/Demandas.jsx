// src/components/Demandas.jsx
import { useState } from "react";
import { Dropdown, DropdownTrigger, Button } from "@nextui-org/react";
import masicon from "../../assets/mas.png";
import ModalesDemandas from "./ModalesDemanda";
import { Spinner } from "@nextui-org/react";

const Demandas = () => {
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isLoadingExpedientes, setIsLoadingExpedientes] = useState(false);
  const [search, setSearch] = useState('');
  const [isManualSearch, setIsManualSearch] = useState(false);
  const [searchType, setSearchType] = useState('Numero');

  const openSelectionModal = () => {
    setIsSelectionModalOpen(true);
  };

  const handleSearchInputChange = async (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    if (searchTerm.trim() === '') {
      setIsManualSearch(false);
      await handleGetExpedientes();
    }
  };

  const handleGetExpedientes = async () => {
    try {
      setIsLoadingExpedientes(true);
      // Aquí se realiza la lógica para obtener expedientes.
    } catch (error) {
      console.error("Error al obtener expedientes", error);
    }
    setIsLoadingExpedientes(false);
  };

  const handleManualSearch = () => {
    if (search.trim() !== '') {
      // Lógica para manejar la búsqueda manual.
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isLoadingExpedientes ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <Spinner className="h-10 w-10" color="primary" />
        </div>
      ) : (
        <>
          <div className="relative">
            <Dropdown>
              <DropdownTrigger>
                <Button color='primary'
                  className='fixed right-16 lg:right-56 xl:right-56 mt-24 lg:mt-0 xl:mt-0 top-3/4 lg:top-24 xl:top-24 z-50'
                  isIconOnly
                  aria-label="Mas"
                  onClick={openSelectionModal}
                >
                  <img src={masicon} alt="Mas" className='w-4 h-4' />
                </Button>
              </DropdownTrigger>
            </Dropdown>
          </div>
          <ModalesDemandas
            isSelectionModalOpen={isSelectionModalOpen}
            setIsSelectionModalOpen={setIsSelectionModalOpen}
          />
        </>
      )}
    </div>
  );
};

export default Demandas;
