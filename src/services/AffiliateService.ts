import { attribute } from "@sequelize/core/lib/expression-builders/attribute";
import Affiliate from "../models/AffiliateModel";
import { PaymentService } from "./PaymentService";
import { EmailNotificationService } from "./EmailNotificationService";


class AffiliateService {
    private affiliateModel: typeof Affiliate;
    private paymentService: PaymentService;
    private emailNotificationService: EmailNotificationService;

    constructor(affiliateModel: typeof Affiliate, paymentService: PaymentService, emailNotificationService: EmailNotificationService){
        this.affiliateModel = affiliateModel;
        this.paymentService = paymentService;
        this.emailNotificationService = emailNotificationService;
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

    async findAffiliatesWithUpaidPayments(): Promise<number[]>{
        try{
            const affiliates = await this.affiliateModel.findAll({
                where: {
                    affiliationEndDate: null //esto para q no tome los dados de baja
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
}


export default AffiliateService;
