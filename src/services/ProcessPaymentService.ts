import { PaymentService } from "./PaymentService"
import * as fs from 'fs'
import * as readline from 'readline'
import AffiliateService from "./AffiliateService";
import { PaymentStatus } from "../types/PaymentStateEnum";
import { ProcessPaymentType } from "../types/ProcessPaymentType";

export class ProcessPaymentService {
    private  paymentService:  PaymentService;
    private affiliateService: AffiliateService;
    
 

    constructor(paymentService:  PaymentService, affiliateService: AffiliateService){
        this.paymentService = paymentService;
        this.affiliateService = affiliateService;
    }

    //por ahora dejemos q devuelva void
    async processFile(processPaymentData: ProcessPaymentType, filePath: string): Promise<void> {
        console.log('ENTRE AL SERVICE')
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        
        const referenceMonth: number = processPaymentData.month
        const referenceYear: number = processPaymentData.year
        
        console.log('ESTOY POR EJECUTAR EL CHECKEXISTINGPAYMENTS, MES Y AÑO SON: ', referenceMonth, ', ', referenceYear)

        const existsPayments: boolean = await this.paymentService.checkExistingPayments(referenceMonth, referenceYear)

        console.log('YA SE FIJO SI EXISTEN PAGOS; ', existsPayments)

        if (existsPayments){
            throw new Error ('Error, pagos existentes para ese mes y año')
        }
        
        console.log('VA A CREAR EL ARREGLO DE DNIS')
        const paidDnis: number[] = [];
        for await(const line of rl){
            const affiliateFields = line.split('|');
            const affiliateDni = Number(affiliateFields[0]);
            paidDnis.push(affiliateDni);
        }
        console.log('ya creo el arreglo: ', paidDnis)
        const dnisAll: number[] = await this.affiliateService.findAllAffiliatesDnis()
        const dataMap: Map<number, { amount: number | null, status: PaymentStatus }> = await this.createPaymentMap(paidDnis, dnisAll)
        const create: boolean = await this.createPayments(dataMap, processPaymentData.month, processPaymentData.year)
        if (create) {
            console.log('Pagos procesados correctamente. ')
        }
        fs.unlinkSync(filePath); //borrar archivo de carpeta
    }

    async createPaymentMap(paidDnis: number[], dnisAll: number[]): Promise <Map<number, { amount: number | null, status: PaymentStatus }>> {
        try {
            const data = new Map<number, { amount: number | null, status: PaymentStatus }>();
            for await(const line1 of paidDnis){
                if (dnisAll.includes(line1)) {
                    data.set(line1, { amount: null, status: PaymentStatus.PAID}); 
                } else {
    
                    data.set(line1, { amount: 0, status: PaymentStatus.UNPAID});  
                }
                
            }
            return data;
        } catch (error: any) {
            throw new Error('Error al crear pagos: ' + error.message);
        }
        

    }

    async createPayments(dataMap: Map<number, { amount: number | null, status: PaymentStatus }>, month: number, year: number): Promise<boolean> {
        const referenceYear = year
        const referenceMonth = month
        try {
            for await(const [dni, paymentData] of dataMap.entries()){
                const affiliateId = await this.affiliateService.findAffiliateIdByDni(dni)
                const totalAmount = paymentData.amount
                const paymentStatus = paymentData.status
            
                this.paymentService.createPayment({totalAmount, paymentStatus, referenceYear, referenceMonth, affiliateId})
            }
            
            return true; 

        } catch (error: any) {
            throw new Error('Error creando pagos. ' + error.message)

        } 
    }

}  

