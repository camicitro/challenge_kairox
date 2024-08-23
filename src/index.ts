import express from 'express'
import { dbConnect } from './config/database/data.source';
import dotenv from 'dotenv';
import { dbConnect, sequelize } from './config/database/data.source';



dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

dbConnect()

app.listen(PORT, () => {
    console.log('API lista por el puerto', PORT)
})

export { app };
