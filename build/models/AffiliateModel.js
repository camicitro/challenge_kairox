"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const data_source_1 = require("../config/database/data.source");
const Affiliate = data_source_1.sequelize.define("Affiliate", {
    Id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    affiliateName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    affiliateEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    affiliateDni: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false
    },
    affiliateNumber: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    affiliationEndDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'affiliates',
    timestamps: false
});
exports.default = Affiliate;
