#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Better Auth LLM Documentation Content
const BETTER_AUTH_DOCS = {
  "basic-usage": {
    title: "Basic Usage",
    url: "/docs/basic-usage",
    content: `Getting started with Better Auth. Provides built-in authentication support for:
    - Email and password
    - Social providers (Google, GitHub, Apple, and more)
    
    Can be easily extended using plugins: username, magic link, passkey, email-otp, and more.`,
    examples: {
      emailPassword: `import { betterAuth } from "better-auth"

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    }
})`,
      signUp: `import { authClient } from "@/lib/auth-client";

const { data, error } = await authClient.signUp.email({
    email, 
    password, 
    name, 
    image, // optional
    callbackURL: "/dashboard" // optional
});`,
      signIn: `const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard",
    rememberMe: false
});`,
      socialSignIn: `await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard", 
    errorCallbackURL: "/error",
    newUserCallbackURL: "/welcome"
});`
    }
  },
  "installation": {
    title: "Installation",
    url: "/docs/installation", 
    content: `Learn how to configure Better Auth in your project with step-by-step setup instructions.`,
    steps: [
      "Install the package: npm install better-auth",
      "Set environment variables (BETTER_AUTH_SECRET, BETTER_AUTH_URL)",
      "Create Better Auth instance in auth.ts",
      "Configure database (SQLite, PostgreSQL, MySQL, etc.)",
      "Create database tables using CLI",
      "Configure authentication methods",
      "Mount handler for API requests",
      "Create client instance for your framework"
    ]
  },
  "plugins": {
    title: "Plugin System",
    content: `Better Auth has an extensive plugin ecosystem for advanced functionality:
    - Two-Factor Authentication (2FA)
    - Magic Link
    - Passkeys
    - Username authentication
    - Email OTP
    - Organization/Multi-tenancy
    - Rate limiting
    - And much more...`,
    example: `import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
    plugins: [
        twoFactor()
    ]
})`
  },
  "database": {
    title: "Database Configuration",
    content: `Better Auth supports multiple database systems and ORMs:
    - SQLite, PostgreSQL, MySQL, MS SQL
    - Prisma, Drizzle ORM, MongoDB adapters
    - Custom table names and schema extensions
    - Database hooks and secondary storage`,
    coreSchema: [
      "user - stores user information", 
      "session - manages user sessions",
      "account - handles OAuth and credential accounts",
      "verification - email/phone verification tokens"
    ]
  },
  "client": {
    title: "Client Libraries", 
    content: `Framework-specific client libraries for React, Vue, Svelte, Solid, and vanilla JS.
    Provides consistent API across all frameworks with hooks for reactive data.`,
    frameworks: ["React", "Vue", "Svelte", "Solid", "Vanilla JS"],
    example: `import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})`
  },
  "security": {
    title: "Security Features",
    content: `Built-in security features include:
    - CSRF protection
    - Rate limiting
    - Secure cookie handling
    - Password hashing (Argon2, bcrypt, scrypt)
    - Session management
    - Cross-subdomain cookie support`,
  },
  "oauth": {
    title: "OAuth Integration",
    content: `Built-in support for OAuth 2.0 and OpenID Connect with popular providers:
    - Google, GitHub, Apple, Discord, Microsoft
    - Custom OAuth providers via Generic OAuth plugin
    - Automatic profile mapping and account linking`,
    example: `export const auth = betterAuth({
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    }
})`
  }
};

// Helper function to convert Zod schema to JSON schema format
function zodToJsonSchema(zodSchema: z.ZodObject<any>): { type: "object", properties: Record<string, any>, required: string[] } {
  const shape = zodSchema.shape;
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(shape)) {
    const zodType = value as any;
    
    if (zodType._def.typeName === 'ZodEnum') {
      properties[key] = {
        type: "string",
        enum: zodType._def.values,
        description: zodType.description
      };
    } else if (zodType._def.typeName === 'ZodString') {
      properties[key] = {
        type: "string",
        description: zodType.description
      };
    } else if (zodType._def.typeName === 'ZodArray') {
      const innerType = zodType._def.type;
      if (innerType._def.typeName === 'ZodEnum') {
        properties[key] = {
          type: "array",
          items: {
            type: "string",
            enum: innerType._def.values
          },
          description: zodType.description
        };
      } else if (innerType._def.typeName === 'ZodString') {
        properties[key] = {
          type: "array",
          items: {
            type: "string"
          },
          description: zodType.description
        };
      } else if (innerType._def.typeName === 'ZodObject') {
        properties[key] = {
          type: "array",
          items: zodToJsonSchema(innerType),
          description: zodType.description
        };
      }
    } else if (zodType._def.typeName === 'ZodObject') {
      properties[key] = zodToJsonSchema(zodType);
    } else if (zodType._def.typeName === 'ZodDefault') {
      const innerType = zodType._def.innerType;
      if (innerType._def.typeName === 'ZodEnum') {
        properties[key] = {
          type: "string",
          enum: innerType._def.values,
          description: zodType.description
        };
      }
    }

    // Check if field is required (not optional and not default)
    if (zodType._def.typeName !== 'ZodOptional' && zodType._def.typeName !== 'ZodDefault') {
      required.push(key);
    }
  }

  return {
    type: "object",
    properties,
    required
  };
}

