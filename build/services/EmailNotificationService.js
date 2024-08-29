"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotificationService = void 0;
const transporter_1 = __importDefault(require("../config/emailNotification/transporter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class EmailNotificationService {
    constructor() {
    }
    async sendEmail(affiliateEmails) {
        try {
            const toField = affiliateEmails.join(', ');
            const info = await transporter_1.default.sendMail({
                from: process.env.EMAIL_USER,
                to: toField,
                subject: 'Alerta baja de afiliado',
                text: 'Afiliado dado de baja debido a que no pagó durante 3 meses consecutivos'
            });
        }
        catch (error) {
            throw new Error('Fallo al enviar mails');
        }
    }
}
exports.EmailNotificationService = EmailNotificationService;
