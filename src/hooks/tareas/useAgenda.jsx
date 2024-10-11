import { useState, useEffect, useCallback, useContext } from 'react';
import Context from '../../context/abogados.context.jsx';
import createTarea from '../../views/tareas/CreateTarea.js';
import getTareas from '../../views/tareas/getTareas.js';
import CancelTarea from '../../views/tareas/CancelTarea.js';
import DeleteTarea from '../../views/tareas/DeleteTarea.js';

export default function useAgenda() {
    const { jwt } = useContext(Context);
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
            getTareas({ token: jwt })
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

    const registerNewTarea = useCallback(async ({ exptribunalA_numero, abogado_id, tarea, fecha_entrega, observaciones }) => {
        try {
            const newTarea = await createTarea({
                exptribunalA_numero, 
                abogado_id, 
                tarea, 
                fecha_entrega, 
                observaciones, 
                token: jwt
            });

            
            return { success: true, data: newTarea };
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.error;
                if (errorMessage === 'There is already a task assigned to this expediente.') {
                    return { success: false, error: 'Ya existe una tarea asignada a este expediente.' };
                } else if (errorMessage === 'Invalid abogado id or the user is not an abogado.') {
                    return { success: false, error: 'ID de abogado inválido o el usuario no es un abogado.' };
                } else if (errorMessage === 'Cannot assign a task to a non-existent expediente.') {
                    return { success: false, error: 'El numero de expediente es inválido.' };
                } else {
                    return { success: false, error: errorMessage || 'Error al crear la tarea.' };
                }
            } else {
                console.error(error);
                return { success: false, error: 'Error al crear la tarea.' };
            }
        }
    }, [jwt]);

    const deteleTarea = useCallback(async ({id, setOriginalExpedientes}) => {
        try {
            const responseStatus = await DeleteTarea({ id, token: jwt });
            if (responseStatus === 204) {
                setOriginalExpedientes([]);
                const expediente = await getTareas({token: jwt})
                setExpedientes(expediente);
            }
            return { success: responseStatus === 204 };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
  }, [jwt]);
  
  const cancelTarea = useCallback(async ({id, setOriginalExpedientes}) => {
    try {
        const responseStatus = await CancelTarea({ id, token: jwt });
        if (responseStatus === 200) {
            setOriginalExpedientes([]);
            const expediente = await getTareas({token: jwt})
            setExpedientes(expediente);
        }
        return { success: responseStatus === 200 };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
}, [jwt]);


    return { expedientes, loading, error, setExpedientes, registerNewTarea, deteleTarea, cancelTarea };
}
