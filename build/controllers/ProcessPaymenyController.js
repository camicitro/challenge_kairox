"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProcessPaymentController {
    constructor(processPaymentService) {
        this.processPaymentService = processPaymentService;
    }
    async processFile(req, res) {
        var _a;
        try {
            const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const { month, year } = req.body;
            if (!filePath || !month || !year) {
                return res.status(400).json({ error: 'Faltan parámetros necesarios: filePath, month, year' });
            }
            const processPaymentData = { month: parseInt(month), year: parseInt(year) };
            const processPayment = await this.processPaymentService.processFile(processPaymentData, filePath);
            return res.status(200).json({ message: 'Archivo procesado correctamente.' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor.' });
        }
    }
    ;
}
exports.default = ProcessPaymentController;
