const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTemplate = (subject, content) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4CAF50; text-align: center;">${subject}</h2>
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
          ${content}
        </div>
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
          <p>Este e-mail foi enviado automaticamente. Por favor, não responda.</p>
        </div>
      </div>
    </div>
  `;
};

const sendEmailNotification = async (to, subject, content) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Plataforma OKR <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: emailTemplate(subject, content),
    });

    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }

    console.log('E-mail enviado com sucesso:', data);
    return true;
  } catch (err) {
    console.error('Erro inesperado ao enviar e-mail:', err);
    return false;
  }
};

module.exports = { sendEmailNotification };