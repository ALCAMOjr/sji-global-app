import axios from "axios";

const copomexUrl = import.meta.env.VITE_COPOMEX_API;
const TOKEN_COPOMEX_AUTH = import.meta.env.VITE_TOKEN_COPOMEX_AUTH;

export const getMunicipalitiesByState = async (state) => {
  const url = copomexUrl
    .replace('{metodo}', 'get_municipio_por_estado')
    .replace('{busqueda}', encodeURIComponent(state))
    .replace('{token}', TOKEN_COPOMEX_AUTH);

  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Something went wrong', error);
    throw error;
  }
};
