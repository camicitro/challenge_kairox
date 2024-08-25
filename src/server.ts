import express from 'express'
import { sequelize } from './config/database/data.source';
import dotenv from 'dotenv';
import { EmailNotificationService } from './services/EmailNotificationService';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la BD exitosa')
        await sequelize.sync( { force: false, alter: true });
        app.listen(PORT, () => {
            console.log('API lista por el puerto', PORT)
        })
        
    } catch(error){
        console.error('Error al conectar',)
    }
}


//probando (BORRARRRRR)
const emailNotificationService = new EmailNotificationService();
emailNotificationService.sendEmail([ "camiverde110603@gmail.com"]);
//


startServer()



export {app}
