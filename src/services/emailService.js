require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Collection Ideas Web" <haininh.project.812@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "A new idea has been posted", // Subject line
    html: `
        <h3>${dataSend.userName} </h3>
        `, // html body
  });
};

module.exports = {
  emailService: sendSimpleEmail,
};
