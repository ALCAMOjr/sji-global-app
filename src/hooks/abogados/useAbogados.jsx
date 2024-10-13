import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/abogados.context.jsx';
import getAllAbogados from "../../views/abogados/getAbogados.js"
import { deleteAbogados, updateAbogados } from "../../views/abogados/optional.js";
import register from '../../views/abogados/register.js';

export default function useAbogados() {
    const { jwt } = useContext(Context);
    const [abogados, setAbogados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (jwt && jwt !== "" && jwt !== "null") {
        getAllAbogados({ token: jwt })
          .then(data => {
            setAbogados(data);
            setLoading(false);
          })
          .catch(err => {
            setError(err);
            setLoading(false);
          });
      }
    }, [jwt]);
  
    const deteleAbogado = useCallback(async (id) => {
        try {
            const responseStatus = await deleteAbogados({ id, token: jwt });
            if (responseStatus === 204) {
                setAbogados(prevAbogados => prevAbogados.filter(abogado => abogado.id !== id));
            }
            return { success: responseStatus === 204 };
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 400 && err.response.data.error === 'Cannot delete abogado with active tasks') {
                return { success: false, error: 'El abogado tiene tareas pendientes sin completar' };
            }
            return { success: false, error: err.message || err };
        }
  }, [jwt]);
  
  
  const updateAbogado = useCallback(async ({ id, username, nombre, apellido, cedula, email, telefono, userType }) => {
      try {
          const updatedAbogado = await updateAbogados({ id, username, nombre, apellido, cedula, email, telefono, userType, token: jwt });
          setAbogados(prevAbogados => prevAbogados.map(abogado => abogado.id === id ? updatedAbogado : abogado));
          return { success: true, data: updatedAbogado }; 
      } catch (err) {
          console.error(err);
          return { success: false, error: err };
      }
  }, [jwt]);

  const registerNewAbogado = useCallback(async ({ username, userType, nombre, apellido, cedula, email, telefono }) => {
    try {
        const newAbogado = await register({ username, userType, nombre, apellido, cedula, email, telefono, token: jwt });
        setAbogados(prevAbogados => [...prevAbogados, newAbogado]);
        return { success: true, data: newAbogado };
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.error === 'Username already exists') {
            return { success: false, error: 'El nombre de usuario ya existe' };
        
        } else if  (error.response && error.response.status === 400 && error.response.data.error === 'Email is already registered') {
            return { success: false, error: 'El correo ya esta en uso' };
        } else if  (error.response && error.response.status === 400 && error.response.data.error === 'Email must end with @sjiglobal.com in production environment') {
            return { success: false, error: 'Email debe terminar con @sjiglobal.com' };
        
        } else {
            console.error(error);
            return { success: false, error: error };
        }
    }
}, [jwt]);



  
  return { abogados, loading, error, deteleAbogado, updateAbogado, registerNewAbogado };
  
  }
  




  