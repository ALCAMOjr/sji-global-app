import { pool } from "../db.js"
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
 
export const createExpediente = async (req, res) => {
    try {
        let { Numero, Nombre, URL, Expediente } = req.body;
        const { userId } = req;

       
        Numero = parseInt(Numero, 10);

        if (!Numero || !Nombre) {
            return res.status(400).send({ error: 'Missing required fields: Numero and Nombre are required.' });
        }

        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).send({ error: 'Unauthorized' });
        }

        const [result] = await pool.query(
            'INSERT INTO expTribunalA (Numero, Nombre, URL, Expediente) VALUES (?, ?, ?, ?)',
            [Numero, Nombre, URL, Expediente]
        );

        const newExpedienteId = result.insertId;
        const [newExpediente] = await pool.query('SELECT * FROM expTribunalA WHERE Id = ?', [newExpedienteId]);
        if (newExpediente.length > 0) {
            res.status(200).send(newExpediente[0]);
        } else {
            res.status(404).send({ error: 'Expediente not found after creation' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while creating the expediente' });
    }
};


export const getAllExpedientes = async (req, res) => {
    try {
        const { userId } = req;
        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        const [expedientes] = await pool.query('SELECT * FROM expTribunalA');
        res.status(200).send(expedientes);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while retrieving expedientes' });
    }
};


export const getExpedienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req;
        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        const [expedientes] = await pool.query('SELECT * FROM expTribunalA WHERE Id = ?', [id]);
        if (expedientes.length > 0) {
            res.status(200).send(expedientes[0]);
        } else {
            res.status(404).send({ error: 'Expediente not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while retrieving the expediente' });
    }
};


export const updateExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        let { Numero, Nombre, URL, Expediente } = req.body;
        const { userId } = req;

        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).send({ error: 'Unauthorized' });
        }

        const [existingExpedientes] = await pool.query('SELECT * FROM expTribunalA WHERE Id = ?', [id]);
        if (existingExpedientes.length <= 0) {
            return res.status(404).send({ error: 'Expediente not found' });
        }

 
        const [result] = await pool.query(
            'UPDATE expTribunalA SET Numero = IFNULL(?, Numero), Nombre = IFNULL(?, Nombre), URL = IFNULL(?, URL), Expediente = IFNULL(?, Expediente) WHERE Id = ?',
            [Numero, Nombre, URL, Expediente, id]
        );

    
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Failed to update expediente' });
        }

        const [updatedExpedientes] = await pool.query('SELECT * FROM expTribunalA WHERE Id = ?', [id]);
        res.status(200).send(updatedExpedientes[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while updating the expediente' });
    }
};


export const deleteExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req;
        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).send({ error: 'Unauthorized' });
        }

        const [existingExpedientes] = await pool.query('SELECT * FROM expTribunalA WHERE Id = ?', [id]);
        if (existingExpedientes.length <= 0) {
            return res.status(404).send({ error: 'Expediente not found' });
        }

        const [result] = await pool.query('DELETE FROM expTribunalA WHERE Id = ?', [id]);

        if (result.affectedRows <= 0) {
            return res.status(404).send({ error: 'Failed to delete expediente' });
        }

        res.sendStatus(204); 
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while deleting the expediente' });
    }
};

