import { Router } from "express";
import AffiliateController from "../controllers/AffiliateController";
import AffiliateService from "../services/AffiliateService";
import Affiliate from "../models/AffiliateModel";

const affiliateService = new AffiliateService(Affiliate);
const affiliateController = new AffiliateController(affiliateService);

const affiliateRouter = Router();

affiliateRouter.put('/affiliates/deactivate/:dni', (req, res) => affiliateController.deactivateAffiliate(req, res))

export default affiliateRouter;