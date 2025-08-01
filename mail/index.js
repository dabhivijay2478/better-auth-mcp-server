import nodemailer from 'nodemailer';

// 1. Create a single, reusable transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Make sure this is an App Password
  },
  pool: true, // Enable connection pooling
  maxConnections: 5, // Adjust as needed
  rateLimit: 10, // Max 10 messages per second
  name:"localhost"
});

// Optional: Verify the connection once when the app starts
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP transporter verification failed:', error);
  } else {
    console.log('SMTP transporter is ready to send emails');
  }
});


// 2. Update sendEmail to use the shared transporter
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    // Use the shared transporter to send the mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);

    if (error.code === 'EAUTH') {
      throw new Error('Authentication failed. Check your email credentials and ensure you are using an App Password.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Connection failed. Check your network, firewall settings, and Gmail service status.');
    }

    throw error;
  }
  // 3. DO NOT close the transporter here. Let it manage the pool.
};