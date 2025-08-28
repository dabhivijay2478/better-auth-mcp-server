

````markdown
# Better Auth MCP Server

[![smithery badge](https://smithery.ai/badge/@dabhivijay2478/auth)](https://smithery.ai/server/@dabhivijay2478/auth)

A modern **Model Context Protocol (MCP) server** for the [Better Auth](https://better-auth.com/docs) authentication framework.  
This server provides **developer-friendly tools, searchable documentation, ready-to-use integrations, and configuration generators** for authentication providers, database adapters, and plugins.

---

## ✨ Highlights

- 📚 **Full Documentation Access** – categorized, searchable, and framework-specific examples  
- 🔐 **Authentication Providers** – Email/Password, Google, GitHub, Apple, Microsoft, Facebook, and more  
- 🗄️ **Database Adapters** – PostgreSQL, MySQL, SQLite, MongoDB, Prisma, Drizzle  
- 🔧 **Plugins & Extensions** – OTP, Magic Link, 2FA, Passkey, Organization Management, API Tokens  
- ⚙️ **Smart Tools** – Config generation, validation, migration guides, and framework integration  
- 🔒 **Security Built-in** – CSRF protection, secure cookies, rate limiting, WebAuthn/Passkeys, 2FA  

---

## 🚀 Quick Start

### Install via Smithery (Recommended)

```bash
npx -y @smithery/cli install @dabhivijay2478/auth --client claude
````

### Manual Setup

```bash
git clone <repository-url>
cd better-auth-mcp-server
npm install
npm run build
```

Update `claude_desktop_config.json`:

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

---

## 🛠️ Core Tools

### Documentation

* `list_better_auth_features` – List all available features and plugins
* `get_feature_details` – Get details for a specific feature or plugin
* `search_better_auth` – Search Better Auth documentation

### Integrations

* `get_integration_guide` – Framework-specific setup (Next.js, Nuxt, Remix, SvelteKit, Expo, etc.)
* `get_auth_examples` – Code snippets and usage examples

### Advanced Context

* `target_llms_context` – Access **Better Auth LLMs.txt** for comprehensive context

---

## 📦 Usage Examples

### 1. Generate a Complete Auth Config

```javascript
const setup = await generate_auth_config({
  providers: ["email-password", "google", "github"],
  adapter: "postgresql",
  plugins: ["magic-link", "two-factor"],
  framework: "nextjs"
});

console.log(setup.serverConfig);
```

### 2. Get Provider Config

```javascript
const google = await get_auth_provider_config({ provider_name: "google" });
console.log(google.setupSteps);
```

### 3. Validate Config

```javascript
const validation = await validate_auth_setup({
  config: "your auth.ts config here",
  framework: "nextjs"
});
console.log(validation);
```

---

## 🔐 Security Features

* **CSRF Protection** – Safe request handling
* **Session Security** – Rotation, expiration, validation
* **Passkeys & WebAuthn** – FIDO2 support
* **Two-Factor Auth** – TOTP, backup codes
* **Rate Limiting** – Prevent abuse
* **Password Security** – Strong hashing and validation

---

## 🏗️ Architecture

* **Language:** TypeScript (ES2022 target)
* **Validation:** Zod schemas
* **Protocol:** Model Context Protocol (MCP)
* **Code Generation:** Production-ready configs and migration scripts
* **Error Handling:** Detailed and recoverable

---

## 🤝 Contributing

1. Clone repo
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Update `src/index.ts` with new features

When Better Auth adds features:

* Extend **AUTH\_PROVIDERS**, **DATABASE\_ADAPTERS**, **PLUGINS**
* Add documentation mappings
* Write tool handlers
* Test thoroughly

---

## 📄 License

MIT License – see LICENSE file

---

## 🔗 Resources

* [Better Auth Docs](https://better-auth.com/docs)
* [Smithery Package](https://smithery.ai/server/@dabhivijay2478/auth)
* [MCP Protocol](https://modelcontextprotocol.io/)
* [TypeScript Docs](https://www.typescriptlang.org/)

---

```

Recommendation: Use consistent headings, short bullet lists, and example blocks for clarity.  
Next step: Add project logo and badges (npm, version, build status) for a more polished README.
```
