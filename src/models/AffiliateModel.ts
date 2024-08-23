import { Model, DataType, DataTypes } from "sequelize";
import { sequelize } from "../config/database/data.source";

const Affiliate = sequelize.define(
    "Affiliate",
    {
        id:{
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
            type: DataTypes.INTEGER.UNSIGNED,
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