import { Request, Response } from "express";
import AffiliateService from "../services/AffiliateService";
import { affiliatesInDebt } from "../types/AffiliateInDebtType";

class AffiliateController{
    private affiliateService: AffiliateService;

    constructor(affiliateService: AffiliateService){
        this.affiliateService = affiliateService;

    }
    
    async deactivateAffiliate(req: Request, res: Response): Promise<Response>{
        try{
            const { dni }  = req.params;
            const dniNumber = Number(dni);
            if(!dni){
                return res.status(400).json({ message: 'Se necesita DNI para dar de baja'});
            }
            const desactivatedAffiliate = await this.affiliateService.deactivateAffiliate(dniNumber);
            if (!desactivatedAffiliate){
                return res.status(404).json({ message: 'Afiliado no encontrado'});
            }
            return res.status(200).json({ message: 'Afiliado dado de baja exitosamente'});
        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async processAffiliatesDeactivation(req: Request, res: Response): Promise<Response>{
        try{
            await this.affiliateService.processAffiliateDeactivation();
            return res.status(200).json({ message: 'Afiliados informados y dados de baja exitosamente'});
        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async findAffiliatesInLongTermDebt(req: Request, res: Response): Promise<Response>{
        try{
            const affiliatesInDebt: affiliatesInDebt[] = await this.affiliateService.getAllAffiliatesInDebt();
            return res.status(200).json(affiliatesInDebt);
        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async getAffiliateStatusCount(req: Request, res: Response): Promise<Response> {
        try {
            const { dni } = req.params;
            if (!dni) {
                return res.status(400).json({ error: 'El DNI es requerido' });
            }
            const dniNumber = Number(dni);

            const payments = await this.affiliateService.getAffiliateStatusCount(dniNumber);

            if (payments.length > 0) {
                const formattedPayments = payments.map((payment) => ({
                    totalAmount: payment.getDataValue('totalAmount'),
                    referenceMonth: payment.getDataValue('referenceMonth'),
                    referenceYear: payment.getDataValue('referenceYear'),
                    paymentStatus: payment.getDataValue('paymentStatus'),
                }));
    
                return res.status(200).json({
                    message: 'Estado de cuenta del afiliado con DNI '+dni,
                    payments: formattedPayments,
                });
            } else {
                return res.status(404).json({ error: `No existen pagos asociados al afiliado con el DNI: ${dni}`});
            }
        } catch (error: any) {
            return res.status(500).json({ error: 'Error interno del servidor. '+ error.message });
        }
    }
        
}

export default AffiliateController;
