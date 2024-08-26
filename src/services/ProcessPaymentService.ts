import { PaymentService } from "./PaymentService"
import * as fs from 'fs'
import * as readline from 'readline'
import AffiliateService from "./AffiliateService";

export class ProcessPaymentService {
    private paymentService:  PaymentService;
    private affiliateService: AffiliateService;

    constructor(paymentService:  PaymentService, affiliateService: AffiliateService){
        this.paymentService = paymentService;
        this.affiliateService = affiliateService;
    }

    //por ahora dejemos q devuelva void
    async processFile(filePath: string, month: number, year: number): Promise<void>{
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // llama a checkExistingPayments
        const referenceMonth: number = month
        const referenceYear: number = year
        const existsPayments: boolean = await this.paymentService.checkExistingPayments(referenceMonth, referenceYear)
        if (existsPayments){
            throw new Error ('Error, pagos existentes para ese mes y año')
        }
        //extrae los dnis de los q pagaron
        const paidDnis: number[] = [];
        for await(const line of rl){
            const affiliateFields = line.split('|');
            const affiliateDni = Number(affiliateFields[0]);
            paidDnis.push(affiliateDni);
        }
        const dnisAll: number[] = await this.affiliateService.findAllAffiliatesDnis()
        const dataMap: Map<number, { amount: number | null, status: 'paid' | 'unpaid' }> = await this.createPaymentMap(paidDnis, dnisAll)
        //llamar createPayment
    }

    async createPaymentMap(paidDnis: number[], dnisAll: number[]): Promise <Map<number, { amount: number | null, status: 'paid' | 'unpaid' }>> {
        try {
            const data = new Map<number, { amount: number | null, status: 'paid' | 'unpaid' }>();
            for await(const line1 of paidDnis){
                if (dnisAll.includes(line1)) {
                    data.set(line1, { amount: null, status: 'paid' }); 
                } else {
    
                    data.set(line1, { amount: 0, status: 'unpaid' });  
                }
                
            }
            return data;
        } catch (error: any) {
            throw new Error('Error al crear pagos: ' + error.message);
        }
        

    }

    //async createPayments(data)
     


}