import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/database/data.source';
import { PaymentStatus } from '../types/PaymentStateEnum';


export const Payment = sequelize.define(
    'Payment', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
        unique: true,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
      /*idAfilliate: {
        type: DataTypes.INTEGER,
        references: {
          model: Affiliate,
          key: 'idAffiliate',
        },
        allowNull: false,
      },*/
}, {
        timestamps: false
})

/*Affiliate.hasMany(Payment, {
  sourceKey: 'idAffiliate',
  foreignKey: 'idAffiliate',
  as: 'payments',
});

Payment.belongsTo(Affiliate, {
  foreignKey: 'idAffiliate',
  as: 'affiliate',
});*/

export default Payment

