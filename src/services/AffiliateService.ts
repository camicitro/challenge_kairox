import { Model } from "sequelize";
import Affiliate from "../models/AffiliateModel";


class AffiliateService {
    private affiliateModel: typeof Affiliate;

    constructor(affiliateModel: typeof Affiliate){
        this.affiliateModel = affiliateModel;
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
                where: { affiliateDni }
            });
    
            
            if (affiliate) {
                return affiliate.getDataValue('id'); 
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

            console.log('lo q me da es: ', affiliateDnisArray)
            return affiliateDnisArray;

        } catch (error: any) {
            throw new Error('Error al buscar afiliados' + error.message);
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
