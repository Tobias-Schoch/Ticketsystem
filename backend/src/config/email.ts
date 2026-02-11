export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
  from: {
    email: process.env.SMTP_FROM_EMAIL || 'noreply@ticketsystem.de',
    name: process.env.SMTP_FROM_NAME || 'Ticketsystem',
  },
};

export const emailTemplates = {
  invitation: {
    subject: 'Einladung zum Ticketsystem',
  },
  passwordReset: {
    subject: 'Passwort zurücksetzen - Ticketsystem',
  },
};
