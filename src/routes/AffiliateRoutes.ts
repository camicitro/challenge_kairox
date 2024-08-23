import { Router } from "express";
import AffiliateController from "../controller/AffiliateController";
import AffiliateService from "../services/AffiliateService";
import Affiliate from "../models/AffiliateModel";

const affiliateService = new AffiliateService(Affiliate);
const affiliateController = new AffiliateController(affiliateService);

const affiliateRouter = Router();

affiliateRouter.put('/affiliates/desactivate/:dni', (req, res) => affiliateController.desactivateAffiliate(req, res))

export default affiliateRouter;