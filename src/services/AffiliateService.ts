import Affiliate from "../models/AffiliateModel";
import { PaymentService } from "./PaymentService";
import { EmailNotificationService } from "./EmailNotificationService";
import { affiliatesInDebt } from "../types/AffiliateInDebtType";

class AffiliateService {
    private affiliateModel: typeof Affiliate;
    private paymentService: PaymentService;
    private emailNotificationService: EmailNotificationService;
    //private paymentModel: typeof Payment; 

    constructor(affiliateModel: typeof Affiliate, paymentService: PaymentService, emailNotificationService: EmailNotificationService){
        this.affiliateModel = affiliateModel;
        this.paymentService = paymentService;
        this.emailNotificationService = emailNotificationService;
        //this.paymentModel = paymentModel;
    }

    async deactivateAffiliate(affiliateDni: number): Promise<boolean>{
        try{
            const affiliate = await this.findAffiliateByDni(affiliateDni);

            if(!affiliate){
                console.error('No existe el afiliado o está dado de baja');
                return false;
            } else {
                const affiliationEndDate = new Date();
                await affiliate.update(
                    { affiliationEndDate: affiliationEndDate },
                    {where: { affiliateDni: affiliateDni }}
                );
                return true;
            }
        }catch{
            throw new Error('Error dando de baja afiliado');
        }
        
    }

    async findAffiliateByDni(affiliateDni: number): Promise<InstanceType<typeof Affiliate> | null>{
            try{
                const affiliate = await this.affiliateModel.findOne({
                    where: {
                        affiliateDni,
                        affiliationEndDate : null,
                    }
                })
                return affiliate
            }catch(error){
                throw new Error('Error buscando afiiado');
            }
    }

    async findAffiliateIdByDni(affiliateDni: number): Promise<string> {
        try {
            const affiliate = await Affiliate.findOne({
                where: { 
                    affiliateDni,
                    affiliationEndDate : null,
                }
            });
    
            
            if (affiliate) {
                return affiliate.getDataValue('Id'); 
            } else {
                throw new Error('No existe afiliado con ese dni');
            }
        } catch (error) {
            throw new Error('Error buscando el id del afiliado');
        }
    }

    public async findAllAffiliatesDnis(): Promise<number[]> {
        try {
            const affiliatesDnisObjects = await Affiliate.findAll({
                attributes: ['affiliateDni'],
            });

            const affiliateDnisArray = affiliatesDnisObjects.map(affiliate => affiliate.getDataValue('affiliateDni'));

            return affiliateDnisArray;

        } catch (error: any) {
            throw new Error('Error al buscar afiliados' + error.message);
        }
    }
    //BONUS TRACK ESTADO DE CUENTA
    async getAffiliateStatusCount (affiliateDni: number) {
        try {
            const affiliateId: string = await this.findAffiliateIdByDni(affiliateDni);
            console.log(affiliateId)
            if (!affiliateId) {
                throw new Error('No existe un afiliado con ese DNI o la afiliación ha terminado.');
            }
    
            /*const payments = await this.paymentModel.findAll({
                where: {
                    affiliateId: affiliateId
                }
            });*/
            const payments = await this.paymentService.getAllPaymentsByAffiliateId(affiliateId);

            if (payments.length > 0) {
                console.log('----------ESTADO DE CUENTA DEL AFILIADO CON DNI' +affiliateDni+'----------' );
                for (const payment of  payments) {
                    console.log('Monto Total: ' + payment.getDataValue('totalAmount'));
                    console.log('Mes de Referencia del pago: '+payment.getDataValue('referenceMonth'));
                    console.log('Año de Referencia del pago: '+payment.getDataValue('referenceYear'));
                    console.log('Estado del pago: '+payment.getDataValue('paymentStatus'));
                    console.log('-----------------------------------------------------------------------');
                }
                return payments;
            } else {
                throw new Error(`No existen pagos asociados al afiliado con el DNI: ${affiliateDni}`);
            }
            
        } catch (error: any) {
            throw new Error('Error al obtener el estado de cuenta del afiliado: ' + error.message);
        }
    }
    

