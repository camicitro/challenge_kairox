import express from 'express'
import { sequelize } from './config/database/data.source';
import dotenv from 'dotenv';
import affiliateRouter from './routes/AffiliateRoutes'
import './models/AffiliateModel'
import PaymentRoutes from './routes/PaymentRoutes';
import { defineAssociations } from './Associations/AssociationPaymentAffliate';
import ProcessPaymentRoutes from './routes/ProcessPaymentRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'; 



dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

const swaggerDocument = YAML.load('src/swagger.yaml'); 
console.log('Swagger Document Loaded:', swaggerDocument);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
