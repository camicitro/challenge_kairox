"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentService = void 0;
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const PaymentStateEnum_1 = require("../types/PaymentStateEnum");
const crypto_1 = __importDefault(require("crypto"));
class ProcessPaymentService {
    constructor(paymentService, affiliateService, auditFileModel) {
        this.paymentService = paymentService;
        this.affiliateService = affiliateService;
        this.auditFileModel = auditFileModel;
    }
    async processFile(processPaymentData, filePath) {
        try {
            const referenceMonth = processPaymentData.month;
            const referenceYear = processPaymentData.year;
            const fileContent = fs.readFileSync(filePath);
            const referenceHash = this.creatingHash(fileContent);
            const existsHash = await this.hashExists(referenceHash);
            if (existsHash) {
                throw new Error('El archivo subido ha sido ingresado anteriormente');
            }
            const newHash = this.createAuditFile({ referenceMonth, referenceYear, referenceHash });
            const existsPayments = await this.paymentService.checkExistingPayments(referenceMonth, referenceYear);
            if (existsPayments) {
                throw new Error('Pagos existentes para ese mes y año');
            }
            const { dnis: paidDnis, amounts } = await this.extractDnisAndAmountFromFile(filePath);
            const dnis = paidDnis;
            const paymentAmounts = amounts;
            const dnisAll = await this.affiliateService.findAllAffiliatesDnis();
            const dataMap = await this.createPaymentMap(dnis, dnisAll, paymentAmounts);
            const create = await this.createPayments(dataMap, processPaymentData.month, processPaymentData.year);
            if (create) {
                console.log('Pagos procesados correctamente. ');
            }
            fs.unlinkSync(filePath);
        }
        catch (error) {
            throw new Error('Error al procesar pago: ' + error.message);
        }
    }
    async extractDnisAndAmountFromFile(filePath) {
        var _a, e_1, _b, _c;
        try {
            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            const paidDnis = [];
            const amounts = [];
            try {
                for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = await rl_1.next(), _a = rl_1_1.done, !_a; _d = true) {
                    _c = rl_1_1.value;
                    _d = false;
                    const line = _c;
                    const affiliateFields = line.split('|');
                    const affiliateDni = Number(affiliateFields[0]);
                    paidDnis.push(affiliateDni);
                    const paymentAmount = Number(affiliateFields[14]);
                    amounts.push(paymentAmount);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = rl_1.return)) await _b.call(rl_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return { dnis: paidDnis, amounts: amounts };
        }
        catch (error) {
            throw new Error('Error al extraer dnis y montos. ' + error.message);
        }
    }
    async createPaymentMap(paidDnis, dnisAll, amountsAll) {
        var _a, e_2, _b, _c;
        try {
            const data = new Map();
            try {
                for (var _d = true, dnisAll_1 = __asyncValues(dnisAll), dnisAll_1_1; dnisAll_1_1 = await dnisAll_1.next(), _a = dnisAll_1_1.done, !_a; _d = true) {
                    _c = dnisAll_1_1.value;
                    _d = false;
                    const line1 = _c;
                    if (paidDnis.includes(line1)) {
                        const index = paidDnis.indexOf(line1);
                        data.set(line1, { amount: amountsAll[index], status: PaymentStateEnum_1.PaymentStatus.PAID });
                    }
                    else {
                        data.set(line1, { amount: 0, status: PaymentStateEnum_1.PaymentStatus.UNPAID });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = dnisAll_1.return)) await _b.call(dnisAll_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return data;
        }
        catch (error) {
            throw new Error('Error al crear pagos: ' + error.message);
        }
    }
    async createPayments(dataMap, month, year) {
        var _a, e_3, _b, _c;
        const referenceYear = year;
        const referenceMonth = month;
        try {
            try {
                for (var _d = true, _e = __asyncValues(dataMap.entries()), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [dni, paymentData] = _c;
                    const affiliateId = await this.affiliateService.findAffiliateIdByDni(dni);
                    const totalAmount = paymentData.amount;
                    const paymentStatus = paymentData.status;
                    this.paymentService.createPayment({ totalAmount, paymentStatus, referenceYear, referenceMonth, affiliateId });
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return true;
        }
        catch (error) {
            throw new Error('Error creando pagos. ' + error.message);
        }
    }
    creatingHash(file) {
        const hash = crypto_1.default.createHash('sha256').update(file).digest('hex');
        return hash;
    }
    async hashExists(hash) {
        const existingFile = await this.auditFileModel.findOne({ where: {
                referenceHash: hash
            } });
        if (existingFile) {
            return true;
        }
        return false;
    }
    async createAuditFile(auditFile) {
        const newAuditFile = this.auditFileModel.create({
            referenceMonth: auditFile.referenceMonth,
            referenceYear: auditFile.referenceYear,
            referenceHash: auditFile.referenceHash
        });
        return newAuditFile;
    }
}
exports.ProcessPaymentService = ProcessPaymentService;
