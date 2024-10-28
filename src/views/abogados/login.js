import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:3000/api') + '/abogados/login';

export default async function login_user({ username, password }) {

    try {

        const response = await axios.post(baseUrl, {
            username,
            password
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        const { token } = response.data; 
        return { token };

    } catch (error) {
        console.error(error('Error doing Login'))
        throw error;
       
    }
}
