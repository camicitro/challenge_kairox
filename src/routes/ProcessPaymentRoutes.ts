import { Router } from 'express';
import ProcessPaymentController from '../controllers/ProcessPaymenyController';
import { ProcessPaymentService } from '../services/ProcessPaymentService';
import { PaymentService } from '../services/PaymentService';
import AffiliateService from '../services/AffiliateService';
import Payment from '../models/PaymentModel';
import Affiliate from '../models/AffiliateModel';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

const paymentService = new PaymentService(Payment); 
const affiliateService = new AffiliateService(Affiliate);

const processPaymentService = new ProcessPaymentService(paymentService, affiliateService)
const processPaymentController = new ProcessPaymentController(processPaymentService);


router.post('/process', upload.single('file'), async (req, res) => processPaymentController.processFile(req, res));

export default router;
