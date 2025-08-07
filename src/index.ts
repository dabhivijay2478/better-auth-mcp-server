import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

declare const process: any;

const SERVER_NAME = "better-v-auth";
const SERVER_VERSION = "1.0.1";

// Documentation Categories from the official docs
const DOCUMENTATION_CATEGORIES = {
  "getting-started": {
    name: "Getting Started",
    urls: [
      "/docs/introduction",
      "/docs/installation",
      "/docs/basic-usage",
      "/docs/comparison"
    ]
  },
  "concepts": {
    name: "Core Concepts",
    urls: [
      "/docs/concepts/api",
      "/docs/concepts/cli",
      "/docs/concepts/client",
      "/docs/concepts/cookies",
      "/docs/concepts/database",
      "/docs/concepts/email",
      "/docs/concepts/hooks",
      "/docs/concepts/oauth",
      "/docs/concepts/plugins",
      "/docs/concepts/rate-limit",
      "/docs/concepts/session-management",
      "/docs/concepts/typescript",
      "/docs/concepts/users-accounts"
    ]
  },
  "authentication": {
    name: "Authentication Methods",
    urls: [
      "/docs/authentication/email-password",
      "/docs/authentication/apple",
      "/docs/authentication/facebook",
      "/docs/authentication/github",
      "/docs/authentication/google",
      "/docs/authentication/microsoft"
    ]
  },
  "adapters": {
    name: "Database Adapters",
    urls: [
      "/docs/adapters/drizzle",
      "/docs/adapters/mongo",
      "/docs/adapters/mysql",
      "/docs/adapters/postgresql",
      "/docs/adapters/prisma",
      "/docs/adapters/sqlite"
    ]
  },
  "plugins": {
    name: "Plugins",
    urls: [
      "/docs/plugins/email-otp",
      "/docs/plugins/magic-link"
    ]
  },
  "integrations": {
    name: "Framework Integrations",
    urls: [
      "/docs/integrations/astro",
      "/docs/integrations/expo",
      "/docs/integrations/express",
      "/docs/integrations/fastify",
      "/docs/integrations/nestjs",
      "/docs/integrations/next",
      "/docs/integrations/nuxt",
      "/docs/integrations/tanstack"
    ]
  },
  "guides": {
    name: "Guides & Tutorials",
    urls: [
      "/docs/guides/browser-extension-guide",
      "/docs/guides/clerk-migration-guide",
      "/docs/guides/create-a-db-adapter",
      "/docs/guides/next-auth-migration-guide",
      "/docs/guides/optimizing-for-performance",
      "/docs/guides/supabase-migration-guide",
      "/docs/guides/your-first-plugin"
    ]
  },
  "examples": {
    name: "Examples",
    urls: [
      "/docs/examples/astro",
      "/docs/examples/next-js",
      "/docs/examples/nuxt",
      "/docs/examples/remix",
      "/docs/examples/svelte-kit"
    ]
  },
  "reference": {
    name: "API Reference",
    urls: [
      "/docs/reference/options"
    ]
  }
};

// Authentication Providers with comprehensive configurations
const AUTH_PROVIDERS = {
  "email-password": {
    name: "Email & Password",
    description: "Traditional email and password authentication with verification",
    category: "basic",
    config: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      sendResetPassword: "async ({ user, url, token }) => { /* send email */ }",
      resetPasswordTokenExpiresIn: 3600
    },
    setupSteps: [
      "1. Enable email and password in your auth configuration",
      "2. Configure email sending for verification emails",
      "3. Set up password reset functionality",
      "4. Configure password requirements",
      "5. Test sign up and sign in flows"
    ],
    requiredEnvVars: ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"],
    codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: \`Click the link to reset your password: \${url}\`
      });
    }
  }
});`
  },
  "apple": {
    name: "Apple Sign-In",
    description: "Apple Sign-In authentication with OpenID Connect",
    category: "social",
    config: {
      clientId: "YOUR_APPLE_CLIENT_ID",
      clientSecret: "YOUR_APPLE_CLIENT_SECRET",
      appBundleIdentifier: "YOUR_APP_BUNDLE_ID"
    },
    setupSteps: [
      "1. Create an App ID in Apple Developer Console",
      "2. Configure Sign In with Apple capability",
      "3. Create a Services ID for web authentication",
      "4. Generate client secret using private key",
      "5. Add configuration to your auth setup"
    ],
    requiredEnvVars: ["APPLE_CLIENT_ID", "APPLE_CLIENT_SECRET"],
    codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER!
    }
  },
  trustedOrigins: ["https://appleid.apple.com"]
});`
  },
  "microsoft": {
    name: "Microsoft OAuth",
    description: "Microsoft Azure Entra ID (formerly Active Directory) authentication",
    category: "social",
    config: {
      clientId: "YOUR_MICROSOFT_CLIENT_ID",
      clientSecret: "YOUR_MICROSOFT_CLIENT_SECRET",
      tenantId: "common",
      prompt: "select_account"
    },
    setupSteps: [
      "1. Register application in Microsoft Entra ID",
      "2. Configure redirect URIs",
      "3. Set up API permissions",
      "4. Generate client secret",
      "5. Add configuration to your auth setup"
    ],
    requiredEnvVars: ["MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET"],
    codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: 'common',
      prompt: "select_account"
    }
  }
});`
  },
  "facebook": {
    name: "Facebook OAuth",
    description: "Facebook OAuth authentication with user permissions",
    category: "social",
    config: {
      clientId: "YOUR_FACEBOOK_CLIENT_ID",
      clientSecret: "YOUR_FACEBOOK_CLIENT_SECRET",
      scopes: ["email", "public_profile"],
      fields: ["id", "name", "email", "picture"]
    },
    setupSteps: [
      "1. Create a Facebook App in Facebook Developers",
      "2. Add Facebook Login product",
      "3. Configure OAuth redirect URIs",
      "4. Set up app permissions",
      "5. Add configuration to your auth setup"
    ],
    requiredEnvVars: ["FACEBOOK_CLIENT_ID", "FACEBOOK_CLIENT_SECRET"],
    codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      scopes: ["email", "public_profile", "user_friends"],
      fields: ["user_friends"]
    }
  }
});`
  },
  "github": {
    name: "GitHub OAuth",
    description: "GitHub OAuth authentication with email scope",
    category: "social",
    config: {
      clientId: "YOUR_GITHUB_CLIENT_ID",
      clientSecret: "YOUR_GITHUB_CLIENT_SECRET"
    },
    setupSteps: [
      "1. Create a new OAuth App in GitHub",
      "2. Set the Authorization callback URL",
      "3. Note the Client ID and Client Secret",
      "4. Add configuration to your auth setup",
      "5. Test the authentication flow"
    ],
    requiredEnvVars: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
    codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  }
});`
  },
  "google": {
    name: "Google OAuth",
    description: "Google OAuth 2.0 authentication with refresh tokens",
    category: "social",
    config: {
      clientId: "YOUR_GOOGLE_CLIENT_ID",
      clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
      accessType: "offline",
      prompt: "select_account+consent"
    },
    setupSteps: [
      "1. Create a project in Google Cloud Console",
      "2. Enable Google+ API",
      "3. Create OAuth 2.0 credentials",
      "4. Configure authorized redirect URIs",
      "5. Add credentials to your auth configuration"
    ],
    requiredEnvVars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "select_account+consent"
    }
  }
});`
  }
};

// Database Adapters with comprehensive configurations
const DATABASE_ADAPTERS = {
  "postgresql": {
    name: "PostgreSQL",
    description: "PostgreSQL database adapter with connection pooling",
    config: {
      connectionString: "postgresql://username:password@localhost:5432/database",
      pool: { min: 2, max: 10 }
    },
    setupSteps: [
      "1. Install PostgreSQL database",
      "2. Create a database for your application",
      "3. Install pg package: npm install pg",
      "4. Configure connection string",
      "5. Run database migrations"
    ],
    requiredPackages: ["pg"],
    migrationSupport: true,
    codeExample: `import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: "postgres://user:password@localhost:5432/database"
  })
});`
  },
  "mysql": {
    name: "MySQL",
    description: "MySQL database adapter with connection pooling",
    config: {
      connectionString: "mysql://username:password@localhost:3306/database",
      pool: { min: 2, max: 10 }
    },
    setupSteps: [
      "1. Install MySQL database",
      "2. Create a database for your application",
      "3. Install mysql2 package: npm install mysql2",
      "4. Configure connection string",
      "5. Run database migrations"
    ],
    requiredPackages: ["mysql2"],
    migrationSupport: true,
    codeExample: `import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

