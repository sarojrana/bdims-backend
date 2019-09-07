const sendgridMail = require('@sendgrid/mail')

const config = require('../config/config')

sendgridMail.setApiKey(config.SENDGRID_API_KEY)

exports.sendVerificationEmail = (email, user, link) => {
  const msg = {
    to: email,
    from: 'no-reply@bdims.ml',
    templateId: config.SENDGRID_VERIFY_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      subject: 'Email Verification',
      user: user,
      verificationLink: link,
    }
  };
  sendgridMail.send(msg);
}