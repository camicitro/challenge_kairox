import { PaymentService } from "./PaymentService"
import * as fs from 'fs'
import * as readline from 'readline'
import AffiliateService from "./AffiliateService";
import { PaymentStatus } from "../types/PaymentStateEnum";
import { ProcessPaymentType } from "../types/ProcessPaymentType";
import crypto from 'crypto';
import AuditFile from "../models/AuditFile";
import { auditFileType } from "../types/AuditFileType";

export class ProcessPaymentService {
    private  paymentService:  PaymentService;
    private affiliateService: AffiliateService;
    private auditFileModel: typeof AuditFile;

    constructor(paymentService:  PaymentService, affiliateService: AffiliateService, auditFileModel: typeof AuditFile){
        this.paymentService = paymentService;
        this.affiliateService = affiliateService;
        this.auditFileModel = auditFileModel;
    }

    async processFile(processPaymentData: ProcessPaymentType, filePath: string): Promise<void> {
        try{
            const referenceMonth: number = processPaymentData.month;
            const referenceYear: number = processPaymentData.year;
            
            const fileContent = fs.readFileSync(filePath);

            const referenceHash = this.creatingHash(fileContent);

            const existsHash = await this.hashExists(referenceHash);
            if(existsHash){
                throw new Error ('El archivo subido ha sido ingresado anteriormente');
            }
            const newHash = this.createAuditFile({referenceMonth, referenceYear, referenceHash})

            const existsPayments: boolean = await this.paymentService.checkExistingPayments(referenceMonth, referenceYear);

            if (existsPayments){
                throw new Error ('Pagos existentes para ese mes y año');
            }
            

            const { dnis: paidDnis, amounts} = await this.extractDnisAndAmountFromFile(filePath);
            const dnis = paidDnis;
            const paymentAmounts = amounts;
            const dnisAll: number[] = await this.affiliateService.findAllAffiliatesDnis();
            
            const dataMap: Map<number, { amount: number | null, status: PaymentStatus }> = await this.createPaymentMap(dnis, dnisAll, paymentAmounts);
            const create: boolean = await this.createPayments(dataMap, processPaymentData.month, processPaymentData.year);
            
            if (create) {
                console.log('Pagos procesados correctamente. ');
            }
            fs.unlinkSync(filePath); 
        } catch (error: any){
            throw new Error('Error al procesar pago: '+ error.message);
        }
    }

    async extractDnisAndAmountFromFile (filePath: string): Promise<{ dnis: number[], amounts: number[]}> {
        try {
            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            const paidDnis: number[] = [];
            const amounts: number[] = [];

            for await (const line of rl) {
                const affiliateFields = line.split('|');
                const affiliateDni = Number(affiliateFields[0]);
                paidDnis.push(affiliateDni);
                const paymentAmount = Number(affiliateFields[14]);
                amounts.push(paymentAmount);
            }
            return { dnis: paidDnis, amounts: amounts };
        } catch (error: any){
            throw new Error('Error al extraer dnis y montos. '+ error.message);
        }
    }



    async createPaymentMap(paidDnis: number[], dnisAll: number[], amountsAll: number[]): Promise <Map<number, { amount: number | null, status: PaymentStatus }>> {
        try {
            const data = new Map<number, { amount: number | null, status: PaymentStatus }>();
            for await(const line1 of dnisAll){
                if (paidDnis.includes(line1)) {
                    const index = paidDnis.indexOf(line1);
                    data.set(line1, { amount: amountsAll[index], status: PaymentStatus.PAID}); 
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
        const referenceYear = year;
        const referenceMonth = month;
        try {
            for await(const [dni, paymentData] of dataMap.entries()){
                const affiliateId = await this.affiliateService.findAffiliateIdByDni(dni);
                const totalAmount = paymentData.amount;
                const paymentStatus = paymentData.status;
            
                this.paymentService.createPayment({totalAmount, paymentStatus, referenceYear, referenceMonth, affiliateId});
            }
            
            return true; 

        } catch (error: any) {
            throw new Error('Error creando pagos. ' + error.message);

        } 
    }

    creatingHash(file: Buffer): string{
        const hash = crypto.createHash('sha256').update(file).digest('hex');
        return hash;
    }

    async hashExists(hash: string): Promise<boolean>{
        const existingFile = await this.auditFileModel.findOne({ where: { 
            referenceHash: hash 
        } });
        if (existingFile) {
            return true
        }
        return false
    }

    async createAuditFile(auditFile: auditFileType){
        const newAuditFile = this.auditFileModel.create({
            referenceMonth: auditFile.referenceMonth,
            referenceYear: auditFile.referenceYear,
            referenceHash: auditFile.referenceHash
        });
        return newAuditFile;
    }
}  

