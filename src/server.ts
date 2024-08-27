import express from 'express'
import { sequelize } from './config/database/data.source';
import dotenv from 'dotenv';
import affiliateRouter from './routes/AffiliateRoutes'
import './models/AffiliateModel'
import PaymentRoutes from './routes/PaymentRoutes';
import { defineAssociations } from './Associations/AssociationPaymentAffliate';
import multer from 'multer'
import ProcessPaymentRoutes from './routes/ProcessPaymentRoutes';


dotenv.config();

const app = express()
const upload = multer({ dest: 'uploads/'})
const PORT = process.env.PORT || 3000

app.use(express.json());


app.use('/api', PaymentRoutes);
app.use('/api', affiliateRouter);
app.use('/api', ProcessPaymentRoutes);

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

startServer()

export {app}
