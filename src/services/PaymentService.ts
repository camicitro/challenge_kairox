// payment.service.ts
import { Payment } from '../models/PaymentModel';

export class PaymentService {

    private paymentModel: typeof Payment 

    constructor(paymentModel: typeof Payment){
        this.paymentModel = paymentModel;
    }

    public async createPayment(paymentData: { amount: number }) {
    try {
      const newPayment = await Payment.create({
        totalAmount: paymentData.amount,
        paidStatus: 'unpaid', 
        //affiliateId: paymentData.affiliateId,
        paymentDate: new Date(), // Assuming you want to set the payment date to now
      });
      return newPayment;
    } catch (error: any) {
      throw new Error('Payment creation failed: ' + error.message);
    }
  }
}
