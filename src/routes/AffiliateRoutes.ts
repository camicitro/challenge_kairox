import { Router } from "express";
import AffiliateController from "../controllers/AffiliateController";
import AffiliateService from "../services/AffiliateService";
import Affiliate from "../models/AffiliateModel";
import { PaymentService } from "../services/PaymentService";
import Payment from "../models/PaymentModel";
import { EmailNotificationService } from "../services/EmailNotificationService";

const paymentService = new PaymentService(Payment)
const emailNotificationService = new EmailNotificationService();

const affiliateService = new AffiliateService(Affiliate, paymentService, emailNotificationService);
const affiliateController = new AffiliateController(affiliateService);

const affiliateRouter = Router();

//ver esto del :dni pq creo q no es tan seguro (sql injection)
affiliateRouter.put('/affiliates/deactivate/:dni', (req, res) => affiliateController.deactivateAffiliate(req, res))


//para pruebas despues borrar
affiliateRouter.get('/affiliates/unpaids', (req, res) => affiliateController.findAffiliatesWithUnpaid(req, res))

affiliateRouter.put('/affiliates/deactivateSome', (req, res) => affiliateController.deactivateNonPayingAffiliates(req, res));

export default affiliateRouter;