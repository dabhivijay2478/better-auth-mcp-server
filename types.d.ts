/**
 * Better Auth MCP Server - TypeScript Definitions
 * Comprehensive type definitions for all public APIs, functions, and components
 */

// ============================================================================
// Core Server Types
// ============================================================================

export interface McpServerConfig {
  name: string;
  version: string;
}

export interface McpToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
}

// ============================================================================
// Documentation Types
// ============================================================================

export interface DocumentationCategory {
  key: string;
  name: string;
  description: string;
  urlCount: number;
}

export interface DocumentationCategoryDetails {
  category: string;
  name: string;
  description: string;
  urls: string[];
}

export interface DocumentationCategoriesResponse {
  categories: DocumentationCategory[];
}

// ============================================================================
// Authentication Provider Types
// ============================================================================

export type AuthProviderCategory = "basic" | "social";

export interface AuthProvider {
  key: string;
  name: string;
  description: string;
  category: AuthProviderCategory;
}

export interface AuthProviderConfig {
  provider: string;
  name: string;
  description: string;
  category: AuthProviderCategory;
  config: Record<string, any>;
  setupSteps: string[];
  requiredEnvVars: string[];
  docUrl: string;
}

export interface AuthProvidersResponse {
  providers: AuthProvider[];
}

// Specific provider configurations
export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessType: "offline";
  prompt: string;
}

export interface GitHubOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface EmailPasswordConfig {
  enabled: boolean;
  autoSignIn: boolean;
  requireEmailVerification: boolean;
  passwordMinLength: number;
  passwordMaxLength: number;
  sendResetPassword: boolean;
  resetPasswordTokenExpiresIn: number;
}

// ============================================================================
// Database Adapter Types
// ============================================================================

export interface DatabaseAdapter {
  key: string;
  name: string;
  description: string;
}

export interface DatabaseAdapterConfig {
  adapter: string;
  name: string;
  description: string;
  config: Record<string, any>;
  setupSteps: string[];
  requiredPackages: string[];
  migrationSupport: boolean;
  docUrl: string;
}

export interface DatabaseAdaptersResponse {
  adapters: DatabaseAdapter[];
}

// ============================================================================
// Plugin Types
// ============================================================================

export type PluginCategory = "security" | "session" | "organization" | "integration" | "authentication" | "oauth";

export interface Plugin {
  key: string;
  name: string;
  description: string;
  category: PluginCategory;
}

export interface PluginConfig {
  plugin: string;
  name: string;
  description: string;
  category: PluginCategory;
  config: Record<string, any>;
  setupSteps: string[];
  requiredPackages: string[];
  clientSetup?: boolean;
  docUrl: string;
}

export interface PluginsResponse {
  plugins: Plugin[];
}

// ============================================================================
// Configuration Generation Types
// ============================================================================

export interface GenerateAuthConfigInput {
  providers: string[];
  adapter: string;
  plugins: string[];
}

export interface GenerateAuthConfigResponse {
  config: string;
  providers: string[];
  adapter: string;
  plugins: string[];
  setupInstructions: string[];
  requiredPackages: string[];
  requiredEnvVars: string[];
}

export interface ValidateAuthSetupInput {
  config: string;
}

export interface ValidateAuthSetupResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

// ============================================================================
// Session Management Types
// ============================================================================

export interface SessionConfig {
  updateAge: number;
  expiresIn: number;
  secure: boolean;
  httpOnly: boolean;
}

export interface SessionManagementConfig {
  name: string;
  description: string;
  category: string;
  config: SessionConfig;
  setupSteps: string[];
  codeExample: string;
  clientUsage: string;
}

// ============================================================================
// Security Configuration Types
// ============================================================================

