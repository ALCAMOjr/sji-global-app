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

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
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

        const response = await axios.delete(`${baseUrl}/${numero.numero}`, config);

        if (response.status !== 204) {
            throw new Error('Response is NOT ok');
        }

        return response.status;

    } catch (error) {
        throw error;
    }
}
