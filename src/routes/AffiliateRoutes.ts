import { Router } from "express";
import AffiliateController from "../controllers/AffiliateController";
import AffiliateService from "../services/AffiliateService";
import Affiliate from "../models/AffiliateModel";
import Payment from "../models/PaymentModel";

const affiliateService = new AffiliateService(Affiliate, Payment);
const affiliateController = new AffiliateController(affiliateService);

const affiliateRouter = Router();

affiliateRouter.put('/affiliates/deactivate/:dni', (req, res) => affiliateController.deactivateAffiliate(req, res))
affiliateRouter.get('/affiliate-status/:dni', (req, res) => affiliateController.getAffiliateStatusCount(req, res));
export default affiliateRouter;