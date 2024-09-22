import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx';
import createExpediente from '../../views/expedientes/createExpediente.js';
import getAllExpedientes from '../../views/expedientes/getExpedientes.js';
import { updateExpedientes, deleteExpedientes, updateAllExpedientes } from '../../views/expedientes/optional.js';
import getPdf from '../../views/expedientes/getPdf.js';
import getFilename from '../../views/expedientes/getFilename.js';
import UploadFile from "../../views/expedientes/UploadFile.js"

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

    const deleteExpediente = useCallback(async ({numero, setOriginalExpedientes}) => {
        try {
            const responseStatus = await deleteExpedientes({ numero: numero, token: jwt });
            if (responseStatus === 204) {
                setOriginalExpedientes([]);
                setExpedientes(prevExpedientes => prevExpedientes.filter(expediente => expediente.numero !== numero));
            }
            return { success: responseStatus === 204 };
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 400 && err.response.data.error === 'Cannot delete expediente with pending tasks') {
                return { success: false, error: 'El expediente tiene tareas pendientes sin completar' };
            }
            return { success: false, error: err.message || err };
        }
    }, [jwt]);

    const updateExpediente = useCallback(async ({ numero, nombre, url, setOriginalExpedientes}) => {
        try {
            const updatedExpediente = await updateExpedientes({ numero, nombre, url, token: jwt });
            setOriginalExpedientes([]);
            setExpedientes(prevExpedientes => prevExpedientes.map(expediente => expediente.numero === numero ? updatedExpediente : expediente));
            return { success: true, data: updatedExpediente };
        } catch (error) {
            if (error.response && error.response.status === 500 && error.response.data.error === 'Scraping failed for the provided URL.') {
                return { success: false, error: 'No se pudo obtener la información de la URL proporcionada. Intente de nuevo.' };
            }  else if (error.response && error.response.status === 500 && error.response.data.error === 'Tribunal doesn\'t work') {
                return { success: false, error: 'Tribunal no funciono' };
      
            }
            else {
                console.error(error);
                return { success: false, error: 'Error al actualizar el expediente' };
            }
        }
    }, [jwt]);


    const UpdateAllExpedientes = useCallback(async (setOriginalExpedientes) => {
        try {
            const response = await updateAllExpedientes({ token: jwt });
            const { jobId } = response;
    
            if (!jobId) {
                throw new Error('No jobId returned');
            }
    
            setOriginalExpedientes([]);
            return { success: true, jobId };
    
        } catch (error) {
            console.error('Error updating all expedientes:', error);
            let errorMessage = 'Error updating all expedientes';
            
            if (error.response && error.response.data) {
                errorMessage = error.response.data.error || errorMessage;
            }
            
            return { success: false, error: errorMessage };
        }
    }, [jwt]);
    

    
    
    
    const registerNewExpediente = useCallback(async ({ numero, nombre, url, setOriginalExpedientes }) => {
        try {
            const newExpediente = await createExpediente({ numero, nombre, url, token: jwt });
            setOriginalExpedientes([]);
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
            }
            else if (error.response && error.response.status === 500 && error.response.data.error === 'Tribunal doesn\'t work') {
                return { success: false, error: 'Tribunal no funciono' };
      
            }
            else {
                console.error(error);
                return { success: false, error: 'Error al crear el expediente' };
            }
        }
    }, [jwt]);


    const savePdfs = useCallback(async ({ url, fecha }) => {
        try {
            const response = await getPdf({ url, fecha, token: jwt });
            if (response.pdfPath) {
                const fileName = response.pdfPath.split('/').pop();
                return { success: true, fileName };
            } else {
                return { success: false, error: 'Error inesperado, PDF no encontrado.' };
            }
    
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.error;
                
                if (error.response.status === 404 && errorMessage === 'PDF not found.') {
                    return { success: false, error: 'PDF no encontrado.' };
                } else if (error.response.status === 500 && errorMessage === 'Tribunal doesn\'t work') {
                    return { success: false, error: 'Tribunal no funciono' };
                }
            }
            console.error(error);
            return { success: false, error: 'Error al obtener el PDF.' };
        }
    }, [jwt]);
    

    const fetchFilename = useCallback(async (filename) => {
        try {
            const response = await getFilename({ filename, token: jwt });
    
            if (response) {
                return { success: true, data: response };
            } else {
                return { success: false, error: 'Error inesperado, archivo no encontrado.' };
            }
    
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.error;
    
                if (error.response.status === 404 && errorMessage === 'PDF not found.') {
                    return { success: false, error: 'PDF no encontrado.' };
                }
            }
    
            console.error(error);
            return { success: false, error: 'Error al obtener el archivo PDF.' };
        }
    }, [jwt]);
    

    const uploadFile = useCallback(async (setOriginalExpedientes, files) => {
        try {
          const response = await UploadFile({ files, token: jwt }); 
          setOriginalExpedientes([]);
          const expedientes = await getAllExpedientes({ token: jwt });
          setExpedientes(expedientes)
          return { success: true, data: response.data };
        } catch (error) {
          console.error(error);
          return { success: false, error: error.response?.data?.message || 'Error al cargar los archivos' };
        }
    }, [jwt]);
    
    
    return { expedientes, loading, error, deleteExpediente, updateExpediente, uploadFile, registerNewExpediente, UpdateAllExpedientes, setExpedientes, savePdfs, fetchFilename };
    
}
