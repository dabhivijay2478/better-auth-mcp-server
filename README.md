# Better Auth MCP Server
[![smithery badge](https://smithery.ai/badge/@dabhivijay2478/auth)](https://smithery.ai/server/@dabhivijay2478/auth)

A comprehensive Model Context Protocol (MCP) server that provides tools for all Better Auth authentication providers, database adapters, and plugins.

## Features

### Authentication Providers (25+)
- **Email & Password** - Traditional email/password authentication
- **Google OAuth** - Google OAuth 2.0 authentication
- **GitHub OAuth** - GitHub OAuth authentication
- **Facebook OAuth** - Facebook OAuth authentication
- **Apple Sign-In** - Apple Sign-In authentication
- **Discord OAuth** - Discord OAuth authentication
- **Twitter OAuth** - Twitter OAuth authentication
- **LinkedIn OAuth** - LinkedIn OAuth authentication
- **Microsoft OAuth** - Microsoft OAuth authentication
- **Spotify OAuth** - Spotify OAuth authentication
- **Slack OAuth** - Slack OAuth authentication
- **Twitch OAuth** - Twitch OAuth authentication
- **TikTok OAuth** - TikTok OAuth authentication
- **Notion OAuth** - Notion OAuth authentication
- **Linear OAuth** - Linear OAuth authentication
- **GitLab OAuth** - GitLab OAuth authentication
- **Dropbox OAuth** - Dropbox OAuth authentication
- **Reddit OAuth** - Reddit OAuth authentication
- **Roblox OAuth** - Roblox OAuth authentication
- **VK OAuth** - VK OAuth authentication
- **Zoom OAuth** - Zoom OAuth authentication
- **Hugging Face OAuth** - Hugging Face OAuth authentication
- **Kick OAuth** - Kick OAuth authentication

### Database Adapters (6)
- **PostgreSQL** - PostgreSQL database adapter
- **MySQL** - MySQL database adapter
- **SQLite** - SQLite database adapter
- **MongoDB** - MongoDB database adapter
- **Drizzle ORM** - Drizzle ORM adapter
- **Prisma ORM** - Prisma ORM adapter

### Plugins (12)
- **Magic Link** - Passwordless authentication via email links
- **Passkey** - WebAuthn/FIDO2 passkey authentication
- **Email OTP** - One-time password via email
- **Username** - Username-based authentication
- **Two-Factor Authentication** - TOTP-based 2FA
- **CAPTCHA** - CAPTCHA protection
- **JWT** - JSON Web Token support
- **Organization** - Multi-tenant organization support
- **Single Sign-On** - SSO integration
- **Stripe** - Stripe payment integration

## Available Tools

### Basic Tools

#### `fetch_list`
Returns an array of URLs listed in better-auth.txt documentation.

**Input:** None
**Output:** `{ urls: string[] }`

#### `fetch_page`
Fetch content from allowed better-auth.com URL.

**Input:** `{ url: string }`
**Output:** `{ url: string, content: string }`

### Authentication Provider Tools

#### `get_auth_providers`
Returns a list of all available Better Auth authentication providers with their configurations.

**Input:** None
**Output:** `{ providers: Array<{ key: string, name: string, description: string, config: object }> }`

#### `get_auth_provider_config`
Get configuration for a specific authentication provider.

**Input:** `{ provider: string }`
**Output:** `{ provider: string, name: string, description: string, config: object }`

### Database Adapter Tools

#### `get_database_adapters`
Returns a list of all available Better Auth database adapters.

**Input:** None
**Output:** `{ adapters: Array<{ key: string, name: string, description: string, config: object }> }`

#### `get_database_adapter_config`
Get configuration for a specific database adapter.

**Input:** `{ adapter: string }`
**Output:** `{ adapter: string, name: string, description: string, config: object }`

### Plugin Tools

#### `get_plugins`
Returns a list of all available Better Auth plugins.

**Input:** None
**Output:** `{ plugins: Array<{ key: string, name: string, description: string, config: object }> }`

#### `get_plugin_config`
Get configuration for a specific plugin.

**Input:** `{ plugin: string }`
**Output:** `{ plugin: string, name: string, description: string, config: object }`

### Configuration Generation Tools

#### `generate_auth_config`
Generate a complete Better Auth configuration with specified providers, adapters, and plugins.

**Input:** `{ providers: string[], adapter: string, plugins: string[], baseURL?: string }`
**Output:** `{ config: string, providers: string[], adapter: string, plugins: string[] }`

#### `validate_auth_setup`
Validate a Better Auth configuration and provide recommendations.

**Input:** `{ providers: string[], adapter: string, plugins: string[] }`
**Output:** `{ valid: boolean, errors: string[], warnings: string[], recommendations: string[] }`

### Documentation Tools

#### `get_provider_documentation`
Get documentation URL and setup instructions for a specific provider.

**Input:** `{ provider: string }`
**Output:** `{ provider: string, name: string, docUrl: string, setupSteps: string[] }`

## Usage Examples

### Get All Available Providers
```javascript
// Returns all 25+ authentication providers
const result = await get_auth_providers();
console.log(result.providers);
```

### Generate Configuration for Google + GitHub + PostgreSQL
```javascript
const config = await generate_auth_config({
  providers: ["google", "github", "email_password"],
  adapter: "postgresql",
  plugins: ["magic_link", "two_factor"],
  baseURL: "https://myapp.com"
});
console.log(config.config);
```

### Validate Setup
```javascript
const validation = await validate_auth_setup({
  providers: ["google", "github"],
  adapter: "postgresql",
  plugins: ["magic_link"]
});
console.log(validation.recommendations);
```

### Get Provider Documentation
```javascript
const docs = await get_provider_documentation({
  provider: "google"
});
console.log(docs.setupSteps);
```

## Installation

### Installing via Smithery

To install auth for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@dabhivijay2478/auth):

```bash
npx -y @smithery/cli install @dabhivijay2478/auth --client claude
```

### Installing Manually
1. Install dependencies:
```bash
npm install
```

2. Start the MCP server:
```bash
node index.js
```

## Configuration

The server is configured via `mcp.json`:

```json
{
  "mcpServers": {
    "better-auth": {
      "command": "node",
      "args": ["E:\\project\\auth\\index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Supported Providers

### Social OAuth Providers
- Google, GitHub, Facebook, Apple, Discord, Twitter
- LinkedIn, Microsoft, Spotify, Slack, Twitch
- TikTok, Notion, Linear, GitLab, Dropbox
- Reddit, Roblox, VK, Zoom, Hugging Face, Kick

### Database Adapters
- PostgreSQL, MySQL, SQLite, MongoDB
- Drizzle ORM, Prisma ORM

### Security Plugins
- Magic Link, Passkey, Email OTP
- Two-Factor Authentication, CAPTCHA
- JWT, Organization, SSO, Stripe

## Security Features

- **Rate Limiting** - Built-in protection against brute force attacks
- **Secure Cookies** - Encrypted cookies with proper security attributes
- **CSRF Protection** - Trusted origins configuration
- **IP Address Validation** - Configurable IP header detection
- **CAPTCHA Support** - Integration with reCAPTCHA and other providers

## Contributing

This MCP server provides comprehensive tools for Better Auth integration. All providers, adapters, and plugins are based on the official Better Auth documentation and support the latest authentication standards.

## License

MIT License - see LICENSE file for details. 
