"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AffiliateController {
    constructor(affiliateService) {
        this.affiliateService = affiliateService;
    }
    async deactivateAffiliate(req, res) {
        try {
            const { dni } = req.params;
            const dniNumber = Number(dni);
            if (!dni) {
                return res.status(400).json({ message: 'Se necesita DNI para dar de baja' });
            }
            const desactivatedAffiliate = await this.affiliateService.deactivateAffiliate(dniNumber);
            if (!desactivatedAffiliate) {
                return res.status(404).json({ message: 'Afiliado no encontrado' });
            }
            return res.status(200).json({ message: 'Afiliado dado de baja exitosamente' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    async processAffiliatesDeactivation(req, res) {
        try {
            await this.affiliateService.processAffiliateDeactivation();
            return res.status(200).json({ message: 'Afiliados informados y dados de baja exitosamente' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    async findAffiliatesInLongTermDebt(req, res) {
        try {
            const affiliatesInDebt = await this.affiliateService.getAllAffiliatesInDebt();
            return res.status(200).json(affiliatesInDebt);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    async getAffiliateStatusCount(req, res) {
        try {
            const { dni } = req.params;
            if (!dni) {
                return res.status(400).json({ error: 'El DNI es requerido' });
            }
            const dniNumber = Number(dni);
            const payments = await this.affiliateService.getAffiliateStatusCount(dniNumber);
            if (payments.length > 0) {
                const formattedPayments = payments.map((payment) => ({
                    totalAmount: payment.getDataValue('totalAmount'),
                    referenceMonth: payment.getDataValue('referenceMonth'),
                    referenceYear: payment.getDataValue('referenceYear'),
                    paymentStatus: payment.getDataValue('paymentStatus'),
                }));
                return res.status(200).json({
                    message: 'Estado de cuenta del afiliado con DNI ' + dni,
                    payments: formattedPayments,
                });
            }
            else {
                return res.status(404).json({ error: `No existen pagos asociados al afiliado con el DNI: ${dni}` });
            }
        }
        catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor. ' + error.message });
        }
    }
}
exports.default = AffiliateController;
