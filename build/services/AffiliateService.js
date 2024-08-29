"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AffiliateModel_1 = __importDefault(require("../models/AffiliateModel"));
class AffiliateService {
    constructor(affiliateModel, paymentService, emailNotificationService) {
        this.affiliateModel = affiliateModel;
        this.paymentService = paymentService;
        this.emailNotificationService = emailNotificationService;
    }
    async deactivateAffiliate(affiliateDni) {
        try {
            const affiliate = await this.findAffiliateByDni(affiliateDni);
            if (!affiliate) {
                //console.error('No existe el afiliado o está dado de baja');
                return false;
            }
            else {
                const affiliationEndDate = new Date();
                await affiliate.update({ affiliationEndDate: affiliationEndDate }, { where: { affiliateDni: affiliateDni } });
                return true;
            }
        }
        catch (_a) {
            throw new Error('Error dando de baja afiliado');
        }
    }
    async findAffiliateByDni(affiliateDni) {
        try {
            const affiliate = await this.affiliateModel.findOne({
                where: {
                    affiliateDni,
                    affiliationEndDate: null,
                }
            });
            return affiliate;
        }
        catch (error) {
            throw new Error('Error buscando afiiado');
        }
    }
    async findAffiliateIdByDni(affiliateDni) {
        try {
            const affiliate = await AffiliateModel_1.default.findOne({
                where: {
                    affiliateDni,
                    affiliationEndDate: null,
                }
            });
            if (affiliate) {
                return affiliate.getDataValue('Id');
            }
            else {
                throw new Error('No existe afiliado con ese dni');
            }
        }
        catch (error) {
            throw new Error('Error buscando el id del afiliado');
        }
    }
    async findAllAffiliatesDnis() {
        try {
            const affiliatesDnisObjects = await AffiliateModel_1.default.findAll({
                attributes: ['affiliateDni'],
                where: { affiliationEndDate: null, }
            });
            const affiliateDnisArray = affiliatesDnisObjects.map(affiliate => affiliate.getDataValue('affiliateDni'));
            return affiliateDnisArray;
        }
        catch (error) {
            throw new Error('Error al buscar afiliados' + error.message);
        }
    }
    //BONUS TRACK ESTADO DE CUENTA
    async getAffiliateStatusCount(affiliateDni) {
        try {
            const affiliateId = await this.findAffiliateIdByDni(affiliateDni);
            if (!affiliateId) {
                throw new Error('No existe un afiliado con ese DNI o la afiliación ha terminado.');
            }
            const payments = await this.paymentService.getAllPaymentsByAffiliateId(affiliateId);
            if (payments.length > 0) {
                console.log('----------ESTADO DE CUENTA DEL AFILIADO CON DNI' + affiliateDni + '----------');
                for (const payment of payments) {
                    console.log('Monto Total: ' + payment.getDataValue('totalAmount'));
                    console.log('Mes de Referencia del pago: ' + payment.getDataValue('referenceMonth'));
                    console.log('Año de Referencia del pago: ' + payment.getDataValue('referenceYear'));
                    console.log('Estado del pago: ' + payment.getDataValue('paymentStatus'));
                    console.log('-----------------------------------------------------------------------');
                }
                return payments;
            }
            else {
                throw new Error(`No existen pagos asociados al afiliado con el DNI: ${affiliateDni}`);
            }
        }
        catch (error) {
            throw new Error('Error al obtener el estado de cuenta del afiliado: ' + error.message);
        }
    }
    async findAffiliatesWithUpaidPayments() {
        try {
            const affiliates = await this.affiliateModel.findAll({
                where: {
                    affiliationEndDate: null
                },
                attributes: ['affiliateDni']
            });
            const allAffiliatesDnisArray = affiliates.map(affiliate => (affiliate.getDataValue('affiliateDni')));
            const affiliatesLatePayments = [];
            for (const affiliateDni of allAffiliatesDnisArray) {
                const affiliate = await this.findAffiliateByDni(affiliateDni);
                const affiliateId = affiliate === null || affiliate === void 0 ? void 0 : affiliate.getDataValue('Id');
                const hasLatePayments = await this.paymentService.hasLatePayments(affiliateId);
                if (hasLatePayments) {
                    affiliatesLatePayments.push(affiliateDni);
                }
            }
            return affiliatesLatePayments;
        }
        catch (error) {
            throw new Error('Error buscando afiiados con 3 meses de pagos impagos');
        }
    }
    async deactivateNonPayingAffiliates(affiliatesDnis) {
        try {
            for (const affiliateDni of affiliatesDnis) {
                const deactivate = await this.deactivateAffiliate(affiliateDni);
            }
        }
        catch (_a) {
            throw new Error('Error dando de baja afiliados');
        }
    }
    async findNonPayingAffiliatesEmails(affiliateDnis) {
        try {
            const affiliateEmails = [];
            for (const affiliateDni of affiliateDnis) {
                const affiliate = await this.findAffiliateByDni(affiliateDni);
                if (affiliate) {
                    affiliateEmails.push(affiliate.getDataValue('affiliateEmail'));
                }
            }
            return affiliateEmails;
        }
        catch (_a) {
            throw new Error('Error buscando mails');
        }
    }
    async processAffiliateDeactivation() {
        try {
            const inactiveAffiliatesDnis = await this.findAffiliatesWithUpaidPayments();
            if (inactiveAffiliatesDnis.length <= 0) {
                return;
            }
            const inactiveAffiliatesEmails = await this.findNonPayingAffiliatesEmails(inactiveAffiliatesDnis);
            await this.emailNotificationService.sendEmail(inactiveAffiliatesEmails);
            await this.deactivateNonPayingAffiliates(inactiveAffiliatesDnis);
        }
        catch (_a) {
            throw new Error('Error en el proceso de baja');
        }
    }
    async getAllAffiliates() {
        try {
            const affiliates = await this.affiliateModel.findAll();
            return affiliates;
        }
        catch (_a) {
            throw new Error('Error buscando afiliados');
        }
    }
    async getAllAffiliatesInDebt() {
        try {
            const affiliates = await this.getAllAffiliates();
            const affiliatesInDebt = [];
            for (const affiliate of affiliates) {
                const affiliateId = affiliate.getDataValue('Id');
                const allAffiliateUnpaidMonths = await this.paymentService.getAllUnpaids(affiliateId);
                const consecutiveAffiliateUnpaidMonths = this.paymentService.isInLongTermDebt(allAffiliateUnpaidMonths);
                if (consecutiveAffiliateUnpaidMonths.length > 0) {
                    affiliatesInDebt.push({
                        affiliateName: affiliate.getDataValue('affiliateName'),
                        affiliateDni: affiliate.getDataValue('affiliateDni'),
                        debts: consecutiveAffiliateUnpaidMonths
                    });
                }
            }
            return affiliatesInDebt;
        }
        catch (_a) {
            throw new Error('Error buscando afiliados endeudados');
        }
    }
}
exports.default = AffiliateService;
