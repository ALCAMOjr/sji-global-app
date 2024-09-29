import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/expedientes/upload-csv';

export default async function UploadFile({ files, token, isUpdatable }) {
  try {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file); 
    });

    formData.append('isUpdatable', isUpdatable);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    };

    const response = await axios.post(baseUrl, formData, config);

    if (response.status !== 200 && response.status !== 202) {
      throw new Error('Response is NOT ok');
    }

    return response.data;

  } catch (error) {
    console.error('Error al cargar archivos:', error);
    throw error;
  }
}
