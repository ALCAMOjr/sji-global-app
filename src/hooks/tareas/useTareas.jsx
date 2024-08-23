import { useState, useEffect, useCallback, useContext } from 'react';
import Context from '../../context/abogados.context.jsx';
import getTareasUser from '../../views/tareas/getTareasUser.js';
import CompleteTarea from '../../views/tareas/CompleteTarea.js';
import StartTarea from '../../views/tareas/StartTarea.js';

export default function useTareas() {
    const { jwt } = useContext(Context);
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (jwt && jwt !== "" && jwt !== "null") {
            getTareasUser({ token: jwt })
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


    const startTarea = useCallback(async ({id, setOriginalExpedientes}) => {

        try {
            const responseStatus = await StartTarea({ id, token: jwt });
            if (responseStatus === 200) {
                setOriginalExpedientes([]);
                const expediente = await getTareasUser({token: jwt})
                setExpedientes(expediente);
            }
            return { success: responseStatus === 200 };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };;
        }
  }, [jwt]);
  
  const completeTarea = useCallback(async ({id, setOriginalExpedientes}) => {
    try {
        const responseStatus = await CompleteTarea({ id, token: jwt });
        if (responseStatus === 200) {
            setOriginalExpedientes([]);
            const expediente = await getTareasUser({token: jwt})
            setExpedientes(expediente);
        }
        return { success: responseStatus === 200 };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };;
    }
}, [jwt]);



    return { expedientes, loading, error, setExpedientes, startTarea, completeTarea };
}
