import express from 'express'
import { dbConnect } from './config/database/data.source.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

dbConnect()

app.listen(PORT, () => {
    console.log('API lista por el puerto', PORT)
})

export {app}