import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:3000/api') + '/juzgados';

export default async function getAllJuzgados({ token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.get(baseUrl, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error('Error doing getAllJuzgados', error)
        throw error;
    }
}