export const auth = betterAuth({
  database: createPool({
    host: "localhost",
    user: "root", 
    password: "password",
    database: "database"
  })
});`
  },
  "sqlite": {
    name: "SQLite",
    description: "SQLite database adapter for local development",
    config: {
      filename: "./database.sqlite"
    },
    setupSteps: [
      "1. Install better-sqlite3: npm install better-sqlite3",
      "2. Configure database file path",
      "3. Run database migrations",
      "4. Ensure write permissions"
    ],
    requiredPackages: ["better-sqlite3"],
    migrationSupport: true,
    codeExample: `import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db")
});`
  },
  "drizzle": {
    name: "Drizzle ORM Adapter",
    description: "Drizzle ORM integration with Better Auth",
    config: {
      provider: "pg", // or "mysql", "sqlite"
      usePlural: false
    },
    setupSteps: [
      "1. Install and configure Drizzle ORM",
      "2. Set up database connection",
      "3. Configure Drizzle adapter",
      "4. Generate schema with Better Auth CLI",
      "5. Run migrations with Drizzle Kit"
    ],
    requiredPackages: ["drizzle-orm"],
    migrationSupport: true,
    codeExample: `import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  })
});`
  },
  "prisma": {
    name: "Prisma ORM Adapter",
    description: "Prisma ORM integration with Better Auth",
    config: {
      provider: "sqlite" // or "mysql", "postgresql"
    },
    setupSteps: [
      "1. Install and configure Prisma",
      "2. Set up database connection",
      "3. Configure Prisma adapter",
      "4. Generate schema with Better Auth CLI",
      "5. Run migrations with Prisma"
    ],
    requiredPackages: ["@prisma/client"],
    migrationSupport: false,
    codeExample: `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite"
  })
});`
  },
  "mongodb": {
    name: "MongoDB Adapter",
    description: "MongoDB database adapter for Better Auth",
    config: {
      connectionString: "mongodb://localhost:27017/database"
    },
    setupSteps: [
      "1. Install MongoDB",
      "2. Create database and collections",
      "3. Install mongodb package: npm install mongodb",
      "4. Configure connection string",
      "5. No migrations needed for MongoDB"
    ],
    requiredPackages: ["mongodb"],
    migrationSupport: false,
    codeExample: `import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient("mongodb://localhost:27017/database");
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db)
});`
  }
};

// Comprehensive Plugins with detailed configurations
const PLUGINS = {
  "email-otp": {
    name: "Email OTP",
    description: "One-time password authentication via email",
    category: "security",
    config: {
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOTP: "async ({ email, otp, type }) => { /* send OTP */ }",
      overrideDefaultEmailVerification: false,
      allowedAttempts: 3
    },
    setupSteps: [
      "1. Install email OTP plugin",
      "2. Configure email sending function",
      "3. Set up OTP verification flow",
      "4. Configure OTP length and expiration",
      "5. Test OTP authentication"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmail({
          to: email,
          subject: "Your verification code",
          text: \`Your OTP is: \${otp}\`
        });
      },
      otpLength: 6,
      expiresIn: 300
    })
  ]
});`
  },
  "magic-link": {
    name: "Magic Link",
    description: "Passwordless authentication via email links",
    category: "security",
    config: {
      expiresIn: 300,
      disableSignUp: false,
      sendMagicLink: "async ({ email, token, url }) => { /* send link */ }"
    },
    setupSteps: [
      "1. Install magic link plugin",
      "2. Configure email sending function",
      "3. Set up email templates",
      "4. Configure token expiration",
      "5. Test magic link flow"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await sendEmail({
          to: email,
          subject: "Sign in to your account",
          text: \`Click to sign in: \${url}\`
        });
      }
    })
  ]
});`
  },
  "two-factor": {
    name: "Two-Factor Authentication",
    description: "TOTP-based 2FA with QR codes and backup codes",
    category: "security",
    config: {
      issuer: "Your App",
      algorithm: "sha1",
      digits: 6,
      period: 30
    },
    setupSteps: [
      "1. Install two-factor plugin",
      "2. Configure TOTP settings",
      "3. Set up QR code generation",
      "4. Configure client-side verification",
      "5. Test 2FA setup and verification"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      issuer: "Your App Name"
    })
  ]
});`
  },
  "passkey": {
    name: "Passkey",
    description: "WebAuthn/FIDO2 passkey authentication",
    category: "security",
    config: {
      rpName: "Your App",
      rpID: "localhost",
      userVerification: "preferred"
    },
    setupSteps: [
      "1. Install passkey plugin",
      "2. Configure relying party settings",
      "3. Set up user verification",
      "4. Configure client-side integration",
      "5. Test passkey registration and authentication"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { passkey } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    passkey({
      rpName: "Your App",
      rpID: "localhost"
    })
  ]
});`
  },
  "username": {
    name: "Username Authentication",
    description: "Username-based authentication extending email/password",
    category: "basic",
    config: {
      requireUsername: true,
      allowEmailAndUsername: false
    },
    setupSteps: [
      "1. Install username plugin",
      "2. Configure username requirements",
      "3. Set up validation rules",
      "4. Update client forms",
      "5. Test username authentication"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    username({
      requireUsername: true
    })
  ]
});`
  },
  "phone-number": {
    name: "Phone Number Authentication",
    description: "SMS-based phone number authentication",
    category: "basic",
    config: {
      sendSMS: "async ({ phoneNumber, otp }) => { /* send SMS */ }",
      otpLength: 6,
      expiresIn: 300
    },
    setupSteps: [
      "1. Install phone number plugin",
      "2. Configure SMS sending service",
      "3. Set up phone verification flow",
      "4. Configure OTP settings",
      "5. Test SMS authentication"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    phoneNumber({
      sendSMS: async ({ phoneNumber, otp }) => {
        await sendSMS({
          to: phoneNumber,
          message: \`Your verification code is: \${otp}\`
        });
      }
    })
  ]
});`
  },
  "organization": {
    name: "Organization Management",
    description: "Multi-tenant organization and role management",
    category: "enterprise",
    config: {
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      memberLimit: 50
    },
    setupSteps: [
      "1. Install organization plugin",
      "2. Set up organization schema",
      "3. Configure roles and permissions",
      "4. Set up invitation system",
      "5. Test organization workflows"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5
    })
  ]
});`
  },
  "admin": {
    name: "Admin Panel",
    description: "Administrative functions and user management",
    category: "enterprise",
    config: {
      admins: ["admin@example.com"],
      defaultRole: "user"
    },
    setupSteps: [
      "1. Install admin plugin",
      "2. Configure admin users",
      "3. Set up role-based access",
      "4. Configure admin endpoints",
      "5. Test admin functionality"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    admin({
      admins: ["admin@example.com"]
    })
  ]
});`
  },
  "multi-session": {
    name: "Multi Session",
    description: "Multiple active sessions across devices",
    category: "session",
    config: {
      maximumSessions: 10
    },
    setupSteps: [
      "1. Install multi-session plugin",
      "2. Configure session limits",
      "3. Set up session management UI",
      "4. Test multi-device sessions",
      "5. Configure session cleanup"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { multiSession } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    multiSession({
      maximumSessions: 10
    })
  ]
});`
  },
  "anonymous": {
    name: "Anonymous Authentication",
    description: "Anonymous user sessions without registration",
    category: "basic",
    config: {
      enabled: true
    },
    setupSteps: [
      "1. Install anonymous plugin",
      "2. Configure anonymous user handling",
      "3. Set up session conversion",
      "4. Test anonymous flows",
      "5. Handle user conversion"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    anonymous()
  ]
});`
  },
  "bearer-token": {
    name: "Bearer Token",
    description: "API authentication with bearer tokens",
    category: "api",
    config: {
      enabled: true
    },
    setupSteps: [
      "1. Install bearer token plugin",
      "2. Configure token generation",
      "3. Set up API authentication",
      "4. Test token validation",
      "5. Handle token refresh"
    ],
    requiredPackages: [],
    clientSetup: false,
    codeExample: `import { betterAuth } from "better-auth";
import { bearerToken } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    bearerToken()
  ]
});`
  },
  "one-tap": {
    name: "Google One Tap",
    description: "Google One Tap sign-in integration",
    category: "social",
    config: {
      googleOneTapId: "YOUR_GOOGLE_CLIENT_ID"
    },
    setupSteps: [
      "1. Install one tap plugin",
      "2. Configure Google client ID",
      "3. Set up One Tap UI",
      "4. Handle One Tap callbacks",
      "5. Test One Tap flow"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { oneTap } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    oneTap({
      googleOneTapId: process.env.GOOGLE_CLIENT_ID!
    })
  ]
});`
  },
  "generic-oauth": {
    name: "Generic OAuth",
    description: "Custom OAuth provider integration",
    category: "social",
    config: {
      providerId: "custom",
      discoveryUrl: "https://provider.com/.well-known/openid_configuration"
    },
    setupSteps: [
      "1. Install generic OAuth plugin",
      "2. Configure OAuth provider details",
      "3. Set up discovery endpoint",
      "4. Configure scopes and claims",
      "5. Test OAuth flow"
    ],
    requiredPackages: [],
    clientSetup: true,
    codeExample: `import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      providerId: "custom",
      discoveryUrl: "https://provider.com/.well-known/openid_configuration",
      clientId: "YOUR_CLIENT_ID",
      clientSecret: "YOUR_CLIENT_SECRET"
    })
  ]
});`
  }
};

// Framework Integrations
const FRAMEWORK_INTEGRATIONS = {
  "nextjs": {
    name: "Next.js Integration",
    description: "Complete Next.js integration with App Router and Pages Router support",
    setupSteps: [
      "1. Create API route at /api/auth/[...all]/route.ts",
      "2. Use toNextJsHandler for App Router",
      "3. Set up middleware for route protection",
      "4. Configure client with React hooks",
      "5. Handle server-side session management"
    ],
    codeExample: `// API Route: /api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);`
  },
  "nuxt": {
    name: "Nuxt Integration",
    description: "Nuxt 3 integration with server API routes and Vue composables",
    setupSteps: [
      "1. Create server API route at /server/api/auth/[...all].ts",
      "2. Set up client with Vue composables",
      "3. Configure SSR session handling",
      "4. Set up middleware for route protection",
      "5. Handle server-side authentication"
    ],
    codeExample: `// Server Route: /server/api/auth/[...all].ts
import { auth } from "~/lib/auth";

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});`
  },
  "astro": {
    name: "Astro Integration",
    description: "Astro integration with multiple frontend framework support",
    setupSteps: [
      "1. Create API route at /pages/api/auth/[...all].ts",
      "2. Set up middleware for session handling",
      "3. Configure client for your frontend framework",
      "4. Handle server-side rendering",
      "5. Set up route protection"
    ],
    codeExample: `// API Route: /pages/api/auth/[...all].ts
import { auth } from "~/auth";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};`
  },
  "sveltekit": {
    name: "SvelteKit Integration",
    description: "SvelteKit integration with hooks and server-side handling",
    setupSteps: [
      "1. Set up handler in hooks.server.ts",
      "2. Use svelteKitHandler helper",
      "3. Configure client with Svelte stores",
      "4. Handle server-side sessions",
      "5. Set up route protection"
    ],
    codeExample: `// hooks.server.ts
import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";

export async function handle({ event, resolve }) {
  return svelteKitHandler({ event, resolve, auth });
}`
  },
  "remix": {
    name: "Remix Integration",
    description: "Remix integration with loaders and actions",
    setupSteps: [
      "1. Create API route at /app/routes/api.auth.$.ts",
      "2. Handle both GET and POST requests",
      "3. Set up client with React hooks",
      "4. Use loaders for server-side sessions",
      "5. Configure route protection"
    ],
    codeExample: `// Route: /app/routes/api.auth.$.ts
import { auth } from '~/lib/auth.server';
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.handler(request);
}`
  },
  "express": {
    name: "Express Integration",
    description: "Express.js integration with middleware support",
    setupSteps: [
      "1. Set up catch-all route for /api/auth/*",
      "2. Use toNodeHandler helper",
      "3. Configure CORS properly",
      "4. Handle body parsing correctly",
      "5. Set up session middleware"
    ],
    codeExample: `import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
app.all("/api/auth/*", toNodeHandler(auth));`
  },
  "fastify": {
    name: "Fastify Integration",
    description: "Fastify integration with plugin system",
    setupSteps: [
      "1. Create route handler for /api/auth/*",
      "2. Convert Fastify request to standard Request",
      "3. Configure CORS plugin",
      "4. Handle response conversion",
      "5. Set up error handling"
    ],
    codeExample: `import Fastify from "fastify";
import { auth } from "./auth";

const fastify = Fastify({ logger: true });

fastify.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    const response = await auth.handler(request);
    reply.status(response.status);
    return response.body;
  }
});`
  },
  "expo": {
    name: "Expo Integration",
    description: "Expo/React Native integration with secure storage",
    setupSteps: [
      "1. Install @better-auth/expo package",
      "2. Configure Expo plugin on server",
      "3. Set up client with secure storage",
      "4. Configure deep linking scheme",
      "5. Handle OAuth redirects"
    ],
    codeExample: `// Server
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  plugins: [expo()]
});

// Client  
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  plugins: [
    expoClient({
      scheme: "myapp",
      storage: SecureStore
    })
  ]
});`
  },
  "tanstack": {
    name: "TanStack Start Integration",
    description: "TanStack Start integration with server functions",
    setupSteps: [
      "1. Create server route at /src/routes/api/auth/$.ts",
      "2. Use createServerFileRoute",
      "3. Handle GET and POST methods",
      "4. Configure client with React hooks",
      "5. Set up cookie handling"
    ],
    codeExample: `// Route: /src/routes/api/auth/$.ts
import { auth } from '@/lib/auth';
import { createServerFileRoute } from '@tanstack/react-start/server';

export const ServerRoute = createServerFileRoute('/api/auth/).methods({
  GET: ({ request }) => auth.handler(request),
  POST: ({ request }) => auth.handler(request)
});`
  }
};

