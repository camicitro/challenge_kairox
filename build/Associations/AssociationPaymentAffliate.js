"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineAssociations = void 0;
const AffiliateModel_1 = __importDefault(require("../models/AffiliateModel"));
const PaymentModel_1 = __importDefault(require("../models/PaymentModel"));
const defineAssociations = () => {
    AffiliateModel_1.default.hasMany(PaymentModel_1.default, {
        sourceKey: 'Id',
        foreignKey: 'affiliateId',
        as: 'payments',
    });
    PaymentModel_1.default.belongsTo(AffiliateModel_1.default, {
        foreignKey: 'affiliateId',
        as: 'affiliate',
    });
};
exports.defineAssociations = defineAssociations;
