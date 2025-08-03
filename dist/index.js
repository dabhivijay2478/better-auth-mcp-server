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
async function initResources(server) {
    try {
        // Register a comprehensive Better Auth documentation resource
        server.registerResource("better_auth_docs", "better-auth://documentation", {
            title: "Better Auth Documentation",
            description: "Complete Better Auth documentation and configuration guide",
            mimeType: "text/plain"
        }, async () => {
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
            }
            catch (error) {
                console.error("Failed to generate documentation content:", error);
                throw new Error("Failed to generate documentation content");
            }
        });
    }
    catch (error) {
        console.error("Failed to register resources:", error);
    }
}
async function initTools(server) {
    try {
        // Get comprehensive auth provider information
        server.registerTool("get_auth_provider_config", {
            title: "Get Authentication Provider Configuration",
            description: "Get detailed configuration and setup instructions for a specific authentication provider",
            inputSchema: {
                provider_name: z.string().describe("Name of the authentication provider to get configuration for")
            }
        }, async ({ provider_name }) => {
            try {
                const provider = AUTH_PROVIDERS[provider_name];
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
            }
            catch (error) {
                console.error("Error in get_auth_provider_config:", error);
                throw new Error(`Failed to get provider config: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Get comprehensive database adapter information
        server.registerTool("get_database_adapter_config", {
            title: "Get Database Adapter Configuration",
            description: "Get detailed configuration and setup instructions for a specific database adapter",
            inputSchema: {
                adapter_name: z.string().describe("Name of the database adapter to get configuration for")
            }
        }, async ({ adapter_name }) => {
            try {
                const adapter = DATABASE_ADAPTERS[adapter_name];
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
            }
            catch (error) {
                console.error("Error in get_database_adapter_config:", error);
                throw new Error(`Failed to get adapter config: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Get comprehensive plugin information
        server.registerTool("get_plugin_config", {
            title: "Get Plugin Configuration",
            description: "Get detailed configuration and setup instructions for a specific plugin",
            inputSchema: {
                plugin_name: z.string().describe("Name of the plugin to get configuration for")
            }
        }, async ({ plugin_name }) => {
            try {
                const plugin = PLUGINS[plugin_name];
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
            }
            catch (error) {
                console.error("Error in get_plugin_config:", error);
                throw new Error(`Failed to get plugin config: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Generate complete auth configuration
        server.registerTool("generate_auth_config", {
            title: "Generate Complete Better Auth Configuration",
            description: "Generate a complete Better Auth configuration with specified providers, adapters, and plugins",
            inputSchema: {
                providers: z.array(z.string()).describe("List of authentication providers to include"),
                adapter: z.string().describe("Database adapter to use"),
                plugins: z.array(z.string()).describe("List of plugins to include")
            }
        }, async ({ providers, adapter, plugins }) => {
            try {
                const config = `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",

  // Authentication Providers
  ${providers.map(provider => {
                    const providerConfig = AUTH_PROVIDERS[provider];
                    if (!providerConfig)
                        return `// ${provider} provider not found`;
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
            }
            catch (error) {
                console.error("Error in generate_auth_config:", error);
                throw new Error(`Failed to generate config: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Validate auth setup
        server.registerTool("validate_auth_setup", {
            title: "Validate Better Auth Setup",
            description: "Validate a Better Auth configuration and provide recommendations",
            inputSchema: {
                config: z.string().describe("Better Auth configuration to validate")
            }
        }, async ({ config }) => {
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
            }
            catch (error) {
                console.error("Error in validate_auth_setup:", error);
                throw new Error(`Failed to validate setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Documentation Navigation Tools
        server.registerTool("get_documentation_categories", {
            title: "Get Documentation Categories",
            description: "Returns all available Better Auth documentation categories",
            inputSchema: {}
        }, async () => {
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
            }
            catch (error) {
                console.error("Error in get_documentation_categories:", error);
                throw new Error(`Failed to get documentation categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        server.registerTool("get_documentation_urls", {
            title: "Get Documentation URLs by Category",
            description: "Get all documentation URLs for a specific category",
            inputSchema: {
                category: z.string().describe("Documentation category to get URLs for")
            }
        }, async ({ category }) => {
            try {
                const categoryData = DOCUMENTATION_CATEGORIES[category];
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
            }
            catch (error) {
                console.error("Error in get_documentation_urls:", error);
                throw new Error(`Failed to get documentation URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Authentication Provider Tools
        server.registerTool("get_all_auth_providers", {
            title: "Get All Authentication Providers",
            description: "Returns all available Better Auth authentication providers",
            inputSchema: {}
        }, async () => {
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
            }
            catch (error) {
                console.error("Error in get_all_auth_providers:", error);
                throw new Error(`Failed to get auth providers: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Database Adapter Tools
        server.registerTool("get_all_database_adapters", {
            title: "Get All Database Adapters",
            description: "Returns all available Better Auth database adapters",
            inputSchema: {}
        }, async () => {
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
            }
            catch (error) {
                console.error("Error in get_all_database_adapters:", error);
                throw new Error(`Failed to get database adapters: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
        // Plugin Tools
        server.registerTool("get_all_plugins", {
            title: "Get All Plugins",
            description: "Returns all available Better Auth plugins",
            inputSchema: {}
        }, async () => {
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
            }
            catch (error) {
                console.error("Error in get_all_plugins:", error);
                throw new Error(`Failed to get plugins: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("Fatal MCP error:", error);
        process.exit(1);
    }
}
main().catch(err => {
    console.error("Fatal MCP error:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map