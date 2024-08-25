// payment.service.ts
import { Payment } from '../models/PaymentModel';

export class PaymentService {

    private paymentModel: typeof Payment 

    constructor(paymentModel: typeof Payment){
        this.paymentModel = paymentModel;
    }

    public async createPayment( paymentData: {totalAmount: number, referenceYear: number, referenceMonth: number }) {
  
      const newPayment = await this.paymentModel.create({
        totalAmount: paymentData.totalAmount,
        paymentStatus: 'unpaid', 
        referenceMonth: paymentData.referenceMonth,
        referenceYear: paymentData.referenceYear,
        //affiliateId: paymentData.affiliateId,
        paymentDate: new Date(), // Assuming you want to set the payment date to now
      });
      return newPayment;
    } catch (error: any) {
      throw new Error('Payment creation failed: ' + error.message);
    }
} 