export interface EmailVerificationConfig {
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

export interface PasswordResetConfig {
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

// ============================================================================
// MCP Integration Types
// ============================================================================

export interface OIDCConfig {
  codeExpiresIn: number;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  defaultScope: string;
  scopes: string[];
}

export interface McpPluginConfig {
  name: string;
  description: string;
  category: string;
  config: {
    loginPage: string;
    oidcConfig: OIDCConfig;
  };
  setupSteps: string[];
  requiredPackages: string[];
  requiredEnvVars: string[];
  codeExample: string;
}

export interface McpSessionHandlerConfig {
  name: string;
  description: string;
  usage: string;
  codeExample: string;
  setupSteps: string[];
}

export interface OAuthDiscoveryMetadataConfig {
  name: string;
  description: string;
  route: string;
  codeExample: string;
  setupSteps: string[];
}

export interface McpSessionApiConfig {
  name: string;
  description: string;
  method: string;
  codeExample: string;
  setupSteps: string[];
}

// ============================================================================
// Additional Configuration Types
// ============================================================================

export interface MultiSessionPluginConfig {
  name: string;
  description: string;
  category: string;
  config: {
    enabled: boolean;
  };
  setupSteps: string[];
  codeExample: string;
  clientSetup: boolean;
}

export interface DatabaseTable {
  description: string;
  fields: string[];
}

export interface DatabaseSchemaInfo {
  name: string;
  description: string;
  tables: {
    user: DatabaseTable;
    session: DatabaseTable;
    account: DatabaseTable;
    verification: DatabaseTable;
  };
  setupSteps: string[];
  codeExample: string;
}

export interface HooksConfig {
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

// ============================================================================
// MCP Tool Input/Output Types
// ============================================================================

// Documentation Tools
export interface GetDocumentationCategoriesOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified DocumentationCategoriesResponse
  }>;
}

export interface GetDocumentationUrlsInput {
  category: string;
}

export interface GetDocumentationUrlsOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified DocumentationCategoryDetails
  }>;
}

// Authentication Provider Tools
export interface GetAllAuthProvidersOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified AuthProvidersResponse
  }>;
}

export interface GetAuthProviderConfigInput {
  provider_name: string;
}

export interface GetAuthProviderConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified AuthProviderConfig
  }>;
}

// Database Adapter Tools
export interface GetAllDatabaseAdaptersOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified DatabaseAdaptersResponse
  }>;
}

export interface GetDatabaseAdapterConfigInput {
  adapter_name: string;
}

export interface GetDatabaseAdapterConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified DatabaseAdapterConfig
  }>;
}

// Plugin Tools
export interface GetAllPluginsOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified PluginsResponse
  }>;
}

export interface GetPluginConfigInput {
  plugin_name: string;
}

export interface GetPluginConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified PluginConfig
  }>;
}

// Configuration Tools
export interface GenerateAuthConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified GenerateAuthConfigResponse
  }>;
}

export interface ValidateAuthSetupOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified ValidateAuthSetupResponse
  }>;
}

// Security Tools
export interface GetEmailVerificationConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified EmailVerificationConfig
  }>;
}

export interface GetPasswordResetConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified PasswordResetConfig
  }>;
}

export interface GetSessionManagementConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified SessionManagementConfig
  }>;
}

// MCP Integration Tools
export interface GetMcpPluginConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified McpPluginConfig
  }>;
}

export interface GetMcpSessionHandlerOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified McpSessionHandlerConfig
  }>;
}

export interface GetOAuthDiscoveryMetadataOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified OAuthDiscoveryMetadataConfig
  }>;
}

export interface GetMcpSessionApiOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified McpSessionApiConfig
  }>;
}

// Additional Tools
export interface GetMultiSessionPluginConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified MultiSessionPluginConfig
  }>;
}

export interface GetDatabaseSchemaInfoOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified DatabaseSchemaInfo
  }>;
}

export interface GetHooksConfigOutput extends McpToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON stringified HooksConfig
  }>;
}

// ============================================================================
// Server Functions
// ============================================================================

export declare function main(): Promise<void>;
export declare function initResources(server: any): Promise<void>;
export declare function initTools(server: any): Promise<void>;

// ============================================================================
// Tool Functions (for direct usage if needed)
// ============================================================================

export declare function get_documentation_categories(): Promise<GetDocumentationCategoriesOutput>;
export declare function get_documentation_urls(input: GetDocumentationUrlsInput): Promise<GetDocumentationUrlsOutput>;

export declare function get_all_auth_providers(): Promise<GetAllAuthProvidersOutput>;
export declare function get_auth_provider_config(input: GetAuthProviderConfigInput): Promise<GetAuthProviderConfigOutput>;

export declare function get_all_database_adapters(): Promise<GetAllDatabaseAdaptersOutput>;
export declare function get_database_adapter_config(input: GetDatabaseAdapterConfigInput): Promise<GetDatabaseAdapterConfigOutput>;

export declare function get_all_plugins(): Promise<GetAllPluginsOutput>;
export declare function get_plugin_config(input: GetPluginConfigInput): Promise<GetPluginConfigOutput>;

export declare function generate_auth_config(input: GenerateAuthConfigInput): Promise<GenerateAuthConfigOutput>;
export declare function validate_auth_setup(input: ValidateAuthSetupInput): Promise<ValidateAuthSetupOutput>;

export declare function get_email_verification_config(): Promise<GetEmailVerificationConfigOutput>;
export declare function get_password_reset_config(): Promise<GetPasswordResetConfigOutput>;
export declare function get_session_management_config(): Promise<GetSessionManagementConfigOutput>;

