import { createTask, getTareasUser, startTask, completeTask, getExpedientesConTareas, getTareasPorAbogado } from "../controllers/Tareas.controller.js";
import { Router } from "express";
import abogadoExtractor from '../middleware/abogadoExtractor.js';

const router = Router();

router.post('/tarea/create', abogadoExtractor, createTask);
router.get('/tarea', abogadoExtractor, getExpedientesConTareas);
router.post('/tarea/start/:taskId', abogadoExtractor, startTask);
router.post('/tarea/complete/:taskId', abogadoExtractor, completeTask);
router.get('/tarea/user', abogadoExtractor, getTareasUser);
router.get('/tarea/:abogado_username', abogadoExtractor, getTareasPorAbogado);


export default router;
