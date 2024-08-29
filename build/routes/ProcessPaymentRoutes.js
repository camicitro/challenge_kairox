"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProcessPaymenyController_1 = __importDefault(require("../controllers/ProcessPaymenyController"));
const ProcessPaymentService_1 = require("../services/ProcessPaymentService");
const PaymentService_1 = require("../services/PaymentService");
const AffiliateService_1 = __importDefault(require("../services/AffiliateService"));
const PaymentModel_1 = __importDefault(require("../models/PaymentModel"));
const AffiliateModel_1 = __importDefault(require("../models/AffiliateModel"));
const multer_1 = __importDefault(require("multer"));
const EmailNotificationService_1 = require("../services/EmailNotificationService");
const AuditFile_1 = __importDefault(require("../models/AuditFile"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});
const router = (0, express_1.Router)();
const paymentService = new PaymentService_1.PaymentService(PaymentModel_1.default);
const emailNotificationService = new EmailNotificationService_1.EmailNotificationService();
const affiliateService = new AffiliateService_1.default(AffiliateModel_1.default, paymentService, emailNotificationService);
const processPaymentService = new ProcessPaymentService_1.ProcessPaymentService(paymentService, affiliateService, AuditFile_1.default);
const processPaymentController = new ProcessPaymenyController_1.default(processPaymentService);
router.post('/processFile', upload.single('file'), async (req, res) => processPaymentController.processFile(req, res));
exports.default = router;
