import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx'; 
import UploadFile from '../../views/expedientesial/UploadFile.js'
import getAllExpedientesSial from '../../views/expedientesial/getAllExpedienteSial.js';

export default function useExpedientesSial() {
    const { jwt } = useContext(Context);
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
            getAllExpedientesSial({ token: jwt })
                .then(data => {
                    setExpedientes(data.data); 
                    setLoading(false);
                })
                .catch(err => {
                    setError(err);
                    setLoading(false);
                });
        }
    }, [jwt]);

    const uploadFile = useCallback(async (file) => {
        try {
            const response = await UploadFile({ file, token: jwt });
            setExpedientes(response.data); 
            return { success: true, data: response.data };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.response?.data?.message || 'Error al cargar el archivo' };
        }
    }, [jwt]);

    return { expedientes, loading, error, uploadFile };
}
