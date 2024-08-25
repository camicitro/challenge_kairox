// payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  private paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  public createPayment = async (req: Request, res: Response) => {
    console.log('Request body:', req.body)
    try {
      if (!req.body || typeof req.body.totalAmount === 'undefined' || typeof req.body.referenceYear === 'undefined' || typeof req.body.referenceMonth === 'undefined') {
        return res.status(400).json({ error: 'Missing required fields: totalAmount, referenceYear, referenceMonth' });
      }

      const paymentData = {
        totalAmount: req.body.totalAmount,
        referenceYear: req.body.referenceYear,
        referenceMonth: req.body.referenceMonth
      };

      const payment = await this.paymentService.createPayment(paymentData);
      return res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error: any) {
      console.error('Error creating payment:', error);
      return res.status(500).json({ error: error.message });
    }
    
  };
}
