import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/demandaIycc';

export default async function createDemanda({ demandaData, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(baseUrl, demandaData, config);

        if (response.status !== 201 && response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error("Error creating the demanda", error);
        throw error;
    }
}
