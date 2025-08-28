#!/usr/bin/env node

/**
 * MCP server for Better Auth references
 * This server provides tools to:
 * - List all available Better Auth plugins and features
 * - Get detailed information about specific plugins/features
 * - Get usage examples and configuration
 * - Search for Better Auth functionality by keyword
 * - Get integration guides for specific frameworks
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Interface for Better Auth feature information
 */
interface BetterAuthFeature {
  name: string;
  category: string;
  description: string;
  url: string;
  installation?: string;
  usage?: string;
  config?: Record<string, any>;
  examples?: BetterAuthExample[];
  isNew?: boolean;
}

/**
 * Interface for Better Auth example
 */
interface BetterAuthExample {
  title: string;
  code: string;
  description?: string;
  framework?: string;
}

/**
 * Interface for integration guide
 */
interface IntegrationGuide {
  name: string;
  framework: string;
  description: string;
  url: string;
  setup?: string;
  config?: Record<string, any>;
  examples?: BetterAuthExample[];
}

/**
 * BetterAuthServer class that handles all the Better Auth reference functionality
 */
class BetterAuthServer {
  private server: Server;
  private axiosInstance;
  private featureCache: Map<string, BetterAuthFeature> = new Map();
  private featuresListCache: BetterAuthFeature[] | null = null;
  private integrationCache: Map<string, IntegrationGuide> = new Map();
  private readonly BETTER_AUTH_DOCS_URL = "https://www.better-auth.com";
  private readonly BETTER_AUTH_GITHUB_URL = "https://github.com/better-auth/better-auth";

  // Better Auth categories and features mapping
  private readonly FEATURE_CATEGORIES = {
    authentication: [
      "email-password", "social-sign-on", "apple", "discord", "facebook", 
      "github", "google", "hugging-face", "kick", "microsoft", "slack", 
      "notion", "tiktok", "twitch", "twitter", "dropbox", "linear", 
      "linkedin", "gitlab", "reddit", "roblox", "spotify", "vk", "zoom"
    ],
    databases: [
      "mysql", "sqlite", "postgresql", "ms-sql", "drizzle", "prisma", "mongodb"
    ],
    integrations: [
      "astro", "remix", "next", "nuxt", "sveltekit", "solidstart", 
      "tanstack-start", "hono", "fastify", "express", "elysia", "nitro", "nestjs", "expo"
    ],
    plugins: [
      "two-factor", "username", "anonymous", "phone-number", "magic-link", 
      "email-otp", "passkey", "generic-oauth", "one-tap", "sign-in-with-ethereum",
      "admin", "api-key", "mcp", "organization", "enterprise", "oidc-provider", 
      "sso", "bearer", "captcha", "have-i-been-pwned", "multi-session", 
      "oauth-proxy", "one-time-token", "open-api", "jwt", "stripe", "polar", 
      "autumn-billing", "dodo-payments", "dub"
    ]
  };

