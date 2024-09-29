import axios from "axios";

const baseUrl = (import.meta.env.VITE_API || 'http://localhost:3000/api') + '/abogados';

export async function updateAbogados({ id, username, nombre, apellido, cedula, email, telefono, userType, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.patch(`${baseUrl}/${id}`, {
            username,
            userType,
            nombre,
            apellido,
            cedula,
            email,
            telefono
        }, config);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data;

    } catch (error) {
        throw error;
    }
}

export async function deleteAbogados({ id, token }) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const response = await axios.delete(`${baseUrl}/${id}`, config);

        if (response.status !== 204) {
            throw new Error('Response is NOT ok');
        }

        return response.status;

    } catch (error) {
        throw error;
    }
}
