import { Payment } from '../models/PaymentModel';
import { PaymentType } from '../types/PaymentType';

export class PaymentService {

    private paymentModel: typeof Payment 

    constructor(paymentModel: typeof Payment){
        this.paymentModel = paymentModel;
    }

    public async checkExistingPayments(referenceMonth: number, referenceYear: number): Promise<boolean> {
        try {
          const existingPayments = await this.paymentModel.findAll({
            where: {
              referenceMonth: referenceMonth,
              referenceYear: referenceYear,
            },
          });
    

          return existingPayments.length > 0;
        } catch (error: any) {
          throw new Error('Error al verificar pagos existentes: ' + error.message);
        }
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

