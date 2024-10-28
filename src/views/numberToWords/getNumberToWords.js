import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/numberToWords';

export default async function getNumberToWords({ number, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.get(`${baseUrl}/${number}`, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }


        return response.data.words;

    } catch (error) {
        console.error(error('Error doing getNumberToWords'))
        throw error;
    }
}