import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../context/abogados.context.jsx';
import login_user from '../views/abogados/login.js'
import verifyToken from '../views/abogados/verifytoken.js';
import { jwtDecode } from "jwt-decode";

const user_coordinador = 'coordinador';

export default function useUser() {
  const { jwt, setJWT, isCoordinador, setIsCoordinador} = useContext(Context);
  const [state, setState] = useState({ loading: false, error: false });
  const [hasLoginError, setHasLoginError] = useState(false);

  const login = useCallback(({ username, password }) => {

    setHasLoginError(false);
    setState({ loading: true, error: false });
    login_user({ username, password })
      .then(response => {
        const token = response.token; 
        if (token) {
          const decodedToken = jwtDecode(token); 
          setIsCoordinador(decodedToken.userForToken.userType === user_coordinador);
          window.localStorage.setItem('jwt', token);
          setState({ loading: false, error: false });
          setJWT(token);
        } else {
          window.localStorage.removeItem('jwt');
          setIsCoordinador(false);
          setState({ loading: false, error: true });
          setHasLoginError(true);
        }
      })
      .catch(err => {
        window.localStorage.removeItem('jwt');
        setIsCoordinador(false);
        setState({ loading: false, error: true });
        setHasLoginError(true);
        console.error(err)
      });
  }, [setJWT, setIsCoordinador]); 
  

  const logout = useCallback(() => {
    window.localStorage.removeItem('jwt');
    setJWT(null);
    setIsCoordinador(false);
  }, [setJWT, setIsCoordinador]);

  useEffect(() => {
    const checkToken = async () => {
      if (jwt && jwt !== "" && jwt !== "null") {
        const isValid = await verifyToken(jwt);
        if (!isValid) {
          logout();
        }
      }
    };
  
    checkToken();
  }, [jwt, logout]);
  

  return {
    isLogged: Boolean(jwt) && jwt !== "" && jwt !== "null",
    isLoginLoading: state.loading,
    hasLoginError, 
    setHasLoginError, 
    login,
    logout,
    isCoordinador,
  };
}
