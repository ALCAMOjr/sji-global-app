import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/tarea/expediente';

export default async function getTareaByExpediente({ numero, token }) {

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
        console.error(error('Error doing getTareaByExpediente'))
        throw error;
    }
}
