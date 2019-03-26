import nodemailer from 'nodemailer'
import {env} from "../settings/env";
import {isTrueString} from "../helpers/utils";
import * as Mail from "nodemailer/lib/mailer";

export class MailerService {
  static getTransporter = () => {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT),
      secure: isTrueString(env.SMTP_SECURE),
    })
  }

  static sendMail = async (options: Partial<Mail.Options>) => {
    const transporter = MailerService.getTransporter()
    await transporter.sendMail({
      from: env.EMAIL_ADDRESS,
      ...options
    })
  }
}
