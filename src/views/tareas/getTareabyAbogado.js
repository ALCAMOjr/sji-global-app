import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/tarea';

export default async function getTareaByAbogado({ username, token }) {

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };


        const response = await axios.get(`${baseUrl}/${username}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }


        return response.data;

    } catch (error) {
        throw error;
    }
}
