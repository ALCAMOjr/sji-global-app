import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:4000/api') + '/numberToWords/pesos';

export default async function getNumberToWordsPesos({ number, token }) {
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
        console.error('Error doing getNUmberToWordsPesos', error)
        throw error;
    }
}