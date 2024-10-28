import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:3000/api') + '/abogados/verify';

export default async function verifyToken(token) {
    try {
        const response = await axios.post(baseUrl, { token });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data.valid;

    } catch (error) {
        console.error(error('Error doing verifyToken'))
        throw error;
    }
}
