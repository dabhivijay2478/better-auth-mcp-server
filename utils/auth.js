import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from '../mail/index.js';

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true, // This ensures users must verify before they can sign in
        autoSignIn: false, // Don't auto sign in immediately after signup
    },
    emailVerification: {
        sendOnSignUp: true, // Send verification email automatically on signup
        sendOnSignIn: false, // Optionally send on sign in if email not verified
        expiresIn: 3600, // Token expires in 1 hour (3600 seconds)
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                console.log(`Sending verification email to: ${user.email}`);
                console.log(`Verification URL: ${url}`);

                await sendEmail({
                    to: user.email,
                    subject: "Verify Your Email Address",
                    text: `Hi ${user.name || 'there'},
                    Thank you for signing up! Please verify your email address by clicking the link below:
                    
                    ${url}

                    If you didn't create an account, please ignore this email.
                    This verification link will expire in 1 hour.`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <div style="text-align: center; margin-bottom: 30px;">
                                    <h1 style="color: #333; margin: 0;">Welcome!</h1>
                                </div>
                                
                                <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
                                
                                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                                    Hello ${user.name || 'there'},
                                </p>
                                
                                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                                    Thank you for signing up! To complete your registration and start using our platform, 
                                    please verify your email address by clicking the button below.
                                </p>
                                
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${url}" 
                                       style="display: inline-block; 
                                              background-color: #28a745; 
                                              color: white; 
                                              padding: 15px 30px; 
                                              text-decoration: none; 
                                              border-radius: 6px; 
                                              font-weight: 600;
                                              font-size: 16px;
                                              transition: background-color 0.3s;">
                                        Verify Email Address
                                    </a>
                                </div>
                                
                                <p style="color: #666; font-size: 14px; line-height: 1.5;">
                                    If the button doesn't work, you can also copy and paste this link into your browser:
                                </p>
                                
                                <p style="color: #007bff; font-size: 14px; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                                    ${url}
                                </p>
                                
                                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                                
                                <p style="color: #999; font-size: 12px; line-height: 1.4;">
                                    If you didn't create an account with us, please ignore this email.<br>
                                    This verification link will expire in 1 hour for security reasons.
                                </p>
                                
                                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                                    Need help? Contact our support team.
                                </p>
                            </div>
                        </div>
                    `
                });

                console.log(`Verification email sent successfully to: ${user.email}`);
            } catch (error) {
                console.error('Failed to send verification email:', error);
                // You might want to throw the error to prevent user creation if email fails
                throw new Error('Failed to send verification email');
            }
        },
    },
    // Optional: Configure session behavior
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Update session every day
    },
    // Optional: Add some security settings
    advanced: {
        useSecureCookies: process.env.NODE_ENV === 'production',
        crossSubDomainCookies: {
            enabled: false, // Set to true if you need cross-subdomain cookies
        },
    },
    // Optional: Add logging for debugging
    logger: {
        disabled: false,
        level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
    },
});