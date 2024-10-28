import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/position/tribunal/filtro/multiple';

export default async function getPositionFilteredRecords({ desde, hasta, juzgado, etapa, termino, notificacion, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const url = `${baseUrl}?desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}&juzgado=${encodeURIComponent(juzgado || '')}&etapa=${encodeURIComponent(etapa || '')}&termino=${encodeURIComponent(termino || '')}&notificacion=${encodeURIComponent(notificacion || '')}`;

        const response = await axios.get(url, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error('Error doing Updat getPositionFilteredRecords', error)
        throw error;
    }
}