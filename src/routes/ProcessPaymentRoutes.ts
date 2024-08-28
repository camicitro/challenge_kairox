import { Router } from 'express';
import ProcessPaymentController from '../controllers/ProcessPaymenyController';
import { ProcessPaymentService } from '../services/ProcessPaymentService';
import { PaymentService } from '../services/PaymentService';
import AffiliateService from '../services/AffiliateService';
import Payment from '../models/PaymentModel';
import Affiliate from '../models/AffiliateModel';
import multer from 'multer';
import { EmailNotificationService } from '../services/EmailNotificationService';


const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/', 
        filename: (req, file, cb) => {
            cb(null, file.originalname); 
        }
    })
});

const router = Router();

const paymentService = new PaymentService(Payment); 
const emailNotificationService = new EmailNotificationService();
const affiliateService = new AffiliateService(Affiliate, paymentService, emailNotificationService);

const processPaymentService = new ProcessPaymentService(paymentService, affiliateService)
const processPaymentController = new ProcessPaymentController(processPaymentService);


router.post('/processFile', upload.single('file'), async (req, res) => processPaymentController.processFile(req, res));

export default router;
