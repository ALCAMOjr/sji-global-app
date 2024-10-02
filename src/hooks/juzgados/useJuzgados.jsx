import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx';
import getAllJuzgados from '../../views/juzgados/getAllJuzgados.js';

export default function useJuzgados() {
    const { jwt } = useContext(Context);
    const [juzgados, setJuzgados] = useState([]);
    const [juzgados_loading, setLoading] = useState(true);
    const [juzgados_error, setError] = useState(null);
  
    useEffect(() => {
      if (jwt && jwt !== "" && jwt !== "null") {
        getAllJuzgados({ token: jwt })
          .then(data => {
            setJuzgados(data);
            setLoading(false);
          })
          .catch(err => {
            setError(err);
            setLoading(false);
          });
      }
    }, [jwt]);

  
  return { juzgados, juzgados_loading, juzgados_error };
  
  }
  




  