const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // `false` force l'utilisation de STARTTLS car le port est 587
  auth: {
    user: 'contact@workii.fr',
    pass: 'J1cWORKII69003?',
  },
  tls: {
    // Ne pas échouer sur des certificats invalides (utile pour le test)
    rejectUnauthorized: false
  }
});

console.log("Vérification de la connexion en cours vers smtp.office365.com...");

transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Erreur de connexion SMTP :');
    console.error(error);
  } else {
    console.log('✅ Connexion SMTP réussie ! Le serveur est prêt à envoyer des messages.');

    // Si vous souhaitez également tester l'envoi d'un email, décommentez les lignes ci-dessous :

    const displayName = 'Teitfitfitfii';

    transporter.sendMail({
      from: `"${displayName}" <contact@workii.fr>`,
      to: 'contact@workii.fr',
      subject: 'Test SMTP Office365',
      text: 'Ceci est un test de configuration SMTP.'
    }).then(info => {
      console.log('📧 Message test envoyé avec succès : ' + info.messageId);
    }).catch(err => {
      console.error('❌ Erreur lors de l\'envoi du message de test :');
      console.error(err);
    });
  }
});
