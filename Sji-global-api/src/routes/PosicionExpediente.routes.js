import { getPositionExpedientes } from "../controllers/PosicionExpediente.controller.js";
import { Router } from "express";
import abogadoExtractor from '../middleware/abogadoExtractor.js';

const router = Router();

router.get('/position', abogadoExtractor, getPositionExpedientes);


export default router;
