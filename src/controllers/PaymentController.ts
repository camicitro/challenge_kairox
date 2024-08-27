import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { UUID } from 'sequelize';

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


  //despues borrar
  async hasConsecutive(req: Request, res: Response): Promise<Response>{
    try{
      console.log('ENTRE AL CONTROLADOR')
      const {id} = req.body
      const booleanD = await this.paymentService.hasLatePayments(id);
      console.log('tiene pagos impagos? ', booleanD)
      return res.status(200).json({message: 'funciona'})
    }catch (error: any) {
      return res.status(500).json({ message: 'Error buscando' });
    }
  }
}