async function initResources(server: McpServer) {
  try {
    // Register comprehensive Better Auth documentation resource
    server.registerResource(
      "better_auth_complete_docs",
      "better-auth://complete-documentation",
      {
        title: "Complete Better Auth Documentation",
        description: "Comprehensive Better Auth documentation with all features and configurations",
        mimeType: "text/markdown"
      },
      async () => {
        const documentationContent = `# Better Auth - Complete Documentation

## Overview
Better Auth is the most comprehensive authentication framework for TypeScript applications. It's framework-agnostic, fully customizable, and includes advanced features out of the box.

## Key Features
- 🚀 Framework agnostic - Works with any framework
- 🔐 Advanced security - 2FA, passkeys, rate limiting
- 🧩 Plugin ecosystem - Extend functionality easily  
- 🎯 Full control - Customize everything
- 📱 Multi-platform - Web, mobile, desktop
- 🏢 Enterprise ready - Organizations, SSO, admin panel

## Quick Start
\`\`\`bash
npm install better-auth
\`\`\`

\`\`\`typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  }
});
\`\`\`

## Documentation Sections

### Getting Started
- Installation and setup
- Basic configuration
- Environment variables
- Database setup

### Authentication Methods
- Email & Password
- Social OAuth (Google, GitHub, Apple, etc.)
- Magic Links
- Passkeys (WebAuthn)
- Email OTP
- Phone Number

### Database Support
- PostgreSQL
- MySQL  
- SQLite
- MongoDB
- Prisma ORM
- Drizzle ORM

### Advanced Features
- Two-Factor Authentication
- Multi-tenant Organizations
- Admin Panel
- Rate Limiting
- Session Management
- User Management

### Framework Integrations
- Next.js (App Router & Pages)
- Nuxt 3
- SvelteKit
- Remix
- Astro
- Express
- Fastify
- Expo/React Native

### Security Features
- CSRF Protection
- Rate Limiting
- Session Security
- Password Hashing
- Token Encryption
- Secure Cookies

For detailed documentation, visit: https://better-auth.com/docs
`;

        return {
          contents: [{
            uri: "better-auth://complete-documentation",
            text: documentationContent
          }]
        };
      }
    );
  } catch (error) {
    console.error("Failed to register resources:", error);
  }
}

