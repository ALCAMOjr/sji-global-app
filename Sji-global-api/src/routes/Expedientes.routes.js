import { createExpediente, getAllExpedientes, getExpedienteById, deleteExpediente, updateExpediente } from "../controllers/Expediente.controller.js";
import { Router } from "express";
import abogadoExtractor from '../middleware/abogadoExtractor.js';

const router = Router();


router.post('/expedientes/create', abogadoExtractor, createExpediente);
router.get('/expedientes', abogadoExtractor, getAllExpedientes);
router.get('/expedientes/:id', abogadoExtractor, getExpedienteById);
router.patch('/expedientes/:id', abogadoExtractor, updateExpediente);
router.delete('/expedientes/:id', abogadoExtractor, deleteExpediente);

export default router;
