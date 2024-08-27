import { Request, Response } from 'express';
import { ProcessPaymentService } from '../services/ProcessPaymentService';


class ProcessPaymentController {
    static async processFile(req: Request, res: Response): Promise<Response> {
        try {
            const { filePath, month, year } = req.body;

            // Verifica si los parámetros requeridos están presentes
            if (!filePath || !month || !year) {
                return res.status(400).json({ error: 'Faltan parámetros necesarios: filePath, month, year' });
            }

            // Llama al método processFile del servicio
            await ProcessPaymentService.processFile(filePath, month, year);

            return res.status(200).json({ message: 'Archivo procesado correctamente.' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Error procesando el archivo.' });
        }
    }
}

export default ProcessPaymentController;
