const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function contactWithUs(details) {
  const { name, email, message, phone } = details;
  const mailOptions = {
    from: email,
    to: process.env.ADMIN_CONTACT_EMAIL,
    subject: `${name} is trying to contact with you`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      \n
      Message: ${message}
    `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("error from contact with us", error);
    }

    console.log("Email sent: %s", info);
  });
}

function notifyMe(details) {
  const { name, email } = details;
  const mailOptions = {
    from: email,
    to: process.env.ADMIN_CONTACT_EMAIL,
    subject: `New User Interest: ${name} Wants to Stay Updated`,
    text: `
      Name: ${name}
      Email: ${email}
    `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("error from contact with us", error);
    }

    console.log("Email sent: %s", info);
    return info;
  });
}

module.exports = {
  transport,
  contactWithUs,
  notifyMe,
};
