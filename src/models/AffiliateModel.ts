import { Model, DataType, DataTypes } from "sequelize";
import { sequelize } from "../config/database/data.source";

export const Affiliate = sequelize.define(
    "Affiliate",
    {
        affiliateName: { 
            type: DataTypes.STRING
        },
        affiliateEmail: {
            type: DataTypes.STRING
        },
        affiliateDni: { 
            type: DataTypes.INTEGER.UNSIGNED,
            unique: true
        },
        affiliateNumber: {
            type: DataTypes.INTEGER.UNSIGNED,
            unique: true
        },
        affiliationEndDate: {
            type: DataTypes.DATE,
            unique: true 
        }
    }, {
        tableName: 'affiliates',
        timestamps: false
});


export default Affiliate