"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = require("../controllers/PaymentController");
const PaymentService_1 = require("../services/PaymentService");
const PaymentModel_1 = __importDefault(require("../models/PaymentModel"));
const router = (0, express_1.Router)();
const paymentService = new PaymentService_1.PaymentService(PaymentModel_1.default);
const paymentController = new PaymentController_1.PaymentController(paymentService);
router.post('/payments', (req, res) => paymentController.createPayment(req, res));
exports.default = router;
