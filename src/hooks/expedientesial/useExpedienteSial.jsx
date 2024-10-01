import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx'; 
import UploadFile from '../../views/expedientesial/UploadFile.js'
import getAllExpedientesSial from '../../views/expedientesial/getAllExpedienteSial.js';
import getAllEtapas from '../../views/expedientesial/getAllEstapas.js';

export default function useExpedientesSial() {
    const { jwt } = useContext(Context);
    const [expedientes, setExpedientes] = useState([]);
    const [etapas, setEtapas] = useState([]);


    const [loadingExpedientes, setLoadingExpedientes] = useState(true);
    const [errorExpedientes, setErrorExpedientes] = useState(null);

    const [loadingEtapas, setLoadingEtapas] = useState(true);
    const [errorEtapas, setErrorEtapas] = useState(null);

    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
            setLoadingExpedientes(true);
            getAllExpedientesSial({ token: jwt })
                .then(data => {
                    setExpedientes(data); 
                    setLoadingExpedientes(false);
                })
                .catch(err => {
                    setErrorExpedientes(err);
                    setLoadingExpedientes(false);
                });
        }
    }, [jwt]);

    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
            setLoadingEtapas(true);
            getAllEtapas({ token: jwt })
                .then(data => {
                    setEtapas(data.data); 
                    setLoadingEtapas(false);
                })
                .catch(err => {
                    setErrorEtapas(err);
                    setLoadingEtapas(false);
                });
        }
    }, [jwt]);

    const uploadFile = useCallback(async (setOriginalExpedientes, files) => {
        try {
          const response = await UploadFile({ files, token: jwt }); 
          setOriginalExpedientes([]);
          setExpedientes(response.data); 
          return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al cargar los archivos';
            if (error.response?.status === 400 && errorMessage === 'Invalid Fields in the files') {
              return { success: false, error: 'Campos inválidos en los archivos.' };
            }
            return { success: false, error: errorMessage };
          }
        }, [jwt]);

    return { 
        expedientes, 
        etapas, 
        loadingExpedientes, 
        loadingEtapas, 
        errorExpedientes, 
        errorEtapas, 
        uploadFile,
        setExpedientes
    };
}
