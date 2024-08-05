import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/tarea/cancel';


export default async function CancelTarea({ id, token }) {
    console.log(baseUrl)

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(`${baseUrl}/${id}`, {}, config);
        console.log("responde", response)

        if (response.status !== 200) {
            return response

        }

        return response.status;

    } catch (error) {
        throw error;
    }
}
