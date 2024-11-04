import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx';
import getAllDemandas from '../../views/demandasIycc/getAllDemandas.js';
import createDemanda from '../../views/demandasIycc/createDemanda.js';
import { deleteDemanda, updateDemanda } from '../../views/demandasIycc/optional.js';

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
            setDemandas(prevDemandas => [...prevDemandas, newDemanda[0]]);
            return { success: true, data: newDemanda };
        } catch (error) {
            const errorMsg = error.response?.data?.error;
            let userError = 'Algo sucedió al crear la demanda.';

            if (error.response?.status === 400) {
                if (errorMsg === 'Missing required fields: credito and subtipo are required.') {
                    userError = 'Los campos crédito y subtipo son obligatorios.';
                } else if (errorMsg === 'The expediente does not exist in CreditosSIAL.') {
                    userError = 'El número de credito no existe en CreditosSIAL.';
                } else if (errorMsg === 'An demanda with this credito already exists.') {
                    userError = 'Ya existe una demanda con este crédito.';
                }
            }

            console.error("Error creando la demanda:", error);
            return { success: false, error: userError };
        }
    }, [jwt]);

    const deleteDemandaByCredito = useCallback(async (credito, setOriginalDemandas) => {
        try {
            const responseStatus = await deleteDemanda({ numero: credito, token: jwt });
            if (responseStatus === 204) {
                setOriginalDemandas([]);
                setDemandas(prevDemandas => prevDemandas.filter(demanda => demanda.credito !== credito));
                return { success: true };
            }
            return { success: false, error: 'La demanda no se pudo eliminar.' };
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Error al eliminar la demanda.';
            return { success: false, error: errorMsg };
        }
    }, [jwt]);

    const updateDemandaByCredito = useCallback(async (credito, demandaData, setOriginalDemandas) => {
        try {
            const updatedDemanda = await updateDemanda({ credito, demandaData, token: jwt });
            setOriginalDemandas([]);
            setDemandas(prevDemandas =>
                prevDemandas.map(demanda =>
                    demanda.credito === credito ? updatedDemanda[0] : demanda
                )
            );
            return { success: true, data: updatedDemanda };
        } catch (error) {
            const errorMsg = error.response?.data?.error;
            let userError = 'Error al actualizar la demanda.';

            if (error.response?.status === 404) {
                userError = 'Demanda no encontrada.';
            } else if (error.response?.status === 400 && errorMsg) {
                userError = errorMsg;
            }
            return { success: false, error: userError };
        }
    }, [jwt]);

    return {
        demandas,
        loading,
        error,
        setDemandas,
        createNewDemanda,
        deleteDemandaByCredito,
        updateDemandaByCredito
    };
}
