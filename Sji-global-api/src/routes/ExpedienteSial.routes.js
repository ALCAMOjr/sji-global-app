import { Router } from 'express';
import multer from 'multer';
import { uploadAndConvertCsv, getExpedientesByNumero, getAllCreditsSial, getNombrebyNumero } from '../controllers/ExpedienteSial.js';
import abogadoExtractor from '../middleware/abogadoExtractor.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/expedientesSial/upload-csv', abogadoExtractor, upload.single('file'), uploadAndConvertCsv);
router.get('/expedientesSial/', abogadoExtractor, getAllCreditsSial);
router.get('/expedientesSial/:number', abogadoExtractor, getNombrebyNumero);
router.get('/expedientesSial/number/:number', abogadoExtractor, getExpedientesByNumero);

export default router;
