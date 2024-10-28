import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/position/fecha/';

export default async function getPositionByFecha({ fecha, token }) {

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const encodedFecha = encodeURIComponent(fecha);

        const response = await axios.get(`${baseUrl}${encodedFecha}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error(error('Error doing getPositionByFecha'))
        throw error;
    }
}
