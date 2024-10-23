import axios from "axios";

const copomexUrl = import.meta.env.VITE_COPOMEX_API;
const TOKEN_COPOMEX_AUTH = import.meta.env.VITE_TOKEN_COPOMEX_AUTH;

export const getMunicipioNL = async () => {
  const url = copomexUrl
    .replace('{metodo}', 'get_municipio_por_estado')
    .replace('{busqueda}', 'Nuevo%20León')  
    .replace('{token}', TOKEN_COPOMEX_AUTH);
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Something was wrong', error);
    throw error;
  }
};


