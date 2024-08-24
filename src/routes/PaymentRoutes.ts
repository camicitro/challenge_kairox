// payment.route.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { PaymentService } from '../services/PaymentService';
import Payment from '../models/PaymentModel';

const router = Router();
const paymentService = new PaymentService(Payment)
const paymentController = new PaymentController(paymentService);

router.post('/payments', paymentController.createPayment);

export default router;
