import { Router } from 'express';
import ProcessPaymentController from '../controllers/ProcessPaymenyController';


const router = Router();

// Ruta para procesar el archivo de pagos
router.post('/process', ProcessPaymentController.processFile);

export default router;
