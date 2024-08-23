import express from 'express'
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


// Establecer conexión y sincronizar modelos
const startServer = async () => {
  try {
    await dbConnect();
    await sequelize.sync({ force: true }); // Utiliza { force: true } para reiniciar la base de datos
    console.log('Tablas sincronizadas con la base de datos.');

    app.listen(PORT, () => {
      console.log('API lista por el puerto', PORT);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos o sincronizar tablas', error);
  }
};

startServer();

export { app };
