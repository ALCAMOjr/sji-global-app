import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/fechaToWords';

export default async function getFechaToWords({ fecha, token }) {
    try {
        const encodedFecha = encodeURIComponent(fecha);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.get(`${baseUrl}/${encodedFecha}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data.words;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
