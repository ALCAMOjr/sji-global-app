import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/expedientes';

export default async function getExpedienteByNumero({ numero, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.get(`${baseUrl}/${numero}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error('Error doing getEpedienteByNumero', error) 
        throw error;
    }
}
