import { Request, Response } from "express";
import AffiliateService from "../services/AffiliateService";
import { affiliatesInDebt } from "../types/AffiliateInDebtType";

class AffiliateController{
    private affiliateService: AffiliateService;

    constructor(affiliateService: AffiliateService){
        this.affiliateService = affiliateService;

    }

    async deactivateAffiliate(req: Request, res: Response): Promise<Response>{
        const { dni }  = req.params;
        const dniNumber = Number(dni);
        //console.log('dni recibido:', dniNumber)
        if(!dni){
            return res.status(400).json({ message: 'Se necesita DNI para dar de baja'})
        }
        try{
            const desactivatedAffiliate = await this.affiliateService.deactivateAffiliate(dniNumber);
            if (!desactivatedAffiliate){
                return res.status(404).json({ message: 'Afiliado no encontrado'})
            }
            return res.status(200).json({ message: 'Afiliado dado de baja exitosamente'})
        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async processAffiliatesDeactivation(req: Request, res: Response): Promise<Response>{
        try{
            await this.affiliateService.processAffiliateDeactivation()
            return res.status(200).json({ message: 'Afiliados informados y dados de baja exitosamente'}) 
        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async findAffiliatesInLongTermDebt(req: Request, res: Response): Promise<Response>{
        try{
            const affiliatesInDebt: affiliatesInDebt[] = await this.affiliateService.getAllAffiliatesInDebt()
            return res.status(200).json(affiliatesInDebt) 
        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    //despues borrar esto es para pruebassss (desde aca)
    async findAffiliatesWithUnpaid(req: Request, res: Response): Promise<Response>{
        try{
            const arrayOfAffiliates: number[] = await this.affiliateService.findAffiliatesWithUpaidPayments();
            console.log('el arreglo es: ', arrayOfAffiliates);
            
            return res.status(200).json({ message: 'funciona'})
        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async deactivateNonPayingAffiliates(req: Request, res: Response): Promise<Response>{
        try{
            const { dnis } = req.body
            await this.affiliateService.deactivateNonPayingAffiliates(dnis);
            return res.status(200).json({ message: 'Afiliados dados de baja exitosamente'})

        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }    
    
    async findEmailsUnpaids(req: Request, res: Response): Promise<Response>{
        try{
            const { dnis } = req.body
            await this.affiliateService.findNonPayingAffiliatesEmails(dnis);
            
            return res.status(200).json({ message: 'Mails bien'})

        }catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    //(hasta aca)
}

export default AffiliateController
