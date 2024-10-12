import { useContext, useState, useEffect } from 'react';
import Context from '../../context/abogados.context.jsx';
import getAllFiltros from '../../views/filtros/getAllFiltros.js';

export default function useFiltros() {
    const { jwt } = useContext(Context);
    const [filtros, setFiltros] = useState([]);
    const [filtros_loading, setLoading] = useState(true);
    const [filtros_error, setError] = useState(null);
  
    useEffect(() => {
      if (jwt && jwt !== "" && jwt !== "null") {
        getAllFiltros({ token: jwt })
          .then(data => {
            setFiltros(data);
            setLoading(false);
          })
          .catch(err => {
            setError(err);
            setLoading(false);
          });
      }
    }, [jwt]);

    return { filtros, filtros_loading, filtros_error };
}
