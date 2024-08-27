import { Model, DataType, DataTypes } from "sequelize";
import { sequelize } from "../config/database/data.source";
import Payment from "./PaymentModel";

const Affiliate = sequelize.define(
    "Affiliate",
    {
        Id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        affiliateName: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        affiliateEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        affiliateDni: { 
            type: DataTypes.INTEGER.UNSIGNED,
            unique: true,
            allowNull: false
        },
        affiliateNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        affiliationEndDate: {
            type: DataTypes.DATE,
            unique: true,
            allowNull: true 
        }
    }, {
        tableName: 'affiliates',
        timestamps: false
});



export default Affiliate