  constructor() {
    this.server = new Server(
      {
        name: "better-auth-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BetterAuthMcpServer/0.1.0)",
      },
    });
    
    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Set up the tool handlers for the server
   */
  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "list_better_auth_features",
          description: "Get a list of all available Better Auth plugins and features organized by category",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Optional category filter: authentication, databases, integrations, or plugins",
                enum: ["authentication", "databases", "integrations", "plugins"],
              },
            },
            required: [],
          },
        },
        {
          name: "get_feature_details",
          description: "Get detailed information about a specific Better Auth plugin or feature",
          inputSchema: {
            type: "object",
            properties: {
              featureName: {
                type: "string",
                description: "Name of the Better Auth feature (e.g., \"two-factor\", \"github\", \"drizzle\")",
              },
            },
            required: ["featureName"],
          },
        },
        {
          name: "get_integration_guide",
          description: "Get integration guide for a specific framework or platform",
          inputSchema: {
            type: "object",
            properties: {
              framework: {
                type: "string",
                description: "Framework name (e.g., \"next\", \"remix\", \"astro\", \"expo\")",
              },
            },
            required: ["framework"],
          },
        },
        {
          name: "get_auth_examples",
          description: "Get usage examples and code snippets for Better Auth features",
          inputSchema: {
            type: "object",
            properties: {
              featureName: {
                type: "string",
                description: "Feature to get examples for (e.g., \"email-password\", \"github\", \"two-factor\")",
              },
              framework: {
                type: "string",
                description: "Optional framework filter for examples",
              },
            },
            required: ["featureName"],
          },
        },
        {
          name: "search_better_auth",
          description: "Search Better Auth documentation by keyword",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query to find relevant Better Auth features or documentation",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "get_llms_context",
          description: "Get Better Auth LLMs.txt content for comprehensive context",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "list_better_auth_features":
          return await this.handleListFeatures(request.params.arguments);
        case "get_feature_details":
          return await this.handleGetFeatureDetails(request.params.arguments);
        case "get_integration_guide":
          return await this.handleGetIntegrationGuide(request.params.arguments);
        case "get_auth_examples":
          return await this.handleGetAuthExamples(request.params.arguments);
        case "search_better_auth":
          return await this.handleSearchBetterAuth(request.params.arguments);
        case "get_llms_context":
          return await this.handleGetLlmsContext();
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  /**
   * Handle the list_better_auth_features tool request
   */
  private async handleListFeatures(args?: any) {
    try {
      if (!this.featuresListCache) {
        await this.loadFeaturesFromDocs();
      }
      
      let features = this.featuresListCache || [];
      
      // Filter by category if specified
      if (args?.category) {
        features = features.filter(feature => feature.category === args.category);
      }
      
      return this.createSuccessResponse({
        total: features.length,
        features: features,
        categories: Object.keys(this.FEATURE_CATEGORIES),
      });
    } catch (error) {
      this.handleAxiosError(error, "Failed to fetch Better Auth features");
    }
  }

  /**
   * Load features from Better Auth documentation
   */
  private async loadFeaturesFromDocs(): Promise<void> {
    const features: BetterAuthFeature[] = [];
    
    for (const [category, featureNames] of Object.entries(this.FEATURE_CATEGORIES)) {
      for (const featureName of featureNames) {
        try {
          const featureInfo = await this.fetchFeatureBasicInfo(featureName, category);
          features.push(featureInfo);
        } catch (error) {
          // Continue with other features if one fails
          console.error(`Failed to load feature ${featureName}:`, error);
        }
      }
    }
    
    this.featuresListCache = features;
  }

  /**
   * Fetch basic information about a feature
   */
  private async fetchFeatureBasicInfo(featureName: string, category: string): Promise<BetterAuthFeature> {
    let url = `${this.BETTER_AUTH_DOCS_URL}/docs`;
    
    // Construct URL based on category
    switch (category) {
      case "authentication":
        if (featureName === "email-password") {
          url += "/authentication/email-password";
        } else if (["apple", "discord", "facebook", "github", "google", "hugging-face", "kick", "microsoft", "slack", "notion", "tiktok", "twitch", "twitter", "dropbox", "linear", "linkedin", "gitlab", "reddit", "roblox", "spotify", "vk", "zoom"].includes(featureName)) {
          url += `/authentication/social/${featureName}`;
        } else {
          url += "/authentication/social-sign-on";
        }
        break;
      case "databases":
        url += `/databases/${featureName}`;
        break;
      case "integrations":
        url += `/integrations/${featureName}`;
        break;
      case "plugins":
        url += `/plugins/${featureName}`;
        break;
    }

    return {
      name: featureName,
      category,
      description: `Better Auth ${category} feature: ${featureName}`,
      url,
      isNew: ["notion", "tiktok", "sign-in-with-ethereum", "autumn-billing", "dodo-payments"].includes(featureName),
    };
  }

  /**
   * Handle the get_feature_details tool request
   */
  private async handleGetFeatureDetails(args: any) {
    const featureName = this.validateFeatureName(args);

    try {
      // Check cache first
      if (this.featureCache.has(featureName)) {
        return this.createSuccessResponse(this.featureCache.get(featureName));
      }

      // Fetch detailed feature information
      const featureInfo = await this.fetchFeatureDetails(featureName);
      
      // Save to cache
      this.featureCache.set(featureName, featureInfo);
      
      return this.createSuccessResponse(featureInfo);
    } catch (error) {
      this.handleAxiosError(error, `Feature "${featureName}"`);
    }
  }

  /**
   * Fetch detailed feature information
   */
  private async fetchFeatureDetails(featureName: string): Promise<BetterAuthFeature> {
    // Find the feature in our categories
    const category = this.findFeatureCategory(featureName);
    if (!category) {
      throw new McpError(ErrorCode.InvalidParams, `Unknown feature: ${featureName}`);
    }

    const basicInfo = await this.fetchFeatureBasicInfo(featureName, category);
    
    try {
      const response = await this.axiosInstance.get(basicInfo.url);
      const $ = cheerio.load(response.data);
      
      // Extract detailed information
      const description = this.extractDescription($);
      const installation = this.extractInstallation($);
      const usage = this.extractUsage($);
      const config = this.extractConfiguration($);
      const examples = this.extractExamples($);
      
      return {
        ...basicInfo,
        description: description || basicInfo.description,
        installation,
        usage,
        config,
        examples,
      };
    } catch (error) {
      // Return basic info if detailed fetch fails
      return basicInfo;
    }
  }

  /**
   * Find which category a feature belongs to
   */
  private findFeatureCategory(featureName: string): string | null {
    for (const [category, features] of Object.entries(this.FEATURE_CATEGORIES)) {
      if (features.includes(featureName)) {
        return category;
      }
    }
    return null;
  }

  /**
   * Handle the get_integration_guide tool request
   */
  private async handleGetIntegrationGuide(args: any) {
    const framework = this.validateFramework(args);

    try {
      // Check cache first
      if (this.integrationCache.has(framework)) {
        return this.createSuccessResponse(this.integrationCache.get(framework));
      }

      // Fetch integration guide
      const guide = await this.fetchIntegrationGuide(framework);
      
      // Save to cache
      this.integrationCache.set(framework, guide);
      
      return this.createSuccessResponse(guide);
    } catch (error) {
      this.handleAxiosError(error, `Integration guide for "${framework}"`);
    }
  }

  /**
   * Fetch integration guide for a specific framework
   */
  private async fetchIntegrationGuide(framework: string): Promise<IntegrationGuide> {
    const url = `${this.BETTER_AUTH_DOCS_URL}/docs/integrations/${framework}`;
    
    try {
      const response = await this.axiosInstance.get(url);
      const $ = cheerio.load(response.data);
      
      const title = $("h1").first().text().trim();
      const description = this.extractDescription($);
      const setup = this.extractSetup($);
      const config = this.extractConfiguration($);
      const examples = this.extractExamples($);
      
      return {
        name: title || framework,
        framework,
        description: description || `Better Auth integration guide for ${framework}`,
        url,
        setup,
        config,
        examples,
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Integration guide for "${framework}" not found`
      );
    }
  }

  /**
   * Handle the get_auth_examples tool request
   */
  private async handleGetAuthExamples(args: any) {
    const featureName = this.validateFeatureName(args);
    const framework = args?.framework;

    try {
      const examples = await this.fetchAuthExamples(featureName, framework);
      return this.createSuccessResponse({
        feature: featureName,
        framework: framework || "all",
        examples,
      });
    } catch (error) {
      this.handleAxiosError(error, `Examples for "${featureName}"`);
    }
  }

  /**
   * Fetch examples for a specific feature
   */
  private async fetchAuthExamples(featureName: string, framework?: string): Promise<BetterAuthExample[]> {
    const examples: BetterAuthExample[] = [];
    
    // Get feature details first
    const feature = await this.fetchFeatureDetails(featureName);
    
    if (feature.examples) {
      examples.push(...feature.examples);
    }
    
    // If framework specified, also get framework-specific examples
    if (framework) {
      try {
        const exampleUrl = `${this.BETTER_AUTH_DOCS_URL}/docs/examples/${framework}`;
        const response = await this.axiosInstance.get(exampleUrl);
        const $ = cheerio.load(response.data);
        
        const frameworkExamples = this.extractExamples($);
        examples.push(...frameworkExamples.map(ex => ({
          ...ex,
          framework,
        })));
      } catch (error) {
        // Continue if framework examples not found
      }
    }
    
    return examples;
  }

  /**
   * Handle the search_better_auth tool request
   */
  private async handleSearchBetterAuth(args: any) {
    const query = this.validateSearchQuery(args);

    try {
      await this.ensureFeaturesListLoaded();
      
      const results = this.searchFeaturesByQuery(query);
      
      return this.createSuccessResponse({
        query,
        results: results.slice(0, 10), // Limit to top 10 results
        total: results.length,
      });
    } catch (error) {
      this.handleAxiosError(error, "Search failed");
    }
  }

  /**
   * Handle the get_llms_context tool request
   */
  private async handleGetLlmsContext() {
    try {
      const response = await this.axiosInstance.get(`${this.BETTER_AUTH_DOCS_URL}/llms.txt`);
      
      return this.createSuccessResponse({
        source: "https://www.better-auth.com/llms.txt",
        content: response.data,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      this.handleAxiosError(error, "Failed to fetch Better Auth LLMs context");
    }
  }

  /**
   * Extract description from the page
   */
  private extractDescription($: cheerio.CheerioAPI): string {
    let description = "";
    
    // Try different selectors for description
    const descriptionElement = $("h1").first().next("p");
    if (descriptionElement.length > 0) {
      description = descriptionElement.text().trim();
    }
    
    // Alternative: look for intro paragraph
    if (!description) {
      const introParagraph = $("p").first();
      if (introParagraph.length > 0) {
        description = introParagraph.text().trim();
      }
    }
    
    return description;
  }

  /**
   * Extract installation instructions
   */
  private extractInstallation($: cheerio.CheerioAPI): string {
    let installation = "";
    
    const installSection = $("h2, h3").filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return text.includes("install") || text.includes("setup");
    });
    
    if (installSection.length > 0) {
      const codeBlock = installSection.nextAll("pre").first();
      if (codeBlock.length > 0) {
        installation = codeBlock.text().trim();
      }
    }
    
    return installation;
  }

  /**
   * Extract setup instructions
   */
  private extractSetup($: cheerio.CheerioAPI): string {
    let setup = "";
    
    const sections = ["Setup", "Getting Started", "Installation"];
    for (const sectionName of sections) {
      const section = $("h2, h3").filter((_, el) => $(el).text().trim() === sectionName);
      if (section.length > 0) {
        let content = "";
        let next = section.next();
        
        while (next.length > 0 && !next.is("h1, h2")) {
          if (next.is("pre")) {
            content += next.text().trim() + "\n\n";
          } else if (next.is("p")) {
            content += next.text().trim() + "\n\n";
          }
          next = next.next();
        }
        
        if (content) {
          setup = content.trim();
          break;
        }
      }
    }
    
    return setup;
  }

  /**
   * Extract usage examples
   */
  private extractUsage($: cheerio.CheerioAPI): string {
    let usage = "";
    
    const usageSection = $("h2, h3").filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return text.includes("usage") || text.includes("basic") || text.includes("example");
    });
    
    if (usageSection.length > 0) {
      const codeBlocks = usageSection.nextAll("pre");
      if (codeBlocks.length > 0) {
        codeBlocks.each((_, el) => {
          usage += $(el).text().trim() + "\n\n";
        });
      }
    }
    
    return usage.trim();
  }

  /**
   * Extract configuration options
   */
  private extractConfiguration($: cheerio.CheerioAPI): Record<string, any> {
    const config: Record<string, any> = {};
    
    // Look for configuration sections
    const configSection = $("h2, h3").filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return text.includes("config") || text.includes("option") || text.includes("setting");
    });
    
    if (configSection.length > 0) {
      // Extract configuration from code blocks
      const codeBlocks = configSection.nextAll("pre");
      codeBlocks.each((_, el) => {
        const code = $(el).text().trim();
        if (code.includes("{") && code.includes("}")) {
          try {
            // Try to extract configuration object
            const configMatch = code.match(/\{[\s\S]*\}/);
            if (configMatch) {
              config.example = configMatch[0];
            }
          } catch (error) {
            // Continue if parsing fails
          }
        }
      });
    }
    
    return config;
  }

  /**
   * Extract examples from the page
   */
  private extractExamples($: cheerio.CheerioAPI): BetterAuthExample[] {
    const examples: BetterAuthExample[] = [];
    
    // Find all code blocks with their preceding headings
    $("pre").each((i, el) => {
      const code = $(el).text().trim();
      if (code) {
        let title = `Example ${i + 1}`;
        let description = "";
        
        // Look for preceding heading
        let prev = $(el).prev();
        while (prev.length > 0 && !prev.is("h1, h2, h3, h4")) {
          prev = prev.prev();
        }
        
        if (prev.is("h2, h3, h4")) {
          title = prev.text().trim();
          description = `${title} implementation`;
        }
        
        examples.push({
          title,
          code,
          description,
        });
      }
    });
    
    return examples;
  }

  /**
   * Search features by query
   */
  private searchFeaturesByQuery(query: string): BetterAuthFeature[] {
    if (!this.featuresListCache) {
      return [];
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return this.featuresListCache.filter(feature => {
      const searchText = `${feature.name} ${feature.description} ${feature.category}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    }).sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.name.toLowerCase().includes(query.toLowerCase());
      const bExact = b.name.toLowerCase().includes(query.toLowerCase());
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return 0;
    });
  }

  /**
   * Validation helpers
   */
  private validateFeatureName(args: any): string {
    if (!args?.featureName || typeof args.featureName !== "string") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Feature name is required and must be a string"
      );
    }
    return args.featureName.toLowerCase();
  }

  private validateFramework(args: any): string {
    if (!args?.framework || typeof args.framework !== "string") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Framework name is required and must be a string"
      );
    }
    return args.framework.toLowerCase();
  }

  private validateSearchQuery(args: any): string {
    if (!args?.query || typeof args.query !== "string") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Search query is required and must be a string"
      );
    }
    return args.query.toLowerCase();
  }

  /**
   * Error handling helper
   */
  private handleAxiosError(error: unknown, context: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `${context} not found`
        );
      } else {
        throw new McpError(
          ErrorCode.InternalError,
          `${context}: ${error.message}`
        );
      }
    }
    throw error;
  }

  /**
   * Create standardized success response
   */
  private createSuccessResponse(data: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  /**
   * Ensure features list is loaded
   */
  private async ensureFeaturesListLoaded(): Promise<void> {
    if (!this.featuresListCache) {
      await this.loadFeaturesFromDocs();
    }
    
    if (!this.featuresListCache) {
      throw new McpError(
        ErrorCode.InternalError,
        "Failed to load Better Auth features list"
      );
    }
  }

  /**
   * Run the server
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Better Auth MCP server running on stdio");
  }
}

// Create and run the server
const server = new BetterAuthServer();
server.run().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});