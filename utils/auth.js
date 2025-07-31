import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client"; // Changed this line
import { sendEmail } from '../mail/index.js';

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true, // Automatically send verification email on signup
        autoSignInAfterVerification: true, // Automatically sign in after verification
        sendVerificationEmail: async ({ user, url, token }, request) => {
            await sendEmail({
                to: user.email,
                subject: "Verify Your Email Address",
                text: `Click the link to verify your email: ${url}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Welcome to Your App!</h2>
                        <p>Hello ${user.name || 'there'},</p>
                        <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
                        <a href="${url}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                            Verify Email Address
                        </a>
                        <p>If you didn't create an account, please ignore this email.</p>
                        <p>This verification link will expire in 24 hours.</p>
                    </div>
                `
            });
        },
    },
});