import { Payment } from '../models/PaymentModel';
import { PaymentType } from '../types/PaymentType';
import { PaymentStatus } from '../types/PaymentStateEnum';


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

  async hasLatePayments(affiliateDni: number): Promise<boolean>{
    try{
      const unpaidPayments = await this.paymentModel.findAll({
        where: {
            affiliateId: affiliateDni,
            paymentStatus: PaymentStatus.UNPAID, 
        },
        attributes: ['referenceYear', 'referenceMonth'],
        group: ['referenceYear', 'referenceMonth'],
        order: [['referenceYear', 'ASC'], ['referenceMonth', 'ASC']]
      });

      const unpaidPaymentsObjectsArray = unpaidPayments.map(payment => ({
        referenceYear: payment.getDataValue('referenceYear'),
        referenceMonth: payment.getDataValue('referenceMonth')
      }));

      const yearMonthArray: number[] = this.transformYearMonth(unpaidPaymentsObjectsArray);

      const hasConsecutiveUnpaids: boolean = this.hasConsecutiveUnpaids(yearMonthArray);
      
      return hasConsecutiveUnpaids;
    } catch(error){
      throw new Error('Error buscando meses consecutivos impagos');

    }
    
    }

    hasConsecutiveUnpaids(yearPlusMonth: number[]): boolean{
      let consecutive: number = 1;

      for(let i = 0; i < yearPlusMonth.length - 1; i++){
        const currentDate: number = yearPlusMonth[i];
        const nextDate: number = yearPlusMonth[i + 1];
        if(nextDate === currentDate + 1){
          consecutive++;
          if (consecutive >= 3){
            return true
          }
        } else{
          consecutive = 1;
        }
      }
      return false
    }

    transformYearMonth(unpaidPayments: { referenceYear: number, referenceMonth: number}[]): number[]{
      const yearPlusMonthArray: number[] =[]
      for(const payment of unpaidPayments){
        const month: string = payment.referenceMonth.toString().padStart(2, '0');
        const year: string = payment.referenceYear.toString();
        const yearPlusMonth: number = Number(year + month);
        yearPlusMonthArray.push(yearPlusMonth);
      }
      return yearPlusMonthArray;
    }
} 

