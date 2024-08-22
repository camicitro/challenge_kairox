import { Model, DataType, DataTypes } from "sequelize";
import { sequelize } from "../config/database/data.source";

export class Affiliate extends Model{
    affiliateName!: string;
    affiliateEmail!: string;
    affiliateDni!: number;
    affiliateNumber!: number;
    affiliationEndDate!: Date;
}

Affiliate.init({
        affiliateName: { type: DataTypes.STRING },
        affiliateEmail: { type: DataTypes.STRING },
        affiliateDni: { type: DataTypes.INTEGER },
        affiliateNumber: { type: DataTypes.INTEGER },
        affiliationEndDate: { type: DataTypes.DATE }
    }, {
        sequelize,
        modelName: 'Affiliate',
        tableName: 'affiliates',
        timestamps: false
});

export default Affiliate