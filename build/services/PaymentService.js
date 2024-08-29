"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const PaymentStateEnum_1 = require("../types/PaymentStateEnum");
class PaymentService {
    constructor(paymentModel) {
        this.paymentModel = paymentModel;
    }
    async checkExistingPayments(referenceMonth, referenceYear) {
        try {
            const existingPayments = await this.paymentModel.findAll({
                where: {
                    referenceMonth: referenceMonth,
                    referenceYear: referenceYear,
                },
            });
            return existingPayments.length > 0;
        }
        catch (error) {
            throw new Error('Error al verificar pagos existentes: ' + error.message);
        }
    }
    async createPayment(paymentData) {
        try {
            const newPayment = await this.paymentModel.create({
                totalAmount: paymentData.totalAmount,
                paymentStatus: paymentData.paymentStatus,
                referenceMonth: paymentData.referenceMonth,
                referenceYear: paymentData.referenceYear,
                affiliateId: paymentData.affiliateId,
            });
            return newPayment;
        }
        catch (error) {
            throw new Error('La creación de pago falló: ' + error.message);
        }
    }
    async getAllPaymentsByAffiliateId(affiliateId) {
        try {
            const payments = await this.paymentModel.findAll({
                where: {
                    affiliateId: affiliateId
                }
            });
            return payments;
        }
        catch (error) {
            throw new Error('Error buscando los pagos');
        }
    }
    async hasLatePayments(affiliateId) {
        try {
            const unpaidPaymentsObjectsArray = await this.getAllUnpaids(affiliateId);
            const yearMonthArray = this.transformYearMonth(unpaidPaymentsObjectsArray);
            const hasConsecutiveUnpaids = this.hasConsecutiveUnpaids(yearMonthArray);
            return hasConsecutiveUnpaids;
        }
        catch (error) {
            throw new Error('Error buscando meses consecutivos impagos');
        }
    }
    hasConsecutiveUnpaids(yearPlusMonth) {
        let consecutive = 1;
        for (let i = 0; i < yearPlusMonth.length - 1; i++) {
            const currentDate = yearPlusMonth[i];
            const nextDate = yearPlusMonth[i + 1];
            if (nextDate === currentDate + 1 || nextDate - currentDate === 89) {
                consecutive++;
                if (consecutive >= 3) {
                    return true;
                }
            }
            else {
                consecutive = 1;
            }
        }
        return false;
    }
    transformYearMonth(unpaidPayments) {
        const yearPlusMonthArray = [];
        for (const payment of unpaidPayments) {
            const month = payment.referenceMonth.toString().padStart(2, '0');
            const year = payment.referenceYear.toString();
            const yearPlusMonth = Number(year + month);
            yearPlusMonthArray.push(yearPlusMonth);
        }
        return yearPlusMonthArray;
    }
    async getAllUnpaids(affiliateId) {
        try {
            const unpaidPayments = await this.paymentModel.findAll({
                where: {
                    affiliateId: affiliateId,
                    paymentStatus: PaymentStateEnum_1.PaymentStatus.UNPAID,
                },
                attributes: ['referenceYear', 'referenceMonth'],
                group: ['referenceYear', 'referenceMonth'],
                order: [['referenceYear', 'ASC'], ['referenceMonth', 'ASC']]
            });
            const unpaidPaymentsObjectsArray = unpaidPayments.map(payment => ({
                referenceYear: payment.getDataValue('referenceYear'),
                referenceMonth: payment.getDataValue('referenceMonth')
            }));
            return unpaidPaymentsObjectsArray;
        }
        catch (error) {
            throw new Error('Error buscando meses impagos');
        }
    }
    isInLongTermDebt(unpaidPayments) {
        if (unpaidPayments.length < 3)
            return [];
        const consecutivePayments = [];
        let temporalConsecutive = [];
        for (let i = 0; i < unpaidPayments.length; i++) {
            const nextPayment = unpaidPayments[i + 1];
            const currentPayment = unpaidPayments[i];
            if (temporalConsecutive.length == 0) {
                temporalConsecutive.push(currentPayment);
            }
            if (nextPayment) {
                const isSameYear = currentPayment.referenceYear === nextPayment.referenceYear;
                const isNextMonth = currentPayment.referenceMonth + 1 === nextPayment.referenceMonth;
                const isNextYearButJanuary = currentPayment.referenceYear + 1 === nextPayment.referenceYear && currentPayment.referenceMonth === 12 && nextPayment.referenceMonth === 1;
                if (isSameYear && isNextMonth || isNextYearButJanuary) {
                    temporalConsecutive.push(nextPayment);
                }
                else {
                    if (temporalConsecutive.length > 3) {
                        consecutivePayments.push(...temporalConsecutive);
                    }
                    temporalConsecutive = [];
                }
            }
            else {
                if (temporalConsecutive.length > 3) {
                    consecutivePayments.push(...temporalConsecutive);
                }
            }
        }
        return consecutivePayments;
    }
}
exports.PaymentService = PaymentService;
