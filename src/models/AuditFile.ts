import { Model, DataType, DataTypes } from "sequelize";
import { sequelize } from "../config/database/data.source";

export const AuditFile = sequelize.define(
    'AuditFile', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      referenceMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      referenceYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      referenceHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
}, {
        timestamps: false
});



export default AuditFile;

