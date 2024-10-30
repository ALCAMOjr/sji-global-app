import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx';
import getAllDemandas from '../../views/demandasIycc/getAllDemandas.js';
import createDemanda from '../../views/demandasIycc/createDemanda.js';
import { deleteDemanda } from '../../views/demandasIycc/optional.js'
export default function useDemandasIycc() {
    const { jwt } = useContext(Context);
    const [demandas, setDemandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
          getAllDemandas({ token: jwt })
            .then(data => {
              setDemandas(data);
              setLoading(false);
            })
            .catch(err => {
              setError(err);
              setLoading(false);
            });
        }
      }, [jwt]);

      const createNewDemanda = useCallback(async (demandaData, setOriginalDemandas) => {
        try {
            const newDemanda = await createDemanda({ demandaData, token: jwt });
            setOriginalDemandas([]);
            setDemandas(prevDemandas => [...prevDemandas,  newDemanda[0]]);
            return { success: true, data: newDemanda };
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data.error;
                if (errorMsg === 'Missing required fields: credito and subtipo are required.') {
                    return { success: false, error: 'Los campos crédito y subtipo son obligatorios.' };
                } else if (errorMsg === 'The expediente does not exist in CreditosSIAL.') {
                    return { success: false, error: 'El número de credito no existe en CreditosSIAL.' };
                } else if (errorMsg === 'An demanda with this credito already exists.') {
                    return { success: false, error: 'Ya existe una demanda con este crédito.' };
                } else if (errorMsg === 'Template not found for the given subtipo.') {
                    return { success: false, error: 'No se encontró una plantilla para el subtipo proporcionado.' };
                }
            } else {
                console.error("Error creando la demanda:", error);
                return { success: false, error: 'Algo sucedió al crear la demanda.' };
            }
        }
    }, [jwt]);
    
      return { demandas, loading, error, setDemandas, createNewDemanda };
  
}