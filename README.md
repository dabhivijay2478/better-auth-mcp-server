# Better Auth MCP Server

[![smithery badge](https://smithery.ai/badge/@dabhivijay2478/auth)](https://smithery.ai/server/@dabhivijay2478/auth)

A comprehensive Model Context Protocol (MCP) server that provides tools and documentation for Better Auth authentication framework. This server offers complete access to Better Auth configurations, setup guides, and implementation examples for all authentication providers, database adapters, and plugins.

## 🚀 Features

### 📚 Complete Documentation Access
- **Organized Categories** - Getting Started, Core Concepts, Authentication, Adapters, Plugins, Integrations, Guides, Examples
- **Searchable Content** - Find specific documentation by keywords
- **Framework Examples** - Real implementation examples for 10+ frameworks

### 🔐 Authentication Providers
- **Email & Password** - Traditional authentication with verification and password reset
- **Apple Sign-In** - Apple OAuth with OpenID Connect
- **Microsoft OAuth** - Azure Entra ID integration
- **Facebook OAuth** - Facebook authentication with permissions
- **GitHub OAuth** - GitHub OAuth with email scope
- **Google OAuth** - Google OAuth 2.0 with refresh tokens
- **Extensible** - Easy to add more providers

### 🗄️ Database Adapters
- **PostgreSQL** - With connection pooling and performance optimization
- **MySQL** - Enterprise-grade MySQL support with connection pooling
- **SQLite** - Perfect for development with better-sqlite3
- **MongoDB** - NoSQL document database support
- **Drizzle ORM** - Type-safe database queries and migrations
- **Prisma ORM** - Auto-generated client with schema management

### 🔧 Authentication Plugins
- **Security Plugins** - Email OTP, Magic Link, Two-Factor, Passkey, Phone Number
- **User Management** - Username, Anonymous authentication
- **Enterprise Features** - Organization management, Admin panel, Multi-session
- **Social Integration** - One Tap, Generic OAuth
- **API Authentication** - Bearer Token, API Key support

### ⚙️ Advanced Tools
- **Configuration Generation** - Generate complete, production-ready configurations
- **Setup Validation** - Validate configurations with detailed recommendations
- **Framework Integration** - Step-by-step guides for popular frameworks
- **Migration Assistance** - Migrate from NextAuth, Clerk, Supabase
- **MCP Integration** - Specialized tools for MCP protocol support

## 📦 Installation

### Via Smithery (Recommended)

```bash
npx -y @smithery/cli install @dabhivijay2478/auth --client claude
```

### Manual Installation

1. Clone and build:
```bash
git clone <repository-url>
cd better-auth-mcp-server
npm install
npm run build
```

2. Configure Claude Desktop (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "better-auth": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 🛠️ Available Tools

### 📚 Documentation Navigation

#### `get_documentation_categories`
Get all available Better Auth documentation categories.

**Returns:** Categories with names, descriptions, and URL counts
```javascript
{
  "categories": ["getting-started", "concepts", "authentication", ...],
  "details": {
    "getting-started": {
      "name": "Getting Started",
      "urls": ["/docs/introduction", "/docs/installation", ...]
    }
  }
}
```

#### `get_documentation_urls`
Get all documentation URLs for a specific category.

**Input:** `{ category: string }`
**Returns:** Category details and complete URL list

#### `search_documentation`
Search documentation by keywords (simulated - searches category names and descriptions).

**Input:** `{ query: string }`

### 🔐 Authentication Provider Management

#### `get_all_auth_providers`
Get all available authentication providers with categorization.

**Returns:**
```javascript
{
  "providers": ["email-password", "apple", "microsoft", "facebook", "github", "google"],
  "categories": {
    "basic": ["email-password"],
    "social": ["apple", "microsoft", "facebook", "github", "google"]
  },
  "total": 6
}
```

#### `get_auth_provider_config`
Get detailed configuration for a specific authentication provider.

**Input:** `{ provider_name: string }`
**Returns:** Complete provider configuration including:
- Setup steps and instructions
- Required environment variables
- Code implementation examples
- Configuration options
- Documentation URLs

**Example:**
```javascript
const config = await get_auth_provider_config({ provider_name: "google" });
// Returns detailed Google OAuth setup with step-by-step instructions
```

### 🗄️ Database Adapter Management

#### `get_all_database_adapters`
Get all available database adapters.

**Returns:**
```javascript
{
  "adapters": ["postgresql", "mysql", "sqlite", "drizzle", "prisma", "mongodb"],
  "withMigrationSupport": ["postgresql", "mysql", "sqlite", "drizzle"],
  "total": 6
}
```

#### `get_database_adapter_config`
Get detailed configuration for a specific database adapter.

**Input:** `{ adapter_name: string }`
**Returns:** Complete adapter setup including:
- Connection configuration
- Required packages
- Setup instructions
- Migration support info
- Code examples

### 🔧 Plugin Management

#### `get_all_plugins`
Get all available Better Auth plugins organized by category.

**Returns:**
```javascript
{
  "plugins": ["email-otp", "magic-link", "two-factor", ...],
  "categories": {
    "security": ["email-otp", "magic-link", "two-factor", "passkey"],
    "basic": ["username", "phone-number", "anonymous"],
    "enterprise": ["organization", "admin", "multi-session"],
    "social": ["one-tap", "generic-oauth"],
    "session": ["multi-session"],
    "api": ["bearer-token"]
  },
  "withClientSetup": ["email-otp", "magic-link", "two-factor", ...],
  "total": 14
}
```

#### `get_plugin_config`
Get detailed configuration for a specific plugin.

**Input:** `{ plugin_name: string }`
**Returns:** Complete plugin setup including:
- Configuration options
- Setup steps
- Code examples
- Client-side setup requirements
- Required packages

### ⚙️ Configuration Generation

#### `generate_auth_config`
Generate complete Better Auth configuration with validation.

**Input:**
```typescript
{
  providers: string[],    // e.g., ["google", "github", "email-password"]
  adapter: string,        // e.g., "postgresql"
  plugins: string[],      // e.g., ["magic-link", "two-factor"]
  framework?: string      // e.g., "nextjs"
}
```

**Returns:** Complete configuration including:
- Server-side auth configuration
- Client-side configuration (if framework specified)
- Framework-specific handler code
- Required packages list
- Environment variables
- Setup instructions

**Example:**
```javascript
const config = await generate_auth_config({
  providers: ["google", "github", "email-password"],
  adapter: "postgresql",
  plugins: ["magic-link", "two-factor"],
  framework: "nextjs"
});

console.log(config.serverConfig);     // Complete auth.ts file
console.log(config.clientConfig);     // Client configuration
console.log(config.frameworkHandler); // Next.js API route
console.log(config.requiredEnvVars);  // All env vars needed
```

#### `validate_auth_setup`
Validate Better Auth configuration and get recommendations.

**Input:** `{ config: string, framework?: string }`
**Returns:**
```javascript
{
  "valid": boolean,
  "errors": string[],           // Critical issues
  "warnings": string[],         // Potential problems
  "recommendations": string[]   // Best practices
}
```

### 🖥️ Framework Integration

#### `get_framework_integration`
Get integration guide for specific frameworks.

**Input:** `{ framework: string }`
**Supports:** nextjs, nuxt, astro, sveltekit, remix, express, fastify, expo, tanstack

**Returns:** Framework-specific setup including:
- Step-by-step integration guide
- Code examples
- Configuration requirements
- Supported features

### 🔧 Advanced Configuration Tools

#### `get_mcp_plugin_config`
Get MCP plugin configuration for Better Auth OAuth integration.

#### `get_mcp_session_handler`
Get configuration for `withMcpAuth` session handling.

#### `get_oauth_discovery_metadata`
Get OAuth discovery metadata route configuration.

#### `get_mcp_session_api`
Get configuration for `auth.api.getMcpSession` usage.

#### `get_multi_session_plugin_config`
Get detailed multi-session plugin configuration.

#### `get_email_verification_config`
Get email verification setup and configuration.

#### `get_password_reset_config`
Get password reset functionality configuration.

#### `get_session_management_config`
Get session management and security configuration.

#### `get_database_schema_info`
Get database schema information and customization options.

#### `get_hooks_config`
Get hooks and middleware configuration for customizing auth behavior.

### 📖 Migration & Setup Tools

#### `get_migration_guide`
Get migration guides from other authentication solutions.

**Input:** `{ from_solution: string }`
**Supports:** nextauth, clerk, supabase

**Returns:** Step-by-step migration guide including:
- Schema mapping
- Code changes required
- Migration scripts
- Considerations and gotchas

#### `get_quick_start_guide`
Get customized quick start guide for your stack.

**Input:**
```typescript
{
  framework?: string,        // Default: "nextjs"
  database?: string,         // Default: "postgresql"
  auth_methods?: string[]    // Default: ["email-password", "google"]
}
```

**Returns:** Complete quick start guide including:
- Installation steps
- Environment setup
- Configuration files
- Testing instructions
- Troubleshooting tips

## 💡 Usage Examples

### Complete Setup Generation
```javascript
// Generate production-ready configuration
const setup = await generate_auth_config({
  providers: ["email-password", "google", "github"],
  adapter: "postgresql",
  plugins: ["magic-link", "two-factor", "organization"],
  framework: "nextjs"
});

// Get the generated configurations
console.log("Server Config:", setup.serverConfig);
console.log("Client Config:", setup.clientConfig);
console.log("Framework Handler:", setup.frameworkHandler);
console.log("Required Packages:", setup.requiredPackages);
console.log("Environment Variables:", setup.requiredEnvVars);
```

### Provider Configuration
```javascript
// Get detailed Google OAuth setup
const googleSetup = await get_auth_provider_config({ 
  provider_name: "google" 
});

console.log("Setup Steps:", googleSetup.setupSteps);
console.log("Environment Variables:", googleSetup.requiredEnvVars);
console.log("Implementation:", googleSetup.codeExample);
```

### Database Setup
```javascript
// Get PostgreSQL adapter configuration
const dbSetup = await get_database_adapter_config({ 
  adapter_name: "postgresql" 
});

console.log("Required Packages:", dbSetup.requiredPackages);
console.log("Setup Steps:", dbSetup.setupSteps);
console.log("Migration Support:", dbSetup.migrationSupport);
```

### Configuration Validation
```javascript
const validation = await validate_auth_setup({
  config: `
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
  `,
  framework: "nextjs"
});

console.log("Validation Results:", validation);
```

## 🏗️ Technical Implementation

### Architecture
- **TypeScript** - Fully typed implementation
- **MCP SDK** - Built on Model Context Protocol
- **Zod Validation** - Runtime type checking
- **Comprehensive Data** - Detailed configuration objects for all Better Auth features

### Data Structures
The server maintains comprehensive configuration data for:
- **30+ Documentation Categories** with organized URLs
- **6 Authentication Providers** with complete setup instructions
- **6 Database Adapters** with connection examples
- **14 Plugins** with configuration options
- **10+ Framework Integrations** with code examples

### Key Features
- **Input Validation** - All tools use Zod schemas for type safety
- **Error Handling** - Comprehensive error messages and recovery
- **Code Generation** - Production-ready configuration generation
- **Best Practices** - Built-in security and performance recommendations

## 🔒 Security Features Covered

- **Rate Limiting** - Built-in protection configuration
- **CSRF Protection** - Cross-site request forgery prevention
- **Secure Cookies** - HTTP-only, encrypted cookie setup
- **Session Security** - Automatic rotation and validation
- **Two-Factor Authentication** - TOTP and backup codes
- **Passkey Support** - WebAuthn/FIDO2 implementation
- **Email Verification** - Token-based email validation
- **Password Security** - Hashing and strength requirements

## 📖 Supported Documentation

### Core Categories
- **Getting Started** - Introduction, Installation, Basic Usage, Comparison
- **Core Concepts** - API, CLI, Client, Cookies, Database, Email, Hooks, OAuth, Plugins, Rate Limiting, Session Management, TypeScript, Users & Accounts
- **Authentication Methods** - Email/Password and all social providers
- **Database Adapters** - All supported databases with setup guides
- **Plugins** - Security, business, and utility plugins
- **Framework Integrations** - Complete integration guides
- **Migration Guides** - From other authentication solutions
- **Examples** - Real-world implementation examples

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Build TypeScript: `npm run build`
4. Update configurations in `src/index.ts`

### Adding New Features
When Better Auth adds new features:
1. Update the corresponding data structures (AUTH_PROVIDERS, DATABASE_ADAPTERS, PLUGINS)
2. Add new tools if needed
3. Update documentation mappings
4. Test all functionality

## 📝 Version Information

- **Server Name:** `better-auth-comprehensive`
- **Current Version:** `5.0.0`
- **MCP Protocol:** Latest compatible version
- **TypeScript:** ES2022 target with full type safety

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [Better Auth Documentation](https://better-auth.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Smithery Package](https://smithery.ai/server/@dabhivijay2478/auth)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---
