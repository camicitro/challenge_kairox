import express from 'express'
import { sequelize } from './config/database/data.source';
import dotenv from 'dotenv';
//import './models/AffiliateModel'
import './models/PaymentModel';
import PaymentRoutes from './routes/PaymentRoutes';


dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use('/api', PaymentRoutes);
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

startServer()

export {app}