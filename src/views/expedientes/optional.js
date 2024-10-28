import axios from "axios";

// Obtener la URL base de la variable de entorno o usar la URL local por defecto
const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4004/api') + '/expedientes';


export async function updateExpedientes({ numero, nombre, url, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.patch(`${baseUrl}/${numero}`, {
            nombre,
            url
        }, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error(error('Error doing UpdateExpedientes'))
        throw error;
    }
}


export async function updateAllExpedientes({ token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.patch(`${baseUrl}/`, {
         
        }, config);

        if (response.status !== 202) {
            throw new Error('Response is NOT ok');
        }
        return response.data;

    } catch (error) {
        console.error(error('Error doing updateAllExpedientes'))
        throw error;
    }
}


export async function getExpedienteJobStatus({ token, jobId }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.get(`${baseUrl}/status/${jobId}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data; 

    } catch (error) {
        console.error(error('Error doing getExpedienteJobStatus'))
        throw error;
    }
}


export async function deleteExpedientes({numero, token}) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.delete(`${baseUrl}/${numero}`, config);

        if (response.status !== 204) {
            throw new Error('Response is NOT ok');
        }

        return response.status;

    } catch (error) {
        console.error(error('Error doing deleteExpedientes'))
        throw error;
    }
}
