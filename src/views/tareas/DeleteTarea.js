import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/tarea/delete';


export default async function DeleteTarea({ id, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(`${baseUrl}/${id}`, {}, config);
       
        if (response.status !== 204) {
            return response

        }

        return response.status;

    } catch (error) {
        console.error('Error doing DeleteTarea', error)
        throw error;
    }
}
