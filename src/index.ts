import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SERVER_NAME = "better-auth-comprehensive";
const SERVER_VERSION = "4.0.0";

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
  apple: {
    name: "Apple Sign-In",
    description: "Apple Sign-In authentication with OpenID Connect",
    category: "social",
    config: {
      clientId: "YOUR_APPLE_CLIENT_ID",
      clientSecret: "YOUR_APPLE_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/apple"
    },
    setupSteps: [
      "1. Create an App ID in Apple Developer Console",
      "2. Configure Sign In with Apple capability",
      "3. Create a Services ID for web authentication",
      "4. Generate client secret using private key",
      "5. Add configuration to your auth setup"
    ],
    requiredEnvVars: [
      "APPLE_CLIENT_ID",
      "APPLE_CLIENT_SECRET"
    ]
  },
  microsoft: {
    name: "Microsoft OAuth",
    description: "Microsoft Azure Entra ID (formerly Active Directory) authentication",
    category: "social",
    config: {
      clientId: "YOUR_MICROSOFT_CLIENT_ID",
      clientSecret: "YOUR_MICROSOFT_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/microsoft",
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
    requiredEnvVars: [
      "MICROSOFT_CLIENT_ID",
      "MICROSOFT_CLIENT_SECRET"
    ]
  },
  facebook: {
    name: "Facebook OAuth",
    description: "Facebook OAuth authentication with user permissions",
    category: "social",
    config: {
      clientId: "YOUR_FACEBOOK_CLIENT_ID",
      clientSecret: "YOUR_FACEBOOK_CLIENT_SECRET",
      redirectUri: "http://localhost:3000/api/auth/callback/facebook"
    },
    setupSteps: [
      "1. Create a Facebook App in Facebook Developers",
      "2. Add Facebook Login product",
      "3. Configure OAuth redirect URIs",
      "4. Set up app permissions",
      "5. Add configuration to your auth setup"
    ],
    requiredEnvVars: [
      "FACEBOOK_CLIENT_ID",
      "FACEBOOK_CLIENT_SECRET"
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
  }
};

async function initResources(server: McpServer) {
  try {
    // Register a comprehensive Better Auth documentation resource
    server.registerResource(
      "better_auth_docs",
      "better-auth://documentation",
      {
        title: "Better Auth Documentation",
        description: "Complete Better Auth documentation and configuration guide",
        mimeType: "text/plain"
      },
      async () => {
        try {
          // Return comprehensive Better Auth documentation content
          const documentationContent = `# Better Auth Documentation

## Overview
Better Auth is a framework-agnostic authentication and authorization framework for TypeScript. It provides a comprehensive set of features out of the box and includes a plugin ecosystem that simplifies adding advanced functionalities.

## Key Features
- Framework agnostic - Works with any framework
- Advanced features built-in - 2FA, multi-tenancy, multi-session, rate limiting
- Plugin system - Extend functionality without forking
- Full control - Customize auth flows exactly how you want

## Authentication Providers
Better Auth supports multiple authentication providers:
- Email & Password
- Google OAuth
- GitHub OAuth
- Facebook OAuth
- Apple Sign-In
- Discord OAuth
- And many more...

## Database Adapters
Supported database adapters:
- PostgreSQL
- MySQL
- SQLite
- MongoDB
- Drizzle ORM
- Prisma ORM
- MS SQL Server

## Plugins
Available plugins include:
- Magic Link
- Passkey
- Two-Factor Authentication
- Username
- CAPTCHA
- JWT
- Organization
- SSO
- Stripe
- Admin Panel
- And many more...

## Getting Started
1. Install Better Auth: npm install better-auth
2. Set environment variables (BETTER_AUTH_SECRET, BETTER_AUTH_URL)
3. Configure your database adapter
4. Set up authentication providers
5. Create your auth instance
6. Mount the handler in your framework

## Documentation Categories
- Getting Started
- Authentication Providers
- Database Adapters
- Plugins
- Framework Integrations
- Guides and Tutorials
- Core Concepts

For more detailed information, visit the official Better Auth documentation at https://better-auth.com/docs`;

          return { 
            contents: [{ 
              uri: "better-auth://documentation", 
              text: documentationContent 
            }] 
          };
        } catch (error) {
          console.error("Failed to generate documentation content:", error);
          throw new Error("Failed to generate documentation content");
        }
      }
    );
  } catch (error) {
    console.error("Failed to register resources:", error);
  }
}

async function initTools(server: McpServer) {
  try {
    // Get comprehensive auth provider information
    server.registerTool(
      "get_auth_provider_config",
      {
        title: "Get Authentication Provider Configuration",
        description: "Get detailed configuration and setup instructions for a specific authentication provider",
        inputSchema: {
          provider_name: z.string().describe("Name of the authentication provider to get configuration for")
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
                name: provider.name,
                description: provider.description,
                category: provider.category,
                config: provider.config,
                setupSteps: provider.setupSteps,
                requiredEnvVars: provider.requiredEnvVars,
                docUrl: `/docs/authentication/${provider_name}`
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_auth_provider_config:", error);
          throw new Error(`Failed to get provider config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Get comprehensive database adapter information
    server.registerTool(
      "get_database_adapter_config",
      {
        title: "Get Database Adapter Configuration",
        description: "Get detailed configuration and setup instructions for a specific database adapter",
        inputSchema: {
          adapter_name: z.string().describe("Name of the database adapter to get configuration for")
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
                name: adapter.name,
                description: adapter.description,
                config: adapter.config,
                setupSteps: adapter.setupSteps,
                requiredPackages: adapter.requiredPackages,
                migrationSupport: adapter.migrationSupport,
                docUrl: `/docs/adapters/${adapter_name}`
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_database_adapter_config:", error);
          throw new Error(`Failed to get adapter config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Get comprehensive plugin information
    server.registerTool(
      "get_plugin_config",
      {
        title: "Get Plugin Configuration",
        description: "Get detailed configuration and setup instructions for a specific plugin",
        inputSchema: {
          plugin_name: z.string().describe("Name of the plugin to get configuration for")
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
                name: plugin.name,
                description: plugin.description,
                category: plugin.category,
                config: plugin.config,
                setupSteps: plugin.setupSteps,
                requiredPackages: plugin.requiredPackages,
                clientSetup: plugin.clientSetup,
                docUrl: `/docs/plugins/${plugin_name}`
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_plugin_config:", error);
          throw new Error(`Failed to get plugin config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Generate complete auth configuration
    server.registerTool(
      "generate_auth_config",
      {
        title: "Generate Complete Better Auth Configuration",
        description: "Generate a complete Better Auth configuration with specified providers, adapters, and plugins",
        inputSchema: {
          providers: z.array(z.string()).describe("List of authentication providers to include"),
          adapter: z.string().describe("Database adapter to use"),
          plugins: z.array(z.string()).describe("List of plugins to include")
        }
      },
      async ({ providers, adapter, plugins }) => {
        try {
          const config = `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",

  // Authentication Providers
  ${providers.map(provider => {
    const providerConfig = AUTH_PROVIDERS[provider as keyof typeof AUTH_PROVIDERS];
    if (!providerConfig) return `// ${provider} provider not found`;
    return `${provider}: {
    enabled: true,
    clientId: "YOUR_${provider.toUpperCase()}_CLIENT_ID",
    clientSecret: "YOUR_${provider.toUpperCase()}_CLIENT_SECRET",
    redirectUri: "http://localhost:3000/api/auth/callback/${provider}"
  },`;
  }).join('\n  ')},

  // Database Adapter
  adapter: "${adapter}",

  // Plugins
  plugins: [
    ${plugins.map(plugin => `"${plugin}"`).join(',\n    ')}
  ],
});`;

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                config,
                providers,
                adapter,
                plugins,
                setupInstructions: [
                  "1. Install Better Auth: npm install better-auth",
                  "2. Set up your database and configure the adapter",
                  "3. Configure your authentication providers with proper credentials",
                  "4. Set up email configuration for verification emails",
                  "5. Configure environment variables for secrets and API keys",
                  "6. Test the authentication flow"
                ],
                requiredPackages: ["better-auth"],
                requiredEnvVars: ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"]
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in generate_auth_config:", error);
          throw new Error(`Failed to generate config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Validate auth setup
    server.registerTool(
      "validate_auth_setup",
      {
        title: "Validate Better Auth Setup",
        description: "Validate a Better Auth configuration and provide recommendations",
        inputSchema: {
          config: z.string().describe("Better Auth configuration to validate")
        }
      },
      async ({ config }) => {
        try {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                valid: true,
                errors: [],
                warnings: [],
                recommendations: [
                  "Consider adding email_otp plugin for enhanced email security",
                  "Consider adding captcha plugin for additional security"
                ]
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in validate_auth_setup:", error);
          throw new Error(`Failed to validate setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Documentation Navigation Tools
    server.registerTool(
      "get_documentation_categories",
      {
        title: "Get Documentation Categories",
        description: "Returns all available Better Auth documentation categories",
        inputSchema: {}
      },
      async () => {
        try {
          const categories = Object.entries(DOCUMENTATION_CATEGORIES).map(([key, category]) => ({
            key,
            name: category.name,
            description: category.description,
            urlCount: category.urls.length
          }));
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ categories }, null, 2)
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
        title: "Get Documentation URLs by Category",
        description: "Get all documentation URLs for a specific category",
        inputSchema: {
          category: z.string().describe("Documentation category to get URLs for")
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
                description: categoryData.description,
                urls: categoryData.urls
              }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_documentation_urls:", error);
          throw new Error(`Failed to get documentation URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Authentication Provider Tools
    server.registerTool(
      "get_all_auth_providers",
      {
        title: "Get All Authentication Providers",
        description: "Returns all available Better Auth authentication providers",
        inputSchema: {}
      },
      async () => {
        try {
          const providers = Object.entries(AUTH_PROVIDERS).map(([key, provider]) => ({
            key,
            name: provider.name,
            description: provider.description,
            category: provider.category
          }));
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ providers }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_all_auth_providers:", error);
          throw new Error(`Failed to get auth providers: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          const adapters = Object.entries(DATABASE_ADAPTERS).map(([key, adapter]) => ({
            key,
            name: adapter.name,
            description: adapter.description
          }));
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ adapters }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_all_database_adapters:", error);
          throw new Error(`Failed to get database adapters: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // Plugin Tools
    server.registerTool(
      "get_all_plugins",
      {
        title: "Get All Plugins",
        description: "Returns all available Better Auth plugins",
        inputSchema: {}
      },
      async () => {
        try {
          const plugins = Object.entries(PLUGINS).map(([key, plugin]) => ({
            key,
            name: plugin.name,
            description: plugin.description,
            category: plugin.category
          }));
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ plugins }, null, 2)
            }]
          };
        } catch (error) {
          console.error("Error in get_all_plugins:", error);
          throw new Error(`Failed to get plugins: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );

    // MCP Plugin Configuration Tools
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
            description: "MCP provider plugin for Better Auth - lets your app act as an OAuth provider for MCP clients",
            category: "oauth",
            config: {
              loginPage: "/sign-in",
              oidcConfig: {
                codeExpiresIn: 600,
                accessTokenExpiresIn: 3600,
                refreshTokenExpiresIn: 604800,
                defaultScope: "openid",
                scopes: ["openid", "profile", "email", "offline_access"]
              }
            },
            setupSteps: [
              "1. Add the MCP plugin to your auth configuration",
              "2. Specify the login page path",
              "3. Generate schema using npx @better-auth/cli migrate",
              "4. Add OAuth discovery metadata route",
              "5. Set up MCP session handling with withMcpAuth",
              "6. Configure Redis for session storage"
            ],
            requiredPackages: ["better-auth/plugins", "@vercel/mcp-adapter"],
            requiredEnvVars: ["REDIS_URL"],
            codeExample: `import { betterAuth } from "better-auth";
import { mcp } from "better-auth/plugins";

export const auth = betterAuth({
    plugins: [
        mcp({
            loginPage: "/sign-in"
        })
    ]
});`
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

    // MCP Session Handling Tools
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
            description: "Helper function to get session and handle unauthenticated calls automatically",
            usage: "withMcpAuth",
            codeExample: `import { auth } from "@/lib/auth";
import { createMcpHandler } from "@vercel/mcp-adapter";
import { withMcpAuth } from "better-auth/plugins";
import { z } from "zod";

const handler = withMcpAuth(auth, (req, session) => {
    return createMcpHandler(
        (server) => {
            server.tool(
                "echo",
                "Echo a message",
                { message: z.string() },
                async ({ message }) => {
                    return {
                        content: [{ type: "text", text: \`Tool echo: \${message}\` }],
                    };
                },
            );
        },
        {
            capabilities: {
                tools: {
                    echo: {
                        description: "Echo a message",
                    },
                },
            },
        },
        {
            redisUrl: process.env.REDIS_URL,
            basePath: "/api",
            verboseLogs: true,
            maxDuration: 60,
        },
    )(req);
});`,
            setupSteps: [
              "1. Import withMcpAuth from better-auth/plugins",
              "2. Import createMcpHandler from @vercel/mcp-adapter",
              "3. Wrap your MCP handler with withMcpAuth",
              "4. Configure Redis URL for session storage",
              "5. Set up proper error handling for unauthenticated calls"
            ]
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

    // OAuth Discovery Metadata Tools
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
            ]
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

    // MCP Session API Tools
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
import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";

const handler = async (req: Request) => {
    const session = await auth.api.getMcpSession({
        headers: req.headers
    })
    if(!session){
        return new Response(null, {
            status: 401
        })
    }
    return createMcpHandler(
        (server) => {
            server.tool(
                "echo",
                "Echo a message",
                { message: z.string() },
                async ({ message }) => {
                    return {
                        content: [{ type: "text", text: \`Tool echo: \${message}\` }],
                    };
                },
            );
        },
        {
            capabilities: {
                tools: {
                    echo: {
                        description: "Echo a message",
                    },
                },
            },
        },
        {
            redisUrl: process.env.REDIS_URL,
            basePath: "/api",
            verboseLogs: true,
            maxDuration: 60,
        },
    )(req);
}`,
            setupSteps: [
              "1. Import auth instance",
              "2. Call auth.api.getMcpSession with request headers",
              "3. Handle case where session is null (return 401)",
              "4. Use session data for MCP handler configuration"
            ]
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

    // Multi Session Plugin Tools
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
            description: "Allows users to maintain multiple active sessions across different accounts",
            category: "session",
            config: {
              enabled: true
            },
            setupSteps: [
              "1. Add multiSession plugin to auth configuration",
              "2. Add client plugin to auth client",
              "3. Configure redirect path for 2FA verification",
              "4. Test multi-session functionality"
            ],
            codeExample: `import { betterAuth } from "better-auth"
import { multiSession } from "better-auth/plugins"

export const auth = betterAuth({
    plugins: [
        multiSession(),
    ]
})`,
            clientSetup: true
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

    // Email Verification Tools
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
              autoSignInAfterVerification: true
            },
            setupSteps: [
              "1. Configure sendVerificationEmail function",
              "2. Set up email sending service",
              "3. Configure verification URLs",
              "4. Test email verification flow",
              "5. Handle verification callbacks"
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
        autoSignInAfterVerification: true
    }
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

    // Password Reset Tools
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
              "1. Configure sendResetPassword function",
              "2. Set up email sending service",
              "3. Create password reset page",
              "4. Handle reset token validation",
              "5. Test password reset flow"
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
        }
    }
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

    // Session Management Tools
    server.registerTool(
      "get_session_management_config",
      {
        title: "Get Session Management Configuration",
        description: "Get configuration for session management",
        inputSchema: {}
      },
      async () => {
        try {
          const sessionConfig = {
            name: "Session Management",
            description: "Configure session handling and security",
            category: "security",
            config: {
              updateAge: 24 * 60 * 60, // 24 hours
              expiresIn: 30 * 24 * 60 * 60, // 30 days
              secure: true,
              httpOnly: true
            },
            setupSteps: [
              "1. Configure session expiration times",
              "2. Set up secure cookie options",
              "3. Configure session update intervals",
              "4. Test session persistence",
              "5. Handle session cleanup"
            ],
            codeExample: `import { betterAuth } from "better-auth";

export const auth = betterAuth({
    session: {
        updateAge: 24 * 60 * 60, // 24 hours
        expiresIn: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        }
    }
});`,
            clientUsage: `// Client-side session access
const { data: session, isPending, error } = authClient.useSession();

// Server-side session access
const session = await auth.api.getSession({
    headers: request.headers
});`
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

    // Database Schema Tools
    server.registerTool(
      "get_database_schema_info",
      {
        title: "Get Database Schema Information",
        description: "Get information about Better Auth database schema",
        inputSchema: {}
      },
      async () => {
        try {
          const schemaInfo = {
            name: "Database Schema",
            description: "Core database tables and schema for Better Auth",
            tables: {
              user: {
                description: "User account information",
                fields: ["id", "email", "name", "image", "emailVerified", "createdAt", "updatedAt"]
              },
              session: {
                description: "User session data",
                fields: ["id", "userId", "expiresAt", "createdAt", "updatedAt"]
              },
              account: {
                description: "OAuth account connections",
                fields: ["id", "userId", "providerId", "accountId", "accessToken", "refreshToken", "scope"]
              },
              verification: {
                description: "Email verification tokens",
                fields: ["id", "identifier", "value", "expiresAt", "createdAt", "updatedAt"]
              }
            },
            setupSteps: [
              "1. Run npx @better-auth/cli generate to create schema",
              "2. Run npx @better-auth/cli migrate to apply migrations",
              "3. Configure database connection",
              "4. Test database connectivity",
              "5. Verify schema creation"
            ],
            codeExample: `// Generate schema
npx @better-auth/cli generate

// Apply migrations
npx @better-auth/cli migrate

// Custom schema configuration
export const auth = betterAuth({
    user: {
        additionalFields: {
            role: { type: "string", required: false, defaultValue: "user" },
            lang: { type: "string", required: false, defaultValue: "en" }
        }
    }
});`
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

    // Hooks Configuration Tools
    server.registerTool(
      "get_hooks_config",
      {
        title: "Get Hooks Configuration",
        description: "Get configuration for Better Auth hooks",
        inputSchema: {}
      },
      async () => {
        try {
          const hooksConfig = {
            name: "Hooks Configuration",
            description: "Customize Better Auth behavior with before/after hooks",
            category: "customization",
            types: {
              before: "Run before endpoint execution",
              after: "Run after endpoint execution"
            },
            setupSteps: [
              "1. Import createAuthMiddleware from better-auth/api",
              "2. Create hook functions with proper context",
              "3. Add hooks to auth configuration",
              "4. Test hook execution",
              "5. Handle errors and responses"
            ],
            codeExample: `import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";

export const auth = betterAuth({
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                if (!ctx.body?.email.endsWith("@example.com")) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Email must end with @example.com"
                    });
                }
            }
        }),
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path.startsWith("/sign-up")) {
                console.log("New user registered:", ctx.context.newSession?.user);
            }
        })
    }
});`,
            contextProperties: [
              "ctx.path - Current endpoint path",
              "ctx.body - Request body data",
              "ctx.headers - Request headers",
              "ctx.query - Query parameters",
              "ctx.context - Auth-specific context"
            ]
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

    // Use console.error for logging to avoid interfering with MCP communication on stdout
    console.error("MCP Server ready:", SERVER_NAME, SERVER_VERSION);
    console.error("Enhanced MCP tools available for Better Auth integration");
    console.error("Better Auth documentation and tools loaded successfully");
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Fatal MCP error:", error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal MCP error:", err);
  process.exit(1);
}); 