// Input schemas for tools
const GetDocumentationSchema = z.object({
  topic: z.enum([
    "basic-usage",
    "installation", 
    "plugins",
    "database",
    "client",
    "security",
    "oauth",
    "overview"
  ]).describe("The documentation topic to retrieve"),
  format: z.enum(["summary", "detailed", "code-examples"]).default("detailed").describe("Format of the response")
});

const GenerateAuthConfigSchema = z.object({
  database: z.enum(["sqlite", "postgresql", "mysql", "prisma", "drizzle"]).describe("Database type to use"),
  providers: z.array(z.enum(["email", "google", "github", "discord", "apple"])).describe("Authentication providers to enable"),
  plugins: z.array(z.enum(["twoFactor", "magicLink", "passkey", "organization", "username"])).optional().describe("Optional plugins to include"),
  framework: z.enum(["nextjs", "remix", "sveltekit", "nuxt", "hono", "express"]).optional().describe("Framework for handler setup")
});

const GenerateClientSetupSchema = z.object({
  framework: z.enum(["react", "vue", "svelte", "solid", "vanilla"]).describe("Frontend framework"),
  baseURL: z.string().optional().describe("Base URL for the auth server"),
  plugins: z.array(z.string()).optional().describe("Client-side plugins to include")
});

const DatabaseSchemaSchema = z.object({
  orm: z.enum(["prisma", "drizzle", "raw-sql"]).describe("ORM or database approach"),
  database: z.enum(["sqlite", "postgresql", "mysql"]).describe("Database type"),
  customFields: z.array(z.object({
    table: z.enum(["user", "session"]),
    field: z.string(),
    type: z.string(),
    required: z.boolean().default(false)
  })).optional().describe("Custom fields to add to core schema")
});

