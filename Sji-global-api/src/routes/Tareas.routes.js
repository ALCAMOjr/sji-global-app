import { createTask } from "../controllers/Tareas.controller.js";
import { Router } from "express";
import abogadoExtractor from '../middleware/abogadoExtractor.js';

const router = Router();

router.post('/tarea/create', abogadoExtractor, createTask);



export default router;
