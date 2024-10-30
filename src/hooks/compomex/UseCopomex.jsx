import { useState, useEffect } from 'react';
import { getMunicipioNL } from '../../views/copomex/getMunicipioNL.js';
import { getStates } from '../../views/copomex/getStates.js';

export default function useCopomex() {
  const [municipiosNL, setMunicipiosNL] = useState([]);
  const [loadingMunicipiosNL, setLoadingMunicipiosNL] = useState(true);
  const [errorMunicipiosNL, setErrorMunicipiosNL] = useState(null);
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [errorStates, setErrorStates] = useState(null);

  useEffect(() => {
    const fetchMunicipiosNL = async () => {
      try {
        const data = await getMunicipioNL();
        if (data.error || !data.response?.municipios) {
          setErrorMunicipiosNL({ message: 'Hubo un error al obtener los municipios' });
        } else {
          setMunicipiosNL(data.response.municipios);
        }
      } catch (err) {
        setErrorMunicipiosNL({ message: 'Hubo un error al obtener los municipios' });
      } finally {
        setLoadingMunicipiosNL(false);
      }
    };

    const fetchStates = async () => {
      try {
        const data = await getStates();
        if (data.error || !data.response?.estado) {
          setErrorStates({ message: 'Hubo un error al obtener los estados' });
        } else {
          setStates(data.response.estado);
        }
      } catch (err) {
        setErrorStates({ message: 'Hubo un error al obtener los estados' });
      } finally {
        setLoadingStates(false);
      }
    };

    fetchMunicipiosNL();
    fetchStates();
  }, []);

  return {
    municipiosNL,
    loadingMunicipiosNL,
    errorMunicipiosNL,
    states,
    loadingStates,
    errorStates,
  };
}
