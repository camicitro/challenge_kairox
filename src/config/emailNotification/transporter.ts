import nodemailer, { Transporter } from 'nodemailer'
import dotenv from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

dotenv.config();

const port = Number(process.env.EMAIL_PORT)

const transporter: Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    //service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
} as SMTPTransport.Options)


export default transporter