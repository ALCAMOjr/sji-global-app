import { useState, useEffect } from 'react';
import { getMunicipioNL } from '../../views/copomex/getMunicipioNL.js';

export default function useCopomex() {
  const [municipiosNL, setMunicipiosNL] = useState([]);
  const [loadingmunicipiosNL , setLoadingMunicipiosNL] = useState(true);
  const [errorMunicipiosNL, setErrorMunicipiosNL] = useState(null);

  useEffect(() => {
    const fetchMunicipiosNL = async () => {
      try {
        const data = await getMunicipioNL();
        if (data.error || !data.response?.municipios) {
          setErrorMunicipiosNL({ message: 'Hubo un error al obtener los datos' });
        } else {
          setMunicipiosNL(data.response.municipios);
        }
      } catch (err) {
        setErrorMunicipiosNL({ message: 'Hubo un error al obtener los datos' });
      } finally {
        setLoadingMunicipiosNL(false);
      }
    };

    fetchMunicipiosNL();
  }, []);
  return {municipiosNL, loadingmunicipiosNL, errorMunicipiosNL };
}
