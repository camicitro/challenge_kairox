import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';
import dotenv from 'dotenv';
import { NUMBER } from 'sequelize';

dotenv.config();



const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST, //127.0.0.1
    port: Number(process.env.DB_PORT)
});
    
const dbConnect = async () => {
    try {
        await sequelize.authenticate(); 
        console.log('Conexion a MySQL Workbench exitosa!')
    } catch(error){
    console.log('Error de conexion a MySQL Workbench', error)
    }
}

export { dbConnect, sequelize }