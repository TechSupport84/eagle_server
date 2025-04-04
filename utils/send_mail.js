import nodemailer from "nodemailer";
import { clientOrderTemplate } from "./clientOrderTemplate.js";
import { adminOrderTemplate } from "./adminOrderTemplate.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderEmail(clientEmail, adminEmail, orderDetails) {
  const clientMailOptions = {
    from: '"Eagle\'s Trans Company" <no-reply@eaglestrans.com>',
    to: clientEmail,
    subject: "Order Confirmation - Eagle's Trans Company",
    html: clientOrderTemplate(orderDetails),
  };

  const adminMailOptions = {
    from: '"Eagle\'s Trans System" <no-reply@eaglestrans.com>',
    to: adminEmail,
    subject: "New Order Notification - Eagle's Trans System",
    html: adminOrderTemplate(orderDetails),
  };

  try {
    await transporter.sendMail(clientMailOptions);
    console.log("Client order email sent");

    await transporter.sendMail(adminMailOptions);
    console.log("Admin notification email sent");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

export { sendOrderEmail };
