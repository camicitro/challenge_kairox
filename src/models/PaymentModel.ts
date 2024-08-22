import { Model, DataTypes } from 'sequelize';
import Sequelize from 'sequelize';


export enum EstadoPago {
  PAGO = 'pago',
  IMPAGO = 'impago'
}

export class Pago extends Model {
  public idPago!: number;
  public fechaHoraPago!: Date;
  public montoTotal!: number;
  public estadoPago!: EstadoPago;
  public idAfiliado!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pago.init(
  {
    idPago: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fechaHoraPago: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    montoTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estadoPago: {
      type: DataTypes.ENUM(...Object.values(EstadoPago)),
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
  },
  {
    sequelize,
    tableName: 'pagos',
  }
);

// Definición de la relación
/*Afiliado.hasMany(Pago, {
  sourceKey: 'idAfiliado',
  foreignKey: 'idAfiliado',
  as: 'pagos',
});

Pago.belongsTo(Afiliado, {
  foreignKey: 'idAfiliado',
  as: 'afiliado',
});*/