    async findAffiliatesWithUpaidPayments(): Promise<number[]>{
        try{
            
            const affiliates = await this.affiliateModel.findAll({
                where: {
                    affiliationEndDate: null
                },
                attributes: ['affiliateDni']
            })
            const allAffiliatesDnisArray: number[] = affiliates.map(affiliate => (affiliate.getDataValue('affiliateDni')));
            
            const affiliatesLatePayments: number[] = []; 

            for(const affiliateDni of allAffiliatesDnisArray){
                const affiliate = await this.findAffiliateByDni(affiliateDni);

                const affiliateId = affiliate?.getDataValue('Id');
                
                const hasLatePayments = await this.paymentService.hasLatePayments(affiliateId);
                
                if(hasLatePayments){
                    affiliatesLatePayments.push(affiliateDni);
                }
            }
            return affiliatesLatePayments;

        }catch(error){
                throw new Error('Error buscando afiiados con 3 meses de pagos impagos');
        }
    }

    async deactivateNonPayingAffiliates(affiliatesDnis: number[]): Promise<void>{
        try{
            for(const affiliateDni of affiliatesDnis){
                const deactivate: boolean = await this.deactivateAffiliate(affiliateDni);
            }
            
        }catch{
            throw new Error('Error dando de baja afiliados');
        }
    }

    async findNonPayingAffiliatesEmails(affiliateDnis: number[]): Promise<string[]>{
        try{
            const affiliateEmails: string[] = []

            for(const affiliateDni of affiliateDnis){
                const affiliate = await this.findAffiliateByDni(affiliateDni);
                if(affiliate){
                    affiliateEmails.push(affiliate.getDataValue('affiliateEmail'));
                }
            }
            return affiliateEmails;
        }catch{
            throw new Error('Error buscando mails');
        }
        
    }
    async processAffiliateDeactivation(): Promise<void>{
        try{
            const inactiveAffiliatesDnis = await this.findAffiliatesWithUpaidPayments(); 
            const inactiveAffiliatesEmails = await this.findNonPayingAffiliatesEmails(inactiveAffiliatesDnis); 
            
            await this.emailNotificationService.sendEmail(inactiveAffiliatesEmails); 

            await this.deactivateNonPayingAffiliates(inactiveAffiliatesDnis); 
            
        }catch{
            throw new Error('Error en el proceso de baja');
        }
    }

    async getAllAffiliates(): Promise<InstanceType<typeof Affiliate>[]>{
        try{
            const affiliates = await this.affiliateModel.findAll();
            return affiliates;  
        }catch{
            throw new Error('Error buscando afiliados');
        }
    }
    

    async getAllAffiliatesInDebt(): Promise<affiliatesInDebt[]>{
        try{
            const affiliates = await this.getAllAffiliates();
            const affiliatesInDebt: affiliatesInDebt[] = []

            for (const affiliate of affiliates){
                const affiliateId = affiliate.getDataValue('Id');
                
                const allAffiliateUnpaidMonths = await this.paymentService.getAllUnpaids(affiliateId);
                const consecutiveAffiliateUnpaidMonths = this.paymentService.isInLongTermDebt(allAffiliateUnpaidMonths);

                if(consecutiveAffiliateUnpaidMonths.length > 0){
                    affiliatesInDebt.push({
                        affiliateName: affiliate.getDataValue('affiliateName'),
                        affiliateDni: affiliate.getDataValue('affiliateDni'),
                        debts: consecutiveAffiliateUnpaidMonths
                    });
                }
            }
            return affiliatesInDebt
        }catch{
            throw new Error('Error buscando afiliados endeudados');
        }
        
    }
}
export default AffiliateService;