// MCP Server implementation
class BetterAuthMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "better-auth-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_better_auth_docs",
            description: "Retrieve Better Auth documentation on specific topics including setup, configuration, and usage examples",
            inputSchema: zodToJsonSchema(GetDocumentationSchema),
          },
          {
            name: "generate_auth_config", 
            description: "Generate Better Auth server configuration code based on database, providers, and plugins",
            inputSchema: zodToJsonSchema(GenerateAuthConfigSchema),
          },
          {
            name: "generate_client_setup",
            description: "Generate Better Auth client setup code for different frameworks",
            inputSchema: zodToJsonSchema(GenerateClientSetupSchema),
          },
          {
            name: "generate_database_schema",
            description: "Generate database schema for Better Auth including custom fields and extensions",
            inputSchema: zodToJsonSchema(DatabaseSchemaSchema),
          },
          {
            name: "get_auth_examples",
            description: "Get practical code examples for common Better Auth use cases and patterns",
            inputSchema: {
              type: "object",
              properties: {
                useCase: {
                  type: "string",
                  enum: [
                    "email-password-signup",
                    "social-login", 
                    "session-management",
                    "email-verification",
                    "password-reset",
                    "two-factor-auth",
                    "custom-hooks",
                    "middleware-setup"
                  ],
                  description: "The specific use case to get examples for"
                }
              },
              required: ["useCase"]
            },
          },
          {
            name: "troubleshoot_better_auth",
            description: "Get troubleshooting guidance for common Better Auth issues and error messages",
            inputSchema: {
              type: "object",
              properties: {
                issue: {
                  type: "string",
                  description: "Description of the issue or error message"
                },
                context: {
                  type: "string",
                  description: "Additional context about your setup"
                }
              },
              required: ["issue"]
            },
          }
        ] satisfies Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "get_better_auth_docs":
            return await this.getDocumentation(args);
          case "generate_auth_config":
            return await this.generateAuthConfig(args);
          case "generate_client_setup":
            return await this.generateClientSetup(args);
          case "generate_database_schema":
            return await this.generateDatabaseSchema(args);
          case "get_auth_examples":
            return await this.getAuthExamples(args);
          case "troubleshoot_better_auth":
            return await this.troubleshootIssue(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private async getDocumentation(args: any) {
    const { topic, format } = GetDocumentationSchema.parse(args);
    
    if (topic === "overview") {
      const overview = `# Better Auth Overview

Better Auth is a comprehensive, framework-agnostic authentication and authorization framework for TypeScript. It provides:

## Key Features
- 🔐 **Multiple Auth Methods**: Email/password, social providers, magic links, passkeys, and more
- 🔌 **Plugin Ecosystem**: 2FA, organizations, rate limiting, and custom plugins
- 🗄️ **Database Flexibility**: SQLite, PostgreSQL, MySQL, MongoDB with ORM support
- 🚀 **Framework Agnostic**: Works with Next.js, Remix, SvelteKit, Nuxt, and more
- 🛡️ **Security Built-in**: CSRF protection, rate limiting, secure sessions
- 📱 **Multi-session**: Support for multiple active sessions per user
- 🏢 **Enterprise Ready**: Organizations, SSO, and advanced auth flows

## Getting Started
1. Install: \`npm install better-auth\`
2. Configure your auth instance with database and providers
3. Set up API routes in your framework
4. Create client instance for your frontend
5. Start authenticating users!

Better Auth is designed to be the most comprehensive auth solution while remaining simple to use and extend.`;

      return {
        content: [{
          type: "text",
          text: overview
        }]
      };
    }

    const doc = BETTER_AUTH_DOCS[topic as keyof typeof BETTER_AUTH_DOCS];
    if (!doc) {
      throw new Error(`Documentation not found for topic: ${topic}`);
    }

    let response = `# ${doc.title}\n\n${doc.content}`;

    if (format === "code-examples" && 'examples' in doc) {
      response += "\n\n## Code Examples\n";
      for (const [key, example] of Object.entries(doc.examples)) {
        response += `\n### ${key}\n\`\`\`typescript\n${example}\n\`\`\`\n`;
      }
    }

    if (format === "detailed") {
      if ('steps' in doc) {
        response += "\n\n## Steps\n";
        doc.steps.forEach((step, i) => {
          response += `${i + 1}. ${step}\n`;
        });
      }
      
      if ('coreSchema' in doc) {
        response += "\n\n## Core Schema Tables\n";
        doc.coreSchema.forEach(table => {
          response += `- ${table}\n`;
        });
      }

      if ('frameworks' in doc) {
        response += "\n\n## Supported Frameworks\n";
        doc.frameworks.forEach(framework => {
          response += `- ${framework}\n`;
        });
      }

      if ('example' in doc) {
        response += "\n\n## Example\n```typescript\n" + doc.example + "\n```";
      }
    }

    return {
      content: [{
        type: "text",
        text: response
      }]
    };
  }

  private async generateAuthConfig(args: any) {
    const { database, providers, plugins = [], framework } = GenerateAuthConfigSchema.parse(args);

    let config = `import { betterAuth } from "better-auth";\n`;
    
    // Database imports
    const dbImports = {
      sqlite: 'import Database from "better-sqlite3";',
      postgresql: 'import { Pool } from "pg";',
      mysql: 'import { createPool } from "mysql2/promise";',
      prisma: 'import { prismaAdapter } from "better-auth/adapters/prisma";\nimport { PrismaClient } from "@prisma/client";',
      drizzle: 'import { drizzleAdapter } from "better-auth/adapters/drizzle";\nimport { db } from "./db";'
    };

    config += dbImports[database] + "\n";

    // Plugin imports
    if (plugins.length > 0) {
      const pluginImports = plugins.map(p => p).join(", ");
      config += `import { ${pluginImports} } from "better-auth/plugins";\n`;
    }

    config += "\n";

    // Database connection
    const dbConfigs = {
      sqlite: 'database: new Database("./sqlite.db"),',
      postgresql: `database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),`,
      mysql: `database: createPool({
        host: "localhost",
        user: "root", 
        password: "password",
        database: "database",
    }),`,
      prisma: `database: prismaAdapter(new PrismaClient(), {
        provider: "sqlite", // or "postgresql", "mysql"
    }),`,
      drizzle: `database: drizzleAdapter(db, {
        provider: "sqlite", // or "pg", "mysql"
    }),`
    };

    config += `export const auth = betterAuth({\n    ${dbConfigs[database]}\n`;

    // Authentication methods
    if (providers.includes("email")) {
      config += `    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },\n`;
    }

    if (providers.some(p => p !== "email")) {
      config += `    socialProviders: {\n`;
      providers.filter(p => p !== "email").forEach(provider => {
        const envVar = provider.toUpperCase();
        config += `        ${provider}: {
            clientId: process.env.${envVar}_CLIENT_ID!,
            clientSecret: process.env.${envVar}_CLIENT_SECRET!,
        },\n`;
      });
      config += `    },\n`;
    }

    // Plugins
    if (plugins.length > 0) {
      config += `    plugins: [\n`;
      plugins.forEach(plugin => {
        config += `        ${plugin}(),\n`;
      });
      config += `    ],\n`;
    }

    config += `});\n`;

    // Framework-specific handler
    if (framework) {
      config += `\n// API Route Handler for ${framework}\n`;
      const handlers = {
        nextjs: `// app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
export const { POST, GET } = toNextJsHandler(auth);`,
        remix: `// app/routes/api.auth.$.ts
export async function loader({ request }: LoaderFunctionArgs) {
    return auth.handler(request);
}
export async function action({ request }: ActionFunctionArgs) {
    return auth.handler(request);
}`,
        sveltekit: `// hooks.server.ts
import { svelteKitHandler } from "better-auth/svelte-kit";
export async function handle({ event, resolve }) {
    return svelteKitHandler({ event, resolve, auth });
}`,
        nuxt: `// server/api/auth/[...all].ts
export default defineEventHandler((event) => {
    return auth.handler(toWebRequest(event));
});`,
        hono: `app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));`,
        express: `app.all("/api/auth/*", toNodeHandler(auth));`
      };
      
      config += handlers[framework as keyof typeof handlers] || "";
    }

    return {
      content: [{
        type: "text", 
        text: config
      }]
    };
  }

  private async generateClientSetup(args: any) {
    const { framework, baseURL = "http://localhost:3000", plugins = [] } = GenerateClientSetupSchema.parse(args);

    let setup = `import { createAuthClient } from "better-auth/${framework}";\n`;
    
    if (plugins.length > 0) {
      setup += `import { ${plugins.join(", ")} } from "better-auth/client/plugins";\n`;
    }

    setup += `\nexport const authClient = createAuthClient({\n`;
    setup += `    baseURL: "${baseURL}",\n`;
    
    if (plugins.length > 0) {
      setup += `    plugins: [\n`;
      plugins.forEach(plugin => {
        setup += `        ${plugin}(),\n`;
      });
      setup += `    ],\n`;
    }
    
    setup += `});\n`;

    // Framework-specific usage examples
    const usageExamples = {
      react: `\n// Usage in React component
import { authClient } from "./auth-client";

export function LoginForm() {
    const { data: session, isPending } = authClient.useSession();
    
    const handleSignIn = async () => {
        await authClient.signIn.email({
            email: "user@example.com",
            password: "password123"
        });
    };
    
    if (isPending) return <div>Loading...</div>;
    if (session) return <div>Welcome {session.user.name}!</div>;
    
    return <button onClick={handleSignIn}>Sign In</button>;
}`,
      vue: `\n// Usage in Vue component
<script setup>
import { authClient } from "./auth-client";

const session = authClient.useSession();

const signIn = async () => {
    await authClient.signIn.email({
        email: "user@example.com", 
        password: "password123"
    });
};
</script>

<template>
    <div v-if="session.data">Welcome {{ session.data.user.name }}!</div>
    <button v-else @click="signIn">Sign In</button>
</template>`,
      svelte: `\n<!-- Usage in Svelte component -->
<script>
import { authClient } from "./auth-client";

const session = authClient.useSession();

async function signIn() {
    await authClient.signIn.email({
        email: "user@example.com",
        password: "password123" 
    });
}
</script>

{#if $session}
    <p>Welcome {$session.user.name}!</p>
{:else}
    <button on:click={signIn}>Sign In</button>
{/if}`,
      solid: `\n// Usage in Solid component
import { authClient } from "./auth-client";
import { Show } from "solid-js";

export default function App() {
    const session = authClient.useSession();
    
    const signIn = async () => {
        await authClient.signIn.email({
            email: "user@example.com",
            password: "password123"
        });
    };
    
    return (
        <Show when={session()} fallback={<button onClick={signIn}>Sign In</button>}>
            <p>Welcome {session()!.user.name}!</p>
        </Show>
    );
}`,
      vanilla: `\n// Usage in vanilla JavaScript
const session = await authClient.getSession();

if (session.data) {
    console.log("Welcome", session.data.user.name);
} else {
    await authClient.signIn.email({
        email: "user@example.com",
        password: "password123"
    });
}`
    };

    setup += usageExamples[framework as keyof typeof usageExamples] || "";

    return {
      content: [{
        type: "text",
        text: setup
      }]
    };
  }

  private async generateDatabaseSchema(args: any) {
    const { orm, database, customFields = [] } = DatabaseSchemaSchema.parse(args);

    let schema = "";

    if (orm === "prisma") {
      schema = `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${database === "postgresql" ? "postgresql" : database}"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  accounts      Account[]
`;

      customFields.filter(f => f.table === "user").forEach(field => {
        const nullable = field.required ? "" : "?";
        schema += `  ${field.field}       ${field.type}${nullable}\n`;
      });

      schema += `}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
`;

      customFields.filter(f => f.table === "session").forEach(field => {
        const nullable = field.required ? "" : "?";
        schema += `  ${field.field}    ${field.type}${nullable}\n`;
      });

      schema += `}

model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}`;

    } else if (orm === "drizzle") {
      const dbImport = database === "sqlite" ? "better-sqlite3" : 
                      database === "postgresql" ? "pg" : "mysql2";
      
      schema = `import { ${database === "sqlite" ? "sqliteTable, text, integer" : 
                          database === "postgresql" ? "pgTable, text, timestamp, boolean" : 
                          "mysqlTable, varchar, timestamp, boolean"} } from "drizzle-orm/${database === "sqlite" ? "sqlite-core" : 
                                                                                database === "postgresql" ? "pg-core" : "mysql-core"}";

export const user = ${database === "sqlite" ? "sqliteTable" : 
                     database === "postgresql" ? "pgTable" : "mysqlTable"}("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: ${database === "sqlite" ? "integer" : "boolean"}("emailVerified").default(false),
  image: text("image"),
  createdAt: ${database === "sqlite" ? "integer" : "timestamp"}("createdAt").defaultNow(),
  updatedAt: ${database === "sqlite" ? "integer" : "timestamp"}("updatedAt").defaultNow(),
`;

      customFields.filter(f => f.table === "user").forEach(field => {
        const nullable = field.required ? ".notNull()" : "";
        schema += `  ${field.field}: text("${field.field}")${nullable},\n`;
      });

      schema += `});

export const session = ${database === "sqlite" ? "sqliteTable" : 
                        database === "postgresql" ? "pgTable" : "mysqlTable"}("session", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: ${database === "sqlite" ? "integer" : "timestamp"}("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: ${database === "sqlite" ? "integer" : "timestamp"}("createdAt").defaultNow(),
  updatedAt: ${database === "sqlite" ? "integer" : "timestamp"}("updatedAt").defaultNow(),
`;

      customFields.filter(f => f.table === "session").forEach(field => {
        const nullable = field.required ? ".notNull()" : "";
        schema += `  ${field.field}: text("${field.field}")${nullable},\n`;
      });

      schema += `});`;

    } else {
      // Raw SQL
      const sqlType = database === "sqlite" ? "SQLite" : 
                     database === "postgresql" ? "PostgreSQL" : "MySQL";
      
      schema = `-- ${sqlType} Schema for Better Auth

CREATE TABLE user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    emailVerified BOOLEAN DEFAULT FALSE,
    image TEXT,
    createdAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP,
    updatedAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP`;

      customFields.filter(f => f.table === "user").forEach(field => {
        const nullable = field.required ? " NOT NULL" : "";
        schema += `,\n    ${field.field} TEXT${nullable}`;
      });

      schema += `
);

CREATE TABLE session (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expiresAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP,
    updatedAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP`;

      customFields.filter(f => f.table === "session").forEach(field => {
        const nullable = field.required ? " NOT NULL" : "";
        schema += `,\n    ${field.field} TEXT${nullable}`;
      });

      schema += `
);

CREATE TABLE account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    accessTokenExpiresAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"},
    refreshTokenExpiresAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"},
    scope TEXT,
    idToken TEXT,
    password TEXT,
    createdAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP,
    updatedAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} NOT NULL,
    createdAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP,
    updatedAt ${database === "sqlite" ? "INTEGER" : "TIMESTAMP"} DEFAULT CURRENT_TIMESTAMP
);`;
    }

    return {
      content: [{
        type: "text",
        text: schema
      }]
    };
  }

  private async getAuthExamples(args: any) {
    const { useCase } = args;

    const examples = {
      "email-password-signup": `// Complete email/password signup flow
import { authClient } from "@/lib/auth-client";

// Sign up new user
const { data, error } = await authClient.signUp.email({
    email: "user@example.com",
    password: "secure-password-123",
    name: "John Doe",
    callbackURL: "/dashboard"
}, {
    onSuccess: (ctx) => {
        console.log("User created:", ctx.data);
        // Redirect or show success message
    },
    onError: (ctx) => {
        console.error("Signup failed:", ctx.error.message);
        // Handle specific errors
        if (ctx.error.message === "User already exists") {
            // Handle existing user
        }
    }
});

// Sign in existing user
const { data: session, error: signInError } = await authClient.signIn.email({
    email: "user@example.com", 
    password: "secure-password-123",
    rememberMe: true
});`,

      "social-login": `// Social authentication with multiple providers
import { authClient } from "@/lib/auth-client";

// GitHub OAuth
await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
    errorCallbackURL: "/auth/error"
});

// Google OAuth with custom scopes
await authClient.signIn.social({
    provider: "google", 
    callbackURL: "/profile",
    newUserCallbackURL: "/welcome"
});

// Handle OAuth callback (if using custom implementation)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

if (code) {
    const { data } = await authClient.signIn.social({
        provider: "github",
        code,
        state
    });
}`,

      "session-management": `// Session management and user state
import { authClient } from "@/lib/auth-client";

// React hook for session
function UserProfile() {
    const { data: session, isPending, error, refetch } = authClient.useSession();
    
    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!session) return <div>Not authenticated</div>;
    
    return (
        <div>
            <h1>Welcome {session.user.name}!</h1>
            <p>Email: {session.user.email}</p>
            <button onClick={() => authClient.signOut()}>
                Sign Out
            </button>
        </div>
    );
}

// Manual session check
const { data: session } = await authClient.getSession();
if (session) {
    console.log("User is authenticated:", session.user);
} else {
    console.log("User is not authenticated");
}

// Update user profile
await authClient.updateUser({
    name: "New Name",
    image: "https://example.com/avatar.jpg"
});`,

      "email-verification": `// Email verification implementation
import { authClient } from "@/lib/auth-client";

// Server-side email verification setup
import { betterAuth } from "better-auth";
import { sendEmail } from "./email-service";

export const auth = betterAuth({
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }) => {
            await sendEmail({
                to: user.email,
                subject: "Verify your email address",
                html: \`
                    <h1>Verify Your Email</h1>
                    <p>Click the link below to verify your email:</p>
                    <a href="\${url}">Verify Email</a>
                    <p>Or use this token: \${token}</p>
                \`
            });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },
    emailAndPassword: {
        requireEmailVerification: true
    }
});

// Client-side verification handling
// Send verification email manually
await authClient.sendVerificationEmail({
    email: "user@example.com",
    callbackURL: "/dashboard"
});

// Verify with token
await authClient.verifyEmail({
    query: { token: "verification-token" }
});`,

      "password-reset": `// Password reset flow
import { authClient } from "@/lib/auth-client";

// Server setup for password reset emails
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                html: \`
                    <h1>Reset Password</h1>
                    <p>Click the link to reset your password:</p>
                    <a href="\${url}">Reset Password</a>
                    <p>This link expires in 15 minutes.</p>
                \`
            });
        }
    }
});

// Client-side password reset
// Request password reset
const { error } = await authClient.forgetPassword({
    email: "user@example.com",
    redirectTo: "/reset-password"
});

// Reset password with token
const { error: resetError } = await authClient.resetPassword({
    newPassword: "new-secure-password",
    token: "reset-token-from-email"
});

if (resetError) {
    console.error("Password reset failed:", resetError.message);
} else {
    console.log("Password reset successful!");
}`,

      "two-factor-auth": `// Two-Factor Authentication setup
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

// Server configuration
export const auth = betterAuth({
    plugins: [
        twoFactor({
            otpOptions: {
                async sendOTP({ user, otp }) {
                    await sendSMS(user.phone, \`Your code: \${otp}\`);
                }
            }
        })
    ]
});

// Client usage with twoFactorClient plugin
import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
    plugins: [
        twoFactorClient({
            twoFactorPage: "/two-factor"
        })
    ]
});

// Enable 2FA for user
const enable2FA = async () => {
    const { data } = await authClient.twoFactor.enable({
        password: "user-current-password"
    });
    
    // Show QR code for TOTP app
    console.log("Setup URI:", data.totpURI);
};

// Verify TOTP during login
const verifyTOTP = async () => {
    await authClient.twoFactor.verifyTOTP({
        code: "123456", // Code from authenticator app
        trustDevice: true // Remember this device
    });
};

// Generate backup codes
const { data } = await authClient.twoFactor.getBackupCodes();
console.log("Backup codes:", data.backupCodes);`,

      "custom-hooks": `// Custom authentication hooks and middleware
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";

export const auth = betterAuth({
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            // Log all auth attempts
            console.log(\`Auth attempt: \${ctx.path} from \${ctx.headers['x-forwarded-for']}\`);
            
            // Restrict signups to specific domains
            if (ctx.path === "/sign-up/email") {
                const email = ctx.body?.email;
                if (!email?.endsWith("@company.com")) {
                    throw new APIError("FORBIDDEN", {
                        message: "Only company emails allowed"
                    });
                }
            }
            
            // Add custom data to signup
            if (ctx.path === "/sign-up/email") {
                return {
                    context: {
                        ...ctx,
                        body: {
                            ...ctx.body,
                            role: "user", // Default role
                            department: ctx.headers['x-department'] || "general"
                        }
                    }
                };
            }
        }),
        
        after: createAuthMiddleware(async (ctx) => {
            // Send welcome email after successful signup
            if (ctx.path.startsWith("/sign-up") && ctx.context.newSession) {
                const user = ctx.context.newSession.user;
                await sendWelcomeEmail(user.email, user.name);
            }
            
            // Log successful authentications
            if (ctx.context.newSession) {
                await logUserActivity({
                    userId: ctx.context.newSession.userId,
                    action: "login",
                    timestamp: new Date(),
                    ipAddress: ctx.headers['x-forwarded-for']
                });
            }
        })
    },
    
    // Database hooks for additional processing
    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    // Add default preferences
                    return {
                        data: {
                            ...user,
                            preferences: JSON.stringify({
                                theme: "light",
                                notifications: true
                            })
                        }
                    };
                },
                after: async (user) => {
                    // Create user profile in external service
                    await createUserProfile(user.id, user.email);
                }
            }
        }
    }
});`,

      "middleware-setup": `// Middleware setup for different frameworks

// Next.js Middleware
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    
    // Protect admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
    
    // Redirect authenticated users away from auth pages
    if (request.nextUrl.pathname.startsWith("/auth")) {
        if (session?.user) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/auth/:path*", "/dashboard/:path*"]
};

// SvelteKit Hooks
// src/hooks.server.ts
import { auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export const handle = async ({ event, resolve }) => {
    // Add session to locals
    const session = await auth.api.getSession({
        headers: event.request.headers
    });
    
    event.locals.session = session;
    
    // Route protection
    if (event.url.pathname.startsWith("/admin")) {
        if (!session?.user || session.user.role !== "admin") {
            throw redirect(302, "/login");
        }
    }
    
    return await resolve(event);
};

// Remix Loader Protection
// app/utils/auth.server.ts
export async function requireAuth(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    
    if (!session?.user) {
        throw redirect("/login");
    }
    
    return session;
}

export async function requireAdmin(request: Request) {
    const session = await requireAuth(request);
    
    if (session.user.role !== "admin") {
        throw new Response("Forbidden", { status: 403 });
    }
    
    return session;
}

// Usage in routes
export async function loader({ request }: LoaderFunctionArgs) {
    const session = await requireAuth(request);
    return json({ user: session.user });
}`
    };

    const example = examples[useCase as keyof typeof examples];
    if (!example) {
      throw new Error(`Unknown use case: ${useCase}`);
    }

    return {
      content: [{
        type: "text",
        text: `# ${useCase.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Example\n\n${example}`
      }]
    };
  }

  private async troubleshootIssue(args: any) {
    const { issue, context = "" } = args;

    const commonIssues = [
      {
        keywords: ["database", "connection", "migrate", "table"],
        solution: `## Database Connection Issues

**Common causes:**
- Missing database tables - run \`npx @better-auth/cli migrate\` or \`npx @better-auth/cli generate\`
- Incorrect database URL or connection string
- Database adapter mismatch

**Solutions:**
1. Verify your DATABASE_URL environment variable
2. Ensure database is running and accessible
3. Run schema migration: \`npx @better-auth/cli migrate\`
4. Check adapter configuration matches your database type

**Example fix:**
\`\`\`typescript
// Ensure correct adapter
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg" // Match your database type
    })
});
\`\`\``
      },
      {
        keywords: ["cors", "cross-origin", "origin", "blocked"],
        solution: `## CORS Issues

**Common causes:**
- Frontend and backend on different domains/ports
- Missing trustedOrigins configuration
- Incorrect baseURL in client

**Solutions:**
\`\`\`typescript
// Server configuration
export const auth = betterAuth({
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:5173", 
        "https://yourdomain.com"
    ]
});

// Client configuration  
export const authClient = createAuthClient({
    baseURL: "http://localhost:3001" // Your API server URL
});
\`\`\``
      },
      {
        keywords: ["session", "token", "cookie", "expired"],
        solution: `## Session/Cookie Issues

**Common causes:**
- Session expired
- Cookie domain mismatch  
- Secure cookie settings in development
- Missing BETTER_AUTH_SECRET

**Solutions:**
1. Check environment variables:
\`\`\`env
BETTER_AUTH_SECRET=your-secret-key-32-chars-min
BETTER_AUTH_URL=http://localhost:3000
\`\`\`

2. Configure cookies properly:
\`\`\`typescript
export const auth = betterAuth({
    advanced: {
        useSecureCookies: false, // For development
        crossSubDomainCookies: {
            enabled: true,
            domain: "localhost" // For local development
        }
    }
});
\`\`\`

3. Check session configuration:
\`\`\`typescript
export const auth = betterAuth({
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // Update every day
    }
});
\`\`\``
      },
      {
        keywords: ["oauth", "social", "google", "github", "callback"],
        solution: `## OAuth Provider Issues

**Common causes:**
- Incorrect client ID/secret
- Wrong callback URL configuration
- Missing environment variables

**Solutions:**
1. Verify OAuth app configuration in provider dashboard
2. Set correct callback URL: \`https://yourdomain.com/api/auth/callback/[provider]\`
3. Environment variables:
\`\`\`env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
\`\`\`

4. Check provider configuration:
\`\`\`typescript
export const auth = betterAuth({
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    }
});
\`\`\``
      },
      {
        keywords: ["email", "verification", "smtp", "sending"],
        solution: `## Email Issues

**Common causes:**
- SMTP configuration problems
- Missing sendVerificationEmail implementation
- Email provider restrictions

**Solutions:**
1. Configure email sending:
\`\`\`typescript
export const auth = betterAuth({
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }) => {
            // Use your email service
            await sendEmail({
                to: user.email,
                subject: "Verify your email",
                html: \`<a href="\${url}">Verify Email</a>\`
            });
        },
        sendOnSignUp: true
    }
});
\`\`\`

2. Test with a service like Resend, SendGrid, or Nodemailer
3. Check spam folders
4. Verify domain configuration if using custom domain`
      },
      {
        keywords: ["plugin", "import", "module", "not found"],
        solution: `## Plugin Issues

**Common causes:**
- Incorrect plugin import
- Missing plugin installation
- Plugin configuration mismatch

**Solutions:**
1. Correct plugin imports:
\`\`\`typescript
// Server
import { twoFactor, organization } from "better-auth/plugins";

// Client  
import { twoFactorClient, organizationClient } from "better-auth/client/plugins";
\`\`\`

2. Ensure plugins are configured on both server and client
3. Run database migration after adding plugins: \`npx @better-auth/cli migrate\`
4. Check plugin documentation for specific setup requirements`
      }
    ];

    const lowerIssue = issue.toLowerCase();
    const matchedSolution = commonIssues.find(item => 
      item.keywords.some(keyword => lowerIssue.includes(keyword))
    );

    if (matchedSolution) {
      return {
        content: [{
          type: "text",
          text: `# Troubleshooting: ${issue}

${context ? `**Your context:** ${context}\n\n` : ""}${matchedSolution.solution}

## Additional Resources
- [Better Auth Documentation](https://better-auth.com/docs)
- [GitHub Issues](https://github.com/better-auth/better-auth/issues)
- [Discord Community](https://discord.gg/betterauth)`
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: `# Troubleshooting: ${issue}

${context ? `**Your context:** ${context}\n\n` : ""}I couldn't find a specific solution for this issue. Here are some general debugging steps:

## General Debugging Steps

1. **Check the Console/Logs**
   - Look for specific error messages in browser console or server logs
   - Enable debug mode if available

2. **Verify Environment Variables**
   - Ensure all required environment variables are set
   - Check .env file is loaded correctly

3. **Database Issues**
   - Run: \`npx @better-auth/cli migrate\`
   - Verify database connection and schema

4. **Configuration Check**
   - Compare your config with the documentation examples
   - Ensure client and server configurations match

5. **Version Compatibility**
   - Update to latest Better Auth version: \`npm update better-auth\`
   - Check changelog for breaking changes

## Get Help
- [GitHub Issues](https://github.com/better-auth/better-auth/issues) - Search existing issues or create new one
- [Discord Community](https://discord.gg/betterauth) - Get help from community
- [Documentation](https://better-auth.com/docs) - Comprehensive guides and references

**Please provide more details about:**
- Error messages (exact text)
- Your configuration code
- Framework and versions you're using
- Steps to reproduce the issue`
      }]
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Better Auth MCP Server running on stdio");
  }
}

// Start the server
const server = new BetterAuthMCPServer();
server.run().catch(console.error);