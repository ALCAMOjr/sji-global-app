import axios from "axios";

const copomexUrl = import.meta.env.VITE_COPOMEX_API;
const TOKEN_COPOMEX_AUTH = import.meta.env.VITE_TOKEN_COPOMEX_AUTH;

export const getStates = async () => {
  const url = copomexUrl
    .replace('{metodo}', 'get_estados')
    .replace('/{busqueda}', '')
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
