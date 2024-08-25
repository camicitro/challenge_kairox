import transporter from "../config/emailNotification/transporter";
import dotenv from "dotenv";

dotenv.config();

// ************* VER SI ESTO LO PONGO COMO UNA FUNCION EXPORTADA Y NO COMO UNA CLASE

export class EmailNotificationService {
    

    constructor(){
    }

    async sendEmail(affiliateEmails: string[]): Promise<void> {
        try{
            const toField: string = affiliateEmails.join(', ');
            
            const info = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: toField,
                subject: 'Alerta baja de afiliado',
                text: 'Afiliado dado de baja debido a que no pagó durante 3 meses consecutivos'
            });
        } catch (error){
            throw new Error('Fallo al enviar mails')
        }
        
    }
}