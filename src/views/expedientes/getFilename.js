import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/expediente/pdf';

export default async function getFilename({ filename, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            responseType: 'blob' 
        };

        const response = await axios.get(`${baseUrl}/${filename}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

    
        return response.data; 

    } catch (error) {
        console.error(error('Error doing getFilename'))
        throw error;
    }
}
