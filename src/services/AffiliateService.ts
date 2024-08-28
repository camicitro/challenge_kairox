import { Model } from "sequelize";
import Affiliate from "../models/AffiliateModel";
import Payment from "../models/PaymentModel";
import { PaymentType } from "../types/PaymentType";


class AffiliateService {
    private affiliateModel: typeof Affiliate;
    private paymentModel: typeof Payment; 

    constructor(affiliateModel: typeof Affiliate, paymentModel: typeof Payment){
        this.affiliateModel = affiliateModel;
        this.paymentModel = paymentModel; 
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
                    {where: { affiliateDni }}
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
    
            const payments = await this.paymentModel.findAll({
                where: {
                    affiliateId: affiliateId
                }
            });
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
    

    /*async deactivateNonPayingAffiliates(affiliatesDnis: number[]): Promise<void>{
        try{
            for (const affiliateDni of affiliatesDnis){
                await this.desactivateAffiliate(affiliateDni);
            }
        }catch{
            throw new Error('Error dando de baja afiliados');
        }
        
    }*/
}

export default AffiliateService;
