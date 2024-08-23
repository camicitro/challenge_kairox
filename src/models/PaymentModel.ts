import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/database/data.source';
import { PaidStatus } from '../types/PaymentStateEnum';


export const Payment = sequelize.define(
    'Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paidStatus: {
        type: DataTypes.ENUM(...Object.values(PaidStatus)),
        allowNull: false,
      },
      /*idAfiliado: {
        type: DataTypes.INTEGER,
        references: {
          model: Afiliado,
          key: 'idAfiliado',
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

