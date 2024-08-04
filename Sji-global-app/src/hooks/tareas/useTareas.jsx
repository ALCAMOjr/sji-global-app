import { useState, useEffect, useCallback, useContext } from 'react';
import Context from '../../context/abogados.context.jsx';
import getTareasUser from '../../views/tareas/getTareasUser.js';

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


    return { expedientes, loading, error };
}