async function initTools(server: McpServer) {
  try {
    // Documentation Category Tools
    server.registerTool(
      "get_documentation_categories",
      {
        title: "Get Documentation Categories",
        description: "Returns all available Better Auth documentation categories",
        inputSchema: {
          topic: z.string().optional(),
          question: z.string().optional()
        }
      },
      async ({ topic, question }) => {
        try {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                categories: Object.keys(DOCUMENTATION_CATEGORIES),
                details: DOCUMENTATION_CATEGORIES,
                topic,
                question
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_documentation_categories:", error);
          throw new Error(`Failed to get documentation categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_documentation_urls",
      {
        title: "Get Documentation URLs",
        description: "Get all documentation URLs for a specific category",
        inputSchema: {
          category: z.string()
        }
      },
      async ({ category }) => {
        try {
          const categoryData = DOCUMENTATION_CATEGORIES[category as keyof typeof DOCUMENTATION_CATEGORIES];
          if (!categoryData) {
            throw new Error(`Category '${category}' not found`);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                category,
                name: categoryData.name,
                urls: categoryData.urls,
                baseUrl: "https://better-auth.com"
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_documentation_urls:", error);
          throw new Error(`Failed to get documentation URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Provider Management Tools
    server.registerTool(
      "get_all_auth_providers",
      {
        title: "Get All Authentication Providers",
        description: "Returns all available Better Auth authentication providers",
        inputSchema: {
          topic: z.string().optional(),
          question: z.string().optional()
        }
      },
      async ({ topic, question }) => {
        try {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                providers: Object.keys(AUTH_PROVIDERS),
                categories: {
                  basic: Object.keys(AUTH_PROVIDERS).filter(key => AUTH_PROVIDERS[key as keyof typeof AUTH_PROVIDERS].category === 'basic'),
                  social: Object.keys(AUTH_PROVIDERS).filter(key => AUTH_PROVIDERS[key as keyof typeof AUTH_PROVIDERS].category === 'social')
                },
                total: Object.keys(AUTH_PROVIDERS).length,
                topic,
                question
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_all_auth_providers:", error);
          throw new Error(`Failed to get auth providers: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_auth_provider_config",
      {
        title: "Get Authentication Provider Configuration",
        description: "Get detailed configuration and setup instructions for a specific authentication provider",
        inputSchema: {
          provider_name: z.string()
        }
      },
      async ({ provider_name }) => {
        try {
          const provider = AUTH_PROVIDERS[provider_name as keyof typeof AUTH_PROVIDERS];
          if (!provider) {
            throw new Error(`Provider '${provider_name}' not found`);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                provider: provider_name,
                ...provider,
                docUrl: `/docs/authentication/${provider_name}`,
                callbackUrl: `http://localhost:3000/api/auth/callback/${provider_name}`
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_auth_provider_config:", error);
          throw new Error(`Failed to get provider config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Database Adapter Tools
    server.registerTool(
      "get_all_database_adapters",
      {
        title: "Get All Database Adapters",
        description: "Returns all available Better Auth database adapters",
        inputSchema: {}
      },
      async () => {
        try {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                adapters: Object.keys(DATABASE_ADAPTERS),
                withMigrationSupport: Object.keys(DATABASE_ADAPTERS).filter(key =>
                  DATABASE_ADAPTERS[key as keyof typeof DATABASE_ADAPTERS].migrationSupport
                ),
                total: Object.keys(DATABASE_ADAPTERS).length
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_all_database_adapters:", error);
          throw new Error(`Failed to get database adapters: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_database_adapter_config",
      {
        title: "Get Database Adapter Configuration",
        description: "Get detailed configuration and setup instructions for a specific database adapter",
        inputSchema: {
          adapter_name: z.string()
        }
      },
      async ({ adapter_name }) => {
        try {
          const adapter = DATABASE_ADAPTERS[adapter_name as keyof typeof DATABASE_ADAPTERS];
          if (!adapter) {
            throw new Error(`Adapter '${adapter_name}' not found`);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                adapter: adapter_name,
                ...adapter,
                docUrl: `/docs/adapters/${adapter_name}`,
                cliCommands: {
                  generate: "npx @better-auth/cli generate",
                  migrate: adapter.migrationSupport ? "npx @better-auth/cli migrate" : "Not supported - use ORM migrations"
                }
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_database_adapter_config:", error);
          throw new Error(`Failed to get adapter config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Plugin Management Tools
    server.registerTool(
      "get_all_plugins",
      {
        title: "Get All Plugins",
        description: "Returns all available Better Auth plugins",
        inputSchema: {
          topic: z.string().optional(),
          question: z.string().optional()
        }
      },
      async ({ topic, question }) => {
        try {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                plugins: Object.keys(PLUGINS),
                categories: {
                  security: Object.keys(PLUGINS).filter(key => PLUGINS[key as keyof typeof PLUGINS].category === 'security'),
                  basic: Object.keys(PLUGINS).filter(key => PLUGINS[key as keyof typeof PLUGINS].category === 'basic'),
                  enterprise: Object.keys(PLUGINS).filter(key => PLUGINS[key as keyof typeof PLUGINS].category === 'enterprise'),
                  social: Object.keys(PLUGINS).filter(key => PLUGINS[key as keyof typeof PLUGINS].category === 'social'),
                  session: Object.keys(PLUGINS).filter(key => PLUGINS[key as keyof typeof PLUGINS].category === 'session'),
                  api: Object.keys(PLUGINS).filter(key => PLUGINS[key as keyof typeof PLUGINS].category === 'api')
                },
                withClientSetup: Object.keys(PLUGINS).filter(key => PLUGINS[key as keyof typeof PLUGINS].clientSetup),
                total: Object.keys(PLUGINS).length,
                topic,
                question
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_all_plugins:", error);
          throw new Error(`Failed to get plugins: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_plugin_config",
      {
        title: "Get Plugin Configuration",
        description: "Get detailed configuration and setup instructions for a specific plugin",
        inputSchema: {
          plugin_name: z.string()
        }
      },
      async ({ plugin_name }) => {
        try {
          const plugin = PLUGINS[plugin_name as keyof typeof PLUGINS];
          if (!plugin) {
            throw new Error(`Plugin '${plugin_name}' not found`);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                plugin: plugin_name,
                ...plugin,
                docUrl: `/docs/plugins/${plugin_name}`,
                clientPlugin: plugin.clientSetup ? `import { ${plugin_name}Client } from "better-auth/client/plugins";` : "No client plugin required"
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_plugin_config:", error);
          throw new Error(`Failed to get plugin config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Configuration Generation Tools
    server.registerTool(
      "generate_auth_config",
      {
        title: "Generate Complete Better Auth Configuration",
        description: "Generate a complete Better Auth configuration with specified providers, adapters, and plugins",
        inputSchema: {
          providers: z.array(z.string()),
          adapter: z.string(),
          plugins: z.array(z.string()),
          framework: z.string().optional()
        }
      },
      async ({ providers, adapter, plugins, framework }) => {
        try {
          // Validate inputs
          const invalidProviders = providers.filter(p => !AUTH_PROVIDERS[p as keyof typeof AUTH_PROVIDERS]);
          const invalidPlugins = plugins.filter(p => !PLUGINS[p as keyof typeof PLUGINS]);

          if (!DATABASE_ADAPTERS[adapter as keyof typeof DATABASE_ADAPTERS]) {
            throw new Error(`Invalid adapter: ${adapter}`);
          }

          if (invalidProviders.length > 0) {
            throw new Error(`Invalid providers: ${invalidProviders.join(', ')}`);
          }

          if (invalidPlugins.length > 0) {
            throw new Error(`Invalid plugins: ${invalidPlugins.join(', ')}`);
          }

          // Generate imports
          const pluginImports = plugins.length > 0 ?
            `import { ${plugins.join(', ')} } from "better-auth/plugins";` : '';

          const adapterImport = DATABASE_ADAPTERS[adapter as keyof typeof DATABASE_ADAPTERS].requiredPackages.length > 0 ?
            `import { ${DATABASE_ADAPTERS[adapter as keyof typeof DATABASE_ADAPTERS].requiredPackages.join(', ')} } from "${DATABASE_ADAPTERS[adapter as keyof typeof DATABASE_ADAPTERS].requiredPackages[0]}";` : '';

          // Generate config
          const config = `import { betterAuth } from "better-auth";
${adapterImport}
${pluginImports}

export const auth = betterAuth({
  database: ${DATABASE_ADAPTERS[adapter as keyof typeof DATABASE_ADAPTERS].codeExample.split('database: ')[1].split(',')[0]},
  
  ${providers.includes('email-password') ? `emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },` : ''}
  
  ${providers.filter(p => p !== 'email-password').length > 0 ? `socialProviders: {
    ${providers.filter(p => p !== 'email-password').map(provider => {
            const providerConfig = AUTH_PROVIDERS[provider as keyof typeof AUTH_PROVIDERS];
            return `${provider}: {
      clientId: process.env.${provider.toUpperCase()}_CLIENT_ID!,
      clientSecret: process.env.${provider.toUpperCase()}_CLIENT_SECRET!
    }`;
          }).join(',\n    ')}
  },` : ''}
  
  ${plugins.length > 0 ? `plugins: [
    ${plugins.map(plugin => `${plugin}()`).join(',\n    ')}
  ],` : ''}
  
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!
});`;

          // Generate client config if framework is specified
          const clientConfig = framework ? `
// Client configuration for ${framework}
import { createAuthClient } from "better-auth/${framework === 'nextjs' ? 'react' : framework}";
${plugins.filter(p => PLUGINS[p as keyof typeof PLUGINS].clientSetup).length > 0 ?
              `import { ${plugins.filter(p => PLUGINS[p as keyof typeof PLUGINS].clientSetup).map(p => `${p}Client`).join(', ')} } from "better-auth/client/plugins";` : ''}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  ${plugins.filter(p => PLUGINS[p as keyof typeof PLUGINS].clientSetup).length > 0 ? `plugins: [
    ${plugins.filter(p => PLUGINS[p as keyof typeof PLUGINS].clientSetup).map(p => `${p}Client()`).join(',\n    ')}
  ]` : ''}
});` : '';

          // Collect all required environment variables
          const allEnvVars = [
            'BETTER_AUTH_SECRET',
            'BETTER_AUTH_URL',
            ...providers.flatMap(p => AUTH_PROVIDERS[p as keyof typeof AUTH_PROVIDERS]?.requiredEnvVars || [])
          ];

          // Generate framework-specific handler if specified
          const frameworkHandler = framework && FRAMEWORK_INTEGRATIONS[framework as keyof typeof FRAMEWORK_INTEGRATIONS] ?
            FRAMEWORK_INTEGRATIONS[framework as keyof typeof FRAMEWORK_INTEGRATIONS].codeExample : '';

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                serverConfig: config,
                clientConfig,
                frameworkHandler,
                setupInstructions: [
                  "1. Install Better Auth: npm install better-auth",
                  "2. Set up your database and configure the adapter",
                  "3. Configure your authentication providers with proper credentials",
                  "4. Set up email configuration for verification emails",
                  "5. Configure environment variables for secrets and API keys",
                  "6. Run database migrations: npx @better-auth/cli migrate",
                  "7. Test the authentication flow"
                ],
                requiredPackages: [
                  "better-auth",
                  ...DATABASE_ADAPTERS[adapter as keyof typeof DATABASE_ADAPTERS].requiredPackages,
                  ...plugins.flatMap(p => PLUGINS[p as keyof typeof PLUGINS]?.requiredPackages || [])
                ],
                requiredEnvVars: [...new Set(allEnvVars)], // Remove duplicates
                providers,
                adapter,
                plugins,
                framework
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in generate_auth_config:", error);
          throw new Error(`Failed to generate config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Configuration Validation Tool
    server.registerTool(
      "validate_auth_setup",
      {
        title: "Validate Better Auth Setup",
        description: "Validate a Better Auth configuration and provide recommendations",
        inputSchema: {
          config: z.string(),
          framework: z.string().optional()
        }
      },
      async ({ config, framework }) => {
        try {
          const validation = {
            valid: true,
            errors: [] as string[],
            warnings: [] as string[],
            recommendations: [] as string[]
          };

          // Basic validation checks
          if (!config.includes('betterAuth')) {
            validation.errors.push('Missing betterAuth import or instantiation');
            validation.valid = false;
          }

          if (!config.includes('database:')) {
            validation.errors.push('Database configuration is required');
            validation.valid = false;
          }

          if (!config.includes('secret:') && !config.includes('BETTER_AUTH_SECRET')) {
            validation.warnings.push('Secret configuration not found - ensure BETTER_AUTH_SECRET is set');
          }

          // Check for email configuration if email/password is enabled
          if (config.includes('emailAndPassword') && !config.includes('sendVerificationEmail')) {
            validation.warnings.push('Email verification not configured - users cannot verify their emails');
          }

          // Security recommendations
          if (!config.includes('rateLimit')) {
            validation.recommendations.push('Consider adding rate limiting for enhanced security');
          }

          if (!config.includes('twoFactor') && !config.includes('passkey')) {
            validation.recommendations.push('Consider adding two-factor authentication or passkeys for enhanced security');
          }

          if (config.includes('socialProviders') && !config.includes('trustedOrigins')) {
            validation.warnings.push('Trusted origins not configured - may cause CORS issues with OAuth');
          }

          // Framework-specific recommendations
          if (framework === 'nextjs' && !config.includes('nextCookies')) {
            validation.recommendations.push('Consider adding nextCookies plugin for server actions');
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(validation, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in validate_auth_setup:", error);
          throw new Error(`Failed to validate setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Framework Integration Tools
    server.registerTool(
      "get_framework_integration",
      {
        title: "Get Framework Integration Guide",
        description: "Get integration guide for a specific framework",
        inputSchema: {
          framework: z.string()
        }
      },
      async ({ framework }) => {
        try {
          const integration = FRAMEWORK_INTEGRATIONS[framework as keyof typeof FRAMEWORK_INTEGRATIONS];
          if (!integration) {
            throw new Error(`Framework '${framework}' not found`);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                framework,
                ...integration,
                docUrl: `/docs/integrations/${framework}`,
                supportedFeatures: [
                  "Server-side rendering",
                  "Route protection",
                  "Session management",
                  "Cookie handling",
                  "Error handling"
                ]
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_framework_integration:", error);
          throw new Error(`Failed to get framework integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Advanced Configuration Tools
    server.registerTool(
      "get_mcp_plugin_config",
      {
        title: "Get MCP Plugin Configuration",
        description: "Get detailed configuration and setup instructions for the MCP plugin",
        inputSchema: {}
      },
      async () => {
        try {
          const mcpConfig = {
            name: "MCP Plugin",
            description: "Model Context Protocol integration for Better Auth",
            category: "integration",
            config: {
              enabled: true,
              scope: ["profile", "email"]
            },
            setupSteps: [
              "1. Add MCP plugin to auth configuration",
              "2. Configure OAuth scopes for MCP access",
              "3. Set up session handling for MCP clients",
              "4. Configure discovery metadata endpoint",
              "5. Test MCP integration"
            ],
            codeExample: `import { betterAuth } from "better-auth";
import { mcp } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    mcp({
      scope: ["profile", "email"]
    })
  ]
});`,
            discoveryEndpoint: "/.well-known/oauth-authorization-server",
            requiredEnvVars: ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"]
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(mcpConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_mcp_plugin_config:", error);
          throw new Error(`Failed to get MCP plugin config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_mcp_session_handler",
      {
        title: "Get MCP Session Handler Configuration",
        description: "Get configuration for MCP session handling with withMcpAuth",
        inputSchema: {}
      },
      async () => {
        try {
          const sessionHandlerConfig = {
            name: "MCP Session Handler",
            description: "Handle MCP authentication and session management",
            method: "withMcpAuth",
            codeExample: `import { withMcpAuth } from "better-auth/mcp";
import { auth } from "./auth";

export default withMcpAuth(
  async (req, session) => {
    // Your MCP handler logic here
    return new Response("MCP endpoint with auth");
  },
  auth
);`,
            setupSteps: [
              "1. Import withMcpAuth from better-auth/mcp",
              "2. Wrap your MCP handler with withMcpAuth",
              "3. Pass your auth instance as second parameter",
              "4. Access session data in handler function",
              "5. Return appropriate responses"
            ],
            sessionAccess: "The session object contains user and session data when authenticated"
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(sessionHandlerConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_mcp_session_handler:", error);
          throw new Error(`Failed to get MCP session handler config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_oauth_discovery_metadata",
      {
        title: "Get OAuth Discovery Metadata Configuration",
        description: "Get configuration for OAuth discovery metadata route",
        inputSchema: {}
      },
      async () => {
        try {
          const oauthMetadataConfig = {
            name: "OAuth Discovery Metadata",
            description: "Route to expose OAuth metadata for MCP clients",
            route: "/.well-known/oauth-authorization-server",
            codeExample: `import { oAuthDiscoveryMetadata } from "better-auth/plugins";
import { auth } from "../../../lib/auth";

export const GET = oAuthDiscoveryMetadata(auth);`,
            setupSteps: [
              "1. Create route at .well-known/oauth-authorization-server",
              "2. Import oAuthDiscoveryMetadata from better-auth/plugins",
              "3. Export GET handler with oAuthDiscoveryMetadata(auth)",
              "4. Ensure auth instance is properly configured"
            ],
            metadata: {
              authorization_endpoint: "/api/auth/authorize",
              token_endpoint: "/api/auth/token",
              scopes_supported: ["profile", "email"],
              response_types_supported: ["code"]
            }
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(oauthMetadataConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_oauth_discovery_metadata:", error);
          throw new Error(`Failed to get OAuth discovery metadata config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_mcp_session_api",
      {
        title: "Get MCP Session API Configuration",
        description: "Get configuration for using auth.api.getMcpSession",
        inputSchema: {}
      },
      async () => {
        try {
          const sessionApiConfig = {
            name: "MCP Session API",
            description: "Get session using access token sent from MCP client",
            method: "auth.api.getMcpSession",
            codeExample: `import { auth } from "@/lib/auth";

const handler = async (req: Request) => {
  const session = await auth.api.getMcpSession({
    headers: req.headers
  });
  
  if (!session) {
    return new Response(null, { status: 401 });
  }
  
  // Use session data
  return new Response(JSON.stringify({
    user: session.user,
    authenticated: true
  }));
};`,
            setupSteps: [
              "1. Import auth instance",
              "2. Call auth.api.getMcpSession with request headers",
              "3. Handle case where session is null (return 401)",
              "4. Use session data for your logic",
              "5. Return appropriate response"
            ],
            parameters: {
              headers: "Request headers containing the access token"
            },
            returns: "Session object with user and session data, or null if not authenticated"
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(sessionApiConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_mcp_session_api:", error);
          throw new Error(`Failed to get MCP session API config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Additional Plugin Configuration Tools
    server.registerTool(
      "get_multi_session_plugin_config",
      {
        title: "Get Multi Session Plugin Configuration",
        description: "Get configuration for the multi-session plugin",
        inputSchema: {}
      },
      async () => {
        try {
          const multiSessionConfig = {
            name: "Multi Session Plugin",
            description: "Allows users to maintain multiple active sessions across different devices",
            category: "session",
            config: {
              maximumSessions: 10
            },
            setupSteps: [
              "1. Add multiSession plugin to auth configuration",
              "2. Add client plugin to auth client",
              "3. Configure session limits",
              "4. Test multi-session functionality",
              "5. Set up session management UI"
            ],
            codeExample: `import { betterAuth } from "better-auth";
import { multiSession } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    multiSession({
      maximumSessions: 10
    })
  ]
});`,
            clientSetup: `import { multiSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    multiSessionClient()
  ]
});`,
            apiMethods: [
              "listSessions() - Get all user sessions",
              "revokeSession(token) - Revoke specific session",
              "revokeOtherSessions() - Revoke all other sessions",
              "revokeSessions() - Revoke all sessions"
            ]
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(multiSessionConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_multi_session_plugin_config:", error);
          throw new Error(`Failed to get multi session plugin config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Core Feature Configuration Tools
    server.registerTool(
      "get_email_verification_config",
      {
        title: "Get Email Verification Configuration",
        description: "Get configuration for email verification setup",
        inputSchema: {}
      },
      async () => {
        try {
          const emailVerificationConfig = {
            name: "Email Verification",
            description: "Token-based email verification for security",
            category: "security",
            config: {
              sendOnSignUp: true,
              requireEmailVerification: false,
              autoSignInAfterVerification: true,
              expiresIn: 3600
            },
            setupSteps: [
              "1. Configure sendVerificationEmail function",
              "2. Set up email sending service",
              "3. Configure verification URLs and callbacks",
              "4. Test email verification flow",
              "5. Handle verification success/error states"
            ],
            codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: \`Click the link to verify your email: \${url}\`
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600 // 1 hour
  }
});`,
            clientUsage: `// Manually trigger email verification
await authClient.sendVerificationEmail({
  email: "user@example.com",
  callbackURL: "/dashboard"
});

// Verify email with token
await authClient.verifyEmail({
  query: { token: "verification_token" }
});`,
            requiredEnvVars: ["EMAIL_SERVICE_CONFIG"]
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(emailVerificationConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_email_verification_config:", error);
          throw new Error(`Failed to get email verification config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_password_reset_config",
      {
        title: "Get Password Reset Configuration",
        description: "Get configuration for password reset functionality",
        inputSchema: {}
      },
      async () => {
        try {
          const passwordResetConfig = {
            name: "Password Reset",
            description: "Secure password reset via email tokens",
            category: "security",
            config: {
              enabled: true,
              tokenExpiresIn: 3600,
              sendResetPassword: true
            },
            setupSteps: [
              "1. Configure sendResetPassword function in emailAndPassword config",
              "2. Set up email sending service",
              "3. Create password reset page with form",
              "4. Handle reset token validation and password update",
              "5. Test complete password reset flow"
            ],
            codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: \`Click the link to reset your password: \${url}\`
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    onPasswordReset: async ({ user }, request) => {
      console.log(\`Password reset for user: \${user.email}\`);
    }
  }
});`,
            clientUsage: `// Request password reset
await authClient.requestPasswordReset({
  email: "user@example.com",
  redirectTo: "/reset-password"
});

// Reset password with token
await authClient.resetPassword({
  newPassword: "newSecurePassword123",
  token: "reset_token"
});`,
            requiredEnvVars: ["EMAIL_SERVICE_CONFIG"]
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(passwordResetConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_password_reset_config:", error);
          throw new Error(`Failed to get password reset config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_session_management_config",
      {
        title: "Get Session Management Configuration",
        description: "Get configuration for session management and security",
        inputSchema: {}
      },
      async () => {
        try {
          const sessionConfig = {
            name: "Session Management",
            description: "Configure session handling, security, and persistence",
            category: "security",
            config: {
              updateAge: 24 * 60 * 60, // 24 hours
              expiresIn: 30 * 24 * 60 * 60, // 30 days
              freshAge: 24 * 60 * 60, // 24 hours
              cookieCache: {
                enabled: true,
                maxAge: 5 * 60 // 5 minutes
              }
            },
            setupSteps: [
              "1. Configure session expiration times",
              "2. Set up secure cookie options",
              "3. Configure session update intervals",
              "4. Enable cookie caching for performance",
              "5. Test session persistence and security"
            ],
            codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  session: {
    updateAge: 24 * 60 * 60, // Update session every 24 hours
    expiresIn: 30 * 24 * 60 * 60, // Session expires in 30 days
    freshAge: 24 * 60 * 60, // Session considered fresh for 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache session in cookie for 5 minutes
    }
  },
  advanced: {
    useSecureCookies: true,
    cookiePrefix: "myapp"
  }
});`,
            clientUsage: `// Get current session
const { data: session, isPending, error } = authClient.useSession();

// Get session (non-reactive)
const { data: session } = await authClient.getSession();

// Sign out (end session)
await authClient.signOut();

// List all user sessions (with multi-session plugin)
const sessions = await authClient.listSessions();`,
            serverUsage: `// Server-side session access
const session = await auth.api.getSession({
  headers: request.headers
});`,
            securityFeatures: [
              "Automatic session rotation",
              "Secure HTTP-only cookies",
              "CSRF protection",
              "Session freshness tracking",
              "Multi-device session management"
            ]
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(sessionConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_session_management_config:", error);
          throw new Error(`Failed to get session management config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_database_schema_info",
      {
        title: "Get Database Schema Information",
        description: "Get information about Better Auth database schema and tables",
        inputSchema: {}
      },
      async () => {
        try {
          const schemaInfo = {
            name: "Database Schema",
            description: "Core database tables and schema for Better Auth",
            coreSchema: {
              user: {
                description: "User account information",
                fields: {
                  id: { type: "string", description: "Unique identifier for each user", primaryKey: true },
                  name: { type: "string", description: "User's chosen display name" },
                  email: { type: "string", description: "User's email address for communication and login" },
                  emailVerified: { type: "boolean", description: "Whether the user's email is verified" },
                  image: { type: "string", description: "User's image url", optional: true },
                  createdAt: { type: "Date", description: "Timestamp of when the user account was created" },
                  updatedAt: { type: "Date", description: "Timestamp of the last update to the user's information" }
                }
              },
              session: {
                description: "User session data",
                fields: {
                  id: { type: "string", description: "Unique identifier for each session", primaryKey: true },
                  userId: { type: "string", description: "The ID of the user", foreignKey: "user.id" },
                  token: { type: "string", description: "The unique session token", unique: true },
                  expiresAt: { type: "Date", description: "The time when the session expires" },
                  ipAddress: { type: "string", description: "The IP address of the device", optional: true },
                  userAgent: { type: "string", description: "The user agent information of the device", optional: true },
                  createdAt: { type: "Date", description: "Timestamp of when the session was created" },
                  updatedAt: { type: "Date", description: "Timestamp of when the session was updated" }
                }
              },
              account: {
                description: "OAuth account connections and credential storage",
                fields: {
                  id: { type: "string", description: "Unique identifier for each account", primaryKey: true },
                  userId: { type: "string", description: "The ID of the user", foreignKey: "user.id" },
                  accountId: { type: "string", description: "The ID of the account as provided by the SSO or equal to userId for credential accounts" },
                  providerId: { type: "string", description: "The ID of the provider" },
                  accessToken: { type: "string", description: "The access token of the account", optional: true },
                  refreshToken: { type: "string", description: "The refresh token of the account", optional: true },
                  accessTokenExpiresAt: { type: "Date", description: "The time when the access token expires", optional: true },
                  refreshTokenExpiresAt: { type: "Date", description: "The time when the refresh token expires", optional: true },
                  scope: { type: "string", description: "The scope of the account", optional: true },
                  idToken: { type: "string", description: "The ID token returned from the provider", optional: true },
                  password: { type: "string", description: "The password of the account (for credential accounts)", optional: true },
                  createdAt: { type: "Date", description: "Timestamp of when the account was created" },
                  updatedAt: { type: "Date", description: "Timestamp of when the account was updated" }
                }
              },
              verification: {
                description: "Email verification and password reset tokens",
                fields: {
                  id: { type: "string", description: "Unique identifier for each verification", primaryKey: true },
                  identifier: { type: "string", description: "The identifier for the verification request" },
                  value: { type: "string", description: "The value to be verified" },
                  expiresAt: { type: "Date", description: "The time when the verification request expires" },
                  createdAt: { type: "Date", description: "Timestamp of when the verification request was created" },
                  updatedAt: { type: "Date", description: "Timestamp of when the verification request was updated" }
                }
              }
            },
            setupSteps: [
              "1. Run npx @better-auth/cli generate to create schema files",
              "2. Review generated schema and customize if needed",
              "3. Run npx @better-auth/cli migrate to apply migrations",
              "4. Configure database connection in your auth config",
              "5. Test database connectivity and schema"
            ],
            customization: {
              additionalFields: `// Add custom fields to core tables
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user" },
      lang: { type: "string", required: false, defaultValue: "en" },
      profile: { type: "string", required: false }
    }
  },
  session: {
    additionalFields: {
      deviceInfo: { type: "string", required: false }
    }
  }
});`,
              customTableNames: `// Customize table and field names
export const auth = betterAuth({
  user: {
    modelName: "users",
    fields: {
      name: "full_name",
      email: "email_address"
    }
  },
  session: {
    modelName: "user_sessions",
    fields: {
      userId: "user_id"
    }
  }
});`
            },
            cliCommands: {
              generate: "npx @better-auth/cli generate",
              migrate: "npx @better-auth/cli migrate",
              help: "npx @better-auth/cli --help"
            }
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(schemaInfo, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_database_schema_info:", error);
          throw new Error(`Failed to get database schema info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_hooks_config",
      {
        title: "Get Hooks Configuration",
        description: "Get configuration for Better Auth hooks and middleware",
        inputSchema: {}
      },
      async () => {
        try {
          const hooksConfig = {
            name: "Hooks Configuration",
            description: "Customize Better Auth behavior with before/after hooks and middleware",
            category: "customization",
            types: {
              before: "Run before endpoint execution - can modify request or block execution",
              after: "Run after endpoint execution - can modify response or perform side effects",
              middleware: "Run on API requests only - path-based matching",
              databaseHooks: "Run before/after database operations"
            },
            setupSteps: [
              "1. Import createAuthMiddleware from better-auth/api",
              "2. Create hook functions with proper context handling",
              "3. Add hooks to auth configuration",
              "4. Test hook execution and error handling",
              "5. Monitor performance impact"
            ],
            codeExample: `import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";

export const auth = betterAuth({
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Domain restriction example
      if (ctx.path === "/sign-up/email") {
        if (!ctx.body?.email.endsWith("@company.com")) {
          throw new APIError("BAD_REQUEST", {
            message: "Only company emails allowed"
          });
        }
      }
      
      // Modify request context
      return {
        context: {
          ...ctx,
          body: {
            ...ctx.body,
            customField: "added-by-hook"
          }
        }
      };
    }),
    
    after: createAuthMiddleware(async (ctx) => {
      // Log new registrations
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          console.log("New user registered:", newSession.user.email);
          
          // Send welcome email
          await sendWelcomeEmail(newSession.user.email);
        }
      }
    })
  },
  
  // Database hooks
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.email.endsWith("@admin.com") ? "admin" : "user"
            }
          };
        },
        after: async (user) => {
          await createUserProfile(user.id);
        }
      }
    }
  }
});`,
            contextProperties: [
              "ctx.path - Current endpoint path",
              "ctx.body - Parsed request body",
              "ctx.headers - Request headers object",
              "ctx.query - Query parameters",
              "ctx.request - Original request object",
              "ctx.context - Auth-specific context data"
            ],
            utilities: [
              "ctx.json(data) - Send JSON response",
              "ctx.redirect(url) - Redirect user",
              "ctx.setCookies(name, value) - Set cookie",
              "ctx.getCookies(name) - Get cookie",
              "APIError(status, message) - Throw API error"
            ],
            examples: {
              domainRestriction: "Restrict signups to specific email domains",
              auditLogging: "Log all authentication events",
              customValidation: "Add custom validation rules",
              dataEnrichment: "Enrich user data during creation",
              integrationTriggers: "Trigger external services on events"
            }
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(hooksConfig, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_hooks_config:", error);
          throw new Error(`Failed to get hooks config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Quick Setup and Migration Tools
    server.registerTool(
      "get_migration_guide",
      {
        title: "Get Migration Guide",
        description: "Get migration guide from other auth solutions to Better Auth",
        inputSchema: {
          from_solution: z.string()
        }
      },
      async ({ from_solution }) => {
        try {
          const migrations = {
            "nextauth": {
              name: "NextAuth.js to Better Auth",
              description: "Migrate from NextAuth.js (Auth.js) to Better Auth",
              steps: [
                "1. Map existing database columns to Better Auth schema",
                "2. Update API route handler",
                "3. Replace client usage",
                "4. Update middleware for route protection",
                "5. Test authentication flows"
              ],
              schemaMapping: {
                user: "emailVerified: datetime → boolean",
                session: "expires → expiresAt, sessionToken → token",
                account: "provider → providerId, providerAccountId → accountId"
              },
              codeChanges: {
                apiRoute: `// Before (NextAuth)
import NextAuth from "next-auth"

// After (Better Auth)  
import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/lib/auth"
export const { GET, POST } = toNextJsHandler(auth)`,
                client: `// Before (NextAuth)
import { useSession } from "next-auth/react"

// After (Better Auth)
import { authClient } from "@/lib/auth-client"
const { data: session } = authClient.useSession()`
              }
            },
            "clerk": {
              name: "Clerk to Better Auth",
              description: "Migrate from Clerk to Better Auth",
              steps: [
                "1. Export users from Clerk dashboard",
                "2. Set up Better Auth configuration",
                "3. Run migration script to import users",
                "4. Update client-side code",
                "5. Update middleware and components"
              ],
              migrationScript: `// Custom migration script needed for Clerk export
// See full guide at /docs/guides/clerk-migration-guide`,
              codeChanges: {
                signIn: `// Before (Clerk)
import { SignIn } from "@clerk/nextjs"

// After (Better Auth)
await authClient.signIn.email({ email, password })`
              }
            },
            "supabase": {
              name: "Supabase Auth to Better Auth",
              description: "Migrate from Supabase Auth to Better Auth",
              steps: [
                "1. Connect to your Supabase database",
                "2. Set up Better Auth with same database",
                "3. Run migration script for user data",
                "4. Update client authentication calls",
                "5. Replace middleware and route guards"
              ],
              codeChanges: {
                signIn: `// Before (Supabase)
await supabase.auth.signInWithPassword({ email, password })

// After (Better Auth)
await authClient.signIn.email({ email, password })`
              }
            }
          };

          const migration = migrations[from_solution as keyof typeof migrations];
          if (!migration) {
            throw new Error(`Migration guide for '${from_solution}' not found`);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                from: from_solution,
                to: "Better Auth",
                ...migration,
                docUrl: `/docs/guides/${from_solution}-migration-guide`,
                considerations: [
                  "All active sessions will be invalidated",
                  "Test thoroughly in development first",
                  "Plan for user re-authentication",
                  "Consider gradual migration approach"
                ]
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_migration_guide:", error);
          throw new Error(`Failed to get migration guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    server.registerTool(
      "get_quick_start_guide",
      {
        title: "Get Quick Start Guide",
        description: "Get a quick start guide for Better Auth with specific requirements",
        inputSchema: {
          framework: z.string().optional(),
          database: z.string().optional(),
          auth_methods: z.array(z.string()).optional()
        }
      },
      async ({ framework = "nextjs", database = "postgresql", auth_methods = ["email-password", "google"] }) => {
        try {
          const quickStart = {
            title: `Better Auth Quick Start - ${framework} + ${database}`,
            description: `Get up and running with Better Auth using ${framework} and ${database}`,
            requirements: [
              "Node.js 16+ installed",
              `${framework} project set up`,
              `${database} database available`,
              "Email service for verification (optional)"
            ],
            installation: [
              "npm install better-auth",
              ...DATABASE_ADAPTERS[database as keyof typeof DATABASE_ADAPTERS]?.requiredPackages.map(pkg => `npm install ${pkg}`) || []
            ],
            environmentVariables: `# .env
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=your-database-connection-string
${auth_methods.includes('google') ? `
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret` : ''}
${auth_methods.includes('github') ? `
GITHUB_CLIENT_ID=your-github-client-id  
GITHUB_CLIENT_SECRET=your-github-client-secret` : ''}`,
            serverConfig: `// lib/auth.ts
import { betterAuth } from "better-auth";
${DATABASE_ADAPTERS[database as keyof typeof DATABASE_ADAPTERS]?.codeExample.split('\n')[0] || ''}

export const auth = betterAuth({
  database: ${DATABASE_ADAPTERS[database as keyof typeof DATABASE_ADAPTERS]?.codeExample.split('database: ')[1].split(',')[0] || 'undefined'},
  
  ${auth_methods.includes('email-password') ? `emailAndPassword: {
    enabled: true
  },` : ''}
  
  ${auth_methods.filter(m => m !== 'email-password').length > 0 ? `socialProviders: {
    ${auth_methods.filter(m => m !== 'email-password').map(provider => `${provider}: {
      clientId: process.env.${provider.toUpperCase()}_CLIENT_ID!,
      clientSecret: process.env.${provider.toUpperCase()}_CLIENT_SECRET!
    }`).join(',\n    ')}
  }` : ''}
});`,
            frameworkSetup: FRAMEWORK_INTEGRATIONS[framework as keyof typeof FRAMEWORK_INTEGRATIONS]?.codeExample || "Framework setup not available",
            clientConfig: `// lib/auth-client.ts
import { createAuthClient } from "better-auth/${framework === 'nextjs' ? 'react' : framework}";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000" // Your app URL
});`,
            nextSteps: [
              "1. Run database migrations: npx @better-auth/cli migrate",
              "2. Start your development server",
              "3. Test authentication flows",
              "4. Add route protection middleware",
              "5. Customize styling and UX",
              "6. Set up production environment",
              "7. Configure email service",
              "8. Add additional security features"
            ],
            testingAuth: `// Test authentication in your app
const handleSignIn = async () => {
  const { data, error } = await authClient.signIn.email({
    email: "test@example.com", 
    password: "password123"
  });
  
  if (error) {
    console.error("Sign in failed:", error);
  } else {
    console.log("Signed in successfully:", data);
  }
};`,
            troubleshooting: [
              "Check environment variables are set correctly",
              "Verify database connection and migrations",
              "Ensure OAuth provider credentials are valid",
              "Check CORS settings for cross-origin requests",
              "Verify callback URLs match provider settings"
            ]
          };

          return {
            content: [{
              type: "text",
              text: JSON.stringify(quickStart, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_quick_start_guide:", error);
          throw new Error(`Failed to get quick start guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

  } catch (error) {
    console.error("Failed to register tools:", error);
  }
}

async function main() {
  try {
    const server = new McpServer({
      name: SERVER_NAME,
      version: SERVER_VERSION
    });

    await initResources(server);
    await initTools(server);

    console.error("🚀 Better Auth MCP Server ready:", SERVER_NAME, SERVER_VERSION);
    console.error("📚 Comprehensive documentation and configuration tools loaded");
    console.error("🔧 Available tools:", Object.keys({
      get_documentation_categories: true,
      get_documentation_urls: true,
      get_all_auth_providers: true,
      get_auth_provider_config: true,
      get_all_database_adapters: true,
      get_database_adapter_config: true,
      get_all_plugins: true,
      get_plugin_config: true,
      generate_auth_config: true,
      validate_auth_setup: true,
      get_framework_integration: true,
      get_mcp_plugin_config: true,
      get_mcp_session_handler: true,
      get_oauth_discovery_metadata: true,
      get_mcp_session_api: true,
      get_multi_session_plugin_config: true,
      get_email_verification_config: true,
      get_password_reset_config: true,
      get_session_management_config: true,
      get_database_schema_info: true,
      get_hooks_config: true,
      get_migration_guide: true,
      get_quick_start_guide: true
    }).length);

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("💥 Fatal MCP error:", error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("💥 Fatal MCP error:", err);
  process.exit(1);
});