import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/position/expediente';

export default async function getPositionByExpediente({ expediente, token }) {

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };


        const encodedExpediente = encodeURIComponent(expediente);

        const response = await axios.get(`${baseUrl}/${encodedExpediente}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error(error('Error doing getPositionByExpediente'))
        throw error;
    }
}
