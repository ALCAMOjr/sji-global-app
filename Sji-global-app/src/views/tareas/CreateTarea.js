import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/tarea/create';

export default async function createTarea({ exptribunalA_numero, abogado_id, tarea, fecha_entrega, fecha_estimada_respuesta, observaciones,  token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(baseUrl, {
            exptribunalA_numero, 
            abogado_id, tarea, 
            fecha_entrega, 
            fecha_estimada_respuesta, 
            observaciones,
        }, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        throw error;
    }
}
