import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/expedientesSial/nombre';

export default async function getNombrebyNumero({ numero, token }) {
    console.log("Probando", numero, token);
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
        
        if (!response.data || !response.data.acreditado) {
            throw new Error('Expediente no encontrado');
        }

        console.log(response.data);
        return response.data.acreditado;

    } catch (error) {
        console.error("Error fetching nombre:", error);
        return null;
    }
}
