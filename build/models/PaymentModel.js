"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const data_source_1 = require("../config/database/data.source");
const PaymentStateEnum_1 = require("../types/PaymentStateEnum");
const AffiliateModel_1 = __importDefault(require("./AffiliateModel"));
exports.Payment = data_source_1.sequelize.define('Payment', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    totalAmount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentStateEnum_1.PaymentStatus)),
        allowNull: false,
    },
    referenceMonth: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    referenceYear: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    affiliateId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: AffiliateModel_1.default,
            key: 'Id',
        },
        allowNull: false,
    }
}, {
    timestamps: false
});
exports.default = exports.Payment;
