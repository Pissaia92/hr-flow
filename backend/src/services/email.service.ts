import nodemailer from 'nodemailer';
import { Demand } from '../config/supabase';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendUrgentDemandNotification(demand: Demand, userEmail: string, userName: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Por enquanto, enviando para o mesmo email (pode ser configurado para RH)
        subject: `🚨 Demanda URGENTE criada: ${demand.type}`,
        html: `
          <h2>Demanda URGENTE criada no HRFlow</h2>
          <p><strong>Tipo:</strong> ${demand.type}</p>
          <p><strong>Descrição:</strong> ${demand.description}</p>
          <p><strong>Usuário:</strong> ${userName} (${userEmail})</p>
          <p><strong>Data:</strong> ${new Date(demand.created_at || '').toLocaleString('pt-BR')}</p>
          <hr>
          <p>Esta é uma notificação automática do sistema HRFlow.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('📧 Email de demanda urgente enviado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email de demanda urgente:', error);
      return false;
    }
  }

  async sendTestEmail(): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Teste de configuração de email - HRFlow',
        text: 'Se você recebeu este email, a configuração de email está funcionando corretamente!',
      };

      await this.transporter.sendMail(mailOptions);
      console.log('📧 Email de teste enviado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email de teste:', error);
      return false;
    }
  }
}