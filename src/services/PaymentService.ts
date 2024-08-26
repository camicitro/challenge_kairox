import { Payment } from '../models/PaymentModel';
import { PaymentType } from '../types/PaymentType';

export class PaymentService {

    private paymentModel: typeof Payment 

    constructor(paymentModel: typeof Payment){
        this.paymentModel = paymentModel;
    }

    public async createPayment( paymentData: PaymentType) {
  
      const newPayment = await this.paymentModel.create({
        totalAmount: paymentData.totalAmount,
        paymentStatus: 'unpaid', 
        referenceMonth: paymentData.referenceMonth,
        referenceYear: paymentData.referenceYear,
        affiliateId: paymentData.affiliateId,
      });
      return newPayment;
    } catch (error: any) {
      throw new Error('Payment creation failed: ' + error.message);
    }

    
} 