export declare function get_mcp_plugin_config(): Promise<GetMcpPluginConfigOutput>;
export declare function get_mcp_session_handler(): Promise<GetMcpSessionHandlerOutput>;
export declare function get_oauth_discovery_metadata(): Promise<GetOAuthDiscoveryMetadataOutput>;
export declare function get_mcp_session_api(): Promise<GetMcpSessionApiOutput>;

export declare function get_multi_session_plugin_config(): Promise<GetMultiSessionPluginConfigOutput>;
export declare function get_database_schema_info(): Promise<GetDatabaseSchemaInfoOutput>;
export declare function get_hooks_config(): Promise<GetHooksConfigOutput>;

// ============================================================================
// Constants and Enums
// ============================================================================

export const SERVER_NAME = "better-auth-comprehensive";
export const SERVER_VERSION = "4.0.0";

export enum AuthProviders {
  EMAIL_PASSWORD = "email_password",
  GOOGLE = "google",
  GITHUB = "github",
  FACEBOOK = "facebook",
  APPLE = "apple",
  DISCORD = "discord",
  TWITTER = "twitter",
  LINKEDIN = "linkedin",
  MICROSOFT = "microsoft",
  SPOTIFY = "spotify",
  SLACK = "slack",
  TWITCH = "twitch",
  TIKTOK = "tiktok",
  NOTION = "notion",
  LINEAR = "linear",
  GITLAB = "gitlab",
  DROPBOX = "dropbox",
  REDDIT = "reddit",
  ROBLOX = "roblox",
  VK = "vk",
  ZOOM = "zoom",
  HUGGINGFACE = "huggingface",
  KICK = "kick"
}

export enum DatabaseAdapters {
  POSTGRESQL = "postgresql",
  MYSQL = "mysql",
  SQLITE = "sqlite",
  MONGODB = "mongodb",
  DRIZZLE = "drizzle",
  PRISMA = "prisma"
}

export enum Plugins {
  MAGIC_LINK = "magic_link",
  PASSKEY = "passkey",
  EMAIL_OTP = "email_otp",
  TWO_FACTOR = "two_factor",
  CAPTCHA = "captcha",
  JWT = "jwt",
  MULTI_SESSION = "multi_session",
  ORGANIZATION = "organization",
  SSO = "sso",
  STRIPE = "stripe",
  MCP = "mcp",
  USERNAME = "username"
}

export enum DocumentationCategories {
  GETTING_STARTED = "getting_started",
  ADAPTERS = "adapters",
  AUTHENTICATION_PROVIDERS = "authentication_providers",
  CONCEPTS = "concepts",
  EXAMPLES = "examples",
  GUIDES = "guides",
  INTEGRATIONS = "integrations",
  PLUGINS = "plugins"
}

// ============================================================================
// Utility Types
// ============================================================================

export type ProviderKey = keyof typeof AuthProviders;
export type AdapterKey = keyof typeof DatabaseAdapters;
export type PluginKey = keyof typeof Plugins;
export type CategoryKey = keyof typeof DocumentationCategories;

export interface BetterAuthConfig {
  baseURL?: string;
  providers?: Partial<Record<ProviderKey, any>>;
  adapter?: AdapterKey;
  plugins?: PluginKey[];
  session?: Partial<SessionConfig>;
  emailVerification?: Partial<EmailVerificationConfig['config']>;
  hooks?: {
    before?: Function;
    after?: Function;
  };
}

// ============================================================================
// Error Types
// ============================================================================

export interface McpError {
  error: string;
  message: string;
  details?: any;
}

export class McpToolError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'McpToolError';
  }
}

// ============================================================================
// Export All Types
// ============================================================================

export * from './types';

declare global {
  namespace BetterAuthMcp {
    export {
      McpServerConfig,
      McpToolResponse,
      DocumentationCategory,
      DocumentationCategoryDetails,
      AuthProvider,
      AuthProviderConfig,
      DatabaseAdapter,
      DatabaseAdapterConfig,
      Plugin,
      PluginConfig,
      GenerateAuthConfigInput,
      GenerateAuthConfigResponse,
      ValidateAuthSetupInput,
      ValidateAuthSetupResponse,
      SessionManagementConfig,
      EmailVerificationConfig,
      PasswordResetConfig,
      McpPluginConfig,
      McpSessionHandlerConfig,
      OAuthDiscoveryMetadataConfig,
      McpSessionApiConfig,
      MultiSessionPluginConfig,
      DatabaseSchemaInfo,
      HooksConfig,
      BetterAuthConfig,
      McpError,
      McpToolError
    };
  }
}