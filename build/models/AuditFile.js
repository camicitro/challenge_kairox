"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditFile = void 0;
const sequelize_1 = require("sequelize");
const data_source_1 = require("../config/database/data.source");
exports.AuditFile = data_source_1.sequelize.define('AuditFile', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    referenceMonth: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    referenceYear: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    referenceHash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false
});
exports.default = exports.AuditFile;
