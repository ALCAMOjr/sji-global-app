import axios from "axios";

// Obtener la URL base de la variable de entorno o usar la URL local por defecto
const baseUrl = (import.meta.env.VITE_API || 'http://localhost:3001/api') + '/expedientes';


export async function updateExpedientes({ id, numero, nombre, url, expediente, juzgado, juicio, ubicacion, partes, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.patch(`${baseUrl}/${id}`, {
            numero,
            nombre,
            url,
            expediente,
            juzgado,
            juicio,
            ubicacion,
            partes,
        }, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        throw error;
    }
}


export async function deleteExpedientes({id, token}) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.delete(`${baseUrl}/${id.id}`, config);

        if (response.status !== 204) {
            throw new Error('Response is NOT ok');
        }

        return response.status;

    } catch (error) {
        throw error;
    }
}
