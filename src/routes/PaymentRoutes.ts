import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { PaymentService } from '../services/PaymentService';
import Payment from '../models/PaymentModel';

const router = Router();
const paymentService = new PaymentService(Payment)
const paymentController = new PaymentController(paymentService);

router.post('/payments', (req, res) => paymentController.createPayment(req, res));

//borrar (es para pruebas)
router.get('/payments/consecutive', (req, res) => paymentController.hasConsecutive(req, res));
router.get('/payments/unpaidsss', (req, res) => paymentController.searchUnpaids(req, res));

export default router;
