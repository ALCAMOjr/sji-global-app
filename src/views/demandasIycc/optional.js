import axios from "axios";

// Obtener la URL base de la variable de entorno o usar la URL local por defecto
const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4004/api') + '/demandaIycc';


export async function updateDemanda({ credito, demandaData, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };
        const response = await axios.patch(`${baseUrl}/${credito}`, demandaData, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error("Error updating the demanda:", error);
        throw error;
    }
}
export async function deleteDemanda({numero, token}) {
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
        console.error("Error deleting the demanda:", error);
        throw error;
    }
}
