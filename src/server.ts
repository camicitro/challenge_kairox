import express from 'express'
import { sequelize } from './config/database/data.source';
import dotenv from 'dotenv';
<<<<<<< HEAD
import affiliateRouter from './routes/AffiliateRoutes'
import './models/AffiliateModel'


=======
//import './models/AffiliateModel'
import './models/PaymentModel';
import PaymentRoutes from './routes/PaymentRoutes';
import bodyParser  from 'body-parser'
>>>>>>> payment

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());


app.use('/api', PaymentRoutes);

<<<<<<< HEAD
app.use(express.json())
app.use('/api', affiliateRouter)
=======
>>>>>>> payment

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la BD exitosa')
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