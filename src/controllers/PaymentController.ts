// payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  private paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

    public createPayment = async (req: Request, res: Response) => {
    const paymentData = req.body;
    if (!req.body || typeof req.body.totalAmount === 'undefined') {
        return res.status(400).json({ error: 'Amount is required' });
    }
    try {
    const payment = await this.paymentService.createPayment(paymentData);
    res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error: any) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: error.message });
    }
    
  };
}
