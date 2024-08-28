import { Payment } from '../models/PaymentModel';
import { PaymentType } from '../types/PaymentType';
import { PaymentStatus } from '../types/PaymentStateEnum';


export class PaymentService {

    private paymentModel: typeof Payment; 

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
      try{
        const newPayment = await this.paymentModel.create({
          totalAmount: paymentData.totalAmount,
          paymentStatus: paymentData.paymentStatus, 
          referenceMonth: paymentData.referenceMonth,
          referenceYear: paymentData.referenceYear,
          affiliateId: paymentData.affiliateId,
        });
        return newPayment;
      } catch (error: any) {
          throw new Error('La creación de pago falló: ' + error.message);
        }
  }

    async getAllPaymentsByAffiliateId(affiliateId: string){
      try{
        const payments = await this.paymentModel.findAll({
          where: {
              affiliateId: affiliateId
          }
        });
        return payments;
      }catch (error: any) {
        throw new Error('Error buscando los pagos');
      }  
    }

    async hasLatePayments(affiliateId: string): Promise<boolean>{
      try{
        const unpaidPaymentsObjectsArray = await this.getAllUnpaids(affiliateId);

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
        if(nextDate === currentDate + 1 || nextDate - currentDate === 89){
          consecutive++;
          if (consecutive >= 3){
            return true;
          }
        }else{
          consecutive = 1;
        }
      }
      return false
    }

    transformYearMonth(unpaidPayments: { referenceYear: number, referenceMonth: number}[]): number[]{
      const yearPlusMonthArray: number[] =[];
      for(const payment of unpaidPayments){
        const month: string = payment.referenceMonth.toString().padStart(2, '0');
        const year: string = payment.referenceYear.toString();
        const yearPlusMonth: number = Number(year + month);
        yearPlusMonthArray.push(yearPlusMonth);
      }
      return yearPlusMonthArray;
    }


    async getAllUnpaids(affiliateId: string): Promise<{ referenceYear: number, referenceMonth: number}[]>{
      try{
        const unpaidPayments = await this.paymentModel.findAll({
          where: {
              affiliateId: affiliateId,
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

        return unpaidPaymentsObjectsArray
      }catch(error){
        throw new Error('Error buscando meses impagos');
      }
        
    }


    isInLongTermDebt(unpaidPayments: {referenceYear: number, referenceMonth: number}[]): {referenceYear: number, referenceMonth: number}[]{
      if (unpaidPayments.length < 3) return [];
      
      const consecutivePayments: { referenceYear: number, referenceMonth: number }[] = [];
      let temporalConsecutive: { referenceYear: number, referenceMonth: number }[] = [];

      for(let i = 0; i < unpaidPayments.length; i++){
        const nextPayment = unpaidPayments[i + 1];
        const currentPayment = unpaidPayments[i];

        if(temporalConsecutive.length == 0){
          temporalConsecutive.push(currentPayment);
        }
        if(nextPayment){
          const isSameYear = currentPayment.referenceYear === nextPayment.referenceYear;
          const isNextMonth = currentPayment.referenceMonth + 1 === nextPayment.referenceMonth;
          const isNextYearButJanuary = currentPayment.referenceYear + 1 === nextPayment.referenceYear && currentPayment.referenceMonth === 12 && nextPayment.referenceMonth === 1;

          if(isSameYear && isNextMonth || isNextYearButJanuary){
            temporalConsecutive.push(nextPayment);
          } else{
            if (temporalConsecutive.length >= 3) {
              consecutivePayments.push(...temporalConsecutive);
            }
            temporalConsecutive = [];
          }
        } else {
          if (temporalConsecutive.length >= 3) {
              consecutivePayments.push(...temporalConsecutive);
          }
        } 
      }
      return consecutivePayments;
    }

    
} 

