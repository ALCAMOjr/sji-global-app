import { useState, useEffect, useCallback, useContext } from 'react';
import Context from '../../context/abogados.context.jsx';
import createTarea from '../../views/tareas/CreateTarea.js';
import getTareas from '../../views/tareas/getTareas.js';

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

            setExpedientes(prevTareas => [...prevTareas, newTarea]);
            return { success: true, data: newTarea };
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.error;
                if (errorMessage === 'There is already a task assigned to this expediente.') {
                    return { success: false, error: 'Ya existe una tarea asignada a este expediente.' };
                } else if (errorMessage === 'Invalid abogado id or the user is not an abogado.') {
                    return { success: false, error: 'ID de abogado inválido o el usuario no es un abogado.' };
                } else {
                    return { success: false, error: errorMessage || 'Error al crear la tarea.' };
                }
            } else {
                console.error(error);
                return { success: false, error: 'Error al crear la tarea.' };
            }
        }
    }, [jwt]);

    return { expedientes, loading, error, registerNewTarea };
}
