"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createPayment(req, res) {
        try {
            const paymentData = req.body;
            const payment = await this.paymentService.createPayment(paymentData);
            return res.status(201).json({ message: 'Pago creado exitosamente. ', payment });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
    ;
}
exports.PaymentController = PaymentController;
