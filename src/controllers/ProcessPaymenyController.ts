import { Request, Response } from 'express';
import { ProcessPaymentService } from '../services/ProcessPaymentService';



class ProcessPaymentController {

    private processPaymentService: ProcessPaymentService;

    constructor(processPaymentService: ProcessPaymentService) {
        this.processPaymentService = processPaymentService;
    }
    async processFile(req: Request, res: Response): Promise<Response> {
        try {
            const processPaymentData = req.body;
            if (!processPaymentData.filePath || !processPaymentData.month || !processPaymentData.year) {
                return res.status(400).json({ error: 'Faltan parámetros necesarios: filePath, month, year' });
                
            }

            const processPayment = await this.processPaymentService.processFile(processPaymentData)
            
            return res.status(200).json({ message: 'Archivo procesado correctamente.' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Error procesando el archivo.' });
        }
    };
}

export default ProcessPaymentController;
