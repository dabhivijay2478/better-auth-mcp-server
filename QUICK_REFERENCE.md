# Better Auth MCP Server - Quick Reference Guide

## 🚀 Available Tools (20+)

### 📚 Documentation Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_documentation_categories` | Get all doc categories | None | List of 8 categories |
| `get_documentation_urls` | Get URLs for category | `category: string` | URLs array |

### 🔐 Authentication Provider Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_all_auth_providers` | List all 25+ providers | None | Provider list |
| `get_auth_provider_config` | Get provider config | `provider_name: string` | Full config + setup |

### 🗄️ Database Adapter Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_all_database_adapters` | List all 6 adapters | None | Adapter list |
| `get_database_adapter_config` | Get adapter config | `adapter_name: string` | Full config + setup |

### 🔌 Plugin Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_all_plugins` | List all 12+ plugins | None | Plugin list |
| `get_plugin_config` | Get plugin config | `plugin_name: string` | Full config + setup |

### ⚙️ Configuration Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `generate_auth_config` | Generate complete config | `providers[]`, `adapter`, `plugins[]` | Full auth config code |
| `validate_auth_setup` | Validate configuration | `config: string` | Validation results |

### 🔐 Security Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_email_verification_config` | Email verification setup | None | Config + code |
| `get_password_reset_config` | Password reset setup | None | Config + code |
| `get_session_management_config` | Session config | None | Config + code |

### 🔗 MCP Integration Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_mcp_plugin_config` | MCP plugin setup | None | MCP config + code |
| `get_mcp_session_handler` | Session handler setup | None | Handler code |
| `get_oauth_discovery_metadata` | OAuth metadata route | None | Route config |
| `get_mcp_session_api` | Session API usage | None | API usage code |

### 🔧 Additional Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_multi_session_plugin_config` | Multi-session setup | None | Plugin config |
| `get_database_schema_info` | DB schema info | None | Schema details |
| `get_hooks_config` | Hooks configuration | None | Hook setup |

---

## 🎯 Quick Start Examples

### 1. List All Available Options
```javascript
// Get everything available
const providers = await get_all_auth_providers();
const adapters = await get_all_database_adapters();
const plugins = await get_all_plugins();

console.log("Providers:", providers.providers.map(p => p.key));
console.log("Adapters:", adapters.adapters.map(a => a.key));
console.log("Plugins:", plugins.plugins.map(p => p.key));
```

### 2. Generate Complete Auth Setup
```javascript
// Generate full configuration
const config = await generate_auth_config({
  providers: ["google", "github", "email_password"],
  adapter: "postgresql",
  plugins: ["magic_link", "two_factor", "email_otp"]
});

console.log(config.config); // Ready-to-use auth configuration
```

### 3. Get Specific Provider Setup
```javascript
// Get Google OAuth setup
const googleConfig = await get_auth_provider_config({
  provider_name: "google"
});

console.log("Setup steps:", googleConfig.setupSteps);
console.log("Required env vars:", googleConfig.requiredEnvVars);
```

### 4. MCP Integration Setup
```javascript
// Get MCP plugin configuration
const mcpConfig = await get_mcp_plugin_config();
console.log("MCP setup:", mcpConfig.setupSteps);

// Get session handler
const sessionHandler = await get_mcp_session_handler();
console.log("Handler code:", sessionHandler.codeExample);
```

---

## 📋 Available Providers (25+)

### Basic Authentication
- `email_password` - Traditional email/password

### Social OAuth Providers
- `google` - Google OAuth 2.0
- `github` - GitHub OAuth
- `facebook` - Facebook OAuth
- `apple` - Apple Sign-In
- `discord` - Discord OAuth
- `twitter` - Twitter OAuth
- `linkedin` - LinkedIn OAuth
- `microsoft` - Microsoft OAuth
- `spotify` - Spotify OAuth
- `slack` - Slack OAuth
- `twitch` - Twitch OAuth
- `tiktok` - TikTok OAuth
- `notion` - Notion OAuth
- `linear` - Linear OAuth
- `gitlab` - GitLab OAuth
- `dropbox` - Dropbox OAuth
- `reddit` - Reddit OAuth
- `roblox` - Roblox OAuth
- `vk` - VK OAuth
- `zoom` - Zoom OAuth
- `huggingface` - Hugging Face OAuth
- `kick` - Kick OAuth

