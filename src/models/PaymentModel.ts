import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/database/data.source';
import { PaymentStatus } from '../types/PaymentStateEnum';
import Affiliate from './AffiliateModel';


export const Payment = sequelize.define(
    'Payment', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      paymentStatus: {
        type: DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
      },
      referenceMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      referenceYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      affiliateId: {
        type: DataTypes.UUID,
        references: {
          model: Affiliate,
          key: 'Id',
        },
        allowNull: false,
      }
}, {
        timestamps: false
});



export default Payment;

