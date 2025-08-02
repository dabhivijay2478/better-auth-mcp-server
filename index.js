import fs from "fs/promises";
import fetch from "node-fetch";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const SERVER_NAME = "better-auth-comprehensive";
const SERVER_VERSION = "4.0.0";
const LOCAL_FILE_PATH = "better-auth.txt";

// Better Auth Documentation Categories
const DOCUMENTATION_CATEGORIES = {
  getting_started: {
    name: "Getting Started",
    description: "Basic setup and introduction to Better Auth",
    urls: [
      "/docs/basic-usage",
      "/docs/comparison", 
      "/docs/installation",
      "/docs/introduction"
    ]
  },
  adapters: {
    name: "Database Adapters",
    description: "Database connection adapters for Better Auth",
    urls: [
      "/docs/adapters/community-adapters",
      "/docs/adapters/drizzle",
      "/docs/adapters/mongo",
      "/docs/adapters/mssql",
      "/docs/adapters/mysql",
      "/docs/adapters/other-relational-databases",
      "/docs/adapters/postgresql",
      "/docs/adapters/prisma",
      "/docs/adapters/sqlite"
    ]
  },
  authentication_providers: {
    name: "Authentication Providers",
    description: "All available authentication providers",
    urls: [
      "/docs/authentication/apple",
      "/docs/authentication/discord",
      "/docs/authentication/dropbox",
      "/docs/authentication/email-password",
      "/docs/authentication/facebook",
      "/docs/authentication/github",
      "/docs/authentication/gitlab",
      "/docs/authentication/google",
      "/docs/authentication/huggingface",
      "/docs/authentication/kick",
      "/docs/authentication/linear",
      "/docs/authentication/linkedin",
      "/docs/authentication/microsoft",
      "/docs/authentication/notion",
      "/docs/authentication/other-social-providers",
      "/docs/authentication/reddit",
      "/docs/authentication/roblox",
      "/docs/authentication/slack",
      "/docs/authentication/spotify",
      "/docs/authentication/tiktok",
      "/docs/authentication/twitch",
      "/docs/authentication/twitter",
      "/docs/authentication/vk",
      "/docs/authentication/zoom"
    ]
  },
  concepts: {
    name: "Core Concepts",
    description: "Fundamental Better Auth concepts and APIs",
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
  examples: {
    name: "Framework Examples",
    description: "Integration examples for different frameworks",
    urls: [
      "/docs/examples/astro",
      "/docs/examples/next-js",
      "/docs/examples/nuxt",
      "/docs/examples/remix",
      "/docs/examples/svelte-kit"
    ]
  },
  guides: {
    name: "Guides and Tutorials",
    description: "Step-by-step guides and migration tutorials",
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
  integrations: {
    name: "Framework Integrations",
    description: "Integration guides for different frameworks",
    urls: [
      "/docs/integrations/astro",
      "/docs/integrations/elysia",
      "/docs/integrations/expo",
      "/docs/integrations/express",
      "/docs/integrations/fastify",
      "/docs/integrations/hono",
      "/docs/integrations/nestjs",
      "/docs/integrations/next",
      "/docs/integrations/nitro",
      "/docs/integrations/nuxt",
      "/docs/integrations/remix",
      "/docs/integrations/solid-start",
      "/docs/integrations/svelte-kit",
      "/docs/integrations/tanstack"
    ]
  },
  plugins: {
    name: "Authentication Plugins",
    description: "All available Better Auth plugins",
    urls: [
      "/docs/plugins/2fa",
      "/docs/plugins/admin",
      "/docs/plugins/anonymous",
      "/docs/plugins/api-key",
      "/docs/plugins/autumn",
      "/docs/plugins/bearer",
      "/docs/plugins/captcha",
      "/docs/plugins/community-plugins",
      "/docs/plugins/dodopayments",
      "/docs/plugins/dub",
      "/docs/plugins/email-otp",
      "/docs/plugins/generic-oauth",
      "/docs/plugins/have-i-been-pwned",
      "/docs/plugins/jwt",
      "/docs/plugins/magic-link",
      "/docs/plugins/mcp",
      "/docs/plugins/multi-session",
      "/docs/plugins/oauth-proxy",
      "/docs/plugins/oidc-provider",
      "/docs/plugins/one-tap",
      "/docs/plugins/one-time-token",
      "/docs/plugins/open-api",
      "/docs/plugins/organization",
      "/docs/plugins/passkey",
      "/docs/plugins/phone-number",
      "/docs/plugins/polar",
      "/docs/plugins/siwe",
      "/docs/plugins/sso",
      "/docs/plugins/stripe",
      "/docs/plugins/username"
    ]
  }
};

// Authentication Providers with comprehensive configurations
const AUTH_PROVIDERS = {
  email_password: {
    name: "Email & Password",
    description: "Traditional email and password authentication with verification",
    category: "basic",
    config: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: true,
      passwordMinLength: 8,
      passwordMaxLength: 128,
      sendResetPassword: true,
      resetPasswordTokenExpiresIn: 3600
    },
    setupSteps: [
      "1. Enable email and password in your auth configuration",
      "2. Configure email sending for verification emails",
      "3. Set up password reset functionality",
      "4. Configure password requirements",
      "5. Test sign up and sign in flows"
    ],
    requiredEnvVars: [
      "BETTER_AUTH_SECRET",
      "BETTER_AUTH_URL"
    ]
  },
  google: {
    name: "Google OAuth",
    description: "Google OAuth 2.0 authentication with refresh tokens",
    category: "social",
    config: {
      clientId: "YOUR_GOOGLE_CLIENT_ID",
      clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/google",
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
    requiredEnvVars: [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET"
    ]
  },
  github: {
    name: "GitHub OAuth",
    description: "GitHub OAuth authentication with email scope",
    category: "social",
    config: {
      clientId: "YOUR_GITHUB_CLIENT_ID",
      clientSecret: "YOUR_GITHUB_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/github"
    },
    setupSteps: [
      "1. Create a new OAuth App in GitHub",
      "2. Set the Authorization callback URL",
      "3. Note the Client ID and Client Secret",
      "4. Add configuration to your auth setup",
      "5. Test the authentication flow"
    ],
    requiredEnvVars: [
      "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET"
    ]
  },
  facebook: {
    name: "Facebook OAuth",
    description: "Facebook OAuth authentication with business support",
    category: "social",
    config: {
      clientId: "YOUR_FACEBOOK_CLIENT_ID",
      clientSecret: "YOUR_FACEBOOK_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/facebook",
      scopes: ["email", "public_profile"],
      fields: ["id", "name", "email", "picture"]
    },
    setupSteps: [
      "1. Create a Facebook App in Developer Portal",
      "2. Add Facebook Login product",
      "3. Configure OAuth redirect URIs",
      "4. Get App ID and App Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "FACEBOOK_CLIENT_ID",
      "FACEBOOK_CLIENT_SECRET"
    ]
  },
  apple: {
    name: "Apple Sign-In",
    description: "Apple Sign-In authentication with JWT client secret",
    category: "social",
    config: {
      clientId: "YOUR_APPLE_CLIENT_ID",
      clientSecret: "YOUR_APPLE_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/apple",
      appBundleIdentifier: "com.yourapp.identifier"
    },
    setupSteps: [
      "1. Create an App ID in Apple Developer Portal",
      "2. Create a Service ID for Sign In with Apple",
      "3. Create a Client Secret Key",
      "4. Generate JWT client secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "APPLE_CLIENT_ID",
      "APPLE_CLIENT_SECRET",
      "APPLE_APP_BUNDLE_IDENTIFIER"
    ]
  },
  discord: {
    name: "Discord OAuth",
    description: "Discord OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_DISCORD_CLIENT_ID",
      clientSecret: "YOUR_DISCORD_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/discord"
    },
    setupSteps: [
      "1. Create an application in Discord Developer Portal",
      "2. Add OAuth2 redirect URI",
      "3. Get Client ID and Client Secret",
      "4. Configure in your auth setup",
      "5. Test the authentication flow"
    ],
    requiredEnvVars: [
      "DISCORD_CLIENT_ID",
      "DISCORD_CLIENT_SECRET"
    ]
  },
  dropbox: {
    name: "Dropbox OAuth",
    description: "Dropbox OAuth authentication with PKCE support",
    category: "social",
    config: {
      clientId: "YOUR_DROPBOX_CLIENT_ID",
      clientSecret: "YOUR_DROPBOX_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/dropbox"
    },
    setupSteps: [
      "1. Create an app in Dropbox Developer Portal",
      "2. Enable OAuth 2 and PKCE",
      "3. Set redirect URI",
      "4. Get App Key and App Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "DROPBOX_CLIENT_ID",
      "DROPBOX_CLIENT_SECRET"
    ]
  },
  microsoft: {
    name: "Microsoft OAuth",
    description: "Microsoft OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_MICROSOFT_CLIENT_ID",
      clientSecret: "YOUR_MICROSOFT_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/microsoft"
    },
    setupSteps: [
      "1. Register an application in Azure Portal",
      "2. Configure authentication",
      "3. Add redirect URI",
      "4. Get Application (client) ID and secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "MICROSOFT_CLIENT_ID",
      "MICROSOFT_CLIENT_SECRET"
    ]
  },
  gitlab: {
    name: "GitLab OAuth",
    description: "GitLab OAuth authentication with custom issuer",
    category: "social",
    config: {
      clientId: "YOUR_GITLAB_CLIENT_ID",
      clientSecret: "YOUR_GITLAB_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/gitlab",
      issuer: "https://gitlab.com"
    },
    setupSteps: [
      "1. Create an OAuth application in GitLab",
      "2. Set redirect URI",
      "3. Get Application ID and Secret",
      "4. Configure issuer URL",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "GITLAB_CLIENT_ID",
      "GITLAB_CLIENT_SECRET",
      "GITLAB_ISSUER"
    ]
  },
  huggingface: {
    name: "Hugging Face OAuth",
    description: "Hugging Face OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_HUGGINGFACE_CLIENT_ID",
      clientSecret: "YOUR_HUGGINGFACE_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/huggingface"
    },
    setupSteps: [
      "1. Create an OAuth app on Hugging Face",
      "2. Add email scope",
      "3. Set redirect URI",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "HUGGINGFACE_CLIENT_ID",
      "HUGGINGFACE_CLIENT_SECRET"
    ]
  },
  twitter: {
    name: "Twitter OAuth",
    description: "Twitter OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_TWITTER_CLIENT_ID",
      clientSecret: "YOUR_TWITTER_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/twitter"
    },
    setupSteps: [
      "1. Create an app in Twitter Developer Portal",
      "2. Configure OAuth 2.0 settings",
      "3. Set callback URL",
      "4. Get API Key and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "TWITTER_CLIENT_ID",
      "TWITTER_CLIENT_SECRET"
    ]
  },
  linkedin: {
    name: "LinkedIn OAuth",
    description: "LinkedIn OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_LINKEDIN_CLIENT_ID",
      clientSecret: "YOUR_LINKEDIN_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/linkedin"
    },
    setupSteps: [
      "1. Create an app in LinkedIn Developer Portal",
      "2. Configure OAuth 2.0 settings",
      "3. Add redirect URL",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "LINKEDIN_CLIENT_ID",
      "LINKEDIN_CLIENT_SECRET"
    ]
  },
  spotify: {
    name: "Spotify OAuth",
    description: "Spotify OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_SPOTIFY_CLIENT_ID",
      clientSecret: "YOUR_SPOTIFY_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/spotify"
    },
    setupSteps: [
      "1. Create an app in Spotify Developer Dashboard",
      "2. Add redirect URI",
      "3. Get Client ID and Secret",
      "4. Configure in your auth setup",
      "5. Test the authentication flow"
    ],
    requiredEnvVars: [
      "SPOTIFY_CLIENT_ID",
      "SPOTIFY_CLIENT_SECRET"
    ]
  },
  slack: {
    name: "Slack OAuth",
    description: "Slack OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_SLACK_CLIENT_ID",
      clientSecret: "YOUR_SLACK_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/slack"
    },
    setupSteps: [
      "1. Create an app in Slack API",
      "2. Configure OAuth & Permissions",
      "3. Add redirect URL",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "SLACK_CLIENT_ID",
      "SLACK_CLIENT_SECRET"
    ]
  },
  twitch: {
    name: "Twitch OAuth",
    description: "Twitch OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_TWITCH_CLIENT_ID",
      clientSecret: "YOUR_TWITCH_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/twitch"
    },
    setupSteps: [
      "1. Create an application in Twitch Developer Console",
      "2. Configure OAuth redirect URLs",
      "3. Get Client ID and Secret",
      "4. Configure in your auth setup",
      "5. Test the authentication flow"
    ],
    requiredEnvVars: [
      "TWITCH_CLIENT_ID",
      "TWITCH_CLIENT_SECRET"
    ]
  },
  tiktok: {
    name: "TikTok OAuth",
    description: "TikTok OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_TIKTOK_CLIENT_ID",
      clientSecret: "YOUR_TIKTOK_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/tiktok"
    },
    setupSteps: [
      "1. Create an app in TikTok for Developers",
      "2. Configure OAuth settings",
      "3. Add redirect URI",
      "4. Get Client Key and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "TIKTOK_CLIENT_ID",
      "TIKTOK_CLIENT_SECRET"
    ]
  },
  notion: {
    name: "Notion OAuth",
    description: "Notion OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_NOTION_CLIENT_ID",
      clientSecret: "YOUR_NOTION_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/notion"
    },
    setupSteps: [
      "1. Create an integration in Notion",
      "2. Configure OAuth settings",
      "3. Add redirect URI",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "NOTION_CLIENT_ID",
      "NOTION_CLIENT_SECRET"
    ]
  },
  linear: {
    name: "Linear OAuth",
    description: "Linear OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_LINEAR_CLIENT_ID",
      clientSecret: "YOUR_LINEAR_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/linear"
    },
    setupSteps: [
      "1. Create an OAuth app in Linear",
      "2. Configure redirect URI",
      "3. Get Client ID and Secret",
      "4. Configure in your auth setup",
      "5. Test the authentication flow"
    ],
    requiredEnvVars: [
      "LINEAR_CLIENT_ID",
      "LINEAR_CLIENT_SECRET"
    ]
  },
  reddit: {
    name: "Reddit OAuth",
    description: "Reddit OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_REDDIT_CLIENT_ID",
      clientSecret: "YOUR_REDDIT_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/reddit"
    },
    setupSteps: [
      "1. Create an app in Reddit Developer Portal",
      "2. Configure OAuth settings",
      "3. Add redirect URI",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "REDDIT_CLIENT_ID",
      "REDDIT_CLIENT_SECRET"
    ]
  },
  roblox: {
    name: "Roblox OAuth",
    description: "Roblox OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_ROBLOX_CLIENT_ID",
      clientSecret: "YOUR_ROBLOX_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/roblox"
    },
    setupSteps: [
      "1. Create an app in Roblox Developer Portal",
      "2. Configure OAuth settings",
      "3. Add redirect URI",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "ROBLOX_CLIENT_ID",
      "ROBLOX_CLIENT_SECRET"
    ]
  },
  vk: {
    name: "VK OAuth",
    description: "VK OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_VK_CLIENT_ID",
      clientSecret: "YOUR_VK_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/vk"
    },
    setupSteps: [
      "1. Create an app in VK Developer Portal",
      "2. Configure OAuth settings",
      "3. Add redirect URI",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "VK_CLIENT_ID",
      "VK_CLIENT_SECRET"
    ]
  },
  zoom: {
    name: "Zoom OAuth",
    description: "Zoom OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_ZOOM_CLIENT_ID",
      clientSecret: "YOUR_ZOOM_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/zoom"
    },
    setupSteps: [
      "1. Create an app in Zoom App Marketplace",
      "2. Configure OAuth settings",
      "3. Add redirect URI",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "ZOOM_CLIENT_ID",
      "ZOOM_CLIENT_SECRET"
    ]
  },
  kick: {
    name: "Kick OAuth",
    description: "Kick OAuth authentication",
    category: "social",
    config: {
      clientId: "YOUR_KICK_CLIENT_ID",
      clientSecret: "YOUR_KICK_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/kick"
    },
    setupSteps: [
      "1. Create an app in Kick Developer Portal",
      "2. Configure OAuth settings",
      "3. Add redirect URI",
      "4. Get Client ID and Secret",
      "5. Configure in your auth setup"
    ],
    requiredEnvVars: [
      "KICK_CLIENT_ID",
      "KICK_CLIENT_SECRET"
    ]
  }
};

