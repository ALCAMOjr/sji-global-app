import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/expedientes/create';

export default async function createExpediente({ numero, nombre, url,  token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(baseUrl, {
            numero,
            nombre,
            url,
        }, config);

        if (response.status !== 201) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error('Error doing createExpediente', error )
        throw error;
    }
}
