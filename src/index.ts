import express from 'express'
import { sequelize } from './config/database/data.source';
import dotenv from 'dotenv';


dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync( { force: false, alter: true });
        app.listen(PORT, () => {
            console.log('API lista por el puerto', PORT)
        })
        
    } catch(error){
        console.error('Error al conectar',)
    }
}

startServer()

export {app}