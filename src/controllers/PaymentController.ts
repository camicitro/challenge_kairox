import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  private paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  async createPayment(req: Request, res: Response): Promise<Response> {
    try {
      const paymentData = req.body
      const payment = await this.paymentService.createPayment(paymentData);
      return res.status(201).json({ message: 'Pago creado exitosamente', payment });

    } catch (error: any) {
      return res.status(500).json({ message: 'Error creando el pago' });
    }
    
  };


  //borramos?
  async hasConsecutive(req: Request, res: Response): Promise<Response>{
    try{
      const {id} = req.body
      const booleanD = await this.paymentService.hasLatePayments(id);
      return res.status(200).json({message: 'funciona', booleanD})
    }catch (error: any) {
      return res.status(500).json({ message: 'Error buscando' });
    }
  }

  async searchUnpaids(req: Request, res: Response): Promise<Response>{
    try{
      const {id} = req.body
      const unpaids = await this.paymentService.getAllUnpaids(id)
      return res.status(200).json({unpaids})
    }catch (error: any) {
      return res.status(500).json({ message: 'Error buscando' });
    }
  }
}
