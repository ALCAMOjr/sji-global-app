import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/tarea/create';

export default async function createTarea({ exptribunalA_numero, abogado_id, tarea, fecha_entrega, observaciones,  token }) {

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
            observaciones,
        }, config);

        if (response.status !== 201) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error('Error doing createTarea', error)
        throw error;
    }
}
