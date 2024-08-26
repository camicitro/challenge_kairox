import { PaymentService } from "./PaymentService"
import * as fs from 'fs'
import * as readline from 'readline'

export class ProcessPaymentService {
    private paymentService: typeof PaymentService;

    constructor(paymentService: typeof PaymentService){
        this.paymentService = paymentService;
    }

    //por ahora dejemos q devuelva void
    async processFile(filePath: string, referenceMonth: number, referenceYear: number): Promise<void>{
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // llama a checkExistingPayments

        //extrae los dnis de los q pagaron
        const affiliateDnis: number[] = [];
        for await(const line of rl){
            const affiliateFields = line.split('|');
            const affiliateDni = Number(affiliateFields[0]);
            affiliateDnis.push(affiliateDni);
        }
    }

}