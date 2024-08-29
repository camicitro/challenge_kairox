"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AffiliateController_1 = __importDefault(require("../controllers/AffiliateController"));
const AffiliateService_1 = __importDefault(require("../services/AffiliateService"));
const AffiliateModel_1 = __importDefault(require("../models/AffiliateModel"));
const PaymentService_1 = require("../services/PaymentService");
const PaymentModel_1 = __importDefault(require("../models/PaymentModel"));
const EmailNotificationService_1 = require("../services/EmailNotificationService");
const paymentService = new PaymentService_1.PaymentService(PaymentModel_1.default);
const emailNotificationService = new EmailNotificationService_1.EmailNotificationService();
const affiliateService = new AffiliateService_1.default(AffiliateModel_1.default, paymentService, emailNotificationService);
const affiliateController = new AffiliateController_1.default(affiliateService);
const affiliateRouter = (0, express_1.Router)();
affiliateRouter.put('/affiliates/deactivate/:dni', (req, res) => affiliateController.deactivateAffiliate(req, res));
affiliateRouter.put('/affiliates/deactivateAffiliates', (req, res) => affiliateController.processAffiliatesDeactivation(req, res));
affiliateRouter.get('/affiliates/affiliatesInDebt', (req, res) => affiliateController.findAffiliatesInLongTermDebt(req, res));
/**
 * @swagger
 * /affiliate/affiliate-status/{dni}:
 *   get:
 *     summary: Obtener estado de cuenta de un afiliado
 *     tags: [Affiliate]
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: integer
 *         required: true
 *         description: DNI del afiliado
 *     responses:
 *       200:
 *         description: Lista de pagos del afiliado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado de cuenta del afiliado con DNI 48693550
 *                 payments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       totalAmount:
 *                         type: number
 *                         example: 1000
 *                       referenceMonth:
 *                         type: integer
 *                         example: 7
 *                       referenceYear:
 *                         type: integer
 *                         example: 2024
 *                       paymentStatus:
 *                         type: string
 *                         example: paid
 *       404:
 *         description: Afiliado no encontrado o sin pagos
 */
affiliateRouter.get('/affiliates/affiliate-status/:dni', (req, res) => affiliateController.getAffiliateStatusCount(req, res));
exports.default = affiliateRouter;
