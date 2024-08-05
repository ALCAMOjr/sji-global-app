import React, { useState, createContext } from 'react';
import { jwtDecode } from "jwt-decode";

const Context = createContext({});

export function UserContextProvider({ children }) {
  const [jwt, setJWT] = useState(() => window.localStorage.getItem('jwt'));
  const [isCoordinador, setIsCoordinador] = useState(() => {
    const decodedToken = jwt && jwt !== "" && jwt !== "null" ? jwtDecode(jwt) : null; 
    return decodedToken && decodedToken.userForToken.userType === 'coordinador';
  });

  return (
    <Context.Provider value={{ jwt, setJWT, isCoordinador, setIsCoordinador }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