// Database Adapters with comprehensive configurations
const DATABASE_ADAPTERS = {
  postgresql: {
    name: "PostgreSQL",
    description: "PostgreSQL database adapter with connection pooling",
    config: {
      url: "postgresql://username:password@localhost:5432/database",
      pool: {
        min: 2,
        max: 10
      }
    },
    setupSteps: [
      "1. Install PostgreSQL database",
      "2. Create a database for your application",
      "3. Install pg package: npm install pg",
      "4. Configure connection string",
      "5. Run database migrations"
    ],
    requiredPackages: ["pg"],
    migrationSupport: true
  },
  mysql: {
    name: "MySQL",
    description: "MySQL database adapter with connection pooling",
    config: {
      url: "mysql://username:password@localhost:3306/database",
      pool: {
        min: 2,
        max: 10
      }
    },
    setupSteps: [
      "1. Install MySQL database",
      "2. Create a database for your application",
      "3. Install mysql2 package: npm install mysql2",
      "4. Configure connection string",
      "5. Run database migrations"
    ],
    requiredPackages: ["mysql2"],
    migrationSupport: true
  },
  sqlite: {
    name: "SQLite",
    description: "SQLite database adapter for local development",
    config: {
      url: "file:./database.sqlite"
    },
    setupSteps: [
      "1. Install better-sqlite3: npm install better-sqlite3",
      "2. Configure database file path",
      "3. Run database migrations",
      "4. Ensure write permissions"
    ],
    requiredPackages: ["better-sqlite3"],
    migrationSupport: true
  },
  mongo: {
    name: "MongoDB",
    description: "MongoDB NoSQL database adapter",
    config: {
      url: "mongodb://localhost:27017/database"
    },
    setupSteps: [
      "1. Install MongoDB database",
      "2. Create a database for your application",
      "3. Install mongodb package: npm install mongodb",
      "4. Configure connection string",
      "5. No schema migration required"
    ],
    requiredPackages: ["mongodb"],
    migrationSupport: false
  },
  drizzle: {
    name: "Drizzle ORM",
    description: "Drizzle ORM adapter with type-safe queries",
    config: {
      schema: "./schema.ts",
      provider: "pg" // or "mysql", "sqlite"
    },
    setupSteps: [
      "1. Install Drizzle ORM: npm install drizzle-orm",
      "2. Create database schema file",
      "3. Install database driver (pg, mysql2, better-sqlite3)",
      "4. Configure schema and provider",
      "5. Run migrations with Drizzle Kit"
    ],
    requiredPackages: ["drizzle-orm", "drizzle-kit"],
    migrationSupport: true
  },
  prisma: {
    name: "Prisma ORM",
    description: "Prisma ORM adapter with auto-generated client",
    config: {
      schema: "./prisma/schema.prisma",
      provider: "sqlite" // or "mysql", "postgresql"
    },
    setupSteps: [
      "1. Install Prisma: npm install prisma @prisma/client",
      "2. Initialize Prisma: npx prisma init",
      "3. Configure schema.prisma file",
      "4. Generate Prisma client: npx prisma generate",
      "5. Run migrations: npx prisma migrate dev"
    ],
    requiredPackages: ["prisma", "@prisma/client"],
    migrationSupport: true
  },
  mssql: {
    name: "MS SQL Server",
    description: "Microsoft SQL Server database adapter",
    config: {
      url: "mssql://username:password@localhost:1433/database"
    },
    setupSteps: [
      "1. Install SQL Server database",
      "2. Create a database for your application",
      "3. Install tedious package: npm install tedious",
      "4. Configure connection string",
      "5. Run database migrations"
    ],
    requiredPackages: ["tedious"],
    migrationSupport: true
  }
};

