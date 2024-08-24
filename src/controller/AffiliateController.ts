import { Request, Response } from "express";
import AffiliateService from "../services/AffiliateService";

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
            console.error('Error al dar de baja al afiliado');
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default AffiliateController
