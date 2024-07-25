import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx';
import createExpediente from '../../views/expedientes/createExpediente.js';
import getAllExpedientes from '../../views/expedientes/getExpedientes.js';
import { updateExpedientes, deleteExpedientes } from '../../views/expedientes/optional.js';

export default function useExpedientes() {
    const { jwt } = useContext(Context);
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
            getAllExpedientes({ token: jwt })
                .then(data => {
                    setExpedientes(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err);
                    setLoading(false);
                });
        }
    }, [jwt]);

    const deleteExpediente = useCallback(async (id) => {
        try {
            const responseStatus = await deleteExpedientes({ id, token: jwt });
            if (responseStatus === 204) {
                setExpedientes(prevExpedientes => prevExpedientes.filter(expediente => expediente.id !== id.id));
            }
            return { success: responseStatus === 204 };
        } catch (err) {
            console.error(err);
            return { success: false, error: err };
        }
    }, [jwt]);

    const updateExpediente = useCallback(async ({ id, numero, nombre, url }) => {
        try {
            const updatedExpediente = await updateExpedientes({ id, numero, nombre, url, token: jwt });
            setExpedientes(prevExpedientes => prevExpedientes.map(expediente => expediente.id === id ? updatedExpediente : expediente));
            return { success: true, data: updatedExpediente };
        } catch (error) {
            if (error.response && error.response.status === 500 && error.response.data.error === 'Scraping failed for the provided URL.') {
                return { success: false, error: 'No se pudo obtener la información de la URL proporcionada. Intente de nuevo.' };
            } else {
                console.error(error);
                return { success: false, error: 'Error al actualizar el expediente' };
            }
        }
    }, [jwt]);
    
    const registerNewExpediente = useCallback(async ({ numero, nombre, url }) => {
        try {
            const newExpediente = await createExpediente({ numero, nombre, url, token: jwt });
            setExpedientes(prevExpedientes => [...prevExpedientes, newExpediente]);
            return { success: true, data: newExpediente };
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.error;
                if (errorMessage === 'An expediente with this number already exists.') {
                    return { success: false, error: 'El expediente con este número ya existe.' };
                } else {
                    console.error(error);
                    return { success: false, error: errorMessage || 'Error al crear el expediente' };
                }
            } else if (error.response && error.response.status === 500 && error.response.data.error === 'Scraping failed for the provided URL.') {
                console.error(error);
                return { success: false, error: 'No se pudo obtener la información de la URL proporcionada. Intente de nuevo.' };
            } else {
                console.error(error);
                return { success: false, error: 'Error al crear el expediente' };
            }
        }
    }, [jwt]);
    
    return { expedientes, loading, error, deleteExpediente, updateExpediente, registerNewExpediente };
    
}
