import { Sequelize } from 'sequelize';
import { MySqlDialect } from '@sequelize/mysql';
import dotenv from 'dotenv';
import { NUMBER } from 'sequelize';

dotenv.config();

const dbName = process.env.DB as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;

const sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT)
    }
)


export { sequelize }