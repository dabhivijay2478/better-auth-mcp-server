# Better Auth MCP Server - Tools Summary

## Overview
This MCP server provides comprehensive tools for Better Auth documentation, authentication providers, database adapters, and plugins. All tools use NLP-friendly names for easy understanding.

## Available Tools

### 📚 Documentation Navigation Tools

#### `get_documentation_categories`
- **Purpose**: Get all available Better Auth documentation categories
- **Input**: None
- **Output**: List of categories with name, description, and URL count
- **Use Case**: Discover what documentation is available

#### `get_documentation_urls`
- **Purpose**: Get all documentation URLs for a specific category
- **Input**: `{ category: string }`
- **Output**: Category details and list of URLs
- **Use Case**: Browse documentation by category

#### `search_documentation`
- **Purpose**: Search for documentation pages by keyword
- **Input**: `{ query: string }`
- **Output**: Search results with relevance scores
- **Use Case**: Find specific documentation content

### 🔐 Authentication Provider Tools

#### `get_all_auth_providers`
- **Purpose**: Get all available authentication providers
- **Input**: None
- **Output**: List of all providers with categories
- **Use Case**: See all available authentication options

#### `get_auth_provider_details`
- **Purpose**: Get detailed configuration for a specific provider
- **Input**: `{ provider: string }`
- **Output**: Provider details, config, and documentation URL
- **Use Case**: Get setup information for a specific provider

#### `get_providers_by_category`
- **Purpose**: Get providers filtered by category (basic, social)
- **Input**: `{ category: string }`
- **Output**: Filtered list of providers
- **Use Case**: Find providers by type

#### `get_provider_setup_guide`
- **Purpose**: Get setup instructions for a specific provider
- **Input**: `{ provider: string }`
- **Output**: Setup steps and required credentials
- **Use Case**: Step-by-step provider setup

### 🗄️ Database Adapter Tools

#### `get_all_database_adapters`
- **Purpose**: Get all available database adapters
- **Input**: None
- **Output**: List of all adapters
- **Use Case**: See available database options

#### `get_database_adapter_details`
- **Purpose**: Get detailed configuration for a specific adapter
- **Input**: `{ adapter: string }`
- **Output**: Adapter details, config, and documentation URL
- **Use Case**: Get setup information for a specific database

### 🔧 Plugin Tools

#### `get_all_plugins`
- **Purpose**: Get all available Better Auth plugins
- **Input**: None
- **Output**: List of all plugins with categories
- **Use Case**: See all available plugins

#### `get_plugin_details`
- **Purpose**: Get detailed configuration for a specific plugin
- **Input**: `{ plugin: string }`
- **Output**: Plugin details, config, and documentation URL
- **Use Case**: Get setup information for a specific plugin

#### `get_plugins_by_category`
- **Purpose**: Get plugins filtered by category (security, business, basic)
- **Input**: `{ category: string }`
- **Output**: Filtered list of plugins
- **Use Case**: Find plugins by type

### ⚙️ Configuration Generation Tools

#### `generate_better_auth_config`
- **Purpose**: Generate complete Better Auth configuration
- **Input**: `{ providers: string[], adapter: string, plugins: string[], baseURL?: string }`
- **Output**: Generated config code and setup instructions
- **Use Case**: Create production-ready configuration

#### `validate_auth_setup`
- **Purpose**: Validate configuration and get recommendations
- **Input**: `{ providers: string[], adapter: string, plugins: string[] }`
- **Output**: Validation results with errors, warnings, and recommendations
- **Use Case**: Check configuration for issues

### 📖 Basic Tools (Backward Compatibility)

#### `fetch_list`
- **Purpose**: Get all Better Auth documentation URLs
- **Input**: None
- **Output**: Array of documentation URLs
- **Use Case**: Get all available documentation links

#### `fetch_page`
- **Purpose**: Fetch content from Better Auth documentation
- **Input**: `{ url: string }`
- **Output**: Page content
- **Use Case**: Read specific documentation pages

## Documentation Categories

### 📖 Getting Started
- Basic Usage, Comparison, Installation, Introduction

### 🗄️ Database Adapters
- PostgreSQL, MySQL, SQLite, MongoDB, Drizzle, Prisma, Community Adapters

### 🔐 Authentication Providers (25+)
- **Basic**: Email & Password
- **Social**: Google, GitHub, Facebook, Apple, Discord, Twitter, LinkedIn, Microsoft, Spotify, Slack, Twitch, TikTok, Notion, Linear, GitLab, Dropbox, Reddit, Roblox, VK, Zoom, Hugging Face, Kick

### 🧠 Core Concepts
- API, CLI, Client, Cookies, Database, Email, Hooks, OAuth, Plugins, Rate Limiting, Session Management, TypeScript, Users & Accounts

### 📚 Framework Examples
- Astro, Next.js, Nuxt, Remix, SvelteKit

### 📖 Guides and Tutorials
- Browser Extension Guide, Clerk Migration, Create DB Adapter, NextAuth Migration, Performance Optimization, Supabase Migration, Your First Plugin

### 🔗 Framework Integrations
- Astro, Elysia, Expo, Express, Fastify, Hono, NestJS, Next.js, Nitro, Nuxt, Remix, SolidStart, SvelteKit, TanStack

### 🔧 Authentication Plugins (30+)
- **Security**: Magic Link, Passkey, Email OTP, Two-Factor, CAPTCHA, JWT
- **Business**: Organization, SSO, Stripe
- **Basic**: Username, Anonymous, API Key, Bearer Token
- **Advanced**: Generic OAuth, OAuth Proxy, OIDC Provider, One Tap, One-Time Token, Open API, Phone Number, Polar, SIWE

## Usage Examples

### Get All Documentation Categories
```javascript
const categories = await get_documentation_categories();
console.log(categories.categories);
```

### Search for Authentication Documentation
```javascript
const results = await search_documentation({ query: "authentication" });
console.log(results.results);
```

### Get All Social Authentication Providers
```javascript
const socialProviders = await get_providers_by_category({ category: "social" });
console.log(socialProviders.providers);
```

### Generate Configuration for Google + GitHub + PostgreSQL
```javascript
const config = await generate_better_auth_config({
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

## Tool Categories Summary

- **📚 Documentation**: 3 tools for browsing and searching docs
- **🔐 Authentication**: 4 tools for provider management
- **🗄️ Database**: 2 tools for adapter management  
- **🔧 Plugins**: 3 tools for plugin management
- **⚙️ Configuration**: 2 tools for setup and validation
- **📖 Basic**: 2 tools for backward compatibility

**Total: 16 comprehensive tools** covering all aspects of Better Auth integration. 