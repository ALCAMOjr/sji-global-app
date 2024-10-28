import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:3000/api') + '/abogados/register';

export default async function register({ username, userType, nombre, apellido, cedula, email, telefono, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(baseUrl, {
            username,
            userType,
            nombre,
            apellido,
            cedula,
            email,
            telefono

        }, config);

        if (response.status !== 201) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        console.error(error('Error doing registers'))
        throw error;
    }
}
