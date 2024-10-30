import axios from "axios";

const copomexUrl = import.meta.env.VITE_COPOMEX_API;
const TOKEN_COPOMEX_AUTH = import.meta.env.VITE_TOKEN_COPOMEX_AUTH;

export const getCP = async (estado, municipio, colonia) => {
  const url = copomexUrl
    .replace('{metodo}', 'search_cp_advanced')
    .replace('{busqueda}', encodeURIComponent(estado))
    .replace('?token={token}', '') 
    .concat(
      `?limit=10&municipio=${encodeURIComponent(municipio)}&colonia=${encodeURIComponent(colonia)}&token=${TOKEN_COPOMEX_AUTH}`
    );
  try {
    const response = await axios.get(url);
    const data = response.data;

    return data;
  } catch (error) {
    console.error('Error getting CP:', error);
    throw error;
  }
};
