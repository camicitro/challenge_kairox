import express from 'express'
import { sequelize } from './config/database/data.source';
import dotenv from 'dotenv';
import affiliateRouter from './routes/AffiliateRoutes'
import './models/AffiliateModel'
import PaymentRoutes from './routes/PaymentRoutes';
import { defineAssociations } from './Associations/AssociationPaymentAffliate';
import { EmailNotificationService } from './services/EmailNotificationService';



dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());


app.use('/api', PaymentRoutes);

app.use(express.json())
app.use('/api', affiliateRouter)

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la BD exitosa')
        defineAssociations();
        await sequelize.sync( { force: false, alter: false });
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
