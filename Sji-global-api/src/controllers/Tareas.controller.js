import { pool } from "../db.js"
import dotenv from 'dotenv'
import { format } from 'date-fns';
dotenv.config()


export const createTask = async (req, res) => {
    try {
        const { expTribunalA_Id, Abogado_ID, Tarea, Fecha_Estimada_Entrega, Fecha_Real_Entrega, Fecha_Estimada_Respuesta, Estado_Tarea, Observaciones, URL } = req.body;
        const { userId } = req;

        if (!expTribunalA_Id || !Abogado_ID || !Fecha_Estimada_Entrega || !Tarea) {
            return res.status(400).send({ error: 'Missing required fields: expTribunalA_Id, Abogado_ID, Fecha_Estimada_Entrega, and Tarea are required.' });
        }

        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).send({ error: 'Unauthorized' });
        }

        const [abogados] = await pool.query('SELECT * FROM abogados WHERE id = ?', [Abogado_ID]);
        if (abogados.length <= 0) {
            return res.status(400).send({ error: 'Invalid abogado id' });
        }
        const [expTribunalA] = await pool.query('SELECT * FROM expTribunalA WHERE Id = ?', [expTribunalA_Id]);
        if (expTribunalA.length <= 0) {
            return res.status(400).send({ error: 'Cannot assign a task to a non-existent expediente.' });
        }

        const Fecha_Registro = format(new Date(), 'yyyy-MM-dd');
        console.log(Fecha_Registro);
        const [result] = await pool.query(
            'INSERT INTO Tareas (expTribunalA_Id, URL, Abogado_ID, Tarea, Fecha_Registro, Fecha_Estimada_Entrega, Fecha_Real_Entrega, Fecha_Estimada_Respuesta, Estado_Tarea, Observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [expTribunalA_Id, URL, Abogado_ID, Tarea, Fecha_Registro, Fecha_Estimada_Entrega, Fecha_Real_Entrega, Fecha_Estimada_Respuesta, Estado_Tarea, Observaciones]
        );

        const newTareaId = result.insertId;
        const [newTarea] = await pool.query('SELECT * FROM Tareas WHERE Id = ?', [newTareaId]);
        if (newTarea.length > 0) {
            res.status(201).send(newTarea[0]);
        } else {
            res.status(404).send({ error: 'Tarea not found after creation' });
        }
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while creating the tarea' });
    }
};