---

## 🗄️ Database Adapters (6)

- `postgresql` - PostgreSQL adapter
- `mysql` - MySQL adapter
- `sqlite` - SQLite adapter
- `mongodb` - MongoDB adapter
- `drizzle` - Drizzle ORM adapter
- `prisma` - Prisma ORM adapter

---

## 🔌 Plugins (12+)

### Security Plugins
- `magic_link` - Passwordless authentication
- `passkey` - WebAuthn/FIDO2 authentication
- `email_otp` - Email one-time passwords
- `two_factor` - TOTP-based 2FA
- `captcha` - CAPTCHA protection

### Session Plugins
- `jwt` - JSON Web Token support
- `multi_session` - Multiple active sessions

### Organization Plugins
- `organization` - Multi-tenant support
- `sso` - Single Sign-On integration

### Integration Plugins
- `stripe` - Stripe payment integration
- `mcp` - MCP provider plugin
- `username` - Username-based auth

---

## 🔧 Environment Variables Cheat Sheet

### Core Variables (Required)
```bash
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### Database (Choose One)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/db
MYSQL_URL=mysql://user:pass@localhost:3306/db
MONGODB_URL=mongodb://localhost:27017/db
```

### OAuth Providers (As Needed)
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### MCP Integration
```bash
REDIS_URL=redis://localhost:6379
```

---

## 🚀 Installation Commands

### Via Smithery (Recommended)
```bash
npx -y @smithery/cli install @dabhivijay2478/auth --client claude
```

### Manual Setup
```bash
npm install
npm run build
npm start
```

### Database Setup
```bash
npx @better-auth/cli generate  # Generate schema
npx @better-auth/cli migrate   # Apply migrations
```

---

## 📖 Documentation Categories

1. **getting_started** - Basic setup (4 URLs)
2. **adapters** - Database adapters (9 URLs)
3. **authentication_providers** - Auth providers (23 URLs)
4. **concepts** - Core concepts (11 URLs)
5. **examples** - Framework examples (5 URLs)
6. **guides** - Tutorials (6 URLs)
7. **integrations** - Framework integrations (14 URLs)
8. **plugins** - Plugin documentation (31 URLs)

---

## 🔍 Common Use Cases

### Case 1: Simple Email + Google Auth
```javascript
const config = await generate_auth_config({
  providers: ["email_password", "google"],
  adapter: "sqlite",
  plugins: ["magic_link"]
});
```

### Case 2: Enterprise Setup
```javascript
const config = await generate_auth_config({
  providers: ["email_password", "microsoft", "google"],
  adapter: "postgresql",
  plugins: ["two_factor", "organization", "sso"]
});
```

### Case 3: Social Media App
```javascript
const config = await generate_auth_config({
  providers: ["discord", "twitter", "github"],
  adapter: "mongodb",
  plugins: ["username", "multi_session"]
});
```

### Case 4: MCP Provider App
```javascript
const config = await generate_auth_config({
  providers: ["email_password", "google"],
  adapter: "postgresql",
  plugins: ["mcp", "jwt"]
});
```

---

## 🛠️ Development Commands

```bash
npm run dev        # Development with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run db:generate # Generate database schema
npm run db:push    # Push schema changes
npm run db:migrate # Run migrations
npm run db:studio  # Open database studio
npm run db:reset   # Reset database
```

---

## 📞 Support

- **Documentation:** See `API_DOCUMENTATION.md` for detailed API reference
- **Repository:** Check the source code in `src/index.ts`
- **Issues:** Report issues through the project repository
- **License:** MIT License