# Better Auth MCP Server - Comprehensive API Documentation

## Overview

The Better Auth MCP Server is a comprehensive Model Context Protocol (MCP) server that provides tools for all Better Auth authentication providers, database adapters, and plugins. This documentation covers all public APIs, functions, and components available in the server.

**Server Details:**
- **Name:** `better-auth-comprehensive`
- **Version:** `4.0.0`
- **Main Entry Point:** `dist/index.js`
- **Source Code:** `src/index.ts`

## Table of Contents

1. [Core Functions](#core-functions)
2. [Documentation Tools](#documentation-tools)
3. [Authentication Provider Tools](#authentication-provider-tools)
4. [Database Adapter Tools](#database-adapter-tools)
5. [Plugin Tools](#plugin-tools)
6. [Configuration Generation Tools](#configuration-generation-tools)
7. [Session Management Tools](#session-management-tools)
8. [Security Tools](#security-tools)
9. [MCP Integration Tools](#mcp-integration-tools)
10. [Data Structures](#data-structures)
11. [Usage Examples](#usage-examples)
12. [Error Handling](#error-handling)

---

## Core Functions

### `main()`
**Description:** Entry point function that initializes the MCP server, registers all tools, and starts the transport layer.

**Signature:**
```typescript
async function main(): Promise<void>
```

**Implementation Details:**
- Creates a new `McpServer` instance
- Initializes resources and tools
- Connects to `StdioServerTransport`
- Handles fatal errors and exits gracefully

**Usage:**
```typescript
main().catch(err => {
  console.error("Fatal MCP error:", err);
  process.exit(1);
});
```

### `initResources(server: McpServer)`
**Description:** Initializes MCP resources for documentation categories and URLs.

**Parameters:**
- `server: McpServer` - The MCP server instance

**Resources Created:**
- Documentation categories (getting_started, adapters, authentication_providers, etc.)
- Individual documentation URLs for each category

### `initTools(server: McpServer)`
**Description:** Registers all MCP tools with the server.

**Parameters:**
- `server: McpServer` - The MCP server instance

**Tools Registered:** 20+ tools for comprehensive Better Auth integration

---

## Documentation Tools

### `get_documentation_categories`
**Description:** Returns all available Better Auth documentation categories.

**Input Schema:** None

**Output:**
```typescript
{
  categories: Array<{
    key: string;
    name: string;
    description: string;
    urlCount: number;
  }>
}
```

**Example Usage:**
```javascript
const result = await get_documentation_categories();
console.log(result.categories);
// Output: List of all documentation categories with metadata
```

**Available Categories:**
- `getting_started` - Basic setup and introduction
- `adapters` - Database connection adapters
- `authentication_providers` - All authentication providers
- `concepts` - Core concepts and APIs
- `examples` - Framework integration examples
- `guides` - Step-by-step guides and tutorials
- `integrations` - Framework integration guides
- `plugins` - Authentication plugins

### `get_documentation_urls`
**Description:** Get all documentation URLs for a specific category.

**Input Schema:**
```typescript
{
  category: string; // Documentation category name
}
```

**Output:**
```typescript
{
  category: string;
  name: string;
  description: string;
  urls: string[];
}
```

**Example Usage:**
```javascript
const result = await get_documentation_urls({
  category: "authentication_providers"
});
console.log(result.urls);
// Output: Array of URLs for authentication provider documentation
```

---

## Authentication Provider Tools

### `get_all_auth_providers`
**Description:** Returns all available Better Auth authentication providers.

**Input Schema:** None

**Output:**
```typescript
{
  providers: Array<{
    key: string;
    name: string;
    description: string;
    category: string;
  }>
}
```

**Available Providers (25+):**
- **Basic:** `email_password`
- **Social OAuth:** `google`, `github`, `facebook`, `apple`, `discord`, `twitter`, `linkedin`, `microsoft`, `spotify`, `slack`, `twitch`, `tiktok`, `notion`, `linear`, `gitlab`, `dropbox`, `reddit`, `roblox`, `vk`, `zoom`, `huggingface`, `kick`

**Example Usage:**
```javascript
const result = await get_all_auth_providers();
console.log(result.providers);
// Output: Complete list of all 25+ authentication providers
```

### `get_auth_provider_config`
**Description:** Get detailed configuration and setup instructions for a specific authentication provider.

**Input Schema:**
```typescript
{
  provider_name: string; // Name of the authentication provider
}
```

**Output:**
```typescript
{
  provider: string;
  name: string;
  description: string;
  category: string;
  config: object;
  setupSteps: string[];
  requiredEnvVars: string[];
  docUrl: string;
}
```

**Example Usage:**
```javascript
const result = await get_auth_provider_config({
  provider_name: "google"
});
console.log(result.config);
// Output: Complete Google OAuth configuration with setup steps
```

**Provider Configuration Examples:**

#### Google OAuth Configuration
```javascript
{
  provider: "google",
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
  requiredEnvVars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
}
```

#### GitHub OAuth Configuration
```javascript
{
  provider: "github",
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
  requiredEnvVars: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]
}
```

---

## Database Adapter Tools

### `get_all_database_adapters`
**Description:** Returns all available Better Auth database adapters.

**Input Schema:** None

**Output:**
```typescript
{
  adapters: Array<{
    key: string;
    name: string;
    description: string;
  }>
}
```

**Available Adapters (6):**
- `postgresql` - PostgreSQL database adapter
- `mysql` - MySQL database adapter
- `sqlite` - SQLite database adapter
- `mongodb` - MongoDB database adapter
- `drizzle` - Drizzle ORM adapter
- `prisma` - Prisma ORM adapter

**Example Usage:**
```javascript
const result = await get_all_database_adapters();
console.log(result.adapters);
// Output: List of all 6 database adapters
```

### `get_database_adapter_config`
**Description:** Get detailed configuration and setup instructions for a specific database adapter.

**Input Schema:**
```typescript
{
  adapter_name: string; // Name of the database adapter
}
```

**Output:**
```typescript
{
  adapter: string;
  name: string;
  description: string;
  config: object;
  setupSteps: string[];
  requiredPackages: string[];
  migrationSupport: boolean;
  docUrl: string;
}
```

**Example Usage:**
```javascript
const result = await get_database_adapter_config({
  adapter_name: "postgresql"
});
console.log(result.config);
// Output: Complete PostgreSQL adapter configuration
```

---

## Plugin Tools

### `get_all_plugins`
**Description:** Returns all available Better Auth plugins.

**Input Schema:** None

**Output:**
```typescript
{
  plugins: Array<{
    key: string;
    name: string;
    description: string;
    category: string;
  }>
}
```

**Available Plugins (12+):**
- **Security:** `magic_link`, `passkey`, `email_otp`, `two_factor`, `captcha`
- **Session:** `jwt`, `multi_session`
- **Organization:** `organization`, `sso`
- **Integration:** `stripe`, `mcp`
- **Authentication:** `username`

**Example Usage:**
```javascript
const result = await get_all_plugins();
console.log(result.plugins);
// Output: Complete list of all plugins with categories
```

### `get_plugin_config`
**Description:** Get detailed configuration and setup instructions for a specific plugin.

**Input Schema:**
```typescript
{
  plugin_name: string; // Name of the plugin
}
```

**Output:**
```typescript
{
  plugin: string;
  name: string;
  description: string;
  category: string;
  config: object;
  setupSteps: string[];
  requiredPackages: string[];
  clientSetup: boolean;
  docUrl: string;
}
```

**Example Usage:**
```javascript
const result = await get_plugin_config({
  plugin_name: "magic_link"
});
console.log(result.config);
// Output: Complete Magic Link plugin configuration
```

---

## Configuration Generation Tools

### `generate_auth_config`
**Description:** Generate a complete Better Auth configuration with specified providers, adapters, and plugins.

**Input Schema:**
```typescript
{
  providers: string[]; // List of authentication providers
  adapter: string; // Database adapter to use
  plugins: string[]; // List of plugins to include
}
```

**Output:**
```typescript
{
  config: string; // Complete Better Auth configuration code
  providers: string[];
  adapter: string;
  plugins: string[];
  setupInstructions: string[];
  requiredPackages: string[];
  requiredEnvVars: string[];
}
```

**Example Usage:**
```javascript
const result = await generate_auth_config({
  providers: ["google", "github", "email_password"],
  adapter: "postgresql",
  plugins: ["magic_link", "two_factor"]
});
console.log(result.config);
// Output: Complete Better Auth configuration code
```

**Generated Configuration Example:**
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",

  // Authentication Providers
  google: {
    enabled: true,
    clientId: "YOUR_GOOGLE_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
    redirectUri: "http://localhost:3000/api/auth/callback/google"
  },
  github: {
    enabled: true,
    clientId: "YOUR_GITHUB_CLIENT_ID",
    clientSecret: "YOUR_GITHUB_CLIENT_SECRET",
    redirectUri: "http://localhost:3000/api/auth/callback/github"
  },

  // Database Adapter
  adapter: "postgresql",

  // Plugins
  plugins: [
    "magic_link",
    "two_factor"
  ],
});
```

### `validate_auth_setup`
**Description:** Validate a Better Auth configuration and provide recommendations.

**Input Schema:**
```typescript
{
  config: string; // Better Auth configuration to validate
}
```

**Output:**
```typescript
{
  valid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}
```

**Example Usage:**
```javascript
const result = await validate_auth_setup({
  config: "/* your auth config */"
});
console.log(result.recommendations);
// Output: Validation results with recommendations
```

---

## Session Management Tools

### `get_session_management_config`
**Description:** Get configuration for session management.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  category: string;
  config: {
    updateAge: number;
    expiresIn: number;
    secure: boolean;
    httpOnly: boolean;
  };
  setupSteps: string[];
  codeExample: string;
  clientUsage: string;
}
```

**Example Usage:**
```javascript
const result = await get_session_management_config();
console.log(result.config);
// Output: Complete session management configuration
```

**Configuration Example:**
```typescript
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
});
```

---

## Security Tools

### `get_email_verification_config`
**Description:** Get configuration for email verification setup.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  category: string;
  config: {
    sendOnSignUp: boolean;
    requireEmailVerification: boolean;
    autoSignInAfterVerification: boolean;
  };
  setupSteps: string[];
  codeExample: string;
  requiredEnvVars: string[];
}
```

**Example Usage:**
```javascript
const result = await get_email_verification_config();
console.log(result.codeExample);
// Output: Email verification configuration code
```

### `get_password_reset_config`
**Description:** Get configuration for password reset functionality.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  category: string;
  config: {
    enabled: boolean;
    tokenExpiresIn: number;
    sendResetPassword: boolean;
  };
  setupSteps: string[];
  codeExample: string;
  requiredEnvVars: string[];
}
```

**Example Usage:**
```javascript
const result = await get_password_reset_config();
console.log(result.setupSteps);
// Output: Password reset setup instructions
```

---

## MCP Integration Tools

### `get_mcp_plugin_config`
**Description:** Get detailed configuration and setup instructions for the MCP plugin.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  category: string;
  config: {
    loginPage: string;
    oidcConfig: {
      codeExpiresIn: number;
      accessTokenExpiresIn: number;
      refreshTokenExpiresIn: number;
      defaultScope: string;
      scopes: string[];
    };
  };
  setupSteps: string[];
  requiredPackages: string[];
  requiredEnvVars: string[];
  codeExample: string;
}
```

**Example Usage:**
```javascript
const result = await get_mcp_plugin_config();
console.log(result.codeExample);
// Output: MCP plugin configuration code
```

### `get_mcp_session_handler`
**Description:** Get configuration for MCP session handling with withMcpAuth.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  usage: string;
  codeExample: string;
  setupSteps: string[];
}
```

**Example Usage:**
```javascript
const result = await get_mcp_session_handler();
console.log(result.codeExample);
// Output: MCP session handler implementation code
```

### `get_oauth_discovery_metadata`
**Description:** Get configuration for OAuth discovery metadata route.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  route: string;
  codeExample: string;
  setupSteps: string[];
}
```

**Example Usage:**
```javascript
const result = await get_oauth_discovery_metadata();
console.log(result.route);
// Output: "/.well-known/oauth-authorization-server"
```

### `get_mcp_session_api`
**Description:** Get configuration for using auth.api.getMcpSession.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  method: string;
  codeExample: string;
  setupSteps: string[];
}
```

**Example Usage:**
```javascript
const result = await get_mcp_session_api();
console.log(result.method);
// Output: "auth.api.getMcpSession"
```

---

## Additional Tools

### `get_multi_session_plugin_config`
**Description:** Get configuration for the multi-session plugin.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  category: string;
  config: { enabled: boolean };
  setupSteps: string[];
  codeExample: string;
  clientSetup: boolean;
}
```

### `get_database_schema_info`
**Description:** Get information about Better Auth database schema.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  tables: {
    user: { description: string; fields: string[] };
    session: { description: string; fields: string[] };
    account: { description: string; fields: string[] };
    verification: { description: string; fields: string[] };
  };
  setupSteps: string[];
  codeExample: string;
}
```

### `get_hooks_config`
**Description:** Get configuration for Better Auth hooks.

**Input Schema:** None

**Output:**
```typescript
{
  name: string;
  description: string;
  category: string;
  types: {
    before: string;
    after: string;
  };
  setupSteps: string[];
  codeExample: string;
  contextProperties: string[];
}
```

---

## Data Structures

### DOCUMENTATION_CATEGORIES
**Description:** Comprehensive mapping of Better Auth documentation organized by category.

**Structure:**
```typescript
{
  [categoryKey: string]: {
    name: string;
    description: string;
    urls: string[];
  }
}
```

**Categories:**
- `getting_started` - 4 URLs
- `adapters` - 9 URLs  
- `authentication_providers` - 23 URLs
- `concepts` - 11 URLs
- `examples` - 5 URLs
- `guides` - 6 URLs
- `integrations` - 14 URLs
- `plugins` - 31 URLs

### AUTH_PROVIDERS
**Description:** Complete configuration data for all 25+ authentication providers.

**Structure:**
```typescript
{
  [providerKey: string]: {
    name: string;
    description: string;
    category: "basic" | "social";
    config: object;
    setupSteps: string[];
    requiredEnvVars: string[];
  }
}
```

### DATABASE_ADAPTERS
**Description:** Configuration data for all 6 database adapters.

**Structure:**
```typescript
{
  [adapterKey: string]: {
    name: string;
    description: string;
    config: object;
    setupSteps: string[];
    requiredPackages: string[];
    migrationSupport: boolean;
  }
}
```

### PLUGINS
**Description:** Configuration data for all 12+ plugins.

**Structure:**
```typescript
{
  [pluginKey: string]: {
    name: string;
    description: string;
    category: string;
    config: object;
    setupSteps: string[];
    requiredPackages: string[];
    clientSetup?: boolean;
  }
}
```

---

## Usage Examples

### Complete Authentication Setup
```javascript
// 1. Get all available providers
const providers = await get_all_auth_providers();
console.log("Available providers:", providers.providers.map(p => p.key));

// 2. Get specific provider configuration
const googleConfig = await get_auth_provider_config({
  provider_name: "google"
});
console.log("Google setup steps:", googleConfig.setupSteps);

// 3. Generate complete configuration
const config = await generate_auth_config({
  providers: ["google", "github", "email_password"],
  adapter: "postgresql",
  plugins: ["magic_link", "two_factor", "email_otp"]
});
console.log("Generated config:", config.config);

// 4. Validate the setup
const validation = await validate_auth_setup({
  config: config.config
});
console.log("Recommendations:", validation.recommendations);
```

### MCP Integration Setup
```javascript
// 1. Get MCP plugin configuration
const mcpPlugin = await get_mcp_plugin_config();
console.log("MCP plugin setup:", mcpPlugin.setupSteps);

// 2. Get session handler configuration
const sessionHandler = await get_mcp_session_handler();
console.log("Session handler code:", sessionHandler.codeExample);

// 3. Get OAuth discovery metadata setup
const oauthMetadata = await get_oauth_discovery_metadata();
console.log("OAuth metadata route:", oauthMetadata.route);

// 4. Get MCP session API usage
const sessionApi = await get_mcp_session_api();
console.log("Session API method:", sessionApi.method);
```

### Database and Schema Setup
```javascript
// 1. Get all database adapters
const adapters = await get_all_database_adapters();
console.log("Available adapters:", adapters.adapters.map(a => a.key));

// 2. Get specific adapter configuration
const postgresConfig = await get_database_adapter_config({
  adapter_name: "postgresql"
});
console.log("PostgreSQL setup:", postgresConfig.setupSteps);

// 3. Get database schema information
const schema = await get_database_schema_info();
console.log("Database tables:", Object.keys(schema.tables));
```

### Plugin Configuration
```javascript
// 1. Get all available plugins
const plugins = await get_all_plugins();
console.log("Available plugins:", plugins.plugins.map(p => p.key));

// 2. Get specific plugin configurations
const magicLinkConfig = await get_plugin_config({
  plugin_name: "magic_link"
});
console.log("Magic Link setup:", magicLinkConfig.setupSteps);

const twoFactorConfig = await get_plugin_config({
  plugin_name: "two_factor"
});
console.log("2FA config:", twoFactorConfig.config);
```

---

## Error Handling

All tools implement comprehensive error handling with the following pattern:

```typescript
try {
  // Tool implementation
  return {
    content: [{
      type: "text",
      text: JSON.stringify(result, null, 2)
    }]
  };
} catch (error) {
  console.error("Error in tool_name:", error);
  throw new Error(`Failed to execute tool: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

**Common Error Types:**
- **Provider/Adapter/Plugin Not Found:** When requesting configuration for non-existent items
- **Configuration Validation Errors:** When validating invalid auth configurations
- **Network/Resource Errors:** When fetching documentation or external resources

**Error Response Format:**
```typescript
{
  error: string;
  message: string;
  details?: any;
}
```

---

## Environment Variables

### Required Environment Variables
```bash
# Core Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Database (choose one based on adapter)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
MYSQL_URL=mysql://user:pass@localhost:3306/db
MONGODB_URL=mongodb://localhost:27017/db

# OAuth Providers (as needed)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Email Service (for verification/reset emails)
EMAIL_SERVICE_CONFIG=your-email-service-config

# MCP Integration
REDIS_URL=redis://localhost:6379
```

### Optional Environment Variables
```bash
# Apple Sign-In
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Other providers...
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

---

## Installation and Setup

### Via Smithery (Recommended)
```bash
npx -y @smithery/cli install @dabhivijay2478/auth --client claude
```

### Manual Installation
```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Start the MCP server
npm start
```

### Configuration File (mcp.json)
```json
{
  "mcpServers": {
    "better-auth": {
      "command": "node",
      "args": ["path/to/auth/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

---

## Security Considerations

### Built-in Security Features
- **Rate Limiting** - Protection against brute force attacks
- **Secure Cookies** - Encrypted cookies with proper security attributes
- **CSRF Protection** - Trusted origins configuration
- **IP Address Validation** - Configurable IP header detection
- **CAPTCHA Support** - Integration with reCAPTCHA and other providers

### Best Practices
1. **Environment Variables** - Never hardcode secrets in configuration
2. **HTTPS Only** - Use secure connections in production
3. **Token Expiration** - Configure appropriate session and token lifetimes
4. **Database Security** - Use proper database credentials and connection security
5. **Email Verification** - Enable email verification for sensitive operations

---

## Contributing

This MCP server provides comprehensive tools for Better Auth integration. All providers, adapters, and plugins are based on the official Better Auth documentation and support the latest authentication standards.

### Development Setup
```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Database operations
npm run db:generate
npm run db:push
npm run db:migrate
```

---

## License

MIT License - see LICENSE file for details.