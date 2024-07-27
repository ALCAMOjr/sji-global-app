import { pool } from "../db.js";
import dotenv from 'dotenv';
import { format } from 'date-fns';
import { sendEmail } from '../helpers/Mailer.js';

dotenv.config();

export const createTask = async (req, res) => {
    try {
        const { exptribunalA_id, abogado_id, tarea, fecha_estimada_entrega, fecha_real_entrega, fecha_estimada_respuesta, observaciones, url } = req.body;
        const { userId } = req;

        if (!exptribunalA_id || !abogado_id || !fecha_estimada_entrega || !tarea) {
            return res.status(400).send({ error: 'Missing required fields: exptribunalA_id, abogado_id, fecha_estimada_entrega, and tarea are required.' });
        }
        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        const [abogados] = await pool.query('SELECT * FROM abogados WHERE id = ?', [abogado_id]);
        if (abogados.length <= 0) {
            return res.status(400).send({ error: 'Invalid abogado id' });
        }
        const abogado = abogados[0];
        const [expTribunalA] = await pool.query('SELECT * FROM expTribunalA WHERE id = ?', [exptribunalA_id]);
        if (expTribunalA.length <= 0) {
            return res.status(400).send({ error: 'Cannot assign a task to a non-existent expediente.' });
        }

        const fecha_registro = format(new Date(), 'yyyy-MM-dd');
        const [result] = await pool.query(
            'INSERT INTO Tareas (exptribunalA_id, url, abogado_id, tarea, fecha_registro, fecha_estimada_entrega, fecha_real_entrega, fecha_estimada_respuesta, estado_tarea, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [exptribunalA_id, url, abogado_id, tarea, fecha_registro, fecha_estimada_entrega, fecha_real_entrega, fecha_estimada_respuesta, 'Asignada', observaciones]
        );

        const newTareaId = result.insertId;
        const [newTarea] = await pool.query('SELECT * FROM Tareas WHERE id = ?', [newTareaId]);
        if (newTarea.length > 0) {
            const tarea = newTarea[0];
            const subject = 'Nueva tarea asignada';
            const text = `Hola ${abogado.nombre},\n\nSe te ha asignado una nueva tarea.\n\nTarea: ${tarea.tarea}\nFecha estimada de entrega: ${tarea.fecha_estimada_entrega}\n\nObservaciones: ${tarea.observaciones}\n\nSaludos,\nEquipo de Gestión de Tareas`;

            await sendEmail(abogado.email, subject, text);

            res.status(201).send(tarea);
        } else {
            res.status(404).send({ error: 'Tarea not found after creation' });
        }
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while creating the tarea', error });
    }
};

export const getTareasUser = async (req, res) => {
    try {
        const { abogado_id } = req.params;
        const { userId } = req;
        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        const user = users[0];
        const [abogados] = await pool.query('SELECT * FROM abogados WHERE id = ?', [abogado_id]);
        if (abogados.length <= 0) {
            return res.status(400).send({ error: 'Invalid abogado id' });
        }
        if (user.user_type !== 'coordinador' && user.id !== parseInt(abogado_id)) {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        const [tareas] = await pool.query('SELECT * FROM Tareas WHERE abogado_id = ?', [abogado_id]);
        if (tareas.length === 0) {
            return res.status(404).send({ message: 'No tasks found for this abogado' });
        }

        res.status(200).send(tareas);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while retrieving the tasks', details: error.message });
    }
};