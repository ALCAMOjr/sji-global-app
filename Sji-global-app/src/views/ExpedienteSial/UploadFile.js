import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/expedientesSial/upload-csv';

export default async function UploadFile({ file, token }) {
    try {
        const formData = new FormData();
        formData.append('file', file); 

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data" 
            }
        };

        const response = await axios.post(baseUrl, formData, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        throw error;
    }
}
