import { Request, Response } from 'express';
import { ProcessPaymentService } from '../services/ProcessPaymentService';
import { ProcessPaymentType } from '../types/ProcessPaymentType';


class ProcessPaymentController {

    private processPaymentService: ProcessPaymentService;

    constructor(processPaymentService: ProcessPaymentService) {
        this.processPaymentService = processPaymentService;
    }
    async processFile(req: Request, res: Response): Promise<Response> {
        try {
            const filePath = req.file?.path;
            const {month, year} = req.body;
            console.log(req)
            console.log(req.body)
            if (!filePath || !month || !year) {
                return res.status(400).json({ error: 'Faltan parámetros necesarios: filePath, month, year' });
                
            }

            const processPaymentData: ProcessPaymentType = { month: parseInt(month), year: parseInt(year) };

            const processPayment = await this.processPaymentService.processFile(processPaymentData, filePath)
            
            return res.status(200).json({ message: 'Archivo procesado correctamente.' + processPayment});
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Error procesando el archivo.' });
        }
    };
}

export default ProcessPaymentController;
