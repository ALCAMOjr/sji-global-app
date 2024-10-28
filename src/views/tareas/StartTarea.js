import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/tarea/start';


export default async function StartTarea({ id, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(`${baseUrl}/${id}`, {}, config);

        if (response.status !== 200) {
            return response

        }
        return response.status;


    } catch (error) {
        console.error('Error doing StartTarea', error)
        throw error;
    }
}