// Comprehensive Plugins with detailed configurations
const PLUGINS = {
  magic_link: {
    name: "Magic Link",
    description: "Passwordless authentication via email links",
    category: "security",
    config: {
      enabled: true,
      emailTemplate: "default",
      tokenExpiresIn: 300,
      maxAttempts: 3
    },
    setupSteps: [
      "1. Install magic link plugin",
      "2. Configure email sending function",
      "3. Set up email templates",
      "4. Configure token expiration",
      "5. Test magic link flow"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  passkey: {
    name: "Passkey",
    description: "WebAuthn/FIDO2 passkey authentication",
    category: "security",
    config: {
      enabled: true,
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
    clientSetup: true
  },
  email_otp: {
    name: "Email OTP",
    description: "One-time password via email",
    category: "security",
    config: {
      enabled: true,
      digits: 6,
      expiry: 300,
      maxAttempts: 3
    },
    setupSteps: [
      "1. Install email OTP plugin",
      "2. Configure email sending function",
      "3. Set up OTP generation",
      "4. Configure expiration time",
      "5. Test OTP flow"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  username: {
    name: "Username",
    description: "Username-based authentication",
    category: "basic",
    config: {
      enabled: true,
      unique: true,
      minLength: 3,
      maxLength: 30
    },
    setupSteps: [
      "1. Install username plugin",
      "2. Configure username requirements",
      "3. Set up validation rules",
      "4. Configure client-side forms",
      "5. Test username registration"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  two_factor: {
    name: "Two-Factor Authentication",
    description: "TOTP-based 2FA with QR codes",
    category: "security",
    config: {
      enabled: true,
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
    clientSetup: true
  },
  captcha: {
    name: "CAPTCHA",
    description: "CAPTCHA protection for forms",
    category: "security",
    config: {
      enabled: true,
      provider: "recaptcha",
      siteKey: "YOUR_RECAPTCHA_SITE_KEY",
      secretKey: "YOUR_RECAPTCHA_SECRET_KEY"
    },
    setupSteps: [
      "1. Install captcha plugin",
      "2. Set up reCAPTCHA account",
      "3. Configure site and secret keys",
      "4. Add CAPTCHA to forms",
      "5. Test CAPTCHA verification"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  jwt: {
    name: "JWT",
    description: "JSON Web Token support",
    category: "security",
    config: {
      enabled: true,
      secret: "your-jwt-secret",
      algorithm: "HS256",
      expiresIn: "1h"
    },
    setupSteps: [
      "1. Install JWT plugin",
      "2. Configure JWT secret",
      "3. Set up token expiration",
      "4. Configure client-side token handling",
      "5. Test JWT generation and verification"
    ],
    requiredPackages: ["jsonwebtoken"],
    clientSetup: true
  },
  organization: {
    name: "Organization",
    description: "Multi-tenant organization support",
    category: "business",
    config: {
      enabled: true,
      allowMultiple: true,
      defaultRole: "member",
      roles: ["owner", "admin", "member"]
    },
    setupSteps: [
      "1. Install organization plugin",
      "2. Configure organization settings",
      "3. Set up role-based access",
      "4. Configure client-side organization management",
      "5. Test organization creation and management"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  sso: {
    name: "Single Sign-On",
    description: "SSO integration with SAML and OIDC",
    category: "business",
    config: {
      enabled: true,
      providers: ["saml", "oidc"],
      saml: {
        cert: "YOUR_SAML_CERT",
        entryPoint: "YOUR_SAML_ENTRY_POINT"
      }
    },
    setupSteps: [
      "1. Install SSO plugin",
      "2. Configure SAML/OIDC providers",
      "3. Set up identity provider settings",
      "4. Configure client-side SSO flow",
      "5. Test SSO authentication"
    ],
    requiredPackages: ["passport-saml"],
    clientSetup: true
  },
  stripe: {
    name: "Stripe",
    description: "Stripe payment integration",
    category: "business",
    config: {
      enabled: true,
      secretKey: "sk_test_...",
      publishableKey: "pk_test_...",
      webhookSecret: "whsec_..."
    },
    setupSteps: [
      "1. Install Stripe plugin",
      "2. Set up Stripe account",
      "3. Configure API keys",
      "4. Set up webhook endpoints",
      "5. Test payment integration"
    ],
    requiredPackages: ["stripe"],
    clientSetup: true
  },
  admin: {
    name: "Admin Panel",
    description: "Built-in admin panel for user management",
    category: "business",
    config: {
      enabled: true,
      path: "/admin",
      roles: ["admin", "super_admin"]
    },
    setupSteps: [
      "1. Install admin plugin",
      "2. Configure admin roles",
      "3. Set up admin routes",
      "4. Configure admin interface",
      "5. Test admin functionality"
    ],
    requiredPackages: [],
    clientSetup: false
  },
  anonymous: {
    name: "Anonymous Authentication",
    description: "Allow anonymous user sessions",
    category: "basic",
    config: {
      enabled: true,
      sessionDuration: 3600
    },
    setupSteps: [
      "1. Install anonymous plugin",
      "2. Configure session settings",
      "3. Set up anonymous user handling",
      "4. Configure client-side integration",
      "5. Test anonymous authentication"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  api_key: {
    name: "API Key Authentication",
    description: "API key-based authentication",
    category: "security",
    config: {
      enabled: true,
      headerName: "X-API-Key",
      keyPrefix: "ba_"
    },
    setupSteps: [
      "1. Install API key plugin",
      "2. Configure API key settings",
      "3. Set up key generation",
      "4. Configure client-side key handling",
      "5. Test API key authentication"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  bearer: {
    name: "Bearer Token",
    description: "Bearer token authentication",
    category: "security",
    config: {
      enabled: true,
      headerName: "Authorization",
      tokenPrefix: "Bearer "
    },
    setupSteps: [
      "1. Install bearer token plugin",
      "2. Configure token settings",
      "3. Set up token generation",
      "4. Configure client-side token handling",
      "5. Test bearer token authentication"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  phone_number: {
    name: "Phone Number",
    description: "Phone number-based authentication",
    category: "basic",
    config: {
      enabled: true,
      verificationMethod: "sms",
      smsProvider: "twilio"
    },
    setupSteps: [
      "1. Install phone number plugin",
      "2. Configure SMS provider",
      "3. Set up phone verification",
      "4. Configure client-side integration",
      "5. Test phone number authentication"
    ],
    requiredPackages: ["twilio"],
    clientSetup: true
  },
  multi_session: {
    name: "Multi-Session",
    description: "Multiple concurrent sessions per user",
    category: "business",
    config: {
      enabled: true,
      maxSessions: 5,
      allowConcurrent: true
    },
    setupSteps: [
      "1. Install multi-session plugin",
      "2. Configure session limits",
      "3. Set up session management",
      "4. Configure client-side session handling",
      "5. Test multi-session functionality"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  one_tap: {
    name: "One Tap",
    description: "Google One Tap authentication",
    category: "security",
    config: {
      enabled: true,
      clientId: "YOUR_GOOGLE_CLIENT_ID",
      autoSelect: true
    },
    setupSteps: [
      "1. Install one tap plugin",
      "2. Configure Google One Tap settings",
      "3. Set up client-side integration",
      "4. Configure auto-selection",
      "5. Test One Tap authentication"
    ],
    requiredPackages: [],
    clientSetup: true
  },
  siwe: {
    name: "Sign-In with Ethereum",
    description: "Ethereum wallet authentication",
    category: "web3",
    config: {
      enabled: true,
      chainId: 1,
      domain: "localhost"
    },
    setupSteps: [
      "1. Install SIWE plugin",
      "2. Configure Ethereum settings",
      "3. Set up wallet integration",
      "4. Configure client-side wallet handling",
      "5. Test Ethereum authentication"
    ],
    requiredPackages: ["siwe"],
    clientSetup: true
  }
};

async function initResources(server) {
  server.registerResource(
    "better_auth_docs",
    `file://${LOCAL_FILE_PATH}`,
    {
      title: "Better Auth Documentation",
      description: "Complete Better Auth documentation and configuration guide",
      mimeType: "text/plain"
    },
    async () => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        return { contents: [{ uri: `file://${LOCAL_FILE_PATH}`, text }] };
      } catch (error) {
        console.error(`Failed fetching ${LOCAL_FILE_PATH}:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );
}

async function initTools(server) {
  // Enhanced Better Auth Tools
  
  // Get comprehensive auth provider information
  server.registerTool(
    "get_auth_provider_config",
    {
      uri: "tool://better-auth/get_auth_provider_config",
      title: "Get Authentication Provider Configuration",
      description: "Get detailed configuration and setup instructions for a specific authentication provider",
      inputSchema: { provider: { type: "string" } },
      outputSchema: { 
        provider: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        category: { type: "string" },
        config: { type: "object" },
        setupSteps: { type: "array", items: { type: "string" } },
        requiredEnvVars: { type: "array", items: { type: "string" } },
        docUrl: { type: "string" }
      }
    },
    async ({ provider }) => {
      const providerConfig = AUTH_PROVIDERS[provider];
      if (!providerConfig) {
        throw new Error(`Provider '${provider}' not found`);
      }
      return {
        provider,
        name: providerConfig.name,
        description: providerConfig.description,
        category: providerConfig.category,
        config: providerConfig.config,
        setupSteps: providerConfig.setupSteps || [],
        requiredEnvVars: providerConfig.requiredEnvVars || [],
        docUrl: `/docs/authentication/${provider}`
      };
    }
  );

  // Get comprehensive database adapter information
  server.registerTool(
    "get_database_adapter_config",
    {
      uri: "tool://better-auth/get_database_adapter_config",
      title: "Get Database Adapter Configuration",
      description: "Get detailed configuration and setup instructions for a specific database adapter",
      inputSchema: { adapter: { type: "string" } },
      outputSchema: { 
        adapter: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        config: { type: "object" },
        setupSteps: { type: "array", items: { type: "string" } },
        requiredPackages: { type: "array", items: { type: "string" } },
        migrationSupport: { type: "boolean" },
        docUrl: { type: "string" }
      }
    },
    async ({ adapter }) => {
      const adapterConfig = DATABASE_ADAPTERS[adapter];
      if (!adapterConfig) {
        throw new Error(`Adapter '${adapter}' not found`);
      }
      return {
        adapter,
        name: adapterConfig.name,
        description: adapterConfig.description,
        config: adapterConfig.config,
        setupSteps: adapterConfig.setupSteps || [],
        requiredPackages: adapterConfig.requiredPackages || [],
        migrationSupport: adapterConfig.migrationSupport || false,
        docUrl: `/docs/adapters/${adapter}`
      };
    }
  );

  // Get comprehensive plugin information
  server.registerTool(
    "get_plugin_config",
    {
      uri: "tool://better-auth/get_plugin_config",
      title: "Get Plugin Configuration",
      description: "Get detailed configuration and setup instructions for a specific plugin",
      inputSchema: { plugin: { type: "string" } },
      outputSchema: { 
        plugin: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        category: { type: "string" },
        config: { type: "object" },
        setupSteps: { type: "array", items: { type: "string" } },
        requiredPackages: { type: "array", items: { type: "string" } },
        clientSetup: { type: "boolean" },
        docUrl: { type: "string" }
      }
    },
    async ({ plugin }) => {
      const pluginConfig = PLUGINS[plugin];
      if (!pluginConfig) {
        throw new Error(`Plugin '${plugin}' not found`);
      }
      return {
        plugin,
        name: pluginConfig.name,
        description: pluginConfig.description,
        category: pluginConfig.category,
        config: pluginConfig.config,
        setupSteps: pluginConfig.setupSteps || [],
        requiredPackages: pluginConfig.requiredPackages || [],
        clientSetup: pluginConfig.clientSetup || false,
        docUrl: `/docs/plugins/${plugin}`
      };
    }
  );

  // Generate complete auth configuration
  server.registerTool(
    "generate_auth_config",
    {
      uri: "tool://better-auth/generate_auth_config",
      title: "Generate Complete Better Auth Configuration",
      description: "Generate a complete Better Auth configuration with specified providers, adapters, and plugins",
      inputSchema: { 
        providers: { type: "array", items: { type: "string" } },
        adapter: { type: "string" },
        plugins: { type: "array", items: { type: "string" } },
        baseURL: { type: "string" }
      },
      outputSchema: { 
        config: { type: "string" },
        providers: { type: "array", items: { type: "string" } },
        adapter: { type: "string" },
        plugins: { type: "array", items: { type: "string" } },
        setupInstructions: { type: "array", items: { type: "string" } },
        requiredPackages: { type: "array", items: { type: "string" } },
        requiredEnvVars: { type: "array", items: { type: "string" } }
      }
    },
    async ({ providers, adapter, plugins, baseURL = "http://localhost:3000" }) => {
      // Validate providers
      const validProviders = providers.filter(p => AUTH_PROVIDERS[p]);
      if (validProviders.length !== providers.length) {
        const invalid = providers.filter(p => !AUTH_PROVIDERS[p]);
        throw new Error(`Invalid providers: ${invalid.join(', ')}`);
      }

      // Validate adapter
      if (!DATABASE_ADAPTERS[adapter]) {
        throw new Error(`Invalid adapter: ${adapter}`);
      }

      // Validate plugins
      const validPlugins = plugins.filter(p => PLUGINS[p]);
      if (validPlugins.length !== plugins.length) {
        const invalid = plugins.filter(p => !PLUGINS[p]);
        throw new Error(`Invalid plugins: ${invalid.join(', ')}`);
      }

      // Generate configuration
      let config = `import { betterAuth } from "better-auth";\n\n`;
      config += `export const auth = betterAuth({\n`;
      config += `  baseURL: "${baseURL}",\n\n`;
      
      // Add providers
      config += `  // Authentication Providers\n`;
      validProviders.forEach(provider => {
        config += `  ${provider}: {\n`;
        config += `    enabled: true,\n`;
        const providerConfig = AUTH_PROVIDERS[provider];
        Object.entries(providerConfig.config).forEach(([key, value]) => {
          if (typeof value === 'string') {
            config += `    ${key}: "${value}",\n`;
          } else {
            config += `    ${key}: ${value},\n`;
          }
        });
        config += `  },\n\n`;
      });

      // Add adapter
      config += `  // Database Adapter\n`;
      config += `  adapter: "${adapter}",\n\n`;

      // Add plugins
      if (validPlugins.length > 0) {
        config += `  // Plugins\n`;
        config += `  plugins: [\n`;
        validPlugins.forEach(plugin => {
          config += `    "${plugin}",\n`;
        });
        config += `  ],\n\n`;
      }

      config += `});\n`;

      // Collect required packages and env vars
      const requiredPackages = new Set();
      const requiredEnvVars = new Set();

      validProviders.forEach(provider => {
        const providerConfig = AUTH_PROVIDERS[provider];
        providerConfig.requiredEnvVars?.forEach(envVar => requiredEnvVars.add(envVar));
      });

      const adapterConfig = DATABASE_ADAPTERS[adapter];
      adapterConfig.requiredPackages?.forEach(pkg => requiredPackages.add(pkg));

      validPlugins.forEach(plugin => {
        const pluginConfig = PLUGINS[plugin];
        pluginConfig.requiredPackages?.forEach(pkg => requiredPackages.add(pkg));
      });

      // Generate setup instructions
      const setupInstructions = [
        "1. Install Better Auth: npm install better-auth",
        "2. Install required packages: npm install " + Array.from(requiredPackages).join(" "),
        "3. Set up your database and configure the adapter",
        "4. Configure your authentication providers with proper credentials",
        "5. Set up email configuration for verification emails",
        "6. Configure environment variables for secrets and API keys",
        "7. Test the authentication flow"
      ];

      return {
        config,
        providers: validProviders,
        adapter,
        plugins: validPlugins,
        setupInstructions,
        requiredPackages: Array.from(requiredPackages),
        requiredEnvVars: Array.from(requiredEnvVars)
      };
    }
  );

  // Validate auth setup
  server.registerTool(
    "validate_auth_setup",
    {
      uri: "tool://better-auth/validate_auth_setup",
      title: "Validate Better Auth Setup",
      description: "Validate a Better Auth configuration and provide recommendations",
      inputSchema: { 
        providers: { type: "array", items: { type: "string" } },
        adapter: { type: "string" },
        plugins: { type: "array", items: { type: "string" } }
      },
      outputSchema: { 
        valid: { type: "boolean" },
        errors: { type: "array", items: { type: "string" } },
        warnings: { type: "array", items: { type: "string" } },
        recommendations: { type: "array", items: { type: "string" } }
      }
    },
    async ({ providers, adapter, plugins }) => {
      const errors = [];
      const warnings = [];
      const recommendations = [];

      // Validate providers
      providers.forEach(provider => {
        if (!AUTH_PROVIDERS[provider]) {
          errors.push(`Invalid provider: ${provider}`);
        }
      });

      // Validate adapter
      if (!DATABASE_ADAPTERS[adapter]) {
        errors.push(`Invalid adapter: ${adapter}`);
      }

      // Validate plugins
      plugins.forEach(plugin => {
        if (!PLUGINS[plugin]) {
          errors.push(`Invalid plugin: ${plugin}`);
        }
      });

      // Check for common issues
      if (providers.includes('email_password') && !plugins.includes('email_otp')) {
        recommendations.push("Consider adding email_otp plugin for enhanced email security");
      }

      if (providers.length > 3 && !plugins.includes('captcha')) {
        recommendations.push("Consider adding captcha plugin for additional security with multiple providers");
      }

      if (providers.includes('google') && providers.includes('microsoft')) {
        warnings.push("Google and Microsoft providers may have overlapping user bases");
      }

      if (plugins.includes('passkey') && !plugins.includes('two_factor')) {
        recommendations.push("Consider adding two_factor plugin alongside passkey for fallback authentication");
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        recommendations
      };
    }
  );

  // Get provider setup guide
  server.registerTool(
    "get_provider_documentation",
    {
      uri: "tool://better-auth/get_provider_documentation",
      title: "Get Provider Documentation",
      description: "Get documentation URL and setup instructions for a specific provider",
      inputSchema: { provider: { type: "string" } },
      outputSchema: { 
        provider: { type: "string" },
        name: { type: "string" },
        docUrl: { type: "string" },
        setupSteps: { type: "array", items: { type: "string" } },
        requiredCredentials: { type: "array", items: { type: "string" } }
      }
    },
    async ({ provider }) => {
      const providerConfig = AUTH_PROVIDERS[provider];
      if (!providerConfig) {
        throw new Error(`Provider '${provider}' not found`);
      }

      const setupSteps = providerConfig.setupSteps || [
        `1. Create an application in the ${providerConfig.name} developer console`,
        `2. Get your Client ID and Client Secret`,
        `3. Configure the redirect URI: http://localhost:3000/api/auth/callback/${provider}`,
        `4. Add the configuration to your Better Auth setup`,
        `5. Test the authentication flow`
      ];

      const requiredCredentials = providerConfig.requiredEnvVars || [
        "Client ID",
        "Client Secret",
        "Redirect URI"
      ];

      return {
        provider,
        name: providerConfig.name,
        docUrl: `/docs/authentication/${provider}`,
        setupSteps,
        requiredCredentials
      };
    }
  );

  // Documentation Navigation Tools
  server.registerTool(
    "get_documentation_categories",
    {
      uri: "tool://better-auth/get_documentation_categories",
      title: "Get Documentation Categories",
      description: "Returns all available Better Auth documentation categories",
      inputSchema: undefined,
      outputSchema: { 
        categories: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              key: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              urlCount: { type: "number" }
            }
          } 
        } 
      }
    },
    async () => {
      const categories = Object.entries(DOCUMENTATION_CATEGORIES).map(([key, category]) => ({
        key,
        name: category.name,
        description: category.description,
        urlCount: category.urls.length
      }));
      return { categories };
    }
  );

  server.registerTool(
    "get_documentation_urls",
    {
      uri: "tool://better-auth/get_documentation_urls",
      title: "Get Documentation URLs by Category",
      description: "Get all documentation URLs for a specific category",
      inputSchema: { category: { type: "string" } },
      outputSchema: { 
        category: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        urls: { type: "array", items: { type: "string" } }
      }
    },
    async ({ category }) => {
      const categoryData = DOCUMENTATION_CATEGORIES[category];
      if (!categoryData) {
        throw new Error(`Category '${category}' not found`);
      }
      return {
        category,
        name: categoryData.name,
        description: categoryData.description,
        urls: categoryData.urls
      };
    }
  );

  server.registerTool(
    "search_documentation",
    {
      uri: "tool://better-auth/search_documentation",
      title: "Search Documentation",
      description: "Search for documentation pages by keyword",
      inputSchema: { query: { type: "string" } },
      outputSchema: { 
        results: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              url: { type: "string" },
              category: { type: "string" },
              relevance: { type: "number" }
            }
          } 
        } 
      }
    },
    async ({ query }) => {
      const results = [];
      const searchTerm = query.toLowerCase();
      
      Object.entries(DOCUMENTATION_CATEGORIES).forEach(([categoryKey, category]) => {
        category.urls.forEach(url => {
          const urlLower = url.toLowerCase();
          if (urlLower.includes(searchTerm)) {
            results.push({
              url,
              category: categoryKey,
              relevance: urlLower.includes(searchTerm) ? 1 : 0.5
            });
          }
        });
      });
      
      return { results: results.sort((a, b) => b.relevance - a.relevance) };
    }
  );

  server.registerTool(
    "search_official_documentation",
    {
      uri: "tool://better-auth/search_official_documentation",
      title: "Search Official Documentation Content",
      description: "Search for specific content within the official better-auth.txt documentation file",
      inputSchema: { query: { type: "string" } },
      outputSchema: { 
        results: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              url: { type: "string" },
              title: { type: "string" },
              excerpt: { type: "string" },
              relevance: { type: "number" }
            }
          } 
        },
        totalResults: { type: "number" }
      }
    },
    async ({ query }) => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        const lines = text.split("\n");
        const results = [];
        const searchTerm = query.toLowerCase();
        
        let currentUrl = null;
        let currentTitle = null;
        let currentContent = [];
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Extract URL
          if (trimmedLine.startsWith("URL: /docs/")) {
            currentUrl = trimmedLine.replace("URL: ", "");
            currentContent = [];
            currentTitle = null;
          }
          // Extract title
          else if (trimmedLine.startsWith("title: ")) {
            currentTitle = trimmedLine.replace("title: ", "");
          }
          // Check if line contains search term
          else if (currentUrl && trimmedLine.toLowerCase().includes(searchTerm)) {
            const excerpt = trimmedLine.length > 100 ? trimmedLine.substring(0, 100) + "..." : trimmedLine;
            const relevance = trimmedLine.toLowerCase().split(searchTerm).length - 1;
            
            results.push({
              url: currentUrl,
              title: currentTitle || "Untitled",
              excerpt,
              relevance
            });
          }
        }
        
        return { 
          results: results.sort((a, b) => b.relevance - a.relevance),
          totalResults: results.length
        };
      } catch (error) {
        console.error(`Failed reading ${LOCAL_FILE_PATH} for search_official_documentation:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );

  // Authentication Provider Tools
  server.registerTool(
    "get_all_auth_providers",
    {
      uri: "tool://better-auth/get_all_auth_providers",
      title: "Get All Authentication Providers",
      description: "Returns all available Better Auth authentication providers",
      inputSchema: undefined,
      outputSchema: { 
        providers: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              key: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              category: { type: "string" }
            }
          } 
        } 
      }
    },
    async () => {
      const providers = Object.entries(AUTH_PROVIDERS).map(([key, provider]) => ({
        key,
        name: provider.name,
        description: provider.description,
        category: provider.category
      }));
      return { providers };
    }
  );

  server.registerTool(
    "get_auth_provider_details",
    {
      uri: "tool://better-auth/get_auth_provider_details",
      title: "Get Authentication Provider Details",
      description: "Get detailed configuration for a specific authentication provider",
      inputSchema: { provider: { type: "string" } },
      outputSchema: { 
        provider: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        category: { type: "string" },
        config: { type: "object" },
        docUrl: { type: "string" }
      }
    },
    async ({ provider }) => {
      const providerConfig = AUTH_PROVIDERS[provider];
      if (!providerConfig) {
        throw new Error(`Provider '${provider}' not found`);
      }
      return {
        provider,
        name: providerConfig.name,
        description: providerConfig.description,
        category: providerConfig.category,
        config: providerConfig.config,
        docUrl: `/docs/authentication/${provider}`
      };
    }
  );

  server.registerTool(
    "get_providers_by_category",
    {
      uri: "tool://better-auth/get_providers_by_category",
      title: "Get Providers by Category",
      description: "Get authentication providers filtered by category",
      inputSchema: { category: { type: "string" } },
      outputSchema: { 
        category: { type: "string" },
        providers: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              key: { type: "string" },
              name: { type: "string" },
              description: { type: "string" }
            }
          } 
        } 
      }
    },
    async ({ category }) => {
      const providers = Object.entries(AUTH_PROVIDERS)
        .filter(([key, provider]) => provider.category === category)
        .map(([key, provider]) => ({
          key,
          name: provider.name,
          description: provider.description
        }));
      
      return { category, providers };
    }
  );

  // Database Adapter Tools
  server.registerTool(
    "get_all_database_adapters",
    {
      uri: "tool://better-auth/get_all_database_adapters",
      title: "Get All Database Adapters",
      description: "Returns all available Better Auth database adapters",
      inputSchema: undefined,
      outputSchema: { 
        adapters: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              key: { type: "string" },
              name: { type: "string" },
              description: { type: "string" }
            }
          } 
        } 
      }
    },
    async () => {
      const adapters = Object.entries(DATABASE_ADAPTERS).map(([key, adapter]) => ({
        key,
        name: adapter.name,
        description: adapter.description
      }));
      return { adapters };
    }
  );

  server.registerTool(
    "get_database_adapter_details",
    {
      uri: "tool://better-auth/get_database_adapter_details",
      title: "Get Database Adapter Details",
      description: "Get detailed configuration for a specific database adapter",
      inputSchema: { adapter: { type: "string" } },
      outputSchema: { 
        adapter: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        config: { type: "object" },
        docUrl: { type: "string" }
      }
    },
    async ({ adapter }) => {
      const adapterConfig = DATABASE_ADAPTERS[adapter];
      if (!adapterConfig) {
        throw new Error(`Adapter '${adapter}' not found`);
      }
      return {
        adapter,
        name: adapterConfig.name,
        description: adapterConfig.description,
        config: adapterConfig.config,
        docUrl: `/docs/adapters/${adapter}`
      };
    }
  );

  // Plugin Tools
  server.registerTool(
    "get_all_plugins",
    {
      uri: "tool://better-auth/get_all_plugins",
      title: "Get All Plugins",
      description: "Returns all available Better Auth plugins",
      inputSchema: undefined,
      outputSchema: { 
        plugins: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              key: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              category: { type: "string" }
            }
          } 
        } 
      }
    },
    async () => {
      const plugins = Object.entries(PLUGINS).map(([key, plugin]) => ({
        key,
        name: plugin.name,
        description: plugin.description,
        category: plugin.category
      }));
      return { plugins };
    }
  );

  server.registerTool(
    "get_plugin_details",
    {
      uri: "tool://better-auth/get_plugin_details",
      title: "Get Plugin Details",
      description: "Get detailed configuration for a specific plugin",
      inputSchema: { plugin: { type: "string" } },
      outputSchema: { 
        plugin: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        category: { type: "string" },
        config: { type: "object" },
        docUrl: { type: "string" }
      }
    },
    async ({ plugin }) => {
      const pluginConfig = PLUGINS[plugin];
      if (!pluginConfig) {
        throw new Error(`Plugin '${plugin}' not found`);
      }
      return {
        plugin,
        name: pluginConfig.name,
        description: pluginConfig.description,
        category: pluginConfig.category,
        config: pluginConfig.config,
        docUrl: `/docs/plugins/${plugin}`
      };
    }
  );

  server.registerTool(
    "get_plugins_by_category",
    {
      uri: "tool://better-auth/get_plugins_by_category",
      title: "Get Plugins by Category",
      description: "Get plugins filtered by category",
      inputSchema: { category: { type: "string" } },
      outputSchema: { 
        category: { type: "string" },
        plugins: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              key: { type: "string" },
              name: { type: "string" },
              description: { type: "string" }
            }
          } 
        } 
      }
    },
    async ({ category }) => {
      const plugins = Object.entries(PLUGINS)
        .filter(([key, plugin]) => plugin.category === category)
        .map(([key, plugin]) => ({
          key,
          name: plugin.name,
          description: plugin.description
        }));
      
      return { category, plugins };
    }
  );

  // Configuration Generation Tools
  server.registerTool(
    "generate_better_auth_config",
    {
      uri: "tool://better-auth/generate_better_auth_config",
      title: "Generate Better Auth Configuration",
      description: "Generate a complete Better Auth configuration with specified providers, adapters, and plugins",
      inputSchema: { 
        providers: { type: "array", items: { type: "string" } },
        adapter: { type: "string" },
        plugins: { type: "array", items: { type: "string" } },
        baseURL: { type: "string" }
      },
      outputSchema: { 
        config: { type: "string" },
        providers: { type: "array", items: { type: "string" } },
        adapter: { type: "string" },
        plugins: { type: "array", items: { type: "string" } },
        setupInstructions: { type: "array", items: { type: "string" } }
      }
    },
    async ({ providers, adapter, plugins, baseURL = "http://localhost:3000" }) => {
      // Validate providers
      const validProviders = providers.filter(p => AUTH_PROVIDERS[p]);
      if (validProviders.length !== providers.length) {
        const invalid = providers.filter(p => !AUTH_PROVIDERS[p]);
        throw new Error(`Invalid providers: ${invalid.join(', ')}`);
      }

      // Validate adapter
      if (!DATABASE_ADAPTERS[adapter]) {
        throw new Error(`Invalid adapter: ${adapter}`);
      }

      // Validate plugins
      const validPlugins = plugins.filter(p => PLUGINS[p]);
      if (validPlugins.length !== plugins.length) {
        const invalid = plugins.filter(p => !PLUGINS[p]);
        throw new Error(`Invalid plugins: ${invalid.join(', ')}`);
      }

      // Generate configuration
      let config = `import { betterAuth } from "better-auth";\n\n`;
      config += `export const auth = betterAuth({\n`;
      config += `  baseURL: "${baseURL}",\n\n`;
      
      // Add providers
      config += `  // Authentication Providers\n`;
      validProviders.forEach(provider => {
        config += `  ${provider}: {\n`;
        config += `    enabled: true,\n`;
        const providerConfig = AUTH_PROVIDERS[provider];
        Object.entries(providerConfig.config).forEach(([key, value]) => {
          if (typeof value === 'string') {
            config += `    ${key}: "${value}",\n`;
          } else {
            config += `    ${key}: ${value},\n`;
          }
        });
        config += `  },\n\n`;
      });

      // Add adapter
      config += `  // Database Adapter\n`;
      config += `  adapter: "${adapter}",\n\n`;

      // Add plugins
      if (validPlugins.length > 0) {
        config += `  // Plugins\n`;
        config += `  plugins: [\n`;
        validPlugins.forEach(plugin => {
          config += `    "${plugin}",\n`;
        });
        config += `  ],\n\n`;
      }

      config += `});\n`;

      // Generate setup instructions
      const setupInstructions = [
        "1. Install Better Auth: npm install better-auth",
        "2. Set up your database and configure the adapter",
        "3. Configure your authentication providers with proper credentials",
        "4. Set up email configuration for verification emails",
        "5. Configure environment variables for secrets and API keys",
        "6. Test the authentication flow"
      ];

      return {
        config,
        providers: validProviders,
        adapter,
        plugins: validPlugins,
        setupInstructions
      };
    }
  );

  // Documentation Tools
  server.registerTool(
    "get_provider_setup_guide",
    {
      uri: "tool://better-auth/get_provider_setup_guide",
      title: "Get Provider Setup Guide",
      description: "Get setup instructions for a specific authentication provider",
      inputSchema: { provider: { type: "string" } },
      outputSchema: { 
        provider: { type: "string" },
        name: { type: "string" },
        docUrl: { type: "string" },
        setupSteps: { type: "array", items: { type: "string" } },
        requiredCredentials: { type: "array", items: { type: "string" } }
      }
    },
    async ({ provider }) => {
      const providerConfig = AUTH_PROVIDERS[provider];
      if (!providerConfig) {
        throw new Error(`Provider '${provider}' not found`);
      }

      const setupSteps = [
        `1. Create an application in the ${providerConfig.name} developer console`,
        `2. Get your Client ID and Client Secret`,
        `3. Configure the redirect URI: http://localhost:3000/auth/callback/${provider}`,
        `4. Add the configuration to your Better Auth setup`,
        `5. Test the authentication flow`
      ];

      const requiredCredentials = [
        "Client ID",
        "Client Secret",
        "Redirect URI"
      ];

      return {
        provider,
        name: providerConfig.name,
        docUrl: `/docs/authentication/${provider}`,
        setupSteps,
        requiredCredentials
      };
    }
  );

  // Enhanced documentation tools
  server.registerTool(
    "get_official_documentation_urls",
    {
      uri: "tool://better-auth/get_official_documentation_urls",
      title: "Get Official Better Auth Documentation URLs",
      description: "Parse and return all documentation URLs from the official better-auth.txt file",
      inputSchema: undefined,
      outputSchema: { 
        urls: { type: "array", items: { type: "string" } },
        categories: { type: "object" },
        totalUrls: { type: "number" }
      }
    },
    async () => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        const lines = text.split("\n");
        const urls = [];
        const categories = {};
        let currentCategory = null;
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Extract URLs
          if (trimmedLine.startsWith("URL: /docs/")) {
            const url = trimmedLine.replace("URL: ", "");
            urls.push(url);
            
            // Categorize URLs
            const pathParts = url.split("/");
            if (pathParts.length >= 3) {
              const category = pathParts[2]; // e.g., "authentication", "adapters", etc.
              if (!categories[category]) {
                categories[category] = [];
              }
              categories[category].push(url);
            }
          }
          
          // Extract category headers (lines starting with #)
          if (trimmedLine.startsWith("# ") && trimmedLine.includes(":")) {
            const match = trimmedLine.match(/# ([^:]+): (.+)/);
            if (match) {
              currentCategory = {
                name: match[1].trim(),
                description: match[2].trim()
              };
            }
          }
        }
        
        return { 
          urls, 
          categories,
          totalUrls: urls.length
        };
      } catch (error) {
        console.error(`Failed reading ${LOCAL_FILE_PATH} for get_official_documentation_urls:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );

  server.registerTool(
    "get_documentation_by_category",
    {
      uri: "tool://better-auth/get_documentation_by_category",
      title: "Get Documentation URLs by Category",
      description: "Get all documentation URLs for a specific category from the official better-auth.txt file",
      inputSchema: { category: { type: "string" } },
      outputSchema: { 
        category: { type: "string" },
        urls: { type: "array", items: { type: "string" } },
        count: { type: "number" }
      }
    },
    async ({ category }) => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        const lines = text.split("\n");
        const urls = [];
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith("URL: /docs/")) {
            const url = trimmedLine.replace("URL: ", "");
            const pathParts = url.split("/");
            
            if (pathParts.length >= 3 && pathParts[2] === category) {
              urls.push(url);
            }
          }
        }
        
        return { 
          category, 
          urls,
          count: urls.length
        };
      } catch (error) {
        console.error(`Failed reading ${LOCAL_FILE_PATH} for get_documentation_by_category:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );

  // Basic tools for backward compatibility
  server.registerTool(
    "fetch_list",
    {
      uri: "tool://better-auth/fetch_list",
      title: "Get Better Auth Documentation URLs",
      description: "Returns an array of URLs listed in better-auth.txt",
      inputSchema: undefined,
      outputSchema: { urls: { type: "array", items: { type: "string" } } }
    },
    async () => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        const urls = text.split("\n").filter(l => l.trim().startsWith("URL: /docs/"));
        return { urls: urls.map(url => url.replace("URL: ", "")) };
      } catch (error) {
        console.error(`Failed reading ${LOCAL_FILE_PATH} for fetch_list:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );

  server.registerTool(
    "fetch_page",
    {
      uri: "tool://better-auth/fetch_page",
      title: "Fetch Better Auth Documentation Page",
      description: "Fetch content from allowed better-auth.com URL",
      inputSchema: { url: { type: "string" } },
      outputSchema: { url: { type: "string" }, content: { type: "string" } }
    },
    async ({ url }) => {
      if (!url.startsWith("https://raw.githubusercontent.com/better-auth/better-auth/")) {
        console.warn("Attempt blocked URL:", url);
        throw new Error("Domain not allowed");
      }
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const content = await resp.text();
      return { url, content };
    }
  );

  server.registerTool(
    "get_documentation_content",
    {
      uri: "tool://better-auth/get_documentation_content",
      title: "Get Documentation Content from Official File",
      description: "Get the full content of a specific documentation page from the official better-auth.txt file",
      inputSchema: { url: { type: "string" } },
      outputSchema: { 
        url: { type: "string" }, 
        title: { type: "string" },
        content: { type: "string" },
        found: { type: "boolean" }
      }
    },
    async ({ url }) => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        const lines = text.split("\n");
        let found = false;
        let title = null;
        let content = [];
        let inTargetSection = false;
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Check if this is the target URL
          if (trimmedLine === `URL: ${url}`) {
            found = true;
            inTargetSection = true;
            content = [];
            continue;
          }
          
          // If we're in the target section, collect content
          if (inTargetSection) {
            // Check if we've reached the next URL (end of current section)
            if (trimmedLine.startsWith("URL: /docs/") && trimmedLine !== `URL: ${url}`) {
              break;
            }
            
            // Extract title
            if (trimmedLine.startsWith("title: ")) {
              title = trimmedLine.replace("title: ", "");
            }
            // Skip metadata lines but include content
            else if (!trimmedLine.startsWith("URL: ") && 
                     !trimmedLine.startsWith("Source: ") && 
                     !trimmedLine.startsWith("***") &&
                     trimmedLine !== "") {
              content.push(line);
            }
          }
        }
        
        return { 
          url, 
          title: title || "Untitled",
          content: content.join("\n"),
          found
        };
      } catch (error) {
        console.error(`Failed reading ${LOCAL_FILE_PATH} for get_documentation_content:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );
}

async function main() {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
    capabilities: { resources: {}, tools: {} }
  });

  await initResources(server);
  await initTools(server);

  // Use console.error for logging to avoid interfering with MCP communication on stdout
  console.error("MCP Server ready:", SERVER_NAME, SERVER_VERSION);
  console.error("Available documentation categories:", Object.keys(DOCUMENTATION_CATEGORIES).length);
  console.error("Available authentication providers:", Object.keys(AUTH_PROVIDERS).length);
  console.error("Available database adapters:", Object.keys(DATABASE_ADAPTERS).length);
  console.error("Available plugins:", Object.keys(PLUGINS).length);
  console.error("Enhanced MCP tools available for Better Auth integration");
  console.error("Official documentation file:", LOCAL_FILE_PATH);
  console.error("New tools added: get_official_documentation_urls, get_documentation_by_category, search_official_documentation, get_documentation_content");
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error("Fatal MCP error:", err);
  process.exit(1);
});